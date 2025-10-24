import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  PiggyBank,
  Calendar,
  TrendingUp,
  Repeat,
  BarChart3,
  Shield,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useSimpleOnboarding } from '@/contexts/simple-onboarding-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatPercentage, formatCompactCurrency } from '@/lib/goal-projections'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

export const Step2Projection: React.FC = () => {
  const { state, selectPlan, nextStep, prevStep } = useSimpleOnboarding()
  const [selectedOption, setSelectedOption] = useState<'lumpsum' | 'monthly' | null>(state.selectedPlan)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const projection = state.projection
  const currency = state.currency

  useEffect(() => {
    if (!projection) {
      // If no projection, go back to step 1
      prevStep()
    }
  }, [projection])

  if (!projection) {
    return null
  }

  const welcomeText = `Great! Based on your goal of ${state.goalName} for ${formatCurrency(state.targetAmount, currency)} by ${state.targetDate?.toLocaleDateString()}, here's your personalized path. You can invest ${formatCurrency(projection.requiredLumpSum, currency)} today, or contribute ${formatCurrency(projection.monthlyContribution, currency)} per month.`

  const { speak } = useGuideSpeech({
    autoPlayText: welcomeText,
    autoPlayGuideType: 'Moo',
  })

  const lumpSumPercentage = ((projection.lumpSumGains / projection.requiredLumpSum) * 100).toFixed(1)
  const monthlyPercentage = ((projection.totalGains / projection.totalContributions) * 100).toFixed(1)

  const handleSelectOption = (option: 'lumpsum' | 'monthly') => {
    setSelectedOption(option)
    selectPlan(option)
  }

  const handleNext = () => {
    if (!selectedOption) return
    nextStep()
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const howItWorks = [
    {
      id: 'real-world-assets',
      title: 'Real-World Assets',
      icon: Shield,
      description: 'Your investment is backed by tangible assets like gold, aviation equipment, and real estate tokens.',
      details: 'We invest in tokenized real-world assets that generate real returns. Gold futures, aviation leases, and commercial real estate provide stable, predictable growth.',
    },
    {
      id: 'algorithmic-optimization',
      title: 'Algorithmic Optimization',
      icon: Zap,
      description: 'AI-powered portfolio rebalancing ensures optimal performance across all asset classes.',
      details: 'Our algorithms constantly monitor market conditions and automatically rebalance your portfolio to maximize returns while minimizing risk.',
    },
    {
      id: 'historical-performance',
      title: 'Historical Performance',
      icon: BarChart3,
      description: '8.16% CAGR based on gold futures historical performance and multi-asset diversification.',
      details: 'Projections based on COMEX gold futures performance combined with aviation and real estate asset returns. Past performance does not guarantee future results.',
    },
    {
      id: 'security',
      title: 'Security & Insurance',
      icon: Shield,
      description: 'Asset-backed, SEC-regulated, and fully insured for your peace of mind.',
      details: 'All assets are held in secure custody, tokenized on blockchain for transparency, and covered by institutional-grade insurance.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 md:px-8"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Goal Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#0066FF] to-[#2563eb] text-white p-6 rounded-2xl mb-8 shadow-lg"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{state.goalName}</h2>
              <p className="text-white/90">
                Target: {formatCurrency(state.targetAmount, currency)} by{' '}
                {state.targetDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Time to goal</p>
              <p className="text-3xl font-bold">{projection.yearsToGoal.toFixed(1)} years</p>
            </div>
          </div>
        </motion.div>

        {/* Projection Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Choose Your Investment Strategy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lump Sum Option */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectOption('lumpsum')}
              className={`cursor-pointer transition-all duration-300 ${
                selectedOption === 'lumpsum' ? 'ring-4 ring-[#0066FF] ring-offset-4 dark:ring-offset-slate-900' : ''
              }`}
            >
              <Card className={`p-8 h-full ${
                selectedOption === 'lumpsum'
                  ? 'bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5 border-[#0066FF]'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#0066FF] to-[#2563eb]">
                    <PiggyBank className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Invest Once, Watch It Grow</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Single lump sum investment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Amount needed today</p>
                    <p className="text-3xl font-bold text-[#0066FF]">{formatCurrency(projection.requiredLumpSum, currency)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Projected value</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(projection.targetAmount, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Return</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(projection.lumpSumGains, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {lumpSumPercentage}% total return over {projection.yearsToGoal.toFixed(1)} years
                    </p>
                  </div>

                  <Button
                    onClick={() => handleSelectOption('lumpsum')}
                    className={`w-full ${
                      selectedOption === 'lumpsum'
                        ? 'bg-gradient-to-r from-[#0066FF] to-[#2563eb]'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {selectedOption === 'lumpsum' ? 'Selected' : `Start with ${formatCompactCurrency(projection.recommendedLumpSum, currency)}`}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Monthly Contributions Option */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectOption('monthly')}
              className={`cursor-pointer transition-all duration-300 ${
                selectedOption === 'monthly' ? 'ring-4 ring-[#0066FF] ring-offset-4 dark:ring-offset-slate-900' : ''
              }`}
            >
              <Card className={`p-8 h-full ${
                selectedOption === 'monthly'
                  ? 'bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5 border-[#0066FF]'
                  : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#059669]">
                    <Repeat className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Build Gradually</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Consistent monthly investments</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Monthly investment</p>
                    <p className="text-3xl font-bold text-[#2563eb]">{formatCurrency(projection.monthlyContribution, currency)}/mo</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total contributions</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(projection.totalContributions, currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Projected gains</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(projection.totalGains, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {monthlyPercentage}% return on total contributions
                    </p>
                  </div>

                  <Button
                    onClick={() => handleSelectOption('monthly')}
                    className={`w-full ${
                      selectedOption === 'monthly'
                        ? 'bg-gradient-to-r from-[#2563eb] to-[#059669]'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {selectedOption === 'monthly' ? 'Selected' : `Start with ${formatCompactCurrency(projection.recommendedMonthly, currency)}/mo`}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-[#0066FF]" />
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {howItWorks.map((item, index) => {
              const Icon = item.icon
              const isExpanded = expandedSection === item.id

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card
                    className="p-6 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-[#0066FF] transition-colors"
                    onClick={() => toggleSection(item.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#0066FF]/20 to-[#2563eb]/10">
                        <Icon className="w-6 h-6 text-[#0066FF]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
                            >
                              <p className="text-sm text-slate-600 dark:text-slate-400">{item.details}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-between"
        >
          <Button
            onClick={prevStep}
            variant="outline"
            className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold px-8 shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Started with {selectedOption === 'lumpsum'
              ? formatCompactCurrency(projection.recommendedLumpSum, currency)
              : selectedOption === 'monthly'
              ? `${formatCompactCurrency(projection.recommendedMonthly, currency)}/mo`
              : 'Your Plan'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Projections are based on historical performance of 8.16% CAGR. Past performance does not guarantee future results.
            All investments carry risk. Please see our{' '}
            <a href="/risk-disclosure" className="text-[#0066FF] hover:underline">
              Risk Disclosure
            </a>{' '}
            for more information.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
