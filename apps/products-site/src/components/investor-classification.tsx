import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ArrowRight, User, TrendingUp, Building2, Shield, CheckCircle, Info } from "lucide-react"
import { HeroBackground } from "./hero-background"

export interface InvestorClassification {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  minimumInvestment: string
  regulatoryRequirements: string[]
  jurisdictionalNotes: Record<string, string>
  eligibilityCriteria: string[]
}

export interface InvestorClassificationProps {
  selectedCountry: { code: string; name: string; currency: string } | null
  onClassificationSelect: (classification: InvestorClassification) => void
  onBack: () => void
}

const investorClassifications: InvestorClassification[] = [
  {
    id: "retail",
    title: "Retail Investor",
    subtitle: "Individual Investment",
    description: "Individual investors seeking personal wealth management and precious metals allocation for diversified portfolios.",
    icon: <User className="w-8 h-8" />,
    minimumInvestment: "$10,000",
    regulatoryRequirements: [
      "Identity verification required",
      "Risk tolerance assessment",
      "Investment experience questionnaire",
      "Appropriateness testing"
    ],
    jurisdictionalNotes: {
      "US": "Subject to SEC retail investor protections",
      "GB": "FCA retail client classification",
      "AU": "ASIC retail client protections apply",
      "CA": "CSA retail investor requirements",
      "DE": "BaFin retail investor regulations",
      "SG": "MAS retail investor framework"
    },
    eligibilityCriteria: [
      "Age 18+ (21+ in some jurisdictions)",
      "Valid government-issued ID",
      "Proof of address",
      "Tax identification number"
    ]
  },
  {
    id: "sophisticated",
    title: "Sophisticated Investor",
    subtitle: "High Net Worth Individual",
    description: "Experienced investors with substantial assets seeking advanced precious metals strategies and institutional-grade access.",
    icon: <TrendingUp className="w-8 h-8" />,
    minimumInvestment: "$250,000",
    regulatoryRequirements: [
      "Wealth verification documentation",
      "Investment experience certification",
      "Sophisticated investor declaration",
      "Enhanced due diligence"
    ],
    jurisdictionalNotes: {
      "US": "Accredited investor status under Reg D",
      "GB": "High net worth or sophisticated investor certification",
      "AU": "Wholesale client classification under Corporations Act",
      "CA": "Accredited investor or permitted client status",
      "DE": "Professional client classification under MiFID II",
      "SG": "Accredited investor under Securities Act"
    },
    eligibilityCriteria: [
      "Net worth >$1M (excluding primary residence)",
      "Annual income >$200K ($300K joint)",
      "Professional investment experience",
      "Portfolio >$5M (jurisdiction dependent)"
    ]
  },
  {
    id: "institutional",
    title: "Institutional Investor",
    subtitle: "Corporate & Fund Management",
    description: "Institutional clients including pension funds, endowments, family offices, and corporate treasuries requiring sophisticated mandate structures.",
    icon: <Building2 className="w-8 h-8" />,
    minimumInvestment: "$10,000,000",
    regulatoryRequirements: [
      "Corporate registration verification",
      "Authorized signatory documentation",
      "Investment policy statement",
      "Board resolution for precious metals allocation"
    ],
    jurisdictionalNotes: {
      "US": "Qualified institutional buyer (QIB) status",
      "GB": "Professional client under FCA rules",
      "AU": "Wholesale client - institutional category",
      "CA": "Permitted client - institutional investor",
      "DE": "Professional client under MiFID II",
      "SG": "Institutional investor under SFA"
    },
    eligibilityCriteria: [
      "Incorporated entity in good standing",
      "Assets under management >$100M",
      "Dedicated investment committee",
      "Regulatory oversight and reporting"
    ]
  }
]

export function InvestorClassification({ selectedCountry, onClassificationSelect, onBack }: InvestorClassificationProps) {
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null)
  const [hoveredClassification, setHoveredClassification] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleClassificationSelect = (classification: InvestorClassification) => {
    setSelectedClassification(classification.id)
    onClassificationSelect(classification)
  }

  const getJurisdictionalNote = (classification: InvestorClassification) => {
    if (!selectedCountry) return null
    return classification.jurisdictionalNotes[selectedCountry.code]
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto">
      {/* Vanta.js Background */}
      <HeroBackground />

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{
        minHeight: '100vh',
        paddingTop: 'max(2rem, env(safe-area-inset-top) + 2rem)',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 2rem)'
      }}>
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="absolute top-12 left-12 text-white/70 hover:text-white transition-colors"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)'
              }}
            >
              ← Back to Country Selection
            </Button>

            <div className="text-3xl font-light text-white mb-4 tracking-wider" style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)'
            }}>
              COW
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50 mb-6" />
            <div className="text-sm text-gray-400 font-light tracking-wider uppercase mb-2">
              Step 2 of 3
            </div>
            {selectedCountry && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-lg">{selectedCountry.code === 'US' ? '🇺🇸' : selectedCountry.code === 'GB' ? '🇬🇧' : selectedCountry.code === 'AU' ? '🇦🇺' : selectedCountry.code === 'CA' ? '🇨🇦' : selectedCountry.code === 'DE' ? '🇩🇪' : selectedCountry.code === 'SG' ? '🇸🇬' : '🌍'}</span>
                <span className="text-white/70 text-sm">{selectedCountry.name}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-light text-white mb-4 leading-relaxed"
            style={{
              letterSpacing: '0.02em',
              fontFamily: 'Inter, sans-serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)'
            }}
          >
            Select Your Investor Classification
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl mx-auto" style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            Please select the investor classification that best describes your status.
            This determines your access level and regulatory requirements.
          </p>
        </div>

        {/* Classification Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {investorClassifications.map((classification) => {
            const jurisdictionalNote = getJurisdictionalNote(classification)

            return (
              <div
                key={classification.id}
                className={`relative cursor-pointer transition-all duration-500 ${
                  selectedClassification === classification.id
                    ? 'scale-105'
                    : hoveredClassification === classification.id
                      ? 'scale-102 -translate-y-2'
                      : 'hover:scale-102 hover:-translate-y-1'
                }`}
                onClick={() => handleClassificationSelect(classification)}
                onMouseEnter={() => setHoveredClassification(classification.id)}
                onMouseLeave={() => setHoveredClassification(null)}
                style={{
                  background: selectedClassification === classification.id
                    ? 'rgba(0, 0, 0, 0.6)'
                    : hoveredClassification === classification.id
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(25px) saturate(180%)',
                  border: selectedClassification === classification.id
                    ? '2px solid rgba(59, 130, 246, 0.7)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`p-3 rounded-2xl transition-all duration-300 ${
                        selectedClassification === classification.id || hoveredClassification === classification.id
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {classification.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-1">
                        {classification.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {classification.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                    {classification.description}
                  </p>

                  {/* Key Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Minimum Investment</span>
                      <span className="text-sm font-medium text-white">
                        {classification.minimumInvestment}
                      </span>
                    </div>

                    {/* Jurisdictional Note */}
                    {jurisdictionalNote && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-blue-300 font-medium mb-1">
                              {selectedCountry?.name} Requirement
                            </div>
                            <div className="text-xs text-blue-200">
                              {jurisdictionalNote}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Key Requirements Preview */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Key Requirements
                      </div>
                      {classification.regulatoryRequirements.slice(0, 2).map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-gray-400">{req}</span>
                        </div>
                      ))}
                      {classification.regulatoryRequirements.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{classification.regulatoryRequirements.length - 2} more requirements
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection Button */}
                  <Button
                    className={`w-full transition-all duration-500 rounded-lg ${
                      selectedClassification === classification.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : hoveredClassification === classification.id
                          ? 'bg-white text-black shadow-lg'
                          : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {selectedClassification === classification.id ? 'Selected' : 'Select Classification'}
                      <ArrowRight className={`w-4 h-4 transition-transform ${
                        hoveredClassification === classification.id ? 'translate-x-1' : ''
                      }`} />
                    </span>
                  </Button>
                </div>

                {/* Selection Indicator */}
                {selectedClassification === classification.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400 text-xs leading-relaxed max-w-4xl mx-auto" style={{
            textShadow: '0 1px 4px rgba(0,0,0,0.5)'
          }}>
            Your investor classification determines access to investment products, minimum investment amounts,
            and regulatory protections. Classifications are jurisdiction-specific and may require verification
            documentation. Contact our team if you need assistance with classification requirements.
          </p>
        </div>
      </div>
    </div>
  )
}