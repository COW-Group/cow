import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { Plus, ChevronDown, ChevronRight, Trash2, GripVertical, Table2, Columns3, Calendar, Clock, BarChart3, Search, Filter, X, Zap, Settings, Pin, PinOff, MessageSquare, Check, Minus, Copy, Archive, Move } from 'lucide-react';
import { EnhancedEditableCell } from './EnhancedEditableCell';
import { KanbanView } from '../boards/views/KanbanView';

// Types - Compatible with your existing FlexiBoard types
interface BoardColumn {
  id: string;
  name: string;
  type: 'text' | 'status' | 'person' | 'assignee' | 'date' | 'number' | 'numbers' | 'checkbox' | 'dropdown' | 'auto-number' | 'item-id' | 'progress' | 'timeline' | 'files' | 'connect-boards' | 'mirror';
  width: string;
  position: number;
  options?: { id: string; label: string; color: string }[];
  autoNumberScope?: 'board' | 'group'; // For auto-number columns
  isPinned?: boolean; // For column pinning
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

interface BoardView {
  id: string;
  name: string;
  isDefault?: boolean;
  config: {
    groupByColumn?: string | null;
    groupBySorting?: 'asc' | 'desc';
    activeFilters?: { status?: string; person?: string };
    searchQuery?: string;
    viewType?: ViewType;
    hiddenColumns?: string[];
  };
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
      className={`backdrop-blur-md bg-black/10 group/header transition-colors ${
        isOver ? 'bg-black/20 ring-2 ring-blue-400/30 backdrop-blur-lg' : ''
      }`}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 12, // Higher than column headers
      }}
    >
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
            onClick={onToggle}
            className="flex items-center space-x-2 text-sm font-medium text-white hover:text-gray-200"
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
            <span className="text-gray-300">({itemCount})</span>
          </button>

          <div className="flex items-center space-x-2 opacity-0 group-hover/header:opacity-100 transition-all">
            <button
              onClick={onAddItem}
              className="text-gray-300 hover:text-blue-400"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onDeleteGroup}
              className="text-gray-300 hover:text-red-400"
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
  columnIndex: number;
  isPinned: boolean;
  onTogglePin: (columnId: string) => void;
  pinnedOffset: number;
}> = ({ column, columnIndex, isPinned, onTogglePin, pinnedOffset }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: isPinned // Disable dragging for pinned columns
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(isPinned && {
      position: 'sticky' as const,
      left: `${pinnedOffset}px`,
      zIndex: 10,
      backgroundColor: 'transparent',
    }),
  };

  return (
    <th
      ref={setNodeRef}
      style={{ ...style, width: column.width }}
      className={`group px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-black/15 backdrop-blur-sm ${
        isDragging ? 'z-50 backdrop-blur-md bg-black/20' : ''
      } ${isPinned ? 'backdrop-blur-sm bg-black/15 border-r border-white/20 shadow-lg' : ''}`}
      {...(isPinned ? {} : attributes)}
      {...(isPinned ? {} : listeners)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{column.name}</span>
          {!isPinned && <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
        <button
          onClick={() => onTogglePin(column.id)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded hover:bg-black/20 backdrop-blur-sm ${
            isPinned ? 'text-blue-400' : 'text-gray-400'
          }`}
          title={isPinned ? 'Unpin column' : 'Pin column'}
        >
          {isPinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
        </button>
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
  pinnedColumns: string[];
  getPinnedOffset: (columnIndex: number, columns: BoardColumn[]) => number;
  isSelected: boolean;
  onToggleSelection: (itemId: string) => void;
}> = ({ item, columns, people, updateItemData, handleDeleteItem, groupColor, pinnedColumns, getPinnedOffset, isSelected, onToggleSelection }) => {
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
      className={`hover:bg-black/20 backdrop-blur-sm group ${isDragging ? 'z-50' : ''} ${isSelected ? 'bg-blue-500/30 backdrop-blur-sm' : ''}`}
    >
      <td className="w-12 px-4 py-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{ backgroundColor: groupColor }}
          ></div>
          <button
            onClick={() => onToggleSelection(item.id)}
            className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
          </button>
          <button
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
      {columns
        .sort((a, b) => a.position - b.position)
        .map((column, columnIndex) => {
          const isPinned = pinnedColumns.includes(column.id);
          const pinnedOffset = isPinned ? getPinnedOffset(columnIndex, columns) : 0;

          return (
            <td
              key={column.id}
              className={`px-4 py-1 ${isPinned ? 'backdrop-blur-sm bg-black/15 border-r border-white/20' : ''}`}
              style={{
                width: column.width,
                ...(isPinned && {
                  position: 'sticky',
                  left: `${pinnedOffset}px`,
                  zIndex: 8,
                  backgroundColor: 'transparent',
                }),
              }}
            >
              {column.id === 'col-1' ? (
                // Special Monday.com-style item name cell with update button
                <div className="flex items-center space-x-2 min-h-8">
                  <div className="flex-1">
                    <EnhancedEditableCell
                      column={column}
                      value={item.data[column.id]}
                      onSave={(value) => updateItemData(item.id, column.id, value)}
                      people={people}
                    />
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-blue-500/20 backdrop-blur-sm text-gray-300 hover:text-blue-400 transition-all"
                    title="Add update"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <EnhancedEditableCell
                  column={column}
                  value={item.data[column.id]}
                  onSave={(value) => updateItemData(item.id, column.id, value)}
                  people={people}
                />
              )}
            </td>
          );
        })}
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

// Main Board Component
interface BoardProps {
  // You can keep your existing board prop interface or adapt this
  boardData?: any;
  onUpdate?: (data: any) => void;
}

export const Board: React.FC<BoardProps> = ({
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
    { id: 'col-1', name: 'Item', type: 'text', width: '250px', position: 0, isPinned: true },
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
  const [pinnedColumns, setPinnedColumns] = useState<string[]>(['col-1']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [groupByColumn, setGroupByColumn] = useState<string | null>(null);
  const [groupBySorting, setGroupBySorting] = useState<'asc' | 'desc'>('asc');
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
  const [savedViews, setSavedViews] = useState<BoardView[]>([
    { id: 'default', name: 'Main Table', isDefault: true, config: {} }
  ]);
  const [activeView, setActiveView] = useState<string>('default');
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [showViewsDropdown, setShowViewsDropdown] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);

  const people: Person[] = [
    { id: 'person-1', name: 'John Doe', color: '#0073ea' },
    { id: 'person-2', name: 'Jane Smith', color: '#00c875' },
  ];

  // Column pinning utility functions
  const toggleColumnPin = (columnId: string) => {
    setPinnedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );

    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, isPinned: !col.isPinned }
        : col
    ));
  };

  const getPinnedOffset = (columnIndex: number, columns: BoardColumn[]) => {
    let offset = 0;
    const sortedColumns = columns.sort((a, b) => a.position - b.position);

    for (let i = 0; i < columnIndex; i++) {
      if (sortedColumns[i]?.isPinned) {
        offset += parseInt(sortedColumns[i].width.replace('px', '')) || 150;
      }
    }
    return offset;
  };

  const pinnedColumnsWidth = columns
    .filter(col => col.isPinned)
    .reduce((total, col) => total + (parseInt(col.width.replace('px', '')) || 150), 0);

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

  // Group By functionality - dynamically create groups based on selected column
  const dynamicGroups = useMemo(() => {
    if (!groupByColumn) {
      return groups; // Use original groups if no grouping is applied
    }

    // Create groups based on column values
    const groupMap = new Map<string, BoardItem[]>();

    filteredItems.forEach(item => {
      const value = item.data[groupByColumn];
      const groupKey = value || 'Empty'; // Handle empty values

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, []);
      }
      groupMap.get(groupKey)!.push(item);
    });

    // Convert to group structure
    const newGroups: BoardGroup[] = [];
    const sortedGroupKeys = Array.from(groupMap.keys()).sort((a, b) => {
      if (groupBySorting === 'desc') {
        return b.localeCompare(a);
      }
      return a.localeCompare(b);
    });

    sortedGroupKeys.forEach((groupKey, index) => {
      const groupItems = groupMap.get(groupKey)!;
      const selectedColumn = columns.find(col => col.id === groupByColumn);

      // Generate color based on group key
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
      const color = colors[index % colors.length];

      newGroups.push({
        id: `dynamic-group-${groupKey}`,
        name: selectedColumn?.type === 'status'
          ? (selectedColumn.options?.find(opt => opt.id === groupKey)?.label || groupKey)
          : selectedColumn?.type === 'person'
          ? (people.find(p => p.id === groupKey)?.name || 'Unassigned')
          : String(groupKey),
        color,
        position: index,
        collapsed: false
      });
    });

    return newGroups;
  }, [groupByColumn, filteredItems, groups, columns, people, groupBySorting]);

  // Update items to use dynamic groups
  const processedItems = useMemo(() => {
    if (!groupByColumn) {
      return filteredItems; // Use original items if no grouping
    }

    return filteredItems.map(item => {
      const value = item.data[groupByColumn];
      const groupKey = value || 'Empty';
      return {
        ...item,
        groupId: `dynamic-group-${groupKey}`
      };
    });
  }, [groupByColumn, filteredItems]);

  // View management functions
  const getCurrentViewConfig = () => ({
    groupByColumn,
    groupBySorting,
    activeFilters,
    searchQuery,
    viewType: currentView,
    hiddenColumns: [] // We can add hidden columns functionality later
  });

  const applyViewConfig = (config: BoardView['config']) => {
    if (config.groupByColumn !== undefined) setGroupByColumn(config.groupByColumn);
    if (config.groupBySorting) setGroupBySorting(config.groupBySorting);
    if (config.activeFilters) setActiveFilters(config.activeFilters);
    if (config.searchQuery !== undefined) setSearchQuery(config.searchQuery);
    if (config.viewType) setCurrentView(config.viewType);
  };

  const saveCurrentView = (name: string) => {
    const viewConfig = getCurrentViewConfig();
    const newView: BoardView = {
      id: `view-${Date.now()}`,
      name,
      config: viewConfig
    };

    setSavedViews(prev => [...prev, newView]);
    setActiveView(newView.id);
    setShowSaveViewModal(false);
  };

  const loadView = (viewId: string) => {
    const view = savedViews.find(v => v.id === viewId);
    if (view) {
      applyViewConfig(view.config);
      setActiveView(viewId);
    }
  };

  const deleteView = (viewId: string) => {
    if (viewId === 'default') return; // Can't delete default view

    setSavedViews(prev => prev.filter(v => v.id !== viewId));
    if (activeView === viewId) {
      setActiveView('default');
      loadView('default');
    }
  };

  // Group summary calculations
  const calculateGroupSummaries = (groupItems: BoardItem[], columns: BoardColumn[]) => {
    const summaries: Record<string, any> = {};

    columns.forEach(column => {
      if (column.type === 'number') {
        const numericValues = groupItems
          .map(item => parseFloat(item.data[column.id]))
          .filter(val => !isNaN(val));

        if (numericValues.length > 0) {
          summaries[column.id] = {
            sum: numericValues.reduce((acc, val) => acc + val, 0),
            average: numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length,
            min: Math.min(...numericValues),
            max: Math.max(...numericValues),
            count: numericValues.length
          };
        }
      } else if (column.type === 'text' || column.type === 'status' || column.type === 'person') {
        // For non-numeric columns, just show count
        summaries[column.id] = {
          count: groupItems.filter(item => item.data[column.id] && item.data[column.id] !== '').length
        };
      }
    });

    return summaries;
  };

  // Selection utility functions
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(processedItems.map(item => item.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const isAllSelected = selectedItems.length === processedItems.length && processedItems.length > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < processedItems.length;

  // Bulk action functions
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
      setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleBulkDuplicate = () => {
    const itemsToDuplicate = items.filter(item => selectedItems.includes(item.id));
    const newItems = itemsToDuplicate.map(item => ({
      ...item,
      id: `item-${Date.now()}-${Math.random()}`,
      data: { ...item.data, [columns[0]?.id]: `${item.data[columns[0]?.id]} (Copy)` },
    }));
    setItems(prev => [...prev, ...newItems]);
    setSelectedItems([]);
  };

  const handleBulkArchive = () => {
    console.log('Archive items:', selectedItems);
    // Implement archive functionality
    setSelectedItems([]);
  };

  // Show bulk actions when items are selected
  React.useEffect(() => {
    setShowBulkActions(selectedItems.length > 0);
  }, [selectedItems]);

  // Keyboard shortcuts for selection
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A / Cmd+A - Select all
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        selectAllItems();
      }

      // Delete - Delete selected items
      if (event.key === 'Delete' && selectedItems.length > 0) {
        event.preventDefault();
        handleBulkDelete();
      }

      // Escape - Clear selection
      if (event.key === 'Escape' && selectedItems.length > 0) {
        event.preventDefault();
        deselectAllItems();
      }

      // Ctrl+D / Cmd+D - Duplicate selected items
      if ((event.ctrlKey || event.metaKey) && event.key === 'd' && selectedItems.length > 0) {
        event.preventDefault();
        handleBulkDuplicate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, handleBulkDelete, handleBulkDuplicate, selectAllItems, deselectAllItems]);

  // Close Group By dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showGroupByDropdown) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowGroupByDropdown(false);
        }
      }
    };

    if (showGroupByDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showGroupByDropdown]);

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

  const handleAddColumn = (columnData: { name: string; type: BoardColumn['type'] }) => {
    const newColumn: BoardColumn = {
      id: `col-${Date.now()}`,
      name: columnData.name,
      type: columnData.type,
      width: '180px',
      position: columns.length,
      ...(columnData.type === 'status' && {
        options: [
          { id: 'option-1', label: 'Not Started', color: '#c4c4c4' },
          { id: 'option-2', label: 'Working on it', color: '#fdab3d' },
          { id: 'option-3', label: 'Done', color: '#00c875' }
        ]
      })
    };
    setColumns(prev => [...prev, newColumn]);
    setShowAddColumnModal(false);
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

  // Add Column Modal
  const AddColumnModal = () => {
    const [columnName, setColumnName] = useState('');
    const [selectedType, setSelectedType] = useState<BoardColumn['type']>('text');

    const columnTypes = [
      { type: 'text' as const, label: 'Text', icon: '📝', description: 'Any text' },
      { type: 'status' as const, label: 'Status', icon: '🎯', description: 'Status labels with colors' },
      { type: 'person' as const, label: 'Person', icon: '👤', description: 'Assign people' },
      { type: 'date' as const, label: 'Date', icon: '📅', description: 'Date picker' },
      { type: 'number' as const, label: 'Number', icon: '🔢', description: 'Numbers and calculations' },
      { type: 'checkbox' as const, label: 'Checkbox', icon: '☑️', description: 'Done/not done' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!columnName.trim()) return;

      handleAddColumn({ name: columnName, type: selectedType });
      setColumnName('');
      setSelectedType('text');
    };

    if (!showAddColumnModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="backdrop-blur-xl bg-black/20 border border-white/20 shadow-2xl shadow-black/30 rounded-2xl p-6 w-96 max-h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Add Column</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Column Name</label>
              <input
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter column name"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Column Type</label>
              <div className="grid grid-cols-2 gap-2">
                {columnTypes.map(({ type, label, icon, description }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span>{icon}</span>
                      <span className="font-medium text-sm">{label}</span>
                    </div>
                    <div className="text-xs text-gray-500">{description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddColumnModal(false)}
                className="px-4 py-2 text-gray-300 hover:bg-black/20 backdrop-blur-sm rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!columnName.trim()}
              >
                Add Column
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
            <h1 className="text-2xl font-semibold text-white">Enhanced Board</h1>
            <p className="text-gray-300 mt-1">Drag & drop enabled Monday.com board</p>
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
              onClick={() => groups.length > 0 && handleAddItem(groups[0].id)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Item</span>
            </button>
            <button
              onClick={() => setShowSaveViewModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-green-400/30 backdrop-blur-md bg-black/10 text-green-300 rounded-md hover:bg-black/20"
            >
              <Settings className="w-4 h-4" />
              <span>Save as New View</span>
            </button>
            <button
              onClick={() => setShowAutomation(!showAutomation)}
              className="flex items-center space-x-2 px-4 py-2 border border-white/20 backdrop-blur-md bg-black/10 text-white rounded-md hover:bg-black/20"
            >
              <Zap className="w-4 h-4" />
              <span>Automate</span>
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
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'timeline'
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setCurrentView('gantt')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'gantt'
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gantt</span>
            </button>
          </div>
          <div className="text-sm text-gray-400">
            {processedItems.length} of {items.length} items across {dynamicGroups.length} groups
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {showBulkActions && (
          <div className="flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/10 border-b border-blue-400/20">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-200">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDuplicate}
                  className="flex items-center space-x-1 px-3 py-1.5 backdrop-blur-md bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-md hover:bg-blue-500/30 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center space-x-1 px-3 py-1.5 backdrop-blur-md bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-md hover:bg-blue-500/30 text-sm"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-1 px-3 py-1.5 backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-300 rounded-md hover:bg-red-500/30 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            <button
              onClick={deselectAllItems}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <X className="w-4 h-4" />
              <span>Clear selection</span>
            </button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/5 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-white/20 backdrop-blur-md bg-black/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                showFilters || hasActiveFilters
                  ? 'backdrop-blur-md bg-blue-500/20 text-blue-300 border border-blue-400/30'
                  : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm border border-white/20'
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

            {/* Group By Button */}
            <div className="relative">
              <button
                onClick={() => setShowGroupByDropdown(!showGroupByDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  groupByColumn
                    ? 'backdrop-blur-md bg-green-500/20 text-green-300 border border-green-400/30'
                    : 'text-gray-300 hover:bg-black/15 backdrop-blur-sm border border-white/20'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Group by</span>
                {groupByColumn && (
                  <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {columns.find(col => col.id === groupByColumn)?.name}
                  </span>
                )}
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Group By Dropdown */}
              {showGroupByDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 backdrop-blur-xl bg-black/20 border border-white/20 rounded-md shadow-2xl shadow-black/30 z-50">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2">GROUP BY COLUMN</div>
                    <div className="space-y-1">
                      {columns.map((column) => (
                        <button
                          key={column.id}
                          onClick={() => {
                            setGroupByColumn(groupByColumn === column.id ? null : column.id);
                            setShowGroupByDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-2 py-1 text-sm text-left rounded hover:bg-black/20 backdrop-blur-sm ${
                            groupByColumn === column.id ? 'backdrop-blur-md bg-green-500/20 text-green-300' : 'text-gray-300'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-gray-500/60"></div>
                          <span>{column.name}</span>
                          {groupByColumn === column.id && <Check className="w-3 h-3 ml-auto text-green-600" />}
                        </button>
                      ))}
                    </div>

                    {groupByColumn && (
                      <>
                        <div className="border-t mt-2 pt-2">
                          <div className="text-xs font-medium text-gray-500 mb-2">SORTING</div>
                          <div className="space-y-1">
                            <button
                              onClick={() => setGroupBySorting('asc')}
                              className={`w-full flex items-center space-x-2 px-2 py-1 text-sm text-left rounded hover:bg-black/20 backdrop-blur-sm ${
                                groupBySorting === 'asc' ? 'backdrop-blur-md bg-green-500/20 text-green-300' : 'text-gray-300'
                              }`}
                            >
                              <span>A-Z (ascending)</span>
                              {groupBySorting === 'asc' && <Check className="w-3 h-3 ml-auto text-green-600" />}
                            </button>
                            <button
                              onClick={() => setGroupBySorting('desc')}
                              className={`w-full flex items-center space-x-2 px-2 py-1 text-sm text-left rounded hover:bg-black/20 backdrop-blur-sm ${
                                groupBySorting === 'desc' ? 'backdrop-blur-md bg-green-500/20 text-green-300' : 'text-gray-300'
                              }`}
                            >
                              <span>Z-A (descending)</span>
                              {groupBySorting === 'desc' && <Check className="w-3 h-3 ml-auto text-green-600" />}
                            </button>
                          </div>
                        </div>

                        <div className="border-t mt-2 pt-2">
                          <button
                            onClick={() => {
                              setGroupByColumn(null);
                              setShowGroupByDropdown(false);
                            }}
                            className="w-full flex items-center space-x-2 px-2 py-1 text-sm text-left rounded hover:bg-red-50 text-red-600"
                          >
                            <X className="w-3 h-3" />
                            <span>Clear grouping</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

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
          <div className="px-6 py-4 backdrop-blur-md bg-black/5 border-b border-white/10">
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={activeFilters.status || ''}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                  className="px-3 py-2 border border-white/20 backdrop-blur-md bg-black/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Assignee</label>
                <select
                  value={activeFilters.person || ''}
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, person: e.target.value || undefined }))}
                  className="px-3 py-2 border border-white/20 backdrop-blur-md bg-black/10 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
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
          <div className="px-6 py-4 backdrop-blur-md bg-black/10 border-b border-white/10">
            <div className="flex items-start space-x-4">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-2">Automation Center</h3>
                <div className="space-y-3">
                  <div className="backdrop-blur-md bg-black/20 rounded-lg p-3 border border-purple-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Auto-assign on status change</h4>
                        <p className="text-xs text-gray-400">When status changes to "Working on it", assign to John Doe</p>
                      </div>
                      <button className="text-xs backdrop-blur-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        Set up
                      </button>
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-black/20 rounded-lg p-3 border border-blue-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Notify when due date approaches</h4>
                        <p className="text-xs text-gray-400">Send email notification 1 day before due date</p>
                      </div>
                      <button className="text-xs backdrop-blur-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        Set up
                      </button>
                    </div>
                  </div>
                  <div className="backdrop-blur-md bg-black/20 rounded-lg p-3 border border-green-400/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Archive completed items</h4>
                        <p className="text-xs text-gray-400">Move items to archive 7 days after completion</p>
                      </div>
                      <button className="text-xs backdrop-blur-sm bg-green-500/20 text-green-300 px-2 py-1 rounded">
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
            <div className="h-full overflow-x-auto">
              <div style={{ minWidth: `${pinnedColumnsWidth + 800}px` }}>
                {renderTableView()}
              </div>
            </div>
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

      {/* Add Column Modal */}
      <AddColumnModal />
    </DndContext>
  );

  function renderTableView() {
    return (
      <table className="w-full bg-transparent">

        {/* Table Body */}
        <tbody className="backdrop-blur-sm divide-y divide-white/10">
          <SortableContext
            items={processedItems.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {dynamicGroups.map((group) => {
              const groupItems = processedItems
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

                  {/* Column Headers for this group */}
                  {!isCollapsed && (
                    <tr className="backdrop-blur-sm border-b border-white/20 sticky bg-transparent" style={{ top: '60px', zIndex: 10 }}>
                      <th className="w-12 px-4 py-3">
                        <button
                          onClick={isAllSelected ? deselectAllItems : selectAllItems}
                          className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                            isAllSelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : isPartiallySelected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                          title={isAllSelected ? 'Deselect all' : 'Select all'}
                        >
                          {isAllSelected ? (
                            <Check className="w-3 h-3" />
                          ) : isPartiallySelected ? (
                            <Minus className="w-3 h-3" />
                          ) : null}
                        </button>
                      </th>
                      <SortableContext
                        items={columns.filter(col => !col.isPinned).map(col => col.id)}
                        strategy={horizontalListSortingStrategy}
                      >
                        {columns
                          .sort((a, b) => a.position - b.position)
                          .map((column, columnIndex) => (
                            <DraggableColumnHeader
                              key={column.id}
                              column={column}
                              columnIndex={columnIndex}
                              isPinned={pinnedColumns.includes(column.id)}
                              onTogglePin={toggleColumnPin}
                              pinnedOffset={pinnedColumns.includes(column.id) ? getPinnedOffset(columnIndex, columns) : 0}
                            />
                          ))}
                      </SortableContext>
                      <th className="w-12 px-4 py-3">
                        <button
                          onClick={() => setShowAddColumnModal(true)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-black/20 backdrop-blur-sm rounded transition-colors"
                          title="Add column"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </th>
                    </tr>
                  )}

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
                          pinnedColumns={pinnedColumns}
                          getPinnedOffset={getPinnedOffset}
                          isSelected={selectedItems.includes(item.id)}
                          onToggleSelection={toggleItemSelection}
                        />
                      ))}
                    </>
                  )}

                  {/* Group Summary Row */}
                  {!isCollapsed && groupItems.length > 0 && (
                    <tr className="backdrop-blur-sm border-t-2 border-white/20 font-medium text-sm bg-transparent">
                      <td className="w-12 px-4 py-2"></td>
                      {columns
                        .sort((a, b) => a.position - b.position)
                        .map((column, columnIndex) => {
                          const summaries = calculateGroupSummaries(groupItems, [column]);
                          const summary = summaries[column.id];

                          return (
                            <td
                              key={column.id}
                              className="px-4 py-2 text-white"
                              style={{
                                width: column.width,
                                position: pinnedColumns.includes(column.id) ? 'sticky' : undefined,
                                left: pinnedColumns.includes(column.id) ? getPinnedOffset(columnIndex, columns) : undefined,
                                zIndex: pinnedColumns.includes(column.id) ? 8 : undefined,
                                backgroundColor: pinnedColumns.includes(column.id) ? '#f9fafb' : undefined,
                              }}
                            >
                              {columnIndex === 0 ? (
                                <span className="text-gray-200 font-semibold">
                                  Σ {groupItems.length} items
                                </span>
                              ) : column.type === 'number' && summary?.sum !== undefined ? (
                                <div className="flex items-center justify-between">
                                  <span className="text-blue-400 font-semibold">
                                    Σ {summary.sum.toFixed(2)}
                                  </span>
                                  <div className="text-xs text-gray-300">
                                    avg: {summary.average.toFixed(1)}
                                  </div>
                                </div>
                              ) : summary?.count > 0 ? (
                                <span className="text-gray-300 text-xs">
                                  {summary.count} filled
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          );
                        })}
                      <td className="w-12 px-4 py-2"></td>
                    </tr>
                  )}

                  {/* Add Item Row */}
                  {!isCollapsed && (
                    <tr className="hover:bg-blue-500/20 backdrop-blur-sm">
                      <td className="w-12 px-4 py-3"></td>
                      <td
                        className="px-4 py-3 text-sm text-gray-500"
                        style={{
                          width: '250px',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'transparent',
                          zIndex: 8,
                        }}
                      >
                        <button
                          onClick={() => handleAddItem(group.id)}
                          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add item</span>
                        </button>
                      </td>
                      {columns.filter(col => col.id !== 'col-1').map(col => (
                        <td key={col.id} style={{ width: col.width }}></td>
                      ))}
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

