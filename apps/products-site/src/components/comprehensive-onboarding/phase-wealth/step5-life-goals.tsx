import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, GraduationCap, Home, Plane, Heart, Briefcase, Building2 } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

const lifeGoalIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  security: Shield,
  retirement: Heart,
  education: GraduationCap,
  home: Home,
  travel: Plane,
  legacy: Heart,
  business: Briefcase,
}

const lifeGoalDescriptions: Record<string, string> = {
  security: 'Build an emergency fund and financial safety net',
  retirement: 'Prepare for a comfortable retirement',
  education: 'Save for education expenses',
  home: 'Purchase or upgrade your home',
  travel: 'Fund adventures and experiences',
  legacy: 'Create generational wealth',
  business: 'Start or grow your business',
}

export const Step5LifeGoals: React.FC = () => {
  const { state, toggleLifeGoal, nextStep, prevStep } = useComprehensiveOnboarding()
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "What are your life goals? Select all that matter to you. This helps us align your wealth strategy with what truly matters."

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => stop()
  }, [stop])

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    stop()
    nextStep()
  }

  const selectedGoalsCount = state.lifeGoals.filter((g) => g.selected).length
  const isFormValid = selectedGoalsCount > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-white mb-4">
            What are your life goals?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select all that matter to you. Your wealth should serve your life, not the other way around.
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Life Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {state.lifeGoals.map((goal, index) => {
              const IconComponent = lifeGoalIcons[goal.id] || Heart
              const isSelected = goal.selected

              return (
                <motion.button
                  key={goal.id}
                  onClick={() => toggleLifeGoal(goal.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                    ${
                      isSelected
                        ? 'border-[#059669] bg-gradient-to-br from-[#059669]/10 to-transparent shadow-lg shadow-[#059669]/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#059669]/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                      p-3 rounded-lg transition-all flex-shrink-0
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#059669] to-[#047857] shadow-lg shadow-[#059669]/30'
                          : 'bg-slate-100 dark:bg-slate-700/50'
                      }
                    `}
                    >
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-[#059669]'}`} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">{goal.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {lifeGoalDescriptions[goal.id]}
                      </p>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0 w-6 h-6 rounded-full bg-[#059669] flex items-center justify-center"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Selection Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="text-center pt-4"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedGoalsCount === 0 ? (
                'Select at least one goal to continue'
              ) : (
                <>
                  {selectedGoalsCount} {selectedGoalsCount === 1 ? 'goal' : 'goals'} selected
                </>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 px-8 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-lg hover:border-[#0066FF] hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-all duration-300"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0066FF] disabled:hover:to-[#2563eb]"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
