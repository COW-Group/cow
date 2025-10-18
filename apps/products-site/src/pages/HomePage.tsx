import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Shield, Target, Zap, CheckCircle2 } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { AuthModal } from "../components/auth-modal"
import { Button } from "../components/ui/button"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Waitlist signup:", email)
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Navigation */}
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

      {/* Hero Section - Horizon Gradient */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Horizon Principle: Sky meets Earth */}
        <div className="absolute inset-0">
          {/* Sky - Top 45% */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '45%',
              background: 'linear-gradient(to bottom, #007BA7, #B0E0E6)'
            }}
          />
          {/* Earth - Bottom 55% */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '55%',
              background: 'linear-gradient(to bottom, #C9B8A8, #9B8B7E)'
            }}
          />
        </div>

        {/* Text positioned at horizon line (45% mark) - first line sits on horizon */}
        <div className="absolute z-10 left-0 right-0 text-center px-8" style={{ top: '45%' }}>
          <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white mb-8"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              fontWeight: '200',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.1)',
              marginTop: 'calc(-0.6 * clamp(3rem, 7vw, 6.5rem))'
            }}
          >
            Investments That Optimize to Your Goals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white max-w-4xl mx-auto"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: '300',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.01em',
              lineHeight: '1.6',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)'
            }}
          >
            Real-world assets—gold, aviation, real estate—algorithmically engineered to perform. We're building investment products that continuously optimize for your financial objectives, not just hold value.
          </motion.p>
          </div>
        </div>
      </section>

      {/* Two Paths to Wealth Section */}
      <section className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                color: '#111827'
              }}
            >
              Two Ways to Build Your Future
            </h2>
            <p
              className="max-w-3xl mx-auto"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                color: '#6b7280',
                lineHeight: '1.7'
              }}
            >
              Performance-engineered investments that optimize to your goals, or life-stage programs designed for your biggest financial milestones. We're building products that actively work for your success—choose one or combine both to achieve what matters most.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Performance Assets Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-2xl p-12 transition-all duration-500 border overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)' // Deep Cerulean
                  }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="mb-4"
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Performance Assets
                </h3>
                <p
                  className="mb-8"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  Investment products that actively work toward your financial goals. Our algorithmic optimization continuously rebalances and compounds across real-world assets—gold, aviation, real estate—to maximize risk-adjusted returns while you focus on what matters.
                </p>
                <a
                  href="#assets"
                  className="inline-flex items-center font-medium transition-colors group/link"
                  style={{
                    color: '#007BA7',
                    fontSize: '0.9375rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Explore Assets
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Life Solutions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative rounded-2xl p-12 transition-all duration-500 border overflow-hidden"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #8B956D 0%, #6B7553 100%)' // Sage Green
                  }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="mb-4"
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Life Solutions
                </h3>
                <p
                  className="mb-8"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  Retirement. Education. Your dream home. Life's biggest moments deserve better than generic financial products. We're building structured programs designed for how you actually live.
                </p>
                <a
                  href="#programs"
                  className="inline-flex items-center font-medium transition-colors group/link"
                  style={{
                    color: '#8B956D',
                    fontSize: '0.9375rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Explore Programs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Terra Cotta Horizon Strip */}
      <div
        className="w-full"
        style={{
          height: '80px',
          background: 'linear-gradient(135deg, #C9724B 0%, #B86239 100%)'
        }}
      />

      {/* Performance Assets Section */}
      <section id="assets" className="py-32 px-8" style={{ background: 'rgba(249, 250, 251, 0.4)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                color: '#111827'
              }}
            >
              Assets That Work for You
            </h2>
            <p
              className="max-w-3xl"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.7',
                color: '#6b7280'
              }}
            >
              Investment products built to perform. Our algorithms continuously optimize real-world assets—starting with gold and expanding across essential markets—to help you reach your financial goals faster.
            </p>
          </motion.div>

          {/* Featured Assets */}
          <div className="mb-16">
            <h3
              className="mb-8"
              style={{
                fontSize: '0.875rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.08em',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}
            >
              Flagship Assets
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Pure Gold Bullion - Flagship */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-2xl p-8 transition-all duration-300 border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.02) 100%)',
                  border: '2px solid rgba(255, 193, 7, 0.3)'
                }}
              >
                <div
                  className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-4"
                  style={{
                    background: 'rgba(255, 193, 7, 0.2)',
                    color: '#f59e0b',
                    letterSpacing: '0.02em'
                  }}
                >
                  Flagship
                </div>
                <h4
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Pure Gold Bullion
                </h4>
                <p
                  className="mb-6"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  Gold has preserved wealth for millennia. We've engineered it to perform. Our algorithmic optimization actively manages your gold holdings to maximize returns while maintaining the stability you expect from precious metals.
                </p>
                <button
                  className="font-medium inline-flex items-center group/btn transition-colors"
                  style={{
                    color: '#f59e0b',
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Aviation Assets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <h4
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Aviation Assets
                </h4>
                <p
                  className="mb-6"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  Access commercial aviation economics through fractional asset ownership
                </p>
                <button
                  className="font-medium inline-flex items-center group/btn transition-colors"
                  style={{
                    color: '#007BA7',
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Real Estate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <h4
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Real Estate
                </h4>
                <p
                  className="mb-6"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  Residential and commercial mixed-use properties with long-duration value
                </p>
                <button
                  className="font-medium inline-flex items-center group/btn transition-colors"
                  style={{
                    color: '#007BA7',
                    fontSize: '0.875rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Asset Grid */}
          <h3
            className="mb-8"
            style={{
              fontSize: '0.875rem',
              fontWeight: '300',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.08em',
              color: '#6b7280',
              textTransform: 'uppercase'
            }}
          >
            Essential Asset Verticals
          </h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Water Resources",
                description: "Essential resource infrastructure with long-duration value"
              },
              {
                name: "Electric Vehicles",
                description: "Next-generation transportation assets with institutional-grade access"
              },
              {
                name: "Carbon Markets",
                description: "Atmospheric credit trading with institutional-grade access"
              },
              {
                name: "Solar Energy",
                description: "Productive energy generation assets across distributed networks"
              },
              {
                name: "Entertainment Royalties",
                description: "Revenue-generating intellectual property portfolios"
              },
              {
                name: "Digital Banking",
                description: "Digital banking infrastructure access"
              },
              {
                name: "Medical Tourism",
                description: "Cross-border healthcare infrastructure investments"
              },
              {
                name: "Aquaculture",
                description: "Protein production assets in high-growth markets"
              },
              {
                name: "Agricultural Commodities",
                description: "Essential agricultural commodities with stable global demand"
              }
            ].map((asset, index) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group rounded-xl p-6 transition-all duration-300"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <h4
                  className="mb-2"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  {asset.name}
                </h4>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em',
                    color: '#6b7280'
                  }}
                >
                  {asset.description}
                </p>
                <button
                  className="text-sm font-medium inline-flex items-center group/btn transition-colors"
                  style={{
                    color: '#007BA7',
                    fontSize: '0.8125rem',
                    letterSpacing: '0.01em'
                  }}
                >
                  Learn More
                  <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Wealth Programs Section */}
      <section id="programs" className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                color: '#111827'
              }}
            >
              Programs for How You Actually Live
            </h2>
            <p
              className="max-w-3xl"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.7',
                color: '#6b7280'
              }}
            >
              Life's biggest moments—retiring with confidence, sending your kids to college, buying your dream home—deserve financial tools built for your actual needs, not one-size-fits-all products.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Life Stages */}
            <div>
              <h3
                className="mb-8 flex items-center"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111827'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4" style={{ background: '#007BA7' }} />
                Life Stages
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Retirement Excellence", description: "Retire with confidence and worry-free financial security" },
                  { name: "Educational Future", description: "Finance educational aspirations for you and your family" },
                  { name: "Parental Support", description: "Support parenting needs and family planning goals" },
                  { name: "Legacy Planning", description: "Multi-generational wealth transfer and family legacy" }
                ].map((program, index) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-xl p-6 transition-all duration-300"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0, 123, 167, 0.2)'
                    }}
                  >
                    <h4
                      className="mb-3"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em',
                        color: '#6b7280'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{
                        background: 'rgba(0, 123, 167, 0.1)',
                        color: '#007BA7',
                        fontSize: '0.8125rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Major Transitions */}
            <div>
              <h3
                className="mb-8 flex items-center"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111827'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4" style={{ background: '#8B956D' }} />
                Major Transitions
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Global Transition", description: "Seamless international relocation and settlement support" },
                  { name: "Career Break", description: "Sabbaticals and career transitions made financially secure" },
                  { name: "Major Purchase", description: "Home, vehicle, and significant acquisition financing" },
                  { name: "Startup Success", description: "New business venture financing and growth capital" }
                ].map((program, index) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-xl p-6 transition-all duration-300"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(139, 149, 109, 0.2)'
                    }}
                  >
                    <h4
                      className="mb-3"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em',
                        color: '#6b7280'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{
                        background: 'rgba(139, 149, 109, 0.1)',
                        color: '#8B956D',
                        fontSize: '0.8125rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Security & Protection */}
            <div>
              <h3
                className="mb-8 flex items-center"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111827'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4" style={{ background: '#C9724B' }} />
                Security & Protection
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { name: "Healthcare Assurance", description: "Medical readiness and healthcare security" },
                  { name: "Safety & Security", description: "Personal and property protection solutions" },
                  { name: "Expense Coverage", description: "Unexpected costs and insurance alternatives" },
                  { name: "Debt Recovery", description: "Efficient loan repayment strategies" },
                  { name: "Protection Scheme", description: "Comprehensive wealth safeguarding" }
                ].map((program, index) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-xl p-6 transition-all duration-300"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(201, 114, 75, 0.2)'
                    }}
                  >
                    <h4
                      className="mb-3"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em',
                        color: '#6b7280'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{
                        background: 'rgba(201, 114, 75, 0.1)',
                        color: '#C9724B',
                        fontSize: '0.8125rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Lifestyle & Meaning */}
            <div>
              <h3
                className="mb-8 flex items-center"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111827'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4" style={{ background: '#C9B8A8' }} />
                Lifestyle & Meaning
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Wedding Dream", description: "Celebration financing for your special day" },
                  { name: "Travel Experience", description: "Vacation and travel planning made effortless" },
                  { name: "Living Well", description: "Quality of life optimization programs" },
                  { name: "Giving Back", description: "Philanthropic facilitation and impact creation" }
                ].map((program, index) => (
                  <motion.div
                    key={program.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="rounded-xl p-6 transition-all duration-300"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(201, 184, 168, 0.2)'
                    }}
                  >
                    <h4
                      className="mb-3"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em',
                        color: '#6b7280'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      style={{
                        background: 'rgba(201, 184, 168, 0.1)',
                        color: '#C9B8A8',
                        fontSize: '0.8125rem',
                        letterSpacing: '0.01em'
                      }}
                    >
                      Join Waitlist
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-8" style={{ background: 'rgba(249, 250, 251, 0.4)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                color: '#111827'
              }}
            >
              How It Works
            </h2>
            <p
              className="max-w-3xl"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                color: '#6b7280'
              }}
            >
              A seamless journey from vision to achievement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)' }}
              >
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(0, 123, 167, 0.1)',
                    color: '#007BA7',
                    fontWeight: '600'
                  }}
                >
                  1
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Choose Your Path
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Select from Performance Assets, Life Programs, or combine both to build your ideal financial strategy
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)' }}
              >
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(0, 123, 167, 0.1)',
                    color: '#007BA7',
                    fontWeight: '600'
                  }}
                >
                  2
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Algorithmic Optimization
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Watch performance engineering in action as your portfolio continuously optimizes for maximum efficiency
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)' }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(0, 123, 167, 0.1)',
                    color: '#007BA7',
                    fontWeight: '600'
                  }}
                >
                  3
                </span>
                <h3
                  className="mb-3"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em',
                    color: '#111827'
                  }}
                >
                  Achieve Your Goals
                </h3>
              </div>
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Track measurable progress toward your financial objectives with complete transparency and control
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Early Access Section */}
      <section
        className="py-32 px-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(155, 139, 126, 0.25))'
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2
              className="mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                color: '#111827'
              }}
            >
              Join the Journey
            </h2>
            <p
              className="mb-12 max-w-2xl mx-auto"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.7',
                color: '#6b7280'
              }}
            >
              We're building a new kind of financial infrastructure. One that works for everyone, not just institutions. Join us on this journey and be among the first to experience what's possible.
            </p>

            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border transition-all"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    fontSize: '15px',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  type="submit"
                  className="px-8 py-4 font-medium rounded-xl transition-all"
                  style={{
                    background: '#007BA7',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '500',
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Get Early Access
                </button>
              </div>
              <p
                className="text-sm mt-4"
                style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                No investment required. Join the waitlist to stay informed.
              </p>
            </form>

            <div className="mt-16 pt-12 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div
                    className="mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif',
                      color: '#111827'
                    }}
                  >
                    14+
                  </div>
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Asset Verticals
                  </div>
                </div>
                <div>
                  <div
                    className="mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif',
                      color: '#111827'
                    }}
                  >
                    17+
                  </div>
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Life Programs
                  </div>
                </div>
                <div>
                  <div
                    className="mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif',
                      color: '#111827'
                    }}
                  >
                    ∞
                  </div>
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Possibilities
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-8"
        style={{
          background: '#9B8B7E',
          borderTop: 'none'
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-sm font-light"
            style={{
              letterSpacing: '0.01em',
              color: 'rgba(255, 255, 255, 0.9)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
