import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees?: string[];
  location?: string;
  type: 'meeting' | 'call' | 'task' | 'event';
  color: string;
}

interface CalendarWidgetProps {
  title?: string;
  events?: CalendarEvent[];
  viewMode?: 'today' | 'week';
  showCalendar?: boolean;
}

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Sales Team Standup',
    time: '9:00 AM',
    duration: '30m',
    attendees: ['John', 'Sarah', 'Mike'],
    location: 'Conference Room A',
    type: 'meeting',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Client Call - ABC Corp',
    time: '11:30 AM',
    duration: '1h',
    attendees: ['You', 'Client'],
    type: 'call',
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Product Review',
    time: '2:00 PM',
    duration: '45m',
    attendees: ['Product Team'],
    location: 'Virtual',
    type: 'meeting',
    color: 'bg-purple-500',
  },
  {
    id: '4',
    title: 'Follow up leads',
    time: '4:00 PM',
    duration: '1h',
    type: 'task',
    color: 'bg-orange-500',
  },
];

export function CalendarWidget({
  title = 'Today\'s Schedule',
  events = DEFAULT_EVENTS,
  viewMode = 'today',
  showCalendar = true,
}: CalendarWidgetProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-3 h-3" />;
      case 'call':
        return <Clock className="w-3 h-3" />;
      case 'task':
        return <Calendar className="w-3 h-3" />;
      case 'event':
        return <Calendar className="w-3 h-3" />;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {formatDate(currentDate)}
            </div>
            {isToday(currentDate) && (
              <div className="text-xs text-blue-600 font-medium">Today</div>
            )}
          </div>

          <button
            onClick={() => navigateDate('next')}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {events.length} events
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No events scheduled</p>
          </div>
        ) : (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Event indicator */}
                <div className={`w-3 h-3 ${event.color} rounded-full mt-1.5 flex-shrink-0`}>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-1 text-gray-500">
                      {getEventIcon(event.type)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                      <span>({event.duration})</span>
                    </div>
                  </div>

                  {(event.location || event.attendees) && (
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="truncate">
                            {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/calendar')}
            className="flex-1 text-xs text-blue-600 hover:text-blue-700 font-medium py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            View Calendar
          </button>
          <button
            onClick={() => navigate('/calendar')}
            className="flex-1 text-xs text-gray-600 hover:text-gray-700 font-medium py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}