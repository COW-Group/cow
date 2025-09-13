import { 
  FlexiBoard, 
  FlexiBoardItem, 
  FlexiBoardColumn, 
  FlexiBoardView, 
  FlexiBoardFilter,
  FlexiBoardSort,
  ColumnType 
} from '../types/flexiboard';

export class FlexiBoardEngine {
  private board: FlexiBoard;

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  // Board Management
  getBoard(): FlexiBoard {
    return this.board;
  }

  updateBoard(updates: Partial<FlexiBoard>): FlexiBoard {
    this.board = { ...this.board, ...updates, updatedAt: new Date() };
    return this.board;
  }

  // Column Management
  addColumn(column: Omit<FlexiBoardColumn, 'id'>): FlexiBoardColumn {
    const newColumn: FlexiBoardColumn = {
      ...column,
      id: this.generateId(),
    };
    
    this.board.columns.push(newColumn);
    this.board.updatedAt = new Date();
    
    return newColumn;
  }

  updateColumn(columnId: string, updates: Partial<FlexiBoardColumn>): FlexiBoardColumn | null {
    const columnIndex = this.board.columns.findIndex(c => c.id === columnId);
    if (columnIndex === -1) return null;

    this.board.columns[columnIndex] = { ...this.board.columns[columnIndex], ...updates };
    this.board.updatedAt = new Date();
    
    return this.board.columns[columnIndex];
  }

  removeColumn(columnId: string): boolean {
    const initialLength = this.board.columns.length;
    this.board.columns = this.board.columns.filter(c => c.id !== columnId);
    
    if (this.board.columns.length < initialLength) {
      // Also remove column data from all items
      this.board.items.forEach(item => {
        delete item.data[columnId];
      });
      this.board.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  reorderColumns(columnIds: string[]): void {
    const columnMap = new Map(this.board.columns.map(c => [c.id, c]));
    this.board.columns = columnIds.map(id => columnMap.get(id)!).filter(Boolean);
    this.board.updatedAt = new Date();
  }

  // Item Management
  addItem(itemData: Omit<FlexiBoardItem, 'id' | 'createdAt' | 'updatedAt' | 'position'>): FlexiBoardItem {
    const newItem: FlexiBoardItem = {
      ...itemData,
      id: this.generateId(),
      position: this.board.items.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.board.items.push(newItem);
    this.board.updatedAt = new Date();
    
    return newItem;
  }

  updateItem(itemId: string, updates: Partial<FlexiBoardItem>): FlexiBoardItem | null {
    const itemIndex = this.board.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return null;

    this.board.items[itemIndex] = { 
      ...this.board.items[itemIndex], 
      ...updates, 
      updatedAt: new Date() 
    };
    this.board.updatedAt = new Date();
    
    return this.board.items[itemIndex];
  }

  removeItem(itemId: string): boolean {
    const initialLength = this.board.items.length;
    this.board.items = this.board.items.filter(i => i.id !== itemId);
    
    if (this.board.items.length < initialLength) {
      this.board.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  moveItem(itemId: string, newPosition: number, targetGroupId?: string): boolean {
    const item = this.board.items.find(i => i.id === itemId);
    if (!item) return false;

    // Remove from current position
    this.board.items = this.board.items.filter(i => i.id !== itemId);
    
    // Update item position and group if specified
    item.position = newPosition;
    if (targetGroupId && this.board.groups) {
      // Update item's group association logic here
    }
    
    // Insert at new position
    this.board.items.splice(newPosition, 0, item);
    
    // Update positions of other items
    this.board.items.forEach((item, index) => {
      item.position = index;
    });
    
    this.board.updatedAt = new Date();
    return true;
  }

  // Data Querying
  getItems(filters?: FlexiBoardFilter[], sorts?: FlexiBoardSort[]): FlexiBoardItem[] {
    let items = [...this.board.items];
    
    // Apply filters
    if (filters && filters.length > 0) {
      items = this.applyFilters(items, filters);
    }
    
    // Apply sorting
    if (sorts && sorts.length > 0) {
      items = this.applySorting(items, sorts);
    }
    
    return items;
  }

  getItemsByColumn(columnId: string, value: any): FlexiBoardItem[] {
    return this.board.items.filter(item => item.data[columnId] === value);
  }

  searchItems(query: string): FlexiBoardItem[] {
    const searchQuery = query.toLowerCase();
    return this.board.items.filter(item => {
      // Search in all text columns
      return this.board.columns.some(column => {
        if (column.type === 'text') {
          const value = item.data[column.id];
          return value && value.toString().toLowerCase().includes(searchQuery);
        }
        return false;
      });
    });
  }

  // View Management
  getActiveView(): FlexiBoardView | null {
    return this.board.views.find(v => v.id === this.board.activeViewId) || null;
  }

  setActiveView(viewId: string): boolean {
    const view = this.board.views.find(v => v.id === viewId);
    if (!view) return false;
    
    this.board.activeViewId = viewId;
    this.board.updatedAt = new Date();
    return true;
  }

  addView(view: Omit<FlexiBoardView, 'id'>): FlexiBoardView {
    const newView: FlexiBoardView = {
      ...view,
      id: this.generateId(),
    };
    
    this.board.views.push(newView);
    this.board.updatedAt = new Date();
    
    return newView;
  }

  updateView(viewId: string, updates: Partial<FlexiBoardView>): FlexiBoardView | null {
    const viewIndex = this.board.views.findIndex(v => v.id === viewId);
    if (viewIndex === -1) return null;

    this.board.views[viewIndex] = { ...this.board.views[viewIndex], ...updates };
    this.board.updatedAt = new Date();
    
    return this.board.views[viewIndex];
  }

  removeView(viewId: string): boolean {
    if (this.board.views.length <= 1) return false; // Keep at least one view
    
    const initialLength = this.board.views.length;
    this.board.views = this.board.views.filter(v => v.id !== viewId);
    
    if (this.board.views.length < initialLength) {
      // If we removed the active view, set a new active view
      if (this.board.activeViewId === viewId) {
        this.board.activeViewId = this.board.views[0].id;
      }
      this.board.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  // Statistics and Analytics
  getStatistics() {
    const totalItems = this.board.items.length;
    const completedItems = this.board.items.filter(item => 
      item.status === 'completed' || item.status === 'done'
    ).length;
    
    const statusCounts = this.board.items.reduce((acc, item) => {
      const status = item.status || 'no-status';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityCounts = this.board.items.reduce((acc, item) => {
      const priority = item.priority || 'no-priority';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalItems,
      completedItems,
      completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
      statusCounts,
      priorityCounts,
      lastUpdated: this.board.updatedAt,
    };
  }

  // Private helper methods
  private applyFilters(items: FlexiBoardItem[], filters: FlexiBoardFilter[]): FlexiBoardItem[] {
    return items.filter(item => {
      return filters.every(filter => {
        const value = item.data[filter.column];
        
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return value && value.toString().toLowerCase().includes(filter.value.toLowerCase());
          case 'greater':
            return value > filter.value;
          case 'less':
            return value < filter.value;
          case 'between':
            return value >= filter.value[0] && value <= filter.value[1];
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          case 'empty':
            return !value || value === '' || value === null || value === undefined;
          default:
            return true;
        }
      });
    });
  }

  private applySorting(items: FlexiBoardItem[], sorts: FlexiBoardSort[]): FlexiBoardItem[] {
    return items.sort((a, b) => {
      for (const sort of sorts) {
        const aValue = a.data[sort.column];
        const bValue = b.data[sort.column];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        else if (aValue > bValue) comparison = 1;
        
        if (sort.direction === 'desc') comparison *= -1;
        
        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}