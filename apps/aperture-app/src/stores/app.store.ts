import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  App,
  InstalledApp,
  AppMarketplaceFilters,
  AppCategory,
  AppScope,
  AppType,
  AppStatus
} from '../types/app.types';

interface AppStore {
  // Marketplace State
  apps: App[];
  installedApps: InstalledApp[];
  featuredApps: App[];
  categories: AppCategory[];

  // UI State
  filters: AppMarketplaceFilters;
  searchQuery: string;
  isLoading: boolean;
  installInProgress: string[];

  // Current app details
  selectedApp: App | null;
  showAppDetails: boolean;

  // Methods
  // App Discovery
  searchApps: (query: string) => void;
  filterApps: (filters: AppMarketplaceFilters) => void;
  clearFilters: () => void;

  // App Details
  selectApp: (appId: string) => void;
  closeAppDetails: () => void;

  // App Installation
  installApp: (appId: string, scope: AppScope, targetId?: string) => Promise<void>;
  uninstallApp: (installedAppId: string) => Promise<void>;
  updateAppConfig: (installedAppId: string, config: Record<string, any>) => Promise<void>;
  toggleAppStatus: (installedAppId: string) => Promise<void>;

  // Data Loading
  loadApps: () => Promise<void>;
  loadInstalledApps: () => Promise<void>;
  loadFeaturedApps: () => Promise<void>;

  // Getters (computed values)
  getFilteredApps: () => App[];
  getAppsByCategory: (category: AppCategory) => App[];
  getInstalledAppsByScope: (scope: AppScope, targetId?: string) => InstalledApp[];
  isAppInstalled: (appId: string, scope?: AppScope, targetId?: string) => boolean;
}

// Mock data for apps marketplace
const mockApps: App[] = [
  {
    id: 'time-tracker',
    name: 'Time Tracker Pro',
    description: 'Advanced time tracking with detailed analytics and reporting. Track time across projects, generate timesheets, and analyze productivity patterns.',
    shortDescription: 'Track time across all your projects',
    version: '2.1.0',
    category: 'productivity',
    type: 'widget',
    scope: ['board', 'workspace'],
    icon: '⏰',
    screenshots: ['/screenshots/time-tracker-1.jpg', '/screenshots/time-tracker-2.jpg'],
    banner: '/banners/time-tracker.jpg',
    color: '#4A90E2',
    developer: 'Productivity Labs',
    rating: 4.8,
    reviewCount: 1247,
    downloads: 15420,
    price: 0,
    tags: ['time', 'productivity', 'analytics', 'reporting'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board data to track time on items' },
      { type: 'write', resource: 'items', description: 'Update items with time tracking data' }
    ],
    requirements: [
      { type: 'plan', value: 'basic', description: 'Available on Basic plan and above' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-01T14:30:00Z',
    publishedAt: '2024-02-01T09:00:00Z',
    isOfficial: false,
    isFeatured: true,
    config: {
      widgetConfig: {
        sizes: ['2x1', '2x2', '3x2'],
        refreshInterval: 30,
        configurable: true
      }
    }
  },
  {
    id: 'slack-integration',
    name: 'Slack for Teams',
    description: 'Seamlessly connect your workspace with Slack. Get notifications, create items from messages, and sync updates bidirectionally.',
    shortDescription: 'Connect your workspace to Slack',
    version: '3.0.1',
    category: 'communication',
    type: 'integration',
    scope: ['workspace', 'board'],
    icon: '💬',
    screenshots: ['/screenshots/slack-1.jpg'],
    developer: 'Official Integration',
    rating: 4.9,
    reviewCount: 3421,
    downloads: 45680,
    price: 0,
    tags: ['slack', 'communication', 'notifications', 'sync'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board updates for Slack notifications' },
      { type: 'write', resource: 'items', description: 'Create items from Slack messages' },
      { type: 'read', resource: 'users', description: 'Match Slack users with workspace members' }
    ],
    requirements: [
      { type: 'integration', value: 'slack', description: 'Requires Slack workspace' }
    ],
    integrations: ['slack'],
    createdAt: '2023-08-10T10:00:00Z',
    updatedAt: '2024-08-15T11:20:00Z',
    publishedAt: '2023-09-01T08:00:00Z',
    isOfficial: true,
    isFeatured: true,
    config: {
      integrationConfig: {
        authType: 'oauth',
        endpoints: ['/api/slack/webhook', '/api/slack/actions'],
        dataSync: true
      }
    }
  },
  {
    id: 'gantt-chart-pro',
    name: 'Advanced Gantt Charts',
    description: 'Create sophisticated project timelines with dependencies, critical path analysis, and resource management.',
    shortDescription: 'Professional project timeline management',
    version: '1.5.2',
    category: 'project-management',
    type: 'board-view',
    scope: ['board'],
    icon: '📊',
    screenshots: ['/screenshots/gantt-1.jpg', '/screenshots/gantt-2.jpg'],
    developer: 'Project Pro Inc',
    rating: 4.7,
    reviewCount: 892,
    downloads: 8340,
    price: 15,
    tags: ['gantt', 'timeline', 'dependencies', 'project-management'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board structure and items' },
      { type: 'write', resource: 'items', description: 'Update item dates and dependencies' }
    ],
    requirements: [
      { type: 'plan', value: 'pro', description: 'Requires Pro plan or higher' }
    ],
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-08-22T16:45:00Z',
    publishedAt: '2024-04-01T10:00:00Z',
    isOfficial: false,
    isFeatured: false,
    config: {
      boardViewConfig: {
        supportedColumnTypes: ['date', 'timeline', 'progress', 'status'],
        customFilters: true,
        exportOptions: ['pdf', 'png', 'csv']
      }
    }
  },
  {
    id: 'custom-dashboard',
    name: 'Dashboard Builder',
    description: 'Build custom dashboards with charts, KPIs, and real-time data visualization from your boards.',
    shortDescription: 'Create powerful custom dashboards',
    version: '2.0.0',
    category: 'analytics',
    type: 'widget',
    scope: ['workspace', 'personal'],
    icon: '📈',
    screenshots: ['/screenshots/dashboard-1.jpg'],
    developer: 'DataViz Solutions',
    rating: 4.6,
    reviewCount: 567,
    downloads: 12100,
    price: 8,
    tags: ['dashboard', 'analytics', 'charts', 'kpi'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board data for analytics' },
      { type: 'read', resource: 'workspace', description: 'Access workspace statistics' }
    ],
    requirements: [
      { type: 'plan', value: 'standard', description: 'Available on Standard plan and above' }
    ],
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-09-10T09:15:00Z',
    publishedAt: '2024-03-01T12:00:00Z',
    isOfficial: false,
    isFeatured: true,
    config: {
      widgetConfig: {
        sizes: ['2x2', '3x2', '2x3', '3x3'],
        refreshInterval: 300,
        configurable: true
      }
    }
  },
  {
    id: 'calendar-sync',
    name: 'Calendar Integration',
    description: 'Sync your board deadlines and milestones with Google Calendar, Outlook, and Apple Calendar.',
    shortDescription: 'Sync deadlines with your calendar',
    version: '1.2.1',
    category: 'productivity',
    type: 'integration',
    scope: ['workspace', 'personal'],
    icon: '📅',
    screenshots: ['/screenshots/calendar-1.jpg'],
    developer: 'Calendar Pro',
    rating: 4.5,
    reviewCount: 423,
    downloads: 9870,
    price: 0,
    tags: ['calendar', 'sync', 'deadlines', 'google', 'outlook'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board deadlines and milestones' },
      { type: 'read', resource: 'users', description: 'Access user calendar preferences' }
    ],
    requirements: [],
    integrations: ['google-calendar', 'outlook', 'apple-calendar'],
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-08-30T14:20:00Z',
    publishedAt: '2024-06-01T10:00:00Z',
    isOfficial: false,
    isFeatured: false,
    config: {
      integrationConfig: {
        authType: 'oauth',
        endpoints: ['/api/calendar/sync'],
        dataSync: true
      }
    }
  },
  {
    id: 'ai-assistant',
    name: 'AI Smart Assistant',
    description: 'AI-powered assistant that helps automate tasks, generate content, and provide intelligent insights across your workspace.',
    shortDescription: 'AI assistant for automation and insights',
    version: '1.0.0',
    category: 'automation',
    type: 'workflow',
    scope: ['workspace', 'board'],
    icon: '🤖',
    screenshots: ['/screenshots/ai-assistant-1.jpg', '/screenshots/ai-assistant-2.jpg'],
    banner: '/banners/ai-assistant.jpg',
    color: '#6B46C1',
    developer: 'AI Labs Inc',
    rating: 4.9,
    reviewCount: 156,
    downloads: 2340,
    price: 25,
    tags: ['ai', 'automation', 'assistant', 'insights', 'smart'],
    permissions: [
      { type: 'read', resource: 'boards', description: 'Read board data for AI analysis' },
      { type: 'write', resource: 'items', description: 'Create and update items based on AI suggestions' },
      { type: 'admin', resource: 'workspace', description: 'Manage workspace-wide automations' }
    ],
    requirements: [
      { type: 'plan', value: 'enterprise', description: 'Requires Enterprise plan' }
    ],
    createdAt: '2024-08-01T10:00:00Z',
    updatedAt: '2024-09-12T16:30:00Z',
    publishedAt: '2024-09-01T10:00:00Z',
    isOfficial: false,
    isFeatured: true,
    config: {
      settings: {
        aiProvider: 'openai',
        maxTokens: 4000,
        temperature: 0.7
      }
    }
  }
];

// Create the store
export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    apps: [],
    installedApps: [],
    featuredApps: [],
    categories: ['productivity', 'analytics', 'communication', 'integration', 'automation', 'project-management'],

    // UI State
    filters: {},
    searchQuery: '',
    isLoading: false,
    installInProgress: [],
    selectedApp: null,
    showAppDetails: false,

    // Methods
    searchApps: (query: string) => {
      set({ searchQuery: query });
    },

    filterApps: (filters: AppMarketplaceFilters) => {
      set({ filters });
    },

    clearFilters: () => {
      set({ filters: {}, searchQuery: '' });
    },

    selectApp: (appId: string) => {
      const app = get().apps.find(a => a.id === appId);
      set({ selectedApp: app || null, showAppDetails: true });
    },

    closeAppDetails: () => {
      set({ selectedApp: null, showAppDetails: false });
    },

    installApp: async (appId: string, scope: AppScope, targetId?: string) => {
      const { apps, installedApps, installInProgress } = get();

      // Check if already installed
      const existingInstallation = installedApps.find(
        ia => ia.appId === appId && ia.scope === scope &&
        (scope === 'personal' || scope === 'global' || ia.workspaceId === targetId || ia.boardId === targetId)
      );

      if (existingInstallation) {
        throw new Error('App is already installed in this scope');
      }

      // Add to installation progress
      set({ installInProgress: [...installInProgress, appId] });

      try {
        // Simulate installation delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const app = apps.find(a => a.id === appId);
        if (!app) {
          throw new Error('App not found');
        }

        const installedApp: InstalledApp = {
          id: `installed-${appId}-${Date.now()}`,
          appId,
          app,
          installedAt: new Date().toISOString(),
          installedBy: 'current-user', // Would be actual user ID
          status: 'active',
          scope,
          workspaceId: scope === 'workspace' ? targetId : undefined,
          boardId: scope === 'board' ? targetId : undefined,
          userId: scope === 'personal' ? 'current-user' : undefined,
          config: {},
          permissions: app.permissions,
          usageCount: 0,
          isEnabled: true
        };

        set(state => ({
          installedApps: [...state.installedApps, installedApp],
          installInProgress: state.installInProgress.filter(id => id !== appId)
        }));

      } catch (error) {
        set(state => ({
          installInProgress: state.installInProgress.filter(id => id !== appId)
        }));
        throw error;
      }
    },

    uninstallApp: async (installedAppId: string) => {
      // Simulate uninstallation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        installedApps: state.installedApps.filter(ia => ia.id !== installedAppId)
      }));
    },

    updateAppConfig: async (installedAppId: string, config: Record<string, any>) => {
      set(state => ({
        installedApps: state.installedApps.map(ia =>
          ia.id === installedAppId
            ? { ...ia, config: { ...ia.config, ...config } }
            : ia
        )
      }));
    },

    toggleAppStatus: async (installedAppId: string) => {
      set(state => ({
        installedApps: state.installedApps.map(ia =>
          ia.id === installedAppId
            ? {
                ...ia,
                isEnabled: !ia.isEnabled,
                status: !ia.isEnabled ? 'active' : 'inactive'
              }
            : ia
        )
      }));
    },

    loadApps: async () => {
      set({ isLoading: true });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      set({
        apps: mockApps,
        isLoading: false
      });
    },

    loadInstalledApps: async () => {
      // In a real app, this would load from the backend
      // For now, we'll start with some mock installed apps
      const mockInstalledApps: InstalledApp[] = [
        {
          id: 'installed-time-tracker',
          appId: 'time-tracker',
          app: mockApps[0],
          installedAt: '2024-08-15T10:00:00Z',
          installedBy: 'current-user',
          status: 'active',
          scope: 'workspace',
          workspaceId: 'workspace-1',
          config: {
            defaultTimer: 25,
            showNotifications: true
          },
          permissions: mockApps[0].permissions,
          usageCount: 45,
          isEnabled: true,
          lastUsed: '2024-09-13T14:30:00Z'
        }
      ];

      set({ installedApps: mockInstalledApps });
    },

    loadFeaturedApps: async () => {
      const { apps } = get();
      const featured = apps.filter(app => app.isFeatured);
      set({ featuredApps: featured });
    },

    // Getters
    getFilteredApps: () => {
      const { apps, filters, searchQuery } = get();
      let filteredApps = [...apps];

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredApps = filteredApps.filter(app =>
          app.name.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query) ||
          app.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Apply filters
      if (filters.category) {
        filteredApps = filteredApps.filter(app => app.category === filters.category);
      }

      if (filters.type) {
        filteredApps = filteredApps.filter(app => app.type === filters.type);
      }

      if (filters.scope) {
        filteredApps = filteredApps.filter(app => app.scope.includes(filters.scope!));
      }

      if (filters.price === 'free') {
        filteredApps = filteredApps.filter(app => app.price === 0);
      } else if (filters.price === 'paid') {
        filteredApps = filteredApps.filter(app => app.price > 0);
      }

      if (filters.rating) {
        filteredApps = filteredApps.filter(app => app.rating >= filters.rating!);
      }

      if (filters.featured) {
        filteredApps = filteredApps.filter(app => app.isFeatured);
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredApps = filteredApps.filter(app =>
          filters.tags!.some(tag => app.tags.includes(tag))
        );
      }

      return filteredApps;
    },

    getAppsByCategory: (category: AppCategory) => {
      return get().apps.filter(app => app.category === category);
    },

    getInstalledAppsByScope: (scope: AppScope, targetId?: string) => {
      return get().installedApps.filter(ia => {
        if (ia.scope !== scope) return false;

        switch (scope) {
          case 'global':
            return true;
          case 'workspace':
            return ia.workspaceId === targetId;
          case 'board':
            return ia.boardId === targetId;
          case 'personal':
            return ia.userId === 'current-user'; // Would be actual user ID
          default:
            return false;
        }
      });
    },

    isAppInstalled: (appId: string, scope?: AppScope, targetId?: string) => {
      const { installedApps } = get();

      if (!scope) {
        // Check if app is installed in any scope
        return installedApps.some(ia => ia.appId === appId);
      }

      return installedApps.some(ia => {
        if (ia.appId !== appId || ia.scope !== scope) return false;

        switch (scope) {
          case 'global':
            return true;
          case 'workspace':
            return ia.workspaceId === targetId;
          case 'board':
            return ia.boardId === targetId;
          case 'personal':
            return ia.userId === 'current-user';
          default:
            return false;
        }
      });
    }
  }))
);