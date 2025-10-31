import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Plus, Copy, Trash2, Edit2 } from 'lucide-react';
import { COWBoardGroup } from '../../types/board.types';

interface GroupHeaderProps {
  group: COWBoardGroup;
  onAddTask: () => void;
  onUpdateGroup: (updates: Partial<COWBoardGroup>) => void;
  onDeleteGroup: () => void;
  onDuplicateGroup: () => void;
  isDragging?: boolean;
}

export function GroupHeader({
  group,
  onAddTask,
  onUpdateGroup,
  onDeleteGroup,
  onDuplicateGroup,
  isDragging = false
}: GroupHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(group.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [showMenu]);

  const handleTitleSubmit = () => {
    if (title.trim() && title !== group.title) {
      onUpdateGroup({ title: title.trim() });
    } else {
      setTitle(group.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(group.title);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className={`px-6 py-3 bg-gray-50 border-l-4 ${isDragging ? 'opacity-50' : ''}`}
      style={{ borderLeftColor: group.color }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyPress}
              className="font-medium text-gray-900 bg-white px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h3 
              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            >
              {group.title}
            </h3>
          )}
          
          <span className="text-sm text-gray-500">
            {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onAddTask}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Rename Group</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onDuplicateGroup();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Duplicate Group</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1" />
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this group and all its tasks?')) {
                        onDeleteGroup();
                      }
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Group</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}