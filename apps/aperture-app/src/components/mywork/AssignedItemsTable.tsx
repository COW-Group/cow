import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  MoreHorizontal,
  Plus,
  ChevronUp,
  ChevronDown,
  Users,
  UserPlus
} from 'lucide-react';
import { Assignment, Person } from '../../types/mywork.types';

interface AssignedItemsTableProps {
  assignments: Assignment[];
  selectedItems: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onStatusChange: (assignmentId: string, newStatusId: string) => void;
  onDateChange: (assignmentId: string, newDate: string) => void;
  onItemDelete: (assignmentId: string) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onAddItem: () => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const statusIcons = {
  'To Do': Circle,
  'In Progress': Clock,
  'Working on it': Clock,
  'Review': AlertCircle,
  'Done': CheckCircle,
  'Completed': CheckCircle
};

const statusColors = {
  'To Do': '#9CA3AF',
  'In Progress': '#3B82F6',
  'Working on it': '#FFA500',
  'Review': '#F59E0B',
  'Done': '#10B981',
  'Completed': '#10B981'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export function AssignedItemsTable({ 
  assignments, 
  selectedItems,
  onSelectionChange,
  onStatusChange,
  onDateChange,
  onItemDelete,
  onBulkAction,
  onAddItem,
  sortField,
  sortDirection,
  onSort
}: AssignedItemsTableProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [statusEditingId, setStatusEditingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatAssignedDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSelectAll = () => {
    const allIds = assignments.map(a => a.id);
    const isAllSelected = allIds.every(id => selectedItems.includes(id));
    onSelectionChange(isAllSelected ? [] : allIds);
  };

  const handleSelectItem = (id: string) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id];
    onSelectionChange(newSelection);
  };

  const renderPersonAvatars = (persons: Person[]) => {
    const maxVisible = 3;
    const visiblePersons = persons.slice(0, maxVisible);
    const remainingCount = persons.length - maxVisible;

    return (
      <div className="flex -space-x-1">
        {visiblePersons.map((person, index) => (
          <div
            key={person.id}
            className="relative w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800"
            title={person.name}
          >
            {person.avatar ? (
              <img 
                src={person.avatar} 
                alt={person.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              person.name.charAt(0).toUpperCase()
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="relative w-6 h-6 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-800">
            +{remainingCount}
          </div>
        )}
        <button
          className="relative w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-2 border-white dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Add person"
          aria-label="Add person to assignment"
        >
          <UserPlus className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const isAllSelected = assignments.length > 0 && assignments.every(a => selectedItems.includes(a.id));
  const isSomeSelected = selectedItems.length > 0 && !isAllSelected;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onBulkAction('delete', selectedItems)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => onBulkAction('assign', selectedItems)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reassign
              </button>
              <button
                onClick={() => onBulkAction('export', selectedItems)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0">
            <tr>
              <th className="w-8 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  aria-label="Select all items"
                />
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Item
                  {renderSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Date
                  {renderSortIcon('date')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((assignment) => {
              const StatusIcon = statusIcons[assignment.item.status.label as keyof typeof statusIcons] || Circle;
              
              return (
                <tr 
                  key={assignment.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    assignment.isOverdue ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(assignment.id)}
                      onChange={() => handleSelectItem(assignment.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>

                  {/* Item */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/boards/${assignment.item.board.id}/items/${assignment.item.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {assignment.item.name}
                      </Link>
                      <div className="flex items-center mt-1 space-x-2">
                        <Link
                          to={`/boards/${assignment.item.board.id}`}
                          className="text-xs text-blue-500 hover:text-blue-400"
                        >
                          {assignment.item.board.name}
                        </Link>
                        {assignment.item.priority && (
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                            priorityColors[assignment.item.priority]
                          }`}>
                            {assignment.item.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Person */}
                  <td className="px-6 py-4">
                    {renderPersonAvatars(assignment.item.persons)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setStatusEditingId(statusEditingId === assignment.id ? null : assignment.id)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                      style={{ 
                        backgroundColor: assignment.item.status.color,
                        color: 'white'
                      }}
                    >
                      <StatusIcon className="w-4 h-4 mr-2" />
                      {assignment.item.status.label}
                    </button>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <button
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                        title="Click to change date"
                      >
                        {formatDate(assignment.item.date)}
                      </button>
                    </div>
                    {assignment.isOverdue && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Overdue
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === assignment.id ? null : assignment.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeDropdown === assignment.id && (
                        <div className="absolute right-0 top-8 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <div className="py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Edit
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                              Duplicate
                            </button>
                            <button
                              onClick={() => onItemDelete(assignment.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Add Item Row */}
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td colSpan={6} className="px-6 py-4">
                <button
                  onClick={onAddItem}
                  className="flex items-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 italic transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Click outside to close dropdowns */}
      {(activeDropdown || statusEditingId) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setActiveDropdown(null);
            setStatusEditingId(null);
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}