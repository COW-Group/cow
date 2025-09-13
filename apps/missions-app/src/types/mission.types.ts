import { BaseEntity, User } from './base.types';
import { Priority } from './project.types';

export interface Mission extends BaseEntity {
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly status: MissionStatus;
  readonly priority: Priority;
  readonly assigneeId?: string;
  readonly creatorId: string;
  readonly dueDate?: Date;
  readonly completedAt?: Date;
  readonly progress: number; // 0-100
  readonly maxProgress: number;
  readonly avatar?: string;
  readonly owner?: string;
  readonly timestamp: string;
  readonly tags: string[];
  readonly isCompleted: boolean;
  readonly reward?: number;
  readonly difficulty: MissionDifficulty;
  readonly requirements: string[];
  readonly customFields: Record<string, any>;
  readonly assignee?: User;
  readonly creator?: User;
}

export interface MissionActivity extends BaseEntity {
  readonly missionId: string;
  readonly userId: string;
  readonly type: MissionActivityType;
  readonly field?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly description: string;
  readonly user?: User;
}

export interface MissionTemplate extends BaseEntity {
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly status: MissionStatus;
  readonly priority: Priority;
  readonly difficulty: MissionDifficulty;
  readonly requirements: string[];
  readonly reward?: number;
  readonly tags: string[];
  readonly isPublic: boolean;
}

export interface MissionComment extends BaseEntity {
  readonly missionId: string;
  readonly authorId: string;
  readonly content: string;
  readonly mentions: string[];
  readonly attachments: string[];
  readonly editedAt?: Date;
  readonly author?: User;
}

// Following the video's task management pattern
export interface MissionCard {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  status: MissionStatus;
  priority: number; // 1-5 (like in the video)
  progress: number; // 0-100
  owner: string;
  avatar: string;
  timestamp: string;
  documentId?: string; // For database operations like in the video
}

// Based on the video's Monday.com clone
export type MissionStatus = 
  | 'not_started' 
  | 'working_on_it' 
  | 'stuck' 
  | 'done'
  | 'cancelled';

export type MissionDifficulty = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type MissionActivityType = 
  | 'created' 
  | 'updated' 
  | 'status_changed' 
  | 'assigned' 
  | 'unassigned' 
  | 'priority_changed' 
  | 'progress_updated'
  | 'commented' 
  | 'completed' 
  | 'deleted'
  | 'reopened';

export type MissionViewType = 
  | 'board' 
  | 'table' 
  | 'timeline' 
  | 'calendar' 
  | 'dashboard';

// For the dashboard stats like in the video
export interface MissionStats {
  totalMissions: number;
  completedMissions: number;
  inProgressMissions: number;
  stuckMissions: number;
  totalRewards: number;
  averageProgress: number;
  totalCategories: number;
}

// Form data structure like in the video
export interface MissionFormData {
  title: string;
  description: string;
  category: string;
  owner: string;
  avatar: string;
  priority: number;
  status: MissionStatus;
  progress: number;
  timestamp: string;
}