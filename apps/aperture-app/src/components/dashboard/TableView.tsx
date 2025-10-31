import React from 'react';
import { CheckSquare, Clock, User, Calendar } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  board: string;
}

interface TableViewProps {
  searchQuery?: string;
  dateView?: string;
}

// Mock data for tasks
const mockTasks: TaskItem[] = [
  {
    id: '1',
    title: 'Review Q4 sales pipeline',
    status: 'in-progress',
    priority: 'high',
    assignee: 'You',
    dueDate: '2024-01-15',
    board: 'Sales Pipeline'
  },
  {
    id: '2',
    title: 'Update lead qualification criteria',
    status: 'pending',
    priority: 'medium',
    assignee: 'You',
    dueDate: '2024-01-18',
    board: 'Leads CRM'
  },
  {
    id: '3',
    title: 'Prepare client presentation',
    status: 'completed',
    priority: 'high',
    assignee: 'You',
    dueDate: '2024-01-12',
    board: 'Account Projects'
  },
  {
    id: '4',
    title: 'Follow up with hot leads',
    status: 'pending',
    priority: 'high',
    assignee: 'You',
    dueDate: '2024-01-16',
    board: 'Leads CRM'
  },
  {
    id: '5',
    title: 'Update contact information',
    status: 'in-progress',
    priority: 'low',
    assignee: 'You',
    dueDate: '2024-01-20',
    board: 'Contacts'
  }
];

export function TableView({ searchQuery = '', dateView = 'today' }: TableViewProps) {
  // Filter tasks based on search query
  const filteredTasks = mockTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.board.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: TaskItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'pending':
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
    }
  };

  const getPriorityColor = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
      case 'low':
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-lg">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-800/30">
        <h2 className="text-lg font-semibold text-white">
          My Tasks ({filteredTasks.length})
        </h2>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Board
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-800">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-800/30 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <CheckSquare className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {task.assignee}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status === 'in-progress' ? 'In Progress' :
                       task.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                      {formatDate(task.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {task.board}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks found{searchQuery && ` matching "${searchQuery}"`}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}