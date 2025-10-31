import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreHorizontal,
  ExternalLink,
  Edit3,
  RefreshCw,
  Star,
  StarOff,
  Bookmark,
  Trash2,
  Plus,
  Folder,
  Grid3x3,
  BarChart3,
  FileText,
  ClipboardList,
  Palette
} from 'lucide-react';
import { WorkspaceBoard, Folder as WorkspaceFolder } from '../../types/workspace.types';

interface ItemContextMenuProps {
  item: WorkspaceBoard | WorkspaceFolder;
  itemType: 'board' | 'folder';
  onAction: (action: string, item: any) => void;
  trigger?: React.ReactNode;
}

export function ItemContextMenu({ item, itemType, onAction, trigger }: ItemContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCreateSubmenu, setShowCreateSubmenu] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowColorPicker(false);
        setShowCreateSubmenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateSubmenuPosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.right + 4, // Small gap
    };
  };

  const handleSubmenuToggle = (action: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.currentTarget;
    const position = calculateSubmenuPosition(target);
    setSubmenuPosition(position);
    
    if (action === 'create-in-folder') {
      setShowCreateSubmenu(!showCreateSubmenu);
      setShowColorPicker(false);
    } else if (action === 'change-color') {
      setShowColorPicker(!showColorPicker);
      setShowCreateSubmenu(false);
    }
  };

  const handleAction = (action: string, data?: any) => {
    onAction(action, { ...item, ...data });
    setIsOpen(false);
    setShowColorPicker(false);
    setShowCreateSubmenu(false);
  };

  const FOLDER_COLORS = [
    '#579bfc', // Blue
    '#00c875', // Green
    '#ff9f40', // Orange
    '#e2445c', // Red
    '#9d34da', // Purple
    '#fdab3d', // Yellow
  ];

  const createOptions = [
    { type: 'board', icon: Grid3x3, label: 'Board' },
    { type: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { type: 'doc', icon: FileText, label: 'Doc' },
    { type: 'form', icon: ClipboardList, label: 'Form' },
    { type: 'folder', icon: Folder, label: 'Folder' },
  ];

  const menuItems = () => {
    const common = [
      {
        icon: ExternalLink,
        label: 'Open in new tab',
        action: 'open-new-tab'
      },
      {
        icon: Edit3,
        label: 'Rename',
        action: 'rename'
      }
    ];

    if (itemType === 'board') {
      const board = item as WorkspaceBoard;
      return [
        ...common,
        {
          icon: RefreshCw,
          label: 'Change type',
          action: 'change-type'
        },
        {
          icon: board.starred ? StarOff : Star,
          label: board.starred ? 'Remove from favorites' : 'Add to favorites',
          action: 'toggle-favorite'
        },
        {
          icon: Bookmark,
          label: 'Save as template',
          action: 'save-template'
        },
        { divider: true },
        {
          icon: Trash2,
          label: 'Remove',
          action: 'remove',
          danger: true
        }
      ];
    } else {
      // Folder items
      return [
        ...common,
        {
          icon: Plus,
          label: 'Create in folder',
          action: 'create-in-folder',
          hasSubmenu: true
        },
        {
          icon: Palette,
          label: 'Change color',
          action: 'change-color',
          hasSubmenu: true
        },
        {
          icon: Bookmark,
          label: 'Save as template',
          action: 'save-template'
        },
        { divider: true },
        {
          icon: Trash2,
          label: 'Delete folder',
          action: 'remove',
          danger: true
        }
      ];
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
        >
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
        </button>
      )}

      {/* Context Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-[99998]">
          <div className="py-1">
            {menuItems().map((menuItem, index) => {
              if ('divider' in menuItem) {
                return <div key={index} className="border-t border-gray-100 my-1" />;
              }

              const Icon = menuItem.icon;
              return (
                <div key={index} className="relative">
                  <button
                    onClick={(e) => {
                      if (menuItem.action === 'create-in-folder' || menuItem.action === 'change-color') {
                        handleSubmenuToggle(menuItem.action, e);
                      } else {
                        handleAction(menuItem.action);
                      }
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      menuItem.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{menuItem.label}</span>
                    {menuItem.hasSubmenu && (
                      <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Portal-rendered submenus */}
      {showCreateSubmenu && createPortal(
        <div 
          className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-[99999]"
          style={{ 
            top: `${submenuPosition.top}px`, 
            left: `${submenuPosition.left}px` 
          }}
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
              Create in {item.name}
            </div>
            {createOptions.map((option) => {
              const OptionIcon = option.icon;
              return (
                <button
                  key={option.type}
                  onClick={() => handleAction('create-in-folder', { createType: option.type })}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <OptionIcon className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}

      {showColorPicker && createPortal(
        <div 
          className="fixed w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[99999]"
          style={{ 
            top: `${submenuPosition.top}px`, 
            left: `${submenuPosition.left}px` 
          }}
        >
          <div className="py-3 px-3">
            <div className="text-xs font-medium text-gray-500 mb-3">Choose color</div>
            <div className="grid grid-cols-3 gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleAction('change-color', { color })}
                  className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                    item.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}