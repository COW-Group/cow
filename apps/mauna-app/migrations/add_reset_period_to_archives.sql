-- Migration: Add reset_period_id to archives table
-- Links archived items to the reset period they were completed in

-- Add reset_period_id column
ALTER TABLE archives
ADD COLUMN IF NOT EXISTS reset_period_id UUID REFERENCES reset_periods(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_archives_reset_period ON archives(reset_period_id);

-- Add comment
COMMENT ON COLUMN archives.reset_period_id IS 'The reset period (week) in which this item was completed. Links archived items to their weekly context.';
