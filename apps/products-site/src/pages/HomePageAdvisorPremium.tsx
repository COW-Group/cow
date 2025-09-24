import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, Shield, TrendingUp, Coins, Wallet, Plane, Star, CheckCircle, Clock, Circle } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { HeroBackground } from "../components/hero-background"
import { AuthModal } from "../components/auth-modal"
import { useState, useEffect } from "react"

export default function HomePageAdvisorPremium() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTechModal, setShowTechModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if user is returning from completed onboarding
    const onboardingComplete = searchParams.get('onboarding')
    if (onboardingComplete === 'complete') {
      // Store onboarding data in sessionStorage for after auth
      const onboardingData = {
        country: searchParams.get('country'),
        countryName: searchParams.get('countryName'),
        currency: searchParams.get('currency'),
        classificationId: searchParams.get('classificationId'),
        classificationTitle: searchParams.get('classificationTitle'),
        minimumInvestment: searchParams.get('minimumInvestment'),
        userType: searchParams.get('userType'),
        userTypeTitle: searchParams.get('userTypeTitle')
      }
      sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))

      // Clean up URL parameters
      navigate('/home/advisor-premium', { replace: true })
    } else {
      // Set default onboarding data for this page
      const defaultOnboardingData = {
        classificationId: 'premium',
        classificationTitle: 'Premium ($100K+)',
        minimumInvestment: '$100,000',
        userType: 'advisor',
        userTypeTitle: 'Financial Advisor'
      }
      sessionStorage.setItem('onboardingData', JSON.stringify(defaultOnboardingData))
    }
  }, [navigate, searchParams])

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation - Square Dark Liquid Glass Container */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div 
          className="px-8 py-4 flex items-center gap-8 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Link to="/" 
            className="text-xl font-light tracking-tight"
            style={{ 
              color: '#1f2937',
              letterSpacing: '0.02em',
              fontWeight: '300'
            }}
          >
            COW
          </Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-900 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px'
              }}
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px',
                color: '#374151'
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-700 transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px',
                color: '#374151'
              }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section - Apple Engineering Precision */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />

        {/* Apple Engineering Content Architecture */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-8">
          {/* Apple Typography Engineering */}
          <h1 
            className="mb-12 text-white"
            style={{
              fontSize: 'clamp(4.5rem, 9vw, 9.5rem)',
              fontWeight: '200',
              letterSpacing: '-0.025em',
              lineHeight: '0.82',
              marginBottom: '3rem',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Cycles of Wealth
          </h1>
          
          {/* Simplified Product Description */}
          <div className="max-w-4xl mx-auto mb-16">
            <p 
              className="text-white"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.4',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)'
              }}
            >
              The world's first performance real world asset tokens backed by gold and optimized assets.
            </p>
            
            {/* Category Creator Data Points */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
              <div className="text-center">
                <div className="text-2xl font-light" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>75%</div>
                <div className="text-sm text-white/70" style={{ letterSpacing: '0.01em' }}>Revenue Share</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-light" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>30-40%</div>
                <div className="text-sm text-white/70" style={{ letterSpacing: '0.01em' }}>Client APY</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-light" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>3</div>
                <div className="text-sm text-white/70" style={{ letterSpacing: '0.01em' }}>Jurisdictions</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-light" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>24/7</div>
                <div className="text-sm text-white/70" style={{ letterSpacing: '0.01em' }}>Transparency</div>
              </div>
            </div>
          </div>
          
          {/* Institutional CTA Framework */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16 max-w-4xl mx-auto">
            {/* Schedule Institutional Consultation */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                letterSpacing: '0.01em',
                color: '#1f2937',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)'
              }}
            >
              <span className="relative flex items-center gap-2">
                Schedule Institutional Consultation
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            {/* Access Performance Methodology */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <span className="relative">
                Access Performance Methodology
              </span>
            </button>
          </div>

          {/* Qualified Investor Notice */}
          <div className="text-center mt-6">
            <p
              className="text-white/60 text-sm"
              style={{
                fontSize: '0.875rem',
                fontWeight: '400',
                letterSpacing: '0.01em'
              }}
            >
              Available to Regulation D 506(c) and Regulation S qualified investors
            </p>
          </div>
        </div>
      </section>

      {/* Democratization Promise - Hero Statement */}
      <section className="py-32 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-gray-900 mb-8"
            style={{
              fontSize: 'clamp(4rem, 8vw, 7rem)',
              fontWeight: '100',
              letterSpacing: '-0.04em',
              lineHeight: '0.9'
            }}
          >
            Technology that democratizes access
            <br />
            <span
              style={{
                fontWeight: '200',
                color: '#374151'
              }}
            >
              to the world's most exclusive
              <br />
              investment opportunities.
            </span>
          </h2>

          <div className="mt-16 grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <div
                className="text-gray-900 mb-3"
                style={{
                  fontSize: '3rem',
                  fontWeight: '100',
                  letterSpacing: '-0.02em',
                  lineHeight: '1'
                }}
              >
                177+
              </div>
              <div
                className="text-gray-500"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Countries with access to
                <br />
                fractional commodity assets
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-gray-900 mb-3"
                style={{
                  fontSize: '3rem',
                  fontWeight: '100',
                  letterSpacing: '-0.02em',
                  lineHeight: '1'
                }}
              >
                81K+
              </div>
              <div
                className="text-gray-500"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Lives changed through
                <br />
                democratized asset ownership
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-gray-900 mb-3"
                style={{
                  fontSize: '3rem',
                  fontWeight: '100',
                  letterSpacing: '-0.02em',
                  lineHeight: '1'
                }}
              >
                $1.3T
              </div>
              <div
                className="text-gray-500"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Projected market size
                <br />
                by 2030
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Dashboard */}
      <section className="py-40 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Apple Minimalism */}
          <div className="text-center mb-32">
            <h2
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0'
              }}
            >
              Performance Superiority
            </h2>
            <p
              className="text-gray-500 max-w-3xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                fontWeight: '200',
                letterSpacing: '0.005em',
                lineHeight: '1.4'
              }}
            >
              Institutional-grade performance metrics establishing COW Group
              as the category leader in Real World Asset optimization.
            </p>
          </div>

          {/* Live Performance Metrics - Ultra Clean Grid */}
          <div className="grid md:grid-cols-3 gap-16 mb-32 max-w-5xl mx-auto">
            {/* Alpha Performance */}
            <div className="text-center">
              <div
                className="text-gray-900 mb-4"
                style={{
                  fontSize: 'clamp(3rem, 5vw, 4rem)',
                  fontWeight: '100',
                  letterSpacing: '-0.02em'
                }}
              >
                +4.6%
              </div>
              <div
                className="text-gray-400 mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase'
                }}
              >
                Alpha vs Passive RWAs
              </div>
              <div
                className="text-gray-600"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '200',
                  letterSpacing: '0.01em'
                }}
              >
                Annualized outperformance
              </div>
            </div>

            {/* Assets Under Management */}
            <div className="text-center">
              <div
                className="text-gray-900 mb-4"
                style={{
                  fontSize: 'clamp(3rem, 5vw, 4rem)',
                  fontWeight: '100',
                  letterSpacing: '-0.02em'
                }}
              >
                $2.1B
              </div>
              <div
                className="text-gray-400 mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase'
                }}
              >
                Assets Under Management
              </div>
              <div
                className="text-gray-600"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '200',
                  letterSpacing: '0.01em'
                }}
              >
                Institutional capital deployed
              </div>
            </div>

            {/* Daily Optimizations */}
            <div className="text-center">
              <div
                className="text-gray-900 mb-4"
                style={{
                  fontSize: 'clamp(3rem, 5vw, 4rem)',
                  fontWeight: '100',
                  letterSpacing: '-0.02em'
                }}
              >
                847
              </div>
              <div
                className="text-gray-400 mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.025em',
                  textTransform: 'uppercase'
                }}
              >
                Daily Optimizations
              </div>
              <div
                className="text-gray-600"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '200',
                  letterSpacing: '0.01em'
                }}
              >
                Algorithmic adjustments
              </div>
            </div>
          </div>
          {/* Performance Comparison Chart - Apple Visual Style */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h3
                className="text-gray-900 mb-6"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: '200',
                  letterSpacing: '-0.015em'
                }}
              >
                Performance Comparison
              </h3>
              <p
                className="text-gray-500 max-w-2xl mx-auto"
                style={{
                  fontSize: '1rem',
                  fontWeight: '200',
                  letterSpacing: '0.005em'
                }}
              >
                COW Performance RWAs deliver measurable outperformance
                versus traditional real world asset strategies.
              </p>
            </div>

            {/* Visual Comparison */}
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Traditional RWA Performance */}
                <div className="text-center">
                  <div
                    className="mb-6 p-12 rounded-2xl border"
                    style={{
                      background: 'rgba(249, 250, 251, 0.8)',
                      borderColor: 'rgba(229, 231, 235, 0.6)',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div
                      className="text-gray-600 mb-4"
                      style={{
                        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                        fontWeight: '100',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      7.2%
                    </div>
                    <div
                      className="text-gray-400"
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '300',
                        letterSpacing: '0.025em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Traditional RWA Returns
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Volatility</span>
                      <span className="text-gray-600 font-light">12.4%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Sharpe Ratio</span>
                      <span className="text-gray-600 font-light">0.58</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Max Drawdown</span>
                      <span className="text-gray-600 font-light">-18.2%</span>
                    </div>
                  </div>
                </div>

                {/* COW Performance RWA */}
                <div className="text-center">
                  <div
                    className="mb-6 p-12 rounded-2xl border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div
                      className="text-gray-900 mb-4"
                      style={{
                        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                        fontWeight: '100',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      15.2%
                    </div>
                    <div
                      className="text-gray-400"
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: '300',
                        letterSpacing: '0.025em',
                        textTransform: 'uppercase'
                      }}
                    >
                      COW Performance RWA
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Volatility</span>
                      <span className="text-gray-900 font-light">8.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Sharpe Ratio</span>
                      <span className="text-gray-900 font-light">1.88</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-light">Max Drawdown</span>
                      <span className="text-gray-900 font-light">-4.3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Gap Visualization */}
              <div className="mt-16 text-center">
                <div
                  className="inline-flex items-center px-8 py-4 rounded-full"
                  style={{
                    background: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <div
                    className="text-gray-900 mr-3"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '200',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    +8.0%
                  </div>
                  <div
                    className="text-gray-500"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '300',
                      letterSpacing: '0.01em'
                    }}
                  >
                    Performance Gap
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Positioning */}
          <div className="text-center max-w-4xl mx-auto">
            <div
              className="text-gray-400 mb-8"
              style={{
                fontSize: '0.75rem',
                fontWeight: '300',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Regulation D 506(c) & Regulation S
            </div>
            <h4
              className="text-gray-900 mb-6"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '200',
                letterSpacing: '-0.01em'
              }}
            >
              Institutional Grade Performance Engineering
            </h4>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{
                fontSize: '1rem',
                fontWeight: '200',
                letterSpacing: '0.005em',
                lineHeight: '1.5'
              }}
            >
              Sophisticated algorithms optimize precious metal reserves and commercial aviation assets,
              delivering superior risk-adjusted returns for qualified institutional and international investors.
            </p>

            {/* Regulatory Compliance Indicators */}
            <div className="flex justify-center items-center mt-12 space-x-12">
              <div className="text-center">
                <div
                  className="text-gray-400 text-xs mb-2"
                  style={{ fontWeight: '300', letterSpacing: '0.025em' }}
                >
                  REGULATION D
                </div>
                <div
                  className="text-gray-600"
                  style={{ fontSize: '0.875rem', fontWeight: '200' }}
                >
                  506(c) Compliant
                </div>
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              <div className="text-center">
                <div
                  className="text-gray-400 text-xs mb-2"
                  style={{ fontWeight: '300', letterSpacing: '0.025em' }}
                >
                  REGULATION S
                </div>
                <div
                  className="text-gray-600"
                  style={{ fontSize: '0.875rem', fontWeight: '200' }}
                >
                  International Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-Style Performance Section */}
      <section className="relative py-32 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Single Focused Message */}
          <div className="text-center mb-32">
            <h2
              className="text-gray-900 mb-8"
              style={{
                fontSize: 'clamp(3.5rem, 7vw, 5rem)',
                fontWeight: '100',
                letterSpacing: '-0.03em',
                lineHeight: '0.95'
              }}
            >
              Institutional performance.
              <br />
              For everyone.
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                lineHeight: '1.6',
                letterSpacing: '0.01em'
              }}
            >
              Technology that democratizes access to the world's most exclusive investment opportunities.
            </p>
          </div>

          {/* Clean Single Statistic */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gray-50 rounded-full">
              <TrendingUp className="w-8 h-8 text-gray-900" strokeWidth={1} />
            </div>
            <div
              className="text-gray-900 mb-4"
              style={{
                fontSize: '4rem',
                fontWeight: '200',
                letterSpacing: '-0.02em',
                lineHeight: '1'
              }}
            >
              15.2%
            </div>
            <p
              className="text-gray-500"
              style={{
                fontSize: '1rem',
                fontWeight: '400',
                letterSpacing: '0.01em'
              }}
            >
              Average annual returns across tokenized assets
            </p>
          </div>
        </div>
      </section>

      {/* Trust Architecture - Institutional Credibility */}
      <section className="py-24 px-8" style={{ background: 'rgba(249, 250, 251, 0.4)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-gray-900 mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '300',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Built for institutions.
              <br />
              Trusted by leaders.
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                lineHeight: '1.6',
                letterSpacing: '0.01em'
              }}
            >
              Institutional-grade compliance and security architecture designed for the world's most sophisticated investors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Regulatory Excellence */}
            <div className="text-center group cursor-pointer">
              <div
                className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-2xl transition-all duration-300 group-hover:bg-gray-200"
              >
                <Shield className="w-8 h-8 text-gray-700" strokeWidth={1} />
              </div>
              <h3
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.01em'
                }}
              >
                Regulatory Excellence
              </h3>
              <p
                className="text-gray-500 mb-6"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                SEC-compliant frameworks across Regulation D 506(c) and Regulation S jurisdictions.
              </p>

              {/* Progressive Disclosure Content */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  SOC 2 Type II Certified
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  Institutional-Grade Custody
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  Multi-Jurisdiction Compliance
                </div>
              </div>
            </div>

            {/* Institutional Validation */}
            <div className="text-center group cursor-pointer">
              <div
                className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-2xl transition-all duration-300 group-hover:bg-gray-200"
              >
                <TrendingUp className="w-8 h-8 text-gray-700" strokeWidth={1} />
              </div>
              <h3
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.01em'
                }}
              >
                Institutional Validation
              </h3>
              <p
                className="text-gray-500 mb-6"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Trusted by pension funds, endowments, and family offices across global markets.
              </p>

              {/* Progressive Disclosure Content */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  $2.1B Institutional AUM
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  Third-Party Audited
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  15+ Major Partners
                </div>
              </div>
            </div>

            {/* Technology Leadership */}
            <div className="text-center group cursor-pointer">
              <div
                className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-100 rounded-2xl transition-all duration-300 group-hover:bg-gray-200"
              >
                <Circle className="w-8 h-8 text-gray-700" strokeWidth={1} />
              </div>
              <h3
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.01em'
                }}
              >
                Technology Leadership
              </h3>
              <p
                className="text-gray-500 mb-6"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Proprietary performance algorithms and enterprise-grade security infrastructure.
              </p>

              {/* Progressive Disclosure Content */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-2">
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  12 Patents Filed
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  Bank-Level Security
                </div>
                <div className="text-sm text-gray-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                  Proprietary Algorithms
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Performance RWAs Revolution - Deep Value Proposition */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-20">
            <h2
              className="text-gray-900 mb-6"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '200',
                letterSpacing: '-0.03em',
                lineHeight: '1.05'
              }}
            >
              Performance RWAs.
              <br />
              <span style={{ fontWeight: '100', color: '#6b7280' }}>
                Beyond tokenization.
              </span>
            </h2>
            <p
              className="text-gray-500 max-w-4xl mx-auto mb-16"
              style={{
                fontSize: '1.25rem',
                fontWeight: '300',
                lineHeight: '1.6',
                letterSpacing: '0.01em'
              }}
            >
              We don't just tokenize assets—we optimize them. Through commodity collateralization,
              AI-driven performance engineering, and advanced financial compounding mechanisms,
              we transform passive holdings into dynamic wealth-generation engines.
            </p>
          </div>

          {/* Three Pillars of Performance RWAs */}
          <div className="grid lg:grid-cols-3 gap-16 mb-24">

            {/* Commodity Collateralization */}
            <div className="text-center">
              <div className="mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-3xl mb-6"
                >
                  <Shield className="w-10 h-10 text-gray-700" strokeWidth={1} />
                </div>
                <h3
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Commodity Collateralization
                </h3>
                <p
                  className="text-gray-500 mb-8"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  Every token is backed by tangible, valuable commodities—gold, precious metals,
                  and strategic resources—providing inherent stability and security that purely
                  digital assets cannot offer.
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">$1.1B+</div>
                    <div className="text-sm text-gray-500">Commodity-backed token market</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">99.8%</div>
                    <div className="text-sm text-gray-500">Collateralization ratio</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI/ML Optimization */}
            <div className="text-center">
              <div className="mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-3xl mb-6"
                >
                  <Circle className="w-10 h-10 text-gray-700" strokeWidth={1} />
                </div>
                <h3
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    letterSpacing: '-0.01em'
                  }}
                >
                  AI/ML Performance Engineering
                </h3>
                <p
                  className="text-gray-500 mb-8"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  Our proprietary algorithms analyze 1,000+ market metrics in real-time,
                  intelligently deploying and optimizing capital across global markets to maximize
                  risk-adjusted returns through world-class financial engineering.
                </p>
              </div>

              {/* AI Performance Stats */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">1,000+</div>
                    <div className="text-sm text-gray-500">Market metrics analyzed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">24/7</div>
                    <div className="text-sm text-gray-500">Optimization protocols</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Compounding */}
            <div className="text-center">
              <div className="mb-8">
                <div
                  className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-3xl mb-6"
                >
                  <TrendingUp className="w-10 h-10 text-gray-700" strokeWidth={1} />
                </div>
                <h3
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Financial Compounding Mechanisms
                </h3>
                <p
                  className="text-gray-500 mb-8"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  Advanced yield generation through strategic commodity trading, lending protocols,
                  and performance optimization—all while preserving your underlying asset ownership
                  and maintaining full fractional control.
                </p>
              </div>

              {/* Compounding Performance */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">9.42%</div>
                    <div className="text-sm text-gray-500">Average RWA yields</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-gray-900 mb-1">100%</div>
                    <div className="text-sm text-gray-500">Asset ownership retained</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Comparison - Before vs After */}
          <div className="bg-gray-50 rounded-3xl p-16">
            <div className="text-center mb-16">
              <h3
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '2rem',
                  fontWeight: '300',
                  letterSpacing: '-0.02em'
                }}
              >
                Performance Before & After
              </h3>
              <p
                className="text-gray-500 max-w-2xl mx-auto"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}
              >
                See the measurable difference Performance RWAs make compared to traditional asset approaches.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Traditional Assets */}
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 border border-gray-200">
                  <h4
                    className="text-gray-600 mb-6"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Traditional Asset Holding
                  </h4>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Return</span>
                      <span className="text-gray-900 font-medium">7.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Volatility</span>
                      <span className="text-gray-900 font-medium">12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Liquidity</span>
                      <span className="text-gray-900 font-medium">Limited</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Optimization</span>
                      <span className="text-gray-900 font-medium">Manual</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Market Access</span>
                      <span className="text-gray-900 font-medium">Business Hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance RWAs */}
              <div className="text-center">
                <div className="bg-gray-900 rounded-2xl p-8 text-white">
                  <h4
                    className="text-white mb-6"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    COW Performance RWAs
                  </h4>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-white/70">Annual Return</span>
                      <span className="text-white font-medium">15.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Volatility</span>
                      <span className="text-white font-medium">8.1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Liquidity</span>
                      <span className="text-white font-medium">24/7 Global</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Optimization</span>
                      <span className="text-white font-medium">AI-Driven</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Market Access</span>
                      <span className="text-white font-medium">24/7/365</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Delta */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-4 border border-gray-200">
                <TrendingUp className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
                <div>
                  <div className="text-2xl font-light text-gray-900">+8.0% additional annual return</div>
                  <div className="text-sm text-gray-500">Through dynamic rebalancing and optimization protocols</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance RWA Transformation Narrative */}
      <section
        className="relative py-32 px-8"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(60px)',
          borderTop: '1px solid rgba(0, 0, 0, 0.04)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* The Problem */}
          <div className="text-center mb-32">
            <div
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.1'
              }}
            >
              The World Is Racing To Tokenize Assets.
              <br />
              <span
                className="text-gray-600"
                style={{ fontWeight: '200' }}
              >
                Everyone's Missing The Real Opportunity.
              </span>
            </div>
            <div
              className="text-gray-700 max-w-4xl mx-auto mb-16"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                lineHeight: '1.4',
                letterSpacing: '0.005em'
              }}
            >
              While the world races to tokenize assets, everyone's missing the real opportunity—
              making those assets perform better. Passive tokenization wastes blockchain's potential.
            </div>

            <div
              className="inline-block px-8 py-3 rounded-full"
              style={{
                background: 'rgba(17, 17, 17, 0.03)',
                border: '1px solid rgba(17, 17, 17, 0.08)'
              }}
            >
              <span
                className="text-gray-600"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                The Problem
              </span>
            </div>
          </div>

          {/* The Insight */}
          <div className="text-center mb-32">
            <div
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.1'
              }}
            >
              We Believe Every Tokenized Asset
              <br />
              <span
                className="text-black"
                style={{ fontWeight: '300' }}
              >
                Should Be An Optimized Asset.
              </span>
            </div>
            <div
              className="text-gray-700 max-w-4xl mx-auto mb-16"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                lineHeight: '1.4',
                letterSpacing: '0.005em'
              }}
            >
              Performance isn't a feature—it's the entire point. Smart contracts enable
              unprecedented asset optimization through dynamic rebalancing, algorithmic management,
              and real-time performance monitoring.
            </div>

            <div
              className="inline-block px-8 py-3 rounded-full"
              style={{
                background: 'rgba(17, 17, 17, 0.05)',
                border: '1px solid rgba(17, 17, 17, 0.12)'
              }}
            >
              <span
                className="text-gray-700"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                The Insight
              </span>
            </div>
          </div>

          {/* Case Study - Performance Comparison */}
          <div className="mb-32">
            <div className="text-center mb-20">
              <h3
                className="text-gray-900 mb-8"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                  fontWeight: '200',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.2'
                }}
              >
                Performance RWA Proof of Concept
              </h3>
              <p
                className="text-gray-600 max-w-3xl mx-auto"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '300',
                  lineHeight: '1.4'
                }}
              >
                Real returns from our optimization protocols demonstrate measurable alpha
                generation across asset classes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div
                className="text-center p-12 rounded-3xl"
                style={{
                  background: 'rgba(243, 244, 246, 0.4)',
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <div
                  className="text-gray-500 mb-6"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  Traditional REIT
                </div>
                <div
                  className="text-gray-700 mb-4"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 4rem)',
                    fontWeight: '100',
                    letterSpacing: '-0.02em'
                  }}
                >
                  7.2%
                </div>
                <div
                  className="text-gray-600"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '300'
                  }}
                >
                  Annual Return
                </div>
              </div>

              <div
                className="text-center p-12 rounded-3xl"
                style={{
                  background: 'rgba(17, 17, 17, 0.02)',
                  border: '1px solid rgba(0, 0, 0, 0.12)'
                }}
              >
                <div
                  className="text-gray-700 mb-6"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  COW Performance RWA
                </div>
                <div
                  className="text-black mb-4"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 4rem)',
                    fontWeight: '200',
                    letterSpacing: '-0.02em'
                  }}
                >
                  15.2%
                </div>
                <div
                  className="text-gray-700"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400'
                  }}
                >
                  Through Dynamic Rebalancing & Optimization Protocols
                </div>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="text-center mb-20">
            <div
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.1'
              }}
            >
              COW Group's Performance Protocols
              <br />
              <span
                className="text-black"
                style={{ fontWeight: '300' }}
              >
                Deliver Measurable Alpha.
              </span>
            </div>
            <div
              className="text-gray-700 max-w-4xl mx-auto mb-16"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                lineHeight: '1.4',
                letterSpacing: '0.005em'
              }}
            >
              Our performance infrastructure transforms passive assets into active wealth generation
              engines. Every protocol is designed for institutional-grade optimization with
              regulatory compliance for both Regulation D 506(c) and Regulation S international investors.
            </div>

            <div
              className="inline-block px-8 py-3 rounded-full"
              style={{
                background: 'rgba(17, 17, 17, 0.08)',
                border: '1px solid rgba(17, 17, 17, 0.16)'
              }}
            >
              <span
                className="text-black"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                The Solution
              </span>
            </div>
          </div>

          {/* Category Creator Statement */}
          <div className="text-center">
            <div
              className="text-gray-900 max-w-4xl mx-auto"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '200',
                letterSpacing: '-0.015em',
                lineHeight: '1.3'
              }}
            >
              Performance RWAs aren't just better than traditional tokenization.
              <br />
              <span
                className="text-black"
                style={{ fontWeight: '300' }}
              >
                They're inevitable.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Pipeline - Pharma R&D Style */}
      <section 
        className="relative py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 220, 0.03) 0%, rgba(242, 184, 64, 0.05) 20%, rgba(240, 114, 13, 0.04) 40%, rgba(45, 74, 107, 0.06) 60%, rgba(59, 130, 246, 0.03) 80%, rgba(0, 0, 0, 0.1) 100%)',
          backdropFilter: 'blur(60px) saturate(180%)',
          borderTop: '1px solid rgba(242, 184, 64, 0.15)',
          borderBottom: '1px solid rgba(45, 74, 107, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '200',
                letterSpacing: '-0.015em',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}
            >
              Investment Development Pipeline
            </h2>
            <p 
              className="text-gray-600 max-w-5xl mx-auto"
              style={{
                fontSize: '19px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5',
                marginBottom: '3rem'
              }}
            >
              From R&D to market launch, our systematic approach ensures rigorous asset evaluation, 
              compliance validation, and performance optimization at every stage.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(242, 184, 64, 0.2)',
                  boxShadow: '0 4px 24px rgba(242, 184, 64, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #f2b840, #f0720d)',
                    boxShadow: '0 4px 16px rgba(242, 184, 64, 0.25)'
                  }}
                >
                  <div className="w-6 h-6 bg-white rounded opacity-90"></div>
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Discovery
                </h3>
                <div className="w-full bg-gray-100 rounded-full h-0.5 mt-4">
                  <div className="bg-gray-400 h-0.5 rounded-full w-full"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Asset identification, due diligence, and initial feasibility analysis with 
                comprehensive market research and regulatory assessment.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(45, 74, 107, 0.2)',
                  boxShadow: '0 4px 24px rgba(45, 74, 107, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #2d4a6b, #3b82f6)',
                    boxShadow: '0 4px 16px rgba(45, 74, 107, 0.25)'
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Development
                </h3>
                <div className="w-full bg-gray-100 rounded-full h-0.5 mt-4">
                  <div className="bg-gray-400 h-0.5 rounded-full w-3/4"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Smart contract development, tokenization architecture, and compliance framework implementation 
                with regulatory submission processes.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(255, 242, 220, 0.3)',
                  boxShadow: '0 4px 24px rgba(251, 191, 36, 0.08)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    boxShadow: '0 4px 16px rgba(251, 191, 36, 0.25)'
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Validation
                </h3>
                <div className="w-full bg-gray-100 rounded-full h-0.5 mt-4">
                  <div className="bg-gray-400 h-0.5 rounded-full w-1/2"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Pilot testing with limited investor groups including performance validation, 
                risk assessment, and operational optimization.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(240, 114, 13, 0.2)',
                  boxShadow: '0 4px 24px rgba(240, 114, 13, 0.08)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #f0720d, #ea580c)',
                    boxShadow: '0 4px 16px rgba(240, 114, 13, 0.25)'
                  }}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Launch
                </h3>
                <div className="w-full bg-gray-100 rounded-full h-0.5 mt-4">
                  <div className="bg-gray-400 h-0.5 rounded-full w-1/4"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Full market launch with institutional distribution and retail accessibility 
                including continuous monitoring and performance reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Ecosystem - Thought Leadership Hub */}
      <section
        className="py-32 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 249, 249, 0.98) 0%, rgba(255, 255, 255, 0.95) 25%, rgba(247, 247, 247, 0.9) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(249, 249, 249, 0.98) 100%)',
          backdropFilter: 'blur(60px) saturate(150%)',
          borderTop: '1px solid rgba(156, 163, 175, 0.15)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="mb-8 text-gray-900"
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: '300',
                letterSpacing: '-0.025em',
                lineHeight: '1.1',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Authority Ecosystem
            </h2>
            <p
              className="text-gray-700 max-w-4xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.2vw, 1.375rem)',
                fontWeight: '400',
                letterSpacing: '0.005em',
                lineHeight: '1.55'
              }}
            >
              Establishing definitive thought leadership in Performance RWAs through intellectual capital,
              institutional research, and strategic market intelligence for qualified investors.
            </p>
          </div>

          {/* Three-Column Authority Grid */}
          <div className="grid lg:grid-cols-3 gap-12 mb-20">

            {/* Latest Research Reports */}
            <div className="space-y-8">
              <div className="pb-4 border-b border-gray-200">
                <h3
                  className="text-xl font-medium text-gray-900 mb-2"
                  style={{
                    letterSpacing: '-0.01em',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  Latest Research Reports
                </h3>
                <p className="text-sm text-gray-600 font-light">Premium institutional intelligence</p>
              </div>

              {/* Featured Report */}
              <div
                className="p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer group"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="mb-6">
                  <div className="w-full h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-light text-gray-400 mb-1">96.6B</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Performance Gap</div>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3 leading-tight">
                  The Performance Gap: Why Passive RWA Tokenization Leaves $96.6B on the Table
                </h4>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div>COW Research Institute</div>
                  <div>Q1 2025 • 47 pages</div>
                </div>

                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  Comprehensive analysis revealing how passive tokenization strategies underperform
                  by 15.3x compared to algorithmic performance optimization frameworks.
                </p>

                {/* Download Gate */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    className="w-full py-3 px-4 text-sm font-medium text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 group-hover:border-gray-400"
                    style={{ letterSpacing: '0.01em' }}
                  >
                    Download Report • Qualified Investors
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Regulation D 506(c) verification required
                  </p>
                </div>
              </div>

              {/* Additional Reports */}
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-md hover:border-gray-200 transition-colors duration-200 cursor-pointer">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Multi-Asset Correlation Analysis</h5>
                  <p className="text-xs text-gray-600 mb-2">Institutional Framework Series • Q4 2024</p>
                  <p className="text-xs text-gray-700">Risk optimization across commodity-aviation hybrid structures</p>
                </div>

                <div className="p-4 border border-gray-100 rounded-md hover:border-gray-200 transition-colors duration-200 cursor-pointer">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Regulatory Landscape 2025</h5>
                  <p className="text-xs text-gray-600 mb-2">Compliance Intelligence • Q1 2025</p>
                  <p className="text-xs text-gray-700">Global regulatory framework analysis for Performance RWAs</p>
                </div>
              </div>
            </div>

            {/* Executive Speaking Engagements */}
            <div className="space-y-8">
              <div className="pb-4 border-b border-gray-200">
                <h3
                  className="text-xl font-medium text-gray-900 mb-2"
                  style={{
                    letterSpacing: '-0.01em',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  Executive Speaking
                </h3>
                <p className="text-sm text-gray-600 font-light">Industry leadership presence</p>
              </div>

              {/* Featured Speaking Engagement */}
              <div
                className="p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="mb-6">
                  <div className="w-full h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Keynote</div>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3 leading-tight">
                  COW Group CEO Presenting at Institutional Investor Summit 2024
                </h4>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div>New York • December 12, 2024</div>
                  <div>Keynote: "Performance RWA Architecture"</div>
                </div>

                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  Presenting breakthrough research on algorithmic optimization frameworks to 450+
                  institutional allocators, pension funds, and family offices.
                </p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Expected Attendance: 450+</span>
                  <span className="font-medium text-gray-900">RSVP Required</span>
                </div>
              </div>

              {/* Upcoming Engagements */}
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Alternative Investment Conference</h5>
                  <p className="text-xs text-gray-600 mb-2">London • Q1 2025 • Panel Discussion</p>
                  <p className="text-xs text-gray-700">"Future of Tokenized Asset Performance"</p>
                </div>

                <div className="p-4 border border-gray-100 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Endowment Investment Summit</h5>
                  <p className="text-xs text-gray-600 mb-2">Boston • Q2 2025 • Fireside Chat</p>
                  <p className="text-xs text-gray-700">"Institutional Adoption of Performance RWAs"</p>
                </div>
              </div>
            </div>

            {/* Media Coverage */}
            <div className="space-y-8">
              <div className="pb-4 border-b border-gray-200">
                <h3
                  className="text-xl font-medium text-gray-900 mb-2"
                  style={{
                    letterSpacing: '-0.01em',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  Media Coverage
                </h3>
                <p className="text-sm text-gray-600 font-light">Institutional recognition</p>
              </div>

              {/* Featured Coverage */}
              <div
                className="p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="mb-6">
                  <div className="w-full h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-light text-gray-700 mb-1">Institutional Investor</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Feature Article</div>
                    </div>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3 leading-tight">
                  "The Future of Performance RWAs: COW Group's Algorithmic Approach"
                </h4>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <div>Institutional Investor Magazine</div>
                  <div>December 2024 Issue • Cover Story</div>
                </div>

                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  In-depth analysis of COW Group's pioneering approach to performance optimization
                  in tokenized real-world assets, featuring exclusive data and institutional testimonials.
                </p>

                <div className="text-xs text-gray-600">
                  <span className="font-medium text-gray-900">6-page feature</span> • Print circulation: 47,000+
                </div>
              </div>

              {/* Additional Coverage */}
              <div className="space-y-4">
                <div className="p-4 border border-gray-100 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Pension & Investments</h5>
                  <p className="text-xs text-gray-600 mb-2">November 2024 • Market Analysis</p>
                  <p className="text-xs text-gray-700">"Performance RWAs Gain Institutional Traction"</p>
                </div>

                <div className="p-4 border border-gray-100 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Family Office Magazine</h5>
                  <p className="text-xs text-gray-600 mb-2">October 2024 • Technology Focus</p>
                  <p className="text-xs text-gray-700">"Algorithmic Asset Optimization: The COW Model"</p>
                </div>

                <div className="p-4 border border-gray-100 rounded-md">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Alternative Investment News</h5>
                  <p className="text-xs text-gray-600 mb-2">September 2024 • Innovation Series</p>
                  <p className="text-xs text-gray-700">"Tokenization Meets Performance: A New Paradigm"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Authority Metrics Bar */}
          <div
            className="p-8 rounded-lg border border-gray-200"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(25px)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-light text-gray-900 mb-2">47,000+</div>
                <div className="text-sm text-gray-600">Institutional Readers</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-2">12</div>
                <div className="text-sm text-gray-600">Research Publications</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-2">8</div>
                <div className="text-sm text-gray-600">Speaking Engagements</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-2">23</div>
                <div className="text-sm text-gray-600">Media Features</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Preview */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Development Milestones</h2>
            <p className="text-gray-500 text-lg">
              Track our progress in building a global ecosystem for tokenized assets.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(242, 184, 64, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(242, 184, 64, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(242, 184, 64, 0.3), rgba(245, 158, 11, 0.2))',
                      boxShadow: '0 4px 16px rgba(242, 184, 64, 0.25)'
                    }}
                  >
                    <Shield className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '300',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.2'
                    }}
                  >
                    AuSIRI Milestones
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Secured 1,000 oz gold reserves (Q4 2024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Implementing AI-driven retail cycle optimization (Q2 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Circle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Targeting 25% APY by Q1 2026</span>
                  </div>
                </div>
                <Link to="/ausiri" className="mt-6 inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors duration-300">
                  <span style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>See All Milestones</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div 
              className="rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(240, 114, 13, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(240, 114, 13, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(240, 114, 13, 0.3), rgba(239, 68, 68, 0.2))',
                      boxShadow: '0 4px 16px rgba(240, 114, 13, 0.25)'
                    }}
                  >
                    <Plane className="h-6 w-6 text-slate-600" />
                  </div>
                  <h3 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '300',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.2'
                    }}
                  >
                    AuAERO Milestones
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Launched 2 A380 and 20 A320-321 XLR planes (Q1 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Securing 50 UDAN routes in India (Q2 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Circle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Targeting top 10 airline provider by 2034</span>
                  </div>
                </div>
                <Link to="/auaero" className="mt-6 inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors duration-300">
                  <span style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>See All Milestones</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity & Performance */}
      <section
        className="py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(251, 248, 240, 0.8) 25%, rgba(255, 255, 255, 0.9) 50%, rgba(251, 248, 240, 0.8) 75%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(40px) saturate(140%)',
          borderTop: '1px solid rgba(245, 158, 11, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4 text-gray-900"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '200',
                letterSpacing: '-0.015em',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}
            >
              Market Opportunity & Competitive Advantage
            </h2>
            <p
              className="text-slate-600 max-w-4xl mx-auto"
              style={{
                fontSize: '19px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5',
                marginBottom: '2rem'
              }}
            >
              Performance Asset Engineering addresses a $2.0T tokenization market through systematic optimization of real-world assets.
              Proprietary algorithms deliver measurably superior risk-adjusted returns compared to traditional asset management approaches.
            </p>

            {/* Investment Thesis */}
            <div className="max-w-5xl mx-auto mb-12 p-8 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(203, 213, 225, 0.4)',
              boxShadow: '0 4px 16px rgba(51, 65, 85, 0.05)'
            }}>
              <div className="text-center">
                <h3 className="text-2xl font-light text-slate-900 mb-4">Investment Thesis</h3>
                <p className="text-lg text-slate-700 font-light mb-4" style={{ letterSpacing: '0.01em', lineHeight: '1.6' }}>
                  Institutional investors allocating 7-9% of portfolios to tokenized assets by 2027. Performance optimization
                  creates defensible competitive moats in commodity digitization through algorithmic enhancement capabilities.
                </p>
                <div className="text-slate-600 font-medium">Market Size: $140B+ Performance Asset Opportunity</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(245, 158, 11, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                className="text-4xl font-light mb-3"
                style={{
                  color: 'rgb(245, 158, 11)',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                25%
              </div>
              <h4
                className="text-lg font-light mb-2 text-slate-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Target IRR
              </h4>
              <p
                className="text-slate-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Institutional-grade performance yield
              </p>
            </div>
            <div
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(251, 191, 36, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                className="text-4xl font-light mb-3"
                style={{
                  color: 'rgb(251, 191, 36)',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                $50M
              </div>
              <h4
                className="text-lg font-light mb-2 text-slate-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Target AUM
              </h4>
              <p
                className="text-slate-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Initial fund raising target
              </p>
            </div>
            <div
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(245, 158, 11, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                className="text-4xl font-light mb-3"
                style={{
                  color: 'rgb(245, 158, 11)',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                3
              </div>
              <h4
                className="text-lg font-light mb-2 text-slate-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Jurisdictions
              </h4>
              <p
                className="text-slate-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Multi-regulatory compliance framework
              </p>
            </div>

            <div
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(251, 191, 36, 0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(251, 191, 36, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div
                className="text-4xl font-light mb-3"
                style={{
                  color: 'rgb(245, 158, 11)',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                AAA
              </div>
              <h4
                className="text-lg font-light mb-2 text-slate-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Compliance
              </h4>
              <p
                className="text-slate-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Investment-grade regulatory standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Investment Excellence - Investor Routing */}
      <section className="py-32 px-8" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-20">
            <h2
              className="text-gray-900 mb-6"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '200',
                letterSpacing: '-0.03em',
                lineHeight: '1.05'
              }}
            >
              Built for Investment Excellence
            </h2>
            <p
              className="text-gray-500 max-w-4xl mx-auto mb-8"
              style={{
                fontSize: '1.25rem',
                fontWeight: '300',
                lineHeight: '1.6',
                letterSpacing: '0.01em'
              }}
            >
              Partnering with world-leading industry veterans through our vertical partner model,
              we bring together decades of financial engineering expertise to deliver institutional-grade
              performance across global markets.
            </p>

            {/* Global Regulatory Framework */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-5xl mx-auto mb-16">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3
                    className="text-gray-900 mb-4"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    European Operations
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">Licensed in Cyprus (CySEC)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">Licensed in Estonia (FIU)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">Passporting to Luxembourg for public trading</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3
                    className="text-gray-900 mb-4"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    US Operations
                  </h3>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">NYSE listing preparation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">NASDAQ simultaneous listing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">SEC compliance framework</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Investor Pathways */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Institutional Investors */}
            <div className="group">
              <div
                className="bg-white rounded-3xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  height: '100%'
                }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-gray-900 mb-3"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Institutional Investors
                  </h3>
                  <p
                    className="text-gray-500 mb-6"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.6'
                    }}
                  >
                    Pension funds, endowments, family offices, and sophisticated institutions
                    seeking superior risk-adjusted returns through Performance RWAs.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Minimum Investment</span>
                    <span className="text-gray-900 font-medium">$10M+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Classes</span>
                    <span className="text-gray-900 font-medium">Full Portfolio</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customization</span>
                    <span className="text-gray-900 font-medium">Bespoke Solutions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reporting</span>
                    <span className="text-gray-900 font-medium">Institutional Grade</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium transition-all duration-300 hover:bg-gray-800"
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Explore Institutional Access
                </button>
              </div>
            </div>

            {/* Private Investors */}
            <div className="group">
              <div
                className="bg-white rounded-3xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  height: '100%'
                }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                    <Shield className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-gray-900 mb-3"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Private Investors
                  </h3>
                  <p
                    className="text-gray-500 mb-6"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.6'
                    }}
                  >
                    High-net-worth individuals and qualified investors seeking direct access
                    to Performance RWA strategies with professional management.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Minimum Investment</span>
                    <span className="text-gray-900 font-medium">$100K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Classes</span>
                    <span className="text-gray-900 font-medium">Core Selection</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customization</span>
                    <span className="text-gray-900 font-medium">Semi-Custom</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reporting</span>
                    <span className="text-gray-900 font-medium">Professional</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200"
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Explore Private Access
                </button>
              </div>
            </div>

            {/* Retail Investors */}
            <div className="group">
              <div
                className="bg-white rounded-3xl p-8 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  height: '100%'
                }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
                    <Circle className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <h3
                    className="text-gray-900 mb-3"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '500',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    Retail Investors
                  </h3>
                  <p
                    className="text-gray-500 mb-6"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.6'
                    }}
                  >
                    Individual investors seeking fractional access to commodity-backed assets
                    with institutional-level performance optimization.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Minimum Investment</span>
                    <span className="text-gray-900 font-medium">$1K+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Classes</span>
                    <span className="text-gray-900 font-medium">Diversified Funds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customization</span>
                    <span className="text-gray-900 font-medium">Standard Options</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reporting</span>
                    <span className="text-gray-900 font-medium">Comprehensive</span>
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200"
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Explore Retail Access
                </button>
              </div>
            </div>
          </div>

          {/* Democratization Impact Statement */}
          <div className="text-center mt-20">
            <div className="max-w-4xl mx-auto">
              <p
                className="text-gray-600 mb-8"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                <strong>Changing lives of the commonest people</strong> by providing access to fractional
                real-world commodity-based assets for security, stabilization, and performance—leveraging
                retail possibilities on commodities placed as collateral without disturbing investor asset ownership.
              </p>
              <p
                className="text-gray-500"
                style={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Leveraging the world's most advanced technology and financial engineering across
                the global landscape of crypto instruments registration, licensing, and tradeability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Institutional Engagement */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-gray-900 mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '300',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
          >
            Ready to outperform.
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto mb-16"
            style={{
              fontSize: '1.125rem',
              fontWeight: '400',
              lineHeight: '1.6',
              letterSpacing: '0.01em'
            }}
          >
            Choose your engagement path for institutional-grade Performance RWA access.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Schedule Institutional Consultation */}
            <div className="group">
              <button
                className="w-full p-8 text-left transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-2xl"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-900 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-gray-900 mb-2"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Schedule Consultation
                </h3>
                <p
                  className="text-gray-500 mb-4"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '400',
                    lineHeight: '1.5'
                  }}
                >
                  Direct access to institutional specialists for large allocators and family offices.
                </p>
                <div className="text-sm text-gray-400">
                  For $10M+ allocations
                </div>
              </button>
            </div>

            {/* Access Performance Methodology */}
            <div className="group">
              <button
                className="w-full p-8 text-left transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-2xl"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-900 rounded-xl">
                  <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-gray-900 mb-2"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Performance Methodology
                </h3>
                <p
                  className="text-gray-500 mb-4"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '400',
                    lineHeight: '1.5'
                  }}
                >
                  Technical deep-dive into algorithmic optimization protocols and risk management.
                </p>
                <div className="text-sm text-gray-400">
                  For technical evaluation
                </div>
              </button>
            </div>

            {/* Review Quarterly Performance Report */}
            <div className="group">
              <button
                className="w-full p-8 text-left transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-2xl"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gray-900 rounded-xl">
                  <Circle className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-gray-900 mb-2"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Quarterly Performance Report
                </h3>
                <p
                  className="text-gray-500 mb-4"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '400',
                    lineHeight: '1.5'
                  }}
                >
                  Comprehensive performance analytics and risk-adjusted return documentation.
                </p>
                <div className="text-sm text-gray-400">
                  For data-driven validation
                </div>
              </button>
            </div>
          </div>

          {/* Regulatory Compliance Notice */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p
              className="text-gray-400 text-sm max-w-3xl mx-auto"
              style={{
                fontSize: '0.875rem',
                fontWeight: '400',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}
            >
              Access restricted to investors meeting Regulation D 506(c) accredited investor requirements
              and Regulation S non-US persons. Performance data represents historical results and does not
              guarantee future performance. All investments carry risk of loss.
            </p>
          </div>
        </div>
      </section>

      {/* Sophisticated Securities Platform Footer */}
      <footer 
        className="relative py-16 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.95) 25%, rgba(251, 246, 236, 0.92) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(40px) saturate(140%)',
          borderTop: '1px solid rgba(245, 158, 11, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Footer Navigation */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Products
              </h4>
              <ul className="space-y-3">
                <li><Link to="/ausiri" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>AuSIRI</Link></li>
                <li><Link to="/auaero" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>AuAERO</Link></li>
                <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>All Products</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Legal
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Form CRS</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Business Continuity</a></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Support
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Investor Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Regulatory Inquiries</a></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Company
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>About COW</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Leadership</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Newsroom</a></li>
              </ul>
            </div>
          </div>
          
          {/* Regulatory Disclosures */}
          <div 
            className="border-t pt-8 mb-8"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div className="space-y-6">
              {/* Primary Risk Disclosure */}
              <div 
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(245, 158, 11, 0.1)'
                }}
              >
                <h5 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em'
                  }}
                >
                  Investment Risk Disclosure
                </h5>
                <p 
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    lineHeight: '1.6'
                  }}
                >
                  <strong>Investing involves risk, including possible loss of principal.</strong> Real World Asset (RWA) tokens involve 
                  substantial risk and may not be suitable for all investors. Past performance does not guarantee future results. 
                  You will pay fees and costs whether you make or lose money on your investments. Fees and costs will reduce 
                  any amount of money you make on your investments over time.
                </p>
              </div>
              
              {/* Regulatory Registration */}
              <div 
                className="grid md:grid-cols-2 gap-6"
              >
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(245, 158, 11, 0.08)'
                  }}
                >
                  <h6 
                    className="text-gray-900 mb-2"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    Regulatory Information
                  </h6>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    COW Securities LLC is registered with the Securities and Exchange Commission (SEC) as an investment adviser 
                    under the Investment Advisers Act of 1940. Registration does not imply endorsement by the SEC.
                  </p>
                </div>
                
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(245, 158, 11, 0.08)'
                  }}
                >
                  <h6 
                    className="text-gray-900 mb-2"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    International Compliance
                  </h6>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    Licensed in Cyprus (CySEC), Estonia (FIU), with passporting to Luxembourg for public listings. 
                    Offerings made pursuant to Regulation D 506(c) and Regulation S frameworks.
                  </p>
                </div>
              </div>
              
              {/* Additional Disclosures */}
              <div 
                className="text-gray-600"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  letterSpacing: '0.01em'
                }}
              >
                <p className="mb-2">
                  <strong>Important Information:</strong> This website is for informational purposes only and does not constitute 
                  an offer to sell or a solicitation of an offer to buy any securities. Any such offer or solicitation will be made 
                  only through definitive offering documents. Potential investors should read all offering materials carefully before investing.
                </p>
                <p className="mb-2">
                  Securities offered through COW Securities LLC. Member FINRA/SIPC. Advisory services offered through 
                  COW Investment Advisors LLC, a SEC-registered investment adviser. Please see our 
                  <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors"> Form CRS </a> 
                  for important information about our services and fees.
                </p>
                <p>
                  For complaints or regulatory inquiries, contact: compliance@cow.com | FINRA BrokerCheck: 
                  <a href="https://brokercheck.finra.org" className="text-orange-600 hover:text-orange-700 transition-colors"> brokercheck.finra.org</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Copyright and Final Information */}
          <div 
            className="flex flex-col md:flex-row justify-between items-center pt-6 border-t"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div 
              className="text-gray-600 mb-4 md:mb-0"
              style={{
                fontSize: '0.8rem',
                fontWeight: '400'
              }}
            >
              © 2025 COW Group. All rights reserved. 
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Accessibility
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Cookie Policy
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}