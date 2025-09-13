import {
  FlexiBoard,
  FlexiBoardItem,
  FlexiBoardColumn,
  FlexiBoardView,
  FlexiBoardFilter,
  FlexiBoardSort,
  FlexiBoardAutomation,
  BulkOperation,
  BulkOperationResult,
  FlexiBoardActivity,
  FlexiBoardNotification,
  FlexiBoardDashboard,
  FlexiBoardWidget,
  BusinessAppType
} from '../types/flexiboard';
import { FlexiBoardEngine } from './boardEngine';
import { AutomationEngine } from './automationEngine';
import { AdvancedColumnEngine } from './columnEngines';

export class EnhancedFlexiBoardEngine extends FlexiBoardEngine {
  private automationEngine: AutomationEngine;
  private columnEngine: AdvancedColumnEngine;
  private connectedBoards: Map<string, EnhancedFlexiBoardEngine> = new Map();

  constructor(
    board: FlexiBoard,
    callbacks?: {
      onNotification?: (notification: FlexiBoardNotification) => void;
      onActivity?: (activity: FlexiBoardActivity) => void;
    }
  ) {
    super(board);
    this.automationEngine = new AutomationEngine(board, callbacks);
    this.columnEngine = new AdvancedColumnEngine(board);
  }

  // Connect boards for lookup and connect-boards columns
  connectBoard(boardId: string, boardEngine: EnhancedFlexiBoardEngine): void {
    this.connectedBoards.set(boardId, boardEngine);
    this.columnEngine.addConnectedBoard(boardId, boardEngine.getBoard());
  }

  // Enhanced item management with automation triggers
  async addItemWithAutomation(
    itemData: Omit<FlexiBoardItem, 'id' | 'createdAt' | 'updatedAt' | 'position'>,
    userId: string
  ): Promise<FlexiBoardItem> {
    const item = this.addItem(itemData);
    
    // Trigger automations
    await this.automationEngine.executeAutomations({
      type: 'item-created',
      itemId: item.id,
      userId
    });

    return item;
  }

  async updateItemWithAutomation(
    itemId: string,
    updates: Partial<FlexiBoardItem>,
    userId: string
  ): Promise<FlexiBoardItem | null> {
    const oldItem = this.getBoard().items.find(i => i.id === itemId);
    if (!oldItem) return null;

    const updatedItem = this.updateItem(itemId, updates);
    if (!updatedItem) return null;

    // Check for column changes and trigger automations
    for (const [key, newValue] of Object.entries(updates.data || {})) {
      const oldValue = oldItem.data[key];
      if (oldValue !== newValue) {
        await this.automationEngine.executeAutomations({
          type: 'item-updated',
          itemId,
          column: key,
          oldValue,
          newValue,
          userId
        });
      }
    }

    return updatedItem;
  }

  // Bulk operations
  async executeBulkOperation(operation: BulkOperation, userId: string): Promise<BulkOperationResult> {
    const result: BulkOperationResult = {
      success: true,
      processedItems: 0,
      failedItems: 0,
      errors: []
    };

    for (const itemId of operation.itemIds) {
      try {
        switch (operation.type) {
          case 'update':
            if (operation.data) {
              await this.updateItemWithAutomation(itemId, { data: operation.data }, userId);
            }
            break;
            
          case 'delete':
            this.removeItem(itemId);
            break;
            
          case 'move':
            if (operation.targetGroupId) {
              await this.updateItemWithAutomation(itemId, {
                data: { groupId: operation.targetGroupId }
              }, userId);
            }
            break;
            
          case 'duplicate':
            const originalItem = this.getBoard().items.find(i => i.id === itemId);
            if (originalItem) {
              await this.addItemWithAutomation({
                boardId: originalItem.boardId,
                data: { ...originalItem.data },
                status: originalItem.status,
                priority: originalItem.priority,
                assignees: [...(originalItem.assignees || [])],
                tags: [...(originalItem.tags || [])],
                createdBy: userId
              }, userId);
            }
            break;
            
          case 'archive':
            // Move to archived state or remove
            this.removeItem(itemId);
            break;
        }
        
        result.processedItems++;
      } catch (error) {
        result.failedItems++;
        result.errors?.push({
          itemId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    result.success = result.failedItems === 0;
    return result;
  }

  // Advanced filtering and search
  advancedFilter(filters: {
    text?: string;
    columns?: { [columnId: string]: any };
    dateRange?: { start: Date; end: Date };
    assignees?: string[];
    tags?: string[];
    status?: string[];
    priority?: string[];
    customFilters?: FlexiBoardFilter[];
  }): FlexiBoardItem[] {
    let items = [...this.getBoard().items];

    // Text search across multiple columns
    if (filters.text) {
      const searchTerm = filters.text.toLowerCase();
      items = items.filter(item => {
        return this.getBoard().columns.some(column => {
          if (column.type === 'text' || column.type === 'long-text') {
            const value = item.data[column.id];
            return value && value.toString().toLowerCase().includes(searchTerm);
          }
          return false;
        });
      });
    }

    // Column-specific filters
    if (filters.columns) {
      items = items.filter(item => {
        return Object.entries(filters.columns!).every(([columnId, filterValue]) => {
          const itemValue = item.data[columnId];
          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }
          return itemValue === filterValue;
        });
      });
    }

    // Date range filter
    if (filters.dateRange) {
      items = items.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end;
      });
    }

    // Assignee filter
    if (filters.assignees && filters.assignees.length > 0) {
      items = items.filter(item => {
        return item.assignees?.some(assignee => filters.assignees!.includes(assignee));
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      items = items.filter(item => {
        return item.tags?.some(tag => filters.tags!.includes(tag));
      });
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      items = items.filter(item => filters.status!.includes(item.status || ''));
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      items = items.filter(item => filters.priority!.includes(item.priority || ''));
    }

    // Custom filters
    if (filters.customFilters) {
      items = this.getItems(filters.customFilters);
    }

    return items;
  }

  // Template and duplication
  createTemplate(templateData: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    includeData?: boolean;
  }): Partial<FlexiBoard> {
    const board = this.getBoard();
    
    return {
      name: templateData.name,
      description: templateData.description,
      columns: [...board.columns],
      views: board.views.map(view => ({
        ...view,
        id: this.generateId(),
        isDefault: false
      })),
      groups: board.groups?.map(group => ({
        ...group,
        id: this.generateId(),
        items: templateData.includeData ? group.items.map(item => ({
          ...item,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        })) : []
      })),
      items: templateData.includeData ? board.items.map(item => ({
        ...item,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      })) : [],
      automations: board.automations?.map(automation => ({
        ...automation,
        id: this.generateId(),
        createdAt: new Date(),
        runCount: 0
      })),
      template: {
        isTemplate: true,
        category: templateData.category,
        tags: templateData.tags,
        useCount: 0
      },
      settings: { ...board.settings },
      permissions: { ...board.permissions }
    };
  }

  duplicateBoard(newName: string, options?: {
    includeData?: boolean;
    includeAutomations?: boolean;
    includeViews?: boolean;
  }): Partial<FlexiBoard> {
    const board = this.getBoard();
    const opts = {
      includeData: false,
      includeAutomations: true,
      includeViews: true,
      ...options
    };

    return {
      name: newName,
      description: board.description,
      columns: board.columns.map(col => ({
        ...col,
        id: this.generateId()
      })),
      views: opts.includeViews ? board.views.map(view => ({
        ...view,
        id: this.generateId()
      })) : [this.createDefaultView()],
      groups: board.groups?.map(group => ({
        ...group,
        id: this.generateId(),
        items: opts.includeData ? group.items.map(item => ({
          ...item,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        })) : []
      })),
      items: opts.includeData ? board.items.map(item => ({
        ...item,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      })) : [],
      automations: opts.includeAutomations ? board.automations?.map(automation => ({
        ...automation,
        id: this.generateId(),
        createdAt: new Date(),
        runCount: 0
      })) : [],
      settings: { ...board.settings },
      permissions: { ...board.permissions }
    };
  }

  private createDefaultView() {
    return {
      id: this.generateId(),
      name: 'Main Table',
      type: 'table' as const,
      isDefault: true,
      filters: [],
      sorts: [],
      visibleColumns: this.getBoard().columns.map(c => c.id)
    };
  }

  // Dashboard and analytics
  generateDashboard(config: {
    name: string;
    widgets: Array<{
      type: 'chart' | 'number' | 'progress' | 'timeline' | 'activity';
      title: string;
      config: any;
      size: 'small' | 'medium' | 'large';
    }>;
  }): FlexiBoardDashboard {
    const widgets: FlexiBoardWidget[] = config.widgets.map((widget, index) => ({
      id: this.generateId(),
      type: widget.type,
      title: widget.title,
      config: {
        boardId: this.getBoard().id,
        ...widget.config,
        size: widget.size
      },
      position: {
        x: (index % 3) * 4,
        y: Math.floor(index / 3) * 3,
        w: widget.size === 'large' ? 12 : widget.size === 'medium' ? 6 : 4,
        h: widget.size === 'large' ? 6 : 3
      }
    }));

    return {
      id: this.generateId(),
      name: config.name,
      widgets,
      shared: false,
      createdBy: 'current-user', // In practice, get from context
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Advanced analytics
  getAdvancedAnalytics() {
    const board = this.getBoard();
    const items = board.items;
    
    return {
      overview: {
        totalItems: items.length,
        completedItems: items.filter(i => i.status === 'Done' || i.status === 'Completed').length,
        overdue: items.filter(i => {
          const dueDate = this.getItemDueDate(i);
          return dueDate && dueDate < new Date() && i.status !== 'Done';
        }).length,
        activeAssignees: new Set(items.flatMap(i => i.assignees || [])).size
      },
      trends: {
        itemsCreatedThisWeek: this.getItemsCreatedInPeriod(7),
        itemsCompletedThisWeek: this.getItemsCompletedInPeriod(7),
        averageCompletionTime: this.getAverageCompletionTime(),
        bottlenecks: this.identifyBottlenecks()
      },
      columnAnalytics: board.columns.map(column => ({
        columnId: column.id,
        columnName: column.title,
        columnType: column.type,
        uniqueValues: this.getUniqueColumnValues(column.id),
        distribution: this.getColumnValueDistribution(column.id)
      })),
      automationStats: board.automations?.map(automation => ({
        automationId: automation.id,
        automationName: automation.name,
        runCount: automation.runCount,
        lastRun: automation.lastRun,
        enabled: automation.enabled
      })) || []
    };
  }

  private getItemDueDate(item: FlexiBoardItem): Date | null {
    // Look for date columns that might represent due dates
    const dateColumns = this.getBoard().columns.filter(c => c.type === 'date' || c.type === 'datetime');
    for (const column of dateColumns) {
      const value = item.data[column.id];
      if (value) {
        return new Date(value);
      }
    }
    return null;
  }

  private getItemsCreatedInPeriod(days: number): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.getBoard().items.filter(i => new Date(i.createdAt) >= cutoff).length;
  }

  private getItemsCompletedInPeriod(days: number): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return this.getBoard().items.filter(i => 
      (i.status === 'Done' || i.status === 'Completed') &&
      new Date(i.updatedAt) >= cutoff
    ).length;
  }

  private getAverageCompletionTime(): number {
    const completedItems = this.getBoard().items.filter(i => i.status === 'Done' || i.status === 'Completed');
    if (completedItems.length === 0) return 0;

    const totalTime = completedItems.reduce((sum, item) => {
      return sum + (new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime());
    }, 0);

    return totalTime / completedItems.length / (1000 * 60 * 60 * 24); // Convert to days
  }

  private identifyBottlenecks(): Array<{ status: string; count: number; avgTime: number }> {
    const statusGroups = this.getBoard().items.reduce((groups, item) => {
      const status = item.status || 'No Status';
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(item);
      return groups;
    }, {} as Record<string, FlexiBoardItem[]>);

    return Object.entries(statusGroups).map(([status, items]) => ({
      status,
      count: items.length,
      avgTime: items.reduce((sum, item) => {
        return sum + (new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime());
      }, 0) / items.length / (1000 * 60 * 60 * 24)
    }));
  }

  private getUniqueColumnValues(columnId: string): number {
    const values = new Set();
    this.getBoard().items.forEach(item => {
      const value = item.data[columnId];
      if (value != null) {
        values.add(value);
      }
    });
    return values.size;
  }

  private getColumnValueDistribution(columnId: string): Record<string, number> {
    const distribution: Record<string, number> = {};
    this.getBoard().items.forEach(item => {
      const value = item.data[columnId];
      const key = value?.toString() || 'Empty';
      distribution[key] = (distribution[key] || 0) + 1;
    });
    return distribution;
  }

  // Export automation engine and column engine
  getAutomationEngine(): AutomationEngine {
    return this.automationEngine;
  }

  getColumnEngine(): AdvancedColumnEngine {
    return this.columnEngine;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}