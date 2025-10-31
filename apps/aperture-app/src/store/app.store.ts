import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  User, 
  Workspace, 
  Project, 
  ViewConfig,
  BoardType 
} from '@/types';

export interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Workspace state
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;

  // Project state
  currentProject: Project | null;
  projects: Project[];
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // View state
  currentView: BoardType;
  setCurrentView: (view: BoardType) => void;
  viewConfig: ViewConfig;
  updateViewConfig: (config: Partial<ViewConfig>) => void;

  // Navigation state
  favorites: string[];
  recentlyViewed: Array<{ id: string; type: string; name: string; timestamp: Date }>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  addRecentlyViewed: (item: any) => void;

  // Modal state
  activeModal: string | null;
  modalData: any;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;

  // Loading state
  loading: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;

  // Error state
  errors: Record<string, string>;
  setError: (key: string, error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      immer((set) => ({
        // User state
        currentUser: null,
        setCurrentUser: (user) => set((state) => {
          state.currentUser = user;
        }),

        // Workspace state
        currentWorkspace: null,
        workspaces: [],
        setCurrentWorkspace: (workspace) => set((state) => {
          state.currentWorkspace = workspace;
        }),
        setWorkspaces: (workspaces) => set((state) => {
          state.workspaces = workspaces;
        }),

        // Project state
        currentProject: null,
        projects: [],
        setCurrentProject: (project) => set((state) => {
          state.currentProject = project;
        }),
        setProjects: (projects) => set((state) => {
          state.projects = projects;
        }),

        // UI state
        sidebarOpen: true,
        toggleSidebar: () => set((state) => {
          state.sidebarOpen = !state.sidebarOpen;
        }),
        theme: 'system',
        setTheme: (theme) => set((state) => {
          state.theme = theme;
        }),

        // View state
        currentView: 'kanban',
        setCurrentView: (view) => set((state) => {
          state.currentView = view;
        }),
        viewConfig: {
          type: 'kanban',
          filters: {},
          sort: { field: 'updatedAt', direction: 'desc' },
        },
        updateViewConfig: (config) => set((state) => {
          state.viewConfig = { ...state.viewConfig, ...config };
        }),

        // Navigation state
        favorites: [],
        recentlyViewed: [],
        addFavorite: (id) => set((state) => {
          if (!state.favorites.includes(id)) {
            state.favorites.push(id);
          }
        }),
        removeFavorite: (id) => set((state) => {
          state.favorites = state.favorites.filter(f => f !== id);
        }),
        addRecentlyViewed: (item) => set((state) => {
          state.recentlyViewed = [
            item,
            ...state.recentlyViewed.filter(r => r.id !== item.id)
          ].slice(0, 10);
        }),

        // Modal state
        activeModal: null,
        modalData: null,
        openModal: (modalId, data = null) => set((state) => {
          state.activeModal = modalId;
          state.modalData = data;
        }),
        closeModal: () => set((state) => {
          state.activeModal = null;
          state.modalData = null;
        }),

        // Loading state
        loading: {},
        setLoading: (key, loading) => set((state) => {
          state.loading[key] = loading;
        }),

        // Error state
        errors: {},
        setError: (key, error) => set((state) => {
          if (error) {
            state.errors[key] = error;
          } else {
            delete state.errors[key];
          }
        }),
      })),
      {
        name: 'aperture-app-storage',
        partialize: (state) => ({
          theme: state.theme,
          favorites: state.favorites,
          recentlyViewed: state.recentlyViewed,
          sidebarOpen: state.sidebarOpen,
          viewConfig: state.viewConfig,
        }),
      }
    ),
    { name: 'MissionsAppStore' }
  )
);