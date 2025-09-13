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
  getDefaultBoardFilter,
  BoardFilter,
  PersonAssignment,
  ManagementType,
  PrivacyType
} from '../types/board.types';
import { boardTemplateService } from './boardTemplate.service';
import { flexiBoardTemplateService } from './flexiBoardTemplate.service';
import { EnhancedFlexiBoardEngine, FlexiBoard } from '../../../../libs/missions-engine-lib/src/index';

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Mock data for development
const mockBoards: COWBoard[] = [
  {
    id: 'board-1',
    title: 'COW Missions Board',
    description: 'Track all COW mission progress and activities',
    isStarred: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    createdBy: { id: 'user-1', name: 'Admin User', avatar: '' },
    members: [
      { id: 'user-1', name: 'Admin User', avatar: '' },
      { id: 'user-2', name: 'Team Lead', avatar: '' },
    ],
    groups: [
      {
        id: 'group-1',
        title: 'Q1 2025 Missions',
        color: '#579bfc',
        position: 0,
        tasks: [
          {
            id: 'task-1',
            title: 'Gold Market Integration',
            status: 'Working on it',
            priority: 'High',
            dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
            assigneeIds: ['user-1'],
            progress: 65,
            updatedBy: {
              date: Date.now() - 2 * 60 * 60 * 1000,
              userId: 'user-1',
              userAvatar: ''
            },
            comments: [],
            customFields: {}
          }
        ]
      }
    ],
    activities: [],
    labels: [
      { id: 'status-done', title: 'Done', color: '#00c875', type: 'status' },
      { id: 'status-working', title: 'Working on it', color: '#fdab3d', type: 'status' },
      { id: 'status-stuck', title: 'Stuck', color: '#e2445c', type: 'status' },
      { id: 'status-not-started', title: 'Not Started', color: '#c4c4c4', type: 'status' }
    ],
    columnOrder: ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker'],
    availableColumns: [
      'assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 
      'number-picker', 'file-picker', 'progress-picker', 'updated-picker'
    ],
    viewType: 'table'
  }
];

class BoardService {
  private boards: COWBoard[] = [...mockBoards];
  private flexiBoards: Map<string, { board: FlexiBoard; engine: EnhancedFlexiBoardEngine }> = new Map();

  // Board CRUD operations
  async getBoards(filter?: Partial<BoardFilter>): Promise<COWBoard[]> {
    await this.delay(300); // Simulate API delay
    
    let filteredBoards = [...this.boards];
    
    if (filter?.title) {
      const regex = new RegExp(filter.title, 'i');
      filteredBoards = filteredBoards.filter(board => 
        regex.test(board.title) || regex.test(board.description || '')
      );
    }
    
    return filteredBoards;
  }

  async getBoardById(boardId: string): Promise<COWBoard | null> {
    await this.delay(200);
    
    // Only log in debug mode
    const isDebug = process.env.NODE_ENV === 'development';
    if (isDebug) {
      console.log('🔧 BoardService.getBoardById called with:', boardId);
      console.log('🔧 Available boards:', this.boards.map(b => ({ id: b.id, title: b.title })));
    }
    
    const board = this.boards.find(board => board.id === boardId) || null;
    if (isDebug) {
      console.log('🔧 Found board:', board ? { id: board.id, title: board.title } : null);
    }
    
    // Validate board structure
    if (board) {
      // Ensure required properties exist
      if (!board.id || !Array.isArray(board.groups)) {
        console.error('Invalid board structure:', board);
        return null;
      }
      
      // Validate groups
      board.groups.forEach(group => {
        if (!group.id) {
          group.id = `group-${Math.random().toString(36).substr(2, 9)}`;
        }
        if (!Array.isArray(group.tasks)) {
          group.tasks = [];
        }
        
        // Validate tasks
        group.tasks.forEach(task => {
          if (!task.id) {
            task.id = `task-${Math.random().toString(36).substr(2, 9)}`;
          }
          if (!Array.isArray(task.assigneeIds)) {
            task.assigneeIds = [];
          }
          if (!Array.isArray(task.comments)) {
            task.comments = [];
          }
        });
      });
      
      // Ensure columnOrder exists
      if (!Array.isArray(board.columnOrder)) {
        board.columnOrder = ['assignee-picker', 'status-picker', 'priority-picker', 'date-picker', 'progress-picker'];
      }
    }
    
    return board;
  }

  async createBoard(
    boardData: Partial<COWBoard> & {
      managementType?: ManagementType;
      customManagementType?: string;
      privacy?: PrivacyType;
    }, 
    createdBy: PersonAssignment
  ): Promise<COWBoard> {
    await this.delay(500);
    
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

      // Also create COWBoard for backward compatibility
      newBoard = boardTemplateService.createBoardFromTemplate(
        {
          name: boardData.title,
          privacy: boardData.privacy || 'main',
          managementType: boardData.managementType,
          customManagementType: boardData.customManagementType
        },
        createdBy
      );
      
      // Use the same ID for both
      newBoard = {
        ...newBoard,
        id: flexiBoard.id,
        title: boardData.title,
        description: boardData.description || newBoard.description,
        isStarred: boardData.isStarred || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else {
      // Fallback to empty board
      newBoard = {
        ...createEmptyBoard(createdBy),
        id: generateId(),
        ...boardData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    this.boards.push(newBoard);
    return newBoard;
  }

  async updateBoard(boardId: string, updates: Partial<COWBoard>): Promise<COWBoard | null> {
    await this.delay(300);
    
    const boardIndex = this.boards.findIndex(board => board.id === boardId);
    if (boardIndex === -1) return null;
    
    this.boards[boardIndex] = {
      ...this.boards[boardIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return this.boards[boardIndex];
  }

  async deleteBoard(boardId: string): Promise<boolean> {
    await this.delay(300);
    
    const initialLength = this.boards.length;
    this.boards = this.boards.filter(board => board.id !== boardId);
    return this.boards.length < initialLength;
  }

  async toggleBoardStar(boardId: string): Promise<COWBoard | null> {
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    return this.updateBoard(boardId, { isStarred: !board.isStarred });
  }

  // Group operations
  async createGroup(boardId: string, groupData: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    await this.delay(300);
    
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const newGroup: COWBoardGroup = {
      ...createEmptyGroup(),
      id: generateId(),
      position: board.groups.length,
      ...groupData
    };
    
    board.groups.push(newGroup);
    await this.updateBoard(boardId, { groups: board.groups });
    
    return newGroup;
  }

  async updateGroup(boardId: string, groupId: string, updates: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    await this.delay(200);
    
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const groupIndex = board.groups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) return null;
    
    board.groups[groupIndex] = {
      ...board.groups[groupIndex],
      ...updates
    };
    
    await this.updateBoard(boardId, { groups: board.groups });
    return board.groups[groupIndex];
  }

  async deleteGroup(boardId: string, groupId: string): Promise<boolean> {
    await this.delay(300);
    
    const board = await this.getBoardById(boardId);
    if (!board) return false;
    
    const initialLength = board.groups.length;
    board.groups = board.groups.filter(group => group.id !== groupId);
    
    if (board.groups.length < initialLength) {
      await this.updateBoard(boardId, { groups: board.groups });
      return true;
    }
    
    return false;
  }

  // Task operations
  async createTask(boardId: string, groupId: string, taskData: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    await this.delay(300);
    
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const group = board.groups.find(g => g.id === groupId);
    if (!group) return null;
    
    const newTask: COWBoardTask = {
      ...createEmptyTask(),
      id: generateId(),
      ...taskData,
      updatedBy: {
        date: Date.now(),
        userId: taskData.updatedBy?.userId || '',
        userAvatar: taskData.updatedBy?.userAvatar || ''
      }
    };
    
    group.tasks.push(newTask);
    await this.updateBoard(boardId, { groups: board.groups });
    
    // Add activity
    await this.addActivity(boardId, {
      type: 'task_created',
      taskId: newTask.id,
      taskTitle: newTask.title,
      userId: newTask.updatedBy.userId,
      userName: 'User',
      timestamp: Date.now()
    });
    
    return newTask;
  }

  async updateTask(boardId: string, groupId: string, taskId: string, updates: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    await this.delay(200);
    
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const group = board.groups.find(g => g.id === groupId);
    if (!group) return null;
    
    const taskIndex = group.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;
    
    const oldTask = group.tasks[taskIndex];
    group.tasks[taskIndex] = {
      ...oldTask,
      ...updates,
      updatedBy: {
        ...updates.updatedBy,
        date: Date.now()
      }
    };
    
    await this.updateBoard(boardId, { groups: board.groups });
    
    // Add activity for significant changes
    if (updates.status && updates.status !== oldTask.status) {
      await this.addActivity(boardId, {
        type: 'status_changed',
        taskId,
        taskTitle: group.tasks[taskIndex].title,
        userId: updates.updatedBy?.userId || '',
        userName: 'User',
        timestamp: Date.now(),
        changes: {
          field: 'status',
          oldValue: oldTask.status,
          newValue: updates.status
        }
      });
    }
    
    return group.tasks[taskIndex];
  }

  async deleteTask(boardId: string, groupId: string, taskId: string): Promise<boolean> {
    await this.delay(300);
    
    const board = await this.getBoardById(boardId);
    if (!board) return false;
    
    const group = board.groups.find(g => g.id === groupId);
    if (!group) return false;
    
    const taskIndex = group.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return false;
    
    const task = group.tasks[taskIndex];
    group.tasks.splice(taskIndex, 1);
    
    await this.updateBoard(boardId, { groups: board.groups });
    
    // Add activity
    await this.addActivity(boardId, {
      type: 'task_deleted',
      taskId,
      taskTitle: task.title,
      userId: task.updatedBy.userId,
      userName: 'User',
      timestamp: Date.now()
    });
    
    return true;
  }

  async duplicateTask(boardId: string, groupId: string, taskId: string): Promise<COWBoardTask | null> {
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const group = board.groups.find(g => g.id === groupId);
    if (!group) return null;
    
    const originalTask = group.tasks.find(task => task.id === taskId);
    if (!originalTask) return null;
    
    const duplicatedTask: COWBoardTask = {
      ...originalTask,
      id: generateId(),
      title: `${originalTask.title} (Copy)`,
      comments: [], // Don't copy comments
      updatedBy: {
        ...originalTask.updatedBy,
        date: Date.now()
      }
    };
    
    return this.createTask(boardId, groupId, duplicatedTask);
  }

  // Comment operations
  async addComment(boardId: string, groupId: string, taskId: string, comment: Partial<TaskComment>): Promise<TaskComment | null> {
    await this.delay(200);
    
    const task = await this.getTask(boardId, groupId, taskId);
    if (!task) return null;
    
    const newComment: TaskComment = {
      ...createEmptyComment(comment.authorId || '', comment.authorName || ''),
      id: generateId(),
      ...comment,
      createdAt: Date.now()
    };
    
    task.comments.unshift(newComment);
    await this.updateTask(boardId, groupId, taskId, { comments: task.comments });
    
    return newComment;
  }

  // Activity operations
  async addActivity(boardId: string, activity: Omit<BoardActivity, 'id'>): Promise<void> {
    const board = await this.getBoardById(boardId);
    if (!board) return;
    
    const newActivity: BoardActivity = {
      id: generateId(),
      ...activity
    };
    
    board.activities.unshift(newActivity);
    await this.updateBoard(boardId, { activities: board.activities });
  }

  // Utility methods
  async getTask(boardId: string, groupId: string, taskId: string): Promise<COWBoardTask | null> {
    const board = await this.getBoardById(boardId);
    if (!board) return null;
    
    const group = board.groups.find(g => g.id === groupId);
    if (!group) return null;
    
    return group.tasks.find(task => task.id === taskId) || null;
  }

  async moveTask(
    boardId: string, 
    sourceGroupId: string, 
    targetGroupId: string, 
    taskId: string, 
    newIndex: number
  ): Promise<boolean> {
    await this.delay(200);
    
    const board = await this.getBoardById(boardId);
    if (!board) return false;
    
    const sourceGroup = board.groups.find(g => g.id === sourceGroupId);
    const targetGroup = board.groups.find(g => g.id === targetGroupId);
    
    if (!sourceGroup || !targetGroup) return false;
    
    const taskIndex = sourceGroup.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return false;
    
    // Remove task from source group
    const [task] = sourceGroup.tasks.splice(taskIndex, 1);
    
    // Add task to target group at specified index
    targetGroup.tasks.splice(newIndex, 0, task);
    
    await this.updateBoard(boardId, { groups: board.groups });
    return true;
  }

  // Filter and search
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

  // Helper method to simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // FlexiBoard methods
  async getFlexiBoardById(boardId: string): Promise<{ board: FlexiBoard; engine: EnhancedFlexiBoardEngine } | null> {
    await this.delay(100);
    return this.flexiBoards.get(boardId) || null;
  }

  async updateFlexiBoard(boardId: string, updatedBoard: FlexiBoard): Promise<void> {
    const existing = this.flexiBoards.get(boardId);
    if (existing) {
      this.flexiBoards.set(boardId, { ...existing, board: updatedBoard });
    }
  }

  // Factory methods
  getEmptyBoard = createEmptyBoard;
  getEmptyGroup = createEmptyGroup;
  getEmptyTask = createEmptyTask;
  getEmptyComment = createEmptyComment;
  getDefaultFilter = getDefaultBoardFilter;
}

export const boardService = new BoardService();
export default boardService;