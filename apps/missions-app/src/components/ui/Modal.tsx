import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  showHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  showHeader = true
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Modal - Sumi-e Sky + Earth Aesthetic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                relative w-full ${sizeClasses[size]} mx-auto
                rounded-2xl shadow-2xl
                overflow-hidden
              `}
              style={{
                background: 'var(--bg-elevated)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(14, 165, 233, 0.2)'
              }}
            >
              {/* Subtle Cyan Accent Line - Sumi-e Sky */}
              <div style={{
                height: '1px',
                background: 'linear-gradient(to right, transparent 0%, var(--cyan-bright) 50%, transparent 100%)',
                opacity: 0.3
              }} />

              {/* Header */}
              {showHeader && (title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 pb-0">
                  <div>
                    {title && (
                      <h2
                        className="text-2xl font-light tracking-tight"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-2 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
                        {description}
                      </p>
                    )}
                  </div>

                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}