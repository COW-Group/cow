-- Add birthday column to users table
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS birthday DATE;

-- Add RLS policy for users to update their own birthday
CREATE POLICY "Users can update their own birthday" ON auth.users
FOR UPDATE USING (auth.uid() = id);
