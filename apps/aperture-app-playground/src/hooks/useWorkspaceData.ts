import { useState, useCallback } from 'react';
import { sampleData } from '../data/sampleData';
import { generateBoardId, generateGroupId, generateColumnId } from '../utils/idGenerator';
import { Board, BoardColumn, BoardGroup } from '../types/board.types';

export const useWorkspaceData = () => {
  const [workspaces, setWorkspaces] = useState(() => sampleData.workspaces);

  const addBoard = useCallback((workspaceId: string, name: string, description?: string) => {
    const boardId = generateBoardId();

    const newBoard: Board = {
      id: boardId,
      name,
      description,
      workspaceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create default columns for new board
    const defaultColumns: BoardColumn[] = [
      {
        id: generateColumnId(),
        boardId,
        name: 'Item',
        type: 'text',
        width: '250px',
        position: 0,
      },
      {
        id: generateColumnId(),
        boardId,
        name: 'Status',
        type: 'status',
        width: '150px',
        position: 1,
        options: [
          { id: '1', label: 'Not Started', color: '#c4c4c4' },
          { id: '2', label: 'Working on it', color: '#fdab3d' },
          { id: '3', label: 'Done', color: '#00c875' },
        ],
      },
      {
        id: generateColumnId(),
        boardId,
        name: 'Person',
        type: 'person',
        width: '150px',
        position: 2,
      },
      {
        id: generateColumnId(),
        boardId,
        name: 'Due Date',
        type: 'date',
        width: '150px',
        position: 3,
      },
    ];

    // Create default group for new board
    const defaultGroup: BoardGroup = {
      id: generateGroupId(),
      boardId,
      name: 'New Group',
      color: '#0073ea',
      position: 0,
      collapsed: false,
    };

    setWorkspaces(prevWorkspaces =>
      prevWorkspaces.map(workspace =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: [...workspace.boards, {
                id: newBoard.id,
                name: newBoard.name,
                color: '#0073ea', // Default board color
                description: newBoard.description,
              }]
            }
          : workspace
      )
    );

    // Add to the main sampleData for board retrieval
    sampleData.boards.push(newBoard);
    sampleData.columns.push(...defaultColumns);
    sampleData.groups.push(defaultGroup);

    return newBoard;
  }, []);

  const deleteBoard = useCallback((boardId: string) => {
    // Remove from workspaces
    setWorkspaces(prevWorkspaces =>
      prevWorkspaces.map(workspace => ({
        ...workspace,
        boards: workspace.boards.filter(board => board.id !== boardId)
      }))
    );

    // Remove from sampleData
    const boardIndex = sampleData.boards.findIndex(board => board.id === boardId);
    if (boardIndex !== -1) {
      sampleData.boards.splice(boardIndex, 1);
    }

    // Remove related items first (before removing groups)
    const groupsToDelete = sampleData.groups.filter(group => group.boardId === boardId);
    const groupIdsToDelete = groupsToDelete.map(group => group.id);
    sampleData.items = sampleData.items.filter(item => !groupIdsToDelete.includes(item.groupId));

    // Remove related columns
    sampleData.columns = sampleData.columns.filter(column => column.boardId !== boardId);

    // Remove related groups
    sampleData.groups = sampleData.groups.filter(group => group.boardId !== boardId);
  }, []);

  return {
    workspaces,
    addBoard,
    deleteBoard,
  };
};