import React from 'react';

interface ProgressDisplayProps {
  progress: number; // 0-100
}

export function ProgressDisplay({ progress }: ProgressDisplayProps) {
  return (
    <div className="progress-display min-w-48">
      <div className="progress-bar w-full h-8 bg-gray-700 rounded-2xl overflow-hidden">
        <div
          className="progress-indicator h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}