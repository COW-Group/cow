-- ============================================================================
-- DEEP DIAGNOSTICS - Check pg_policy directly
-- ============================================================================

-- Method 1: Check pg_policy catalog (lower level than pg_policies view)
SELECT
    polname as policy_name,
    polcmd as command,
    polpermissive as is_permissive,
    pg_get_expr(polqual, polrelid) as using_expr,
    pg_get_expr(polwithcheck, polrelid) as with_check_expr
FROM pg_policy
WHERE polrelid = 'public.team_members'::regclass
ORDER BY polname;

-- Method 2: Try to get the actual SQL that would recreate the policies
SELECT
    'DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON public.team_members;' as drop_statement
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'team_members';

-- Method 3: Check if there are any triggers that might be causing issues
SELECT
    tgname as trigger_name,
    tgenabled as is_enabled,
    pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgrelid = 'public.team_members'::regclass
  AND tgname NOT LIKE 'RI_%'; -- Exclude foreign key triggers
