import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Settings, 
  Filter, 
  Star,
  Download,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Save,
  Check,
  Calendar,
  User,
  Mail,
  Phone,
  Link,
  ChevronDown,
  Pin,
  PinOff,
  ChevronLeft,
  ChevronRight,
  Table,
  Columns,
  BarChart3,
  Layout,
  GanttChart,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { COWBoard, COWBoardTask, COWBoardGroup } from '../../types/board.types';
import { useBoardStore } from '../../store/board.store';

interface AdaptiveMondayBoardProps {
  board: COWBoard;
}

export function AdaptiveMondayBoard({ board }: AdaptiveMondayBoardProps) {
  const {
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    createGroup,
    updateGroup,
    deleteGroup,
    moveTask
  } = useBoardStore();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ taskId: string; groupId: string; field: string } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Convert COWBoard data to adaptive format
  const adaptedColumns = React.useMemo(() => {
    const columns = [
      { id: 'title', title: 'Task', type: 'text', width: 250, frozen: true },
      { id: 'status', title: 'Status', type: 'status', width: 130, options: board.labels.filter(l => l.type === 'status').map(l => ({ value: l.id, label: l.title, color: l.color })) },
      { id: 'priority', title: 'Priority', type: 'priority', width: 110 },
      { id: 'assigneeIds', title: 'Assignee', type: 'person', width: 140 },
      { id: 'dueDate', title: 'Due Date', type: 'date', width: 130 },
      { id: 'progress', title: 'Progress', type: 'progress', width: 150 }
    ];
    return columns;
  }, [board]);

  const adaptedItems = React.useMemo(() => {
    const items: any[] = [];
    board.groups.forEach(group => {
      group.tasks.forEach(task => {
        items.push({
          id: task.id,
          groupId: group.id,
          data: {
            title: task.title,
            status: task.status,
            priority: task.priority,
            assigneeIds: task.assigneeIds,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            progress: task.progress || 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });
    return items;
  }, [board]);

  const handleCellEdit = async (taskId: string, groupId: string, field: string, value: any) => {
    await updateTask(board.id, groupId, taskId, { [field]: value });
    setEditingCell(null);
  };

  const handleAddTask = async (groupId: string) => {
    await createTask(board.id, groupId, {
      title: 'New Task',
      status: 'Not Started',
      priority: 'Medium'
    });
  };

  const handleDeleteTask = async (taskId: string, groupId: string) => {
    await deleteTask(board.id, groupId, taskId);
    setSelectedItems(selectedItems.filter(id => id !== taskId));
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    for (const taskId of selectedItems) {
      const item = adaptedItems.find(item => item.id === taskId);
      if (item) {
        await deleteTask(board.id, item.groupId, taskId);
      }
    }
    setSelectedItems([]);
  };

  const renderCellValue = (value: any, field: string) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Empty</span>;
    }

    switch (field) {
      case 'status':
        const statusLabel = board.labels.find(l => l.id === value || l.title === value);
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: statusLabel?.color || '#6B7280' }}
          >
            {statusLabel?.title || value}
          </span>
        );
      
      case 'priority':
        const colors = {
          Low: 'bg-green-100 text-green-800',
          Medium: 'bg-yellow-100 text-yellow-800', 
          High: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      
      case 'progress':
        const progress = Number(value) || 0;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 font-mono min-w-[30px]">{progress}%</span>
          </div>
        );
      
      case 'dueDate':
        return value ? <span className="text-gray-700">{new Date(value).toLocaleDateString()}</span> : null;
      
      case 'assigneeIds':
        if (!Array.isArray(value) || value.length === 0) return <span className="text-gray-400">Unassigned</span>;
        return (
          <div className="flex -space-x-1">
            {value.slice(0, 3).map((assigneeId: string, index: number) => (
              <div
                key={assigneeId}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border border-white"
              >
                <User className="w-3 h-3" />
              </div>
            ))}
            {value.length > 3 && (
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs border border-white">
                +{value.length - 3}
              </div>
            )}
          </div>
        );
        
      default:
        return <span className="text-gray-900">{String(value)}</span>;
    }
  };

  const renderCellInput = (taskId: string, groupId: string, field: string, currentValue: any) => {
    switch (field) {
      case 'status':
        return (
          <select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(taskId, groupId, field, cellValue)}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          >
            {board.labels.filter(l => l.type === 'status').map((label) => (
              <option key={label.id} value={label.title}>
                {label.title}
              </option>
            ))}
          </select>
        );
      
      case 'priority':
        return (
          <select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(taskId, groupId, field, cellValue)}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        );
      
      case 'progress':
        return (
          <input
            type="number"
            min="0"
            max="100"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(taskId, groupId, field, parseInt(cellValue) || 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(taskId, groupId, field, parseInt(cellValue) || 0);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
            autoFocus
          />
        );
      
      case 'dueDate':
        return (
          <input
            type="date"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(taskId, groupId, field, new Date(cellValue).getTime())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(taskId, groupId, field, new Date(cellValue).getTime());
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(taskId, groupId, field, cellValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(taskId, groupId, field, cellValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          />
        );
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">{board.title}</h1>
            <span className="text-sm text-gray-500">
              {adaptedItems.length} items • {board.groups.length} groups
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Star className={`w-5 h-5 ${board.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowColumnManager(!showColumnManager)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                showColumnManager ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Manage columns"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div 
        ref={tableRef}
        className="bg-white overflow-x-auto scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E1 #F1F5F9',
          scrollBehavior: 'smooth'
        }}
      >
        {/* Table Header */}
        <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
          <div className="flex text-sm font-medium text-gray-600 min-w-max">
            {/* Sticky Checkbox Column */}
            <div className="sticky left-0 z-30 w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200 bg-gray-50">
              <input
                type="checkbox"
                checked={selectedItems.length === adaptedItems.length && adaptedItems.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(adaptedItems.map(item => item.id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            
            {/* Columns */}
            {adaptedColumns.map((column) => (
              <div 
                key={column.id}
                className={`px-4 py-3 border-r border-gray-200 flex items-center justify-between group ${
                  column.frozen ? 'sticky z-20 bg-gray-50 shadow-sm left-12' : ''
                }`}
                style={{ 
                  minWidth: `${column.width}px`, 
                  width: `${column.width}px`
                }}
              >
                <span className="font-medium text-gray-900">{column.title}</span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Groups and Tasks */}
        <div className="divide-y divide-gray-100">
          {board.groups.map((group) => (
            <div key={group.id}>
              {/* Group Header */}
              <div className="bg-gray-50 border-l-4 px-6 py-3" style={{ borderLeftColor: group.color }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{group.title}</h3>
                  <button
                    onClick={() => handleAddTask(group.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Task
                  </button>
                </div>
              </div>

              {/* Group Tasks */}
              {group.tasks.map((task, taskIndex) => (
                <div key={task.id} className={`flex hover:bg-blue-50 group min-w-max transition-colors ${
                  taskIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}>
                  {/* Sticky Row Checkbox */}
                  <div className="sticky left-0 z-10 w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200 bg-inherit">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, task.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== task.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Task Cells */}
                  {adaptedColumns.map((column) => {
                    const fieldValue = column.id === 'assigneeIds' ? task.assigneeIds : 
                                     column.id === 'dueDate' ? (task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '') :
                                     task[column.id as keyof COWBoardTask];
                    
                    return (
                      <div 
                        key={column.id}
                        className={`px-4 py-3 border-r border-gray-200 relative ${
                          column.frozen ? 'sticky z-10 bg-inherit shadow-sm left-12' : ''
                        }`}
                        style={{ 
                          minWidth: `${column.width}px`, 
                          width: `${column.width}px`
                        }}
                      >
                        {editingCell?.taskId === task.id && editingCell?.groupId === group.id && editingCell?.field === column.id ? (
                          renderCellInput(task.id, group.id, column.id, fieldValue)
                        ) : (
                          <div
                            className="cursor-pointer rounded px-2 py-1 transition-colors hover:bg-blue-50 hover:ring-2 hover:ring-blue-200"
                            onClick={() => {
                              setEditingCell({ taskId: task.id, groupId: group.id, field: column.id });
                              setCellValue((fieldValue || '').toString());
                            }}
                          >
                            {renderCellValue(fieldValue, column.id)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Actions cell */}
                  <div className="w-16 px-3 py-3 bg-inherit">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => handleDeleteTask(task.id, group.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty Group */}
              {group.tasks.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No tasks in this group</p>
                  <button
                    onClick={() => handleAddTask(group.id)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Add the first task
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}