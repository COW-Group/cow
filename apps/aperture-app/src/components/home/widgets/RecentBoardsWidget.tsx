import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface BoardItem {
  id: string;
  name: string;
  description: string;
  color: string;
  lastVisited: Date;
  isStarred: boolean;
  itemCount: number;
  collaborators?: number;
}

interface RecentBoardsWidgetProps {
  title?: string;
  boards?: BoardItem[];
  maxItems?: number;
  layout?: 'grid' | 'list';
}

const DEFAULT_BOARDS: BoardItem[] = [
  {
    id: '1',
    name: 'Sales Pipeline',
    description: 'COW CRM - Sales Dashboard',
    color: 'bg-blue-500',
    lastVisited: new Date(Date.now() - 30 * 60 * 1000),
    isStarred: true,
    itemCount: 24,
    collaborators: 5,
  },
  {
    id: '2',
    name: 'Lead Management',
    description: 'COW CRM - Lead Tracking',
    color: 'bg-green-500',
    lastVisited: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isStarred: false,
    itemCount: 18,
    collaborators: 3,
  },
  {
    id: '3',
    name: 'Project Tasks',
    description: 'Development Workflow',
    color: 'bg-purple-500',
    lastVisited: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isStarred: true,
    itemCount: 32,
    collaborators: 8,
  },
];

export function RecentBoardsWidget({
  title = 'Recent Boards',
  boards = DEFAULT_BOARDS,
  maxItems = 6,
  layout = 'grid',
}: RecentBoardsWidgetProps) {
  const navigate = useNavigate();
  const displayBoards = boards.slice(0, maxItems);

  const formatLastVisited = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleBoardClick = (boardId: string) => {
    navigate(`/boards/${boardId}`);
  };

  const handleViewAllBoards = () => {
    navigate('/boards');
  };

  if (layout === 'list') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          {displayBoards.map((board, index) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleBoardClick(board.id)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 ${board.color} rounded-full mr-3`}></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{board.name}</h4>
                    {board.isStarred && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{board.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <span className="text-xs text-gray-500">{board.itemCount} items</span>
                  {board.collaborators && (
                    <>
                      <Users className="w-3 h-3 text-gray-400 ml-2" />
                      <span className="text-xs text-gray-500">{board.collaborators}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400">{formatLastVisited(board.lastVisited)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleViewAllBoards}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all boards
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {displayBoards.map((board, index) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleBoardClick(board.id)}
            className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 ${board.color} rounded-full`}></div>
                <h4 className="font-medium text-gray-900 text-sm">{board.name}</h4>
                {board.isStarred && (
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                )}
              </div>
              <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{board.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>{board.itemCount} items</span>
                {board.collaborators && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{board.collaborators}</span>
                  </div>
                )}
              </div>
              <span>{formatLastVisited(board.lastVisited)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleViewAllBoards}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all boards
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}