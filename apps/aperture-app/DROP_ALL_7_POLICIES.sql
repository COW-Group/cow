-- ============================================================================
-- DROP ALL 7 POLICIES EXPLICITLY
-- ============================================================================

-- Drop old recursive policies
DROP POLICY IF EXISTS "add_team_members" ON public.team_members;
DROP POLICY IF EXISTS "remove_team_members" ON public.team_members;
DROP POLICY IF EXISTS "view_team_members" ON public.team_members;

-- Drop new policies (that didn't replace the old ones)
DROP POLICY IF EXISTS "team_members_delete_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_insert_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_select_policy" ON public.team_members;
DROP POLICY IF EXISTS "team_members_update_policy" ON public.team_members;

-- Verify all policies are gone
SELECT COUNT(*) as remaining_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'team_members';
-- Should return 0

-- Create 4 NEW simple policies with different names
CREATE POLICY "tm_view" ON public.team_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "tm_add" ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "tm_edit" ON public.team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "tm_remove" ON public.team_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Verify new policies are created
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'team_members'
ORDER BY policyname;
