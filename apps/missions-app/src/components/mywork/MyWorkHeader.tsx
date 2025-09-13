import React, { useState } from 'react';
import { 
  Circle, 
  Search, 
  Calendar, 
  ChevronDown, 
  Plus 
} from 'lucide-react';
import { MyWorkView, DateViewOption } from '../../types/mywork.types';

interface MyWorkHeaderProps {
  view: MyWorkView;
  onViewChange: (view: MyWorkView) => void;
  dateView: DateViewOption;
  onDateViewChange: (dateView: DateViewOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewItem: () => void;
}

const dateViewLabels: Record<DateViewOption, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  all: 'All Time'
};

export function MyWorkHeader({
  view,
  onViewChange,
  dateView,
  onDateViewChange,
  searchQuery,
  onSearchChange,
  onNewItem
}: MyWorkHeaderProps) {
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  return (
    <div className="mb-6">
      {/* Title and Circle Icon */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white mr-3">
          My Work
        </h1>
        <Circle className="w-4 h-4 text-gray-400" />
      </div>

      {/* Tabs and Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Tabs */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onViewChange('table')}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              view === 'table'
                ? 'text-blue-500 border-blue-500'
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            aria-pressed={view === 'table'}
            role="tab"
          >
            Table
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              view === 'calendar'
                ? 'text-blue-500 border-blue-500'
                : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            aria-pressed={view === 'calendar'}
            role="tab"
          >
            Calendar
          </button>
        </div>

        {/* Right side - Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* New Item Button */}
          <button
            onClick={onNewItem}
            className="inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-400 transition-colors"
            aria-label="Create new item"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Item
          </button>

          {/* Search Input */}
          <div className="relative flex-1 sm:min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search assignments"
            />
          </div>

          {/* Date View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isDateDropdownOpen}
              aria-haspopup="true"
            >
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span>{dateViewLabels[dateView]}</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  {(Object.entries(dateViewLabels) as [DateViewOption, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => {
                        onDateViewChange(value);
                        setIsDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        dateView === value
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      role="menuitem"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDateDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsDateDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}