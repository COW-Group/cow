import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Users,
  Settings,
  Crown,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useWorkspaceStore } from '@/store';

interface ManageWorkspacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageWorkspacesModal({ isOpen, onClose }: ManageWorkspacesModalProps) {
  const { workspaces, createWorkspace, updateWorkspace, deleteWorkspace } = useWorkspaceStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace({
        name: newWorkspaceName,
        description: newWorkspaceDescription,
        color: `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo'][Math.floor(Math.random() * 6)]}-500`,
        type: 'team'
      });
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteWorkspace = (id: string) => {
    if (confirm('Are you sure you want to delete this workspace?')) {
      deleteWorkspace(id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Manage workspaces
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Create, edit, and organize your workspaces
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Create New Workspace Button */}
            {!showCreateForm && (
              <div className="mb-6">
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create new workspace
                </Button>
              </div>
            )}

            {/* Create Workspace Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Create new workspace
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Workspace name *
                    </label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Enter workspace name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={newWorkspaceDescription}
                      onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                      placeholder="Describe what this workspace is for"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName.trim()}>
                      Create workspace
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewWorkspaceName('');
                        setNewWorkspaceDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Workspaces List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your workspaces ({workspaces.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspaces.map((workspace) => (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${workspace.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                          {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {workspace.name}
                          </h4>
                          {workspace.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {workspace.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {workspace.type === 'personal' && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {workspace.memberCount || 1} member{(workspace.memberCount || 1) > 1 ? 's' : ''}
                        </span>
                        <span className="capitalize">{workspace.type} workspace</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                      >
                        <Settings className="h-3 w-3" />
                        Settings
                      </Button>
                      {workspace.type !== 'personal' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkspace(workspace.id)}
                          className="flex items-center gap-1 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}