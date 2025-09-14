import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  count?: number;
}

interface ShortcutsWidgetProps {
  title?: string;
  shortcuts?: ShortcutItem[];
  layout?: 'grid' | 'list';
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    id: '1',
    title: 'My Boards',
    description: 'View and manage your boards',
    icon: '📋',
    color: 'bg-blue-500',
    route: '/boards',
    count: 12,
  },
  {
    id: '2',
    title: 'Goals',
    description: 'Track your goals and progress',
    icon: '🎯',
    color: 'bg-green-500',
    route: '/goals',
    count: 8,
  },
  {
    id: '3',
    title: 'Insights',
    description: 'View reports and analytics',
    icon: '📊',
    color: 'bg-purple-500',
    route: '/insights',
  },
  {
    id: '4',
    title: 'Agents',
    description: 'Manage your AI agents',
    icon: '🤖',
    color: 'bg-orange-500',
    route: '/agents',
  },
];

export function ShortcutsWidget({
  title = 'Quick Shortcuts',
  shortcuts = DEFAULT_SHORTCUTS,
  layout = 'grid',
}: ShortcutsWidgetProps) {
  const navigate = useNavigate();

  const handleShortcutClick = (route: string) => {
    if (route.startsWith('/')) {
      navigate(route);
    } else {
      window.open(route, '_blank');
    }
  };

  if (layout === 'list') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Zap className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleShortcutClick(shortcut.route)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 ${shortcut.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                  {shortcut.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{shortcut.title}</h4>
                  <p className="text-sm text-gray-500">{shortcut.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                {shortcut.count && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                    {shortcut.count}
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Zap className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {shortcuts.map((shortcut, index) => (
          <motion.div
            key={shortcut.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleShortcutClick(shortcut.route)}
            className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 ${shortcut.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                {shortcut.icon}
              </div>
              {shortcut.count && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {shortcut.count}
                </span>
              )}
            </div>

            <h4 className="font-medium text-gray-900 text-sm mb-1">{shortcut.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{shortcut.description}</p>

            <ExternalLink className="w-3 h-3 text-gray-400 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}