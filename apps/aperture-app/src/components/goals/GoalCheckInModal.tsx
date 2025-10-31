import React, { useState } from 'react';
import { X, MessageSquare, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Goal, SubGoal, useGoalsStore } from '../../store/goals.store';
import { Button } from '../ui/Button';

interface GoalCheckInModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GoalCheckInModal({ goal, isOpen, onClose }: GoalCheckInModalProps) {
  const { updateGoal, updateSubGoal } = useGoalsStore();
  const [checkInData, setCheckInData] = useState({
    status: goal?.status || 'on-track',
    progress: goal?.progress || 0,
    comment: '',
    blockers: '',
    nextSteps: ''
  });

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the goal with check-in data
    updateGoal(goal.id, {
      status: checkInData.status as Goal['status'],
      progress: checkInData.progress,
      lastCheckIn: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Reset form and close modal
    setCheckInData({
      status: 'on-track',
      progress: 0,
      comment: '',
      blockers: '',
      nextSteps: ''
    });
    onClose();
  };

  const statusOptions = [
    { value: 'on-track', label: 'On track', color: 'text-green-600', icon: TrendingUp },
    { value: 'at-risk', label: 'At risk', color: 'text-yellow-600', icon: AlertTriangle },
    { value: 'off-track', label: 'Off track', color: 'text-red-600', icon: AlertTriangle },
    { value: 'no-recent-updates', label: 'No recent updates', color: 'text-gray-600', icon: Clock }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Check in on goal
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {goal.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Goal Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCheckInData(prev => ({ ...prev, status: option.value }))}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                      checkInData.status === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${option.color}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progress ({checkInData.progress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={checkInData.progress}
              onChange={(e) => setCheckInData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Update Comment
            </label>
            <textarea
              value={checkInData.comment}
              onChange={(e) => setCheckInData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share progress updates, achievements, or challenges..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Blockers or Concerns
            </label>
            <textarea
              value={checkInData.blockers}
              onChange={(e) => setCheckInData(prev => ({ ...prev, blockers: e.target.value }))}
              placeholder="Any blockers, risks, or concerns that need attention..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Next Steps
            </label>
            <textarea
              value={checkInData.nextSteps}
              onChange={(e) => setCheckInData(prev => ({ ...prev, nextSteps: e.target.value }))}
              placeholder="What are the next key actions or milestones..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Sub-goals Progress */}
          {goal.subGoals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Sub-goals Progress
              </label>
              <div className="space-y-3">
                {goal.subGoals.map((subGoal) => (
                  <div key={subGoal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {subGoal.title}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {subGoal.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${subGoal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="submit" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Submit Check-in
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}