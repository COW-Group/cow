-- Migration: Add hierarchy fields to archives table
-- Allows archives to preserve the full hierarchy path when items are completed

-- Add hierarchy parent ID columns
ALTER TABLE archives
ADD COLUMN IF NOT EXISTS parent_mountain_id UUID REFERENCES mountains(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS parent_hill_id UUID REFERENCES hills(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS parent_terrain_id UUID REFERENCES terrains(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS parent_length_id UUID REFERENCES lengths(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_archives_parent_mountain ON archives(parent_mountain_id);
CREATE INDEX IF NOT EXISTS idx_archives_parent_hill ON archives(parent_hill_id);
CREATE INDEX IF NOT EXISTS idx_archives_parent_terrain ON archives(parent_terrain_id);
CREATE INDEX IF NOT EXISTS idx_archives_parent_length ON archives(parent_length_id);

-- Add comments
COMMENT ON COLUMN archives.parent_mountain_id IS 'Parent Mountain (Hill in UI) for this archived item. NULL if item IS a Mountain or has no Mountain parent.';
COMMENT ON COLUMN archives.parent_hill_id IS 'Parent Hill (Terrain in UI) for this archived item. NULL if item IS a Hill or has no Hill parent.';
COMMENT ON COLUMN archives.parent_terrain_id IS 'Parent Terrain (Length in UI) for this archived item. NULL if item IS a Terrain or has no Terrain parent.';
COMMENT ON COLUMN archives.parent_length_id IS 'Parent Length (Step in UI) for this archived item. NULL if item IS a Length or has no Length parent.';
