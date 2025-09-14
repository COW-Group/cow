import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../ui/CommandPalette';
import { Modal } from '../ui/Modal';

export function MainLayout() {
  const { sidebarOpen, activeModal, modalData, closeModal } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            {...({ className: "fixed inset-y-0 left-0 z-50 w-80 lg:relative lg:z-0" } as any)}
          >
            <Sidebar />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette />
      
      {activeModal && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          title={modalData?.title || ''}
        >
          {/* Modal content will be rendered based on activeModal type */}
          {modalData?.content}
        </Modal>
      )}
    </div>
  );
}