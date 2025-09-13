import React, { useState, useRef, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter,
  Calendar,
  ChevronDown,
  Edit2,
  Check,
  X,
  Search
} from 'lucide-react';
import { useGoalsStore, Goal } from '../../store/goals.store';

interface StrategyMapProps {
  className?: string;
}

export function StrategyMap({ className = '' }: StrategyMapProps) {
  const { 
    goals, 
    filters, 
    setFilters, 
    updateGoalPosition 
  } = useGoalsStore();

  const [zoom, setZoom] = useState(100);
  const [mission, setMission] = useState({
    title: 'MyCow\'s Mission',
    description: 'MyCow\'s mission is to shape a sustainable, equitable, and inclusive future through innovative investments such as tokenized real world assets, crowdsourcing,...'
  });
  const [isEditingMission, setIsEditingMission] = useState(false);
  const [highlightedGoals, setHighlightedGoals] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedGoal, setDraggedGoal] = useState<string | null>(null);

  const timeFilters = ['All Time', 'This Quarter', 'This Half-Year', 'This Year', 'Next Quarter'];
  const statusFilters = ['All Statuses', 'On track', 'No recent updates', 'At risk', 'Off track', 'Completed'];
  const ownerFilters = ['All Owners', ...Array.from(new Set(goals.map(g => g.owner)))];
  const categoryFilters = ['All Categories', ...Array.from(new Set(goals.map(g => g.category)))];

  // Filter goals based on store criteria and only show goals with positions (for strategy map)
  const filteredGoals = goals.filter(goal => {
    if (!goal.position) return false; // Only show goals with positions on strategy map
    
    const matchesTime = filters.timeline === 'All Time' || goal.timeline.includes(filters.timeline.replace('This ', '').replace('Next ', ''));
    const matchesStatus = filters.status === 'All Statuses' || getStatusLabel(goal.status) === filters.status;
    const matchesOwner = filters.owner === 'All Owners' || goal.owner === filters.owner;
    const matchesCategory = filters.category === 'All Categories' || goal.category === filters.category;
    const matchesSearch = filters.search === '' || 
      goal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      goal.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesTime && matchesStatus && matchesOwner && matchesCategory && matchesSearch;
  });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      setZoom(prev => Math.max(50, Math.min(200, prev + delta)));
    }
  };

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'off-track': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'no-recent-updates': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Goal['status']) => {
    switch (status) {
      case 'on-track': return 'On track';
      case 'at-risk': return 'At risk';
      case 'off-track': return 'Off track';
      case 'completed': return 'Completed';
      case 'no-recent-updates': return 'No recent updates';
      default: return 'Unknown';
    }
  };

  const saveMission = () => {
    setIsEditingMission(false);
  };

  const cancelMissionEdit = () => {
    setIsEditingMission(false);
  };

  const handleGoalMouseDown = (e: React.MouseEvent, goalId: string) => {
    e.preventDefault();
    setIsDragging(true);
    setDraggedGoal(goalId);
    
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect) {
        const scaleFactor = zoom / 100;
        setDragOffset({
          x: (e.clientX - rect.left) / scaleFactor - goal.position.x,
          y: (e.clientY - rect.top) / scaleFactor - goal.position.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && draggedGoal) {
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect) {
        const scaleFactor = zoom / 100;
        const newX = (e.clientX - rect.left) / scaleFactor - dragOffset.x;
        const newY = (e.clientY - rect.top) / scaleFactor - dragOffset.y;
        
        // Constrain to canvas bounds
        const constrainedX = Math.max(0, Math.min(newX, 1200));
        const constrainedY = Math.max(0, Math.min(newY, 500));
        
        updateGoalPosition(draggedGoal, { x: constrainedX, y: constrainedY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedGoal(null);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Strategy Map Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Strategy Map
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search goals..."
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-9 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Status Filter */}
            <select 
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>

            {/* Owner Filter */}
            <select 
              value={filters.owner}
              onChange={(e) => setFilters({ owner: e.target.value })}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {ownerFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select 
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryFilters.map(filter => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>

            {/* Time Filter */}
            <div className="relative">
              <select 
                value={filters.timeline}
                onChange={(e) => setFilters({ timeline: e.target.value })}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeFilters.map(filter => (
                  <option key={filter} value={filter}>{filter}</option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="px-2 text-sm text-gray-600 dark:text-gray-400 border-x border-gray-300 dark:border-gray-600">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Map Canvas */}
      <div 
        ref={mapRef}
        className="relative h-[600px] overflow-hidden bg-gray-50 dark:bg-gray-800 cursor-default"
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute inset-0 origin-top-left transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Company Mission */}
          <div className="absolute top-4 left-4 max-w-xs">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                {isEditingMission ? (
                  <input
                    type="text"
                    value={mission.title}
                    onChange={(e) => setMission(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-bold bg-transparent border-none outline-none text-blue-900 dark:text-blue-100"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {mission.title}
                  </h3>
                )}
                <div className="flex items-center gap-1">
                  {isEditingMission ? (
                    <>
                      <button
                        onClick={saveMission}
                        className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={cancelMissionEdit}
                        className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingMission(true)}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                    >
                      <Edit2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  )}
                </div>
              </div>
              {isEditingMission ? (
                <textarea
                  value={mission.description}
                  onChange={(e) => setMission(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-sm bg-transparent border-none outline-none text-blue-700 dark:text-blue-200 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  {mission.description}
                </p>
              )}
            </div>
          </div>

          {/* Goals Visualization */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Curved Connection Lines */}
            {filteredGoals.map(goal => 
              goal.connections.map(connectionId => {
                const targetGoal = filteredGoals.find(g => g.id === connectionId);
                if (!targetGoal) return null;
                
                const startX = goal.position.x + 150;
                const startY = goal.position.y + 40;
                const endX = targetGoal.position.x + 75;
                const endY = targetGoal.position.y + 40;
                
                // Create curved path
                const midX = (startX + endX) / 2;
                const midY = Math.min(startY, endY) - 30;
                const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
                
                return (
                  <path
                    key={`${goal.id}-${connectionId}`}
                    d={pathData}
                    stroke="#6b7280"
                    strokeWidth="2"
                    fill="none"
                    className="dark:stroke-gray-500"
                  />
                );
              })
            )}
          </svg>

          {/* Goal Cards */}
          {filteredGoals.map(goal => (
            <div
              key={goal.id}
              className={`absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move select-none ${
                draggedGoal === goal.id ? 'shadow-lg scale-105 z-10' : ''
              }`}
              style={{ 
                left: goal.position.x, 
                top: goal.position.y,
                width: '200px'
              }}
              onMouseDown={(e) => handleGoalMouseDown(e, goal.id)}
            >
              {/* Goal Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">G</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Goal</span>
              </div>

              {/* Goal Title */}
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 line-clamp-3 leading-tight">
                {goal.title}
              </h4>

              {/* Progress and Subgoals */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(goal.status)}`} />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {goal.progress}%
                  </span>
                </div>
                {goal.subGoals.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.subGoals.length} subgoal{goal.subGoals.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  goal.status === 'on-track' 
                    ? 'bg-green-100 text-green-800' 
                    : goal.status === 'no-recent-updates'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getStatusLabel(goal.status)}
                </span>
              </div>

              {/* Timeline and Owner */}
              <div className="flex items-center justify-between text-xs">
                {goal.timeline && (
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {goal.timeline}
                  </span>
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {goal.owner}
                </span>
              </div>
            </div>
          ))}

          {/* Add Goal Button */}
          <button 
            className="absolute top-20 right-4 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            title="Add New Goal"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}