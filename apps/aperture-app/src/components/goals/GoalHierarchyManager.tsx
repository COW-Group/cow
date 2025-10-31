import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  GitBranch, 
  Link, 
  Unlink, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useGoalsStore, Goal } from '../../store/goals.store';

interface GoalHierarchyManagerProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GoalHierarchyManager({ goal, isOpen, onClose }: GoalHierarchyManagerProps) {
  const { 
    goals, 
    createChildGoal, 
    addDependency, 
    removeDependency, 
    getGoalHierarchy, 
    getGoalDependencies,
    canStartGoal 
  } = useGoalsStore();
  
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'dependencies'>('hierarchy');
  const [showCreateChild, setShowCreateChild] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [newChildData, setNewChildData] = useState({
    title: '',
    description: '',
    timeline: 'Q4 2024',
    assignees: [] as string[]
  });

  if (!isOpen || !goal) return null;

  const hierarchy = getGoalHierarchy(goal.id);
  const { dependsOn, dependents } = getGoalDependencies(goal.id);
  const canStart = canStartGoal(goal.id);

  const handleCreateChild = () => {
    if (!newChildData.title.trim()) return;

    createChildGoal(goal.id, {
      title: newChildData.title,
      description: newChildData.description,
      status: 'no-recent-updates',
      progress: 0,
      timeline: newChildData.timeline,
      owner: goal.owner,
      assignees: newChildData.assignees,
      category: goal.category,
      subGoals: [],
      connections: []
    });

    setNewChildData({
      title: '',
      description: '',
      timeline: 'Q4 2024',
      assignees: []
    });
    setShowCreateChild(false);
  };

  const handleAddDependency = (dependsOnId: string) => {
    addDependency(goal.id, dependsOnId);
  };

  const handleRemoveDependency = (dependsOnId: string) => {
    removeDependency(goal.id, dependsOnId);
  };

  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on-track':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'off-track':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAvailableDependencies = () => {
    return goals.filter(g => 
      g.id !== goal.id && 
      !g.parentId && // Only top-level goals can be dependencies
      !dependsOn.some(dep => dep.id === g.id) &&
      !getGoalDependencies(g.id).dependsOn.some(dep => dep.id === goal.id) // Prevent circular deps
    );
  };

  const renderGoalHierarchy = (goals: Goal[], level = 0) => {
    return goals.map(goalItem => {
      const children = goals.filter(g => g.parentId === goalItem.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedGoals.has(goalItem.id);

      return (
        <div key={goalItem.id} className={`${level > 0 ? 'ml-6' : ''}`}>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(goalItem.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6" />}
            
            {getStatusIcon(goalItem.status)}
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">{goalItem.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {goalItem.progress}% • {goalItem.timeline}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Level {level}</span>
              {level === 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCreateChild(true)}
                  className="ml-2"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {hasChildren && isExpanded && renderGoalHierarchy(children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <GitBranch className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Goal Hierarchy & Dependencies</h2>
              <p className="text-sm text-gray-500">{goal.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hierarchy'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hierarchy
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dependencies'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dependencies
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'hierarchy' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Goal Hierarchy</h3>
                <Button
                  onClick={() => setShowCreateChild(true)}
                  size="sm"
                  disabled={showCreateChild}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Child Goal
                </Button>
              </div>

              {/* Create Child Goal Form */}
              {showCreateChild && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Create Child Goal</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Goal title"
                      value={newChildData.title}
                      onChange={(e) => setNewChildData({ ...newChildData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <textarea
                      placeholder="Goal description"
                      value={newChildData.description}
                      onChange={(e) => setNewChildData({ ...newChildData, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={newChildData.timeline}
                      onChange={(e) => setNewChildData({ ...newChildData, timeline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Q4 2024">Q4 2024</option>
                      <option value="Q1 2025">Q1 2025</option>
                      <option value="H1 2025">H1 2025</option>
                      <option value="2025">2025</option>
                    </select>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateChild} size="sm">
                        Create Child Goal
                      </Button>
                      <Button
                        onClick={() => setShowCreateChild(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hierarchy Tree */}
              <div className="space-y-2">
                {hierarchy.length > 0 ? (
                  renderGoalHierarchy([hierarchy[0]])
                ) : (
                  <div className="text-center py-8">
                    <GitBranch className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hierarchy</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This goal has no parent or child goals
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dependencies' && (
            <div className="space-y-6">
              {/* Goal Status */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {canStart ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {canStart ? 'Ready to Start' : 'Waiting on Dependencies'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {canStart 
                    ? 'All dependencies are completed. This goal can be started.'
                    : 'This goal has incomplete dependencies and should wait before starting.'
                  }
                </p>
              </div>

              {/* Dependencies (Goals this depends on) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Dependencies ({dependsOn.length})
                  </h3>
                </div>

                {dependsOn.length > 0 ? (
                  <div className="space-y-2">
                    {dependsOn.map(dep => (
                      <div key={dep.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {getStatusIcon(dep.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{dep.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dep.progress}% • {dep.timeline}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleRemoveDependency(dep.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Unlink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Link className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No dependencies</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This goal doesn't depend on any other goals
                    </p>
                  </div>
                )}

                {/* Add Dependency */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Dependency</h4>
                  <div className="space-y-2">
                    {getAvailableDependencies().map(availableGoal => (
                      <div key={availableGoal.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        {getStatusIcon(availableGoal.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{availableGoal.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {availableGoal.progress}% • {availableGoal.timeline}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAddDependency(availableGoal.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Link className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dependents (Goals that depend on this) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dependents ({dependents.length})
                </h3>

                {dependents.length > 0 ? (
                  <div className="space-y-2">
                    {dependents.map(dependent => (
                      <div key={dependent.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {getStatusIcon(dependent.status)}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{dependent.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dependent.progress}% • {dependent.timeline}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">Waiting on this goal</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Target className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No dependents</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      No other goals are waiting on this goal
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}