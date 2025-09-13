import React, { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  Target, 
  Award, 
  Users, 
  Building,
  Plus,
  Calendar,
  Filter,
  MoreHorizontal,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StrategyMap } from '../../components/goals/StrategyMap';
import { useGoalsStore } from '../../store/goals.store';
import { GoalCheckInModal } from '../../components/goals/GoalCheckInModal';

// My Goals Component
function MyGoals() {
  const [timeframe, setTimeframe] = useState('current');
  
  const goals = [
    {
      id: 'increase-user-engagement',
      title: 'Increase User Engagement',
      type: 'objective',
      progress: 78,
      status: 'on_track',
      timeframe: 'Q2 2024',
      owner: 'You',
      keyResults: [
        { id: 'kr1', title: 'Increase daily active users by 25%', progress: 85, target: '10,000 DAU' },
        { id: 'kr2', title: 'Reduce churn rate to under 5%', progress: 60, target: '<5%' },
        { id: 'kr3', title: 'Improve user satisfaction score', progress: 90, target: '4.5/5' }
      ],
      lastUpdated: '2 days ago',
      category: 'Product'
    },
    {
      id: 'revenue-growth',
      title: 'Achieve Revenue Growth',
      type: 'objective',
      progress: 45,
      status: 'at_risk',
      timeframe: 'Q2 2024',
      owner: 'You',
      keyResults: [
        { id: 'kr4', title: 'Reach $500K MRR', progress: 40, target: '$500K' },
        { id: 'kr5', title: 'Close 50 enterprise deals', progress: 55, target: '50 deals' },
        { id: 'kr6', title: 'Expand to 3 new markets', progress: 33, target: '3 markets' }
      ],
      lastUpdated: '1 day ago',
      category: 'Business'
    },
    {
      id: 'team-development',
      title: 'Build High-Performance Team',
      type: 'objective',
      progress: 92,
      status: 'on_track',
      timeframe: 'Q2 2024',
      owner: 'You',
      keyResults: [
        { id: 'kr7', title: 'Hire 5 senior engineers', progress: 100, target: '5 hires' },
        { id: 'kr8', title: 'Complete team training program', progress: 85, target: '100%' },
        { id: 'kr9', title: 'Achieve 90% employee satisfaction', progress: 90, target: '90%' }
      ],
      lastUpdated: '3 hours ago',
      category: 'People'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'behind':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track';
      case 'at_risk':
        return 'At Risk';
      case 'behind':
        return 'Behind';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'behind':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your personal objectives and key results</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="current">Current Quarter</option>
            <option value="q1">Q1 2024</option>
            <option value="q2">Q2 2024</option>
            <option value="q3">Q3 2024</option>
            <option value="q4">Q4 2024</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{goals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.filter(g => g.status === 'on_track').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Key Results</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {goals.reduce((sum, g) => sum + g.keyResults.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Goal Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(goal.status)}`}>
                        {getStatusLabel(goal.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {goal.timeframe}
                      </span>
                      <span>Category: {goal.category}</span>
                      <span>Updated {goal.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{goal.progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      goal.progress >= 70 ? 'bg-green-500' : 
                      goal.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Results */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Key Results ({goal.keyResults.length})
                </h4>
                <div className="space-y-3">
                  {goal.keyResults.map((kr) => (
                    <div key={kr.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">{kr.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Target: {kr.target}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">{kr.progress}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            kr.progress >= 70 ? 'bg-green-500' : 
                            kr.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${kr.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weighted Goals CTA */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Try Weighted Goals</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Prioritize different key results based on importance for better OKR tracking
            </p>
          </div>
          <Button>
            Learn More
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No goals set yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first goal to start tracking your objectives and key results
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      )}
    </div>
  );
}

// Team Goals Component
function TeamGoals() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Team Goals</h1>
      <p className="text-gray-600 dark:text-gray-400">Collaborate on team objectives and key results</p>
    </div>
  );
}

// Strategy Map Component (Dedicated Page)
function StrategyMapPage() {
  return (
    <div className="p-6">
      <StrategyMap />
    </div>
  );
}

// Company Goals Component
function CompanyGoals() {
  const { 
    goals, 
    filters, 
    setFilters, 
    toggleGoalExpansion, 
    calculateGoalProgress 
  } = useGoalsStore();
  
  const [timeframe, setTimeframe] = useState('current');
  const [selectedGoalForCheckIn, setSelectedGoalForCheckIn] = useState(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  
  // Filter goals to show only top-level goals (no parentId)
  const companyGoals = goals.filter(goal => !goal.parentId);

  const handleCheckInClick = (goal) => {
    setSelectedGoalForCheckIn(goal);
    setIsCheckInModalOpen(true);
  };

  const handleCloseCheckIn = () => {
    setSelectedGoalForCheckIn(null);
    setIsCheckInModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'behind':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'behind':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Strategic objectives driving organizational success</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
          >
            <option value="current">Current Quarter</option>
            <option value="q1">Q1 2024</option>
            <option value="q2">Q2 2024</option>
            <option value="q3">Q3 2024</option>
            <option value="q4">Q4 2024</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Company Goals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{companyGoals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {companyGoals.filter(g => g.status === 'on_track').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(companyGoals.reduce((sum, g) => sum + g.progress, 0) / companyGoals.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Key Results</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {companyGoals.reduce((sum, g) => sum + g.keyResults.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Goals List */}
      <div className="space-y-4">
        {companyGoals.map((goal) => (
          <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Goal Header */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleGoalExpansion(goal.id)}
                    className="flex items-center gap-2 text-left flex-1"
                  >
                    <ChevronDown 
                      className={`h-4 w-4 text-gray-400 transform transition-transform ${
                        goal.isExpanded ? 'rotate-0' : '-rotate-90'
                      }`} 
                    />
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">G</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Goal</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.status === 'on-track' ? 'On track' : 
                       goal.status === 'no-recent-updates' ? 'No recent updates' :
                       goal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {goal.progress}%
                    </span>
                    {goal.progress > 0 && <Zap className="h-4 w-4 text-yellow-500" />}
                  </div>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.timeline}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCheckInClick(goal)}
                  >
                    Check in
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Goal Title */}
              <div className="mb-3 ml-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                  {goal.title}
                </h3>
                {goal.subGoals.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.subGoals.length} sub-goals
                  </span>
                )}
              </div>

              {/* Expandable Sub-Goals */}
              {goal.isExpanded && goal.subGoals.length > 0 && (
                <div className="ml-6 space-y-2">
                  {goal.subGoals.map((subGoal) => (
                    <div key={subGoal.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-600 dark:text-gray-400">△</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {subGoal.owner}
                              </span>
                              <span className={`px-1.5 py-0.5 text-xs rounded ${
                                subGoal.status === 'on-track' ? 'bg-green-100 text-green-800' :
                                subGoal.status === 'no-recent-updates' ? 'bg-gray-100 text-gray-600' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {subGoal.status === 'no-recent-updates' ? 'No status' : 
                                 subGoal.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {subGoal.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {subGoal.progress}%
                            </span>
                            {subGoal.progress > 0 && <Zap className="h-3 w-3 text-yellow-500" />}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {subGoal.timeline}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Check-in Modal */}
      <GoalCheckInModal
        goal={selectedGoalForCheckIn}
        isOpen={isCheckInModalOpen}
        onClose={handleCloseCheckIn}
      />
    </div>
  );
}

export function GoalsPage() {
  return (
    <div className="h-full">
      {/* Sub Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="px-6 py-3">
          <nav className="flex space-x-6">
            <NavLink 
              to="/insights/goals/strategy-map"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Strategy Map
            </NavLink>
            <NavLink 
              to="/insights/goals/company"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Company Goals
            </NavLink>
            <NavLink 
              to="/insights/goals/team"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Team Goals
            </NavLink>
            <NavLink 
              to="/insights/goals/my"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              My Goals
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route path="/" element={<Navigate to="/insights/goals/strategy-map" replace />} />
        <Route path="/strategy-map" element={<StrategyMapPage />} />
        <Route path="/company" element={<CompanyGoals />} />
        <Route path="/team" element={<TeamGoals />} />
        <Route path="/my" element={<MyGoals />} />
      </Routes>
    </div>
  );
}