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

// Enhanced types for flexible Monday.com style board
type ViewType = 'table' | 'kanban' | 'calendar' | 'timeline' | 'chart' | 'dashboard';

type ColumnType = 
  | 'text' 
  | 'status' 
  | 'person' 
  | 'date' 
  | 'priority' 
  | 'currency' 
  | 'email' 
  | 'phone' 
  | 'progress' 
  | 'checkbox'
  | 'number'
  | 'rating'
  | 'files'
  | 'dropdown'
  | 'timeline'
  | 'formula'
  | 'connect-boards';

interface BoardColumn {
  id: string;
  title: string;
  type: ColumnType;
  width: number;
  options?: { value: string; label: string; color: string }[];
  frozen?: boolean;
  required?: boolean;
  formula?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface BoardView {
  id: string;
  name: string;
  type: ViewType;
  isDefault?: boolean;
  filters: BoardFilter[];
  sorts: BoardSort[];
  groupBy?: string;
  visibleColumns?: string[];
  settings?: Record<string, any>;
}

interface BoardFilter {
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between' | 'in' | 'empty';
  value: any;
}

interface BoardSort {
  column: string;
  direction: 'asc' | 'desc';
}

interface BoardItem {
  id: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  position: number;
  parentId?: string;
}

interface BoardTemplate {
  id: string;
  name: string;
  description: string;
  businessApp: string;
  columns: Omit<BoardColumn, 'id'>[];
  views: Omit<BoardView, 'id'>[];
  sampleData: any[];
  automations?: BoardAutomation[];
}

interface BoardAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'status-change' | 'date-arrives' | 'column-change' | 'item-created';
    column?: string;
    value?: any;
  };
  actions: {
    type: 'notify' | 'change-status' | 'assign-person' | 'move-item';
    value?: any;
  }[];
  enabled: boolean;
}

const BOARD_TEMPLATES: BoardTemplate[] = [
  {
    id: 'leads',
    name: 'Sales Leads',
    description: 'Track sales leads and prospects',
    businessApp: 'sales',
    views: [],
    columns: [
      { title: 'Lead Name', type: 'text', width: 200, frozen: true },
      { title: 'Company', type: 'text', width: 180, frozen: true },
      { title: 'Status', type: 'status', width: 130, options: [
        { value: 'new', label: 'New Lead', color: '#579bfc' },
        { value: 'contacted', label: 'Contacted', color: '#ffcc00' },
        { value: 'qualified', label: 'Qualified', color: '#00ca72' },
        { value: 'lost', label: 'Lost', color: '#e2445c' }
      ]},
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Contact', type: 'person', width: 140 },
      { title: 'Email', type: 'email', width: 180 },
      { title: 'Phone', type: 'phone', width: 150 },
      { title: 'Value', type: 'currency', width: 120 },
      { title: 'Close Date', type: 'date', width: 130 },
      { title: 'Progress', type: 'progress', width: 150 }
    ],
    sampleData: [
      { 'Lead Name': 'John Smith', Company: 'Acme Corp', Status: 'new', Priority: 'high', Contact: 'john-smith', Email: 'john@acme.com', Phone: '+1-555-0123', Value: 50000, 'Close Date': '2024-12-15', Progress: 25 },
      { 'Lead Name': 'Sarah Johnson', Company: 'Tech Startup', Status: 'contacted', Priority: 'medium', Contact: 'sarah-johnson', Email: 'sarah@techstartup.com', Phone: '+1-555-0234', Value: 25000, 'Close Date': '2024-11-20', Progress: 60 },
      { 'Lead Name': 'Mike Wilson', Company: 'Global Inc', Status: 'qualified', Priority: 'high', Contact: 'mike-wilson', Email: 'mike@global.com', Phone: '+1-555-0345', Value: 75000, 'Close Date': '2024-10-30', Progress: 80 },
      { 'Lead Name': 'Emma Davis', Company: 'Local Business', Status: 'new', Priority: 'low', Contact: 'emma-davis', Email: 'emma@local.com', Phone: '+1-555-0456', Value: 15000, 'Close Date': '2025-01-10', Progress: 10 }
    ]
  },
  {
    id: 'projects',
    name: 'Project Management',
    description: 'Manage projects and tasks',
    businessApp: 'project-management',
    views: [],
    columns: [
      { title: 'Project Name', type: 'text', width: 200, frozen: true },
      { title: 'Status', type: 'status', width: 130, options: [
        { value: 'planning', label: 'Planning', color: '#579bfc' },
        { value: 'active', label: 'Active', color: '#00ca72' },
        { value: 'on-hold', label: 'On Hold', color: '#ffcc00' },
        { value: 'completed', label: 'Completed', color: '#9cd326' }
      ]},
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Owner', type: 'person', width: 140 },
      { title: 'Budget', type: 'currency', width: 120 },
      { title: 'Start Date', type: 'date', width: 130 },
      { title: 'Due Date', type: 'date', width: 130 },
      { title: 'Progress', type: 'progress', width: 150 }
    ],
    sampleData: [
      { 'Project Name': 'Website Redesign', Status: 'active', Priority: 'high', Owner: 'alice-cooper', Budget: 15000, 'Start Date': '2024-09-01', 'Due Date': '2024-12-01', Progress: 45 },
      { 'Project Name': 'Mobile App', Status: 'planning', Priority: 'medium', Owner: 'bob-smith', Budget: 50000, 'Start Date': '2024-10-15', 'Due Date': '2025-03-15', Progress: 15 },
      { 'Project Name': 'Marketing Campaign', Status: 'active', Priority: 'high', Owner: 'carol-jones', Budget: 25000, 'Start Date': '2024-08-15', 'Due Date': '2024-11-15', Progress: 70 }
    ]
  },
  {
    id: 'tasks',
    name: 'Task Management',
    description: 'Track individual tasks and assignments',
    businessApp: 'task-management',
    views: [],
    columns: [
      { title: 'Task', type: 'text', width: 250, frozen: true },
      { title: 'Status', type: 'status', width: 130, options: [
        { value: 'todo', label: 'To Do', color: '#c4c4c4' },
        { value: 'working', label: 'Working on it', color: '#ffcc00' },
        { value: 'stuck', label: 'Stuck', color: '#e2445c' },
        { value: 'done', label: 'Done', color: '#00ca72' }
      ]},
      { title: 'Priority', type: 'priority', width: 110 },
      { title: 'Assignee', type: 'person', width: 140 },
      { title: 'Due Date', type: 'date', width: 130 },
      { title: 'Progress', type: 'progress', width: 150 }
    ],
    sampleData: [
      { Task: 'Design landing page', Status: 'working', Priority: 'high', Assignee: 'designer-1', 'Due Date': '2024-10-15', Progress: 60 },
      { Task: 'Set up database', Status: 'done', Priority: 'high', Assignee: 'dev-1', 'Due Date': '2024-10-10', Progress: 100 },
      { Task: 'Write documentation', Status: 'todo', Priority: 'medium', Assignee: 'writer-1', 'Due Date': '2024-10-20', Progress: 0 },
      { Task: 'QA Testing', Status: 'stuck', Priority: 'high', Assignee: 'qa-1', 'Due Date': '2024-10-18', Progress: 30 }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Campaigns',
    description: 'Plan and execute marketing campaigns with ROI tracking',
    businessApp: 'marketing',
    columns: [
      { title: 'Campaign', type: 'text', width: 200, frozen: true, required: true },
      { title: 'Status', type: 'status', width: 130, options: [
        { value: 'draft', label: 'Draft', color: '#c4c4c4' },
        { value: 'approved', label: 'Approved', color: '#579bfc' },
        { value: 'running', label: 'Running', color: '#00ca72' },
        { value: 'completed', label: 'Completed', color: '#9cd326' }
      ]},
      { title: 'Channel', type: 'dropdown', width: 120, options: [
        { value: 'email', label: 'Email', color: '#579bfc' },
        { value: 'social', label: 'Social Media', color: '#ffcc00' },
        { value: 'ppc', label: 'PPC', color: '#e2445c' },
        { value: 'seo', label: 'SEO', color: '#00ca72' }
      ]},
      { title: 'Budget', type: 'currency', width: 120 },
      { title: 'ROI', type: 'formula', width: 100, formula: '(Revenue - Budget) / Budget * 100' },
      { title: 'Launch Date', type: 'date', width: 130 },
      { title: 'Manager', type: 'person', width: 140 },
      { title: 'Performance', type: 'rating', width: 120 }
    ],
    views: [
      { name: 'Campaign Overview', type: 'table', isDefault: true, filters: [], sorts: [] },
      { name: 'Campaign Pipeline', type: 'kanban', filters: [], sorts: [], groupBy: 'Status' },
      { name: 'Campaign Calendar', type: 'calendar', filters: [], sorts: [] },
      { name: 'ROI Dashboard', type: 'dashboard', filters: [], sorts: [] }
    ],
    sampleData: [
      { Campaign: 'Q4 Product Launch', Status: 'running', Channel: 'email', Budget: 10000, 'Launch Date': '2024-10-01', Manager: 'marketing-lead', Performance: 4 },
      { Campaign: 'Holiday Sale', Status: 'approved', Channel: 'social', Budget: 15000, 'Launch Date': '2024-11-15', Manager: 'social-manager', Performance: 5 },
      { Campaign: 'Brand Awareness', Status: 'draft', Channel: 'ppc', Budget: 20000, 'Launch Date': '2024-12-01', Manager: 'ppc-specialist', Performance: 3 }
    ],
    automations: [
      {
        id: 'auto-4',
        name: 'Budget alert',
        trigger: { type: 'column-change', column: 'Budget' },
        actions: [{ type: 'notify', value: 'Budget updated - review ROI projections' }],
        enabled: true
      }
    ]
  }
];

export function SimpleMondayBoard() {
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [board, setBoard] = useState<{
    name: string;
    businessApp: string;
    columns: BoardColumn[];
    views: BoardView[];
    activeViewId: string;
    items: BoardItem[];
    automations: BoardAutomation[];
  } | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showViewManager, setShowViewManager] = useState(false);
  const [showAutomationPanel, setShowAutomationPanel] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentView, setCurrentView] = useState<ViewType>('table');

  const createBoardFromTemplate = (template: BoardTemplate) => {
    const columns: BoardColumn[] = template.columns.map((col, index) => ({
      ...col,
      id: `col-${index}`
    }));

    const views: BoardView[] = template.views.map((view, index) => ({
      ...view,
      id: `view-${index}`
    }));

    const items: BoardItem[] = template.sampleData.map((data, index) => ({
      id: `item-${index}`,
      data: Object.keys(data).reduce((acc, key) => {
        const colIndex = template.columns.findIndex(col => col.title === key);
        if (colIndex >= 0) {
          acc[`col-${colIndex}`] = data[key];
        }
        return acc;
      }, {} as Record<string, any>),
      createdAt: new Date(),
      updatedAt: new Date(),
      position: index
    }));

    setBoard({
      name: template.name,
      businessApp: template.businessApp,
      columns,
      views,
      activeViewId: views.find(v => v.isDefault)?.id || views[0].id,
      items,
      automations: template.automations || []
    });
    setCurrentView(views.find(v => v.isDefault)?.type || 'table');
    setShowTemplateSelector(false);
  };

  const handleCellEdit = (itemId: string, columnId: string, value: any) => {
    if (!board) return;

    setBoard({
      ...board,
      items: board.items.map(item => 
        item.id === itemId 
          ? { ...item, data: { ...item.data, [columnId]: value }, updatedAt: new Date() }
          : item
      )
    });
    setEditingCell(null);
  };

  const handleAddItem = () => {
    if (!board) return;

    const newItem: BoardItem = {
      id: `item-${Date.now()}`,
      data: board.columns.reduce((acc, col) => {
        acc[col.id] = col.type === 'text' ? 'New Item' : '';
        return acc;
      }, {} as Record<string, any>),
      position: board.items.length,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoard({
      ...board,
      items: [...board.items, newItem]
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!board) return;

    setBoard({
      ...board,
      items: board.items.filter(item => item.id !== itemId)
    });
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  const handleBulkDelete = () => {
    if (!board || selectedItems.length === 0) return;

    setBoard({
      ...board,
      items: board.items.filter(item => !selectedItems.includes(item.id))
    });
    setSelectedItems([]);
  };

  const renderCellValue = (value: any, column: BoardColumn) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">Empty</span>;
    }

    switch (column.type) {
      case 'currency':
        return <span className="font-mono text-green-700">${Number(value).toLocaleString()}</span>;
      
      case 'status':
        const statusOption = column.options?.find(opt => opt.value === value);
        return (
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: statusOption?.color || '#6B7280' }}
          >
            {statusOption?.label || value}
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

  const renderCellInput = (item: BoardItem, column: BoardColumn) => {
    const currentValue = item.data[column.id] || '';

    switch (column.type) {
      case 'status':
        return (
          <select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          >
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'priority':
        return (
          <select
            value={cellValue}
            onChange={(e) => setCellValue(e.target.value)}
            onBlur={() => handleCellEdit(item.id, column.id, cellValue)}
            className="w-full px-2 py-1 border-0 bg-blue-50 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            autoFocus
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        );
      
      case 'currency':
      case 'progress':
        return (
          <input
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
      
      default:
        return (
          <input
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

  // Template selector
  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Choose a board template</h2>
            <p className="text-gray-600 mt-1">Start with a template that fits your workflow</p>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => createBoardFromTemplate(template)}
                  className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-blue-600 font-medium">
                      {template.columns.length} columns
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.sampleData.length} sample items
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => createBoardFromTemplate(BOARD_TEMPLATES[0])}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Start with {BOARD_TEMPLATES[0].name}
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

  // Calculate cumulative widths for sticky positioning
  const getFrozenColumnLeft = (columnIndex: number) => {
    const frozenCols = board.columns.filter(col => col.frozen);
    let left = 48; // checkbox width
    for (let i = 0; i < columnIndex; i++) {
      if (frozenCols[i]) {
        left += frozenCols[i].width;
      }
    }
    return left;
  };

  const handleToggleColumnFreeze = (columnId: string) => {
    if (!board) return;
    setBoard({
      ...board,
      columns: board.columns.map(col => 
        col.id === columnId ? { ...col, frozen: !col.frozen } : col
      )
    });
  };

  const handleViewChange = (viewId: string) => {
    if (!board) return;
    const view = board.views.find(v => v.id === viewId);
    if (view) {
      setCurrentView(view.type);
      setBoard({ ...board, activeViewId: viewId });
    }
  };

  const handleAddView = (name: string, type: ViewType) => {
    if (!board) return;
    const newView: BoardView = {
      id: `view-${Date.now()}`,
      name,
      type,
      filters: [],
      sorts: [],
      isDefault: false
    };
    setBoard({
      ...board,
      views: [...board.views, newView],
      activeViewId: newView.id
    });
    setCurrentView(type);
  };

  const handleAddAutomation = (automation: Omit<BoardAutomation, 'id'>) => {
    if (!board) return;
    const newAutomation: BoardAutomation = {
      ...automation,
      id: `auto-${Date.now()}`
    };
    setBoard({
      ...board,
      automations: [...board.automations, newAutomation]
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Board Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">{board.name}</h1>
            <span className="text-sm text-gray-500">
              {board.items.length} items
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Selector */}
            {board && (
              <div className="flex items-center space-x-2">
                {board.views.map((view) => {
                  const IconComponent = 
                    view.type === 'table' ? Table :
                    view.type === 'kanban' ? Layout :
                    view.type === 'calendar' ? Calendar :
                    view.type === 'timeline' ? GanttChart :
                    view.type === 'chart' ? BarChart3 :
                    view.type === 'dashboard' ? Layout : Table;
                  
                  return (
                    <button
                      key={view.id}
                      onClick={() => handleViewChange(view.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        board.activeViewId === view.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`Switch to ${view.name}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{view.name}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setShowViewManager(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Add view"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowAutomationPanel(!showAutomationPanel)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                showAutomationPanel ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Manage automations"
            >
              <Zap className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowColumnManager(!showColumnManager)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                showColumnManager ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Manage columns"
            >
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
              <span>New Item</span>
            </button>
            
            {selectedItems.length > 0 && (
              <>
                <div className="h-6 w-px bg-gray-300"></div>
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

      {/* View Management Panel */}
      {showViewManager && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Add New View</h3>
            <button
              onClick={() => setShowViewManager(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { type: 'table' as ViewType, name: 'Table', icon: Table },
              { type: 'kanban' as ViewType, name: 'Kanban', icon: Layout },
              { type: 'calendar' as ViewType, name: 'Calendar', icon: Calendar },
              { type: 'timeline' as ViewType, name: 'Timeline', icon: GanttChart },
              { type: 'dashboard' as ViewType, name: 'Dashboard', icon: BarChart3 }
            ].map((viewType) => (
              <button
                key={viewType.type}
                onClick={() => {
                  handleAddView(`${viewType.name} View`, viewType.type);
                  setShowViewManager(false);
                }}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <viewType.icon className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{viewType.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Column Management Panel */}
      {showColumnManager && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Column Management</h3>
            <button
              onClick={() => setShowColumnManager(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {board.columns.map((column) => (
              <button
                key={column.id}
                onClick={() => handleToggleColumnFreeze(column.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  column.frozen
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {column.frozen ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
                <span>{column.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Automation Panel */}
      {showAutomationPanel && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Automations</h3>
            <button
              onClick={() => setShowAutomationPanel(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {board?.automations.map((automation) => (
              <div key={automation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className={`w-4 h-4 ${automation.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{automation.name}</h4>
                    <p className="text-xs text-gray-500">When {automation.trigger.type} in {automation.trigger.column}</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  {automation.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
              + Add automation
            </button>
          </div>
        </div>
      )}

      {/* Flexible Board Content */}
      {currentView === 'table' && (
        <div 
          ref={tableRef}
          className="bg-white overflow-x-auto scroll-smooth"
          onScroll={handleScroll}
          onKeyDown={handleKeyboardNavigation}
          tabIndex={0}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E1 #F1F5F9',
            scrollBehavior: 'smooth'
          }}
        >
        {/* Scroll Indicators */}
        {scrollPosition > 0 && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-white shadow-lg rounded-r-lg">
            <ChevronLeft className="w-6 h-6 text-gray-400 p-1" />
          </div>
        )}
        
        <div className="relative">
          {/* Table Header */}
          <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
            <div className="flex text-sm font-medium text-gray-600 min-w-max">
              {/* Sticky Checkbox Column */}
              <div 
                className="sticky left-0 z-30 w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200 bg-gray-50"
              >
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
              
              {/* All Columns with Conditional Sticky */}
              {board.columns.map((column, index) => {
                const frozenColumns = board.columns.filter(col => col.frozen);
                const isFrozen = column.frozen;
                const leftPosition = isFrozen ? getFrozenColumnLeft(frozenColumns.findIndex(col => col.id === column.id)) : undefined;
                
                return (
                  <div 
                    key={column.id}
                    className={`px-4 py-3 border-r border-gray-200 flex items-center justify-between group ${
                      isFrozen ? 'sticky z-20 bg-gray-50 shadow-sm' : ''
                    }`}
                    style={{ 
                      minWidth: `${column.width}px`, 
                      width: `${column.width}px`,
                      ...(isFrozen && leftPosition !== undefined ? { left: `${leftPosition}px` } : {})
                    }}
                  >
                    <span className="font-medium text-gray-900">{column.title}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleColumnFreeze(column.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                        title={column.frozen ? 'Unfreeze column' : 'Freeze column'}
                      >
                        {column.frozen ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                      </button>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity">
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* Actions Column */}
              <div className="w-16 px-3 py-3 text-center bg-gray-50">
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {board.items.map((item, itemIndex) => (
              <div key={item.id} className={`flex hover:bg-blue-50 group min-w-max transition-colors ${
                itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}>
                {/* Sticky Row Checkbox */}
                <div className="sticky left-0 z-10 w-12 px-3 py-3 flex items-center justify-center border-r border-gray-200 bg-inherit">
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
                
                {/* All Cells with Conditional Sticky */}
                {board.columns.map((column) => {
                  const frozenColumns = board.columns.filter(col => col.frozen);
                  const isFrozen = column.frozen;
                  const leftPosition = isFrozen ? getFrozenColumnLeft(frozenColumns.findIndex(col => col.id === column.id)) : undefined;
                  
                  return (
                    <div 
                      key={column.id}
                      className={`px-4 py-3 border-r border-gray-200 relative ${
                        isFrozen ? 'sticky z-10 bg-inherit shadow-sm' : ''
                      }`}
                      style={{ 
                        minWidth: `${column.width}px`, 
                        width: `${column.width}px`,
                        ...(isFrozen && leftPosition !== undefined ? { left: `${leftPosition}px` } : {})
                      }}
                    >
                      {editingCell?.itemId === item.id && editingCell?.columnId === column.id ? (
                        renderCellInput(item, column)
                      ) : (
                        <div
                          className="cursor-pointer rounded px-2 py-1 transition-colors hover:bg-blue-50 hover:ring-2 hover:ring-blue-200"
                          onClick={() => {
                            setEditingCell({ itemId: item.id, columnId: column.id });
                            setCellValue((item.data[column.id] || '').toString());
                          }}
                        >
                          {renderCellValue(item.data[column.id], column)}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Actions cell */}
                <div className="w-16 px-3 py-3 bg-inherit">
                  <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
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
      )}
      
      {/* Kanban View */}
      {currentView === 'kanban' && board && (
        <div className="bg-white p-6">
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {board.columns.filter(col => col.type === 'status').map((statusColumn) => (
              statusColumn.options?.map((status) => (
                <div key={status.value} className="flex-shrink-0 w-80">
                  <div className="bg-gray-50 rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-200" style={{ backgroundColor: status.color + '20' }}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{status.label}</h3>
                        <span className="text-xs text-gray-500">
                          {board.items.filter(item => item.data[statusColumn.id] === status.value).length}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3 min-h-[400px]">
                      {board.items
                        .filter(item => item.data[statusColumn.id] === status.value)
                        .map((item) => (
                          <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {item.data[board.columns.find(col => col.frozen)?.id || 'col-0']}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              {Object.entries(item.data).slice(0, 3).map(([key, value]) => {
                                const column = board.columns.find(col => col.id === key);
                                if (!column || column.type === 'status') return null;
                                return (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-500">{column.title}:</span>
                                    <span>{String(value)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))
                      }
                      <button className="w-full text-left text-gray-500 hover:text-gray-700 text-sm py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                        + Add item
                      </button>
                    </div>
                  </div>
                </div>
              )) || []
            ))}
          </div>
        </div>
      )}
      
      {/* Dashboard View */}
      {currentView === 'dashboard' && board && (
        <div className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Total Items</h3>
              <p className="text-3xl font-bold mt-2">{board.items.length}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Completed</h3>
              <p className="text-3xl font-bold mt-2">
                {board.items.filter(item => {
                  const statusCol = board.columns.find(col => col.type === 'status');
                  return statusCol && (item.data[statusCol.id] === 'done' || item.data[statusCol.id] === 'completed');
                }).length}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">In Progress</h3>
              <p className="text-3xl font-bold mt-2">
                {board.items.filter(item => {
                  const statusCol = board.columns.find(col => col.type === 'status');
                  return statusCol && (item.data[statusCol.id] === 'working' || item.data[statusCol.id] === 'active');
                }).length}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-sm font-medium opacity-90">Completion Rate</h3>
              <p className="text-3xl font-bold mt-2">
                {board.items.length > 0 ? Math.round(
                  (board.items.filter(item => {
                    const statusCol = board.columns.find(col => col.type === 'status');
                    return statusCol && (item.data[statusCol.id] === 'done' || item.data[statusCol.id] === 'completed');
                  }).length / board.items.length) * 100
                ) : 0}%
              </p>
            </div>
          </div>
          
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-500">Charts and detailed analytics coming soon</p>
          </div>
        </div>
      )}
      
      {/* Other Views Placeholder */}
      {(currentView === 'calendar' || currentView === 'timeline' || currentView === 'chart') && (
        <div className="bg-white p-6">
          <div className="text-center py-20">
            {currentView === 'calendar' && <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
            {currentView === 'timeline' && <GanttChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
            {currentView === 'chart' && <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
            <h3 className="text-lg font-medium text-gray-900 mb-2 capitalize">{currentView} View</h3>
            <p className="text-gray-500">{currentView} view coming soon with enhanced functionality</p>
          </div>
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleAddItem}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add item</span>
          </button>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-2">
              <span>View:</span>
              <span className="font-medium text-gray-700 capitalize">{currentView}</span>
            </span>
            
            {currentView === 'table' && (
              <>
                <span>Scroll: Use mouse wheel or Ctrl + ←/→</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (tableRef.current) {
                        tableRef.current.scrollLeft = Math.max(0, tableRef.current.scrollLeft - 200);
                      }
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={scrollPosition === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (tableRef.current) {
                        tableRef.current.scrollLeft += 200;
                      }
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
            
            {board && (
              <span className="text-blue-600">
                {board.items.length} items • {board.automations.length} automations
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}