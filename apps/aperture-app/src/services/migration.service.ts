import { supabase, Database } from '../lib/supabase';
import mondayService from './monday.service';
import {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  PersonAssignment,
  BoardLabel
} from '../types/board.types';

/**
 * MyCow Group Migration Service
 * Transfers data from Monday.com "MyCow Group" workspace to Supabase
 */

interface MigrationStatus {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  errors: string[];
  summary: {
    workspacesCreated: number;
    boardsMigrated: number;
    groupsMigrated: number;
    tasksMigrated: number;
    commentsMigrated: number;
    membersMigrated: number;
  };
}

interface MigrationOptions {
  workspaceName: string;
  overwriteExisting: boolean;
  migrateComments: boolean;
  migrateActivities: boolean;
  userId: string; // Current user performing migration
}

const MYCOW_WORKSPACE_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

class MigrationService {
  private currentMigration: MigrationStatus | null = null;

  /**
   * Get current migration status
   */
  getMigrationStatus(): MigrationStatus | null {
    return this.currentMigration;
  }

  /**
   * Start full migration from Monday.com MyCow Group workspace
   */
  async startMigration(options: MigrationOptions): Promise<MigrationStatus> {
    if (this.currentMigration?.status === 'in_progress') {
      throw new Error('Migration already in progress');
    }

    this.currentMigration = {
      status: 'in_progress',
      progress: 0,
      currentStep: 'Initializing migration...',
      errors: [],
      summary: {
        workspacesCreated: 0,
        boardsMigrated: 0,
        groupsMigrated: 0,
        tasksMigrated: 0,
        commentsMigrated: 0,
        membersMigrated: 0
      }
    };

    try {
      // Step 1: Verify Monday.com connection
      this.updateStatus(5, 'Verifying Monday.com connection...');
      const isConnected = await mondayService.testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Monday.com. Please check your API token and MCP configuration.');
      }

      // Step 2: Create/verify workspace
      this.updateStatus(10, 'Setting up MyCow Group workspace...');
      await this.setupWorkspace(options);

      // Step 3: Fetch all boards from Monday.com
      this.updateStatus(20, 'Fetching boards from Monday.com...');
      const mondayBoards = await mondayService.getBoards();

      if (mondayBoards.length === 0) {
        throw new Error('No boards found in Monday.com workspace');
      }

      // Step 4: Migrate each board
      const totalBoards = mondayBoards.length;
      let migratedBoards = 0;

      for (const board of mondayBoards) {
        const boardProgress = 30 + (migratedBoards / totalBoards) * 60;
        this.updateStatus(boardProgress, `Migrating board: ${board.title}`);

        await this.migrateBoard(board, options);
        migratedBoards++;
        this.currentMigration!.summary.boardsMigrated++;
      }

      // Step 5: Migration complete
      this.updateStatus(100, 'Migration completed successfully!');
      this.currentMigration!.status = 'completed';

      return this.currentMigration;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.currentMigration!.status = 'failed';
      this.currentMigration!.errors.push(errorMessage);
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Setup MyCow Group workspace in Supabase
   */
  private async setupWorkspace(options: MigrationOptions): Promise<void> {
    try {
      // Check if workspace already exists
      const { data: existingWorkspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('name', options.workspaceName)
        .single();

      if (existingWorkspace && !options.overwriteExisting) {
        console.log('Workspace already exists, skipping creation');
        return;
      }

      if (!existingWorkspace) {
        // Create new workspace
        const { error } = await supabase
          .from('workspaces')
          .insert({
            id: MYCOW_WORKSPACE_ID,
            name: options.workspaceName,
            description: 'Migrated from Monday.com - COW project management and CRM workspace',
            created_by: options.userId,
            settings: {
              migratedFromMonday: true,
              migrationDate: new Date().toISOString(),
              originalWorkspace: 'MyCow Group'
            }
          });

        if (error) {
          throw new Error(`Failed to create workspace: ${error.message}`);
        }

        this.currentMigration!.summary.workspacesCreated++;
      }
    } catch (error) {
      console.error('Error setting up workspace:', error);
      throw error;
    }
  }

  /**
   * Migrate a single board from Monday.com to Supabase
   */
  private async migrateBoard(board: COWBoard, options: MigrationOptions): Promise<string> {
    try {
      // Create board record
      const { data: createdBoard, error: boardError } = await supabase
        .from('boards')
        .insert({
          workspace_id: MYCOW_WORKSPACE_ID,
          title: board.title,
          description: board.description,
          is_starred: board.isStarred,
          created_by: options.userId,
          column_order: board.columnOrder,
          available_columns: board.availableColumns,
          view_type: board.viewType,
          settings: {
            migratedFromMonday: true,
            originalBoardId: board.id
          },
          monday_board_id: board.id
        })
        .select()
        .single();

      if (boardError) {
        throw new Error(`Failed to create board: ${boardError.message}`);
      }

      const supabaseBoardId = createdBoard.id;

      // Log migration
      await this.logMigration('board', board.id, supabaseBoardId, 'completed');

      // Migrate board labels
      await this.migrateBoardLabels(board.labels, supabaseBoardId);

      // Migrate board members
      await this.migrateBoardMembers(board.members, supabaseBoardId);

      // Migrate groups and their tasks
      for (const group of board.groups) {
        await this.migrateGroup(group, supabaseBoardId, options);
      }

      return supabaseBoardId;
    } catch (error) {
      await this.logMigration('board', board.id, null, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Migrate board labels
   */
  private async migrateBoardLabels(labels: BoardLabel[], boardId: string): Promise<void> {
    if (labels.length === 0) return;

    const labelsToInsert = labels.map(label => ({
      board_id: boardId,
      title: label.title,
      color: label.color,
      type: label.type
    }));

    const { error } = await supabase
      .from('board_labels')
      .insert(labelsToInsert);

    if (error) {
      throw new Error(`Failed to migrate board labels: ${error.message}`);
    }
  }

  /**
   * Migrate board members
   */
  private async migrateBoardMembers(members: PersonAssignment[], boardId: string): Promise<void> {
    if (members.length === 0) return;

    const membersToInsert = members.map(member => ({
      board_id: boardId,
      user_id: member.id, // Note: You might need to create users in auth.users first
      user_name: member.name,
      user_avatar: member.avatar,
      role: 'member'
    }));

    const { error } = await supabase
      .from('board_members')
      .insert(membersToInsert);

    if (error) {
      console.warn(`Failed to migrate some board members: ${error.message}`);
      // Don't throw error for members, as they might not exist in auth system yet
    } else {
      this.currentMigration!.summary.membersMigrated += members.length;
    }
  }

  /**
   * Migrate a board group
   */
  private async migrateGroup(group: COWBoardGroup, boardId: string, options: MigrationOptions): Promise<string> {
    try {
      // Create group record
      const { data: createdGroup, error: groupError } = await supabase
        .from('board_groups')
        .insert({
          board_id: boardId,
          title: group.title,
          color: group.color,
          position: group.position,
          is_collapsed: group.isCollapsed,
          monday_group_id: group.id
        })
        .select()
        .single();

      if (groupError) {
        throw new Error(`Failed to create group: ${groupError.message}`);
      }

      const supabaseGroupId = createdGroup.id;
      this.currentMigration!.summary.groupsMigrated++;

      // Log migration
      await this.logMigration('group', group.id, supabaseGroupId, 'completed');

      // Migrate tasks in this group
      for (const task of group.tasks) {
        await this.migrateTask(task, boardId, supabaseGroupId, options);
      }

      return supabaseGroupId;
    } catch (error) {
      await this.logMigration('group', group.id, null, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Migrate a task
   */
  private async migrateTask(task: COWBoardTask, boardId: string, groupId: string, options: MigrationOptions): Promise<string> {
    try {
      // Create task record
      const { data: createdTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          board_id: boardId,
          group_id: groupId,
          title: task.title,
          status: task.status,
          priority: task.priority,
          due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
          assignee_ids: task.assigneeIds as any, // Cast for UUID array
          agent_ids: task.agentIds as any,
          progress: task.progress,
          updated_by_user_id: options.userId,
          custom_fields: task.customFields,
          automation_config: task.automationConfig,
          monday_item_id: task.id
        })
        .select()
        .single();

      if (taskError) {
        throw new Error(`Failed to create task: ${taskError.message}`);
      }

      const supabaseTaskId = createdTask.id;
      this.currentMigration!.summary.tasksMigrated++;

      // Log migration
      await this.logMigration('task', task.id, supabaseTaskId, 'completed');

      // Migrate comments if enabled
      if (options.migrateComments && task.comments.length > 0) {
        await this.migrateTaskComments(task.comments, supabaseTaskId);
      }

      return supabaseTaskId;
    } catch (error) {
      await this.logMigration('task', task.id, null, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Migrate task comments
   */
  private async migrateTaskComments(comments: any[], taskId: string): Promise<void> {
    if (comments.length === 0) return;

    const commentsToInsert = comments.map(comment => ({
      task_id: taskId,
      content: comment.content,
      author_id: comment.authorId,
      author_name: comment.authorName,
      author_avatar: comment.authorAvatar,
      created_at: new Date(comment.createdAt).toISOString(),
      edited_at: comment.editedAt ? new Date(comment.editedAt).toISOString() : null,
      style: comment.style
    }));

    const { error } = await supabase
      .from('task_comments')
      .insert(commentsToInsert);

    if (error) {
      console.warn(`Failed to migrate some task comments: ${error.message}`);
      // Don't throw error for comments
    } else {
      this.currentMigration!.summary.commentsMigrated += comments.length;
    }
  }

  /**
   * Log migration progress
   */
  private async logMigration(
    type: string,
    sourceId: string,
    targetId: string | null,
    status: 'completed' | 'failed',
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase
        .from('migration_logs')
        .insert({
          migration_type: type,
          source_id: sourceId,
          target_id: targetId,
          status,
          completed_at: new Date().toISOString(),
          error_message: errorMessage,
          metadata: {
            migrationSession: new Date().toISOString(),
            sourceSystem: 'monday.com'
          }
        });
    } catch (error) {
      console.error('Failed to log migration:', error);
      // Don't throw - logging failures shouldn't stop migration
    }
  }

  /**
   * Update migration status
   */
  private updateStatus(progress: number, currentStep: string): void {
    if (this.currentMigration) {
      this.currentMigration.progress = Math.min(progress, 100);
      this.currentMigration.currentStep = currentStep;
    }
  }

  /**
   * Get migration summary
   */
  async getMigrationSummary(): Promise<any> {
    const { data: logs, error } = await supabase
      .from('migration_logs')
      .select('*')
      .order('started_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch migration logs: ${error.message}`);
    }

    return {
      totalMigrations: logs.length,
      successful: logs.filter(log => log.status === 'completed').length,
      failed: logs.filter(log => log.status === 'failed').length,
      byType: logs.reduce((acc, log) => {
        acc[log.migration_type] = (acc[log.migration_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentLogs: logs.slice(0, 10)
    };
  }

  /**
   * Verify migrated data integrity
   */
  async verifyMigration(): Promise<{
    isValid: boolean;
    issues: string[];
    summary: any;
  }> {
    const issues: string[] = [];

    try {
      // Check workspace
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', MYCOW_WORKSPACE_ID)
        .single();

      if (!workspace) {
        issues.push('MyCow Group workspace not found');
      }

      // Check boards
      const { data: boards, count: boardCount } = await supabase
        .from('boards')
        .select('*', { count: 'exact' })
        .eq('workspace_id', MYCOW_WORKSPACE_ID);

      // Check orphaned records
      const { count: orphanedGroups } = await supabase
        .from('board_groups')
        .select('*', { count: 'exact' })
        .not('board_id', 'in', `(${boards?.map(b => `'${b.id}'`).join(',')})`);

      if (orphanedGroups && orphanedGroups > 0) {
        issues.push(`Found ${orphanedGroups} orphaned board groups`);
      }

      return {
        isValid: issues.length === 0,
        issues,
        summary: {
          workspace: workspace ? 1 : 0,
          boards: boardCount || 0,
          // Add more summary data as needed
        }
      };
    } catch (error) {
      issues.push(`Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        issues,
        summary: {}
      };
    }
  }
}

export const migrationService = new MigrationService();
export default migrationService;