// Corresponds to vision_board_sections table
export interface Range {
  id: string
  user_id: string
  name: string // Changed from 'title' to 'name' to match DB
  created_at?: string
  updated_at?: string
  // Add other fields from vision_board_sections as needed
}

// Corresponds to mountains table
export interface Mountain {
  id: string
  range_id: string // Foreign key to Range (vision_board_sections.id)
  user_id: string
  title: string
  position?: number
  created_at?: string
  updated_at?: string
}

// Corresponds to hills table
export interface Hill {
  id: string
  mountain_id: string // Foreign key to Mountain
  user_id: string // Added user_id
  title: string
  position?: number
  created_at?: string
  updated_at?: string
  // Note: The provided schema for 'hills' did not include user_id.
  // RLS might rely on joins or you might add user_id later if direct ownership is needed.
}

// Corresponds to terrains table
export interface Terrain {
  id: string
  hill_id: string // Foreign key to Hill
  user_id: string // Added user_id
  title: string
  position?: number
  created_at?: string
  updated_at?: string
}

// Corresponds to milestones table (will be renamed to lengths)
export interface Milestone {
  id: string
  terrain_id: string // Foreign key to Terrain
  user_id: string // Added user_id
  title: string
  position?: number
  created_at?: string
  updated_at?: string
}

// Corresponds to tasks table (will be renamed to steps)
export interface Task {
  id: string
  milestone_id: string // Foreign key to Milestone
  user_id: string // Added user_id
  title: string // Assuming 'title' or similar, adjust if needed
  description?: string
  completed?: boolean
  position?: number
  created_at?: string
  updated_at?: string
}

// Corresponds to micro_tasks table (will be renamed to breaths)
export interface MicroTask {
  id: string
  task_id: string // Foreign key to Task
  user_id: string // Added user_id
  label: string // 'label' is used as title here
  completed?: boolean
  position?: number
  time_estimation_seconds?: number
  total_time_seconds?: number
  is_running?: boolean
  start_time?: string
  end_time?: string
  paused_time?: number
  created_at?: string
  updated_at?: string
}

// New financial types
export interface FinancialInflow {
  id: string
  user_id: string
  name: string
  amount: number
  type: "income" | "assets"
  category_id?: string | null // Changed from 'category' to 'category_id'
  description?: string
  work_start_date?: string
  inflow_arrival_date?: string
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually" | "one-time"
  is_active: boolean
  color: string
  goal_linked?: string // This will be deprecated in favor of goal_vision_item_id
  created_at?: string
  updated_at?: string
  // Add a temporary field for category name for display purposes if needed
  category_name?: string
}

export interface FinancialOutflow {
  id: string
  user_id: string
  name: string
  amount: number
  type: "expenses" | "liabilities" | "goals"
  category_id?: string | null // Changed from 'category' to 'category_id'
  description?: string
  due_date?: string
  payment_date?: string
  frequency: "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "annually" | "one-time"
  is_active: boolean
  color: string
  goal_linked?: string // This will be deprecated in favor of goal_vision_item_id
  priority: "low" | "medium" | "high"
  created_at?: string
  updated_at?: string
  // New fields for goal linking
  goal_vision_level?: "Mountain" | "Hill" | "Terrain" | "Milestone" | "Task" | "Breath" | null
  goal_vision_item_id?: string | null
  // Add temporary fields for category/goal names for display purposes if needed
  category_name?: string
  goal_item_name?: string
}

// For Supabase client
export type SupabaseClient = import("@supabase/supabase-js").SupabaseClient

// Add VisionBoardSection type
export interface VisionBoardSection {
  id: string
  user_id: string
  name: string
  created_at?: string
  updated_at?: string
}
