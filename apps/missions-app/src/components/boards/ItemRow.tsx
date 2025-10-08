import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  User,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { BoardItem, PersonAssignment, StatusLabel } from '../../types/board.types';
// import { Popover } from '@headlessui/react';

interface ItemRowProps {
  item: BoardItem;
  onUpdateItem?: (itemId: string, updates: Partial<BoardItem>) => void;
  onDeleteItem?: (itemId: string) => void;
}

export function ItemRow({ item, onUpdateItem, onDeleteItem }: ItemRowProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);

  const statusOptions: StatusLabel[] = [
    { id: '1', label: 'Working on it', color: '#FFA500', textColor: '#FFFFFF' },
    { id: '2', label: 'Stuck', color: '#FF0000', textColor: '#FFFFFF' },
    { id: '3', label: 'Done', color: '#008000', textColor: '#FFFFFF' },
    { id: '4', label: 'Not started', color: '#808080', textColor: '#FFFFFF' }
  ];

  const handleStatusChange = (status: StatusLabel) => {
    onUpdateItem?.(item.id, { status });
    setShowStatusDropdown(false);
  };

  const handlePersonAdd = () => {
    // Mock person assignment
    const newPerson: PersonAssignment = {
      id: Date.now().toString(),
      name: 'John Doe',
      avatar: ''
    };
    const currentPersons = item.person || [];
    onUpdateItem?.(item.id, { person: [...currentPersons, newPerson] });
    setShowPersonDropdown(false);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onUpdateItem?.(item.id, { checked });
  };

  const handleNameChange = (name: string) => {
    onUpdateItem?.(item.id, { name });
  };

  return (
    <div className="grid grid-cols-[40px_200px_150px_150px_100px_40px] gap-4 items-center py-3 px-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 group">
      {/* Checkbox */}
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={item.checked || false}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="w-4 h-4 text-teal-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500 focus:ring-2"
        />
      </div>

      {/* Item Name */}
      <div className="min-w-0">
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-900 dark:text-white border-none focus:outline-none focus:ring-0 p-0"
          placeholder="Enter item name"
        />
      </div>

      {/* Person Column */}
      <div className="flex items-center space-x-2">
        {item.person && item.person.length > 0 ? (
          <div className="flex items-center space-x-1">
            {item.person.slice(0, 2).map((person, index) => (
              <div 
                key={person.id}
                className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
                title={person.name}
              >
                {person.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
            ))}
            {item.person.length > 2 && (
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white font-medium">
                +{item.person.length - 2}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-400 hover:text-teal-500 transition-colors"
              title="Auto-assign person"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            
            <Popover className="relative">
              <Popover.Button className="text-gray-400 hover:text-teal-500 transition-colors">
                <Plus className="h-4 w-4" />
              </Popover.Button>

              <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3">
                  <button
                    onClick={handlePersonAdd}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Assign to John Doe
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    Assign to Jane Smith
                  </button>
                </div>
              </Popover.Panel>
            </Popover>
          </div>
        )}
      </div>

      {/* Status Column */}
      <div>
        <Popover className="relative">
          <Popover.Button className="w-full text-left">
            {item.status ? (
              <span
                className="inline-block px-3 py-1 text-xs rounded-full text-white font-medium"
                style={{ backgroundColor: item.status.color }}
              >
                {item.status.label}
              </span>
            ) : (
              <div className="w-full h-8 border border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                Set status
              </div>
            )}
          </Popover.Button>

          <Popover.Panel className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center space-x-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{status.label}</span>
                </button>
              ))}
            </div>
          </Popover.Panel>
        </Popover>
      </div>

      {/* Date Column */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {item.date || (
          <button className="text-gray-400 hover:text-teal-500 transition-colors">
            <Calendar className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* More Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover className="relative">
          <Popover.Button className="text-gray-400 hover:text-teal-500 transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </Popover.Button>

          <Popover.Panel className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                Duplicate
              </button>
              <button 
                onClick={() => onDeleteItem?.(item.id)}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                Delete
              </button>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
}