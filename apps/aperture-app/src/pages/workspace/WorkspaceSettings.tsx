import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Folder,
  Settings,
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  AlertTriangle,
  Grid3x3,
  X,
} from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function WorkspaceSettings() {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadWorkspaces();
  }, [userProfile?.organization_id]);

  const loadWorkspaces = async () => {
    if (!userProfile?.organization_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkspaces(data || []);
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!userProfile?.organization_id || !formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: formData.name,
          description: formData.description,
          organization_id: userProfile.organization_id,
          created_by: userProfile.id,
        })
        .select()
        .single();

      if (error) throw error;

      setWorkspaces([data, ...workspaces]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      alert('Workspace created successfully!');
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      alert(`Failed to create workspace: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    if (!editingWorkspace || !formData.name.trim()) {
      alert('Please enter a workspace name');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('workspaces')
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq('id', editingWorkspace.id);

      if (error) throw error;

      // Update local state
      setWorkspaces(workspaces.map(ws =>
        ws.id === editingWorkspace.id
          ? { ...ws, name: formData.name, description: formData.description }
          : ws
      ));

      setEditingWorkspace(null);
      setFormData({ name: '', description: '' });
      alert('Workspace updated successfully!');
    } catch (error: any) {
      console.error('Error updating workspace:', error);
      alert(`Failed to update workspace: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    if (!confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', workspace.id);

      if (error) throw error;

      setWorkspaces(workspaces.filter(ws => ws.id !== workspace.id));
      alert('Workspace deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting workspace:', error);
      alert(`Failed to delete workspace: ${error.message}`);
    }
  };

  const startEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingWorkspace(null);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading workspaces...</div>
      </div>
    );
  }

  if (!userProfile?.organization_id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Organization</h3>
          <p className="text-gray-500 mt-2">You need to belong to an organization to manage workspaces.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                <Grid3x3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Workspace Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage workspaces in your organization</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200">
          {workspaces.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Workspaces Yet</h3>
              <p className="text-gray-500 mt-2">Create your first workspace to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Workspace
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="p-6">
                  {editingWorkspace?.id === workspace.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="My Workspace"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your workspace..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={handleUpdateWorkspace}
                          disabled={saving}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{workspace.name}</h3>
                        {workspace.description && (
                          <p className="text-sm text-gray-500 mt-1">{workspace.description}</p>
                        )}
                        <div className="text-xs text-gray-400 mt-2">
                          Created {new Date(workspace.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(workspace)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit workspace"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteWorkspace(workspace)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete workspace"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Workspace</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Workspace"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your workspace..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCreateWorkspace}
                  disabled={saving || !formData.name.trim()}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Workspace</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
