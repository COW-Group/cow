import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { BoardGroup, BoardItem } from '../../types/board.types';
import { ItemRow } from './ItemRow';

interface TableGroupProps {
  group: BoardGroup;
  onUpdateGroup?: (groupId: string, updates: Partial<BoardGroup>) => void;
  onUpdateItem?: (itemId: string, updates: Partial<BoardItem>) => void;
  onAddItem?: (groupId: string, itemName: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

export function TableGroup({ 
  group, 
  onUpdateGroup, 
  onUpdateItem, 
  onAddItem, 
  onDeleteItem 
}: TableGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(group.collapsed || false);
  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onUpdateGroup?.(group.id, { collapsed: newCollapsed });
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem?.(group.id, newItemName.trim());
      setNewItemName('');
      setShowAddForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setNewItemName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="mb-4">
      {/* Group Header */}
      <div className="flex items-center space-x-3 py-3 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <button
          onClick={handleToggleCollapse}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={isCollapsed ? 'Expand group' : 'Collapse group'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: group.color }}
          />
          <h3 className="text-sm font-bold text-black dark:text-white" style={{ color: group.color }}>
            {group.title}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            {group.items.length}
          </span>
        </div>
      </div>

      {/* Group Content */}
      {!isCollapsed && (
        <div className="bg-white dark:bg-gray-900">
          {/* Table Header - Sticky */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 grid grid-cols-[40px_200px_150px_150px_100px_40px] gap-4 items-center py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider z-10">
            <div></div>
            <div>Item</div>
            <div>Person</div>
            <div>Status</div>
            <div>Date</div>
            <div></div>
          </div>

          {/* Items */}
          {group.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
            />
          ))}

          {/* Add Item Row */}
          {showAddForm ? (
            <div className="grid grid-cols-[40px_200px_150px_150px_100px_40px] gap-4 items-center py-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-blue-50 dark:bg-blue-900/20">
              <div></div>
              <div>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={() => {
                    if (!newItemName.trim()) {
                      setShowAddForm(false);
                    }
                  }}
                  placeholder="Enter item name"
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  autoFocus
                />
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddItem}
                  className="text-teal-500 hover:text-teal-600 text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNewItemName('');
                    setShowAddForm(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full grid grid-cols-[40px_200px_150px_150px_100px_40px] gap-4 items-center py-3 px-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
            >
              <div></div>
              <div className="flex items-center space-x-2 text-sm text-gray-400 italic">
                <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Add Item</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}