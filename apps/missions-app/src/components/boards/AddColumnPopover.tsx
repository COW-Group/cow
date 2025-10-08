import React, { useState } from 'react';
import { 
  Search, 
  Hash, 
  Users, 
  CheckCircle, 
  Calendar,
  Link,
  FileText,
  Copy,
  BarChart3,
  CheckSquare,
  Type
} from 'lucide-react';
// import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface AddColumnPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (name: string, type: string) => void;
}

interface ColumnTypeItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: 'essentials' | 'super-useful';
}

const columnTypes: ColumnTypeItem[] = [
  // Essentials
  { id: 'numbers', name: 'Numbers', icon: Hash, color: 'bg-yellow-500', category: 'essentials' },
  { id: 'person', name: 'People', icon: Users, color: 'bg-purple-500', category: 'essentials' },
  { id: 'status', name: 'Status', icon: CheckCircle, color: 'bg-green-500', category: 'essentials' },
  { id: 'timeline', name: 'Timeline', icon: BarChart3, color: 'bg-purple-500', category: 'essentials' },
  { id: 'date', name: 'Date', icon: Calendar, color: 'bg-blue-500', category: 'essentials' },
  
  // Super useful
  { id: 'connect-boards', name: 'Connect boards', icon: Link, color: 'bg-red-500', category: 'super-useful' },
  { id: 'files', name: 'Files', icon: FileText, color: 'bg-pink-500', category: 'super-useful' },
  { id: 'mirror', name: 'Mirror', icon: Copy, color: 'bg-red-500', category: 'super-useful' },
  { id: 'progress', name: 'Progress', icon: BarChart3, color: 'bg-teal-500', category: 'super-useful' },
  { id: 'checkbox', name: 'Checkbox', icon: CheckSquare, color: 'bg-orange-500', category: 'super-useful' },
  { id: 'text', name: 'Text', icon: Type, color: 'bg-yellow-500', category: 'super-useful' }
];

export function AddColumnPopover({ isOpen, onClose, onAddColumn }: AddColumnPopoverProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTypes = columnTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const essentialTypes = filteredTypes.filter(type => type.category === 'essentials');
  const superUsefulTypes = filteredTypes.filter(type => type.category === 'super-useful');

  const handleColumnSelect = (type: ColumnTypeItem) => {
    onAddColumn(type.name, type.id);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or describe your column"
            className="w-full pl-10 pr-4 py-2 border border-gray-600 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            autoFocus
          />
        </div>

        {/* Essentials Section */}
        {essentialTypes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase mb-3">
              Essentials
            </h3>
            <div className="space-y-1">
              {essentialTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleColumnSelect(type)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className={`w-6 h-6 ${type.color} rounded flex items-center justify-center flex-shrink-0`}>
                    <type.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Super Useful Section */}
        {superUsefulTypes.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium text-gray-400 uppercase mb-3">
              Super useful
            </h3>
            <div className="space-y-1">
              {superUsefulTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleColumnSelect(type)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className={`w-6 h-6 ${type.color} rounded flex items-center justify-center flex-shrink-0`}>
                    <type.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredTypes.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              No columns found for "{searchQuery}"
            </p>
          </div>
        )}

        {/* More Columns Link */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-teal-500 hover:text-teal-600 font-medium">
            More columns
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
}