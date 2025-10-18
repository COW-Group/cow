-- ============================================================================
-- SEED DATA - Test Data for Development
-- ============================================================================
-- This script creates test data for the missions app
-- WARNING: This is for DEVELOPMENT only! Do not run in production!

-- ============================================================================
-- STEP 1: Create Test Users (via Supabase Auth)
-- ============================================================================
-- NOTE: You need to create users manually in Supabase Auth dashboard first
-- Or use the sign-up page. Then get their UUIDs and use them below.
-- For now, we'll use placeholder UUIDs that you should replace

-- Test Users to create in Supabase Auth:
-- 1. admin@test.com - Ecosystem Admin
-- 2. platform@test.com - Platform Admin
-- 3. user1@test.com - Regular user in Org 1
-- 4. user2@test.com - Regular user in Org 1
-- 5. user3@test.com - Regular user in Org 2

-- Replace these UUIDs with actual user IDs from Supabase Auth
-- After creating users via auth signup
DO $$
DECLARE
  admin_id UUID := '00000000-0000-0000-0000-000000000001'; -- Replace with actual UUID
  platform_id UUID := '00000000-0000-0000-0000-000000000002'; -- Replace with actual UUID
  user1_id UUID := '00000000-0000-0000-0000-000000000003'; -- Replace with actual UUID
  user2_id UUID := '00000000-0000-0000-0000-000000000004'; -- Replace with actual UUID
  user3_id UUID := '00000000-0000-0000-0000-000000000005'; -- Replace with actual UUID

  org1_id UUID;
  org2_id UUID;
  team1_id UUID;
  team2_id UUID;
  workspace1_id UUID;
  board1_id UUID;
BEGIN

  -- ============================================================================
  -- STEP 2: Create Test Profiles
  -- ============================================================================
  INSERT INTO public.profiles (id, email, full_name, avatar_url, is_active)
  VALUES
    (admin_id, 'admin@test.com', 'Admin User', NULL, true),
    (platform_id, 'platform@test.com', 'Platform Admin', NULL, true),
    (user1_id, 'user1@test.com', 'John Doe', NULL, true),
    (user2_id, 'user2@test.com', 'Jane Smith', NULL, true),
    (user3_id, 'user3@test.com', 'Bob Johnson', NULL, true)
  ON CONFLICT (id) DO NOTHING;

  -- ============================================================================
  -- STEP 3: Create Test Organizations
  -- ============================================================================
  INSERT INTO public.organizations (name, slug, description, owner_id, type, plan, is_active)
  VALUES
    ('Acme Corporation', 'acme-corp', 'Leading tech company', user1_id, 'business', 'professional', true),
    ('Startup Inc', 'startup-inc', 'Fast-growing startup', user3_id, 'business', 'starter', true)
  RETURNING id INTO org1_id, org2_id;

  -- Get the IDs
  SELECT id INTO org1_id FROM public.organizations WHERE slug = 'acme-corp';
  SELECT id INTO org2_id FROM public.organizations WHERE slug = 'startup-inc';

  -- ============================================================================
  -- STEP 4: Assign Ecosystem and Platform Admin Roles
  -- ============================================================================
  INSERT INTO public.user_roles (user_id, role, context_type, context_id, context_name, granted_by, is_active)
  VALUES
    (admin_id, 'ecosystem_admin', 'ecosystem', NULL, 'COW Ecosystem', admin_id, true),
    (platform_id, 'platform_admin', 'platform', NULL, 'Missions App', admin_id, true);

  -- ============================================================================
  -- STEP 5: Add Organization Members
  -- ============================================================================
  -- Acme Corporation members
  INSERT INTO public.organization_members (
    organization_id, user_id, role, can_invite_users, can_manage_billing,
    can_manage_settings, can_create_workspaces, invited_by
  ) VALUES
    (org1_id, user1_id, 'owner', true, true, true, true, NULL),
    (org1_id, user2_id, 'admin', true, true, true, true, user1_id),
    (org1_id, admin_id, 'admin', true, true, true, true, user1_id);

  -- Startup Inc members
  INSERT INTO public.organization_members (
    organization_id, user_id, role, can_invite_users, can_manage_billing,
    can_manage_settings, can_create_workspaces, invited_by
  ) VALUES
    (org2_id, user3_id, 'owner', true, true, true, true, NULL),
    (org2_id, platform_id, 'admin', true, true, true, true, user3_id);

  -- Update profiles with organization_id
  UPDATE public.profiles SET organization_id = org1_id WHERE id IN (user1_id, user2_id, admin_id);
  UPDATE public.profiles SET organization_id = org2_id WHERE id IN (user3_id, platform_id);

  -- ============================================================================
  -- STEP 6: Create Teams
  -- ============================================================================
  INSERT INTO public.teams (organization_id, name, description, owner_id, is_active)
  VALUES
    (org1_id, 'Engineering', 'Development team', user1_id, true),
    (org1_id, 'Product', 'Product management team', user1_id, true),
    (org2_id, 'Operations', 'Operations team', user3_id, true)
  RETURNING id INTO team1_id;

  -- Get team IDs
  SELECT id INTO team1_id FROM public.teams WHERE organization_id = org1_id AND name = 'Engineering';
  SELECT id INTO team2_id FROM public.teams WHERE organization_id = org1_id AND name = 'Product';

  -- ============================================================================
  -- STEP 7: Add Team Members
  -- ============================================================================
  INSERT INTO public.team_members (team_id, user_id, role, added_by)
  VALUES
    (team1_id, user1_id, 'team_owner', user1_id),
    (team1_id, user2_id, 'team_member', user1_id);

  INSERT INTO public.team_members (team_id, user_id, role, added_by)
  SELECT id, user1_id, 'team_owner', user1_id FROM public.teams WHERE name = 'Product' AND organization_id = org1_id;

  -- ============================================================================
  -- STEP 8: Create Workspaces
  -- ============================================================================
  INSERT INTO public.workspaces (name, description, created_by)
  VALUES
    ('Main Workspace', 'Primary workspace for Acme Corp', user1_id),
    ('Startup Workspace', 'Workspace for Startup Inc', user3_id)
  RETURNING id INTO workspace1_id;

  SELECT id INTO workspace1_id FROM public.workspaces WHERE name = 'Main Workspace';

  -- ============================================================================
  -- STEP 9: Create Sample Boards
  -- ============================================================================
  INSERT INTO public.boards (
    workspace_id, title, description, created_by, is_starred,
    column_order, available_columns, view_type
  ) VALUES
    (workspace1_id, 'Product Roadmap', 'Q1 2025 Product Roadmap', user1_id, true,
     ARRAY['task', 'status', 'priority', 'assignee', 'due_date'],
     ARRAY['task', 'status', 'priority', 'assignee', 'due_date', 'progress', 'tags'],
     'board'),
    (workspace1_id, 'Sprint Planning', 'Current sprint tasks', user1_id, false,
     ARRAY['task', 'status', 'assignee'],
     ARRAY['task', 'status', 'priority', 'assignee', 'due_date'],
     'board')
  RETURNING id INTO board1_id;

  SELECT id INTO board1_id FROM public.boards WHERE title = 'Product Roadmap';

  -- ============================================================================
  -- STEP 10: Create Board Groups
  -- ============================================================================
  INSERT INTO public.board_groups (board_id, title, color, position, is_collapsed)
  VALUES
    (board1_id, 'Backlog', '#808080', 0, false),
    (board1_id, 'In Progress', '#0073ea', 1, false),
    (board1_id, 'Done', '#00c875', 2, false);

  -- ============================================================================
  -- STEP 11: Create Sample Tasks
  -- ============================================================================
  INSERT INTO public.tasks (
    board_id, group_id, title, status, priority, assignee_ids, updated_by_user_id
  )
  SELECT
    b.id,
    bg.id,
    'Sample Task ' || bg.title,
    CASE bg.title
      WHEN 'Backlog' THEN 'Not Started'
      WHEN 'In Progress' THEN 'Working on it'
      WHEN 'Done' THEN 'Done'
    END,
    'Medium',
    ARRAY[user1_id],
    user1_id
  FROM public.boards b
  CROSS JOIN public.board_groups bg
  WHERE b.id = board1_id;

  -- ============================================================================
  -- STEP 12: Create Platform Settings
  -- ============================================================================
  INSERT INTO public.platform_settings (app_name, settings, stats)
  VALUES
    ('missions-app', '{"theme": "dark", "maintenance_mode": false}'::jsonb,
     '{"totalUsers": 5, "totalOrganizations": 2}'::jsonb)
  ON CONFLICT (app_name) DO NOTHING;

  -- ============================================================================
  -- STEP 13: Create Ecosystem Apps
  -- ============================================================================
  INSERT INTO public.ecosystem_apps (
    app_name, display_name, description, icon_url, is_active, version
  ) VALUES
    ('missions-app', 'Missions App', 'Project management and collaboration', NULL, true, '1.0.0'),
    ('admin-portal', 'Admin Portal', 'Platform administration', NULL, true, '1.0.0'),
    ('public-site', 'Public Website', 'Marketing and public site', NULL, true, '1.0.0')
  ON CONFLICT (app_name) DO NOTHING;

  RAISE NOTICE 'Seed data created successfully!';
  RAISE NOTICE 'Organization 1 ID: %', org1_id;
  RAISE NOTICE 'Organization 2 ID: %', org2_id;

END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the data was created correctly

-- Check users and profiles
SELECT id, email, full_name, organization_id FROM public.profiles ORDER BY email;

-- Check organizations
SELECT id, name, slug, owner_id, plan FROM public.organizations ORDER BY name;

-- Check organization members
SELECT
  o.name as organization,
  p.email as user_email,
  om.role
FROM public.organization_members om
JOIN public.organizations o ON o.id = om.organization_id
JOIN public.profiles p ON p.id = om.user_id
ORDER BY o.name, om.role;

-- Check user roles
SELECT
  p.email,
  ur.role,
  ur.context_type,
  ur.context_name
FROM public.user_roles ur
JOIN public.profiles p ON p.id = ur.user_id
WHERE ur.is_active = true
ORDER BY p.email;

-- Check teams
SELECT
  t.name as team_name,
  o.name as organization,
  COUNT(tm.id) as member_count
FROM public.teams t
JOIN public.organizations o ON o.id = t.organization_id
LEFT JOIN public.team_members tm ON tm.team_id = t.id
GROUP BY t.id, t.name, o.name
ORDER BY o.name, t.name;

-- Check workspaces and boards
SELECT
  w.name as workspace,
  COUNT(b.id) as board_count
FROM public.workspaces w
LEFT JOIN public.boards b ON b.workspace_id = w.id
GROUP BY w.id, w.name
ORDER BY w.name;
