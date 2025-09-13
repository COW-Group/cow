import React, { useState, useCallback, useMemo } from 'react';
import { 
  Plus, 
  Settings, 
  Filter, 
  Star,
  Download,
  MoreHorizontal,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Calendar,
  BarChart3,
  Table,
  Kanban,
  Layout,
  Columns
} from 'lucide-react';
import { COWBoard, BoardViewType, ComponentType } from '../../types/board.types';

// Flexible Board Architecture based on Monday.com principles
export interface FlexibleBoardColumn {
  id: string;
  title: string;
  type: ComponentType;
  width: number;
  visible: boolean;
  frozen?: boolean;
  required?: boolean;
  options?: FlexibleColumnOption[];
  settings?: FlexibleColumnSettings;
}

export interface FlexibleColumnOption {
  id: string;
  label: string;
  color?: string;
  value?: any;
}

export interface FlexibleColumnSettings {
  showInCard?: boolean;
  allowMultiple?: boolean;
  defaultValue?: any;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FlexibleBoardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'crm' | 'hr' | 'marketing' | 'custom';
  columns: Omit<FlexibleBoardColumn, 'id'>[];
  defaultView: BoardViewType;
  sampleData?: any[];
  automations?: FlexibleAutomation[];
}

export interface FlexibleAutomation {
  id: string;
  name: string;
  trigger: 'status_change' | 'date_arrives' | 'column_changes' | 'item_created';
  conditions?: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
}

export interface AutomationCondition {
  column: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  value: any;
}

export interface AutomationAction {
  type: 'change_status' | 'assign_person' | 'send_notification' | 'create_item';
  parameters: Record<string, any>;
}

// Flexible Board Templates - Monday.com style
const FLEXIBLE_BOARD_TEMPLATES: FlexibleBoardTemplate[] = [
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Manage projects, tasks, and deliverables',
    category: 'project',
    defaultView: 'table',
    columns: [
      { title: 'Task', type: 'text-picker', width: 200, visible: true, required: true, frozen: true },
      { title: 'Status', type: 'status-picker', width: 130, visible: true, options: [
        { id: 'not-started', label: 'Not Started', color: '#c4c4c4' },
        { id: 'working', label: 'Working on it', color: '#fdab3d' },
        { id: 'stuck', label: 'Stuck', color: '#e2445c' },
        { id: 'done', label: 'Done', color: '#00c875' }
      ]},
      { title: 'Priority', type: 'priority-picker', width: 110, visible: true },
      { title: 'Owner', type: 'assignee-picker', width: 140, visible: true },
      { title: 'Due Date', type: 'date-picker', width: 130, visible: true },
      { title: 'Progress', type: 'progress-picker', width: 150, visible: true },
      { title: 'Budget', type: 'number-picker', width: 120, visible: false },
      { title: 'Files', type: 'file-picker', width: 100, visible: false },
      { title: 'Notes', type: 'text-picker', width: 200, visible: false }
    ],
    sampleData: [
      { Task: 'Setup project structure', Status: 'done', Priority: 'High', Owner: 'john-doe', 'Due Date': '2024-10-15', Progress: 100 },
      { Task: 'Design wireframes', Status: 'working', Priority: 'High', Owner: 'jane-smith', 'Due Date': '2024-10-20', Progress: 60 },
      { Task: 'Development sprint 1', Status: 'not-started', Priority: 'Medium', Owner: 'bob-jones', 'Due Date': '2024-11-01', Progress: 0 }
    ]
  },
  {
    id: 'crm-leads',
    name: 'CRM Lead Management',
    description: 'Track leads and manage sales pipeline',
    category: 'crm',
    defaultView: 'table',
    columns: [
      { title: 'Lead Name', type: 'text-picker', width: 180, visible: true, required: true, frozen: true },
      { title: 'Company', type: 'text-picker', width: 150, visible: true, frozen: true },
      { title: 'Status', type: 'status-picker', width: 130, visible: true, options: [
        { id: 'new', label: 'New Lead', color: '#579bfc' },
        { id: 'contacted', label: 'Contacted', color: '#fdab3d' },
        { id: 'qualified', label: 'Qualified', color: '#9cd326' },
        { id: 'proposal', label: 'Proposal Sent', color: '#ff5c5c' },
        { id: 'won', label: 'Won', color: '#00c875' },
        { id: 'lost', label: 'Lost', color: '#e2445c' }
      ]},
      { title: 'Priority', type: 'priority-picker', width: 110, visible: true },
      { title: 'Owner', type: 'assignee-picker', width: 140, visible: true },
      { title: 'Contact Info', type: 'text-picker', width: 180, visible: true },
      { title: 'Deal Value', type: 'number-picker', width: 120, visible: true },
      { title: 'Close Date', type: 'date-picker', width: 130, visible: true },
      { title: 'Progress', type: 'progress-picker', width: 150, visible: true }
    ]
  },
  {
    id: 'hr-recruiting',
    name: 'HR Recruitment',
    description: 'Manage candidates and hiring process',
    category: 'hr',
    defaultView: 'table',
    columns: [
      { title: 'Candidate', type: 'text-picker', width: 180, visible: true, required: true, frozen: true },
      { title: 'Position', type: 'text-picker', width: 150, visible: true, frozen: true },
      { title: 'Status', type: 'status-picker', width: 130, visible: true, options: [
        { id: 'applied', label: 'Applied', color: '#579bfc' },
        { id: 'screening', label: 'Screening', color: '#fdab3d' },
        { id: 'interview', label: 'Interview', color: '#ff5c5c' },
        { id: 'reference', label: 'Reference Check', color: '#9cd326' },
        { id: 'offer', label: 'Offer Extended', color: '#bb3354' },
        { id: 'hired', label: 'Hired', color: '#00c875' },
        { id: 'rejected', label: 'Rejected', color: '#e2445c' }
      ]},
      { title: 'Priority', type: 'priority-picker', width: 110, visible: true },
      { title: 'Recruiter', type: 'assignee-picker', width: 140, visible: true },
      { title: 'Interview Date', type: 'date-picker', width: 130, visible: true },
      { title: 'Salary Expectation', type: 'number-picker', width: 140, visible: true },
      { title: 'Score', type: 'progress-picker', width: 150, visible: true }
    ]
  },
  {
    id: 'marketing-campaigns',
    name: 'Marketing Campaigns',
    description: 'Track marketing campaigns and performance',
    category: 'marketing',
    defaultView: 'table',
    columns: [
      { title: 'Campaign', type: 'text-picker', width: 200, visible: true, required: true, frozen: true },
      { title: 'Status', type: 'status-picker', width: 130, visible: true, options: [
        { id: 'planning', label: 'Planning', color: '#579bfc' },
        { id: 'active', label: 'Active', color: '#00c875' },
        { id: 'paused', label: 'Paused', color: '#fdab3d' },
        { id: 'completed', label: 'Completed', color: '#9cd326' },
        { id: 'cancelled', label: 'Cancelled', color: '#e2445c' }
      ]},
      { title: 'Priority', type: 'priority-picker', width: 110, visible: true },
      { title: 'Manager', type: 'assignee-picker', width: 140, visible: true },
      { title: 'Budget', type: 'number-picker', width: 120, visible: true },
      { title: 'Start Date', type: 'date-picker', width: 130, visible: true },
      { title: 'End Date', type: 'date-picker', width: 130, visible: true },
      { title: 'Performance', type: 'progress-picker', width: 150, visible: true }
    ]
  }
];

// View configuration options
const VIEW_TYPES: { id: BoardViewType; name: string; icon: React.ComponentType<any>; description: string }[] = [
  { id: 'table', name: 'Main Table', icon: Table, description: 'Classic spreadsheet view with all your data' },
  { id: 'kanban', name: 'Kanban', icon: Columns, description: 'Visual cards organized by status or any column' },
  { id: 'timeline', name: 'Timeline', icon: Calendar, description: 'Gantt-style timeline view for project planning' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'See your items on a calendar by date columns' },
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, description: 'High-level overview with charts and metrics' }
];

export function FlexibleBoard() {
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<FlexibleBoardTemplate | null>(null);
  const [board, setBoard] = useState<COWBoard | null>(null);
  const [currentView, setCurrentView] = useState<BoardViewType>('table');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [showViewSelector, setShowViewSelector] = useState(false);

  const createBoardFromTemplate = useCallback((template: FlexibleBoardTemplate) => {
    const columns: FlexibleBoardColumn[] = template.columns.map((col, index) => ({
      ...col,
      id: `col-${index}`
    }));

    // Create sample items from template data
    const items = template.sampleData || [];
    
    setSelectedTemplate(template);
    setCurrentView(template.defaultView);
    setShowTemplateSelector(false);
    
    // Here you would typically create the actual board object
    // For now, we'll set it to null and show the main interface
    setBoard(null);
  }, []);

  const handleColumnVisibilityToggle = useCallback((columnId: string) => {
    if (selectedTemplate) {
      const updatedColumns = selectedTemplate.columns.map(col =>
        col.title === columnId ? { ...col, visible: !col.visible } : col
      );
      setSelectedTemplate({
        ...selectedTemplate,
        columns: updatedColumns
      });
    }
  }, [selectedTemplate]);

  const handleColumnFreeze = useCallback((columnId: string) => {
    if (selectedTemplate) {
      const updatedColumns = selectedTemplate.columns.map(col =>
        col.title === columnId ? { ...col, frozen: !col.frozen } : col
      );
      setSelectedTemplate({
        ...selectedTemplate,
        columns: updatedColumns
      });
    }
  }, [selectedTemplate]);

  const visibleColumns = useMemo(() => {
    return selectedTemplate?.columns.filter(col => col.visible) || [];
  }, [selectedTemplate]);

  const frozenColumns = useMemo(() => {
    return visibleColumns.filter(col => col.frozen);
  }, [visibleColumns]);

  // Template selector interface
  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Choose Your Board Template</h2>
            <p className="text-gray-600 mt-2">Select a template that matches your workflow. You can always customize it later.</p>
          </div>
          
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FLEXIBLE_BOARD_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => createBoardFromTemplate(template)}
                  className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {template.name}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mt-2">
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{template.columns.length} columns</span>
                      <span>Default: {template.defaultView}</span>
                      {template.sampleData && <span>{template.sampleData.length} sample items</span>}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1">
                    {template.columns.slice(0, 4).map((col, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {col.title}
                      </span>
                    ))}
                    {template.columns.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{template.columns.length - 4} more
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Don't see what you need? You can create a custom board from scratch.
              </p>
              <button
                onClick={() => createBoardFromTemplate(FLEXIBLE_BOARD_TEMPLATES[0])}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Start with Project Management
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main board interface with flexibility controls
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Flexibility Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {selectedTemplate?.name || 'Flexible Board'}
              </h1>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {selectedTemplate?.category}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowViewSelector(!showViewSelector)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  {React.createElement(VIEW_TYPES.find(v => v.id === currentView)?.icon || Table, { className: 'w-4 h-4' })}
                  <span>{VIEW_TYPES.find(v => v.id === currentView)?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showViewSelector && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {VIEW_TYPES.map((viewType) => (
                      <button
                        key={viewType.id}
                        onClick={() => {
                          setCurrentView(viewType.id);
                          setShowViewSelector(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                          currentView === viewType.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <viewType.icon className="w-5 h-5 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">{viewType.name}</div>
                            <div className="text-sm text-gray-500">{viewType.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Column Manager */}
              <button
                onClick={() => setShowColumnManager(!showColumnManager)}
                className={`p-2 rounded-lg font-medium transition-colors ${
                  showColumnManager ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Manage columns"
              >
                <Layout className="w-5 h-5" />
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Column Management Panel */}
      {showColumnManager && selectedTemplate && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Manage Columns</h3>
            <button
              onClick={() => setShowColumnManager(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedTemplate.columns.map((column, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => handleColumnVisibilityToggle(column.title)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">{column.title}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleColumnFreeze(column.title)}
                    className={`p-1 rounded transition-colors ${
                      column.frozen ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={column.frozen ? 'Unfreeze column' : 'Freeze column'}
                  >
                    {column.frozen ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>Pro tip:</strong> Freeze important columns to keep them visible while scrolling. 
              Toggle column visibility to customize your view.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6">
        {selectedTemplate ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="text-center py-12">
                <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your Flexible Board is Ready!
                </h3>
                <p className="text-gray-600 mb-6">
                  Template: <strong>{selectedTemplate.name}</strong> with {visibleColumns.length} visible columns
                  {frozenColumns.length > 0 && <span> ({frozenColumns.length} frozen)</span>}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {visibleColumns.map((col, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        col.frozen 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {col.frozen && <Pin className="w-3 h-3 inline mr-1" />}
                      {col.title}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Choose Different Template
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Select a template to get started with your flexible board.</p>
          </div>
        )}
      </div>
    </div>
  );
}