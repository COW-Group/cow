-- Migration: Add Row-Level Security policies for breaths table
-- This allows users to manage breaths (subtasks) for their own steps
-- Run this in your Supabase SQL editor

-- Enable RLS on breaths table (if not already enabled)
ALTER TABLE breaths ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to INSERT breaths for their own steps
CREATE POLICY "Users can insert breaths for their own steps"
ON breaths
FOR INSERT
WITH CHECK (
  step_id IN (
    SELECT id FROM steps WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to SELECT breaths for their own steps
CREATE POLICY "Users can view breaths for their own steps"
ON breaths
FOR SELECT
USING (
  step_id IN (
    SELECT id FROM steps WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to UPDATE breaths for their own steps
CREATE POLICY "Users can update breaths for their own steps"
ON breaths
FOR UPDATE
USING (
  step_id IN (
    SELECT id FROM steps WHERE user_id = auth.uid()
  )
);

-- Policy: Allow users to DELETE breaths for their own steps
CREATE POLICY "Users can delete breaths for their own steps"
ON breaths
FOR DELETE
USING (
  step_id IN (
    SELECT id FROM steps WHERE user_id = auth.uid()
  )
);
