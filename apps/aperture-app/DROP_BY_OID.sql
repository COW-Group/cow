-- ============================================================================
-- DROP POLICIES BY OID (bypasses the recursion issue)
-- ============================================================================

-- First, get the table OID
DO $$
DECLARE
    table_oid oid;
    pol_record record;
BEGIN
    -- Get the OID of team_members table
    SELECT oid INTO table_oid
    FROM pg_class
    WHERE relname = 'team_members' AND relnamespace = 'public'::regnamespace;

    -- Drop all policies directly using OID
    FOR pol_record IN
        SELECT polname
        FROM pg_policy
        WHERE polrelid = table_oid
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.team_members', pol_record.polname);
        RAISE NOTICE 'Dropped policy: %', pol_record.polname;
    END LOOP;
END $$;

-- Verify all dropped
SELECT COUNT(*) as remaining_policies
FROM pg_policy
WHERE polrelid = 'public.team_members'::regclass;

-- Now create fresh simple policies
CREATE POLICY "tm_view" ON public.team_members
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "tm_add" ON public.team_members
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "tm_edit" ON public.team_members
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "tm_remove" ON public.team_members
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Verify success
SELECT polname, polcmd
FROM pg_policy
WHERE polrelid = 'public.team_members'::regclass
ORDER BY polname;
