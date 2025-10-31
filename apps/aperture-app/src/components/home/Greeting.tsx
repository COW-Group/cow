import React, { useEffect, useState } from 'react';
import { GreetingProps, TimeOfDay } from '../../types/home.types';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function Greeting({ userName, timeOfDay }: GreetingProps) {
  const [currentTimeOfDay, setCurrentTimeOfDay] = useState<TimeOfDay>(timeOfDay || getTimeOfDay());

  useEffect(() => {
    if (!timeOfDay) {
      // Update time of day every minute
      const interval = setInterval(() => {
        setCurrentTimeOfDay(getTimeOfDay());
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [timeOfDay]);

  const greeting = `Good ${currentTimeOfDay}, ${userName}!`;

  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-black dark:text-white mb-2">
        {greeting}
      </h1>
      <p className="text-sm text-gray-400">
        Quickly access your recent boards, inbox and workspaces
      </p>
    </div>
  );
}