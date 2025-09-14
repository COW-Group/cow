import { create } from 'zustand';
import { 
  Agent, 
  AgentTemplate, 
  AgentAssignment, 
  AgentInteraction, 
  AgentTeam, 
  CreateAgentData, 
  UpdateAgentData, 
  AgentFilters,
  AgentType,
  AgentStatus,
  AgentCapability
} from '../types/agent.types';

// Mock agent templates inspired by Salesforce Agentforce
const mockAgentTemplates: AgentTemplate[] = [
  {
    id: 'template-sales-sdr',
    name: 'Sales Development Representative',
    description: 'Automated lead qualification and initial outreach',
    type: 'sales',
    category: 'Sales',
    defaultInstructions: [
      {
        id: 'instr-1',
        title: 'Lead Qualification',
        description: 'Qualify incoming leads based on BANT criteria',
        prompt: 'Evaluate leads based on Budget, Authority, Need, and Timeline. Score each lead 1-10.',
        priority: 1
      }
    ],
    defaultGuardrails: [
      {
        id: 'guard-1',
        name: 'Professional Communication',
        type: 'content-filter',
        rules: ['Always maintain professional tone', 'No aggressive sales tactics'],
        enabled: true,
        severity: 'high'
      }
    ],
    recommendedSkills: [
      {
        id: 'skill-1',
        name: 'Lead Scoring',
        category: 'Sales',
        description: 'Ability to score and prioritize leads',
        level: 'intermediate',
        actions: ['lead-score', 'lead-qualify']
      }
    ],
    capabilities: ['customer-interaction', 'data-analysis', 'decision-making'],
    tags: ['sales', 'lead-generation', 'outreach']
  },
  {
    id: 'template-customer-service',
    name: 'Customer Service Agent',
    description: 'Handle customer inquiries and support tickets',
    type: 'service',
    category: 'Service',
    defaultInstructions: [
      {
        id: 'instr-2',
        title: 'Ticket Resolution',
        description: 'Resolve customer issues efficiently and empathetically',
        prompt: 'Address customer concerns with empathy, provide clear solutions, and escalate when necessary.',
        priority: 1
      }
    ],
    defaultGuardrails: [
      {
        id: 'guard-2',
        name: 'Customer Data Protection',
        type: 'data-access',
        rules: ['Never share personal customer data', 'Verify customer identity before accessing accounts'],
        enabled: true,
        severity: 'critical'
      }
    ],
    recommendedSkills: [
      {
        id: 'skill-2',
        name: 'Issue Resolution',
        category: 'Service',
        description: 'Systematic approach to resolving customer issues',
        level: 'intermediate',
        actions: ['ticket-update', 'escalate-ticket', 'customer-notify']
      }
    ],
    capabilities: ['customer-interaction', 'task-execution', 'decision-making'],
    tags: ['customer-service', 'support', 'helpdesk']
  },
  {
    id: 'template-data-analyst',
    name: 'Data Analysis Agent',
    description: 'Automated data analysis and reporting',
    type: 'analytics',
    category: 'Analytics',
    defaultInstructions: [
      {
        id: 'instr-3',
        title: 'Data Analysis',
        description: 'Analyze data patterns and generate insights',
        prompt: 'Analyze data for trends, anomalies, and actionable insights. Present findings clearly.',
        priority: 1
      }
    ],
    defaultGuardrails: [
      {
        id: 'guard-3',
        name: 'Data Accuracy',
        type: 'data-access',
        rules: ['Verify data sources', 'Include confidence intervals in analysis'],
        enabled: true,
        severity: 'high'
      }
    ],
    recommendedSkills: [
      {
        id: 'skill-3',
        name: 'Statistical Analysis',
        category: 'Analytics',
        description: 'Advanced statistical analysis capabilities',
        level: 'advanced',
        actions: ['data-query', 'report-generate', 'trend-analysis']
      }
    ],
    capabilities: ['data-analysis', 'content-generation', 'decision-making'],
    tags: ['analytics', 'reporting', 'insights']
  }
];

// Mock agents data
const mockAgents: Agent[] = [
  {
    id: 'agent-sales-001',
    name: 'Sarah Sales Bot',
    description: 'AI agent specialized in lead qualification and sales outreach',
    type: 'sales',
    status: 'active',
    instructions: mockAgentTemplates[0].defaultInstructions,
    guardrails: mockAgentTemplates[0].defaultGuardrails,
    skills: mockAgentTemplates[0].recommendedSkills,
    capabilities: mockAgentTemplates[0].capabilities,
    managerId: 'user-1',
    teamIds: ['team-sales'],
    availability: {
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5],
      maxConcurrentTasks: 10,
      currentTasks: 3
    },
    metrics: {
      tasksCompleted: 156,
      tasksInProgress: 3,
      successRate: 0.87,
      averageCompletionTime: 45,
      escalationsToHuman: 12,
      costSavings: 15000,
      customerSatisfaction: 4.2,
      lastActiveAt: new Date().toISOString(),
      totalRuntime: 240
    },
    integrations: {
      salesforce: { enabled: true, config: {} },
      slack: { enabled: true, config: {} }
    },
    version: '1.2.0',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'user-1',
    tags: ['sales', 'lead-gen', 'outreach'],
    modelConfig: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are a professional sales development representative focused on lead qualification.'
    }
  },
  {
    id: 'agent-service-001',
    name: 'Customer Care Bot',
    description: 'AI agent for customer support and issue resolution',
    type: 'service',
    status: 'active',
    instructions: mockAgentTemplates[1].defaultInstructions,
    guardrails: mockAgentTemplates[1].defaultGuardrails,
    skills: mockAgentTemplates[1].recommendedSkills,
    capabilities: mockAgentTemplates[1].capabilities,
    managerId: 'user-2',
    teamIds: ['team-support'],
    availability: {
      timezone: 'America/New_York',
      workingHours: { start: '00:00', end: '23:59' },
      workingDays: [0, 1, 2, 3, 4, 5, 6],
      maxConcurrentTasks: 15,
      currentTasks: 7
    },
    metrics: {
      tasksCompleted: 342,
      tasksInProgress: 7,
      successRate: 0.91,
      averageCompletionTime: 25,
      escalationsToHuman: 28,
      costSavings: 25000,
      customerSatisfaction: 4.5,
      lastActiveAt: new Date().toISOString(),
      totalRuntime: 720
    },
    integrations: {
      zendesk: { enabled: true, config: {} },
      slack: { enabled: true, config: {} }
    },
    version: '1.1.0',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'user-2',
    tags: ['customer-service', 'support', '24-7'],
    modelConfig: {
      model: 'gpt-4',
      temperature: 0.6,
      maxTokens: 1500,
      systemPrompt: 'You are a helpful customer service representative focused on resolving issues quickly and empathetically.'
    }
  },
  {
    id: 'agent-analytics-001',
    name: 'Data Insights Bot',
    description: 'AI agent for data analysis and reporting',
    type: 'analytics',
    status: 'training',
    instructions: mockAgentTemplates[2].defaultInstructions,
    guardrails: mockAgentTemplates[2].defaultGuardrails,
    skills: mockAgentTemplates[2].recommendedSkills,
    capabilities: mockAgentTemplates[2].capabilities,
    managerId: 'user-3',
    teamIds: ['team-analytics'],
    availability: {
      timezone: 'America/New_York',
      workingHours: { start: '06:00', end: '22:00' },
      workingDays: [1, 2, 3, 4, 5],
      maxConcurrentTasks: 5,
      currentTasks: 0
    },
    metrics: {
      tasksCompleted: 45,
      tasksInProgress: 0,
      successRate: 0.95,
      averageCompletionTime: 120,
      escalationsToHuman: 3,
      costSavings: 8000,
      lastActiveAt: new Date().toISOString(),
      totalRuntime: 96
    },
    integrations: {
      tableau: { enabled: true, config: {} },
      powerbi: { enabled: false, config: {} }
    },
    version: '0.9.0',
    createdAt: '2024-02-01T14:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: 'user-3',
    tags: ['analytics', 'insights', 'reporting'],
    modelConfig: {
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 3000,
      systemPrompt: 'You are a data analyst focused on providing accurate insights and clear visualizations.'
    }
  }
];

// Mock agent teams
const mockAgentTeams: AgentTeam[] = [
  {
    id: 'team-sales',
    name: 'Sales Force',
    description: 'AI agents focused on sales activities and lead generation',
    managerId: 'user-1',
    agentIds: ['agent-sales-001'],
    specialization: 'Sales and Lead Generation',
    objectives: ['Increase lead qualification rate', 'Reduce response time', 'Improve conversion rates'],
    kpis: [
      { name: 'Leads Qualified', target: 500, current: 342, unit: 'leads/month' },
      { name: 'Response Time', target: 30, current: 45, unit: 'minutes' },
      { name: 'Conversion Rate', target: 15, current: 12, unit: 'percentage' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'team-support',
    name: 'Customer Success Team',
    description: 'AI agents handling customer support and service',
    managerId: 'user-2',
    agentIds: ['agent-service-001'],
    specialization: 'Customer Support and Service',
    objectives: ['Reduce ticket resolution time', 'Increase customer satisfaction', 'Minimize escalations'],
    kpis: [
      { name: 'Tickets Resolved', target: 800, current: 650, unit: 'tickets/month' },
      { name: 'Customer Satisfaction', target: 4.5, current: 4.2, unit: 'rating' },
      { name: 'Escalation Rate', target: 5, current: 8, unit: 'percentage' }
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: new Date().toISOString()
  }
];

// Mock agent assignments
const mockAgentAssignments: AgentAssignment[] = [
  {
    id: 'assignment-1',
    agentId: 'agent-sales-001',
    taskId: 'board-item-1',
    taskType: 'board-item',
    assignedAt: new Date().toISOString(),
    assignedBy: 'user-1',
    priority: 'high',
    status: 'in-progress',
    context: { leadSource: 'website', industry: 'technology' },
    estimatedDuration: 60,
    notes: 'High-value enterprise lead requiring careful qualification'
  },
  {
    id: 'assignment-2',
    agentId: 'agent-service-001',
    taskId: 'ticket-123',
    taskType: 'custom',
    assignedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assignedBy: 'system',
    priority: 'medium',
    status: 'completed',
    context: { ticketType: 'billing', customerTier: 'premium' },
    estimatedDuration: 30,
    actualDuration: 25,
    notes: 'Billing inquiry resolved successfully'
  }
];

interface AgentStore {
  // State
  agents: Agent[];
  agentTemplates: AgentTemplate[];
  agentTeams: AgentTeam[];
  agentAssignments: AgentAssignment[];
  filters: AgentFilters;
  selectedAgent: Agent | null;
  
  // Actions
  getAgents: () => Agent[];
  getAgentById: (id: string) => Agent | undefined;
  getAgentsByType: (type: AgentType) => Agent[];
  getAgentsByStatus: (status: AgentStatus) => Agent[];
  createAgent: (data: CreateAgentData) => Promise<Agent>;
  updateAgent: (id: string, data: UpdateAgentData) => Promise<Agent>;
  deleteAgent: (id: string) => Promise<void>;
  
  // Agent management
  startAgent: (id: string) => Promise<void>;
  stopAgent: (id: string) => Promise<void>;
  restartAgent: (id: string) => Promise<void>;
  
  // Templates
  getAgentTemplates: () => AgentTemplate[];
  createAgentFromTemplate: (templateId: string, customData: Partial<CreateAgentData>) => Promise<Agent>;
  
  // Teams
  getAgentTeams: () => AgentTeam[];
  createAgentTeam: (teamData: Omit<AgentTeam, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AgentTeam>;
  assignAgentToTeam: (agentId: string, teamId: string) => Promise<void>;
  removeAgentFromTeam: (agentId: string, teamId: string) => Promise<void>;
  
  // Assignments
  getAgentAssignments: (agentId?: string) => AgentAssignment[];
  assignAgentToTask: (assignment: Omit<AgentAssignment, 'id' | 'assignedAt'>) => Promise<AgentAssignment>;
  assignAgentsToTask: (agentIds: string[], taskId: string, taskType: AgentAssignment['taskType']) => Promise<AgentAssignment[]>;
  unassignAgentFromTask: (agentId: string, taskId: string) => Promise<void>;
  updateAssignmentStatus: (assignmentId: string, status: AgentAssignment['status']) => Promise<void>;
  
  // Filters and search
  setFilters: (filters: Partial<AgentFilters>) => void;
  clearFilters: () => void;
  setSelectedAgent: (agent: Agent | null) => void;
  
  // Analytics
  getAgentMetrics: (agentId: string) => Agent['metrics'] | undefined;
  getTeamMetrics: (teamId: string) => any;
  getOverallMetrics: () => any;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  // Initial state
  agents: mockAgents,
  agentTemplates: mockAgentTemplates,
  agentTeams: mockAgentTeams,
  agentAssignments: mockAgentAssignments,
  filters: {},
  selectedAgent: null,
  
  // Basic getters
  getAgents: () => {
    const { agents, filters } = get();
    let filteredAgents = [...agents];
    
    if (filters.type) {
      filteredAgents = filteredAgents.filter(agent => agent.type === filters.type);
    }
    
    if (filters.status) {
      filteredAgents = filteredAgents.filter(agent => agent.status === filters.status);
    }
    
    if (filters.capabilities && filters.capabilities.length > 0) {
      filteredAgents = filteredAgents.filter(agent => 
        filters.capabilities!.some(cap => agent.capabilities.includes(cap))
      );
    }
    
    if (filters.managerId) {
      filteredAgents = filteredAgents.filter(agent => agent.managerId === filters.managerId);
    }
    
    if (filters.teamId) {
      filteredAgents = filteredAgents.filter(agent => agent.teamIds.includes(filters.teamId!));
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredAgents = filteredAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchLower) ||
        agent.description.toLowerCase().includes(searchLower) ||
        agent.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return filteredAgents;
  },
  
  getAgentById: (id: string) => {
    return get().agents.find(agent => agent.id === id);
  },
  
  getAgentsByType: (type: AgentType) => {
    return get().agents.filter(agent => agent.type === type);
  },
  
  getAgentsByStatus: (status: AgentStatus) => {
    return get().agents.filter(agent => agent.status === status);
  },
  
  // Agent CRUD operations
  createAgent: async (data: CreateAgentData) => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'inactive',
      instructions: data.instructions.map((inst, index) => ({
        ...inst,
        id: `inst-${Date.now()}-${index}`
      })),
      guardrails: data.guardrails.map((guard, index) => ({
        ...guard,
        id: `guard-${Date.now()}-${index}`
      })),
      skills: [],
      capabilities: data.capabilities,
      managerId: data.managerId,
      teamIds: data.teamIds || [],
      availability: data.availability,
      metrics: {
        tasksCompleted: 0,
        tasksInProgress: 0,
        successRate: 0,
        averageCompletionTime: 0,
        escalationsToHuman: 0,
        costSavings: 0,
        lastActiveAt: new Date().toISOString(),
        totalRuntime: 0
      },
      integrations: {},
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      tags: data.tags || [],
      modelConfig: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        systemPrompt: `You are ${data.name}. ${data.description}`,
        ...data.modelConfig
      }
    };
    
    set(state => ({
      agents: [...state.agents, newAgent]
    }));
    
    return newAgent;
  },
  
  updateAgent: async (id: string, data: UpdateAgentData) => {
    set(state => ({
      agents: state.agents.map(agent => 
        agent.id === id 
          ? { 
              ...agent, 
              ...data, 
              updatedAt: new Date().toISOString() 
            }
          : agent
      )
    }));
    
    const updatedAgent = get().agents.find(agent => agent.id === id);
    if (!updatedAgent) {
      throw new Error('Agent not found');
    }
    
    return updatedAgent;
  },
  
  deleteAgent: async (id: string) => {
    set(state => ({
      agents: state.agents.filter(agent => agent.id !== id),
      agentAssignments: state.agentAssignments.filter(assignment => assignment.agentId !== id),
      selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent
    }));
  },
  
  // Agent management operations
  startAgent: async (id: string) => {
    await get().updateAgent(id, { status: 'active' });
  },
  
  stopAgent: async (id: string) => {
    await get().updateAgent(id, { status: 'inactive' });
  },
  
  restartAgent: async (id: string) => {
    await get().updateAgent(id, { status: 'inactive' });
    setTimeout(() => {
      get().updateAgent(id, { status: 'active' });
    }, 1000);
  },
  
  // Template operations
  getAgentTemplates: () => get().agentTemplates,
  
  createAgentFromTemplate: async (templateId: string, customData: Partial<CreateAgentData>) => {
    const template = get().agentTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    const agentData: CreateAgentData = {
      name: customData.name || template.name,
      description: customData.description || template.description,
      type: template.type,
      capabilities: template.capabilities,
      instructions: template.defaultInstructions,
      guardrails: template.defaultGuardrails,
      availability: customData.availability || {
        timezone: 'America/New_York',
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: [1, 2, 3, 4, 5],
        maxConcurrentTasks: 5,
        currentTasks: 0
      },
      ...customData
    };
    
    return get().createAgent(agentData);
  },
  
  // Team operations
  getAgentTeams: () => get().agentTeams,
  
  createAgentTeam: async (teamData) => {
    const newTeam: AgentTeam = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      agentTeams: [...state.agentTeams, newTeam]
    }));
    
    return newTeam;
  },
  
  assignAgentToTeam: async (agentId: string, teamId: string) => {
    set(state => ({
      agents: state.agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, teamIds: [...agent.teamIds, teamId] }
          : agent
      ),
      agentTeams: state.agentTeams.map(team =>
        team.id === teamId
          ? { ...team, agentIds: [...team.agentIds, agentId] }
          : team
      )
    }));
  },
  
  removeAgentFromTeam: async (agentId: string, teamId: string) => {
    set(state => ({
      agents: state.agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, teamIds: agent.teamIds.filter(id => id !== teamId) }
          : agent
      ),
      agentTeams: state.agentTeams.map(team =>
        team.id === teamId
          ? { ...team, agentIds: team.agentIds.filter(id => id !== agentId) }
          : team
      )
    }));
  },
  
  // Assignment operations
  getAgentAssignments: (agentId?: string) => {
    const assignments = get().agentAssignments;
    return agentId ? assignments.filter(a => a.agentId === agentId) : assignments;
  },
  
  assignAgentToTask: async (assignment) => {
    const newAssignment: AgentAssignment = {
      ...assignment,
      id: `assignment-${Date.now()}`,
      assignedAt: new Date().toISOString()
    };
    
    set(state => ({
      agentAssignments: [...state.agentAssignments, newAssignment],
      // Update agent's current task count
      agents: state.agents.map(agent => 
        agent.id === assignment.agentId
          ? { ...agent, availability: { ...agent.availability, currentTasks: agent.availability.currentTasks + 1 } }
          : agent
      )
    }));
    
    return newAssignment;
  },
  
  // Bulk assign agents to a task
  assignAgentsToTask: async (agentIds: string[], taskId: string, taskType: AgentAssignment['taskType']) => {
    const assignments = agentIds.map(agentId => ({
      agentId,
      taskId,
      taskType,
      assignedBy: 'current-user',
      priority: 'medium' as const,
      status: 'assigned' as const,
      context: {}
    }));
    
    const newAssignments = await Promise.all(
      assignments.map(assignment => get().assignAgentToTask(assignment))
    );
    
    return newAssignments;
  },
  
  // Remove agent from task
  unassignAgentFromTask: async (agentId: string, taskId: string) => {
    set(state => ({
      agentAssignments: state.agentAssignments.filter(
        a => !(a.agentId === agentId && a.taskId === taskId)
      ),
      // Update agent's current task count
      agents: state.agents.map(agent => 
        agent.id === agentId
          ? { ...agent, availability: { ...agent.availability, currentTasks: Math.max(0, agent.availability.currentTasks - 1) } }
          : agent
      )
    }));
  },
  
  updateAssignmentStatus: async (assignmentId: string, status: AgentAssignment['status']) => {
    set(state => ({
      agentAssignments: state.agentAssignments.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status }
          : assignment
      )
    }));
  },
  
  // Filter operations
  setFilters: (filters: Partial<AgentFilters>) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
  
  setSelectedAgent: (agent: Agent | null) => {
    set({ selectedAgent: agent });
  },
  
  // Analytics
  getAgentMetrics: (agentId: string) => {
    const agent = get().getAgentById(agentId);
    return agent?.metrics;
  },
  
  getTeamMetrics: (teamId: string) => {
    const team = get().agentTeams.find(t => t.id === teamId);
    if (!team) return null;
    
    const teamAgents = get().agents.filter(agent => agent.teamIds.includes(teamId));
    const totalTasks = teamAgents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
    const avgSuccessRate = teamAgents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / teamAgents.length;
    const totalSavings = teamAgents.reduce((sum, agent) => sum + agent.metrics.costSavings, 0);
    
    return {
      teamName: team.name,
      agentCount: teamAgents.length,
      totalTasks,
      avgSuccessRate,
      totalSavings,
      kpis: team.kpis
    };
  },
  
  getOverallMetrics: () => {
    const agents = get().agents;
    const activeAgents = agents.filter(agent => agent.status === 'active');
    const totalTasks = agents.reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0);
    const avgSuccessRate = agents.reduce((sum, agent) => sum + agent.metrics.successRate, 0) / agents.length;
    const totalSavings = agents.reduce((sum, agent) => sum + agent.metrics.costSavings, 0);
    const totalRuntime = agents.reduce((sum, agent) => sum + agent.metrics.totalRuntime, 0);
    
    return {
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      totalTasks,
      avgSuccessRate,
      totalSavings,
      totalRuntime
    };
  }
}));