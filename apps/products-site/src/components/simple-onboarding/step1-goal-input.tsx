import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { useSimpleOnboarding } from '@/contexts/simple-onboarding-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { validateGoalInputs } from '@/lib/goal-projections'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
]

export const Step1GoalInput: React.FC = () => {
  const { state, updateGoal, calculateProjections, nextStep } = useSimpleOnboarding()

  const [goalName, setGoalName] = useState(state.goalName)
  const [targetAmount, setTargetAmount] = useState(state.targetAmount > 0 ? state.targetAmount.toString() : '')
  const [currency, setCurrency] = useState(state.currency)
  const [targetDate, setTargetDate] = useState(
    state.targetDate ? state.targetDate.toISOString().split('T')[0] : ''
  )
  const [errors, setErrors] = useState<string[]>([])

  const welcomeText = "Welcome! Let's start by understanding your first financial goal. What are you working towards?"

  const { speak } = useGuideSpeech({
    autoPlayText: welcomeText,
    autoPlayGuideType: 'Moo',
  })

  useEffect(() => {
    updateGoal('goalName', goalName)
  }, [goalName])

  useEffect(() => {
    updateGoal('targetAmount', parseFloat(targetAmount) || 0)
  }, [targetAmount])

  useEffect(() => {
    updateGoal('currency', currency)
  }, [currency])

  useEffect(() => {
    if (targetDate) {
      updateGoal('targetDate', new Date(targetDate))
    }
  }, [targetDate])

  const handleNext = () => {
    const amount = parseFloat(targetAmount) || 0
    const date = targetDate ? new Date(targetDate) : null

    const validation = validateGoalInputs(goalName, amount, date)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors([])
    calculateProjections()
    nextStep()
  }

  // Calculate min and max dates
  const today = new Date()
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
  const thirtyYearsFromNow = new Date()
  thirtyYearsFromNow.setFullYear(thirtyYearsFromNow.getFullYear() + 30)

  const minDate = sixMonthsFromNow.toISOString().split('T')[0]
  const maxDate = thirtyYearsFromNow.toISOString().split('T')[0]

  const selectedCurrency = currencies.find((c) => c.code === currency)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-3xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0066FF]/20 to-[#2563eb]/20 mb-6">
            <Target className="w-10 h-10 text-[#0066FF]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-[#0066FF] to-[#2563eb] bg-clip-text text-transparent">
            What's your first financial goal with COW?
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300">
            Let's see how real-world assets can help you get there
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
        >
          <div className="space-y-8">
            {/* Goal Name */}
            <div>
              <Label htmlFor="goalName" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#0066FF]" />
                Give your goal a name
              </Label>
              <Input
                id="goalName"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Down payment for a house, Retirement fund, Emergency savings"
                className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
              />
            </div>

            {/* Target Amount & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="targetAmount" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#0066FF]" />
                  How much do you need?
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                    {selectedCurrency?.symbol}
                  </span>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    className="bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6 pl-10"
                    min="1"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currency" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2">
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Target Date */}
            <div>
              <Label htmlFor="targetDate" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0066FF]" />
                When do you need it?
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Choose a date between 6 months and 30 years from now
              </p>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-7 shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300"
            >
              Show Me How to Get There
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No commitment required. See your personalized projection in the next step.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
