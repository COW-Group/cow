import React, { useState, useRef } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  Paperclip,
  Link as LinkIcon,
  ArrowRight,
  BarChart3,
  Timer,
  User,
  Users,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Hash,
  Image,
  Play,
  Pause,
  Star,
  Flag
} from 'lucide-react';

// Types for advanced column data
export interface TimelineData {
  startDate: string;
  endDate: string;
  progress?: number;
  status?: 'not-started' | 'in-progress' | 'completed' | 'delayed';
}

export interface FilesData {
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'video' | 'other';
    size: number;
    uploadedAt: string;
  }>;
}

export interface NumbersData {
  value: number;
  unit?: string;
  suffix?: string;
  prefix?: string;
  format?: 'currency' | 'percentage' | 'decimal' | 'integer';
}

export interface LinkData {
  url: string;
  text: string;
  favicon?: string;
}

export interface ConnectBoardsData {
  connectedItems: Array<{
    boardId: string;
    boardName: string;
    itemId: string;
    itemName: string;
  }>;
}

export interface MirrorData {
  sourceColumnId: string;
  sourceValue: any;
  lastUpdated: string;
}

// Timeline Column Component
export const TimelineColumn: React.FC<{
  data: TimelineData;
  onChange: (data: TimelineData) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (readonly || !isEditing) {
    return (
      <div
        className="flex items-center space-x-2 p-2 rounded cursor-pointer
                   backdrop-blur-sm bg-black/10 border border-white/10 hover:bg-black/20"
        onClick={() => !readonly && setIsEditing(true)}
      >
        <div className={`w-2 h-8 rounded-full ${getStatusColor(data.status)}`} />
        <div className="flex flex-col">
          <div className="text-xs text-gray-300 flex items-center space-x-1">
            <span>{formatDate(data.startDate)}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{formatDate(data.endDate)}</span>
          </div>
          {data.progress !== undefined && (
            <div className="w-20 h-1 bg-gray-600 rounded-full mt-1">
              <div
                className="h-full bg-blue-400 rounded-full transition-all"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-lg p-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
          <input
            type="date"
            value={data.startDate.split('T')[0]}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
            className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">End Date</label>
          <input
            type="date"
            value={data.endDate.split('T')[0]}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
            className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Status</label>
        <select
          value={data.status || 'not-started'}
          onChange={(e) => onChange({ ...data, status: e.target.value as any })}
          className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-gray-600/80 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-blue-600/80 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Files Column Component
export const FilesColumn: React.FC<{
  data: FilesData;
  onChange: (data: FilesData) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4 text-purple-400" />;
      case 'document': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'video': return <Play className="w-4 h-4 text-red-400" />;
      default: return <Paperclip className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      {data.files.map((file) => (
        <div
          key={file.id}
          className="flex items-center space-x-2 p-2 backdrop-blur-sm bg-black/10
                     border border-white/10 rounded hover:bg-black/20 cursor-pointer"
        >
          {getFileIcon(file.type)}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{file.name}</div>
            <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
          </div>
        </div>
      ))}

      {!readonly && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-2 border border-dashed border-white/20 rounded
                     backdrop-blur-sm bg-black/10 hover:bg-black/20 text-gray-300
                     text-sm flex items-center justify-center space-x-2"
          >
            <Paperclip className="w-4 h-4" />
            <span>Add Files</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              // Handle file upload logic here
              console.log('Files selected:', e.target.files);
            }}
          />
        </>
      )}
    </div>
  );
};

// Numbers Column Component
export const NumbersColumn: React.FC<{
  data: NumbersData;
  onChange: (data: NumbersData) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatNumber = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'decimal':
        return value.toFixed(2);
      case 'integer':
        return Math.round(value).toString();
      default:
        return value.toString();
    }
  };

  if (readonly || !isEditing) {
    return (
      <div
        className="p-2 backdrop-blur-sm bg-black/10 border border-white/10 rounded
                   hover:bg-black/20 cursor-pointer text-center"
        onClick={() => !readonly && setIsEditing(true)}
      >
        <div className="text-white font-medium">
          {data.prefix && <span className="text-gray-400 mr-1">{data.prefix}</span>}
          {formatNumber(data.value, data.format)}
          {data.suffix && <span className="text-gray-400 ml-1">{data.suffix}</span>}
        </div>
        {data.unit && <div className="text-xs text-gray-400">{data.unit}</div>}
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-lg p-3 space-y-3">
      <div>
        <input
          type="number"
          value={data.value}
          onChange={(e) => onChange({ ...data, value: parseFloat(e.target.value) || 0 })}
          className="w-full p-2 bg-black/40 border border-white/20 rounded text-white"
          placeholder="Enter number"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            type="text"
            value={data.prefix || ''}
            onChange={(e) => onChange({ ...data, prefix: e.target.value })}
            placeholder="Prefix"
            className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
          />
        </div>
        <div>
          <input
            type="text"
            value={data.suffix || ''}
            onChange={(e) => onChange({ ...data, suffix: e.target.value })}
            placeholder="Suffix"
            className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
          />
        </div>
      </div>

      <select
        value={data.format || 'integer'}
        onChange={(e) => onChange({ ...data, format: e.target.value as any })}
        className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-xs"
      >
        <option value="integer">Integer</option>
        <option value="decimal">Decimal</option>
        <option value="currency">Currency</option>
        <option value="percentage">Percentage</option>
      </select>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-gray-600/80 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-blue-600/80 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Link Column Component
export const LinkColumn: React.FC<{
  data: LinkData;
  onChange: (data: LinkData) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (readonly || (!isEditing && data.url)) {
    return (
      <div
        className="p-2 backdrop-blur-sm bg-black/10 border border-white/10 rounded
                   hover:bg-black/20 cursor-pointer"
        onClick={() => !readonly && setIsEditing(true)}
      >
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
          onClick={(e) => e.stopPropagation()}
        >
          <LinkIcon className="w-4 h-4" />
          <span className="truncate">{data.text || data.url}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-lg p-3 space-y-3">
      <div>
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onChange({ ...data, url: e.target.value })}
          placeholder="https://example.com"
          className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-sm"
        />
      </div>
      <div>
        <input
          type="text"
          value={data.text || ''}
          onChange={(e) => onChange({ ...data, text: e.target.value })}
          placeholder="Link text (optional)"
          className="w-full p-2 bg-black/40 border border-white/20 rounded text-white text-sm"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-gray-600/80 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1 text-xs bg-blue-600/80 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Checkbox Column Component
export const CheckboxColumn: React.FC<{
  data: boolean;
  onChange: (data: boolean) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => !readonly && onChange(!data)}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                   ${data
                     ? 'bg-green-500 border-green-500 text-white'
                     : 'border-white/20 backdrop-blur-sm bg-black/10 hover:bg-black/20'
                   } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        disabled={readonly}
      >
        {data && <CheckCircle2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

// Connect Boards Column Component
export const ConnectBoardsColumn: React.FC<{
  data: ConnectBoardsData;
  onChange: (data: ConnectBoardsData) => void;
  readonly?: boolean;
}> = ({ data, onChange, readonly }) => {
  return (
    <div className="space-y-1">
      {data.connectedItems.map((item, index) => (
        <div
          key={`${item.boardId}-${item.itemId}`}
          className="flex items-center space-x-2 p-2 backdrop-blur-sm bg-black/10
                     border border-white/10 rounded hover:bg-black/20 cursor-pointer"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{item.itemName}</div>
            <div className="text-xs text-gray-400">{item.boardName}</div>
          </div>
        </div>
      ))}

      {!readonly && (
        <button
          className="w-full p-2 border border-dashed border-white/20 rounded
                     backdrop-blur-sm bg-black/10 hover:bg-black/20 text-gray-300
                     text-sm flex items-center justify-center space-x-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>Connect Items</span>
        </button>
      )}
    </div>
  );
};

// Mirror Column Component
export const MirrorColumn: React.FC<{
  data: MirrorData;
  readonly?: true; // Mirror columns are always readonly
}> = ({ data }) => {
  return (
    <div className="p-2 backdrop-blur-sm bg-purple-500/20 border border-purple-400/20 rounded">
      <div className="text-sm text-purple-200">{String(data.sourceValue)}</div>
      <div className="text-xs text-purple-400">
        Mirrored • {new Date(data.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
};