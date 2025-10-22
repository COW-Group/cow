import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sprout, TrendingUp, Target } from 'lucide-react'
import { useComprehensiveOnboarding, type WealthClass } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const wealthClassOptions: Array<{
  value: WealthClass
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  {
    value: 'Beginner',
    label: 'Starting my wealth journey',
    icon: Sprout,
    description: "I'm new to wealth building and want to learn the fundamentals",
  },
  {
    value: 'Intermediate',
    label: 'Growing my wealth',
    icon: TrendingUp,
    description: "I have some experience and want to optimize my strategy",
  },
  {
    value: 'Advanced',
    label: 'Optimizing my portfolio',
    icon: Target,
    description: "I'm experienced and looking for advanced optimization",
  },
]

const lifeStageOptions = [
  { value: 'Student', label: 'Student' },
  { value: 'Early Career', label: 'Early Career' },
  { value: 'Mid Career', label: 'Mid Career' },
  { value: 'Late Career', label: 'Late Career' },
  { value: 'Retired', label: 'Retired' },
  { value: 'Business Owner', label: 'Business Owner' },
]

export const Step4WealthClassStage: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()
  const [wealthClass, setWealthClass] = useState<WealthClass | null>(state.wealthClass)
  const [lifeStage, setLifeStage] = useState<string | null>(state.lifeStage)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Tell me about where you are in your wealth journey. This helps us customize your learning path and recommendations."

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
    if (!wealthClass || !lifeStage) return
    stop()
    updateState('wealthClass', wealthClass)
    updateState('lifeStage', lifeStage)
    nextStep()
  }

  const isFormValid = !!wealthClass && !!lifeStage

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
            Where are you in your wealth journey?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Understanding your experience level helps us personalize your path
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Wealth Class Selection */}
          <div className="mb-10">
            <Label className="text-slate-700 dark:text-slate-200 font-medium text-xl mb-6 block">
              Your Wealth Class
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wealthClassOptions.map((option, index) => {
                const IconComponent = option.icon
                const isSelected = wealthClass === option.value

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => setWealthClass(option.value)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                      ${
                        isSelected
                          ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 via-[#2563eb]/5 to-transparent shadow-xl shadow-[#0066FF]/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                      }
                    `}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="wealth-class-selection"
                        className="absolute inset-0 rounded-xl border-2 border-[#0066FF]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative">
                      <div
                        className={`
                        inline-flex p-3 rounded-lg mb-4 transition-all
                        ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#0066FF] to-[#2563eb] shadow-lg shadow-[#0066FF]/30'
                            : 'bg-slate-100 dark:bg-slate-700/50'
                        }
                      `}
                      >
                        <IconComponent className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-[#0066FF]'}`} />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        {option.label}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Life Stage Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <Label htmlFor="lifeStage" className="text-slate-700 dark:text-slate-200 font-medium text-xl mb-4 block">
              Your Life Stage
            </Label>
            <Select value={lifeStage || undefined} onValueChange={(value) => setLifeStage(value)}>
              <SelectTrigger
                id="lifeStage"
                className="w-full bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6 px-4"
              >
                <SelectValue placeholder="Select your life stage" />
              </SelectTrigger>
              <SelectContent>
                {lifeStageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-lg py-3">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              This helps us understand your timeline and priorities
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
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
