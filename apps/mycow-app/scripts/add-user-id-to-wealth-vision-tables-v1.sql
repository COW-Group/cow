-- Add user_id column to hills table
ALTER TABLE hills
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing hills with a user_id (assuming a single user or a default user for existing data)
-- IMPORTANT: Adjust this UPDATE statement if you have multiple users or a specific user to assign existing data to.
-- For a multi-user setup, you might need a more sophisticated migration strategy.
UPDATE hills
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL after backfilling
ALTER TABLE hills
ALTER COLUMN user_id SET NOT NULL;

-- Add user_id column to terrains table
ALTER TABLE terrains
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing terrains
UPDATE terrains
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE terrains
ALTER COLUMN user_id SET NOT NULL;

-- Add user_id column to milestones table
ALTER TABLE milestones
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing milestones
UPDATE milestones
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE milestones
ALTER COLUMN user_id SET NOT NULL;

-- Add user_id column to tasks table
ALTER TABLE tasks
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing tasks
UPDATE tasks
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE tasks
ALTER COLUMN user_id SET NOT NULL;

-- Add user_id column to micro_tasks table
ALTER TABLE micro_tasks
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing micro_tasks
UPDATE micro_tasks
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL;

-- Make user_id NOT NULL
ALTER TABLE micro_tasks
ALTER COLUMN user_id SET NOT NULL;
