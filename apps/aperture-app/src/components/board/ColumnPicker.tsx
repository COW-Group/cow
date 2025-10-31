import React, { useState } from 'react';
import { Calendar, User, Flag, BarChart3, FileText, Clock } from 'lucide-react';
import { ComponentType } from '../../types/board.types';

interface ColumnPickerProps {
  availableColumns: ComponentType[];
  selectedColumns: ComponentType[];
  onColumnsChange: (columns: ComponentType[]) => void;
}

const columnConfig = {
  'assignee-picker': {
    name: 'Assignee',
    icon: User,
    description: 'Task assignees'
  },
  'status-picker': {
    name: 'Status',
    icon: BarChart3,
    description: 'Task status'
  },
  'priority-picker': {
    name: 'Priority',
    icon: Flag,
    description: 'Task priority'
  },
  'date-picker': {
    name: 'Due Date',
    icon: Calendar,
    description: 'Task due date'
  },
  'progress-picker': {
    name: 'Progress',
    icon: BarChart3,
    description: 'Task progress'
  },
  'number-picker': {
    name: 'Number',
    icon: BarChart3,
    description: 'Numeric values'
  },
  'file-picker': {
    name: 'Files',
    icon: FileText,
    description: 'File attachments'
  },
  'updated-picker': {
    name: 'Last Updated',
    icon: Clock,
    description: 'Last update time'
  }
};

export function ColumnPicker({
  availableColumns,
  selectedColumns,
  onColumnsChange
}: ColumnPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleColumn = (columnType: ComponentType) => {
    if (selectedColumns.includes(columnType)) {
      onColumnsChange(selectedColumns.filter(col => col !== columnType));
    } else {
      onColumnsChange([...selectedColumns, columnType]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Columns ({selectedColumns.length})</span>
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Board Columns</h3>
            <p className="text-xs text-gray-500 mt-1">Choose which columns to display</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {availableColumns.map((columnType) => {
              const config = columnConfig[columnType];
              const isSelected = selectedColumns.includes(columnType);
              const IconComponent = config.icon;
              
              return (
                <div key={columnType} className="p-3 hover:bg-gray-50">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleColumn(columnType)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {config.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.description}
                      </p>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
          
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{selectedColumns.length} selected</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}