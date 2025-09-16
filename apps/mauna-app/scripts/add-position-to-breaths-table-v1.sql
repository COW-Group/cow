-- Add position column to the breaths table
ALTER TABLE public.breaths
ADD COLUMN position INTEGER DEFAULT 0;

-- Update existing rows to have a default position based on created_at
-- This ensures existing breaths have an initial order
WITH ordered_breaths AS (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY step_id ORDER BY created_at) - 1 AS new_position
    FROM
        public.breaths
)
UPDATE public.breaths AS b
SET
    position = ob.new_position
FROM
    ordered_breaths AS ob
WHERE
    b.id = ob.id AND b.position IS NULL;

-- Create an index for faster ordering by position
CREATE INDEX IF NOT EXISTS idx_breaths_step_id_position ON public.breaths (step_id, position);
