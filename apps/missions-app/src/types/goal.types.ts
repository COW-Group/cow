import { BaseEntity } from './base.types';
import { Priority } from './project.types';

export interface Goal extends BaseEntity {
  readonly workspaceId: string;
  readonly projectId?: string;
  readonly parentId?: string;
  readonly name: string;
  readonly description?: string;
  readonly type: GoalType;
  readonly status: GoalStatus;
  readonly targetValue?: number;
  readonly currentValue: number;
  readonly unit?: string;
  readonly ownerId: string;
  readonly startDate?: Date;
  readonly dueDate?: Date;
  readonly completedAt?: Date;
  readonly priority: Priority;
  readonly tags: string[];
  readonly linkedTasks: string[];
  readonly linkedProjects: string[];
  readonly progress: number;
  readonly metrics: GoalMetric[];
  readonly milestones: Milestone[];
}

export interface GoalMetric extends BaseEntity {
  readonly goalId: string;
  readonly name: string;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly unit: string;
  readonly type: MetricType;
  readonly dataSource?: string;
  readonly updateFrequency: UpdateFrequency;
  readonly lastUpdated: Date;
}

export interface Milestone extends BaseEntity {
  readonly goalId: string;
  readonly name: string;
  readonly description?: string;
  readonly dueDate?: Date;
  readonly completedAt?: Date;
  readonly status: MilestoneStatus;
  readonly position: number;
  readonly linkedTasks: string[];
}

export interface ObjectiveKeyResult extends BaseEntity {
  readonly workspaceId: string;
  readonly objectiveId: string;
  readonly name: string;
  readonly description?: string;
  readonly targetValue: number;
  readonly currentValue: number;
  readonly unit: string;
  readonly confidence: number; // 1-10
  readonly ownerId: string;
  readonly updateHistory: OKRUpdate[];
  readonly dueDate: Date;
}

export interface OKRUpdate extends BaseEntity {
  readonly keyResultId: string;
  readonly value: number;
  readonly confidence?: number;
  readonly notes?: string;
  readonly updatedBy: string;
}

export interface GoalTemplate extends BaseEntity {
  readonly workspaceId: string;
  readonly name: string;
  readonly description?: string;
  readonly type: GoalType;
  readonly targetValue?: number;
  readonly unit?: string;
  readonly category: string;
  readonly isPublic: boolean;
  readonly usageCount: number;
  readonly milestoneTemplates: MilestoneTemplate[];
}

export interface MilestoneTemplate {
  readonly name: string;
  readonly description?: string;
  readonly daysOffset: number; // days from goal start
  readonly position: number;
}

export type GoalType = 'objective' | 'key_result' | 'milestone' | 'initiative' | 'outcome';
export type GoalStatus = 'draft' | 'active' | 'at_risk' | 'completed' | 'cancelled' | 'paused';
export type MetricType = 'number' | 'percentage' | 'currency' | 'time' | 'boolean';
export type UpdateFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'manual';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';