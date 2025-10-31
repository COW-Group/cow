-- COMPLETE FIX for Supabase RLS Infinite Recursion on profiles table
-- Execute this entire script in Supabase SQL Editor

-- =============================================================================
-- STEP 1: DROP ALL EXISTING POLICIES (including the problematic ones)
-- =============================================================================

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow anon upsert on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to create profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to delete their profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
DROP POLICY IF EXISTS "service_role_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;

-- =============================================================================
-- STEP 2: CREATE NEW, SAFE POLICIES (no subqueries, no recursion)
-- =============================================================================

-- Policy 1: Users can read their own profile
CREATE POLICY "users_can_read_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile (during signup)
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Users can delete their own profile
CREATE POLICY "users_can_delete_own_profile" ON profiles
  FOR DELETE
  USING (auth.uid() = id);

-- =============================================================================
-- STEP 3: ADD ADMIN POLICIES (using metadata instead of profiles table query)
-- =============================================================================

-- For admin access, we'll use the user's JWT metadata instead of querying profiles
-- This avoids infinite recursion since we're not querying profiles table

-- Admin can view all profiles (checks JWT metadata for admin role)
CREATE POLICY "admin_can_read_all_profiles" ON profiles
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() ->> 'user_role' = 'admin'
    OR auth.uid() = id
  );

-- Admin can update all profiles
CREATE POLICY "admin_can_update_all_profiles" ON profiles
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() ->> 'user_role' = 'admin'
    OR auth.uid() = id
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR auth.jwt() ->> 'user_role' = 'admin'
    OR auth.uid() = id
  );

-- =============================================================================
-- STEP 4: ENSURE RLS IS ENABLED
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 5: VERIFY THE FIX (run this to confirm no infinite recursion)
-- =============================================================================

-- This should now work without errors:
SELECT id, email, full_name, created_at
FROM profiles
LIMIT 5;

-- Check the new policies:
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
