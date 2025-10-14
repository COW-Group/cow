-- ============================================================================
-- PERMISSIONS AND TEAMS MIGRATION
-- Based on monday.com's permission hierarchy
-- Run this SQL in your Supabase SQL Editor
-- ============================================================================

-- Enable required extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- STEP 1: Extend profiles table with user types and permissions
-- ============================================================================

-- Add user type column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS user_type TEXT NOT NULL DEFAULT 'member'
  CHECK (user_type IN ('account_admin', 'member', 'viewer', 'guest'));

-- Add custom role reference
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS custom_role_id UUID NULL;

-- Add email domain for guest identification
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_domain TEXT GENERATED ALWAYS AS (split_part(email, '@', 2)) STORED;

-- Add is_active flag
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Add account permissions as JSONB for flexibility
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS account_permissions JSONB DEFAULT '{}'::jsonb;

-- Create index on user_type for quick filtering
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email_domain ON public.profiles(email_domain);
CREATE INDEX IF NOT EXISTS idx_profiles_custom_role ON public.profiles(custom_role_id);

-- ============================================================================
-- STEP 2: Create Custom Roles table (Enterprise feature)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.custom_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  base_user_type TEXT NOT NULL CHECK (base_user_type IN ('member', 'viewer', 'guest')),
  custom_permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  assigned_user_count INTEGER NOT NULL DEFAULT 0
);

-- Create index for custom roles
CREATE INDEX IF NOT EXISTS idx_custom_roles_base_type ON public.custom_roles(base_user_type);
CREATE INDEX IF NOT EXISTS idx_custom_roles_is_active ON public.custom_roles(is_active);

-- Add foreign key from profiles to custom_roles
ALTER TABLE public.profiles
ADD CONSTRAINT fk_profiles_custom_role
FOREIGN KEY (custom_role_id) REFERENCES public.custom_roles(id) ON DELETE SET NULL;

-- ============================================================================
-- STEP 3: Create Teams table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  type TEXT NOT NULL DEFAULT 'department'
    CHECK (type IN ('department', 'project', 'cross-functional', 'external')),
  visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'secret')),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  parent_team_id UUID NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{
    "allowMemberInvites": true,
    "requireApprovalForJoining": false,
    "defaultMemberRole": "member",
    "goalVisibility": "team"
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_parent ON public.teams(parent_team_id);
CREATE INDEX IF NOT EXISTS idx_teams_type ON public.teams(type);
CREATE INDEX IF NOT EXISTS idx_teams_visibility ON public.teams(visibility);
CREATE INDEX IF NOT EXISTS idx_teams_name_search ON public.teams USING GIN(to_tsvector('english', name));

-- ============================================================================
-- STEP 4: Create Team Members table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(team_id, user_id)
);

-- Create indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON public.team_members(team_id, role);

-- ============================================================================
-- STEP 5: Create Workspace Permissions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspace_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'workspace_member'
    CHECK (role IN ('workspace_owner', 'workspace_member', 'workspace_viewer')),
  can_create_boards BOOLEAN NOT NULL DEFAULT true,
  can_create_dashboards BOOLEAN NOT NULL DEFAULT true,
  can_create_docs BOOLEAN NOT NULL DEFAULT true,
  can_create_folders BOOLEAN NOT NULL DEFAULT true,
  can_invite_members BOOLEAN NOT NULL DEFAULT false,
  can_remove_members BOOLEAN NOT NULL DEFAULT false,
  can_edit_workspace_settings BOOLEAN NOT NULL DEFAULT false,
  can_delete_workspace BOOLEAN NOT NULL DEFAULT false,
  can_manage_workspace_apps BOOLEAN NOT NULL DEFAULT false,
  custom_restrictions JSONB DEFAULT '{}'::jsonb,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Create indexes for workspace permissions
CREATE INDEX IF NOT EXISTS idx_workspace_perms_workspace ON public.workspace_permissions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_perms_user ON public.workspace_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_perms_role ON public.workspace_permissions(role);

-- ============================================================================
-- STEP 6: Update Board Members table with permissions
-- ============================================================================

-- Add board permissions columns to existing board_members table
ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS role_type TEXT NOT NULL DEFAULT 'board_editor'
  CHECK (role_type IN ('board_owner', 'board_editor', 'board_viewer', 'board_guest'));

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS board_type TEXT NULL
  CHECK (board_type IN ('main', 'private', 'shareable'));

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_edit_board_structure BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_change_board_settings BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_delete_board BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_duplicate_board BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_archive_board BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_create_items BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_edit_items BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_delete_items BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_move_items BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_invite_users BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_remove_users BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_comment BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_mention BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_create_automations BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_create_integrations BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_export_data BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_import_data BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_create_views BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS can_share_views BOOLEAN NOT NULL DEFAULT true;

-- Add board type to boards table
ALTER TABLE public.boards
ADD COLUMN IF NOT EXISTS board_type TEXT NOT NULL DEFAULT 'main'
  CHECK (board_type IN ('main', 'private', 'shareable'));

CREATE INDEX IF NOT EXISTS idx_boards_type ON public.boards(board_type);
CREATE INDEX IF NOT EXISTS idx_board_members_role_type ON public.board_members(role_type);

-- ============================================================================
-- STEP 7: Create Permission Change Logs table (Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.permission_change_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('granted', 'revoked', 'modified')),
  resource_type TEXT NOT NULL
    CHECK (resource_type IN ('account', 'workspace', 'board', 'item', 'team', 'user', 'app', 'integration', 'automation', 'dashboard', 'doc')),
  resource_id UUID NULL,
  old_permissions JSONB,
  new_permissions JSONB,
  reason TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for permission logs
CREATE INDEX IF NOT EXISTS idx_perm_logs_user ON public.permission_change_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_perm_logs_changed_by ON public.permission_change_logs(changed_by);
CREATE INDEX IF NOT EXISTS idx_perm_logs_timestamp ON public.permission_change_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_perm_logs_resource ON public.permission_change_logs(resource_type, resource_id);

-- ============================================================================
-- STEP 8: Create functions to automatically set default permissions
-- ============================================================================

-- Function to set default permissions when a user is added to a workspace
CREATE OR REPLACE FUNCTION public.set_default_workspace_permissions()
RETURNS TRIGGER AS $$
DECLARE
  user_type_val TEXT;
BEGIN
  -- Get the user's type
  SELECT user_type INTO user_type_val
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Set default role based on user type
  IF user_type_val = 'account_admin' THEN
    NEW.role := 'workspace_owner';
    NEW.can_create_boards := true;
    NEW.can_create_dashboards := true;
    NEW.can_create_docs := true;
    NEW.can_create_folders := true;
    NEW.can_invite_members := true;
    NEW.can_remove_members := true;
    NEW.can_edit_workspace_settings := true;
    NEW.can_delete_workspace := true;
    NEW.can_manage_workspace_apps := true;
  ELSIF user_type_val = 'member' THEN
    NEW.role := 'workspace_member';
    NEW.can_create_boards := true;
    NEW.can_create_dashboards := true;
    NEW.can_create_docs := true;
    NEW.can_create_folders := true;
    NEW.can_invite_members := true;
    NEW.can_remove_members := false;
    NEW.can_edit_workspace_settings := false;
    NEW.can_delete_workspace := false;
    NEW.can_manage_workspace_apps := false;
  ELSIF user_type_val = 'viewer' THEN
    NEW.role := 'workspace_viewer';
    NEW.can_create_boards := false;
    NEW.can_create_dashboards := false;
    NEW.can_create_docs := false;
    NEW.can_create_folders := false;
    NEW.can_invite_members := false;
    NEW.can_remove_members := false;
    NEW.can_edit_workspace_settings := false;
    NEW.can_delete_workspace := false;
    NEW.can_manage_workspace_apps := false;
  ELSE -- guest
    NEW.role := 'workspace_viewer';
    NEW.can_create_boards := false;
    NEW.can_create_dashboards := false;
    NEW.can_create_docs := false;
    NEW.can_create_folders := false;
    NEW.can_invite_members := false;
    NEW.can_remove_members := false;
    NEW.can_edit_workspace_settings := false;
    NEW.can_delete_workspace := false;
    NEW.can_manage_workspace_apps := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default workspace permissions
DROP TRIGGER IF EXISTS set_workspace_permissions_on_insert ON public.workspace_permissions;
CREATE TRIGGER set_workspace_permissions_on_insert
  BEFORE INSERT ON public.workspace_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_workspace_permissions();

-- Function to set default board permissions
CREATE OR REPLACE FUNCTION public.set_default_board_permissions()
RETURNS TRIGGER AS $$
DECLARE
  user_type_val TEXT;
BEGIN
  -- Get the user's type
  SELECT user_type INTO user_type_val
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Set default permissions based on user type and role
  IF NEW.role_type = 'board_owner' THEN
    NEW.can_edit_board_structure := true;
    NEW.can_change_board_settings := true;
    NEW.can_delete_board := true;
    NEW.can_duplicate_board := true;
    NEW.can_archive_board := true;
    NEW.can_create_items := true;
    NEW.can_edit_items := true;
    NEW.can_delete_items := true;
    NEW.can_move_items := true;
    NEW.can_invite_users := true;
    NEW.can_remove_users := true;
    NEW.can_comment := true;
    NEW.can_mention := true;
    NEW.can_create_automations := true;
    NEW.can_create_integrations := true;
    NEW.can_export_data := true;
    NEW.can_import_data := true;
    NEW.can_create_views := true;
    NEW.can_share_views := true;
  ELSIF NEW.role_type = 'board_editor' THEN
    NEW.can_edit_board_structure := false;
    NEW.can_change_board_settings := false;
    NEW.can_delete_board := false;
    NEW.can_duplicate_board := true;
    NEW.can_archive_board := false;
    NEW.can_create_items := true;
    NEW.can_edit_items := true;
    NEW.can_delete_items := true;
    NEW.can_move_items := true;
    NEW.can_invite_users := false;
    NEW.can_remove_users := false;
    NEW.can_comment := true;
    NEW.can_mention := true;
    NEW.can_create_automations := false;
    NEW.can_create_integrations := false;
    NEW.can_export_data := true;
    NEW.can_import_data := false;
    NEW.can_create_views := true;
    NEW.can_share_views := true;
  ELSIF NEW.role_type = 'board_viewer' THEN
    NEW.can_edit_board_structure := false;
    NEW.can_change_board_settings := false;
    NEW.can_delete_board := false;
    NEW.can_duplicate_board := false;
    NEW.can_archive_board := false;
    NEW.can_create_items := false;
    NEW.can_edit_items := false;
    NEW.can_delete_items := false;
    NEW.can_move_items := false;
    NEW.can_invite_users := false;
    NEW.can_remove_users := false;
    NEW.can_comment := true;
    NEW.can_mention := false;
    NEW.can_create_automations := false;
    NEW.can_create_integrations := false;
    NEW.can_export_data := true;
    NEW.can_import_data := false;
    NEW.can_create_views := false;
    NEW.can_share_views := false;
  ELSE -- board_guest
    NEW.can_edit_board_structure := false;
    NEW.can_change_board_settings := false;
    NEW.can_delete_board := false;
    NEW.can_duplicate_board := false;
    NEW.can_archive_board := false;
    NEW.can_create_items := false;
    NEW.can_edit_items := false;
    NEW.can_delete_items := false;
    NEW.can_move_items := false;
    NEW.can_invite_users := false;
    NEW.can_remove_users := false;
    NEW.can_comment := true;
    NEW.can_mention := false;
    NEW.can_create_automations := false;
    NEW.can_create_integrations := false;
    NEW.can_export_data := false;
    NEW.can_import_data := false;
    NEW.can_create_views := false;
    NEW.can_share_views := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set default board permissions
DROP TRIGGER IF EXISTS set_board_permissions_on_insert ON public.board_members;
CREATE TRIGGER set_board_permissions_on_insert
  BEFORE INSERT ON public.board_members
  FOR EACH ROW
  EXECUTE FUNCTION public.set_default_board_permissions();

-- Function to update custom role assigned user count
CREATE OR REPLACE FUNCTION public.update_custom_role_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.custom_role_id IS NOT NULL THEN
    UPDATE public.custom_roles
    SET assigned_user_count = assigned_user_count + 1
    WHERE id = NEW.custom_role_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.custom_role_id IS DISTINCT FROM NEW.custom_role_id THEN
      IF OLD.custom_role_id IS NOT NULL THEN
        UPDATE public.custom_roles
        SET assigned_user_count = assigned_user_count - 1
        WHERE id = OLD.custom_role_id;
      END IF;
      IF NEW.custom_role_id IS NOT NULL THEN
        UPDATE public.custom_roles
        SET assigned_user_count = assigned_user_count + 1
        WHERE id = NEW.custom_role_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.custom_role_id IS NOT NULL THEN
    UPDATE public.custom_roles
    SET assigned_user_count = assigned_user_count - 1
    WHERE id = OLD.custom_role_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update custom role count
DROP TRIGGER IF EXISTS update_role_count ON public.profiles;
CREATE TRIGGER update_role_count
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_custom_role_count();

-- ============================================================================
-- STEP 9: Add updated_at triggers for new tables
-- ============================================================================

CREATE TRIGGER update_custom_roles_updated_at
  BEFORE UPDATE ON public.custom_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- STEP 10: Update Row Level Security (RLS) policies
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_change_logs ENABLE ROW LEVEL SECURITY;

-- Custom Roles policies (only admins can manage)
CREATE POLICY "Admins can view custom roles"
  ON public.custom_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'account_admin'
    )
  );

CREATE POLICY "Admins can create custom roles"
  ON public.custom_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'account_admin'
    )
  );

CREATE POLICY "Admins can update custom roles"
  ON public.custom_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'account_admin'
    )
  );

-- Teams policies
CREATE POLICY "Users can view teams they are members of"
  ON public.teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id AND user_id = auth.uid()
    ) OR visibility = 'public'
  );

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND user_type IN ('account_admin', 'member')
        AND is_active = true
    )
  );

CREATE POLICY "Team owners can update teams"
  ON public.teams FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Team owners can delete teams"
  ON public.teams FOR DELETE
  USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Users can view team members of their teams"
  ON public.team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm2
      WHERE tm2.team_id = team_members.team_id AND tm2.user_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_members.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Workspace permissions policies
CREATE POLICY "Users can view their workspace permissions"
  ON public.workspace_permissions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Workspace owners can manage permissions"
  ON public.workspace_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_permissions wp
      WHERE wp.workspace_id = workspace_permissions.workspace_id
        AND wp.user_id = auth.uid()
        AND wp.role = 'workspace_owner'
    )
  );

-- Permission logs policies
CREATE POLICY "Admins can view permission logs"
  ON public.permission_change_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'account_admin'
    )
  );

CREATE POLICY "System can insert permission logs"
  ON public.permission_change_logs FOR INSERT
  WITH CHECK (true); -- Allow inserts from triggers/system

-- ============================================================================
-- STEP 11: Create helper views for common queries
-- ============================================================================

-- View to get user's effective permissions across all workspaces
CREATE OR REPLACE VIEW public.user_workspace_access AS
SELECT
  p.id as user_id,
  p.full_name,
  p.email,
  p.user_type,
  w.id as workspace_id,
  w.name as workspace_name,
  wp.role as workspace_role,
  wp.can_create_boards,
  wp.can_create_dashboards,
  wp.can_edit_workspace_settings
FROM public.profiles p
CROSS JOIN public.workspaces w
LEFT JOIN public.workspace_permissions wp ON wp.user_id = p.id AND wp.workspace_id = w.id
WHERE p.is_active = true;

-- View to get team hierarchy
CREATE OR REPLACE VIEW public.team_hierarchy AS
WITH RECURSIVE team_tree AS (
  -- Base case: top-level teams
  SELECT
    id,
    name,
    parent_team_id,
    owner_id,
    type,
    visibility,
    0 as level,
    ARRAY[id] as path
  FROM public.teams
  WHERE parent_team_id IS NULL

  UNION ALL

  -- Recursive case: child teams
  SELECT
    t.id,
    t.name,
    t.parent_team_id,
    t.owner_id,
    t.type,
    t.visibility,
    tt.level + 1,
    tt.path || t.id
  FROM public.teams t
  INNER JOIN team_tree tt ON t.parent_team_id = tt.id
)
SELECT * FROM team_tree;

-- ============================================================================
-- STEP 12: Grant necessary permissions
-- ============================================================================

GRANT ALL ON public.custom_roles TO authenticated;
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.workspace_permissions TO authenticated;
GRANT ALL ON public.permission_change_logs TO authenticated;

GRANT ALL ON public.custom_roles TO service_role;
GRANT ALL ON public.teams TO service_role;
GRANT ALL ON public.team_members TO service_role;
GRANT ALL ON public.workspace_permissions TO service_role;
GRANT ALL ON public.permission_change_logs TO service_role;

-- ============================================================================
-- STEP 13: Insert seed data for testing
-- ============================================================================

-- Create a default account admin (update with your actual admin user ID)
-- UPDATE public.profiles
-- SET user_type = 'account_admin'
-- WHERE email = 'your-admin@example.com';

-- Create a default "Everyone" team
-- INSERT INTO public.teams (name, description, type, visibility, owner_id)
-- SELECT
--   'Everyone',
--   'All members of the organization',
--   'department',
--   'public',
--   id
-- FROM public.profiles
-- WHERE user_type = 'account_admin'
-- LIMIT 1;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Update the admin user email in STEP 13 and run those commented queries
-- 2. Test the permission system with different user types
-- 3. Create custom roles as needed
-- 4. Add users to teams and workspaces
-- ============================================================================
