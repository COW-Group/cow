import type { Database } from "@/lib/database.types"

export interface Range {
  // Renamed from VisionBoardSection
  id: string
  user_id: string
  name: string // Matches 'name' column in ranges
  is_locked: boolean
  is_mandatory: boolean
  created_at: string
}

export type Mountain = Database["public"]["Tables"]["mountains"]["Row"] & { user_id: string }

export interface Hill {
  id: string
  mountain_id: string
  title: string
  position: number
  created_at: string
  updated_at: string
  terrains?: Terrain[]
}

export interface Terrain {
  id: string
  hill_id: string
  title: string
  position: number
  created_at: string
  updated_at: string
  lengths?: Length[] // Updated from milestones to lengths
}

export interface Length {
  // Renamed from Milestone
  id: string
  terrain_id: string
  title: string
  position: number
  created_at: string
  updated_at: string
  steps?: Step[] // Updated from tasks to steps
}

export interface Step {
  // Renamed from Task
  id: string
  length_id: string // Updated from milestone_id to length_id
  title: string
  position: number
  created_at: string
  updated_at: string
  breaths?: Breath[] // Updated from breaths to breaths (no name change, but type is Breath)
}

export interface Breath {
  // Renamed from MicroTask
  id: string
  step_id: string // Updated from task_id to step_id
  label: string
  completed: boolean
  total_time_seconds: number
  time_estimation_seconds: number
  paused_time: number
  is_running: boolean
  created_at: string
  updated_at: string
  start_time: string | null
  end_time: string | null
}

export type MountainWithUserId = Mountain & { user_id: string }
export type TerrainWithUserId = Terrain & { user_id: string }
export type LengthWithUserId = Length & { user_id: string } // Updated type
export type StepWithUserId = Step & { user_id: string } // Updated type
export type BreathWithUserId = Breath & { user_id: string } // Updated type
