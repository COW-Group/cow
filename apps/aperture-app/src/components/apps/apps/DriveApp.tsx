import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardDrive,
  Folder,
  FolderOpen,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Plus,
  Search,
  Grid3x3,
  List,
  Upload,
  Download,
  Share,
  MoreHorizontal,
  Star,
  Clock,
  Trash,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Copy,
  Move,
  Filter,
  SortAsc,
  RefreshCw,
  FolderPlus,
  CloudUpload,
  Users,
  Lock,
  Globe,
  Calendar
} from 'lucide-react';
import { Button } from '../../ui/Button';

interface DriveFile {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: string;
  shared: boolean;
  starred: boolean;
  parentId: string | null;
  path: string[];
  thumbnail?: string;
  description?: string;
  permissions: 'view' | 'edit' | 'owner';
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export function DriveApp() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  // Mock drive data
  const files: DriveFile[] = [
    {
      id: '1',
      name: 'Projects',
      type: 'folder',
      createdAt: new Date(2024, 10, 1),
      modifiedAt: new Date(2024, 11, 10),
      owner: 'You',
      shared: false,
      starred: true,
      parentId: null,
      path: [],
      permissions: 'owner'
    },
    {
      id: '2',
      name: 'Documents',
      type: 'folder',
      createdAt: new Date(2024, 9, 15),
      modifiedAt: new Date(2024, 11, 8),
      owner: 'You',
      shared: true,
      starred: false,
      parentId: null,
      path: [],
      permissions: 'owner'
    },
    {
      id: '3',
      name: 'Images',
      type: 'folder',
      createdAt: new Date(2024, 8, 20),
      modifiedAt: new Date(2024, 11, 5),
      owner: 'You',
      shared: false,
      starred: false,
      parentId: null,
      path: [],
      permissions: 'owner'
    },
    {
      id: '4',
      name: 'Meeting Notes.docx',
      type: 'file',
      fileType: 'document',
      size: 245760, // 240 KB
      createdAt: new Date(2024, 11, 10),
      modifiedAt: new Date(2024, 11, 10),
      owner: 'You',
      shared: true,
      starred: false,
      parentId: null,
      path: [],
      description: 'Q4 planning meeting notes',
      permissions: 'owner'
    },
    {
      id: '5',
      name: 'Presentation.pptx',
      type: 'file',
      fileType: 'document',
      size: 5242880, // 5 MB
      createdAt: new Date(2024, 11, 9),
      modifiedAt: new Date(2024, 11, 9),
      owner: 'Sarah Wilson',
      shared: true,
      starred: true,
      parentId: null,
      path: [],
      description: 'Q4 roadmap presentation',
      permissions: 'edit'
    },
    {
      id: '6',
      name: 'Team Photo.jpg',
      type: 'file',
      fileType: 'image',
      size: 1048576, // 1 MB
      createdAt: new Date(2024, 11, 8),
      modifiedAt: new Date(2024, 11, 8),
      owner: 'You',
      shared: false,
      starred: false,
      parentId: null,
      path: [],
      permissions: 'owner'
    },
    {
      id: '7',
      name: 'Demo Video.mp4',
      type: 'file',
      fileType: 'video',
      size: 52428800, // 50 MB
      createdAt: new Date(2024, 11, 7),
      modifiedAt: new Date(2024, 11, 7),
      owner: 'John Martinez',
      shared: true,
      starred: false,
      parentId: null,
      path: [],
      permissions: 'view'
    },
    {
      id: '8',
      name: 'Budget Analysis.xlsx',
      type: 'file',
      fileType: 'document',
      size: 512000, // 500 KB
      createdAt: new Date(2024, 11, 5),
      modifiedAt: new Date(2024, 11, 6),
      owner: 'Finance Team',
      shared: true,
      starred: true,
      parentId: null,
      path: [],
      permissions: 'view'
    }
  ];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 10) / 10} ${sizes[i]}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getFileIcon = (file: DriveFile) => {
    if (file.type === 'folder') {
      return <Folder className="w-6 h-6 text-blue-600" />;
    }

    switch (file.fileType) {
      case 'document':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'image':
        return <Image className="w-6 h-6 text-green-600" />;
      case 'video':
        return <Video className="w-6 h-6 text-red-600" />;
      case 'audio':
        return <Music className="w-6 h-6 text-purple-600" />;
      case 'archive':
        return <Archive className="w-6 h-6 text-orange-600" />;
      default:
        return <File className="w-6 h-6 text-gray-600" />;
    }
  };

  const getDisplayFiles = () => {
    let displayFiles = files.filter(file => file.parentId === currentFolderId);

    if (searchQuery) {
      displayFiles = displayFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort files
    displayFiles.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
          return b.modifiedAt.getTime() - a.modifiedAt.getTime();
        case 'size':
          return (b.size || 0) - (a.size || 0);
        default:
          return 0;
      }
    });

    // Folders first
    return displayFiles.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return 0;
    });
  };

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { id: '', name: 'My Drive' }
    ];

    if (currentFolderId) {
      const currentFolder = files.find(f => f.id === currentFolderId);
      if (currentFolder) {
        breadcrumbs.push({ id: currentFolder.id, name: currentFolder.name });
      }
    }

    return breadcrumbs;
  };

  const handleFileClick = (file: DriveFile) => {
    if (file.type === 'folder') {
      setCurrentFolderId(file.id);
      setSelectedFiles(new Set());
    } else {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelected = new Set(selectedFiles);

    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }

    setSelectedFiles(newSelected);
  };

  const handleStarToggle = (fileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const file = files.find(f => f.id === fileId);
    if (file) {
      file.starred = !file.starred;
      // In a real app, this would trigger an API call
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const displayFiles = getDisplayFiles();

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-900">Drive</h1>
          </div>

          <Button
            onClick={() => setShowUploadModal(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>

        {/* Quick Access */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentFolderId(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors ${
                currentFolderId === null ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span className="text-sm">My Drive</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors text-gray-700">
              <Users className="w-4 h-4" />
              <span className="text-sm">Shared with me</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Recent</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors text-gray-700">
              <Star className="w-4 h-4" />
              <span className="text-sm">Starred</span>
            </button>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-gray-100 transition-colors text-gray-700">
              <Trash className="w-4 h-4" />
              <span className="text-sm">Trash</span>
            </button>
          </div>
        </div>

        {/* Storage */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Storage
          </h3>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Used</span>
              <span className="text-sm font-medium text-gray-900">2.3 GB of 15 GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-white">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <button
                  onClick={() => setCurrentFolderId(crumb.id || null)}
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  {crumb.name}
                </button>
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search in Drive"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'modified' | 'size')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="modified">Sort by Modified</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedFiles.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedFiles.size} item{selectedFiles.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Move className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* File Grid/List */}
        <div className="flex-1 p-4 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className={`group relative p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md cursor-pointer transition-all ${
                    selectedFiles.has(file.id) ? 'border-blue-500 bg-blue-50' : 'bg-white'
                  }`}
                  onClick={() => handleFileClick(file)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => handleFileSelect(file.id, e)}
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className={`w-4 h-4 border border-gray-300 rounded ${
                      selectedFiles.has(file.id) ? 'bg-blue-600 border-blue-600' : 'bg-white'
                    } flex items-center justify-center`}>
                      {selectedFiles.has(file.id) && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Star Button */}
                  <button
                    onClick={(e) => handleStarToggle(file.id, e)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className={`w-4 h-4 ${file.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`} />
                  </button>

                  {/* File Icon */}
                  <div className="flex justify-center mb-3">
                    {getFileIcon(file)}
                  </div>

                  {/* File Name */}
                  <h3 className="text-sm font-medium text-gray-900 text-center truncate mb-1">
                    {file.name}
                  </h3>

                  {/* File Details */}
                  <div className="text-xs text-gray-500 text-center">
                    {file.type === 'file' && (
                      <div>{formatFileSize(file.size)}</div>
                    )}
                    <div>{formatDate(file.modifiedAt)}</div>
                  </div>

                  {/* Shared Indicator */}
                  {file.shared && (
                    <div className="absolute bottom-2 left-2">
                      <Users className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Owner</div>
                <div className="col-span-2">Modified</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* List Items */}
              {displayFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedFiles.has(file.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                  whileHover={{ x: 2 }}
                >
                  {/* Name */}
                  <div className="col-span-6 flex items-center gap-3">
                    <button
                      onClick={(e) => handleFileSelect(file.id, e)}
                      className="flex-shrink-0"
                    >
                      <div className={`w-4 h-4 border border-gray-300 rounded ${
                        selectedFiles.has(file.id) ? 'bg-blue-600 border-blue-600' : 'bg-white'
                      } flex items-center justify-center`}>
                        {selectedFiles.has(file.id) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {getFileIcon(file)}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </span>
                        {file.shared && (
                          <Users className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        )}
                        {file.starred && (
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      {file.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {file.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600 truncate">
                      {file.owner}
                    </span>
                  </div>

                  {/* Modified */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-600">
                      {formatDate(file.modifiedAt)}
                    </span>
                  </div>

                  {/* Size */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm text-gray-600">
                      {file.type === 'file' ? formatFileSize(file.size) : '—'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStarToggle(file.id, e);
                      }}
                      className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {displayFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <HardDrive className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No files found' : 'Folder is empty'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by creating a new file or folder'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add files
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Create new
              </h2>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FolderPlus className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Folder</div>
                    <div className="text-sm text-gray-500">Create a new folder</div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <CloudUpload className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">File upload</div>
                    <div className="text-sm text-gray-500">Upload files from your device</div>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Document</div>
                    <div className="text-sm text-gray-500">Create a new document</div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}