import {
  FlexiBoard,
  FlexiBoardItem,
  FlexiBoardAutomation,
  AutomationCondition,
  AutomationAction,
  FlexiBoardActivity,
  FlexiBoardNotification
} from '../types/flexiboard';

export class AutomationEngine {
  private board: FlexiBoard;
  private onNotification?: (notification: FlexiBoardNotification) => void;
  private onActivity?: (activity: FlexiBoardActivity) => void;

  constructor(
    board: FlexiBoard,
    callbacks?: {
      onNotification?: (notification: FlexiBoardNotification) => void;
      onActivity?: (activity: FlexiBoardActivity) => void;
    }
  ) {
    this.board = board;
    this.onNotification = callbacks?.onNotification;
    this.onActivity = callbacks?.onActivity;
  }

  // Main automation execution
  async executeAutomations(trigger: {
    type: string;
    itemId?: string;
    column?: string;
    oldValue?: any;
    newValue?: any;
    userId: string;
  }): Promise<void> {
    if (!this.board.settings.enableAutomations || !this.board.automations) {
      return;
    }

    const relevantAutomations = this.board.automations.filter(automation => {
      return automation.enabled && this.matchesTrigger(automation, trigger);
    });

    for (const automation of relevantAutomations) {
      try {
        await this.executeAutomation(automation, trigger);
      } catch (error) {
        console.error(`Automation ${automation.id} failed:`, error);
        this.logActivity({
          type: 'automation-triggered',
          userId: trigger.userId,
          data: {
            automationId: automation.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          message: `Automation "${automation.name}" failed to execute`
        });
      }
    }
  }

  private matchesTrigger(automation: FlexiBoardAutomation, trigger: any): boolean {
    const { trigger: automationTrigger } = automation;
    
    switch (automationTrigger.type) {
      case 'when-status-changes':
        return trigger.type === 'item-updated' && 
               trigger.column === 'status' &&
               (!automationTrigger.value || trigger.newValue === automationTrigger.value);
               
      case 'when-column-changes':
        return trigger.type === 'item-updated' && 
               trigger.column === automationTrigger.column;
               
      case 'when-item-created':
        return trigger.type === 'item-created';
        
      case 'when-item-moved':
        return trigger.type === 'item-moved';
        
      case 'when-date-arrives':
        return trigger.type === 'date-reached';
        
      case 'every-time-period':
        return trigger.type === 'scheduled';
        
      default:
        return false;
    }
  }

  private async executeAutomation(automation: FlexiBoardAutomation, trigger: any): Promise<void> {
    // Check conditions
    if (automation.conditions && automation.conditions.length > 0) {
      const conditionsMet = await this.evaluateConditions(automation.conditions, trigger.itemId);
      if (!conditionsMet) {
        return;
      }
    }

    // Execute actions
    for (const action of automation.actions) {
      if (action.delay && action.delay > 0) {
        // Schedule delayed action (in a real implementation, you'd use a job queue)
        setTimeout(() => this.executeAction(action, trigger), action.delay * 60 * 1000);
      } else {
        await this.executeAction(action, trigger);
      }
    }

    // Update automation stats
    automation.lastRun = new Date();
    automation.runCount += 1;

    this.logActivity({
      type: 'automation-triggered',
      userId: trigger.userId,
      itemId: trigger.itemId,
      data: {
        automationId: automation.id,
        automationName: automation.name,
        actionsExecuted: automation.actions.length
      },
      message: `Automation "${automation.name}" executed ${automation.actions.length} actions`
    });
  }

  private async evaluateConditions(conditions: AutomationCondition[], itemId?: string): Promise<boolean> {
    if (!itemId) return true;
    
    const item = this.board.items.find(i => i.id === itemId);
    if (!item) return false;

    let result = true;
    let logicalOperator: 'and' | 'or' = 'and';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, item);
      
      if (condition.logicalOperator) {
        logicalOperator = condition.logicalOperator;
      }

      if (logicalOperator === 'and') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }
    }

    return result;
  }

  private evaluateCondition(condition: AutomationCondition, item: FlexiBoardItem): boolean {
    const value = item.data[condition.column];
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not-equals':
        return value !== condition.value;
      case 'contains':
        return value && value.toString().includes(condition.value);
      case 'not-contains':
        return !value || !value.toString().includes(condition.value);
      case 'greater':
        return value > condition.value;
      case 'less':
        return value < condition.value;
      case 'is-empty':
        return !value || value === '' || value === null || value === undefined;
      case 'is-not-empty':
        return value && value !== '' && value !== null && value !== undefined;
      default:
        return false;
    }
  }

  private async executeAction(action: AutomationAction, trigger: any): Promise<void> {
    const item = trigger.itemId ? this.board.items.find(i => i.id === trigger.itemId) : null;
    
    switch (action.type) {
      case 'change-status':
        if (item && action.targetColumn && action.value) {
          item.data[action.targetColumn] = action.value;
          item.updatedAt = new Date();
        }
        break;
        
      case 'assign-person':
        if (item && action.value) {
          item.assignees = Array.isArray(action.value) ? action.value : [action.value];
          item.updatedAt = new Date();
        }
        break;
        
      case 'change-column-value':
        if (item && action.targetColumn && action.value !== undefined) {
          item.data[action.targetColumn] = action.value;
          item.updatedAt = new Date();
        }
        break;
        
      case 'send-notification':
        if (action.recipients && action.message) {
          for (const recipient of action.recipients) {
            this.sendNotification({
              userId: recipient,
              boardId: this.board.id,
              itemId: trigger.itemId,
              type: 'automation',
              title: 'Automation Notification',
              message: action.message
            });
          }
        }
        break;
        
      case 'create-item':
        if (action.value) {
          const newItem: FlexiBoardItem = {
            id: this.generateId(),
            boardId: this.board.id,
            data: typeof action.value === 'object' ? action.value : {},
            status: 'Not Started',
            priority: 'medium',
            assignees: [],
            tags: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: trigger.userId,
            position: this.board.items.length
          };
          this.board.items.push(newItem);
        }
        break;
        
      case 'duplicate-item':
        if (item) {
          const duplicatedItem: FlexiBoardItem = {
            ...item,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            position: this.board.items.length
          };
          this.board.items.push(duplicatedItem);
        }
        break;
        
      case 'archive-item':
        if (item) {
          // In a real implementation, you might move to an archived state
          this.board.items = this.board.items.filter(i => i.id !== item.id);
        }
        break;
        
      case 'move-to-group':
        if (item && action.value && this.board.groups) {
          // Implementation would depend on how groups are structured
          item.data['groupId'] = action.value;
          item.updatedAt = new Date();
        }
        break;
        
      default:
        console.warn(`Unsupported automation action: ${action.type}`);
    }
  }

  // Formula evaluation engine
  evaluateFormula(expression: string, itemData: Record<string, any>, boardData: FlexiBoard): any {
    try {
      // Simple formula parser - in production, you'd use a more robust parser
      const cleanExpression = expression.replace(/\{([^}]+)\}/g, (match, columnName) => {
        const column = boardData.columns.find(c => c.title === columnName || c.id === columnName);
        if (column) {
          const value = itemData[column.id];
          return typeof value === 'string' ? `"${value}"` : (value ?? 0);
        }
        return '0';
      });

      // Basic math operations
      if (cleanExpression.includes('+') || cleanExpression.includes('-') || 
          cleanExpression.includes('*') || cleanExpression.includes('/')) {
        return this.evaluateMathExpression(cleanExpression);
      }

      // String operations
      if (cleanExpression.includes('CONCATENATE') || cleanExpression.includes('UPPER') || 
          cleanExpression.includes('LOWER')) {
        return this.evaluateStringExpression(cleanExpression);
      }

      // Date operations
      if (cleanExpression.includes('TODAY') || cleanExpression.includes('DATEADD')) {
        return this.evaluateDateExpression(cleanExpression);
      }

      return cleanExpression;
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR';
    }
  }

  private evaluateMathExpression(expression: string): number {
    // Simple math evaluator - in production use a proper math parser
    try {
      return Function(`"use strict"; return (${expression})`)();
    } catch {
      return 0;
    }
  }

  private evaluateStringExpression(expression: string): string {
    // Basic string operations
    if (expression.includes('CONCATENATE')) {
      const matches = expression.match(/CONCATENATE\((.*)\)/);
      if (matches) {
        return matches[1].split(',').map(s => s.trim().replace(/"/g, '')).join('');
      }
    }
    return expression;
  }

  private evaluateDateExpression(expression: string): Date {
    if (expression.includes('TODAY()')) {
      return new Date();
    }
    return new Date();
  }

  // Utility methods
  private sendNotification(notification: Omit<FlexiBoardNotification, 'id' | 'read' | 'createdAt'>): void {
    const fullNotification: FlexiBoardNotification = {
      ...notification,
      id: this.generateId(),
      read: false,
      createdAt: new Date()
    };
    
    if (this.onNotification) {
      this.onNotification(fullNotification);
    }
  }

  private logActivity(activity: Omit<FlexiBoardActivity, 'id' | 'boardId' | 'userName' | 'userAvatar' | 'timestamp'>): void {
    const fullActivity: FlexiBoardActivity = {
      ...activity,
      id: this.generateId(),
      boardId: this.board.id,
      userName: 'System', // In practice, get from user service
      userAvatar: '',
      timestamp: new Date()
    };
    
    if (this.onActivity) {
      this.onActivity(fullActivity);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public API methods
  addAutomation(automation: Omit<FlexiBoardAutomation, 'id' | 'createdAt' | 'runCount'>): FlexiBoardAutomation {
    const newAutomation: FlexiBoardAutomation = {
      ...automation,
      id: this.generateId(),
      createdAt: new Date(),
      runCount: 0
    };

    if (!this.board.automations) {
      this.board.automations = [];
    }

    this.board.automations.push(newAutomation);
    return newAutomation;
  }

  updateAutomation(automationId: string, updates: Partial<FlexiBoardAutomation>): boolean {
    if (!this.board.automations) return false;
    
    const index = this.board.automations.findIndex(a => a.id === automationId);
    if (index === -1) return false;

    this.board.automations[index] = { ...this.board.automations[index], ...updates };
    return true;
  }

  deleteAutomation(automationId: string): boolean {
    if (!this.board.automations) return false;
    
    const initialLength = this.board.automations.length;
    this.board.automations = this.board.automations.filter(a => a.id !== automationId);
    return this.board.automations.length < initialLength;
  }

  getAutomations(): FlexiBoardAutomation[] {
    return this.board.automations || [];
  }

  testAutomation(automationId: string, testData: any): Promise<boolean> {
    const automation = this.board.automations?.find(a => a.id === automationId);
    if (!automation) return Promise.resolve(false);

    // Simulate automation execution without side effects
    return Promise.resolve(true);
  }
}