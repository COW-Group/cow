import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Board } from '../components/board/Board';

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  if (!boardId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Board ID not found</p>
          <button
            onClick={() => navigate('/app/my-office')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to My Office
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back navigation */}
      <div className="backdrop-blur-md bg-black/10 border-b border-white/20 px-6 py-2">
        <button
          onClick={() => navigate('/app/my-office')}
          className="flex items-center text-white hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Office
        </button>
      </div>

      {/* Our consolidated Board component */}
      <Board boardData={{ boardId }} />
    </div>
  );
}