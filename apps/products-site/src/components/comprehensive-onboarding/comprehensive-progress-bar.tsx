import type React from 'react'
import { motion } from 'framer-motion'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { Check } from 'lucide-react'

interface Phase {
  id: string
  name: string
  steps: number[]
  icon?: string
}

export const ComprehensiveProgressBar: React.FC = () => {
  const { state } = useComprehensiveOnboarding()
  const { currentStep, skipWealthJourney, completedPhases } = state

  // Define phases based on flow type
  const phases: Phase[] = skipWealthJourney
    ? [
        { id: 'welcome', name: 'Welcome', steps: [1, 2] },
        { id: 'classification', name: 'Classification', steps: [11, 12, 13] },
        { id: 'account', name: 'Account', steps: [14] },
      ]
    : [
        { id: 'welcome', name: 'Welcome', steps: [1, 2] },
        { id: 'wealth', name: 'Your Journey', steps: [3, 4, 5, 6, 7, 8, 9, 10] },
        { id: 'classification', name: 'Classification', steps: [11, 12, 13] },
        { id: 'account', name: 'Account', steps: [14] },
      ]

  // Calculate current phase and progress
  const getCurrentPhase = () => {
    for (let i = 0; i < phases.length; i++) {
      if (phases[i].steps.includes(currentStep)) {
        return i
      }
    }
    return 0
  }

  const currentPhaseIndex = getCurrentPhase()
  const currentPhase = phases[currentPhaseIndex]

  // Calculate progress within current phase
  const getPhaseProgress = (phase: Phase) => {
    if (!phase.steps.includes(currentStep)) {
      // If this phase is completed
      if (currentPhaseIndex > phases.indexOf(phase)) {
        return 100
      }
      return 0
    }

    // Current phase - calculate percentage
    const stepIndex = phase.steps.indexOf(currentStep)
    return ((stepIndex + 1) / phase.steps.length) * 100
  }

  // Calculate overall progress
  const totalSteps = phases.reduce((sum, phase) => sum + phase.steps.length, 0)
  const completedSteps = phases.reduce((sum, phase, index) => {
    if (index < currentPhaseIndex) {
      return sum + phase.steps.length
    }
    if (index === currentPhaseIndex) {
      return sum + currentPhase.steps.indexOf(currentStep)
    }
    return sum
  }, 0)
  const overallProgress = (completedSteps / totalSteps) * 100

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Overall Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#0066FF] to-[#2563eb]"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="flex items-center justify-between gap-2">
          {phases.map((phase, index) => {
            const isActive = index === currentPhaseIndex
            const isCompleted = completedPhases.includes(phase.id as any) || index < currentPhaseIndex
            const progress = getPhaseProgress(phase)

            return (
              <div key={phase.id} className="flex-1 flex items-center gap-2">
                {/* Phase Marker */}
                <div className="flex flex-col items-center gap-2 min-w-fit">
                  <motion.div
                    className={`
                      relative w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-gradient-to-br from-[#059669] to-[#047857] shadow-lg shadow-[#059669]/30'
                          : isActive
                            ? 'bg-gradient-to-br from-[#0066FF] to-[#2563eb] shadow-lg shadow-[#0066FF]/30'
                            : 'bg-slate-200 dark:bg-slate-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      scale: isActive ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      scale: {
                        repeat: isActive ? Infinity : 0,
                        duration: 2,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    ) : (
                      <span
                        className={`text-xs md:text-sm font-semibold ${
                          isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </motion.div>

                  {/* Phase Name */}
                  <span
                    className={`
                      text-xs md:text-sm font-medium text-center whitespace-nowrap
                      ${
                        isActive
                          ? 'text-[#0066FF] dark:text-[#38bdf8]'
                          : isCompleted
                            ? 'text-[#059669] dark:text-[#34d399]'
                            : 'text-slate-500 dark:text-slate-400'
                      }
                    `}
                  >
                    {phase.name}
                  </span>
                </div>

                {/* Connector Line (except for last phase) */}
                {index < phases.length - 1 && (
                  <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 relative overflow-hidden min-w-4">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0066FF] to-[#2563eb]"
                      initial={{ width: '0%' }}
                      animate={{
                        width: isCompleted ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Indicator */}
        <div className="mt-3 text-center">
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Step {currentStep} of {totalSteps}
            {currentPhase && (
              <span className="ml-2 text-[#0066FF] dark:text-[#38bdf8] font-medium">
                · {currentPhase.name}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
