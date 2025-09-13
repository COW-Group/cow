import React, { useState } from 'react';
import { COWBoard, ComponentType } from '../../types/board.types';
import { GroupHeader } from './GroupHeader';
import { DynamicTaskRow } from './DynamicTaskRow';
import { ColumnPicker } from './ColumnPicker';

interface DynamicBoardProps {
  board: COWBoard;
  onUpdateTask: (groupId: string, taskId: string, updates: any) => void;
  onDeleteTask: (groupId: string, taskId: string) => void;
  onDuplicateTask: (groupId: string, taskId: string) => void;
  onAddTask: (groupId: string) => void;
  onUpdateGroup: (groupId: string, updates: any) => void;
  onDeleteGroup: (groupId: string) => void;
  onDuplicateGroup: (groupId: string) => void;
  onMoveTask: (sourceGroupId: string, targetGroupId: string, taskId: string, newIndex: number) => void;
  onUpdateColumnOrder: (columns: ComponentType[]) => void;
}

const columnConfig = {
  'assignee-picker': 'Assignee',
  'status-picker': 'Status',
  'priority-picker': 'Priority',
  'date-picker': 'Due Date',
  'progress-picker': 'Progress',
  'number-picker': 'Number',
  'file-picker': 'Files',
  'updated-picker': 'Updated'
};

export function DynamicBoard({
  board,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onAddTask,
  onUpdateGroup,
  onDeleteGroup,
  onDuplicateGroup,
  onMoveTask,
  onUpdateColumnOrder
}: DynamicBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceGroupId: string, taskIndex: number) => {
    const dragData = { taskId, sourceGroupId, taskIndex };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverGroup(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, groupId: string) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverGroup(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGroupId: string) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
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

  const displayColumns = board.columnOrder || ['status-picker', 'priority-picker', 'date-picker'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Column Management */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {displayColumns.length} of {board.availableColumns.length} columns
          </div>
          <ColumnPicker
            availableColumns={board.availableColumns}
            selectedColumns={displayColumns}
            onColumnsChange={onUpdateColumnOrder}
          />
        </div>
      </div>

      {/* Dynamic Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid gap-4 text-sm font-medium text-gray-500" style={{ gridTemplateColumns: `2fr ${displayColumns.map(() => '1fr').join(' ')} 0.5fr` }}>
          <div>Task</div>
          {displayColumns.map((columnType) => (
            <div key={columnType}>
              {columnConfig[columnType] || columnType}
            </div>
          ))}
          <div></div>
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
              <DynamicTaskRow
                task={task}
                groupId={group.id}
                columns={displayColumns}
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