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

      // Fetch boards for each workspace
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: true });

      if (boardsError) {
        console.error('Error loading boards:', boardsError);
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

      const workspaces: Workspace[] = sortedWorkspaces.map(ws => {
        // Find boards for this workspace
        const workspaceBoards = boardsData?.filter(board => board.workspace_id === ws.id) || [];

        // Separate strategic boards from department boards
        const strategicBoards = workspaceBoards.filter(board =>
          board.title.includes('Q1 Strategic') || board.monday_board_id === '8198396724'
        );

        const departmentBoards = workspaceBoards.filter(board =>
          !board.title.includes('Q1 Strategic') && board.monday_board_id !== '8198396724'
        );

        // Create folders for each department board
        const folders = departmentBoards.map(board => ({
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

        // Convert strategic boards to workspace boards
        const boards: WorkspaceBoard[] = strategicBoards.map(board => ({
          id: board.id,
          name: board.title,
          description: board.description || '',
          workspaceId: ws.id,
          folderId: undefined, // Strategic boards at workspace root level
          ownerId: board.created_by,
          color: this.getBoardColor(board.title),
          starred: board.is_starred || false,
          boardType: 'flexiboard',
          createdAt: new Date(board.created_at),
          updatedAt: new Date(board.updated_at),
          mondayBoardId: board.monday_board_id
        }));

        console.log(`✅ Created ${folders.length} folders and ${boards.length} boards for workspace ${ws.name}`);

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
          folders, // Department folders
          boards, // Strategic boards at root level
          dashboards: [],
          docs: [],
          forms: [],
          apps: []
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

      const { data, error } = await supabase
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
}

export const supabaseWorkspaceService = new SupabaseWorkspaceService();