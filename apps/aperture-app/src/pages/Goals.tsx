import { useState, useMemo } from 'react';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { useAppStore, useWorkspaceStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Goal, GoalStatus, GoalType } from '@/types';

export function Goals() {
  const { openModal } = useAppStore();
  const { goals } = useWorkspaceStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<GoalType | 'all'>('all');

  // Generate mock goals for demonstration
  const mockGoals: Goal[] = [
    {
      id: 'goal-1',
      workspaceId: 'workspace-1',
      name: 'Increase Monthly Revenue',
      description: 'Achieve 25% growth in monthly recurring revenue',
      type: 'objective',
      status: 'active',
      targetValue: 100000,
      currentValue: 75000,
      unit: 'USD',
      ownerId: 'user-1',
      startDate: new Date('2024-01-01'),
      dueDate: new Date('2024-06-30'),
      priority: 'high',
      tags: ['revenue', 'growth'],
      linkedTasks: ['task-1', 'task-2'],
      linkedProjects: ['project-1'],
      progress: 75,
      metrics: [],
      milestones: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 'goal-2',
      workspaceId: 'workspace-1',
      name: 'Launch New Product Feature',
      description: 'Successfully release the advanced analytics dashboard',
      type: 'initiative',
      status: 'active',
      targetValue: 1,
      currentValue: 0.8,
      unit: 'completion',
      ownerId: 'user-2',
      startDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-31'),
      priority: 'urgent',
      tags: ['product', 'analytics'],
      linkedTasks: ['task-3', 'task-4'],
      linkedProjects: ['project-2'],
      progress: 80,
      metrics: [],
      milestones: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-20')
    },
    {
      id: 'goal-3',
      workspaceId: 'workspace-1',
      name: 'Improve Customer Satisfaction',
      description: 'Achieve 4.5+ star rating across all platforms',
      type: 'key_result',
      status: 'completed',
      targetValue: 4.5,
      currentValue: 4.6,
      unit: 'rating',
      ownerId: 'user-3',
      startDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-28'),
      completedAt: new Date('2024-02-25'),
      priority: 'medium',
      tags: ['customer', 'satisfaction'],
      linkedTasks: [],
      linkedProjects: ['project-3'],
      progress: 100,
      metrics: [],
      milestones: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-25')
    }
  ];

  const filteredGoals = useMemo(() => {
    return mockGoals.filter(goal => {
      if (searchQuery && !goal.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && goal.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== 'all' && goal.type !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'at_risk': return AlertCircle;
      case 'paused': return Clock;
      default: return Target;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const goalActions = [
    { id: 'edit', label: 'Edit Goal', icon: Target },
    { id: 'duplicate', label: 'Duplicate', icon: Plus },
    { id: 'archive', label: 'Archive', icon: Clock },
  ];

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const StatusIcon = getStatusIcon(goal.status);
    
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-4 ${getPriorityColor(goal.priority)} border-r border-t border-b border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <StatusIcon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {goal.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {goal.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="capitalize">{goal.type.replace('_', ' ')}</span>
                <span>•</span>
                <span>Due {goal.dueDate && new Date(goal.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(goal.status)}`}>
              {goal.status.replace('_', ' ')}
            </span>
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
              items={goalActions}
              onItemClick={(action) => {
                if (action.id === 'edit') {
                  openModal('edit-goal', { goal });
                }
              }}
              align="right"
            />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {goal.progress}%
            </span>
            {goal.progress >= 100 ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : goal.progress >= 75 ? (
              <TrendingUp className="h-4 w-4 text-blue-500" />
            ) : (
              <Clock className="h-4 w-4 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Tags */}
        {goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {goal.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Updated {new Date(goal.updatedAt).toLocaleDateString()}</span>
            </div>
            {goal.linkedTasks.length > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{goal.linkedTasks.length} tasks</span>
              </div>
            )}
          </div>
          <div className={`w-3 h-3 rounded-full ${
            goal.priority === 'urgent' ? 'bg-red-500' :
            goal.priority === 'high' ? 'bg-orange-500' :
            goal.priority === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }`} />
        </div>
      </div>
    );
  };

  const stats = {
    total: mockGoals.length,
    active: mockGoals.filter(g => g.status === 'active').length,
    completed: mockGoals.filter(g => g.status === 'completed').length,
    atRisk: mockGoals.filter(g => g.status === 'at_risk').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Goals & Objectives
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your team's progress towards strategic objectives
          </p>
        </div>
        <Button variant="primary" onClick={() => openModal('create-goal')}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.atRisk}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search goals..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as GoalStatus | 'all')}
          className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="at_risk">At Risk</option>
          <option value="paused">Paused</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as GoalType | 'all')}
          className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
        >
          <option value="all">All Types</option>
          <option value="objective">Objectives</option>
          <option value="key_result">Key Results</option>
          <option value="initiative">Initiatives</option>
          <option value="milestone">Milestones</option>
        </select>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No goals found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters or search criteria.'
              : 'Get started by creating your first goal.'}
          </p>
          {(!searchQuery && statusFilter === 'all' && typeFilter === 'all') && (
            <Button variant="primary" onClick={() => openModal('create-goal')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Goal
            </Button>
          )}
        </div>
      )}
    </div>
  );
}