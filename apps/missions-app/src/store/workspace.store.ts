import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  Workspace, 
  WorkspaceMember, 
  Team,
  Project,
  Task,
  Goal 
} from '@/types';

export interface WorkspaceState {
  // Workspace data
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  
  // Members
  members: WorkspaceMember[];
  teams: Team[];
  
  // Projects
  projects: Project[];
  activeProjects: Project[];
  
  // Tasks
  tasks: Task[];
  myTasks: Task[];
  
  // Goals
  goals: Goal[];
  activeGoals: Goal[];
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  createWorkspace: (data: Partial<Workspace>) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  deleteWorkspace: (id: string) => void;
  
  setMembers: (members: WorkspaceMember[]) => void;
  addMember: (member: WorkspaceMember) => void;
  updateMember: (id: string, updates: Partial<WorkspaceMember>) => void;
  removeMember: (id: string) => void;
  
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  
  // Computed getters
  getProjectById: (id: string) => Project | undefined;
  getTaskById: (id: string) => Task | undefined;
  getGoalById: (id: string) => Goal | undefined;
  getMemberById: (id: string) => WorkspaceMember | undefined;
  getTeamById: (id: string) => Team | undefined;
  
  // Statistics
  getWorkspaceStats: () => {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalGoals: number;
    activeGoals: number;
    totalMembers: number;
  };
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      workspaces: [
        {
          id: '1',
          name: 'Gold CRM',
          description: 'Customer relationship management workspace',
          color: 'bg-orange-500',
          type: 'team',
          memberCount: 5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: 'My workspace',
          description: 'Personal workspace for individual tasks',
          color: 'bg-blue-500',
          type: 'personal',
          memberCount: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          name: 'Likhitha Palaypu Vibes',
          description: 'Creative projects and ideas',
          color: 'bg-purple-500',
          type: 'team',
          memberCount: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      currentWorkspace: null,
      members: [],
      teams: [],
      projects: [],
      activeProjects: [],
      tasks: [],
      myTasks: [],
      goals: [],
      activeGoals: [],

      // Workspace actions
      setWorkspaces: (workspaces) => set((state) => {
        state.workspaces = workspaces;
      }),
      
      setCurrentWorkspace: (workspace) => set((state) => {
        state.currentWorkspace = workspace;
        // Reset related data when workspace changes
        if (!workspace) {
          state.members = [];
          state.teams = [];
          state.projects = [];
          state.tasks = [];
          state.goals = [];
        }
      }),
      
      addWorkspace: (workspace) => set((state) => {
        state.workspaces.push(workspace);
      }),
      
      createWorkspace: (data) => set((state) => {
        const newWorkspace: Workspace = {
          id: Date.now().toString(),
          name: data.name || 'New Workspace',
          description: data.description || '',
          color: data.color || 'bg-blue-500',
          type: data.type || 'team',
          memberCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data
        };
        state.workspaces.push(newWorkspace);
      }),
      
      updateWorkspace: (id, updates) => set((state) => {
        const index = state.workspaces.findIndex(w => w.id === id);
        if (index !== -1) {
          state.workspaces[index] = { ...state.workspaces[index], ...updates };
        }
        if (state.currentWorkspace?.id === id) {
          state.currentWorkspace = { ...state.currentWorkspace, ...updates };
        }
      }),
      
      removeWorkspace: (id) => set((state) => {
        state.workspaces = state.workspaces.filter(w => w.id !== id);
        if (state.currentWorkspace?.id === id) {
          state.currentWorkspace = null;
        }
      }),
      
      deleteWorkspace: (id) => set((state) => {
        state.workspaces = state.workspaces.filter(w => w.id !== id);
        if (state.currentWorkspace?.id === id) {
          state.currentWorkspace = null;
        }
      }),

      // Member actions
      setMembers: (members) => set((state) => {
        state.members = members;
      }),
      
      addMember: (member) => set((state) => {
        state.members.push(member);
      }),
      
      updateMember: (id, updates) => set((state) => {
        const index = state.members.findIndex(m => m.id === id);
        if (index !== -1) {
          state.members[index] = { ...state.members[index], ...updates };
        }
      }),
      
      removeMember: (id) => set((state) => {
        state.members = state.members.filter(m => m.id !== id);
      }),

      // Team actions
      setTeams: (teams) => set((state) => {
        state.teams = teams;
      }),
      
      addTeam: (team) => set((state) => {
        state.teams.push(team);
      }),
      
      updateTeam: (id, updates) => set((state) => {
        const index = state.teams.findIndex(t => t.id === id);
        if (index !== -1) {
          state.teams[index] = { ...state.teams[index], ...updates };
        }
      }),
      
      removeTeam: (id) => set((state) => {
        state.teams = state.teams.filter(t => t.id !== id);
      }),

      // Project actions
      setProjects: (projects) => set((state) => {
        state.projects = projects;
        state.activeProjects = projects.filter(p => p.status === 'active');
      }),
      
      addProject: (project) => set((state) => {
        state.projects.push(project);
        if (project.status === 'active') {
          state.activeProjects.push(project);
        }
      }),
      
      updateProject: (id, updates) => set((state) => {
        const index = state.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...updates };
        }
        // Update active projects
        state.activeProjects = state.projects.filter(p => p.status === 'active');
      }),
      
      removeProject: (id) => set((state) => {
        state.projects = state.projects.filter(p => p.id !== id);
        state.activeProjects = state.activeProjects.filter(p => p.id !== id);
      }),

      // Task actions
      setTasks: (tasks) => set((state) => {
        state.tasks = tasks;
        // Filter my tasks (assigned to current user)
        // This would be updated based on current user from app store
      }),
      
      addTask: (task) => set((state) => {
        state.tasks.push(task);
      }),
      
      updateTask: (id, updates) => set((state) => {
        const index = state.tasks.findIndex(t => t.id === id);
        if (index !== -1) {
          state.tasks[index] = { ...state.tasks[index], ...updates };
        }
      }),
      
      removeTask: (id) => set((state) => {
        state.tasks = state.tasks.filter(t => t.id !== id);
      }),

      // Goal actions
      setGoals: (goals) => set((state) => {
        state.goals = goals;
        state.activeGoals = goals.filter(g => g.status === 'active');
      }),
      
      addGoal: (goal) => set((state) => {
        state.goals.push(goal);
        if (goal.status === 'active') {
          state.activeGoals.push(goal);
        }
      }),
      
      updateGoal: (id, updates) => set((state) => {
        const index = state.goals.findIndex(g => g.id === id);
        if (index !== -1) {
          state.goals[index] = { ...state.goals[index], ...updates };
        }
        // Update active goals
        state.activeGoals = state.goals.filter(g => g.status === 'active');
      }),
      
      removeGoal: (id) => set((state) => {
        state.goals = state.goals.filter(g => g.id !== id);
        state.activeGoals = state.activeGoals.filter(g => g.id !== id);
      }),

      // Getters
      getProjectById: (id) => get().projects.find(p => p.id === id),
      getTaskById: (id) => get().tasks.find(t => t.id === id),
      getGoalById: (id) => get().goals.find(g => g.id === id),
      getMemberById: (id) => get().members.find(m => m.id === id),
      getTeamById: (id) => get().teams.find(t => t.id === id),

      // Statistics
      getWorkspaceStats: () => {
        const state = get();
        return {
          totalProjects: state.projects.length,
          activeProjects: state.activeProjects.length,
          totalTasks: state.tasks.length,
          completedTasks: state.tasks.filter(t => t.status === 'completed').length,
          totalGoals: state.goals.length,
          activeGoals: state.activeGoals.length,
          totalMembers: state.members.length,
        };
      },
    })),
    { name: 'WorkspaceStore' }
  )
);