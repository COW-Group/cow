import React, { useState } from 'react';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardData } from '../../hooks/useBoardData';
import { EditableCell } from './EditableCell';
import { Plus, ChevronDown, ChevronRight, Trash2, MoreHorizontal, GripVertical } from 'lucide-react';
import { BoardItem, BoardColumn, BoardGroup } from '../../types/board.types';

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
    id: `group-${group.id}`, // Prefix to distinguish from items
  });

  return (
    <tr
      ref={setNodeRef}
      className={`bg-gray-25 group/header transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
      }`}
    >
      <td colSpan={100} className="px-4 py-3"> {/* Use large colSpan to cover all columns */}
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

// Draggable Item Component
const DraggableItem: React.FC<{
  item: BoardItem;
  columns: any[];
  people: any[];
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

export const BoardView: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!boardId) {
    return <div className="p-6 text-gray-500">Board not found</div>;
  }

  const {
    board,
    columns,
    groups,
    items,
    people,
    updateItemData,
    addItem,
    deleteItem,
    addGroup,
    updateGroup,
    deleteGroup,
    reorderColumns,
    reorderItems,
  } = useBoardData(boardId);

  if (!board) {
    return <div className="p-6 text-gray-500">Board not found</div>;
  }

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleAddItem = (groupId: string) => {
    addItem(groupId);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Delete this item?')) {
      deleteItem(itemId);
    }
  };

  const handleAddGroup = () => {
    const name = prompt('Group name:');
    if (name) {
      addGroup(name);
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Delete this group and all its items?')) {
      deleteGroup(groupId);
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
        reorderColumns(active.id as string, over.id as string);
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
              reorderItems(
                active.id as string,
                '', // No specific over item, will be handled in the function
                activeItem.groupId,
                targetGroupId
              );
            }
          } else {
            // Handle item-to-item dragging (within or across groups)
            const overItem = items.find(item => item.id === over.id);
            if (overItem) {
              reorderItems(
                active.id as string,
                over.id as string,
                activeItem.groupId,
                overItem.groupId
              );
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
    >
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{board.name}</h1>
          {board.description && (
            <p className="text-gray-500 mt-1">{board.description}</p>
          )}
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
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="w-12 px-4 py-3"></th> {/* Group toggle */}
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
              <th className="w-12 px-4 py-3"></th> {/* Actions */}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => {
              const groupItems = items
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
                    <SortableContext
                      items={groupItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
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
                    </SortableContext>
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
          </tbody>
        </table>
      </div>
      </div>
    </DndContext>
  );
};