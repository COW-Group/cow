import React, { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MaunAppContext } from '../../../store/maun-apps.store';

interface DashboardAppProps {
  context: MaunAppContext;
}

export function DashboardApp({ context }: DashboardAppProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      // Update greeting based on time of day
      const hour = now.getHours();
      if (hour < 6) setGreeting('Good night');
      else if (hour < 12) setGreeting('Good morning');
      else if (hour < 17) setGreeting('Good afternoon');
      else if (hour < 21) setGreeting('Good evening');
      else setGreeting('Good night');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 6) return <Moon className="h-8 w-8 text-indigo-400" />;
    if (hour < 12) return <Sunrise className="h-8 w-8 text-orange-400" />;
    if (hour < 17) return <Sun className="h-8 w-8 text-yellow-400" />;
    if (hour < 21) return <Sunset className="h-8 w-8 text-orange-500" />;
    return <Moon className="h-8 w-8 text-indigo-400" />;
  };

  const quickActions = [
    {
      id: 'focus',
      label: 'Start Focus Session',
      icon: <Play className="h-5 w-5" />,
      description: 'Begin a focused work session',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => {
        // Launch focus mode app
        console.log('Launching focus mode...');
      }
    },
    {
      id: 'journal',
      label: 'Daily Journal',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Reflect on your day',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => {
        console.log('Opening journal...');
      }
    },
    {
      id: 'emotional',
      label: 'Emotional Check-in',
      icon: <Clock className="h-5 w-5" />,
      description: 'Process your feelings',
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => {
        console.log('Opening emotional processing...');
      }
    }
  ];

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {/* Time Display */}
        <div className="mb-8">
          <div className="text-8xl font-light font-mono mb-4 tracking-wider">
            {currentTime}
          </div>
          <div className="text-2xl text-slate-300">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Greeting */}
        <div className="flex items-center gap-4 mb-12">
          {getGreetingIcon()}
          <div>
            <h2 className="text-3xl font-light mb-1">
              {greeting}, {userName}
            </h2>
            <p className="text-slate-400 text-lg">
              Ready to make today meaningful?
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-medium">{action.label}</h3>
              </div>
              <p className="text-slate-300 text-sm">{action.description}</p>
            </div>
          ))}
        </div>

        {/* Mindful Quote */}
        <div className="mt-12 max-w-2xl">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <blockquote className="text-lg italic text-slate-300 mb-2">
              "The present moment is the only time over which we have dominion."
            </blockquote>
            <cite className="text-sm text-slate-400">— Thích Nhất Hạnh</cite>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8">
          <Button
            onClick={context.onClose}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Close Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}