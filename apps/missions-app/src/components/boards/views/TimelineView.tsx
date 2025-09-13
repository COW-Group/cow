import React, { useState } from 'react';
import { Clock, User, Calendar, Flag, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task } from '@/types';

interface TimelineViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  projectId: string;
  isLoading?: boolean;
}

interface TimelineGroup {
  key: string;
  title: string;
  tasks: Task[];
}

export function TimelineView({ 
  tasks, 
  onTaskUpdate, 
  isLoading 
}: TimelineViewProps) {
  const [groupBy, setGroupBy] = useState<'date' | 'status' | 'assignee'>('date');

  const getTaskGroups = (): TimelineGroup[] => {
    switch (groupBy) {
      case 'date':
        return groupTasksByDate(tasks);
      case 'status':
        return groupTasksByStatus(tasks);
      case 'assignee':
        return groupTasksByAssignee(tasks);
      default:
        return [];
    }
  };

  const groupTasksByDate = (tasks: Task[]): TimelineGroup[] => {
    const groups: Record<string, Task[]> = {};
    const today = new Date();

    tasks.forEach(task => {
      let key: string;
      let title: string;

      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        if (dueDate < today && task.status !== 'completed') {
          key = 'overdue';
          title = 'Overdue';
        } else if (dueDate.toDateString() === today.toDateString()) {
          key = 'today';
          title = 'Due Today';
        } else if (dueDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()) {
          key = 'tomorrow';
          title = 'Due Tomorrow';
        } else {
          key = dueDate.toISOString().split('T')[0];
          title = dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        }
      } else {
        key = 'no-date';
        title = 'No Due Date';
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    });

    // Sort groups by priority (overdue, today, tomorrow, future dates, no date)
    const sortOrder = ['overdue', 'today', 'tomorrow'];
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const aIndex = sortOrder.indexOf(a);
      const bIndex = sortOrder.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else if (a === 'no-date') {
        return 1;
      } else if (b === 'no-date') {
        return -1;
      } else {
        return a.localeCompare(b);
      }
    });

    return sortedKeys.map(key => ({
      key,
      title: key === 'overdue' ? 'Overdue' :
             key === 'today' ? 'Due Today' :
             key === 'tomorrow' ? 'Due Tomorrow' :
             key === 'no-date' ? 'No Due Date' :
             new Date(key).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      tasks: groups[key].sort((a, b) => a.position - b.position)
    }));
  };

  const groupTasksByStatus = (tasks: Task[]): TimelineGroup[] => {
    const statusOrder = ['todo', 'in_progress', 'review', 'blocked', 'completed'];
    const groups: Record<string, Task[]> = {};

    tasks.forEach(task => {
      if (!groups[task.status]) {
        groups[task.status] = [];
      }
      groups[task.status].push(task);
    });

    return statusOrder
      .filter(status => groups[status])
      .map(status => ({
        key: status,
        title: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        tasks: groups[status].sort((a, b) => a.position - b.position)
      }));
  };

  const groupTasksByAssignee = (tasks: Task[]): TimelineGroup[] => {
    const groups: Record<string, Task[]> = {};

    tasks.forEach(task => {
      const key = task.assigneeId || 'unassigned';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
    });

    return Object.entries(groups).map(([key, tasks]) => ({
      key,
      title: key === 'unassigned' ? 'Unassigned' : `Assignee ${key}`,
      tasks: tasks.sort((a, b) => a.position - b.position)
    }));
  };

  const getGroupHeaderColor = (key: string) => {
    switch (key) {
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200';
      case 'today': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'tomorrow': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const taskGroups = getTaskGroups();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Timeline View
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {tasks.length} total tasks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'date' | 'status' | 'assignee')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="date">Group by Date</option>
            <option value="status">Group by Status</option>
            <option value="assignee">Group by Assignee</option>
          </select>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="overflow-y-auto max-h-full">
        <div className="p-6">
          {taskGroups.map((group, groupIndex) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-8 last:mb-0"
            >
              {/* Group Header */}
              <div className={`
                inline-flex items-center px-3 py-2 rounded-lg border mb-4
                ${getGroupHeaderColor(group.key)}
              `}>
                <h3 className="font-medium">{group.title}</h3>
                <span className="ml-2 px-1.5 py-0.5 bg-white/50 rounded-full text-xs">
                  {group.tasks.length}
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                
                <div className="space-y-4">
                  {group.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (taskIndex * 0.05) }}
                      className="relative flex items-start gap-4"
                    >
                      {/* Timeline Dot */}
                      <div className="relative z-10">
                        <div className={`
                          w-3 h-3 rounded-full border-2 bg-white dark:bg-gray-800
                          ${task.status === 'completed' 
                            ? 'border-green-500' 
                            : task.status === 'in_progress' 
                            ? 'border-blue-500' 
                            : task.status === 'blocked'
                            ? 'border-red-500'
                            : 'border-gray-300'
                          }
                        `} />
                      </div>

                      {/* Task Card */}
                      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <button
                              onClick={() => onTaskUpdate(task.id, { 
                                status: task.status === 'completed' ? 'todo' : 'completed'
                              })}
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600 mt-0.5" />
                              )}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className={`
                                text-sm font-medium
                                ${task.status === 'completed' 
                                  ? 'line-through text-gray-500' 
                                  : 'text-gray-900 dark:text-white'
                                }
                              `}>
                                {task.name}
                              </h4>
                              
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Updated {formatTimeAgo(task.updatedAt)}</span>
                                </div>
                                
                                {task.assigneeId && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    <span>Assigned</span>
                                  </div>
                                )}
                                
                                {task.dueDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-1">
                                  <Flag className={`
                                    h-3 w-3
                                    ${task.priority === 'urgent' ? 'text-red-500' :
                                      task.priority === 'high' ? 'text-orange-500' :
                                      task.priority === 'medium' ? 'text-yellow-500' :
                                      'text-green-500'
                                    }
                                  `} />
                                  <span className="capitalize">{task.priority}</span>
                                </div>
                              </div>
                              
                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.tags.slice(0, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {task.tags.length > 3 && (
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                      +{task.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {taskGroups.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Timeline Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tasks will appear here as they are created and updated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}