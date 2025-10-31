-- MyCow Monday.com Migration SQL
-- Generated: 2025-09-27T02:23:14.111Z
-- Workspace: MyCow Group

-- Clear existing data (optional)
-- DELETE FROM tasks;
-- DELETE FROM boards;
-- DELETE FROM workspaces;

-- Note: Users will be managed through Supabase Auth
-- For reference, these are the Monday.com users:
-- Staff MyCow (staff@mycow.io) - member
-- Owner Cow Group (owner@mycow.io) - admin
-- Executive Management (executive@mycow.io) - admin
-- Likhitha Palaypu (likhitha@mycow.io) - admin

-- You'll need to invite these users through Supabase Auth Dashboard:
-- staff@mycow.io (Staff MyCow - member)
-- owner@mycow.io (Owner Cow Group - admin)
-- executive@mycow.io (Executive Management - admin)
-- likhitha@mycow.io (Likhitha Palaypu - admin)


-- Insert Workspaces (Monday Folders)
INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16117849', '🐮 MyCow Group', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144213', 'LAUNCH', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144224', 'STR', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144225', 'RED', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144226', 'LEG', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144251', 'FIN', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144253', 'TECH', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144254', 'SALE', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144256', 'IR', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO workspaces (id, name, description, owner_id, created_at, updated_at)
VALUES ('16144257', 'POPS', 'undefined department', '82967988', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();


-- Insert Boards (Monday Boards)
INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('18029433206', '16117849', 'MCP getting started', '', '82967988', '18029433206', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('9013626022', '16117849', 'Subitems of STR', '', '82967988', '9013626022', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('9013612329', '16117849', 'Brand Strategy', '', '82967988', '9013612329', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('8969084285', '16117849', 'How to Manage Accounts', '', '82967988', '8969084285', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO boards (id, workspace_id, title, description, created_by, monday_board_id, created_at, updated_at)
VALUES ('8966896339', '16117849', 'Webinar form', '', '82967988', '8966896339', NOW(), NOW())
ON CONFLICT (monday_board_id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();


-- Insert Strategic Board Tasks
INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('8622199798', '8198396724', '✅ Streamlining for Success', 'Strategic Q1 objective', 'todo', 1, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('8622199807', '8198396724', '✅ Tightening the Reins', 'Strategic Q1 objective', 'todo', 1, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('8622199816', '8198396724', '✅ Scaling the Herd', 'Strategic Q1 objective', 'todo', 1, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('8622199823', '8198396724', '✅ Digital Dominance', 'Strategic Q1 objective', 'todo', 1, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

INSERT INTO tasks (id, board_id, title, description, status, priority, created_at, updated_at, updated_by_user_id)
VALUES ('8179497112', '8198396724', 'Finalize and Implement Sales Process Flows; Pre-Launch Materials', 'Strategic Q1 objective', 'todo', 1, NOW(), NOW(), '82967988')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  updated_at = NOW();

