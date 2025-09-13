import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import type { Task, TaskStatus } from '@/types';

interface KanbanColumnProps {
  column: {
    id: TaskStatus;
    title: string;
    color: string;
  };
  tasks: Task[];
  isDropTarget?: boolean;
  onTaskCreate: () => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanColumn({ 
  column, 
  tasks, 
  isDropTarget, 
  onTaskCreate, 
  onTaskDelete, 
  onTaskUpdate 
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        kanban-column min-h-96 w-80 rounded-lg p-4 transition-all
        ${isDropTarget 
          ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-700' 
          : 'bg-gray-50 dark:bg-gray-800'
        }
      `}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="xs" onClick={onTaskCreate}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="xs">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tasks */}
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              onUpdate={onTaskUpdate}
            />
          ))}
          
          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                No tasks in {column.title.toLowerCase()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTaskCreate}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add first task
              </Button>
            </motion.div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}