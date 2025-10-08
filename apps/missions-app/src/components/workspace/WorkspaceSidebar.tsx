import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Star,
  Folder,
  FolderOpen,
  Grid3x3,
  BarChart3,
  FileText,
  Settings,
  Users,
  MoreHorizontal,
  Home,
  Target,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Eye,
  Award,
  PieChart,
  Briefcase,
  Building,
  Bot,
  Activity,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Workspace, Folder as WorkspaceFolder, WorkspaceBoard } from '../../types/workspace.types';
import { workspaceService } from '../../services/workspace.service';
import { useBoardStore } from '../../store/board.store';
import { WorkspaceManagementModal } from './WorkspaceManagementModal';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { AddItemDropdown, CreateItemType } from './AddItemDropdown';
import { CreateItemModal } from './CreateItemModal';
import { ItemContextMenu } from './ItemContextMenu';
import { useNavigate } from 'react-router-dom';
import { useTeamStore } from '../../store/team.store';
import { useAgentStore } from '../../store/agent.store';
import { useMaunAppsStore } from '../../store/maun-apps.store';
import { useAppStore } from '../../store';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAdaptiveColors } from '../../hooks/useAdaptiveColors';

interface WorkspaceSidebarProps {
  currentWorkspaceId?: string;
  onWorkspaceChange?: (workspaceId: string) => void;
  onBoardSelect?: (boardId: string) => void;
}

export function WorkspaceSidebar({
  currentWorkspaceId,
  onWorkspaceChange,
  onBoardSelect
}: WorkspaceSidebarProps) {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const { colors, backgroundBrightness } = useAdaptiveColors();
  const { teams, currentTeam, setCurrentTeam } = useTeamStore();
  const { getAgents, getAgentsByStatus, startAgent, stopAgent } = useAgentStore();
  const { initializeApps } = useMaunAppsStore();
  const { openModal, currentUser } = useAppStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [starredBoards, setStarredBoards] = useState<WorkspaceBoard[]>([]);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [createItemType, setCreateItemType] = useState<CreateItemType | null>(null);
  const [targetFolder, setTargetFolder] = useState<WorkspaceFolder | undefined>();
  
  // Asana-style enhancements
  const [favoritesExpanded, setFavoritesExpanded] = useState(true);
  const [insightsExpanded, setInsightsExpanded] = useState(true);
  const [workspaceItemsExpanded, setWorkspaceItemsExpanded] = useState(true);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [teamsExpanded, setTeamsExpanded] = useState(true);
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  
  // Insights section items - Asana-style
  const insightsItems = [
    { 
      id: 'reporting', 
      label: 'Reporting', 
      icon: BarChart3, 
      path: '/insights/reporting',
      description: 'Track progress and analytics',
      color: 'icon-adaptive-secondary'
    },
    { 
      id: 'portfolios', 
      label: 'Portfolios', 
      icon: Briefcase, 
      path: '/insights/portfolios',
      description: 'Manage project portfolios',
      color: 'icon-adaptive-secondary'
    },
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: Target, 
      path: '/insights/goals',
      description: 'Set and track OKRs',
      color: 'icon-adaptive-secondary'
    }
  ];
  
  // Recent items
  const recentItems = [
    { id: 'recent-1', name: 'Latest Board', icon: Grid3x3, path: '/boards/latest', color: '#3B82F6' },
    { id: 'recent-2', name: 'Team Dashboard', icon: BarChart3, path: '/insights/reporting', color: '#10B981' },
    { id: 'recent-3', name: 'Q4 Goals', icon: Target, path: '/insights/goals', color: '#8B5CF6' },
  ];

  useEffect(() => {
    const loadWorkspaceData = async () => {
      // Load workspaces from Supabase first
      await workspaceService.loadWorkspacesFromSupabase();

      // Then sync with COW boards
      await workspaceService.syncWithCOWBoards();

      // Load workspaces
      const allWorkspaces = workspaceService.getAllWorkspaces();
      setWorkspaces(allWorkspaces);

      // Set current workspace - prefer emoji workspace or use first available
      const current = currentWorkspaceId
        ? allWorkspaces.find(w => w.id === currentWorkspaceId) || allWorkspaces[0]
        : allWorkspaces.find(w => w.name.includes('🐮')) || allWorkspaces[0];
      
      setCurrentWorkspace(current);

      // Update current workspace ID in parent component
      if (current && onWorkspaceChange) {
        onWorkspaceChange(current.id);
      }

      // Load starred boards
      setStarredBoards(workspaceService.getStarredBoards());
    };

    loadWorkspaceData();

    // Initialize apps on first load
    initializeApps();
  }, [currentWorkspaceId, initializeApps]);


  const handleFolderToggle = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (expandedFolders.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);

    // Update folder collapsed state in service
    if (currentWorkspace) {
      workspaceService.toggleFolderCollapse(currentWorkspace.id, folderId);
    }
  };

  const handleBoardClick = (board: WorkspaceBoard) => {
    navigate(`/app/boards/${board.id}`);
    onBoardSelect?.(board.id);
  };

  const handleStarToggle = async (e: React.MouseEvent, board: WorkspaceBoard) => {
    e.stopPropagation();
    if (currentWorkspace) {
      await workspaceService.toggleBoardStar(currentWorkspace.id, board.id);
      setStarredBoards(workspaceService.getStarredBoards());
      
      // Refresh current workspace
      const updated = workspaceService.getWorkspaceById(currentWorkspace.id);
      if (updated) setCurrentWorkspace(updated);
    }
  };

  const handleCreateItem = (type: CreateItemType) => {
    setCreateItemType(type);
  };

  const handleAddApp = () => {
    openModal('MaunAppMarketplace', {});
  };

  const handleAppClick = (app: any) => {
    // Launch the app using the MaunAppStore
    const { launchApp } = useMaunAppsStore.getState();
    launchApp(app.appId, {
      workspaceId: currentWorkspace?.id,
      onClose: () => {}
    });
    openModal('MaunAppLauncher', {});
  };

  const handleAppStarToggle = async (e: React.MouseEvent, app: any) => {
    e.stopPropagation();
    // Toggle starred state for workspace app
    // This would need to be implemented in workspace service
    console.log('Toggle app star:', app.name);
  };

  const handleCreateItemWithData = async (type: CreateItemType, data: any) => {
    if (!currentWorkspace) return;
    
    try {
      // Create the item using workspace service
      switch (type) {
        case 'board': {
          const newBoard = await workspaceService.createBoard(data);
          if (newBoard) {
            // Navigate to the board
            navigate(`/app/boards/${newBoard.id}`);
          }
          break;
        }
        case 'dashboard':
          await workspaceService.createDashboard(data);
          break;
        case 'doc':
          await workspaceService.createDoc(data);
          break;
        case 'form':
          await workspaceService.createForm(data);
          break;
        case 'folder':
          await workspaceService.createFolder(data);
          break;
        case 'app':
          await workspaceService.createApp(data);
          break;
      }
      
      // Refresh workspace data
      const updated = workspaceService.getWorkspaceById(currentWorkspace.id);
      if (updated) setCurrentWorkspace(updated);
      
      // Refresh starred boards
      setStarredBoards(workspaceService.getStarredBoards());
    } catch (error) {
      console.error('Failed to create item:', error);
    }
    
    // Close modal
    setCreateItemType(null);
    setTargetFolder(undefined);
  };

  const handleContextMenuAction = async (action: string, item: any) => {
    if (!currentWorkspace) return;

    switch (action) {
      case 'open-new-tab':
        if (item.boardType) {
          // It's a board
          window.open(`/boards/${item.id}`, '_blank');
        }
        break;
        
      case 'rename':
        // TODO: Implement rename modal
        console.log('Rename:', item.name);
        break;
        
      case 'change-type':
        // TODO: Implement change board type
        console.log('Change type:', item);
        break;
        
      case 'toggle-favorite':
        if (item.boardType) {
          try {
            await workspaceService.toggleBoardStar(currentWorkspace.id, item.id);
            setStarredBoards(workspaceService.getStarredBoards());
            const updated = workspaceService.getWorkspaceById(currentWorkspace.id);
            if (updated) setCurrentWorkspace(updated);
          } catch (error) {
            console.error('Failed to toggle favorite:', error);
          }
        }
        break;
        
      case 'save-template':
        // TODO: Implement save as template
        console.log('Save as template:', item.name);
        break;
        
      case 'create-in-folder':
        setTargetFolder(item);
        setCreateItemType(item.createType as CreateItemType);
        break;
        
      case 'change-color':
        // Update color for folder or board
        try {
          if (item.boardType) {
            // Update board color
            await workspaceService.updateBoard(item.id, { color: item.color });
          } else {
            // Update folder color
            await workspaceService.updateFolder(item.id, { color: item.color });
          }
          const updated = workspaceService.getWorkspaceById(currentWorkspace.id);
          if (updated) setCurrentWorkspace(updated);
        } catch (error) {
          console.error('Failed to change color:', error);
        }
        break;
        
      case 'remove':
        try {
          if (item.boardType) {
            // Remove board
            await workspaceService.deleteBoard(currentWorkspace.id, item.id);
          } else {
            // Delete folder
            await workspaceService.deleteFolder(currentWorkspace.id, item.id);
          }
          const updatedAfterDelete = workspaceService.getWorkspaceById(currentWorkspace.id);
          if (updatedAfterDelete) setCurrentWorkspace(updatedAfterDelete);
          // Refresh starred boards
          setStarredBoards(workspaceService.getStarredBoards());
        } catch (error) {
          console.error('Failed to remove item:', error);
        }
        break;
        
      default:
        console.log('Unhandled action:', action, item);
    }
  };

  const renderFolder = (folder: WorkspaceFolder, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const paddingLeft = 12 + (level * 20);

    return (
      <div key={folder.id}>
        {/* Folder Header */}
        <div
          className={`flex items-center py-2 px-2 $hover:bg-white/05 transition-colors rounded cursor-pointer group`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => handleFolderToggle(folder.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 icon-adaptive-muted mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 icon-adaptive-muted mr-1 flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: folder.color }} />
            ) : (
              <Folder className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: folder.color }} />
            )}
            <span className="text-sm font-medium text-adaptive-primary truncate">{folder.name}</span>
          </div>
          <ItemContextMenu
            item={folder}
            itemType="folder"
            onAction={handleContextMenuAction}
          />
        </div>

        {/* Folder Contents */}
        {isExpanded && (
          <div className="ml-1">
            {/* Boards in folder */}
            {folder.boards.map(board => (
              <div
                key={board.id}
                className={`flex items-center py-2 px-2 $hover:bg-white/05 transition-colors rounded cursor-pointer group`}
                style={{ paddingLeft: `${paddingLeft + 20}px` }}
                onClick={() => handleBoardClick(board)}
              >
                <Grid3x3 className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: board.color }} />
                <span className="text-sm text-adaptive-secondary flex-1 truncate">{board.name}</span>
                <button
                  onClick={(e) => handleStarToggle(e, board)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded mr-1"
                >
                  <Star className={`w-3 h-3 ${board.starred ? 'icon-adaptive-secondary fill-white/30' : 'icon-adaptive-muted'}`} />
                </button>
                <ItemContextMenu
                  item={board}
                  itemType="board"
                  onAction={handleContextMenuAction}
                />
              </div>
            ))}

            {/* Apps in folder */}
            {folder.apps && folder.apps.map(app => (
              <div
                key={app.id}
                className={`flex items-center py-2 px-2 $hover:bg-white/05 transition-colors rounded cursor-pointer group`}
                style={{ paddingLeft: `${paddingLeft + 20}px` }}
                onClick={() => handleAppClick(app)}
              >
                <Zap className="w-4 h-4 mr-2 flex-shrink-0 icon-adaptive-secondary" />
                <span className="text-sm text-adaptive-secondary flex-1 truncate">{app.name}</span>
                <button
                  onClick={(e) => handleAppStarToggle(e, app)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded mr-1"
                >
                  <Star className={`w-3 h-3 ${app.starred ? 'icon-adaptive-secondary fill-white/30' : 'icon-adaptive-muted'}`} />
                </button>
              </div>
            ))}

            {/* Subfolders */}
            {folder.subFolders.map(subFolder => renderFolder(subFolder, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderBoard = (board: WorkspaceBoard) => (
    <div
      key={board.id}
      className="flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded cursor-pointer group"
      onClick={() => handleBoardClick(board)}
    >
      <Grid3x3 className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: board.color }} />
      <span className="text-sm text-adaptive-secondary flex-1 truncate">{board.name}</span>
      <button
        onClick={(e) => handleStarToggle(e, board)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded mr-1"
      >
        <Star className={`w-3 h-3 ${board.starred ? 'icon-adaptive-secondary fill-white/30' : 'icon-adaptive-muted'}`} />
      </button>
      <ItemContextMenu
        item={board}
        itemType="board"
        onAction={handleContextMenuAction}
      />
    </div>
  );

  const renderApp = (app: any) => (
    <div
      key={app.id}
      className="flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded cursor-pointer group"
      onClick={() => handleAppClick(app)}
    >
      <Zap className="w-4 h-4 mr-2 flex-shrink-0 icon-adaptive-secondary" />
      <span className="text-sm text-adaptive-secondary flex-1 truncate">{app.name}</span>
      <button
        onClick={(e) => handleAppStarToggle(e, app)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded mr-1"
      >
        <Star className={`w-3 h-3 ${app.starred ? 'icon-adaptive-secondary fill-white/30' : 'icon-adaptive-muted'}`} />
      </button>
    </div>
  );

  return (
    <div className="w-64 liquid-glass-sidebar flex flex-col h-full rounded-3xl p-4">
      {/* Workspace Switcher Header */}
      <div className="mb-4">
        <WorkspaceSwitcher 
          currentWorkspace={currentWorkspace}
          onWorkspaceChange={(workspace) => {
            setCurrentWorkspace(workspace);
            onWorkspaceChange?.(workspace.id);
          }}
          onCreateWorkspace={() => setShowWorkspaceModal(true)}
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Quick Access */}
        <div className="py-2">
          <div
            className="flex items-center py-3 px-3 hover:bg-white/05 transition-colors rounded-xl cursor-pointer mb-2"
            onClick={() => navigate('/app/my-office')}
          >
            <Home className="w-5 h-5 mr-3 icon-adaptive-primary" />
            <span className="text-sm font-semibold text-adaptive-primary">
              {currentUser?.fullName.split(' ')[0] || 'My'} Office
            </span>
          </div>
        </div>
        
        {/* Recent - Enhanced Asana-style */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setRecentExpanded(!recentExpanded)}
              className="flex items-center gap-2 hover:bg-white/05 transition-colors rounded-lg p-2 -m-2 group"
            >
              <motion.div
                animate={{ rotate: recentExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
              </motion.div>
              <Clock className="w-4 h-4 icon-adaptive-secondary" />
              <span className="text-xs font-bold text-adaptive-secondary uppercase tracking-wider">
                Recent
              </span>
            </button>
            <span className="text-xs text-adaptive-subtle font-medium">{recentItems.length}</span>
          </div>
          <AnimatePresence>
            {recentExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden pl-2"
              >
                {recentItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center py-2.5 px-3 hover:bg-white/05 transition-colors rounded-lg cursor-pointer group"
                      onClick={() => navigate(item.path)}
                    >
                      <Icon className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: item.color }} />
                      <span className="text-sm text-adaptive-secondary truncate font-medium">{item.name}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Favorites - Enhanced Asana-style */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setFavoritesExpanded(!favoritesExpanded)}
              className="flex items-center gap-2 hover:bg-white/05 transition-colors rounded-lg p-2 -m-2 group"
            >
              <motion.div
                animate={{ rotate: favoritesExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
              </motion.div>
              <Star className="w-4 h-4 icon-adaptive-secondary fill-white/20" />
              <span className="text-xs font-bold text-adaptive-secondary uppercase tracking-wider">
                Favorites
              </span>
            </button>
            <span className="text-xs text-adaptive-subtle font-medium">{starredBoards.length}</span>
          </div>
          <AnimatePresence>
            {favoritesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden pl-2"
              >
                {starredBoards.length > 0 ? (
                  starredBoards.slice(0, 5).map(board => (
                    <div
                      key={board.id}
                      className="flex items-center py-2.5 px-3 hover:bg-white/05 transition-colors rounded-lg cursor-pointer group"
                      onClick={() => handleBoardClick(board)}
                    >
                      <Grid3x3 className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: board.color }} />
                      <span className="text-sm text-adaptive-secondary truncate flex-1 font-medium">{board.name}</span>
                      <Star className="h-4 w-4 icon-adaptive-secondary flex-shrink-0" fill="currentColor" />
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-adaptive-subtle text-center py-6 px-3">
                    <Star className="h-8 w-8 mx-auto mb-3 icon-adaptive-muted" />
                    <p className="font-medium">Star boards to access them quickly</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Insights Section - Asana-style */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setInsightsExpanded(!insightsExpanded)}
              className="flex items-center gap-1 hover:bg-white/05 transition-colors rounded p-1 -m-1 group"
            >
              <motion.div
                animate={{ rotate: insightsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
              </motion.div>
              <Zap className="w-4 h-4 mr-1 icon-adaptive-secondary" />
              <span className="text-xs font-semibold text-adaptive-muted uppercase tracking-wider group-hover:text-adaptive-secondary">
                Insights
              </span>
            </button>
            <span className="text-xs text-adaptive-subtle">{insightsItems.length}</span>
          </div>
          <AnimatePresence>
            {insightsExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden ml-6"
              >
                {insightsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded">
                        <Icon className={`h-4 w-4 mr-2 flex-shrink-0 ${item.color}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-adaptive-primary">{item.label}</div>
                          <div className="text-xs text-adaptive-muted">{item.description}</div>
                        </div>
                        <ChevronRight className="h-3 w-3 icon-adaptive-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Teams Section - Asana-style */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setTeamsExpanded(!teamsExpanded)}
              className="flex items-center gap-1 hover:bg-white/05 transition-colors rounded p-1 -m-1 group"
            >
              <motion.div
                animate={{ rotate: teamsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
              </motion.div>
              <Users className="w-4 h-4 mr-1 icon-adaptive-secondary" />
              <span className="text-xs font-semibold text-adaptive-muted uppercase tracking-wider group-hover:text-adaptive-secondary">
                Teams
              </span>
            </button>
            <span className="text-xs text-adaptive-subtle">{teams.length}</span>
          </div>
          <AnimatePresence>
            {teamsExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden ml-6"
              >
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="group cursor-pointer"
                    onClick={() => setCurrentTeam(team)}
                  >
                    <div className={`flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded ${
                      currentTeam?.id === team.id ? 'bg-white/08 border-l-2 border-white/30' : ''
                    }`}>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full bg-white/80 flex-shrink-0" style={{filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.6))'}} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-adaptive-primary">{team.name}</div>
                          <div className="text-xs text-adaptive-muted">
                            {team.memberCount} member{team.memberCount !== 1 ? 's' : ''} • {team.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {team.visibility === 'private' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title="Private team" />
                        )}
                        <ChevronRight className="h-3 w-3 icon-adaptive-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <button
                    className="flex items-center gap-2 py-2 px-2 text-sm text-adaptive-secondary hover:bg-white/05 transition-colors rounded w-full"
                    onClick={() => {/* TODO: Open create team modal */}}
                  >
                    <Plus className="h-3 w-3" />
                    Create team
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agents Section - Salesforce Agentforce-style */}
        <div className="px-2 mb-6">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setAgentsExpanded(!agentsExpanded)}
              className="flex items-center gap-1 hover:bg-white/05 transition-colors rounded p-1 -m-1 group"
            >
              <motion.div
                animate={{ rotate: agentsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
              </motion.div>
              <Bot className="w-4 h-4 mr-1 icon-adaptive-secondary" />
              <span className="text-xs font-semibold text-adaptive-muted uppercase tracking-wider group-hover:text-adaptive-secondary">
                Agents
              </span>
            </button>
            <span className="text-xs text-adaptive-subtle">{getAgents().length}</span>
          </div>
          <AnimatePresence>
            {agentsExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden ml-6"
              >
                {/* Agent Overview */}
                <div
                  className="group cursor-pointer"
                  onClick={() => navigate('/agents')}
                >
                  <div className="flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded">
                    <Activity className="h-4 w-4 mr-2 flex-shrink-0 icon-adaptive-secondary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-adaptive-primary">Agent Dashboard</div>
                      <div className="text-xs text-adaptive-muted">Manage your AI workforce</div>
                    </div>
                    <ChevronRight className="h-3 w-3 icon-adaptive-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Active Agents */}
                {getAgentsByStatus('active').slice(0, 3).map((agent) => {
                  const getAgentIcon = (type: string) => {
                    switch (type) {
                      case 'sales': return '💼';
                      case 'service': return '🎧';
                      case 'marketing': return '📢';
                      case 'analytics': return '📊';
                      case 'operations': return '⚙️';
                      default: return '🤖';
                    }
                  };

                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'active': return 'text-green-400';
                      case 'training': return 'text-blue-400';
                      case 'inactive': return 'text-gray-400';
                      case 'error': return 'text-red-400';
                      default: return 'text-gray-400';
                    }
                  };

                  return (
                    <div
                      key={agent.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/agents/${agent.id}`)}
                    >
                      <div className="flex items-center py-2 px-2 hover:bg-white/05 transition-colors rounded">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm flex-shrink-0">{getAgentIcon(agent.type)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-adaptive-primary truncate">{agent.name}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                                {agent.status}
                              </span>
                              <span className="text-adaptive-muted">
                                {agent.metrics.currentTasks} active
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {/* Quick control buttons */}
                          {agent.status === 'active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                stopAgent(agent.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded transition-opacity"
                              title="Pause agent"
                            >
                              <Pause className="h-3 w-3 icon-adaptive-muted" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startAgent(agent.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/08 transition-colors rounded transition-opacity"
                              title="Start agent"
                            >
                              <Play className="h-3 w-3 icon-adaptive-muted" />
                            </button>
                          )}
                          <ChevronRight className="h-3 w-3 icon-adaptive-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Agent Templates Quick Access */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <button
                    className="flex items-center gap-2 py-2 px-2 text-sm text-adaptive-secondary hover:bg-white/05 transition-colors rounded w-full"
                    onClick={() => navigate('/agents/create')}
                  >
                    <Plus className="h-3 w-3" />
                    Create agent
                  </button>
                </div>

                {/* Quick stats */}
                {getAgents().length > 0 && (
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded p-2">
                        <div className="font-medium text-adaptive-primary">{getAgentsByStatus('active').length}</div>
                        <div className="text-adaptive-secondary">Active</div>
                      </div>
                      <div className="rounded p-2">
                        <div className="font-medium text-adaptive-primary">
                          {getAgents().reduce((sum, agent) => sum + agent.metrics.tasksCompleted, 0)}
                        </div>
                        <div className="text-adaptive-secondary">Tasks Done</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Items Dropdown */}
        <div className="px-2 mb-6">
          <AddItemDropdown
            onCreateItem={handleCreateItem}
            currentFolder={targetFolder?.name}
            onAddApp={handleAddApp}
          />
        </div>


        {/* Current Workspace Content - Enhanced */}
        {currentWorkspace && (
          <div className="px-2 py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setWorkspaceItemsExpanded(!workspaceItemsExpanded)}
                className="flex items-center gap-1 hover:bg-white/05 transition-colors rounded p-1 -m-1 group flex-1"
              >
                <motion.div
                  animate={{ rotate: workspaceItemsExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3 w-3 icon-adaptive-muted group-hover:icon-adaptive-secondary" />
                </motion.div>
                <Building className="w-4 h-4 mr-1 icon-adaptive-secondary" />
                <span className="text-sm font-medium text-adaptive-primary group-hover:text-adaptive-primary">{currentWorkspace.name}</span>
              </button>
            </div>
            <AnimatePresence>
              {workspaceItemsExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {/* Folders */}
                  {currentWorkspace.folders.map(folder => renderFolder(folder))}

                  {/* Root level boards */}
                  {currentWorkspace.boards
                    .filter(board => !board.folderId)
                    .map(board => renderBoard(board))
                  }

                  {/* Root level apps */}
                  {currentWorkspace.apps
                    ?.filter(app => !app.folderId)
                    ?.map(app => renderApp(app))
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Clean Footer */}
      <div className="mt-auto">
        <div className="flex items-center justify-between p-3 hover:bg-white/05 transition-colors rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-full flex items-center justify-center border border-white/20">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-adaptive-primary">User</span>
              <span className="text-xs text-adaptive-muted font-medium">Online</span>
            </div>
          </div>
          <button className="p-2.5 hover:bg-white/08 transition-colors rounded-xl">
            <Settings className="w-4 h-4 icon-adaptive-muted" />
          </button>
        </div>
      </div>

      {/* Workspace Management Modal */}
      <WorkspaceManagementModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
        onWorkspaceCreated={(workspace) => {
          setWorkspaces([...workspaces, workspace]);
          setCurrentWorkspace(workspace);
          onWorkspaceChange?.(workspace.id);
        }}
      />

      {/* Create Item Modal */}
      {currentWorkspace && (
        <CreateItemModal
          isOpen={createItemType !== null}
          type={createItemType}
          workspace={currentWorkspace}
          targetFolder={targetFolder}
          onClose={() => {
            setCreateItemType(null);
            setTargetFolder(undefined);
          }}
          onCreateItem={handleCreateItemWithData}
        />
      )}
    </div>
  );
}