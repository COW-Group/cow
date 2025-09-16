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
    <main className="fixed left-64 top-20 right-0 bottom-0 p-6 overflow-y-auto bg-black">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            My Work
          </h1>
          <Circle className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-8 bg-gray-900/50 backdrop-blur-md rounded-2xl p-4 border border-gray-800">
        {/* Left side - View Tabs */}
        <div className="flex items-center gap-4">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeView === view.id
                  ? 'bg-yellow-400 text-black shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
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
            variant="primary"
            size="sm"
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
              className="pl-10 pr-4 py-2 text-xs bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Date View Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-white bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg transition-all hover:bg-gray-700/50"
            >
              <Calendar className="h-4 w-4" />
              {dateViews.find(dv => dv.id === dateView)?.label}
              <ChevronDown className="h-3 w-3" />
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg py-1 z-10">
                {dateViews.map((dateViewOption) => (
                  <button
                    key={dateViewOption.id}
                    onClick={() => handleDateViewChange(dateViewOption.id)}
                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-800/50 transition-colors rounded-lg ${
                      dateView === dateViewOption.id ? 'bg-yellow-400 text-black' : 'text-gray-300 hover:text-white'
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
        className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900/50 backdrop-blur-md hover:bg-gray-800/50 rounded-full flex items-center justify-center text-white shadow-lg border border-gray-800 transition-all hover:scale-105"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </main>
  );
}