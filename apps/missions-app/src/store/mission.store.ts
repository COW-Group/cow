import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Mission, MissionCard, MissionFormData, MissionStats, MissionStatus } from '../types/mission.types';

interface MissionStore {
  // State - following the video's pattern
  missions: MissionCard[];
  categories: string[];
  selectedMission: MissionCard | null;
  isLoading: boolean;
  error: string | null;
  
  // Stats
  stats: MissionStats;
  
  // Filter states like in the video
  filterStatus: 'all' | 'active' | 'completed';
  filterCategory: string;
  
  // Actions - similar to the video's CRUD operations
  setMissions: (missions: MissionCard[]) => void;
  addMission: (mission: MissionCard) => void;
  updateMission: (id: string, updates: Partial<MissionCard>) => void;
  deleteMission: (id: string) => void;
  
  // Category management like in the video
  setCategories: (categories: string[]) => void;
  addCategory: (category: string) => void;
  getUniqueCategories: () => string[];
  
  // Selection and filtering
  setSelectedMission: (mission: MissionCard | null) => void;
  setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
  setFilterCategory: (category: string) => void;
  
  // Computed values
  getFilteredMissions: () => MissionCard[];
  getMissionsByCategory: () => Record<string, MissionCard[]>;
  getStats: () => MissionStats;
  
  // Async operations
  fetchMissions: () => Promise<void>;
  createMission: (formData: MissionFormData) => Promise<void>;
  editMission: (id: string, formData: MissionFormData) => Promise<void>;
  removeMission: (id: string) => Promise<void>;
  
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Mock data similar to the video's dummy data
const mockMissions: MissionCard[] = [
  {
    id: '1',
    title: 'Portfolio Diversification Master',
    description: 'Diversify your portfolio by investing in at least 3 different COW token types',
    category: 'Q1 2025',
    color: 'rgb(186, 255, 201)',
    status: 'working_on_it',
    priority: 4,
    progress: 65,
    owner: 'Investment Team',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    timestamp: new Date().toISOString(),
    documentId: 'mission-1'
  },
  {
    id: '2',
    title: 'AuSIRI Token Launch',
    description: 'Complete the launch of AuSIRI gold-backed token with full market integration',
    category: 'Q1 2025',
    color: 'rgb(255, 223, 186)',
    status: 'working_on_it',
    priority: 5,
    progress: 80,
    owner: 'Product Team',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b814?w=150',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    documentId: 'mission-2'
  },
  {
    id: '3',
    title: 'Community Building Initiative',
    description: 'Build and engage the COW community across all social platforms',
    category: 'Q2 2025',
    color: 'rgb(186, 255, 255)',
    status: 'done',
    priority: 3,
    progress: 100,
    owner: 'Marketing Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    documentId: 'mission-3'
  }
];

export const useMissionStore = create<MissionStore>()(
  immer((set, get) => ({
    // Initial state
    missions: mockMissions,
    categories: [],
    selectedMission: null,
    isLoading: false,
    error: null,
    
    stats: {
      totalMissions: 0,
      completedMissions: 0,
      inProgressMissions: 0,
      stuckMissions: 0,
      totalRewards: 0,
      averageProgress: 0,
      totalCategories: 0
    },
    
    filterStatus: 'all',
    filterCategory: 'all',
    
    // Actions
    setMissions: (missions) => set(state => {
      state.missions = missions;
      state.categories = Array.from(new Set(missions.map(m => m.category)));
    }),
    
    addMission: (mission) => set(state => {
      state.missions.push(mission);
      if (!state.categories.includes(mission.category)) {
        state.categories.push(mission.category);
      }
    }),
    
    updateMission: (id, updates) => set(state => {
      const index = state.missions.findIndex(m => m.id === id);
      if (index !== -1) {
        state.missions[index] = { ...state.missions[index], ...updates };
        
        // Update categories if category changed
        if (updates.category && !state.categories.includes(updates.category)) {
          state.categories.push(updates.category);
        }
      }
    }),
    
    deleteMission: (id) => set(state => {
      state.missions = state.missions.filter(m => m.id !== id);
      // Recalculate categories
      state.categories = Array.from(new Set(state.missions.map(m => m.category)));
    }),
    
    setCategories: (categories) => set(state => {
      state.categories = categories;
    }),
    
    addCategory: (category) => set(state => {
      if (!state.categories.includes(category)) {
        state.categories.push(category);
      }
    }),
    
    getUniqueCategories: () => {
      const missions = get().missions;
      return Array.from(new Set(missions.map(m => m.category)));
    },
    
    setSelectedMission: (mission) => set(state => {
      state.selectedMission = mission;
    }),
    
    setFilterStatus: (status) => set(state => {
      state.filterStatus = status;
    }),
    
    setFilterCategory: (category) => set(state => {
      state.filterCategory = category;
    }),
    
    getFilteredMissions: () => {
      const { missions, filterStatus, filterCategory } = get();
      
      return missions.filter(mission => {
        // Filter by status
        if (filterStatus === 'active' && mission.status === 'done') return false;
        if (filterStatus === 'completed' && mission.status !== 'done') return false;
        
        // Filter by category
        if (filterCategory !== 'all' && mission.category !== filterCategory) return false;
        
        return true;
      });
    },
    
    getMissionsByCategory: () => {
      const missions = get().getFilteredMissions();
      const grouped: Record<string, MissionCard[]> = {};
      
      missions.forEach(mission => {
        if (!grouped[mission.category]) {
          grouped[mission.category] = [];
        }
        grouped[mission.category].push(mission);
      });
      
      return grouped;
    },
    
    getStats: () => {
      const missions = get().missions;
      const totalMissions = missions.length;
      const completedMissions = missions.filter(m => m.status === 'done').length;
      const inProgressMissions = missions.filter(m => m.status === 'working_on_it').length;
      const stuckMissions = missions.filter(m => m.status === 'stuck').length;
      const averageProgress = missions.length > 0 
        ? missions.reduce((sum, m) => sum + m.progress, 0) / missions.length 
        : 0;
      const totalCategories = get().categories.length;
      
      return {
        totalMissions,
        completedMissions,
        inProgressMissions,
        stuckMissions,
        totalRewards: 0, // Will be calculated based on completed missions
        averageProgress,
        totalCategories
      };
    },
    
    // Async operations - like in the video's axios calls
    fetchMissions: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // Simulate API call - in real app this would be axios.get('/api/missions')
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, just use mock data
        set(state => {
          state.missions = mockMissions;
          state.categories = Array.from(new Set(mockMissions.map(m => m.category)));
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },
    
    createMission: async (formData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // Simulate API call - in real app this would be axios.post('/api/missions', formData)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newMission: MissionCard = {
          id: Date.now().toString(),
          documentId: `mission-${Date.now()}`,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          color: 'rgb(186, 255, 201)', // Default color
          status: formData.status,
          priority: formData.priority,
          progress: formData.progress,
          owner: formData.owner,
          avatar: formData.avatar,
          timestamp: formData.timestamp
        };
        
        get().addMission(newMission);
        
        set(state => {
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },
    
    editMission: async (id, formData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // Simulate API call - in real app this would be axios.put(`/api/missions/${id}`, formData)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const updates: Partial<MissionCard> = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
          priority: formData.priority,
          progress: formData.progress,
          owner: formData.owner,
          avatar: formData.avatar,
        };
        
        get().updateMission(id, updates);
        
        set(state => {
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },
    
    removeMission: async (id) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });
      
      try {
        // Simulate API call - in real app this would be axios.delete(`/api/missions/${id}`)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        get().deleteMission(id);
        
        set(state => {
          state.isLoading = false;
        });
        
        // Simulate page reload like in the video
        if (typeof window !== 'undefined') {
          // In a real app, we'd use React Router navigation instead
          console.log(`Mission ${id} deleted successfully`);
        }
      } catch (error: any) {
        set(state => {
          state.error = error.message;
          state.isLoading = false;
        });
      }
    },
    
    setLoading: (loading) => set(state => {
      state.isLoading = loading;
    }),
    
    setError: (error) => set(state => {
      state.error = error;
    }),
  }))
);