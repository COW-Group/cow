import React, { useState } from 'react';
import { X, Grid3x3, BarChart3, FileText, ClipboardList, Folder } from 'lucide-react';
import { CreateItemType } from './AddItemDropdown';
import { Workspace, WorkspaceBoard, WorkspaceDashboard, WorkspaceDoc, WorkspaceForm, Folder as WorkspaceFolder } from '../../types/workspace.types';

interface CreateItemModalProps {
  isOpen: boolean;
  type: CreateItemType | null;
  workspace: Workspace;
  targetFolder?: WorkspaceFolder;
  currentUserId?: string;
  onClose: () => void;
  onCreateItem: (type: CreateItemType, data: any) => void;
}

const ITEM_CONFIGS = {
  board: {
    icon: Grid3x3,
    title: 'Create Board',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Organize and track your work with customizable boards'
  },
  dashboard: {
    icon: BarChart3,
    title: 'Create Dashboard',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Visualize your data with charts and widgets'
  },
  doc: {
    icon: FileText,
    title: 'Create Doc',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Create collaborative documents and notes'
  },
  form: {
    icon: ClipboardList,
    title: 'Create Form',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Collect information with customizable forms'
  },
  folder: {
    icon: Folder,
    title: 'Create Folder',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    description: 'Organize your workspace items into folders'
  }
};

const FOLDER_COLORS = [
  '#579bfc', // Blue
  '#00c875', // Green
  '#ff9f40', // Orange
  '#e2445c', // Red
  '#9d34da', // Purple
  '#fdab3d', // Yellow
];

export function CreateItemModal({
  isOpen,
  type,
  workspace,
  targetFolder,
  currentUserId,
  onClose,
  onCreateItem
}: CreateItemModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: FOLDER_COLORS[0],
    linkedBoardId: ''
  });

  console.log('🟣 CreateItemModal render:', { isOpen, type, workspaceId: workspace?.id, targetFolderId: targetFolder?.id });

  if (!isOpen || !type) {
    console.log('  → Modal not rendering (isOpen:', isOpen, 'type:', type, ')');
    return null;
  }

  console.log('  → Modal RENDERING for type:', type);

  const config = ITEM_CONFIGS[type];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🟠 CreateItemModal handleSubmit:', type, formData);

    if (!formData.name.trim()) {
      console.log('  → Name is empty, not submitting');
      return;
    }

    const baseData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      workspaceId: workspace.id,
      folderId: targetFolder?.id,
      ownerId: currentUserId || 'unknown-user'
    };

    console.log('📝 CreateItemModal: Using ownerId:', currentUserId);

    let itemData;
    switch (type) {
      case 'board':
        itemData = {
          ...baseData,
          color: formData.color,
          boardType: 'flexiboard' as const
        };
        break;
      case 'dashboard':
        itemData = {
          ...baseData
        };
        break;
      case 'doc':
        itemData = {
          ...baseData
        };
        break;
      case 'form':
        itemData = {
          ...baseData,
          linkedBoardId: formData.linkedBoardId || undefined,
          submissionCount: 0,
          isActive: true
        };
        break;
      case 'folder':
        itemData = {
          ...baseData,
          color: formData.color,
          parentId: targetFolder?.id,
          collapsed: false
        };
        break;
      default:
        return;
    }

    console.log('  → Calling onCreateItem with:', type, itemData);
    onCreateItem(type, itemData);

    // Reset form
    setFormData({
      name: '',
      description: '',
      color: FOLDER_COLORS[0],
      linkedBoardId: ''
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 ${config.bgColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-white ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {targetFolder && (
            <div className="mt-3 text-sm text-gray-600">
              Creating in: <span className="font-medium">{targetFolder.name}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {config.title.split(' ')[1]} Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${type} name`}
              required
              autoFocus
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
              placeholder={`Describe your ${type}`}
            />
          </div>

          {/* Color Selection (for folders and boards) */}
          {(type === 'folder' || type === 'board') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="flex space-x-2">
                {FOLDER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-gray-400 scale-110' : 'border-gray-200'
                    } transition-transform`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Linked Board (for forms) */}
          {type === 'form' && workspace.boards.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Board (Optional)
              </label>
              <select
                value={formData.linkedBoardId}
                onChange={(e) => setFormData({ ...formData, linkedBoardId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a board to link submissions</option>
                {workspace.boards.map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create {config.title.split(' ')[1]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}