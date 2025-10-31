import React from 'react';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MaunAppContext } from '../../../store/maun-apps.store';

interface HabitsAppProps {
  context: MaunAppContext;
}

export function HabitsApp({ context }: HabitsAppProps) {
  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-green-900 to-teal-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-6">📅</div>
        <h1 className="text-4xl font-bold mb-4">Habits Tracker</h1>
        <p className="text-xl text-green-200 mb-8">
          Track your daily habits and build consistency over time
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-6">
            <Calendar className="h-8 w-8 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-semibold mb-2">Daily Tracking</h3>
            <p className="text-green-200 text-sm">Mark habits complete each day</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-semibold mb-2">Progress Analytics</h3>
            <p className="text-green-200 text-sm">Visualize your consistency streaks</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6">
            <Target className="h-8 w-8 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-semibold mb-2">Goal Setting</h3>
            <p className="text-green-200 text-sm">Set and achieve habit targets</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-8 mb-8">
          <p className="text-lg text-green-200 mb-4">
            Full habits tracking implementation coming soon!
          </p>
          <p className="text-sm text-green-300">
            This will include habit calendars, streak tracking, and progress analytics.
          </p>
        </div>
        
        <Button
          onClick={context.onClose}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Close Habits
        </Button>
      </div>
    </div>
  );
}