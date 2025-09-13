import React, { useState } from 'react';
import { X, Target, Users, Calendar, ChevronDown, Plus, Minus } from 'lucide-react';
import { Button } from '../ui/Button';
import { TimePeriodSelector } from './TimePeriodSelector';
import { useGoalsStore } from '../../store/goals.store';
import { useTeamStore } from '../../store/team.store';

interface GoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: 'personal' | 'team' | 'company';
  teamId?: string;
}

interface KeyResult {
  id: string;
  title: string;
  description: string;
  measurementType: 'percentage' | 'number' | 'boolean';
  targetValue: number;
  currentValue: number;
}

export function GoalCreationModal({ isOpen, onClose, initialContext = 'personal', teamId }: GoalCreationModalProps) {
  const { addGoal } = useGoalsStore();
  const { teams } = useTeamStore();
  
  const [step, setStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    type: initialContext,
    timeline: 'Q4 2024',
    priority: 'medium' as 'high' | 'medium' | 'low',
    teamId: teamId || '',
    assignees: [] as string[],
    tags: [] as string[],
    keyResults: [] as KeyResult[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!goalData.title.trim()) newErrors.title = 'Goal title is required';
      if (!goalData.description.trim()) newErrors.description = 'Goal description is required';
      if (goalData.type === 'team' && !goalData.teamId) newErrors.teamId = 'Team selection is required';
    }

    if (step === 2) {
      if (goalData.keyResults.length === 0) {
        newErrors.keyResults = 'At least one key result is required';
      } else {
        goalData.keyResults.forEach((kr, index) => {
          if (!kr.title.trim()) newErrors[`kr_${index}_title`] = 'Key result title is required';
          if (kr.targetValue <= 0) newErrors[`kr_${index}_target`] = 'Target value must be greater than 0';
        });
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const newGoal = {
        id: `goal-${Date.now()}`,
        title: goalData.title,
        description: goalData.description,
        type: goalData.type as 'personal' | 'team' | 'company',
        status: 'on-track' as const,
        progress: 0,
        timeline: goalData.timeline,
        priority: goalData.priority,
        owner: goalData.type === 'team' ? goalData.teamId : 'current-user',
        assignees: goalData.assignees,
        tags: goalData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subGoals: goalData.keyResults.map(kr => ({
          id: kr.id,
          title: kr.title,
          description: kr.description,
          status: 'no-recent-updates' as const,
          progress: 0,
          measurementType: kr.measurementType,
          targetValue: kr.targetValue,
          currentValue: kr.currentValue
        }))
      };

      await addGoal(newGoal);
      onClose();
      
      // Reset form
      setStep(1);
      setGoalData({
        title: '',
        description: '',
        type: initialContext,
        timeline: 'Q4 2024',
        priority: 'medium',
        teamId: teamId || '',
        assignees: [],
        tags: [],
        keyResults: []
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const addKeyResult = () => {
    const newKeyResult: KeyResult = {
      id: `kr-${Date.now()}`,
      title: '',
      description: '',
      measurementType: 'percentage',
      targetValue: 100,
      currentValue: 0
    };
    setGoalData({
      ...goalData,
      keyResults: [...goalData.keyResults, newKeyResult]
    });
  };

  const removeKeyResult = (index: number) => {
    setGoalData({
      ...goalData,
      keyResults: goalData.keyResults.filter((_, i) => i !== index)
    });
  };

  const updateKeyResult = (index: number, field: keyof KeyResult, value: any) => {
    const updatedKeyResults = [...goalData.keyResults];
    updatedKeyResults[index] = { ...updatedKeyResults[index], [field]: value };
    setGoalData({ ...goalData, keyResults: updatedKeyResults });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goal Details</h3>
        
        {/* Goal Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal Type
          </label>
          <div className="flex gap-3">
            {[
              { value: 'personal', label: 'Personal Goal', icon: Target },
              { value: 'team', label: 'Team Goal', icon: Users },
              { value: 'company', label: 'Company Goal', icon: Target }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setGoalData({ ...goalData, type: value as any })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  goalData.type === value
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal Title *
          </label>
          <input
            type="text"
            value={goalData.title}
            onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
            placeholder="Enter a clear, specific goal title"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Goal Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={goalData.description}
            onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
            placeholder="Describe what success looks like and why this goal matters"
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Team Selection (if team goal) */}
        {goalData.type === 'team' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Team *
            </label>
            <select
              value={goalData.teamId}
              onChange={(e) => setGoalData({ ...goalData, teamId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.teamId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            {errors.teamId && <p className="text-red-500 text-sm mt-1">{errors.teamId}</p>}
          </div>
        )}

        {/* Timeline */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timeline
          </label>
          <TimePeriodSelector
            selectedPeriod={goalData.timeline}
            onPeriodChange={(period) => setGoalData({ ...goalData, timeline: period })}
          />
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            {[
              { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
              { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-200' }
            ].map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => setGoalData({ ...goalData, priority: value as any })}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  goalData.priority === value ? color : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Results</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define measurable outcomes that will indicate success for this goal.
        </p>

        <div className="space-y-4">
          {goalData.keyResults.map((keyResult, index) => (
            <div key={keyResult.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Key Result {index + 1}
                </h4>
                {goalData.keyResults.length > 1 && (
                  <button
                    onClick={() => removeKeyResult(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={keyResult.title}
                    onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                    placeholder="e.g., Increase user engagement"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors[`kr_${index}_title`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors[`kr_${index}_title`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`kr_${index}_title`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Measurement Type
                  </label>
                  <select
                    value={keyResult.measurementType}
                    onChange={(e) => updateKeyResult(index, 'measurementType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="number">Number</option>
                    <option value="boolean">Yes/No</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={keyResult.description}
                    onChange={(e) => updateKeyResult(index, 'description', e.target.value)}
                    placeholder="Describe how this will be measured"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    value={keyResult.targetValue}
                    onChange={(e) => updateKeyResult(index, 'targetValue', Number(e.target.value))}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors[`kr_${index}_target`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors[`kr_${index}_target`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`kr_${index}_target`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={keyResult.currentValue}
                    onChange={(e) => updateKeyResult(index, 'currentValue', Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addKeyResult}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Key Result
          </button>

          {errors.keyResults && (
            <p className="text-red-500 text-sm">{errors.keyResults}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review & Create</h3>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">{goalData.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{goalData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <span className="ml-2 capitalize">{goalData.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Timeline:</span>
              <span className="ml-2">{goalData.timeline}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Priority:</span>
              <span className="ml-2 capitalize">{goalData.priority}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Key Results:</span>
              <span className="ml-2">{goalData.keyResults.length}</span>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Key Results:</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {goalData.keyResults.map((kr, index) => (
                <li key={kr.id}>
                  {kr.title} (Target: {kr.targetValue}{kr.measurementType === 'percentage' ? '%' : ''})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Goal</h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 3</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button onClick={handleNext}>
            {step === 3 ? 'Create Goal' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}