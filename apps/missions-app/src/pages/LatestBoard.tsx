import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useBoardStore } from '../store/board.store';

export function LatestBoard() {
  const { boards, fetchBoards } = useBoardStore();

  useEffect(() => {
    // Fetch boards if not already loaded
    if (boards.length === 0) {
      fetchBoards();
    }
  }, [boards.length, fetchBoards]);

  // Find the most recently updated board
  const latestBoard = boards
    .filter(board => board.updatedAt) // Only boards with update timestamps
    .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())[0];

  // If no boards exist yet, redirect to boards page to create one
  if (boards.length === 0) {
    return <Navigate to="/boards" replace />;
  }

  // If we have a latest board, redirect to it
  if (latestBoard) {
    return <Navigate to={`/boards/${latestBoard.id}`} replace />;
  }

  // Fallback: redirect to boards page
  return <Navigate to="/boards" replace />;
}