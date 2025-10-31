import { useState, useCallback } from 'react';
import {
  Board,
  BoardGroup,
  BoardItem,
  BoardColumn,
  getBoardById,
  getColumnsByBoardId,
  getGroupsByBoardId,
  getItemsByBoardId,
  samplePeople
} from '../data/sampleData';

export const useBoardData = (boardId: string) => {
  const [board] = useState<Board | undefined>(() => getBoardById(boardId));
  const [columns, setColumns] = useState<BoardColumn[]>(() => getColumnsByBoardId(boardId));
  const [groups, setGroups] = useState<BoardGroup[]>(() => getGroupsByBoardId(boardId));
  const [items, setItems] = useState<BoardItem[]>(() => getItemsByBoardId(boardId));

  const updateItemData = useCallback((itemId: string, columnId: string, value: any) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              data: { ...item.data, [columnId]: value },
              updatedAt: new Date()
            }
          : item
      )
    );
  }, []);

  const addItem = useCallback((groupId: string, name: string = 'New Item') => {
    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      groupId,
      position: items.filter(item => item.groupId === groupId).length,
      data: {
        [columns[0]?.id]: name,
        // Set default values for other columns
        ...columns.slice(1).reduce((acc, col) => {
          switch (col.type) {
            case 'status':
              acc[col.id] = col.options?.[0]?.id || '1'; // Default to first status
              break;
            case 'person':
              acc[col.id] = ''; // Empty person
              break;
            case 'date':
              acc[col.id] = ''; // Empty date
              break;
            default:
              acc[col.id] = '';
          }
          return acc;
        }, {} as Record<string, any>)
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setItems(prevItems => [...prevItems, newItem]);
    return newItem;
  }, [items, columns]);

  const deleteItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const addGroup = useCallback((name: string = 'New Group') => {
    const colors = ['#0073ea', '#00c875', '#ff5e5b', '#fdab3d', '#579bfc'];
    const newGroup: BoardGroup = {
      id: `group-${Date.now()}`,
      boardId,
      name,
      color: colors[groups.length % colors.length],
      position: groups.length,
      collapsed: false,
    };

    setGroups(prevGroups => [...prevGroups, newGroup]);
    return newGroup;
  }, [boardId, groups]);

  const updateGroup = useCallback((groupId: string, updates: Partial<BoardGroup>) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    );
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    // Delete all items in the group first
    setItems(prevItems => prevItems.filter(item => item.groupId !== groupId));
    // Then delete the group
    setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
  }, []);

  const reorderColumns = useCallback((activeId: string, overId: string) => {
    setColumns(prevColumns => {
      const oldIndex = prevColumns.findIndex(col => col.id === activeId);
      const newIndex = prevColumns.findIndex(col => col.id === overId);

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
  }, []);

  const reorderItems = useCallback((
    activeId: string,
    overId: string,
    activeGroupId: string,
    overGroupId: string
  ) => {
    setItems(prevItems => {
      const activeIndex = prevItems.findIndex(item => item.id === activeId);

      if (activeIndex === -1) return prevItems;

      const newItems = [...prevItems];
      const [movedItem] = newItems.splice(activeIndex, 1);

      // If moving to a different group
      if (activeGroupId !== overGroupId) {
        movedItem.groupId = overGroupId;
      }

      // Handle different drop scenarios
      if (!overId || overId === '') {
        // Dropped on group header - add to end of target group
        const targetGroupItems = newItems.filter(item => item.groupId === overGroupId);
        movedItem.position = targetGroupItems.length;
        newItems.push(movedItem);
      } else {
        // Dropped on specific item
        const overIndex = newItems.findIndex(item => item.id === overId);
        if (overIndex === -1) {
          // If overId not found, add to end of target group
          const groupItems = newItems.filter(item => item.groupId === overGroupId);
          movedItem.position = groupItems.length;
          newItems.push(movedItem);
        } else {
          newItems.splice(overIndex, 0, movedItem);
        }
      }

      // Update positions for all items in affected groups
      const affectedGroups = [...new Set([activeGroupId, overGroupId])];
      affectedGroups.forEach(groupId => {
        const groupItems = newItems
          .filter(item => item.groupId === groupId)
          .sort((a, b) => {
            const aIndex = newItems.indexOf(a);
            const bIndex = newItems.indexOf(b);
            return aIndex - bIndex;
          });

        groupItems.forEach((item, index) => {
          item.position = index;
        });
      });

      return newItems;
    });
  }, []);

  return {
    board,
    columns,
    groups,
    items,
    updateItemData,
    addItem,
    deleteItem,
    addGroup,
    updateGroup,
    deleteGroup,
    reorderColumns,
    reorderItems,
    people: samplePeople,
  };
};