import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import type { Task } from '@/types';

interface GanttViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  projectId: string;
  isLoading?: boolean;
}

type ZoomLevel = 'day' | 'week' | 'month';

export function GanttView({ 
  tasks, 
  onTaskUpdate, 
  isLoading 
}: GanttViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('week');
  
  // Filter tasks that have both start and due dates
  const ganttTasks = useMemo(() => {
    return tasks
      .filter(task => task.startDate && task.dueDate)
      .map(task => ({
        ...task,
        startDate: new Date(task.startDate!),
        dueDate: new Date(task.dueDate!),
        duration: Math.ceil((new Date(task.dueDate!).getTime() - new Date(task.startDate!).getTime()) / (1000 * 60 * 60 * 24)) + 1
      }));
  }, [tasks]);

  // Calculate timeline range
  const timelineRange = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
    const start = new Date(thirtyDaysAgo);
    start.setDate(thirtyDaysAgo.getDate() - thirtyDaysAgo.getDay());
    const end = new Date(sixtyDaysFromNow);
    end.setDate(sixtyDaysFromNow.getDate() + (6 - sixtyDaysFromNow.getDay()));
    return { start, end };
  }, []);

  // Generate timeline columns based on zoom level
  const timelineColumns = useMemo(() => {
    const columns = [];
    let current = timelineRange.start;
    
    while (current <= timelineRange.end) {
      columns.push(current);
      const daysToAdd = zoomLevel === 'day' ? 1 : zoomLevel === 'week' ? 7 : 30;
      current = new Date(current.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    }
    
    return columns;
  }, [timelineRange, zoomLevel]);

  const getTaskBarStyle = (task: typeof ganttTasks[0]) => {
    const totalDays = Math.ceil((timelineRange.end.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const startOffset = Math.ceil((task.startDate.getTime() - timelineRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const duration = task.duration;
    
    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;
    
    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - Math.max(0, left), width)}%`
    };
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleTaskDrag = (task: Task, newStartDate: Date, newEndDate: Date) => {
    onTaskUpdate(task.id, {
      startDate: newStartDate,
      dueDate: newEndDate,
      updatedAt: new Date()
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Timeline
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {ganttTasks.length} tasks with timeline data
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
            <Button
              variant={zoomLevel === 'day' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setZoomLevel('day')}
              className="rounded-r-none"
            >
              Day
            </Button>
            <Button
              variant={zoomLevel === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setZoomLevel('week')}
              className="rounded-none border-l-0 border-r-0"
            >
              Week
            </Button>
            <Button
              variant={zoomLevel === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setZoomLevel('month')}
              className="rounded-l-none"
            >
              Month
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4 mr-1" />
            Fit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Task List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="font-medium text-gray-900 dark:text-white">Tasks</h3>
            </div>
            
            <div className="overflow-y-auto max-h-full">
              {ganttTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  style={{ height: '60px' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)}`}
                      />
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {task.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {task.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {task.duration}d
                  </div>
                </div>
              ))}
              
              {ganttTasks.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No tasks with timeline data</p>
                  <p className="text-sm mt-1">Tasks need both start and due dates to appear in Gantt view.</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-x-auto">
            {/* Timeline Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
              <div className="flex" style={{ minWidth: '800px' }}>
                {timelineColumns.map((date, index) => (
                  <div
                    key={index}
                    className="flex-1 p-2 text-center border-r border-gray-200 dark:border-gray-700 min-w-0"
                  >
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {zoomLevel === 'day' 
                        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : zoomLevel === 'week'
                        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      }
                    </div>
                    {zoomLevel === 'day' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Grid */}
            <div className="relative" style={{ minWidth: '800px' }}>
              {/* Grid Lines */}
              <div className="absolute inset-0">
                {timelineColumns.map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 border-r border-gray-100 dark:border-gray-700"
                    style={{ left: `${(index / timelineColumns.length) * 100}%` }}
                  />
                ))}
              </div>

              {/* Task Bars */}
              <div className="relative">
                {ganttTasks.map((task, index) => {
                  const barStyle = getTaskBarStyle(task);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                      style={{ 
                        height: '60px',
                        borderBottom: '1px solid',
                        borderColor: 'rgb(229 231 235)'
                      }}
                    >
                      <div
                        className={`
                          absolute top-1/2 -translate-y-1/2 h-6 rounded-md shadow-sm
                          cursor-pointer hover:shadow-md transition-shadow
                          ${getTaskStatusColor(task.status)}
                          flex items-center px-2
                        `}
                        style={barStyle}
                        title={`${task.name} (${task.duration} days)`}
                      >
                        <span className="text-xs text-white font-medium truncate">
                          {task.name}
                        </span>
                        
                        {/* Progress indicator */}
                        {task.progress > 0 && (
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-white/30 rounded-md"
                            style={{ width: `${task.progress}%` }}
                          />
                        )}
                      </div>
                      
                      {/* Resize handles */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-6 bg-gray-400 rounded-l cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
                        style={{ left: barStyle.left }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-6 bg-gray-400 rounded-r cursor-ew-resize opacity-0 hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${barStyle.left} + ${barStyle.width} - 8px)` }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Today line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 opacity-75">
                <div className="absolute -top-2 -left-1 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">To Do</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Completed</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {timelineRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {timelineRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}