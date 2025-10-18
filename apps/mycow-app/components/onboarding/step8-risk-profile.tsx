"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useOnboarding } from "@/contexts/onboarding-context"
import { AnimatedOrb } from "./animated-orb"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input" // Import Input for custom income range
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { Gauge, Globe } from "lucide-react" // Import Globe icon
import { DollarSign } from "lucide-react" // Import DollarSign icon
import { useGuideSpeech } from "@/hooks/use-guide-speech" // Declare the useGuideSpeech hook

export const Step8RiskProfile: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding()
  const { speak } = useGuideSpeech({ autoPlayText: "", autoPlayGuideType: state.guideType || "Moo" }) // Initialize useGuideSpeech

  const orbTextInitial = "Which country do you live in?"
  const orbTextIncome = "What is your annual income range?"
  const orbTextRisk = "Are you a risk-taker with money?"

  const [currentOrbText, setCurrentOrbText] = useState(orbTextInitial)
  const [currentHighlightWords, setCurrentHighlightWords] = useState(["country"])
  const [showRiskMeter, setShowRiskMeter] = useState(false)

  const [country, setCountry] = useState(state.country)
  const [currency, setCurrency] = useState(state.currency)
  const [minimumAnnualIncome, setMinimumAnnualIncome] = useState(state.minimumAnnualIncome?.toString() || "")
  const [maximumAnnualIncome, setMaximumAnnualIncome] = useState(state.maximumAnnualIncome?.toString() || "")
  const [riskTolerance, setRiskTolerance] = useState(state.riskTolerance)

  // Update orb text and speak when relevant state changes
  useEffect(() => {
    if (country && (!minimumAnnualIncome || !maximumAnnualIncome)) {
      setCurrentOrbText(orbTextIncome)
      setCurrentHighlightWords(["annual income range"])
    } else if (country && minimumAnnualIncome && maximumAnnualIncome && !riskTolerance) {
      setCurrentOrbText(orbTextRisk)
      setCurrentHighlightWords(["risk-taker", "money"])
    } else {
      setCurrentOrbText(orbTextInitial)
      setCurrentHighlightWords(["country"])
    }
    speak({ text: currentOrbText, guideType: state.guideType || "Moo" }) // Call speak function
  }, [
    country,
    minimumAnnualIncome,
    maximumAnnualIncome,
    riskTolerance,
    orbTextInitial,
    orbTextIncome,
    orbTextRisk,
    speak,
  ])

  // Show risk meter when risk tolerance is selected
  useEffect(() => {
    if (riskTolerance) {
      const timer = setTimeout(() => {
        setShowRiskMeter(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [riskTolerance])

  const handleContinue = () => {
    updateState("country", country)
    updateState("currency", currency)
    updateState("minimumAnnualIncome", minimumAnnualIncome ? Number.parseFloat(minimumAnnualIncome) : null)
    updateState("maximumAnnualIncome", maximumAnnualIncome ? Number.parseFloat(maximumAnnualIncome) : null)
    updateState("riskTolerance", riskTolerance)
    nextStep()
  }

  const isNextDisabled =
    !country ||
    !currency ||
    !minimumAnnualIncome ||
    !maximumAnnualIncome ||
    !riskTolerance ||
    Number.parseFloat(minimumAnnualIncome) > Number.parseFloat(maximumAnnualIncome)

  const countries = [
    { name: "United States", currency: "USD" },
    { name: "Canada", currency: "CAD" },
    { name: "United Kingdom", currency: "GBP" },
    { name: "Australia", currency: "AUD" },
    { name: "Germany", currency: "EUR" },
    { name: "Japan", currency: "JPY" },
    { name: "India", currency: "INR" },
    { name: "Brazil", currency: "BRL" },
    { name: "South Africa", currency: "ZAR" },
    // Add more countries as needed
  ]

  const riskLevels = [
    {
      value: "Definitely",
      label: "Definitely",
      description: "High risk, high reward",
      color: "from-red-500 to-red-600",
    },
    { value: "Yes", label: "Yes", description: "Moderate risk", color: "from-orange-500 to-orange-600" },
    {
      value: "In the middle",
      label: "In the middle",
      description: "Balanced approach",
      color: "from-yellow-500 to-yellow-600",
    },
    { value: "No", label: "No", description: "Low risk", color: "from-emerald-500 to-emerald-600" },
  ]

  const getRiskMeterPosition = () => {
    switch (riskTolerance) {
      case "Definitely":
        return 85
      case "Yes":
        return 65
      case "In the middle":
        return 45
      case "No":
        return 25
      default:
        return 0
    }
  }

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
        {/* Country and Currency Selection */}
        <div>
          <Label htmlFor="country-select" className="text-lg font-medium text-ink-700 dark:text-cream-200 mb-4 block">
            Which country do you live in?
          </Label>
          <div className="relative">
            <Globe
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-cream-500"
              size={18}
            />
            <Select
              value={country || ""}
              onValueChange={(value) => {
                setCountry(value)
                const selectedCountry = countries.find((c) => c.name === value)
                if (selectedCountry) {
                  setCurrency(selectedCountry.currency)
                }
              }}
            >
              <SelectTrigger className="pl-10 bg-cream-25 dark:bg-ink-800 border-cream-200 dark:border-ink-700">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-cream-50 dark:bg-ink-900 border-cream-200 dark:border-ink-700">
                {countries.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name} ({c.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Annual Income Range (Custom Input) */}
        {country && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.3 }}
          >
            <Label className="text-lg font-medium text-ink-700 dark:text-cream-200 mb-4 block">
              What is your annual income range? ({currency || "USD"})
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="min-income" className="text-ink-700 dark:text-cream-500">
                  Minimum Annual Income
                </Label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-cream-500"
                    size={18}
                  />
                  <Input
                    id="min-income"
                    type="number"
                    placeholder="0"
                    value={minimumAnnualIncome}
                    onChange={(e) => setMinimumAnnualIncome(e.target.value)}
                    className="pl-10 bg-cream-25 dark:bg-ink-800 border-cream-200 dark:border-ink-700"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-income" className="text-ink-700 dark:text-cream-500">
                  Maximum Annual Income
                </Label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ink-400 dark:text-cream-500"
                    size={18}
                  />
                  <Input
                    id="max-income"
                    type="number"
                    placeholder="0"
                    value={maximumAnnualIncome}
                    onChange={(e) => setMaximumAnnualIncome(e.target.value)}
                    className="pl-10 bg-cream-25 dark:bg-ink-800 border-cream-200 dark:border-ink-700"
                  />
                </div>
              </div>
            </div>
            {Number.parseFloat(minimumAnnualIncome) > Number.parseFloat(maximumAnnualIncome) && (
              <p className="text-red-500 text-sm mt-2">Minimum income cannot be greater than maximum income.</p>
            )}
          </motion.div>
        )}

        {/* Risk Tolerance */}
        {minimumAnnualIncome && maximumAnnualIncome && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.6 }}
          >
            <Label className="text-lg font-medium text-ink-700 dark:text-cream-200 mb-4 block">
              Are you a risk-taker with money?
            </Label>
            <RadioGroup
              value={riskTolerance || ""}
              onValueChange={(value) => setRiskTolerance(value as typeof riskTolerance)}
              className="space-y-3"
            >
              {riskLevels.map((risk) => (
                <div
                  key={risk.value}
                  className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all duration-300 ${
                    riskTolerance === risk.value
                      ? "border-logo-blue bg-blue-50/50 dark:bg-blue-900/20 shadow-lg"
                      : "border-cream-200 dark:border-ink-700 hover:bg-cream-100/50 dark:hover:bg-ink-700/50"
                  }`}
                >
                  <RadioGroupItem value={risk.value} id={`risk-${risk.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`risk-${risk.value}`} className="cursor-pointer">
                      <div className="font-medium text-ink-800 dark:text-cream-100">{risk.label}</div>
                      <div className="text-sm text-ink-600 dark:text-cream-300">{risk.description}</div>
                    </Label>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${risk.color}`} />
                </div>
              ))}
            </RadioGroup>
          </motion.div>
        )}

        {/* Risk Meter Visualization */}
        {showRiskMeter && riskTolerance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-cream-100 to-blue-50 dark:from-ink-800 dark:to-blue-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/30"
          >
            <div className="flex items-center justify-center mb-4">
              <Gauge className="w-8 h-8 text-logo-blue mr-3" />
              <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">Your Risk Profile</h3>
            </div>

            <div className="relative">
              <div className="w-full h-4 bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 to-red-500 rounded-full" />
              <motion.div
                className="absolute top-0 w-4 h-4 bg-white border-2 border-ink-800 dark:border-cream-100 rounded-full shadow-lg"
                initial={{ left: "0%" }}
                animate={{ left: `${getRiskMeterPosition()}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ transform: "translateX(-50%)" }}
              />
            </div>

            <div className="flex justify-between text-xs text-ink-600 dark:text-cream-300 mt-2">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
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
