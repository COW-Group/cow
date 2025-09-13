import React, { useState, DragEvent } from 'react';
import { COWBoard } from '../../types/board.types';
import { GroupHeader } from './GroupHeader';
import { TaskRow } from './TaskRow';

interface SimpleDragDropProps {
  board: COWBoard;
  onUpdateTask: (groupId: string, taskId: string, updates: any) => void;
  onDeleteTask: (groupId: string, taskId: string) => void;
  onDuplicateTask: (groupId: string, taskId: string) => void;
  onAddTask: (groupId: string) => void;
  onUpdateGroup: (groupId: string, updates: any) => void;
  onDeleteGroup: (groupId: string) => void;
  onDuplicateGroup: (groupId: string) => void;
  onMoveTask: (sourceGroupId: string, targetGroupId: string, taskId: string, newIndex: number) => void;
}

interface DragData {
  taskId: string;
  sourceGroupId: string;
  taskIndex: number;
}

export function SimpleDragDrop({
  board,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onAddTask,
  onUpdateGroup,
  onDeleteGroup,
  onDuplicateGroup,
  onMoveTask
}: SimpleDragDropProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent, taskId: string, sourceGroupId: string, taskIndex: number) => {
    const dragData: DragData = { taskId, sourceGroupId, taskIndex };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverGroup(null);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverGroup(null);
    }
  };

  const handleDrop = (e: DragEvent, targetGroupId: string) => {
    e.preventDefault();
    
    try {
      const dragData: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const { taskId, sourceGroupId } = dragData;

      if (sourceGroupId !== targetGroupId) {
        const targetGroup = board.groups.find(g => g.id === targetGroupId);
        const newIndex = targetGroup ? targetGroup.tasks.length : 0;
        onMoveTask(sourceGroupId, targetGroupId, taskId, newIndex);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setDragOverGroup(null);
    setDraggedTask(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-1.5">Due Date</div>
          <div className="col-span-0.5"></div>
        </div>
      </div>

      {/* Groups */}
      {board.groups.map((group, groupIndex) => (
        <div 
          key={group.id} 
          className={`border-b border-gray-100 last:border-b-0 ${
            dragOverGroup === group.id ? 'bg-blue-50' : ''
          } transition-colors duration-200`}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, group.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, group.id)}
        >
          {/* Group Header */}
          <GroupHeader
            group={group}
            onAddTask={() => onAddTask(group.id)}
            onUpdateGroup={(updates) => onUpdateGroup(group.id, updates)}
            onDeleteGroup={() => onDeleteGroup(group.id)}
            onDuplicateGroup={() => onDuplicateGroup(group.id)}
          />

          {/* Tasks */}
          {group.tasks.map((task, taskIndex) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id, group.id, taskIndex)}
              onDragEnd={handleDragEnd}
              className={`cursor-move ${
                draggedTask === task.id ? 'opacity-50' : ''
              } transition-opacity duration-200`}
            >
              <TaskRow
                task={task}
                groupId={group.id}
                onUpdateTask={(updates) => onUpdateTask(group.id, task.id, updates)}
                onDeleteTask={() => onDeleteTask(group.id, task.id)}
                onDuplicateTask={() => onDuplicateTask(group.id, task.id)}
                isDragging={draggedTask === task.id}
              />
            </div>
          ))}
          
          {/* Empty state */}
          {group.tasks.length === 0 && (
            <div 
              className={`px-6 py-8 text-center text-gray-500 ${
                dragOverGroup === group.id ? 'bg-blue-100 border-2 border-dashed border-blue-300' : ''
              }`}
            >
              <p>No tasks in this group</p>
              <button
                onClick={() => onAddTask(group.id)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Add the first task
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}