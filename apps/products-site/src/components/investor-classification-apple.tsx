import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ArrowRight, User, TrendingUp, Building2, Shield, CheckCircle, Info, ChevronLeft } from "lucide-react"
import { HeroBackground } from "./hero-background"
import { useAdaptiveText, useAdaptiveButton } from "../hooks/useAdaptiveText"

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
  highlight?: string
}

export interface InvestorClassificationProps {
  selectedCountry: { code: string; name: string; currency: string } | null
  onClassificationSelect: (classification: InvestorClassification) => void
  onBack: () => void
}

const investorClassifications: InvestorClassification[] = [
  {
    id: "explorer",
    title: "Explorer",
    subtitle: "First Steps",
    description: "Begin your Performance RWA journey with micro-investments and comprehensive educational resources to learn tokenized assets.",
    icon: <User className="w-6 h-6" />,
    minimumInvestment: "$10",
    highlight: "Start Here",
    regulatoryRequirements: [
      "Email verification",
      "Basic identity check",
      "Educational quiz completion",
      "Risk disclosure acknowledgment"
    ],
    jurisdictionalNotes: {
      "US": "Retail investor protections and educational requirements",
      "GB": "FCA retail client protections with enhanced guidance",
      "AU": "ASIC retail investor safeguards and education",
      "CA": "CSA investor protection with learning resources",
      "DE": "BaFin retail safeguards and educational materials",
      "SG": "MAS retail framework with guided onboarding"
    },
    eligibilityCriteria: [
      "Age 18+ (21+ in some jurisdictions)",
      "Valid email address",
      "Basic identity verification",
      "Complete educational modules"
    ]
  },
  {
    id: "builder",
    title: "Builder",
    subtitle: "Growing Your Portfolio",
    description: "Enhanced Performance RWA features with portfolio tracking, automated contributions, and personalized insights for steady wealth building.",
    icon: <TrendingUp className="w-6 h-6" />,
    minimumInvestment: "$100",
    highlight: "Most Popular",
    regulatoryRequirements: [
      "Identity verification",
      "Address confirmation",
      "Investment experience questionnaire",
      "Risk tolerance assessment"
    ],
    jurisdictionalNotes: {
      "US": "SEC retail investor protections apply",
      "GB": "FCA retail client classification",
      "AU": "ASIC retail client protections",
      "CA": "CSA retail investor requirements",
      "DE": "BaFin retail investor regulations",
      "SG": "MAS retail investor framework"
    },
    eligibilityCriteria: [
      "Valid government-issued ID",
      "Proof of address",
      "Tax identification number",
      "Bank account verification"
    ]
  },
  {
    id: "accelerator",
    title: "Accelerator",
    subtitle: "Enhanced Features",
    description: "Advanced Performance RWA strategies with portfolio optimization, rebalancing tools, and priority customer support.",
    icon: <TrendingUp className="w-6 h-6" />,
    minimumInvestment: "$1,000",
    regulatoryRequirements: [
      "Enhanced identity verification",
      "Investment experience review",
      "Financial capacity assessment",
      "Risk profiling"
    ],
    jurisdictionalNotes: {
      "US": "Enhanced retail protections with advisory features",
      "GB": "FCA retail classification with advisory access",
      "AU": "ASIC retail protections with enhanced features",
      "CA": "CSA retail framework with advisory components",
      "DE": "BaFin retail regulations with advisory access",
      "SG": "MAS retail framework with enhanced services"
    },
    eligibilityCriteria: [
      "Demonstrated investment experience",
      "Financial capacity verification",
      "Risk acknowledgment",
      "Platform activity requirements"
    ]
  },
  {
    id: "professional",
    title: "Professional",
    subtitle: "Advanced Strategies",
    description: "Sophisticated Performance RWA allocation with tax optimization, custom strategies, and dedicated relationship management.",
    icon: <Building2 className="w-6 h-6" />,
    minimumInvestment: "$10,000",
    regulatoryRequirements: [
      "Comprehensive suitability assessment",
      "Investment experience certification",
      "Financial capability verification",
      "Enhanced due diligence"
    ],
    jurisdictionalNotes: {
      "US": "Enhanced retail protections with professional features",
      "GB": "FCA elective professional client consideration",
      "AU": "ASIC retail with professional service access",
      "CA": "CSA retail with professional advisory access",
      "DE": "BaFin retail with professional service options",
      "SG": "MAS retail with professional advisory features"
    },
    eligibilityCriteria: [
      "Minimum liquid net worth $50,000",
      "Demonstrated investment knowledge",
      "Professional experience or education",
      "Risk management understanding"
    ]
  },
  {
    id: "premium",
    title: "Premium",
    subtitle: "Sophisticated Management",
    description: "White-glove Performance RWA management with custom mandates, alternative strategies, and institutional-grade reporting.",
    icon: <Building2 className="w-6 h-6" />,
    minimumInvestment: "$100,000",
    regulatoryRequirements: [
      "Wealth verification",
      "Investment experience certification",
      "Sophisticated investor declaration",
      "Enhanced compliance screening"
    ],
    jurisdictionalNotes: {
      "US": "Accredited investor consideration under Regulation D",
      "GB": "High net worth or sophisticated investor pathway",
      "AU": "Wholesale client classification assessment",
      "CA": "Accredited investor or permitted client status",
      "DE": "Professional client classification under MiFID II",
      "SG": "Accredited investor pathway under Securities Act"
    },
    eligibilityCriteria: [
      "Net worth >$500,000 (excluding primary residence)",
      "Annual income >$150,000",
      "Professional investment experience",
      "Portfolio >$250,000"
    ]
  },
  {
    id: "executive",
    title: "Executive",
    subtitle: "Elite Access",
    description: "Ultra-high-net-worth Performance RWA solutions with bespoke strategies, direct asset governance, and family office services.",
    icon: <Building2 className="w-6 h-6" />,
    minimumInvestment: "$500,000",
    regulatoryRequirements: [
      "Comprehensive wealth verification",
      "Investment sophistication certification",
      "Enhanced background screening",
      "Regulatory compliance review"
    ],
    jurisdictionalNotes: {
      "US": "Accredited investor status under Regulation D",
      "GB": "High net worth or sophisticated investor certification",
      "AU": "Wholesale client classification under Corporations Act",
      "CA": "Accredited investor or permitted client status",
      "DE": "Professional client classification under MiFID II",
      "SG": "Accredited investor under Securities Act"
    },
    eligibilityCriteria: [
      "Net worth >$2M (excluding primary residence)",
      "Annual income >$500,000",
      "Extensive investment experience",
      "Portfolio >$2M"
    ]
  },
  {
    id: "institutional",
    title: "Institutional",
    subtitle: "Enterprise Solutions",
    description: "Institutional-grade Performance RWA mandates for pension funds, endowments, family offices, and corporate treasuries with custom structures.",
    icon: <Building2 className="w-6 h-6" />,
    minimumInvestment: "$1,000,000",
    regulatoryRequirements: [
      "Corporate registration verification",
      "Authorized signatory documentation",
      "Investment policy statement",
      "Board resolution for RWA allocation"
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
      "Assets under management >$25M",
      "Dedicated investment committee",
      "Regulatory oversight and reporting"
    ]
  }
]

export function InvestorClassificationApple({ selectedCountry, onClassificationSelect, onBack }: InvestorClassificationProps) {
  const [selectedClassification, setSelectedClassification] = useState<string | null>(null)
  const [hoveredClassification, setHoveredClassification] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Apple-style adaptive text and button styles
  const adaptiveText = useAdaptiveText()
  const adaptiveButton = useAdaptiveButton()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleClassificationSelect = (classification: InvestorClassification) => {
    setSelectedClassification(classification.id)
    setTimeout(() => {
      onClassificationSelect(classification)
    }, 150)
  }

  const getJurisdictionalNote = (classification: InvestorClassification) => {
    if (!selectedCountry) return null
    return classification.jurisdictionalNotes[selectedCountry.code]
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Full Screen Vanta Background */}
      <div className="absolute inset-0 z-0">
        <HeroBackground />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-full h-full overflow-auto">
        <div className={`w-full mx-auto transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{
          minHeight: '100vh',
          padding: '2rem',
          paddingTop: 'max(2rem, env(safe-area-inset-top) + 2rem)',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom) + 2rem)'
        }}>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-16 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium text-sm">Back</span>
          </Button>

          <div className="text-center">
            <div className="text-2xl font-light mb-2 tracking-wide" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              color: 'rgba(0, 0, 0, 0.9)',
              fontWeight: 300
            }}>
              COW
            </div>
            {selectedCountry && (
              <div className="flex items-center gap-2 text-sm" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                color: 'rgba(0, 0, 0, 0.6)',
                fontWeight: 400
              }}>
                <span className="text-base">{selectedCountry.code === 'US' ? '🇺🇸' : selectedCountry.code === 'GB' ? '🇬🇧' : selectedCountry.code === 'AU' ? '🇦🇺' : selectedCountry.code === 'CA' ? '🇨🇦' : selectedCountry.code === 'DE' ? '🇩🇪' : selectedCountry.code === 'SG' ? '🇸🇬' : '🌍'}</span>
                <span>{selectedCountry.name}</span>
              </div>
            )}
          </div>

          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="text-xs font-medium uppercase tracking-widest mb-4 transition-all duration-500 delay-100" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            color: 'rgba(0, 0, 0, 0.5)',
            fontWeight: 500,
            opacity: isVisible ? 1 : 0
          }}>
            Step 2 of 3
          </div>

          <h1 className={`text-5xl md:text-6xl font-light mb-6 leading-tight transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.02em',
            color: 'rgba(0, 0, 0, 0.9)',
            fontWeight: 300
          }}>
            Choose your<br />investment approach
          </h1>

          <p className={`text-xl leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            color: 'rgba(0, 0, 0, 0.7)'
          }}>
            Select the classification that matches your investment profile for Performance RWA tokens.
            This determines your access level and regulatory framework.
          </p>
        </div>

        {/* Classification Cards */}
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {investorClassifications.map((classification, index) => {
              const jurisdictionalNote = getJurisdictionalNote(classification)
              const isSelected = selectedClassification === classification.id
              const isHovered = hoveredClassification === classification.id

              return (
                <div
                  key={classification.id}
                  className={`relative cursor-pointer transition-all duration-500 ease-out transform ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${
                    isSelected ? 'scale-105 z-10' : isHovered ? 'scale-102 z-10' : 'hover:scale-102'
                  }`}
                  style={{
                    transitionDelay: `${400 + index * 100}ms`
                  }}
                  onClick={() => handleClassificationSelect(classification)}
                  onMouseEnter={() => setHoveredClassification(classification.id)}
                  onMouseLeave={() => setHoveredClassification(null)}
                >
                  {/* Highlight Badge */}
                  {classification.highlight && (
                    <div className="absolute -top-3 left-6 z-20">
                      <div className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{
                        background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                        boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)'
                      }}>
                        {classification.highlight}
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className="relative overflow-hidden rounded-2xl p-8 h-full transition-all duration-300"
                    style={{
                      background: isSelected
                        ? 'rgba(255, 255, 255, 0.15)'
                        : isHovered
                          ? 'rgba(255, 255, 255, 0.12)'
                          : 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      border: isSelected
                        ? '2px solid rgba(0, 122, 255, 0.6)'
                        : isHovered
                          ? '1px solid rgba(255, 255, 255, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.15)',
                      boxShadow: isSelected
                        ? '0 20px 60px rgba(0, 122, 255, 0.2), 0 8px 24px rgba(0,0,0,0.1)'
                        : isHovered
                          ? '0 16px 40px rgba(0,0,0,0.15)'
                          : '0 8px 24px rgba(0,0,0,0.08)'
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            isSelected || isHovered
                              ? 'text-white'
                              : 'text-white/70'
                          }`}
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                              : isHovered
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {classification.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold mb-1" style={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                            letterSpacing: '-0.01em',
                            color: 'rgba(0, 0, 0, 0.9)',
                            fontWeight: 600
                          }}>
                            {classification.title}
                          </h3>
                          <p className="text-sm font-medium" style={{
                            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontWeight: 500
                          }}>
                            {classification.subtitle}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{
                          background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                        }}>
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="mb-8 leading-relaxed" style={{
                      fontSize: '16px',
                      lineHeight: 1.6,
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      color: 'rgba(0, 0, 0, 0.7)',
                      fontWeight: 400
                    }}>
                      {classification.description}
                    </p>

                    {/* Investment Details */}
                    <div className="space-y-6 mb-8">
                      <div className="flex justify-between items-center py-3 border-b border-black/10">
                        <span className="font-medium" style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(0, 0, 0, 0.6)',
                          fontWeight: 500
                        }}>Minimum Investment</span>
                        <span className="font-semibold text-lg" style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(0, 0, 0, 0.9)',
                          fontWeight: 600
                        }}>
                          {classification.minimumInvestment}
                        </span>
                      </div>

                      {/* Jurisdictional Note */}
                      {jurisdictionalNote && (
                        <div className="p-4 rounded-xl" style={{
                          background: 'rgba(0, 122, 255, 0.08)',
                          border: '1px solid rgba(0, 122, 255, 0.2)'
                        }}>
                          <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm mb-1" style={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                                color: 'rgba(0, 0, 0, 0.9)',
                                fontWeight: 500
                              }}>
                                {selectedCountry?.name} Classification
                              </div>
                              <div className="text-sm leading-relaxed" style={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                                color: 'rgba(0, 0, 0, 0.7)',
                                fontWeight: 400
                              }}>
                                {jurisdictionalNote}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Requirements */}
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide mb-3" style={{
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                          color: 'rgba(0, 0, 0, 0.5)',
                          fontWeight: 500
                        }}>
                          Key Requirements
                        </div>
                        <div className="space-y-2">
                          {classification.regulatoryRequirements.slice(0, 2).map((req, reqIndex) => (
                            <div key={reqIndex} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                              <span className="text-sm leading-relaxed" style={{
                                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                                color: 'rgba(0, 0, 0, 0.7)',
                                fontWeight: 400
                              }}>{req}</span>
                            </div>
                          ))}
                          {classification.regulatoryRequirements.length > 2 && (
                            <div className="text-sm ml-6" style={{
                              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                              color: 'rgba(0, 0, 0, 0.5)',
                              fontWeight: 400
                            }}>
                              +{classification.regulatoryRequirements.length - 2} more requirements
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className={`w-full py-4 text-base font-medium rounded-xl transition-all duration-300 ${
                        isSelected
                          ? 'shadow-lg'
                          : 'hover:shadow-lg'
                      }`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                          : isHovered
                            ? 'rgba(0, 0, 0, 0.08)'
                            : 'rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        color: isSelected ? 'white' : 'rgba(0, 0, 0, 0.8)',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 500
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSelected ? 'Selected' : 'Select Plan'}
                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          isHovered ? 'translate-x-1' : ''
                        }`} />
                      </span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className={`text-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-sm leading-relaxed max-w-4xl mx-auto" style={{
              lineHeight: 1.6,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              color: 'rgba(0, 0, 0, 0.6)',
              fontWeight: 400
            }}>
              Your classification determines access to Performance RWA tokens, regulatory protections, and documentation requirements.
              All classifications are subject to jurisdiction-specific regulations and verification processes for digital asset investments.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}