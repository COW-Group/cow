import type React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Mail,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  TrendingUp,
  PieChart,
  Calculator,
  Target,
  Rocket,
  ArrowRight,
} from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

interface HelpOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const HELP_OPTIONS: HelpOption[] = [
  { id: 'wealth_plan', label: 'Building a wealth plan', icon: Target },
  { id: 'understand_investments', label: 'Understanding investments', icon: BookOpen },
  { id: 'track_portfolio', label: 'Tracking my portfolio', icon: PieChart },
  { id: 'learn_rwas', label: 'Learning about RWAs', icon: TrendingUp },
  { id: 'tax_optimization', label: 'Tax optimization', icon: Calculator },
  { id: 'retirement_planning', label: 'Retirement planning', icon: Rocket },
]

export const Step14AccountSetup: React.FC = () => {
  const { state, updateState, prevStep, completePhase, completeOnboarding } = useComprehensiveOnboarding()

  const [phoneNumber, setPhoneNumber] = useState(state.phoneNumber || '')
  const [email, setEmail] = useState(state.email || '')
  const [isPremium, setIsPremium] = useState(state.isPremium || false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const introText = `Almost there, ${state.firstName}! Let's set up your account. We need your contact information to keep your account secure and send you important updates. Then choose the plan that's right for you - you can always upgrade or downgrade later.`

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => stop()
  }, [stop])

  const validatePhone = (phone: string): boolean => {
    // Simple validation - checks for at least 10 digits
    const phoneRegex = /^[\d\s\-+()]+$/
    const digitsOnly = phone.replace(/\D/g, '')
    return digitsOnly.length >= 10 && phoneRegex.test(phone)
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isFormValid = validatePhone(phoneNumber) && validateEmail(email)

  const handlePhoneBlur = () => {
    if (phoneNumber && !validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid phone number (at least 10 digits)')
    } else {
      setPhoneError(null)
    }
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError(null)
    }
  }

  const handlePlanSelect = (premium: boolean) => {
    setIsPremium(premium)
    if (premium) {
      speak(
        state.guideType,
        "You've selected the Premium plan. You'll get advanced AI guidance and priority access to assets. Your first month starts today."
      )
    } else {
      speak(
        state.guideType,
        "You've selected the Free plan. Great for getting started with real-world assets."
      )
    }
  }

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleComplete = async () => {
    if (!isFormValid) return

    setIsCompleting(true)
    stop()

    // Update all final state
    updateState('phoneNumber', phoneNumber)
    updateState('email', email)
    updateState('isPremium', isPremium)
    updateState('isAuthenticated', true)

    // Complete phases
    completePhase('account')

    // Complete onboarding (this clears localStorage and should redirect)
    completeOnboarding()

    // In production: navigate('/dashboard')
    // For now: redirect to dashboard after brief delay
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

  const getPathDescription = (): string => {
    switch (state.primaryIntent) {
      case 'wealth':
        return 'Building Wealth'
      case 'invest':
        return 'Direct Investment'
      case 'advisor':
        return 'Financial Advisor'
      case 'institutional':
        return 'Institutional'
      default:
        return 'Investment Journey'
    }
  }

  const getInvestorTypeLabel = (): string => {
    switch (state.investorType) {
      case 'individual':
        return 'Individual Investor'
      case 'accredited':
        return 'Accredited Investor'
      case 'international':
        return 'International Investor'
      case 'advisor':
        return 'Financial Advisor'
      case 'institutional':
        return 'Institutional Investor'
      default:
        return 'Investor'
    }
  }

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
            Complete Your Account
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Just a few more details and you'll be ready to start your journey with real-world assets.
          </p>
        </motion.div>

        {/* Main Content - Scrollable Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-10 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-8 max-h-[70vh] overflow-y-auto"
        >
          {/* Section 1: Contact Information */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5">
                <Phone className="w-6 h-6 text-[#0066FF] dark:text-[#38bdf8]" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Contact Information
              </h2>
            </div>

            <div className="space-y-5">
              {/* Phone Number Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onBlur={handlePhoneBlur}
                    placeholder="+1 (555) 123-4567"
                    className={`
                      w-full pl-12 pr-4 py-4 rounded-lg border-2 transition-all duration-300
                      bg-white dark:bg-slate-800 text-slate-800 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50
                      ${phoneError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#0066FF]'
                      }
                    `}
                  />
                </div>
                {phoneError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {phoneError}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="your.email@example.com"
                    className={`
                      w-full pl-12 pr-4 py-4 rounded-lg border-2 transition-all duration-300
                      bg-white dark:bg-slate-800 text-slate-800 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50
                      ${emailError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#0066FF]'
                      }
                    `}
                  />
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Choose Your Plan */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5">
                <CreditCard className="w-6 h-6 text-[#0066FF] dark:text-[#38bdf8]" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Choose Your Plan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <motion.button
                onClick={() => handlePlanSelect(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${isPremium
                    ? 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50'
                    : 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/5 to-[#2563eb]/5 shadow-lg shadow-[#0066FF]/10'
                  }
                `}
              >
                {!isPremium && (
                  <div className="absolute -top-3 -right-3 bg-[#0066FF] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Selected
                  </div>
                )}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full mb-3">
                    Get Started
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Free Plan</h3>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">
                    $0<span className="text-lg font-normal text-slate-500">/month</span>
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Access to curated real-world assets',
                    'Basic portfolio tracking',
                    'Educational resources',
                    'Community access',
                    'Email support',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>

              {/* Premium Plan */}
              <motion.button
                onClick={() => handlePlanSelect(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${isPremium
                    ? 'border-[#0066FF] bg-gradient-to-br from-[#0066FF]/5 via-[#2563eb]/5 to-[#059669]/5 shadow-lg shadow-[#0066FF]/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50'
                  }
                `}
              >
                {isPremium && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#0066FF] to-[#059669] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Selected
                  </div>
                )}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#059669] to-[#10b981] text-white text-xs font-semibold rounded-full mb-3 flex items-center gap-1 w-fit">
                    <Sparkles className="w-3 h-3" />
                    Best Value
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Premium Plan</h3>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">
                    $15<span className="text-lg font-normal text-slate-500">/month</span>
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Everything in Free, plus:',
                    'Advanced AI-powered guidance',
                    'Priority asset access',
                    'Personalized wealth roadmap',
                    'Advanced analytics & insights',
                    'Priority support',
                    'Exclusive community perks',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${index === 0 ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            </div>
          </div>

          {/* Section 3: How can MyCOW help? (Optional) */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#0066FF]/10 to-[#2563eb]/5">
                <Lightbulb className="w-6 h-6 text-[#0066FF] dark:text-[#38bdf8]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                  How can MyCOW help?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  (Optional - helps us personalize your experience)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HELP_OPTIONS.map((option) => {
                const isSelected = state.myCowHelp.includes(option.id)
                const IconComponent = option.icon

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => updateState('myCowHelp',
                      isSelected
                        ? state.myCowHelp.filter(h => h !== option.id)
                        : [...state.myCowHelp, option.id]
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-300 flex items-center gap-3
                      ${isSelected
                        ? 'border-[#0066FF] bg-[#0066FF]/5'
                        : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-[#0066FF]/50'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${isSelected ? 'bg-[#0066FF] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}
                    `}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${isSelected ? 'text-[#0066FF]' : 'text-slate-700 dark:text-slate-300'}`}>
                      {option.label}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Section 4: Completion Summary */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#059669]/10 to-[#10b981]/5">
                <CheckCircle2 className="w-6 h-6 text-[#059669] dark:text-[#10b981]" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Your Journey Summary
              </h2>
            </div>

            <div className="bg-gradient-to-br from-[#0066FF]/5 via-[#2563eb]/5 to-[#059669]/5 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Welcome</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {state.firstName || 'Investor'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your Guide</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {state.guideType || 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your Path</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {getPathDescription()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Investor Type</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {getInvestorTypeLabel()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Selected Plan</p>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {isPremium ? 'Premium ($15/mo)' : 'Free ($0/mo)'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Next Steps:
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: Target, text: 'Complete your profile' },
                    { icon: CheckCircle2, text: 'Verify your identity (KYC)' },
                    ...(isPremium ? [{ icon: CreditCard, text: 'Connect payment method' }] : []),
                    { icon: Rocket, text: 'Start investing in real-world assets' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <step.icon className="w-4 h-4 text-[#0066FF] dark:text-[#38bdf8]" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={isCompleting}
              className="flex-shrink-0 px-8 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-lg hover:border-[#0066FF] hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              onClick={handleComplete}
              disabled={!isFormValid || isCompleting}
              className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#059669] hover:from-[#2563eb] hover:to-[#10b981] text-white font-semibold text-lg py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#059669]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0066FF] disabled:hover:to-[#059669] flex items-center justify-center gap-2"
            >
              {isCompleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Setting up your account...
                </>
              ) : (
                <>
                  Complete Setup & Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {!isFormValid && 'Please fill in your contact information to continue.'}
            {isFormValid && "You're all set! Click the button above to complete your account setup."}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
