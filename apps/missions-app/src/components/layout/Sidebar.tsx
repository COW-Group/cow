import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, 
  Briefcase,
  Plus,
  Star,
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  Phone,
  Building,
  Activity,
  UserX,
  Mail,
  Settings,
  Inbox,
  MoreHorizontal,
  FileText,
  Folder,
  Grid3x3,
  BarChart3,
  Calendar,
  Clock,
  Filter,
  Target,
  PieChart,
  Edit3,
  ArrowUpDown,
  ArrowRightLeft,
  BookTemplate,
  Trash2,
  TrendingUp,
  Zap,
  Eye,
  Award
} from 'lucide-react';
import { useAppStore, useWorkspaceStore } from '@/store';
import { Button } from '../ui/Button';
import { ManageWorkspacesModal } from '../modals/ManageWorkspacesModal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
  count?: number;
}

export function Sidebar() {
  const { 
    toggleSidebar,
    openModal
  } = useAppStore();
  
  const { workspaces } = useWorkspaceStore();
  
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Gold CRM');
  const [showManageWorkspaces, setShowManageWorkspaces] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [workspaceSearchQuery, setWorkspaceSearchQuery] = useState('');
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'main-workspace': true,
    'reports-folder': false
  });
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [workspaceItemsExpanded, setWorkspaceItemsExpanded] = useState(true);
  const [showWorkspaceContextMenu, setShowWorkspaceContextMenu] = useState<string | null>(null);
  const [showBrowseAll, setShowBrowseAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);


  // Recent items
  const recentItems = [
    { id: 'recent-board-1', label: 'Leads Board', icon: Grid3x3, type: 'board', workspace: 'Gold CRM' },
    { id: 'recent-board-2', label: 'Sales Pipeline', icon: BarChart3, type: 'dashboard', workspace: 'Gold CRM' },
    { id: 'recent-doc-1', label: 'Q4 Strategy Doc', icon: FileText, type: 'doc', workspace: 'Gold CRM' },
  ];

  // Favorite items with enhanced data
  const favoriteItems = [
    { id: 'fav-1', label: 'Main Board', icon: Grid3x3, starred: true, type: 'board', path: '/boards/main' },
    { id: 'fav-2', label: 'Team Calendar', icon: Calendar, starred: true, type: 'view', path: '/calendar' },
    { id: 'fav-3', label: 'Sales Dashboard', icon: BarChart3, starred: true, type: 'dashboard', path: '/insights/reporting/sales' },
  ];

  // Insights section items - Asana-style
  const insightsItems = [
    { 
      id: 'reporting', 
      label: 'Reporting', 
      icon: BarChart3, 
      path: '/insights/reporting',
      description: 'Track progress and analytics',
      children: [
        { id: 'dashboards', label: 'Dashboards', icon: PieChart, path: '/insights/reporting/dashboards' },
        { id: 'charts', label: 'Charts', icon: TrendingUp, path: '/insights/reporting/charts' },
        { id: 'universal-reporting', label: 'Universal Reporting', icon: Eye, path: '/insights/reporting/universal' }
      ]
    },
    { 
      id: 'portfolios', 
      label: 'Portfolios', 
      icon: Folder, 
      path: '/insights/portfolios',
      description: 'Manage project portfolios',
      children: [
        { id: 'my-portfolios', label: 'My Portfolios', icon: Briefcase, path: '/insights/portfolios/my' },
        { id: 'team-portfolios', label: 'Team Portfolios', icon: Users, path: '/insights/portfolios/team' },
        { id: 'portfolio-templates', label: 'Portfolio Templates', icon: BookTemplate, path: '/insights/portfolios/templates' }
      ]
    },
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: Target, 
      path: '/insights/goals',
      description: 'Set and track OKRs',
      children: [
        { id: 'my-goals', label: 'My Goals', icon: Award, path: '/insights/goals/my' },
        { id: 'team-goals', label: 'Team Goals', icon: Users, path: '/insights/goals/team' },
        { id: 'company-goals', label: 'Company Goals', icon: Building, path: '/insights/goals/company' }
      ]
    }
  ];

  // Helper function to toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // CRM-specific navigation items with proper structure
  const crmWorkspaceStructure = [
    {
      id: 'main-workspace',
      label: 'Main Workspace',
      type: 'folder',
      icon: Folder,
      children: [
        { id: 'leads', label: 'Leads', icon: Grid3x3, type: 'board', count: 12 },
        { id: 'deals', label: 'Deals', icon: Grid3x3, type: 'board', count: 8 },
        { id: 'contacts', label: 'Contacts', icon: Grid3x3, type: 'board', count: 156 },
        { id: 'accounts', label: 'Accounts', icon: Grid3x3, type: 'board', count: 24 },
      ]
    },
    {
      id: 'reports-folder',
      label: 'Reports & Dashboards',
      type: 'folder',
      icon: Folder,
      children: [
        { id: 'sales-dashboard', label: 'Sales Dashboard', icon: BarChart3, type: 'dashboard' },
        { id: 'performance-report', label: 'Performance Report', icon: PieChart, type: 'report' },
      ]
    },
    { id: 'activities', label: 'Activities', icon: Activity, type: 'board', count: 3 },
    { id: 'email-template', label: 'Email Template', icon: Mail, type: 'doc' },
  ];

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'my-work', label: 'My work', icon: Briefcase, path: '/my-work' },
    { id: 'more', label: 'More', icon: MoreHorizontal, path: '/more' },
  ];

  // Create new items dropdown
  const createItems = [
    { id: 'workspace', label: 'Workspace', icon: Building, description: 'Create a new workspace' },
    { id: 'board', label: 'Board', icon: Grid3x3, description: 'Create a new board' },
    { id: 'doc', label: 'Doc', icon: FileText, description: 'Create a new document' },
    { id: 'folder', label: 'Folder', icon: Folder, description: 'Create a new folder' },
  ];

  // Enhanced workspace data with collaboration info
  const subscribedWorkspaces = workspaces.filter(w => w.type === 'team' || w.type === 'personal');
  const collaborativeWorkspaces = [
    {
      id: 'collab-1',
      name: 'Marketing Team Boards',
      description: 'Limited access to specific boards',
      color: 'bg-pink-500',
      type: 'collaborative' as const,
      memberCount: 8,
      accessLevel: 'boards-only',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Filter workspaces based on search query
  const filteredSubscribedWorkspaces = subscribedWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearchQuery.toLowerCase())
  );
  const filteredCollaborativeWorkspaces = collaborativeWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(workspaceSearchQuery.toLowerCase())
  );

  // Workspace management actions
  const workspaceContextActions = [
    { id: 'edit', label: 'Edit workspace', icon: Edit3, action: (id: string) => console.log('Edit workspace', id) },
    { id: 'sort', label: 'Sort workspace', icon: ArrowUpDown, action: (id: string) => console.log('Sort workspace', id) },
    { id: 'move', label: 'Move workspace', icon: ArrowRightLeft, action: (id: string) => console.log('Move workspace', id) },
    { id: 'template', label: 'Save as template', icon: BookTemplate, action: (id: string) => console.log('Save as template', id) },
    { id: 'manage', label: 'Manage workspace', icon: Settings, action: (id: string) => setShowManageWorkspaces(true) },
    { id: 'delete', label: 'Delete workspace', icon: Trash2, action: (id: string) => console.log('Delete workspace', id), danger: true },
  ];

  const handleCreateItem = (itemType: string) => {
    setShowAddDropdown(false);
    switch (itemType) {
      case 'workspace':
        setShowManageWorkspaces(true);
        break;
      case 'board':
        openModal('create-board');
        break;
      case 'doc':
        openModal('create-doc');
        break;
      case 'folder':
        openModal('create-folder');
        break;
      default:
        break;
    }
  };

  const handleWorkspaceRightClick = (e: React.MouseEvent, workspaceId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWorkspaceContextMenu(workspaceId);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target as Node)) {
        setShowWorkspaceDropdown(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowWorkspaceContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const location = useLocation();

  const NavItem = ({ item, isActive = false, onClick }: { 
    item: any; 
    isActive?: boolean;
    onClick?: () => void;
  }) => {
    const Icon = item.icon;
    
    if (item.path) {
      return (
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.label}</span>
          {item.count !== undefined && (
            <span className="ml-auto text-xs text-gray-500">
              {item.count}
            </span>
          )}
        </NavLink>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.count !== undefined && (
          <span className="ml-auto text-xs text-gray-500">
            {item.count}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="flex h-full w-80 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Simple Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm mb-2">
          G
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Recent */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setRecentExpanded(!recentExpanded)}
              className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 -m-1"
            >
              {recentExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )}
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Recent
              </h3>
            </button>
          </div>
          {recentExpanded && (
            <div className="space-y-1">
              {recentItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Favorites - Enhanced Asana-style */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
              className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 -m-1 group"
            >
              <motion.div
                animate={{ rotate: favoritesExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </motion.div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-200">
                Favorites
              </h3>
            </button>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">{favoriteItems.length}</span>
            </div>
          </div>
          <AnimatePresence>
            {favoritesExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {favoriteItems.length > 0 ? (
                  favoriteItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path || '#'}
                        className={({ isActive }) =>
                          `group flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                        <span className="truncate flex-1">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.type && (
                            <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                          )}
                          <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" fill="currentColor" />
                        </div>
                      </NavLink>
                    );
                  })
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4 px-2">
                    <Star className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                    <p>Star items to access them quickly</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Insights Section - Asana-style */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setInsightsExpanded(!insightsExpanded)}
              className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 -m-1 group"
            >
              <motion.div
                animate={{ rotate: insightsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </motion.div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-200">
                Insights
              </h3>
            </button>
            <Zap className="h-3 w-3 text-gray-400" />
          </div>
          <AnimatePresence>
            {insightsExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {insightsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="group">
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-2 py-2 text-sm rounded transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`
                        }
                      >
                        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                        </div>
                        <ChevronRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </NavLink>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Workspaces Dropdown Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Workspaces</h2>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Current Workspace Selector with + Button */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1" ref={workspaceDropdownRef}>
              <button
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{selectedWorkspace}</div>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showWorkspaceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Workspace Dropdown Interface */}
              {showWorkspaceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 p-4" style={{minHeight: '400px'}}>
                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={workspaceSearchQuery}
                      onChange={(e) => setWorkspaceSearchQuery(e.target.value)}
                      placeholder="Search for a workspace"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Subscribed Workspaces Section */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">
                      My workspaces ({filteredSubscribedWorkspaces.length})
                    </h3>
                    <div className="space-y-1">
                      {filteredSubscribedWorkspaces.map((workspace) => (
                        <div key={workspace.id} className="relative">
                          <button
                            onClick={() => {
                              setSelectedWorkspace(workspace.name);
                              setShowWorkspaceDropdown(false);
                            }}
                            onContextMenu={(e) => handleWorkspaceRightClick(e, workspace.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              selectedWorkspace === workspace.name 
                                ? 'bg-blue-600 text-white' 
                                : 'hover:bg-gray-700 text-gray-100'
                            }`}
                          >
                            <div className={`w-8 h-8 ${selectedWorkspace === workspace.name ? 'bg-blue-500' : workspace.color} rounded-lg flex items-center justify-center text-white text-sm font-semibold`}>
                              {workspace.id === '2' ? (
                                <Home className="h-4 w-4" />
                              ) : (
                                workspace.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{workspace.name}</div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWorkspaceRightClick(e, workspace.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </button>
                          </button>
                          
                          {/* Context Menu */}
                          {showWorkspaceContextMenu === workspace.id && (
                            <div 
                              ref={contextMenuRef}
                              className="absolute right-0 top-0 mt-1 w-56 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-60 py-2"
                            >
                              {workspaceContextActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                  <button
                                    key={action.id}
                                    onClick={() => {
                                      action.action(workspace.id);
                                      setShowWorkspaceContextMenu(null);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                                      action.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-100'
                                    }`}
                                  >
                                    <Icon className="h-4 w-4" />
                                    {action.label}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaborative Workspaces Section */}
                  {filteredCollaborativeWorkspaces.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        Workspaces I collaborate on ({filteredCollaborativeWorkspaces.length})
                      </h3>
                      <div className="space-y-1">
                        {filteredCollaborativeWorkspaces.map((workspace) => (
                          <button
                            key={workspace.id}
                            onClick={() => {
                              setSelectedWorkspace(workspace.name);
                              setShowWorkspaceDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-700 text-gray-100"
                          >
                            <div className={`w-8 h-8 ${workspace.color} rounded-lg flex items-center justify-center text-white text-sm font-semibold`}>
                              {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{workspace.name}</div>
                              <div className="text-xs text-gray-400">Limited access</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <button
                      onClick={() => {
                        setShowManageWorkspaces(true);
                        setShowWorkspaceDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add workspace</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowBrowseAll(true);
                        setShowWorkspaceDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Grid3x3 className="h-4 w-4" />
                      <span>Browse all</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* + Button */}
            <button
              onClick={() => setShowManageWorkspaces(true)}
              className="p-3 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Current Workspace Content - Enhanced */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setWorkspaceItemsExpanded(!workspaceItemsExpanded)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 -m-1 group flex-1"
            >
              <motion.div
                animate={{ rotate: workspaceItemsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
              </motion.div>
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100">{selectedWorkspace}</h3>
              <div className="flex items-center gap-2">
                {/* Member avatars stack */}
                <div className="flex items-center -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">L</span>
                  </div>
                  <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">A</span>
                  </div>
                  <div className="w-5 h-5 bg-purple-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">M</span>
                  </div>
                  <div className="w-5 h-5 bg-gray-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">+2</span>
                  </div>
                </div>
              </div>
            </button>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Search className="h-3 w-3 text-gray-400" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                
                {/* Add Dropdown */}
                {showAddDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      {createItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleCreateItem(item.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Icon className="h-4 w-4 text-gray-500" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Filter className="h-3 w-3 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Workspace Structure */}
          <AnimatePresence>
            {workspaceItemsExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                {crmWorkspaceStructure.map((item) => {
                  const Icon = item.icon;
                  
                  if (item.type === 'folder' && item.children) {
                    const isExpanded = expandedFolders[item.id];
                    return (
                      <div key={item.id} className="space-y-1">
                        <button 
                          onClick={() => toggleFolder(item.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <motion.div
                            animate={{ rotate: isExpanded ? 0 : -90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          </motion.div>
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-5 space-y-1 overflow-hidden"
                            >
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;
                                return (
                                  <button
                                    key={child.id}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <ChildIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                    <span className="truncate">{child.label}</span>
                                    {child.count !== undefined && (
                                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                        {child.count}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  } else {
                    return (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="ml-auto text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  }
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-600 dark:text-gray-400"
          onClick={() => setShowManageWorkspaces(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage workspaces
        </Button>
      </div>

      {/* Manage Workspaces Modal */}
      <ManageWorkspacesModal
        isOpen={showManageWorkspaces}
        onClose={() => setShowManageWorkspaces(false)}
      />
    </aside>
  );
}