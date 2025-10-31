import { BaseEntity, User } from './base.types';
import { Priority } from './project.types';

export interface Task extends BaseEntity {
  readonly workspaceId: string;
  readonly projectId: string;
  readonly boardId?: string;
  readonly sectionId?: string;
  readonly parentId?: string;
  readonly name: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: Priority;
  readonly assigneeId?: string;
  readonly reporterId: string;
  readonly startDate?: Date;
  readonly dueDate?: Date;
  readonly completedAt?: Date;
  readonly estimatedHours?: number;
  readonly actualHours?: number;
  readonly position: number;
  readonly tags: string[];
  readonly customFields: Record<string, any>;
  readonly attachments: Attachment[];
  readonly comments: Comment[];
  readonly dependencies: TaskDependency[];
  readonly subtasks: Task[];
}

export interface TaskDependency extends BaseEntity {
  readonly taskId: string;
  readonly dependsOnId: string;
  readonly type: DependencyType;
  readonly lag: number; // in hours
}

export interface Attachment extends BaseEntity {
  readonly taskId: string;
  readonly name: string;
  readonly url: string;
  readonly size: number;
  readonly type: string;
  readonly uploadedBy: string;
}

export interface Comment extends BaseEntity {
  readonly taskId: string;
  readonly authorId: string;
  readonly content: string;
  readonly isInternal: boolean;
  readonly mentions: string[];
  readonly attachments: string[];
  readonly editedAt?: Date;
  readonly author?: User;
}

export interface TaskActivity extends BaseEntity {
  readonly taskId: string;
  readonly userId: string;
  readonly type: ActivityType;
  readonly field?: string;
  readonly oldValue?: string;
  readonly newValue?: string;
  readonly description: string;
  readonly user?: User;
}

export interface TimeEntry extends BaseEntity {
  readonly taskId: string;
  readonly userId: string;
  readonly hours: number;
  readonly description?: string;
  readonly date: Date;
  readonly billable: boolean;
  readonly user?: User;
}

export interface TaskTemplate extends BaseEntity {
  readonly workspaceId: string;
  readonly name: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: Priority;
  readonly estimatedHours?: number;
  readonly tags: string[];
  readonly subtaskTemplates: TaskTemplate[];
  readonly isPublic: boolean;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'blocked' | 'completed' | 'cancelled';
export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
export type ActivityType = 
  | 'created' 
  | 'updated' 
  | 'status_changed' 
  | 'assigned' 
  | 'unassigned' 
  | 'priority_changed' 
  | 'commented' 
  | 'attachment_added' 
  | 'dependency_added' 
  | 'completed' 
  | 'reopened';