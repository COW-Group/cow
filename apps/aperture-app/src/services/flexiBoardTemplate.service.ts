import { 
  FlexiBoard, 
  FlexiBoardColumn, 
  FlexiBoardView, 
  FlexiBoardItem,
  FlexiBoardGroup,
  ColumnType,
  BoardTemplate,
  EnhancedFlexiBoardEngine
} from '../../../../libs/missions-engine-lib/src/index';
import { ManagementType, PrivacyType, PersonAssignment } from '../types/board.types';

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// FlexiBoard-based management type templates
interface FlexiBoardManagementTemplate {
  managementType: ManagementType;
  defaultColumns: Omit<FlexiBoardColumn, 'id'>[];
  defaultGroups: Omit<FlexiBoardGroup, 'id' | 'items'>[];
  sampleItems?: Omit<FlexiBoardItem, 'id' | 'boardId' | 'createdAt' | 'updatedAt' | 'position'>[];
  defaultViews?: Omit<FlexiBoardView, 'id'>[];
}

const FLEXIBOARD_TEMPLATES: Record<ManagementType, FlexiBoardManagementTemplate> = {
  items: {
    managementType: 'items',
    defaultColumns: [
      { title: 'Item', type: 'text', width: 250, required: true },
      { title: 'Status', type: 'status', width: 130, 
        options: [
          { label: 'Not Started', value: 'not-started', color: '#c4c4c4' },
          { label: 'Working on it', value: 'working', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ]
      },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Person', type: 'person', width: 140 },
      { title: 'Due Date', type: 'date', width: 130 }
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
    defaultColumns: [
      { title: 'Campaign', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'Planning', value: 'planning', color: '#579bfc' },
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'Review', value: 'review', color: '#ff9f40' },
          { label: 'Completed', value: 'completed', color: '#9cd326' }
        ]
      },
      { title: 'Manager', type: 'person', width: 140 },
      { title: 'Budget', type: 'currency', width: 120 },
      { title: 'Launch Date', type: 'date', width: 130 },
      { title: 'Progress', type: 'progress', width: 150 }
    ],
    defaultGroups: [
      { title: 'Planning', color: '#579bfc', collapsed: false },
      { title: 'In Progress', color: '#fdab3d', collapsed: false },
      { title: 'Review', color: '#ff9f40', collapsed: false },
      { title: 'Completed', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Campaign': 'Q1 Marketing Campaign' }, status: 'planning', priority: 'high', createdBy: 'system' },
      { data: { 'Campaign': 'Social Media Campaign' }, status: 'active', priority: 'medium', createdBy: 'system' }
    ]
  },

  creatives: {
    managementType: 'creatives',
    defaultColumns: [
      { title: 'Creative', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'Concept', value: 'concept', color: '#9d34da' },
          { label: 'Design', value: 'design', color: '#579bfc' },
          { label: 'Review', value: 'review', color: '#ff9f40' },
          { label: 'Approved', value: 'approved', color: '#00c875' }
        ]
      },
      { title: 'Designer', type: 'person', width: 140 },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Files', type: 'file', width: 120 },
      { title: 'Due Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'Concept', color: '#9d34da', collapsed: false },
      { title: 'Design', color: '#579bfc', collapsed: false },
      { title: 'Review', color: '#ff9f40', collapsed: false },
      { title: 'Approved', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Creative': 'Brand Logo Design' }, status: 'design', priority: 'high', createdBy: 'system' },
      { data: { 'Creative': 'Website Mockup' }, status: 'concept', priority: 'medium', createdBy: 'system' }
    ]
  },

  budgets: {
    managementType: 'budgets',
    defaultColumns: [
      { title: 'Budget Item', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'Planned', value: 'planned', color: '#579bfc' },
          { label: 'Approved', value: 'approved', color: '#00c875' },
          { label: 'In Use', value: 'in-use', color: '#fdab3d' },
          { label: 'Completed', value: 'completed', color: '#c4c4c4' }
        ]
      },
      { title: 'Amount', type: 'currency', width: 120 },
      { title: 'Owner', type: 'person', width: 140 },
      { title: 'Due Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'Planned', color: '#579bfc', collapsed: false },
      { title: 'Approved', color: '#00c875', collapsed: false },
      { title: 'In Use', color: '#fdab3d', collapsed: false },
      { title: 'Completed', color: '#c4c4c4', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Budget Item': 'Q1 Marketing Budget' }, status: 'approved', priority: 'high', createdBy: 'system' },
      { data: { 'Budget Item': 'Office Supplies Budget' }, status: 'planned', priority: 'low', createdBy: 'system' }
    ]
  },

  leads: {
    managementType: 'leads',
    defaultColumns: [
      { title: 'Lead Name', type: 'text', width: 200, required: true },
      { title: 'Company', type: 'text', width: 180 },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'New Lead', value: 'new', color: '#579bfc' },
          { label: 'Qualified', value: 'qualified', color: '#fdab3d' },
          { label: 'Proposal Sent', value: 'proposal', color: '#ff9f40' },
          { label: 'Won', value: 'won', color: '#00c875' },
          { label: 'Lost', value: 'lost', color: '#e2445c' }
        ]
      },
      { title: 'Value', type: 'currency', width: 120 },
      { title: 'Contact', type: 'person', width: 140 },
      { title: 'Close Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'New Leads', color: '#579bfc', collapsed: false },
      { title: 'Qualified', color: '#fdab3d', collapsed: false },
      { title: 'Proposal Sent', color: '#ff9f40', collapsed: false },
      { title: 'Won', color: '#00c875', collapsed: false },
      { title: 'Lost', color: '#e2445c', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Lead Name': 'ABC Corp - Enterprise Deal' }, status: 'qualified', priority: 'high', createdBy: 'system' },
      { data: { 'Lead Name': 'Startup XYZ - Pilot Project' }, status: 'new', priority: 'medium', createdBy: 'system' }
    ]
  },

  clients: {
    managementType: 'clients',
    defaultColumns: [
      { title: 'Client', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'Prospect', value: 'prospect', color: '#579bfc' },
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'On Hold', value: 'on-hold', color: '#fdab3d' },
          { label: 'Churned', value: 'churned', color: '#e2445c' }
        ]
      },
      { title: 'Account Manager', type: 'person', width: 140 },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Start Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'Prospects', color: '#579bfc', collapsed: false },
      { title: 'Active Clients', color: '#00c875', collapsed: false },
      { title: 'On Hold', color: '#fdab3d', collapsed: false },
      { title: 'Churned', color: '#e2445c', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Client': 'Tech Solutions Inc.' }, status: 'active', priority: 'high', createdBy: 'system' },
      { data: { 'Client': 'Marketing Agency Co.' }, status: 'prospect', priority: 'medium', createdBy: 'system' }
    ]
  },

  employees: {
    managementType: 'employees',
    defaultColumns: [
      { title: 'Employee', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'New Hire', value: 'new-hire', color: '#579bfc' },
          { label: 'Onboarding', value: 'onboarding', color: '#fdab3d' },
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'Alumni', value: 'alumni', color: '#c4c4c4' }
        ]
      },
      { title: 'Manager', type: 'person', width: 140 },
      { title: 'Department', type: 'text', width: 120 },
      { title: 'Start Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'New Hires', color: '#579bfc', collapsed: false },
      { title: 'Onboarding', color: '#fdab3d', collapsed: false },
      { title: 'Active', color: '#00c875', collapsed: false },
      { title: 'Alumni', color: '#c4c4c4', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Employee': 'John Doe - Developer' }, status: 'onboarding', priority: 'high', createdBy: 'system' },
      { data: { 'Employee': 'Jane Smith - Designer' }, status: 'active', priority: 'medium', createdBy: 'system' }
    ]
  },

  projects: {
    managementType: 'projects',
    defaultColumns: [
      { title: 'Project', type: 'text', width: 200, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'Planning', value: 'planning', color: '#579bfc' },
          { label: 'In Progress', value: 'in-progress', color: '#fdab3d' },
          { label: 'Review', value: 'review', color: '#ff9f40' },
          { label: 'Completed', value: 'completed', color: '#00c875' }
        ]
      },
      { title: 'Owner', type: 'person', width: 140 },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Progress', type: 'progress', width: 150 },
      { title: 'Due Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'Planning', color: '#579bfc', collapsed: false },
      { title: 'In Progress', color: '#fdab3d', collapsed: false },
      { title: 'Review', color: '#ff9f40', collapsed: false },
      { title: 'Completed', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Project': 'Website Redesign' }, status: 'in-progress', priority: 'high', createdBy: 'system' },
      { data: { 'Project': 'Mobile App Development' }, status: 'planning', priority: 'medium', createdBy: 'system' }
    ]
  },

  tasks: {
    managementType: 'tasks',
    defaultColumns: [
      { title: 'Task', type: 'text', width: 250, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'To Do', value: 'todo', color: '#c4c4c4' },
          { label: 'Working on it', value: 'working', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ]
      },
      { title: 'Assignee', type: 'person', width: 140 },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Due Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'To Do', color: '#579bfc', collapsed: false },
      { title: 'In Progress', color: '#fdab3d', collapsed: false },
      { title: 'Done', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Task': 'Complete project documentation' }, status: 'todo', priority: 'high', createdBy: 'system' },
      { data: { 'Task': 'Review code changes' }, status: 'working', priority: 'medium', createdBy: 'system' },
      { data: { 'Task': 'Setup development environment' }, status: 'done', priority: 'low', createdBy: 'system' }
    ]
  },

  custom: {
    managementType: 'custom',
    defaultColumns: [
      { title: 'Item', type: 'text', width: 250, required: true },
      { title: 'Status', type: 'status', width: 130,
        options: [
          { label: 'New', value: 'new', color: '#579bfc' },
          { label: 'In Progress', value: 'in-progress', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ]
      },
      { title: 'Person', type: 'person', width: 140 },
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Date', type: 'date', width: 130 }
    ],
    defaultGroups: [
      { title: 'Group 1', color: '#579bfc', collapsed: false },
      { title: 'Group 2', color: '#fdab3d', collapsed: false },
      { title: 'Group 3', color: '#00c875', collapsed: false }
    ],
    sampleItems: [
      { data: { 'Item': 'Sample Item 1' }, status: 'new', priority: 'medium', createdBy: 'system' },
      { data: { 'Item': 'Sample Item 2' }, status: 'in-progress', priority: 'high', createdBy: 'system' }
    ]
  }
};

export class FlexiBoardTemplateService {
  
  /**
   * Creates a FlexiBoard with enhanced engine from template
   */
  createFlexiBoardFromTemplate(
    boardData: {
      name: string;
      privacy: PrivacyType;
      managementType: ManagementType;
      customManagementType?: string;
    },
    createdBy: PersonAssignment
  ): { board: FlexiBoard; engine: EnhancedFlexiBoardEngine } {
    
    const template = FLEXIBOARD_TEMPLATES[boardData.managementType];
    const boardId = generateId();
    
    // Create columns with IDs
    const columns: FlexiBoardColumn[] = template.defaultColumns.map((colTemplate, index) => ({
      ...colTemplate,
      id: `col-${index}`,
    }));
    
    // Create groups with IDs and items
    const groups: FlexiBoardGroup[] = template.defaultGroups.map((groupTemplate, index) => {
      const groupId = generateId();
      const group: FlexiBoardGroup = {
        ...groupTemplate,
        id: groupId,
        items: []
      };
      
      // Add sample items to first group
      if (index === 0 && template.sampleItems) {
        group.items = template.sampleItems.map((itemTemplate, itemIndex) => ({
          ...itemTemplate,
          id: generateId(),
          boardId,
          createdAt: new Date(),
          updatedAt: new Date(),
          position: itemIndex
        }));
      }
      
      return group;
    });
    
    // Flatten items from groups
    const items: FlexiBoardItem[] = groups.flatMap(group => group.items);
    
    // Create default view
    const defaultView: FlexiBoardView = {
      id: generateId(),
      name: 'Main Table',
      type: 'table',
      isDefault: true,
      filters: [],
      sorts: [],
      visibleColumns: columns.map(c => c.id)
    };
    
    // Create template config for adaptation
    const managementTypeName = boardData.managementType === 'custom' && boardData.customManagementType 
      ? boardData.customManagementType 
      : boardData.managementType;
    
    const templateConfig = {
      id: boardData.managementType as BoardTemplate,
      label: managementTypeName.charAt(0).toUpperCase() + managementTypeName.slice(1),
      singular: managementTypeName.slice(0, -1), // Remove 's' for singular
      plural: managementTypeName,
      description: `Manage your ${managementTypeName} efficiently`,
      defaultColumns: template.defaultColumns,
      frozenColumns: [template.defaultColumns[0]?.title] // Freeze first column by default
    };

    // Create the FlexiBoard
    const flexiBoard: FlexiBoard = {
      id: boardId,
      name: `${templateConfig.label} Board`,
      description: `${templateConfig.description} with advanced automation`,
      ownerId: createdBy.id,
      workspace: 'default',
      template: boardData.managementType as BoardTemplate,
      templateConfig,
      columns,
      views: [defaultView],
      activeViewId: defaultView.id,
      items,
      groups,
      permissions: {
        canEdit: true,
        canDelete: true,
        canShare: true,
        canComment: true,
        canManageAutomations: true,
        canExport: true,
        canDuplicate: true
      },
      settings: {
        allowComments: true,
        enableNotifications: true,
        showSubItems: false,
        colorCoding: true,
        enableAutomations: true,
        trackTime: false,
        requireApproval: false,
        showUpdates: true,
        enableIntegrations: true,
        allowBulkOperations: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create enhanced engine
    const engine = new EnhancedFlexiBoardEngine(flexiBoard, {
      onNotification: (notification) => {
        console.log('FlexiBoard Notification:', notification);
      },
      onActivity: (activity) => {
        console.log('FlexiBoard Activity:', activity);
      }
    });
    
    return { board: flexiBoard, engine };
  }
  
  /**
   * Get template info for a management type
   */
  getTemplateInfo(managementType: ManagementType): FlexiBoardManagementTemplate {
    return FLEXIBOARD_TEMPLATES[managementType];
  }
  
  /**
   * Get all available management types
   */
  getAvailableManagementTypes(): ManagementType[] {
    return Object.keys(FLEXIBOARD_TEMPLATES) as ManagementType[];
  }
}

export const flexiBoardTemplateService = new FlexiBoardTemplateService();