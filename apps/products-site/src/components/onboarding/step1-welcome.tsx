// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { AnimatedOrb } from "./animated-orb"
import { OnboardingStep } from "./onboarding-step"
import { useOnboarding, type GuideType } from "@/contexts/onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// TODO: Add speech synthesis later
// import { stopSpeech, recordUserInteraction } from "@/lib/speech-synthesis"

export const Step1Welcome: React.FC = () => {
  const { state, updateState, nextStep } = useOnboarding()
  const [firstName, setFirstName] = useState(state.firstName)
  const guideType: GuideType = "Moo"
  const [isFormValid, setIsFormValid] = useState(false)

  const welcomeText = useMemo(() => {
    return "Welcome to COW! Think of us as your guide on the path to wealth that works while you live. I'm Moo, your personal wealth guide, and I'm here to help your assets grow smarter, not just sit still. First, I'd like to get to know you a bit. What's your name?"
  }, [])

  useEffect(() => {
    setIsFormValid(!!firstName)
  }, [firstName])

  // TODO: Add user interaction recording when speech is integrated
  // useEffect(() => {
  //   if (firstName) {
  //     recordUserInteraction()
  //   }
  // }, [firstName])

  const handleNext = () => {
    // TODO: Add speech synthesis when integrated
    // recordUserInteraction()
    // stopSpeech()

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
          <div className="text-lg text-center text-slate-600 dark:text-slate-300 mb-8">{welcomeText}</div>
        </AnimatedOrb>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-md mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 font-medium">
                Your First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70"
              />
            </div>

            <div className="flex items-center space-x-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-sky-50/50 to-white/50 dark:from-slate-700/50 dark:to-slate-600/50 p-4">
              <div className="flex-1">
                <Label className="text-slate-700 dark:text-slate-200 font-medium">Your Guide</Label>
                <div className="mt-1">
                  <div className="font-medium text-slate-800 dark:text-white">Moo (Female)</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">Calm and thoughtful wisdom</div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
            >
              Let's Go
            </Button>
          </div>
        </motion.div>
      </div>
    </OnboardingStep>
  )
}
