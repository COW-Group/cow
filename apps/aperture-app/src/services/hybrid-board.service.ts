import {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  BoardFilter,
  PersonAssignment
} from '../types/board.types';
import boardService from './board.service';
import mondayService from './monday.service';

/**
 * Hybrid Board Service
 * Automatically switches between Monday.com and mock data based on configuration
 */

export enum DataSource {
  MOCK = 'mock',
  MONDAY = 'monday',
  HYBRID = 'hybrid' // Uses Monday when available, falls back to mock
}

class HybridBoardService {
  private dataSource: DataSource = DataSource.HYBRID;
  private mondayConnected: boolean = false;

  constructor() {
    this.initializeConnection();
  }

  /**
   * Initialize connection and determine data source
   */
  private async initializeConnection() {
    if (mondayService.isConfigured()) {
      try {
        this.mondayConnected = await mondayService.testConnection();
        console.log('Monday.com connection:', this.mondayConnected ? 'SUCCESS' : 'FAILED');
      } catch (error) {
        console.log('Monday.com not available, using mock data');
        this.mondayConnected = false;
      }
    }
  }

  /**
   * Set data source preference
   */
  setDataSource(source: DataSource) {
    this.dataSource = source;
  }

  /**
   * Get current data source being used
   */
  getCurrentDataSource(): DataSource {
    if (this.dataSource === DataSource.MOCK) return DataSource.MOCK;
    if (this.dataSource === DataSource.MONDAY) return DataSource.MONDAY;

    // HYBRID mode: use Monday if connected, otherwise mock
    return this.mondayConnected ? DataSource.MONDAY : DataSource.MOCK;
  }

  /**
   * Get all boards
   */
  async getBoards(filter?: Partial<BoardFilter>): Promise<COWBoard[]> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log('📋 Fetching boards from Monday.com...');
        const boards = await mondayService.getBoards();

        if (boards.length === 0) {
          console.log('⚠️ No boards found in Monday.com, falling back to mock data');
          return await boardService.getBoards(filter);
        }

        return this.applyBoardFilter(boards, filter);
      } else {
        console.log('📋 Using mock board data');
        return await boardService.getBoards(filter);
      }
    } catch (error) {
      console.error('Error fetching boards, falling back to mock:', error);
      return await boardService.getBoards(filter);
    }
  }

  /**
   * Get board by ID
   */
  async getBoardById(boardId: string): Promise<COWBoard | null> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`📋 Fetching board ${boardId} from Monday.com...`);
        const board = await mondayService.getBoardById(boardId);

        if (!board) {
          console.log('⚠️ Board not found in Monday.com, trying mock data');
          return await boardService.getBoardById(boardId);
        }

        return board;
      } else {
        console.log(`📋 Using mock data for board ${boardId}`);
        return await boardService.getBoardById(boardId);
      }
    } catch (error) {
      console.error('Error fetching board from Monday.com, falling back to mock:', error);
      return await boardService.getBoardById(boardId);
    }
  }

  /**
   * Create new board
   */
  async createBoard(
    boardData: Partial<COWBoard> & {
      managementType?: string;
      customManagementType?: string;
      privacy?: string;
    },
    createdBy: PersonAssignment
  ): Promise<COWBoard> {
    const currentSource = this.getCurrentDataSource();

    // For now, always create in mock service
    // Monday.com board creation requires more complex setup
    console.log('📋 Creating board in mock service (Monday.com board creation not implemented)');
    return await boardService.createBoard(boardData, createdBy);
  }

  /**
   * Update board
   */
  async updateBoard(boardId: string, updates: Partial<COWBoard>): Promise<COWBoard | null> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        // For now, update in mock service only
        // Monday.com board updates require specific API calls
        console.log('📋 Updating board in mock service (Monday.com board updates not fully implemented)');
        return await boardService.updateBoard(boardId, updates);
      } else {
        return await boardService.updateBoard(boardId, updates);
      }
    } catch (error) {
      console.error('Error updating board:', error);
      return null;
    }
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId: string): Promise<boolean> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log('⚠️ Board deletion in Monday.com requires manual action');
        return false;
      } else {
        return await boardService.deleteBoard(boardId);
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      return false;
    }
  }

  /**
   * Create task
   */
  async createTask(boardId: string, groupId: string, taskData: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`📝 Creating task in Monday.com board ${boardId}, group ${groupId}`);
        const task = await mondayService.createTask(boardId, groupId, taskData);

        if (!task) {
          console.log('⚠️ Failed to create task in Monday.com, using mock service');
          return await boardService.createTask(boardId, groupId, taskData);
        }

        return task;
      } else {
        return await boardService.createTask(boardId, groupId, taskData);
      }
    } catch (error) {
      console.error('Error creating task in Monday.com, falling back to mock:', error);
      return await boardService.createTask(boardId, groupId, taskData);
    }
  }

  /**
   * Update task
   */
  async updateTask(boardId: string, groupId: string, taskId: string, updates: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`📝 Updating task ${taskId} in Monday.com`);

        // Monday.com requires column-specific updates
        const updateSuccess = await this.updateMondayTaskColumns(taskId, updates);

        if (updateSuccess) {
          // Fetch updated task data
          const board = await this.getBoardById(boardId);
          const group = board?.groups.find(g => g.id === groupId);
          return group?.tasks.find(t => t.id === taskId) || null;
        } else {
          console.log('⚠️ Failed to update task in Monday.com, using mock service');
          return await boardService.updateTask(boardId, groupId, taskId, updates);
        }
      } else {
        return await boardService.updateTask(boardId, groupId, taskId, updates);
      }
    } catch (error) {
      console.error('Error updating task in Monday.com, falling back to mock:', error);
      return await boardService.updateTask(boardId, groupId, taskId, updates);
    }
  }

  /**
   * Delete task
   */
  async deleteTask(boardId: string, groupId: string, taskId: string): Promise<boolean> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`🗑️ Deleting task ${taskId} from Monday.com`);
        const success = await mondayService.deleteTask(taskId);

        if (!success) {
          console.log('⚠️ Failed to delete task in Monday.com, using mock service');
          return await boardService.deleteTask(boardId, groupId, taskId);
        }

        return success;
      } else {
        return await boardService.deleteTask(boardId, groupId, taskId);
      }
    } catch (error) {
      console.error('Error deleting task in Monday.com, falling back to mock:', error);
      return await boardService.deleteTask(boardId, groupId, taskId);
    }
  }

  /**
   * Create group
   */
  async createGroup(boardId: string, groupData: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`📁 Creating group in Monday.com board ${boardId}`);
        const group = await mondayService.createGroup(boardId, groupData);

        if (!group) {
          console.log('⚠️ Failed to create group in Monday.com, using mock service');
          return await boardService.createGroup(boardId, groupData);
        }

        return group;
      } else {
        return await boardService.createGroup(boardId, groupData);
      }
    } catch (error) {
      console.error('Error creating group in Monday.com, falling back to mock:', error);
      return await boardService.createGroup(boardId, groupData);
    }
  }

  /**
   * Delete group
   */
  async deleteGroup(boardId: string, groupId: string): Promise<boolean> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`🗑️ Deleting group ${groupId} from Monday.com`);
        const success = await mondayService.deleteGroup(groupId);

        if (!success) {
          console.log('⚠️ Failed to delete group in Monday.com, using mock service');
          return await boardService.deleteGroup(boardId, groupId);
        }

        return success;
      } else {
        return await boardService.deleteGroup(boardId, groupId);
      }
    } catch (error) {
      console.error('Error deleting group in Monday.com, falling back to mock:', error);
      return await boardService.deleteGroup(boardId, groupId);
    }
  }

  /**
   * Move task between groups
   */
  async moveTask(
    boardId: string,
    sourceGroupId: string,
    targetGroupId: string,
    taskId: string,
    newIndex: number
  ): Promise<boolean> {
    const currentSource = this.getCurrentDataSource();

    try {
      if (currentSource === DataSource.MONDAY) {
        console.log(`🔄 Moving task ${taskId} in Monday.com (limited support)`);
        // Monday.com doesn't have direct move API, would need to delete/recreate
        // For now, use mock service
        return await boardService.moveTask(boardId, sourceGroupId, targetGroupId, taskId, newIndex);
      } else {
        return await boardService.moveTask(boardId, sourceGroupId, targetGroupId, taskId, newIndex);
      }
    } catch (error) {
      console.error('Error moving task:', error);
      return false;
    }
  }

  /**
   * Get connection status and info
   */
  getConnectionInfo() {
    return {
      dataSource: this.getCurrentDataSource(),
      mondayConnected: this.mondayConnected,
      mondayConfigured: mondayService.isConfigured(),
      canSwitchToMonday: mondayService.isConfigured() && this.mondayConnected
    };
  }

  /**
   * Force refresh Monday.com connection
   */
  async refreshConnection() {
    await this.initializeConnection();
    return this.getConnectionInfo();
  }

  /**
   * Private helper methods
   */

  private applyBoardFilter(boards: COWBoard[], filter?: Partial<BoardFilter>): COWBoard[] {
    if (!filter || !filter.title) return boards;

    const regex = new RegExp(filter.title, 'i');
    return boards.filter(board =>
      regex.test(board.title) || regex.test(board.description || '')
    );
  }

  private async updateMondayTaskColumns(taskId: string, updates: Partial<COWBoardTask>): Promise<boolean> {
    let success = true;

    // Map updates to Monday.com column updates
    if (updates.status) {
      const statusSuccess = await mondayService.updateTask(taskId, 'status', updates.status);
      success = success && statusSuccess;
    }

    if (updates.priority) {
      const prioritySuccess = await mondayService.updateTask(taskId, 'priority', updates.priority);
      success = success && prioritySuccess;
    }

    if (updates.title) {
      // Title updates might need special handling
      const titleSuccess = await mondayService.updateTask(taskId, 'name', updates.title);
      success = success && titleSuccess;
    }

    if (updates.assigneeIds && updates.assigneeIds.length > 0) {
      const peopleValue = { personsAndTeams: updates.assigneeIds.map(id => ({ id })) };
      const assigneeSuccess = await mondayService.updateTask(taskId, 'people', peopleValue);
      success = success && assigneeSuccess;
    }

    if (updates.dueDate) {
      const dateValue = new Date(updates.dueDate).toISOString().split('T')[0];
      const dateSuccess = await mondayService.updateTask(taskId, 'date', dateValue);
      success = success && dateSuccess;
    }

    return success;
  }
}

export const hybridBoardService = new HybridBoardService();
export default hybridBoardService;