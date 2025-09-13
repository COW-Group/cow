import React, { useState } from 'react';
import { 
  ChevronDown, 
  Star, 
  Wand2, 
  Zap, 
  MessageCircle, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  CheckSquare
} from 'lucide-react';
import { BoardManagementView } from '../../types/board.types';

interface SimpleBoardViewProps {
  board: BoardManagementView;
  onUpdateItem?: (itemId: string, columnId: string, value: any) => void;
  onAddItem?: (groupId: string, name: string) => void;
  onAddGroup?: (title: string) => void;
  onAddColumn?: (name: string, type: string) => void;
}

export function SimpleBoardView({ 
  board,
  onUpdateItem,
  onAddItem,
  onAddGroup,
  onAddColumn
}: SimpleBoardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Board Header */}
      <div className="fixed top-20 left-64 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {board.name}
            </h1>
            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <Star className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <button className="flex items-center space-x-1 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800">
                <Wand2 className="h-4 w-4" />
                <span>Sidekick</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Zap className="h-4 w-4" />
                <span>Enhance</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <MessageCircle className="h-4 w-4" />
                <span>Integrate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-header Controls */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onAddItem?.('new', 'New Item')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>New Item</span>
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
                <MoreHorizontal className="h-4 w-4" />
                <span>Group by</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 mt-32 p-6 overflow-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Table Header */}
          <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="w-8">
              <CheckSquare className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 px-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Item</span>
            </div>
            <div className="w-32 px-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Person</span>
            </div>
            <div className="w-32 px-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
            </div>
            <div className="w-24 px-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</span>
            </div>
            <div className="w-8">
              <button 
                onClick={() => onAddColumn?.('New Column', 'text')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sample Row */}
          <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="w-8">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 dark:border-gray-700 text-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1 px-4">
              <input 
                type="text" 
                defaultValue="Sample Item"
                className="w-full bg-transparent text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
            <div className="w-32 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">JD</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">John Doe</span>
              </div>
            </div>
            <div className="w-32 px-4">
              <span 
                className="inline-block px-3 py-1 text-xs rounded-full text-white" 
                style={{ backgroundColor: board.statusLabels[0]?.color || '#6B7280' }}
              >
                {board.statusLabels[0]?.label || 'No status'}
              </span>
            </div>
            <div className="w-24 px-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">Sep 11</span>
            </div>
            <div className="w-8">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Empty State */}
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No items in this board yet. Click "New Item" to get started.
              </p>
              <button
                onClick={() => onAddItem?.('new', 'New Item')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Add First Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}