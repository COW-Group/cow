import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bot,
  Settings,
  Zap,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Activity
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AgentPicker } from './AgentPicker';
import { useAgentStore } from '../../store/agent.store';
import { TaskAutomationConfig, TaskAgentTrigger, TaskEscalationRule } from '../../types/board.types';

interface TaskAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  currentConfig?: TaskAutomationConfig;
  currentAgentIds?: string[];
  onSave: (config: TaskAutomationConfig, agentIds: string[]) => void;
}

export function TaskAutomationModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  currentConfig,
  currentAgentIds = [],
  onSave
}: TaskAutomationModalProps) {
  const { assignAgentsToTask, unassignAgentFromTask } = useAgentStore();
  
  const [agentIds, setAgentIds] = useState<string[]>(currentAgentIds);
  const [config, setConfig] = useState<TaskAutomationConfig>(currentConfig || {
    autoAssignAgent: false,
    agentTriggers: [],
    escalationRules: [],
    autonomousMode: false
  });

  const handleSave = async () => {
    try {
      // Update agent assignments
      const currentIds = new Set(currentAgentIds);
      const newIds = new Set(agentIds);
      
      // Remove agents that are no longer assigned
      for (const id of currentIds) {
        if (!newIds.has(id)) {
          await unassignAgentFromTask(id, taskId);
        }
      }
      
      // Add new agents
      const toAdd = agentIds.filter(id => !currentIds.has(id));
      if (toAdd.length > 0) {
        await assignAgentsToTask(toAdd, taskId, 'board-item');
      }
      
      onSave(config, agentIds);
      onClose();
    } catch (error) {
      console.error('Failed to save automation config:', error);
    }
  };

  const addTrigger = () => {
    const newTrigger: TaskAgentTrigger = {
      id: `trigger-${Date.now()}`,
      condition: 'status_change',
      agentIds: [],
      action: 'assign',
      enabled: true
    };
    
    setConfig({
      ...config,
      agentTriggers: [...(config.agentTriggers || []), newTrigger]
    });
  };

  const updateTrigger = (index: number, updatedTrigger: TaskAgentTrigger) => {
    const triggers = [...(config.agentTriggers || [])];
    triggers[index] = updatedTrigger;
    setConfig({ ...config, agentTriggers: triggers });
  };

  const removeTrigger = (index: number) => {
    const triggers = [...(config.agentTriggers || [])];
    triggers.splice(index, 1);
    setConfig({ ...config, agentTriggers: triggers });
  };

  const addEscalationRule = () => {
    const newRule: TaskEscalationRule = {
      id: `rule-${Date.now()}`,
      condition: 'agent_timeout',
      threshold: 60, // 60 minutes
      escalateTo: 'human',
      escalationTargets: []
    };
    
    setConfig({
      ...config,
      escalationRules: [...(config.escalationRules || []), newRule]
    });
  };

  const updateEscalationRule = (index: number, updatedRule: TaskEscalationRule) => {
    const rules = [...(config.escalationRules || [])];
    rules[index] = updatedRule;
    setConfig({ ...config, escalationRules: rules });
  };

  const removeEscalationRule = (index: number) => {
    const rules = [...(config.escalationRules || [])];
    rules.splice(index, 1);
    setConfig({ ...config, escalationRules: rules });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        {...({ className: "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" } as any)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-600" />
              Task Automation
            </h2>
            <p className="text-sm text-gray-600 mt-1">Configure AI agents and automation for "{taskTitle}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-8">
            {/* Agent Assignment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Assignment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Agents
                  </label>
                  <AgentPicker
                    selectedAgentIds={agentIds}
                    onAgentChange={setAgentIds}
                    placeholder="Select agents to work on this task"
                    maxAgents={5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These agents will be automatically assigned to this task and can work on it autonomously.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    checked={config.autoAssignAgent || false}
                    onChange={(e) => setConfig({ ...config, autoAssignAgent: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="autoAssign" className="text-sm text-gray-700">
                    Auto-assign best available agent when task is created
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autonomousMode"
                    checked={config.autonomousMode || false}
                    onChange={(e) => setConfig({ ...config, autonomousMode: e.target.checked })}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="autonomousMode" className="text-sm text-gray-700">
                    Enable autonomous mode (agents can take actions without approval)
                  </label>
                </div>
              </div>
            </div>

            {/* Agent Triggers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Agent Triggers</h3>
                <Button size="sm" onClick={addTrigger}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trigger
                </Button>
              </div>
              
              {config.agentTriggers && config.agentTriggers.length > 0 ? (
                <div className="space-y-4">
                  {config.agentTriggers.map((trigger, index) => (
                    <div key={trigger.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Trigger #{index + 1}</h4>
                        <button
                          onClick={() => removeTrigger(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condition
                          </label>
                          <select
                            value={trigger.condition}
                            onChange={(e) => updateTrigger(index, { ...trigger, condition: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="status_change">Status Change</option>
                            <option value="due_date_approaching">Due Date Approaching</option>
                            <option value="manual_trigger">Manual Trigger</option>
                            <option value="delay_threshold">Delay Threshold</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action
                          </label>
                          <select
                            value={trigger.action}
                            onChange={(e) => updateTrigger(index, { ...trigger, action: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="assign">Assign Agent</option>
                            <option value="notify">Send Notification</option>
                            <option value="escalate">Escalate</option>
                            <option value="execute_workflow">Execute Workflow</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={trigger.enabled}
                            onChange={(e) => updateTrigger(index, { ...trigger, enabled: e.target.checked })}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <label className="ml-2 text-sm text-gray-700">Enabled</label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No triggers configured. Add triggers to automate agent actions.</p>
                </div>
              )}
            </div>

            {/* Escalation Rules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Escalation Rules</h3>
                <Button size="sm" onClick={addEscalationRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
              
              {config.escalationRules && config.escalationRules.length > 0 ? (
                <div className="space-y-4">
                  {config.escalationRules.map((rule, index) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Rule #{index + 1}</h4>
                        <button
                          onClick={() => removeEscalationRule(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condition
                          </label>
                          <select
                            value={rule.condition}
                            onChange={(e) => updateEscalationRule(index, { ...rule, condition: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="agent_timeout">Agent Timeout</option>
                            <option value="failure_threshold">Failure Threshold</option>
                            <option value="manual_escalation">Manual Escalation</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Escalate To
                          </label>
                          <select
                            value={rule.escalateTo}
                            onChange={(e) => updateEscalationRule(index, { ...rule, escalateTo: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="human">Human</option>
                            <option value="senior_agent">Senior Agent</option>
                            <option value="manager">Manager</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Threshold
                          </label>
                          <input
                            type="number"
                            value={rule.threshold || 60}
                            onChange={(e) => updateEscalationRule(index, { ...rule, threshold: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Minutes"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No escalation rules configured. Add rules to handle failures and timeouts.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Changes will apply to this task and any assigned agents
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}