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
}

export function WidgetContainer({
  widget,
  children,
  onRemove,
  onSettings,
  onResize,
  onMove,
  isCustomizing = false,
  className = ''
}: WidgetContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isCustomizing || e.target !== e.currentTarget) return;

    e.preventDefault();
    setIsDragging(true);

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startLeft: rect.left,
        startTop: rect.top
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    e.preventDefault();
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    const newX = Math.max(0, dragRef.current.startLeft + deltaX);
    const newY = Math.max(0, dragRef.current.startTop + deltaY);

    if (containerRef.current) {
      containerRef.current.style.left = `${newX}px`;
      containerRef.current.style.top = `${newY}px`;
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      onMove?.(widget.id, { x: rect.left, y: rect.top });
    }

    setIsDragging(false);
    dragRef.current = null;
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

  const widgetStyle = {
    width: `${widget.position.width * 200 + (widget.position.width - 1) * 16}px`,
    height: isMinimized ? '48px' : `${widget.position.height * 150 + (widget.position.height - 1) * 16}px`,
    left: `${widget.position.x * 216}px`,
    top: `${widget.position.y * 166}px`,
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isCustomizing && !isDragging ? 'move' : 'default'
  };

  return (
    <div
      ref={containerRef}
      className={`absolute liquid-glass-sidebar rounded-2xl transition-all duration-300 group ${
        isDragging ? 'shadow-2xl shadow-blue-500/20 border-blue-500/30 scale-105 z-50' : ''
      } ${isCustomizing ? 'hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10' : ''} ${className}`}
      style={widgetStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Widget Header */}
      <div className={`liquid-glass-header flex items-center justify-between p-4 ${
        isCustomizing ? 'liquid-glass-section' : ''
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
              onClick={() => setShowMenu(!showMenu)}
              className="icon-adaptive-muted hover:text-adaptive-primary transition-all duration-200 p-1.5 rounded-lg liquid-glass-interactive"
            >
              <MoreVertical className="w-3 h-3" />
            </button>

            {showMenu && (
              <div className="liquid-dropdown absolute right-0 top-full mt-2 w-44 rounded-xl shadow-2xl z-50">
                <div className="py-2">
                  {onSettings && (
                    <button
                      onClick={() => {
                        onSettings(widget.id);
                        setShowMenu(false);
                      }}
                      className="liquid-dropdown-item w-full px-3 py-2 text-left text-sm flex items-center gap-2 rounded-lg mx-1"
                    >
                      <Settings className="w-3 h-3" />
                      Configure
                    </button>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="liquid-dropdown-item w-full px-3 py-2 text-left text-sm flex items-center gap-2 rounded-lg mx-1"
                  >
                    {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    {isMinimized ? 'Expand' : 'Minimize'}
                  </button>
                  {onRemove && (
                    <>
                      <div className="border-t border-white/10 my-2 mx-2" />
                      <button
                        onClick={() => {
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

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}