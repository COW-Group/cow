import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AnimatedOrb } from '@/components/onboarding/animated-orb'
import { useComprehensiveOnboarding, type GuideType } from '@/contexts/comprehensive-onboarding-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

export const Step1Welcome: React.FC = () => {
  const { state, updateState, nextStep, completePhase } = useComprehensiveOnboarding()
  const [firstName, setFirstName] = useState(state.firstName)
  const [selectedGuide, setSelectedGuide] = useState<GuideType | null>(state.guideType)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const welcomeText = useMemo(() => {
    if (selectedGuide) {
      return `Welcome to MyCOW! I'm ${selectedGuide}, your wealth journey companion. Together, we'll build a path to wealth that works while you live.`
    }
    return "Welcome to MyCOW! I'm here to guide you on your wealth journey. Choose your companion to get started."
  }, [selectedGuide])

  const { speak, stop } = useGuideSpeech({
    autoPlayText: welcomeText,
    autoPlayGuideType: selectedGuide,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    setIsFormValid(!!firstName && !!selectedGuide)
  }, [firstName, selectedGuide])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const handleGuideSelect = (guide: GuideType) => {
    setSelectedGuide(guide)
    // Speak guide introduction
    const guideIntro = `Hello! I'm ${guide}, your wealth journey companion. I'm here to help your assets grow smarter.`
    speak(guide, guideIntro)
  }

  const handleNext = () => {
    stop()
    updateState('firstName', firstName)
    updateState('guideType', selectedGuide)
    completePhase('welcome')
    nextStep()
  }

  const guides: { type: GuideType; subtitle: string; description: string }[] = [
    {
      type: 'Moo',
      subtitle: 'Calm & Thoughtful',
      description: 'Wisdom and patience guide the way',
    },
    {
      type: 'Fox',
      subtitle: 'Quick & Strategic',
      description: 'Clever insights for smart decisions',
    },
    {
      type: 'Owl',
      subtitle: 'Wise & Analytical',
      description: 'Deep knowledge and careful planning',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
    >
      <div className="w-full max-w-4xl">
        {/* Animated Orb */}
        <div className="mb-8">
          <AnimatedOrb isActive={true} guideType={selectedGuide} speechText={welcomeText} autoPlay={true}>
            <motion.p
              key={welcomeText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-center text-slate-600 dark:text-slate-300"
            >
              {welcomeText}
            </motion.p>
          </AnimatedOrb>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          {/* Name Input */}
          <div className="mb-8">
            <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 block">
              What's your name?
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
            />
          </div>

          {/* Guide Selection */}
          <div className="mb-8">
            <Label className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-4 block">
              Choose Your Guide
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <motion.button
                  key={guide.type}
                  onClick={() => handleGuideSelect(guide.type)}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                    ${
                      selectedGuide === guide.type
                        ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5 shadow-lg shadow-[#0066FF]/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                    }
                  `}
                >
                  {selectedGuide === guide.type && (
                    <motion.div
                      layoutId="guide-selection"
                      className="absolute inset-0 rounded-xl border-2 border-[#0066FF]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1">{guide.type}</h3>
                    <p className="text-sm text-[#0066FF] dark:text-[#38bdf8] font-medium mb-2">{guide.subtitle}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{guide.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFormValid ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-6 shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Begin Your Journey
            </Button>
          </motion.div>
        </motion.div>

        {/* Optional Skip Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-[#0066FF] hover:text-[#2563eb] underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#0066FF] hover:text-[#2563eb] underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
