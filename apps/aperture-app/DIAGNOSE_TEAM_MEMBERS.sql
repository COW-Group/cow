-- ============================================================================
-- DIAGNOSE TEAM_MEMBERS POLICIES
-- ============================================================================
-- Shows all policies and their definitions
-- ============================================================================

-- Show all policies on team_members
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'team_members'
ORDER BY policyname;

-- Show RLS status
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'team_members';
