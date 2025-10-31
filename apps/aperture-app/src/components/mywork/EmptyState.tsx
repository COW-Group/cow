import React from 'react';
import { HelpCircle, Compass } from 'lucide-react';

interface EmptyStateProps {
  onHelp?: () => void;
  onGetStarted?: () => void;
}

export function EmptyState({ onHelp, onGetStarted }: EmptyStateProps) {
  const handleHelpClick = () => {
    if (onHelp) {
      onHelp();
    }
  };

  const handleGetStartedClick = () => {
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12">
      {/* Get Started Button */}
      <button
        onClick={handleGetStartedClick}
        className="liquid-button-primary inline-flex items-center px-6 py-3 text-lg font-medium rounded-xl"
      >
        <Compass className="w-5 h-5 mr-2" />
        Get Started
      </button>

      {/* Floating help button */}
      <button
        onClick={handleHelpClick}
        className="fixed bottom-6 right-6 w-10 h-10 liquid-button-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Get help"
        title="Get help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}