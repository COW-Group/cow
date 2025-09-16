import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, Shield, TrendingUp, Coins, Wallet, Plane, Star, CheckCircle, Clock, Circle, Phone, Calendar, ChevronLeft } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { HeroBackground } from "../components/hero-background"
import { AuthModal } from "../components/auth-modal"
import { UserTypeSelector, UserType } from "../components/user-type-selector"
import { DefaultHero, IndividualHero, AdvisorHero, InstitutionalHero } from "../components/hero-sections"
import { useState, useEffect } from "react"

type ViewState = 'default' | 'user-selection' | 'personalized'

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTechModal, setShowTechModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [viewState, setViewState] = useState<ViewState>('default')
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    setViewState('personalized')
  }

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const handleScheduleCall = () => {
    // Implement scheduling logic based on user type
    console.log('Schedule call for:', selectedUserType?.id)
  }

  const handleBackToSelection = () => {
    setViewState('user-selection')
    setSelectedUserType(null)
  }

  const renderHeroSection = () => {
    if (viewState === 'default') {
      return <DefaultHero onSelectUserType={() => setViewState('user-selection')} />
    }

    if (viewState === 'user-selection') {
      return (
        <section className="py-32 px-8 bg-gray-50">
          <UserTypeSelector
            onUserTypeSelect={handleUserTypeSelect}
            selectedType={selectedUserType?.id}
          />
        </section>
      )
    }

    if (viewState === 'personalized' && selectedUserType) {
      switch (selectedUserType.id) {
        case 'individual':
          return <IndividualHero onGetStarted={handleGetStarted} onScheduleCall={handleScheduleCall} />
        case 'advisor':
          return <AdvisorHero onGetStarted={handleGetStarted} onScheduleCall={handleScheduleCall} />
        case 'institutional':
          return <InstitutionalHero onGetStarted={handleGetStarted} onScheduleCall={handleScheduleCall} />
        default:
          return <DefaultHero onSelectUserType={() => setViewState('user-selection')} />
      }
    }

    return <DefaultHero onSelectUserType={() => setViewState('user-selection')} />
  }

  const getPersonalizedContent = () => {
    if (!selectedUserType) return null

    switch (selectedUserType.id) {
      case 'individual':
        return (
          <section className="py-32 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light mb-6 text-gray-900">
                  Your Personal Wealth Journey
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We understand that building wealth is personal. Our platform adapts to your goals,
                  risk tolerance, and investment timeline.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Portfolio Optimization</h3>
                  <p className="text-gray-600 mb-4">
                    AI-driven allocation recommendations based on your risk profile and market conditions.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Dynamic rebalancing</li>
                    <li>• Tax-loss harvesting</li>
                    <li>• Real-time monitoring</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Wealth Protection</h3>
                  <p className="text-gray-600 mb-4">
                    Secure storage and insurance coverage for your precious metals investments.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• $100M insurance coverage</li>
                    <li>• Segregated storage</li>
                    <li>• Audit transparency</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personal Advisor</h3>
                  <p className="text-gray-600 mb-4">
                    Dedicated wealth advisor providing personalized guidance and market insights.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li>• Quarterly reviews</li>
                    <li>• 24/7 support access</li>
                    <li>• Custom strategies</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
        )

      case 'advisor':
        return (
          <section className="py-32 px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light mb-6 text-gray-900">
                  Scale Your Advisory Practice
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive platform tools designed specifically for financial advisors
                  managing client precious metals allocations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Platform Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Multi-Client Dashboard</h4>
                        <p className="text-gray-600 text-sm">Manage all client portfolios from a single interface</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">White-Label Options</h4>
                        <p className="text-gray-600 text-sm">Brand the platform with your firm's identity</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Compliance Tools</h4>
                        <p className="text-gray-600 text-sm">Built-in compliance reporting and audit trails</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-6">Revenue Opportunity</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Management Fee Share</span>
                      <span className="font-semibold">50-75%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Setup Fees</span>
                      <span className="font-semibold">0.25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Marketing Support</span>
                      <span className="font-semibold">Included</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Est. Annual Revenue*</span>
                        <span className="font-bold text-green-600">$75K - $200K</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">*Based on $10M client AUM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )

      case 'institutional':
        return (
          <section className="py-32 px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-light mb-6 text-gray-900">
                  Institutional Excellence
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sophisticated precious metals strategies with institutional-grade execution,
                  reporting, and risk management capabilities.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">$10M+</div>
                  <div className="text-sm text-gray-600">Minimum Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">125+</div>
                  <div className="text-sm text-gray-600">Institutional Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">15yrs</div>
                  <div className="text-sm text-gray-600">Market Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-gray-900 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Platform Uptime</div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-6 text-center">Institutional Services</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Custom Mandates</h4>
                    <p className="text-sm text-gray-600">Tailored investment strategies aligned with your specific objectives and constraints</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Prime Brokerage</h4>
                    <p className="text-sm text-gray-600">Direct market access with competitive execution and settlement services</p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-medium mb-2">Risk Analytics</h4>
                    <p className="text-sm text-gray-600">Comprehensive risk modeling and scenario analysis capabilities</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
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
          {/* Back Button for Personalized View */}
          {viewState === 'personalized' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSelection}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}

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

          {/* User Type Indicator */}
          {selectedUserType && viewState === 'personalized' && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm text-blue-700 font-medium">
                {selectedUserType.title}
              </span>
            </div>
          )}

          <div className="flex-1" />

          <ProductMenu />
          <CartDropdown />

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-900 transition-all duration-300"
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
              onClick={() => setShowAuthModal(true)}
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

      {/* Hero Section with Background */}
      <div className="relative">
        <HeroBackground />
        {renderHeroSection()}
      </div>

      {/* Personalized Content */}
      {viewState === 'personalized' && getPersonalizedContent()}

      {/* Universal Trust Section - Only show in default or personalized view */}
      {viewState !== 'user-selection' && (
        <section className="py-24 px-8 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-12">
              Trusted by Leading Organizations Worldwide
            </h2>

            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-2xl font-light mb-2">$2.8B+</div>
                <div className="text-sm text-gray-400">Assets Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light mb-2">15,000+</div>
                <div className="text-sm text-gray-400">Global Investors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Platform Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light mb-2">24/7</div>
                <div className="text-sm text-gray-400">Market Access</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SEC Registered</span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>FINRA Member</span>
              </div>
              <div>•</div>
              <span>SIPC Protected</span>
              <div>•</div>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-sm">
            © 2024 COW Group. All rights reserved. |
            <Link to="/privacy" className="hover:text-gray-900 ml-1">Privacy Policy</Link> |
            <Link to="/terms" className="hover:text-gray-900 ml-1">Terms of Service</Link>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Investment advisory services offered through COW Investment Advisors, LLC, a registered investment advisor.
            Past performance does not guarantee future results.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        userType={selectedUserType}
      />
    </div>
  )
}