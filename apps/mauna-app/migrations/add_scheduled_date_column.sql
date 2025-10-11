-- Migration: Add scheduled_date column to steps table
-- This column stores the specific date when an activity (one-time step) is scheduled
-- Run this in your Supabase SQL editor

-- Add scheduled_date column to store the date when an activity is scheduled
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS scheduled_date DATE;

-- Add index for better query performance when filtering by date
CREATE INDEX IF NOT EXISTS idx_steps_scheduled_date ON steps(scheduled_date);

-- Add comment for documentation
COMMENT ON COLUMN steps.scheduled_date IS 'Scheduled date for activities (one-time steps). Format: YYYY-MM-DD. NULL for habits which use frequency instead.';
