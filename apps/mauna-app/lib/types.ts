import type { User as SupabaseUser } from "@supabase/supabase-js"

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          preferred_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          preferred_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          preferred_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_lists: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
          position: number | null
          suggested_time_block_range: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
          position?: number | null
          suggested_time_block_range?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
          position?: number | null
          suggested_time_block_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      steps: {
        Row: {
          audio_type: string | null
          audio_url: string | null
          color: string | null
          completed: boolean
          created_at: string
          duration: number
          ending_ritual: string | null
          history: Json | null
          icon: string | null
          id: string
          label: string
          locked: boolean
          mantra: string | null
          position: number
          priority_letter: string | null
          priority_rank: number | null
          starting_ritual: string | null
          task_list_id: string | null
          user_id: string
          updated_at: string | null
          timezone: string | null
          length_id: string | null
          lifeline: string | null
          tag: string | null
        }
        Insert: {
          audio_type?: string | null
          audio_url?: string | null
          color?: string | null
          completed?: boolean
          created_at?: string
          duration?: number
          ending_ritual?: string | null
          history?: Json | null
          icon?: string | null
          id?: string
          label: string
          locked?: boolean
          mantra?: string | null
          position?: number
          priority_letter?: string | null
          priority_rank?: number | null
          starting_ritual?: string | null
          task_list_id?: string | null
          user_id: string
          updated_at?: string | null
          timezone?: string | null
          length_id?: string | null
          lifeline?: string | null
          tag?: string | null
        }
        Update: {
          audio_type?: string | null
          audio_url?: string | null
          color?: string | null
          completed?: boolean
          created_at?: string
          duration?: number
          ending_ritual?: string | null
          history?: Json | null
          icon?: string | null
          id?: string
          label?: string
          locked?: boolean
          mantra?: string | null
          position?: number
          priority_letter?: string | null
          priority_rank?: number | null
          starting_ritual?: string | null
          task_list_id?: string | null
          user_id?: string
          updated_at?: string | null
          timezone?: string | null
          length_id?: string | null
          lifeline?: string | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "steps_task_list_id_fkey"
            columns: ["task_list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "steps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "steps_length_id_fkey"
            columns: ["length_id"]
            isOneToOne: false
            referencedRelation: "lengths"
            referencedColumns: ["id"]
          },
        ]
      }
      breaths: {
        Row: {
          id: string
          step_id: string
          user_id: string
          name: string
          completed: boolean
          is_running: boolean
          start_time: string | null
          end_time: string | null
          paused_time: number
          total_time_seconds: number
          time_estimation_seconds: number
          created_at: string
          updated_at: string
          position: number
          emotion_id: string | null
        }
        Insert: {
          id?: string
          step_id: string
          user_id: string
          name: string
          completed?: boolean
          is_running?: boolean
          start_time?: string | null
          end_time?: string | null
          paused_time?: number
          total_time_seconds?: number
          time_estimation_seconds?: number
          created_at?: string
          updated_at?: string
          position?: number
          emotion_id?: string | null
        }
        Update: {
          id?: string
          step_id?: string
          user_id?: string
          name?: string
          completed?: boolean
          is_running?: boolean
          start_time?: string | null
          end_time?: string | null
          paused_time?: number
          total_time_seconds?: number
          time_estimation_seconds?: number
          created_at?: string
          updated_at?: string
          position?: number
          emotion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breaths_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breaths_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breaths_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotions"
            referencedColumns: ["id"]
          },
        ]
      }
      ranges: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
          tag: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mountains: {
        Row: {
          id: string
          user_id: string
          range_id: string
          name: string
          created_at: string
          updated_at: string
          tag: string | null
        }
        Insert: {
          id?: string
          user_id: string
          range_id: string
          name: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          range_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mountains_range_id_fkey"
            columns: ["range_id"]
            isOneToOne: false
            referencedRelation: "ranges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mountains_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hills: {
        Row: {
          id: string
          user_id: string
          mountain_id: string
          name: string
          created_at: string
          updated_at: string
          tag: string | null
        }
        Insert: {
          id?: string
          user_id: string
          mountain_id: string
          name: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          mountain_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hills_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      terrains: {
        Row: {
          id: string
          user_id: string
          hill_id: string
          name: string
          created_at: string
          updated_at: string
          tag: string | null
        }
        Insert: {
          id?: string
          user_id: string
          hill_id: string
          name: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          hill_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terrains_hill_id_fkey"
            columns: ["hill_id"]
            isOneToOne: false
            referencedRelation: "hills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terrains_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lengths: {
        Row: {
          id: string
          user_id: string
          terrain_id: string
          name: string
          completed: boolean
          created_at: string
          updated_at: string
          tag: string | null
        }
        Insert: {
          id?: string
          user_id: string
          terrain_id: string
          name: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          terrain_id?: string
          name?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lengths_terrain_id_fkey"
            columns: ["terrain_id"]
            isOneToOne: false
            referencedRelation: "terrains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lengths_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal: {
        Row: {
          id: string
          user_id: string
          title: string | null
          entry: string | null
          category: string | null
          visionboardlevel: string | null
          visionboarditemid: string | null
          visionboarditemtitle: string | null
          tags: string[] | null
          created_at: string
          updated_at: string | null
          is_archived: boolean
          is_favorite: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          entry?: string | null
          category?: string | null
          visionboardlevel?: string | null
          visionboarditemid?: string | null
          visionboarditemtitle?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
          is_archived?: boolean
          is_favorite?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          entry?: string | null
          category?: string | null
          visionboardlevel?: string | null
          visionboarditemid?: string | null
          visionboarditemtitle?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string | null
          is_archived?: boolean
          is_favorite?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "journal_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emotions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          color: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          color: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          color?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority: "low" | "medium" | "high"
          created_at: string
          due_date: string | null
          start_date: string | null
          end_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority?: "low" | "medium" | "high"
          created_at?: string
          due_date?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority?: "low" | "medium" | "high"
          created_at?: string
          due_date?: string | null
          start_date?: string | null
          end_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_areas: {
        Row: {
          id: string
          project_id: string
          name: string
          position: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          position?: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          position?: number
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_areas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          id: string
          project_id: string
          name: string
          role: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          role?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          role?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          id: string
          project_id: string
          area_id: string
          user_id: string
          title: string
          description: string | null
          status: "pending" | "in-progress" | "completed" | "blocked"
          time_period: string
          time_period_type: "week" | "month" | "quarter" | "year"
          time_period_number: number
          assigned_to: string | null
          due_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          area_id: string
          user_id: string
          title: string
          description?: string | null
          status?: "pending" | "in-progress" | "completed" | "blocked"
          time_period: string
          time_period_type: "week" | "month" | "quarter" | "year"
          time_period_number: number
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          area_id?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: "pending" | "in-progress" | "completed" | "blocked"
          time_period?: string
          time_period_type?: "week" | "month" | "quarter" | "year"
          time_period_number?: number
          assigned_to?: string | null
          due_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "project_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          balance: number
          contribution: number
          tax_status: "taxable" | "tax-deferred" | "tax-exempt" | null
          growth: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          balance?: number
          contribution?: number
          tax_status?: "taxable" | "tax-deferred" | "tax-exempt" | null
          growth?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          balance?: number
          contribution?: number
          tax_status?: "taxable" | "tax-deferred" | "tax-exempt" | null
          growth?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          priority: "low" | "medium" | "high"
          status: "pending" | "completed" | "in-progress"
          created_at: string
          updated_at: string
          is_scheduled: boolean
          scheduled_date: string | null
          scheduled_time: string | null
          position: number
          list_id: string
          duration: number | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          due_date?: string
          priority?: "low" | "medium" | "high"
          status: "pending" | "completed" | "in-progress"
          created_at?: string
          updated_at?: string
          is_scheduled?: boolean
          scheduled_date?: string
          scheduled_time?: string
          position?: number
          list_id: string
          duration?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          due_date?: string
          priority?: "low" | "medium" | "high"
          status?: "pending" | "completed" | "in-progress"
          created_at?: string
          updated_at?: string
          is_scheduled?: boolean
          scheduled_date?: string
          scheduled_time?: string
          position?: number
          list_id?: string
          duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          user_id: string
          focus_mode: boolean
          show_weather: boolean
          show_greeting: boolean
          show_mantra: boolean
          show_tasks: boolean
          show_quotes: boolean
          dark_mode: boolean | null
          sound_enabled: boolean | null
          default_duration: number | null
          auto_loop: boolean | null
        }
        Insert: {
          user_id: string
          focus_mode?: boolean
          show_weather?: boolean
          show_greeting?: boolean
          show_mantra?: boolean
          show_tasks?: boolean
          show_quotes?: boolean
          dark_mode?: boolean
          sound_enabled?: boolean
          default_duration?: number
          auto_loop?: boolean
        }
        Update: {
          user_id?: string
          focus_mode?: boolean
          show_weather?: boolean
          show_greeting?: boolean
          show_mantra?: boolean
          show_tasks?: boolean
          show_quotes?: boolean
          dark_mode?: boolean
          sound_enabled?: boolean
          default_duration?: number
          auto_loop?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emotion_entries: {
        Row: {
          id: string
          user_id: string
          emotion: string
          intensity: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          emotion: string
          intensity: number
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          emotion?: string
          intensity?: number
          notes?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sounds: {
        Row: {
          id: string
          name: string
          url: string
          category: string
          is_premium: boolean
          type: "music" | "sfx"
        }
        Insert: {
          id?: string
          name: string
          url: string
          category: string
          is_premium?: boolean
          type: "music" | "sfx"
        }
        Update: {
          id?: string
          name?: string
          url?: string
          category?: string
          is_premium?: boolean
          type?: "music" | "sfx"
        }
        Relationships: []
      }
      triggers: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "triggers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          type: "positive" | "negative" | "neutral"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          date: string
          type: "positive" | "negative" | "neutral"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          date?: string
          type?: "positive" | "negative" | "neutral"
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          id: string
          name: string
          user_id: string
          industry: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          industry?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          industry?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
          company_id: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company_id: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          company_id?: string
          description?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          target_date: string | null
          status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority: "low" | "medium" | "high"
          created_at: string
          company_id: string | null
          team_id: string | null
          type: "personal" | "company" | "team"
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          target_date?: string
          status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority?: "low" | "medium" | "high"
          created_at?: string
          company_id?: string | null
          team_id?: string | null
          type?: "personal" | "company" | "team"
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          target_date?: string
          status?: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
          priority?: "low" | "medium" | "high"
          created_at?: string
          company_id?: string | null
          team_id?: string | null
          type?: "personal" | "company" | "team"
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      time_blocks: {
        Row: {
          id: string
          user_id: string
          task_list_id: string
          start_time: string
          end_time: string
          label: string | null
          color: string | null
          icon: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_list_id: string
          start_time: string
          end_time: string
          label?: string | null
          color?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_list_id?: string
          start_time?: string
          end_time?: string
          label?: string | null
          color?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_blocks_task_list_id_fkey"
            columns: ["task_list_id"]
            isOneToOne: false
            referencedRelation: "task_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_blocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_updated_at_timestamp: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      goal_type: "Objective" | "Key Result" | "Individual Goal"
      metric_type: "Numeric" | "Percentage" | "Currency"
      goal_status: "On Track" | "At Risk" | "Off Track"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type TaskListDB = Database["public"]["Tables"]["task_lists"]["Row"]
export type StepDB = Database["public"]["Tables"]["steps"]["Row"]
export type BreathDB = Database["public"]["Tables"]["breaths"]["Row"]
export type TimeBlockDB = Database["public"]["Tables"]["time_blocks"]["Row"]

export type RangeDB = Database["public"]["Tables"]["ranges"]["Row"]
export type MountainDB = Database["public"]["Tables"]["mountains"]["Row"]
export type HillDB = Database["public"]["Tables"]["hills"]["Row"]
export type TerrainDB = Database["public"]["Tables"]["terrains"]["Row"]
export type LengthDB = {
  id: string
  user_id: string
  terrain_id: string
  name: string
  completed: boolean
  created_at: string
  updated_at: string
  tag: string | null
  steps: StepDB[]
}

export type PriorityLetter = "S" | "E" | "R" | "N" | "T" | "None"

export interface Step {
  id: string
  userId: string
  taskListId: string | null
  lengthId: string | null
  label: string
  duration: number
  completed: boolean
  locked: boolean
  color: string
  icon: string
  priorityLetter: PriorityLetter
  priorityRank: number
  estimatedStartTime: string | null
  estimatedEndTime: string | null
  history: { startTime: string; endTime: string }[]
  breaths: Breath[]
  mantra: string
  startingRitual: string
  endingRitual: string
  audioUrl: string | null
  audioType: string | null
  position: number
  timezone: string | null
  rubric?: any
  lifeline: string | null
  tag: string | null
}

export interface TaskList {
  id: string
  name: string
  userId: string
  createdAt: string
  position: number
  suggestedTimeBlockRange: string | null
  steps: Step[]
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  avatar_url?: string
  created_at: string
}

export interface AuthUser extends SupabaseUser {
  user_metadata: {
    full_name?: string
  }
}

export interface Breath {
  id: string
  name: string
  completed: boolean
  isRunning: boolean
  startTime: string | null
  endTime: string | null
  pausedTime: number
  totalTimeSeconds: number
  timeEstimationSeconds: number
  position: number
  emotionId: string | null
}

export interface Length {
  id: string
  name: string
  completed: boolean
  tag: string | null
  steps: Step[]
}

export interface Terrain {
  id: string
  name: string
  tag: string | null
  lengths: Length[]
}

export interface Hill {
  id: string
  name: string
  tag: string | null
  terrains: Terrain[]
}

export interface Mountain {
  id: string
  name: string
  tag: string | null
  hills: Hill[]
}

export interface Range {
  id: string
  name: string
  tag: string | null
  mountains: Mountain[]
}

export interface JournalEntry {
  id: string
  userId: string
  title: string | null
  entry: string | null
  category: string | null
  visionboardlevel: string | null
  visionboarditemid: string | null
  visionboarditemtitle: string | null
  tags: string[] | null
  created_at: string
  updated_at: string | null
  is_archived: boolean
  is_favorite: boolean
}

export interface Emotion {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  name: string
  description: string | null
  color: string
}

export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled"
  priority: "low" | "medium" | "high"
  dueDate: string | null
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
  areas: string[]
  teamMembers: string[]
  tasks?: any[]
}

export interface ProjectArea {
  id: string
  projectId: string
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

export interface ProjectTeamMember {
  id: string
  projectId: string
  name: string
  role: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectTask {
  id: string
  projectId: string
  areaId: string
  userId: string
  title: string
  description: string | null
  status: "pending" | "in-progress" | "completed" | "blocked"
  timePeriod: string
  timePeriodType: "week" | "month" | "quarter" | "year"
  timePeriodNumber: number
  assignedTo: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectDB = Database["public"]["Tables"]["projects"]["Row"]
export type ProjectAreaDB = Database["public"]["Tables"]["project_areas"]["Row"]
export type ProjectTeamMemberDB = Database["public"]["Tables"]["project_team_members"]["Row"]
export type ProjectTaskDB = Database["public"]["Tables"]["project_tasks"]["Row"]
export type VehicleDB = Database["public"]["Tables"]["vehicles"]["Row"]
export type TaskDB = Database["public"]["Tables"]["tasks"]["Row"]
export type AppSettingsDB = Database["public"]["Tables"]["app_settings"]["Row"]
export type EmotionEntryDB = Database["public"]["Tables"]["emotion_entries"]["Row"]
export type SoundDB = Database["public"]["Tables"]["sounds"]["Row"]
export type TriggerDB = Database["public"]["Tables"]["triggers"]["Row"]
export type ExperienceDB = Database["public"]["Tables"]["experiences"]["Row"]

export type GoalDB = Database["public"]["Tables"]["goals"]["Row"]
export type CompanyDB = Database["public"]["Tables"]["companies"]["Row"]
export type TeamDB = Database["public"]["Tables"]["teams"]["Row"]

export interface Vehicle {
  id: string
  userId: string
  name: string
  type: string
  balance: number
  contribution: number
  taxStatus: "taxable" | "tax-deferred" | "tax-exempt" | null
  growth: number | null
  createdAt: string
  updatedAt: string | null
}

export interface AppSettings {
  focusMode: boolean
  showWeather: boolean
  showGreeting: boolean
  showMantra: boolean
  showTasks: boolean
  showQuotes: boolean
  darkMode?: boolean
  soundEnabled?: boolean
  defaultDuration?: number
  autoLoop?: boolean
  showCalendarMenu: boolean
  showTasksMenu: boolean
  showJournalMenu: boolean
  showVisionBoardMenu: boolean
  showBalanceMenu: boolean
  showWealthManagementMenu: boolean
  showLinksMenu: boolean
  showMantrasMenu: boolean
  showQuotesMenu: boolean
  showCompletedMountainsMenu: boolean
  showAudioSettingsMenu: boolean
  showMountainPreferencesMenu: boolean
  showBubblesMenu: boolean
  showHabitsMenu: boolean
  showHelpMenu: boolean
  showHeaderMain: boolean
  showHeaderFocus: boolean
  showHeaderEmotional: boolean
  showHeaderHealth: boolean
  showHeaderVision: boolean
  showHeaderWealth: boolean
  showHeaderSocial: boolean
  showHeaderProjects: boolean
  showHeaderSales: boolean
  showHeaderMarketplace: boolean
}

export interface EmotionEntry {
  id: string
  userId: string
  emotion: string
  intensity: number
  notes?: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  dueDate?: string
  priority?: "low" | "medium" | "high"
  status: "pending" | "completed" | "in-progress"
  createdAt: string
  updatedAt: string
  isScheduled: boolean
  scheduledFor?: string
  position?: number
  listId: string
  duration?: number
}

export interface Sound {
  id: string
  name: string
  src: string
  type: "music" | "sfx"
}

export interface Trigger {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: string
}

export interface Experience {
  id: string
  userId: string
  title: string
  description?: string
  date: string
  type: "positive" | "negative" | "neutral"
  createdAt: string
}

export interface RubricData {
  clarity: number
  difficulty: number
  impact: number
  notes?: string
}

export type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | "USER_UPDATED" | "PASSWORD_RECOVERY"

export type AuthSession = {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: number
  refresh_token: string
  user: SupabaseUser
}

export type GoalType = Database["public"]["Enums"]["goal_type"]
export type MetricType = Database["public"]["Enums"]["metric_type"]
export type GoalStatus = Database["public"]["Enums"]["goal_status"]

export interface Company {
  id: string
  userId: string
  name: string
  industry: string | null
  createdAt: string
}

export interface Team {
  id: string
  companyId: string
  name: string
  description: string | null
  createdAt: string
}

export interface Goal {
  id: string
  userId: string
  name: string
  description: string | null
  targetDate: string | null
  status: GoalStatus
  priority: "low" | "medium" | "high"
  createdAt: string
}

export interface TimeBlock {
  id: string
  userId: string
  taskListId: string
  startTime: string
  endTime: string
  label: string | null
  color: string | null
  icon: string | null
  createdAt: string
  updatedAt: string | null
}