// Re-export all types for easy imports
export * from './base.types';
export * from './workspace.types';
export * from './project.types';
export * from './board.types';
export * from './task.types';
export * from './goal.types';

// Additional utility types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  assignee?: string[];
  priority?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  customFilters?: Record<string, any>;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  teamId?: string;
  templateId?: string;
  settings?: Partial<import('./project.types').ProjectSettings>;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: import('./project.types').ProjectStatus;
  priority?: import('./project.types').Priority;
  startDate?: Date;
  dueDate?: Date;
  budget?: number;
  tags?: string[];
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  projectId: string;
  boardId?: string;
  sectionId?: string;
  parentId?: string;
  assigneeId?: string;
  priority?: import('./project.types').Priority;
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  status?: import('./task.types').TaskStatus;
  priority?: import('./project.types').Priority;
  assigneeId?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface CreateGoalRequest {
  name: string;
  description?: string;
  type: import('./goal.types').GoalType;
  targetValue?: number;
  unit?: string;
  projectId?: string;
  parentId?: string;
  dueDate?: Date;
  priority?: import('./project.types').Priority;
  tags?: string[];
}

export interface ViewConfig {
  type: import('./project.types').BoardType;
  filters: FilterOptions;
  sort: SortOptions;
  groupBy?: string;
  columns?: string[];
  showSubtasks?: boolean;
  compactMode?: boolean;
}