-- Create automatic profile creation trigger
-- This will automatically create a profile when a user signs up

-- Step 1: Create the function that creates a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, investor_type, accreditation_verified, kyc_status, metadata)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'individual',
    false,
    'not_started',
    '{}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Fix the INSERT policy to allow the trigger to work
-- The trigger runs as SECURITY DEFINER, so it bypasses RLS
-- But we still need a policy for manual inserts

DROP POLICY IF EXISTS "users_can_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "anon_can_insert_profile_during_signup" ON profiles;

-- Allow authenticated users to insert their own profile
CREATE POLICY "users_can_insert_own_profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 5: Create profile for existing user (if needed)
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.id IS NULL
  LOOP
    INSERT INTO public.profiles (id, email, full_name, investor_type, accreditation_verified, kyc_status, metadata)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'full_name', split_part(user_record.email, '@', 1)),
      'individual',
      false,
      'not_started',
      '{}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Created profile for user: %', user_record.email;
  END LOOP;
END $$;

-- Verify
SELECT
  u.id,
  u.email AS auth_email,
  p.email AS profile_email,
  p.full_name,
  CASE WHEN p.id IS NULL THEN '❌ Missing' ELSE '✅ Exists' END AS profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
