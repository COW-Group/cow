-- Simple MyCow Monday.com Migration
-- This creates basic sample data for testing

-- Create the main MyCow Group workspace
INSERT INTO workspaces (name, description, created_by)
VALUES
  ('🐮 MyCow Group', 'Main MyCow workspace - Everything C.O.W.', '00000000-0000-0000-0000-000000000000'::UUID)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create department boards within MyCow Group workspace
WITH main_workspace AS (
  SELECT id FROM workspaces WHERE name = '🐮 MyCow Group' LIMIT 1
)
INSERT INTO boards (title, description, workspace_id, created_by, monday_board_id)
SELECT
  board_data.title,
  board_data.description,
  main_workspace.id,
  '00000000-0000-0000-0000-000000000000'::UUID,
  board_data.monday_id
FROM main_workspace,
(VALUES
  ('Q1 Strategic Missions', 'Key Q1 objectives and strategic initiatives', '8198396724'),
  ('FIN - Finance', 'Finance department boards and processes', 'fin-folder'),
  ('TECH - Technology', 'Technology department projects and systems', 'tech-folder'),
  ('SALE - Sales', 'Sales processes and customer management', 'sale-folder'),
  ('STR - Strategy', 'Strategic planning and analysis', 'str-folder'),
  ('LAUNCH - Product Launch', 'Product launch initiatives and tracking', 'launch-folder')
) AS board_data(title, description, monday_id)
ON CONFLICT (workspace_id, monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create a board group first (required for tasks)
WITH strategic_board AS (
  SELECT id FROM boards WHERE monday_board_id = '8198396724' LIMIT 1
)
INSERT INTO board_groups (board_id, title, color, position)
SELECT
  strategic_board.id,
  'Q1 Strategic Objectives',
  '#579bfc',
  0
FROM strategic_board;

-- Create sample tasks from Monday.com strategic board
WITH strategic_board AS (
  SELECT id FROM boards WHERE monday_board_id = '8198396724' LIMIT 1
),
strategic_group AS (
  SELECT bg.id FROM board_groups bg
  JOIN boards b ON bg.board_id = b.id
  WHERE b.monday_board_id = '8198396724' LIMIT 1
)
INSERT INTO tasks (title, board_id, group_id, status, priority, updated_by_user_id, monday_item_id)
SELECT
  task_data.title,
  strategic_board.id,
  strategic_group.id,
  'Not Started',
  task_data.priority,
  '00000000-0000-0000-0000-000000000000'::UUID,
  task_data.monday_id
FROM strategic_board, strategic_group,
(VALUES
  ('✅ Streamlining for Success', 'Medium', '8622199798'),
  ('✅ Tightening the Reins', 'High', '8622199807'),
  ('✅ Scaling the Herd', 'Medium', '8622199816'),
  ('✅ Digital Dominance', 'Medium', '8622199823'),
  ('Sales Process Implementation', 'High', '8179497112')
) AS task_data(title, priority, monday_id);

-- Display success message
SELECT
  'Migration completed successfully!' as status,
  (SELECT COUNT(*) FROM workspaces) as workspaces_created,
  (SELECT COUNT(*) FROM boards) as boards_created,
  (SELECT COUNT(*) FROM tasks) as tasks_created;