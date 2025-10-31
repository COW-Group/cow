import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Star, 
  Users, 
  Calendar, 
  MoreHorizontal,
  Globe,
  Lock,
  Share2,
  Package,
  DollarSign,
  Users2,
  Target,
  TrendingUp,
  Briefcase,
  Palette,
  User,
  CheckSquare,
  Settings
} from 'lucide-react';
import { useBoardStore } from '../store/board.store';
import { COWBoard, PrivacyType, ManagementType, CreateBoardRequest } from '../types/board.types';
import { useAppTheme } from '../hooks/useAppTheme';

export function BoardsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { classes } = useAppTheme();
  
  const {
    boards,
    isLoading,
    error,
    fetchBoards,
    createBoard,
    deleteBoard,
    toggleBoardStar
  } = useBoardStore();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (board.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const starredBoards = filteredBoards.filter(board => board.isStarred);
  const otherBoards = filteredBoards.filter(board => !board.isStarred);

  const handleCreateBoard = async (boardData: CreateBoardRequest) => {
    await createBoard({ 
      title: boardData.name, 
      description: `${boardData.managementType === 'custom' && boardData.customManagementType ? boardData.customManagementType : boardData.managementType} board`,
      privacy: boardData.privacy,
      managementType: boardData.managementType,
      customManagementType: boardData.customManagementType
    });
    setShowCreateModal(false);
  };

  const handleToggleStar = async (boardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await toggleBoardStar(boardId);
  };

  const handleDeleteBoard = async (boardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      await deleteBoard(boardId);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${classes.bg.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-8 h-8 border-2 ${classes.spinner} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={classes.text.muted}>Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="glass-header border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-light ${classes.text.primary} tracking-tight`}>COW Boards</h1>
              <p className={`text-xl ${classes.text.secondary} mt-3 font-light`}>Manage your projects and track progress with sophisticated workflows</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className={`flex items-center space-x-3 ${classes.button.primary} px-6 py-3 rounded-xl smooth-hover font-medium`}
            >
              <Plus className="w-4 h-4" />
              <span>New Board</span>
            </button>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-2xl">
            <div className="relative">
              <Search className={`w-5 h-5 absolute left-6 top-1/2 transform -translate-y-1/2 ${classes.text.muted}`} />
              <input
                type="text"
                placeholder="Search boards and projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-14 pr-6 py-4 ${classes.bg.secondary} rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-transparent shadow-lg ${classes.text.primary} text-base font-medium border ${classes.border.default}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {error && (
          <div className={`mb-12 ${classes.bg.secondary} bg-red-500/10 border border-red-500/30 rounded-2xl p-8 shadow-lg`}>
            <p className={`${classes.text.primary} font-medium text-lg`}>{error}</p>
          </div>
        )}

        {/* Starred Boards */}
        {starredBoards.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight`}>Starred Boards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {starredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteBoard}
                  onClick={() => navigate(`/app/boards/${board.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Boards */}
        <div>
          <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight mb-8`}>
            {starredBoards.length > 0 ? 'All Boards' : 'Your Boards'}
          </h2>
          
          {otherBoards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {otherBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteBoard}
                  onClick={() => navigate(`/app/boards/${board.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className={`${classes.bg.secondary} rounded-3xl shadow-lg p-20 text-center border ${classes.border.default}`}>
              <div className={`w-24 h-24 ${classes.bg.tertiary} rounded-full flex items-center justify-center mx-auto mb-8 border ${classes.border.default}`}>
                <Plus className={`w-12 h-12 ${classes.text.muted}`} />
              </div>
              <h3 className={`text-2xl font-semibold ${classes.text.primary} mb-4 tracking-tight`}>No boards found</h3>
              <p className={`${classes.text.secondary} mb-10 max-w-lg mx-auto font-light text-lg leading-relaxed`}>
                {searchTerm ? 'No boards match your search criteria.' : 'Create your first board to start organizing your projects and workflows with sophisticated task management.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className={`${classes.button.primary} px-8 py-4 rounded-2xl font-medium text-lg smooth-hover`}
                >
                  Create Board
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
        />
      )}
    </div>
  );
}

// Board Card Component
function BoardCard({ 
  board, 
  onToggleStar, 
  onDelete, 
  onClick 
}: { 
  board: COWBoard;
  onToggleStar: (boardId: string, event: React.MouseEvent) => void;
  onDelete: (boardId: string, event: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const { classes } = useAppTheme();
  
  const totalTasks = board.groups.reduce((sum, group) => sum + group.tasks.length, 0);
  const completedTasks = board.groups.reduce((sum, group) => 
    sum + group.tasks.filter(task => task.status === 'Done').length, 0
  );

  return (
    <div
      onClick={onClick}
      className={`${classes.bg.secondary} rounded-3xl shadow-lg border ${classes.border.default} ${classes.hover.card} cursor-pointer group overflow-hidden smooth-hover`}
    >
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <h3 className={`text-xl font-semibold ${classes.text.primary} transition-all`}>
            {board.title}
          </h3>

          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => onToggleStar(board.id, e)}
              className={`p-2 ${classes.hover.bg} rounded-full smooth-hover`}
            >
              <Star className={`w-4 h-4 ${board.isStarred ? 'fill-current text-yellow-400' : ''}`} />
            </button>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-2 ${classes.hover.bg} rounded-full smooth-hover`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className={`absolute right-0 mt-2 w-36 ${classes.bg.modal} rounded-xl shadow-lg py-2 z-20 border ${classes.border.default}`}>
                  <button
                    onClick={(e) => {
                      onDelete(board.id, e);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm ${classes.text.secondary} hover:text-red-400 hover:bg-red-500/10 transition-all`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {board.description && (
          <p className={`${classes.text.secondary} text-base mb-6 line-clamp-2 leading-relaxed`}>{board.description}</p>
        )}

        <div className={`flex items-center justify-between text-sm ${classes.text.secondary} mb-6`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{board.members.length}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{board.groups.length} groups</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-xs ${classes.text.muted}`}>Progress</div>
            <div className={`font-medium ${classes.text.primary}`}>
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>

        {/* Members preview */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-3">
            {board.members.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium border-3 border-white/20 shadow-lg"
                title={member.name}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {board.members.length > 3 && (
              <div className={`w-8 h-8 ${classes.bg.tertiary} rounded-full flex items-center justify-center ${classes.text.secondary} text-sm font-medium border-2 ${classes.border.default} shadow-lg`}>
                +{board.members.length - 3}
              </div>
            )}
          </div>

          <span className={`text-xs ${classes.text.muted} font-medium`}>
            Updated {new Date(board.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Create Board Modal Component - Monday.com Style
function CreateBoardModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (boardData: CreateBoardRequest) => void;
}) {
  const [boardName, setBoardName] = useState('New Board');
  const [privacy, setPrivacy] = useState<PrivacyType>('main');
  const [managementType, setManagementType] = useState<ManagementType>('items');
  const [customType, setCustomType] = useState('');
  const { classes } = useAppTheme();

  const privacyOptions = [
    {
      type: 'main' as PrivacyType,
      icon: Globe,
      label: 'Main',
      description: 'Visible to everyone in your account'
    },
    {
      type: 'private' as PrivacyType,
      icon: Lock,
      label: 'Private',
      description: 'Only board members can access'
    },
    {
      type: 'shareable' as PrivacyType,
      icon: Share2,
      label: 'Shareable',
      description: 'Anyone with link can view'
    }
  ];

  const managementTypes = [
    { type: 'items' as ManagementType, icon: Package, label: 'Items' },
    { type: 'campaigns' as ManagementType, icon: Target, label: 'Campaigns' },
    { type: 'creatives' as ManagementType, icon: Palette, label: 'Creatives' },
    { type: 'custom' as ManagementType, icon: Settings, label: 'Custom' },
    { type: 'budgets' as ManagementType, icon: DollarSign, label: 'Budgets' },
    { type: 'leads' as ManagementType, icon: TrendingUp, label: 'Leads' },
    { type: 'clients' as ManagementType, icon: User, label: 'Clients' },
    { type: 'employees' as ManagementType, icon: Users2, label: 'Employees' },
    { type: 'projects' as ManagementType, icon: Briefcase, label: 'Projects' },
    { type: 'tasks' as ManagementType, icon: CheckSquare, label: 'Tasks' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardName.trim()) {
      onSubmit({
        name: boardName.trim(),
        privacy,
        managementType,
        customManagementType: managementType === 'custom' ? customType : undefined
      });
    }
  };

  return (
    <div className={`fixed inset-0 ${classes.bg.overlay} flex items-center justify-center p-4 z-50`}>
      <div className={`${classes.bg.modal} rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${classes.border.default} border`}>
        <form onSubmit={handleSubmit}>
          <div className={`px-6 py-4 border-b ${classes.border.default}`}>
            <h2 className={`text-xl font-semibold ${classes.text.primary}`}>Create board</h2>
          </div>
          
          <div className="px-6 py-6 space-y-6">
            {/* Board Name */}
            <div>
              <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                Board name
              </label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${classes.input.base}`}
                required
                autoFocus
              />
            </div>

            {/* Privacy Settings */}
            <div>
              <label className={`block text-sm font-medium ${classes.text.primary} mb-3`}>
                Privacy
              </label>
              <div className="space-y-2">
                {privacyOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.type}
                      className={`flex items-start p-3 rounded-md border cursor-pointer transition-colors ${
                        privacy === option.type
                          ? `${classes.border.accent} ${classes.bg.secondary}`
                          : `${classes.border.default} ${classes.hover.card}`
                      }`}
                    >
                      <input
                        type="radio"
                        name="privacy"
                        value={option.type}
                        checked={privacy === option.type}
                        onChange={() => setPrivacy(option.type)}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className={`font-medium ${classes.text.primary}`}>{option.label}</span>
                          {privacy === option.type && (
                            <div className={`w-2 h-2 ${classes.bg.accent || 'bg-blue-500'} rounded-full ml-2`}></div>
                          )}
                        </div>
                        <p className={`text-sm ${classes.text.secondary} mt-1`}>{option.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Management Type */}
            <div>
              <label className={`block text-sm font-medium ${classes.text.primary} mb-3`}>
                Select what you're managing in this board
              </label>
              <div className="grid grid-cols-2 gap-3">
                {managementTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <label
                      key={type.type}
                      className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                        managementType === type.type
                          ? `${classes.border.accent} ${classes.bg.secondary}`
                          : `${classes.border.default} ${classes.hover.card}`
                      }`}
                    >
                      <input
                        type="radio"
                        name="managementType"
                        value={type.type}
                        checked={managementType === type.type}
                        onChange={() => setManagementType(type.type)}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                      <span className={`font-medium ${classes.text.primary}`}>{type.label}</span>
                      {managementType === type.type && (
                        <div className={`w-2 h-2 ${classes.bg.accent || 'bg-blue-500'} rounded-full ml-auto`}></div>
                      )}
                    </label>
                  );
                })}
              </div>
              
              {/* Custom Type Input */}
              {managementType === 'custom' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter custom type..."
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${classes.input.base}`}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className={`px-6 py-4 border-t ${classes.border.default} flex justify-end space-x-3`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2 ${classes.button.secondary} rounded-md font-medium transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 ${classes.button.primary} rounded-md font-medium transition-colors`}
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}