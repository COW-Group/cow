/**
 * Monday.com MCP Proxy Service
 * This service acts as a proxy to fetch Monday.com data via the MCP connection
 * Since Monday.com is connected to Claude via MCP, we can request data through it
 */

interface MondayWorkspace {
  id: string;
  name: string;
  description?: string;
}

interface MondayBoard {
  id: string;
  name: string;
  description?: string;
  workspace?: MondayWorkspace;
  groups: MondayGroup[];
  items_count?: number;
  state: 'active' | 'archived' | 'deleted';
}

interface MondayGroup {
  id: string;
  title: string;
  color: string;
  position: string;
  items: MondayItem[];
}

interface MondayItem {
  id: string;
  name: string;
  state: 'active' | 'done' | 'archived';
  column_values: MondayColumnValue[];
  created_at: string;
  updated_at: string;
}

interface MondayColumnValue {
  id: string;
  type: string;
  text?: string;
  value?: string;
  column: {
    id: string;
    title: string;
    type: string;
  };
}

interface MCPMondayResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

class MondayMCPProxyService {
  private isConnected = false;
  private workspaceCache: MondayBoard[] = [];
  private lastFetch: number = 0;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if we can connect to Monday.com via MCP
   */
  async testConnection(): Promise<boolean> {
    try {
      // For now, we'll simulate the connection test
      // In a real implementation, this would make an MCP request
      console.log('🔍 Testing Monday.com MCP connection...');

      // Simulate checking if the MCP connection is available
      // You would implement actual MCP communication here

      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Monday.com MCP connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Fetch workspaces and boards from Monday.com via MCP
   */
  async fetchWorkspaceData(): Promise<MCPMondayResponse> {
    try {
      console.log('📊 Fetching Monday.com workspace data via MCP...');

      // Check cache first
      if (this.workspaceCache.length > 0 &&
          Date.now() - this.lastFetch < this.cacheTimeout) {
        return {
          success: true,
          data: this.workspaceCache,
          timestamp: new Date().toISOString()
        };
      }

      // In a real implementation, this would make an MCP request
      // For now, we'll provide instructions for manual data fetching

      const instructions = this.generateMCPInstructions();

      return {
        success: false,
        error: 'MCP data fetching requires manual request. See instructions in console.',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate instructions for fetching Monday.com data via MCP
   */
  private generateMCPInstructions(): string {
    const instructions = `
🔧 Monday.com MCP Data Fetching Instructions:

Since Monday.com is connected to Claude via MCP, you can fetch your workspace data by asking Claude directly:

1. **Fetch Workspaces:**
   "Show me all my Monday.com workspaces"

2. **Fetch MyCow Group Boards:**
   "Show me all boards in my MyCow Group workspace on Monday.com"

3. **Fetch Board Details:**
   "Show me the items and groups in [specific board name] on Monday.com"

4. **Fetch Board Items:**
   "List all tasks/items in [board name] with their statuses and assignments"

📋 Sample Commands to try:
- "What boards do I have in Monday.com?"
- "Show me the MyCow Group workspace details"
- "List all items in my main project board"
- "Get the status of all tasks assigned to me"

💡 Tip: You can ask Claude to format the response as JSON for easier processing.

Example: "Show me all boards in MyCow Group workspace formatted as JSON with board names, IDs, and item counts"
    `;

    console.log(instructions);
    return instructions;
  }

  /**
   * Process manually fetched Monday.com data
   */
  async processMondayData(rawData: any): Promise<MondayBoard[]> {
    try {
      console.log('🔄 Processing Monday.com data...');

      // If the data is a string (JSON), parse it
      let data = rawData;
      if (typeof rawData === 'string') {
        data = JSON.parse(rawData);
      }

      // Process and normalize the data structure
      const boards: MondayBoard[] = [];

      if (Array.isArray(data)) {
        // Data is an array of boards
        for (const item of data) {
          const board = this.normalizeBoardData(item);
          if (board) boards.push(board);
        }
      } else if (data.boards) {
        // Data has a boards property
        for (const item of data.boards) {
          const board = this.normalizeBoardData(item);
          if (board) boards.push(board);
        }
      } else if (data.data && data.data.boards) {
        // GraphQL response format
        for (const item of data.data.boards) {
          const board = this.normalizeBoardData(item);
          if (board) boards.push(board);
        }
      }

      // Cache the processed data
      this.workspaceCache = boards;
      this.lastFetch = Date.now();

      console.log(`✅ Processed ${boards.length} boards from Monday.com`);
      return boards;

    } catch (error) {
      console.error('Error processing Monday.com data:', error);
      throw new Error(`Failed to process Monday.com data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Normalize board data from various Monday.com response formats
   */
  private normalizeBoardData(rawBoard: any): MondayBoard | null {
    try {
      if (!rawBoard || !rawBoard.id) return null;

      const board: MondayBoard = {
        id: rawBoard.id.toString(),
        name: rawBoard.name || rawBoard.title || 'Untitled Board',
        description: rawBoard.description || '',
        state: rawBoard.state || 'active',
        groups: []
      };

      // Process workspace info
      if (rawBoard.workspace) {
        board.workspace = {
          id: rawBoard.workspace.id?.toString() || '1',
          name: rawBoard.workspace.name || 'Default Workspace'
        };
      }

      // Process groups
      if (rawBoard.groups && Array.isArray(rawBoard.groups)) {
        board.groups = rawBoard.groups.map((group: any) => ({
          id: group.id?.toString() || '',
          title: group.title || 'Untitled Group',
          color: group.color || '#579bfc',
          position: group.position?.toString() || '0',
          items: this.normalizeItems(group.items || [])
        }));
      }

      return board;
    } catch (error) {
      console.warn('Failed to normalize board data:', error);
      return null;
    }
  }

  /**
   * Normalize items data
   */
  private normalizeItems(rawItems: any[]): MondayItem[] {
    if (!Array.isArray(rawItems)) return [];

    return rawItems.map((item: any) => ({
      id: item.id?.toString() || '',
      name: item.name || item.title || 'Untitled Item',
      state: item.state || 'active',
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString(),
      column_values: this.normalizeColumnValues(item.column_values || [])
    })).filter(item => item.id); // Remove items without IDs
  }

  /**
   * Normalize column values
   */
  private normalizeColumnValues(rawValues: any[]): MondayColumnValue[] {
    if (!Array.isArray(rawValues)) return [];

    return rawValues.map((val: any) => ({
      id: val.id || '',
      type: val.type || 'text',
      text: val.text || val.display_value || '',
      value: val.value || '',
      column: {
        id: val.column?.id || val.column_id || '',
        title: val.column?.title || val.column_title || '',
        type: val.column?.type || val.type || 'text'
      }
    }));
  }

  /**
   * Get cached workspace data
   */
  getCachedData(): MondayBoard[] {
    return this.workspaceCache;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.workspaceCache = [];
    this.lastFetch = 0;
  }

  /**
   * Check if connected
   */
  isConnectedToMonday(): boolean {
    return this.isConnected;
  }

  /**
   * Get connection status
   */
  getStatus(): {
    connected: boolean;
    cached: boolean;
    cacheAge: number;
    boardCount: number;
  } {
    return {
      connected: this.isConnected,
      cached: this.workspaceCache.length > 0,
      cacheAge: Date.now() - this.lastFetch,
      boardCount: this.workspaceCache.length
    };
  }
}

export const mondayMCPProxyService = new MondayMCPProxyService();
export default mondayMCPProxyService;