import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Target, PieChart } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

type InvestmentExperience = 'beginner' | 'intermediate' | 'advanced' | 'professional'
type PrimaryInvestmentGoal = 'preservation' | 'income' | 'growth' | 'diversification'
type IntendedAllocation = 'exploring' | 'moderate' | 'significant' | 'substantial'

interface RadioOption {
  value: string
  label: string
  description: string
}

export const Step12InvestmentProfile: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()
  const [investmentExperience, setInvestmentExperience] = useState<InvestmentExperience | null>(
    state.investmentExperience
  )
  const [primaryInvestmentGoal, setPrimaryInvestmentGoal] = useState<PrimaryInvestmentGoal | null>(
    state.primaryInvestmentGoal
  )
  const [intendedAllocation, setIntendedAllocation] = useState<IntendedAllocation | null>(
    state.intendedAllocation
  )
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Help us understand your investment profile. This ensures we recommend appropriate assets and strategies."

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const experienceOptions: RadioOption[] = [
    { value: 'beginner', label: 'Beginner', description: 'New to investing or limited experience' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience with stocks, bonds, or funds' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced with diverse asset classes' },
    { value: 'professional', label: 'Professional', description: 'Professional investor or financial background' },
  ]

  const goalOptions: RadioOption[] = [
    { value: 'preservation', label: 'Preservation', description: 'Protect my capital with minimal risk' },
    { value: 'income', label: 'Income', description: 'Generate steady income and cash flow' },
    { value: 'growth', label: 'Growth', description: 'Maximize long-term capital appreciation' },
    { value: 'diversification', label: 'Diversification', description: 'Diversify my existing portfolio' },
  ]

  const allocationOptions: RadioOption[] = [
    { value: 'exploring', label: 'Exploring', description: 'Less than $5,000 (exploring options)' },
    { value: 'moderate', label: 'Moderate', description: '$5,000 - $25,000 (moderate allocation)' },
    { value: 'significant', label: 'Significant', description: '$25,000 - $100,000 (significant allocation)' },
    { value: 'substantial', label: 'Substantial', description: '$100,000+ (substantial commitment)' },
  ]

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    if (!investmentExperience || !primaryInvestmentGoal || !intendedAllocation) return
    stop()
    updateState('investmentExperience', investmentExperience)
    updateState('primaryInvestmentGoal', primaryInvestmentGoal)
    updateState('intendedAllocation', intendedAllocation)
    nextStep()
  }

  const isFormValid = !!investmentExperience && !!primaryInvestmentGoal && !!intendedAllocation

  const renderRadioSection = (
    icon: React.ComponentType<{ className?: string }>,
    question: string,
    options: RadioOption[],
    selectedValue: string | null,
    onChange: (value: string) => void
  ) => {
    const IconComponent = icon

    return (
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5">
            <IconComponent className="w-6 h-6 text-[#0066FF] dark:text-[#38bdf8]" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
            {question}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => {
            const isSelected = selectedValue === option.value

            return (
              <motion.button
                key={option.value}
                onClick={() => onChange(option.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-5 rounded-xl border-2 transition-all duration-300 text-left
                  ${
                    isSelected
                      ? 'border-[#0066FF] bg-[#0066FF]/5'
                      : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Radio Button */}
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-[#0066FF] bg-[#0066FF]'
                        : 'border-slate-300 dark:border-slate-600'
                    }
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full rounded-full bg-white scale-50"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h4 className={`
                      text-base font-semibold mb-1 transition-colors duration-300
                      ${isSelected ? 'text-[#0066FF]' : 'text-slate-800 dark:text-white'}
                    `}>
                      {option.label}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    )
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
            Investment Profile
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Tell us about your investment experience and goals to help us recommend the right assets for you.
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-8"
        >
          {/* Question 1: Investment Experience */}
          {renderRadioSection(
            GraduationCap,
            "What's your investment experience level?",
            experienceOptions,
            investmentExperience,
            (value) => setInvestmentExperience(value as InvestmentExperience)
          )}

          {/* Question 2: Primary Investment Goal */}
          {renderRadioSection(
            Target,
            "What's your primary investment goal?",
            goalOptions,
            primaryInvestmentGoal,
            (value) => setPrimaryInvestmentGoal(value as PrimaryInvestmentGoal)
          )}

          {/* Question 3: Intended Allocation */}
          {renderRadioSection(
            PieChart,
            "How much do you intend to allocate to real-world assets?",
            allocationOptions,
            intendedAllocation,
            (value) => setIntendedAllocation(value as IntendedAllocation)
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="max-w-2xl mx-auto"
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

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All three questions are required to continue. This helps us provide personalized recommendations.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
