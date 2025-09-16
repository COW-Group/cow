import React from 'react';
import { BookOpen, PenTool, Calendar } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MaunAppContext } from '../../../store/maun-apps.store';

interface JournalAppProps {
  context: MaunAppContext;
}

export function JournalApp({ context }: JournalAppProps) {
  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-amber-900 to-orange-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-6">📓</div>
        <h1 className="text-4xl font-bold mb-4">Journal</h1>
        <p className="text-xl text-amber-200 mb-8">
          Reflect, process, and document your journey
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-6">
            <PenTool className="h-8 w-8 mx-auto mb-4 text-amber-400" />
            <h3 className="text-lg font-semibold mb-2">Daily Entries</h3>
            <p className="text-amber-200 text-sm">Write your thoughts and experiences</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6">
            <Calendar className="h-8 w-8 mx-auto mb-4 text-amber-400" />
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-amber-200 text-sm">Browse entries by date</p>
          </div>
          <div className="bg-white/10 rounded-lg p-6">
            <BookOpen className="h-8 w-8 mx-auto mb-4 text-amber-400" />
            <h3 className="text-lg font-semibold mb-2">Guided Prompts</h3>
            <p className="text-amber-200 text-sm">Structured reflection questions</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-8 mb-8">
          <p className="text-lg text-amber-200 mb-4">
            Full journaling system coming soon!
          </p>
          <p className="text-sm text-amber-300">
            This will include daily prompts, mood tracking, and search capabilities.
          </p>
        </div>
        
        <Button
          onClick={context.onClose}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Close Journal
        </Button>
      </div>
    </div>
  );
}