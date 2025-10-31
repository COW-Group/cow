-- Add RLS policies for workspaces table to allow CRUD operations
-- This migration adds INSERT, UPDATE, and DELETE policies for workspaces

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view workspaces they have access to" ON workspaces;
DROP POLICY IF EXISTS "Users can insert workspaces in their organization" ON workspaces;
DROP POLICY IF EXISTS "Users can update workspaces in their organization" ON workspaces;
DROP POLICY IF EXISTS "Users can delete workspaces they created" ON workspaces;

-- SELECT policy: Users can view workspaces in their organization
CREATE POLICY "Users can view workspaces in their organization" ON workspaces
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );

-- INSERT policy: Users can create workspaces in their organization
CREATE POLICY "Users can insert workspaces in their organization" ON workspaces
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
        AND created_by = auth.uid()
    );

-- UPDATE policy: Users can update workspaces in their organization
CREATE POLICY "Users can update workspaces in their organization" ON workspaces
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    )
    WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM profiles
            WHERE id = auth.uid()
        )
    );

-- DELETE policy: Users can delete workspaces they created or if they're org admin
CREATE POLICY "Users can delete workspaces they created" ON workspaces
    FOR DELETE
    USING (
        created_by = auth.uid()
        OR organization_id IN (
            SELECT om.organization_id
            FROM organization_members om
            WHERE om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Ensure RLS is enabled on workspaces table
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
