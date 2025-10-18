"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { AnimatedOrb } from "./animated-orb"
import { OnboardingStep } from "./onboarding-step"
import { useOnboarding, type GuideType } from "@/contexts/onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { stopSpeech, recordUserInteraction } from "@/lib/speech-synthesis"

export const Step1Welcome: React.FC = () => {
  const { state, updateState, nextStep } = useOnboarding()
  const [firstName, setFirstName] = useState(state.firstName)
  const guideType: GuideType = "Moo" // Fixed guide type
  const [isFormValid, setIsFormValid] = useState(false)

  const welcomeText = useMemo(() => {
    return "Welcome to COW! Think of us as your guide on the path to wealth that works while you live. I'm Moo, your personal wealth guide, and I'm here to help your assets grow smarter, not just sit still. First, I'd like to get to know you a bit. What's your name?"
  }, [])

  // AnimatedOrb handles the speech, so we don't need a separate hook here

  useEffect(() => {
    setIsFormValid(!!firstName)
  }, [firstName])

  // Record user interaction on first input change to enable speech
  useEffect(() => {
    if (firstName) {
      recordUserInteraction()
    }
  }, [firstName])

  const handleNext = () => {
    recordUserInteraction()
    stopSpeech()

    // Save the user's choices and proceed to next step
    updateState("firstName", firstName)
    updateState("guideType", "Moo")
    nextStep()
  }

  return (
    <OnboardingStep
      title="Welcome to COW"
      onNext={handleNext}
      nextDisabled={!isFormValid}
      prevDisabled={true}
      showButtons={false}
    >
      <div className="flex flex-col items-center">
        <AnimatedOrb isActive={true} guideType={guideType} speechText={welcomeText} autoPlay={true}>
          <div className="text-lg text-center text-ink-600 dark:text-cream-300 mb-8">{welcomeText}</div>
        </AnimatedOrb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-md mt-8 bg-cream-50/80 dark:bg-ink-800/80 backdrop-blur-sm p-6 rounded-xl border border-cream-200/50 dark:border-ink-700/50 shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="firstName" className="text-ink-700 dark:text-cream-200 font-medium">
                Your First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="mt-2 bg-cream-100/70 dark:bg-ink-700/70 border-cream-200/70 dark:border-ink-600/70"
              />
            </div>

            <div className="flex items-center space-x-3 rounded-lg border border-cream-200 dark:border-ink-700 bg-gradient-to-r from-blue-50/50 to-cream-100/50 dark:from-ink-700/50 dark:to-ink-600/50 p-4">
              <div className="flex-1">
                <Label className="text-ink-700 dark:text-cream-200 font-medium">Your Guide</Label>
                <div className="mt-1">
                  <div className="font-medium text-ink-800 dark:text-cream-100">Moo (Female)</div>
                  <div className="text-sm text-ink-600 dark:text-cream-300">Calm and thoughtful wisdom</div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-logo-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Let's Go
            </Button>
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  )
}
