import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowUp, Clock, Star, Folder, Target, Plus } from 'lucide-react';
import { useAppStore, useWorkspaceStore } from '@/store';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { recentlyViewed, favorites, openModal } = useAppStore();
  const { projects, goals } = useWorkspaceStore();
  const navigate = useNavigate();

  // Listen for keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate command items
  const commands: CommandItem[] = [
    // Quick actions
    {
      id: 'create-project',
      title: 'Create New Project',
      icon: Plus,
      category: 'Actions',
      action: () => openModal('create-project')
    },
    {
      id: 'create-task',
      title: 'Create New Task',
      icon: Plus,
      category: 'Actions',
      action: () => openModal('create-task')
    },
    {
      id: 'create-goal',
      title: 'Create New Goal',
      icon: Plus,
      category: 'Actions',
      action: () => openModal('create-goal')
    },
    
    // Recent projects
    ...projects.slice(0, 5).map(project => ({
      id: `project-${project.id}`,
      title: project.name,
      subtitle: 'Project',
      icon: Folder,
      category: 'Projects',
      action: () => navigate(`/projects/${project.id}`)
    })),
    
    // Recent goals
    ...goals.slice(0, 3).map(goal => ({
      id: `goal-${goal.id}`,
      title: goal.name,
      subtitle: 'Goal',
      icon: Target,
      category: 'Goals',
      action: () => navigate(`/goals/${goal.id}`)
    })),
    
    // Recent items
    ...recentlyViewed.slice(0, 5).map(item => ({
      id: `recent-${item.id}`,
      title: item.name,
      subtitle: `Recent ${item.type}`,
      icon: Clock,
      category: 'Recent',
      action: () => navigate(`/${item.type}/${item.id}`)
    }))
  ];

  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.category.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
          setQuery('');
          setSelectedIndex(0);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-start justify-center p-4 pt-16">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                autoFocus
              />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                  ⌘K
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedCommands).map(([category, items], categoryIndex) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {category}
                      </div>
                      {items.map((command, itemIndex) => {
                        const globalIndex = Object.entries(groupedCommands)
                          .slice(0, categoryIndex)
                          .reduce((sum, [, catItems]) => sum + catItems.length, 0) + itemIndex;
                        
                        return (
                          <button
                            key={command.id}
                            onClick={() => {
                              command.action();
                              setIsOpen(false);
                              setQuery('');
                              setSelectedIndex(0);
                            }}
                            className={`
                              w-full flex items-center gap-3 px-4 py-3 text-left
                              hover:bg-gray-50 dark:hover:bg-gray-700
                              ${globalIndex === selectedIndex ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                            `}
                          >
                            <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center
                              ${globalIndex === selectedIndex 
                                ? 'bg-primary-100 dark:bg-primary-800' 
                                : 'bg-gray-100 dark:bg-gray-700'
                              }
                            `}>
                              <command.icon className={`
                                h-4 w-4 
                                ${globalIndex === selectedIndex 
                                  ? 'text-primary-600 dark:text-primary-400' 
                                  : 'text-gray-600 dark:text-gray-400'
                                }
                              `} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {command.title}
                              </div>
                              {command.subtitle && (
                                <div className="text-xs text-gray-500">
                                  {command.subtitle}
                                </div>
                              )}
                            </div>
                            {globalIndex === selectedIndex && (
                              <div className="text-xs text-gray-400">
                                <ArrowUp className="h-3 w-3 rotate-90" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded font-mono">↑↓</div>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded font-mono">↵</div>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded font-mono">esc</div>
                    <span>Close</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}