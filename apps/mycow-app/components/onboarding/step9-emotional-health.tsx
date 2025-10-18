"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Heart, CompassIcon } from "lucide-react"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step9EmotionalHealth: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()

  const orbTextStress = "How stressed are you about your money?"
  const orbTextHelp = "How much help do you need with wealth-building?"

  const [currentOrbText, setCurrentOrbText] = useState(orbTextStress)
  const [currentHighlightWords, setCurrentHighlightWords] = useState(["stressed", "money"])
  const [showSupportCompass, setShowSupportCompass] = useState(false)

  const { speak } = useGuideSpeech({ autoPlayText: currentOrbText, autoPlayGuideType: state.guideType || "Moo" })

  const [stressLevel, setStressLevel] = useState(state.stressLevel)
  const [helpNeeded, setHelpNeeded] = useState(state.helpNeeded)

  // Update orb text and speak when relevant state changes
  useEffect(() => {
    if (stressLevel && !helpNeeded) {
      setCurrentOrbText(orbTextHelp)
      setCurrentHighlightWords(["help", "wealth-building"])
    } else {
      setCurrentOrbText(orbTextStress)
      setCurrentHighlightWords(["stressed", "money"])
    }
  }, [stressLevel, helpNeeded, orbTextStress, orbTextHelp])

  // Show support compass when help level is selected
  useEffect(() => {
    if (helpNeeded) {
      const timer = setTimeout(() => {
        setShowSupportCompass(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [helpNeeded])

  const handleContinue = () => {
    updateState("stressLevel", stressLevel)
    updateState("helpNeeded", helpNeeded)
    nextStep()
  }

  const isNextDisabled = !stressLevel || !helpNeeded

  const stressLevels = [
    { value: "Not at all", color: "from-emerald-500 to-emerald-600", emoji: "😌" },
    { value: "A little", color: "from-yellow-500 to-yellow-600", emoji: "😐" },
    { value: "Moderately", color: "from-orange-500 to-orange-600", emoji: "😰" },
    { value: "Very stressed", color: "from-red-500 to-red-600", emoji: "😫" },
  ]

  const helpLevels = [
    {
      value: "A lot",
      label: "A lot (guide me fully)",
      description: "I want comprehensive guidance through every step",
      icon: "🤝",
    },
    {
      value: "Some",
      label: "Some (teach me basics)",
      description: "I need foundational knowledge and occasional guidance",
      icon: "📚",
    },
    {
      value: "A little",
      label: "A little (point me in the right direction)",
      description: "I just need some initial direction and resources",
      icon: "🧭",
    },
    {
      value: "None",
      label: "None (I'll invest on my own)",
      description: "I'm confident in managing my wealth independently",
      icon: "🚀",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto w-full p-6 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md rounded-xl shadow-lg border border-cream-200/50 dark:border-ink-700/50 mb-20">
      <div className="flex flex-col items-center mb-8">
        <AnimatedOrb
          text={currentOrbText}
          highlightWords={currentHighlightWords}
          guideType={state.guideType || "Moo"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        {/* Stress Level */}
        <div>
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 text-pink-500 mr-3" />
            <Label className="text-lg font-medium text-ink-700 dark:text-cream-200">
              How stressed are you about your money?
            </Label>
          </div>
          <RadioGroup
            value={stressLevel || ""}
            onValueChange={(value) => setStressLevel(value as typeof stressLevel)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {stressLevels.map((level) => (
              <div
                key={level.value}
                className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all duration-300 ${
                  stressLevel === level.value
                    ? "border-logo-blue bg-blue-50/50 dark:bg-blue-900/20 shadow-lg"
                    : "border-cream-200 dark:border-ink-700 hover:bg-cream-100/50 dark:hover:bg-ink-700/50"
                }`}
              >
                <RadioGroupItem value={level.value} id={`stress-${level.value}`} />
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-2xl">{level.emoji}</span>
                  <Label
                    htmlFor={`stress-${level.value}`}
                    className="cursor-pointer font-medium text-ink-800 dark:text-cream-100"
                  >
                    {level.value}
                  </Label>
                </div>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${level.color}`} />
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Help Needed */}
        {stressLevel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <CompassIcon className="w-6 h-6 text-logo-blue mr-3" />
              <Label className="text-lg font-medium text-ink-700 dark:text-cream-200">
                How much help do you need with wealth-building?
              </Label>
            </div>
            <RadioGroup
              value={helpNeeded || ""}
              onValueChange={(value) => setHelpNeeded(value as typeof helpNeeded)}
              className="space-y-3"
            >
              {helpLevels.map((help) => (
                <div
                  key={help.value}
                  className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-all duration-300 ${
                    helpNeeded === help.value
                      ? "border-logo-blue bg-blue-50/50 dark:bg-blue-900/20 shadow-lg"
                      : "border-cream-200 dark:border-ink-700 hover:bg-cream-100/50 dark:hover:bg-ink-700/50"
                  }`}
                >
                  <RadioGroupItem value={help.value} id={`help-${help.value}`} />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{help.icon}</span>
                    <div>
                      <Label htmlFor={`help-${help.value}`} className="cursor-pointer">
                        <div className="font-medium text-ink-800 dark:text-cream-100">{help.label}</div>
                        <div className="text-sm text-ink-600 dark:text-cream-300">{help.description}</div>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}

        {/* Support Compass Visualization */}
        {showSupportCompass && helpNeeded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-pink-200/50 dark:border-pink-800/30"
          >
            <div className="text-center">
              <CompassIcon className="w-12 h-12 text-logo-blue mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100 mb-2">
                Your Support Level: {helpNeeded}
              </h3>
              <p className="text-sm text-ink-600 dark:text-cream-300">
                {helpLevels.find((h) => h.value === helpNeeded)?.description}
              </p>

              {/* Empathy message based on stress level */}
              {stressLevel && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-4 p-3 bg-white/50 dark:bg-ink-800/50 rounded-lg"
                >
                  <p className="text-sm text-ink-700 dark:text-cream-200">
                    {stressLevel === "Very stressed" &&
                      "💙 We understand money stress can be overwhelming. You're taking a brave step by seeking help."}
                    {stressLevel === "Moderately" &&
                      "💚 It's normal to feel some stress about money. We're here to help you build confidence."}
                    {stressLevel === "A little" &&
                      "💛 A little stress shows you care about your financial future. That's a great starting point."}
                    {stressLevel === "Not at all" &&
                      "💙 Your calm approach to money is an asset. Let's build on that foundation."}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-cream-300 dark:border-ink-600 hover:bg-cream-100 dark:hover:bg-ink-800"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isNextDisabled}
            className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
