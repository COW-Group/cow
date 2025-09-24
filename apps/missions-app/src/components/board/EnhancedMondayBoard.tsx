import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, ChevronDown, ChevronRight, Trash2, GripVertical, Table2, Columns3, Calendar, Clock, BarChart3, Search, Filter, X, Zap, Settings } from 'lucide-react';
import { EditableCell } from './EditableCell';
import { KanbanView } from '../boards/views/KanbanView';

// Types - Compatible with your existing FlexiBoard types
interface BoardColumn {
  id: string;
  name: string;
  type: 'text' | 'status' | 'person' | 'date' | 'number' | 'checkbox' | 'dropdown';
  width: string;
  position: number;
  options?: { id: string; label: string; color: string }[];
}

interface BoardGroup {
  id: string;
  name: string;
  color: string;
  position: number;
  collapsed: boolean;
}

interface BoardItem {
  id: string;
  groupId: string;
  position: number;
  data: Record<string, any>;
}

interface Person {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

type ViewType = 'table' | 'kanban' | 'calendar' | 'timeline' | 'gantt';

// Droppable Group Header Component
const DroppableGroupHeader: React.FC<{
  group: BoardGroup;
  itemCount: number;
  isCollapsed: boolean;
  onToggle: () => void;
  onAddItem: () => void;
  onDeleteGroup: () => void;
}> = ({ group, itemCount, isCollapsed, onToggle, onAddItem, onDeleteGroup }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `group-${group.id}`,
  });

  return (
    <tr
      ref={setNodeRef}
      className={`bg-gray-25 group/header transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
      }`}
    >
      <td colSpan={100} className="px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color }}
            ></div>
            <span>{group.name}</span>
            <span className="text-gray-500">({itemCount})</span>
          </button>

          <div className="flex items-center space-x-2 opacity-0 group-hover/header:opacity-100 transition-all">
            <button
              onClick={onAddItem}
              className="text-gray-400 hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteGroup}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {isOver && (
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Drop item here to move to {group.name}
          </div>
        )}
      </td>
    </tr>
  );
};

// Draggable Column Header Component
const DraggableColumnHeader: React.FC<{
  column: BoardColumn;
}> = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <th
      ref={setNodeRef}
      style={{ ...style, width: column.width }}
      className={`group px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${
        isDragging ? 'z-50 bg-gray-100' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center space-x-2">
        <span>{column.name}</span>
        <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </th>
  );
};

// Draggable Item Component with EditableCell
const DraggableItem: React.FC<{
  item: BoardItem;
  columns: BoardColumn[];
  people: Person[];
  updateItemData: (itemId: string, columnId: string, value: any) => void;
  handleDeleteItem: (itemId: string) => void;
  groupColor: string;
}> = ({ item, columns, people, updateItemData, handleDeleteItem, groupColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 group ${isDragging ? 'z-50' : ''}`}
    >
      <td className="w-12 px-4 py-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: groupColor }}
          ></div>
          <button
            {...attributes}
            {...listeners}
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
            column={column}
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
  );
};

// Main Enhanced Board Component
interface EnhancedMondayBoardProps {
  // You can keep your existing board prop interface or adapt this
  boardData?: any;
  onUpdate?: (data: any) => void;
}

export const EnhancedMondayBoard: React.FC<EnhancedMondayBoardProps> = ({
  boardData,
  onUpdate
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<{status?: string, person?: string}>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAutomation, setShowAutomation] = useState(false);
  // Sample data - replace this with your actual data integration
  const [columns, setColumns] = useState<BoardColumn[]>([
    { id: 'col-1', name: 'Item', type: 'text', width: '250px', position: 0 },
    { id: 'col-2', name: 'Status', type: 'status', width: '150px', position: 1,
      options: [
        { id: '1', label: 'Not Started', color: '#c4c4c4' },
        { id: '2', label: 'Working on it', color: '#fdab3d' },
        { id: '3', label: 'Done', color: '#00c875' },
      ]
    },
    { id: 'col-3', name: 'Person', type: 'person', width: '150px', position: 2 },
    { id: 'col-4', name: 'Due Date', type: 'date', width: '150px', position: 3 },
  ]);

  const [groups, setGroups] = useState<BoardGroup[]>([
    { id: 'group-1', name: 'To Do', color: '#0073ea', position: 0, collapsed: false },
    { id: 'group-2', name: 'In Progress', color: '#00c875', position: 1, collapsed: false },
  ]);

  const [items, setItems] = useState<BoardItem[]>([
    { id: 'item-1', groupId: 'group-1', position: 0, data: { 'col-1': 'Design new homepage', 'col-2': '1', 'col-3': 'person-1', 'col-4': '2024-12-31' }},
    { id: 'item-2', groupId: 'group-1', position: 1, data: { 'col-1': 'Setup database', 'col-2': '2', 'col-3': 'person-2', 'col-4': '2024-12-25' }},
    { id: 'item-3', groupId: 'group-2', position: 0, data: { 'col-1': 'Write documentation', 'col-2': '3', 'col-3': '', 'col-4': '' }},
  ]);

  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const people: Person[] = [
    { id: 'person-1', name: 'John Doe', color: '#0073ea' },
    { id: 'person-2', name: 'Jane Smith', color: '#00c875' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateItemData = useCallback((itemId: string, columnId: string, value: any) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, data: { ...item.data, [columnId]: value } }
          : item
      )
    );

    // Notify parent component of updates
    if (onUpdate) {
      onUpdate({ items, columns, groups });
    }
  }, [items, columns, groups, onUpdate]);

  // Convert board items to tasks for Kanban view
  const convertItemsToTasks = () => {
    return items.map(item => ({
      id: item.id,
      title: item.data['col-1'] || 'Untitled',
      description: item.data['col-3'] || '',
      status: item.data['col-2'] || 'todo',
      position: item.position,
      assignedTo: item.data['col-4'] || null,
      projectId: 'board-project',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: item.data['col-5'] ? new Date(item.data['col-5']) : null,
    }));
  };

  const handleTaskUpdate = (taskId: string, updates: any) => {
    const columnMappings = {
      status: 'col-2',
      title: 'col-1',
      description: 'col-3',
      assignedTo: 'col-4',
      dueDate: 'col-5',
    };

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === taskId) {
          const newData = { ...item.data };
          Object.entries(updates).forEach(([key, value]) => {
            const columnId = columnMappings[key as keyof typeof columnMappings];
            if (columnId) {
              newData[columnId] = value;
            }
          });
          return { ...item, data: newData, position: updates.position ?? item.position };
        }
        return item;
      })
    );
  };

  const handleTaskCreate = (task: any) => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      groupId: groups[0]?.id || 'group-1',
      position: items.filter(item => item.groupId === groups[0]?.id).length,
      data: {
        'col-1': task.title || 'New Item',
        'col-2': task.status || 'todo',
        'col-3': task.description || '',
        'col-4': task.assignedTo || '',
        'col-5': task.dueDate || '',
      },
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleTaskDelete = (taskId: string) => {
    setItems(prev => prev.filter(item => item.id !== taskId));
  };

  // Filter and search functionality
  const filteredItems = items.filter(item => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = Object.values(item.data).some(value =>
        String(value).toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (activeFilters.status && item.data['col-2'] !== activeFilters.status) {
      return false;
    }

    // Person filter
    if (activeFilters.person && item.data['col-4'] !== activeFilters.person) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || Object.keys(activeFilters).length > 0;

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleAddItem = (groupId: string) => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      groupId,
      position: items.filter(item => item.groupId === groupId).length,
      data: { [columns[0]?.id]: 'New Item' },
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleAddGroup = () => {
    const name = prompt('Group name:');
    if (name) {
      const colors = ['#0073ea', '#00c875', '#ff5e5b', '#fdab3d', '#579bfc'];
      const newGroup: BoardGroup = {
        id: `group-${Date.now()}`,
        name,
        color: colors[groups.length % colors.length],
        position: groups.length,
        collapsed: false,
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Delete this group and all its items?')) {
      setItems(prev => prev.filter(item => item.groupId !== groupId));
      setGroups(prev => prev.filter(group => group.id !== groupId));
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      // Check if we're dragging a column
      const activeColumn = columns.find(col => col.id === active.id);
      const overColumn = columns.find(col => col.id === over.id);

      if (activeColumn && overColumn) {
        // Handle column reordering
        setColumns(prevColumns => {
          const oldIndex = prevColumns.findIndex(col => col.id === active.id);
          const newIndex = prevColumns.findIndex(col => col.id === over.id);

          if (oldIndex === -1 || newIndex === -1) return prevColumns;

          const newColumns = [...prevColumns];
          const [movedColumn] = newColumns.splice(oldIndex, 1);
          newColumns.splice(newIndex, 0, movedColumn);

          // Update positions
          newColumns.forEach((column, index) => {
            column.position = index;
          });

          return newColumns;
        });
      } else {
        // Handle item dragging
        const activeItem = items.find(item => item.id === active.id);

        if (activeItem) {
          // Check if dropping on a group header (cross-group move)
          const overIdString = over.id as string;
          if (overIdString.startsWith('group-')) {
            const targetGroupId = overIdString.replace('group-', '');
            if (activeItem.groupId !== targetGroupId) {
              // Move item to the end of the target group
              setItems(prevItems => {
                const newItems = [...prevItems];
                const itemIndex = newItems.findIndex(item => item.id === activeItem.id);
                if (itemIndex !== -1) {
                  newItems[itemIndex] = { ...activeItem, groupId: targetGroupId };
                }
                return newItems;
              });
            }
          } else {
            // Handle item-to-item reordering within the same group or cross-group
            const overItem = items.find(item => item.id === over.id);
            if (overItem && activeItem.id !== overItem.id) {
              setItems(prevItems => {
                const newItems = [...prevItems];
                const activeIndex = newItems.findIndex(item => item.id === active.id);
                const overIndex = newItems.findIndex(item => item.id === over.id);

                if (activeIndex === -1 || overIndex === -1) return prevItems;

                // Remove the active item
                const [movedItem] = newItems.splice(activeIndex, 1);

                // If moving to a different group, update the groupId
                if (activeItem.groupId !== overItem.groupId) {
                  movedItem.groupId = overItem.groupId;
                }

                // Calculate new index after removal (if overIndex was after activeIndex)
                const adjustedOverIndex = overIndex > activeIndex ? overIndex - 1 : overIndex;

                // Insert at the new position
                newItems.splice(adjustedOverIndex, 0, movedItem);

                // Update positions for all items in affected groups
                const affectedGroups = [...new Set([activeItem.groupId, overItem.groupId])];
                affectedGroups.forEach(groupId => {
                  const groupItems = newItems.filter(item => item.groupId === groupId);

                  // Sort by their current order in the array
                  groupItems.sort((a, b) => {
                    return newItems.indexOf(a) - newItems.indexOf(b);
                  });

                  // Update positions
                  groupItems.forEach((item, index) => {
                    item.position = index;
                  });
                });

                return newItems;
              });
            }
          }
        }
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Enhanced Board</h1>
            <p className="text-gray-500 mt-1">Drag & drop enabled Monday.com board</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddGroup}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
            <button
              onClick={() => groups.length > 0 && handleAddItem(groups[0].id)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Item</span>
            </button>
            <button
              onClick={() => setShowAutomation(!showAutomation)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Zap className="w-4 h-4" />
              <span>Automate</span>
            </button>
          </div>
        </div>

        {/* View Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentView('table')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'table'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setCurrentView('kanban')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'kanban'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'timeline'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setCurrentView('gantt')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'gantt'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gantt</span>
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredItems.length} of {items.length} items across {groups.length} groups
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {Object.keys(activeFilters).length + (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-600 text-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={activeFilters.status || ''}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All statuses</option>
                  {columns.find(col => col.id === 'col-2')?.options?.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Person Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select
                  value={activeFilters.person || ''}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, person: e.target.value || undefined }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All people</option>
                  {people.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Automation Panel */}
        {showAutomation && (
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Automation Center</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Auto-assign on status change</h4>
                        <p className="text-xs text-gray-500">When status changes to "Working on it", assign to John Doe</p>
                      </div>
                      <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Set up
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notify when due date approaches</h4>
                        <p className="text-xs text-gray-500">Send email notification 1 day before due date</p>
                      </div>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Set up
                      </button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Archive completed items</h4>
                        <p className="text-xs text-gray-500">Move items to archive 7 days after completion</p>
                      </div>
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Set up
                      </button>
                    </div>
                  </div>
                </div>
                <button className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center space-x-1">
                  <Settings className="w-4 h-4" />
                  <span>Create custom automation</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Content */}
        <div className="flex-1 overflow-auto">
          {currentView === 'table' && (
            <div className="h-full">{renderTableView()}</div>
          )}
          {currentView === 'kanban' && (
            <div className="h-full">
              <KanbanView
                tasks={filteredItems.map(item => ({
                  id: item.id,
                  title: item.data['col-1'] || 'Untitled',
                  description: item.data['col-3'] || '',
                  status: item.data['col-2'] || 'todo',
                  position: item.position,
                  assignedTo: item.data['col-4'] || null,
                  projectId: 'board-project',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  dueDate: item.data['col-5'] ? new Date(item.data['col-5']) : null,
                }))}
                onTaskUpdate={handleTaskUpdate}
                onTaskCreate={handleTaskCreate}
                onTaskDelete={handleTaskDelete}
                projectId="board-project"
              />
            </div>
          )}
          {currentView === 'calendar' && (
            <div className="h-full p-6">
              <div className="text-center text-gray-500">
                Calendar view coming soon - will integrate with existing CalendarView component
              </div>
            </div>
          )}
          {currentView === 'timeline' && (
            <div className="h-full p-6">
              <div className="text-center text-gray-500">
                Timeline view coming soon - will integrate with existing TimelineView component
              </div>
            </div>
          )}
          {currentView === 'gantt' && (
            <div className="h-full p-6">
              <div className="text-center text-gray-500">
                Gantt view coming soon - will integrate with existing GanttView component
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );

  function renderTableView() {
    return (
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <SortableContext
                  items={columns.map(col => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <DraggableColumnHeader
                      key={column.id}
                      column={column}
                    />
                  ))}
                </SortableContext>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              <SortableContext
                items={filteredItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {groups.map((group) => {
                  const groupItems = filteredItems
                    .filter(item => item.groupId === group.id)
                    .sort((a, b) => a.position - b.position);
                  const isCollapsed = collapsedGroups.includes(group.id);

                  return (
                    <React.Fragment key={group.id}>
                      {/* Group Header */}
                      <DroppableGroupHeader
                        group={group}
                        itemCount={groupItems.length}
                        isCollapsed={isCollapsed}
                        onToggle={() => toggleGroup(group.id)}
                        onAddItem={() => handleAddItem(group.id)}
                        onDeleteGroup={() => handleDeleteGroup(group.id)}
                      />

                      {/* Group Items */}
                      {!isCollapsed && (
                        <>
                          {groupItems.map((item) => (
                            <DraggableItem
                              key={item.id}
                              item={item}
                              columns={columns}
                              people={people}
                              updateItemData={updateItemData}
                              handleDeleteItem={handleDeleteItem}
                              groupColor={group.color}
                            />
                          ))}
                        </>
                      )}

                      {/* Add Item Row */}
                      {!isCollapsed && (
                        <tr className="hover:bg-blue-50">
                          <td className="w-12 px-4 py-3"></td>
                          <td
                            colSpan={columns.length}
                            className="px-4 py-3 text-sm text-gray-500"
                          >
                            <button
                              onClick={() => handleAddItem(group.id)}
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add item</span>
                            </button>
                          </td>
                          <td className="w-12 px-4 py-3"></td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </SortableContext>
            </tbody>
          </table>
    );
  }
};