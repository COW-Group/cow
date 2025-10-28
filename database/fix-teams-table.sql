-- Fix teams table to match our schema
-- The existing teams table uses owner_id, we need to align it

-- First, let's check if we should keep owner_id or switch to user_id
-- For now, let's add company_id and keep the existing structure

-- Add company_id if it doesn't exist
ALTER TABLE teams ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- If the table has owner_id but we need user_id, let's create a view or update references
-- For now, let's just update our policies to work with the existing structure

-- Drop the problematic policy
DROP POLICY IF EXISTS "Team members can view team" ON teams;

-- Create policy using owner_id (which exists) instead of user_id
CREATE POLICY "Team members can view team" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='teams' AND column_name='owner_id'
        ) AND auth.uid() = owner_id
    );

-- Also create a policy for company_id if it exists
DROP POLICY IF EXISTS "Team members can view their company teams" ON teams;
CREATE POLICY "Team members can view their company teams" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM teams t
            WHERE t.company_id IS NOT NULL
            AND t.company_id IN (
                SELECT company_id FROM teams WHERE owner_id = auth.uid()
            )
        )
    );

COMMENT ON TABLE teams IS 'Team/workspace members - uses owner_id for the primary user reference';
