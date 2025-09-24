import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Circle,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { useWorkspaceData } from '../../hooks/useWorkspaceData';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<string[]>(['workspace-1']);
  const { workspaces, addBoard, deleteBoard } = useWorkspaceData();

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev =>
      prev.includes(workspaceId)
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const handleAddBoard = (workspaceId: string) => {
    const name = prompt('Board name:');
    if (name) {
      const description = prompt('Board description (optional):');
      const newBoard = addBoard(workspaceId, name, description || undefined);
      navigate(`/board/${newBoard.id}`);
    }
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this board? This action cannot be undone.')) {
      deleteBoard(boardId);
      // If we're currently viewing this board, navigate to home
      if (location.pathname === `/board/${boardId}`) {
        navigate('/');
      }
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">COW Boards</h1>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-4 py-2">
          <Link
            to="/"
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive('/')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Workspaces */}
        <div className="px-4 py-2">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="mb-2">
              {/* Workspace Header */}
              <button
                onClick={() => toggleWorkspace(workspace.id)}
                className="group flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  {expandedWorkspaces.includes(workspace.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <Circle
                    className="w-3 h-3"
                    style={{ color: workspace.color }}
                    fill={workspace.color}
                  />
                  <span>{workspace.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddBoard(workspace.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </button>

              {/* Boards */}
              {expandedWorkspaces.includes(workspace.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {workspace.boards.map((board) => (
                    <div key={board.id} className="group relative">
                      <Link
                        to={`/board/${board.id}`}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors pr-8 ${
                          isActive(`/board/${board.id}`)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Circle
                          className="w-2 h-2"
                          style={{ color: board.color }}
                          fill={board.color}
                        />
                        <span className="flex-1 truncate">{board.name}</span>
                      </Link>
                      <button
                        onClick={(e) => handleDeleteBoard(board.id, e)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add Board Button */}
                  <button
                    onClick={() => handleAddBoard(workspace.id)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md w-full"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add board</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};