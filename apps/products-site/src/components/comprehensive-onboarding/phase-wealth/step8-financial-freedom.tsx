import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const parseCurrencyInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

const freedomLevels = [
  {
    key: 'bareMinimum' as const,
    label: 'Bare Minimum',
    description: 'Basic survival - rent, food, utilities',
    icon: '🏠',
    color: 'slate',
  },
  {
    key: 'lowerTarget' as const,
    label: 'Lower Target',
    description: 'Simple lifestyle with basic comforts',
    icon: '🌱',
    color: 'blue',
  },
  {
    key: 'target' as const,
    label: 'Target',
    description: 'Comfortable living with some luxuries',
    icon: '🎯',
    color: 'cyan',
  },
  {
    key: 'ideal' as const,
    label: 'Ideal',
    description: 'Your desired lifestyle with freedom',
    icon: '✨',
    color: 'emerald',
  },
  {
    key: 'luxury' as const,
    label: 'Luxury',
    description: 'Dream lifestyle with no limitations',
    icon: '👑',
    color: 'violet',
  },
]

export const Step8FinancialFreedom: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()

  const [bareMinimum, setBareMinimum] = useState<string>(
    state.financialFreedomGoals.bareMinimum ? state.financialFreedomGoals.bareMinimum.toString() : ''
  )
  const [lowerTarget, setLowerTarget] = useState<string>(
    state.financialFreedomGoals.lowerTarget ? state.financialFreedomGoals.lowerTarget.toString() : ''
  )
  const [target, setTarget] = useState<string>(
    state.financialFreedomGoals.target ? state.financialFreedomGoals.target.toString() : ''
  )
  const [ideal, setIdeal] = useState<string>(
    state.financialFreedomGoals.ideal ? state.financialFreedomGoals.ideal.toString() : ''
  )
  const [luxury, setLuxury] = useState<string>(
    state.financialFreedomGoals.luxury ? state.financialFreedomGoals.luxury.toString() : ''
  )

  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Define your financial freedom targets. What does freedom look like for you? These monthly income goals help us measure your progress."

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
    updateState('financialFreedomGoals', {
      bareMinimum: parseCurrencyInput(bareMinimum) || null,
      lowerTarget: parseCurrencyInput(lowerTarget) || null,
      target: parseCurrencyInput(target) || null,
      ideal: parseCurrencyInput(ideal) || null,
      luxury: parseCurrencyInput(luxury) || null,
    })
    nextStep()
  }

  const isFormValid = parseCurrencyInput(bareMinimum) > 0 || parseCurrencyInput(target) > 0

  const inputValues = {
    bareMinimum,
    lowerTarget,
    target,
    ideal,
    luxury,
  }

  const setters = {
    bareMinimum: setBareMinimum,
    lowerTarget: setLowerTarget,
    target: setTarget,
    ideal: setIdeal,
    luxury: setLuxury,
  }

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
            Define Your Financial Freedom
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            What monthly passive income would you need at each level of freedom?
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Freedom Levels */}
          <div className="space-y-6 mb-8">
            {freedomLevels.map((level, index) => (
              <motion.div
                key={level.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                className="group"
              >
                <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-[#0066FF] dark:hover:border-[#38bdf8] transition-all duration-300">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-3xl mt-1">{level.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <Label
                      htmlFor={level.key}
                      className="text-slate-800 dark:text-white font-semibold text-lg mb-1 block"
                    >
                      {level.label}
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{level.description}</p>

                    {/* Input */}
                    <div className="relative max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-base">
                        $
                      </span>
                      <Input
                        id={level.key}
                        type="text"
                        value={inputValues[level.key]}
                        onChange={(e) => setters[level.key](e.target.value)}
                        placeholder={
                          level.key === 'bareMinimum'
                            ? '2,000'
                            : level.key === 'lowerTarget'
                              ? '4,000'
                              : level.key === 'target'
                                ? '8,000'
                                : level.key === 'ideal'
                                  ? '15,000'
                                  : '30,000'
                        }
                        className="pl-8 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-base py-5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">
                        / month
                      </span>
                    </div>
                  </div>

                  {/* Visual Indicator */}
                  <div className="flex-shrink-0 hidden md:block">
                    {parseCurrencyInput(inputValues[level.key]) > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center"
                      >
                        <TrendingUp className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg"
          >
            <div className="flex gap-3">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Why Define These Levels?</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Financial freedom isn't one-size-fits-all. By defining multiple targets, we can create milestones
                  along your journey and help you track meaningful progress. Start with your bare minimum and work your
                  way up—each level is a step toward greater freedom.
                </p>
              </div>
            </div>
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
