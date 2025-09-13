import { create } from 'zustand';

export interface SubGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'on-track' | 'no-recent-updates' | 'at-risk' | 'off-track' | 'completed';
  timeline: string;
  owner: string;
  assignees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'on-track' | 'no-recent-updates' | 'at-risk' | 'off-track' | 'completed';
  progress: number;
  timeline: string;
  owner: string;
  assignees: string[];
  category: string;
  parentId?: string;
  subGoals: SubGoal[];
  connections: string[];
  position?: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
  lastCheckIn?: string;
  isExpanded?: boolean;
}

interface GoalsStore {
  goals: Goal[];
  selectedGoal: Goal | null;
  filters: {
    status: string;
    owner: string;
    category: string;
    timeline: string;
    search: string;
  };
  
  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addSubGoal: (parentId: string, subGoal: SubGoal) => void;
  updateSubGoal: (parentId: string, subGoalId: string, updates: Partial<SubGoal>) => void;
  deleteSubGoal: (parentId: string, subGoalId: string) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setFilters: (filters: Partial<GoalsStore['filters']>) => void;
  toggleGoalExpansion: (goalId: string) => void;
  updateGoalPosition: (goalId: string, position: { x: number; y: number }) => void;
  calculateGoalProgress: (goalId: string) => void;
  
  // Hierarchy and Dependency Management
  createChildGoal: (parentId: string, childGoal: Omit<Goal, 'id' | 'parentId'>) => void;
  addDependency: (goalId: string, dependsOnId: string) => void;
  removeDependency: (goalId: string, dependsOnId: string) => void;
  getGoalHierarchy: (goalId: string) => Goal[];
  getGoalDependencies: (goalId: string) => { dependsOn: Goal[]; dependents: Goal[] };
  canStartGoal: (goalId: string) => boolean;
}

const mockGoalsData: Goal[] = [
  {
    id: 'mycow-1.0',
    title: 'MyCow.io 1.0 Meadow',
    description: 'Core platform launch with essential features',
    status: 'on-track',
    progress: 0,
    timeline: 'Q4 FY24',
    owner: 'Cow Group',
    assignees: ['John Doe', 'Jane Smith'],
    category: 'Platform',
    connections: ['mycow-2.0', 'introduce-tokens'],
    position: { x: 150, y: 200 },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    lastCheckIn: '2024-01-10',
    isExpanded: true,
    subGoals: [
      {
        id: 'str-leadership',
        title: 'STR: Exceptional Leadership, Confidence, People Management, Communication, Planning, Project Management, and Execution',
        description: 'Strategic leadership development initiative',
        progress: 0,
        status: 'no-recent-updates',
        timeline: 'Q2 FY24',
        owner: 'Leadership Team',
        assignees: ['Leadership Team'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: 'for-business',
        title: 'For the Business',
        description: 'Business development and growth initiatives',
        progress: 0,
        status: 'no-recent-updates',
        timeline: 'Q1 FY24',
        owner: 'Business Team',
        assignees: ['Sarah Johnson', 'Mike Wilson'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: 'mycow-earth',
        title: 'MyCow.io 0.0 Earth',
        description: 'Foundation platform development',
        progress: 0,
        status: 'no-recent-updates',
        timeline: 'Q2 FY24',
        owner: 'Cow Group',
        assignees: ['Dev Team'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: 'purpose-infusion',
        title: 'Purpose Infusion: Discovery / Creativity / Visioning / Legacy / Fulfillment',
        description: 'Purpose-driven development and fulfillment',
        progress: 0,
        status: 'no-recent-updates',
        timeline: 'Q1 FY24',
        owner: 'Likhitha',
        assignees: ['Likhitha'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      },
      {
        id: 'impact-effectuation',
        title: 'Impact Effectuation: Problem Solving / Achievement',
        description: 'Impact measurement and achievement tracking',
        progress: 2,
        status: 'no-recent-updates',
        timeline: 'Q1 FY24',
        owner: 'Likhitha',
        assignees: ['Likhitha'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-05'
      }
    ]
  },
  {
    id: 'mycow-2.0',
    title: 'MyCow.io 2.0 Mint',
    description: 'Enhanced platform with advanced features',
    status: 'no-recent-updates',
    progress: 0,
    timeline: 'Q1 FY25',
    owner: 'Cow Group',
    assignees: ['Product Team'],
    category: 'Platform',
    connections: ['programs'],
    position: { x: 450, y: 200 },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-05',
    isExpanded: false,
    subGoals: []
  },
  {
    id: 'introduce-tokens',
    title: 'Successfully introduce innovative real world asset tokens as alternative investments to market.',
    description: 'Tokenization strategy and market introduction',
    status: 'on-track',
    progress: 1,
    timeline: 'FY24',
    owner: 'Cow Group',
    assignees: ['Investment Team'],
    category: 'Investment',
    connections: ['programs'],
    position: { x: 700, y: 200 },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    isExpanded: false,
    subGoals: [
      {
        id: 'token-research',
        title: 'Research tokenization frameworks',
        description: 'Research and analysis of tokenization options',
        progress: 50,
        status: 'on-track',
        timeline: 'Q1 FY24',
        owner: 'Research Team',
        assignees: ['Research Team'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10'
      },
      {
        id: 'market-strategy',
        title: 'Develop market entry strategy',
        description: 'Strategic planning for market introduction',
        progress: 25,
        status: 'on-track',
        timeline: 'Q2 FY24',
        owner: 'Marketing Team',
        assignees: ['Marketing Team'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-08'
      }
    ]
  }
];

export const useGoalsStore = create<GoalsStore>((set, get) => ({
  goals: mockGoalsData,
  selectedGoal: null,
  filters: {
    status: 'All Statuses',
    owner: 'All Owners',
    category: 'All Categories',
    timeline: 'All Time',
    search: ''
  },

  setGoals: (goals) => set({ goals }),

  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal]
  })),

  updateGoal: (id, updates) => set((state) => ({
    goals: state.goals.map(goal =>
      goal.id === id ? { ...goal, ...updates, updatedAt: new Date().toISOString() } : goal
    )
  })),

  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter(goal => goal.id !== id)
  })),

  addSubGoal: (parentId, subGoal) => set((state) => {
    const updatedGoals = state.goals.map(goal =>
      goal.id === parentId 
        ? { ...goal, subGoals: [...goal.subGoals, subGoal], updatedAt: new Date().toISOString() }
        : goal
    );

    // Auto-calculate parent goal progress
    const parentGoal = updatedGoals.find(g => g.id === parentId);
    if (parentGoal && parentGoal.subGoals.length > 0) {
      const totalProgress = parentGoal.subGoals.reduce((sum, sub) => sum + sub.progress, 0);
      const averageProgress = Math.round(totalProgress / parentGoal.subGoals.length);
      
      updatedGoals.forEach(goal => {
        if (goal.id === parentId) {
          goal.progress = averageProgress;
        }
      });
    }

    return { goals: updatedGoals };
  }),

  updateSubGoal: (parentId, subGoalId, updates) => set((state) => {
    const updatedGoals = state.goals.map(goal =>
      goal.id === parentId 
        ? {
            ...goal,
            subGoals: goal.subGoals.map(sub =>
              sub.id === subGoalId ? { ...sub, ...updates, updatedAt: new Date().toISOString() } : sub
            ),
            updatedAt: new Date().toISOString()
          }
        : goal
    );

    // Auto-calculate parent goal progress
    const parentGoal = updatedGoals.find(g => g.id === parentId);
    if (parentGoal && parentGoal.subGoals.length > 0) {
      const totalProgress = parentGoal.subGoals.reduce((sum, sub) => sum + sub.progress, 0);
      const averageProgress = Math.round(totalProgress / parentGoal.subGoals.length);
      
      // Update parent progress
      updatedGoals.forEach(goal => {
        if (goal.id === parentId) {
          goal.progress = averageProgress;
        }
      });
    }

    return { goals: updatedGoals };
  }),

  deleteSubGoal: (parentId, subGoalId) => set((state) => ({
    goals: state.goals.map(goal =>
      goal.id === parentId 
        ? { 
            ...goal, 
            subGoals: goal.subGoals.filter(sub => sub.id !== subGoalId),
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  })),

  setSelectedGoal: (goal) => set({ selectedGoal: goal }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  toggleGoalExpansion: (goalId) => set((state) => ({
    goals: state.goals.map(goal =>
      goal.id === goalId ? { ...goal, isExpanded: !goal.isExpanded } : goal
    )
  })),

  updateGoalPosition: (goalId, position) => set((state) => ({
    goals: state.goals.map(goal =>
      goal.id === goalId ? { ...goal, position, updatedAt: new Date().toISOString() } : goal
    )
  })),

  calculateGoalProgress: (goalId) => set((state) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal || goal.subGoals.length === 0) return {};

    const totalProgress = goal.subGoals.reduce((sum, sub) => sum + sub.progress, 0);
    const averageProgress = Math.round(totalProgress / goal.subGoals.length);

    return {
      goals: state.goals.map(g =>
        g.id === goalId ? { ...g, progress: averageProgress, updatedAt: new Date().toISOString() } : g
      )
    };
  }),

  // Hierarchy and Dependency Management Functions
  createChildGoal: (parentId, childGoal) => set((state) => {
    const newGoal: Goal = {
      ...childGoal,
      id: `goal-${Date.now()}`,
      parentId: parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      goals: [...state.goals, newGoal]
    };
  }),

  addDependency: (goalId, dependsOnId) => set((state) => {
    // Prevent circular dependencies
    const { dependsOn } = get().getGoalDependencies(dependsOnId);
    if (dependsOn.some(dep => dep.id === goalId)) {
      console.warn('Cannot create circular dependency');
      return {};
    }

    return {
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              connections: [...new Set([...goal.connections, dependsOnId])],
              updatedAt: new Date().toISOString()
            }
          : goal
      )
    };
  }),

  removeDependency: (goalId, dependsOnId) => set((state) => ({
    goals: state.goals.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            connections: goal.connections.filter(id => id !== dependsOnId),
            updatedAt: new Date().toISOString()
          }
        : goal
    )
  })),

  getGoalHierarchy: (goalId) => {
    const state = get();
    const result: Goal[] = [];
    
    const findGoal = (id: string): Goal | undefined => state.goals.find(g => g.id === id);
    const findChildren = (parentId: string): Goal[] => state.goals.filter(g => g.parentId === parentId);
    
    const addGoalAndDescendants = (goal: Goal) => {
      result.push(goal);
      const children = findChildren(goal.id);
      children.forEach(child => addGoalAndDescendants(child));
    };

    const goal = findGoal(goalId);
    if (goal) {
      addGoalAndDescendants(goal);
    }

    return result;
  },

  getGoalDependencies: (goalId) => {
    const state = get();
    const goal = state.goals.find(g => g.id === goalId);
    
    if (!goal) {
      return { dependsOn: [], dependents: [] };
    }

    // Goals this goal depends on
    const dependsOn = goal.connections
      .map(id => state.goals.find(g => g.id === id))
      .filter(Boolean) as Goal[];

    // Goals that depend on this goal
    const dependents = state.goals.filter(g => 
      g.connections.includes(goalId)
    );

    return { dependsOn, dependents };
  },

  canStartGoal: (goalId) => {
    const { dependsOn } = get().getGoalDependencies(goalId);
    
    // A goal can start if all its dependencies are completed
    return dependsOn.every(dep => dep.status === 'completed');
  }
}));