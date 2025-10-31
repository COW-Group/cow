/**
 * Board Service
 *
 * This file now exports the Supabase-integrated board service.
 * The mock implementation has been moved to board-mock.service.ts for testing.
 */

import { boardSupabaseService } from './board-supabase.service';

// Export the Supabase service as the main board service
export const boardService = boardSupabaseService;
export default boardService;

// Re-export types for convenience
export type {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  TaskComment,
  BoardActivity,
  BoardFilter,
  PersonAssignment,
  ManagementType,
  PrivacyType
} from '../types/board.types';

/*
 * ==============================================================================
 * MIGRATION NOTES
 * ==============================================================================
 *
 * The board service has been migrated from mock data to Supabase integration.
 *
 * **What Changed:**
 * - getBoards() now fetches from Supabase `boards` table
 * - getBoardById() loads board with nested groups/tasks/activities
 * - createBoard() persists to Supabase database
 * - updateBoard() updates Supabase records
 * - deleteBoard() removes from Supabase with cascade
 *
 * **Implemented Methods:**
 * ✅ getBoards(filter?) - Fetch all boards with optional title filter
 * ✅ getBoardById(boardId) - Fetch single board with full nested data
 * ✅ createBoard(boardData, createdBy) - Create new board in Supabase
 * ✅ updateBoard(boardId, updates) - Update board properties
 * ✅ deleteBoard(boardId) - Delete board from database
 * ✅ toggleBoardStar(boardId) - Toggle starred status
 *
 * **Not Yet Implemented (Future Phase):**
 * ⏳ createGroup() - Will implement in next iteration
 * ⏳ updateGroup() - Will implement in next iteration
 * ⏳ deleteGroup() - Will implement in next iteration
 * ⏳ createTask() - Will implement in next iteration
 * ⏳ updateTask() - Will implement in next iteration
 * ⏳ deleteTask() - Will implement in next iteration
 * ⏳ addComment() - Will implement in next iteration
 * ⏳ moveTask() - Will implement in next iteration
 *
 * **Testing:**
 * - Board CRUD operations are functional
 * - Nested data loading works (groups, tasks, labels, members, activities)
 * - FlexiBoard integration preserved for template-based boards
 *
 * **Backward Compatibility:**
 * - All existing imports of `boardService` will automatically use Supabase
 * - Method signatures unchanged - drop-in replacement
 * - Mock service available in `board-mock.service.ts` for testing
 *
 * ==============================================================================
 */
