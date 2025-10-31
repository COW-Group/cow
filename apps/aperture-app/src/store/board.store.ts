import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  COWBoard, 
  COWBoardGroup, 
  COWBoardTask, 
  TaskComment,
  BoardActivity,
  BoardFilter,
  ModalState,
  BoardViewType,
  ComponentType,
  getDefaultBoardFilter
} from '../types/board.types';
// FlexiBoard imports removed to fix compilation errors
import { boardService } from '../services/board.service';

interface BoardState {
  // Board data
  boards: COWBoard[];
  currentBoard: COWBoard | null;
  filteredBoard: COWBoard | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  filter: BoardFilter;
  viewType: BoardViewType;
  modalState: ModalState;
  
  // Board operations
  fetchBoards: (filter?: Partial<BoardFilter>) => Promise<void>;
  fetchBoardById: (boardId: string) => Promise<void>;
  createBoard: (boardData: Partial<COWBoard>) => Promise<void>;
  updateBoard: (boardId: string, updates: Partial<COWBoard>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  toggleBoardStar: (boardId: string) => Promise<void>;
  
  // Group operations
  createGroup: (boardId: string, groupData: Partial<COWBoardGroup>) => Promise<void>;
  updateGroup: (boardId: string, groupId: string, updates: Partial<COWBoardGroup>) => Promise<void>;
  deleteGroup: (boardId: string, groupId: string) => Promise<void>;
  duplicateGroup: (boardId: string, groupId: string) => Promise<void>;
  
  // Task operations
  createTask: (boardId: string, groupId: string, taskData: Partial<COWBoardTask>) => Promise<void>;
  updateTask: (boardId: string, groupId: string, taskId: string, updates: Partial<COWBoardTask>) => Promise<void>;
  deleteTask: (boardId: string, groupId: string, taskId: string) => Promise<void>;
  duplicateTask: (boardId: string, groupId: string, taskId: string) => Promise<void>;
  moveTask: (boardId: string, sourceGroupId: string, targetGroupId: string, taskId: string, newIndex: number) => Promise<void>;
  
  // Comment operations
  addComment: (boardId: string, groupId: string, taskId: string, comment: Partial<TaskComment>) => Promise<void>;
  
  // Filter and view operations
  setFilter: (filter: Partial<BoardFilter>) => void;
  applyFilter: () => void;
  setViewType: (viewType: BoardViewType) => void;
  
  // Column management
  updateColumnOrder: (boardId: string, newOrder: ComponentType[]) => Promise<void>;
  addColumn: (boardId: string, columnType: ComponentType) => Promise<void>;
  removeColumn: (boardId: string, columnType: ComponentType) => Promise<void>;
  
  // Modal operations
  openModal: (modalData: Partial<ModalState>) => void;
  closeModal: () => void;
  
  // Utility functions
  resetError: () => void;
  getTasksByStatus: (boardId: string) => Record<string, COWBoardTask[]>;
  getBoardStats: (boardId: string) => BoardStats;
}

interface BoardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalGroups: number;
}

export const useBoardStore = create<BoardState>()(
  immer((set, get) => ({
    // Initial state
    boards: [],
    currentBoard: null,
    filteredBoard: null,
    isLoading: false,
    error: null,
    filter: getDefaultBoardFilter(),
    viewType: 'table',
    modalState: {
      isOpen: false,
      position: { x: 0, y: 0 }
    },

    // Board operations
    fetchBoards: async (filter) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const boards = await boardService.getBoards(filter);
        set(state => {
          state.boards = boards;
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch boards';
          state.isLoading = false;
        });
      }
    },

    fetchBoardById: async (boardId) => {
      // Check if we already have this board loaded
      const currentState = get();
      if (currentState.currentBoard?.id === boardId && !currentState.isLoading) {
        console.log('🔧 BoardStore: Board already loaded, skipping fetch:', boardId);
        return;
      }

      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const board = await boardService.getBoardById(boardId);
        
        // Validate board structure
        if (board && board.id && Array.isArray(board.groups)) {
          set(state => {
            state.currentBoard = board;
            state.filteredBoard = board;
            state.isLoading = false;
          });
          
          // Apply current filter
          get().applyFilter();
        } else {
          console.warn('Invalid board structure received:', board);
          set(state => {
            state.currentBoard = null;
            state.filteredBoard = null;
            state.error = 'Invalid board data structure';
            state.isLoading = false;
          });
        }
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to fetch board';
          state.isLoading = false;
        });
      }
    },

    createBoard: async (boardData) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Mock user data - in real app, get from auth store
        const mockUser = { id: 'user-1', name: 'Current User', avatar: '' };
        const newBoard = await boardService.createBoard(boardData, mockUser);
        
        set(state => {
          state.boards.push(newBoard);
          state.isLoading = false;
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to create board';
          state.isLoading = false;
        });
      }
    },

    updateBoard: async (boardId, updates) => {
      try {
        const updatedBoard = await boardService.updateBoard(boardId, updates);
        if (!updatedBoard) return;

        set(state => {
          const boardIndex = state.boards.findIndex(b => b.id === boardId);
          if (boardIndex !== -1) {
            state.boards[boardIndex] = updatedBoard;
          }
          
          if (state.currentBoard?.id === boardId) {
            state.currentBoard = updatedBoard;
            state.filteredBoard = updatedBoard;
          }
        });
        
        get().applyFilter();
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to update board';
        });
      }
    },

    deleteBoard: async (boardId) => {
      try {
        const success = await boardService.deleteBoard(boardId);
        if (!success) return;

        set(state => {
          state.boards = state.boards.filter(b => b.id !== boardId);
          if (state.currentBoard?.id === boardId) {
            state.currentBoard = null;
            state.filteredBoard = null;
          }
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to delete board';
        });
      }
    },

    toggleBoardStar: async (boardId) => {
      try {
        const updatedBoard = await boardService.toggleBoardStar(boardId);
        if (!updatedBoard) return;

        set(state => {
          const boardIndex = state.boards.findIndex(b => b.id === boardId);
          if (boardIndex !== -1) {
            state.boards[boardIndex] = updatedBoard;
          }
          
          if (state.currentBoard?.id === boardId) {
            state.currentBoard = updatedBoard;
          }
        });
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to toggle board star';
        });
      }
    },

    // Group operations
    createGroup: async (boardId, groupData) => {
      try {
        const newGroup = await boardService.createGroup(boardId, groupData);
        if (!newGroup) return;

        // Refresh the current board
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to create group';
        });
      }
    },

    updateGroup: async (boardId, groupId, updates) => {
      try {
        await boardService.updateGroup(boardId, groupId, updates);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to update group';
        });
      }
    },

    deleteGroup: async (boardId, groupId) => {
      try {
        await boardService.deleteGroup(boardId, groupId);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to delete group';
        });
      }
    },

    duplicateGroup: async (boardId, groupId) => {
      try {
        const board = await boardService.getBoardById(boardId);
        if (!board) return;

        const originalGroup = board.groups.find(g => g.id === groupId);
        if (!originalGroup) return;

        const duplicatedGroup = {
          ...originalGroup,
          title: `${originalGroup.title} (Copy)`,
          tasks: originalGroup.tasks.map(task => ({
            ...task,
            comments: [] // Don't copy comments
          }))
        };

        await get().createGroup(boardId, duplicatedGroup);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to duplicate group';
        });
      }
    },

    // Task operations
    createTask: async (boardId, groupId, taskData) => {
      try {
        await boardService.createTask(boardId, groupId, taskData);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to create task';
        });
      }
    },

    updateTask: async (boardId, groupId, taskId, updates) => {
      try {
        await boardService.updateTask(boardId, groupId, taskId, updates);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to update task';
        });
      }
    },

    deleteTask: async (boardId, groupId, taskId) => {
      try {
        await boardService.deleteTask(boardId, groupId, taskId);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to delete task';
        });
      }
    },

    duplicateTask: async (boardId, groupId, taskId) => {
      try {
        await boardService.duplicateTask(boardId, groupId, taskId);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to duplicate task';
        });
      }
    },

    moveTask: async (boardId, sourceGroupId, targetGroupId, taskId, newIndex) => {
      try {
        await boardService.moveTask(boardId, sourceGroupId, targetGroupId, taskId, newIndex);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to move task';
        });
      }
    },

    // Comment operations
    addComment: async (boardId, groupId, taskId, comment) => {
      try {
        await boardService.addComment(boardId, groupId, taskId, comment);
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to add comment';
        });
      }
    },

    // Filter and view operations
    setFilter: (filter) => {
      set(state => {
        state.filter = { ...state.filter, ...filter };
      });
      get().applyFilter();
    },

    applyFilter: () => {
      const { currentBoard, filter } = get();
      if (!currentBoard) return;

      const filteredBoard = boardService.getFilteredTasks(currentBoard, filter);
      set(state => {
        state.filteredBoard = filteredBoard;
      });
    },

    setViewType: (viewType) => {
      set(state => {
        state.viewType = viewType;
      });
    },

    // Column management
    updateColumnOrder: async (boardId, newOrder) => {
      try {
        await boardService.updateBoard(boardId, { columnOrder: newOrder });
        await get().fetchBoardById(boardId);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to update column order';
        });
      }
    },

    addColumn: async (boardId, columnType) => {
      try {
        const board = await boardService.getBoardById(boardId);
        if (!board) return;

        const newColumnOrder = [...board.columnOrder, columnType];
        await get().updateColumnOrder(boardId, newColumnOrder);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to add column';
        });
      }
    },

    removeColumn: async (boardId, columnType) => {
      try {
        const board = await boardService.getBoardById(boardId);
        if (!board) return;

        const newColumnOrder = board.columnOrder.filter(col => col !== columnType);
        await get().updateColumnOrder(boardId, newColumnOrder);
      } catch (error: any) {
        set(state => {
          state.error = error.message || 'Failed to remove column';
        });
      }
    },

    // Modal operations
    openModal: (modalData) => {
      set(state => {
        state.modalState = {
          isOpen: true,
          position: { x: 0, y: 0 },
          ...modalData
        };
      });
    },

    closeModal: () => {
      set(state => {
        state.modalState = {
          isOpen: false,
          position: { x: 0, y: 0 }
        };
      });
    },

    // Utility functions
    resetError: () => {
      set(state => {
        state.error = null;
      });
    },

    getTasksByStatus: (boardId) => {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) return {};

      const tasksByStatus: Record<string, COWBoardTask[]> = {};
      
      board.groups.forEach(group => {
        group.tasks.forEach(task => {
          if (!tasksByStatus[task.status]) {
            tasksByStatus[task.status] = [];
          }
          tasksByStatus[task.status].push(task);
        });
      });

      return tasksByStatus;
    },

    getBoardStats: (boardId) => {
      const board = get().boards.find(b => b.id === boardId);
      if (!board) {
        return {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          overdueTasks: 0,
          totalGroups: 0
        };
      }

      const allTasks = board.groups.flatMap(group => group.tasks);
      const now = Date.now();

      return {
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(task => task.status === 'Done').length,
        inProgressTasks: allTasks.filter(task => task.status === 'Working on it').length,
        overdueTasks: allTasks.filter(task => 
          task.dueDate && task.dueDate < now && task.status !== 'Done'
        ).length,
        totalGroups: board.groups.length
      };
    }
  }))
);

export default useBoardStore;