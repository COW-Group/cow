-- ============================================================================
-- NUCLEAR OPTION: Disable RLS, drop all policies, re-enable with new ones
-- ============================================================================

-- Step 1: Disable RLS
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies (this will work now that RLS is disabled)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'team_members' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.team_members';
    END LOOP;
END $$;

-- Verify no policies exist
SELECT COUNT(*) as remaining_policies
FROM pg_policies
WHERE tablename = 'team_members' AND schemaname = 'public';

-- Step 3: Re-enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Step 4: Create brand new simple policies

-- Allow all authenticated users to see team members
CREATE POLICY "tm_select" ON public.team_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow all authenticated users to insert team members
CREATE POLICY "tm_insert" ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own membership
CREATE POLICY "tm_update" ON public.team_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own membership
CREATE POLICY "tm_delete" ON public.team_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Step 5: Verify the new policies
SELECT
    policyname,
    cmd,
    roles,
    SUBSTRING(qual::text, 1, 50) as using_clause,
    SUBSTRING(with_check::text, 1, 50) as check_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'team_members'
ORDER BY policyname;
