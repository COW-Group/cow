import React, { useState } from 'react';
import { X, Plus, Users, Lock, Unlock, Folder, Grid3x3 } from 'lucide-react';
import { Workspace } from '../../types/workspace.types';
import { workspaceService } from '../../services/workspace.service';

interface WorkspaceManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceCreated?: (workspace: Workspace) => void;
}

const WORKSPACE_COLORS = [
  '#579bfc', // Blue
  '#00c875', // Green
  '#ff9f40', // Orange
  '#e2445c', // Red
  '#9d34da', // Purple
  '#fdab3d', // Yellow
  '#ff642e', // Orange Red
  '#bb3354', // Dark Red
  '#7f5347', // Brown
  '#787774', // Gray
];

const WORKSPACE_ICONS = [
  '🏢', '🏬', '🏭', '🏗️', '🏙️', '🏠', '🏛️', '🏟️', '🌟', '⭐',
  '🎯', '🚀', '💼', '📊', '📈', '📋', '📝', '💡', '🔥', '⚡'
];

export function WorkspaceManagementModal({ 
  isOpen, 
  onClose, 
  onWorkspaceCreated 
}: WorkspaceManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'open' as 'open' | 'closed',
    color: WORKSPACE_COLORS[0],
    icon: WORKSPACE_ICONS[0]
  });
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setWorkspaces(workspaceService.getAllWorkspaces());
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    try {
      const workspace = workspaceService.createWorkspace(formData);
      onWorkspaceCreated?.(workspace);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'open',
        color: WORKSPACE_COLORS[0],
        icon: WORKSPACE_ICONS[0]
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    if (workspaceService.deleteWorkspace(workspaceId)) {
      setWorkspaces(workspaceService.getAllWorkspaces());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Workspace Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Workspace
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'manage'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Manage Workspaces
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'create' ? (
            /* Create Workspace Tab */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workspace Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Marketing Team, HR Department"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the purpose of this workspace"
                />
              </div>

              {/* Privacy Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Privacy
                </label>
                <div className="space-y-3">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                      formData.type === 'open' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'open' })}
                  >
                    <div className="flex items-center">
                      <Unlock className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Open Workspace</h3>
                        <p className="text-sm text-gray-500">Everyone in your organization can see and join</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                      formData.type === 'closed' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData({ ...formData, type: 'closed' })}
                  >
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 mr-3 text-red-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Closed Workspace</h3>
                        <p className="text-sm text-gray-500">Only invited members can see and access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Workspace Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {WORKSPACE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-full border-2 ${
                        formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Workspace Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {WORKSPACE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                        formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded mr-3 flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: formData.color }}
                    >
                      {formData.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{formData.name || 'Workspace Name'}</h3>
                      <p className="text-sm text-gray-500">{formData.description || 'Workspace description'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          ) : (
            /* Manage Workspaces Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Your Workspaces</h3>
                <span className="text-sm text-gray-500">{workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}</span>
              </div>

              {workspaces.map((workspace) => (
                <div key={workspace.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div 
                        className="w-10 h-10 rounded mr-4 flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: workspace.color }}
                      >
                        {workspace.icon || workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{workspace.name}</h4>
                          {workspace.isDefault && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Default</span>
                          )}
                          <div className="ml-2">
                            {workspace.type === 'open' ? (
                              <Unlock className="w-4 h-4 text-green-600" />
                            ) : (
                              <Lock className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{workspace.description}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Grid3x3 className="w-3 h-3 mr-1" />
                          <span>{workspace.boards.length} boards</span>
                          <span className="mx-2">•</span>
                          <Folder className="w-3 h-3 mr-1" />
                          <span>{workspace.folders.length} folders</span>
                          <span className="mx-2">•</span>
                          <Users className="w-3 h-3 mr-1" />
                          <span>{workspace.memberIds.length} member{workspace.memberIds.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded">
                        Settings
                      </button>
                      {!workspace.isDefault && (
                        <button 
                          onClick={() => handleDeleteWorkspace(workspace.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}