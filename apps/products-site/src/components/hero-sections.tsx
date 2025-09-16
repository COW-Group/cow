import { Button } from "./ui/button"
import { ArrowRight, TrendingUp, Shield, Users, Building2, User, Briefcase, Phone, Calendar, Download } from "lucide-react"
import { UserType } from "./user-type-selector"

interface HeroSectionProps {
  userType: UserType
  onGetStarted: () => void
  onScheduleCall?: () => void
}

export function IndividualHero({ onGetStarted, onScheduleCall }: { onGetStarted: () => void, onScheduleCall: () => void }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
            <User className="w-4 h-4" />
            Personal Wealth Management
          </div>

          <h1
            className="text-6xl font-light mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #4338ca 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em'
            }}
          >
            Build Lasting Wealth<br />
            With Precious Metals
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Access institutional-grade precious metals investments with personalized guidance.
            Start building your portfolio with as little as $10,000 and benefit from dedicated
            wealth advisor support.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center justify-center gap-12 mb-12 text-white">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Portfolio
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onScheduleCall}
            className="px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 font-medium text-lg transition-all duration-300"
          >
            <Phone className="mr-2 w-5 h-5" />
            Schedule Consultation
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-sm text-white/80">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>FDIC Insured</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>SEC Regulated</span>
            </div>
            <div>•</div>
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
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-6xl mx-auto px-8">
        <div className="mb-8">
          <h1
            className="text-7xl font-light mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #4338ca 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.02em'
            }}
          >
            The Future of<br />
            Precious Metals Investment
          </h1>

          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Professional-grade precious metals solutions tailored to your investment sophistication.
            From individual portfolios to institutional mandates.
          </p>
        </div>

        {/* Universal Metrics */}
        <div className="flex items-center justify-center gap-12 mb-16 text-white">
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
        <Button
          size="lg"
          onClick={onSelectUserType}
          className="px-12 py-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white font-medium text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Choose Your Investment Path
          <ArrowRight className="ml-3 w-6 h-6" />
        </Button>

        {/* Trust Indicators */}
        <div className="mt-16 text-sm text-white/80">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>SEC Registered Investment Advisor</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Institutional Grade Infrastructure</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Personalized Client Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}