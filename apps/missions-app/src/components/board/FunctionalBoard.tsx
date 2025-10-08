import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  GripVertical,
  Table2,
  Columns3,
  Calendar,
  Clock,
  BarChart3,
  Search,
  Filter,
  X,
  Zap,
  Settings,
  MessageSquare,
  Check,
  ArrowLeft
} from 'lucide-react';

// Import existing types and services
import {
  COWBoard,
  COWBoardGroup,
  COWBoardTask,
  BoardFilter,
  PersonAssignment,
  BoardLabel,
  createEmptyTask
} from '../../types/board.types';
import hybridBoardService, { DataSource } from '../../services/hybrid-board.service';

// Import existing components
import { EditableCell } from './EditableCell';
import { KanbanView } from '../boards/views/KanbanView';

interface FunctionalBoardProps {
  boardData?: { boardId?: string };
  onUpdate?: (data: any) => void;
}

// Map COWBoard types to EditableCell types
const mapColumnTypeToEditableType = (type: string) => {
  switch (type) {
    case 'assignee': return 'person';
    case 'status': return 'status';
    case 'priority': return 'status';
    case 'date': return 'date';
    case 'text': return 'text';
    default: return 'text';
  }
};

// Create columns from COW board structure
const createColumnsFromBoard = (board: COWBoard) => {
  const baseColumns = [
    {
      id: 'title',
      name: 'Item',
      type: 'text' as const,
      width: '250px',
      position: 0,
      isPinned: true
    },
    {
      id: 'status',
      name: 'Status',
      type: 'status' as const,
      width: '150px',
      position: 1,
      options: board.labels
        .filter(l => l.type === 'status')
        .map(l => ({ id: l.id, label: l.title, color: l.color }))
    },
    {
      id: 'assignee',
      name: 'Person',
      type: 'person' as const,
      width: '150px',
      position: 2
    },
    {
      id: 'priority',
      name: 'Priority',
      type: 'status' as const,
      width: '120px',
      position: 3,
      options: board.labels
        .filter(l => l.type === 'priority')
        .map(l => ({ id: l.id, label: l.title, color: l.color }))
    },
    {
      id: 'dueDate',
      name: 'Due Date',
      type: 'date' as const,
      width: '150px',
      position: 4
    }
  ];

  return baseColumns;
};

// Convert COWBoard data to Board component format
const convertCOWBoardToBoard = (cowBoard: COWBoard) => {
  const groups = cowBoard.groups.map(group => ({
    id: group.id,
    name: group.title,
    color: group.color,
    position: group.position,
    collapsed: group.isCollapsed || false
  }));

  const items = cowBoard.groups.flatMap(group =>
    group.tasks.map(task => ({
      id: task.id,
      groupId: group.id,
      position: 0, // Tasks don't have explicit position in COWBoardTask
      data: {
        title: task.title,
        status: task.status,
        assignee: task.assigneeIds[0] || '', // Take first assignee
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        progress: task.progress || 0
      }
    }))
  );

  return { groups, items };
};

export const FunctionalBoard: React.FC<FunctionalBoardProps> = ({
  boardData,
  onUpdate
}) => {
  const { boardId: paramBoardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const boardId = boardData?.boardId || paramBoardId || 'board-1';

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [board, setBoard] = useState<COWBoard | null>(null);
  const [currentView, setCurrentView] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<BoardFilter>({
    title: '',
    assigneeId: '',
    status: [],
    priority: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState(hybridBoardService.getConnectionInfo());

  // People data - convert from board members
  const people: PersonAssignment[] = board?.members || [];

  // Load board data
  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const boardData = await hybridBoardService.getBoardById(boardId);

      // Update connection info
      setConnectionInfo(hybridBoardService.getConnectionInfo());
      if (!boardData) {
        setError('Board not found');
        return;
      }

      setBoard(boardData);

      // Notify parent of data load
      if (onUpdate) {
        onUpdate(boardData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load board');
      console.error('Error loading board:', err);
    } finally {
      setLoading(false);
    }
  }, [boardId, onUpdate]);

  // Load board on mount and when boardId changes
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Task operations
  const handleAddItem = async (groupId: string) => {
    if (!board) return;

    try {
      const newTask = await hybridBoardService.createTask(board.id, groupId, {
        title: 'New Task',
        status: 'Not Started',
        priority: 'Medium',
        assigneeIds: [],
        updatedBy: {
          userId: 'current-user', // Replace with actual user ID
          date: Date.now(),
          userAvatar: ''
        }
      });

      if (newTask) {
        await loadBoard(); // Reload board to get updated data
      }
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteItem = async (taskId: string) => {
    if (!board) return;

    // Find which group contains this task
    const group = board.groups.find(g =>
      g.tasks.some(t => t.id === taskId)
    );

    if (!group) return;

    if (window.confirm('Delete this task?')) {
      try {
        await hybridBoardService.deleteTask(board.id, group.id, taskId);
        await loadBoard();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleAddGroup = async () => {
    if (!board) return;

    const name = prompt('Group name:');
    if (name) {
      try {
        const colors = ['#0073ea', '#00c875', '#ff5e5b', '#fdab3d', '#579bfc'];
        await hybridBoardService.createGroup(board.id, {
          title: name,
          color: colors[board.groups.length % colors.length],
          position: board.groups.length,
          tasks: [],
          isCollapsed: false
        });
        await loadBoard();
      } catch (err) {
        console.error('Error adding group:', err);
      }
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!board) return;

    if (window.confirm('Delete this group and all its tasks?')) {
      try {
        await boardService.deleteGroup(board.id, groupId);
        await loadBoard();
      } catch (err) {
        console.error('Error deleting group:', err);
      }
    }
  };

  const updateItemData = async (taskId: string, field: string, value: any) => {
    if (!board) return;

    // Find which group contains this task
    const group = board.groups.find(g =>
      g.tasks.some(t => t.id === taskId)
    );

    if (!group) return;

    try {
      const updates: Partial<COWBoardTask> = {};

      // Map field names to COWBoardTask properties
      switch (field) {
        case 'title':
          updates.title = value;
          break;
        case 'status':
          updates.status = value;
          break;
        case 'assignee':
          updates.assigneeIds = value ? [value] : [];
          break;
        case 'priority':
          updates.priority = value;
          break;
        case 'dueDate':
          updates.dueDate = value ? new Date(value).getTime() : undefined;
          break;
      }

      updates.updatedBy = {
        userId: 'current-user', // Replace with actual user ID
        date: Date.now(),
        userAvatar: ''
      };

      await boardService.updateTask(board.id, group.id, taskId, updates);
      await loadBoard();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const toggleGroup = (groupId: string) => {
    // This would update the collapsed state
    // For now, just toggle locally
    setBoard(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        groups: prev.groups.map(group =>
          group.id === groupId
            ? { ...group, isCollapsed: !group.isCollapsed }
            : group
        )
      };
    });
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !board) return;

    // Handle task movement between groups
    if (active.id !== over.id) {
      const taskId = active.id as string;
      const overId = over.id as string;

      // Find source group
      const sourceGroup = board.groups.find(g =>
        g.tasks.some(t => t.id === taskId)
      );

      if (!sourceGroup) return;

      // Determine target group
      let targetGroupId: string;

      if (overId.startsWith('group-')) {
        targetGroupId = overId.replace('group-', '');
      } else {
        // Dropped on another task, find its group
        const targetGroup = board.groups.find(g =>
          g.tasks.some(t => t.id === overId)
        );
        targetGroupId = targetGroup?.id || sourceGroup.id;
      }

      try {
        await boardService.moveTask(
          board.id,
          sourceGroup.id,
          targetGroupId,
          taskId,
          0 // Insert at beginning for now
        );
        await loadBoard();
      } catch (err) {
        console.error('Error moving task:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading board...</div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 mb-4">{error || 'Board not found'}</div>
        <button
          onClick={() => navigate('/app/my-office')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Office</span>
        </button>
      </div>
    );
  }

  const columns = createColumnsFromBoard(board);
  const { groups, items } = convertCOWBoardToBoard(board);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex flex-col h-full backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-lg bg-black/10">
          <div>
            <h1 className="text-2xl font-semibold text-white">{board.title}</h1>
            <p className="text-gray-300 mt-1">{board.description || 'COW Mission Board'}</p>
            {/* Data source indicator */}
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionInfo.dataSource === 'monday' ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs text-gray-400">
                Data source: {connectionInfo.dataSource === 'monday' ? 'Monday.com (Live)' : 'Mock Data'}
              </span>
              {connectionInfo.dataSource === 'monday' && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  ✓ Connected
                </span>
              )}
              {connectionInfo.mondayConfigured && !connectionInfo.mondayConnected && (
                <button
                  onClick={async () => {
                    const newConnectionInfo = await hybridBoardService.refreshConnection();
                    setConnectionInfo(newConnectionInfo);
                    if (newConnectionInfo.mondayConnected) {
                      loadBoard(); // Reload with Monday.com data
                    }
                  }}
                  className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded hover:bg-yellow-500/30"
                >
                  Retry Connection
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddGroup}
              className="flex items-center space-x-2 px-4 py-2 border border-white/20 backdrop-blur-md bg-black/10 text-white rounded-md hover:bg-black/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
            <button
              onClick={() => board.groups.length > 0 && handleAddItem(board.groups[0].id)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* View Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/5 border-b border-white/10">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'table'
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'kanban'
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm'
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {items.length} tasks across {groups.length} groups
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-white/20 backdrop-blur-md bg-black/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {currentView === 'table' && (
            <div className="h-full">
              <table className="w-full bg-transparent">
                <tbody className="backdrop-blur-sm divide-y divide-white/10">
                  <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {groups.map((group) => {
                      const groupItems = items
                        .filter(item => item.groupId === group.id)
                        .filter(item => {
                          if (searchQuery) {
                            return item.data.title.toLowerCase().includes(searchQuery.toLowerCase());
                          }
                          return true;
                        });

                      return (
                        <React.Fragment key={group.id}>
                          {/* Group Header */}
                          <tr className="backdrop-blur-md bg-black/10 group/header transition-colors">
                            <td
                              colSpan={100}
                              className="px-4 py-3"
                              style={{
                                position: 'sticky',
                                left: 0,
                                top: 0,
                                backgroundColor: 'transparent',
                                zIndex: 12,
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => toggleGroup(group.id)}
                                  className="flex items-center space-x-2 text-sm font-medium text-white hover:text-gray-200"
                                >
                                  {group.collapsed ? (
                                    <ChevronRight className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: group.color }}
                                  ></div>
                                  <span>{group.name}</span>
                                  <span className="text-gray-300">({groupItems.length})</span>
                                </button>

                                <div className="flex items-center space-x-2 opacity-0 group-hover/header:opacity-100 transition-all">
                                  <button
                                    onClick={() => handleAddItem(group.id)}
                                    className="text-gray-300 hover:text-blue-400"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="text-gray-300 hover:text-red-400"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>

                          {/* Column Headers */}
                          {!group.collapsed && (
                            <tr className="backdrop-blur-sm border-b border-white/20">
                              <th className="w-12 px-4 py-3"></th>
                              {columns.map((column) => (
                                <th
                                  key={column.id}
                                  className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                  style={{ width: column.width }}
                                >
                                  {column.name}
                                </th>
                              ))}
                              <th className="w-12 px-4 py-3"></th>
                            </tr>
                          )}

                          {/* Group Items */}
                          {!group.collapsed && groupItems.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-black/20 backdrop-blur-sm group"
                            >
                              <td className="w-12 px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-1 h-8 rounded-full"
                                    style={{ backgroundColor: group.color }}
                                  ></div>
                                  <button
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>

                              {columns.map((column) => (
                                <td
                                  key={column.id}
                                  className="px-4 py-1"
                                  style={{ width: column.width }}
                                >
                                  <EditableCell
                                    column={{
                                      id: column.id,
                                      name: column.name,
                                      type: mapColumnTypeToEditableType(column.type),
                                      width: column.width,
                                      position: column.position,
                                      options: column.options
                                    }}
                                    value={item.data[column.id]}
                                    onSave={(value) => updateItemData(item.id, column.id, value)}
                                    people={people}
                                  />
                                </td>
                              ))}

                              <td className="w-12 px-4 py-3">
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </SortableContext>
                </tbody>
              </table>
            </div>
          )}

          {currentView === 'kanban' && (
            <div className="h-full p-4">
              <div className="text-center text-gray-400">
                Kanban view integration coming soon...
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
};

export default FunctionalBoard;