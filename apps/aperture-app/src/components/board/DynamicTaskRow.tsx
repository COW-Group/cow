import React, { useState } from 'react';
import { User, Calendar, Flag, BarChart3, FileText, Clock, MoreHorizontal, MessageCircle } from 'lucide-react';
import { COWBoardTask, ComponentType } from '../../types/board.types';

interface DynamicTaskRowProps {
  task: COWBoardTask;
  groupId: string;
  columns: ComponentType[];
  onUpdateTask: (updates: Partial<COWBoardTask>) => void;
  onDeleteTask: () => void;
  onDuplicateTask: () => void;
  isDragging?: boolean;
}

export function DynamicTaskRow({
  task,
  groupId,
  columns,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  isDragging = false
}: DynamicTaskRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleTitleSubmit = () => {
    if (title.trim() && title !== task.title) {
      onUpdateTask({ title: title.trim() });
    } else {
      setTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'Working on it':
        return 'bg-blue-100 text-blue-800';
      case 'Stuck':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderColumn = (columnType: ComponentType) => {
    switch (columnType) {
      case 'assignee-picker':
        return (
          <div className="flex -space-x-1">
            {task.assigneeIds.slice(0, 2).map((assigneeId, index) => (
              <div
                key={assigneeId}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border border-white"
                title={`Assignee ${assigneeId}`}
              >
                <User className="w-3 h-3" />
              </div>
            ))}
            {task.assigneeIds.length > 2 && (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs border border-white">
                +{task.assigneeIds.length - 2}
              </div>
            )}
          </div>
        );

      case 'status-picker':
        return (
          <select
            value={task.status}
            onChange={(e) => onUpdateTask({ status: e.target.value })}
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 outline-none cursor-pointer ${getStatusColor(task.status)}`}
          >
            <option value="Not Started">Not Started</option>
            <option value="Working on it">Working on it</option>
            <option value="Stuck">Stuck</option>
            <option value="Done">Done</option>
          </select>
        );

      case 'priority-picker':
        return (
          <select
            value={task.priority}
            onChange={(e) => onUpdateTask({ priority: e.target.value })}
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 outline-none cursor-pointer ${getPriorityColor(task.priority)}`}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        );

      case 'date-picker':
        return (
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-3 h-3" />
            <input
              type="date"
              value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => onUpdateTask({ 
                dueDate: e.target.value ? new Date(e.target.value).getTime() : undefined 
              })}
              className="text-xs bg-transparent border-none outline-none cursor-pointer"
            />
          </div>
        );

      case 'progress-picker':
        return (
          <div className="flex items-center space-x-2 w-full">
            <input
              type="range"
              min="0"
              max="100"
              value={task.progress || 0}
              onChange={(e) => onUpdateTask({ progress: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8">{task.progress || 0}%</span>
          </div>
        );

      case 'number-picker':
        return (
          <input
            type="number"
            value={task.customFields?.number || ''}
            onChange={(e) => onUpdateTask({ 
              customFields: { 
                ...task.customFields, 
                number: e.target.value ? parseInt(e.target.value) : undefined 
              }
            })}
            className="w-16 text-xs bg-transparent border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
            placeholder="0"
          />
        );

      case 'file-picker':
        return (
          <div className="flex items-center space-x-1 text-gray-500">
            <FileText className="w-3 h-3" />
            <span className="text-xs">
              {task.customFields?.fileCount || 0}
            </span>
          </div>
        );

      case 'updated-picker':
        return (
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {new Date(task.updatedBy.date).toLocaleDateString()}
            </span>
          </div>
        );

      default:
        return <div className="text-xs text-gray-500">-</div>;
    }
  };

  const gridCols = Math.max(columns.length + 2, 4); // +2 for title and actions

  return (
    <div 
      className={`px-6 py-4 hover:bg-gray-50 border-b border-gray-100 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className={`grid gap-4 items-center text-sm grid-cols-${gridCols}`}>
        {/* Task Title - Always first column */}
        <div className="col-span-2 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyPress}
              className="font-medium text-gray-900 bg-white px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              autoFocus
            />
          ) : (
            <div 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 truncate"
              onClick={() => setIsEditingTitle(true)}
              title={task.title}
            >
              {task.title}
            </div>
          )}
          
          {task.comments.length > 0 && (
            <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
              <MessageCircle className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Dynamic Columns */}
        {columns.map((columnType) => (
          <div key={columnType} className="min-w-0">
            {renderColumn(columnType)}
          </div>
        ))}

        {/* Actions - Always last column */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    onDuplicateTask();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Duplicate Task
                </button>
                
                <div className="border-t border-gray-100 my-1" />
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      onDeleteTask();
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}