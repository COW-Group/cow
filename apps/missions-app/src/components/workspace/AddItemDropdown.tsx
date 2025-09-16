import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Grid3x3,
  BarChart3,
  FileText,
  ClipboardList,
  Folder,
  ChevronDown,
  Zap
} from 'lucide-react';

export type CreateItemType = 'board' | 'dashboard' | 'doc' | 'form' | 'folder' | 'app';

interface AddItemDropdownProps {
  onCreateItem: (type: CreateItemType) => void;
  currentFolder?: string;
  onAddApp?: () => void;
}

export function AddItemDropdown({ onCreateItem, currentFolder, onAddApp }: AddItemDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const updateDropdownPosition = () => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 400; // Estimated dropdown height
      const dropdownWidth = 288; // w-72 = 288px
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate optimal position
      let top = rect.bottom + 8;
      let left = rect.left;

      // Check if dropdown would go below viewport
      if (top + dropdownHeight > viewportHeight) {
        // Position above the button instead
        top = rect.top - dropdownHeight - 8;
      }

      // Check if dropdown would go beyond right edge
      if (left + dropdownWidth > viewportWidth) {
        // Align to right edge of button
        left = rect.right - dropdownWidth;
      }

      // Ensure dropdown doesn't go beyond left edge
      if (left < 8) {
        left = 8;
      }

      // Ensure dropdown doesn't go above top of viewport
      if (top < 8) {
        top = 8;
      }

      setDropdownStyle({
        position: 'fixed' as const,
        top,
        left,
        zIndex: 9999,
        maxHeight: Math.min(dropdownHeight, viewportHeight - 16),
        overflowY: 'auto' as const,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 text-adaptive-primary rounded-lg hover:bg-white/15 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div
          className="w-72 liquid-glass-sidebar rounded-lg shadow-lg min-w-max"
          style={dropdownStyle}
        >
          <div className="py-2 max-h-full overflow-y-auto">
            <div className="px-3 py-2 text-xs font-medium text-adaptive-muted uppercase tracking-wide border-b border-white/10">
              {currentFolder ? `Add to ${currentFolder}` : 'Add to workspace'}
            </div>
            
            <div className="py-2">
              {createItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleItemClick(item.type)}
                    className="w-full flex items-center px-3 py-3 hover:bg-white/05 transition-colors group"
                  >
                    <div className={`p-2 rounded-lg ${item.color} bg-white/10 group-hover:bg-white/15 mr-3`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-adaptive-primary">{item.label}</div>
                      <div className="text-xs text-adaptive-muted">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-2">
              {onAddApp && (
                <button
                  onClick={() => {
                    onAddApp();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 rounded-lg text-purple-400 bg-white/10 group-hover:bg-white/15 mr-3">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-adaptive-primary">Add App</div>
                    <div className="text-xs text-adaptive-muted">Install an app to workspace</div>
                  </div>
                </button>
              )}
              <div className="px-3 py-2">
                <button className="w-full text-left text-xs text-adaptive-muted hover:text-adaptive-secondary">
                  Browse template center
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}