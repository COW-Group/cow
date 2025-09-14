// Agent Management Types - Inspired by Salesforce Agentforce
export type AgentType = 'sales' | 'service' | 'marketing' | 'operations' | 'analytics' | 'custom';
export type AgentStatus = 'active' | 'inactive' | 'training' | 'paused' | 'error';
export type AgentCapability = 'data-analysis' | 'customer-interaction' | 'workflow-automation' | 'content-generation' | 'decision-making' | 'task-execution';
export type AgentSkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Agent Configuration
export interface AgentInstruction {
  id: string;
  title: string;
  description: string;
  prompt: string;
  priority: number;
  conditions?: string[];
}

export interface AgentGuardrail {
  id: string;
  name: string;
  type: 'content-filter' | 'data-access' | 'action-limit' | 'approval-required';
  rules: string[];
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentAction {
  id: string;
  name: string;
  description: string;
  type: 'api-call' | 'workflow-trigger' | 'data-query' | 'notification' | 'task-creation';
  parameters: Record<string, any>;
  requiresApproval: boolean;
  estimatedDuration?: number; // in minutes
}

export interface AgentSkill {
  id: string;
  name: string;
  category: string;
  description: string;
  level: AgentSkillLevel;
  prerequisites?: string[];
  actions: string[]; // Action IDs this skill enables
}

// Agent Performance Metrics
export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  currentTasks: number;
  successRate: number;
  averageCompletionTime: number; // in minutes
  escalationsToHuman: number;
  costSavings: number;
  customerSatisfaction?: number;
  lastActiveAt: string;
  totalRuntime: number; // in hours
}

// Agent Assignment and Availability
export interface AgentAvailability {
  timezone: string;
  workingHours: {
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
  workingDays: number[]; // 0-6, Sunday-Saturday
  maxConcurrentTasks: number;
  currentTasks: number;
}

// Main Agent Interface
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  
  // Configuration
  instructions: AgentInstruction[];
  guardrails: AgentGuardrail[];
  skills: AgentSkill[];
  capabilities: AgentCapability[];
  
  // Assignment and Management
  managerId?: string; // User ID of the human manager
  teamIds: string[];  // Team IDs this agent belongs to
  availability: AgentAvailability;
  
  // Performance and Analytics
  metrics: AgentMetrics;
  
  // Integration
  integrations: {
    [key: string]: {
      enabled: boolean;
      config: Record<string, any>;
    };
  };
  
  // Metadata
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  
  // AI Model Configuration
  modelConfig: {
    model: string;
    temperature: number;
    maxTokens: number;
    systemPrompt: string;
  };
}

// Agent Template for quick agent creation
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  defaultInstructions: AgentInstruction[];
  defaultGuardrails: AgentGuardrail[];
  recommendedSkills: AgentSkill[];
  capabilities: AgentCapability[];
  previewImage?: string;
  category: string;
  tags: string[];
}

// Agent Assignment to Tasks/Items
export interface AgentAssignment {
  id: string;
  agentId: string;
  taskId: string; // Board item ID, workflow ID, etc.
  taskType: 'board-item' | 'workflow' | 'goal' | 'project' | 'custom';
  assignedAt: string;
  assignedBy: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in-progress' | 'completed' | 'failed' | 'escalated';
  context: Record<string, any>; // Additional context for the assignment
  estimatedDuration?: number;
  actualDuration?: number;
  notes?: string;
}

// Agent Conversation/Interaction Log
export interface AgentInteraction {
  id: string;
  agentId: string;
  userId?: string; // If interacting with a human
  taskId?: string;
  type: 'task-execution' | 'human-handoff' | 'error-handling' | 'decision-point';
  content: string;
  metadata: Record<string, any>;
  timestamp: string;
  confidence?: number; // AI confidence score
}

// Agent Learning and Training Data
export interface AgentTrainingData {
  id: string;
  agentId: string;
  type: 'success-case' | 'failure-case' | 'feedback' | 'correction';
  scenario: string;
  expectedOutput: string;
  actualOutput?: string;
  feedback: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

// Agent Team/Workforce Management
export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  managerId: string;
  agentIds: string[];
  specialization?: string;
  objectives: string[];
  kpis: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Agent Deployment and Environment
export interface AgentDeployment {
  id: string;
  agentId: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  deployedAt: string;
  deployedBy: string;
  healthStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
  resourceUsage: {
    cpu: number;
    memory: number;
    requests: number;
  };
}

// Data for agent creation and management
export interface CreateAgentData {
  name: string;
  description: string;
  type: AgentType;
  templateId?: string;
  managerId?: string;
  teamIds?: string[];
  capabilities: AgentCapability[];
  instructions: Omit<AgentInstruction, 'id'>[];
  guardrails: Omit<AgentGuardrail, 'id'>[];
  availability: AgentAvailability;
  modelConfig?: Partial<Agent['modelConfig']>;
  tags?: string[];
}

export interface UpdateAgentData extends Partial<CreateAgentData> {
  status?: AgentStatus;
}

// Agent Store State Interface
export interface AgentFilters {
  type?: AgentType;
  status?: AgentStatus;
  capabilities?: AgentCapability[];
  managerId?: string;
  teamId?: string;
  tags?: string[];
  search?: string;
}