import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Globe, DollarSign, Clock } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Common countries list
const countries = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
]

const currencies = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'SGD', 'HKD', 'AED', 'INR',
  'CHF', 'JPY', 'KRW', 'CNY', 'BRL', 'MXN', 'ZAR'
]

const timeframeOptions = [
  {
    value: 'short',
    label: 'Short-term (1-3 years)',
    description: 'Near-term goals and milestones',
    icon: '⚡',
  },
  {
    value: 'medium',
    label: 'Medium-term (3-7 years)',
    description: 'Building foundations and momentum',
    icon: '🌱',
  },
  {
    value: 'long',
    label: 'Long-term (7+ years)',
    description: 'Compound growth and wealth building',
    icon: '🌳',
  },
]

export const Step9Location: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useComprehensiveOnboarding()
  const [country, setCountry] = useState<string | null>(state.country)
  const [currency, setCurrency] = useState<string | null>(state.currency)
  const [investmentTimeframe, setInvestmentTimeframe] = useState<string | null>(state.investmentTimeframe)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Where are you based? This helps us show relevant products, ensure compliance, and customize your experience."

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => stop()
  }, [stop])

  // Auto-populate currency when country changes
  useEffect(() => {
    if (country) {
      const selectedCountry = countries.find((c) => c.name === country)
      if (selectedCountry && !currency) {
        setCurrency(selectedCountry.currency)
      }
    }
  }, [country, currency])

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    if (!country || !currency || !investmentTimeframe) return
    stop()
    updateState('country', country)
    updateState('currency', currency)
    updateState('investmentTimeframe', investmentTimeframe)
    nextStep()
  }

  const isFormValid = !!country && !!currency && !!investmentTimeframe

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
            Where are you based?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Help us personalize your experience and ensure regulatory compliance
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="space-y-8">
            {/* Country Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Label htmlFor="country" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0066FF]" />
                Country
              </Label>
              <Select value={country || undefined} onValueChange={(value) => setCountry(value)}>
                <SelectTrigger
                  id="country"
                  className="w-full bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6 px-4"
                >
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.name} className="text-base py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Currency Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Label htmlFor="currency" className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2563eb]" />
                Preferred Currency
              </Label>
              <Select value={currency || undefined} onValueChange={(value) => setCurrency(value)}>
                <SelectTrigger
                  id="currency"
                  className="w-full bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 text-lg py-6 px-4"
                >
                  <SelectValue placeholder="Select your currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr} className="text-base py-3">
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {country && 'Auto-selected based on your country. You can change it if needed.'}
              </p>
            </motion.div>

            {/* Investment Timeframe */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Label className="text-slate-700 dark:text-slate-200 font-medium text-lg mb-4 flex items-center gap-2 block">
                <Clock className="w-5 h-5 text-[#059669]" />
                Investment Timeframe
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timeframeOptions.map((option, index) => {
                  const isSelected = investmentTimeframe === option.value

                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => setInvestmentTimeframe(option.value)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                        ${
                          isSelected
                            ? 'border-[#059669] bg-gradient-to-br from-[#059669]/10 to-transparent shadow-lg shadow-[#059669]/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#059669]/50'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-3">{option.icon}</div>
                        <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{option.label}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{option.description}</p>

                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#059669] text-white text-xs font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            Selected
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg"
          >
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Privacy & Compliance:</strong> We use your location to ensure we're compliant with local
              regulations and to show you products available in your jurisdiction. Your information is encrypted and
              never shared without your consent.
            </p>
          </motion.div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
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
