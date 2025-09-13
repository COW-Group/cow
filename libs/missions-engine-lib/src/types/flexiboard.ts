export type FlexiBoardViewType = 'kanban' | 'table' | 'calendar' | 'timeline' | 'dashboard' | 'gantt' | 'chart' | 'form' | 'map' | 'cards' | 'files';

export type ColumnType = 
  | 'text' 
  | 'long-text'
  | 'number' 
  | 'date' 
  | 'datetime'
  | 'status' 
  | 'priority' 
  | 'person' 
  | 'team'
  | 'file' 
  | 'progress' 
  | 'timeline'
  | 'tags'
  | 'dropdown'
  | 'multiselect'
  | 'currency'
  | 'rating'
  | 'checkbox'
  | 'email'
  | 'phone'
  | 'url'
  | 'location'
  | 'formula'
  | 'lookup'
  | 'connect-boards'
  | 'mirror'
  | 'auto-number'
  | 'creation-log'
  | 'last-updated'
  | 'vote'
  | 'world-clock'
  | 'week'
  | 'button'
  | 'color-picker';

export type BusinessAppType = 
  | 'tokenization'
  | 'due-diligence'
  | 'partnership'
  | 'ipo'
  | 'campaign'
  | 'relationship'
  | 'event'
  | 'compliance'
  | 'filing'
  | 'audit'
  | 'content'
  | 'crm'
  | 'project-management'
  | 'marketing'
  | 'hr'
  | 'sales'
  | 'finance'
  | 'operations'
  | 'custom';

export type BoardTemplate = 
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

export interface BoardTemplateConfig {
  id: BoardTemplate;
  label: string;
  singular: string;
  plural: string;
  description: string;
  defaultColumns: any[];
  frozenColumns: string[];
  primaryColumn?: string;
}

// Advanced column configuration types
export interface ColumnFormula {
  expression: string;
  dependencies: string[];
  resultType: 'number' | 'text' | 'date' | 'boolean';
}

export interface ColumnLookup {
  sourceBoard: string;
  sourceColumn: string;
  linkColumn: string;
  displayColumn?: string;
}

export interface ColumnConnectBoards {
  linkedBoard: string;
  linkType: 'one-to-many' | 'many-to-many';
  mirrorColumns?: string[];
}

export interface ColumnAutomation {
  trigger: 'on-create' | 'on-change' | 'on-time' | 'on-status-change';
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
}

export interface FlexiBoardColumn {
  id: string;
  title: string;
  type: ColumnType;
  width?: number;
  required?: boolean;
  options?: string[] | { label: string; value: any; color?: string }[];
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
    unique?: boolean;
  };
  formula?: ColumnFormula;
  lookup?: ColumnLookup;
  connectBoards?: ColumnConnectBoards;
  automation?: ColumnAutomation[];
  settings?: {
    showInCard?: boolean;
    hideEmpty?: boolean;
    prefix?: string;
    suffix?: string;
    decimalPlaces?: number;
    dateFormat?: string;
    timeZone?: string;
    allowMultiple?: boolean;
    restrictToTeam?: boolean;
  };
  permissions?: {
    canEdit?: string[];
    canView?: string[];
    readOnly?: boolean;
  };
}

export interface FlexiBoardItem {
  id: string;
  boardId: string;
  data: Record<string, any>;
  status?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assignees?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  parentId?: string;
  position: number;
}

export interface FlexiBoardGroup {
  id: string;
  title: string;
  color: string;
  items: FlexiBoardItem[];
  collapsed?: boolean;
}

export interface FlexiBoardFilter {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in' | 'empty';
  value: any;
  conjunction?: 'and' | 'or';
}

export interface FlexiBoardSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FlexiBoardView {
  id: string;
  name: string;
  type: FlexiBoardViewType;
  isDefault?: boolean;
  filters: FlexiBoardFilter[];
  sorts: FlexiBoardSort[];
  groupBy?: string;
  visibleColumns?: string[];
  settings?: Record<string, any>;
}

export interface FlexiBoard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  workspace: string;
  businessApp?: BusinessAppType;
  template: string; // Template type identifier
  templateConfig?: BoardTemplateConfig;
  columns: FlexiBoardColumn[];
  views: FlexiBoardView[];
  activeViewId: string;
  items: FlexiBoardItem[];
  groups?: FlexiBoardGroup[];
  automations?: FlexiBoardAutomation[];
  integrations?: FlexiBoardIntegration[];
  activities?: FlexiBoardActivity[];
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canComment: boolean;
    canManageAutomations: boolean;
    canExport: boolean;
    canDuplicate: boolean;
  };
  settings: {
    allowComments: boolean;
    enableNotifications: boolean;
    showSubItems: boolean;
    colorCoding: boolean;
    enableAutomations: boolean;
    trackTime: boolean;
    requireApproval: boolean;
    showUpdates: boolean;
    enableIntegrations: boolean;
    allowBulkOperations: boolean;
  };
  sharing?: {
    isPublic: boolean;
    sharedWith: { userId: string; role: 'viewer' | 'editor' | 'admin' }[];
    publicUrl?: string;
    embedEnabled: boolean;
  };
  templateMetadata?: {
    isTemplate: boolean;
    category?: string;
    tags?: string[];
    useCount?: number;
  };
  customization?: {
    brandColor?: string;
    logo?: string;
    coverImage?: string;
    customFields?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActivity?: Date;
  archivedAt?: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: BusinessAppType;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: string;
  team: string[];
  boards: string[];
  startDate: Date;
  endDate?: Date;
  milestones: Milestone[];
  budget?: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  dependencies?: string[];
}

// Automation system types
export interface AutomationCondition {
  column: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater' | 'less' | 'is-empty' | 'is-not-empty' | 'changed-to' | 'changed-from';
  value: any;
  logicalOperator?: 'and' | 'or';
}

export interface AutomationAction {
  type: 'change-status' | 'assign-person' | 'move-to-group' | 'create-item' | 'send-notification' | 'send-email' | 'archive-item' | 'duplicate-item' | 'change-column-value' | 'create-update' | 'add-to-board';
  targetColumn?: string;
  value?: any;
  message?: string;
  recipients?: string[];
  template?: string;
  delay?: number; // in minutes
}

export interface FlexiBoardAutomation {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: 'when-status-changes' | 'when-date-arrives' | 'when-column-changes' | 'every-time-period' | 'when-item-created' | 'when-item-moved';
    column?: string;
    value?: any;
    schedule?: {
      frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
      time?: string;
      days?: number[];
    };
  };
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  createdBy: string;
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
}

// Notification and activity tracking
export interface FlexiBoardActivity {
  id: string;
  boardId: string;
  itemId?: string;
  type: 'item-created' | 'item-updated' | 'item-deleted' | 'item-moved' | 'column-added' | 'column-updated' | 'automation-triggered' | 'user-mentioned' | 'status-changed' | 'file-uploaded';
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  data: Record<string, any>;
  message?: string;
  mentions?: string[];
}

export interface FlexiBoardNotification {
  id: string;
  userId: string;
  boardId: string;
  itemId?: string;
  type: 'mention' | 'assignment' | 'deadline' | 'status-change' | 'automation' | 'comment';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Bulk operations
export interface BulkOperation {
  type: 'update' | 'delete' | 'move' | 'duplicate' | 'archive';
  itemIds: string[];
  data?: Record<string, any>;
  targetGroupId?: string;
  targetBoardId?: string;
}

export interface BulkOperationResult {
  success: boolean;
  processedItems: number;
  failedItems: number;
  errors?: { itemId: string; error: string }[];
}

// Integration types
export interface FlexiBoardIntegration {
  id: string;
  name: string;
  type: 'email' | 'calendar' | 'storage' | 'crm' | 'time-tracking' | 'communication' | 'custom';
  config: Record<string, any>;
  enabled: boolean;
  lastSync?: Date;
}

// Dashboard and reporting
export interface FlexiBoardWidget {
  id: string;
  type: 'chart' | 'number' | 'progress' | 'timeline' | 'activity' | 'table';
  title: string;
  config: {
    boardId: string;
    columns?: string[];
    filters?: FlexiBoardFilter[];
    groupBy?: string;
    chartType?: 'bar' | 'line' | 'pie' | 'doughnut';
    period?: 'week' | 'month' | 'quarter' | 'year';
    size: 'small' | 'medium' | 'large';
  };
  position: { x: number; y: number; w: number; h: number };
}

export interface FlexiBoardDashboard {
  id: string;
  name: string;
  widgets: FlexiBoardWidget[];
  shared: boolean;
  sharedWith?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  businessApp: BusinessAppType;
  boards: Partial<FlexiBoard>[];
  defaultMilestones: Omit<Milestone, 'id'>[];
  defaultAutomations?: Omit<FlexiBoardAutomation, 'id'>[];
  estimatedDuration: number;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popularity: number;
  previewImage?: string;
}