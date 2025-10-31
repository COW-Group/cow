import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'task' | 'meeting' | 'deadline';
  board?: string;
}

interface CalendarViewProps {
  searchQuery?: string;
  dateView?: string;
}

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Review Q4 sales pipeline',
    date: '2024-01-15',
    time: '9:00 AM',
    type: 'task',
    board: 'Sales Pipeline'
  },
  {
    id: '2',
    title: 'Client presentation prep',
    date: '2024-01-12',
    time: '2:00 PM',
    type: 'task',
    board: 'Account Projects'
  },
  {
    id: '3',
    title: 'Team standup meeting',
    date: '2024-01-15',
    time: '10:00 AM',
    type: 'meeting'
  },
  {
    id: '4',
    title: 'Lead qualification deadline',
    date: '2024-01-18',
    time: '5:00 PM',
    type: 'deadline',
    board: 'Leads CRM'
  },
  {
    id: '5',
    title: 'Follow up with hot leads',
    date: '2024-01-16',
    time: '11:00 AM',
    type: 'task',
    board: 'Leads CRM'
  }
];

export function CalendarView({ searchQuery = '', dateView = 'today' }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter events based on search query
  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.board && event.board.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'task':
        return 'bg-blue-500 text-white';
      case 'meeting':
        return 'bg-green-500 text-white';
      case 'deadline':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {formatDate(currentDate)}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === today.toDateString();
            const inCurrentMonth = isCurrentMonth(date);

            return (
              <div
                key={index}
                className={`min-h-[80px] border border-gray-100 dark:border-gray-700 rounded p-1 ${
                  inCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday
                    ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                    : inCurrentMonth
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400'
                }`}>
                  {date.getDate()}
                </div>

                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                      title={`${event.time} - ${event.title}`}
                    >
                      <div className="flex items-center">
                        <Clock className="w-2 h-2 mr-1 flex-shrink-0" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Upcoming Events
        </h3>
        <div className="space-y-2">
          {filteredEvents
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type).split(' ')[0]}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} at {event.time}
                    {event.board && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{event.board}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}