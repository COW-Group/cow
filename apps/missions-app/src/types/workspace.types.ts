export interface Workspace {
  id: string;
  name: string;
  description?: string;
  type: 'open' | 'closed';
  color: string;
  icon?: string;
  isDefault?: boolean;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
  folders: Folder[];
  boards: WorkspaceBoard[];
  dashboards: WorkspaceDashboard[];
  docs: WorkspaceDoc[];
  forms: WorkspaceForm[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  parentId?: string; // For sub-folders
  workspaceId: string;
  collapsed?: boolean;
  boards: WorkspaceBoard[];
  dashboards: WorkspaceDashboard[];
  docs: WorkspaceDoc[];
  forms: WorkspaceForm[];
  subFolders: Folder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceBoard {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  folderId?: string;
  ownerId: string;
  color: string;
  starred?: boolean;
  lastViewed?: Date;
  boardType: 'flexiboard' | 'cowboard';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceDashboard {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  folderId?: string;
  ownerId: string;
  starred?: boolean;
  lastViewed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceDoc {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  folderId?: string;
  ownerId: string;
  starred?: boolean;
  lastViewed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceForm {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  folderId?: string;
  ownerId: string;
  starred?: boolean;
  lastViewed?: Date;
  linkedBoardId?: string; // Forms can be connected to boards
  submissionCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspacePermissions {
  canViewWorkspace: boolean;
  canEditWorkspace: boolean;
  canDeleteWorkspace: boolean;
  canCreateBoards: boolean;
  canManageMembers: boolean;
  canCreateFolders: boolean;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'admin' | 'member' | 'viewer';
  permissions: WorkspacePermissions;
  joinedAt: Date;
}

export type WorkspaceViewType = 'list' | 'grid' | 'timeline';
export type WorkspaceSortBy = 'name' | 'created' | 'updated' | 'lastViewed';