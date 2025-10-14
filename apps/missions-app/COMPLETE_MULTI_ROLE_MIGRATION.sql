-- ============================================================================
-- COMPLETE MULTI-TENANT + MULTI-ROLE ARCHITECTURE FOR COW ECOSYSTEM
-- Users can have MULTIPLE roles simultaneously (e.g., ecosystem + platform + account admin)
-- Replace YOUR_EMAIL@example.com with your actual email before running
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- STEP 1: Create Organizations (Multi-tenant foundation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL,

  type TEXT NOT NULL DEFAULT 'business'
    CHECK (type IN ('business', 'personal', 'enterprise', 'non-profit')),

  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  plan_limits JSONB DEFAULT '{
    "max_users": 5,
    "max_workspaces": 3,
    "max_boards_per_workspace": 10
  }'::jsonb,

  settings JSONB DEFAULT '{
    "allow_public_signup": false,
    "require_email_verification": true
  }'::jsonb,

  is_active BOOLEAN NOT NULL DEFAULT true,
  is_personal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON public.organizations(is_active);

-- ============================================================================
-- STEP 2: Update Profiles - Remove single role constraint
-- ============================================================================

-- Remove old constraint if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Make user_type nullable (will be replaced by user_roles table)
ALTER TABLE public.profiles ALTER COLUMN user_type DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN user_type DROP DEFAULT;

-- Add organization reference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS primary_organization_id UUID;

-- These flags are just for quick lookups (actual roles in user_roles table)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_ecosystem_role BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_platform_role BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS app_access TEXT[] DEFAULT ARRAY['missions-app'];

CREATE INDEX IF NOT EXISTS idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_primary_org ON public.profiles(primary_organization_id);

-- ============================================================================
-- STEP 3: Create USER_ROLES table (Multiple roles per user)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Role type
  role TEXT NOT NULL CHECK (role IN (
    'ecosystem_admin',      -- Highest: All COW apps
    'platform_admin',       -- All of missions-app
    'account_admin',        -- Admin of specific organization
    'organization_member',  -- Member of organization
    'organization_viewer',  -- Viewer in organization
    'organization_guest'    -- Guest in organization
  )),

  -- Context: What does this role apply to?
  context_type TEXT NOT NULL CHECK (context_type IN (
    'ecosystem',    -- All apps
    'platform',     -- Specific app (missions-app)
    'organization', -- Specific organization
    'workspace',    -- Specific workspace
    'board'         -- Specific board
  )),
  context_id UUID, -- NULL for ecosystem/platform, UUID for organization/workspace/board

  -- Optional context name for readability
  context_name TEXT,

  -- Metadata
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Optional expiration date
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Ensure unique role per context
  UNIQUE(user_id, role, context_type, context_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_context ON public.user_roles(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = true;

-- ============================================================================
-- STEP 4: Create Organization Members
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'guest')),

  can_invite_users BOOLEAN NOT NULL DEFAULT false,
  can_manage_billing BOOLEAN NOT NULL DEFAULT false,
  can_manage_settings BOOLEAN NOT NULL DEFAULT false,
  can_create_workspaces BOOLEAN NOT NULL DEFAULT true,

  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,

  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.organization_members(organization_id, role);

-- ============================================================================
-- STEP 5: Link Workspaces to Organizations
-- ============================================================================

ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS organization_id UUID;
CREATE INDEX IF NOT EXISTS idx_workspaces_organization ON public.workspaces(organization_id);

-- ============================================================================
-- STEP 6: Platform Settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL DEFAULT 'missions-app',
  settings JSONB DEFAULT '{
    "maintenance_mode": false,
    "allow_new_organizations": true,
    "require_admin_approval": false
  }'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

INSERT INTO public.platform_settings (app_name) VALUES ('missions-app') ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 7: Ecosystem Apps
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ecosystem_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  version TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.ecosystem_apps (app_name, display_name, description) VALUES
  ('missions-app', 'Missions', 'Project management and collaboration'),
  ('cow-crm', 'COW CRM', 'Customer relationship management'),
  ('cow-analytics', 'COW Analytics', 'Business intelligence')
ON CONFLICT (app_name) DO NOTHING;

-- ============================================================================
-- STEP 8: Helper Functions for Role Management
-- ============================================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(
  check_user_id UUID,
  check_role TEXT,
  check_context_type TEXT DEFAULT NULL,
  check_context_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = check_user_id
    AND role = check_role
    AND (check_context_type IS NULL OR context_type = check_context_type)
    AND (check_context_id IS NULL OR context_id = check_context_id)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(check_user_id UUID)
RETURNS TABLE (
  role TEXT,
  context_type TEXT,
  context_id UUID,
  context_name TEXT,
  granted_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.role,
    ur.context_type,
    ur.context_id,
    COALESCE(
      ur.context_name,
      CASE
        WHEN ur.context_type = 'organization' THEN o.name
        WHEN ur.context_type = 'workspace' THEN w.name
        ELSE ur.context_type
      END
    ) as context_name,
    ur.granted_at
  FROM public.user_roles ur
  LEFT JOIN public.organizations o ON ur.context_id = o.id AND ur.context_type = 'organization'
  LEFT JOIN public.workspaces w ON ur.context_id = w.id AND ur.context_type = 'workspace'
  WHERE ur.user_id = check_user_id
  AND ur.is_active = true
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ORDER BY
    CASE ur.role
      WHEN 'ecosystem_admin' THEN 1
      WHEN 'platform_admin' THEN 2
      WHEN 'account_admin' THEN 3
      ELSE 4
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is admin of organization
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND organization_members.user_id = user_id
    AND role IN ('owner', 'admin')
  ) OR public.has_role(user_id, 'account_admin', 'organization', org_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to grant a role
CREATE OR REPLACE FUNCTION public.grant_role(
  target_user_id UUID,
  grant_role TEXT,
  grant_context_type TEXT,
  grant_context_id UUID DEFAULT NULL,
  grant_context_name TEXT DEFAULT NULL,
  granter_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_role_id UUID;
BEGIN
  INSERT INTO public.user_roles (
    user_id,
    role,
    context_type,
    context_id,
    context_name,
    granted_by
  ) VALUES (
    target_user_id,
    grant_role,
    grant_context_type,
    grant_context_id,
    grant_context_name,
    granter_user_id
  )
  ON CONFLICT (user_id, role, context_type, context_id)
  DO UPDATE SET is_active = true
  RETURNING id INTO new_role_id;

  -- Update profile flags for quick lookups
  IF grant_role = 'ecosystem_admin' THEN
    UPDATE public.profiles SET has_ecosystem_role = true WHERE id = target_user_id;
  ELSIF grant_role = 'platform_admin' THEN
    UPDATE public.profiles SET has_platform_role = true WHERE id = target_user_id;
  END IF;

  RETURN new_role_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke a role
CREATE OR REPLACE FUNCTION public.revoke_role(
  target_user_id UUID,
  revoke_role TEXT,
  revoke_context_type TEXT,
  revoke_context_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_roles
  SET is_active = false
  WHERE user_id = target_user_id
  AND role = revoke_role
  AND context_type = revoke_context_type
  AND (revoke_context_id IS NULL OR context_id = revoke_context_id);

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 9: Create Views for Easy Querying
-- ============================================================================

-- User permissions view
CREATE OR REPLACE VIEW public.user_permissions AS
SELECT
  p.id as user_id,
  p.email,
  p.full_name,
  p.organization_id,
  p.primary_organization_id,

  -- Quick role checks
  public.has_role(p.id, 'ecosystem_admin', 'ecosystem') as is_ecosystem_admin,
  public.has_role(p.id, 'platform_admin', 'platform') as is_platform_admin,

  -- All roles as array
  ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as all_roles,

  -- Organizations where user is admin
  ARRAY_AGG(DISTINCT ur.context_id) FILTER (
    WHERE ur.role = 'account_admin' AND ur.context_type = 'organization'
  ) as admin_of_organizations,

  -- Count of roles
  COUNT(DISTINCT ur.id) FILTER (WHERE ur.is_active = true) as role_count

FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id AND ur.is_active = true
WHERE p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.organization_id, p.primary_organization_id;

-- Organization stats view
CREATE OR REPLACE VIEW public.organization_stats AS
SELECT
  o.id as organization_id,
  o.name as organization_name,
  o.slug,
  o.type,
  o.plan,
  COUNT(DISTINCT om.user_id) as member_count,
  COUNT(DISTINCT w.id) as workspace_count,
  COUNT(DISTINCT b.id) as board_count,
  o.is_active,
  o.created_at
FROM public.organizations o
LEFT JOIN public.organization_members om ON om.organization_id = o.id
LEFT JOIN public.workspaces w ON w.organization_id = o.id
LEFT JOIN public.boards b ON b.workspace_id = w.id
GROUP BY o.id, o.name, o.slug, o.type, o.plan, o.is_active, o.created_at;

-- ============================================================================
-- STEP 10: Enable RLS
-- ============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_apps ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users view own organizations" ON public.organizations FOR SELECT
  USING (
    public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem') OR
    id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users create organizations" ON public.organizations FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners update organizations" ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid() OR public.is_organization_admin(id, auth.uid()));

-- Organization members policies
CREATE POLICY "View org members" ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins add members" ON public.organization_members FOR INSERT
  WITH CHECK (public.is_organization_admin(organization_id, auth.uid()));

-- User roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem') OR
    public.has_role(auth.uid(), 'platform_admin', 'platform')
  );

CREATE POLICY "Admins grant roles" ON public.user_roles FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem') OR
    public.has_role(auth.uid(), 'platform_admin', 'platform')
  );

CREATE POLICY "Admins revoke roles" ON public.user_roles FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem') OR
    public.has_role(auth.uid(), 'platform_admin', 'platform')
  );

-- Platform settings policies
CREATE POLICY "Platform admins manage settings" ON public.platform_settings FOR ALL
  USING (public.has_role(auth.uid(), 'platform_admin', 'platform'));

-- Ecosystem apps policies
CREATE POLICY "All view apps" ON public.ecosystem_apps FOR SELECT USING (is_active = true);
CREATE POLICY "Ecosystem admins manage apps" ON public.ecosystem_apps FOR ALL
  USING (public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem'));

-- Update workspace policies
DROP POLICY IF EXISTS "Users can view workspaces they have access to" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view organization workspaces" ON public.workspaces;

CREATE POLICY "Users view accessible workspaces" ON public.workspaces FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'platform_admin', 'platform') OR
    public.has_role(auth.uid(), 'ecosystem_admin', 'ecosystem')
  );

-- ============================================================================
-- STEP 11: Grant Permissions
-- ============================================================================

GRANT ALL ON public.organizations TO authenticated, service_role;
GRANT ALL ON public.organization_members TO authenticated, service_role;
GRANT ALL ON public.user_roles TO authenticated, service_role;
GRANT ALL ON public.platform_settings TO authenticated, service_role;
GRANT ALL ON public.ecosystem_apps TO authenticated, service_role;

-- ============================================================================
-- STEP 12: Set Up YOUR Admin Roles (CUSTOMIZE THIS!)
-- ============================================================================

DO $$
DECLARE
  my_user_id UUID;
  my_org_id UUID;
  my_email TEXT := 'YOUR_EMAIL@example.com'; -- <<<< CHANGE THIS!
BEGIN
  -- Get your user ID
  SELECT id INTO my_user_id FROM public.profiles WHERE email = my_email;

  IF my_user_id IS NULL THEN
    RAISE NOTICE 'User not found: %. Please update the email in this script.', my_email;
    RETURN;
  END IF;

  RAISE NOTICE 'Setting up admin roles for user: % (ID: %)', my_email, my_user_id;

  -- Create your organization if it doesn't exist
  INSERT INTO public.organizations (name, slug, owner_id, type, plan)
  VALUES ('My COW Organization', 'my-cow-org', my_user_id, 'business', 'enterprise')
  ON CONFLICT (slug) DO UPDATE SET owner_id = my_user_id
  RETURNING id INTO my_org_id;

  -- Update your profile
  UPDATE public.profiles
  SET
    organization_id = my_org_id,
    primary_organization_id = my_org_id,
    has_ecosystem_role = true,
    has_platform_role = true,
    app_access = ARRAY['missions-app', 'cow-crm', 'cow-analytics']
  WHERE id = my_user_id;

  -- GRANT ROLE 1: Ecosystem Admin (highest level)
  PERFORM public.grant_role(
    my_user_id,
    'ecosystem_admin',
    'ecosystem',
    NULL,
    'COW Ecosystem',
    my_user_id
  );

  -- GRANT ROLE 2: Platform Admin (missions-app)
  PERFORM public.grant_role(
    my_user_id,
    'platform_admin',
    'platform',
    NULL,
    'Missions App',
    my_user_id
  );

  -- GRANT ROLE 3: Account Admin (your organization)
  PERFORM public.grant_role(
    my_user_id,
    'account_admin',
    'organization',
    my_org_id,
    'My COW Organization',
    my_user_id
  );

  -- Add as organization member
  INSERT INTO public.organization_members (
    organization_id, user_id, role,
    can_invite_users, can_manage_billing, can_manage_settings, can_create_workspaces
  )
  VALUES (my_org_id, my_user_id, 'owner', true, true, true, true)
  ON CONFLICT (organization_id, user_id) DO UPDATE SET role = 'owner';

  RAISE NOTICE 'Successfully granted all admin roles!';
END $$;

-- ============================================================================
-- VERIFICATION: Check your roles
-- ============================================================================

-- View your permissions
SELECT
  email,
  is_ecosystem_admin,
  is_platform_admin,
  all_roles,
  role_count
FROM public.user_permissions
WHERE email = 'YOUR_EMAIL@example.com'; -- <<<< CHANGE THIS!

-- View detailed roles
SELECT * FROM public.get_user_roles(
  (SELECT id FROM public.profiles WHERE email = 'YOUR_EMAIL@example.com') -- <<<< CHANGE THIS!
);

-- ============================================================================
-- COMPLETE! You now have:
-- ============================================================================
-- ✅ Ecosystem Admin - Manage all COW apps
-- ✅ Platform Admin - Manage all of missions-app
-- ✅ Account Admin - Manage your organization
--
-- You can have ALL THREE roles simultaneously!
--
-- To grant additional users multiple roles, use:
-- SELECT public.grant_role(user_id, 'platform_admin', 'platform');
-- SELECT public.grant_role(user_id, 'account_admin', 'organization', org_id);
-- ============================================================================
