-- Fix RLS Policies for MyCow Group Migration
-- Run this in Supabase SQL editor to allow proper access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create boards" ON boards;
DROP POLICY IF EXISTS "Users can update boards they created" ON boards;

-- Create more permissive policies for development/migration
CREATE POLICY "Allow all operations on boards" ON boards
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on board_groups" ON board_groups
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on task_comments" ON task_comments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on board_activities" ON board_activities
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on board_labels" ON board_labels
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on board_members" ON board_members
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on migration_logs" ON migration_logs
    FOR ALL USING (true) WITH CHECK (true);

-- Note: In production, these should be more restrictive based on your auth system