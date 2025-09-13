import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  Calendar, 
  Filter, 
  Plus, 
  ChevronDown, 
  MoreHorizontal,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TimePeriodSelector } from './TimePeriodSelector';
import { useGoalsStore } from '../../store/goals.store';
import { useTeamStore } from '../../store/team.store';
import { GoalCheckInModal } from './GoalCheckInModal';
import { Goal } from '../../store/goals.store';

export function TeamGoals() {
  const { goals: allGoals } = useGoalsStore();
  const { teams, currentTeam } = useTeamStore();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(currentTeam?.id || teams[0]?.id);
  const [timeframe, setTimeframe] = useState('Q2 2024');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Filter goals by selected team - for now using owner as team indicator
  const teamGoals = allGoals.filter(goal => 
    selectedTeam === 'team-strops' ? goal.owner === 'Cow Group' : goal.owner === selectedTeam
  );

  const team = teams.find(t => t.id === selectedTeam);

  const handleCheckInClick = (goal: Goal) => {
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'at-risk':
        return 'At Risk';
      case 'off-track':
        return 'Off Track';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Goals</h1>
          <p className="text-gray-600 dark:text-gray-400">Collaborate on shared objectives and key results</p>
        </div>
        <div className="flex items-center gap-3">
          <TimePeriodSelector
            selectedPeriod={timeframe}
            onPeriodChange={setTimeframe}
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create goal
          </Button>
        </div>
      </div>

      {/* Team Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-600">Select Team:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedTeam === team.id
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="font-medium">{team.name}</span>
                <span className="text-xs text-gray-500">({team.memberCount})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats */}
      {team && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teamGoals.filter(g => g.status !== 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On Track</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teamGoals.filter(g => g.status === 'on-track').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {team.memberCount}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {teamGoals.length > 0 ? Math.round(teamGoals.reduce((sum, g) => sum + g.progress, 0) / teamGoals.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {teamGoals.length > 0 ? (
          teamGoals.map((goal) => (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer transition-colors"
                        onClick={() => navigate(`/insights/goals/goal/${goal.id}`)}
                      >
                        {goal.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(goal.status)}`}>
                        {getStatusLabel(goal.status)}
                      </span>
                      {goal.progress > 0 && <Zap className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{goal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {goal.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {goal.assignees.join(', ')}
                      </span>
                    </div>
                  </div>
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

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Sub-goals */}
              {goal.subGoals && goal.subGoals.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Sub-goals ({goal.subGoals.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {goal.subGoals.slice(0, 4).map((subGoal) => (
                      <div key={subGoal.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {subGoal.title}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {subGoal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                          <div 
                            className="h-1.5 bg-indigo-400 rounded-full transition-all duration-300"
                            style={{ width: `${subGoal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {goal.subGoals.length > 4 && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center justify-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          +{goal.subGoals.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No team goals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {team ? `Create the first goal for ${team.name}` : 'Select a team to view goals'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create team goal
            </Button>
          </div>
        )}
      </div>

      {/* Goal Check-in Modal */}
      <GoalCheckInModal
        goal={selectedGoal}
        isOpen={showCheckInModal}
        onClose={() => {
          setShowCheckInModal(false);
          setSelectedGoal(null);
        }}
      />
    </div>
  );
}