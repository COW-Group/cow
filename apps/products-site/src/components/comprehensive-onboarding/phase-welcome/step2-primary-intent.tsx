import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Coins, Users, Building2 } from 'lucide-react'
import { useComprehensiveOnboarding, type PrimaryIntent, type FlowType } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

interface IntentOption {
  id: PrimaryIntent
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  flowType: FlowType
  skipWealthJourney: boolean
  audioDescription: string
}

export const Step2PrimaryIntent: React.FC = () => {
  const { state, updateState, nextStep } = useComprehensiveOnboarding()
  const [selectedIntent, setSelectedIntent] = useState<PrimaryIntent | null>(state.primaryIntent)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = `Nice to meet you, ${state.firstName || 'friend'}! Let's understand what brings you to COW today. This helps us personalize your experience.`

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

  const intentOptions: IntentOption[] = [
    {
      id: 'wealth',
      title: 'Build Long-Term Wealth',
      icon: TrendingUp,
      description: 'Start your wealth journey with personalized planning and guidance',
      flowType: 'wealth_journey',
      skipWealthJourney: false,
      audioDescription:
        'Build long-term wealth through personalized planning. We'll guide you through understanding your financial situation, setting goals, and creating a strategy that works for you.',
    },
    {
      id: 'invest',
      title: 'Invest in Performance Assets',
      icon: Coins,
      description: 'Access real-world assets with algorithmic optimization',
      flowType: 'direct_invest',
      skipWealthJourney: true,
      audioDescription:
        'Invest directly in performance assets. Get access to real-world assets like gold, aviation, and real estate with institutional-grade optimization.',
    },
    {
      id: 'advisor',
      title: 'Manage Client Portfolios',
      icon: Users,
      description: 'Professional tools for financial advisors and wealth managers',
      flowType: 'advisor',
      skipWealthJourney: true,
      audioDescription:
        'Manage client portfolios as a financial advisor. Access multi-client dashboards, white-label options, and professional-grade tools for your practice.',
    },
    {
      id: 'institutional',
      title: 'Institutional Investment',
      icon: Building2,
      description: 'Enterprise solutions for funds, family offices, and institutions',
      flowType: 'institutional',
      skipWealthJourney: true,
      audioDescription:
        'Institutional investment solutions for funds and family offices. Get dedicated support, custom mandates, and enterprise-grade infrastructure.',
    },
  ]

  const handleIntentSelect = (option: IntentOption) => {
    setSelectedIntent(option.id)
    // Speak about the selected option
    speak(state.guideType, option.audioDescription)
  }

  const handleNext = () => {
    if (!selectedIntent) return

    stop()

    const selectedOption = intentOptions.find((opt) => opt.id === selectedIntent)
    if (!selectedOption) return

    // Update context with selection
    updateState('primaryIntent', selectedIntent)
    updateState('flowType', selectedOption.flowType)
    updateState('skipWealthJourney', selectedOption.skipWealthJourney)

    // For institutional, we might want special handling
    if (selectedIntent === 'institutional') {
      // Could redirect to contact form or concierge onboarding
      console.log('Institutional path selected - route to concierge onboarding')
    }

    nextStep()
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
            What brings you to COW today, {state.firstName}?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Choose the path that fits your goals. We'll personalize your experience accordingly.
          </p>
        </motion.div>

        {/* Intent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {intentOptions.map((option, index) => {
            const IconComponent = option.icon
            const isSelected = selectedIntent === option.id

            return (
              <motion.button
                key={option.id}
                onClick={() => handleIntentSelect(option)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-8 rounded-2xl border-2 transition-all duration-300 text-left
                  ${
                    isSelected
                      ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 via-[#2563eb]/5 to-transparent shadow-xl shadow-[#0066FF]/20'
                      : 'border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-[#0066FF]/50 backdrop-blur-sm'
                  }
                `}
              >
                {isSelected && (
                  <motion.div
                    layoutId="intent-selection"
                    className="absolute inset-0 rounded-2xl border-2 border-[#0066FF]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative">
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
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">{option.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{option.description}</p>

                  {/* Selected Indicator */}
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
              </motion.button>
            )
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedIntent ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={handleNext}
            disabled={!selectedIntent}
            className="w-full bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0066FF] disabled:hover:to-[#2563eb]"
          >
            Continue
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Not sure? You can always explore other options later.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
