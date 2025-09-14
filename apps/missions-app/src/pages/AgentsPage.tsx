import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AgentList } from '../components/agents/AgentList';
import { AgentCreation } from '../components/agents/AgentCreation';
import { useAgentStore } from '../store/agent.store';

// Agent Details Page
function AgentDetailsPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const { getAgentById } = useAgentStore();
  const agent = agentId ? getAgentById(agentId) : null;

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Agent Not Found</h2>
          <p className="text-gray-600">The agent you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{agent.name}</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600 mb-4">{agent.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Type:</dt>
                <dd className="text-gray-900">{agent.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Status:</dt>
                <dd className="text-gray-900">{agent.status}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Version:</dt>
                <dd className="text-gray-900">{agent.version}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Created:</dt>
                <dd className="text-gray-900">{new Date(agent.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-700">Tasks Completed:</dt>
                <dd className="text-gray-900">{agent.metrics.tasksCompleted}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Success Rate:</dt>
                <dd className="text-gray-900">{Math.round(agent.metrics.successRate * 100)}%</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Cost Savings:</dt>
                <dd className="text-gray-900">${agent.metrics.costSavings.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">Current Tasks:</dt>
                <dd className="text-gray-900">{agent.metrics.currentTasks}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {agent.capabilities.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((capability) => (
                <span
                  key={capability}
                  className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {agent.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {agent.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Agent Creation Page
function AgentCreationPage() {
  const navigate = useNavigate();

  const handleAgentCreated = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  const handleClose = () => {
    navigate('/agents');
  };

  return (
    <AgentCreation
      onClose={handleClose}
      onAgentCreated={handleAgentCreated}
    />
  );
}

// Main Agents Page
function AgentsMainPage() {
  const navigate = useNavigate();

  const handleAgentSelect = (agent: any) => {
    navigate(`/agents/${agent.id}`);
  };

  const handleCreateAgent = () => {
    navigate('/agents/create');
  };

  return (
    <AgentList
      onAgentSelect={handleAgentSelect}
      onCreateAgent={handleCreateAgent}
    />
  );
}

export function AgentsPage() {
  return (
    <div className="h-full flex flex-col">
      <Routes>
        <Route index element={<AgentsMainPage />} />
        <Route path="create" element={<AgentCreationPage />} />
        <Route path=":agentId" element={<AgentDetailsPage />} />
      </Routes>
    </div>
  );
}