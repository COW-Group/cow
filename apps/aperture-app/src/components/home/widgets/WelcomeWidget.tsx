import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Coffee, Zap, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeWidgetProps {
  userName?: string;
  showQuickStats?: boolean;
  showMotivation?: boolean;
  customGreeting?: string;
}

const MOTIVATIONAL_QUOTES = [
  "Every sale begins with a conversation.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Your network is your net worth.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Don't wait for opportunity. Create it.",
  "Progress, not perfection.",
];

const TIME_BASED_GREETINGS = {
  morning: {
    greeting: "Good morning",
    icon: <Sun className="w-5 h-5 text-yellow-500" />,
    message: "Ready to start another great day?",
    color: "from-yellow-50 to-orange-50",
  },
  afternoon: {
    greeting: "Good afternoon",
    icon: <Coffee className="w-5 h-5 text-orange-500" />,
    message: "Hope you're having a productive day!",
    color: "from-orange-50 to-red-50",
  },
  evening: {
    greeting: "Good evening",
    icon: <Moon className="w-5 h-5 text-purple-500" />,
    message: "Time to wrap up and plan for tomorrow.",
    color: "from-purple-50 to-blue-50",
  },
};

export function WelcomeWidget({
  userName = "there",
  showQuickStats = true,
  showMotivation = true,
  customGreeting,
}: WelcomeWidgetProps) {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay('morning');
    } else if (hour < 17) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }

    // Set random motivational quote
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const currentGreeting = TIME_BASED_GREETINGS[timeOfDay];
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${currentGreeting.color} p-6`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `radial-gradient(circle at 50% 50%, currentColor 1px, transparent 1px)`,
               backgroundSize: '24px 24px'
             }}
        />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Main Greeting */}
        <div className="flex items-center gap-3 mb-3">
          {currentGreeting.icon}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {customGreeting || `${currentGreeting.greeting}, ${userName}! 👋`}
            </h2>
            <p className="text-sm text-gray-600">
              {todayDate}
            </p>
          </div>
        </div>

        {/* Time-based message */}
        <p className="text-gray-700 mb-4">
          {currentGreeting.message}
        </p>

        {/* Quick Stats */}
        {showQuickStats && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white bg-opacity-50 rounded-lg p-3 text-center"
            >
              <Target className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-600">Goals</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white bg-opacity-50 rounded-lg p-3 text-center"
            >
              <Zap className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">8</div>
              <div className="text-xs text-gray-600">Active</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white bg-opacity-50 rounded-lg p-3 text-center"
            >
              <TrendingUp className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">94%</div>
              <div className="text-xs text-gray-600">Progress</div>
            </motion.div>
          </div>
        )}

        {/* Motivational Quote */}
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white bg-opacity-30 rounded-lg p-3 border border-white border-opacity-20"
          >
            <p className="text-sm text-gray-700 italic text-center font-medium">
              "{currentQuote}"
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/goals')}
            className="flex-1 bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-all"
          >
            View Goals
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/boards')}
            className="flex-1 bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-all"
          >
            Quick Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}