export interface User {
  id: string;
  name: string;
  email: string;
  recentBoards: BoardPreview[];
}

export interface DashboardStats {
  leads: number;
  deals: number;
  accounts: number;
  activities: number;
}

export interface RecentActivity {
  id: string;
  description: string;
  iconType: 'lead' | 'deal' | 'meeting' | 'contact' | 'account';
  timestamp: Date;
  userId?: string;
}

export interface UpdateFeed {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
  type: 'notification' | 'mention' | 'update' | 'reminder';
}

export interface BoardPreview {
  id: string;
  slug: string;
  name: string;
  description: string;
  itemCount: number;
  lastVisited: Date;
  isStarred: boolean;
  color: string;
  iconType?: string;
  previewImage?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: 'User' | 'DollarSign' | 'Building' | 'Calendar' | 'Activity';
  route: string;
  iconColor: string;
  count?: number;
}

export interface HomeDashboardData {
  user: User;
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  updateFeed: UpdateFeed[];
  quickActions: QuickAction[];
}

export interface StatsCardProps {
  label: string;
  value: number;
  icon: 'User' | 'DollarSign' | 'Building' | 'TrendingUp';
  iconColor: string;
  bgColor: string;
  route?: string;
  onClick?: () => void;
}

export interface CardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface GreetingProps {
  userName: string;
  timeOfDay?: TimeOfDay;
}

// ============================================================================
// NEW: Advanced Home Page & Widget System (Inspired by Monday.com)
// ============================================================================

import { Widget, WidgetType, WidgetSize } from './app.types';

// Home Page Layout System
export interface HomePageLayout {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isPersonal: boolean; // vs shared team layout

  // Grid Configuration
  columns: number; // Grid columns (12, 16, 24)
  rowHeight: number; // Height of each grid row in pixels
  margin: [number, number]; // [horizontal, vertical] margins

  // Widgets
  widgets: HomePageWidget[];

  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface HomePageWidget extends Widget {
  // Extended properties for home page
  isDragging?: boolean;
  isResizing?: boolean;
  minSize?: WidgetSize;
  maxSize?: WidgetSize;

  // Conditional visibility
  conditions?: WidgetCondition[];
}

export interface WidgetCondition {
  type: 'time' | 'day' | 'user-role' | 'workspace' | 'custom';
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
  description: string;
}

// Home Page Templates
export interface HomePageTemplate {
  id: string;
  name: string;
  description: string;
  category: HomeTemplateCategory;
  preview: string; // Screenshot/preview image

  // Template data
  layout: Omit<HomePageLayout, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'usageCount'>;

  // Metadata
  isOfficial: boolean;
  popularity: number;
  tags: string[];
}

export type HomeTemplateCategory =
  | 'executive'
  | 'project-manager'
  | 'team-lead'
  | 'individual'
  | 'sales'
  | 'marketing'
  | 'developer'
  | 'analyst'
  | 'custom';

// Widget Library
export interface WidgetLibraryItem {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: WidgetCategory;

  // Configuration
  defaultSize: WidgetSize;
  supportedSizes: WidgetSize[];
  configSchema?: WidgetConfigSchema;

  // Requirements
  permissions?: string[];
  requiredApps?: string[];
  isPremium?: boolean;
}

export type WidgetCategory =
  | 'productivity'
  | 'analytics'
  | 'communication'
  | 'utilities'
  | 'entertainment'
  | 'apps';

export interface WidgetConfigSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'select' | 'multi-select' | 'color' | 'date';
    label: string;
    description?: string;
    required?: boolean;
    default?: any;
    options?: { value: any; label: string }[];
    min?: number;
    max?: number;
  };
}

// Home Page State Management
export interface HomePageStore {
  // Current layout
  currentLayout: HomePageLayout | null;
  availableLayouts: HomePageLayout[];
  templates: HomePageTemplate[];

  // Widget library
  widgetLibrary: WidgetLibraryItem[];

  // Editing state
  isEditing: boolean;
  isDragging: boolean;
  selectedWidget: string | null;

  // UI state
  showWidgetLibrary: boolean;
  showLayoutSelector: boolean;

  // Methods
  loadLayout: (layoutId: string) => Promise<void>;
  saveLayout: () => Promise<void>;
  createLayoutFromTemplate: (templateId: string) => Promise<string>;

  // Widget management
  addWidget: (type: WidgetType, position?: { x: number; y: number }) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<HomePageWidget>) => void;
  moveWidget: (widgetId: string, position: { x: number; y: number }) => void;
  resizeWidget: (widgetId: string, size: WidgetSize) => void;

  // Layout management
  toggleEditMode: () => void;
  resetLayout: () => void;
  duplicateLayout: (layoutId: string, newName: string) => Promise<string>;
  deleteLayout: (layoutId: string) => Promise<void>;
}

// Advanced Widget Data Types
export interface AdvancedQuickActionsData {
  recentBoards: Array<{
    id: string;
    name: string;
    icon?: string;
    lastAccessed: string;
  }>;
  favoriteActions: string[];
  customActions: Array<{
    id: string;
    name: string;
    icon: string;
    url: string;
    color?: string;
  }>;
}

export interface AdvancedBoardShortcutsData {
  pinnedBoards: Array<{
    id: string;
    name: string;
    description?: string;
    progress?: number;
    members?: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>;
    lastActivity: string;
    color?: string;
  }>;
  recentBoards: Array<{
    id: string;
    name: string;
    lastAccessed: string;
  }>;
}

export interface DashboardChartData {
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
  labels: string[];
  title?: string;
  subtitle?: string;
}

export interface CalendarEventData {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  description?: string;
  attendees?: string[];
  type: 'meeting' | 'deadline' | 'reminder' | 'milestone';
}

export interface TodoItemWidget {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  boardId?: string;
  itemId?: string;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'board-update' | 'task-completed' | 'comment' | 'file-upload' | 'status-change';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  boardId?: string;
  itemId?: string;
  metadata?: Record<string, any>;
}

// Home Page Themes
export interface HomePageTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
  };
  borderRadius: number;
  shadows: boolean;
  animations: boolean;
}

export interface HomePagePreferences {
  userId: string;

  // Layout preferences
  defaultLayoutId: string;
  compactMode: boolean;
  showWelcomeMessage: boolean;
  showRecentActivity: boolean;

  // Theme
  themeId: string;
  customTheme?: Partial<HomePageTheme>;

  // Widget preferences
  widgetAnimations: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds

  // Privacy
  showPersonalInfo: boolean;
  shareActivity: boolean;

  // Notifications
  enableNotifications: boolean;
  notificationTypes: string[];

  updatedAt: string;
}