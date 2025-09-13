import React from 'react';
import { CardWidgetProps } from '../../types/home.types';

export function CardWidget({ title, children, className = '', headerAction }: CardWidgetProps) {
  return (
    <div className={`bg-gray-800 dark:bg-gray-800 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-black dark:text-white">{title}</h3>
        {headerAction && (
          <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            {headerAction}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}