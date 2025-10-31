-- Fix Supabase RLS Infinite Recursion on profiles table
-- Execute this in Supabase SQL Editor

-- Step 1: Check existing policies (informational)
-- Run this first to see what policies exist
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Step 2: Drop all existing policies on profiles table
-- This removes any policies that might have infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Step 3: Create new, correct policies without infinite recursion

-- Policy 1: Users can read their own profile
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile (during signup)
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Service role can do everything (for admin operations)
-- This allows backend services to manage profiles
CREATE POLICY "service_role_all_profiles" ON profiles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Step 4: Verify RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Verify policies are working (informational)
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
