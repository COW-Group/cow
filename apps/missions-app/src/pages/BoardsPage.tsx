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

export function BoardsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">COW Boards</h1>
              <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New Board</span>
            </button>
          </div>

          {/* Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Starred Boards */}
        {starredBoards.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <h2 className="text-xl font-semibold text-gray-900">Starred Boards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {starredBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteBoard}
                  onClick={() => navigate(`/boards/${board.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Boards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {starredBoards.length > 0 ? 'All Boards' : 'Your Boards'}
          </h2>
          
          {otherBoards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {otherBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  onToggleStar={handleToggleStar}
                  onDelete={handleDeleteBoard}
                  onClick={() => navigate(`/boards/${board.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No boards found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No boards match your search.' : 'Create your first board to get started.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
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
  
  const totalTasks = board.groups.reduce((sum, group) => sum + group.tasks.length, 0);
  const completedTasks = board.groups.reduce((sum, group) => 
    sum + group.tasks.filter(task => task.status === 'Done').length, 0
  );

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {board.title}
          </h3>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onToggleStar(board.id, e)}
              className="p-1 text-gray-400 hover:text-yellow-500"
            >
              <Star className={`w-4 h-4 ${board.isStarred ? 'fill-current text-yellow-500' : ''}`} />
            </button>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={(e) => {
                      onDelete(board.id, e);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {board.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
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
            <div className="text-xs text-gray-400">Progress</div>
            <div className="font-medium">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>

        {/* Members preview */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex -space-x-2">
            {board.members.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
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
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                +{board.members.length - 3}
              </div>
            )}
          </div>
          
          <span className="text-xs text-gray-400">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create board</h2>
          </div>
          
          <div className="px-6 py-6 space-y-6">
            {/* Board Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Board name
              </label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
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
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
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
                          <span className="font-medium text-gray-900">{option.label}</span>
                          {privacy === option.type && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Management Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
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
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
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
                      <span className="font-medium text-gray-900">{type.label}</span>
                      {managementType === type.type && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></div>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors"
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}