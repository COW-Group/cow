import { BaseEntity } from './base.types';
import { BoardType } from './project.types';

export interface Board extends BaseEntity {
  readonly projectId: string;
  readonly name: string;
  readonly type: BoardType;
  readonly config: BoardConfig;
  readonly isDefault: boolean;
  readonly sections: BoardSection[];
  readonly position: number;
}

export interface BoardConfig {
  readonly columns?: ColumnConfig[];
  readonly filters?: FilterConfig;
  readonly groupBy?: GroupByConfig;
  readonly sortBy?: SortConfig;
  readonly customFields?: string[];
  readonly viewSettings?: ViewSettings;
}

export interface ColumnConfig {
  readonly id: string;
  readonly name: string;
  readonly type: ColumnType;
  readonly width?: number;
  readonly visible: boolean;
  readonly sortable: boolean;
  readonly filterable: boolean;
}

export interface FilterConfig {
  readonly status: string[];
  readonly assignee: string[];
  readonly priority: string[];
  readonly tags: string[];
  readonly dateRange?: DateRange;
  readonly customFilters: Record<string, any>;
}

export interface GroupByConfig {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
  readonly showEmpty: boolean;
}

export interface SortConfig {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

export interface ViewSettings {
  readonly showSubtasks: boolean;
  readonly showDependencies: boolean;
  readonly showCustomFields: boolean;
  readonly compactMode: boolean;
  readonly colorByField?: string;
}

export interface BoardSection extends BaseEntity {
  readonly boardId: string;
  readonly name: string;
  readonly color?: string;
  readonly position: number;
  readonly taskIds: string[];
  readonly isCollapsed: boolean;
  readonly wipLimit?: number;
}

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}

export type ColumnType = 'text' | 'status' | 'priority' | 'assignee' | 'date' | 'number' | 'progress' | 'tags' | 'custom' | 'person' | 'numbers' | 'timeline' | 'checkbox' | 'files' | 'connect-boards' | 'mirror';

// New types for board creation and management
export type PrivacyType = 'main' | 'private' | 'shareable';

export type ManagementType = 
  | 'items' 
  | 'budgets' 
  | 'employees' 
  | 'campaigns' 
  | 'leads' 
  | 'projects' 
  | 'creatives' 
  | 'clients' 
  | 'tasks' 
  | 'custom';

export interface StatusLabel {
  id: string;
  label: string;
  color: string;
  textColor?: string;
}

export interface CreateBoardRequest {
  name: string;
  privacy: PrivacyType;
  managementType: ManagementType;
  customManagementType?: string;
}

export interface BoardManagementView extends Board {
  privacy: PrivacyType;
  managementType: ManagementType;
  customManagementType?: string;
  statusLabels: StatusLabel[];
}

export interface TableItem {
  id: string;
  name: string;
  person?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status?: StatusLabel;
  date?: string;
  [key: string]: any;
}

export interface TableGroup {
  id: string;
  title: string;
  color?: string;
  collapsed?: boolean;
  items: TableItem[];
}

// Extended Board interface for CRM with item counts and navigation
export interface CRMBoard extends BaseEntity {
  slug: string;
  name: string;
  iconColor: string;
  itemCount: number;
  workspaceId: string;
}

// Workspace with boards
export interface WorkspaceWithBoards extends BaseEntity {
  name: string;
  color: string;
  boards: CRMBoard[];
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  count?: number;
  isSelected?: boolean;
}

// Enhanced Board structure for grouped table view
export interface BoardGroup {
  id: string;
  title: string;
  color: string;
  collapsed?: boolean;
  items: BoardItem[];
}

export interface BoardItem {
  id: string;
  name: string;
  person?: PersonAssignment[];
  status?: StatusLabel;
  date?: string;
  checked?: boolean;
  [key: string]: any; // Allow additional custom fields
}

export interface PersonAssignment {
  id: string;
  name: string;
  avatar?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
  type: 'checkbox' | 'text' | 'person' | 'status' | 'date' | 'custom';
  width: number;
  visible: boolean;
  sortable?: boolean;
}

export interface EnhancedBoard extends BaseEntity {
  slug: string;
  name: string;
  groups: BoardGroup[];
  columns: BoardColumn[];
  workspaceId: string;
}

// COW Board Management System - Enhanced board functionality
export interface COWBoard extends BaseEntity {
  title: string;
  description?: string;
  isStarred: boolean;
  createdBy: PersonAssignment;
  members: PersonAssignment[];
  groups: COWBoardGroup[];
  activities: BoardActivity[];
  labels: BoardLabel[];
  columnOrder: ComponentType[]; // Order of column components
  availableColumns: ComponentType[]; // Available column types
  viewType: BoardViewType;
}

export interface COWBoardGroup {
  id: string;
  title: string;
  color: string;
  position: number;
  tasks: COWBoardTask[];
  isCollapsed?: boolean;
}

export interface COWBoardTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: number;
  assigneeIds: string[];
  number?: number;
  fileUrl?: string;
  progress?: number;
  updatedBy: TaskUpdateInfo;
  comments: TaskComment[];
  customFields: Record<string, any>;
}

export interface TaskUpdateInfo {
  date: number;
  userId: string;
  userAvatar?: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: number;
  editedAt?: number;
  style?: TextStyle;
}

export interface TextStyle {
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
}

export interface BoardActivity {
  id: string;
  type: BoardActivityType;
  taskId?: string;
  taskTitle?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: number;
  changes?: ActivityChange;
}

export interface ActivityChange {
  field: string;
  oldValue?: any;
  newValue?: any;
}

export interface BoardLabel {
  id: string;
  title: string;
  color: string;
  type: 'status' | 'priority' | 'custom';
}

export type BoardActivityType = 
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'status_changed'
  | 'priority_changed'
  | 'assignee_changed'
  | 'date_changed'
  | 'comment_added'
  | 'file_uploaded'
  | 'member_added'
  | 'group_created';

export type ComponentType = 
  | 'assignee-picker'
  | 'status-picker'
  | 'priority-picker'
  | 'date-picker'
  | 'number-picker'
  | 'file-picker'
  | 'progress-picker'
  | 'updated-picker'
  | 'checkbox-picker'
  | 'text-picker';

export type BoardViewType = 
  | 'table'
  | 'kanban'
  | 'dashboard'
  | 'timeline'
  | 'calendar';

// Board interaction interfaces
export interface BoardFilter {
  title: string;
  assigneeId: string;
  status: string[];
  priority: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ModalState {
  isOpen: boolean;
  position: {
    x: number;
    y: number;
  };
  type?: string;
  context?: {
    boardId?: string;
    groupId?: string;
    taskId?: string;
    columnType?: string;
    [key: string]: any;
  };
}

// Factory functions for creating empty objects
export const createEmptyBoard = (createdBy: PersonAssignment): COWBoard => ({
  id: '',
  title: 'New Board',
  description: '',
  isStarred: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy,
  members: [createdBy],
  groups: [],
  activities: [],
  labels: getDefaultLabels(),
  columnOrder: ['assignee-picker', 'status-picker', 'priority-picker'],
  availableColumns: [
    'assignee-picker',
    'status-picker', 
    'priority-picker',
    'date-picker',
    'number-picker',
    'file-picker',
    'progress-picker',
    'updated-picker',
    'checkbox-picker',
    'text-picker'
  ],
  viewType: 'table'
});

export const createEmptyGroup = (): COWBoardGroup => ({
  id: '',
  title: 'New Group',
  color: '#579bfc',
  position: 0,
  tasks: [],
  isCollapsed: false
});

export const createEmptyTask = (): COWBoardTask => ({
  id: '',
  title: 'New Task',
  status: 'Not Started',
  priority: 'Medium',
  assigneeIds: [],
  updatedBy: {
    date: Date.now(),
    userId: '',
    userAvatar: ''
  },
  comments: [],
  customFields: {}
});

export const createEmptyComment = (authorId: string, authorName: string): TaskComment => ({
  id: '',
  content: '',
  authorId,
  authorName,
  authorAvatar: '',
  createdAt: Date.now(),
  style: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left'
  }
});

export const getDefaultLabels = (): BoardLabel[] => [
  { id: 'status-done', title: 'Done', color: '#00c875', type: 'status' },
  { id: 'status-working', title: 'Working on it', color: '#fdab3d', type: 'status' },
  { id: 'status-stuck', title: 'Stuck', color: '#e2445c', type: 'status' },
  { id: 'status-not-started', title: 'Not Started', color: '#c4c4c4', type: 'status' },
  { id: 'priority-high', title: 'High', color: '#e2445c', type: 'priority' },
  { id: 'priority-medium', title: 'Medium', color: '#fdab3d', type: 'priority' },
  { id: 'priority-low', title: 'Low', color: '#00c875', type: 'priority' },
  { id: 'priority-critical', title: 'Critical', color: '#bb3354', type: 'priority' }
];

export const getDefaultBoardFilter = (): BoardFilter => ({
  title: '',
  assigneeId: '',
  status: [],
  priority: []
});