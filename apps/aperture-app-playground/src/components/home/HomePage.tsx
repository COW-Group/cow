import React from 'react';
import { Link } from 'react-router-dom';
import { sampleData } from '../../data/sampleData';
import { Circle, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Good morning! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Boards</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sampleData.workspaces.reduce((acc, w) => acc + w.boards.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Circle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Boards */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Boards</h2>
            <p className="text-gray-600 text-sm mt-1">Quick access to your most important boards</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleData.workspaces.flatMap(workspace =>
                workspace.boards.map(board => (
                  <Link
                    key={board.id}
                    to={`/board/${board.id}`}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Circle
                          className="w-4 h-4"
                          style={{ color: board.color }}
                          fill={board.color}
                        />
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                          {board.name}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>

                    {board.description && (
                      <p className="text-sm text-gray-500 mb-3">{board.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{workspace.name}</span>
                      <span>Updated {board.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};