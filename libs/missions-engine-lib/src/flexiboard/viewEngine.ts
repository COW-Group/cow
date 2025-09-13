import { 
  FlexiBoard, 
  FlexiBoardItem, 
  FlexiBoardView, 
  FlexiBoardViewType,
  FlexiBoardGroup 
} from '../types/flexiboard';

export interface ViewConfiguration {
  groupBy?: string;
  colorCoding?: string;
  showSubItems?: boolean;
  itemsPerPage?: number;
  timeRange?: { start: Date; end: Date };
}

export interface KanbanColumn {
  id: string;
  title: string;
  items: FlexiBoardItem[];
  color?: string;
  limit?: number;
}

export interface TableRow {
  id: string;
  cells: Record<string, any>;
  item: FlexiBoardItem;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  item: FlexiBoardItem;
  color?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  item: FlexiBoardItem;
  dependencies?: string[];
  progress?: number;
}

export class ViewEngine {
  private board: FlexiBoard;

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  // Kanban View
  generateKanbanView(view: FlexiBoardView, config?: ViewConfiguration): KanbanColumn[] {
    const groupByColumn = config?.groupBy || view.groupBy || 'status';
    const column = this.board.columns.find(c => c.id === groupByColumn);
    
    if (!column) {
      throw new Error(`Column "${groupByColumn}" not found for grouping`);
    }

    // Get unique values for grouping
    const groups = this.getUniqueColumnValues(groupByColumn);
    
    return groups.map(groupValue => {
      const items = this.board.items.filter(item => 
        item.data[groupByColumn] === groupValue
      );
      
      return {
        id: `${groupByColumn}-${groupValue}`,
        title: groupValue || 'No Status',
        items: this.applySorting(items, view.sorts),
        color: this.getGroupColor(groupValue),
        limit: this.getColumnLimit(groupValue),
      };
    });
  }

  // Table View
  generateTableView(view: FlexiBoardView, config?: ViewConfiguration): {
    headers: { id: string; title: string; type: string }[];
    rows: TableRow[];
  } {
    const visibleColumns = view.visibleColumns || this.board.columns.map(c => c.id);
    const headers = this.board.columns
      .filter(c => visibleColumns.includes(c.id))
      .map(c => ({
        id: c.id,
        title: c.title,
        type: c.type,
      }));

    const filteredItems = this.applyFilters(this.board.items, view.filters);
    const sortedItems = this.applySorting(filteredItems, view.sorts);

    const rows = sortedItems.map(item => ({
      id: item.id,
      cells: this.buildTableCells(item, visibleColumns),
      item,
    }));

    return { headers, rows };
  }

  // Calendar View
  generateCalendarView(view: FlexiBoardView, config?: ViewConfiguration): CalendarEvent[] {
    const dateColumns = this.board.columns.filter(c => c.type === 'date');
    
    if (dateColumns.length === 0) {
      throw new Error('No date columns found for calendar view');
    }

    const primaryDateColumn = dateColumns[0]; // Use first date column as primary
    const endDateColumn = dateColumns[1]; // Use second date column as end date if available

    const filteredItems = this.applyFilters(this.board.items, view.filters);
    
    return filteredItems
      .filter(item => item.data[primaryDateColumn.id])
      .map(item => ({
        id: item.id,
        title: this.getItemTitle(item),
        start: new Date(item.data[primaryDateColumn.id]),
        end: endDateColumn ? new Date(item.data[endDateColumn.id]) : undefined,
        item,
        color: this.getItemColor(item),
      }));
  }

  // Timeline View
  generateTimelineView(view: FlexiBoardView, config?: ViewConfiguration): TimelineEvent[] {
    const dateColumns = this.board.columns.filter(c => c.type === 'date');
    
    if (dateColumns.length < 2) {
      throw new Error('Timeline view requires at least 2 date columns (start and end)');
    }

    const startDateColumn = dateColumns[0];
    const endDateColumn = dateColumns[1];

    const filteredItems = this.applyFilters(this.board.items, view.filters);
    
    return filteredItems
      .filter(item => 
        item.data[startDateColumn.id] && item.data[endDateColumn.id]
      )
      .map(item => ({
        id: item.id,
        title: this.getItemTitle(item),
        start: new Date(item.data[startDateColumn.id]),
        end: new Date(item.data[endDateColumn.id]),
        item,
        dependencies: this.getItemDependencies(item),
        progress: this.getItemProgress(item),
      }));
  }

  // Dashboard View
  generateDashboardView(view: FlexiBoardView, config?: ViewConfiguration): {
    summary: Record<string, any>;
    charts: Array<{
      type: 'pie' | 'bar' | 'line' | 'progress';
      title: string;
      data: any[];
    }>;
    recentItems: FlexiBoardItem[];
  } {
    const filteredItems = this.applyFilters(this.board.items, view.filters);
    
    return {
      summary: this.generateSummaryStats(filteredItems),
      charts: this.generateCharts(filteredItems),
      recentItems: filteredItems
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10),
    };
  }

  // View Switching
  switchView(viewType: FlexiBoardViewType, customConfig?: ViewConfiguration): any {
    const view = this.board.views.find(v => v.type === viewType) || this.board.views[0];
    
    switch (viewType) {
      case 'kanban':
        return this.generateKanbanView(view, customConfig);
      case 'table':
        return this.generateTableView(view, customConfig);
      case 'calendar':
        return this.generateCalendarView(view, customConfig);
      case 'timeline':
        return this.generateTimelineView(view, customConfig);
      case 'dashboard':
        return this.generateDashboardView(view, customConfig);
      default:
        throw new Error(`Unsupported view type: ${viewType}`);
    }
  }

  // Helper methods
  private getUniqueColumnValues(columnId: string): string[] {
    const values = this.board.items.map(item => item.data[columnId]);
    return [...new Set(values)].filter(Boolean);
  }

  private getGroupColor(groupValue: string): string {
    const colorMap: Record<string, string> = {
      'todo': '#94a3b8',
      'in-progress': '#3b82f6',
      'in-review': '#f59e0b',
      'done': '#10b981',
      'blocked': '#ef4444',
      'cancelled': '#6b7280',
    };
    
    return colorMap[groupValue.toLowerCase()] || '#94a3b8';
  }

  private getColumnLimit(groupValue: string): number | undefined {
    // WIP limits for different statuses
    const limitMap: Record<string, number> = {
      'in-progress': 5,
      'in-review': 3,
    };
    
    return limitMap[groupValue.toLowerCase()];
  }

  private buildTableCells(item: FlexiBoardItem, visibleColumns: string[]): Record<string, any> {
    const cells: Record<string, any> = {};
    
    visibleColumns.forEach(columnId => {
      cells[columnId] = item.data[columnId] || '';
    });
    
    return cells;
  }

  private getItemTitle(item: FlexiBoardItem): string {
    // Try to find a title/name column, otherwise use the first text column
    const titleColumn = this.board.columns.find(c => 
      c.type === 'text' && (
        c.title.toLowerCase().includes('title') || 
        c.title.toLowerCase().includes('name')
      )
    ) || this.board.columns.find(c => c.type === 'text');
    
    return titleColumn ? (item.data[titleColumn.id] || `Item ${item.id}`) : `Item ${item.id}`;
  }

  private getItemColor(item: FlexiBoardItem): string {
    if (item.priority) {
      const priorityColors: Record<string, string> = {
        'low': '#94a3b8',
        'medium': '#3b82f6',
        'high': '#f59e0b',
        'urgent': '#ef4444',
      };
      return priorityColors[item.priority];
    }
    
    return '#3b82f6';
  }

  private getItemDependencies(item: FlexiBoardItem): string[] {
    // Look for dependency column or use parentId
    const dependencyColumn = this.board.columns.find(c => 
      c.title.toLowerCase().includes('depend')
    );
    
    if (dependencyColumn && item.data[dependencyColumn.id]) {
      return Array.isArray(item.data[dependencyColumn.id]) 
        ? item.data[dependencyColumn.id] 
        : [item.data[dependencyColumn.id]];
    }
    
    return item.parentId ? [item.parentId] : [];
  }

  private getItemProgress(item: FlexiBoardItem): number {
    const progressColumn = this.board.columns.find(c => c.type === 'progress');
    return progressColumn ? (item.data[progressColumn.id] || 0) : 0;
  }

  private generateSummaryStats(items: FlexiBoardItem[]): Record<string, any> {
    const total = items.length;
    const completed = items.filter(item => 
      item.status === 'completed' || item.status === 'done'
    ).length;
    
    const overdue = items.filter(item => {
      const dueDateColumn = this.board.columns.find(c => 
        c.type === 'date' && c.title.toLowerCase().includes('due')
      );
      if (dueDateColumn && item.data[dueDateColumn.id]) {
        return new Date(item.data[dueDateColumn.id]) < new Date();
      }
      return false;
    }).length;
    
    return {
      total,
      completed,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  private generateCharts(items: FlexiBoardItem[]): Array<{
    type: 'pie' | 'bar' | 'line' | 'progress';
    title: string;
    data: any[];
  }> {
    const charts = [];
    
    // Status distribution
    const statusCounts = items.reduce((acc, item) => {
      const status = item.status || 'No Status';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    charts.push({
      type: 'pie' as const,
      title: 'Status Distribution',
      data: Object.entries(statusCounts).map(([status, count]) => ({
        label: status,
        value: count,
      })),
    });
    
    // Priority distribution
    const priorityCounts = items.reduce((acc, item) => {
      const priority = item.priority || 'No Priority';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    charts.push({
      type: 'bar' as const,
      title: 'Priority Distribution',
      data: Object.entries(priorityCounts).map(([priority, count]) => ({
        label: priority,
        value: count,
      })),
    });
    
    return charts;
  }

  private applyFilters(items: FlexiBoardItem[], filters: any[]): FlexiBoardItem[] {
    // Reuse filter logic from BoardEngine
    return items; // Simplified for now
  }

  private applySorting(items: FlexiBoardItem[], sorts: any[]): FlexiBoardItem[] {
    // Reuse sorting logic from BoardEngine
    return items; // Simplified for now
  }
}