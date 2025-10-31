-- ============================================================================
-- FIX TEAM_MEMBERS RLS ONLY
-- ============================================================================
-- Removes all policies from team_members and creates simple ones
-- ============================================================================

-- Drop ALL existing policies on team_members
DROP POLICY IF EXISTS "view_team_members" ON public.team_members;
DROP POLICY IF EXISTS "add_team_members" ON public.team_members;
DROP POLICY IF EXISTS "remove_team_members" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_delete_policy" ON public.team_members;

-- Drop any other policies that might exist
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'team_members' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.team_members';
    END LOOP;
END $$;

-- Create NEW simple policies

-- SELECT: Everyone can view team members
CREATE POLICY "team_members_select_all" ON public.team_members
  FOR SELECT USING (true);

-- INSERT: Authenticated users can add members
CREATE POLICY "team_members_insert_auth" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can only update their own membership
CREATE POLICY "team_members_update_own" ON public.team_members
  FOR UPDATE USING (user_id = auth.uid());

-- DELETE: Users can remove themselves
CREATE POLICY "team_members_delete_own" ON public.team_members
  FOR DELETE USING (user_id = auth.uid());

-- Verify
SELECT
    tablename,
    policyname,
    cmd,
    CASE WHEN qual IS NOT NULL THEN 'HAS USING' ELSE 'NO USING' END as using_clause,
    CASE WHEN with_check IS NOT NULL THEN 'HAS CHECK' ELSE 'NO CHECK' END as check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'team_members'
ORDER BY policyname;
