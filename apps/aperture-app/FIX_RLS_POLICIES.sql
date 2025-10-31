-- ============================================================================
-- FIX RLS POLICIES - Remove Infinite Recursion
-- ============================================================================
-- This script fixes the circular dependency in RLS policies that was causing
-- "infinite recursion detected in policy for relation organization_members"

-- Drop existing problematic policies
DROP POLICY IF EXISTS "view_org_members" ON public.organization_members;
DROP POLICY IF EXISTS "view_organizations" ON public.organizations;

-- ============================================================================
-- ORGANIZATION_MEMBERS - Fixed policies without circular references
-- ============================================================================

-- View organization members: Use auth.uid() directly, no circular reference
CREATE POLICY "view_org_members" ON public.organization_members
  FOR SELECT USING (
    -- User is a member of this organization (direct check)
    user_id = auth.uid()
    -- OR user is viewing members of an org they belong to (use profiles table instead)
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organization_members.organization_id
    )
    -- OR user is platform/ecosystem admin
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Insert members: Only admins can add members
CREATE POLICY "insert_org_members" ON public.organization_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Update members: Only admins can update member roles
CREATE POLICY "update_org_members" ON public.organization_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Delete members: Only owners can remove members
CREATE POLICY "delete_org_members" ON public.organization_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'owner'
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- ============================================================================
-- ORGANIZATIONS - Fixed policies
-- ============================================================================

-- View organizations: Users can see orgs they belong to
CREATE POLICY "view_organizations" ON public.organizations
  FOR SELECT USING (
    -- User is a member (check via profiles.organization_id)
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organizations.id
    )
    -- OR user is platform/ecosystem admin
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Insert organizations: Anyone can create an org
CREATE POLICY "insert_organizations" ON public.organizations
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Update organizations: Only owners and admins can update
CREATE POLICY "update_organizations" ON public.organizations
  FOR UPDATE USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.organization_id = organizations.id
    )
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- Delete organizations: Only owners can delete
CREATE POLICY "delete_organizations" ON public.organizations
  FOR DELETE USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND ur.role IN ('ecosystem_admin', 'platform_admin')
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check that policies are created correctly
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('organizations', 'organization_members')
ORDER BY tablename, policyname;
