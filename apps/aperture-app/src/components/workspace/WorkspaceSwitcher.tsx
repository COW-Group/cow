import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Check,
  Search,
  Clock,
  Users,
  Lock,
  Unlock,
  Plus,
  X,
  Settings
} from 'lucide-react';
import { Workspace } from '../../types/workspace.types';
import { workspaceService } from '../../services/workspace.service';
import { useAuth } from '../../contexts/AuthContext';

interface WorkspaceSwitcherProps {
  currentWorkspace: Workspace | null;
  onWorkspaceChange: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
}

export function WorkspaceSwitcher({
  currentWorkspace,
  onWorkspaceChange,
  onCreateWorkspace
}: WorkspaceSwitcherProps) {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allWorkspaces, setAllWorkspaces] = useState<Workspace[]>([]);
  const [recentWorkspaces, setRecentWorkspaces] = useState<Workspace[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadWorkspaces = async () => {
    console.log('📂 WorkspaceSwitcher: Loading workspaces from Supabase...');
    // Load from Supabase first with organization filter
    const orgId = userProfile?.organization_id;
    await workspaceService.loadWorkspacesFromSupabase(orgId);

    // Get all workspaces from service
    const workspaces = workspaceService.getAllWorkspaces();
    setAllWorkspaces(workspaces);

    // Mock recent workspaces (in real app, this would come from user activity)
    setRecentWorkspaces(workspaces.slice(0, 3));
  };

  useEffect(() => {
    loadWorkspaces();
  }, [userProfile?.organization_id]);

  // Listen for workspaces-changed event
  useEffect(() => {
    const handleWorkspacesChanged = () => {
      console.log('📢 Workspace Switcher: Reloading workspaces from Supabase...');
      loadWorkspaces();
    };

    window.addEventListener('workspaces-changed', handleWorkspacesChanged);

    return () => {
      window.removeEventListener('workspaces-changed', handleWorkspacesChanged);
    };
  }, [userProfile?.organization_id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredWorkspaces = allWorkspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mainWorkspace = allWorkspaces.find(w => w.isDefault);
  const subscribedWorkspaces = filteredWorkspaces.filter(w => !w.isDefault);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    onWorkspaceChange(workspace);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Workspace Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/05 rounded-lg transition-colors group"
      >
        <div className="flex items-center flex-1 min-w-0">
          {currentWorkspace && (
            <>
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium mr-3 flex-shrink-0"
                style={{ backgroundColor: currentWorkspace.color }}
              >
                {currentWorkspace.icon || currentWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-adaptive-primary truncate">{currentWorkspace.name}</span>
                  {currentWorkspace.isDefault && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/10 text-adaptive-secondary text-xs rounded font-medium">
                      Main
                    </span>
                  )}
                </div>
                <p className="text-xs text-adaptive-muted truncate">{currentWorkspace.description}</p>
              </div>
            </>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 icon-adaptive-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 liquid-glass-sidebar rounded-lg shadow-lg z-50 max-h-96 overflow-hidden border border-white/10" style={{ width: '240px', maxWidth: 'calc(100vw - 2rem)' }}>
          {/* Search */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 icon-adaptive-muted" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-8 py-2 bg-white/05 border border-white/10 rounded-md text-sm text-adaptive-primary placeholder-adaptive-muted focus:ring-2 focus:ring-white/20 focus:border-white/20"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-3 h-3 icon-adaptive-muted" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!searchQuery && recentWorkspaces.length > 0 && (
              <>
                {/* Recent Workspaces */}
                <div className="p-3 border-b border-white/10">
                  <div className="flex items-center mb-2">
                    <Clock className="w-4 h-4 icon-adaptive-muted mr-2" />
                    <span className="text-xs font-medium text-adaptive-muted uppercase tracking-wide">Recent</span>
                  </div>
                  <div className="space-y-1">
                    {recentWorkspaces.map((workspace) => (
                      <button
                        key={workspace.id}
                        onClick={() => handleWorkspaceSelect(workspace)}
                        className="w-full flex items-center p-2 hover:bg-white/05 rounded-md text-left group"
                      >
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium mr-3"
                          style={{ backgroundColor: workspace.color }}
                        >
                          {workspace.icon || workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-adaptive-primary truncate">{workspace.name}</span>
                            {workspace.isDefault && (
                              <span className="ml-2 px-1 py-0.5 bg-white/10 text-adaptive-secondary text-xs rounded">Main</span>
                            )}
                            {workspace.type === 'closed' && (
                              <Lock className="w-3 h-3 ml-1 icon-adaptive-muted" />
                            )}
                          </div>
                        </div>
                        {currentWorkspace?.id === workspace.id && (
                          <Check className="w-4 h-4 text-adaptive-primary ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Main Workspace */}
            {mainWorkspace && (!searchQuery || mainWorkspace.name.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <div className="p-3 border-b border-white/10">
                <button
                  onClick={() => handleWorkspaceSelect(mainWorkspace)}
                  className="w-full flex items-center p-2 hover:bg-gray-50 rounded-md text-left group"
                >
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium mr-3"
                    style={{ backgroundColor: mainWorkspace.color }}
                  >
                    {mainWorkspace.icon || mainWorkspace.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-adaptive-primary truncate">{mainWorkspace.name}</span>
                      <span className="ml-2 px-1.5 py-0.5 bg-white/10 text-adaptive-secondary text-xs rounded font-medium">
                        Main
                      </span>
                      <Unlock className="w-3 h-3 ml-1 text-green-500" />
                    </div>
                    <div className="flex items-center mt-1 text-xs text-adaptive-muted">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{mainWorkspace.memberIds.length} members</span>
                      <span className="mx-2">•</span>
                      <span>{mainWorkspace.boards.length} boards</span>
                    </div>
                  </div>
                  {currentWorkspace?.id === mainWorkspace.id && (
                    <Check className="w-4 h-4 text-blue-600 ml-2" />
                  )}
                </button>
              </div>
            )}

            {/* All Workspaces */}
            {subscribedWorkspaces.length > 0 && (
              <div className="p-3">
                {!searchQuery && (
                  <div className="flex items-center mb-3">
                    <span className="text-xs font-medium text-adaptive-muted uppercase tracking-wide">
                      {searchQuery ? 'Search Results' : 'Your Workspaces'}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {subscribedWorkspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleWorkspaceSelect(workspace)}
                      className="w-full flex items-center p-2 hover:bg-gray-50 rounded-md text-left group"
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-medium mr-3"
                        style={{ backgroundColor: workspace.color }}
                      >
                        {workspace.icon || workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-adaptive-primary truncate">{workspace.name}</span>
                          {workspace.type === 'closed' ? (
                            <Lock className="w-3 h-3 ml-1 text-red-500" />
                          ) : (
                            <Unlock className="w-3 h-3 ml-1 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-adaptive-muted">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{workspace.memberIds.length} members</span>
                          <span className="mx-2">•</span>
                          <span>{workspace.boards.length} boards</span>
                        </div>
                      </div>
                      {currentWorkspace?.id === workspace.id && (
                        <Check className="w-4 h-4 text-blue-600 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredWorkspaces.length === 0 && searchQuery && (
              <div className="p-6 text-center">
                <p className="text-sm text-adaptive-muted mb-3">No workspaces found for "{searchQuery}"</p>
                <button
                  onClick={onCreateWorkspace}
                  className="inline-flex items-center px-3 py-2 bg-white/20 text-adaptive-primary rounded-md text-sm hover:bg-white/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create workspace
                </button>
              </div>
            )}

            {/* Workspace Management */}
            <div className="border-t border-white/10 p-3 space-y-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/app/workspace/settings');
                }}
                className="w-full flex items-center p-2 hover:bg-white/05 rounded-md text-left text-adaptive-secondary hover:text-adaptive-primary"
              >
                <div className="w-6 h-6 rounded flex items-center justify-center mr-3">
                  <Settings className="w-4 h-4 icon-adaptive-muted" />
                </div>
                <span className="text-sm font-medium">Manage workspaces</span>
              </button>
              <button
                onClick={onCreateWorkspace}
                className="w-full flex items-center p-2 hover:bg-white/05 rounded-md text-left text-adaptive-secondary hover:text-adaptive-primary"
              >
                <div className="w-6 h-6 border-2 border-dashed border-white/20 rounded flex items-center justify-center mr-3">
                  <Plus className="w-3 h-3 icon-adaptive-muted" />
                </div>
                <span className="text-sm font-medium">Create new workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}