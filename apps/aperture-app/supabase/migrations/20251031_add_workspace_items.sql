-- Add Workspace Items (Folders, Dashboards, Docs, Forms, Apps)
-- Migration to support all workspace item types in Supabase

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#579bfc',
  collapsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Dashboards table
CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  layout JSONB DEFAULT '{"widgets": []}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Docs table
CREATE TABLE IF NOT EXISTS docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  content_json JSONB DEFAULT '{}', -- For rich text editor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  last_edited_by UUID, -- References auth.users
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  linked_board_id UUID REFERENCES boards(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB DEFAULT '[]', -- Form field definitions
  submission_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
  CONSTRAINT fk_linked_board FOREIGN KEY (linked_board_id) REFERENCES boards(id) ON DELETE SET NULL
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_by UUID, -- References auth.users (optional for anonymous submissions)
  CONSTRAINT fk_form FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE
);

-- Workspace apps table
CREATE TABLE IF NOT EXISTS workspace_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  app_id VARCHAR(255) NOT NULL, -- MaunApp app ID
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL, -- References auth.users
  CONSTRAINT fk_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT fk_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_folders_workspace_id ON folders(workspace_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_folder_id ON folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_workspace_id ON dashboards(workspace_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_folder_id ON dashboards(folder_id);
CREATE INDEX IF NOT EXISTS idx_docs_workspace_id ON docs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_docs_folder_id ON docs(folder_id);
CREATE INDEX IF NOT EXISTS idx_forms_workspace_id ON forms(workspace_id);
CREATE INDEX IF NOT EXISTS idx_forms_folder_id ON forms(folder_id);
CREATE INDEX IF NOT EXISTS idx_forms_linked_board_id ON forms(linked_board_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_workspace_apps_workspace_id ON workspace_apps(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_apps_folder_id ON workspace_apps(folder_id);

-- Add folder_id to boards table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'boards' AND column_name = 'folder_id'
  ) THEN
    ALTER TABLE boards ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_boards_folder_id ON boards(folder_id);
  END IF;
END $$;

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_docs_updated_at BEFORE UPDATE ON docs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_apps_updated_at BEFORE UPDATE ON workspace_apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (Row Level Security)
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_apps ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view folders in their workspace" ON folders
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create folders in their workspace" ON folders
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can update folders in their workspace" ON folders
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete folders in their workspace" ON folders
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

-- Dashboards policies
CREATE POLICY "Users can view dashboards in their workspace" ON dashboards
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create dashboards in their workspace" ON dashboards
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can update dashboards in their workspace" ON dashboards
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete dashboards in their workspace" ON dashboards
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

-- Docs policies
CREATE POLICY "Users can view docs in their workspace" ON docs
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create docs in their workspace" ON docs
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can update docs in their workspace" ON docs
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete docs in their workspace" ON docs
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

-- Forms policies
CREATE POLICY "Users can view forms in their workspace" ON forms
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create forms in their workspace" ON forms
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can update forms in their workspace" ON forms
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete forms in their workspace" ON forms
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

-- Form submissions policies
CREATE POLICY "Users can view form submissions" ON form_submissions
  FOR SELECT USING (
    form_id IN (
      SELECT id FROM forms WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE created_by = auth.uid()
        OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
      )
    )
  );

CREATE POLICY "Anyone can submit forms" ON form_submissions
  FOR INSERT WITH CHECK (true);

-- Workspace apps policies
CREATE POLICY "Users can view workspace apps" ON workspace_apps
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create workspace apps" ON workspace_apps
  FOR INSERT WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can update workspace apps" ON workspace_apps
  FOR UPDATE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );

CREATE POLICY "Users can delete workspace apps" ON workspace_apps
  FOR DELETE USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE created_by = auth.uid()
      OR id IN (SELECT workspace_id FROM boards WHERE created_by = auth.uid())
    )
  );
