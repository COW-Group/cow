import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { CardWidget } from './CardWidget';
import { UpdateFeed as UpdateFeedType } from '../../types/home.types';

interface UpdateFeedProps {
  updates: UpdateFeedType[];
  unreadCount: number;
}

// High-five illustration SVG component
function HighFiveIllustration() {
  return (
    <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full h-auto"
      >
        {/* Left hand (diverse skin tone) */}
        <path
          d="M30 80 C25 75, 20 70, 25 60 C30 55, 40 58, 45 65 L60 80 C58 85, 50 90, 45 85 L30 80 Z"
          fill="#D2691E"
          stroke="#8B4513"
          strokeWidth="1"
        />
        {/* Green star bracelet */}
        <circle cx="35" cy="85" r="3" fill="#22C55E" />
        <polygon points="35,82 36.5,86 40,86 37,88.5 38,92 35,90 32,92 33,88.5 30,86 33.5,86" fill="#16A34A" />
        
        {/* Right hand (different diverse skin tone) */}
        <path
          d="M120 80 C125 75, 130 70, 125 60 C120 55, 110 58, 105 65 L90 80 C92 85, 100 90, 105 85 L120 80 Z"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="1"
        />
        {/* Yellow cuff */}
        <rect x="115" y="82" width="8" height="6" rx="2" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
        
        {/* Sparkles/impact lines */}
        <path d="M75 75 L80 70 M70 75 L75 70 M75 85 L80 80 M70 85 L75 80" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <circle cx="85" cy="65" r="2" fill="#F59E0B" opacity="0.8" />
        <circle cx="65" cy="65" r="1.5" fill="#EF4444" opacity="0.8" />
        <circle cx="85" cy="95" r="1.5" fill="#3B82F6" opacity="0.8" />
      </svg>
    </div>
  );
}

export function UpdateFeed({ updates, unreadCount }: UpdateFeedProps) {
  const [filter, setFilter] = useState<'unread' | 'all'>('unread');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredUpdates = filter === 'unread' 
    ? updates.filter(update => !update.read)
    : updates;

  const badgeCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  const headerAction = (
    <div className="relative">
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span className="capitalize">{filter}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isFilterOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50">
          <div className="py-2">
            <button
              onClick={() => {
                setFilter('unread');
                setIsFilterOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Unread only
            </button>
            <button
              onClick={() => {
                setFilter('all');
                setIsFilterOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              All updates
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const titleWithBadge = (
    <div className="flex items-center space-x-2">
      <span>Update feed (Inbox)</span>
      {unreadCount > 0 && (
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full min-w-[1.5rem] h-6">
          {badgeCount}
        </span>
      )}
    </div>
  );

  return (
    <CardWidget 
      title={titleWithBadge as any} 
      className="mb-6"
      headerAction={headerAction}
    >
      {filteredUpdates.length === 0 ? (
        <div className="text-center py-12">
          <HighFiveIllustration />
          <h4 className="text-base text-gray-700 dark:text-gray-300 mb-2">
            No unread updates
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            To revisit updates you've already read, change the filter at the top right corner of your feed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <div
              key={update.id}
              className={`p-4 rounded-lg border-l-4 ${
                update.read 
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm ${
                    update.read 
                      ? 'text-gray-700 dark:text-gray-300' 
                      : 'text-blue-900 dark:text-blue-100 font-medium'
                  }`}>
                    {update.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {update.timestamp.toLocaleDateString()}
                  </p>
                </div>
                {!update.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardWidget>
  );
}