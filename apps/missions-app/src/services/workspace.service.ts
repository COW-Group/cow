import { Workspace, Folder, WorkspaceBoard, WorkspaceMember, WorkspaceDashboard, WorkspaceDoc, WorkspaceForm, WorkspaceApp } from '../types/workspace.types';
import { boardService } from './board.service';
import { COWBoard } from '../types/board.types';

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export class WorkspaceService {
  private workspaces: Map<string, Workspace> = new Map();
  private workspaceMembers: Map<string, WorkspaceMember[]> = new Map();

  constructor() {
    // Initialize with a default Main workspace
    this.createDefaultWorkspace();
  }

  /**
   * Sync workspace boards with COW board system
   */
  async syncWithCOWBoards(): Promise<void> {
    try {
      // Get all COW boards
      const cowBoards = await boardService.getBoards();
      
      // Update workspace boards to match COW boards
      for (const workspace of this.workspaces.values()) {
        const workspaceBoards: WorkspaceBoard[] = cowBoards.map(cowBoard => ({
          id: cowBoard.id,
          name: cowBoard.title,
          description: cowBoard.description,
          workspaceId: workspace.id,
          folderId: undefined, // Will be set based on existing workspace structure
          ownerId: cowBoard.ownerId || 'current-user',
          color: '#579bfc', // Default color, can be customized
          starred: cowBoard.isStarred || false,
          boardType: 'flexiboard',
          createdAt: cowBoard.createdAt,
          updatedAt: cowBoard.updatedAt
        }));

        // Update workspace boards
        workspace.boards = workspaceBoards;
        workspace.updatedAt = new Date();
      }
    } catch (error) {
      console.warn('Failed to sync with COW boards:', error);
    }
  }

  private createDefaultWorkspace() {
    const defaultWorkspace: Workspace = {
      id: 'workspace-main',
      name: 'Main Workspace',
      description: 'Your default workspace for company-wide collaboration',
      type: 'open',
      color: '#579bfc',
      icon: '🏢',
      isDefault: true,
      ownerId: 'current-user',
      memberIds: ['current-user'],
      createdAt: new Date(),
      updatedAt: new Date(),
      folders: [],
      boards: [],
      dashboards: [],
      docs: [],
      forms: [],
      apps: []
    };

    this.workspaces.set(defaultWorkspace.id, defaultWorkspace);
    
    // Add sample folders and boards
    this.createSampleContent(defaultWorkspace.id);
  }

  private createSampleContent(workspaceId: string) {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return;

    // Create Marketing folder
    const marketingFolder: Folder = {
      id: 'folder-marketing',
      name: 'Marketing',
      color: '#ff9f40',
      workspaceId,
      collapsed: false,
      boards: [],
      dashboards: [],
      docs: [],
      forms: [],
      apps: [],
      subFolders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create HR folder
    const hrFolder: Folder = {
      id: 'folder-hr',
      name: 'Human Resources',
      color: '#00c875',
      workspaceId,
      collapsed: false,
      boards: [],
      dashboards: [],
      docs: [],
      forms: [],
      apps: [],
      subFolders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workspace.folders = [marketingFolder, hrFolder];
    
    // Create sample boards using the integrated system
    this.createSampleBoardsAsync(workspaceId, marketingFolder.id, hrFolder.id);
  }

  /**
   * Get all workspaces for current user
   */
  getAllWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values());
  }

  /**
   * Get workspace by ID
   */
  getWorkspaceById(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  /**
   * Create a new workspace
   */
  createWorkspace(data: {
    name: string;
    description?: string;
    type: 'open' | 'closed';
    color: string;
    icon?: string;
  }): Workspace {
    const workspace: Workspace = {
      id: generateId(),
      ...data,
      ownerId: 'current-user',
      memberIds: ['current-user'],
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      folders: [],
      boards: [],
      dashboards: [],
      docs: [],
      forms: []
    };

    this.workspaces.set(workspace.id, workspace);
    return workspace;
  }

  /**
   * Update workspace
   */
  updateWorkspace(id: string, updates: Partial<Workspace>): Workspace | null {
    const workspace = this.workspaces.get(id);
    if (!workspace) return null;

    const updated = { ...workspace, ...updates, updatedAt: new Date() };
    this.workspaces.set(id, updated);
    return updated;
  }

  /**
   * Delete workspace
   */
  deleteWorkspace(id: string): boolean {
    const workspace = this.workspaces.get(id);
    if (!workspace || workspace.isDefault) return false;

    return this.workspaces.delete(id);
  }

  /**
   * Create folder in workspace or from modal data
   */
  createFolder(workspaceIdOrData: string | any, data?: {
    name: string;
    color: string;
    parentId?: string;
  }): Folder | null {
    // Handle both old API (workspaceId, data) and new API (data)
    let workspaceId: string;
    let folderData: any;
    
    if (typeof workspaceIdOrData === 'string') {
      workspaceId = workspaceIdOrData;
      folderData = data!;
    } else {
      folderData = workspaceIdOrData;
      workspaceId = folderData.workspaceId;
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return null;

    const folder: Folder = {
      id: folderData.id || generateId(),
      name: folderData.name,
      color: folderData.color,
      parentId: folderData.parentId,
      workspaceId,
      collapsed: false,
      boards: [],
      dashboards: [],
      docs: [],
      forms: [],
      apps: [],
      subFolders: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (folderData.parentId) {
      // Add to parent folder
      const parentFolder = this.findFolderInWorkspace(workspace, folderData.parentId);
      if (parentFolder) {
        parentFolder.subFolders.push(folder);
      }
    } else {
      // Add to workspace root
      workspace.folders.push(folder);
    }

    workspace.updatedAt = new Date();
    return folder;
  }

  /**
   * Create board in workspace - now integrated with COW board system
   */
  async createBoard(data: any): Promise<WorkspaceBoard | null> {
    const workspace = this.workspaces.get(data.workspaceId);
    if (!workspace) return null;

    try {
      // Create board using COW board service
      const mockUser = { id: data.ownerId || 'current-user', name: 'Current User', avatar: '' };
      const cowBoard = await boardService.createBoard({
        title: data.name,
        description: data.description,
        type: 'project',
        settings: {
          columnOrder: ['title', 'status', 'priority', 'assignee', 'dueDate'],
          permissions: { public: true },
          notifications: { enabled: true }
        }
      }, mockUser);

      // Convert COW board to workspace board format
      const workspaceBoard: WorkspaceBoard = {
        id: cowBoard.id,
        name: cowBoard.title,
        description: cowBoard.description,
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        ownerId: data.ownerId || 'current-user',
        color: data.color || '#579bfc',
        starred: false,
        boardType: 'flexiboard',
        createdAt: cowBoard.createdAt,
        updatedAt: cowBoard.updatedAt
      };

      // Update workspace to track the board
      workspace.boards.push(workspaceBoard);

      // Add to folder if specified
      if (data.folderId) {
        const folder = this.findFolderInWorkspace(workspace, data.folderId);
        if (folder) {
          folder.boards.push(workspaceBoard);
        }
      }

      workspace.updatedAt = new Date();
      return workspaceBoard;
    } catch (error) {
      console.error('Failed to create board:', error);
      return null;
    }
  }

  /**
   * Create dashboard in workspace
   */
  createDashboard(data: any): WorkspaceDashboard | null {
    const workspace = this.workspaces.get(data.workspaceId);
    if (!workspace) return null;

    const dashboard: WorkspaceDashboard = {
      id: data.id || generateId(),
      name: data.name,
      description: data.description,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      ownerId: data.ownerId,
      starred: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workspace.dashboards.push(dashboard);

    // Add to folder if specified
    if (data.folderId) {
      const folder = this.findFolderInWorkspace(workspace, data.folderId);
      if (folder) {
        folder.dashboards.push(dashboard);
      }
    }

    workspace.updatedAt = new Date();
    return dashboard;
  }

  /**
   * Create doc in workspace
   */
  createDoc(data: any): WorkspaceDoc | null {
    const workspace = this.workspaces.get(data.workspaceId);
    if (!workspace) return null;

    const doc: WorkspaceDoc = {
      id: data.id || generateId(),
      name: data.name,
      description: data.description,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      ownerId: data.ownerId,
      starred: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workspace.docs.push(doc);

    // Add to folder if specified
    if (data.folderId) {
      const folder = this.findFolderInWorkspace(workspace, data.folderId);
      if (folder) {
        folder.docs.push(doc);
      }
    }

    workspace.updatedAt = new Date();
    return doc;
  }

  /**
   * Create form in workspace
   */
  createForm(data: any): WorkspaceForm | null {
    const workspace = this.workspaces.get(data.workspaceId);
    if (!workspace) return null;

    const form: WorkspaceForm = {
      id: data.id || generateId(),
      name: data.name,
      description: data.description,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      ownerId: data.ownerId,
      starred: false,
      linkedBoardId: data.linkedBoardId,
      submissionCount: data.submissionCount || 0,
      isActive: data.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    workspace.forms.push(form);

    // Add to folder if specified
    if (data.folderId) {
      const folder = this.findFolderInWorkspace(workspace, data.folderId);
      if (folder) {
        folder.forms.push(form);
      }
    }

    workspace.updatedAt = new Date();
    return form;
  }

  createApp(data: any): WorkspaceApp | null {
    const workspace = this.workspaces.get(data.workspaceId);
    if (!workspace) return null;

    const app: WorkspaceApp = {
      id: data.id || generateId(),
      appId: data.appId,
      name: data.name,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      ownerId: data.ownerId || 'current-user',
      starred: false,
      settings: data.settings || {},
      isEnabled: data.isEnabled !== false,
      addedAt: new Date()
    };

    workspace.apps.push(app);

    // Add to folder if specified
    if (data.folderId) {
      const folder = this.findFolderInWorkspace(workspace, data.folderId);
      if (folder) {
        folder.apps.push(app);
      }
    }

    workspace.updatedAt = new Date();
    return app;
  }

  /**
   * Update board - now integrated with COW board system
   */
  async updateBoard(boardId: string, updates: Partial<WorkspaceBoard>): Promise<boolean> {
    try {
      // Update the COW board
      const boardUpdates: Partial<COWBoard> = {};
      if (updates.name) boardUpdates.title = updates.name;
      if (updates.description) boardUpdates.description = updates.description;
      
      if (Object.keys(boardUpdates).length > 0) {
        await boardService.updateBoard(boardId, boardUpdates);
      }

      // Update workspace board tracking
      for (const workspace of this.workspaces.values()) {
        const board = workspace.boards.find(b => b.id === boardId);
        if (board) {
          Object.assign(board, updates, { updatedAt: new Date() });
          workspace.updatedAt = new Date();
          
          // Update in folder if it exists
          if (board.folderId) {
            const folder = this.findFolderInWorkspace(workspace, board.folderId);
            if (folder) {
              const folderBoard = folder.boards.find(b => b.id === boardId);
              if (folderBoard) {
                Object.assign(folderBoard, updates, { updatedAt: new Date() });
              }
            }
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to update board:', error);
      return false;
    }
  }

  /**
   * Update folder
   */
  updateFolder(folderId: string, updates: Partial<Folder>): boolean {
    for (const workspace of this.workspaces.values()) {
      const folder = this.findFolderInWorkspace(workspace, folderId);
      if (folder) {
        Object.assign(folder, updates, { updatedAt: new Date() });
        workspace.updatedAt = new Date();
        return true;
      }
    }
    return false;
  }

  /**
   * Delete board - now integrated with COW board system
   */
  async deleteBoard(workspaceId: string, boardId: string): Promise<boolean> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    const boardIndex = workspace.boards.findIndex(b => b.id === boardId);
    if (boardIndex === -1) return false;

    try {
      // Delete from COW board system
      await boardService.deleteBoard(boardId);

      const board = workspace.boards[boardIndex];
      
      // Remove from workspace
      workspace.boards.splice(boardIndex, 1);

      // Remove from folder if it was in one
      if (board.folderId) {
        const folder = this.findFolderInWorkspace(workspace, board.folderId);
        if (folder) {
          const folderBoardIndex = folder.boards.findIndex(b => b.id === boardId);
          if (folderBoardIndex !== -1) {
            folder.boards.splice(folderBoardIndex, 1);
          }
        }
      }

      workspace.updatedAt = new Date();
      return true;
    } catch (error) {
      console.error('Failed to delete board:', error);
      return false;
    }
  }

  /**
   * Delete folder
   */
  deleteFolder(workspaceId: string, folderId: string): boolean {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    // Find and remove the folder
    const removeFromArray = (folders: Folder[]): boolean => {
      const index = folders.findIndex(f => f.id === folderId);
      if (index !== -1) {
        folders.splice(index, 1);
        return true;
      }
      
      // Check subfolders recursively
      for (const folder of folders) {
        if (removeFromArray(folder.subFolders)) {
          return true;
        }
      }
      
      return false;
    };

    if (removeFromArray(workspace.folders)) {
      workspace.updatedAt = new Date();
      return true;
    }

    return false;
  }

  /**
   * Move board to folder
   */
  moveBoardToFolder(workspaceId: string, boardId: string, folderId?: string): boolean {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    const board = workspace.boards.find(b => b.id === boardId);
    if (!board) return false;

    // Remove from old folder if it was in one
    if (board.folderId) {
      const oldFolder = this.findFolderInWorkspace(workspace, board.folderId);
      if (oldFolder) {
        oldFolder.boards = oldFolder.boards.filter(b => b.id !== boardId);
      }
    }

    // Add to new folder or workspace root
    board.folderId = folderId;
    if (folderId) {
      const newFolder = this.findFolderInWorkspace(workspace, folderId);
      if (newFolder) {
        newFolder.boards.push(board);
      }
    }

    workspace.updatedAt = new Date();
    return true;
  }

  /**
   * Toggle folder collapse state
   */
  toggleFolderCollapse(workspaceId: string, folderId: string): boolean {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    const folder = this.findFolderInWorkspace(workspace, folderId);
    if (!folder) return false;

    folder.collapsed = !folder.collapsed;
    workspace.updatedAt = new Date();
    return true;
  }

  /**
   * Star/unstar board - now integrated with COW board system
   */
  async toggleBoardStar(workspaceId: string, boardId: string): Promise<boolean> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    const board = workspace.boards.find(b => b.id === boardId);
    if (!board) return false;

    try {
      // Toggle star in COW board system
      await boardService.toggleBoardStar(boardId);

      // Update workspace board tracking
      board.starred = !board.starred;
      workspace.updatedAt = new Date();
      return true;
    } catch (error) {
      console.error('Failed to toggle board star:', error);
      return false;
    }
  }

  /**
   * Get starred boards across all workspaces
   */
  getStarredBoards(): WorkspaceBoard[] {
    const starredBoards: WorkspaceBoard[] = [];
    
    for (const workspace of this.workspaces.values()) {
      const starred = workspace.boards.filter(b => b.starred);
      starredBoards.push(...starred);
    }

    return starredBoards.sort((a, b) => 
      (b.lastViewed?.getTime() || 0) - (a.lastViewed?.getTime() || 0)
    );
  }

  /**
   * Search boards across workspaces
   */
  searchBoards(query: string): WorkspaceBoard[] {
    const results: WorkspaceBoard[] = [];
    const searchTerm = query.toLowerCase();

    for (const workspace of this.workspaces.values()) {
      const matches = workspace.boards.filter(board => 
        board.name.toLowerCase().includes(searchTerm) ||
        board.description?.toLowerCase().includes(searchTerm)
      );
      results.push(...matches);
    }

    return results;
  }

  private findFolderInWorkspace(workspace: Workspace, folderId: string): Folder | null {
    // Search in root folders
    for (const folder of workspace.folders) {
      if (folder.id === folderId) return folder;
      
      // Search in subfolders recursively
      const subFolder = this.findFolderRecursive(folder, folderId);
      if (subFolder) return subFolder;
    }
    return null;
  }

  private findFolderRecursive(folder: Folder, folderId: string): Folder | null {
    for (const subFolder of folder.subFolders) {
      if (subFolder.id === folderId) return subFolder;
      
      const found = this.findFolderRecursive(subFolder, folderId);
      if (found) return found;
    }
    return null;
  }

  /**
   * Create sample boards asynchronously
   */
  private async createSampleBoardsAsync(workspaceId: string, marketingFolderId: string, hrFolderId: string) {
    const sampleBoardsData = [
      {
        name: 'Marketing Campaigns',
        description: 'Track all marketing campaigns',
        workspaceId,
        folderId: marketingFolderId,
        ownerId: 'current-user',
        color: '#ff9f40',
        starred: true
      },
      {
        name: 'Lead Management',
        description: 'Track and manage leads',
        workspaceId,
        folderId: marketingFolderId,
        ownerId: 'current-user',
        color: '#579bfc'
      },
      {
        name: 'Hiring Pipeline',
        description: 'Track hiring process',
        workspaceId,
        folderId: hrFolderId,
        ownerId: 'current-user',
        color: '#00c875'
      },
      {
        name: 'General Tasks',
        description: 'General task management',
        workspaceId,
        ownerId: 'current-user',
        color: '#9d34da',
        starred: true
      }
    ];

    // Create boards asynchronously
    for (const boardData of sampleBoardsData) {
      try {
        const board = await this.createBoard(boardData);
        if (board && boardData.starred) {
          // Update starred status after creation
          await this.toggleBoardStar(workspaceId, board.id);
        }
      } catch (error) {
        console.warn('Failed to create sample board:', boardData.name, error);
      }
    }
  }
}

export const workspaceService = new WorkspaceService();