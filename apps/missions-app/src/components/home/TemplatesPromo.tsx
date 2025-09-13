import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

export function TemplatesPromo() {
  return (
    <div className="bg-purple-900 dark:bg-purple-900 rounded-lg p-6 h-fit">
      <h3 className="text-base font-bold text-white mb-4">
        Boost your workflow in minutes with ready-made templates
      </h3>
      
      {/* Sample template preview */}
      <div className="bg-purple-800/50 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="h-5 w-5 text-purple-200" />
          <span className="text-sm text-purple-200 font-medium">
            Marketing Calendar Template
          </span>
        </div>
        
        {/* Mock calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              className={`h-6 rounded text-xs flex items-center justify-center ${
                i % 3 === 0
                  ? 'bg-purple-400 text-white'
                  : i % 5 === 0
                  ? 'bg-purple-300 text-purple-900'
                  : 'bg-purple-600/30 text-purple-200'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/templates"
        className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors group"
      >
        <span>Explore templates</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}