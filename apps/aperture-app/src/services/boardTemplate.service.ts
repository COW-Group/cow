import { 
  COWBoard, 
  COWBoardGroup, 
  COWBoardTask,
  ManagementType,
  PrivacyType,
  PersonAssignment,
  ComponentType,
  BoardLabel,
  getDefaultLabels
} from '../types/board.types';
import { 
  FlexiBoard, 
  FlexiBoardColumn, 
  FlexiBoardView, 
  FlexiBoardItem,
  FlexiBoardGroup,
  ColumnType,
  BoardTemplate
} from '../../../../libs/missions-engine-lib/src/index';

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Management type templates
interface ManagementTypeTemplate {
  managementType: ManagementType;
  defaultColumns: Omit<FlexiBoardColumn, 'id'>[];
  defaultGroups: Omit<FlexiBoardGroup, 'id' | 'items'>[];
  sampleItems?: Omit<FlexiBoardItem, 'id' | 'boardId' | 'createdAt' | 'updatedAt' | 'position'>[];
  defaultViews?: Omit<FlexiBoardView, 'id'>[];
}

const MANAGEMENT_TEMPLATES: Record<ManagementType, ManagementTypeTemplate> = {
  items: {
    managementType: 'items',
    defaultColumns: [
      { title: 'Item', type: 'text' as ColumnType, width: 250, required: true },
      { title: 'Status', type: 'status' as ColumnType, width: 130, 
        options: [
          { label: 'Not Started', value: 'not-started', color: '#c4c4c4' },
          { label: 'Working on it', value: 'working', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ]
      },
      { title: 'Priority', type: 'priority' as ColumnType, width: 110 },
      { title: 'Person', type: 'person' as ColumnType, width: 140 },
      { title: 'Due Date', type: 'date' as ColumnType, width: 130 }
    ],
    defaultGroups: [
      { title: 'New Items', color: '#579bfc', collapsed: false },
      { title: 'In Progress', color: '#fdab3d', collapsed: false },
      { title: 'Completed', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Item': 'Item #1' }, status: 'not-started', priority: 'medium', createdBy: 'system' },
      { data: { 'Item': 'Item #2' }, status: 'working', priority: 'high', createdBy: 'system' }
    ]
  },
  
  campaigns: {
    managementType: 'campaigns',
    defaultGroups: [
      { title: 'Planning', color: '#579bfc' },
      { title: 'In Progress', color: '#fdab3d' },
      { title: 'Review', color: '#ff9f40' },
      { title: 'Completed', color: '#00c875' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'date-picker', 'progress-picker'],
    sampleTasks: [
      { title: 'Q1 Marketing Campaign', status: 'Working on it', priority: 'High' },
      { title: 'Social Media Campaign', status: 'Not Started', priority: 'Medium' }
    ]
  },
  
  creatives: {
    managementType: 'creatives',
    defaultGroups: [
      { title: 'Concept', color: '#9d34da' },
      { title: 'Design', color: '#579bfc' },
      { title: 'Review', color: '#ff9f40' },
      { title: 'Approved', color: '#00c875' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'file-picker'],
    sampleTasks: [
      { title: 'Brand Logo Design', status: 'Working on it', priority: 'High' },
      { title: 'Website Mockup', status: 'Not Started', priority: 'Medium' }
    ]
  },
  
  budgets: {
    managementType: 'budgets',
    defaultGroups: [
      { title: 'Planned', color: '#579bfc' },
      { title: 'Approved', color: '#00c875' },
      { title: 'In Use', color: '#fdab3d' },
      { title: 'Completed', color: '#c4c4c4' }
    ],
    columnOrder: ['status-picker', 'number-picker', 'assignee-picker', 'date-picker'],
    sampleTasks: [
      { title: 'Q1 Marketing Budget', status: 'Working on it', priority: 'High' },
      { title: 'Office Supplies Budget', status: 'Not Started', priority: 'Low' }
    ]
  },
  
  leads: {
    managementType: 'leads',
    defaultGroups: [
      { title: 'New Leads', color: '#579bfc' },
      { title: 'Qualified', color: '#fdab3d' },
      { title: 'Proposal Sent', color: '#ff9f40' },
      { title: 'Won', color: '#00c875' },
      { title: 'Lost', color: '#e2445c' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'number-picker'],
    sampleTasks: [
      { title: 'ABC Corp - Enterprise Deal', status: 'Working on it', priority: 'High' },
      { title: 'Startup XYZ - Pilot Project', status: 'Not Started', priority: 'Medium' }
    ]
  },
  
  clients: {
    managementType: 'clients',
    defaultGroups: [
      { title: 'Prospects', color: '#579bfc' },
      { title: 'Active Clients', color: '#00c875' },
      { title: 'On Hold', color: '#fdab3d' },
      { title: 'Churned', color: '#e2445c' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'date-picker'],
    sampleTasks: [
      { title: 'Tech Solutions Inc.', status: 'Working on it', priority: 'High' },
      { title: 'Marketing Agency Co.', status: 'Done', priority: 'Medium' }
    ]
  },
  
  employees: {
    managementType: 'employees',
    defaultGroups: [
      { title: 'New Hires', color: '#579bfc' },
      { title: 'Onboarding', color: '#fdab3d' },
      { title: 'Active', color: '#00c875' },
      { title: 'Alumni', color: '#c4c4c4' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'date-picker', 'text-picker'],
    sampleTasks: [
      { title: 'John Doe - Developer', status: 'Working on it', priority: 'High' },
      { title: 'Jane Smith - Designer', status: 'Done', priority: 'Medium' }
    ]
  },
  
  projects: {
    managementType: 'projects',
    defaultGroups: [
      { title: 'Planning', color: '#579bfc' },
      { title: 'In Progress', color: '#fdab3d' },
      { title: 'Review', color: '#ff9f40' },
      { title: 'Completed', color: '#00c875' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'progress-picker', 'date-picker'],
    sampleTasks: [
      { title: 'Website Redesign', status: 'Working on it', priority: 'High', progress: 45 },
      { title: 'Mobile App Development', status: 'Not Started', priority: 'Medium', progress: 0 }
    ]
  },
  
  tasks: {
    managementType: 'tasks',
    defaultGroups: [
      { title: 'To Do', color: '#579bfc' },
      { title: 'In Progress', color: '#fdab3d' },
      { title: 'Done', color: '#00c875' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'date-picker'],
    sampleTasks: [
      { title: 'Complete project documentation', status: 'Not Started', priority: 'High' },
      { title: 'Review code changes', status: 'Working on it', priority: 'Medium' },
      { title: 'Setup development environment', status: 'Done', priority: 'Low' }
    ]
  },
  
  custom: {
    managementType: 'custom',
    defaultGroups: [
      { title: 'Group 1', color: '#579bfc' },
      { title: 'Group 2', color: '#fdab3d' },
      { title: 'Group 3', color: '#00c875' }
    ],
    columnOrder: ['status-picker', 'assignee-picker', 'priority-picker', 'date-picker'],
    sampleTasks: [
      { title: 'Sample Item 1', status: 'Not Started', priority: 'Medium' },
      { title: 'Sample Item 2', status: 'Working on it', priority: 'High' }
    ]
  }
};

export class BoardTemplateService {
  
  /**
   * Creates a new board with template-based setup
   */
  createBoardFromTemplate(
    boardData: {
      name: string;
      privacy: PrivacyType;
      managementType: ManagementType;
      customManagementType?: string;
    },
    createdBy: PersonAssignment
  ): COWBoard {
    
    const template = MANAGEMENT_TEMPLATES[boardData.managementType];
    const boardId = generateId();
    
    // Create groups with sample tasks
    const groups: COWBoardGroup[] = template.defaultGroups.map((groupTemplate, index) => {
      const groupId = generateId();
      const group: COWBoardGroup = {
        id: groupId,
        title: boardData.managementType === 'custom' && boardData.customManagementType 
          ? `${boardData.customManagementType} ${groupTemplate.title}` 
          : groupTemplate.title || 'New Group',
        color: groupTemplate.color || '#579bfc',
        position: index,
        tasks: [],
        isCollapsed: false
      };
      
      // Add sample tasks to first group
      if (index === 0 && template.sampleTasks) {
        group.tasks = template.sampleTasks.map(taskTemplate => ({
          id: generateId(),
          title: taskTemplate.title || 'New Task',
          status: taskTemplate.status || 'Not Started',
          priority: taskTemplate.priority || 'Medium',
          assigneeIds: taskTemplate.assigneeIds || [],
          progress: taskTemplate.progress,
          dueDate: taskTemplate.dueDate,
          number: taskTemplate.number,
          fileUrl: taskTemplate.fileUrl,
          updatedBy: {
            date: Date.now(),
            userId: createdBy.id,
            userAvatar: createdBy.avatar
          },
          comments: [],
          customFields: {}
        }));
      }
      
      return group;
    });
    
    // Create the board
    const board: COWBoard = {
      id: boardId,
      title: boardData.name,
      description: `${boardData.managementType === 'custom' && boardData.customManagementType 
        ? boardData.customManagementType 
        : boardData.managementType} management board`,
      isStarred: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      members: [createdBy],
      groups,
      activities: [],
      labels: template.labels || getDefaultLabels(),
      columnOrder: template.columnOrder,
      availableColumns: [
        'assignee-picker',
        'status-picker', 
        'priority-picker',
        'date-picker',
        'number-picker',
        'file-picker',
        'progress-picker',
        'updated-picker',
        'checkbox-picker',
        'text-picker'
      ],
      viewType: 'table'
    };
    
    return board;
  }
  
  /**
   * Get template info for a management type
   */
  getTemplateInfo(managementType: ManagementType): ManagementTypeTemplate {
    return MANAGEMENT_TEMPLATES[managementType];
  }
  
  /**
   * Get all available management types
   */
  getAvailableManagementTypes(): ManagementType[] {
    return Object.keys(MANAGEMENT_TEMPLATES) as ManagementType[];
  }
}

export const boardTemplateService = new BoardTemplateService();