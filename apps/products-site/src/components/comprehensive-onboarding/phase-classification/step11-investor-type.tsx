import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, BadgeCheck, Globe, Users, Building2, CheckCircle2 } from 'lucide-react'
import { useComprehensiveOnboarding, type InvestorType } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

interface InvestorTypeOption {
  investorType: InvestorType
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  requirements: string
}

export const Step11InvestorType: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()
  const [selectedType, setSelectedType] = useState<InvestorType | null>(state.investorType)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Pre-select based on primary intent if available
  useEffect(() => {
    if (!state.investorType && state.primaryIntent) {
      if (state.primaryIntent === 'advisor') {
        setSelectedType('advisor')
      } else if (state.primaryIntent === 'institutional') {
        setSelectedType('institutional')
      }
    }
  }, [state.investorType, state.primaryIntent])

  const introText = "Let's determine your investor classification. This helps us comply with regulations and show you appropriate investment options."

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

  const investorTypeOptions: InvestorTypeOption[] = [
    {
      investorType: 'individual',
      icon: User,
      title: 'Individual Investor',
      description: 'Investing for personal wealth and goals',
      requirements: 'Standard account, available in most jurisdictions',
    },
    {
      investorType: 'accredited',
      icon: BadgeCheck,
      title: 'Accredited Investor',
      description: 'Higher net worth or income thresholds',
      requirements: 'Annual income $200K+ (individual) or $300K+ (joint), OR net worth $1M+ (excluding primary residence)',
    },
    {
      investorType: 'international',
      icon: Globe,
      title: 'International Investor',
      description: 'Investing from outside the United States',
      requirements: 'Non-US resident, subject to local regulations',
    },
    {
      investorType: 'advisor',
      icon: Users,
      title: 'Financial Advisor',
      description: 'Managing client portfolios professionally',
      requirements: 'Registered advisor, RIA, or wealth manager',
    },
    {
      investorType: 'institutional',
      icon: Building2,
      title: 'Institutional Investor',
      description: 'Fund, family office, or corporate entity',
      requirements: 'Institutional-grade account with custom mandates',
    },
  ]

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    if (!selectedType) return
    stop()
    updateState('investorType', selectedType)
    nextStep()
  }

  const isPreselected = (type: InvestorType) => {
    return (state.primaryIntent === 'advisor' && type === 'advisor') ||
           (state.primaryIntent === 'institutional' && type === 'institutional')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
    >
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-white mb-4">
            Investor Classification
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Help us understand your investor status to ensure regulatory compliance and show you appropriate investment opportunities.
          </p>
        </motion.div>

        {/* Investor Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {investorTypeOptions.map((option, index) => {
            const IconComponent = option.icon
            const isSelected = selectedType === option.investorType
            const showPreselectedHint = isPreselected(option.investorType) && !state.investorType

            return (
              <motion.button
                key={option.investorType}
                onClick={() => setSelectedType(option.investorType)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                  ${
                    isSelected
                      ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 via-[#2563eb]/5 to-transparent shadow-xl shadow-[#0066FF]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-[#0066FF]/50 backdrop-blur-sm'
                  }
                `}
              >
                {isSelected && (
                  <motion.div
                    layoutId="investor-type-selection"
                    className="absolute inset-0 rounded-2xl border-2 border-[#0066FF]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative">
                  {/* Preselected Hint */}
                  {showPreselectedHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-[#059669] text-white text-xs font-medium"
                    >
                      Based on your earlier selection
                    </motion.div>
                  )}

                  {/* Icon */}
                  <div
                    className={`
                      inline-flex p-4 rounded-xl mb-4 transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#0066FF] to-[#2563eb] shadow-lg shadow-[#0066FF]/30'
                          : 'bg-slate-100 dark:bg-slate-700/50'
                      }
                    `}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-[#0066FF] dark:text-[#38bdf8]'}`}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                    {option.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    {option.description}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
                    {option.requirements}
                  </p>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669] text-white text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Selected
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex gap-4">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 px-8 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-lg hover:border-[#0066FF] hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-all duration-300"
            >
              Previous
            </button>

            {/* Continue Button */}
            <button
              onClick={handleNext}
              disabled={!selectedType}
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
            You can verify your status in the next steps. We'll guide you through the requirements.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
