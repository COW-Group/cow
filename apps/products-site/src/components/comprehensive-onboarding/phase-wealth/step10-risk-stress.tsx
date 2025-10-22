import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Smile, Frown, Meh, TrendingUp } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

type RiskTolerance = 'Definitely' | 'Yes' | 'In the middle' | 'No'
type StressLevel = 'Not at all' | 'A little' | 'Moderately' | 'Very stressed'

const riskOptions: Array<{
  value: RiskTolerance
  label: string
  description: string
  icon: string
}> = [
  {
    value: 'Definitely',
    label: 'Definitely',
    description: 'I actively seek higher returns through volatility',
    icon: '🚀',
  },
  {
    value: 'Yes',
    label: 'Yes',
    description: 'I can handle fluctuations for better long-term gains',
    icon: '📈',
  },
  {
    value: 'In the middle',
    label: 'In the middle',
    description: 'I want balance between growth and stability',
    icon: '⚖️',
  },
  {
    value: 'No',
    label: 'No',
    description: 'I prefer stability over higher potential returns',
    icon: '🛡️',
  },
]

const stressOptions: Array<{
  value: StressLevel
  label: string
  description: string
  color: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    value: 'Not at all',
    label: 'Not at all',
    description: 'I feel in control of my finances',
    color: 'emerald',
    icon: Smile,
  },
  {
    value: 'A little',
    label: 'A little',
    description: 'Minor concerns, but generally comfortable',
    color: 'cyan',
    icon: Meh,
  },
  {
    value: 'Moderately',
    label: 'Moderately',
    description: 'Financial stress affects my daily life',
    color: 'amber',
    icon: Frown,
  },
  {
    value: 'Very stressed',
    label: 'Very stressed',
    description: 'Money worries keep me up at night',
    color: 'red',
    icon: AlertTriangle,
  },
]

export const Step10RiskStress: React.FC = () => {
  const { state, updateState, nextStep, prevStep, completePhase } = useComprehensiveOnboarding()
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | null>(state.riskTolerance)
  const [stressLevel, setStressLevel] = useState<StressLevel | null>(state.stressLevel)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = `Finally, let's understand your comfort with risk and stress. This helps us recommend strategies that fit your emotional comfort zone, not just your financial goals.`

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
    if (!riskTolerance || !stressLevel) return
    stop()
    updateState('riskTolerance', riskTolerance)
    updateState('stressLevel', stressLevel)
    completePhase('wealth')
    nextStep()
  }

  const isFormValid = !!riskTolerance && !!stressLevel

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-white mb-4">
            Your Risk & Stress Profile
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Understanding your emotional comfort helps us create a sustainable wealth strategy
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Risk Tolerance Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#0066FF]" />
                Risk Tolerance
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Would you invest in volatile assets for potentially higher returns?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {riskOptions.map((option, index) => {
                const isSelected = riskTolerance === option.value

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => setRiskTolerance(option.value)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-center
                      ${
                        isSelected
                          ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 to-transparent shadow-lg shadow-[#0066FF]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                      }
                    `}
                  >
                    <div className="text-3xl mb-3">{option.icon}</div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{option.label}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {option.description}
                    </p>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center shadow-lg"
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
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Stress Level Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#2563eb]" />
                Current Stress Level
              </h3>
              <p className="text-slate-600 dark:text-slate-400">How stressed are you about money right now?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stressOptions.map((option, index) => {
                const IconComponent = option.icon
                const isSelected = stressLevel === option.value

                const colorClasses = {
                  emerald: {
                    border: 'border-[#059669]',
                    bg: 'from-[#059669]/10',
                    shadow: 'shadow-[#059669]/20',
                    iconBg: 'bg-[#059669]',
                    hover: 'hover:border-[#059669]/50',
                  },
                  cyan: {
                    border: 'border-[#0891b2]',
                    bg: 'from-[#0891b2]/10',
                    shadow: 'shadow-[#0891b2]/20',
                    iconBg: 'bg-[#0891b2]',
                    hover: 'hover:border-[#0891b2]/50',
                  },
                  amber: {
                    border: 'border-[#f59e0b]',
                    bg: 'from-[#f59e0b]/10',
                    shadow: 'shadow-[#f59e0b]/20',
                    iconBg: 'bg-[#f59e0b]',
                    hover: 'hover:border-[#f59e0b]/50',
                  },
                  red: {
                    border: 'border-[#dc2626]',
                    bg: 'from-[#dc2626]/10',
                    shadow: 'shadow-[#dc2626]/20',
                    iconBg: 'bg-[#dc2626]',
                    hover: 'hover:border-[#dc2626]/50',
                  },
                }

                const colors = colorClasses[option.color as keyof typeof colorClasses]

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => setStressLevel(option.value)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-center
                      ${
                        isSelected
                          ? `${colors.border} bg-gradient-to-br ${colors.bg} to-transparent shadow-lg ${colors.shadow}`
                          : `border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 ${colors.hover}`
                      }
                    `}
                  >
                    <div className="mb-3">
                      <IconComponent className={`w-8 h-8 mx-auto ${isSelected ? 'text-current' : 'text-slate-400'}`} />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{option.label}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {option.description}
                    </p>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center shadow-lg`}
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
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg"
          >
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why this matters:</strong> The best wealth strategy isn't just financially optimal—it's one you
              can stick with. We use your risk tolerance and stress level to recommend approaches that match both your
              goals and your emotional comfort zone.
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
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
              Complete Wealth Journey
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
