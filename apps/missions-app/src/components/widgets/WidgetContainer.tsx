import React, { useState, useRef, useEffect } from 'react';
import { Widget } from '../../types/widgets.types';
import { Settings, X, Maximize2, Minimize2, Move, MoreVertical, MousePointer } from 'lucide-react';

interface WidgetContainerProps {
  widget: Widget;
  children: React.ReactNode;
  onRemove?: (widgetId: string) => void;
  onSettings?: (widgetId: string) => void;
  onResize?: (widgetId: string, newSize: { width: number; height: number }) => void;
  onMove?: (widgetId: string, newPosition: { x: number; y: number }) => void;
  isCustomizing?: boolean;
  className?: string;
  activeWidgets?: Widget[];
}

export function WidgetContainer({
  widget,
  children,
  onRemove,
  onSettings,
  onResize,
  onMove,
  isCustomizing = false,
  className = '',
  activeWidgets = []
}: WidgetContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [tentativePosition, setTentativePosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a position would cause overlap
  const wouldOverlap = (testX: number, testY: number): boolean => {
    return activeWidgets.some(w => {
      if (w.id === widget.id) return false; // Skip self

      const wRight = w.position.x + w.position.width;
      const wBottom = w.position.y + w.position.height;
      const testRight = testX + widget.position.width;
      const testBottom = testY + widget.position.height;

      return !(testRight <= w.position.x ||
               testX >= wRight ||
               testBottom <= w.position.y ||
               testY >= wBottom);
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCustomizing || e.target !== e.currentTarget) return;

    e.preventDefault();
    e.stopPropagation();

    // Calculate offset from widget's top-left corner
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragOffset) return;

    e.preventDefault();

    // Calculate pixel position
    const pixelX = e.clientX - dragOffset.x;
    const pixelY = e.clientY - dragOffset.y;

    // Convert to grid position with snapping
    const GRID_CELL_WIDTH = 216;
    const GRID_CELL_HEIGHT = 166;
    const GRID_COLS = 6;
    const GRID_ROWS = 8;

    let gridX = Math.round(pixelX / GRID_CELL_WIDTH);
    let gridY = Math.round(pixelY / GRID_CELL_HEIGHT);

    // Clamp to grid bounds
    gridX = Math.max(0, Math.min(gridX, GRID_COLS - widget.position.width));
    gridY = Math.max(0, Math.min(gridY, GRID_ROWS - widget.position.height));

    // Check if this position would overlap
    if (!wouldOverlap(gridX, gridY)) {
      setTentativePosition({ x: gridX, y: gridY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging && tentativePosition) {
      // Apply the final position
      onMove?.(widget.id, { x: tentativePosition.x, y: tentativePosition.y });
    }

    setIsDragging(false);
    setDragOffset(null);
    setTentativePosition(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Use tentative position during drag, otherwise use widget position
  const displayPosition = isDragging && tentativePosition ? tentativePosition : widget.position;

  const widgetStyle = {
    width: `${widget.position.width * 200 + (widget.position.width - 1) * 16}px`,
    height: isMinimized ? '48px' : `${widget.position.height * 150 + (widget.position.height - 1) * 16}px`,
    left: `${displayPosition.x * 216}px`,
    top: `${displayPosition.y * 166}px`,
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isCustomizing && !isDragging ? 'move' : 'default',
    transition: isDragging ? 'none' : 'all 200ms ease-out'
  };

  return (
    <div
      ref={containerRef}
      className={`absolute liquid-glass-sidebar rounded-2xl transition-all duration-300 group overflow-hidden ${
        isDragging ? 'shadow-2xl shadow-blue-500/20 border-blue-500/30 scale-105 z-50' : ''
      } ${isCustomizing ? 'hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10' : ''} ${className}`}
      style={widgetStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Widget Header */}
      <div className={`flex items-center justify-between p-4 border-b border-white/10 bg-white/5 ${
        isCustomizing ? 'bg-blue-500/10' : ''
      }`}>
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-adaptive-primary text-sm truncate">{widget.title}</h3>
          {isCustomizing && (
            <Move className="w-4 h-4 icon-adaptive-muted opacity-0 group-hover:opacity-100 transition-all duration-200" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize/Maximize */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="icon-adaptive-muted hover:text-adaptive-primary transition-all duration-200 p-1.5 rounded-lg liquid-glass-interactive"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>

          {/* Settings */}
          {onSettings && (
            <button
              onClick={() => onSettings(widget.id)}
              className="icon-adaptive-muted hover:text-adaptive-primary transition-all duration-200 p-1.5 rounded-lg liquid-glass-interactive"
              title="Widget Settings"
            >
              <Settings className="w-3 h-3" />
            </button>
          )}

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="icon-adaptive-muted hover:text-adaptive-primary transition-all duration-200 p-1.5 rounded-lg liquid-glass-interactive"
            >
              <MoreVertical className="w-3 h-3" />
            </button>

            {showMenu && (
              <>
                <div className="liquid-dropdown absolute right-0 top-full mt-2 w-44 rounded-xl shadow-2xl z-[60] liquid-glass-sidebar border border-white/10">
                  <div className="py-2">
                    {onSettings && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSettings(widget.id);
                          setShowMenu(false);
                        }}
                        className="liquid-dropdown-item w-full px-3 py-2 text-left text-sm flex items-center gap-2 rounded-lg mx-1 text-adaptive-primary hover:bg-white/10"
                      >
                        <Settings className="w-3 h-3" />
                        Configure
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(!isMinimized);
                        setShowMenu(false);
                      }}
                      className="liquid-dropdown-item w-full px-3 py-2 text-left text-sm flex items-center gap-2 rounded-lg mx-1 text-adaptive-primary hover:bg-white/10"
                    >
                      {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                      {isMinimized ? 'Expand' : 'Minimize'}
                    </button>
                    {onRemove && (
                      <>
                        <div className="border-t border-white/10 my-2 mx-2" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Removing widget:', widget.id, widget.title);
                            onRemove(widget.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 rounded-lg mx-1 transition-all duration-200"
                        >
                          <X className="w-3 h-3" />
                          Remove Widget
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* Click outside to close menu overlay */}
                <div
                  className="fixed inset-0 z-[55]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
              </>
            )}
          </div>

          {/* Close Button (only in customization mode) */}
          {isCustomizing && onRemove && (
            <button
              onClick={() => onRemove(widget.id)}
              className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
              title="Remove Widget"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      {!isMinimized && (
        <div className="p-4 overflow-hidden h-full">
          {children}
        </div>
      )}

      {/* Modern Resize Handles (only in customization mode) */}
      {isCustomizing && !isMinimized && (
        <>
          {/* Corner resize handle - Apple style */}
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsResizing(true);
            }}
            title="Resize widget"
          >
            <div className="absolute bottom-2 right-2 w-4 h-4 liquid-glass-interactive rounded-lg border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-blue-400" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15 1h-4v2h2v2h2V1zM1 15h4v-2H3v-2H1v4zM15 11h-2v2h-2v2h4v-4zM5 5H3v2H1V3h4v2z" />
              </svg>
            </div>
          </div>

          {/* Edge resize handles - Modern style */}
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500/10 rounded-t-lg"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsResizing(true);
            }}
            title="Resize height"
          >
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-400/40 rounded-full" />
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-blue-400/60 rounded-full" />
          </div>

          <div
            className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-8 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500/10 rounded-l-lg"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsResizing(true);
            }}
            title="Resize width"
          >
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-400/40 rounded-full" />
            <div className="absolute right-0.5 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-blue-400/60 rounded-full" />
          </div>

          {/* Resize indicator overlay */}
          {isResizing && (
            <div className="absolute inset-0 border-2 border-blue-400/50 rounded-2xl bg-blue-500/5 backdrop-blur-sm flex items-center justify-center">
              <div className="liquid-glass-sidebar rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-blue-400 flex items-center gap-2">
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M15 1h-4v2h2v2h2V1zM1 15h4v-2H3v-2H1v4zM15 11h-2v2h-2v2h4v-4zM5 5H3v2H1V3h4v2z" />
                  </svg>
                  <span>Resizing...</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}