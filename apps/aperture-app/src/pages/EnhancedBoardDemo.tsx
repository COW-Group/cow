import React, { useState } from 'react';
import { Board } from '../components/board/Board';
import { CreateBoardModal } from '../components/modals/CreateBoardModal';

export function EnhancedBoardDemo() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boardData, setBoardData] = useState(null);

  const handleCreateBoard = async (data: any) => {
    console.log('Creating board with data:', data);
    setBoardData(data);
    setShowCreateModal(false);
  };

  const handleBoardUpdate = (updatedData: any) => {
    console.log('Board updated:', updatedData);
    setBoardData(updatedData);
  };

  return (
    <div className="min-h-screen">
      {/* Demo Header */}
      <div className="backdrop-blur-md bg-black/10 border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Enhanced Monday.com Board Demo</h1>
            <p className="text-gray-300 mt-1">
              Full drag & drop functionality integrated with your existing infrastructure
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 backdrop-blur-md bg-blue-500/30 border border-blue-400/40 text-blue-300 rounded-lg hover:bg-blue-500/40 transition-colors"
          >
            Create New Board
          </button>
        </div>
      </div>

      {/* Enhanced Board */}
      <div className="flex-1">
        <Board
          boardData={boardData}
          onUpdate={handleBoardUpdate}
        />
      </div>

      {/* Your existing Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
}