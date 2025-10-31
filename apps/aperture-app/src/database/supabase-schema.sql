-- MyCow Group Workspace Migration Schema
-- This schema will store all Monday.com workspace data in Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  settings JSONB DEFAULT '{}',
  UNIQUE(name)
);

-- Boards table (equivalent to Monday.com boards)
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  column_order TEXT[] DEFAULT ARRAY['assignee-picker', 'status-picker', 'priority-picker', 'date-picker'],
  available_columns TEXT[] DEFAULT ARRAY['assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker'],
  view_type VARCHAR(50) DEFAULT 'table',
  settings JSONB DEFAULT '{}',
  monday_board_id VARCHAR(255), -- Original Monday.com board ID for reference
  UNIQUE(workspace_id, monday_board_id)
);

-- Board groups table (equivalent to Monday.com groups)
CREATE TABLE board_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#579bfc',
  position INTEGER NOT NULL DEFAULT 0,
  is_collapsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  monday_group_id VARCHAR(255) -- Original Monday.com group ID
);

-- Tasks table (equivalent to Monday.com items)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES board_groups(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  status VARCHAR(100) DEFAULT 'Not Started',
  priority VARCHAR(100) DEFAULT 'Medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assignee_ids UUID[] DEFAULT ARRAY[]::UUID[], -- References auth.users
  agent_ids UUID[] DEFAULT ARRAY[]::UUID[], -- AI agents
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by_user_id UUID NOT NULL, -- References auth.users
  custom_fields JSONB DEFAULT '{}',
  automation_config JSONB DEFAULT '{}',
  monday_item_id VARCHAR(255) -- Original Monday.com item ID
);

-- Task comments table
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL, -- References auth.users
  author_name VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  style JSONB DEFAULT '{
    "fontWeight": "normal",
    "fontStyle": "normal",
    "textDecoration": "none",
    "textAlign": "left"
  }'
);

-- Board activities table (audit log)
CREATE TABLE board_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  task_title VARCHAR(500),
  user_id UUID NOT NULL, -- References auth.users
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changes JSONB
);

-- Board labels table (status/priority options)
CREATE TABLE board_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('status', 'priority', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board members table
CREATE TABLE board_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- References auth.users
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  role VARCHAR(50) DEFAULT 'member',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

-- Migration logs table (track migration progress)
CREATE TABLE migration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  migration_type VARCHAR(100) NOT NULL,
  source_id VARCHAR(255) NOT NULL, -- Monday.com ID
  target_id UUID, -- Our UUID
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_boards_workspace_id ON boards(workspace_id);
CREATE INDEX idx_boards_monday_id ON boards(monday_board_id);
CREATE INDEX idx_board_groups_board_id ON board_groups(board_id);
CREATE INDEX idx_board_groups_position ON board_groups(board_id, position);
CREATE INDEX idx_tasks_board_id ON tasks(board_id);
CREATE INDEX idx_tasks_group_id ON tasks(group_id);
CREATE INDEX idx_tasks_assignee_ids ON tasks USING GIN(assignee_ids);
CREATE INDEX idx_tasks_monday_id ON tasks(monday_item_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_board_activities_board_id ON board_activities(board_id);
CREATE INDEX idx_board_activities_timestamp ON board_activities(timestamp DESC);
CREATE INDEX idx_board_labels_board_id ON board_labels(board_id);
CREATE INDEX idx_board_members_board_id ON board_members(board_id);
CREATE INDEX idx_migration_logs_status ON migration_logs(status);
CREATE INDEX idx_migration_logs_type ON migration_logs(migration_type);

-- Full-text search indexes
CREATE INDEX idx_tasks_title_search ON tasks USING GIN(to_tsvector('english', title));
CREATE INDEX idx_boards_title_search ON boards USING GIN(to_tsvector('english', title));

-- Functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_boards_updated_at BEFORE UPDATE ON boards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_groups_updated_at BEFORE UPDATE ON board_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic - adjust based on your auth requirements)
CREATE POLICY "Users can view workspaces they have access to" ON workspaces
    FOR SELECT USING (true); -- Adjust based on your auth system

CREATE POLICY "Users can view boards they have access to" ON boards
    FOR SELECT USING (true);

CREATE POLICY "Users can create boards" ON boards
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update boards they created" ON boards
    FOR UPDATE USING (auth.uid() = created_by);

-- Seed data for MyCow Group workspace
INSERT INTO workspaces (id, name, description, created_by) VALUES
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID,
  'MyCow Group',
  'Migrated from Monday.com - COW project management and CRM workspace',
  '00000000-0000-0000-0000-000000000000'::UUID -- Replace with actual admin user ID
);

-- Create default labels for COW boards
DO $$
DECLARE
    workspace_uuid UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d479'::UUID;
BEGIN
    -- These will be added to boards during migration
    -- Status labels
    -- Priority labels
    NULL;
END $$;