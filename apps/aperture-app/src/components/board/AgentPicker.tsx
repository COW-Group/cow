import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  ChevronDown,
  X,
  Plus,
  Check,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAgentStore } from '../../store/agent.store';
import { Agent } from '../../types/agent.types';

interface AgentPickerProps {
  selectedAgentIds: string[];
  onAgentChange: (agentIds: string[]) => void;
  placeholder?: string;
  maxAgents?: number;
  disabled?: boolean;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AgentPicker({
  selectedAgentIds = [],
  onAgentChange,
  placeholder = 'Assign agents',
  maxAgents = 3,
  disabled = false,
  showStatus = true,
  size = 'md',
  className = ''
}: AgentPickerProps) {
  const { getAgents, getAgentById } = useAgentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allAgents = getAgents();
  const selectedAgents = selectedAgentIds.map(id => getAgentById(id)).filter(Boolean) as Agent[];

  const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.type.toLowerCase().includes(searchQuery.toLowerCase());
    const notSelected = !selectedAgentIds.includes(agent.id);
    const isAvailable = agent.status === 'active' && agent.availability.currentTasks < agent.availability.maxConcurrentTasks;
    return matchesSearch && notSelected && isAvailable;
  });

  const handleAgentSelect = (agent: Agent) => {
    if (selectedAgentIds.length >= maxAgents) return;
    
    const newAgentIds = [...selectedAgentIds, agent.id];
    onAgentChange(newAgentIds);
    setSearchQuery('');
  };

  const handleAgentRemove = (agentId: string) => {
    const newAgentIds = selectedAgentIds.filter(id => id !== agentId);
    onAgentChange(newAgentIds);
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'sales': return '💼';
      case 'service': return '🎧';
      case 'marketing': return '📢';
      case 'analytics': return '📊';
      case 'operations': return '⚙️';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'training': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Agents Display */}
      <div
        className={`flex items-center gap-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
        } ${sizeClasses[size]}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {selectedAgents.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="h-4 w-4" />
            <span>{placeholder}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-1">
            {selectedAgents.slice(0, 2).map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs border border-emerald-200"
              >
                <span className="text-xs">{getAgentIcon(agent.type)}</span>
                <span className="font-medium truncate max-w-20">{agent.name}</span>
                {showStatus && (
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(agent.status)}`} />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentRemove(agent.id);
                  }}
                  className="hover:bg-emerald-100 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {selectedAgents.length > 2 && (
              <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                <span>+{selectedAgents.length - 2}</span>
              </div>
            )}
            
            {selectedAgents.length < maxAgents && (
              <div className="flex items-center gap-1 text-gray-400 px-1">
                <Plus className="h-3 w-3" />
              </div>
            )}
          </div>
        )}
        
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...({ className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden" } as any)}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                autoFocus
              />
            </div>

            {/* Agent List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredAgents.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {searchQuery ? 'No agents found' : 'No available agents'}
                </div>
              ) : (
                <div className="py-1">
                  {filteredAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => handleAgentSelect(agent)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      disabled={selectedAgentIds.length >= maxAgents}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getAgentIcon(agent.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 truncate">{agent.name}</span>
                            {showStatus && (
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>{agent.type}</span>
                            <span>•</span>
                            <span>{agent.metrics.currentTasks}/{agent.availability.maxConcurrentTasks} tasks</span>
                            {agent.metrics.successRate && (
                              <>
                                <span>•</span>
                                <span>{Math.round(agent.metrics.successRate * 100)}% success</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {agent.status === 'active' ? (
                          <Activity className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  {selectedAgentIds.length}/{maxAgents} agents selected
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Compact version for table cells
export function CompactAgentPicker({ selectedAgentIds, onAgentChange, disabled }: AgentPickerProps) {
  const { getAgentById } = useAgentStore();
  const selectedAgents = selectedAgentIds.map(id => getAgentById(id)).filter(Boolean) as Agent[];

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'sales': return '💼';
      case 'service': return '🎧';
      case 'marketing': return '📢';
      case 'analytics': return '📊';
      case 'operations': return '⚙️';
      default: return '🤖';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {selectedAgents.length === 0 ? (
        <AgentPicker
          selectedAgentIds={selectedAgentIds}
          onAgentChange={onAgentChange}
          placeholder="+"
          size="sm"
          disabled={disabled}
          className="w-8"
        />
      ) : (
        <div className="flex items-center gap-1">
          {selectedAgents.slice(0, 2).map((agent) => (
            <div
              key={agent.id}
              className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs border border-emerald-200"
              title={`${agent.name} (${agent.type})`}
            >
              {getAgentIcon(agent.type)}
            </div>
          ))}
          {selectedAgents.length > 2 && (
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">
              +{selectedAgents.length - 2}
            </div>
          )}
          <AgentPicker
            selectedAgentIds={selectedAgentIds}
            onAgentChange={onAgentChange}
            placeholder="+"
            size="sm"
            disabled={disabled}
            className="w-6"
            showStatus={false}
          />
        </div>
      )}
    </div>
  );
}