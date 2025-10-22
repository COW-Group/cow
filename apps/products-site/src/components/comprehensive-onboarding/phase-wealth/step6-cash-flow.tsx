import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Wallet, PiggyBank, CreditCard, TrendingUp, TrendingDown } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formatCurrency = (value: number | null): string => {
  if (value === null) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const parseCurrencyInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export const Step6CashFlow: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()
  const [monthlyIncome, setMonthlyIncome] = useState<string>(
    state.monthlyIncome ? state.monthlyIncome.toString() : ''
  )
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>(
    state.monthlyExpenses ? state.monthlyExpenses.toString() : ''
  )
  const [assets, setAssets] = useState<string>(state.assets ? state.assets.toString() : '')
  const [liabilities, setLiabilities] = useState<string>(state.liabilities ? state.liabilities.toString() : '')
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Let's understand your current financial situation. These numbers help us create a realistic plan tailored to where you are today."

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => stop()
  }, [stop])

  // Calculate derived values
  const calculations = useMemo(() => {
    const income = parseCurrencyInput(monthlyIncome)
    const expenses = parseCurrencyInput(monthlyExpenses)
    const totalAssets = parseCurrencyInput(assets)
    const totalLiabilities = parseCurrencyInput(liabilities)

    const monthlySurplus = income - expenses
    const netWorth = totalAssets - totalLiabilities

    return {
      monthlySurplus,
      netWorth,
      hasPositiveCashFlow: monthlySurplus > 0,
      hasPositiveNetWorth: netWorth > 0,
    }
  }, [monthlyIncome, monthlyExpenses, assets, liabilities])

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    stop()
    updateState('monthlyIncome', parseCurrencyInput(monthlyIncome))
    updateState('monthlyExpenses', parseCurrencyInput(monthlyExpenses))
    updateState('assets', parseCurrencyInput(assets))
    updateState('liabilities', parseCurrencyInput(liabilities))
    nextStep()
  }

  const isFormValid =
    parseCurrencyInput(monthlyIncome) > 0 ||
    parseCurrencyInput(monthlyExpenses) > 0 ||
    parseCurrencyInput(assets) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-light text-slate-800 dark:text-white mb-4">
            Your Financial Snapshot
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Understanding your current position helps us chart the right course forward
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Income & Expenses */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#0066FF]" />
                Monthly Cash Flow
              </h3>

              {/* Monthly Income */}
              <div>
                <Label htmlFor="monthlyIncome" className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                  Monthly Income (before tax)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg">
                    $
                  </span>
                  <Input
                    id="monthlyIncome"
                    type="text"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="5,000"
                    className="pl-8 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
                  />
                </div>
              </div>

              {/* Monthly Expenses */}
              <div>
                <Label
                  htmlFor="monthlyExpenses"
                  className="text-slate-700 dark:text-slate-200 font-medium mb-2 block"
                >
                  Monthly Expenses
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg">
                    $
                  </span>
                  <Input
                    id="monthlyExpenses"
                    type="text"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    placeholder="3,500"
                    className="pl-8 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
                  />
                </div>
              </div>

              {/* Monthly Surplus/Deficit */}
              {(monthlyIncome || monthlyExpenses) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    calculations.hasPositiveCashFlow
                      ? 'bg-[#059669]/10 border border-[#059669]/30'
                      : 'bg-amber-500/10 border border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Surplus</span>
                    <div className="flex items-center gap-2">
                      {calculations.hasPositiveCashFlow ? (
                        <TrendingUp className="w-4 h-4 text-[#059669]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-amber-600" />
                      )}
                      <span
                        className={`font-bold ${
                          calculations.hasPositiveCashFlow ? 'text-[#059669]' : 'text-amber-600'
                        }`}
                      >
                        {formatCurrency(calculations.monthlySurplus)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Assets & Liabilities */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#2563eb]" />
                Net Worth
              </h3>

              {/* Total Assets */}
              <div>
                <Label htmlFor="assets" className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                  Total Assets
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg">
                    $
                  </span>
                  <Input
                    id="assets"
                    type="text"
                    value={assets}
                    onChange={(e) => setAssets(e.target.value)}
                    placeholder="50,000"
                    className="pl-8 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Savings, investments, property, etc.
                </p>
              </div>

              {/* Total Liabilities */}
              <div>
                <Label htmlFor="liabilities" className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                  Total Liabilities
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-lg">
                    $
                  </span>
                  <Input
                    id="liabilities"
                    type="text"
                    value={liabilities}
                    onChange={(e) => setLiabilities(e.target.value)}
                    placeholder="20,000"
                    className="pl-8 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Loans, debts, mortgages, etc.</p>
              </div>

              {/* Net Worth */}
              {(assets || liabilities) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${
                    calculations.hasPositiveNetWorth
                      ? 'bg-[#2563eb]/10 border border-[#2563eb]/30'
                      : 'bg-slate-200/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Net Worth</span>
                    <div className="flex items-center gap-2">
                      <PiggyBank
                        className={`w-4 h-4 ${
                          calculations.hasPositiveNetWorth ? 'text-[#2563eb]' : 'text-slate-500'
                        }`}
                      />
                      <span
                        className={`font-bold ${
                          calculations.hasPositiveNetWorth
                            ? 'text-[#2563eb]'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {formatCurrency(calculations.netWorth)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg"
          >
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Privacy note:</strong> Your financial data is encrypted and never shared. We use this information
              only to personalize your wealth journey.
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              className="flex-shrink-0 px-8 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-lg hover:border-[#0066FF] hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-all duration-300"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0066FF] disabled:hover:to-[#2563eb]"
            >
              Continue
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
