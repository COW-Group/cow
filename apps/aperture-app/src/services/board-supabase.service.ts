/**
 * Board Service - Supabase Integration
 *
 * Replaces mock data with real Supabase database operations.
 * Provides CRUD operations for boards, groups, and tasks.
 */

import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  TaskComment,
  BoardActivity,
  createEmptyBoard,
  createEmptyGroup,
  createEmptyTask,
  createEmptyComment,
  BoardFilter,
  PersonAssignment,
  ManagementType,
  PrivacyType
} from '../types/board.types';
import { boardTemplateService } from './boardTemplate.service';
import { flexiBoardTemplateService } from './flexiBoardTemplate.service';
import { EnhancedFlexiBoardEngine, FlexiBoard } from '../../../../libs/missions-engine-lib/src/index';

type BoardRow = Database['public']['Tables']['boards']['Row'];
type BoardInsert = Database['public']['Tables']['boards']['Insert'];
type BoardUpdate = Database['public']['Tables']['boards']['Update'];
type GroupRow = Database['public']['Tables']['board_groups']['Row'];
type TaskRow = Database['public']['Tables']['tasks']['Row'];

/**
 * Get default workspace ID (temporary until user workspaces are implemented)
 */
async function getDefaultWorkspaceId(): Promise<string> {
  const { data: workspaces, error } = await supabase
    .from('workspaces')
    .select('id')
    .limit(1)
    .single();

  if (error || !workspaces) {
    throw new Error('No workspace found. Please create a workspace first.');
  }

  return workspaces.id;
}

class BoardSupabaseService {
  private flexiBoards: Map<string, { board: FlexiBoard; engine: EnhancedFlexiBoardEngine }> = new Map();

  /**
   * Transform Supabase board row to COWBoard type
   */
  private transformBoardRow(row: any): COWBoard {
    return {
      id: row.id,
      title: row.title,
      description: row.description || '',
      isStarred: row.is_starred || false,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      createdBy: {
        id: row.created_by,
        name: 'User', // TODO: Fetch from profiles table
        avatar: ''
      },
      members: row.members?.map((m: any) => ({
        id: m.user_id,
        name: m.user_name,
        avatar: m.user_avatar || ''
      })) || [],
      groups: row.groups?.map(this.transformGroupRow) || [],
      activities: row.activities?.map(this.transformActivityRow) || [],
      labels: row.labels || [],
      columnOrder: row.column_order || [
        'assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker'
      ],
      availableColumns: row.available_columns || [
        'assignee-picker', 'status-picker', 'priority-picker', 'date-picker',
        'number-picker', 'file-picker', 'progress-picker', 'updated-picker'
      ],
      viewType: row.view_type || 'table'
    };
  }

  /**
   * Transform Supabase group row to COWBoardGroup type
   */
  private transformGroupRow(row: any): COWBoardGroup {
    return {
      id: row.id,
      title: row.title,
      color: row.color || '#579bfc',
      position: row.position || 0,
      tasks: row.tasks?.map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status || 'Not Started',
        priority: t.priority || 'Medium',
        dueDate: t.due_date ? new Date(t.due_date).getTime() : undefined,
        assigneeIds: t.assignee_ids || [],
        progress: t.progress || 0,
        updatedBy: {
          date: new Date(t.updated_at).getTime(),
          userId: t.updated_by_user_id,
          userAvatar: ''
        },
        comments: t.comments?.map((c: any) => ({
          id: c.id,
          content: c.content,
          authorId: c.author_id,
          authorName: c.author_name,
          authorAvatar: c.author_avatar || '',
          createdAt: new Date(c.created_at).getTime(),
          isEdited: !!c.edited_at,
          style: c.style || {}
        })) || [],
        customFields: t.custom_fields || {}
      })) || []
    };
  }

  /**
   * Transform Supabase activity row to BoardActivity type
   */
  private transformActivityRow(row: any): BoardActivity {
    return {
      id: row.id,
      type: row.type,
      taskId: row.task_id,
      taskTitle: row.task_title,
      userId: row.user_id,
      userName: row.user_name,
      userAvatar: row.user_avatar,
      timestamp: new Date(row.timestamp).getTime(),
      changes: row.changes
    };
  }

  // ============================================================================
  // BOARD CRUD OPERATIONS
  // ============================================================================

  /**
   * Get all boards with optional filtering
   */
  async getBoards(filter?: Partial<BoardFilter>): Promise<COWBoard[]> {
    try {
      let query = supabase
        .from('boards')
        .select(`
          *,
          groups:board_groups(
            *,
            tasks(
              *,
              comments:task_comments(*)
            )
          ),
          labels:board_labels(*),
          members:board_members(*),
          activities:board_activities(*)
        `)
        .order('created_at', { ascending: false });

      // Apply title filter
      if (filter?.title) {
        query = query.ilike('title', `%${filter.title}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[BoardService] Error fetching boards:', error);
        throw new Error(error.message);
      }

      return (data || []).map(row => this.transformBoardRow(row));
    } catch (error) {
      console.error('[BoardService] Failed to fetch boards:', error);
      return [];
    }
  }

  /**
   * Get board by ID with full nested data
   */
  async getBoardById(boardId: string): Promise<COWBoard | null> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select(`
          *,
          groups:board_groups(
            *,
            tasks(
              *,
              comments:task_comments(*)
            )
          ),
          labels:board_labels(*),
          members:board_members(*),
          activities:board_activities(*)
        `)
        .eq('id', boardId)
        .single();

      if (error) {
        console.error('[BoardService] Error fetching board:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return this.transformBoardRow(data);
    } catch (error) {
      console.error('[BoardService] Failed to fetch board:', error);
      return null;
    }
  }

  /**
   * Create a new board
   */
  async createBoard(
    boardData: Partial<COWBoard> & {
      managementType?: ManagementType;
      customManagementType?: string;
      privacy?: PrivacyType;
    },
    createdBy: PersonAssignment
  ): Promise<COWBoard> {
    try {
      // Get default workspace
      const workspaceId = await getDefaultWorkspaceId();

      let newBoard: COWBoard;

      // If we have management type info, create both COWBoard and FlexiBoard
      if (boardData.managementType && boardData.title) {
        // Create FlexiBoard with engine
        const { board: flexiBoard, engine } = flexiBoardTemplateService.createFlexiBoardFromTemplate(
          {
            name: boardData.title,
            privacy: boardData.privacy || 'main',
            managementType: boardData.managementType,
            customManagementType: boardData.customManagementType
          },
          createdBy
        );

        // Store FlexiBoard and engine
        this.flexiBoards.set(flexiBoard.id, { board: flexiBoard, engine });

        // Create board in Supabase
        const { data: boardRow, error } = await supabase
          .from('boards')
          .insert({
            id: flexiBoard.id,
            workspace_id: workspaceId,
            title: boardData.title,
            description: boardData.description || '',
            is_starred: boardData.isStarred || false,
            created_by: createdBy.id,
            column_order: boardData.columnOrder || [
              'assignee-picker', 'status-picker', 'priority-picker', 'date-picker'
            ],
            view_type: boardData.viewType || 'table'
          } as BoardInsert)
          .select()
          .single();

        if (error) {
          console.error('[BoardService] Error creating board:', error);
          throw new Error(error.message);
        }

        newBoard = this.transformBoardRow(boardRow);
      } else {
        // Fallback to simple board creation
        const { data: boardRow, error } = await supabase
          .from('boards')
          .insert({
            workspace_id: workspaceId,
            title: boardData.title || 'Untitled Board',
            description: boardData.description || '',
            is_starred: boardData.isStarred || false,
            created_by: createdBy.id,
            column_order: boardData.columnOrder || [
              'assignee-picker', 'status-picker', 'priority-picker', 'date-picker'
            ],
            view_type: boardData.viewType || 'table'
          } as BoardInsert)
          .select()
          .single();

        if (error) {
          console.error('[BoardService] Error creating board:', error);
          throw new Error(error.message);
        }

        newBoard = this.transformBoardRow(boardRow);
      }

      return newBoard;
    } catch (error) {
      console.error('[BoardService] Failed to create board:', error);
      throw error;
    }
  }

  /**
   * Update board properties
   */
  async updateBoard(boardId: string, updates: Partial<COWBoard>): Promise<COWBoard | null> {
    try {
      const { data, error } = await supabase
        .from('boards')
        .update({
          title: updates.title,
          description: updates.description,
          is_starred: updates.isStarred,
          column_order: updates.columnOrder,
          view_type: updates.viewType
        } as BoardUpdate)
        .eq('id', boardId)
        .select()
        .single();

      if (error) {
        console.error('[BoardService] Error updating board:', error);
        return null;
      }

      return this.transformBoardRow(data);
    } catch (error) {
      console.error('[BoardService] Failed to update board:', error);
      return null;
    }
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId);

      if (error) {
        console.error('[BoardService] Error deleting board:', error);
        return false;
      }

      // Remove from FlexiBoards cache
      this.flexiBoards.delete(boardId);

      return true;
    } catch (error) {
      console.error('[BoardService] Failed to delete board:', error);
      return false;
    }
  }

  /**
   * Toggle board star status
   */
  async toggleBoardStar(boardId: string): Promise<COWBoard | null> {
    const board = await this.getBoardById(boardId);
    if (!board) return null;

    return this.updateBoard(boardId, { isStarred: !board.isStarred });
  }

  // ============================================================================
  // GROUP OPERATIONS (Future - will implement in next phase)
  // ============================================================================

  async createGroup(boardId: string, groupData: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    // TODO: Implement Supabase group creation
    throw new Error('Not yet implemented - coming in next phase');
  }

  async updateGroup(boardId: string, groupId: string, updates: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    // TODO: Implement Supabase group update
    throw new Error('Not yet implemented - coming in next phase');
  }

  async deleteGroup(boardId: string, groupId: string): Promise<boolean> {
    // TODO: Implement Supabase group deletion
    throw new Error('Not yet implemented - coming in next phase');
  }

  // ============================================================================
  // TASK OPERATIONS (Future - will implement in next phase)
  // ============================================================================

  async createTask(boardId: string, groupId: string, taskData: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    // TODO: Implement Supabase task creation
    throw new Error('Not yet implemented - coming in next phase');
  }

  async updateTask(boardId: string, groupId: string, taskId: string, updates: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    // TODO: Implement Supabase task update
    throw new Error('Not yet implemented - coming in next phase');
  }

  async deleteTask(boardId: string, groupId: string, taskId: string): Promise<boolean> {
    // TODO: Implement Supabase task deletion
    throw new Error('Not yet implemented - coming in next phase');
  }

  // ============================================================================
  // FLEXI BOARD METHODS
  // ============================================================================

  async getFlexiBoardById(boardId: string): Promise<{ board: FlexiBoard; engine: EnhancedFlexiBoardEngine } | null> {
    return this.flexiBoards.get(boardId) || null;
  }

  async updateFlexiBoard(boardId: string, updatedBoard: FlexiBoard): Promise<void> {
    const existing = this.flexiBoards.get(boardId);
    if (existing) {
      this.flexiBoards.set(boardId, { ...existing, board: updatedBoard });
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getEmptyBoard = createEmptyBoard;
  getEmptyGroup = createEmptyGroup;
  getEmptyTask = createEmptyTask;
  getEmptyComment = createEmptyComment;
  getDefaultFilter = () => ({
    title: '',
    assigneeId: '',
    status: [],
    priority: [],
    dateRange: undefined
  });

  /**
   * Filter and search boards/tasks
   */
  getFilteredTasks(board: COWBoard, filter: BoardFilter): COWBoard {
    const filteredBoard = { ...board };

    filteredBoard.groups = board.groups.map(group => ({
      ...group,
      tasks: group.tasks.filter(task => {
        // Title filter
        if (filter.title) {
          const regex = new RegExp(filter.title, 'i');
          if (!regex.test(task.title)) return false;
        }

        // Assignee filter
        if (filter.assigneeId && !task.assigneeIds.includes(filter.assigneeId)) {
          return false;
        }

        // Status filter
        if (filter.status.length > 0 && !filter.status.includes(task.status)) {
          return false;
        }

        // Priority filter
        if (filter.priority.length > 0 && !filter.priority.includes(task.priority)) {
          return false;
        }

        // Date range filter
        if (filter.dateRange && task.dueDate) {
          const taskDate = new Date(task.dueDate);
          if (taskDate < filter.dateRange.start || taskDate > filter.dateRange.end) {
            return false;
          }
        }

        return true;
      })
    }));

    return filteredBoard;
  }
}

export const boardSupabaseService = new BoardSupabaseService();
export default boardSupabaseService;
