import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, Building, LineChart } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

type SkillQuadrant = 'Employment' | 'Self-Employment' | 'Business' | 'Investing'

interface QuadrantOption {
  value: SkillQuadrant
  label: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  examples: string
}

const quadrantOptions: QuadrantOption[] = [
  {
    value: 'Employment',
    label: 'Employment (E)',
    subtitle: 'Trade time for money',
    icon: Users,
    description: 'Develop skills for career growth and higher salary',
    examples: 'Salary, benefits, job security',
  },
  {
    value: 'Self-Employment',
    label: 'Self-Employment (S)',
    subtitle: 'Own your job',
    icon: UserCheck,
    description: 'Build expertise as a freelancer or professional',
    examples: 'Freelance, consulting, professional practice',
  },
  {
    value: 'Business',
    label: 'Business (B)',
    subtitle: 'Build systems',
    icon: Building,
    description: 'Create scalable businesses that work without you',
    examples: 'Systems, teams, scalable operations',
  },
  {
    value: 'Investing',
    label: 'Investing (I)',
    subtitle: 'Make money work',
    icon: LineChart,
    description: 'Develop skills to generate passive income from assets',
    examples: 'Assets, passive income, capital gains',
  },
]

export const Step7SkillsQuadrant: React.FC = () => {
  const { state, toggleSkill, nextStep, prevStep } = useComprehensiveOnboarding()
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Which income streams do you want to develop? Based on Robert Kiyosaki's Cashflow Quadrant, this shapes your learning path and strategy."

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

  const selectedSkillsCount = state.skillsToImprove.length
  const isFormValid = selectedSkillsCount > 0

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
            Which income streams do you want to develop?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select the quadrants you want to learn about. You can choose multiple paths.
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Cashflow Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {quadrantOptions.map((option, index) => {
              const IconComponent = option.icon
              const isSelected = state.skillsToImprove.includes(option.value)

              return (
                <motion.button
                  key={option.value}
                  onClick={() => toggleSkill(option.value)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-8 rounded-xl border-2 transition-all duration-300 text-left
                    ${
                      isSelected
                        ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 via-[#2563eb]/5 to-transparent shadow-xl shadow-[#0066FF]/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                    }
                  `}
                >
                  <div className="flex gap-6">
                    {/* Icon */}
                    <div
                      className={`
                      p-4 rounded-xl transition-all flex-shrink-0 self-start
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#0066FF] to-[#2563eb] shadow-lg shadow-[#0066FF]/30'
                          : 'bg-slate-100 dark:bg-slate-700/50'
                      }
                    `}
                    >
                      <IconComponent className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-[#0066FF]'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{option.label}</h3>
                        <p className="text-sm font-medium text-[#0066FF] dark:text-[#38bdf8]">{option.subtitle}</p>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">{option.description}</p>

                      <div className="flex items-start gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Examples:</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{option.examples}</span>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669] text-white text-sm font-medium"
                        >
                          <span className="w-2 h-2 rounded-full bg-white" />
                          Selected
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>The Cashflow Quadrant:</strong> A framework from Robert Kiyosaki showing four ways to generate
              income. Each quadrant requires different skills and mindsets. We'll tailor your learning path based on
              your selections.
            </p>
          </motion.div>

          {/* Selection Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="text-center pt-4"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {selectedSkillsCount === 0 ? (
                'Select at least one income stream to continue'
              ) : (
                <>
                  {selectedSkillsCount} {selectedSkillsCount === 1 ? 'quadrant' : 'quadrants'} selected
                </>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.3 }}
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
