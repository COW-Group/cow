-- Add category_id to financial_inflows
ALTER TABLE financial_inflows
ADD COLUMN category_id UUID REFERENCES vision_board_sections(id);

-- Add category_id, goal_vision_level, and goal_vision_item_id to financial_outflows
ALTER TABLE financial_outflows
ADD COLUMN category_id UUID REFERENCES vision_board_sections(id),
ADD COLUMN goal_vision_level TEXT,
ADD COLUMN goal_vision_item_id UUID;

-- Optional: Migrate existing 'category' string data to 'category_id' if possible
-- This would require a mapping from old category names to vision_board_sections IDs.
-- For now, we'll assume new entries will use category_id.
-- If you have existing data, you might need a more complex migration script here.

-- Drop the old 'category' column from financial_inflows
ALTER TABLE financial_inflows
DROP COLUMN category;

-- Drop the old 'category' column from financial_outflows
ALTER TABLE financial_outflows
DROP COLUMN category;

-- Add RLS policies for the new columns (assuming existing RLS on tables)
-- You might need to adjust your existing RLS policies to include these new columns
-- For example, ensuring users can only update/insert with their own user_id and valid foreign keys.
-- Example RLS for financial_inflows (assuming existing SELECT/INSERT/UPDATE/DELETE policies):
-- ALTER TABLE financial_inflows ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage their own financial inflows" ON financial_inflows
--   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Example RLS for financial_outflows (assuming existing SELECT/INSERT/UPDATE/DELETE policies):
-- ALTER TABLE financial_outflows ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can manage their own financial outflows" ON financial_outflows
--   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
