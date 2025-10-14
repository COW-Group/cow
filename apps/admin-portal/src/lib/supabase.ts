/**
 * Admin Portal Supabase client
 *
 * Uses shared @cow/supabase-client package for consistent configuration
 * across the monorepo. Database types are defined below for TypeScript support.
 */
import { supabase } from '@cow/supabase-client';

export { supabase };

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          organization_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          avatar_url: string | null;
          owner_id: string;
          type: 'business' | 'personal' | 'enterprise' | 'non-profit';
          plan: 'free' | 'starter' | 'professional' | 'enterprise';
          plan_limits: any | null;
          settings: any | null;
          is_active: boolean;
          is_personal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id: string;
          type?: 'business' | 'personal' | 'enterprise' | 'non-profit';
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          plan_limits?: any | null;
          settings?: any | null;
          is_active?: boolean;
          is_personal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id?: string;
          type?: 'business' | 'personal' | 'enterprise' | 'non-profit';
          plan?: 'free' | 'starter' | 'professional' | 'enterprise';
          plan_limits?: any | null;
          settings?: any | null;
          is_active?: boolean;
          is_personal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'guest';
          can_invite_users: boolean;
          can_manage_billing: boolean;
          can_manage_settings: boolean;
          can_create_workspaces: boolean;
          invited_by: string | null;
          joined_at: string;
          last_active_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member' | 'guest';
          can_invite_users?: boolean;
          can_manage_billing?: boolean;
          can_manage_settings?: boolean;
          can_create_workspaces?: boolean;
          invited_by?: string | null;
          joined_at?: string;
          last_active_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'guest';
          can_invite_users?: boolean;
          can_manage_billing?: boolean;
          can_manage_settings?: boolean;
          can_create_workspaces?: boolean;
          invited_by?: string | null;
          joined_at?: string;
          last_active_at?: string | null;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'ecosystem_admin' | 'platform_admin' | 'account_admin' | 'organization_member' | 'organization_viewer' | 'organization_guest';
          context_type: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board';
          context_id: string | null;
          context_name: string | null;
          granted_by: string | null;
          granted_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'ecosystem_admin' | 'platform_admin' | 'account_admin' | 'organization_member' | 'organization_viewer' | 'organization_guest';
          context_type: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board';
          context_id?: string | null;
          context_name?: string | null;
          granted_by?: string | null;
          granted_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'ecosystem_admin' | 'platform_admin' | 'account_admin' | 'organization_member' | 'organization_viewer' | 'organization_guest';
          context_type?: 'ecosystem' | 'platform' | 'organization' | 'workspace' | 'board';
          context_id?: string | null;
          context_name?: string | null;
          granted_by?: string | null;
          granted_at?: string;
          expires_at?: string | null;
          is_active?: boolean;
        };
      };
      teams: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          owner_id: string;
          parent_team_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id: string;
          parent_team_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          description?: string | null;
          avatar_url?: string | null;
          owner_id?: string;
          parent_team_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'team_owner' | 'team_admin' | 'team_member' | 'team_guest';
          added_by: string | null;
          added_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: 'team_owner' | 'team_admin' | 'team_member' | 'team_guest';
          added_by?: string | null;
          added_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: 'team_owner' | 'team_admin' | 'team_member' | 'team_guest';
          added_by?: string | null;
          added_at?: string;
        };
      };
      platform_settings: {
        Row: {
          id: string;
          app_name: string;
          settings: any | null;
          stats: any | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          app_name?: string;
          settings?: any | null;
          stats?: any | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          app_name?: string;
          settings?: any | null;
          stats?: any | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      ecosystem_apps: {
        Row: {
          id: string;
          app_name: string;
          display_name: string;
          description: string | null;
          icon_url: string | null;
          is_active: boolean;
          version: string | null;
          settings: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          app_name: string;
          display_name: string;
          description?: string | null;
          icon_url?: string | null;
          is_active?: boolean;
          version?: string | null;
          settings?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          app_name?: string;
          display_name?: string;
          description?: string | null;
          icon_url?: string | null;
          is_active?: boolean;
          version?: string | null;
          settings?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
          settings: any | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          settings?: any | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          settings?: any | null;
        };
      };
      boards: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string | null;
          is_starred: boolean;
          created_at: string;
          updated_at: string;
          created_by: string;
          column_order: string[];
          available_columns: string[];
          view_type: string;
          settings: any | null;
          monday_board_id: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description?: string | null;
          is_starred?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          column_order?: string[];
          available_columns?: string[];
          view_type?: string;
          settings?: any | null;
          monday_board_id?: string | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          title?: string;
          description?: string | null;
          is_starred?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          column_order?: string[];
          available_columns?: string[];
          view_type?: string;
          settings?: any | null;
          monday_board_id?: string | null;
        };
      };
      board_groups: {
        Row: {
          id: string;
          board_id: string;
          title: string;
          color: string;
          position: number;
          is_collapsed: boolean;
          created_at: string;
          updated_at: string;
          monday_group_id: string | null;
        };
        Insert: {
          id?: string;
          board_id: string;
          title: string;
          color: string;
          position: number;
          is_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
          monday_group_id?: string | null;
        };
        Update: {
          id?: string;
          board_id?: string;
          title?: string;
          color?: string;
          position?: number;
          is_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
          monday_group_id?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          board_id: string;
          group_id: string;
          title: string;
          status: string;
          priority: string;
          due_date: string | null;
          assignee_ids: string[];
          agent_ids: string[] | null;
          progress: number | null;
          created_at: string;
          updated_at: string;
          updated_by_user_id: string;
          custom_fields: any | null;
          automation_config: any | null;
          monday_item_id: string | null;
        };
        Insert: {
          id?: string;
          board_id: string;
          group_id: string;
          title: string;
          status?: string;
          priority?: string;
          due_date?: string | null;
          assignee_ids?: string[];
          agent_ids?: string[] | null;
          progress?: number | null;
          created_at?: string;
          updated_at?: string;
          updated_by_user_id: string;
          custom_fields?: any | null;
          automation_config?: any | null;
          monday_item_id?: string | null;
        };
        Update: {
          id?: string;
          board_id?: string;
          group_id?: string;
          title?: string;
          status?: string;
          priority?: string;
          due_date?: string | null;
          assignee_ids?: string[];
          agent_ids?: string[] | null;
          progress?: number | null;
          created_at?: string;
          updated_at?: string;
          updated_by_user_id?: string;
          custom_fields?: any | null;
          automation_config?: any | null;
          monday_item_id?: string | null;
        };
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          content: string;
          author_id: string;
          author_name: string;
          author_avatar: string | null;
          created_at: string;
          edited_at: string | null;
          style: any | null;
        };
        Insert: {
          id?: string;
          task_id: string;
          content: string;
          author_id: string;
          author_name: string;
          author_avatar?: string | null;
          created_at?: string;
          edited_at?: string | null;
          style?: any | null;
        };
        Update: {
          id?: string;
          task_id?: string;
          content?: string;
          author_id?: string;
          author_name?: string;
          author_avatar?: string | null;
          created_at?: string;
          edited_at?: string | null;
          style?: any | null;
        };
      };
      board_activities: {
        Row: {
          id: string;
          board_id: string;
          type: string;
          task_id: string | null;
          task_title: string | null;
          user_id: string;
          user_name: string;
          user_avatar: string | null;
          timestamp: string;
          changes: any | null;
        };
        Insert: {
          id?: string;
          board_id: string;
          type: string;
          task_id?: string | null;
          task_title?: string | null;
          user_id: string;
          user_name: string;
          user_avatar?: string | null;
          timestamp?: string;
          changes?: any | null;
        };
        Update: {
          id?: string;
          board_id?: string;
          type?: string;
          task_id?: string | null;
          task_title?: string | null;
          user_id?: string;
          user_name?: string;
          user_avatar?: string | null;
          timestamp?: string;
          changes?: any | null;
        };
      };
      board_labels: {
        Row: {
          id: string;
          board_id: string;
          title: string;
          color: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          title: string;
          color: string;
          type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          title?: string;
          color?: string;
          type?: string;
          created_at?: string;
        };
      };
      board_members: {
        Row: {
          id: string;
          board_id: string;
          user_id: string;
          user_name: string;
          user_avatar: string | null;
          role: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          board_id: string;
          user_id: string;
          user_name: string;
          user_avatar?: string | null;
          role?: string;
          added_at?: string;
        };
        Update: {
          id?: string;
          board_id?: string;
          user_id?: string;
          user_name?: string;
          user_avatar?: string | null;
          role?: string;
          added_at?: string;
        };
      };
      migration_logs: {
        Row: {
          id: string;
          migration_type: string;
          source_id: string;
          target_id: string;
          status: string;
          started_at: string;
          completed_at: string | null;
          error_message: string | null;
          metadata: any | null;
        };
        Insert: {
          id?: string;
          migration_type: string;
          source_id: string;
          target_id: string;
          status: string;
          started_at?: string;
          completed_at?: string | null;
          error_message?: string | null;
          metadata?: any | null;
        };
        Update: {
          id?: string;
          migration_type?: string;
          source_id?: string;
          target_id?: string;
          status?: string;
          started_at?: string;
          completed_at?: string | null;
          error_message?: string | null;
          metadata?: any | null;
        };
      };
    };
  };
}