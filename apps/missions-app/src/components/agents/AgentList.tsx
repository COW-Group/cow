import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Play,
  Pause,
  Settings,
  MoreHorizontal,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Activity,
  Zap
} from 'lucide-react';
import { Agent, AgentStatus, AgentType } from '../../types/agent.types';
import { useAgentStore } from '../../store/agent.store';
import { Button } from '../ui/Button';

interface AgentListProps {
  onAgentSelect?: (agent: Agent) => void;
  onCreateAgent?: () => void;
  showActions?: boolean;
}

export function AgentList({ onAgentSelect, onCreateAgent, showActions = true }: AgentListProps) {
  const { 
    getAgents, 
    startAgent, 
    stopAgent, 
    restartAgent, 
    filters,
    setFilters,
    clearFilters 
  } = useAgentStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());

  const agents = getAgents();

  const getAgentIcon = (type: AgentType) => {
    switch (type) {
      case 'sales': return '💼';
      case 'service': return '🎧';
      case 'marketing': return '📢';
      case 'analytics': return '📊';
      case 'operations': return '⚙️';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'training': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paused': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: AgentStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'training': return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-blue-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatMetric = (value: number, type: 'currency' | 'percentage' | 'number' | 'time') => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0 
        }).format(value);
      case 'percentage':
        return `${Math.round(value * 100)}%`;
      case 'time':
        return `${Math.round(value)}min`;
      default:
        return value.toLocaleString();
    }
  };

  const handleAgentAction = async (action: string, agentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      switch (action) {
        case 'start':
          await startAgent(agentId);
          break;
        case 'stop':
          await stopAgent(agentId);
          break;
        case 'restart':
          await restartAgent(agentId);
          break;
        default:
          console.log(`Action ${action} for agent ${agentId}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} agent:`, error);
    }
  };

  const handleAgentSelect = (agent: Agent) => {
    onAgentSelect?.(agent);
  };

  const filteredAgents = agents.filter(agent => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.type.toLowerCase().includes(query) ||
        agent.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const totalTasks = agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0);
  const avgSuccessRate = agents.length > 0 
    ? agents.reduce((sum, a) => sum + a.metrics.successRate, 0) / agents.length 
    : 0;
  const totalSavings = agents.reduce((sum, a) => sum + a.metrics.costSavings, 0);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Workforce</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor your AI agents</p>
          </div>
          {onCreateAgent && (
            <Button onClick={onCreateAgent} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Agent
            </Button>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Bot className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600 font-medium">Active Agents</p>
                <p className="text-2xl font-bold text-emerald-900">{activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tasks Completed</p>
                <p className="text-2xl font-bold text-blue-900">{formatMetric(totalTasks, 'number')}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">{formatMetric(avgSuccessRate, 'percentage')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Cost Savings</p>
                <p className="text-2xl font-bold text-green-900">{formatMetric(totalSavings, 'currency')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-auto p-6">
        {filteredAgents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No agents found' : 'No agents created yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first AI agent to start automating tasks'}
            </p>
            {!searchQuery && onCreateAgent && (
              <Button onClick={onCreateAgent}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAgents.map((agent) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                {...({ className: "bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer" } as any)}
                onClick={() => handleAgentSelect(agent)}
              >
                <div className="flex items-start justify-between">
                  {/* Agent Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
                      {getAgentIcon(agent.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                        {agent.metrics.currentTasks > 0 && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {agent.metrics.currentTasks} active tasks
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{agent.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Bot className="h-4 w-4" />
                          {agent.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {agent.capabilities.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Updated {new Date(agent.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMetric(agent.metrics.successRate, 'percentage')}
                      </div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMetric(agent.metrics.tasksCompleted, 'number')}
                      </div>
                      <div className="text-xs text-gray-500">Tasks Done</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatMetric(agent.metrics.costSavings, 'currency')}
                      </div>
                      <div className="text-xs text-gray-500">Saved</div>
                    </div>

                    {/* Action Buttons */}
                    {showActions && (
                      <div className="flex items-center gap-2">
                        {agent.status === 'active' ? (
                          <button
                            onClick={(e) => handleAgentAction('stop', agent.id, e)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Stop agent"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleAgentAction('start', agent.id, e)}
                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Start agent"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => handleAgentAction('restart', agent.id, e)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Restart agent"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Settings for', agent.id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Agent settings"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('More actions for', agent.id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats Bar */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{agent.availability.currentTasks}</div>
                      <div className="text-xs text-gray-500">Current Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {formatMetric(agent.metrics.averageCompletionTime, 'time')}
                      </div>
                      <div className="text-xs text-gray-500">Avg. Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{agent.metrics.escalationsToHuman}</div>
                      <div className="text-xs text-gray-500">Escalations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {agent.metrics.customerSatisfaction ? agent.metrics.customerSatisfaction.toFixed(1) : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {agent.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {agent.tags.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{agent.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}