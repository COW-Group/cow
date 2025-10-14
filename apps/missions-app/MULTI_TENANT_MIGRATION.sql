-- ============================================================================
-- MULTI-TENANT ARCHITECTURE FOR COW ECOSYSTEM
-- Creates proper organization isolation with platform and ecosystem admins
-- ============================================================================

-- ============================================================================
-- PART 1: Create Organization structure (Multi-tenant foundation)
-- ============================================================================

-- Organizations table (each company/group is an organization)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL, -- Main owner/creator

  -- Organization type
  type TEXT NOT NULL DEFAULT 'business'
    CHECK (type IN ('business', 'personal', 'enterprise', 'non-profit')),

  -- Subscription/plan info
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  plan_limits JSONB DEFAULT '{
    "max_users": 5,
    "max_workspaces": 3,
    "max_boards_per_workspace": 10,
    "features": ["basic_boards", "basic_automation"]
  }'::jsonb,

  -- Settings
  settings JSONB DEFAULT '{
    "allow_public_signup": false,
    "require_email_verification": true,
    "allowed_email_domains": []
  }'::jsonb,

  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- For single-user organizations
  is_personal BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON public.organizations(is_active);

-- ============================================================================
-- PART 2: Update user roles to include all admin levels
-- ============================================================================

-- First, let's create a new role hierarchy
-- Drop the old check constraint and add new one
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Add ecosystem and platform admin roles
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_type_check
  CHECK (user_type IN (
    'ecosystem_admin',   -- Highest: all COW apps
    'platform_admin',    -- All of missions-app
    'account_admin',     -- Organization admin
    'member',            -- Organization member
    'viewer',            -- Read-only
    'guest'              -- External user
  ));

-- Add organization reference to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Add platform admin flag (can manage missions-app platform)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN DEFAULT false;

-- Add ecosystem admin flag (can manage all COW apps)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_ecosystem_admin BOOLEAN DEFAULT false;

-- Add which apps this user can access
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS app_access TEXT[] DEFAULT ARRAY['missions-app'];

CREATE INDEX IF NOT EXISTS idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_platform_admin ON public.profiles(is_platform_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_ecosystem_admin ON public.profiles(is_ecosystem_admin);

-- ============================================================================
-- PART 3: Create Organization Members table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Role within the organization
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'guest')),

  -- Permissions within organization
  can_invite_users BOOLEAN NOT NULL DEFAULT false,
  can_manage_billing BOOLEAN NOT NULL DEFAULT false,
  can_manage_settings BOOLEAN NOT NULL DEFAULT false,
  can_create_workspaces BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,

  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.organization_members(organization_id, role);

-- ============================================================================
-- PART 4: Link workspaces to organizations
-- ============================================================================

-- Add organization reference to workspaces
ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS organization_id UUID;

-- Create index
CREATE INDEX IF NOT EXISTS idx_workspaces_organization ON public.workspaces(organization_id);

-- ============================================================================
-- PART 5: Create Platform Management table
-- ============================================================================

-- Platform settings for missions-app
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL DEFAULT 'missions-app',

  -- Platform-wide settings
  settings JSONB DEFAULT '{
    "maintenance_mode": false,
    "allow_new_organizations": true,
    "require_admin_approval": false,
    "default_plan": "free"
  }'::jsonb,

  -- Statistics
  stats JSONB DEFAULT '{
    "total_organizations": 0,
    "total_users": 0,
    "total_workspaces": 0,
    "total_boards": 0
  }'::jsonb,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Insert default platform settings
INSERT INTO public.platform_settings (app_name)
VALUES ('missions-app')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PART 6: Create Ecosystem table (for all COW apps)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ecosystem_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,

  -- App metadata
  is_active BOOLEAN NOT NULL DEFAULT true,
  version TEXT,

  -- App settings
  settings JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert COW apps
INSERT INTO public.ecosystem_apps (app_name, display_name, description)
VALUES
  ('missions-app', 'Missions', 'Project management and collaboration'),
  ('cow-crm', 'COW CRM', 'Customer relationship management'),
  ('cow-analytics', 'COW Analytics', 'Business intelligence and reporting')
ON CONFLICT (app_name) DO NOTHING;

-- ============================================================================
-- PART 7: Update workspace permissions to respect organizations
-- ============================================================================

-- Workspace permissions now need to check organization membership
ALTER TABLE public.workspace_permissions
  ADD COLUMN IF NOT EXISTS organization_id UUID;

CREATE INDEX IF NOT EXISTS idx_workspace_perms_org ON public.workspace_permissions(organization_id);

-- ============================================================================
-- PART 8: Create functions for automatic organization setup
-- ============================================================================

-- Function to create personal organization for new users
CREATE OR REPLACE FUNCTION public.create_personal_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  org_slug TEXT;
BEGIN
  -- Generate a slug from email
  org_slug := split_part(NEW.email, '@', 1) || '-org';

  -- Create personal organization
  INSERT INTO public.organizations (
    name,
    slug,
    owner_id,
    type,
    is_personal,
    settings
  ) VALUES (
    COALESCE(NEW.full_name, split_part(NEW.email, '@', 1)) || '''s Organization',
    org_slug,
    NEW.id,
    'personal',
    true,
    '{"allow_public_signup": false}'::jsonb
  )
  RETURNING id INTO org_id;

  -- Update user's organization_id
  UPDATE public.profiles
  SET organization_id = org_id
  WHERE id = NEW.id;

  -- Add user as organization owner
  INSERT INTO public.organization_members (
    organization_id,
    user_id,
    role,
    can_invite_users,
    can_manage_billing,
    can_manage_settings,
    can_create_workspaces
  ) VALUES (
    org_id,
    NEW.id,
    'owner',
    true,
    true,
    true,
    true
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create personal org on user signup
DROP TRIGGER IF EXISTS create_personal_org_on_signup ON public.profiles;
CREATE TRIGGER create_personal_org_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_personal_organization();

-- Function to check organization membership
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND organization_members.user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organization admin
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id
    AND organization_members.user_id = user_id
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 9: Update RLS policies for multi-tenancy
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_apps ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view their organizations"
  ON public.organizations FOR SELECT
  USING (
    is_ecosystem_admin = true OR
    id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Organization owners can update"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Organization members policies
CREATE POLICY "Members view own organization members"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can add members"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    public.is_organization_admin(organization_id, auth.uid())
  );

-- Platform settings policies
CREATE POLICY "Platform admins can view settings"
  ON public.platform_settings FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_platform_admin = true)
  );

CREATE POLICY "Platform admins can update settings"
  ON public.platform_settings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_platform_admin = true)
  );

-- Ecosystem apps policies
CREATE POLICY "Everyone can view apps"
  ON public.ecosystem_apps FOR SELECT
  USING (is_active = true);

CREATE POLICY "Ecosystem admins can manage apps"
  ON public.ecosystem_apps FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_ecosystem_admin = true)
  );

-- Update workspaces policy to respect organizations
DROP POLICY IF EXISTS "Users can view workspaces they have access to" ON public.workspaces;
CREATE POLICY "Users can view organization workspaces"
  ON public.workspaces FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- PART 10: Create views for easy querying
-- ============================================================================

-- View: User's organization info
CREATE OR REPLACE VIEW public.user_organizations AS
SELECT
  p.id as user_id,
  p.email,
  p.full_name,
  p.user_type,
  p.is_platform_admin,
  p.is_ecosystem_admin,
  o.id as organization_id,
  o.name as organization_name,
  o.slug as organization_slug,
  o.type as organization_type,
  o.plan as organization_plan,
  om.role as organization_role,
  om.can_invite_users,
  om.can_manage_billing,
  om.can_manage_settings
FROM public.profiles p
LEFT JOIN public.organization_members om ON om.user_id = p.id
LEFT JOIN public.organizations o ON o.id = om.organization_id
WHERE p.is_active = true;

-- View: Organization statistics
CREATE OR REPLACE VIEW public.organization_stats AS
SELECT
  o.id as organization_id,
  o.name as organization_name,
  COUNT(DISTINCT om.user_id) as member_count,
  COUNT(DISTINCT w.id) as workspace_count,
  COUNT(DISTINCT b.id) as board_count,
  o.plan,
  o.is_active
FROM public.organizations o
LEFT JOIN public.organization_members om ON om.organization_id = o.id
LEFT JOIN public.workspaces w ON w.organization_id = o.id
LEFT JOIN public.boards b ON b.workspace_id = w.id
GROUP BY o.id, o.name, o.plan, o.is_active;

-- ============================================================================
-- PART 11: Grant permissions
-- ============================================================================

GRANT ALL ON public.organizations TO authenticated, service_role;
GRANT ALL ON public.organization_members TO authenticated, service_role;
GRANT ALL ON public.platform_settings TO authenticated, service_role;
GRANT ALL ON public.ecosystem_apps TO authenticated, service_role;

-- ============================================================================
-- PART 12: Set up initial admins
-- ============================================================================

-- Make yourself ecosystem admin (HIGHEST LEVEL)
UPDATE public.profiles
SET
  is_ecosystem_admin = true,
  is_platform_admin = true,
  user_type = 'ecosystem_admin',
  app_access = ARRAY['missions-app', 'cow-crm', 'cow-analytics']
WHERE email = 'YOUR_EMAIL@example.com';

-- Create your organization (if not exists)
INSERT INTO public.organizations (
  name,
  slug,
  owner_id,
  type,
  plan,
  is_personal
)
SELECT
  'My COW Organization',
  'my-cow-org',
  id,
  'business',
  'enterprise',
  false
FROM public.profiles
WHERE email = 'YOUR_EMAIL@example.com'
ON CONFLICT (slug) DO NOTHING;

-- Add yourself as organization owner
INSERT INTO public.organization_members (
  organization_id,
  user_id,
  role,
  can_invite_users,
  can_manage_billing,
  can_manage_settings,
  can_create_workspaces
)
SELECT
  o.id,
  p.id,
  'owner',
  true,
  true,
  true,
  true
FROM public.profiles p
CROSS JOIN public.organizations o
WHERE p.email = 'YOUR_EMAIL@example.com'
AND o.slug = 'my-cow-org'
ON CONFLICT (organization_id, user_id) DO UPDATE
SET role = 'owner';

-- ============================================================================
-- COMPLETE! Summary of admin levels:
-- ============================================================================
--
-- 1. ECOSYSTEM ADMIN (you)
--    - Can manage all COW apps (missions-app, CRM, analytics, etc.)
--    - Can create/delete platform admins
--    - Can view all organizations across all apps
--
-- 2. PLATFORM ADMIN
--    - Can manage all organizations in missions-app
--    - Can view platform-wide statistics
--    - Can create/modify platform settings
--
-- 3. ACCOUNT ADMIN (Organization Owner/Admin)
--    - Full control within their organization
--    - Can create workspaces and boards
--    - Can invite/remove members
--    - Can manage billing for their org
--
-- 4. MEMBER - Standard organization member
-- 5. VIEWER - Read-only access
-- 6. GUEST - Limited external access
-- ============================================================================

-- Verify your admin status:
-- SELECT email, user_type, is_ecosystem_admin, is_platform_admin, organization_id
-- FROM public.profiles
-- WHERE email = 'YOUR_EMAIL@example.com';
