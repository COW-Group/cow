import {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  PersonAssignment,
  BoardLabel
} from '../types/board.types';
import { mcpAuthService } from './mcp-auth.service';

/**
 * Monday.com MCP Integration Service
 * Connects to your COW group's Monday.com workspace via MCP
 */

interface MondayBoard {
  id: string;
  name: string;
  description?: string;
  groups: MondayGroup[];
  columns: MondayColumn[];
  owners: MondayUser[];
  subscribers: MondayUser[];
  state: 'active' | 'archived' | 'deleted';
  workspace: {
    id: string;
    name: string;
  };
}

interface MondayGroup {
  id: string;
  title: string;
  color: string;
  position: string;
  archived: boolean;
  items: MondayItem[];
}

interface MondayItem {
  id: string;
  name: string;
  state: 'active' | 'done' | 'archived';
  created_at: string;
  updated_at: string;
  column_values: MondayColumnValue[];
  board: {
    id: string;
  };
  group: {
    id: string;
    title: string;
    color: string;
  };
}

interface MondayColumn {
  id: string;
  title: string;
  type: string;
  description?: string;
  settings_str: string;
  archived: boolean;
  width?: number;
}

interface MondayColumnValue {
  id: string;
  type: string;
  text?: string;
  value?: string;
  display_value?: string;
  column: {
    id: string;
    title: string;
    type: string;
  };
}

interface MondayUser {
  id: string;
  name: string;
  email: string;
  photo_original?: string;
  photo_thumb?: string;
  title?: string;
  location?: string;
}

/**
 * Monday.com GraphQL queries
 */
const MONDAY_QUERIES = {
  // Get all boards in workspace
  getBoards: `
    query GetBoards {
      boards {
        id
        name
        description
        state
        workspace {
          id
          name
        }
        groups {
          id
          title
          color
          position
          archived
        }
        columns {
          id
          title
          type
          description
          settings_str
          archived
          width
        }
        owners {
          id
          name
          email
          photo_original
          title
        }
        subscribers {
          id
          name
          email
          photo_original
        }
      }
    }
  `,

  // Get specific board with items
  getBoardWithItems: (boardId: string) => `
    query GetBoardWithItems {
      boards(ids: [${boardId}]) {
        id
        name
        description
        state
        groups {
          id
          title
          color
          position
          archived
          items {
            id
            name
            state
            created_at
            updated_at
            column_values {
              id
              type
              text
              value
              display_value
              column {
                id
                title
                type
              }
            }
            board {
              id
            }
            group {
              id
              title
              color
            }
          }
        }
        columns {
          id
          title
          type
          description
          settings_str
          archived
          width
        }
      }
    }
  `,

  // Create new item
  createItem: (boardId: string, groupId: string, itemName: string) => `
    mutation CreateItem {
      create_item(
        board_id: ${boardId}
        group_id: "${groupId}"
        item_name: "${itemName}"
      ) {
        id
        name
        state
        created_at
        updated_at
      }
    }
  `,

  // Update item
  updateItem: (itemId: string, columnId: string, value: string) => `
    mutation UpdateItem {
      change_column_value(
        item_id: ${itemId}
        column_id: "${columnId}"
        value: "${value}"
      ) {
        id
        name
        column_values {
          id
          text
          value
        }
      }
    }
  `,

  // Delete item
  deleteItem: (itemId: string) => `
    mutation DeleteItem {
      delete_item(item_id: ${itemId}) {
        id
      }
    }
  `,

  // Create group
  createGroup: (boardId: string, groupName: string) => `
    mutation CreateGroup {
      create_group(
        board_id: ${boardId}
        group_name: "${groupName}"
      ) {
        id
        title
        color
        position
      }
    }
  `,

  // Delete group
  deleteGroup: (groupId: string) => `
    mutation DeleteGroup {
      delete_group(group_id: "${groupId}") {
        id
      }
    }
  `
};

/**
 * Color mappings from Monday.com to our system
 */
const MONDAY_COLOR_MAP: Record<string, string> = {
  '#FF642E': '#ff5e5b',
  '#FFD33C': '#fdab3d',
  '#00C875': '#00c875',
  '#0073EA': '#0073ea',
  '#A25DDC': '#9b59b6',
  '#FB3BAF': '#e91e63',
  '#BB3354': '#bb3354',
  '#579BFC': '#579bfc',
  '#66CCFF': '#5dade2',
  '#9CD326': '#7fb069'
};

class MondayService {
  private workspaceId?: string;

  constructor() {
    this.workspaceId = process.env.REACT_APP_MONDAY_WORKSPACE_ID || '';
  }

  /**
   * Execute GraphQL query via MCP Auth Service
   */
  private async executeQuery(query: string, variables?: Record<string, any>): Promise<any> {
    try {
      return await mcpAuthService.executeRequest(query, variables);
    } catch (error) {
      console.error('Monday.com MCP error:', error);
      throw error;
    }
  }

  /**
   * Get all boards from Monday.com
   */
  async getBoards(): Promise<COWBoard[]> {
    try {
      const data = await this.executeQuery(MONDAY_QUERIES.getBoards);

      return data.boards
        .filter((board: MondayBoard) => board.state === 'active')
        .map((board: MondayBoard) => this.convertMondayBoardToCOW(board));
    } catch (error) {
      console.error('Error fetching Monday boards:', error);
      return [];
    }
  }

  /**
   * Get specific board with all items
   */
  async getBoardById(boardId: string): Promise<COWBoard | null> {
    try {
      const data = await this.executeQuery(MONDAY_QUERIES.getBoardWithItems(boardId));

      if (!data.boards || data.boards.length === 0) {
        return null;
      }

      return this.convertMondayBoardToCOW(data.boards[0]);
    } catch (error) {
      console.error('Error fetching Monday board:', error);
      return null;
    }
  }

  /**
   * Create new task in Monday.com
   */
  async createTask(boardId: string, groupId: string, taskData: Partial<COWBoardTask>): Promise<COWBoardTask | null> {
    try {
      const data = await this.executeQuery(
        MONDAY_QUERIES.createItem(boardId, groupId, taskData.title || 'New Task')
      );

      // Convert the created item back to COWBoardTask format
      return this.convertMondayItemToCOW(data.create_item);
    } catch (error) {
      console.error('Error creating Monday task:', error);
      return null;
    }
  }

  /**
   * Update task in Monday.com
   */
  async updateTask(itemId: string, columnId: string, value: any): Promise<boolean> {
    try {
      await this.executeQuery(
        MONDAY_QUERIES.updateItem(itemId, columnId, JSON.stringify(value))
      );
      return true;
    } catch (error) {
      console.error('Error updating Monday task:', error);
      return false;
    }
  }

  /**
   * Delete task from Monday.com
   */
  async deleteTask(itemId: string): Promise<boolean> {
    try {
      await this.executeQuery(MONDAY_QUERIES.deleteItem(itemId));
      return true;
    } catch (error) {
      console.error('Error deleting Monday task:', error);
      return false;
    }
  }

  /**
   * Create new group in Monday.com
   */
  async createGroup(boardId: string, groupData: Partial<COWBoardGroup>): Promise<COWBoardGroup | null> {
    try {
      const data = await this.executeQuery(
        MONDAY_QUERIES.createGroup(boardId, groupData.title || 'New Group')
      );

      return this.convertMondayGroupToCOW(data.create_group);
    } catch (error) {
      console.error('Error creating Monday group:', error);
      return null;
    }
  }

  /**
   * Delete group from Monday.com
   */
  async deleteGroup(groupId: string): Promise<boolean> {
    try {
      await this.executeQuery(MONDAY_QUERIES.deleteGroup(groupId));
      return true;
    } catch (error) {
      console.error('Error deleting Monday group:', error);
      return false;
    }
  }

  /**
   * Convert Monday.com board to COWBoard format
   */
  private convertMondayBoardToCOW(mondayBoard: MondayBoard): COWBoard {
    const members: PersonAssignment[] = [
      ...mondayBoard.owners,
      ...mondayBoard.subscribers
    ].map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.photo_thumb || user.photo_original || ''
    }));

    const groups: COWBoardGroup[] = mondayBoard.groups
      .filter(group => !group.archived)
      .map(group => this.convertMondayGroupToCOW(group));

    // Extract labels from status/dropdown columns
    const labels: BoardLabel[] = this.extractLabelsFromColumns(mondayBoard.columns);

    return {
      id: mondayBoard.id,
      title: mondayBoard.name,
      description: mondayBoard.description || '',
      isStarred: false, // Monday doesn't have favorites, would need to track separately
      createdAt: new Date(), // Monday doesn't provide creation date in basic query
      updatedAt: new Date(),
      createdBy: members[0] || { id: 'unknown', name: 'Unknown', avatar: '' },
      members,
      groups,
      activities: [], // Would need separate query to get activities
      labels,
      columnOrder: this.getColumnOrder(mondayBoard.columns),
      availableColumns: this.getAvailableColumns(mondayBoard.columns),
      viewType: 'table'
    };
  }

  /**
   * Convert Monday.com group to COWBoardGroup format
   */
  private convertMondayGroupToCOW(mondayGroup: MondayGroup): COWBoardGroup {
    const tasks = mondayGroup.items?.map(item => this.convertMondayItemToCOW(item)) || [];

    return {
      id: mondayGroup.id,
      title: mondayGroup.title,
      color: MONDAY_COLOR_MAP[mondayGroup.color] || mondayGroup.color,
      position: parseInt(mondayGroup.position) || 0,
      tasks,
      isCollapsed: mondayGroup.archived
    };
  }

  /**
   * Convert Monday.com item to COWBoardTask format
   */
  private convertMondayItemToCOW(mondayItem: MondayItem): COWBoardTask {
    // Extract data from column values
    const columnData: Record<string, any> = {};
    const assigneeIds: string[] = [];

    mondayItem.column_values?.forEach(colVal => {
      switch (colVal.type) {
        case 'status':
        case 'dropdown':
          columnData[colVal.column.id] = colVal.text || colVal.display_value;
          break;
        case 'people':
          if (colVal.value) {
            try {
              const peopleData = JSON.parse(colVal.value);
              const ids = peopleData.personsAndTeams?.map((p: any) => p.id) || [];
              assigneeIds.push(...ids);
            } catch (e) {
              // Handle parsing error
            }
          }
          break;
        case 'date':
          columnData[colVal.column.id] = colVal.text;
          break;
        case 'text':
        case 'long-text':
          columnData[colVal.column.id] = colVal.text;
          break;
        case 'numbers':
          columnData[colVal.column.id] = parseFloat(colVal.text || '0');
          break;
      }
    });

    return {
      id: mondayItem.id,
      title: mondayItem.name,
      status: this.extractStatus(mondayItem.column_values) || 'Not Started',
      priority: this.extractPriority(mondayItem.column_values) || 'Medium',
      dueDate: this.extractDueDate(mondayItem.column_values),
      assigneeIds,
      progress: this.extractProgress(mondayItem.column_values),
      updatedBy: {
        date: new Date(mondayItem.updated_at).getTime(),
        userId: 'monday-user',
        userAvatar: ''
      },
      comments: [], // Would need separate query
      customFields: columnData,
      automationConfig: {
        autoAssignAgent: false,
        agentTriggers: [],
        escalationRules: [],
        autonomousMode: false
      }
    };
  }

  /**
   * Extract status from Monday column values
   */
  private extractStatus(columnValues: MondayColumnValue[]): string | undefined {
    const statusCol = columnValues.find(cv =>
      cv.type === 'status' ||
      (cv.type === 'dropdown' && cv.column.title.toLowerCase().includes('status'))
    );
    return statusCol?.text || statusCol?.display_value;
  }

  /**
   * Extract priority from Monday column values
   */
  private extractPriority(columnValues: MondayColumnValue[]): string | undefined {
    const priorityCol = columnValues.find(cv =>
      cv.column.title.toLowerCase().includes('priority')
    );
    return priorityCol?.text || priorityCol?.display_value;
  }

  /**
   * Extract due date from Monday column values
   */
  private extractDueDate(columnValues: MondayColumnValue[]): number | undefined {
    const dateCol = columnValues.find(cv =>
      cv.type === 'date' &&
      (cv.column.title.toLowerCase().includes('due') || cv.column.title.toLowerCase().includes('deadline'))
    );

    if (dateCol?.text) {
      const date = new Date(dateCol.text);
      return isNaN(date.getTime()) ? undefined : date.getTime();
    }

    return undefined;
  }

  /**
   * Extract progress from Monday column values
   */
  private extractProgress(columnValues: MondayColumnValue[]): number | undefined {
    const progressCol = columnValues.find(cv =>
      cv.type === 'numbers' &&
      cv.column.title.toLowerCase().includes('progress')
    );

    return progressCol?.text ? parseFloat(progressCol.text) : undefined;
  }

  /**
   * Extract labels from Monday columns
   */
  private extractLabelsFromColumns(columns: MondayColumn[]): BoardLabel[] {
    const labels: BoardLabel[] = [];

    columns.forEach(column => {
      if (column.type === 'status' || column.type === 'dropdown') {
        try {
          const settings = JSON.parse(column.settings_str);
          const options = settings.labels || settings.options || [];

          options.forEach((option: any, index: number) => {
            labels.push({
              id: `${column.id}-${option.id || index}`,
              title: option.name || option.label || option,
              color: option.color || '#0073ea',
              type: column.title.toLowerCase().includes('priority') ? 'priority' : 'status'
            });
          });
        } catch (e) {
          // Handle parsing error
        }
      }
    });

    return labels;
  }

  /**
   * Get column order from Monday columns
   */
  private getColumnOrder(columns: MondayColumn[]): string[] {
    return columns
      .filter(col => !col.archived)
      .sort((a, b) => (a.width || 0) - (b.width || 0)) // Rough approximation
      .map(col => this.mapMondayColumnType(col.type));
  }

  /**
   * Get available columns from Monday columns
   */
  private getAvailableColumns(columns: MondayColumn[]): string[] {
    const availableTypes = new Set<string>();

    columns.forEach(col => {
      if (!col.archived) {
        availableTypes.add(this.mapMondayColumnType(col.type));
      }
    });

    return Array.from(availableTypes);
  }

  /**
   * Map Monday column type to our system
   */
  private mapMondayColumnType(mondayType: string): string {
    const typeMap: Record<string, string> = {
      'text': 'text-picker',
      'status': 'status-picker',
      'dropdown': 'status-picker',
      'people': 'assignee-picker',
      'date': 'date-picker',
      'numbers': 'number-picker',
      'files': 'file-picker',
      'checkbox': 'checkbox-picker',
      'progress': 'progress-picker'
    };

    return typeMap[mondayType] || 'text-picker';
  }

  /**
   * Check if Monday.com connection is configured
   */
  isConfigured(): boolean {
    return mcpAuthService.isAuthenticated();
  }

  /**
   * Test connection to Monday.com
   */
  async testConnection(): Promise<boolean> {
    try {
      return await mcpAuthService.testConnection();
    } catch (error) {
      return false;
    }
  }
}

export const mondayService = new MondayService();
export default mondayService;