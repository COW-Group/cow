-- ============================================================================
-- FIX TEAMS, STORAGE, AND PROFILE ISSUES
-- ============================================================================
-- This migration fixes:
-- 1. Teams table foreign key relationship
-- 2. Adds language column to profiles
-- 3. Storage bucket creation instructions
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: Ensure Teams table exists with proper structure
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'department' CHECK (type IN ('department', 'project', 'cross-functional', 'external')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'secret')),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  parent_team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_organization ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_parent ON public.teams(parent_team_id);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON public.teams(is_active);

-- ============================================================================
-- STEP 2: Ensure Team Members table exists with FOREIGN KEY to teams
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'team_member' CHECK (role IN ('team_owner', 'team_admin', 'team_member', 'team_guest')),
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(team_id, user_id)
);

-- Create indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON public.team_members(team_id, role);

-- ============================================================================
-- STEP 3: Add language column to profiles table
-- ============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- ============================================================================
-- STEP 4: Add timezone column to profiles table (commonly needed)
-- ============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- ============================================================================
-- STEP 5: Enable RLS on teams and team_members
-- ============================================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Create RLS Policies for Teams
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "view_org_teams" ON public.teams;
DROP POLICY IF EXISTS "create_org_teams" ON public.teams;
DROP POLICY IF EXISTS "update_own_teams" ON public.teams;
DROP POLICY IF EXISTS "delete_own_teams" ON public.teams;

-- Users can view teams in their organizations
CREATE POLICY "view_org_teams" ON public.teams
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Organization members can create teams
CREATE POLICY "create_org_teams" ON public.teams
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT om.organization_id FROM public.organization_members om
      WHERE om.user_id = auth.uid()
      AND om.can_create_workspaces = true
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Team owners can update their teams
CREATE POLICY "update_own_teams" ON public.teams
  FOR UPDATE USING (
    owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Team owners can delete their teams
CREATE POLICY "delete_own_teams" ON public.teams
  FOR DELETE USING (
    owner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- ============================================================================
-- STEP 7: Create RLS Policies for Team Members
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "view_team_members" ON public.team_members;
DROP POLICY IF EXISTS "add_team_members" ON public.team_members;
DROP POLICY IF EXISTS "remove_team_members" ON public.team_members;

-- Users can view team members of teams they belong to
CREATE POLICY "view_team_members" ON public.team_members
  FOR SELECT USING (
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Team owners/admins can add members
CREATE POLICY "add_team_members" ON public.team_members
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT tm.team_id FROM public.team_members tm
      WHERE tm.user_id = auth.uid()
      AND tm.role IN ('team_owner', 'team_admin')
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- Team owners/admins can remove members
CREATE POLICY "remove_team_members" ON public.team_members
  FOR DELETE USING (
    team_id IN (
      SELECT tm.team_id FROM public.team_members tm
      WHERE tm.user_id = auth.uid()
      AND tm.role IN ('team_owner', 'team_admin')
    )
    OR user_id = auth.uid() -- Users can remove themselves
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_ecosystem_admin = true OR is_platform_admin = true))
  );

-- ============================================================================
-- STEP 8: Grant permissions
-- ============================================================================

GRANT ALL ON public.teams TO authenticated, service_role;
GRANT ALL ON public.team_members TO authenticated, service_role;

-- ============================================================================
-- STEP 9: Verify foreign key relationship exists
-- ============================================================================

-- This query checks if the foreign key constraint exists
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'team_members'
  AND kcu.column_name = 'team_id';

-- Should return a row showing:
-- constraint_name | table_name   | column_name | foreign_table_name | foreign_column_name
-- team_members... | team_members | team_id     | teams              | id

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check teams table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'teams'
ORDER BY ordinal_position;

-- Check team_members table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'team_members'
ORDER BY ordinal_position;

-- Check profiles table has language column
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
AND column_name = 'language';

-- ============================================================================
-- STORAGE BUCKETS - MANUAL CREATION REQUIRED
-- ============================================================================

-- NOTE: Storage buckets CANNOT be created via SQL.
-- You must create them manually in Supabase Dashboard or via the API.

-- TO CREATE BUCKETS IN SUPABASE DASHBOARD:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "Create bucket"
-- 3. Create two buckets:

-- BUCKET 1: avatars
-- - Name: avatars
-- - Public: false (authenticated users only)
-- - File size limit: 2097152 (2MB)
-- - Allowed mime types: image/jpeg,image/png,image/webp

-- BUCKET 2: organization-logos
-- - Name: organization-logos
-- - Public: false (authenticated users only)
-- - File size limit: 5242880 (5MB)
-- - Allowed mime types: image/jpeg,image/png,image/svg+xml,image/webp

-- After creating the buckets, run the SETUP_STORAGE.sql script
-- to create the RLS policies for the storage buckets.

-- ============================================================================
-- CHECK IF STORAGE BUCKETS EXIST
-- ============================================================================

-- Run this to verify buckets are created:
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets
WHERE id IN ('avatars', 'organization-logos');

-- If this returns 0 rows, you need to create the buckets manually!

-- ============================================================================
-- DONE! Next steps:
-- 1. Create storage buckets manually in Supabase Dashboard (see above)
-- 2. Run SETUP_STORAGE.sql to create RLS policies for storage
-- 3. Test file upload functionality
-- ============================================================================
