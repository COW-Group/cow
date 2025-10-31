import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 py-12">
      {/* Illustration with pills */}
      <div className="flex items-center space-x-2 mb-8 relative">
        <div className="bg-yellow-300 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium">
          Tasks
        </div>
        <div className="bg-green-300 text-green-900 px-4 py-2 rounded-full text-sm font-medium">
          Projects
        </div>
        <div className="bg-red-300 text-red-900 px-4 py-2 rounded-full text-sm font-medium">
          Deadlines
        </div>
        
        {/* Yellow dot pointer */}
        <div className="absolute -bottom-4 left-12 w-2 h-2 bg-yellow-500 rounded-full"></div>
      </div>

      {/* Description text */}
      <div className="max-w-md text-center mb-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-6">
          This is your home base, where you can see all your work in one place. 
          When you are assigned an item on any board, it will appear here. 
          It looks like there are no items assigned to you at the moment.
        </p>
      </div>

      {/* Learn more link */}
      <Link 
        to="/help" 
        className="text-green-500 hover:text-green-600 underline text-sm"
      >
        Learn more
      </Link>

      {/* Floating Help button */}
      <div className="fixed bottom-6 right-6">
        <button className="h-10 w-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}