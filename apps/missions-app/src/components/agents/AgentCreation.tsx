import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Info,
  AlertCircle,
  Zap,
  Shield,
  Brain,
  Clock,
  Globe,
  Settings
} from 'lucide-react';
import { 
  AgentType, 
  AgentCapability, 
  CreateAgentData,
  AgentTemplate 
} from '../../types/agent.types';
import { useAgentStore } from '../../store/agent.store';
import { Button } from '../ui/Button';

interface AgentCreationProps {
  onClose: () => void;
  onAgentCreated?: (agentId: string) => void;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

// Step Components
function TemplateSelection({ formData, setFormData, templates }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
        <p className="text-gray-600">Start with a pre-configured agent template or create a custom one</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Custom Agent Option */}
        <div
          className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
            formData.templateId === 'custom' 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setFormData({ ...formData, templateId: 'custom', type: 'custom' as AgentType })}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg mb-4">
            <Zap className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Custom Agent</h3>
          <p className="text-sm text-gray-600 mb-3">Build your own agent from scratch with custom capabilities</p>
          <div className="flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Flexible</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">Customizable</span>
          </div>
        </div>

        {/* Template Options */}
        {templates.map((template: AgentTemplate) => (
          <div
            key={template.id}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              formData.templateId === template.id 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFormData({ 
              ...formData, 
              templateId: template.id, 
              type: template.type,
              capabilities: template.capabilities,
              name: template.name,
              description: template.description
            })}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BasicConfiguration({ formData, setFormData }: any) {
  const agentTypes: { value: AgentType; label: string; icon: string; description: string }[] = [
    { value: 'sales', label: 'Sales', icon: '💼', description: 'Lead qualification, outreach, and sales automation' },
    { value: 'service', label: 'Customer Service', icon: '🎧', description: 'Support tickets, customer inquiries, and help desk' },
    { value: 'marketing', label: 'Marketing', icon: '📢', description: 'Campaign management, content creation, and analytics' },
    { value: 'operations', label: 'Operations', icon: '⚙️', description: 'Process automation, workflow management, and optimization' },
    { value: 'analytics', label: 'Analytics', icon: '📊', description: 'Data analysis, reporting, and business intelligence' },
    { value: 'custom', label: 'Custom', icon: '🤖', description: 'Build your own specialized agent type' }
  ];

  const capabilities: { value: AgentCapability; label: string; description: string }[] = [
    { value: 'data-analysis', label: 'Data Analysis', description: 'Analyze data patterns and generate insights' },
    { value: 'customer-interaction', label: 'Customer Interaction', description: 'Engage with customers via chat, email, or phone' },
    { value: 'workflow-automation', label: 'Workflow Automation', description: 'Automate business processes and workflows' },
    { value: 'content-generation', label: 'Content Generation', description: 'Create text, images, and other content' },
    { value: 'decision-making', label: 'Decision Making', description: 'Make autonomous decisions based on data' },
    { value: 'task-execution', label: 'Task Execution', description: 'Execute specific tasks and actions' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Agent</h2>
        <p className="text-gray-600">Set up the basic details and capabilities</p>
      </div>

      {/* Basic Info */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Customer Service Bot"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this agent does and its purpose..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Agent Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Agent Type *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agentTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.type === type.value
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData({ ...formData, type: type.value })}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Capabilities *</label>
          <p className="text-sm text-gray-600 mb-3">Select the capabilities your agent needs (choose at least one)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {capabilities.map((capability) => (
              <label
                key={capability.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.capabilities?.includes(capability.value)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.capabilities?.includes(capability.value) || false}
                  onChange={(e) => {
                    const currentCapabilities = formData.capabilities || [];
                    if (e.target.checked) {
                      setFormData({ 
                        ...formData, 
                        capabilities: [...currentCapabilities, capability.value] 
                      });
                    } else {
                      setFormData({
                        ...formData,
                        capabilities: currentCapabilities.filter((c: AgentCapability) => c !== capability.value)
                      });
                    }
                  }}
                  className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{capability.label}</div>
                  <div className="text-sm text-gray-600">{capability.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructionsConfiguration({ formData, setFormData }: any) {
  const addInstruction = () => {
    const instructions = formData.instructions || [];
    setFormData({
      ...formData,
      instructions: [
        ...instructions,
        {
          title: '',
          description: '',
          prompt: '',
          priority: instructions.length + 1,
          conditions: []
        }
      ]
    });
  };

  const updateInstruction = (index: number, field: string, value: any) => {
    const instructions = [...(formData.instructions || [])];
    instructions[index] = { ...instructions[index], [field]: value };
    setFormData({ ...formData, instructions });
  };

  const removeInstruction = (index: number) => {
    const instructions = formData.instructions || [];
    setFormData({
      ...formData,
      instructions: instructions.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Instructions</h2>
        <p className="text-gray-600">Define how your agent should behave and what it should do</p>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        {(formData.instructions || []).map((instruction: any, index: number) => (
          <div key={index} className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Instruction #{index + 1}</h3>
              <button
                onClick={() => removeInstruction(index)}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={instruction.title}
                  onChange={(e) => updateInstruction(index, 'title', e.target.value)}
                  placeholder="e.g., Handle Customer Inquiries"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={instruction.description}
                  onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                  placeholder="Brief description of what this instruction does"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt/Instructions</label>
                <textarea
                  value={instruction.prompt}
                  onChange={(e) => updateInstruction(index, 'prompt', e.target.value)}
                  placeholder="Detailed instructions for how the agent should handle this task..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={instruction.priority}
                  onChange={(e) => updateInstruction(index, 'priority', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>Priority {num} {num === 1 ? '(Highest)' : num === 5 ? '(Lowest)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addInstruction}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Instruction
        </button>
      </div>
    </div>
  );
}

function GuardrailsConfiguration({ formData, setFormData }: any) {
  const addGuardrail = () => {
    const guardrails = formData.guardrails || [];
    setFormData({
      ...formData,
      guardrails: [
        ...guardrails,
        {
          name: '',
          type: 'content-filter',
          rules: [],
          enabled: true,
          severity: 'medium'
        }
      ]
    });
  };

  const updateGuardrail = (index: number, field: string, value: any) => {
    const guardrails = [...(formData.guardrails || [])];
    guardrails[index] = { ...guardrails[index], [field]: value };
    setFormData({ ...formData, guardrails });
  };

  const removeGuardrail = (index: number) => {
    const guardrails = formData.guardrails || [];
    setFormData({
      ...formData,
      guardrails: guardrails.filter((_: any, i: number) => i !== index)
    });
  };

  const addRule = (guardrailIndex: number) => {
    const guardrails = [...(formData.guardrails || [])];
    const rules = guardrails[guardrailIndex].rules || [];
    guardrails[guardrailIndex].rules = [...rules, ''];
    setFormData({ ...formData, guardrails });
  };

  const updateRule = (guardrailIndex: number, ruleIndex: number, value: string) => {
    const guardrails = [...(formData.guardrails || [])];
    guardrails[guardrailIndex].rules[ruleIndex] = value;
    setFormData({ ...formData, guardrails });
  };

  const removeRule = (guardrailIndex: number, ruleIndex: number) => {
    const guardrails = [...(formData.guardrails || [])];
    guardrails[guardrailIndex].rules = guardrails[guardrailIndex].rules.filter((_: any, i: number) => i !== ruleIndex);
    setFormData({ ...formData, guardrails });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Safety Guardrails</h2>
        <p className="text-gray-600">Define safety rules and limitations for your agent</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              Guardrails help ensure your agent operates safely and within defined boundaries. 
              They prevent harmful outputs and enforce compliance with your organization's policies.
            </p>
          </div>
        </div>
      </div>

      {/* Guardrails */}
      <div className="space-y-4">
        {(formData.guardrails || []).map((guardrail: any, index: number) => (
          <div key={index} className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Guardrail #{index + 1}</h3>
              <button
                onClick={() => removeGuardrail(index)}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={guardrail.name}
                    onChange={(e) => updateGuardrail(index, 'name', e.target.value)}
                    placeholder="e.g., Content Safety Filter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={guardrail.type}
                    onChange={(e) => updateGuardrail(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="content-filter">Content Filter</option>
                    <option value="data-access">Data Access</option>
                    <option value="action-limit">Action Limit</option>
                    <option value="approval-required">Approval Required</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={guardrail.severity}
                  onChange={(e) => updateGuardrail(index, 'severity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Rules</label>
                  <button
                    onClick={() => addRule(index)}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add Rule
                  </button>
                </div>
                <div className="space-y-2">
                  {(guardrail.rules || []).map((rule: string, ruleIndex: number) => (
                    <div key={ruleIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, ruleIndex, e.target.value)}
                        placeholder="Enter a rule..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => removeRule(index, ruleIndex)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`enabled-${index}`}
                  checked={guardrail.enabled}
                  onChange={(e) => updateGuardrail(index, 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor={`enabled-${index}`} className="ml-2 text-sm text-gray-700">
                  Enable this guardrail
                </label>
              </div>
            </div>
          </div>
        ))}
        
        <button
          onClick={addGuardrail}
          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
        >
          <Shield className="h-5 w-5" />
          Add Guardrail
        </button>
      </div>
    </div>
  );
}

function AdvancedConfiguration({ formData, setFormData }: any) {
  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'UTC'
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Configuration</h2>
        <p className="text-gray-600">Set up availability, performance, and AI model settings</p>
      </div>

      {/* Availability Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Availability Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={formData.availability?.timezone || 'America/New_York'}
              onChange={(e) => setFormData({
                ...formData,
                availability: { ...formData.availability, timezone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Concurrent Tasks</label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.availability?.maxConcurrentTasks || 5}
              onChange={(e) => setFormData({
                ...formData,
                availability: { 
                  ...formData.availability, 
                  maxConcurrentTasks: parseInt(e.target.value) || 5 
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
            <input
              type="time"
              value={formData.availability?.workingHours?.start || '09:00'}
              onChange={(e) => setFormData({
                ...formData,
                availability: { 
                  ...formData.availability, 
                  workingHours: { 
                    ...formData.availability?.workingHours, 
                    start: e.target.value 
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
            <input
              type="time"
              value={formData.availability?.workingHours?.end || '17:00'}
              onChange={(e) => setFormData({
                ...formData,
                availability: { 
                  ...formData.availability, 
                  workingHours: { 
                    ...formData.availability?.workingHours, 
                    end: e.target.value 
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {days.map((day, index) => (
              <label
                key={day}
                className={`px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.availability?.workingDays?.includes(index)
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.availability?.workingDays?.includes(index) || false}
                  onChange={(e) => {
                    const currentDays = formData.availability?.workingDays || [];
                    const newDays = e.target.checked
                      ? [...currentDays, index]
                      : currentDays.filter((d: number) => d !== index);
                    setFormData({
                      ...formData,
                      availability: { ...formData.availability, workingDays: newDays }
                    });
                  }}
                  className="sr-only"
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI Model Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <select
              value={formData.modelConfig?.model || 'gpt-4'}
              onChange={(e) => setFormData({
                ...formData,
                modelConfig: { ...formData.modelConfig, model: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="gpt-4">GPT-4 (Recommended)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3</option>
              <option value="custom">Custom Model</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (Creativity)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.modelConfig?.temperature || 0.7}
              onChange={(e) => setFormData({
                ...formData,
                modelConfig: { 
                  ...formData.modelConfig, 
                  temperature: parseFloat(e.target.value) 
                }
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative (0)</span>
              <span>{formData.modelConfig?.temperature || 0.7}</span>
              <span>Creative (1)</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
          <input
            type="number"
            min="100"
            max="8000"
            value={formData.modelConfig?.maxTokens || 2000}
            onChange={(e) => setFormData({
              ...formData,
              modelConfig: { 
                ...formData.modelConfig, 
                maxTokens: parseInt(e.target.value) || 2000 
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-sm text-gray-600 mt-1">Maximum length of agent responses</p>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Tags (Optional)</h3>
        <input
          type="text"
          value={formData.tags?.join(', ') || ''}
          onChange={(e) => setFormData({
            ...formData,
            tags: e.target.value.split(',').map((tag: string) => tag.trim()).filter(Boolean)
          })}
          placeholder="e.g., customer-service, support, automation"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
        <p className="text-sm text-gray-600">Comma-separated tags for organizing and filtering agents</p>
      </div>
    </div>
  );
}

function ReviewConfiguration({ formData }: any) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
        <p className="text-gray-600">Review your agent configuration before creating</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{formData.name || 'Not specified'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className="ml-2 text-gray-900">{formData.type || 'Not specified'}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-gray-700">Description:</span>
            <p className="mt-1 text-gray-900">{formData.description || 'Not specified'}</p>
          </div>
        </div>

        {/* Capabilities */}
        {formData.capabilities && formData.capabilities.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {formData.capabilities.map((capability: string) => (
                <span key={capability} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {capability}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {formData.instructions && formData.instructions.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Instructions ({formData.instructions.length})</h3>
            <div className="space-y-2">
              {formData.instructions.map((instruction: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-900">{instruction.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{instruction.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guardrails */}
        {formData.guardrails && formData.guardrails.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Guardrails ({formData.guardrails.length})</h3>
            <div className="space-y-2">
              {formData.guardrails.map((guardrail: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-900">{guardrail.name}</div>
                  <div className="text-sm text-gray-600">
                    Type: {guardrail.type} • Severity: {guardrail.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        {formData.availability && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Timezone:</span>
                <span className="ml-2 text-gray-900">{formData.availability.timezone}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Max Tasks:</span>
                <span className="ml-2 text-gray-900">{formData.availability.maxConcurrentTasks}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Working Hours:</span>
                <span className="ml-2 text-gray-900">
                  {formData.availability.workingHours?.start} - {formData.availability.workingHours?.end}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AgentCreation({ onClose, onAgentCreated }: AgentCreationProps) {
  const { getAgentTemplates, createAgent, createAgentFromTemplate } = useAgentStore();
  const templates = getAgentTemplates();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateAgentData>>({
    availability: {
      timezone: 'America/New_York',
      workingHours: { start: '09:00', end: '17:00' },
      workingDays: [1, 2, 3, 4, 5], // Monday to Friday
      maxConcurrentTasks: 5,
      currentTasks: 0
    }
  });
  const [isCreating, setIsCreating] = useState(false);

  const steps: WizardStep[] = [
    {
      id: 'template',
      title: 'Choose Template',
      description: 'Select a starting template',
      component: TemplateSelection
    },
    {
      id: 'basic',
      title: 'Basic Config',
      description: 'Name, type, and capabilities',
      component: BasicConfiguration
    },
    {
      id: 'instructions',
      title: 'Instructions',
      description: 'Define agent behavior',
      component: InstructionsConfiguration
    },
    {
      id: 'guardrails',
      title: 'Safety Rules',
      description: 'Set up guardrails',
      component: GuardrailsConfiguration
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Availability and AI settings',
      component: AdvancedConfiguration
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Final review and creation',
      component: ReviewConfiguration
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Template selection
        return formData.templateId;
      case 1: // Basic configuration
        return formData.name && formData.description && formData.type && formData.capabilities && formData.capabilities.length > 0;
      case 2: // Instructions
        return true; // Optional step
      case 3: // Guardrails
        return true; // Optional step
      case 4: // Advanced
        return true; // Has defaults
      case 5: // Review
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAgent = async () => {
    if (!canProceed()) return;

    setIsCreating(true);
    try {
      let newAgent;
      
      if (formData.templateId && formData.templateId !== 'custom') {
        // Create from template
        newAgent = await createAgentFromTemplate(formData.templateId, formData);
      } else {
        // Create custom agent
        newAgent = await createAgent(formData as CreateAgentData);
      }

      onAgentCreated?.(newAgent.id);
      onClose();
    } catch (error) {
      console.error('Failed to create agent:', error);
      // TODO: Show error toast
    } finally {
      setIsCreating(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Create New Agent</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 relative">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index < currentStep 
                        ? 'bg-emerald-600 text-white' 
                        : index === currentStep
                        ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <div className={`text-xs font-medium ${
                        index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs ${
                        index <= currentStep ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`absolute top-4 left-8 right-0 h-0.5 ${
                      index < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} style={{ zIndex: -1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            templates={templates}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleCreateAgent}
                disabled={!canProceed() || isCreating}
                className="flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Agent
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}