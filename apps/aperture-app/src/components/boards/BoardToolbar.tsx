import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  User, 
  Filter, 
  Layers, 
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
// import { Popover } from '@headlessui/react';

interface BoardToolbarProps {
  onNewItem?: (type: string) => void;
  onSearch?: (query: string) => void;
  onFilterByPerson?: (personId: string) => void;
  onFilter?: () => void;
  onGroupBy?: (field: string) => void;
  onTableAction?: (action: string) => void;
}

export function BoardToolbar({
  onNewItem,
  onSearch,
  onFilterByPerson,
  onFilter,
  onGroupBy,
  onTableAction
}: BoardToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const newItemTypes = [
    { id: 'standard', label: 'Standard Item' },
    { id: 'template', label: 'From Template' },
    { id: 'import', label: 'Import from...' }
  ];

  const groupByOptions = [
    { id: 'status', label: 'Status' },
    { id: 'person', label: 'Person' },
    { id: 'date', label: 'Date' },
    { id: 'priority', label: 'Priority' }
  ];

  const tableActions = [
    { id: 'add-subtable', label: 'Add Sub-table' },
    { id: 'export-csv', label: 'Export to CSV' },
    { id: 'export-excel', label: 'Export to Excel' },
    { id: 'duplicate', label: 'Duplicate Table' }
  ];

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      {/* Sub-header with table label */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Main table
          </span>
          
          <Popover className="relative">
            <Popover.Button className="text-gray-400 hover:text-teal-500 transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </Popover.Button>

            <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                {tableActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onTableAction?.(action.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </Popover>
        </div>

        <button className="text-gray-400 hover:text-teal-500 transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Main toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* New Item Button */}
          <Popover className="relative">
            <Popover.Button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded text-sm font-medium transition-colors">
              <span>New Item</span>
              <ChevronDown className="h-3 w-3" />
            </Popover.Button>

            <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                {newItemTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => onNewItem?.(type.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </Popover>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Person Filter */}
          <Popover className="relative">
            <Popover.Button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-teal-500 transition-colors">
              <User className="h-4 w-4" />
              <span className="text-sm">Person</span>
            </Popover.Button>

            <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                <button
                  onClick={() => onFilterByPerson?.('all')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  All People
                </button>
                <button
                  onClick={() => onFilterByPerson?.('unassigned')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Unassigned
                </button>
                <button
                  onClick={() => onFilterByPerson?.('me')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Assigned to me
                </button>
              </div>
            </Popover.Panel>
          </Popover>

          {/* Filter */}
          <button
            onClick={onFilter}
            className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-teal-500 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
          </button>

          {/* Group By */}
          <Popover className="relative">
            <Popover.Button className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-teal-500 transition-colors">
              <Layers className="h-4 w-4" />
              <span className="text-sm">Group by ---</span>
            </Popover.Button>

            <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                <button
                  onClick={() => onGroupBy?.('none')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  No grouping
                </button>
                {groupByOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onGroupBy?.(option.id)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Group by {option.label}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </Popover>
        </div>
      </div>
    </div>
  );
}