import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { EmptyStateIllustration } from './EmptyStateIllustration';

interface EmptyStateProps {
  onHelp?: () => void;
}

export function EmptyState({ onHelp }: EmptyStateProps) {
  const handleHelpClick = () => {
    if (onHelp) {
      onHelp();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12">
      {/* Illustration */}
      <EmptyStateIllustration />

      {/* Main text */}
      <h3 className="text-lg font-bold text-gray-300 dark:text-gray-300 mb-4 text-center max-w-md">
        This is your home base, where you can see all your work in one place.
      </h3>

      {/* Description text */}
      <p className="text-sm text-gray-400 dark:text-gray-400 leading-relaxed text-center max-w-lg mb-6">
        When you are assigned an item on any board, it will appear here. It looks like there are no items assigned to you at the moment.
      </p>

      {/* Learn more link */}
      <Link
        to="/help"
        className="text-blue-500 text-sm underline hover:text-blue-400 hover:no-underline transition-colors"
      >
        Learn more
      </Link>

      {/* Floating help button */}
      <button
        onClick={handleHelpClick}
        className="fixed bottom-6 right-6 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-400 transition-all duration-200 flex items-center justify-center"
        aria-label="Get help"
        title="Get help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}