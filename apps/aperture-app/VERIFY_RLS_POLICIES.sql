-- ============================================================================
-- RLS POLICY VERIFICATION SCRIPT
-- ============================================================================
-- This script verifies that RLS policies are working correctly
-- Run these queries while logged in as different users to test data isolation

-- ============================================================================
-- TEST 1: Verify Current User Profile
-- ============================================================================
-- This should return the current logged-in user's profile
SELECT
  id,
  email,
  full_name,
  organization_id,
  is_active
FROM public.profiles
WHERE id = auth.uid();

-- ============================================================================
-- TEST 2: Check User's Organizations
-- ============================================================================
-- Should only return organizations the user is a member of
SELECT
  o.id,
  o.name,
  o.slug,
  o.owner_id,
  om.role as my_role
FROM public.organizations o
LEFT JOIN public.organization_members om ON om.organization_id = o.id AND om.user_id = auth.uid()
WHERE om.user_id = auth.uid() OR o.owner_id = auth.uid();

-- ============================================================================
-- TEST 3: Check Organization Members Access
-- ============================================================================
-- Should only show members from user's current organization
SELECT
  om.id,
  om.organization_id,
  p.email,
  p.full_name,
  om.role,
  om.joined_at
FROM public.organization_members om
JOIN public.profiles p ON p.id = om.user_id
WHERE om.organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid());

-- ============================================================================
-- TEST 4: Check Teams Access
-- ============================================================================
-- Should only show teams from user's organization
SELECT
  t.id,
  t.name,
  t.description,
  t.organization_id,
  o.name as organization_name
FROM public.teams t
JOIN public.organizations o ON o.id = t.organization_id
WHERE t.organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid());

-- ============================================================================
-- TEST 5: Check Team Members Access
-- ============================================================================
-- Should only show team members from user's organization
SELECT
  tm.id,
  t.name as team_name,
  p.email,
  p.full_name,
  tm.role
FROM public.team_members tm
JOIN public.teams t ON t.id = tm.team_id
JOIN public.profiles p ON p.id = tm.user_id
WHERE t.organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid());

-- ============================================================================
-- TEST 6: Check User Roles
-- ============================================================================
-- Should show all roles assigned to the current user
SELECT
  ur.id,
  ur.role,
  ur.context_type,
  ur.context_id,
  ur.context_name,
  ur.is_active
FROM public.user_roles ur
WHERE ur.user_id = auth.uid() AND ur.is_active = true;

-- ============================================================================
-- TEST 7: Verify Admin Access (Ecosystem/Platform Admins Only)
-- ============================================================================
-- Ecosystem and Platform admins should see all organizations
-- Regular users should only see their own
SELECT
  o.id,
  o.name,
  o.slug,
  o.plan,
  COUNT(om.id) as member_count
FROM public.organizations o
LEFT JOIN public.organization_members om ON om.organization_id = o.id
GROUP BY o.id, o.name, o.slug, o.plan
ORDER BY o.name;

-- ============================================================================
-- TEST 8: Check Workspaces Access
-- ============================================================================
-- Should only show workspaces from user's organization (if workspace has org_id)
SELECT
  w.id,
  w.name,
  w.description,
  w.created_by,
  p.email as creator_email
FROM public.workspaces w
LEFT JOIN public.profiles p ON p.id = w.created_by;

-- ============================================================================
-- TEST 9: Check Boards Access
-- ============================================================================
-- Should only show boards from user's organization workspaces
SELECT
  b.id,
  b.title,
  b.workspace_id,
  w.name as workspace_name,
  b.created_by,
  p.email as creator_email
FROM public.boards b
JOIN public.workspaces w ON w.id = b.workspace_id
LEFT JOIN public.profiles p ON p.id = b.created_by;

-- ============================================================================
-- TEST 10: Check Tasks Access
-- ============================================================================
-- Should only show tasks from user's organization boards
SELECT
  t.id,
  t.title,
  t.status,
  t.priority,
  b.title as board_title,
  w.name as workspace_name
FROM public.tasks t
JOIN public.boards b ON b.id = t.board_id
JOIN public.workspaces w ON w.id = b.workspace_id
LIMIT 10;

-- ============================================================================
-- ADMIN-ONLY TESTS
-- ============================================================================

-- TEST 11: Platform Statistics (Ecosystem/Platform Admins Only)
-- ============================================================================
SELECT
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT o.id) as total_organizations,
  COUNT(DISTINCT t.id) as total_teams,
  COUNT(DISTINCT w.id) as total_workspaces,
  COUNT(DISTINCT b.id) as total_boards
FROM public.profiles p
CROSS JOIN public.organizations o
CROSS JOIN public.teams t
CROSS JOIN public.workspaces w
CROSS JOIN public.boards b;

-- TEST 12: All Users (Admin View)
-- ============================================================================
SELECT
  p.id,
  p.email,
  p.full_name,
  o.name as organization_name,
  p.is_active,
  p.created_at
FROM public.profiles p
LEFT JOIN public.organizations o ON o.id = p.organization_id
ORDER BY p.created_at DESC;

-- ============================================================================
-- VERIFICATION CHECKLIST
-- ============================================================================
--
-- Run these tests with different user accounts:
--
-- 1. Regular User (user1@test.com):
--    - Should only see data from their organization
--    - Cannot see other organizations' data
--    - Cannot access admin-only views
--
-- 2. Account Admin (organization owner/admin):
--    - Can see all data within their organization
--    - Can manage organization settings
--    - Cannot see other organizations
--
-- 3. Platform Admin (platform@test.com):
--    - Can see all data in missions-app
--    - Can access admin statistics
--    - Can view all organizations
--
-- 4. Ecosystem Admin (admin@test.com):
--    - Can see all data across all apps
--    - Full system access
--    - Can manage platform settings
--
-- ============================================================================
