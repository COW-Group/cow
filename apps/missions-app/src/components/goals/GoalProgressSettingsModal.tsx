import React, { useState, useEffect } from 'react';
import { X, Settings, Save, AlertCircle, CheckCircle, Target, Calendar, Users, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useGoalsStore } from '../../store/goals.store';
import { Goal } from '../../store/goals.store';

interface GoalProgressSettingsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GoalProgressSettingsModal({ goal, isOpen, onClose }: GoalProgressSettingsModalProps) {
  const { updateGoal } = useGoalsStore();
  
  const [settings, setSettings] = useState({
    autoUpdateProgress: false,
    progressCalculationMethod: 'manual' as 'manual' | 'automatic' | 'weighted',
    updateFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    reminderSettings: {
      enabled: true,
      frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
      reminderDays: [1, 3, 5], // Monday, Wednesday, Friday
      reminderTime: '09:00'
    },
    statusThresholds: {
      onTrack: { min: 85, max: 100 },
      atRisk: { min: 60, max: 84 },
      offTrack: { min: 0, max: 59 }
    },
    notificationSettings: {
      statusChanges: true,
      milestoneReached: true,
      deadlineApproaching: true,
      teamUpdates: true
    },
    visibility: {
      progressVisible: true,
      commentsVisible: true,
      activityVisible: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (goal && isOpen) {
      // Load existing settings from goal data (mock implementation)
      setSettings(prev => ({
        ...prev,
        // In a real app, you'd load these from the goal's settings
      }));
      setHasChanges(false);
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleDirectSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // In a real implementation, you'd save these settings to the goal
      await updateGoal(goal.id, {
        ...goal,
        settings: settings,
        updatedAt: new Date().toISOString()
      });
      
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Failed to save goal settings:', error);
    }
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const toggleReminderDay = (dayIndex: number) => {
    const currentDays = settings.reminderSettings.reminderDays;
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter(d => d !== dayIndex)
      : [...currentDays, dayIndex].sort();
    
    handleSettingChange('reminderSettings', 'reminderDays', newDays);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Goal Settings</h2>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Progress Calculation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress Calculation</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calculation Method
                    </label>
                    <select
                      value={settings.progressCalculationMethod}
                      onChange={(e) => handleDirectSettingChange('progressCalculationMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="manual">Manual Updates Only</option>
                      <option value="automatic">Automatic from Key Results</option>
                      <option value="weighted">Weighted Average</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.progressCalculationMethod === 'manual' && 'Progress must be updated manually'}
                      {settings.progressCalculationMethod === 'automatic' && 'Progress calculated from key results automatically'}
                      {settings.progressCalculationMethod === 'weighted' && 'Key results weighted by importance'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="autoUpdate"
                      checked={settings.autoUpdateProgress}
                      onChange={(e) => handleDirectSettingChange('autoUpdateProgress', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="autoUpdate" className="text-sm text-gray-700 dark:text-gray-300">
                      Auto-update progress when key results change
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Thresholds */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Thresholds</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-1">On Track</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={settings.statusThresholds.onTrack.min}
                          onChange={(e) => handleSettingChange('statusThresholds', 'onTrack', {
                            ...settings.statusThresholds.onTrack,
                            min: Number(e.target.value)
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-500 py-1">%+</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-1">At Risk</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={settings.statusThresholds.atRisk.min}
                          onChange={(e) => handleSettingChange('statusThresholds', 'atRisk', {
                            ...settings.statusThresholds.atRisk,
                            min: Number(e.target.value)
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-500 py-1">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Off Track</label>
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-500 py-1">0-</span>
                        <input
                          type="number"
                          value={settings.statusThresholds.offTrack.max}
                          onChange={(e) => handleSettingChange('statusThresholds', 'offTrack', {
                            ...settings.statusThresholds.offTrack,
                            max: Number(e.target.value)
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-500 py-1">%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium">Preview</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>On Track: {settings.statusThresholds.onTrack.min}%+ progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>At Risk: {settings.statusThresholds.atRisk.min}-{settings.statusThresholds.atRisk.max}% progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Off Track: 0-{settings.statusThresholds.offTrack.max}% progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visibility Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visibility</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="progressVisible"
                      checked={settings.visibility.progressVisible}
                      onChange={(e) => handleSettingChange('visibility', 'progressVisible', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="progressVisible" className="text-sm text-gray-700 dark:text-gray-300">
                      Show progress to team members
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="commentsVisible"
                      checked={settings.visibility.commentsVisible}
                      onChange={(e) => handleSettingChange('visibility', 'commentsVisible', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="commentsVisible" className="text-sm text-gray-700 dark:text-gray-300">
                      Allow team comments
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="activityVisible"
                      checked={settings.visibility.activityVisible}
                      onChange={(e) => handleSettingChange('visibility', 'activityVisible', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="activityVisible" className="text-sm text-gray-700 dark:text-gray-300">
                      Show activity feed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Reminder Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reminders</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="remindersEnabled"
                      checked={settings.reminderSettings.enabled}
                      onChange={(e) => handleSettingChange('reminderSettings', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="remindersEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                      Enable progress reminders
                    </label>
                  </div>

                  {settings.reminderSettings.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reminder Frequency
                        </label>
                        <select
                          value={settings.reminderSettings.frequency}
                          onChange={(e) => handleSettingChange('reminderSettings', 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reminder Days
                        </label>
                        <div className="grid grid-cols-7 gap-1">
                          {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
                            <button
                              key={dayIndex}
                              onClick={() => toggleReminderDay(dayIndex)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                settings.reminderSettings.reminderDays.includes(dayIndex)
                                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {getDayName(dayIndex).slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reminder Time
                        </label>
                        <input
                          type="time"
                          value={settings.reminderSettings.reminderTime}
                          onChange={(e) => handleSettingChange('reminderSettings', 'reminderTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="statusChanges"
                      checked={settings.notificationSettings.statusChanges}
                      onChange={(e) => handleSettingChange('notificationSettings', 'statusChanges', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="statusChanges" className="text-sm text-gray-700 dark:text-gray-300">
                      Status changes (On track → At risk, etc.)
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="milestoneReached"
                      checked={settings.notificationSettings.milestoneReached}
                      onChange={(e) => handleSettingChange('notificationSettings', 'milestoneReached', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="milestoneReached" className="text-sm text-gray-700 dark:text-gray-300">
                      Milestone reached (25%, 50%, 75%, 100%)
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="deadlineApproaching"
                      checked={settings.notificationSettings.deadlineApproaching}
                      onChange={(e) => handleSettingChange('notificationSettings', 'deadlineApproaching', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="deadlineApproaching" className="text-sm text-gray-700 dark:text-gray-300">
                      Deadline approaching (1 week, 1 day)
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="teamUpdates"
                      checked={settings.notificationSettings.teamUpdates}
                      onChange={(e) => handleSettingChange('notificationSettings', 'teamUpdates', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="teamUpdates" className="text-sm text-gray-700 dark:text-gray-300">
                      Team member updates and comments
                    </label>
                  </div>
                </div>
              </div>

              {/* Update Frequency */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Frequency</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expected Update Frequency
                  </label>
                  <select
                    value={settings.updateFrequency}
                    onChange={(e) => handleDirectSettingChange('updateFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How often do you expect this goal to be updated?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {hasChanges && (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-amber-600">You have unsaved changes</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}