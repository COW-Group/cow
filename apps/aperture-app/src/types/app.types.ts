// App Ecosystem Types - Inspired by Monday.com's App Marketplace
export type AppCategory =
  | 'productivity'
  | 'analytics'
  | 'communication'
  | 'integration'
  | 'automation'
  | 'project-management'
  | 'marketing'
  | 'sales'
  | 'hr'
  | 'finance'
  | 'custom';

export type AppType =
  | 'board-view'      // Custom board visualizations
  | 'widget'          // Dashboard widgets
  | 'integration'     // Third-party integrations
  | 'workflow'        // Automation tools
  | 'data-tool'       // Analytics and reporting
  | 'communication'   // Chat, video, notifications
  | 'custom';

export type AppStatus = 'active' | 'inactive' | 'installing' | 'error' | 'updating';

export type AppScope = 'board' | 'workspace' | 'global' | 'personal';

// Core App Interface
export interface App {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  version: string;
  category: AppCategory;
  type: AppType;
  scope: AppScope[];

  // Visual
  icon: string;
  screenshots: string[];
  banner?: string;
  color?: string;

  // Marketplace
  developer: string;
  rating: number;
  reviewCount: number;
  downloads: number;
  price: number; // 0 for free apps
  tags: string[];

  // Technical
  permissions: AppPermission[];
  requirements: AppRequirement[];
  integrations?: string[]; // External services

  // Metadata
  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  // App specific config
  config?: AppConfig;
  isOfficial?: boolean; // Monday.com official apps
  isFeatured?: boolean;
}

// App Configuration
export interface AppConfig {
  // Board view specific
  boardViewConfig?: {
    supportedColumnTypes: string[];
    customFilters?: boolean;
    exportOptions?: string[];
  };

  // Widget specific
  widgetConfig?: {
    sizes: WidgetSize[];
    refreshInterval?: number;
    configurable?: boolean;
  };

  // Integration specific
  integrationConfig?: {
    authType: 'oauth' | 'api-key' | 'webhook';
    endpoints: string[];
    dataSync?: boolean;
  };

  // General settings
  settings?: Record<string, any>;
}

export interface AppPermission {
  type: 'read' | 'write' | 'admin';
  resource: 'boards' | 'items' | 'users' | 'workspace' | 'notifications' | 'files';
  description: string;
}

export interface AppRequirement {
  type: 'plan' | 'feature' | 'integration';
  value: string;
  description: string;
}

// App Installation
export interface InstalledApp {
  id: string;
  appId: string;
  app: App;
  installedAt: string;
  installedBy: string;
  status: AppStatus;
  scope: AppScope;

  // Scope specific data
  workspaceId?: string;
  boardId?: string;
  userId?: string;

  // Configuration
  config: Record<string, any>;
  permissions: AppPermission[];

  // Usage
  lastUsed?: string;
  usageCount: number;
  isEnabled: boolean;
}

// App Marketplace
export interface AppMarketplaceFilters {
  category?: AppCategory;
  type?: AppType;
  scope?: AppScope;
  price?: 'free' | 'paid' | 'all';
  rating?: number;
  featured?: boolean;
  search?: string;
  tags?: string[];
}

export interface AppReview {
  id: string;
  appId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
    company?: string;
  };
}

// Widget System for Home Page
export type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2' | '3x1' | '1x3' | '3x2' | '2x3' | '3x3';

export interface Widget {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  position: { x: number; y: number };
  config: WidgetConfig;
  title?: string;
  isVisible: boolean;
  isEditable: boolean;
}

export type WidgetType =
  | 'quick-actions'
  | 'board-shortcuts'
  | 'recent-boards'
  | 'dashboard-chart'
  | 'calendar'
  | 'todo-list'
  | 'notifications'
  | 'app-shortcut'
  | 'custom-app'
  | 'metrics'
  | 'activity-feed'
  | 'weather'
  | 'clock';

export interface WidgetConfig {
  // Quick Actions Widget
  quickActions?: {
    actions: QuickAction[];
    layout: 'grid' | 'list';
  };

  // Board Shortcuts Widget
  boardShortcuts?: {
    boardIds: string[];
    showPreview: boolean;
    maxItems: number;
  };

  // Dashboard Chart Widget
  dashboardChart?: {
    chartType: 'line' | 'bar' | 'pie' | 'donut' | 'area';
    dataSource: string;
    timeRange: string;
    colors?: string[];
  };

  // Calendar Widget
  calendar?: {
    sources: string[];
    view: 'month' | 'week' | 'agenda';
    showWeekends: boolean;
  };

  // App Shortcut Widget
  appShortcut?: {
    appId: string;
    launchMode: 'inline' | 'popup' | 'new-tab';
  };

  // General widget settings
  refreshInterval?: number;
  theme?: 'light' | 'dark' | 'auto';
  showHeader?: boolean;
  customTitle?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: QuickActionType;
  config: Record<string, any>;
  color?: string;
}

export type QuickActionType =
  | 'create-board'
  | 'create-task'
  | 'schedule-meeting'
  | 'open-board'
  | 'run-automation'
  | 'open-app'
  | 'custom-url';

// App Store State
export interface AppStore {
  // Marketplace
  apps: App[];
  installedApps: InstalledApp[];
  featuredApps: App[];
  categories: AppCategory[];

  // Filters & Search
  filters: AppMarketplaceFilters;
  searchQuery: string;
  isLoading: boolean;

  // Installation
  installInProgress: string[]; // App IDs being installed

  // Methods
  searchApps: (query: string) => void;
  filterApps: (filters: AppMarketplaceFilters) => void;
  installApp: (appId: string, scope: AppScope, targetId?: string) => Promise<void>;
  uninstallApp: (installedAppId: string) => Promise<void>;
  updateAppConfig: (installedAppId: string, config: Record<string, any>) => Promise<void>;

  // Getters
  getAppsByCategory: (category: AppCategory) => App[];
  getInstalledAppsByScope: (scope: AppScope, targetId?: string) => InstalledApp[];
  isAppInstalled: (appId: string, scope?: AppScope, targetId?: string) => boolean;
}

// Board App Integration
export interface BoardAppIntegration {
  installedAppId: string;
  boardId: string;
  position: 'header' | 'sidebar' | 'footer' | 'overlay' | 'inline';
  config: Record<string, any>;
  isVisible: boolean;
  permissions: AppPermission[];
}

// App Development SDK Types (for future custom app development)
export interface AppSDK {
  // Board API
  getBoardData: (boardId: string) => Promise<any>;
  updateBoardItem: (boardId: string, itemId: string, data: any) => Promise<void>;
  createBoardItem: (boardId: string, data: any) => Promise<string>;

  // User API
  getCurrentUser: () => Promise<any>;
  getWorkspaceMembers: () => Promise<any[]>;

  // Notifications
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;

  // Storage
  getAppData: (key: string) => Promise<any>;
  setAppData: (key: string, value: any) => Promise<void>;

  // UI
  openModal: (component: React.ComponentType, props?: any) => void;
  closeModal: () => void;
  showSidebar: (component: React.ComponentType, props?: any) => void;
}