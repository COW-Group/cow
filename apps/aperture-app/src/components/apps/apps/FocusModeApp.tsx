import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Plus, Clock, Target } from 'lucide-react';
import { Button } from '../../ui/Button';
import { MaunAppContext } from '../../../store/maun-apps.store';

interface FocusModeAppProps {
  context: MaunAppContext;
}

export function FocusModeApp({ context }: FocusModeAppProps) {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [currentTask, setCurrentTask] = useState('Focus on current priorities');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      // Auto-switch session type
      if (sessionType === 'work') {
        setSessionType('break');
        setTimeRemaining(5 * 60); // 5 minute break
      } else {
        setSessionType('work');
        setTimeRemaining(25 * 60); // 25 minute work session
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining, sessionType]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(sessionType === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (sessionType === 'work') {
      setSessionType('break');
      setTimeRemaining(5 * 60);
    } else {
      setSessionType('work');
      setTimeRemaining(25 * 60);
    }
  };

  const progress = sessionType === 'work'
    ? 1 - (timeRemaining / (25 * 60))
    : 1 - (timeRemaining / (5 * 60));

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Focus Mode</h1>
          <p className="text-lg text-purple-200">
            {sessionType === 'work' ? 'Time to focus and get things done' : 'Take a mindful break'}
          </p>
        </div>

        {/* Timer Circle */}
        <div className="relative mb-8">
          <div className="w-80 h-80 mx-auto relative">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={sessionType === 'work' ? '#3B82F6' : '#10B981'}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <div className="text-6xl font-mono font-bold mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-lg text-purple-200 capitalize">
                  {sessionType} Session
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            onClick={handleStartPause}
            size="lg"
            className={`${
              sessionType === 'work'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
            } px-8`}
          >
            {isRunning ? <Pause className="h-6 w-6 mr-2" /> : <Play className="h-6 w-6 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>

          <Button onClick={handleReset} variant="outline" size="lg">
            <Clock className="h-5 w-5 mr-2" />
            Reset
          </Button>

          <Button onClick={handleSkip} variant="outline" size="lg">
            <SkipForward className="h-5 w-5 mr-2" />
            Skip
          </Button>
        </div>

        {/* Current Task */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-semibold">Current Focus</h3>
          </div>
          <p className="text-lg text-purple-100 mb-4">{currentTask}</p>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Session Tips */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto mb-8">
          <h3 className="text-lg font-semibold mb-3">
            {sessionType === 'work' ? 'Focus Tips' : 'Break Ideas'}
          </h3>
          <ul className="text-sm text-purple-200 space-y-2">
            {sessionType === 'work' ? (
              <>
                <li>• Minimize distractions - close unnecessary tabs</li>
                <li>• Break large tasks into smaller, manageable pieces</li>
                <li>• Keep your workspace organized and comfortable</li>
              </>
            ) : (
              <>
                <li>• Step away from your screen and stretch</li>
                <li>• Take a few deep breaths and relax</li>
                <li>• Hydrate and give your eyes a rest</li>
              </>
            )}
          </ul>
        </div>

        {/* Close Button */}
        <Button
          onClick={context.onClose}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Close Focus Mode
        </Button>
      </div>
    </div>
  );
}