import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, HelpCircle, ChevronRight } from 'lucide-react';

interface LearnItem {
  id: string;
  title: string;
  description: string;
  icon: 'rocket' | 'help';
  iconColor: string;
  route: string;
}

const iconMap = {
  rocket: Rocket,
  help: HelpCircle
};

export function LearnSection() {
  const learnItems: LearnItem[] = [
    {
      id: '1',
      title: 'Getting started',
      description: 'Learn how COW works',
      icon: 'rocket',
      iconColor: 'text-blue-500',
      route: '/help/getting-started'
    },
    {
      id: '2', 
      title: 'Help center',
      description: 'Learn and get support',
      icon: 'help',
      iconColor: 'text-purple-500',
      route: '/help'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-black dark:text-white">
        Learn & get inspired
      </h3>
      
      <div className="space-y-3">
        {learnItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          
          return (
            <Link
              key={item.id}
              to={item.route}
              className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-black dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}