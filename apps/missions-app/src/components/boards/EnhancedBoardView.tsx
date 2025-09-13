import React, { useState } from 'react';
import { 
  ChevronDown, 
  Star,
  Plus
} from 'lucide-react';
import { Popover } from '@headlessui/react';
import { EnhancedBoard, BoardGroup, BoardItem } from '../../types/board.types';
import { CollaborationBar } from './CollaborationBar';
import { BoardToolbar } from './BoardToolbar';
import { TableGroup } from './TableGroup';

interface EnhancedBoardViewProps {
  board: EnhancedBoard;
  onUpdateBoard?: (boardId: string, updates: Partial<EnhancedBoard>) => void;
  onUpdateGroup?: (groupId: string, updates: Partial<BoardGroup>) => void;
  onUpdateItem?: (itemId: string, updates: Partial<BoardItem>) => void;
  onAddGroup?: (title: string) => void;
  onAddItem?: (groupId: string, itemName: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

// Mock data for the enhanced board view
const createMockBoard = (boardName: string): EnhancedBoard => ({
  id: '1',
  slug: 'contacts',
  name: boardName,
  workspaceId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  columns: [
    { id: 'checkbox', name: '', type: 'checkbox', width: 40, visible: true },
    { id: 'item', name: 'Item', type: 'text', width: 200, visible: true, sortable: true },
    { id: 'person', name: 'Person', type: 'person', width: 150, visible: true },
    { id: 'status', name: 'Status', type: 'status', width: 150, visible: true },
    { id: 'date', name: 'Date', type: 'date', width: 100, visible: true, sortable: true },
  ],
  groups: [
    {
      id: 'group-1',
      title: 'Group Title',
      color: '#A020F0',
      collapsed: false,
      items: [
        {
          id: 'item-1',
          name: 'Item 1',
          person: [{ id: 'user-1', name: 'John Doe', avatar: '' }],
          status: { id: 'working', label: 'Working on it', color: '#FFA500', textColor: '#FFFFFF' },
          date: 'Sep 9',
          checked: false
        },
        {
          id: 'item-2',
          name: 'Item 2',
          person: [{ id: 'user-2', name: 'Jane Smith', avatar: '' }],
          status: { id: 'done', label: 'Done', color: '#008000', textColor: '#FFFFFF' },
          date: 'Sep 16',
          checked: true
        },
        {
          id: 'item-3',
          name: 'Item 3',
          person: [],
          date: 'Sep 9',
          checked: false
        }
      ]
    },
    {
      id: 'group-2',
      title: 'Another Group',
      color: '#FF6B6B',
      collapsed: false,
      items: [
        {
          id: 'item-4',
          name: 'Item 4',
          person: [],
          date: 'Sep 16',
          checked: false
        },
        {
          id: 'item-5',
          name: 'Item 5',
          person: [{ id: 'user-3', name: 'Mike Johnson', avatar: '' }],
          status: { id: 'working', label: 'Working on it', color: '#FFA500', textColor: '#FFFFFF' },
          date: 'Sep 13',
          checked: false
        }
      ]
    }
  ]
});

export function EnhancedBoardView({ 
  board: initialBoard,
  onUpdateBoard,
  onUpdateGroup,
  onUpdateItem,
  onAddGroup,
  onAddItem,
  onDeleteItem
}: EnhancedBoardViewProps) {
  // Use mock data if no board provided
  const [board, setBoard] = useState<EnhancedBoard>(
    initialBoard || createMockBoard('Contacts')
  );
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');

  const boardActions = [
    { id: 'rename', label: 'Rename Board' },
    { id: 'duplicate', label: 'Duplicate Board' },
    { id: 'export', label: 'Export Board' },
    { id: 'delete', label: 'Delete Board', danger: true }
  ];

  const handleBoardAction = (action: string) => {
    console.log('Board action:', action);
    // TODO: Implement board actions
  };

  const handleAddGroupSubmit = () => {
    if (newGroupTitle.trim()) {
      const newGroup: BoardGroup = {
        id: `group-${Date.now()}`,
        title: newGroupTitle.trim(),
        color: '#4F46E5',
        collapsed: false,
        items: []
      };
      
      setBoard(prev => ({
        ...prev,
        groups: [...prev.groups, newGroup]
      }));
      
      onAddGroup?.(newGroupTitle.trim());
      setNewGroupTitle('');
      setShowAddGroup(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGroupSubmit();
    } else if (e.key === 'Escape') {
      setNewGroupTitle('');
      setShowAddGroup(false);
    }
  };

  const handleUpdateGroup = (groupId: string, updates: Partial<BoardGroup>) => {
    setBoard(prev => ({
      ...prev,
      groups: prev.groups.map(group => 
        group.id === groupId ? { ...group, ...updates } : group
      )
    }));
    onUpdateGroup?.(groupId, updates);
  };

  const handleUpdateItem = (itemId: string, updates: Partial<BoardItem>) => {
    setBoard(prev => ({
      ...prev,
      groups: prev.groups.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      }))
    }));
    onUpdateItem?.(itemId, updates);
  };

  const handleAddItem = (groupId: string, itemName: string) => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      person: [],
      checked: false
    };

    setBoard(prev => ({
      ...prev,
      groups: prev.groups.map(group => 
        group.id === groupId 
          ? { ...group, items: [...group.items, newItem] }
          : group
      )
    }));
    
    onAddItem?.(groupId, itemName);
  };

  const handleDeleteItem = (itemId: string) => {
    setBoard(prev => ({
      ...prev,
      groups: prev.groups.map(group => ({
        ...group,
        items: group.items.filter(item => item.id !== itemId)
      }))
    }));
    onDeleteItem?.(itemId);
  };

  return (
    <div className="flex-1 bg-white dark:bg-black min-h-screen" style={{ marginLeft: '250px', paddingTop: '80px' }}>
      <div className="p-6">
        {/* Board Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                {board.name}
              </h1>
              
              <Popover className="relative">
                <Popover.Button className="text-gray-400 hover:text-teal-500 transition-colors">
                  <ChevronDown className="h-4 w-4" />
                </Popover.Button>

                <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-2">
                    {boardActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleBoardAction(action.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded ${
                          action.danger
                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </Popover.Panel>
              </Popover>
            </div>

            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Star className="h-4 w-4" />
            </button>
          </div>

          {/* Collaboration Bar */}
          <CollaborationBar
            onSidekick={() => console.log('Sidekick clicked')}
            onEnhance={() => console.log('Enhance clicked')}
            onIntegrate={() => console.log('Integrate clicked')}
            onAutomate={() => console.log('Automate clicked')}
            onChat={() => console.log('Chat clicked')}
            onInvite={() => console.log('Invite clicked')}
          />
        </div>

        {/* Board Toolbar */}
        <BoardToolbar
          onNewItem={(type) => console.log('New item:', type)}
          onSearch={(query) => console.log('Search:', query)}
          onFilterByPerson={(personId) => console.log('Filter by person:', personId)}
          onFilter={() => console.log('Filter clicked')}
          onGroupBy={(field) => console.log('Group by:', field)}
          onTableAction={(action) => console.log('Table action:', action)}
        />

        {/* Table Content */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {board.groups.map((group) => (
                <TableGroup
                  key={group.id}
                  group={group}
                  onUpdateGroup={handleUpdateGroup}
                  onUpdateItem={handleUpdateItem}
                  onAddItem={handleAddItem}
                  onDeleteItem={handleDeleteItem}
                />
              ))}

              {/* Add New Group */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {showAddGroup ? (
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newGroupTitle}
                      onChange={(e) => setNewGroupTitle(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onBlur={() => {
                        if (!newGroupTitle.trim()) {
                          setShowAddGroup(false);
                        }
                      }}
                      placeholder="Group title"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      autoFocus
                    />
                    <button
                      onClick={handleAddGroupSubmit}
                      className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewGroupTitle('');
                        setShowAddGroup(false);
                      }}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddGroup(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Add new group</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State (if no items) */}
        {board.groups.every(group => group.items.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No items in this board yet. Click "New Item" to get started.
            </p>
            <button
              onClick={() => console.log('Add first item')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
            >
              Add First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}