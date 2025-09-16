import { Button } from "./ui/button"
import { ArrowRight, TrendingUp, Shield, Users, Building2, User, Briefcase, Phone, Calendar, Download } from "lucide-react"
import { UserType } from "./user-type-selector"
import { useState, useEffect } from "react"

interface HeroSectionProps {
  userType: UserType
  onGetStarted: () => void
  onScheduleCall?: () => void
}

export function IndividualHero({ onGetStarted, onScheduleCall }: { onGetStarted: () => void, onScheduleCall: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className={`relative z-10 text-center max-w-6xl mx-auto px-8 transition-all duration-1200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-light mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              color: '#1e40af',
              backdropFilter: 'blur(20px)',
              letterSpacing: '0.02em'
            }}
          >
            <User className="w-4 h-4" />
            Personal Wealth Management
          </div>

          <h1
            className={`text-6xl md:text-7xl font-light mb-8 leading-tight transition-all duration-900 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.01em',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.1'
            }}
          >
            Build Lasting Wealth<br />
            With Precious Metals
          </h1>

          <p className={`text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 transition-all duration-900 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.01em',
              lineHeight: '1.6'
            }}
          >
            Access institutional-grade precious metals investments with personalized guidance.
            Start building your portfolio with as little as $10,000 and benefit from dedicated
            wealth advisor support.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className={`flex items-center justify-center gap-12 mb-16 text-white transition-all duration-900 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">12.4%</div>
            <div className="text-sm opacity-80">5-Year Return</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">$50K</div>
            <div className="text-sm opacity-80">Avg. Portfolio</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">5,200+</div>
            <div className="text-sm opacity-80">Individual Clients</div>
          </div>
        </div>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-900 delay-1100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-10 py-5 rounded-full text-white font-light text-lg shadow-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.01em'
            }}
          >
            Start Your Portfolio
            <ArrowRight className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onScheduleCall}
            className="px-10 py-5 rounded-full text-white hover:bg-white/10 font-light text-lg transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              letterSpacing: '0.01em'
            }}
          >
            <Phone className="mr-3 w-5 h-5" />
            Schedule Consultation
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 text-sm text-white/70 transition-all duration-900 delay-1300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex items-center justify-center gap-8 font-light" style={{ letterSpacing: '0.02em' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 opacity-70" />
              <span>FDIC Insured</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 opacity-70" />
              <span>SEC Regulated</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span>Personal Advisor Included</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdvisorHero({ onGetStarted, onScheduleCall }: { onGetStarted: () => void, onScheduleCall: () => void }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            Financial Advisor Platform
          </div>

          <h1
            className="text-6xl font-light mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em'
            }}
          >
            Scale Your Practice<br />
            With Precious Metals
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Comprehensive portfolio management tools and white-label solutions for managing
            client precious metals allocations at scale. Dedicated support for RIAs and
            independent advisors.
          </p>
        </div>

        {/* Advisor-Specific Metrics */}
        <div className="flex items-center justify-center gap-12 mb-12 text-white">
          <div className="text-center">
            <div className="text-2xl font-light mb-1">850+</div>
            <div className="text-sm opacity-80">Advisor Partners</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">$180M</div>
            <div className="text-sm opacity-80">Platform AUM</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">24/7</div>
            <div className="text-sm opacity-80">Client Support</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Request Platform Demo
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onScheduleCall}
            className="px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 font-medium text-lg transition-all duration-300"
          >
            <Calendar className="mr-2 w-5 h-5" />
            Schedule Partnership Call
          </Button>
        </div>

        {/* Advisor Benefits */}
        <div className="mt-12 text-sm text-white/80">
          <div className="flex items-center justify-center gap-6">
            <span>White-Label Available</span>
            <div>•</div>
            <span>Revenue Sharing</span>
            <div>•</div>
            <span>Compliance Support</span>
            <div>•</div>
            <span>Marketing Co-op</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InstitutionalHero({ onGetStarted, onScheduleCall }: { onGetStarted: () => void, onScheduleCall: () => void }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-700 text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Institutional Asset Management
          </div>

          <h1
            className="text-6xl font-light mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em'
            }}
          >
            Institutional-Grade<br />
            Precious Metals Solutions
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Sophisticated precious metals strategies for pension funds, endowments, family offices,
            and corporate treasuries. Custom mandates with dedicated institutional support and
            prime brokerage services.
          </p>
        </div>

        {/* Institutional Metrics */}
        <div className="flex items-center justify-center gap-12 mb-12 text-white">
          <div className="text-center">
            <div className="text-2xl font-light mb-1">$2.8B+</div>
            <div className="text-sm opacity-80">Assets Under Management</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">125+</div>
            <div className="text-sm opacity-80">Institutional Clients</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-2xl font-light mb-1">15yrs</div>
            <div className="text-sm opacity-80">Market Experience</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Request Institutional Access
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onScheduleCall}
            className="px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 font-medium text-lg transition-all duration-300"
          >
            <Calendar className="mr-2 w-5 h-5" />
            Schedule Institutional Review
          </Button>
        </div>

        {/* Institutional Credentials */}
        <div className="mt-12">
          <div className="text-sm text-white/80 mb-4">
            Trusted by leading institutions worldwide
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-white/60">
            <span>Pension Funds</span>
            <div>•</div>
            <span>University Endowments</span>
            <div>•</div>
            <span>Family Offices</span>
            <div>•</div>
            <span>Corporate Treasuries</span>
            <div>•</div>
            <span>Sovereign Wealth Funds</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DefaultHero({ onSelectUserType }: { onSelectUserType: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Sophisticated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className={`relative z-10 text-center max-w-7xl mx-auto px-8 transition-all duration-1500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}>
        <div className="mb-12">
          <div className={`mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-8" />
            <div className="text-sm text-gray-500 font-light tracking-widest uppercase mb-8">
              Welcome to the Future
            </div>
          </div>

          <h1
            className={`text-7xl md:text-8xl font-light mb-8 leading-tight transition-all duration-1200 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 30%, #7c3aed 70%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.05'
            }}
          >
            The Future of<br />
            Precious Metals Investment
          </h1>

          <p className={`text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-16 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: '300',
              letterSpacing: '0.005em',
              lineHeight: '1.5'
            }}
          >
            Professional-grade precious metals solutions tailored to your investment sophistication.
            From individual portfolios to institutional mandates.
          </p>
        </div>

        {/* Universal Metrics */}
        <div className={`flex items-center justify-center gap-16 mb-20 text-white transition-all duration-1000 delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-light mb-1">$2.8B+</div>
            <div className="text-sm opacity-80">Assets Under Management</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-light mb-1">15,000+</div>
            <div className="text-sm opacity-80">Global Investors</div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center">
            <div className="text-3xl font-light mb-1">24/7</div>
            <div className="text-sm opacity-80">Market Access</div>
          </div>
        </div>

        {/* Main CTA */}
        <div className={`transition-all duration-1000 delay-1500 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          <Button
            size="lg"
            onClick={onSelectUserType}
            className="px-16 py-6 rounded-full text-white font-light text-xl shadow-2xl hover:shadow-2xl transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 group"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 40%, #ec4899 100%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.01em',
              backdropFilter: 'blur(20px)'
            }}
          >
            Choose Your Investment Path
            <ArrowRight className="ml-4 w-6 h-6 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-20 text-sm text-white/70 transition-all duration-1000 delay-1800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-center gap-10 font-light" style={{ letterSpacing: '0.03em' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 opacity-70" />
              <span>SEC Registered Investment Advisor</span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 opacity-70" />
              <span>Institutional Grade Infrastructure</span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 opacity-70" />
              <span>Personalized Client Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}