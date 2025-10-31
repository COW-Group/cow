import React, { useState, useEffect, useRef } from 'react';
import { BoardColumn } from '../../types/board.types';
import { Calendar, ChevronDown, X, Check, User, Users, Hash, Clock } from 'lucide-react';
import {
  TimelineColumn,
  FilesColumn,
  NumbersColumn,
  LinkColumn,
  CheckboxColumn,
  ConnectBoardsColumn,
  MirrorColumn,
  TimelineData,
  FilesData,
  NumbersData,
  LinkData,
  ConnectBoardsData,
  MirrorData
} from './columns/AdvancedColumnTypes';

interface Person {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

interface EnhancedEditableCellProps {
  column: BoardColumn;
  value: any;
  onSave: (value: any) => void;
  people?: Person[];
  readonly?: boolean;
}

export const EnhancedEditableCell: React.FC<EnhancedEditableCellProps> = ({
  column,
  value,
  onSave,
  people = [],
  readonly = false
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value || '');
      setIsEditing(false);
      setShowDropdown(false);
    }
  };

  // Render advanced column types
  const renderAdvancedColumn = () => {
    switch (column.type) {
      case 'timeline':
        return (
          <TimelineColumn
            data={value as TimelineData}
            onChange={onSave}
            readonly={readonly}
          />
        );

      case 'files':
        return (
          <FilesColumn
            data={value as FilesData}
            onChange={onSave}
            readonly={readonly}
          />
        );

      case 'numbers':
        return (
          <NumbersColumn
            data={value as NumbersData}
            onChange={onSave}
            readonly={readonly}
          />
        );

      case 'connect-boards':
        return (
          <ConnectBoardsColumn
            data={value as ConnectBoardsData}
            onChange={onSave}
            readonly={readonly}
          />
        );

      case 'mirror':
        return (
          <MirrorColumn
            data={value as MirrorData}
            readonly={true}
          />
        );

      case 'checkbox':
        return (
          <CheckboxColumn
            data={value as boolean}
            onChange={onSave}
            readonly={readonly}
          />
        );

      default:
        return null;
    }
  };

  // Check if this is an advanced column type
  const advancedTypes = ['timeline', 'files', 'numbers', 'connect-boards', 'mirror', 'checkbox'];
  if (advancedTypes.includes(column.type)) {
    return <div className="min-w-0">{renderAdvancedColumn()}</div>;
  }

  // Enhanced Status Column (solid colors as requested)
  if (column.type === 'status') {
    const statusOption = column.options?.find(opt => opt.id === value || opt.label === value);

    if (!isEditing && !showDropdown) {
      return (
        <div className="relative min-w-0" ref={dropdownRef}>
          <button
            onClick={() => !readonly && setShowDropdown(true)}
            disabled={readonly}
            className={`w-full px-3 py-2 rounded-md text-white text-sm font-medium text-center
                       transition-colors duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'}`}
            style={{ backgroundColor: statusOption?.color || '#6b7280' }}
          >
            {statusOption?.label || value || 'Select'}
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full backdrop-blur-xl bg-black/80
                          border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
              {column.options?.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSave(option.id);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-black/40 text-white text-sm
                           border-b border-white/10 last:border-b-0 transition-colors"
                  style={{ backgroundColor: option.color + '20' }}
                >
                  <div
                    className="w-3 h-3 rounded-full inline-block mr-2"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  // Enhanced Person/Assignee Column
  if (column.type === 'assignee' || column.type === 'person') {
    const assignedPerson = people.find(p => p.id === value || p.name === value);

    if (!isEditing && !showDropdown) {
      return (
        <div className="relative min-w-0" ref={dropdownRef}>
          <button
            onClick={() => !readonly && setShowDropdown(true)}
            disabled={readonly}
            className={`w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                       text-white text-sm transition-colors duration-200 flex items-center space-x-2
                       ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-black/30'}`}
          >
            {assignedPerson ? (
              <>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: assignedPerson.color }}
                >
                  {assignedPerson.avatar ? (
                    <img src={assignedPerson.avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    assignedPerson.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="truncate">{assignedPerson.name}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Unassigned</span>
              </>
            )}
            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full backdrop-blur-xl bg-black/80
                          border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  onSave(null);
                  setShowDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-black/40 text-gray-400 text-sm
                         border-b border-white/10 transition-colors flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Unassigned</span>
              </button>
              {people.map((person) => (
                <button
                  key={person.id}
                  onClick={() => {
                    onSave(person.id);
                    setShowDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-black/40 text-white text-sm
                           border-b border-white/10 last:border-b-0 transition-colors
                           flex items-center space-x-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.avatar ? (
                      <img src={person.avatar} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                      person.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span>{person.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  // Enhanced Date Column
  if (column.type === 'date') {
    if (!isEditing) {
      const dateValue = value ? new Date(value).toLocaleDateString() : '';
      return (
        <button
          onClick={() => !readonly && setIsEditing(true)}
          disabled={readonly}
          className={`w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                     text-white text-sm transition-colors duration-200 flex items-center space-x-2
                     ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-black/30'}`}
        >
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={dateValue ? '' : 'text-gray-400'}>
            {dateValue || 'Set date'}
          </span>
        </button>
      );
    }

    return (
      <input
        ref={inputRef}
        type="date"
        value={value ? new Date(value).toISOString().split('T')[0] : ''}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                   text-white text-sm focus:outline-none focus:border-blue-400"
      />
    );
  }

  // Enhanced Progress Column
  if (column.type === 'progress') {
    const progressValue = parseInt(value) || 0;

    if (!isEditing) {
      return (
        <button
          onClick={() => !readonly && setIsEditing(true)}
          disabled={readonly}
          className={`w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                     transition-colors duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-black/30'}`}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressValue}%` }}
              />
            </div>
            <span className="text-white text-sm font-medium w-10 text-right">
              {progressValue}%
            </span>
          </div>
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2 px-3 py-2 rounded-md backdrop-blur-xl
                      bg-black/20 border border-white/20">
        <input
          ref={inputRef}
          type="range"
          min="0"
          max="100"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onMouseUp={handleSave}
          className="flex-1"
        />
        <span className="text-white text-sm font-medium w-10 text-right">
          {editValue}%
        </span>
      </div>
    );
  }

  // Enhanced Number Column
  if (column.type === 'number') {
    if (!isEditing) {
      return (
        <button
          onClick={() => !readonly && setIsEditing(true)}
          disabled={readonly}
          className={`w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                     text-white text-sm transition-colors duration-200 text-center font-medium
                     ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-black/30'}`}
        >
          <div className="flex items-center justify-center space-x-1">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>{value || '0'}</span>
          </div>
        </button>
      );
    }

    return (
      <input
        ref={inputRef}
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                   text-white text-sm focus:outline-none focus:border-blue-400 text-center"
      />
    );
  }

  // Enhanced Text Column (default)
  if (!isEditing) {
    return (
      <button
        onClick={() => !readonly && setIsEditing(true)}
        disabled={readonly}
        className={`w-full px-3 py-2 text-left rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                   text-white text-sm transition-colors duration-200 truncate
                   ${readonly ? 'cursor-default' : 'cursor-pointer hover:bg-black/30'}`}
      >
        {value || <span className="text-gray-400">Click to edit</span>}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="w-full px-3 py-2 rounded-md backdrop-blur-xl bg-black/20 border border-white/20
                 text-white text-sm focus:outline-none focus:border-blue-400"
      placeholder="Enter text..."
    />
  );
};

export default EnhancedEditableCell;