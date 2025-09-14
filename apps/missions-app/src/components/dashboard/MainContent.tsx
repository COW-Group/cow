import React, { useState } from 'react';
import {
  Circle,
  Search,
  Calendar,
  ChevronDown,
  HelpCircle,
  Hand
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ViewType, DateViewType } from '../../types/dashboard';
import { TableView } from './TableView';
import { CalendarView } from './CalendarView';

interface MainContentProps {
  onNewItem?: () => void;
  onViewChange?: (view: ViewType) => void;
  onDateViewChange?: (dateView: DateViewType) => void;
}

export function MainContent({ 
  onNewItem, 
  onViewChange, 
  onDateViewChange 
}: MainContentProps) {
  const [activeView, setActiveView] = useState<ViewType>('table');
  const [dateView, setDateView] = useState<DateViewType>('today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const views = [
    { id: 'table' as ViewType, label: 'Table' },
    { id: 'calendar' as ViewType, label: 'Calendar' }
  ];

  const dateViews = [
    { id: 'today' as DateViewType, label: 'Today' },
    { id: 'week' as DateViewType, label: 'This Week' },
    { id: 'month' as DateViewType, label: 'This Month' },
    { id: 'custom' as DateViewType, label: 'Custom Range' }
  ];

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    onViewChange?.(view);
  };

  const handleDateViewChange = (dateViewType: DateViewType) => {
    setDateView(dateViewType);
    setShowDateDropdown(false);
    onDateViewChange?.(dateViewType);
  };

  return (
    <main className="fixed left-64 top-20 right-0 bottom-0 p-6 overflow-y-auto bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            My Work
          </h1>
          <Circle className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Left side - View Tabs */}
        <div className="flex items-center gap-4">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeView === view.id
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4">
          {/* New Item Button */}
          <Button
            onClick={onNewItem}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-xs rounded"
          >
            New Item
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-xs border border-gray-600 dark:border-gray-700 bg-transparent rounded focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Date View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-600 dark:border-gray-700 rounded transition-colors"
            >
              <Calendar className="h-4 w-4" />
              {dateViews.find(dv => dv.id === dateView)?.label}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
                {dateViews.map((dateViewOption) => (
                  <button
                    key={dateViewOption.id}
                    onClick={() => handleDateViewChange(dateViewOption.id)}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      dateView === dateViewOption.id ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {dateViewOption.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Views */}
      {activeView === 'table' && (
        <TableView searchQuery={searchQuery} dateView={dateView} />
      )}

      {activeView === 'calendar' && (
        <CalendarView searchQuery={searchQuery} dateView={dateView} />
      )}

      {/* Floating Help Button */}
      <button
        className="fixed bottom-6 right-6 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </main>
  );
}