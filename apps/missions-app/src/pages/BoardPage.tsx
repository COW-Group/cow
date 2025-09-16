import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, User, Settings, Star, StarOff } from 'lucide-react';
import { useBoardStore } from '../store/board.store';
import { SimpleDragDrop } from '../components/board/SimpleDragDrop';
import { DynamicBoard } from '../components/board/DynamicBoard';
import { AdaptiveMondayBoard } from '../components/board/AdaptiveMondayBoard';
import { IntegratedFlexiBoard } from '../components/board/IntegratedFlexiBoard';

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [useFlexiBoard, setUseFlexiBoard] = useState(true); // Default to FlexiBoard for enhanced features
  
  const {
    currentBoard,
    filteredBoard,
    isLoading,
    error,
    filter,
    viewType,
    fetchBoardById,
    setFilter,
    setViewType,
    toggleBoardStar,
    createTask,
    createGroup,
    updateTask,
    deleteTask,
    duplicateTask,
    updateGroup,
    deleteGroup,
    duplicateGroup,
    moveTask,
    updateColumnOrder
  } = useBoardStore();

  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId);
    }
  }, [boardId, fetchBoardById]);

  const handleFilterChange = (field: string, value: any) => {
    setFilter({ [field]: value });
  };

  const handleAddTask = async (groupId: string) => {
    if (!boardId) return;
    
    await createTask(boardId, groupId, {
      title: 'New Task',
      status: 'Not Started',
      priority: 'Medium'
    });
  };

  const handleAddGroup = async () => {
    if (!boardId) return;
    
    await createGroup(boardId, {
      title: 'New Group',
      color: '#579bfc'
    });
  };

  const handleUpdateTask = async (groupId: string, taskId: string, updates: any) => {
    if (!boardId) return;
    await updateTask(boardId, groupId, taskId, updates);
  };

  const handleDeleteTask = async (groupId: string, taskId: string) => {
    if (!boardId) return;
    await deleteTask(boardId, groupId, taskId);
  };

  const handleDuplicateTask = async (groupId: string, taskId: string) => {
    if (!boardId) return;
    await duplicateTask(boardId, groupId, taskId);
  };

  const handleUpdateGroup = async (groupId: string, updates: any) => {
    if (!boardId) return;
    await updateGroup(boardId, groupId, updates);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!boardId) return;
    await deleteGroup(boardId, groupId);
  };

  const handleDuplicateGroup = async (groupId: string) => {
    if (!boardId) return;
    await duplicateGroup(boardId, groupId);
  };

  const handleMoveTask = async (sourceGroupId: string, targetGroupId: string, taskId: string, newIndex: number) => {
    if (!boardId) return;
    await moveTask(boardId, sourceGroupId, targetGroupId, taskId, newIndex);
  };

  const handleUpdateColumnOrder = async (newColumns: any) => {
    if (!boardId) return;
    await updateColumnOrder(boardId, newColumns);
  };

  const handleToggleStar = async () => {
    if (!boardId) return;
    await toggleBoardStar(boardId);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/app/boards')}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  // Use IntegratedFlexiBoard by default for enhanced features
  if (useFlexiBoard && boardId) {
    return (
      <div className="min-h-screen bg-black">
        {/* Back navigation */}
        <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
          <button
            onClick={() => navigate('/app/boards')}
            className="flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Boards
          </button>
        </div>

        {/* IntegratedFlexiBoard with all advanced features */}
        <IntegratedFlexiBoard boardId={boardId} />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Board not found</p>
          <button
            onClick={() => navigate('/app/boards')}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  // Fallback to COWBoard view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <button 
          onClick={() => navigate('/boards')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Boards
        </button>
      </div>

      {/* COWBoard Fallback */}
      <AdaptiveMondayBoard board={currentBoard} />
    </div>
  );
}

// Table View Component
function TableView({ board, onAddTask }: { board: any; onAddTask: (groupId: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
          <div className="col-span-4">Task</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Due Date</div>
        </div>
      </div>

      {/* Groups */}
      {board.groups.map((group: any) => (
        <div key={group.id} className="border-b border-gray-100 last:border-b-0">
          {/* Group Header */}
          <div className="px-6 py-3 bg-gray-50 border-l-4" style={{ borderLeftColor: group.color }}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{group.title}</h3>
              <button
                onClick={() => onAddTask(group.id)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Tasks */}
          {group.tasks.map((task: any) => (
            <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="grid grid-cols-12 gap-4 items-center text-sm">
                <div className="col-span-4 font-medium text-gray-900">
                  {task.title}
                </div>
                <div className="col-span-2">
                  <div className="flex -space-x-1">
                    {task.assigneeIds.slice(0, 2).map((assigneeId: string, index: number) => (
                      <div
                        key={assigneeId}
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border border-white"
                      >
                        <User className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'Working on it' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'Stuck' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="col-span-2 text-gray-500">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </div>
              </div>
            </div>
          ))}

          {group.tasks.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
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

// Placeholder components
function KanbanView({ board, onAddTask }: { board: any; onAddTask: (groupId: string) => void }) {
  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {board.groups.map((group: any) => (
        <div key={group.id} className="flex-shrink-0 w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: group.color + '20' }}>
              <h3 className="font-medium text-gray-900">{group.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              {group.tasks.map((task: any) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'Done' ? 'bg-green-100 text-green-800' :
                      task.status === 'Working on it' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'Stuck' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500">{task.priority}</span>
                  </div>
                </div>
              ))}
              <button
                onClick={() => onAddTask(group.id)}
                className="w-full text-left text-gray-500 hover:text-gray-700 text-sm py-2"
              >
                + Add task
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardView({ board }: { board: any }) {
  const totalTasks = board.groups.reduce((sum: number, group: any) => sum + group.tasks.length, 0);
  const completedTasks = board.groups.reduce((sum: number, group: any) => 
    sum + group.tasks.filter((task: any) => task.status === 'Done').length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{totalTasks}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
        <p className="text-2xl font-bold text-green-600 mt-2">{completedTasks}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {totalTasks - completedTasks}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
        </p>
      </div>
    </div>
  );
}