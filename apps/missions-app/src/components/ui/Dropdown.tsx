import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  submenu?: DropdownItem[];
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onItemClick: (item: DropdownItem) => void;
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, onItemClick, align = 'right' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      onItemClick(item);
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const alignmentClasses = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div ref={dropdownRef} className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-full mt-2 ${alignmentClasses} z-50
              w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg
              border border-gray-200 dark:border-gray-700
              py-1
            `}
          >
            {items.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center justify-between px-4 py-2 text-sm
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${activeSubmenu === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-4 border-l border-gray-200 dark:border-gray-700"
                  >
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          onItemClick(subItem);
                          setIsOpen(false);
                          setActiveSubmenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}