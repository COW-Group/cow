import React from 'react';

export function EmptyStateIllustration() {
  return (
    <div className="relative w-64 h-48 mx-auto mb-6 select-none">
      {/* Circular arrangement container */}
      <div className="absolute left-8 top-8 w-48 h-32">
        {/* Three stacked rounded pills in circular arrangement */}
        <div className="relative">
          {/* Top pill - Yellow (#FFEB3B) */}
          <div className="absolute top-0 left-6 w-36 h-6 rounded-full shadow-md flex items-center justify-center transform -rotate-6"
               style={{ backgroundColor: '#FFEB3B' }}>
            <span className="text-xs font-medium text-gray-800">
              Task Management
            </span>
          </div>
          
          {/* Middle pill - Green (#4CAF50) */}
          <div className="absolute top-6 left-4 w-36 h-6 rounded-full shadow-md flex items-center justify-center"
               style={{ backgroundColor: '#4CAF50' }}>
            <span className="text-xs font-medium text-white">
              Project Tracking  
            </span>
          </div>
          
          {/* Bottom pill - Red (#F44336) */}
          <div className="absolute top-12 left-8 w-36 h-6 rounded-full shadow-md flex items-center justify-center transform rotate-3"
               style={{ backgroundColor: '#F44336' }}>
            <span className="text-xs font-medium text-white">
              Issue Resolution
            </span>
          </div>
        </div>
      </div>

      {/* Pointing hand from bottom right - diverse skin tone */}
      <div className="absolute bottom-2 right-4 transform translate-x-2">
        <svg 
          width="80" 
          height="60" 
          viewBox="0 0 80 60" 
          fill="none" 
          className="drop-shadow-lg"
          role="img"
          aria-label="Hand pointing to work items"
        >
          {/* Sleeve - Purple */}
          <ellipse 
            cx="16" 
            cy="45" 
            rx="15" 
            ry="10" 
            fill="#8B5CF6" 
            className="opacity-90"
          />
          
          {/* Hand base - diverse skin tone */}
          <path 
            d="M25 35 C35 33, 45 33, 55 35 L55 45 C55 50, 50 55, 45 55 L35 55 C30 55, 25 50, 25 45 Z" 
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
          
          {/* Pointing finger */}
          <rect 
            x="55" 
            y="37" 
            width="20" 
            height="8" 
            rx="4" 
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
          
          {/* Fingertip */}
          <circle 
            cx="75" 
            cy="41" 
            r="4" 
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
          
          {/* Thumb */}
          <ellipse 
            cx="37" 
            cy="30" 
            rx="5" 
            ry="10" 
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="1"
          />
          
          {/* Motion lines and sparkles */}
          <g stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <line x1="65" y1="30" x2="70" y2="25" />
            <line x1="70" y1="33" x2="75" y2="28" />
            <circle cx="68" cy="20" r="1.5" fill="#FFEB3B" opacity="0.8" />
            <circle cx="78" cy="25" r="1" fill="#4CAF50" opacity="0.8" />
          </g>
        </svg>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 w-40 h-40 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-30"></div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-8 w-2 h-2 bg-yellow-300 dark:bg-yellow-600 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-green-400 dark:bg-green-600 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-12 left-4 w-1 h-1 bg-red-400 dark:bg-red-600 rounded-full opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}