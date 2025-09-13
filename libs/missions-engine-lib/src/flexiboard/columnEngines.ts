import {
  FlexiBoard,
  FlexiBoardItem,
  FlexiBoardColumn,
  ColumnFormula,
  ColumnLookup,
  ColumnConnectBoards
} from '../types/flexiboard';

// Formula Column Engine
export class FormulaEngine {
  private board: FlexiBoard;
  private connectedBoards: Map<string, FlexiBoard> = new Map();

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  addConnectedBoard(boardId: string, board: FlexiBoard): void {
    this.connectedBoards.set(boardId, board);
  }

  evaluateFormula(column: FlexiBoardColumn, item: FlexiBoardItem): any {
    if (!column.formula) return null;

    const { expression, dependencies, resultType } = column.formula;
    
    try {
      const context = this.buildFormulaContext(item, dependencies);
      const result = this.executeFormula(expression, context);
      
      return this.castResult(result, resultType);
    } catch (error) {
      console.error(`Formula error in column ${column.id}:`, error);
      return '#ERROR';
    }
  }

  private buildFormulaContext(item: FlexiBoardItem, dependencies: string[]): Record<string, any> {
    const context: Record<string, any> = {};
    
    // Add current item data
    dependencies.forEach(dep => {
      const column = this.board.columns.find(c => c.id === dep || c.title === dep);
      if (column) {
        context[column.title] = item.data[column.id];
        context[column.id] = item.data[column.id];
      }
    });

    // Add built-in functions
    context.SUM = (...values: number[]) => values.reduce((a, b) => (a || 0) + (b || 0), 0);
    context.AVG = (...values: number[]) => {
      const nums = values.filter(v => typeof v === 'number');
      return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    };
    context.COUNT = (...values: any[]) => values.filter(v => v != null).length;
    context.MIN = (...values: number[]) => Math.min(...values.filter(v => typeof v === 'number'));
    context.MAX = (...values: number[]) => Math.max(...values.filter(v => typeof v === 'number'));
    context.IF = (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue;
    context.AND = (...conditions: boolean[]) => conditions.every(c => c);
    context.OR = (...conditions: boolean[]) => conditions.some(c => c);
    context.NOT = (condition: boolean) => !condition;
    context.TODAY = () => new Date();
    context.NOW = () => new Date();
    context.CONCATENATE = (...values: any[]) => values.map(v => v?.toString() || '').join('');
    context.UPPER = (text: string) => text?.toString().toUpperCase() || '';
    context.LOWER = (text: string) => text?.toString().toLowerCase() || '';
    context.LEN = (text: string) => text?.toString().length || 0;
    
    return context;
  }

  private executeFormula(expression: string, context: Record<string, any>): any {
    // Create a safe evaluation context
    const safeContext = { ...context };
    
    // Replace column references with actual values
    const processedExpression = expression.replace(/{([^}]+)}/g, (match, columnName) => {
      const value = safeContext[columnName];
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`;
      }
      return value != null ? value : 0;
    });

    // Use Function constructor for safe evaluation
    const keys = Object.keys(safeContext);
    const values = keys.map(key => safeContext[key]);
    
    try {
      const func = new Function(...keys, `return ${processedExpression}`);
      return func(...values);
    } catch (error) {
      throw new Error(`Formula execution failed: ${error}`);
    }
  }

  private castResult(value: any, targetType: string): any {
    switch (targetType) {
      case 'number':
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      case 'text':
        return value?.toString() || '';
      case 'date':
        return value instanceof Date ? value : new Date(value);
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }
}

// Lookup Column Engine
export class LookupEngine {
  private board: FlexiBoard;
  private connectedBoards: Map<string, FlexiBoard> = new Map();

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  addConnectedBoard(boardId: string, board: FlexiBoard): void {
    this.connectedBoards.set(boardId, board);
  }

  evaluateLookup(column: FlexiBoardColumn, item: FlexiBoardItem): any {
    if (!column.lookup) return null;

    const { sourceBoard, sourceColumn, linkColumn, displayColumn } = column.lookup;
    
    try {
      const sourceBoardData = this.connectedBoards.get(sourceBoard);
      if (!sourceBoardData) {
        throw new Error(`Source board ${sourceBoard} not found`);
      }

      const linkValue = item.data[linkColumn];
      if (linkValue == null) return null;

      // Find matching item in source board
      const sourceItem = sourceBoardData.items.find(sourceItem => 
        sourceItem.data[sourceColumn] === linkValue ||
        sourceItem.id === linkValue
      );

      if (!sourceItem) return null;

      // Return the display column value or the entire item data
      if (displayColumn) {
        return sourceItem.data[displayColumn];
      }

      return sourceItem.data;
    } catch (error) {
      console.error(`Lookup error in column ${column.id}:`, error);
      return '#ERROR';
    }
  }

  // Get all possible lookup values for dropdown
  getLookupOptions(column: FlexiBoardColumn): Array<{ label: string; value: any }> {
    if (!column.lookup) return [];

    const { sourceBoard, sourceColumn, displayColumn } = column.lookup;
    const sourceBoardData = this.connectedBoards.get(sourceBoard);
    
    if (!sourceBoardData) return [];

    return sourceBoardData.items.map(item => ({
      label: displayColumn ? item.data[displayColumn] : item.data[sourceColumn],
      value: item.data[sourceColumn] || item.id
    }));
  }
}

// Connect Boards Engine
export class ConnectBoardsEngine {
  private board: FlexiBoard;
  private connectedBoards: Map<string, FlexiBoard> = new Map();

  constructor(board: FlexiBoard) {
    this.board = board;
  }

  addConnectedBoard(boardId: string, board: FlexiBoard): void {
    this.connectedBoards.set(boardId, board);
  }

  getConnectedItems(column: FlexiBoardColumn, item: FlexiBoardItem): FlexiBoardItem[] {
    if (!column.connectBoards) return [];

    const { linkedBoard, linkType } = column.connectBoards;
    const linkedBoardData = this.connectedBoards.get(linkedBoard);
    
    if (!linkedBoardData) return [];

    const connectionIds = item.data[column.id];
    if (!connectionIds) return [];

    const ids = Array.isArray(connectionIds) ? connectionIds : [connectionIds];
    
    return linkedBoardData.items.filter(linkedItem => 
      ids.includes(linkedItem.id)
    );
  }

  getMirroredValues(column: FlexiBoardColumn, item: FlexiBoardItem): Record<string, any[]> {
    if (!column.connectBoards?.mirrorColumns) return {};

    const connectedItems = this.getConnectedItems(column, item);
    const mirroredData: Record<string, any[]> = {};

    column.connectBoards.mirrorColumns.forEach(mirrorColumn => {
      mirroredData[mirrorColumn] = connectedItems.map(connectedItem => 
        connectedItem.data[mirrorColumn]
      ).filter(value => value != null);
    });

    return mirroredData;
  }

  addConnection(column: FlexiBoardColumn, item: FlexiBoardItem, targetItemId: string): boolean {
    if (!column.connectBoards) return false;

    const currentConnections = item.data[column.id] || [];
    const connections = Array.isArray(currentConnections) ? currentConnections : [currentConnections];
    
    if (connections.includes(targetItemId)) {
      return false; // Already connected
    }

    if (column.connectBoards.linkType === 'one-to-many') {
      item.data[column.id] = [targetItemId];
    } else {
      connections.push(targetItemId);
      item.data[column.id] = connections;
    }

    item.updatedAt = new Date();
    return true;
  }

  removeConnection(column: FlexiBoardColumn, item: FlexiBoardItem, targetItemId: string): boolean {
    if (!column.connectBoards) return false;

    const currentConnections = item.data[column.id] || [];
    const connections = Array.isArray(currentConnections) ? currentConnections : [currentConnections];
    
    const newConnections = connections.filter(id => id !== targetItemId);
    item.data[column.id] = newConnections.length > 0 ? newConnections : null;
    item.updatedAt = new Date();
    
    return newConnections.length < connections.length;
  }
}

// Progress Column Engine
export class ProgressEngine {
  calculateProgress(column: FlexiBoardColumn, item: FlexiBoardItem, board: FlexiBoard): number {
    // Auto-calculate based on sub-items or connected items
    if (column.settings?.autoCalculate) {
      return this.calculateAutoProgress(item, board);
    }

    // Manual progress value
    const progress = item.data[column.id];
    return typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : 0;
  }

  private calculateAutoProgress(item: FlexiBoardItem, board: FlexiBoard): number {
    // Calculate based on sub-items (items with this item as parent)
    const subItems = board.items.filter(subItem => subItem.parentId === item.id);
    
    if (subItems.length === 0) return 0;

    const completedSubItems = subItems.filter(subItem => 
      subItem.status === 'Done' || subItem.status === 'Completed'
    );

    return Math.round((completedSubItems.length / subItems.length) * 100);
  }
}

// Timeline Column Engine
export class TimelineEngine {
  calculateTimelineData(column: FlexiBoardColumn, item: FlexiBoardItem): {
    start: Date | null;
    end: Date | null;
    duration: number;
    progress: number;
  } {
    const timelineData = item.data[column.id];
    
    if (!timelineData || typeof timelineData !== 'object') {
      return { start: null, end: null, duration: 0, progress: 0 };
    }

    const start = timelineData.start ? new Date(timelineData.start) : null;
    const end = timelineData.end ? new Date(timelineData.end) : null;
    
    const duration = start && end ? end.getTime() - start.getTime() : 0;
    const progress = this.calculateTimelineProgress(start, end);

    return { start, end, duration, progress };
  }

  private calculateTimelineProgress(start: Date | null, end: Date | null): number {
    if (!start || !end) return 0;

    const now = new Date();
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();

    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;

    return Math.round((elapsed / total) * 100);
  }

  updateTimeline(column: FlexiBoardColumn, item: FlexiBoardItem, updates: {
    start?: Date;
    end?: Date;
    duration?: number;
  }): void {
    const currentData = item.data[column.id] || {};
    
    item.data[column.id] = {
      ...currentData,
      start: updates.start?.toISOString() || currentData.start,
      end: updates.end?.toISOString() || currentData.end
    };

    item.updatedAt = new Date();
  }
}

// Combined Column Engine
export class AdvancedColumnEngine {
  private formulaEngine: FormulaEngine;
  private lookupEngine: LookupEngine;
  private connectBoardsEngine: ConnectBoardsEngine;
  private progressEngine: ProgressEngine;
  private timelineEngine: TimelineEngine;

  constructor(board: FlexiBoard) {
    this.formulaEngine = new FormulaEngine(board);
    this.lookupEngine = new LookupEngine(board);
    this.connectBoardsEngine = new ConnectBoardsEngine(board);
    this.progressEngine = new ProgressEngine();
    this.timelineEngine = new TimelineEngine();
  }

  addConnectedBoard(boardId: string, board: FlexiBoard): void {
    this.formulaEngine.addConnectedBoard(boardId, board);
    this.lookupEngine.addConnectedBoard(boardId, board);
    this.connectBoardsEngine.addConnectedBoard(boardId, board);
  }

  evaluateColumn(column: FlexiBoardColumn, item: FlexiBoardItem, board: FlexiBoard): any {
    switch (column.type) {
      case 'formula':
        return this.formulaEngine.evaluateFormula(column, item);
      case 'lookup':
        return this.lookupEngine.evaluateLookup(column, item);
      case 'progress':
        return this.progressEngine.calculateProgress(column, item, board);
      case 'timeline':
        return this.timelineEngine.calculateTimelineData(column, item);
      case 'connect-boards':
        return this.connectBoardsEngine.getConnectedItems(column, item);
      case 'mirror':
        return this.connectBoardsEngine.getMirroredValues(column, item);
      default:
        return item.data[column.id];
    }
  }

  getColumnEngine(columnType: string) {
    switch (columnType) {
      case 'formula':
        return this.formulaEngine;
      case 'lookup':
        return this.lookupEngine;
      case 'connect-boards':
        return this.connectBoardsEngine;
      case 'progress':
        return this.progressEngine;
      case 'timeline':
        return this.timelineEngine;
      default:
        return null;
    }
  }
}