export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: TeamRole;
  joinedAt: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  type: TeamType;
  visibility: TeamVisibility;
  memberCount: number;
  members: TeamMember[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  settings: TeamSettings;
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  requireApprovalForJoining: boolean;
  defaultMemberRole: TeamRole;
  goalVisibility: GoalVisibility;
}

export type TeamType = 
  | 'department'     // Marketing, Engineering, Sales
  | 'project'        // Cross-functional project team
  | 'cross-functional' // Matrix teams
  | 'external';      // Client/vendor teams

export type TeamVisibility = 
  | 'public'         // Visible to all organization members
  | 'private'        // Invite only
  | 'secret';        // Hidden from non-members

export type TeamRole = 
  | 'owner'          // Team creator/admin
  | 'admin'          // Can manage team and members
  | 'member'         // Standard team member
  | 'guest';         // Limited access external user

export type GoalVisibility = 
  | 'public'         // All org members can view
  | 'team'           // Team members only
  | 'admin';         // Team admins only

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermissions {
  role: TeamRole;
  permissions: Permission[];
}

// Team management actions
export interface CreateTeamData {
  name: string;
  description?: string;
  type: TeamType;
  visibility: TeamVisibility;
  members?: { email: string; role: TeamRole }[];
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  visibility?: TeamVisibility;
  settings?: Partial<TeamSettings>;
}

export interface InviteMemberData {
  email: string;
  role: TeamRole;
  message?: string;
}