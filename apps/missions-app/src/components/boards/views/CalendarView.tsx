import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import type { Task } from '@/types';

interface CalendarViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  projectId: string;
  isLoading?: boolean;
}

export function CalendarView({ 
  tasks, 
  onTaskCreate, 
  projectId, 
  isLoading 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && new Date(task.dueDate).toDateString() === date.toDateString()
    );
  };

  const getDaysInMonth = () => {
    const days = [];
    let current = calendarStart;

    while (current <= calendarEnd) {
      days.push(current);
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }

    return days;
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDateClick = (date: Date) => {
    onTaskCreate({
      projectId,
      dueDate: date,
      status: 'todo'
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const days = getDaysInMonth();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {tasks.filter(task => task.dueDate && 
              new Date(task.dueDate).getMonth() === currentDate.getMonth() &&
              new Date(task.dueDate).getFullYear() === currentDate.getFullYear()
            ).length} tasks this month
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-px mb-4">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {days.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
            const isCurrentDay = date.toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                {...({ className: `
                  bg-white dark:bg-gray-800 min-h-[120px] p-2 relative
                  hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                ` } as any)}
                onClick={() => handleDateClick(date)}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrentDay 
                        ? 'bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : isCurrentMonth 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-400'
                      }
                    `}
                  >
                    {date.getDate()}
                  </span>
                  
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      {...({ className: `
                        px-2 py-1 rounded text-xs border truncate
                        ${getTaskStatusColor(task.status)}
                        hover:shadow-sm transition-shadow cursor-pointer
                      ` } as any)}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Open task detail modal
                      }}
                      title={task.name}
                    >
                      {task.name}
                    </motion.div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 px-2">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                  
                  {/* Add task button on hover */}
                  {dayTasks.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      {...({ className: "absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg opacity-0 transition-opacity" } as any)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateClick(date);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">To Do</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}