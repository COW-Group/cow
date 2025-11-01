import { supabase } from '../lib/supabase';
import { Workspace, WorkspaceBoard, Folder } from '../types/workspace.types';

export class SupabaseWorkspaceService {
  /**
   * Load all workspaces from Supabase, optionally filtered by organization
   */
  async loadWorkspaces(organizationId?: string | null): Promise<Workspace[]> {
    try {
      console.log('🔍 Loading workspaces from Supabase...', organizationId ? `for org ${organizationId}` : '');

      // Fetch workspaces - filter by organization if provided
      let query = supabase
        .from('workspaces')
        .select('*');

      // Only filter by organization if organizationId is provided
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data: workspacesData, error: workspacesError } = await query.order('created_at', { ascending: true });

      if (workspacesError) {
        console.error('Error loading workspaces:', workspacesError);
        return [];
      }

      console.log('✅ Loaded workspaces:', workspacesData);

      // Fetch boards ONLY for the loaded workspaces
      const workspaceIds = workspacesData.map(ws => ws.id);
      let boardsData: any[] = [];

      if (workspaceIds.length > 0) {
        const { data, error: boardsError } = await supabase
          .from('boards')
          .select('*')
          .in('workspace_id', workspaceIds)
          .order('created_at', { ascending: true });

        if (boardsError) {
          console.error('Error loading boards:', boardsError);
        } else {
          boardsData = data || [];
        }
      }

      console.log('✅ Loaded boards:', boardsData);

      // Transform Supabase data to workspace format
      // Prioritize workspaces with emoji or "MyCow Group" name (our migrated data)
      const sortedWorkspaces = workspacesData.sort((a, b) => {
        if (a.name.includes('🐮') && !b.name.includes('🐮')) return -1;
        if (!a.name.includes('🐮') && b.name.includes('🐮')) return 1;
        return a.created_at.localeCompare(b.created_at);
      });

      console.log('📊 Workspace priority order:', sortedWorkspaces.map(w => w.name));

      // Fetch all workspace items in parallel for the loaded workspaces
      const [foldersData, dashboardsData, docsData, formsData, appsData] = await Promise.all([
        this.loadFolders(workspaceIds[0] || ''), // For now, load for first workspace
        this.loadDashboards(workspaceIds[0] || ''),
        this.loadDocs(workspaceIds[0] || ''),
        this.loadForms(workspaceIds[0] || ''),
        this.loadWorkspaceApps(workspaceIds[0] || '')
      ]);

      console.log('✅ Loaded folders:', foldersData);
      console.log('✅ Loaded dashboards:', dashboardsData);
      console.log('✅ Loaded docs:', docsData);
      console.log('✅ Loaded forms:', formsData);
      console.log('✅ Loaded apps:', appsData);

      const workspaces: Workspace[] = sortedWorkspaces.map(ws => {
        // Find boards for this workspace
        const workspaceBoards = boardsData?.filter(board => board.workspace_id === ws.id) || [];

        // Separate boards into categories:
        // 1. User-created boards (no monday_board_id) -> always display as boards
        // 2. Migrated strategic boards (monday_board_id + "Q1 Strategic" in title) -> display as boards
        // 3. Migrated department boards (monday_board_id + department prefix) -> convert to folders

        const userCreatedBoards = workspaceBoards.filter(board => !board.monday_board_id);

        const migratedStrategicBoards = workspaceBoards.filter(board =>
          board.monday_board_id && (board.title.includes('Q1 Strategic') || board.monday_board_id === '8198396724')
        );

        const migratedDepartmentBoards = workspaceBoards.filter(board =>
          board.monday_board_id &&
          !board.title.includes('Q1 Strategic') &&
          board.monday_board_id !== '8198396724'
        );

        // Create folders for migrated department boards only
        const folders = migratedDepartmentBoards.map(board => ({
          id: `folder-${board.id}`,
          name: board.title.replace(' - ', ' '),
          color: this.getBoardColor(board.title),
          workspaceId: ws.id,
          collapsed: false,
          boards: [], // Department folders will contain sub-boards when created
          dashboards: [],
          docs: [],
          forms: [],
          apps: [],
          subFolders: [],
          createdAt: new Date(board.created_at),
          updatedAt: new Date(board.updated_at)
        }));

        // Convert all non-department boards to workspace boards (user-created + strategic)
        const allDisplayBoards = [...userCreatedBoards, ...migratedStrategicBoards];
        const boards: WorkspaceBoard[] = allDisplayBoards.map(board => ({
          id: board.id,
          name: board.title,
          description: board.description || '',
          workspaceId: ws.id,
          folderId: undefined, // Boards at workspace root level
          ownerId: board.created_by,
          color: this.getBoardColor(board.title),
          starred: board.is_starred || false,
          boardType: 'flexiboard',
          createdAt: new Date(board.created_at),
          updatedAt: new Date(board.updated_at),
          mondayBoardId: board.monday_board_id
        }));

        // Load user-created folders from Supabase (not migrated department folders)
        const userFolders = foldersData.filter((f: any) => f.workspace_id === ws.id).map((f: any) => ({
          id: f.id,
          name: f.name,
          description: f.description || '',
          color: f.color || '#579bfc',
          workspaceId: ws.id,
          parentId: f.parent_folder_id,
          collapsed: f.collapsed || false,
          boards: [],
          dashboards: [],
          docs: [],
          forms: [],
          apps: [],
          subFolders: [],
          createdAt: new Date(f.created_at),
          updatedAt: new Date(f.updated_at)
        }));

        // Combine migrated department folders with user-created folders
        const allFolders = [...folders, ...userFolders];

        // Transform dashboards from Supabase
        const dashboards = dashboardsData.filter((d: any) => d.workspace_id === ws.id).map((d: any) => ({
          id: d.id,
          name: d.name,
          description: d.description || '',
          workspaceId: ws.id,
          folderId: d.folder_id,
          layout: d.layout || { widgets: [] },
          createdAt: new Date(d.created_at),
          updatedAt: new Date(d.updated_at)
        }));

        // Transform docs from Supabase
        const docs = docsData.filter((doc: any) => doc.workspace_id === ws.id).map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          content: doc.content || '',
          workspaceId: ws.id,
          folderId: doc.folder_id,
          createdAt: new Date(doc.created_at),
          updatedAt: new Date(doc.updated_at)
        }));

        // Transform forms from Supabase
        const forms = formsData.filter((f: any) => f.workspace_id === ws.id).map((f: any) => ({
          id: f.id,
          name: f.name,
          description: f.description || '',
          workspaceId: ws.id,
          folderId: f.folder_id,
          linkedBoardId: f.linked_board_id,
          submissionCount: f.submission_count || 0,
          isActive: f.is_active || true,
          createdAt: new Date(f.created_at),
          updatedAt: new Date(f.updated_at)
        }));

        // Transform apps from Supabase
        const apps = appsData.filter((a: any) => a.workspace_id === ws.id).map((a: any) => ({
          id: a.id,
          appId: a.app_id,
          name: a.name,
          description: a.description || '',
          workspaceId: ws.id,
          folderId: a.folder_id,
          isActive: a.is_active || true,
          createdAt: new Date(a.created_at),
          updatedAt: new Date(a.updated_at)
        }));

        console.log(`✅ Workspace ${ws.name}: ${allFolders.length} folders, ${boards.length} boards, ${dashboards.length} dashboards, ${docs.length} docs, ${forms.length} forms, ${apps.length} apps`);

        return {
          id: ws.id,
          name: ws.name,
          description: ws.description || '',
          type: 'open',
          color: '#579bfc',
          icon: ws.name.includes('🐮') ? '🐮' : '🏢',
          isDefault: true,
          ownerId: ws.created_by,
          memberIds: [ws.created_by],
          createdAt: new Date(ws.created_at),
          updatedAt: new Date(ws.updated_at),
          folders: allFolders,
          boards,
          dashboards,
          docs,
          forms,
          apps
        };
      });

      console.log('✅ Transformed workspaces:', workspaces);
      return workspaces;

    } catch (error) {
      console.error('Failed to load workspaces from Supabase:', error);
      return [];
    }
  }

  /**
   * Load tasks for a specific board
   */
  async loadBoardTasks(boardId: string) {
    try {
      console.log(`🔍 Loading tasks for board ${boardId}...`);

      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          board_groups (
            id,
            title,
            color,
            position
          )
        `)
        .eq('board_id', boardId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading tasks:', error);
        return [];
      }

      console.log('✅ Loaded tasks:', tasksData);
      return tasksData;

    } catch (error) {
      console.error('Failed to load tasks:', error);
      return [];
    }
  }

  /**
   * Get color for board based on its title/type
   */
  private getBoardColor(title: string): string {
    const colorMap: Record<string, string> = {
      'FIN': '#ff6b35', // Orange for Finance
      'TECH': '#00c875', // Green for Technology
      'SALE': '#9d34da', // Purple for Sales
      'STR': '#579bfc', // Blue for Strategy
      'LAUNCH': '#ff9f40', // Yellow for Launch
      'Q1': '#e2445c', // Red for Strategic missions
    };

    // Find matching color based on title content
    for (const [key, color] of Object.entries(colorMap)) {
      if (title.toUpperCase().includes(key)) {
        return color;
      }
    }

    return '#579bfc'; // Default blue
  }

  /**
   * Test Supabase connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Supabase connection...');

      const { data, error} = await supabase
        .from('workspaces')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Supabase connection test failed:', error);
        return false;
      }

      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  }

  // ==================== FOLDER CRUD ====================

  async createFolder(data: {
    workspaceId: string;
    name: string;
    description?: string;
    color?: string;
    parentId?: string;
    createdBy: string;
  }) {
    try {
      console.log('📂 Creating folder in Supabase:', data);

      const { data: folder, error } = await supabase
        .from('folders')
        .insert({
          workspace_id: data.workspaceId,
          parent_folder_id: data.parentId || null,
          name: data.name,
          description: data.description || '',
          color: data.color || '#579bfc',
          created_by: data.createdBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating folder:', error);
        return null;
      }

      console.log('✅ Folder created:', folder);
      return folder;
    } catch (error) {
      console.error('❌ Failed to create folder:', error);
      return null;
    }
  }

  async loadFolders(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading folders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to load folders:', error);
      return [];
    }
  }

  async updateFolder(folderId: string, updates: { name?: string; description?: string; color?: string; collapsed?: boolean }) {
    try {
      const { data, error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', folderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating folder:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to update folder:', error);
      return null;
    }
  }

  async deleteFolder(folderId: string) {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) {
        console.error('Error deleting folder:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete folder:', error);
      return false;
    }
  }

  // ==================== DASHBOARD CRUD ====================

  async createDashboard(data: {
    workspaceId: string;
    folderId?: string;
    name: string;
    description?: string;
    createdBy: string;
  }) {
    try {
      console.log('📊 Creating dashboard in Supabase:', data);

      const { data: dashboard, error } = await supabase
        .from('dashboards')
        .insert({
          workspace_id: data.workspaceId,
          folder_id: data.folderId || null,
          name: data.name,
          description: data.description || '',
          created_by: data.createdBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating dashboard:', error);
        return null;
      }

      console.log('✅ Dashboard created:', dashboard);
      return dashboard;
    } catch (error) {
      console.error('❌ Failed to create dashboard:', error);
      return null;
    }
  }

  async loadDashboards(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading dashboards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to load dashboards:', error);
      return [];
    }
  }

  // ==================== DOC CRUD ====================

  async createDoc(data: {
    workspaceId: string;
    folderId?: string;
    name: string;
    content?: string;
    createdBy: string;
  }) {
    try {
      console.log('📝 Creating doc in Supabase:', data);

      const { data: doc, error } = await supabase
        .from('docs')
        .insert({
          workspace_id: data.workspaceId,
          folder_id: data.folderId || null,
          name: data.name,
          content: data.content || '',
          created_by: data.createdBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating doc:', error);
        return null;
      }

      console.log('✅ Doc created:', doc);
      return doc;
    } catch (error) {
      console.error('❌ Failed to create doc:', error);
      return null;
    }
  }

  async loadDocs(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading docs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to load docs:', error);
      return [];
    }
  }

  // ==================== FORM CRUD ====================

  async createForm(data: {
    workspaceId: string;
    folderId?: string;
    linkedBoardId?: string;
    name: string;
    description?: string;
    createdBy: string;
  }) {
    try {
      console.log('📋 Creating form in Supabase:', data);

      const { data: form, error } = await supabase
        .from('forms')
        .insert({
          workspace_id: data.workspaceId,
          folder_id: data.folderId || null,
          linked_board_id: data.linkedBoardId || null,
          name: data.name,
          description: data.description || '',
          created_by: data.createdBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating form:', error);
        return null;
      }

      console.log('✅ Form created:', form);
      return form;
    } catch (error) {
      console.error('❌ Failed to create form:', error);
      return null;
    }
  }

  async loadForms(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading forms:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to load forms:', error);
      return [];
    }
  }

  // ==================== WORKSPACE APP CRUD ====================

  async createWorkspaceApp(data: {
    workspaceId: string;
    folderId?: string;
    appId: string;
    name: string;
    description?: string;
    createdBy: string;
  }) {
    try {
      console.log('🧩 Creating workspace app in Supabase:', data);

      const { data: app, error } = await supabase
        .from('workspace_apps')
        .insert({
          workspace_id: data.workspaceId,
          folder_id: data.folderId || null,
          app_id: data.appId,
          name: data.name,
          description: data.description || '',
          created_by: data.createdBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating workspace app:', error);
        return null;
      }

      console.log('✅ Workspace app created:', app);
      return app;
    } catch (error) {
      console.error('❌ Failed to create workspace app:', error);
      return null;
    }
  }

  async loadWorkspaceApps(workspaceId: string) {
    try {
      const { data, error } = await supabase
        .from('workspace_apps')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading workspace apps:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to load workspace apps:', error);
      return [];
    }
  }
}

export const supabaseWorkspaceService = new SupabaseWorkspaceService();