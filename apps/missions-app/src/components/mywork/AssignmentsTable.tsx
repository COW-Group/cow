import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import { Assignment } from '../../types/mywork.types';

interface AssignmentsTableProps {
  assignments: Assignment[];
  onAssignmentUpdate?: (assignmentId: string, updates: Partial<Assignment>) => void;
}

const statusIcons = {
  'To Do': Circle,
  'In Progress': Clock,
  'Review': AlertCircle,
  'Done': CheckCircle
};

const statusColors = {
  'To Do': 'text-gray-500',
  'In Progress': 'text-blue-500',
  'Review': 'text-yellow-500',
  'Done': 'text-green-500'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

export function AssignmentsTable({ assignments, onAssignmentUpdate }: AssignmentsTableProps) {
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Board
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Assigned
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assignments.map((assignment) => {
              const StatusIcon = statusIcons[assignment.item.status as keyof typeof statusIcons] || Circle;
              const statusColor = statusColors[assignment.item.status as keyof typeof statusColors] || 'text-gray-500';
              
              return (
                <tr 
                  key={assignment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Item */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {assignment.item.name}
                      </div>
                      {assignment.item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {assignment.item.description}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Board */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/boards/${assignment.boardId}`}
                      className="text-sm text-blue-500 hover:text-blue-400 underline"
                    >
                      {assignment.boardName}
                    </Link>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StatusIcon className={`w-4 h-4 mr-2 ${statusColor}`} />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {assignment.item.status}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    {assignment.item.priority && (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        priorityColors[assignment.item.priority]
                      }`}>
                        {assignment.item.priority.charAt(0).toUpperCase() + assignment.item.priority.slice(1)}
                      </span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(assignment.item.date)}
                    </div>
                  </td>

                  {/* Assigned */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatAssignedDate(assignment.assignedAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <Link
                      to={`/boards/${assignment.boardId}?item=${assignment.item.id}`}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="View item details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {assignments.length === 0 && (
        <div className="p-8 text-center">
          <User className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No assignments found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}