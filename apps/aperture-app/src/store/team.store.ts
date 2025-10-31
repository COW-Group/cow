import { create } from 'zustand';
import { Team, TeamMember, CreateTeamData, UpdateTeamData, InviteMemberData, TeamRole } from '../types/team.types';

interface TeamStore {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (teamData: CreateTeamData) => Promise<void>;
  updateTeam: (teamId: string, updateData: UpdateTeamData) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  
  // Member management
  inviteMember: (teamId: string, inviteData: InviteMemberData) => Promise<void>;
  removeMember: (teamId: string, memberId: string) => Promise<void>;
  updateMemberRole: (teamId: string, memberId: string, role: TeamRole) => Promise<void>;
  
  // Permissions
  getUserPermissions: (teamId: string, userId: string) => string[];
  canUserPerformAction: (teamId: string, userId: string, action: string) => boolean;
}

// Mock data for development
const mockTeams: Team[] = [
  {
    id: 'team-strops',
    name: 'STROPS Team',
    description: 'Strategy, Planning, and Vertical Operations',
    type: 'department',
    visibility: 'public',
    memberCount: 8,
    ownerId: 'likhitha',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    settings: {
      allowMemberInvites: true,
      requireApprovalForJoining: false,
      defaultMemberRole: 'member',
      goalVisibility: 'team'
    },
    members: [
      {
        id: 'likhitha',
        name: 'Likhitha Palaypu',
        email: 'likhitha@cowgroup.com',
        role: 'owner',
        joinedAt: '2024-01-01',
        isActive: true
      },
      {
        id: 'john-doe',
        name: 'John Doe',
        email: 'john@cowgroup.com',
        role: 'admin',
        joinedAt: '2024-01-05',
        isActive: true
      },
      {
        id: 'jane-smith',
        name: 'Jane Smith',
        email: 'jane@cowgroup.com',
        role: 'member',
        joinedAt: '2024-01-10',
        isActive: true
      }
    ]
  },
  {
    id: 'team-red',
    name: 'R&D Team',
    description: 'Research & Development',
    type: 'department',
    visibility: 'public',
    memberCount: 12,
    ownerId: 'sarah-johnson',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-12',
    settings: {
      allowMemberInvites: true,
      requireApprovalForJoining: true,
      defaultMemberRole: 'member',
      goalVisibility: 'public'
    },
    members: [
      {
        id: 'sarah-johnson',
        name: 'Sarah Johnson',
        email: 'sarah@cowgroup.com',
        role: 'owner',
        joinedAt: '2024-01-01',
        isActive: true
      },
      {
        id: 'mike-wilson',
        name: 'Mike Wilson',
        email: 'mike@cowgroup.com',
        role: 'member',
        joinedAt: '2024-01-08',
        isActive: true
      }
    ]
  },
  {
    id: 'team-legal',
    name: 'Legal & Compliance',
    description: 'Legal and Compliance Operations',
    type: 'department',
    visibility: 'private',
    memberCount: 4,
    ownerId: 'legal-head',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    settings: {
      allowMemberInvites: false,
      requireApprovalForJoining: true,
      defaultMemberRole: 'guest',
      goalVisibility: 'admin'
    },
    members: [
      {
        id: 'legal-head',
        name: 'Legal Team Lead',
        email: 'legal@cowgroup.com',
        role: 'owner',
        joinedAt: '2024-01-01',
        isActive: true
      }
    ]
  },
  {
    id: 'team-sales',
    name: 'Sales & Marketing',
    description: 'Revenue generation and customer acquisition',
    type: 'department',
    visibility: 'public',
    memberCount: 15,
    ownerId: 'sales-director',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14',
    settings: {
      allowMemberInvites: true,
      requireApprovalForJoining: false,
      defaultMemberRole: 'member',
      goalVisibility: 'public'
    },
    members: [
      {
        id: 'sales-director',
        name: 'Sales Director',
        email: 'sales@cowgroup.com',
        role: 'owner',
        joinedAt: '2024-01-01',
        isActive: true
      }
    ]
  }
];

export const useTeamStore = create<TeamStore>((set, get) => ({
  teams: mockTeams,
  currentTeam: mockTeams[0], // Default to STROPS team
  loading: false,
  error: null,

  setTeams: (teams) => set({ teams }),
  
  setCurrentTeam: (team) => set({ currentTeam: team }),

  createTeam: async (teamData) => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamData.name,
        description: teamData.description,
        type: teamData.type,
        visibility: teamData.visibility,
        memberCount: 1,
        ownerId: 'current-user', // Would be actual current user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          allowMemberInvites: true,
          requireApprovalForJoining: false,
          defaultMemberRole: 'member',
          goalVisibility: 'team'
        },
        members: [
          {
            id: 'current-user',
            name: 'Current User',
            email: 'user@cowgroup.com',
            role: 'owner',
            joinedAt: new Date().toISOString(),
            isActive: true
          }
        ]
      };

      set(state => ({
        teams: [...state.teams, newTeam],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create team', loading: false });
    }
  },

  updateTeam: async (teamId, updateData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        teams: state.teams.map(team =>
          team.id === teamId 
            ? { ...team, ...updateData, updatedAt: new Date().toISOString() }
            : team
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update team', loading: false });
    }
  },

  deleteTeam: async (teamId) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        teams: state.teams.filter(team => team.id !== teamId),
        currentTeam: state.currentTeam?.id === teamId ? null : state.currentTeam,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete team', loading: false });
    }
  },

  inviteMember: async (teamId, inviteData) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMember: TeamMember = {
        id: `member-${Date.now()}`,
        name: inviteData.email.split('@')[0],
        email: inviteData.email,
        role: inviteData.role,
        joinedAt: new Date().toISOString(),
        isActive: true
      };

      set(state => ({
        teams: state.teams.map(team =>
          team.id === teamId
            ? {
                ...team,
                members: [...team.members, newMember],
                memberCount: team.memberCount + 1,
                updatedAt: new Date().toISOString()
              }
            : team
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to invite member', loading: false });
    }
  },

  removeMember: async (teamId, memberId) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        teams: state.teams.map(team =>
          team.id === teamId
            ? {
                ...team,
                members: team.members.filter(member => member.id !== memberId),
                memberCount: team.memberCount - 1,
                updatedAt: new Date().toISOString()
              }
            : team
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to remove member', loading: false });
    }
  },

  updateMemberRole: async (teamId, memberId, role) => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        teams: state.teams.map(team =>
          team.id === teamId
            ? {
                ...team,
                members: team.members.map(member =>
                  member.id === memberId ? { ...member, role } : member
                ),
                updatedAt: new Date().toISOString()
              }
            : team
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update member role', loading: false });
    }
  },

  getUserPermissions: (teamId, userId) => {
    const team = get().teams.find(t => t.id === teamId);
    if (!team) return [];

    const member = team.members.find(m => m.id === userId);
    if (!member) return [];

    // Role-based permissions
    const permissions: Record<TeamRole, string[]> = {
      owner: ['manage_team', 'invite_members', 'remove_members', 'edit_goals', 'view_goals', 'delete_team'],
      admin: ['invite_members', 'remove_members', 'edit_goals', 'view_goals'],
      member: ['view_goals', 'edit_own_goals'],
      guest: ['view_goals']
    };

    return permissions[member.role] || [];
  },

  canUserPerformAction: (teamId, userId, action) => {
    const permissions = get().getUserPermissions(teamId, userId);
    return permissions.includes(action);
  }
}));