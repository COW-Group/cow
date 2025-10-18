"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp } from "lucide-react"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step7FinancialFreedom: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()
  const orbText = "What are your monthly income requirement goals, passive and active combined?"
  const highlightWords = ["monthly income requirement goals", "passive", "active combined"]
  const { speak } = useGuideSpeech({ autoPlayText: orbText, autoPlayGuideType: state.guideType || "Moo" }) // Pass autoplay props here
  const [showEducation, setShowEducation] = useState(false)

  // Local state for form inputs
  const [bareMinimum, setBareMinimum] = useState(state.financialFreedomGoals.bareMinimum?.toString() || "")
  const [lowerTarget, setLowerTarget] = useState(state.financialFreedomGoals.lowerTarget?.toString() || "")
  const [target, setTarget] = useState(state.financialFreedomGoals.target?.toString() || "")
  const [ideal, setIdeal] = useState(state.financialFreedomGoals.ideal?.toString() || "")
  const [luxury, setLuxury] = useState(state.financialFreedomGoals.luxury?.toString() || "")

  const handleContinue = () => {
    // Update state with financial freedom goals
    updateState("financialFreedomGoals", {
      bareMinimum: bareMinimum ? Number.parseFloat(bareMinimum) : null,
      lowerTarget: lowerTarget ? Number.parseFloat(lowerTarget) : null,
      target: target ? Number.parseFloat(target) : null,
      ideal: ideal ? Number.parseFloat(ideal) : null,
      luxury: luxury ? Number.parseFloat(luxury) : null,
    })

    // Show education component
    setShowEducation(true)

    // Speak education content
    speak(
      state.guideType || "Moo",
      "Investing Can Turbocharge Your Wealth! Assets in a Moo Mix could grow up to 6x more than savings alone over the long term.",
    )

    // Auto-advance after showing education
    setTimeout(() => {
      nextStep()
    }, 5000)
  }

  const goals = [
    {
      key: "bareMinimum",
      label: "Bare Minimum",
      value: bareMinimum,
      setter: setBareMinimum,
      color: "from-red-400 to-red-500",
    },
    {
      key: "lowerTarget",
      label: "Lower Target",
      value: lowerTarget,
      setter: setLowerTarget,
      color: "from-orange-400 to-orange-500",
    },
    { key: "target", label: "Target", value: target, setter: setTarget, color: "from-yellow-400 to-yellow-500" },
    { key: "ideal", label: "Ideal", value: ideal, setter: setIdeal, color: "from-emerald-400 to-emerald-500" },
    { key: "luxury", label: "Luxury", value: luxury, setter: setLuxury, color: "from-blue-400 to-blue-500" },
  ]

  if (showEducation) {
    return (
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md rounded-xl shadow-lg border border-cream-200/50 dark:border-ink-700/50 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-6 sm:mb-8">
            <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-logo-blue mb-4" />
            <h2 className="text-xl sm:text-2xl font-light text-ink-800 dark:text-cream-100 mb-4">
              Investing Can Turbocharge Your Wealth!
            </h2>
            <p className="text-base sm:text-lg text-ink-600 dark:text-cream-300 mb-6 sm:mb-8">
              Assets in a Moo Mix could grow up to 6x more than savings alone over the long term.
            </p>
          </div>

          {/* Animated Growth Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-ink-800 p-4 sm:p-6 rounded-xl shadow-lg mb-4 sm:mb-6"
          >
            <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100 mb-4">
              Growth Comparison Over 20 Years
            </h3>
            <div className="space-y-4">
              {/* Savings Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-ink-600 dark:text-cream-300">Savings (4% growth)</span>
                  <span className="text-sm font-medium text-ink-800 dark:text-cream-100">$219,112</span>
                </div>
                <div className="w-full bg-cream-200 dark:bg-ink-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "30%" }}
                    transition={{ delay: 1, duration: 2 }}
                  />
                </div>
              </div>

              {/* Investment Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-ink-600 dark:text-cream-300">Investing (10% growth)</span>
                  <span className="text-sm font-medium text-ink-800 dark:text-cream-100">$630,025</span>
                </div>
                <div className="w-full bg-cream-200 dark:bg-ink-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.5, duration: 2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="text-xs text-ink-500 dark:text-cream-400 mb-4 sm:mb-6"
          >
            *Returns are not guaranteed. Past performance does not predict future results. Consult a financial advisor.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}>
            <Button
              onClick={() => nextStep()}
              className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white px-6 py-3 sm:px-8 sm:py-3 h-10 sm:h-12"
            >
              Continue to Next Step
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md rounded-xl shadow-lg border border-cream-200/50 dark:border-ink-700/50 mb-20">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <AnimatedOrb text={orbText} highlightWords={highlightWords} guideType={state.guideType || "Moo"} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor={goal.key} className="text-ink-700 dark:text-cream-200 font-medium text-sm sm:text-base">
                {goal.label}
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-cream-500"
                  size={18}
                />
                <Input
                  id={goal.key}
                  type="number"
                  placeholder="0"
                  value={goal.value}
                  onChange={(e) => goal.setter(e.target.value)}
                  className="pl-10 bg-cream-25 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
              <div className={`h-1 bg-gradient-to-r ${goal.color} rounded-full opacity-60`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30"
        >
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            💡 <strong>Tip:</strong> Start with your bare minimum needs and work your way up. These goals will help us
            create your personalized wealth strategy.
          </p>
        </motion.div>

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="border-cream-300 dark:border-ink-600 hover:bg-cream-100 dark:hover:bg-ink-800 h-10 sm:h-12"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-logo-blue/90 hover:to-emerald-500/90 text-white h-10 sm:h-12"
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
