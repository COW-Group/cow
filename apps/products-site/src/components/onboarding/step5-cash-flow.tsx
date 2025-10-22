// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"
import { useGuideSpeech } from "@/hooks/use-guide-speech"

export const Step5CashFlow: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()
  const orbText =
    "Write your approximate monthly income, expenses, assets value (if you know), and liabilities (total approximate debt, if you know). Don't worry if you don't have these figures on hand; you can enter this information later in dashboard."
  const highlightWords = [
    "monthly income",
    "expenses",
    "assets value",
    "liabilities",
    "total approximate debt",
    "dashboard",
  ]
  const { speak } = useGuideSpeech({ autoPlayText: orbText, autoPlayGuideType: state.guideType || "Moo" }) // Pass autoplay props here
  const [showSkipWarning, setShowSkipWarning] = useState(false)

  // Local state to handle form inputs
  const [income, setIncome] = useState(state.monthlyIncome?.toString() || "")
  const [expenses, setExpenses] = useState(state.monthlyExpenses?.toString() || "")
  const [assets, setAssets] = useState(state.assets?.toString() || "")
  const [liabilities, setLiabilities] = useState(state.liabilities?.toString() || "")

  const handleContinue = () => {
    // Convert inputs to numbers and update state
    updateState("monthlyIncome", income ? Number.parseFloat(income) : null)
    updateState("monthlyExpenses", expenses ? Number.parseFloat(expenses) : null)
    updateState("assets", assets ? Number.parseFloat(assets) : null)
    updateState("liabilities", liabilities ? Number.parseFloat(liabilities) : null)
    nextStep()
  }

  const handleSkip = () => {
    if (!showSkipWarning) {
      setShowSkipWarning(true)
      // Speak the skip warning
      speak(
        state.guideType || "Moo",
        "You can always come back and update this information later in the Compass section. Are you sure you want to skip?",
      )
      return
    }

    // If user confirms skip, move to next step without saving data
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 mb-20">
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <AnimatedOrb text={orbText} highlightWords={highlightWords} guideType={state.guideType || "Moo"} />
      </div>

      <div className="space-y-6 mt-6 sm:mt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-income" className="text-slate-700 dark:text-slate-200 text-sm sm:text-base">
                Monthly Income (approx.)
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                  size={18}
                />
                <Input
                  id="monthly-income"
                  type="number"
                  placeholder="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-expenses" className="text-slate-700 dark:text-slate-200 text-sm sm:text-base">
                Monthly Expenses (approx.)
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                  size={18}
                />
                <Input
                  id="monthly-expenses"
                  type="number"
                  placeholder="0"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assets" className="text-slate-700 dark:text-slate-200 text-sm sm:text-base">
                Assets (approx. value)
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                  size={18}
                />
                <Input
                  id="assets"
                  type="number"
                  placeholder="0"
                  value={assets}
                  onChange={(e) => setAssets(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liabilities" className="text-slate-700 dark:text-slate-200 text-sm sm:text-base">
                Liabilities (approx. debt)
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-white0"
                  size={18}
                />
                <Input
                  id="liabilities"
                  type="number"
                  placeholder="0"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm sm:text-base h-10 sm:h-12"
                />
              </div>
            </div>
          </div>

          {showSkipWarning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg mt-4"
            >
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                You can always come back and update this information later in the Compass section. Are you sure you want
                to skip?
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4"
          >
            <Button
              variant="outline"
              onClick={prevStep}
              className="w-full sm:w-auto border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 sm:h-12"
            >
              Back
            </Button>

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-full sm:w-auto border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 sm:h-12"
              >
                {showSkipWarning ? "Yes, Skip" : "Skip for Now"}
              </Button>

              <Button
                onClick={handleContinue}
                className="w-full sm:w-auto bg-gradient-to-r from-[#0066FF] to-emerald-500 hover:from-[#0066FF]/90 hover:to-emerald-500/90 text-white h-10 sm:h-12"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
