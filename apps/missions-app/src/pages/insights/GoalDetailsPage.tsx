import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Target, 
  MoreHorizontal, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Edit3,
  MessageSquare,
  PaperclipIcon,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useGoalsStore } from '../../store/goals.store';
import { useTeamStore } from '../../store/team.store';
import { GoalCheckInModal } from '../../components/goals/GoalCheckInModal';
import { GoalProgressSettingsModal } from '../../components/goals/GoalProgressSettingsModal';
import { GoalHierarchyManager } from '../../components/goals/GoalHierarchyManager';

export function GoalDetailsPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const { goals, updateGoal } = useGoalsStore();
  const { teams } = useTeamStore();
  
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');

  const goal = goals.find(g => g.id === goalId);

  useEffect(() => {
    if (!goal) {
      navigate('/insights/goals');
      return;
    }
  }, [goal, navigate]);

  if (!goal) {
    return <div>Goal not found</div>;
  }

  const team = teams.find(t => t.id === goal.owner);
  
  const handleCheckIn = () => {
    setSelectedGoal(goal);
    setShowCheckInModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off-track':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'no-recent-updates':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'off-track':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const progressPercentage = goal.progress || 0;

  // Mock data for updates and comments
  const updates = [
    {
      id: 1,
      author: 'Likhitha Palaypu',
      date: '2024-01-15',
      type: 'progress',
      content: 'Updated progress to 65%. Key Result 1 is ahead of schedule.',
      previousProgress: 45,
      newProgress: 65
    },
    {
      id: 2,
      author: 'John Doe',
      date: '2024-01-12',
      type: 'comment',
      content: 'Great progress on the user engagement metrics. The new features are showing positive impact.'
    },
    {
      id: 3,
      author: 'Likhitha Palaypu',
      date: '2024-01-10',
      type: 'status',
      content: 'Status changed from "At Risk" to "On Track"',
      previousStatus: 'at-risk',
      newStatus: 'on-track'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{goal.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(goal.status)}`}>
                    {goal.status === 'on-track' ? 'On Track' : 
                     goal.status === 'at-risk' ? 'At Risk' :
                     goal.status === 'off-track' ? 'Off Track' :
                     goal.status === 'completed' ? 'Completed' : 'No Recent Updates'}
                  </span>
                  <span className="text-sm text-gray-500">{goal.timeline}</span>
                  {team && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-3 w-3" />
                      {team.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleCheckIn}>
                <Edit3 className="h-4 w-4 mr-2" />
                Check In
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Progress Overview</h2>
                <span className="text-sm text-gray-500">{progressPercentage}% Complete</span>
              </div>
              
              <div className="mb-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Key Results</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goal.subGoals?.length || 0}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goal.subGoals?.filter(sg => sg.status === 'on-track').length || 0}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goal.subGoals?.filter(sg => sg.status === 'completed').length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Results */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Results</h2>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Result
                </Button>
              </div>

              {goal.subGoals && goal.subGoals.length > 0 ? (
                <div className="space-y-4">
                  {goal.subGoals.map((subGoal, index) => (
                    <div key={subGoal.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(subGoal.status)}
                            <h3 className="font-medium text-gray-900 dark:text-white">{subGoal.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{subGoal.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {subGoal.progress}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {subGoal.currentValue || 0} / {subGoal.targetValue || 100}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 bg-indigo-400 rounded-full transition-all duration-300"
                          style={{ width: `${subGoal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No key results yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Add measurable key results to track progress toward this goal
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Key Result
                  </Button>
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity</h2>
              
              {/* New Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" disabled={!newComment.trim()}>
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Activity List */}
              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        {update.type === 'progress' ? <TrendingUp className="h-4 w-4 text-indigo-600" /> :
                         update.type === 'comment' ? <MessageSquare className="h-4 w-4 text-indigo-600" /> :
                         <CheckCircle className="h-4 w-4 text-indigo-600" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{update.author}</span>
                        <span className="text-sm text-gray-500">{update.date}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{update.content}</p>
                      
                      {update.type === 'progress' && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Progress: {update.previousProgress}% → {update.newProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Goal Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goal Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timeline
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {goal.timeline}
                  </div>
                </div>

                {goal.assignees && goal.assignees.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assignees
                    </label>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      {goal.assignees.join(', ')}
                    </div>
                  </div>
                )}

                {goal.tags && goal.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {goal.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(goal.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(goal.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleCheckIn}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update Progress
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Result
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowHierarchyModal(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Manage Hierarchy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Assignees
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setShowSettingsModal(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Goal Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      <GoalCheckInModal
        goal={selectedGoal}
        isOpen={showCheckInModal}
        onClose={() => {
          setShowCheckInModal(false);
          setSelectedGoal(null);
        }}
      />

      {/* Progress Settings Modal */}
      <GoalProgressSettingsModal
        goal={goal}
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Hierarchy Manager Modal */}
      <GoalHierarchyManager
        goal={goal}
        isOpen={showHierarchyModal}
        onClose={() => setShowHierarchyModal(false)}
      />
    </div>
  );
}