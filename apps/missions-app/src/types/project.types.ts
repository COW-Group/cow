import { BaseEntity, User } from './base.types';

export interface Project extends BaseEntity {
  readonly workspaceId: string;
  readonly teamId?: string;
  readonly name: string;
  readonly description?: string;
  readonly status: ProjectStatus;
  readonly priority: Priority;
  readonly startDate?: Date;
  readonly dueDate?: Date;
  readonly budget?: number;
  readonly progress: number;
  readonly ownerId: string;
  readonly tags: string[];
  readonly settings: ProjectSettings;
  readonly portfolioId?: string;
}

export interface ProjectSettings {
  readonly isPrivate: boolean;
  readonly allowComments: boolean;
  readonly autoArchive: boolean;
  readonly customStatuses: string[];
  readonly templateId?: string;
  readonly defaultView: BoardType;
}

export interface ProjectMember extends BaseEntity {
  readonly projectId: string;
  readonly userId: string;
  readonly role: ProjectRole;
  readonly permissions: ProjectPermission[];
  readonly addedBy: string;
  readonly user?: User;
}

export interface Portfolio extends BaseEntity {
  readonly workspaceId: string;
  readonly name: string;
  readonly description?: string;
  readonly color: string;
  readonly ownerId: string;
  readonly projectIds: string[];
  readonly settings: PortfolioSettings;
}

export interface PortfolioSettings {
  readonly showProgress: boolean;
  readonly showBudget: boolean;
  readonly showTimeline: boolean;
  readonly customMetrics: string[];
}

export interface ProjectTemplate extends BaseEntity {
  readonly workspaceId: string;
  readonly name: string;
  readonly description?: string;
  readonly isPublic: boolean;
  readonly category: string;
  readonly config: ProjectTemplateConfig;
  readonly usageCount: number;
}

export interface ProjectTemplateConfig {
  readonly defaultColumns: string[];
  readonly defaultTasks: TemplateTask[];
  readonly defaultSettings: Partial<ProjectSettings>;
  readonly customFields: string[];
}

export interface TemplateTask {
  readonly name: string;
  readonly description?: string;
  readonly status: string;
  readonly priority: Priority;
  readonly estimatedHours?: number;
  readonly dependencies: string[];
}

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';
export type ProjectPermission = 'view' | 'edit' | 'delete' | 'manage_members' | 'manage_settings';
export type BoardType = 'table' | 'kanban' | 'gantt' | 'calendar' | 'timeline' | 'dashboard';