import React, { useState, useRef, useEffect } from 'react';
import { 
  House, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronDown,
  Search, 
  Plus,
  FileText,
  Layout,
  Edit,
  Folder,
  Download,
  Upload,
  Star,
  Settings,
  Trash2,
  Grid3X3,
  Archive,
  Info,
  ArrowRight,
  Save,
  Building,
  Users,
  Clock,
  Mail,
  Tag,
  Activity
} from 'lucide-react';
import { Workspace, Board } from '../../types/dashboard';

interface DashboardSidebarProps {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  onWorkspaceChange: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
  className?: string;
}

export function DashboardSidebar({ 
  workspaces, 
  currentWorkspace, 
  onWorkspaceChange,
  onCreateWorkspace,
  className 
}: DashboardSidebarProps) {
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [addNewMenuOpen, setAddNewMenuOpen] = useState(false);
  const [manageMenuOpen, setManageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [crmBoardsSubmenuOpen, setCrmBoardsSubmenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const manageMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setWorkspaceDropdownOpen(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setAddNewMenuOpen(false);
        setCrmBoardsSubmenuOpen(false);
      }
      if (manageMenuRef.current && !manageMenuRef.current.contains(event.target as Node)) {
        setManageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: House, 
      active: false, 
      iconColor: 'text-teal-500' 
    },
    { 
      id: 'my-work', 
      label: 'My Work', 
      icon: MoreHorizontal, 
      active: true, 
      iconColor: 'text-white' 
    },
    { 
      id: 'more', 
      label: 'More', 
      icon: MoreHorizontal, 
      active: false, 
      iconColor: 'text-gray-400' 
    }
  ];

  const boardIcons: Record<string, any> = {
    'leads': { icon: Users, color: 'text-teal-500' },
    'deals': { icon: Tag, color: 'text-yellow-500' },
    'contacts': { icon: Users, color: 'text-green-500' },
    'accounts': { icon: Building, color: 'text-red-500' },
    'projects': { icon: Activity, color: 'text-purple-500' },
    'activities': { icon: Clock, color: 'text-blue-500' },
    'email-template': { icon: Mail, color: 'text-orange-500' }
  };

  const addNewItems = [
    { 
      id: 'crm-boards', 
      label: 'CRM boards', 
      icon: Users, 
      iconColor: 'bg-teal-500',
      hasSubmenu: true 
    },
    { id: 'board', label: 'Board', icon: Grid3X3, iconColor: 'bg-blue-500' },
    { id: 'doc', label: 'Doc', icon: FileText, iconColor: 'bg-green-500' },
    { id: 'dashboard', label: 'Dashboard', icon: Layout, iconColor: 'bg-purple-500' },
    { id: 'form', label: 'Form', icon: Edit, iconColor: 'bg-orange-500' },
    { id: 'folder', label: 'Folder', icon: Folder, iconColor: 'bg-gray-500' }
  ];

  const manageItems = [
    { id: 'edit', label: 'Edit workspace', icon: Edit },
    { id: 'sort', label: 'Sort workspace', icon: ArrowRight },
    { id: 'move', label: 'Move workspace', icon: ArrowRight },
    { id: 'save', label: 'Save as template', icon: Save },
    { id: 'delete', label: 'Delete workspace', icon: Trash2, danger: true },
    { type: 'separator' },
    { id: 'add', label: 'Add new workspace', icon: Plus },
    { id: 'browse', label: 'Browse all workspaces', icon: Grid3X3 },
    { id: 'archive', label: 'View archive/trash', icon: Archive },
    { id: 'overview', label: 'COW CRM overview', icon: Info }
  ];

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 p-4 overflow-y-auto ${className}`}>
      {/* Top Navigation */}
      <nav className="mb-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                    item.active
                      ? 'bg-yellow-400 text-black shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${item.active ? 'text-black' : item.iconColor}`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Favorites Section */}
      <div className="mb-6">
        <button
          onClick={() => setFavoritesExpanded(!favoritesExpanded)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg p-2 hover:bg-gray-800/50"
        >
          <ChevronRight 
            className={`h-4 w-4 transition-transform ${favoritesExpanded ? 'rotate-90' : ''}`} 
          />
          Favorites
        </button>
        {favoritesExpanded && (
          <div className="mt-2 ml-6 text-sm text-gray-400">
            No favorites yet
          </div>
        )}
      </div>

      {/* Workspace Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search for a workspace"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Workspace Dropdown */}
      <div className="mb-6 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-800/50 backdrop-blur-md rounded-lg hover:bg-gray-700/50 transition-all border border-gray-700"
          >
            <div className="h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-black">C</span>
            </div>
            <span className="text-sm font-bold text-white flex-1 text-left">
              {currentWorkspace?.name || 'COW CRM'}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setAddNewMenuOpen(!addNewMenuOpen)}
              className="p-2 text-gray-400 hover:text-yellow-400 transition-colors hover:bg-gray-800/50 rounded-lg"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* Add New Menu */}
            {addNewMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-800 py-2 z-50">
                {addNewItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="relative">
                      <button
                        onMouseEnter={() => item.id === 'crm-boards' && setCrmBoardsSubmenuOpen(true)}
                        onMouseLeave={() => item.id === 'crm-boards' && setCrmBoardsSubmenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      >
                        <div className={`h-6 w-6 ${item.iconColor} rounded flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {item.label}
                        {item.hasSubmenu && (
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        )}
                      </button>

                      {/* CRM Boards Submenu */}
                      {item.id === 'crm-boards' && crmBoardsSubmenuOpen && (
                        <div className="absolute left-full top-0 ml-1 w-56 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-800 py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-gray-800">
                            Core CRM boards
                          </div>
                          {currentWorkspace?.boards.map((board) => (
                            <div key={board.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-800/50">
                              <span className="text-sm text-gray-300">{board.name}</span>
                              <button
                                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                                  board.enabled ? 'bg-yellow-400' : 'bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    board.enabled ? 'translate-x-4' : 'translate-x-0.5'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="border-t border-gray-800 mt-2 pt-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors">
                    <Download className="h-4 w-4" />
                    Installed apps
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors">
                    <Upload className="h-4 w-4" />
                    Import data
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors">
                    <Star className="h-4 w-4" />
                    Template center
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Dropdown Menu */}
        {workspaceDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-lg border border-gray-800 py-2 z-40">
            <div className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search workspaces"
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-800/50 backdrop-blur-md text-white placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                />
              </div>
            </div>
            <div className="px-3 py-1">
              <h4 className="text-xs font-semibold text-gray-400 mb-2">
                My Workspaces
              </h4>
              {filteredWorkspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    onWorkspaceChange(workspace);
                    setWorkspaceDropdownOpen(false);
                  }}
                  onContextMenu={() => setManageMenuOpen(true)}
                  className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
                >
                  <div className={`h-5 w-5 ${workspace.iconColor === 'teal' ? 'bg-yellow-400' : 'bg-purple-500'} rounded-full flex items-center justify-center`}>
                    <span className="text-xs font-semibold text-white">
                      {workspace.name === 'Likhitha Palaypu Vibes' ? 'L' : workspace.name.charAt(0)}
                    </span>
                  </div>
                  {workspace.name}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-800 mt-2 pt-2 px-3">
              <button
                onClick={onCreateWorkspace}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-yellow-400 hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add workspace
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors">
                Browse all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Board List */}
      <div className="space-y-2">
        {currentWorkspace?.boards.filter(board => board.enabled).map((board) => {
          const boardIcon = boardIcons[board.type];
          const Icon = boardIcon?.icon || Grid3X3;
          return (
            <button
              key={board.id}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-all"
            >
              <Icon className={`h-4 w-4 ${boardIcon?.color || 'text-gray-500'}`} />
              {board.name}
              {board.itemCount && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full"
                  {board.itemCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Manage Workspace Menu */}
      {manageMenuOpen && (
        <div 
          ref={manageMenuRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md"
          onClick={() => setManageMenuOpen(false)}
        >
          <div 
            className="w-52 bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-800 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {manageItems.map((item, index) => {
              if (item.type === 'separator') {
                return <div key={index} className="border-t border-gray-800 my-2" />;
              }
              
              const Icon = item.icon!;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800/50 transition-colors ${
                    item.danger ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}