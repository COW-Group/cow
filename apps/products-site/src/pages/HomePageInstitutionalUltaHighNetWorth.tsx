import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, Shield, TrendingUp, Building2, Users, Star, CheckCircle, Phone, Globe, Award, BarChart3, Target, Crown } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { HeroBackground } from "../components/hero-background"
import { AuthModal } from "../components/auth-modal"
import { useState, useEffect } from "react"

export default function HomePageInstitutionalUltraHighNetWorth() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const onboardingComplete = searchParams.get('onboarding')
    if (onboardingComplete === 'complete') {
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
      navigate('/home/institutional-ultra-high-net-worth', { replace: true })
    } else {
      // If no onboarding parameters, ensure we have default onboarding data for this page
      const existingData = sessionStorage.getItem('onboardingData')
      if (!existingData) {
        const defaultOnboardingData = {
          classificationId: 'ultra-high-net-worth',
          classificationTitle: 'Ultra High Net Worth',
          minimumInvestment: '$10,000,000',
          userType: 'institutional',
          userTypeTitle: 'Institutional Client'
        }
        sessionStorage.setItem('onboardingData', JSON.stringify(defaultOnboardingData))
      }
    }
  }, [navigate, searchParams])

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
          <Link to="/" className="text-xl font-light tracking-tight" style={{ color: '#1f2937', letterSpacing: '0.02em', fontWeight: '300' }}>
            COW
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full border border-amber-200">
              <Crown className="w-3 h-3 text-amber-600" />
              <span className="text-sm text-amber-700 font-medium">Ultra High Net Worth • Institutional</span>
            </div>
          </div>

          <div className="flex-1" />
          <ProductMenu />
          <CartDropdown />

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setShowAuthModal(true)}>Sign In</Button>
            <Button variant="outline" size="sm" className="rounded-full">Connect Wallet</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <HeroBackground />
        <section className="relative z-10 pt-32 pb-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-full mb-8 border border-amber-200">
              <Crown className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700 font-medium">Ultra High Net Worth Access</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-light mb-8 leading-tight text-white">
              Ultra High Net Worth
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Wealth Management
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/80">
              Comprehensive wealth management with Performance RWA strategies tailored for ultra-high-net-worth institutions
              and family offices. Cyprus master fund structure with $10M+ allocations and bespoke governance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => setShowAuthModal(true)}
              >
                Access UHNW Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl border-white/20 text-white hover:bg-white/10 transition-all duration-300">
                <Phone className="w-5 h-5 mr-2" />
                Private Consultation
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Family Office Services</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                <span>$50B+ AUM Platform</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Qualified Purchaser Status</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* UHNW Features */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-gray-900">Ultra High Net Worth Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              COW's Ultra High Net Worth tier provides comprehensive wealth management solutions
              for institutions and family offices with $10M+ Performance RWA allocations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow border-2 border-amber-100">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Family Office Integration</h3>
              <p className="text-gray-600 mb-4">
                Seamless integration with existing family office structures,
                multi-generational planning, and sophisticated governance frameworks.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Multi-generational strategies</li>
                <li>• Family governance integration</li>
                <li>• Trust structure optimization</li>
                <li>• Legacy planning services</li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-2 border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Bespoke Investment Strategies</h3>
              <p className="text-gray-600 mb-4">
                Highly customized Performance RWA strategies tailored to ultra-high-net-worth
                objectives, risk parameters, and liquidity requirements.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Custom allocation models</li>
                <li>• Liquidity management</li>
                <li>• ESG integration options</li>
                <li>• Alternative strategy access</li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Concierge Service Level</h3>
              <p className="text-gray-600 mb-4">
                White-glove service with dedicated team, 24/7 support,
                and direct access to senior management and investment committee.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Dedicated service team</li>
                <li>• Senior management access</li>
                <li>• 24/7 concierge support</li>
                <li>• Investment committee participation</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Cyprus Master Fund Benefits for UHNW */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-gray-900">Institutional-Grade Tax Optimization</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              COW's Cyprus master fund structure provides ultra-high-net-worth institutions
              with sophisticated tax optimization and regulatory efficiency across international jurisdictions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">CY</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cyprus Master Fund Advantages</h3>
                  <p className="text-gray-600 mb-4">
                    Leverage Cyprus's sophisticated institutional framework with zero capital gains tax,
                    extensive double tax treaty network, and professional fund management infrastructure.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Zero capital gains tax on securities</li>
                    <li>• 70+ comprehensive double tax treaties</li>
                    <li>• EU regulatory harmonization</li>
                    <li>• Professional fund governance standards</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">EE</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Estonia Feeder Fund Innovation</h3>
                  <p className="text-gray-600 mb-4">
                    Access cutting-edge crypto asset regulatory framework through Estonia's
                    MiCA-compliant infrastructure and progressive digital asset legislation.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• MiCA-compliant CASP licensing</li>
                    <li>• Digital asset innovation framework</li>
                    <li>• EU passporting capabilities</li>
                    <li>• Cross-border operational efficiency</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-6">UHNW Tier Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Minimum Investment</span>
                  <span className="font-semibold">$10,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Investor Classification</span>
                  <span className="font-semibold">Qualified Purchaser</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service Level</span>
                  <span className="font-semibold text-amber-600">Concierge</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Family Office Integration</span>
                  <span className="font-semibold text-amber-600">Full Service</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Capital Gains Tax</span>
                    <span className="font-bold text-green-600">0%*</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">*Cyprus master fund structure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Services */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-gray-900">Exclusive UHNW Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ultra-high-net-worth clients receive exclusive access to specialized services
              and direct participation in COW's strategic initiatives and governance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advisory Board Access</h3>
              <p className="text-sm text-gray-600">
                Invitation to participate in COW's strategic advisory board and investment committee decisions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Co-Investment Opportunities</h3>
              <p className="text-sm text-gray-600">
                Exclusive access to co-investment opportunities and pre-launch Performance RWA strategies
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Solutions</h3>
              <p className="text-sm text-gray-600">
                Bespoke Performance RWA solutions designed specifically for unique family office requirements
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Network Access</h3>
              <p className="text-sm text-gray-600">
                Access to COW's global network of ultra-high-net-worth families and institutional partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Access CTA */}
      <section className="py-24 px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-6">Join the Ultra High Net Worth Community</h2>
          <p className="text-xl mb-8 text-white/80">
            Experience unparalleled Performance RWA wealth management with COW's Ultra High Net Worth tier.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => setShowAuthModal(true)}
            >
              Apply for UHNW Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-2xl border-white/20 text-white hover:bg-white/10 transition-all duration-300">
              <Phone className="w-5 h-5 mr-2" />
              Private Consultation
            </Button>
          </div>

          <div className="text-center text-white/60 text-sm">
            <p>Ultra High Net Worth tier requires $10M minimum investment and qualified purchaser status.</p>
            <p className="mt-2">Subject to comprehensive due diligence and investment committee approval.</p>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-12 px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-sm">
            © 2024 COW Group. All rights reserved. |
            <Link to="/privacy" className="hover:text-gray-900 ml-1">Privacy Policy</Link> |
            <Link to="/terms" className="hover:text-gray-900 ml-1">Terms of Service</Link>
          </p>
          <p className="text-xs mt-2 text-gray-500">
            COW Ultra High Net Worth tier designed for qualified purchasers and ultra-high-net-worth institutions.
          </p>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} userType={{ id: 'institutional', title: 'Institutional Client' }} />
    </div>
  )
}