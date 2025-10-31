import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface MaunApp {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'wellness' | 'analytics' | 'social' | 'finance' | 'health';
  icon: string;
  component: string; // Component identifier
  isInstalled: boolean;
  isEnabled: boolean;
  settings: Record<string, any>;
  installDate?: Date;
  lastUsed?: Date;
  usageCount: number;
}

export interface MaunAppContext {
  boardId?: string;
  workspaceId?: string;
  userId?: string;
  onClose: () => void;
}

interface MaunAppsState {
  // Apps registry
  availableApps: MaunApp[];
  installedApps: MaunApp[];

  // Active app
  activeApp: string | null;
  appContext: MaunAppContext | null;

  // Methods
  initializeApps: () => void;
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;
  enableApp: (appId: string) => void;
  disableApp: (appId: string) => void;
  launchApp: (appId: string, context?: MaunAppContext) => void;
  closeApp: () => void;
  updateAppSettings: (appId: string, settings: Record<string, any>) => void;
  incrementUsage: (appId: string) => void;

  // Getters
  getInstalledApps: () => MaunApp[];
  getAppById: (appId: string) => MaunApp | undefined;
  isAppInstalled: (appId: string) => boolean;
}

// Default apps from maun_app_7
const defaultApps: Omit<MaunApp, 'isInstalled' | 'isEnabled' | 'settings' | 'usageCount'>[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Central hub with time display, greetings, and quick actions',
    category: 'productivity',
    icon: '🏠',
    component: 'DashboardApp'
  },
  {
    id: 'focus-mode',
    name: 'Focus Mode',
    description: 'Advanced Pomodoro timer with task management and breathing exercises',
    category: 'productivity',
    icon: '🎯',
    component: 'FocusModeApp'
  },
  {
    id: 'emotional',
    name: 'Emotional Processing',
    description: '5-step emotional intelligence workflow for better self-awareness',
    category: 'wellness',
    icon: '💭',
    component: 'EmotionalApp'
  },
  {
    id: 'habits',
    name: 'Habits',
    description: 'Habit tracking board with calendar views and progress monitoring',
    category: 'wellness',
    icon: '📅',
    component: 'HabitsApp'
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'Personal journaling with calendar integration and reflection tools',
    category: 'wellness',
    icon: '📝',
    component: 'JournalApp'
  },
  {
    id: 'vision-board',
    name: 'Vision Board',
    description: 'Visual goal setting and vision creation for manifestation',
    category: 'wellness',
    icon: '🔮',
    component: 'VisionBoardApp'
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Health tracking and monitoring for wellness optimization',
    category: 'health',
    icon: '❤️',
    component: 'HealthApp'
  },
  {
    id: 'wealth',
    name: 'Wealth Management',
    description: 'Financial tracking, budgeting, and wealth building tools',
    category: 'finance',
    icon: '💰',
    component: 'WealthApp'
  },
  {
    id: 'sales',
    name: 'Sales Tracker',
    description: 'Sales tracking, pipeline management, and revenue analytics',
    category: 'analytics',
    icon: '💼',
    component: 'SalesApp'
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Social features, connections, and community engagement',
    category: 'social',
    icon: '👥',
    component: 'SocialApp'
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Full-featured email client with compose, folders, and search',
    category: 'productivity',
    icon: '📧',
    component: 'EmailApp'
  },
  {
    id: 'drive',
    name: 'Drive',
    description: 'File storage and management with sharing and collaboration',
    category: 'productivity',
    icon: '💾',
    component: 'DriveApp'
  }
];

export const useMaunAppsStore = create<MaunAppsState>()(
  devtools(
    persist(
      immer((set, get) => ({
        availableApps: [],
        installedApps: [],
        activeApp: null,
        appContext: null,

        initializeApps: () => set((state) => {
          // Initialize available apps
          state.availableApps = defaultApps.map(app => ({
            ...app,
            isInstalled: false,
            isEnabled: false,
            settings: {},
            usageCount: 0
          }));

          // Load any previously installed apps
          const existingInstalled = state.installedApps.map(app => app.id);
          state.availableApps.forEach(app => {
            if (existingInstalled.includes(app.id)) {
              app.isInstalled = true;
              const installedApp = state.installedApps.find(ia => ia.id === app.id);
              if (installedApp) {
                app.isEnabled = installedApp.isEnabled;
                app.settings = installedApp.settings;
                app.usageCount = installedApp.usageCount;
                app.installDate = installedApp.installDate;
                app.lastUsed = installedApp.lastUsed;
              }
            }
          });
        }),

        installApp: (appId: string) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          if (app && !app.isInstalled) {
            app.isInstalled = true;
            app.isEnabled = true;
            app.installDate = new Date();
            state.installedApps.push({ ...app });
          }
        }),

        uninstallApp: (appId: string) => set((state) => {
          const appIndex = state.availableApps.findIndex(a => a.id === appId);
          if (appIndex !== -1) {
            state.availableApps[appIndex].isInstalled = false;
            state.availableApps[appIndex].isEnabled = false;
          }
          const installedIndex = state.installedApps.findIndex(a => a.id === appId);
          if (installedIndex !== -1) {
            state.installedApps.splice(installedIndex, 1);
          }
          if (state.activeApp === appId) {
            state.activeApp = null;
            state.appContext = null;
          }
        }),

        enableApp: (appId: string) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          const installedApp = state.installedApps.find(a => a.id === appId);
          if (app && installedApp) {
            app.isEnabled = true;
            installedApp.isEnabled = true;
          }
        }),

        disableApp: (appId: string) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          const installedApp = state.installedApps.find(a => a.id === appId);
          if (app && installedApp) {
            app.isEnabled = false;
            installedApp.isEnabled = false;
          }
          if (state.activeApp === appId) {
            state.activeApp = null;
            state.appContext = null;
          }
        }),

        launchApp: (appId: string, context?: MaunAppContext) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          if (app && app.isInstalled && app.isEnabled) {
            state.activeApp = appId;
            state.appContext = context || { onClose: () => get().closeApp() };
            // Increment usage will be called by the app component
          }
        }),

        closeApp: () => set((state) => {
          if (state.activeApp) {
            // Update last used date
            const app = state.availableApps.find(a => a.id === state.activeApp);
            const installedApp = state.installedApps.find(a => a.id === state.activeApp);
            if (app && installedApp) {
              app.lastUsed = new Date();
              installedApp.lastUsed = new Date();
            }
          }
          state.activeApp = null;
          state.appContext = null;
        }),

        updateAppSettings: (appId: string, settings: Record<string, any>) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          const installedApp = state.installedApps.find(a => a.id === appId);
          if (app && installedApp) {
            app.settings = { ...app.settings, ...settings };
            installedApp.settings = { ...installedApp.settings, ...settings };
          }
        }),

        incrementUsage: (appId: string) => set((state) => {
          const app = state.availableApps.find(a => a.id === appId);
          const installedApp = state.installedApps.find(a => a.id === appId);
          if (app && installedApp) {
            app.usageCount += 1;
            installedApp.usageCount += 1;
            app.lastUsed = new Date();
            installedApp.lastUsed = new Date();
          }
        }),

        getInstalledApps: () => get().installedApps.filter(app => app.isEnabled),

        getAppById: (appId: string) => get().availableApps.find(a => a.id === appId),

        isAppInstalled: (appId: string) => {
          const app = get().availableApps.find(a => a.id === appId);
          return app?.isInstalled || false;
        }
      })),
      {
        name: 'maun-apps-storage',
        partialize: (state) => ({
          installedApps: state.installedApps,
        }),
      }
    ),
    { name: 'MaunAppsStore' }
  )
);