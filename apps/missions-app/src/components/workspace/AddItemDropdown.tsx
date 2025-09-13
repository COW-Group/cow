import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Grid3x3,
  BarChart3,
  FileText,
  ClipboardList,
  Folder,
  ChevronDown
} from 'lucide-react';

export type CreateItemType = 'board' | 'dashboard' | 'doc' | 'form' | 'folder';

interface AddItemDropdownProps {
  onCreateItem: (type: CreateItemType) => void;
  currentFolder?: string;
}

export function AddItemDropdown({ onCreateItem, currentFolder }: AddItemDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (type: CreateItemType) => {
    onCreateItem(type);
    setIsOpen(false);
  };

  const createItems = [
    {
      type: 'board' as CreateItemType,
      icon: Grid3x3,
      label: 'Board',
      description: 'Manage tasks and projects',
      color: 'text-blue-600'
    },
    {
      type: 'dashboard' as CreateItemType,
      icon: BarChart3,
      label: 'Dashboard',
      description: 'Visualize data and metrics',
      color: 'text-purple-600'
    },
    {
      type: 'doc' as CreateItemType,
      icon: FileText,
      label: 'Doc',
      description: 'Create documentation',
      color: 'text-green-600'
    },
    {
      type: 'form' as CreateItemType,
      icon: ClipboardList,
      label: 'Form',
      description: 'Collect data and responses',
      color: 'text-orange-600'
    },
    {
      type: 'folder' as CreateItemType,
      icon: Folder,
      label: 'Folder',
      description: 'Organize your workspace',
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              {currentFolder ? `Add to ${currentFolder}` : 'Add to workspace'}
            </div>
            
            <div className="py-2">
              {createItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleItemClick(item.type)}
                    className="w-full flex items-center px-3 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${item.color} bg-gray-100 group-hover:bg-white mr-3`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-2">
              <div className="px-3 py-2">
                <button className="w-full text-left text-xs text-gray-500 hover:text-gray-700">
                  Browse template center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}