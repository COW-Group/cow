import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Calendar, 
  MessageCircle, 
  Paperclip, 
  User, 
  MoreHorizontal,
  Flag,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import type { Task, Priority } from '@/types';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskCard({ task, isDragging = false, onDelete, onUpdate }: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return AlertCircle;
      case 'high': return Flag;
      case 'medium': return Circle;
      case 'low': return Circle;
      default: return Circle;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed': return CheckCircle2;
      case 'in_progress': return Circle; // Half circle could be better
      case 'blocked': return AlertCircle;
      default: return Circle;
    }
  };

  const formatDueDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDueDateColor = (date: Date) => {
    const today = new Date();
    if (date < today && task.status !== 'completed') return 'text-red-600 bg-red-50';
    if (date.toDateString() === today.toDateString()) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  const taskActions = [
    { id: 'edit', label: 'Edit Task', icon: Circle },
    { id: 'duplicate', label: 'Duplicate', icon: Circle },
    { id: 'archive', label: 'Archive', icon: Circle },
    { id: 'delete', label: 'Delete', icon: Circle },
  ];

  const handleActionClick = (action: any) => {
    switch (action.id) {
      case 'delete':
        onDelete(task.id);
        break;
      case 'edit':
        // Open edit modal
        break;
      // Handle other actions
    }
  };

  const StatusIcon = getStatusIcon();
  const PriorityIcon = getPriorityIcon(task.priority);

  if (isDragging || isSortableDragging) {
    return (
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ scale: 1.05, rotate: 2 }}
        {...({ className: "task-card dragging opacity-90 shadow-xl" } as any)}
      >
        <TaskCardContent />
      </motion.div>
    );
  }

  function TaskCardContent() {
    return (
      <>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2 flex-1">
            <button
              onClick={() => onUpdate(task.id, { 
                status: task.status === 'completed' ? 'todo' : 'completed'
              })}
              className="mt-0.5 flex-shrink-0"
            >
              <StatusIcon className={`h-4 w-4 ${
                task.status === 'completed' 
                  ? 'text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`} />
            </button>
            
            <h4 className={`text-sm font-medium flex-1 ${
              task.status === 'completed' 
                ? 'line-through text-gray-500' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.name}
            </h4>
          </div>
          
          <Dropdown
            trigger={
              <Button variant="ghost" size="xs">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            }
            items={taskActions}
            onItemClick={handleActionClick}
            align="right"
          />
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Priority */}
            <div className={`px-1.5 py-0.5 rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
              <PriorityIcon className="h-3 w-3" />
              <span className="text-xs capitalize">{task.priority}</span>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className={`px-1.5 py-0.5 rounded-full flex items-center gap-1 ${getDueDateColor(task.dueDate)}`}>
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {formatDueDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Comments */}
            {task.comments.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs">{task.comments.length}</span>
              </div>
            )}

            {/* Attachments */}
            {task.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-gray-500">
                <Paperclip className="h-3 w-3" />
                <span className="text-xs">{task.attachments.length}</span>
              </div>
            )}

            {/* Assignee */}
            {task.assigneeId && (
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-primary-600" />
              </div>
            )}

            {/* Time estimate */}
            {task.estimatedHours && (
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{task.estimatedHours}h</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      {...({ className: "task-card cursor-pointer" } as any)}
      onClick={() => setShowDetails(!showDetails)}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
    >
      <TaskCardContent />
    </motion.div>
  );
}