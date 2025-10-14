-- Migration: Add actual_duration and session_start_time columns to steps table
-- Run this in your Supabase SQL editor

-- Add actual_duration column to store the actual time spent on a step (in milliseconds)
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS actual_duration BIGINT DEFAULT 0;

-- Add session_start_time column to store when the current timer session started (timestamp in milliseconds)
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS session_start_time BIGINT;

-- Add elapsed_time column to store elapsed time in current session (in milliseconds)
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS elapsed_time BIGINT DEFAULT 0;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_steps_actual_duration ON steps(actual_duration);

-- Add comments for documentation
COMMENT ON COLUMN steps.actual_duration IS 'Actual time spent on the step in milliseconds (not including breath sub-steps)';
COMMENT ON COLUMN steps.session_start_time IS 'Timestamp in milliseconds when the current focus timer session started';
COMMENT ON COLUMN steps.elapsed_time IS 'Elapsed time in current session in milliseconds';
