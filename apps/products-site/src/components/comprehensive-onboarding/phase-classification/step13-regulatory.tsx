import type React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { useComprehensiveOnboarding } from '@/contexts/comprehensive-onboarding-context'
import { useGuideSpeech } from '@/hooks/use-guide-speech'

interface DisclosureSection {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  content: string[]
}

const REQUIRED_ACKNOWLEDGMENTS = [
  'I have read and understand the investment risks associated with real-world asset tokens',
  'I understand that my investments may be subject to regulatory restrictions based on my jurisdiction',
  'I acknowledge that COW may request additional documentation to verify my investor status',
  'I agree to the Terms of Service and Privacy Policy',
]

export const Step13Regulatory: React.FC = () => {
  const { state, updateState, nextStep, prevStep, completePhase } = useComprehensiveOnboarding()
  const [expandedSections, setExpandedSections] = useState<string[]>(['risks']) // Start with risks expanded
  const [acknowledgedItems, setAcknowledgedItems] = useState<string[]>(
    state.regulatoryAcknowledgments || []
  )
  const [isSpeaking, setIsSpeaking] = useState(false)

  const introText = "Before proceeding, please review these important regulatory disclosures and acknowledge your understanding."

  const { speak, stop } = useGuideSpeech({
    autoPlayText: introText,
    autoPlayGuideType: state.guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const disclosureSections: DisclosureSection[] = [
    {
      id: 'risks',
      title: 'Investment Risks',
      icon: AlertTriangle,
      content: [
        'Real-world asset tokens involve risks including market volatility, liquidity constraints, and regulatory changes.',
        'Past performance does not guarantee future results.',
        'You may lose some or all of your invested capital.',
        'Real-world assets may be illiquid and difficult to sell quickly.',
      ],
    },
    {
      id: 'regulatory',
      title: 'Regulatory Status',
      icon: Shield,
      content: [
        'COW operates under applicable securities laws and regulations.',
        'Certain offerings may be restricted to accredited or qualified investors.',
        'International investors must comply with local regulations.',
        'We reserve the right to verify investor status and reject applications.',
      ],
    },
    {
      id: 'privacy',
      title: 'Data Privacy & Security',
      icon: Lock,
      content: [
        'Your personal and financial data is encrypted and stored securely.',
        'We collect KYC/AML information as required by law.',
        'Your data may be shared with regulatory bodies or service providers as needed.',
        'Read our full Privacy Policy for details.',
      ],
    },
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleAcknowledgment = (item: string) => {
    setAcknowledgedItems((prev) =>
      prev.includes(item)
        ? prev.filter((ack) => ack !== item)
        : [...prev, item]
    )
  }

  const handlePrevious = () => {
    stop()
    prevStep()
  }

  const handleNext = () => {
    if (!allAcknowledged) return
    stop()
    updateState('regulatoryAcknowledgments', acknowledgedItems)
    updateState('disclosuresAccepted', true)
    completePhase('classification')
    nextStep()
  }

  const allAcknowledged = REQUIRED_ACKNOWLEDGMENTS.every((item) =>
    acknowledgedItems.includes(item)
  )

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
            Regulatory Acknowledgment
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Please review these important disclosures. Your acknowledgment is required to continue.
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-8"
        >
          {/* Scrollable Disclosure Sections */}
          <div className="max-h-[400px] overflow-y-auto pr-2 mb-8 space-y-4">
            {disclosureSections.map((section, index) => {
              const IconComponent = section.icon
              const isExpanded = expandedSections.includes(section.id)

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                >
                  {/* Section Header (Collapsible) */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                        <IconComponent className="w-5 h-5 text-[#0066FF] dark:text-[#38bdf8]" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white text-left">
                        {section.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </motion.div>
                  </button>

                  {/* Section Content (Expandable) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-white dark:bg-slate-800/50 space-y-3">
                          {section.content.map((item, itemIndex) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIndex * 0.05, duration: 0.3 }}
                              className="flex gap-3"
                            >
                              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0066FF] dark:bg-[#38bdf8] mt-2" />
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {item}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Required Acknowledgments */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
              Required Acknowledgments
            </h3>
            <div className="space-y-4">
              {REQUIRED_ACKNOWLEDGMENTS.map((item, index) => {
                const isChecked = acknowledgedItems.includes(item)
                const isLastItem = index === REQUIRED_ACKNOWLEDGMENTS.length - 1

                return (
                  <motion.label
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                    className={`
                      flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300
                      ${
                        isChecked
                          ? 'bg-[#059669]/10 border-2 border-[#059669]'
                          : 'bg-slate-50 dark:bg-slate-700/30 border-2 border-slate-200 dark:border-slate-700 hover:border-[#0066FF]/50'
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAcknowledgment(item)}
                        className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-[#059669] focus:ring-2 focus:ring-[#059669]/50 cursor-pointer"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item}
                        {isLastItem && (
                          <span className="ml-1">
                            (
                            <a
                              href="/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066FF] dark:text-[#38bdf8] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Terms of Service
                            </a>
                            {' '}and{' '}
                            <a
                              href="/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066FF] dark:text-[#38bdf8] hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Privacy Policy
                            </a>
                            )
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.label>
                )
              })}
            </div>

            {/* Progress Indicator */}
            {!allAcknowledged && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {acknowledgedItems.length} of {REQUIRED_ACKNOWLEDGMENTS.length} acknowledgments completed
                </p>
              </motion.div>
            )}

            {/* All Complete Indicator */}
            {allAcknowledged && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-lg bg-[#059669]/10 border border-[#059669] text-center"
              >
                <p className="text-[#059669] dark:text-[#10b981] font-medium">
                  All acknowledgments completed. You may continue.
                </p>
              </motion.div>
            )}
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
              className="flex-shrink-0 px-8 py-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-lg hover:border-[#0066FF] hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-all duration-300"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!allAcknowledged}
              className="flex-1 bg-gradient-to-r from-[#0066FF] to-[#2563eb] hover:from-[#2563eb] hover:to-[#059669] text-white font-semibold text-lg py-6 rounded-xl shadow-lg shadow-[#0066FF]/25 hover:shadow-xl hover:shadow-[#2563eb]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0066FF] disabled:hover:to-[#2563eb]"
            >
              Continue
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
            All acknowledgments are required. Please read carefully before checking each box.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
