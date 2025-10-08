import React, { useState } from 'react';
import { 
  Star, 
  Sparkles, 
  Mail, 
  Zap, 
  MessageCircle, 
  Repeat, 
  ChevronRight,
  UserPlus
} from 'lucide-react';
// import { Popover } from '@headlessui/react';

interface CollaborationBarProps {
  onInvite?: () => void;
  onSidekick?: () => void;
  onEnhance?: () => void;
  onIntegrate?: () => void;
  onAutomate?: () => void;
  onChat?: () => void;
}

export function CollaborationBar({
  onInvite,
  onSidekick,
  onEnhance,
  onIntegrate,
  onAutomate,
  onChat
}: CollaborationBarProps) {
  const [showInvitePopover, setShowInvitePopover] = useState(false);

  return (
    <div className="flex items-center space-x-4">
      {/* Collaboration Tools */}
      <button
        onClick={onSidekick}
        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-teal-500 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        <span>Sidekick</span>
      </button>

      <button
        onClick={onEnhance}
        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-teal-500 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        <span>Enhance</span>
      </button>

      <button
        onClick={onIntegrate}
        className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
      >
        <Mail className="h-3 w-3 text-white" />
      </button>

      <button
        onClick={onAutomate}
        className="text-gray-400 hover:text-teal-500 transition-colors"
      >
        <Zap className="h-4 w-4" />
      </button>

      <button
        onClick={onChat}
        className="text-gray-400 hover:text-teal-500 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
      </button>

      <button className="text-gray-400 hover:text-teal-500 transition-colors">
        <Repeat className="h-4 w-4" />
      </button>

      {/* User Invite */}
      <Popover className="relative">
        <Popover.Button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 transition-colors">
          <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <UserPlus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          </div>
          <span>Invite /1</span>
          <ChevronRight className="h-3 w-3" />
        </Popover.Button>

        <Popover.Panel className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Invite People
            </h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onInvite?.();
                    setShowInvitePopover(false);
                  }}
                  className="px-3 py-1 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}