import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  Settings, 
  Filter, 
  Star,
  Download,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
  Save,
  Check,
  Calendar,
  User,
  Mail,
  Phone,
  Link,
  ChevronDown,
  Pin,
  PinOff,
  ChevronLeft,
  ChevronRight,
  Table,
  Columns,
  BarChart3,
  Layout,
  GanttChart,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  FlexiBoard, 
  EnhancedFlexiBoardEngine,
  FlexiBoardItem,
  FlexiBoardColumn,
  FlexiBoardGroup
} from '../../../../../libs/missions-engine-lib/src/index';

interface FlexiBoardViewProps {
  board: FlexiBoard;
  engine: EnhancedFlexiBoardEngine;
  onUpdate?: (updatedBoard: FlexiBoard) => void;
}

export function FlexiBoardView({ board, engine, onUpdate }: FlexiBoardViewProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const [showViewManager, setShowViewManager] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentBoard, setCurrentBoard] = useState<FlexiBoard>(board || {
    id: 'fallback-board',
    name: 'Loading Board...',
    columns: [],
    items: [],
    groups: [],
    views: []
  } as FlexiBoard);
  const [frozenColumns, setFrozenColumns] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<string>('table');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update current board when prop changes
  useEffect(() => {
    try {
      if (board && board.id) {
        setCurrentBoard(board);
        setIsError(false);
        setErrorMessage('');
      } else {
        setIsError(true);
        setErrorMessage('Invalid board data received');
      }
    } catch (error) {
      console.error('Error updating board:', error);
      setIsError(true);
      setErrorMessage('Failed to load board data');
    }
  }, [board]);

  const handleAddItem = async (groupId: string) => {
    try {
      if (!engine || !currentBoard || !currentBoard.columns || currentBoard.columns.length === 0) {
        console.error('Cannot add item: Missing engine, board, or columns');
        return;
      }

      const firstColumnId = currentBoard.columns[0]?.id;
      if (!firstColumnId) {
        console.error('Cannot add item: No columns available');
        return;
      }

      const newItem = await engine.addItemWithAutomation({
        boardId: currentBoard.id,
        data: { [firstColumnId]: 'New Item' },
        status: 'new',
        priority: 'medium',
        createdBy: 'current-user'
      }, 'current-user');

      // Add item to the specific group
      const updatedBoard = engine.getBoard();
      if (updatedBoard && Array.isArray(updatedBoard.groups)) {
        const group = updatedBoard.groups.find(g => g && g.id === groupId);
        if (group && Array.isArray(group.items) && !group.items.find(item => item && item.id === newItem.id)) {
          group.items.push(newItem);
        }
      }

      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
    } catch (error) {
      console.error('Error adding item:', error);
      setIsError(true);
      setErrorMessage('Failed to add new item');
    }
  };

  const handleUpdateItem = async (itemId: string, columnId: string, value: any) => {
    try {
      await engine.updateItemWithAutomation(itemId, {
        data: { [columnId]: value }
      }, 'current-user');

      const updatedBoard = engine.getBoard();
      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
      setEditingCell(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      engine.removeItem(itemId);
      
      // Remove from groups as well
      const updatedBoard = engine.getBoard();
      updatedBoard.groups?.forEach(group => {
        group.items = group.items.filter(item => item.id !== itemId);
      });

      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      await engine.executeBulkOperation({
        type: 'delete',
        itemIds: selectedItems
      }, 'current-user');

      const updatedBoard = engine.getBoard();
      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
      setSelectedItems([]);
    } catch (error) {
      console.error('Error bulk deleting items:', error);
    }
  };

  const renderCellValue = (value: any, column: FlexiBoardColumn) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Empty</span>;
    }

    switch (column.type) {
      case 'currency':
        return <span className="font-mono text-green-700">${Number(value).toLocaleString()}</span>;
      
      case 'status':
        const statusOption = Array.isArray(column.options) 
          ? column.options.find((opt: any) => opt.value === value)
          : null;
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: typeof statusOption === 'object' ? statusOption?.color || '#6B7280' : '#6B7280' }}
          >
            {typeof statusOption === 'object' ? statusOption?.label || value : value}
          </span>
        );
      
      case 'priority':
        const colors = {
          low: 'bg-green-100 text-green-800',
          medium: 'bg-yellow-100 text-yellow-800', 
          high: 'bg-red-100 text-red-800',
          urgent: 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
          </span>
        );
      
      case 'progress':
        const progress = Number(value) || 0;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 font-mono min-w-[30px]">{progress}%</span>
          </div>
        );
      
      case 'email':
        return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      
      case 'phone':
        return <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      
      case 'date':
      case 'datetime':
        return <span className="text-gray-700">{new Date(value).toLocaleDateString()}</span>;
      
      case 'person':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              <User className="w-3 h-3" />
            </div>
            <span className="text-gray-700">{String(value).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        );
      
      case 'checkbox':
        return <Check className={`w-4 h-4 ${value ? 'text-green-600' : 'text-gray-300'}`} />;
        
      default:
        return <span className="text-gray-900">{String(value)}</span>;
    }
  };

  const renderCellInput = (item: FlexiBoardItem, column: FlexiBoardColumn) => {
    return (
      <div className="flex items-center space-x-2">
        {column.type === 'status' && column.options ? (
          <select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => {
              handleUpdateItem(item.id, column.id, cellValue);
              setEditingCell(null);
            }}
            className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            autoFocus
          >
            {column.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={column.type === 'number' || column.type === 'currency' ? 'number' : column.type === 'date' ? 'date' : 'text'}
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => {
              const finalValue = (column.type === 'number' || column.type === 'currency') 
                ? parseFloat(cellValue) || 0 
                : cellValue;
              handleUpdateItem(item.id, column.id, finalValue);
              setEditingCell(null);
            }}
            className="w-full px-2 py-1 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
      </div>
    );
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollLeft);
  }, []);

  const handleKeyboardNavigation = useCallback((e: React.KeyboardEvent) => {
    if (!tableRef.current) return;
    
    const scrollContainer = tableRef.current;
    const scrollAmount = 100;
    
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      scrollContainer.scrollLeft = Math.max(0, scrollContainer.scrollLeft - scrollAmount);
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      scrollContainer.scrollLeft += scrollAmount;
    }
  }, []);

  const handleToggleColumnFreeze = (columnId: string) => {
    const newFrozenColumns = new Set(frozenColumns);
    if (frozenColumns.has(columnId)) {
      newFrozenColumns.delete(columnId);
    } else {
      newFrozenColumns.add(columnId);
    }
    setFrozenColumns(newFrozenColumns);
  };

  // Get frozen columns from template config
  const getFrozenColumns = () => {
    try {
      if (!currentBoard || !Array.isArray(currentBoard.columns)) {
        return [];
      }
      
      if (currentBoard.templateConfig?.frozenColumns && Array.isArray(currentBoard.templateConfig.frozenColumns)) {
        return currentBoard.columns.filter(col => 
          col && col.title && currentBoard.templateConfig!.frozenColumns.includes(col.title)
        );
      }
      // Default to first column if no template config
      return currentBoard.columns.length > 0 ? currentBoard.columns.slice(0, 1) : [];
    } catch (error) {
      console.error('Error getting frozen columns:', error);
      return [];
    }
  };

  const getScrollableColumns = () => {
    try {
      if (!currentBoard || !Array.isArray(currentBoard.columns)) {
        return [];
      }
      
      const frozenColumnTitles = currentBoard.templateConfig?.frozenColumns || 
        (currentBoard.columns[0]?.title ? [currentBoard.columns[0].title] : []);
      return currentBoard.columns.filter(col => 
        col && col.title && !frozenColumnTitles.includes(col.title)
      );
    } catch (error) {
      console.error('Error getting scrollable columns:', error);
      return [];
    }
  };

  // Calculate cumulative widths for sticky positioning
  const getFrozenColumnLeft = (columnIndex: number) => {
    const frozenCols = getFrozenColumns();
    let left = 48; // checkbox width
    for (let i = 0; i < columnIndex; i++) {
      if (frozenCols[i]) {
        left += frozenCols[i].width || 150;
      }
    }
    return left;
  };

  const handleAddColumn = async (columnData: Omit<FlexiBoardColumn, 'id'>) => {
    const newColumn: FlexiBoardColumn = {
      ...columnData,
      id: `col-${Date.now()}`
    };
    
    const updatedBoard = { 
      ...currentBoard, 
      columns: [...currentBoard.columns, newColumn] 
    };
    
    setCurrentBoard(updatedBoard);
    onUpdate?.(updatedBoard);
  };

  const handleUpdateColumn = async (columnId: string, updates: Partial<FlexiBoardColumn>) => {
    const columnIndex = currentBoard.columns.findIndex(col => col.id === columnId);
    
    if (columnIndex !== -1) {
      const updatedColumns = [...currentBoard.columns];
      updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], ...updates };
      
      const updatedBoard = { 
        ...currentBoard, 
        columns: updatedColumns 
      };
      
      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    const updatedBoard = { 
      ...currentBoard, 
      columns: currentBoard.columns.filter(col => col.id !== columnId) 
    };
    
    setCurrentBoard(updatedBoard);
    onUpdate?.(updatedBoard);
  };

  const handleViewChange = (viewId: string) => {
    const view = currentBoard.views.find(v => v.id === viewId);
    if (view) {
      setCurrentView(view.type);
      // Update board's active view
      const updatedBoard = { ...currentBoard, activeViewId: viewId };
      setCurrentBoard(updatedBoard);
      onUpdate?.(updatedBoard);
    }
  };

  const handleAddView = (name: string, type: string) => {
    const newView = {
      id: `view-${Date.now()}`,
      name,
      type: type as any,
      filters: [],
      sorts: [],
      isDefault: false,
      visibleColumns: currentBoard.columns.map(c => c.id)
    };
    
    const updatedBoard = {
      ...currentBoard,
      views: [...currentBoard.views, newView],
      activeViewId: newView.id
    };
    
    setCurrentBoard(updatedBoard);
    setCurrentView(type);
    onUpdate?.(updatedBoard);
  };

  // Show error state if there's an error
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Board Loading Error</h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state if board is not ready
  if (!currentBoard || !currentBoard.id || !currentBoard.columns) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading FlexiBoard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentBoard.name || 'Untitled Board'}</h1>
            <p className="text-gray-600 mt-1">{currentBoard.description || 'No description'}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['table', 'kanban', 'timeline', 'dashboard'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3 py-1 rounded text-sm font-medium capitalize ${
                    currentView === view
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <button 
              onClick={() => setShowColumnManager(!showColumnManager)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Settings className="w-4 h-4" />
              <span>Manage Columns</span>
            </button>

            <button 
              onClick={() => setShowAutomationPanel(!showAutomationPanel)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Zap className="w-4 h-4" />
              <span>Automations ({currentBoard.automations?.length || 0})</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <button 
              onClick={() => handleAddItem(currentBoard.groups?.[0]?.id || 'default')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add {currentBoard?.templateConfig?.singular ? currentBoard.templateConfig.singular.charAt(0).toUpperCase() + currentBoard.templateConfig.singular.slice(1) : 'Item'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedItems.length > 0 && (
              <>
                <span className="text-sm text-gray-600">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FlexiBoard Table View - Frozen + Scrollable Layout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedItems.length} {selectedItems.length === 1 ? currentBoard.templateConfig?.singular || 'item' : currentBoard.templateConfig?.plural || 'items'} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Frozen + Scrollable Table Layout */}
        <div className="flex">
          {/* Frozen Columns Section */}
          <div className="flex-shrink-0 border-r border-gray-200">
            {/* Frozen Header */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex text-sm font-medium text-gray-500">
                {/* Checkbox column */}
                <div className="w-12 px-3 py-4 flex items-center justify-center border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={Array.isArray(currentBoard.items) && currentBoard.items.length > 0 && selectedItems.length === currentBoard.items.length}
                    onChange={(e) => {
                      if (e.target.checked && Array.isArray(currentBoard.items)) {
                        setSelectedItems(currentBoard.items.filter(item => item && item.id).map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                {/* Frozen columns */}
                {getFrozenColumns().map((column) => (
                  <div 
                    key={column.id} 
                    className="flex items-center justify-between group px-3 py-4 border-r border-gray-200"
                    style={{ minWidth: `${column.width || 200}px`, width: `${column.width || 200}px` }}
                  >
                    <span className="truncate font-medium">{column.title}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleToggleColumnFreeze(column.id)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Unfreeze column"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frozen Body */}
            <div className="divide-y divide-gray-200">
              {(Array.isArray(currentBoard.items) ? currentBoard.items : []).filter(item => item && item.id).map((item) => (
                <div key={item.id} className="flex hover:bg-gray-50 group">
                  {/* Checkbox cell */}
                  <div className="w-12 px-3 py-4 flex items-center justify-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Frozen column cells */}
                  {getFrozenColumns().map((column) => (
                    <div 
                      key={column.id}
                      className="px-3 py-4 border-r border-gray-200"
                      style={{ minWidth: `${column.width || 200}px`, width: `${column.width || 200}px` }}
                    >
                      {editingCell?.itemId === item.id && editingCell?.columnId === column.id ? (
                        renderCellInput(item, column)
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-50 p-1 rounded truncate text-sm"
                          onClick={() => {
                            setEditingCell({ itemId: item.id, columnId: column.id });
                            setCellValue((item.data && item.data[column.id] !== undefined ? item.data[column.id] : '').toString());
                          }}
                        >
                          {renderCellValue(item.data ? item.data[column.id] : '', column)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Columns Section */}
          <div className="flex-1 overflow-x-auto">
            {/* Scrollable Header */}
            <div className="border-b border-gray-200 bg-gray-50 min-w-max">
              <div className="flex text-sm font-medium text-gray-500">
                {getScrollableColumns().map((column) => (
                  <div 
                    key={column.id} 
                    className="flex items-center justify-between group px-3 py-4 border-r border-gray-200"
                    style={{ minWidth: `${column.width || 120}px`, width: `${column.width || 120}px` }}
                  >
                    <span className="truncate">{column.title}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleToggleColumnFreeze(column.id)}
                        className="p-1 text-gray-400 hover:bg-gray-200 rounded"
                        title="Freeze column"
                      >
                        <PinOff className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Actions Column */}
                <div className="w-16 px-3 py-4 text-center">Actions</div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="divide-y divide-gray-200 min-w-max">
              {(Array.isArray(currentBoard.items) ? currentBoard.items : []).filter(item => item && item.id).map((item) => (
                <div key={item.id} className="flex hover:bg-gray-50 group">
                  {getScrollableColumns().map((column) => (
                    <div 
                      key={column.id}
                      className="px-3 py-4 border-r border-gray-200"
                      style={{ minWidth: `${column.width || 120}px`, width: `${column.width || 120}px` }}
                    >
                      {editingCell?.itemId === item.id && editingCell?.columnId === column.id ? (
                        renderCellInput(item, column)
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-blue-50 p-1 rounded truncate text-sm"
                          onClick={() => {
                            setEditingCell({ itemId: item.id, columnId: column.id });
                            setCellValue((item.data && item.data[column.id] !== undefined ? item.data[column.id] : '').toString());
                          }}
                        >
                          {renderCellValue(item.data ? item.data[column.id] : '', column)}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Actions cell */}
                  <div className="w-16 px-3 py-4">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Column Manager Modal */}
      {showColumnManager && (
        <ColumnManagerModal
          board={currentBoard}
          onClose={() => setShowColumnManager(false)}
          onAddColumn={handleAddColumn}
          onUpdateColumn={handleUpdateColumn}
          onDeleteColumn={handleDeleteColumn}
        />
      )}

      {/* Automation Panel Modal */}
      {showAutomationPanel && (
        <AutomationBuilderModal
          board={currentBoard}
          onClose={() => setShowAutomationPanel(false)}
          onSave={(automation) => {
            if (engine) {
              engine.getAutomationEngine().addAutomation(automation);
              setCurrentBoard(engine.getBoard());
            }
            setShowAutomationPanel(false);
          }}
        />
      )}
    </div>
  );
}

// Column Manager Modal Component
function ColumnManagerModal({
  board,
  onClose,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn
}: {
  board: FlexiBoard;
  onClose: () => void;
  onAddColumn: (column: Omit<FlexiBoardColumn, 'id'>) => void;
  onUpdateColumn: (columnId: string, updates: Partial<FlexiBoardColumn>) => void;
  onDeleteColumn: (columnId: string) => void;
}) {
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [newColumn, setNewColumn] = useState({
    title: '',
    type: 'text' as any,
    width: 150,
    required: false
  });

  const columnTypes: { value: any; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'progress', label: 'Progress' },
    { value: 'person', label: 'Person' },
    { value: 'team', label: 'Team' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'tags', label: 'Tags' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'multiselect', label: 'Multi-select' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'rating', label: 'Rating' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'file', label: 'File' }
  ];

  const handleAddColumn = () => {
    if (!newColumn.title.trim()) return;
    
    onAddColumn({
      ...newColumn,
      title: newColumn.title.trim()
    });
    
    setNewColumn({
      title: '',
      type: 'text',
      width: 150,
      required: false
    });
    setShowNewColumnForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Manage Columns</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {/* Existing Columns */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Current Columns</h3>
            {board.columns.map((column) => (
              <div key={column.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{column.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{column.type.replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={column.width || 150}
                    onChange={(e) => onUpdateColumn(column.id, { width: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    min="80"
                    max="400"
                  />
                  <span className="text-sm text-gray-500">px</span>
                  <button
                    onClick={() => onDeleteColumn(column.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Column */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Column</h3>
              {!showNewColumnForm && (
                <button
                  onClick={() => setShowNewColumnForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              )}
            </div>

            {showNewColumnForm && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Column Name *
                  </label>
                  <input
                    type="text"
                    value={newColumn.title}
                    onChange={(e) => setNewColumn({ ...newColumn, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter column name"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Column Type
                  </label>
                  <select
                    value={newColumn.type}
                    onChange={(e) => setNewColumn({ ...newColumn, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {columnTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={newColumn.width}
                    onChange={(e) => setNewColumn({ ...newColumn, width: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="80"
                    max="400"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAddColumn}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Column</span>
                  </button>
                  <button
                    onClick={() => setShowNewColumnForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Automation Builder Modal Component
function AutomationBuilderModal({
  board,
  onClose,
  onSave
}: {
  board: FlexiBoard;
  onClose: () => void;
  onSave: (automation: any) => void;
}) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('when-status-changes');
  const [triggerColumn, setTriggerColumn] = useState('status');
  const [action, setAction] = useState('send-notification');

  const handleSave = () => {
    const automation = {
      name,
      description: `Auto-generated automation: ${name}`,
      trigger: {
        type: trigger,
        column: triggerColumn
      },
      conditions: [],
      actions: [{
        type: action,
        recipients: ['demo-user'],
        message: `Automation triggered: ${name}`
      }],
      enabled: true,
      createdBy: 'demo-user'
    };

    onSave(automation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create Automation</h2>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Automation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter automation name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="when-status-changes">When status changes</option>
              <option value="when-column-changes">When column changes</option>
              <option value="when-item-created">When item created</option>
              <option value="every-time-period">Every time period</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Column
            </label>
            <select
              value={triggerColumn}
              onChange={(e) => setTriggerColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {board.columns.map(column => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="send-notification">Send notification</option>
              <option value="change-status">Change status</option>
              <option value="assign-person">Assign person</option>
              <option value="create-item">Create item</option>
            </select>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            Create Automation
          </button>
        </div>
      </div>
    </div>
  );
}