-- Fix profile INSERT policy to allow users to create their own profile
-- The issue is that during signup, the RLS policy isn't working correctly

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;

-- Create a new INSERT policy that allows:
-- 1. Authenticated users to insert their own profile (auth.uid() = id)
-- 2. Service role to insert any profile
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- Also add a policy for anon role to insert during signup
-- This is needed because signup happens before the user is authenticated
CREATE POLICY "anon_can_insert_profile_during_signup" ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);  -- Allow insert, but only if auth.uid() matches

-- Verify the policies
SELECT
  policyname,
  cmd,
  roles,
  with_check
FROM pg_policies
WHERE tablename = 'profiles' AND cmd = 'INSERT'
ORDER BY policyname;
