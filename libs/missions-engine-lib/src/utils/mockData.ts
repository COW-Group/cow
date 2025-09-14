import { 
  FlexiBoard, 
  FlexiBoardItem, 
  Mission, 
  MissionTemplate,
  BusinessAppType,
  BoardTemplate,
  BoardTemplateConfig
} from '../types/flexiboard';

export const generateMockBoard = (type: BusinessAppType = 'tokenization'): FlexiBoard => {
  const boards: Record<BusinessAppType, FlexiBoard> = {
    'tokenization': generateTokenizationBoard(),
    'compliance': generateComplianceBoard(),
    'content': generateContentBoard(),
    'campaign': generateCampaignBoard(),
    'focus': generateFocusBoard(),
    // Add other types with basic implementations
    'due-diligence': generateBasicBoard('Due Diligence'),
    'partnership': generateBasicBoard('Partnership'),
    'ipo': generateBasicBoard('IPO'),
    'relationship': generateBasicBoard('Relationship'),
    'event': generateBasicBoard('Event'),
    'filing': generateBasicBoard('Filing'),
    'audit': generateBasicBoard('Audit'),
    'brand-voice': generateBasicBoard('Brand Voice'),
    'content-planning': generateBasicBoard('Content Planning'),
    'wellness': generateBasicBoard('Wellness'),
    'knowledge': generateBasicBoard('Knowledge'),
  };

  return boards[type];
};

function generateTokenizationBoard(): FlexiBoard {
  return {
    id: 'board-tokenization-1',
    name: 'TechCorp Tokenization Pipeline',
    description: 'Managing the tokenization process for TechCorp Inc.',
    ownerId: 'user-1',
    workspace: 'main',
    businessApp: 'tokenization',
    columns: [
      { id: 'company', title: 'Company', type: 'text', required: true },
      { id: 'stage', title: 'Tokenization Stage', type: 'status', options: [
        'Due Diligence', 'Legal Review', 'Token Structure', 'Smart Contract', 
        'Regulatory Approval', 'Marketing', 'Launch', 'Post-Launch'
      ]},
      { id: 'priority', title: 'Priority', type: 'priority' },
      { id: 'lead', title: 'Lead Advisor', type: 'person' },
      { id: 'deadline', title: 'Target Date', type: 'date' },
      { id: 'valuation', title: 'Valuation', type: 'currency' },
      { id: 'progress', title: 'Progress', type: 'progress' },
    ],
    views: [
      {
        id: 'kanban-view',
        name: 'Tokenization Pipeline',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [{ column: 'deadline', direction: 'asc' }],
        groupBy: 'stage',
      },
      {
        id: 'table-view',
        name: 'Table View',
        type: 'table',
        filters: [],
        sorts: [{ column: 'deadline', direction: 'asc' }],
      },
    ],
    activeViewId: 'kanban-view',
    items: [
      {
        id: 'item-1',
        boardId: 'board-tokenization-1',
        data: {
          company: 'TechCorp Inc.',
          stage: 'Due Diligence',
          priority: 'high',
          lead: 'Sarah Chen',
          deadline: '2024-10-15',
          valuation: 50000000,
          progress: 25,
        },
        status: 'Due Diligence',
        priority: 'high',
        assignees: ['sarah.chen@cow.com'],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-1',
        position: 0,
      },
      {
        id: 'item-2',
        boardId: 'board-tokenization-1',
        data: {
          company: 'GreenEnergy Solutions',
          stage: 'Legal Review',
          priority: 'medium',
          lead: 'Michael Rodriguez',
          deadline: '2024-11-01',
          valuation: 25000000,
          progress: 60,
        },
        status: 'Legal Review',
        priority: 'medium',
        assignees: ['michael.rodriguez@cow.com'],
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-09-08'),
        createdBy: 'user-1',
        position: 1,
      },
      {
        id: 'item-3',
        boardId: 'board-tokenization-1',
        data: {
          company: 'MedTech Innovations',
          stage: 'Smart Contract',
          priority: 'urgent',
          lead: 'David Kim',
          deadline: '2024-09-30',
          valuation: 75000000,
          progress: 80,
        },
        status: 'Smart Contract',
        priority: 'urgent',
        assignees: ['david.kim@cow.com'],
        createdAt: new Date('2024-07-20'),
        updatedAt: new Date('2024-09-09'),
        createdBy: 'user-1',
        position: 2,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true,
      canComment: true,
      canManageAutomations: true,
      canExport: true,
      canDuplicate: true,
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
      allowBulkOperations: true,
    },
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-10'),
  };
}

function generateComplianceBoard(): FlexiBoard {
  return {
    id: 'board-compliance-1',
    name: 'Q4 Compliance Requirements',
    description: 'Tracking Q4 regulatory compliance requirements',
    ownerId: 'user-2',
    workspace: 'compliance',
    businessApp: 'compliance',
    columns: [
      { id: 'requirement', title: 'Compliance Requirement', type: 'text', required: true },
      { id: 'regulation', title: 'Regulation', type: 'status', options: [
        'SEC', 'FINRA', 'CFTC', 'State', 'International', 'Internal'
      ]},
      { id: 'status', title: 'Status', type: 'status', options: [
        'Not Started', 'In Progress', 'Under Review', 'Compliant', 'Non-Compliant'
      ]},
      { id: 'priority', title: 'Priority', type: 'priority' },
      { id: 'owner', title: 'Compliance Owner', type: 'person' },
      { id: 'due_date', title: 'Deadline', type: 'date' },
      { id: 'risk_rating', title: 'Risk Rating', type: 'rating' },
    ],
    views: [
      {
        id: 'compliance-kanban',
        name: 'Compliance Pipeline',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [{ column: 'due_date', direction: 'asc' }],
        groupBy: 'status',
      },
    ],
    activeViewId: 'compliance-kanban',
    items: [
      {
        id: 'comp-1',
        boardId: 'board-compliance-1',
        data: {
          requirement: 'Form 10-K Annual Report',
          regulation: 'SEC',
          status: 'In Progress',
          priority: 'high',
          owner: 'Legal Team',
          due_date: '2024-12-31',
          risk_rating: 5,
        },
        status: 'In Progress',
        priority: 'high',
        assignees: ['legal@cow.com'],
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-2',
        position: 0,
      },
      {
        id: 'comp-2',
        boardId: 'board-compliance-1',
        data: {
          requirement: 'Anti-Money Laundering Review',
          regulation: 'FINRA',
          status: 'Under Review',
          priority: 'medium',
          owner: 'Compliance Officer',
          due_date: '2024-11-15',
          risk_rating: 4,
        },
        status: 'Under Review',
        priority: 'medium',
        assignees: ['compliance@cow.com'],
        createdAt: new Date('2024-08-20'),
        updatedAt: new Date('2024-09-05'),
        createdBy: 'user-2',
        position: 1,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: false,
      canShare: true,
      canComment: true,
      canManageAutomations: false,
      canExport: true,
      canDuplicate: false,
    },
    settings: {
      allowComments: true,
      enableNotifications: true,
      showSubItems: true,
      colorCoding: true,
      enableAutomations: true,
      trackTime: true,
      requireApproval: true,
      showUpdates: true,
      enableIntegrations: false,
      allowBulkOperations: true,
    },
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-10'),
  };
}

function generateContentBoard(): FlexiBoard {
  return {
    id: 'board-content-1',
    name: 'Q4 Content Calendar',
    description: 'Content creation and publishing schedule for Q4',
    ownerId: 'user-3',
    workspace: 'marketing',
    businessApp: 'content',
    columns: [
      { id: 'title', title: 'Content Title', type: 'text', required: true },
      { id: 'type', title: 'Content Type', type: 'status', options: [
        'Blog Post', 'Video', 'Podcast', 'Infographic', 'Whitepaper', 'Social Media', 'Email'
      ]},
      { id: 'status', title: 'Status', type: 'status', options: [
        'Ideation', 'Outline', 'Draft', 'Review', 'Editing', 'Approved', 'Published'
      ]},
      { id: 'author', title: 'Author', type: 'person' },
      { id: 'publish_date', title: 'Publish Date', type: 'date' },
      { id: 'channel', title: 'Channel', type: 'tags' },
    ],
    views: [
      {
        id: 'content-kanban',
        name: 'Content Pipeline',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [{ column: 'publish_date', direction: 'asc' }],
        groupBy: 'status',
      },
      {
        id: 'content-calendar',
        name: 'Publishing Calendar',
        type: 'calendar',
        filters: [],
        sorts: [],
      },
    ],
    activeViewId: 'content-kanban',
    items: [
      {
        id: 'content-1',
        boardId: 'board-content-1',
        data: {
          title: 'Understanding Tokenization Benefits',
          type: 'Blog Post',
          status: 'Draft',
          author: 'Emily Watson',
          publish_date: '2024-10-15',
          channel: ['Website', 'LinkedIn'],
        },
        status: 'Draft',
        assignees: ['emily.watson@cow.com'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-3',
        position: 0,
      },
      {
        id: 'content-2',
        boardId: 'board-content-1',
        data: {
          title: 'Investment Webinar Series',
          type: 'Video',
          status: 'Review',
          author: 'Marketing Team',
          publish_date: '2024-11-01',
          channel: ['YouTube', 'Website'],
        },
        status: 'Review',
        assignees: ['marketing@cow.com'],
        createdAt: new Date('2024-08-28'),
        updatedAt: new Date('2024-09-08'),
        createdBy: 'user-3',
        position: 1,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true,
      canComment: true,
      canManageAutomations: true,
      canExport: true,
      canDuplicate: true,
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
      allowBulkOperations: false,
    },
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-09-10'),
  };
}

function generateCampaignBoard(): FlexiBoard {
  return {
    id: 'board-campaign-1',
    name: 'Series A Fundraising Campaign',
    description: 'Managing Series A fundraising activities',
    ownerId: 'user-4',
    workspace: 'investor-relations',
    businessApp: 'campaign',
    columns: [
      { id: 'campaign', title: 'Campaign Name', type: 'text', required: true },
      { id: 'type', title: 'Campaign Type', type: 'status', options: [
        'Seed Round', 'Series A', 'Series B', 'Bridge', 'Token Sale', 'IPO'
      ]},
      { id: 'status', title: 'Status', type: 'status', options: [
        'Planning', 'Active', 'Follow-up', 'Closed Won', 'Closed Lost'
      ]},
      { id: 'target_amount', title: 'Target Amount', type: 'currency' },
      { id: 'raised_amount', title: 'Raised Amount', type: 'currency' },
      { id: 'progress', title: 'Progress', type: 'progress' },
      { id: 'lead_investor', title: 'Lead Investor', type: 'person' },
      { id: 'close_date', title: 'Target Close', type: 'date' },
    ],
    views: [
      {
        id: 'campaign-kanban',
        name: 'Campaign Pipeline',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [{ column: 'close_date', direction: 'asc' }],
        groupBy: 'status',
      },
    ],
    activeViewId: 'campaign-kanban',
    items: [
      {
        id: 'campaign-1',
        boardId: 'board-campaign-1',
        data: {
          campaign: 'Series A Round 1',
          type: 'Series A',
          status: 'Active',
          target_amount: 10000000,
          raised_amount: 6500000,
          progress: 65,
          lead_investor: 'Venture Capital Partners',
          close_date: '2024-12-15',
        },
        status: 'Active',
        assignees: ['investor-relations@cow.com'],
        createdAt: new Date('2024-08-01'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-4',
        position: 0,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true,
      canComment: true,
      canManageAutomations: true,
      canExport: true,
      canDuplicate: true,
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
      allowBulkOperations: true,
    },
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-09-10'),
  };
}

function generateFocusBoard(): FlexiBoard {
  return {
    id: 'board-focus-1',
    name: 'Personal Productivity Board',
    description: 'Daily focus and productivity tracking',
    ownerId: 'user-5',
    workspace: 'personal',
    businessApp: 'project-management',
    columns: [
      { id: 'task', title: 'Task', type: 'text', required: true },
      { id: 'category', title: 'Category', type: 'status', options: [
        'Deep Work', 'Meetings', 'Admin', 'Learning', 'Creative', 'Planning'
      ]},
      { id: 'status', title: 'Status', type: 'status', options: [
        'Backlog', 'Today', 'In Progress', 'Blocked', 'Done'
      ]},
      { id: 'priority', title: 'Priority', type: 'priority' },
      { id: 'estimated_time', title: 'Estimated Time', type: 'number' },
      { id: 'energy_level', title: 'Required Energy', type: 'status', options: [
        'Low', 'Medium', 'High'
      ]},
      { id: 'due_date', title: 'Due Date', type: 'date' },
    ],
    views: [
      {
        id: 'focus-kanban',
        name: 'Focus Board',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [{ column: 'priority', direction: 'desc' }],
        groupBy: 'status',
      },
    ],
    activeViewId: 'focus-kanban',
    items: [
      {
        id: 'focus-1',
        boardId: 'board-focus-1',
        data: {
          task: 'Review investor deck',
          category: 'Deep Work',
          status: 'Today',
          priority: 'high',
          estimated_time: 2,
          energy_level: 'High',
          due_date: '2024-09-11',
        },
        status: 'Today',
        priority: 'high',
        assignees: ['user-5'],
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-5',
        position: 0,
      },
      {
        id: 'focus-2',
        boardId: 'board-focus-1',
        data: {
          task: 'Team standup meeting',
          category: 'Meetings',
          status: 'In Progress',
          priority: 'medium',
          estimated_time: 0.5,
          energy_level: 'Low',
          due_date: '2024-09-10',
        },
        status: 'In Progress',
        priority: 'medium',
        assignees: ['user-5'],
        createdAt: new Date('2024-09-10'),
        updatedAt: new Date('2024-09-10'),
        createdBy: 'user-5',
        position: 1,
      },
    ],
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: false,
      canComment: false,
      canManageAutomations: true,
      canExport: false,
      canDuplicate: false,
    },
    settings: {
      allowComments: false,
      enableNotifications: true,
      showSubItems: false,
      colorCoding: true,
      enableAutomations: false,
      trackTime: true,
      requireApproval: false,
      showUpdates: false,
      enableIntegrations: false,
      allowBulkOperations: false,
    },
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10'),
  };
}

function generateBasicBoard(name: string): FlexiBoard {
  return {
    id: `board-${name.toLowerCase().replace(/\s+/g, '-')}-1`,
    name: `${name} Board`,
    description: `Basic ${name.toLowerCase()} management board`,
    ownerId: 'user-1',
    workspace: 'main',
    businessApp: name.toLowerCase().replace(/\s+/g, '-') as BusinessAppType,
    columns: [
      { id: 'title', title: 'Title', type: 'text', required: true },
      { id: 'status', title: 'Status', type: 'status', options: ['Todo', 'In Progress', 'Done'] },
      { id: 'priority', title: 'Priority', type: 'priority' },
      { id: 'assignee', title: 'Assignee', type: 'person' },
      { id: 'due_date', title: 'Due Date', type: 'date' },
    ],
    views: [
      {
        id: 'default-view',
        name: 'Default View',
        type: 'kanban',
        isDefault: true,
        filters: [],
        sorts: [],
        groupBy: 'status',
      },
    ],
    activeViewId: 'default-view',
    items: [],
    permissions: {
      canEdit: true,
      canDelete: true,
      canShare: true,
      canComment: true,
      canManageAutomations: true,
      canExport: true,
      canDuplicate: true,
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
      allowBulkOperations: true,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const generateMockMissions = (): Mission[] => {
  return [
    {
      id: 'mission-1',
      title: 'TechCorp Tokenization Mission',
      description: 'Complete end-to-end tokenization process for TechCorp Inc.',
      type: 'tokenization',
      status: 'active',
      priority: 'high',
      owner: 'sarah.chen@cow.com',
      team: ['sarah.chen@cow.com', 'michael.rodriguez@cow.com', 'david.kim@cow.com'],
      boards: ['board-tokenization-1'],
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      milestones: [
        {
          id: 'milestone-1',
          title: 'Due Diligence Complete',
          dueDate: new Date('2024-10-15'),
          completed: false,
        },
        {
          id: 'milestone-2',
          title: 'Smart Contract Deployed',
          dueDate: new Date('2024-11-30'),
          completed: false,
        },
        {
          id: 'milestone-3',
          title: 'Token Launch',
          dueDate: new Date('2024-12-31'),
          completed: false,
        },
      ],
      budget: 500000,
      progress: 35,
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-09-10'),
    },
    {
      id: 'mission-2',
      title: 'Q4 Compliance Review',
      description: 'Ensure all Q4 regulatory compliance requirements are met',
      type: 'compliance',
      status: 'active',
      priority: 'high',
      owner: 'legal@cow.com',
      team: ['legal@cow.com', 'compliance@cow.com'],
      boards: ['board-compliance-1'],
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-31'),
      milestones: [
        {
          id: 'milestone-comp-1',
          title: 'SEC Filings Complete',
          dueDate: new Date('2024-12-31'),
          completed: false,
        },
      ],
      progress: 45,
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-09-10'),
    },
    {
      id: 'mission-3',
      title: 'Series A Fundraising',
      description: 'Complete Series A fundraising round',
      type: 'campaign',
      status: 'active',
      priority: 'urgent',
      owner: 'investor-relations@cow.com',
      team: ['investor-relations@cow.com', 'ceo@cow.com'],
      boards: ['board-campaign-1'],
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-12-15'),
      milestones: [
        {
          id: 'milestone-fund-1',
          title: 'Lead Investor Secured',
          dueDate: new Date('2024-11-01'),
          completed: true,
          completedAt: new Date('2024-10-15'),
        },
        {
          id: 'milestone-fund-2',
          title: 'Round Closed',
          dueDate: new Date('2024-12-15'),
          completed: false,
        },
      ],
      budget: 100000,
      progress: 65,
      createdAt: new Date('2024-08-01'),
      updatedAt: new Date('2024-09-10'),
    },
  ];
};

export const generateMissionTemplates = (): MissionTemplate[] => {
  return [
    {
      id: 'template-tokenization',
      name: 'Company Tokenization',
      description: 'Complete workflow for tokenizing a company',
      businessApp: 'tokenization',
      boards: [
        {
          name: 'Tokenization Pipeline',
          businessApp: 'tokenization',
          columns: [
            { id: 'company', title: 'Company', type: 'text', required: true },
            { id: 'stage', title: 'Stage', type: 'status', options: [
              'Due Diligence', 'Legal Review', 'Token Structure', 'Smart Contract', 
              'Regulatory Approval', 'Marketing', 'Launch', 'Post-Launch'
            ]},
          ],
        },
      ],
      defaultMilestones: [
        { title: 'Due Diligence Complete', dueDate: new Date(), completed: false },
        { title: 'Legal Review Complete', dueDate: new Date(), completed: false },
        { title: 'Smart Contract Deployed', dueDate: new Date(), completed: false },
        { title: 'Token Launch', dueDate: new Date(), completed: false },
      ],
      estimatedDuration: 120, // days
      tags: ['tokenization', 'blockchain', 'compliance'],
      category: 'Finance',
      difficulty: 'advanced',
      popularity: 85,
    },
    {
      id: 'template-compliance',
      name: 'Compliance Review',
      description: 'Comprehensive compliance review process',
      businessApp: 'compliance',
      boards: [
        {
          name: 'Compliance Requirements',
          businessApp: 'compliance',
          columns: [
            { id: 'requirement', title: 'Requirement', type: 'text', required: true },
            { id: 'regulation', title: 'Regulation', type: 'status' },
            { id: 'status', title: 'Status', type: 'status' },
          ],
        },
      ],
      defaultMilestones: [
        { title: 'Requirements Identified', dueDate: new Date(), completed: false },
        { title: 'Documentation Complete', dueDate: new Date(), completed: false },
        { title: 'Review Complete', dueDate: new Date(), completed: false },
      ],
      estimatedDuration: 60,
      tags: ['compliance', 'legal', 'regulatory'],
      category: 'Legal',
      difficulty: 'intermediate',
      popularity: 72,
    },
  ];
};

export const getBoardTemplateConfigs = (): BoardTemplateConfig[] => {
  return [
    {
      id: 'items',
      label: 'Items',
      singular: 'item',
      plural: 'items',
      description: 'Generic items for tracking anything',
      defaultColumns: [
        { title: 'Item Name', type: 'text', required: true, width: 200 },
        { title: 'Status', type: 'status', options: [
          { label: 'To Do', value: 'todo', color: '#c4c4c4' },
          { label: 'In Progress', value: 'in-progress', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ], width: 120 },
        { title: 'Priority', type: 'priority', width: 100 },
        { title: 'Owner', type: 'person', width: 150 },
        { title: 'Due Date', type: 'date', width: 120 }
      ],
      frozenColumns: ['Item Name'],
      primaryColumn: 'Item Name'
    },
    {
      id: 'projects',
      label: 'Projects',
      singular: 'project',
      plural: 'projects',
      description: 'Manage projects from start to finish',
      defaultColumns: [
        { title: 'Project Name', type: 'text', required: true, width: 250 },
        { title: 'Status', type: 'status', options: [
          { label: 'Planning', value: 'planning', color: '#c4c4c4' },
          { label: 'Active', value: 'active', color: '#fdab3d' },
          { label: 'On Hold', value: 'on-hold', color: '#e2445c' },
          { label: 'Completed', value: 'completed', color: '#00c875' }
        ], width: 120 },
        { title: 'Priority', type: 'priority', width: 100 },
        { title: 'Project Manager', type: 'person', width: 160 },
        { title: 'Start Date', type: 'date', width: 120 },
        { title: 'Due Date', type: 'date', width: 120 },
        { title: 'Progress', type: 'progress', width: 150 },
        { title: 'Budget', type: 'currency', width: 120 }
      ],
      frozenColumns: ['Project Name'],
      primaryColumn: 'Project Name'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      singular: 'task',
      plural: 'tasks',
      description: 'Track individual tasks and to-dos',
      defaultColumns: [
        { title: 'Task', type: 'text', required: true, width: 250 },
        { title: 'Status', type: 'status', options: [
          { label: 'Not Started', value: 'not-started', color: '#c4c4c4' },
          { label: 'Working on it', value: 'working', color: '#fdab3d' },
          { label: 'Stuck', value: 'stuck', color: '#e2445c' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ], width: 130 },
        { title: 'Priority', type: 'priority', width: 100 },
        { title: 'Assignee', type: 'person', width: 150 },
        { title: 'Due Date', type: 'date', width: 120 },
        { title: 'Estimated Hours', type: 'number', width: 120 }
      ],
      frozenColumns: ['Task'],
      primaryColumn: 'Task'
    },
    {
      id: 'leads',
      label: 'Leads',
      singular: 'lead',
      plural: 'leads',
      description: 'Manage sales leads and prospects',
      defaultColumns: [
        { title: 'Lead Name', type: 'text', required: true, width: 200 },
        { title: 'Company', type: 'text', width: 180 },
        { title: 'Status', type: 'status', options: [
          { label: 'New', value: 'new', color: '#c4c4c4' },
          { label: 'Contacted', value: 'contacted', color: '#fdab3d' },
          { label: 'Qualified', value: 'qualified', color: '#579bfc' },
          { label: 'Proposal', value: 'proposal', color: '#a25ddc' },
          { label: 'Won', value: 'won', color: '#00c875' },
          { label: 'Lost', value: 'lost', color: '#e2445c' }
        ], width: 120 },
        { title: 'Email', type: 'email', width: 200 },
        { title: 'Phone', type: 'phone', width: 130 },
        { title: 'Deal Value', type: 'currency', width: 120 },
        { title: 'Sales Rep', type: 'person', width: 150 },
        { title: 'Last Contact', type: 'date', width: 120 }
      ],
      frozenColumns: ['Lead Name', 'Company'],
      primaryColumn: 'Lead Name'
    },
    {
      id: 'clients',
      label: 'Clients',
      singular: 'client',
      plural: 'clients',
      description: 'Manage client relationships and accounts',
      defaultColumns: [
        { title: 'Client Name', type: 'text', required: true, width: 200 },
        { title: 'Company', type: 'text', width: 180 },
        { title: 'Status', type: 'status', options: [
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'Inactive', value: 'inactive', color: '#c4c4c4' },
          { label: 'At Risk', value: 'at-risk', color: '#e2445c' }
        ], width: 120 },
        { title: 'Email', type: 'email', width: 200 },
        { title: 'Phone', type: 'phone', width: 130 },
        { title: 'Account Value', type: 'currency', width: 130 },
        { title: 'Account Manager', type: 'person', width: 160 },
        { title: 'Last Meeting', type: 'date', width: 120 }
      ],
      frozenColumns: ['Client Name', 'Company'],
      primaryColumn: 'Client Name'
    },
    {
      id: 'employees',
      label: 'Employees',
      singular: 'employee',
      plural: 'employees',
      description: 'Manage employee information and HR processes',
      defaultColumns: [
        { title: 'Employee Name', type: 'text', required: true, width: 200 },
        { title: 'Department', type: 'text', width: 150 },
        { title: 'Status', type: 'status', options: [
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'On Leave', value: 'on-leave', color: '#fdab3d' },
          { label: 'Terminated', value: 'terminated', color: '#e2445c' }
        ], width: 120 },
        { title: 'Position', type: 'text', width: 180 },
        { title: 'Email', type: 'email', width: 200 },
        { title: 'Phone', type: 'phone', width: 130 },
        { title: 'Start Date', type: 'date', width: 120 },
        { title: 'Salary', type: 'currency', width: 120 }
      ],
      frozenColumns: ['Employee Name'],
      primaryColumn: 'Employee Name'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      singular: 'campaign',
      plural: 'campaigns',
      description: 'Track marketing campaigns and their performance',
      defaultColumns: [
        { title: 'Campaign Name', type: 'text', required: true, width: 220 },
        { title: 'Status', type: 'status', options: [
          { label: 'Planning', value: 'planning', color: '#c4c4c4' },
          { label: 'Active', value: 'active', color: '#00c875' },
          { label: 'Paused', value: 'paused', color: '#fdab3d' },
          { label: 'Completed', value: 'completed', color: '#579bfc' }
        ], width: 120 },
        { title: 'Budget', type: 'currency', width: 120 },
        { title: 'Spend', type: 'currency', width: 120 },
        { title: 'Campaign Manager', type: 'person', width: 160 },
        { title: 'Start Date', type: 'date', width: 120 },
        { title: 'End Date', type: 'date', width: 120 },
        { title: 'ROI', type: 'progress', width: 100 }
      ],
      frozenColumns: ['Campaign Name'],
      primaryColumn: 'Campaign Name'
    },
    {
      id: 'budgets',
      label: 'Budgets',
      singular: 'budget',
      plural: 'budgets',
      description: 'Track budgets and financial planning',
      defaultColumns: [
        { title: 'Budget Item', type: 'text', required: true, width: 220 },
        { title: 'Category', type: 'dropdown', options: [
          'Marketing', 'Operations', 'R&D', 'HR', 'Sales', 'Other'
        ], width: 130 },
        { title: 'Status', type: 'status', options: [
          { label: 'Planning', value: 'planning', color: '#c4c4c4' },
          { label: 'Approved', value: 'approved', color: '#00c875' },
          { label: 'On Hold', value: 'on-hold', color: '#fdab3d' },
          { label: 'Rejected', value: 'rejected', color: '#e2445c' }
        ], width: 120 },
        { title: 'Budgeted Amount', type: 'currency', width: 140 },
        { title: 'Actual Spend', type: 'currency', width: 130 },
        { title: 'Variance', type: 'currency', width: 120 },
        { title: 'Owner', type: 'person', width: 150 },
        { title: 'Period', type: 'text', width: 120 }
      ],
      frozenColumns: ['Budget Item'],
      primaryColumn: 'Budget Item'
    },
    {
      id: 'creatives',
      label: 'Creatives',
      singular: 'creative',
      plural: 'creatives',
      description: 'Manage creative assets and design projects',
      defaultColumns: [
        { title: 'Creative Name', type: 'text', required: true, width: 220 },
        { title: 'Type', type: 'dropdown', options: [
          'Logo', 'Banner', 'Social Media', 'Print', 'Video', 'Other'
        ], width: 130 },
        { title: 'Status', type: 'status', options: [
          { label: 'Brief', value: 'brief', color: '#c4c4c4' },
          { label: 'Design', value: 'design', color: '#fdab3d' },
          { label: 'Review', value: 'review', color: '#579bfc' },
          { label: 'Approved', value: 'approved', color: '#00c875' },
          { label: 'Rejected', value: 'rejected', color: '#e2445c' }
        ], width: 120 },
        { title: 'Designer', type: 'person', width: 150 },
        { title: 'Client', type: 'text', width: 150 },
        { title: 'Due Date', type: 'date', width: 120 },
        { title: 'File', type: 'file', width: 120 }
      ],
      frozenColumns: ['Creative Name'],
      primaryColumn: 'Creative Name'
    },
    {
      id: 'custom',
      label: 'Custom',
      singular: 'item',
      plural: 'items',
      description: 'Create a custom board structure',
      defaultColumns: [
        { title: 'Name', type: 'text', required: true, width: 200 },
        { title: 'Status', type: 'status', options: [
          { label: 'Not Started', value: 'not-started', color: '#c4c4c4' },
          { label: 'Working on it', value: 'working', color: '#fdab3d' },
          { label: 'Done', value: 'done', color: '#00c875' }
        ], width: 120 }
      ],
      frozenColumns: ['Name'],
      primaryColumn: 'Name'
    }
  ];
};