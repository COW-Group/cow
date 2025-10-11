-- Migration: Add start_date and end_date for habits
-- Allows habits to have defined start and end dates
-- Renames scheduled_date to start_date for consistency

-- Rename scheduled_date to start_date
ALTER TABLE steps
RENAME COLUMN scheduled_date TO start_date;

-- Add end_date column for habits
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Update index
DROP INDEX IF EXISTS idx_steps_scheduled_date;
CREATE INDEX IF NOT EXISTS idx_steps_start_date ON steps(start_date);
CREATE INDEX IF NOT EXISTS idx_steps_end_date ON steps(end_date);

-- Update comments
COMMENT ON COLUMN steps.start_date IS 'Start date for habits and scheduled date for activities. Format: YYYY-MM-DD.';
COMMENT ON COLUMN steps.end_date IS 'Optional end date for habits. NULL means habit is ongoing. Not used for activities.';
