import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ||
                   process.env.NEXT_PUBLIC_SUPABASE_URL ||
                   'https://spnoztsuvgxrdmkeygdu.supabase.co';

const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY ||
                   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwbm96dHN1dmd4cmRta2V5Z2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDQ5NzEsImV4cCI6MjA2NTk4MDk3MX0.WIL49nW6pTtfoueVnKiPfNaHukVKzoo4nxSAfLemcOU';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your environment configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
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

export type SupabaseClient = ReturnType<typeof createClient<Database>>;
export const supabaseClient = supabase as SupabaseClient;