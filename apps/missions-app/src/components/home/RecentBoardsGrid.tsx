import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, BarChart3 } from 'lucide-react';
import { BoardPreview } from '../../types/home.types';

interface RecentBoardsGridProps {
  boards: BoardPreview[];
}

export function RecentBoardsGrid({ boards }: RecentBoardsGridProps) {
  const formatLastVisited = (date: Date) => {
    try {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-black dark:text-white">
          Recently visited
        </h3>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>

      {boards.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent boards
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {boards.slice(0, 6).map((board) => (
              <Link
                key={board.id}
                to={`/boards/${board.slug}`}
                className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-black dark:text-white mb-1">
                      {board.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {board.description || 'COW CRM'}
                    </p>
                  </div>
                  <button
                    className={`p-1 rounded ${
                      board.isStarred 
                        ? 'text-yellow-500' 
                        : 'text-gray-400 hover:text-yellow-500'
                    } transition-colors`}
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle star toggle
                    }}
                  >
                    <Star className={`h-4 w-4 ${board.isStarred ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Mini preview placeholder */}
                <div className="bg-gray-200 dark:bg-gray-600 rounded h-16 mb-3 flex items-center justify-center">
                  <div className={`w-8 h-8 rounded-full ${board.color} flex items-center justify-center`}>
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {board.itemCount} items
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatLastVisited(board.lastVisited)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link 
            to="/boards"
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Show all boards
          </Link>
        </>
      )}
    </div>
  );
}