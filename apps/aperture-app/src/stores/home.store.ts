import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  HomePageLayout,
  HomePageWidget,
  HomePageTemplate,
  HomeTemplateCategory,
  WidgetLibraryItem,
  HomePagePreferences,
  WidgetCategory
} from '../types/home.types';
import { WidgetType, WidgetSize } from '../types/app.types';

interface HomePageStore {
  // Current layout state
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
  showTemplateGallery: boolean;

  // User preferences
  preferences: HomePagePreferences | null;

  // Methods
  // Layout management
  loadLayout: (layoutId: string) => Promise<void>;
  saveLayout: () => Promise<void>;
  createLayoutFromTemplate: (templateId: string, name?: string) => Promise<string>;
  createBlankLayout: (name: string) => Promise<string>;

  // Widget management
  addWidget: (type: WidgetType, position?: { x: number; y: number }) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<HomePageWidget>) => void;
  moveWidget: (widgetId: string, position: { x: number; y: number }) => void;
  resizeWidget: (widgetId: string, size: WidgetSize) => void;
  duplicateWidget: (widgetId: string) => void;

  // Layout operations
  toggleEditMode: () => void;
  resetLayout: () => void;
  duplicateLayout: (layoutId: string, newName: string) => Promise<string>;
  deleteLayout: (layoutId: string) => Promise<void>;

  // UI state
  setSelectedWidget: (widgetId: string | null) => void;
  toggleWidgetLibrary: () => void;
  toggleLayoutSelector: () => void;
  toggleTemplateGallery: () => void;

  // Data loading
  loadTemplates: () => Promise<void>;
  loadWidgetLibrary: () => Promise<void>;
  loadPreferences: () => Promise<void>;
  savePreferences: (preferences: Partial<HomePagePreferences>) => Promise<void>;

  // Utilities
  getWidgetById: (widgetId: string) => HomePageWidget | undefined;
  findNextPosition: (size: WidgetSize) => { x: number; y: number };
}

// Mock templates
const mockTemplates: HomePageTemplate[] = [
  {
    id: 'executive-dashboard',
    name: 'Executive Dashboard',
    description: 'High-level overview with KPIs, metrics, and strategic insights',
    category: 'executive',
    preview: '/templates/executive-dashboard.jpg',
    layout: {
      name: 'Executive Dashboard',
      isDefault: false,
      isPersonal: false,
      columns: 24,
      rowHeight: 60,
      margin: [16, 16],
      widgets: [
        {
          id: 'kpi-overview',
          type: 'metrics',
          size: '3x2',
          position: { x: 0, y: 0 },
          title: 'Key Metrics',
          config: {
            dashboardChart: {
              chartType: 'line',
              dataSource: 'workspace-kpis',
              timeRange: '30d'
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'revenue-chart',
          type: 'dashboard-chart',
          size: '3x2',
          position: { x: 6, y: 0 },
          title: 'Revenue Trend',
          config: {
            dashboardChart: {
              chartType: 'area',
              dataSource: 'revenue',
              timeRange: '90d',
              colors: ['#4F46E5', '#06B6D4']
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'team-activity',
          type: 'activity-feed',
          size: '2x3',
          position: { x: 12, y: 0 },
          title: 'Team Activity',
          config: {},
          isVisible: true,
          isEditable: true
        }
      ]
    },
    isOfficial: true,
    popularity: 95,
    tags: ['executive', 'kpi', 'metrics', 'overview']
  },
  {
    id: 'project-manager',
    name: 'Project Manager Hub',
    description: 'Comprehensive project oversight with timelines, tasks, and team progress',
    category: 'project-manager',
    preview: '/templates/project-manager.jpg',
    layout: {
      name: 'Project Manager Hub',
      isDefault: false,
      isPersonal: true,
      columns: 24,
      rowHeight: 60,
      margin: [12, 12],
      widgets: [
        {
          id: 'quick-actions-pm',
          type: 'quick-actions',
          size: '2x1',
          position: { x: 0, y: 0 },
          title: 'Quick Actions',
          config: {
            quickActions: {
              actions: [
                { id: '1', label: 'New Project', icon: 'FolderPlus', action: 'create-board', config: {} },
                { id: '2', label: 'Add Task', icon: 'Plus', action: 'create-task', config: {} },
                { id: '3', label: 'Schedule Meeting', icon: 'Calendar', action: 'schedule-meeting', config: {} }
              ],
              layout: 'grid'
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'project-boards',
          type: 'board-shortcuts',
          size: '3x2',
          position: { x: 3, y: 0 },
          title: 'Active Projects',
          config: {
            boardShortcuts: {
              boardIds: ['board-1', 'board-2', 'board-3'],
              showPreview: true,
              maxItems: 6
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'calendar-widget',
          type: 'calendar',
          size: '2x2',
          position: { x: 9, y: 0 },
          title: 'Schedule',
          config: {
            calendar: {
              sources: ['workspace-events', 'deadlines'],
              view: 'month',
              showWeekends: false
            }
          },
          isVisible: true,
          isEditable: true
        }
      ]
    },
    isOfficial: true,
    popularity: 88,
    tags: ['project-manager', 'projects', 'timeline', 'tasks']
  },
  {
    id: 'personal-productivity',
    name: 'Personal Productivity',
    description: 'Individual workspace with tasks, calendar, and personal tools',
    category: 'individual',
    preview: '/templates/personal-productivity.jpg',
    layout: {
      name: 'Personal Productivity',
      isDefault: true,
      isPersonal: true,
      columns: 16,
      rowHeight: 80,
      margin: [16, 16],
      widgets: [
        {
          id: 'my-tasks',
          type: 'todo-list',
          size: '2x2',
          position: { x: 0, y: 0 },
          title: 'My Tasks',
          config: {},
          isVisible: true,
          isEditable: true
        },
        {
          id: 'recent-boards-personal',
          type: 'recent-boards',
          size: '2x1',
          position: { x: 3, y: 0 },
          title: 'Recent Work',
          config: {
            boardShortcuts: {
              boardIds: [],
              showPreview: false,
              maxItems: 5
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'notifications-widget',
          type: 'notifications',
          size: '2x2',
          position: { x: 6, y: 0 },
          title: 'Updates',
          config: {},
          isVisible: true,
          isEditable: true
        }
      ]
    },
    isOfficial: true,
    popularity: 92,
    tags: ['personal', 'productivity', 'tasks', 'individual']
  },
  {
    id: 'sales-dashboard',
    name: 'Sales Dashboard',
    description: 'Track leads, deals, and sales performance with actionable insights',
    category: 'sales',
    preview: '/templates/sales-dashboard.jpg',
    layout: {
      name: 'Sales Dashboard',
      isDefault: false,
      isPersonal: false,
      columns: 24,
      rowHeight: 60,
      margin: [12, 12],
      widgets: [
        {
          id: 'sales-metrics',
          type: 'metrics',
          size: '3x1',
          position: { x: 0, y: 0 },
          title: 'Sales Metrics',
          config: {},
          isVisible: true,
          isEditable: true
        },
        {
          id: 'pipeline-chart',
          type: 'dashboard-chart',
          size: '3x2',
          position: { x: 4, y: 0 },
          title: 'Sales Pipeline',
          config: {
            dashboardChart: {
              chartType: 'bar',
              dataSource: 'sales-pipeline',
              timeRange: '30d'
            }
          },
          isVisible: true,
          isEditable: true
        },
        {
          id: 'leads-board',
          type: 'board-shortcuts',
          size: '2x2',
          position: { x: 8, y: 0 },
          title: 'Active Leads',
          config: {
            boardShortcuts: {
              boardIds: ['leads-board'],
              showPreview: true,
              maxItems: 10
            }
          },
          isVisible: true,
          isEditable: true
        }
      ]
    },
    isOfficial: true,
    popularity: 83,
    tags: ['sales', 'leads', 'pipeline', 'metrics']
  }
];

// Widget library matching available components
const mockWidgetLibrary: WidgetLibraryItem[] = [
  {
    type: 'welcome',
    name: 'Welcome Widget',
    description: 'Personalized welcome message with time-based greetings',
    icon: '👋',
    category: 'productivity',
    defaultSize: '2x2',
    supportedSizes: ['2x2', '3x2'],
    configSchema: {}
  },
  {
    type: 'shortcuts',
    name: 'Shortcuts',
    description: 'Quick navigation shortcuts to your important pages',
    icon: '🚀',
    category: 'productivity',
    defaultSize: '2x1',
    supportedSizes: ['2x1', '3x1', '2x2'],
    configSchema: {}
  },
  {
    type: 'recent-boards',
    name: 'Recent Boards',
    description: 'Quick access to your recently accessed boards',
    icon: '📋',
    category: 'productivity',
    defaultSize: '2x2',
    supportedSizes: ['2x2', '3x2'],
    configSchema: {}
  },
  {
    type: 'calendar',
    name: 'Calendar',
    description: 'View your schedule and upcoming events',
    icon: '📅',
    category: 'productivity',
    defaultSize: '2x2',
    supportedSizes: ['2x2', '3x2', '2x3'],
    configSchema: {}
  },
  {
    type: 'activity-feed',
    name: 'Activity Feed',
    description: 'Recent activity across your workspace',
    icon: '📈',
    category: 'communication',
    defaultSize: '2x3',
    supportedSizes: ['2x2', '2x3', '3x3'],
    configSchema: {}
  },
  {
    type: 'stats',
    name: 'Quick Stats',
    description: 'Key metrics and statistics overview',
    icon: '📊',
    category: 'analytics',
    defaultSize: '2x1',
    supportedSizes: ['2x1', '3x1', '2x2'],
    configSchema: {}
  },
];

// Default layout using available widgets
const defaultLayout: HomePageLayout = {
  id: 'default-layout',
  name: 'My Home',
  description: 'Your personalized workspace',
  isDefault: true,
  isPersonal: true,
  columns: 3,
  rowHeight: 80,
  margin: [16, 16],
  widgets: [
    {
      id: 'welcome-widget',
      type: 'welcome',
      size: '2x2',
      position: { x: 0, y: 0 },
      title: 'Welcome',
      config: {},
      isVisible: true,
      isEditable: true
    },
    {
      id: 'shortcuts-widget',
      type: 'shortcuts',
      size: '2x1',
      position: { x: 0, y: 1 },
      title: 'Shortcuts',
      config: {},
      isVisible: true,
      isEditable: true
    },
    {
      id: 'recent-boards-widget',
      type: 'recent-boards',
      size: '2x2',
      position: { x: 1, y: 0 },
      title: 'Recent Boards',
      config: {},
      isVisible: true,
      isEditable: true
    },
    {
      id: 'calendar-widget',
      type: 'calendar',
      size: '2x2',
      position: { x: 2, y: 0 },
      title: 'Calendar',
      config: {},
      isVisible: true,
      isEditable: true
    }
  ],
  createdBy: 'current-user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  usageCount: 0
};

// Store implementation
export const useHomePageStore = create<HomePageStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentLayout: null,
    availableLayouts: [],
    templates: [],
    widgetLibrary: [],

    // Editing state
    isEditing: false,
    isDragging: false,
    selectedWidget: null,

    // UI state
    showWidgetLibrary: false,
    showLayoutSelector: false,
    showTemplateGallery: false,

    // User preferences
    preferences: null,

    // Layout management
    loadLayout: async (layoutId: string) => {
      const { availableLayouts } = get();

      let layout = availableLayouts.find(l => l.id === layoutId);

      if (!layout && layoutId === 'default') {
        layout = defaultLayout;
      }

      if (layout) {
        set({ currentLayout: layout });
      }
    },

    saveLayout: async () => {
      const { currentLayout } = get();
      if (!currentLayout) return;

      // Update the layout in availableLayouts
      set(state => ({
        availableLayouts: state.availableLayouts.map(layout =>
          layout.id === currentLayout.id
            ? { ...currentLayout, updatedAt: new Date().toISOString() }
            : layout
        ),
        currentLayout: { ...currentLayout, updatedAt: new Date().toISOString() }
      }));
    },

    createLayoutFromTemplate: async (templateId: string, name?: string) => {
      const { templates } = get();
      const template = templates.find(t => t.id === templateId);

      if (!template) throw new Error('Template not found');

      const newLayout: HomePageLayout = {
        id: `layout-${Date.now()}`,
        ...template.layout,
        name: name || `${template.name} (Copy)`,
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      };

      set(state => ({
        availableLayouts: [...state.availableLayouts, newLayout],
        currentLayout: newLayout
      }));

      return newLayout.id;
    },

    createBlankLayout: async (name: string) => {
      const newLayout: HomePageLayout = {
        id: `layout-${Date.now()}`,
        name,
        description: 'Custom layout',
        isDefault: false,
        isPersonal: true,
        columns: 16,
        rowHeight: 80,
        margin: [16, 16],
        widgets: [],
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      };

      set(state => ({
        availableLayouts: [...state.availableLayouts, newLayout],
        currentLayout: newLayout
      }));

      return newLayout.id;
    },

    // Widget management
    addWidget: (type: WidgetType, position?: { x: number; y: number }) => {
      const { currentLayout, widgetLibrary, findNextPosition } = get();
      if (!currentLayout) return;

      const widgetMeta = widgetLibrary.find(w => w.type === type);
      if (!widgetMeta) return;

      const widgetPosition = position || findNextPosition(widgetMeta.defaultSize);

      const newWidget: HomePageWidget = {
        id: `widget-${Date.now()}`,
        type,
        size: widgetMeta.defaultSize,
        position: widgetPosition,
        title: widgetMeta.name,
        config: {},
        isVisible: true,
        isEditable: true
      };

      set({
        currentLayout: {
          ...currentLayout,
          widgets: [...currentLayout.widgets, newWidget]
        }
      });
    },

    removeWidget: (widgetId: string) => {
      const { currentLayout } = get();
      if (!currentLayout) return;

      set({
        currentLayout: {
          ...currentLayout,
          widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
        },
        selectedWidget: null
      });
    },

    updateWidget: (widgetId: string, updates: Partial<HomePageWidget>) => {
      const { currentLayout } = get();
      if (!currentLayout) return;

      set({
        currentLayout: {
          ...currentLayout,
          widgets: currentLayout.widgets.map(w =>
            w.id === widgetId ? { ...w, ...updates } : w
          )
        }
      });
    },

    moveWidget: (widgetId: string, position: { x: number; y: number }) => {
      const { updateWidget } = get();
      updateWidget(widgetId, { position });
    },

    resizeWidget: (widgetId: string, size: WidgetSize) => {
      const { updateWidget } = get();
      updateWidget(widgetId, { size });
    },

    duplicateWidget: (widgetId: string) => {
      const { currentLayout } = get();
      if (!currentLayout) return;

      const widget = currentLayout.widgets.find(w => w.id === widgetId);
      if (!widget) return;

      const newWidget: HomePageWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
        position: { x: widget.position.x + 2, y: widget.position.y + 1 },
        title: `${widget.title} (Copy)`
      };

      set({
        currentLayout: {
          ...currentLayout,
          widgets: [...currentLayout.widgets, newWidget]
        }
      });
    },

    // Layout operations
    toggleEditMode: () => {
      set(state => ({
        isEditing: !state.isEditing,
        selectedWidget: null
      }));
    },

    resetLayout: () => {
      set({
        currentLayout: defaultLayout,
        selectedWidget: null,
        isEditing: false
      });
    },

    duplicateLayout: async (layoutId: string, newName: string) => {
      const { availableLayouts } = get();
      const layout = availableLayouts.find(l => l.id === layoutId);

      if (!layout) throw new Error('Layout not found');

      const newLayout: HomePageLayout = {
        ...layout,
        id: `layout-${Date.now()}`,
        name: newName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      };

      set(state => ({
        availableLayouts: [...state.availableLayouts, newLayout]
      }));

      return newLayout.id;
    },

    deleteLayout: async (layoutId: string) => {
      set(state => ({
        availableLayouts: state.availableLayouts.filter(l => l.id !== layoutId),
        currentLayout: state.currentLayout?.id === layoutId ? null : state.currentLayout
      }));
    },

    // UI state
    setSelectedWidget: (widgetId: string | null) => {
      set({ selectedWidget: widgetId });
    },

    toggleWidgetLibrary: () => {
      set(state => ({ showWidgetLibrary: !state.showWidgetLibrary }));
    },

    toggleLayoutSelector: () => {
      set(state => ({ showLayoutSelector: !state.showLayoutSelector }));
    },

    toggleTemplateGallery: () => {
      set(state => ({ showTemplateGallery: !state.showTemplateGallery }));
    },

    // Data loading
    loadTemplates: async () => {
      set({ templates: mockTemplates });
    },

    loadWidgetLibrary: async () => {
      set({ widgetLibrary: mockWidgetLibrary });
    },

    loadPreferences: async () => {
      // Mock preferences
      const mockPreferences: HomePagePreferences = {
        userId: 'current-user',
        defaultLayoutId: 'default-layout',
        compactMode: false,
        showWelcomeMessage: true,
        showRecentActivity: true,
        themeId: 'default',
        widgetAnimations: true,
        autoRefresh: true,
        refreshInterval: 300,
        showPersonalInfo: true,
        shareActivity: false,
        enableNotifications: true,
        notificationTypes: ['mentions', 'updates', 'deadlines'],
        updatedAt: new Date().toISOString()
      };

      set({ preferences: mockPreferences });
    },

    savePreferences: async (preferences: Partial<HomePagePreferences>) => {
      set(state => ({
        preferences: state.preferences
          ? { ...state.preferences, ...preferences, updatedAt: new Date().toISOString() }
          : null
      }));
    },

    // Utilities
    getWidgetById: (widgetId: string) => {
      const { currentLayout } = get();
      return currentLayout?.widgets.find(w => w.id === widgetId);
    },

    findNextPosition: (size: WidgetSize) => {
      const { currentLayout } = get();
      if (!currentLayout) return { x: 0, y: 0 };

      const [width] = size.split('x').map(Number);

      // Simple algorithm: find first available position
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x <= currentLayout.columns - width; x++) {
          const isOccupied = currentLayout.widgets.some(widget => {
            const [w, h] = widget.size.split('x').map(Number);
            return (
              x < widget.position.x + w &&
              x + width > widget.position.x &&
              y < widget.position.y + h &&
              y + 1 > widget.position.y
            );
          });

          if (!isOccupied) {
            return { x, y };
          }
        }
      }

      return { x: 0, y: 0 };
    }
  }))
);