import React, { useState } from 'react';
import { AssignedItemsTable } from '../../mywork/AssignedItemsTable';
import { Assignment } from '../../../types/mywork.types';
import { Search, Filter, Plus } from 'lucide-react';

interface TasksTableWidgetProps {
  assignments?: Assignment[];
  onNewTask?: () => void;
  onStatusChange?: (assignmentId: string, newStatusId: string) => void;
  onDateChange?: (assignmentId: string, newDate: string) => void;
  onItemDelete?: (assignmentId: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
}

export function TasksTableWidget({
  assignments = [],
  onNewTask,
  onStatusChange,
  onDateChange,
  onItemDelete,
  onBulkAction
}: TasksTableWidgetProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(assignment => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesItem = assignment.item.name.toLowerCase().includes(query);
    const matchesBoard = assignment.item.board.name.toLowerCase().includes(query);
    const matchesStatus = assignment.item.status.label.toLowerCase().includes(query);

    return matchesItem || matchesBoard || matchesStatus;
  });

  if (assignments.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No tasks yet</h3>
        <p className="text-gray-400 text-sm mb-4 max-w-48">
          Create your first task or get assigned to a board to see your work here.
        </p>
        {onNewTask && (
          <button
            onClick={onNewTask}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Create Task
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>

        {onNewTask && (
          <button
            onClick={onNewTask}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Task Count */}
      <div className="text-xs text-gray-400 mb-3">
        {filteredAssignments.length} of {assignments.length} tasks
        {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden rounded-lg border border-white/10">
        <div className="h-full overflow-y-auto">
          <AssignedItemsTable
            assignments={filteredAssignments}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onStatusChange={onStatusChange || (() => {})}
            onDateChange={onDateChange || (() => {})}
            onItemDelete={onItemDelete || (() => {})}
            onBulkAction={onBulkAction || (() => {})}
            onAddItem={onNewTask || (() => {})}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            compact={true}
          />
        </div>
      </div>

      {/* Quick Actions */}
      {selectedItems.length > 0 && (
        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-300 font-medium">
              {selectedItems.length} selected
            </span>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => onBulkAction?.('complete', selectedItems)}
                className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors"
              >
                Complete
              </button>
              <button
                onClick={() => onBulkAction?.('delete', selectedItems)}
                className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}