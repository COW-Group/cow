import React, { useRef, useEffect } from 'react';
import { Edit3, Sparkles } from 'lucide-react';
import { StatusLabel } from '../../types/board.types';

interface StatusDropdownProps {
  isOpen: boolean;
  itemId: string;
  statusLabels: StatusLabel[];
  onSelectStatus: (itemId: string, status: StatusLabel) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

export function StatusDropdown({
  isOpen,
  itemId,
  statusLabels,
  onSelectStatus,
  onClose,
  position
}: StatusDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleStatusSelect = (status: StatusLabel) => {
    onSelectStatus(itemId, status);
  };

  const handleEditLabels = () => {
    // TODO: Open edit labels modal
    console.log('Edit labels clicked');
    onClose();
  };

  const handleAutoAssign = () => {
    // TODO: Implement auto-assign logic
    console.log('Auto-assign clicked');
    onClose();
  };

  if (!isOpen) return null;

  const dropdownStyle = position 
    ? {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        zIndex: 9999
      }
    : {
        position: 'absolute' as const,
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '4px',
        zIndex: 50
      };

  return (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="w-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="status-menu"
    >
      {/* Status Options */}
      <div className="px-2 pb-2">
        {statusLabels.map((status) => (
          <button
            key={status.id}
            onClick={() => handleStatusSelect(status)}
            className="w-full flex items-center justify-center p-2 mb-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            role="menuitem"
          >
            <span
              className="px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: status.color,
                color: status.textColor || '#FFFFFF'
              }}
            >
              {status.label}
            </span>
          </button>
        ))}
        
        {/* Empty/Clear Status Option */}
        <button
          onClick={() => handleStatusSelect({ id: '', label: '', color: '#808080', textColor: '#FFFFFF' })}
          className="w-full flex items-center justify-center p-2 mb-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          role="menuitem"
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-medium bg-gray-300 text-gray-600">
            Clear
          </span>
        </button>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

      {/* Actions */}
      <div className="px-2">
        <button
          onClick={handleEditLabels}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          role="menuitem"
        >
          <Edit3 className="h-4 w-4 text-gray-400" />
          Edit labels
        </button>
        
        <button
          onClick={handleAutoAssign}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          role="menuitem"
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
          Auto-assign labels
        </button>
      </div>
    </div>
  );
}