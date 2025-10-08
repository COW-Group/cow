import React, { useState, useEffect, useRef } from 'react';
import { BoardColumn } from '../../types/board.types';
import { Calendar, ChevronDown, X, Check } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

interface EditableCellProps {
  column: BoardColumn;
  value: any;
  onSave: (value: any) => void;
  people?: Person[];
}

export const EditableCell: React.FC<EditableCellProps> = ({
  column,
  value,
  onSave,
  people = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (column.type === 'text') {
        inputRef.current.select();
      }
    }
  }, [isEditing, column.type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        handleSave();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
    setShowDropdown(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const renderDisplayValue = () => {
    if (!value) return <span className="text-gray-400 italic">Empty</span>;

    switch (column.type) {
      case 'text':
        return <span className="text-white">{value}</span>;

      case 'status':
        const statusOption = column.options?.find(opt => opt.id === value);
        if (statusOption) {
          return (
            <div
              className="flex items-center justify-center h-full -mx-4 -my-1 px-4 py-3 text-sm font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: statusOption.color }}
            >
              {statusOption.label}
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center h-full -mx-4 -my-1 px-4 py-3 bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="text-sm font-medium">Not set</span>
          </div>
        );

      case 'person':
        const person = people.find(p => p.id === value);
        if (person) {
          return (
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 backdrop-blur-sm rounded px-1 py-1 transition-all">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: person.color }}
              >
                {person.name.charAt(0)}
              </div>
              <span className="text-gray-900 text-sm">{person.name}</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 backdrop-blur-sm rounded px-1 py-1 text-gray-400 transition-all">
            <div className="w-6 h-6 rounded-full bg-gray-500/30 backdrop-blur-sm border border-gray-400/20 flex items-center justify-center">
              <span className="text-gray-300 text-xs">?</span>
            </div>
            <span className="text-sm">Unassigned</span>
          </div>
        );

      case 'date':
        if (value) {
          const date = new Date(value);
          return (
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 backdrop-blur-sm rounded px-1 py-1 transition-all">
              <Calendar className="w-4 h-4 text-gray-300" />
              <span className="text-white text-sm">{date.toLocaleDateString()}</span>
            </div>
          );
        }
        return (
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 backdrop-blur-sm rounded px-1 py-1 text-gray-400 transition-all">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">No date</span>
          </div>
        );

      default:
        return <span className="text-white">{value}</span>;
    }
  };

  const renderEditor = () => {
    switch (column.type) {
      case 'text':
        return (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'date':
        return (
          <input
            ref={inputRef}
            type="date"
            value={editValue ? new Date(editValue).toISOString().split('T')[0] : ''}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );

      case 'status':
      case 'person':
        return (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-between backdrop-blur-xl bg-black/20"
            >
              <span className="truncate">
                {column.type === 'status'
                  ? column.options?.find(opt => opt.id === editValue)?.label || 'Select status'
                  : column.type === 'person'
                  ? people.find(p => p.id === editValue)?.name || 'Select person'
                  : 'Select...'
                }
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 backdrop-blur-xl bg-black/20 border border-white/20 rounded-md shadow-2xl shadow-black/10 max-h-60 overflow-y-auto">
                {column.type === 'status' && column.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setEditValue(option.id);
                      handleSave();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center space-x-2 text-white"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <span>{option.label}</span>
                  </button>
                ))}

                {column.type === 'person' && (
                  <>
                    <button
                      onClick={() => {
                        setEditValue('');
                        handleSave();
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-white/10 text-gray-300"
                    >
                      Unassigned
                    </button>
                    {people.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => {
                          setEditValue(person.id);
                          handleSave();
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center space-x-2 text-white"
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: person.color }}
                        >
                          {person.name.charAt(0)}
                        </div>
                        <span>{person.name}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div
      className={`min-h-[2.5rem] flex items-center cursor-pointer relative transition-all ${
        column.type === 'status'
          ? 'w-full'
          : 'hover:bg-white/10 backdrop-blur-sm rounded px-1'
      }`}
      onClick={() => {
        if (!isEditing && !showDropdown) {
          setIsEditing(true);
          if (column.type === 'status' || column.type === 'person') {
            setShowDropdown(true);
          }
        }
      }}
    >
      {isEditing || showDropdown ? renderEditor() : renderDisplayValue()}
    </div>
  );
};