import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Eye, EyeOff, Rocket, Mail, Phone, Lock } from 'lucide-react'
import { useSimpleOnboarding } from '@/contexts/simple-onboarding-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatCompactCurrency } from '@/lib/goal-projections'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

export const Step3QuickSignup: React.FC = () => {
  const { state, updateUserDetails, prevStep, completeOnboarding } = useSimpleOnboarding()

  const [email, setEmail] = useState(state.email)
  const [phone, setPhone] = useState(state.phone)
  const [password, setPassword] = useState(state.password)
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(state.termsAccepted)
  const [marketingOptIn, setMarketingOptIn] = useState(state.marketingOptIn)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projection = state.projection
  const currency = state.currency

  const welcomeText = "Just a few details and you're ready to start. Enter your email and create a password to secure your account."

  const { speak } = useGuideSpeech({
    autoPlayText: welcomeText,
    autoPlayGuideType: 'Moo',
  })

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      newErrors.push('Please enter a valid email address')
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s\-()]+$/
    if (!phone || phone.length < 10 || !phoneRegex.test(phone)) {
      newErrors.push('Please enter a valid phone number')
    }

    // Password validation
    if (!password || password.length < 8) {
      newErrors.push('Password must be at least 8 characters')
    }

    // Terms acceptance
    if (!termsAccepted) {
      newErrors.push('You must accept the Terms of Service and Privacy Policy')
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Update context state
    updateUserDetails('email', email)
    updateUserDetails('phone', phone)
    updateUserDetails('password', password)
    updateUserDetails('termsAccepted', termsAccepted)
    updateUserDetails('marketingOptIn', marketingOptIn)

    try {
      await completeOnboarding()

      // Redirect to dashboard
      // In a real app, this would be handled by router
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setErrors(['An error occurred. Please try again.'])
      setIsSubmitting(false)
    }
  }

  const planType = state.selectedPlan === 'lumpsum' ? 'Lump Sum Investment' : 'Monthly Contributions'
  const planAmount = state.selectedPlan === 'lumpsum'
    ? formatCurrency(state.recommendedAmount, currency)
    : `${formatCurrency(state.recommendedAmount, currency)}/month`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 md:px-8"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 mb-4">
            <Rocket className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            You're Almost There!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Create your account to start investing
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 bg-gradient-to-br from-[#0066FF]/5 to-[#2563eb]/5 border-[#0066FF]/20 sticky top-8">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                Your Plan Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Goal</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{state.goalName}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Target Amount</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(state.targetAmount, currency)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Target Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {state.targetDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Selected Plan</p>
                  <p className="font-semibold text-[#0066FF] dark:text-[#38bdf8]">{planType}</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{planAmount}</p>
                </div>

                {projection && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                    <p className="text-xs text-emerald-800 dark:text-emerald-200 mb-1">Projected gains</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(
                        state.selectedPlan === 'lumpsum' ? projection.lumpSumGains : projection.totalGains,
                        currency
                      )}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-8 bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Create Your Account
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0066FF]" />
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 py-6"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#0066FF]" />
                    Phone number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 py-6"
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0066FF]" />
                    Create password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="bg-slate-100/70 dark:bg-slate-700/70 border-slate-200/70 dark:border-slate-600/70 py-6 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Minimum 8 characters
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                      I agree to the{' '}
                      <a href="/terms" className="text-[#0066FF] hover:underline" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-[#0066FF] hover:underline" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="marketing"
                      checked={marketingOptIn}
                      onCheckedChange={(checked) => setMarketingOptIn(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="marketing" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                      Send me updates about my goal progress and new investment opportunities
                    </label>
                  </div>
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

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-lg py-7 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-700/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Rocket className="mr-2 w-5 h-5" />
                      Create My Account & Start Investing
                    </>
                  )}
                </Button>
              </div>

              {/* What Happens Next */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-4">What happens next?</h4>
                <div className="space-y-3">
                  {[
                    'Verify your email address',
                    'Complete your investor profile',
                    'Connect your payment method',
                    'Make your first investment',
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#2563eb] flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Back Button */}
            <div className="mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Projection
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your data is encrypted and secure. We never share your information with third parties.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
