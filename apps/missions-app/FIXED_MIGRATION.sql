-- ============================================================================
-- FIXED COMPLETE MIGRATION - COPY AND PASTE THIS ENTIRE FILE
-- Multi-tenant architecture with multiple roles per user
-- Replace YOUR_EMAIL@example.com with your actual email at the bottom
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- STEP 1: Create ORGANIZATIONS table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'business' CHECK (type IN ('business', 'personal', 'enterprise', 'non-profit')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  plan_limits JSONB DEFAULT '{
    "maxMembers": 10,
    "maxWorkspaces": 5,
    "maxBoards": 20,
    "maxStorage": 5368709120
  }'::jsonb,
  settings JSONB DEFAULT '{
    "allowPublicBoards": false,
    "requireTwoFactor": false,
    "allowGuestAccess": true
  }'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_personal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_is_active ON public.organizations(is_active);

-- ============================================================================
-- STEP 2: Update PROFILES table - Add organization and role columns
-- ============================================================================

-- Add organization reference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Add backup columns for admin flags (used by views and functions)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_ecosystem_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN DEFAULT false;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_ecosystem_admin ON public.profiles(is_ecosystem_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_platform_admin ON public.profiles(is_platform_admin);

-- ============================================================================
-- STEP 3: Create USER_ROLES table (multi-role support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Role type
  role TEXT NOT NULL CHECK (role IN (
    'ecosystem_admin',
    'platform_admin',
    'account_admin',
    'organization_member',
    'organization_viewer',
    'organization_guest'
  )),

  -- Context (what this role applies to)
  context_type TEXT NOT NULL CHECK (context_type IN ('ecosystem', 'platform', 'organization', 'workspace', 'board')),
  context_id UUID NULL,
  context_name TEXT,

  -- Metadata
  granted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_context ON public.user_roles(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active);

-- Create unique index that handles NULL context_id properly
-- Two separate indexes: one for when context_id IS NULL, one for when it's NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_unique_with_context
  ON public.user_roles(user_id, role, context_type, context_id)
  WHERE context_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_unique_without_context
  ON public.user_roles(user_id, role, context_type)
  WHERE context_id IS NULL;

-- ============================================================================
-- STEP 4: Create ORGANIZATION_MEMBERS table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),

  -- Permissions
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
CREATE INDEX IF NOT EXISTS idx_org_members_role ON public.organization_members(role);

-- ============================================================================
-- STEP 5: Update TEAMS table - Add organization reference
-- ============================================================================

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'department';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS parent_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Add constraints after columns exist
DO $$ BEGIN
  ALTER TABLE public.teams ADD CONSTRAINT teams_type_check CHECK (type IN ('department', 'project', 'cross-functional', 'external'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.teams ADD CONSTRAINT teams_visibility_check CHECK (visibility IN ('public', 'private', 'secret'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_teams_organization ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_parent ON public.teams(parent_team_id);

-- ============================================================================
-- STEP 6: Update TEAM_MEMBERS table
-- ============================================================================

ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS joined_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add constraint after column exists
DO $$ BEGIN
  ALTER TABLE public.team_members ADD CONSTRAINT team_members_role_check CHECK (role IN ('owner', 'admin', 'member', 'guest'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- STEP 7: Update WORKSPACES table - Add organization reference
-- ============================================================================

ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_workspaces_organization ON public.workspaces(organization_id);

-- ============================================================================
-- STEP 8: Create PLATFORM_SETTINGS table (for platform admins)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name TEXT NOT NULL DEFAULT 'missions-app',
  settings JSONB DEFAULT '{
    "maintenanceMode": false,
    "allowNewSignups": true,
    "requireEmailVerification": true
  }'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Insert default platform settings
INSERT INTO public.platform_settings (app_name)
VALUES ('missions-app')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 9: Create ECOSYSTEM_APPS table (for ecosystem admins)
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

-- Insert missions-app
INSERT INTO public.ecosystem_apps (app_name, display_name, description)
VALUES ('missions-app', 'Missions App', 'Project management and CRM workspace')
ON CONFLICT (app_name) DO NOTHING;

-- ============================================================================
-- STEP 10: Create helper functions
-- ============================================================================

-- Function to check if user has a specific role
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all roles for a user
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
    ur.context_name,
    ur.granted_at
  FROM public.user_roles ur
  WHERE ur.user_id = check_user_id
  AND ur.is_active = true
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  ORDER BY ur.granted_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync role flags (keeps is_ecosystem_admin and is_platform_admin updated)
CREATE OR REPLACE FUNCTION public.sync_user_role_flags()
RETURNS TRIGGER AS $$
DECLARE
  affected_user_id UUID;
BEGIN
  -- Determine which user_id to update
  IF TG_OP = 'DELETE' THEN
    affected_user_id := OLD.user_id;
  ELSE
    affected_user_id := NEW.user_id;
  END IF;

  -- Update ecosystem admin flag
  UPDATE public.profiles
  SET is_ecosystem_admin = EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = affected_user_id
    AND role = 'ecosystem_admin'
    AND is_active = true
  )
  WHERE id = affected_user_id;

  -- Update platform admin flag
  UPDATE public.profiles
  SET is_platform_admin = EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = affected_user_id
    AND role = 'platform_admin'
    AND is_active = true
  )
  WHERE id = affected_user_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync role flags
DROP TRIGGER IF EXISTS sync_role_flags ON public.user_roles;
CREATE TRIGGER sync_role_flags
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_flags();

-- ============================================================================
-- STEP 11: Create views for easy querying
-- ============================================================================

-- View: User with all their roles
CREATE OR REPLACE VIEW public.user_permissions AS
SELECT
  p.id as user_id,
  p.email,
  p.full_name,
  p.organization_id,
  p.is_ecosystem_admin,
  p.is_platform_admin,
  ARRAY_AGG(DISTINCT ur.role) FILTER (WHERE ur.role IS NOT NULL) as all_roles,
  ARRAY_AGG(DISTINCT ur.context_id) FILTER (
    WHERE ur.role = 'account_admin' AND ur.context_type = 'organization'
  ) as admin_of_organizations
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id AND ur.is_active = true
WHERE p.is_active = true
GROUP BY p.id, p.email, p.full_name, p.organization_id, p.is_ecosystem_admin, p.is_platform_admin;

-- ============================================================================
-- STEP 12: Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ecosystem_apps ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 13: Create RLS Policies
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "view_member_organizations" ON public.organizations;
DROP POLICY IF EXISTS "create_organizations" ON public.organizations;
DROP POLICY IF EXISTS "update_own_organizations" ON public.organizations;
DROP POLICY IF EXISTS "view_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_view_all_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_grant_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_revoke_roles" ON public.user_roles;
DROP POLICY IF EXISTS "view_org_members" ON public.organization_members;
DROP POLICY IF EXISTS "platform_admins_only" ON public.platform_settings;
DROP POLICY IF EXISTS "ecosystem_admins_only" ON public.ecosystem_apps;

-- Organizations: Users can view organizations they're members of
CREATE POLICY "view_member_organizations" ON public.organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
    OR owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Organizations: Members can create organizations
CREATE POLICY "create_organizations" ON public.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Organizations: Owners can update their organizations
CREATE POLICY "update_own_organizations" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- User roles: Users can view their own roles
CREATE POLICY "view_own_roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- User roles: Admins can view all roles
CREATE POLICY "admins_view_all_roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- User roles: Admins can grant roles
CREATE POLICY "admins_grant_roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- User roles: Admins can revoke roles
CREATE POLICY "admins_revoke_roles" ON public.user_roles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Organization members: View members of your organizations
CREATE POLICY "view_org_members" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Platform settings: Only platform admins can view/edit
CREATE POLICY "platform_admins_only" ON public.platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Ecosystem apps: Only ecosystem admins can manage
CREATE POLICY "ecosystem_admins_only" ON public.ecosystem_apps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_ecosystem_admin = true)
  );

-- ============================================================================
-- STEP 14: Grant permissions
-- ============================================================================

GRANT ALL ON public.organizations TO authenticated, service_role;
GRANT ALL ON public.user_roles TO authenticated, service_role;
GRANT ALL ON public.organization_members TO authenticated, service_role;
GRANT ALL ON public.platform_settings TO authenticated, service_role;
GRANT ALL ON public.ecosystem_apps TO authenticated, service_role;

-- ============================================================================
-- STEP 15: Make yourself all the admins!
-- REPLACE YOUR_EMAIL@example.com WITH YOUR ACTUAL EMAIL
-- ============================================================================

DO $$
DECLARE
  my_user_id UUID;
  my_org_id UUID;
BEGIN
  -- Get your user ID (REPLACE THE EMAIL!)
  SELECT id INTO my_user_id
  FROM public.profiles
  WHERE email = 'YOUR_EMAIL@example.com';

  IF my_user_id IS NULL THEN
    RAISE NOTICE 'User not found! Please replace YOUR_EMAIL@example.com with your actual email';
    RETURN;
  END IF;

  -- Create your personal organization
  INSERT INTO public.organizations (name, slug, owner_id, is_personal, type, plan)
  VALUES (
    'My Organization',
    'my-org-' || LEFT(my_user_id::TEXT, 8),
    my_user_id,
    true,
    'personal',
    'enterprise'
  )
  ON CONFLICT (slug) DO UPDATE SET owner_id = EXCLUDED.owner_id
  RETURNING id INTO my_org_id;

  -- Update your profile with organization
  UPDATE public.profiles
  SET
    organization_id = my_org_id,
    is_ecosystem_admin = true,
    is_platform_admin = true
  WHERE id = my_user_id;

  -- Grant ecosystem admin role
  INSERT INTO public.user_roles (user_id, role, context_type, context_name, granted_by)
  VALUES (my_user_id, 'ecosystem_admin', 'ecosystem', 'COW Ecosystem', my_user_id)
  ON CONFLICT DO NOTHING;

  -- Grant platform admin role
  INSERT INTO public.user_roles (user_id, role, context_type, context_name, granted_by)
  VALUES (my_user_id, 'platform_admin', 'platform', 'Missions App', my_user_id)
  ON CONFLICT DO NOTHING;

  -- Grant account admin role for your organization
  INSERT INTO public.user_roles (user_id, role, context_type, context_id, context_name, granted_by)
  VALUES (my_user_id, 'account_admin', 'organization', my_org_id, 'My Organization', my_user_id)
  ON CONFLICT DO NOTHING;

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
  VALUES (my_org_id, my_user_id, 'owner', true, true, true, true)
  ON CONFLICT (organization_id, user_id) DO UPDATE
  SET role = 'owner';

  RAISE NOTICE 'Success! You are now ecosystem admin, platform admin, and account admin!';
  RAISE NOTICE 'Your organization ID: %', my_org_id;
END $$;

-- ============================================================================
-- STEP 16: Verify your roles
-- ============================================================================

-- Run this after the migration to verify:
SELECT
  email,
  is_ecosystem_admin,
  is_platform_admin,
  organization_id
FROM public.profiles
WHERE email = 'YOUR_EMAIL@example.com';

-- Should show:
-- email: your@email.com
-- is_ecosystem_admin: true
-- is_platform_admin: true
-- organization_id: <your org ID>

-- View all your roles:
SELECT * FROM public.get_user_roles(
  (SELECT id FROM public.profiles WHERE email = 'YOUR_EMAIL@example.com')
);

-- Should show 3 roles:
-- 1. ecosystem_admin (ecosystem)
-- 2. platform_admin (platform)
-- 3. account_admin (organization, <your org ID>)

-- ============================================================================
-- DONE! You now have:
-- - Ecosystem Admin: Full control over all COW apps
-- - Platform Admin: Full control over Missions App
-- - Account Admin: Full control over your organization
-- ============================================================================
