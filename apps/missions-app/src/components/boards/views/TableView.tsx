import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  CheckCircle2,
  Circle,
  User,
  Calendar,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { Dropdown } from '../../ui/Dropdown';
import type { Task, Priority } from '@/types';

interface TableViewProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  projectId: string;
  isLoading?: boolean;
}

const columnHelper = createColumnHelper<Task>();

export function TableView({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  isLoading 
}: TableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const taskActions = [
    { id: 'edit', label: 'Edit Task', icon: Circle },
    { id: 'duplicate', label: 'Duplicate', icon: Circle },
    { id: 'archive', label: 'Archive', icon: Circle },
    { id: 'delete', label: 'Delete', icon: Circle },
  ];

  const handleActionClick = (action: any, task: Task) => {
    switch (action.id) {
      case 'delete':
        onTaskDelete(task.id);
        break;
      case 'edit':
        // Open edit modal
        break;
      // Handle other actions
    }
  };

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: '',
      cell: ({ row }) => (
        <button
          onClick={() => onTaskUpdate(row.original.id, { 
            status: row.original.status === 'completed' ? 'todo' : 'completed'
          })}
          className="flex items-center justify-center w-5 h-5"
        >
          {row.original.status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Circle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      ),
      size: 40,
    }),
    
    columnHelper.accessor('name', {
      header: 'Task Name',
      cell: ({ row, getValue }) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${
              row.original.status === 'completed' 
                ? 'line-through text-gray-500' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {getValue()}
            </div>
            {row.original.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {row.original.description}
              </div>
            )}
          </div>
          {row.original.tags.length > 0 && (
            <div className="flex gap-1">
              {row.original.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {row.original.tags.length > 2 && (
                <span className="px-1.5 py-0.5 text-xs bg-gray-50 text-gray-600 rounded-full">
                  +{row.original.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      ),
      size: 300,
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(getValue())}`}>
          {getValue().replace('_', ' ')}
        </span>
      ),
      size: 100,
    }),

    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <Flag className={`h-3 w-3 ${
            getValue() === 'urgent' ? 'text-red-600' :
            getValue() === 'high' ? 'text-orange-600' :
            getValue() === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`} />
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(getValue())}`}>
            {getValue()}
          </span>
        </div>
      ),
      size: 100,
    }),

    columnHelper.accessor('assigneeId', {
      header: 'Assignee',
      cell: ({ getValue }) => getValue() ? (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-primary-600" />
          </div>
          <span className="text-sm text-gray-900 dark:text-white">Assigned</span>
        </div>
      ) : (
        <span className="text-sm text-gray-500">Unassigned</span>
      ),
      size: 120,
    }),

    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return <span className="text-gray-400">No due date</span>;
        
        const isOverdue = new Date(date) < new Date() && tasks.find(t => t.dueDate === date)?.status !== 'completed';
        
        return (
          <div className="flex items-center gap-2">
            <Calendar className={`h-3 w-3 ${isOverdue ? 'text-red-600' : 'text-gray-400'}`} />
            <span className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        );
      },
      size: 140,
    }),

    columnHelper.accessor('estimatedHours', {
      header: 'Estimate',
      cell: ({ getValue }) => getValue() ? (
        <span className="text-sm text-gray-900 dark:text-white">
          {getValue()}h
        </span>
      ) : (
        <span className="text-gray-400">-</span>
      ),
      size: 80,
    }),

    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
          items={taskActions}
          onItemClick={(action) => handleActionClick(action, row.original)}
          align="right"
        />
      ),
      size: 60,
    }),
  ], [tasks, onTaskUpdate, onTaskDelete]);

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-700' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="flex-shrink-0">
                            {{
                              asc: <ArrowUp className="h-3 w-3" />,
                              desc: <ArrowDown className="h-3 w-3" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="h-3 w-3 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr 
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No tasks found</div>
          <p className="text-gray-600">Tasks will appear here when they match your current filters.</p>
        </div>
      )}
    </div>
  );
}