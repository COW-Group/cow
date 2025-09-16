import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { ArrowRight, Building2, User, Users, TrendingUp, Shield, Briefcase, ChevronLeft } from "lucide-react"
import { HeroBackground } from "./hero-background"

export interface UserType {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  features: string[]
  minimumInvestment?: string
  regulatoryNote?: string
}

const userTypes: UserType[] = [
  {
    id: "individual",
    title: "Individual Investor",
    subtitle: "Personal Wealth Management",
    description: "Access institutional-grade precious metals investments with personalized portfolio management and transparent pricing.",
    icon: <User className="w-8 h-8" />,
    features: [
      "Minimum investment from $10,000",
      "Personal wealth advisor assigned",
      "Real-time portfolio tracking",
      "Tax-optimized strategies",
      "Mobile app access"
    ],
    minimumInvestment: "$10,000",
    regulatoryNote: "Available to accredited investors"
  },
  {
    id: "advisor",
    title: "Financial Advisor",
    subtitle: "Client Portfolio Solutions",
    description: "Comprehensive precious metals allocation tools and white-label solutions for managing client portfolios at scale.",
    icon: <Briefcase className="w-8 h-8" />,
    features: [
      "Multi-client portfolio management",
      "White-label platform options",
      "Dedicated relationship manager",
      "Custom reporting tools",
      "Compliance-ready documentation"
    ],
    minimumInvestment: "$100,000 AUM",
    regulatoryNote: "For registered investment advisors"
  },
  {
    id: "institutional",
    title: "Institutional Client",
    subtitle: "Enterprise Asset Management",
    description: "Sophisticated precious metals strategies for pension funds, endowments, family offices, and corporate treasuries.",
    icon: <Building2 className="w-8 h-8" />,
    features: [
      "Custom investment mandates",
      "Direct market access",
      "Dedicated institutional team",
      "Prime brokerage services",
      "Regulatory compliance support"
    ],
    minimumInvestment: "$10M+",
    regulatoryNote: "Qualified institutional buyers only"
  }
]

interface UserTypeSelectorProps {
  onUserTypeSelect: (userType: UserType) => void
  selectedType?: string
  onBack?: () => void
  selectedCountry?: any
  selectedClassification?: any
}

// Filter user types based on investment classification
const getAvailableUserTypes = (classificationId?: string) => {
  if (!classificationId) return userTypes

  // Low-tier investors ($10-$999) - Individual only
  const individualOnlyTiers = ['explorer', 'builder']

  // Mid-tier investors ($1K-$100K) - Individual or Advisor
  const individualAdvisorTiers = ['accelerator', 'professional', 'premium']

  // High-tier investors ($500K+) - All types available
  const allTypesTiers = ['executive', 'institutional', 'ultra-high-net-worth', 'sovereign-wealth']

  if (individualOnlyTiers.includes(classificationId)) {
    return userTypes.filter(type => type.id === 'individual')
  }

  if (individualAdvisorTiers.includes(classificationId)) {
    return userTypes.filter(type => ['individual', 'advisor'].includes(type.id))
  }

  // For high-tier and institutional, all types are available
  return userTypes
}

export function UserTypeSelector({ onUserTypeSelect, selectedType, onBack, selectedClassification }: UserTypeSelectorProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Get filtered user types based on selected classification
  const availableUserTypes = getAvailableUserTypes(selectedClassification?.id)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

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
          {onBack && (
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
          )}

          <div className="text-center">
            <div className="text-2xl font-light mb-2 tracking-wide" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 300
            }}>
              COW
            </div>
          </div>

          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className={`text-xs font-medium uppercase tracking-widest mb-4 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`} style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500
          }}>
            Step 3 of 3
          </div>

          <h1 className={`text-5xl md:text-6xl font-light mb-6 leading-tight transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '-0.02em',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 300
          }}>
            {availableUserTypes.length === 1 ? (
              <>
                Confirm your<br />
                investor profile
              </>
            ) : (
              <>
                Select your<br />
                investor type
              </>
            )}
          </h1>

          <p className={`text-xl leading-relaxed max-w-2xl mx-auto transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {availableUserTypes.length === 1
              ? 'Based on your selected investment level, this is your recommended investor category for accessing Performance RWA tokens.'
              : 'Choose the category that best describes your role and investment approach. This determines your platform experience and available features.'
            }
          </p>
        </div>

        {/* User Type Cards */}
        <div className="max-w-8xl mx-auto">
          <div className={`grid gap-8 ${
            availableUserTypes.length === 1
              ? 'grid-cols-1 max-w-md mx-auto'
              : availableUserTypes.length === 2
                ? 'md:grid-cols-2 max-w-4xl mx-auto'
                : 'md:grid-cols-3'
          }`}>
        {availableUserTypes.map((type) => (
          <Card
            key={type.id}
            className={`relative overflow-hidden transition-all duration-500 cursor-pointer group ${
              selectedType === type.id
                ? 'ring-2 ring-blue-500 shadow-2xl scale-105'
                : hoveredType === type.id
                  ? 'shadow-2xl scale-102 -translate-y-1'
                  : 'shadow-lg hover:shadow-2xl hover:-translate-y-1'
            }`}
            style={{
              background: selectedType === type.id
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)'
                : hoveredType === type.id
                  ? 'rgba(255, 255, 255, 0.98)'
                  : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(25px) saturate(180%)',
              border: selectedType === type.id
                ? '2px solid rgba(59, 130, 246, 0.3)'
                : '1px solid rgba(0, 0, 0, 0.06)',
              borderRadius: '16px'
            }}
            onMouseEnter={() => setHoveredType(type.id)}
            onMouseLeave={() => setHoveredType(null)}
            onClick={() => onUserTypeSelect(type)}
          >
            <div className="p-8">
              {/* Icon and Header */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-3 rounded-2xl transition-all duration-500 ${
                    selectedType === type.id || hoveredType === type.id
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    transform: selectedType === type.id || hoveredType === type.id ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {type.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {type.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {type.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {type.description}
              </p>

              {/* Key Features */}
              <div className="space-y-3 mb-6">
                {type.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      selectedType === type.id || hoveredType === type.id
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`} />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
                {type.features.length > 3 && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <span className="text-sm text-gray-400">
                      +{type.features.length - 3} more features
                    </span>
                  </div>
                )}
              </div>

              {/* Investment Details */}
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Minimum Investment</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {type.minimumInvestment}
                  </span>
                </div>

                {type.regulatoryNote && (
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      {type.regulatoryNote}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Button
                className={`w-full mt-6 transition-all duration-500 rounded-xl ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                    : hoveredType === type.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  background: selectedType === type.id
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                    : hoveredType === type.id
                      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                      : undefined,
                  transform: hoveredType === type.id ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {selectedType === type.id ? 'Selected' : 'Get Started'}
                  <ArrowRight className={`w-4 h-4 transition-all duration-300 ${
                    hoveredType === type.id || selectedType === type.id ? 'translate-x-1 scale-110' : ''
                  }`} />
                </span>
              </Button>
            </div>

            {/* Selection Indicator */}
            {selectedType === type.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            )}
          </Card>
        ))}
          </div>

          {/* Trust Indicators */}
          <div className={`mt-16 text-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex items-center justify-center gap-8 text-sm" style={{
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SEC Registered</span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>$2.8B+ Assets Under Management</span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Trusted by 15,000+ Investors</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}