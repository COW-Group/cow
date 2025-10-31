-- ============================================================================
-- SIMPLE FIX FOR TEAMS RLS INFINITE RECURSION
-- ============================================================================
-- This completely removes all RLS policies from teams and team_members
-- and creates simple, non-recursive policies
-- ============================================================================

-- Step 1: Drop ALL existing policies on teams
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'teams' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.teams';
    END LOOP;
END $$;

-- Step 2: Drop ALL existing policies on team_members
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'team_members' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.team_members';
    END LOOP;
END $$;

-- Step 3: Create SIMPLE policies for teams (no recursion)

-- Everyone can view all teams (for now - can be restricted later)
CREATE POLICY "teams_select_policy" ON public.teams
  FOR SELECT USING (true);

-- Authenticated users can insert teams
CREATE POLICY "teams_insert_policy" ON public.teams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update teams they own
CREATE POLICY "teams_update_policy" ON public.teams
  FOR UPDATE USING (owner_id = auth.uid());

-- Users can delete teams they own
CREATE POLICY "teams_delete_policy" ON public.teams
  FOR DELETE USING (owner_id = auth.uid());

-- Step 4: Create SIMPLE policies for team_members (no recursion)

-- Everyone can view team members
CREATE POLICY "team_members_select_policy" ON public.team_members
  FOR SELECT USING (true);

-- Authenticated users can insert team members
CREATE POLICY "team_members_insert_policy" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own membership
CREATE POLICY "team_members_update_policy" ON public.team_members
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own membership
CREATE POLICY "team_members_delete_policy" ON public.team_members
  FOR DELETE USING (user_id = auth.uid());

-- Step 5: Verify policies are created
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('teams', 'team_members')
ORDER BY tablename, policyname;
