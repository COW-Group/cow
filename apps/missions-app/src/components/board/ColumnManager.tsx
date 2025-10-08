import React, { useState } from 'react';
import {
  Plus,
  Type,
  Tag,
  User,
  Calendar,
  Hash,
  BarChart3,
  CheckSquare,
  Clock,
  Paperclip,
  Link as LinkIcon,
  ArrowRightLeft,
  Mirror,
  Settings,
  X
} from 'lucide-react';

interface BoardColumn {
  id: string;
  name: string;
  type: string;
  width: string;
  position: number;
  options?: { id: string; label: string; color: string }[];
}

interface ColumnManagerProps {
  columns: BoardColumn[];
  onAddColumn: (column: Omit<BoardColumn, 'id' | 'position'>) => void;
  onUpdateColumn: (columnId: string, updates: Partial<BoardColumn>) => void;
  onDeleteColumn: (columnId: string) => void;
  onClose: () => void;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
  onClose
}) => {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnType, setNewColumnType] = useState<string>('text');
  const [newColumnName, setNewColumnName] = useState('');

  const columnTypes = [
    {
      type: 'text',
      name: 'Text',
      icon: Type,
      description: 'Single line of text',
      color: 'text-blue-400'
    },
    {
      type: 'status',
      name: 'Status',
      icon: Tag,
      description: 'Track progress with labels',
      color: 'text-green-400'
    },
    {
      type: 'assignee',
      name: 'Person',
      icon: User,
      description: 'Assign people to items',
      color: 'text-purple-400'
    },
    {
      type: 'date',
      name: 'Date',
      icon: Calendar,
      description: 'Pick dates and deadlines',
      color: 'text-pink-400'
    },
    {
      type: 'numbers',
      name: 'Numbers',
      icon: Hash,
      description: 'Numbers with formatting',
      color: 'text-orange-400'
    },
    {
      type: 'progress',
      name: 'Progress',
      icon: BarChart3,
      description: 'Track completion percentage',
      color: 'text-cyan-400'
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      icon: CheckSquare,
      description: 'Simple done/not done',
      color: 'text-emerald-400'
    },
    {
      type: 'timeline',
      name: 'Timeline',
      icon: Clock,
      description: 'Start and end dates with progress',
      color: 'text-indigo-400'
    },
    {
      type: 'files',
      name: 'Files',
      icon: Paperclip,
      description: 'Upload and manage files',
      color: 'text-yellow-400'
    },
    {
      type: 'connect-boards',
      name: 'Connect Boards',
      icon: ArrowRightLeft,
      description: 'Connect items from other boards',
      color: 'text-red-400'
    },
    {
      type: 'mirror',
      name: 'Mirror',
      icon: Mirror,
      description: 'Mirror data from connected items',
      color: 'text-gray-400'
    }
  ];

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnType = columnTypes.find(ct => ct.type === newColumnType);

      onAddColumn({
        name: newColumnName.trim(),
        type: newColumnType,
        width: getDefaultWidth(newColumnType),
        options: getDefaultOptions(newColumnType)
      });

      setNewColumnName('');
      setNewColumnType('text');
      setShowAddColumn(false);
    }
  };

  const getDefaultWidth = (type: string): string => {
    const widths: Record<string, string> = {
      'text': '200px',
      'status': '120px',
      'assignee': '120px',
      'date': '120px',
      'numbers': '100px',
      'progress': '120px',
      'checkbox': '80px',
      'timeline': '200px',
      'files': '150px',
      'connect-boards': '150px',
      'mirror': '120px'
    };
    return widths[type] || '120px';
  };

  const getDefaultOptions = (type: string) => {
    if (type === 'status') {
      return [
        { id: 'not-started', label: 'Not Started', color: '#c4c4c4' },
        { id: 'in-progress', label: 'In Progress', color: '#fdab3d' },
        { id: 'completed', label: 'Done', color: '#00c875' },
        { id: 'stuck', label: 'Stuck', color: '#e2445c' }
      ];
    }
    return undefined;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-black/80
                      border border-white/20 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Manage Columns</h2>
              <p className="text-gray-400 mt-1">Add, edit, or remove board columns</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Columns */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Current Columns</h3>
            <div className="space-y-3">
              {columns.map((column, index) => {
                const columnType = columnTypes.find(ct => ct.type === column.type);
                const Icon = columnType?.icon || Type;

                return (
                  <div
                    key={column.id}
                    className="flex items-center space-x-4 p-4 backdrop-blur-xl bg-black/20
                               border border-white/10 rounded-lg hover:bg-black/30"
                  >
                    <div className={`p-2 rounded-lg bg-black/40 ${columnType?.color || 'text-gray-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="text-white font-medium">{column.name}</div>
                      <div className="text-gray-400 text-sm">{columnType?.name || column.type}</div>
                    </div>

                    <div className="text-gray-400 text-sm">
                      Width: {column.width}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Column Settings"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      {index > 0 && ( // Don't allow deleting the first column (usually item name)
                        <button
                          onClick={() => onDeleteColumn(column.id)}
                          className="p-2 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                          title="Delete Column"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Column */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add New Column</h3>
              {!showAddColumn && (
                <button
                  onClick={() => setShowAddColumn(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600
                           text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              )}
            </div>

            {showAddColumn && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Column name"
                    className="w-full p-3 backdrop-blur-xl bg-black/20 border border-white/20
                             text-white rounded-lg focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {columnTypes.map((columnType) => {
                    const Icon = columnType.icon;
                    const isSelected = newColumnType === columnType.type;

                    return (
                      <button
                        key={columnType.type}
                        onClick={() => setNewColumnType(columnType.type)}
                        className={`p-4 rounded-lg border-2 transition-all text-left
                                   ${isSelected
                                     ? 'border-blue-400 bg-blue-500/20'
                                     : 'border-white/10 bg-black/20 hover:bg-black/30'
                                   }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-black/40 ${columnType.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{columnType.name}</div>
                            <div className="text-gray-400 text-sm">{columnType.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddColumn(false);
                      setNewColumnName('');
                      setNewColumnType('text');
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddColumn}
                    disabled={!newColumnName.trim()}
                    className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600/50
                             text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    Add Column
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnManager;