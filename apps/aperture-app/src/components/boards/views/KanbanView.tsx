import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from '../KanbanColumn';
import { TaskCard } from '../TaskCard';
import type { Task, TaskStatus } from '@/types';

interface KanbanViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  projectId: string;
  isLoading?: boolean;
}

const KANBAN_COLUMNS: Array<{ id: TaskStatus; title: string; color: string }> = [
  { id: 'todo', title: 'To Do', color: '#6B7280' },
  { id: 'in_progress', title: 'In Progress', color: '#3B82F6' },
  { id: 'review', title: 'Review', color: '#F59E0B' },
  { id: 'completed', title: 'Completed', color: '#10B981' },
  { id: 'blocked', title: 'Blocked', color: '#EF4444' },
];

export function KanbanView({ 
  tasks, 
  onTaskUpdate, 
  onTaskCreate, 
  onTaskDelete, 
  projectId,
  isLoading 
}: KanbanViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<TaskStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedOverColumn(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if we're over a column
    const overColumnId = KANBAN_COLUMNS.find(col => col.id === over.id)?.id;
    if (overColumnId) {
      setDraggedOverColumn(overColumnId);
      return;
    }

    // Check if we're over another task
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask && activeTask.status !== overTask.status) {
      setDraggedOverColumn(overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    setDraggedOverColumn(null);
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if dropped on a column
    const overColumnId = KANBAN_COLUMNS.find(col => col.id === over.id)?.id;
    if (overColumnId && activeTask.status !== overColumnId) {
      onTaskUpdate(activeTask.id, { 
        status: overColumnId,
        updatedAt: new Date()
      });
      return;
    }

    // Check if dropped on another task
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      if (activeTask.status !== overTask.status) {
        // Move to different column
        onTaskUpdate(activeTask.id, { 
          status: overTask.status,
          updatedAt: new Date()
        });
      } else {
        // Reorder within same column
        const columnTasks = tasks
          .filter(task => task.status === activeTask.status)
          .sort((a, b) => a.position - b.position);
        
        const activeIndex = columnTasks.findIndex(task => task.id === activeTask.id);
        const overIndex = columnTasks.findIndex(task => task.id === overTask.id);
        
        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(columnTasks, activeIndex, overIndex);
          
          // Update positions for all affected tasks
          newOrder.forEach((task, index) => {
            if (task.position !== index) {
              onTaskUpdate(task.id, { 
                position: index,
                updatedAt: new Date()
              });
            }
          });
        }
      }
    }
  };

  const getColumnTasks = (status: TaskStatus) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 h-full overflow-x-auto">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          const isDropTarget = draggedOverColumn === column.id;
          
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              isDropTarget={isDropTarget}
              onTaskCreate={() => onTaskCreate({ 
                projectId, 
                status: column.id,
                position: columnTasks.length
              })}
              onTaskDelete={onTaskDelete}
              onTaskUpdate={onTaskUpdate}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 scale-105">
            <TaskCard
              task={activeTask}
              isDragging={true}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}