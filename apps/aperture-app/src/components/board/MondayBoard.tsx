import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Settings, 
  Filter, 
  Download, 
  Upload,
  BarChart3,
  Users,
  Target,
  Edit3,
  Trash2,
  ChevronDown,
  X,
  Save,
  MoreHorizontal,
  Star,
  Check,
  Calendar,
  User,
  Hash,
  Type,
  ToggleLeft,
  Mail,
  Phone,
  Link,
  Tag
} from 'lucide-react';
import { 
  FlexiBoard, 
  FlexiBoardColumn, 
  FlexiBoardItem,
  ColumnType,
  BoardTemplate,
  BoardTemplateConfig,
  getBoardTemplateConfigs
} from '../../../../../libs/missions-engine-lib/src/index';

interface MondayBoardProps {
  boardData?: FlexiBoard;
  onBoardChange?: (board: FlexiBoard) => void;
}

export function MondayBoard({ boardData, onBoardChange }: MondayBoardProps) {
  const [board, setBoard] = useState<FlexiBoard | null>(boardData || null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);
  const [cellValue, setCellValue] = useState<string>('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(!boardData);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ itemId: string; columnId: string } | null>(null);

  const cellInputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(null);

  // Get template configurations
  const templateConfigs = getBoardTemplateConfigs();

  // Initialize with a default board if none provided
  useEffect(() => {
    if (!board && !showTemplateSelector) {
      initializeDefaultBoard();
    }
  }, []);

  const initializeDefaultBoard = () => {
    const defaultTemplate = templateConfigs[0]; // Use first template as default
    createBoardFromTemplate(defaultTemplate);
  };

  const createBoardFromTemplate = (template: BoardTemplateConfig) => {
    const newBoard: FlexiBoard = {
      id: `board-${Date.now()}`,
      name: `My ${template.label}`,
      description: template.description,
      ownerId: 'current-user',
      workspace: 'default',
      businessApp: 'custom',
      template: template.id,
      templateConfig: template,
      columns: template.defaultColumns.map((col, index) => ({
        ...col,
        id: `col-${index}`,
        width: col.width || (index === 0 ? 200 : 120)
      })),
      views: [{
        id: 'main-view',
        name: 'Main Table',
        type: 'table',
        isDefault: true,
        filters: [],
        sorts: [],
        visibleColumns: template.defaultColumns.map((_, index) => `col-${index}`)
      }],
      activeViewId: 'main-view',
      items: generateSampleData(template),
      permissions: {
        canEdit: true,
        canDelete: true,
        canShare: true,
        canComment: true,
        canManageAutomations: true,
        canExport: true,
        canDuplicate: true
      },
      settings: {
        allowComments: true,
        enableNotifications: true,
        showSubItems: false,
        colorCoding: true,
        enableAutomations: false,
        trackTime: false,
        requireApproval: false,
        showUpdates: true,
        enableIntegrations: false,
        allowBulkOperations: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoard(newBoard);
    setShowTemplateSelector(false);
    onBoardChange?.(newBoard);
  };

  const generateSampleData = (template: BoardTemplateConfig): FlexiBoardItem[] => {
    // Generate sample items based on template type
    const sampleCount = 5;
    const items: FlexiBoardItem[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const itemData: Record<string, any> = {};
      
      template.defaultColumns.forEach((col, colIndex) => {
        const columnId = `col-${colIndex}`;
        
        switch (col.type) {
          case 'text':
            itemData[columnId] = `Sample ${template.singular} ${i + 1}`;
            break;
          case 'status':
            itemData[columnId] = col.options?.[i % (col.options.length || 1)]?.value || 'new';
            break;
          case 'priority':
            itemData[columnId] = ['low', 'medium', 'high'][i % 3];
            break;
          case 'currency':
            itemData[columnId] = Math.round(Math.random() * 10000);
            break;
          case 'number':
            itemData[columnId] = Math.round(Math.random() * 100);
            break;
          case 'date':
            itemData[columnId] = new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
            break;
          case 'person':
            itemData[columnId] = ['john-doe', 'jane-smith', 'bob-wilson'][i % 3];
            break;
          case 'email':
            itemData[columnId] = `user${i + 1}@example.com`;
            break;
          case 'phone':
            itemData[columnId] = `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`;
            break;
          default:
            itemData[columnId] = `Value ${i + 1}`;
        }
      });

      items.push({
        id: `item-${i}`,
        boardId: 'current-board',
        data: itemData,
        status: 'active',
        priority: 'medium',
        assignees: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user',
        position: i
      });
    }

    return items;
  };

  const getFrozenColumns = () => {
    if (!board) return [];
    const frozenColumnTitles = board.templateConfig?.frozenColumns || [board.columns[0]?.title];
    return board.columns.filter(col => frozenColumnTitles.includes(col.title));
  };

  const getScrollableColumns = () => {
    if (!board) return [];
    const frozenColumnTitles = board.templateConfig?.frozenColumns || [board.columns[0]?.title];
    return board.columns.filter(col => !frozenColumnTitles.includes(col.title));
  };

  const handleCellEdit = (itemId: string, columnId: string, value: any) => {
    if (!board) return;

    const updatedBoard = {
      ...board,
      items: board.items.map(item => 
        item.id === itemId 
          ? { ...item, data: { ...item.data, [columnId]: value }, updatedAt: new Date() }
          : item
      ),
      updatedAt: new Date()
    };

    setBoard(updatedBoard);
    onBoardChange?.(updatedBoard);
    setEditingCell(null);
    
    // Simulate collaboration
    setIsCollaborating(true);
    setTimeout(() => setIsCollaborating(false), 1000);
  };

  const handleAddItem = () => {
    if (!board) return;

    const newItem: FlexiBoardItem = {
      id: `item-${Date.now()}`,
      boardId: board.id,
      data: board.columns.reduce((acc, col) => {
        acc[col.id] = col.type === 'text' ? `New ${board.templateConfig?.singular || 'item'}` : '';
        return acc;
      }, {} as Record<string, any>),
      status: 'active',
      priority: 'medium',
      assignees: [],
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
      position: board.items.length
    };

    const updatedBoard = {
      ...board,
      items: [...board.items, newItem],
      updatedAt: new Date()
    };

    setBoard(updatedBoard);
    onBoardChange?.(updatedBoard);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!board) return;

    const updatedBoard = {
      ...board,
      items: board.items.filter(item => item.id !== itemId),
      updatedAt: new Date()
    };

    setBoard(updatedBoard);
    onBoardChange?.(updatedBoard);
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  const handleBulkDelete = () => {
    if (!board || selectedItems.length === 0) return;

    const updatedBoard = {
      ...board,
      items: board.items.filter(item => !selectedItems.includes(item.id)),
      updatedAt: new Date()
    };

    setBoard(updatedBoard);
    onBoardChange?.(updatedBoard);
    setSelectedItems([]);
  };

  const renderCellValue = (value: any, column: FlexiBoardColumn) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Empty</span>;
    }

    switch (column.type) {
      case 'currency':
        return <span className="font-mono text-green-700">${Number(value).toLocaleString()}</span>;
      
      case 'status':
        const statusOption = column.options?.find((opt: any) => opt.value === value);
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
            <span className="text-xs text-gray-600 font-mono">{progress}%</span>
          </div>
        );
      
      case 'email':
        return <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      
      case 'phone':
        return <a href={`tel:${value}`} className="text-blue-600 hover:underline">{value}</a>;
      
      case 'url':
        return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center"><Link className="w-3 h-3 mr-1" />Link</a>;
      
      case 'date':
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
      
      case 'number':
        return <span className="font-mono">{Number(value).toLocaleString()}</span>;
      
      case 'checkbox':
        return <Check className={`w-4 h-4 ${value ? 'text-green-600' : 'text-gray-300'}`} />;
        
      default:
        return <span className="text-gray-900">{String(value)}</span>;
    }
  };

  const renderCellInput = (item: FlexiBoardItem, column: FlexiBoardColumn) => {
    const currentValue = item.data[column.id] || '';

    switch (column.type) {
      case 'status':
        return (
          <select
            ref={cellInputRef as React.RefObject<HTMLSelectElement>}
            value={currentValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(item.id, column.id, cellValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          >
            {column.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'number':
      case 'currency':
        return (
          <input
            ref={cellInputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, parseFloat(cellValue) || 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(item.id, column.id, parseFloat(cellValue) || 0);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
            autoFocus
          />
        );
      
      case 'date':
        return (
          <input
            ref={cellInputRef as React.RefObject<HTMLInputElement>}
            type="date"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(item.id, column.id, cellValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          />
        );
      
      case 'long-text':
        return (
          <textarea
            ref={cellInputRef as React.RefObject<HTMLTextAreaElement>}
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCellEdit(item.id, column.id, cellValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
            rows={2}
            autoFocus
          />
        );
      
      default:
        return (
          <input
            ref={cellInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCellEdit(item.id, column.id, cellValue);
              } else if (e.key === 'Escape') {
                setEditingCell(null);
              }
            }}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          />
        );
    }
  };

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Choose a board template</h2>
            <p className="text-gray-600 mt-1">Start with a template or create a blank board</p>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateConfigs.map((template) => (
                <button
                  key={template.id}
                  onClick={() => createBoardFromTemplate(template)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-medium text-gray-900">{template.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-blue-600 font-medium">
                      {template.defaultColumns.length} columns
                    </span>
                    <span className="text-xs text-gray-500">
                      For {template.plural}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => createBoardFromTemplate(templateConfigs[0])}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Start with {templateConfigs[0].label} template
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  const frozenColumns = getFrozenColumns();
  const scrollableColumns = getScrollableColumns();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">{board.name}</h1>
            {isCollaborating && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Collaborating...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddItem}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New {board.templateConfig?.singular || 'Item'}</span>
            </button>
            
            {selectedItems.length > 0 && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-600">
                  {selectedItems.length} {selectedItems.length === 1 ? board.templateConfig?.singular || 'item' : board.templateConfig?.plural || 'items'} selected
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
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Board Table */}
      <div className="bg-white">
        <div className="flex">
          {/* Frozen Columns */}
          <div className="flex-shrink-0 border-r border-gray-200">
            {/* Frozen Header */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex text-sm font-medium text-gray-600">
                {/* Select All Checkbox */}
                <div className="w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === board.items.length && board.items.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(board.items.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                {frozenColumns.map((column) => (
                  <div 
                    key={column.id}
                    className="px-4 py-3 border-r border-gray-200 flex items-center justify-between group"
                    style={{ minWidth: `${column.width}px`, width: `${column.width}px` }}
                  >
                    <span className="font-medium text-gray-900">{column.title}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Frozen Body */}
            <div className="divide-y divide-gray-100">
              {board.items.map((item, itemIndex) => (
                <div key={item.id} className={`flex hover:bg-blue-50 group ${itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  {/* Row Checkbox */}
                  <div className="w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200">
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
                  
                  {frozenColumns.map((column) => (
                    <div 
                      key={column.id}
                      className="px-4 py-3 border-r border-gray-200 relative"
                      style={{ minWidth: `${column.width}px`, width: `${column.width}px` }}
                      onMouseEnter={() => setHoveredCell({ itemId: item.id, columnId: column.id })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {editingCell?.itemId === item.id && editingCell?.columnId === column.id ? (
                        renderCellInput(item, column)
                      ) : (
                        <div
                          className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                            hoveredCell?.itemId === item.id && hoveredCell?.columnId === column.id 
                              ? 'bg-blue-50 ring-2 ring-blue-200' 
                              : ''
                          }`}
                          onClick={() => {
                            setEditingCell({ itemId: item.id, columnId: column.id });
                            setCellValue((item.data[column.id] || '').toString());
                          }}
                        >
                          {renderCellValue(item.data[column.id], column)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Columns */}
          <div className="flex-1 overflow-x-auto">
            {/* Scrollable Header */}
            <div className="border-b border-gray-200 bg-gray-50 min-w-max">
              <div className="flex text-sm font-medium text-gray-600">
                {scrollableColumns.map((column) => (
                  <div 
                    key={column.id}
                    className="px-4 py-3 border-r border-gray-200 flex items-center justify-between group"
                    style={{ minWidth: `${column.width}px`, width: `${column.width}px` }}
                  >
                    <span className="font-medium text-gray-900">{column.title}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* Actions Column */}
                <div className="w-16 px-3 py-3 text-center">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="divide-y divide-gray-100 min-w-max">
              {board.items.map((item, itemIndex) => (
                <div key={item.id} className={`flex hover:bg-blue-50 group ${itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  {scrollableColumns.map((column) => (
                    <div 
                      key={column.id}
                      className="px-4 py-3 border-r border-gray-200 relative"
                      style={{ minWidth: `${column.width}px`, width: `${column.width}px` }}
                      onMouseEnter={() => setHoveredCell({ itemId: item.id, columnId: column.id })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {editingCell?.itemId === item.id && editingCell?.columnId === column.id ? (
                        renderCellInput(item, column)
                      ) : (
                        <div
                          className={`cursor-pointer rounded px-2 py-1 transition-colors ${
                            hoveredCell?.itemId === item.id && hoveredCell?.columnId === column.id 
                              ? 'bg-blue-50 ring-2 ring-blue-200' 
                              : ''
                          }`}
                          onClick={() => {
                            setEditingCell({ itemId: item.id, columnId: column.id });
                            setCellValue((item.data[column.id] || '').toString());
                          }}
                        >
                          {renderCellValue(item.data[column.id], column)}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Actions cell */}
                  <div className="w-16 px-3 py-3">
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Delete row"
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

      {/* Add Row Button */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add {board.templateConfig?.singular || 'item'}</span>
        </button>
      </div>
    </div>
  );
}