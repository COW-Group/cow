import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Shield, Target, Zap, CheckCircle2, Download, ChevronDown } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { AuthModal } from "../components/auth-modal"
import { ThemeToggle } from "../components/theme-toggle"
import { CopilotSearchBar } from "../components/copilot-search-bar"
import { PWAInstallInstructions } from "../components/pwa-install-instructions"
import { Button } from "../components/ui/button"
import cowLogo from "../assets/cow-logo.png"

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showPWAInstructions, setShowPWAInstructions] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Waitlist signup:", email)
  }

  const handleOpenChat = (query?: string) => {
    console.log("Chat opened with query:", query)
    // TODO: Implement chat modal integration
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{
      background: 'var(--mode-bg, #F5F3F0)' // Rice Paper (light) / Navy Deep (dark)
    }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0; /* Rice Paper - warm, inviting */
        }
        .dark {
          --mode-bg: #0a1628; /* Navy Deep - family's favorite! */
        }
      `}</style>
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[85%] max-w-5xl">
        <div
          className="px-6 py-3 flex items-center justify-between gap-3 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 border border-white/40 dark:border-gray-700/40"
          style={{
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Left: Logo + Products + Cart */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={cowLogo}
                alt="COW Logo"
                className="h-8 w-8 object-contain"
              />
              <span
                className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100"
                style={{
                  letterSpacing: '0.02em',
                  fontWeight: '300'
                }}
              >
                COW
              </span>
            </Link>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <ProductMenu />
            <CartDropdown />
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex flex-shrink-0">
            <div className="w-96">
              <CopilotSearchBar onOpenChat={handleOpenChat} />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPWAInstructions(true)}
                className="hidden sm:flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 px-2"
              >
                <Download className="w-4 h-4" />
                <span className="font-light text-sm">Install</span>
              </Button>
            </motion.div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-900 dark:text-gray-100 transition-all duration-300 hidden md:flex"
              onClick={() => setShowAuthModal(true)}
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '6px 14px',
                color: '#374151'
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 hidden lg:flex"
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '12px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '6px 14px',
                color: '#374151'
              }}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Sumi-e Sky + Earth */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center">
        {/* Background gradient layer - Sumi-e Sky + Earth */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #F5F3F0 0%, #e0f2fe 50%, #F5F3F0 100%)' // Light: Rice paper with sky wash
        }} />
        <div className="absolute inset-0 dark:block hidden" style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)' // Dark: Navy gradient (family's favorite!)
        }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Let's Create Your
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent font-light">
                  Cycles of Wealth
                </span>
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto mb-8" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Visualize, orchestrate, and optimize your complete financial ecosystem through
              <span className="text-blue-600 font-normal"> intuitive flow-based architecture</span> and
              <span className="text-emerald-600 font-normal"> performance-engineered real world assets</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/onboarding">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl shadow-blue-500/25 border-0 px-8 py-6 text-lg font-light"
                  >
                    Begin Your Journey
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg font-light border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-600 transition-all duration-300"
                >
                  <Download className="mr-3 w-5 h-5" />
                  Install App
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-gray-400 dark:text-gray-500"
          >
            <span className="text-sm font-light mb-2">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Two Paths to Wealth Section - Soft Clay for earth grounding */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-section-bg)' }}>
        <style>{`
          :root {
            --mode-section-bg: #C9B8A8; /* Soft Clay - earth grounding */
          }
          .dark {
            --mode-section-bg: #0a1628; /* Navy Deep - family's favorite */
          }
        `}</style>
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
              Two Flows in Your Financial Ecosystem
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
              Visualize your wealth through performance-engineered assets that optimize continuously, or orchestrate life milestones through purpose-built programs. Each creates its own cycle—combine both flows to optimize your complete financial ecosystem.
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
                  Flow-based optimization that visualizes and orchestrates your asset performance in real-time. Our algorithms create continuous cycles of rebalancing and compounding across gold, aviation, real estate—engineering your ecosystem to maximize returns while you focus on what matters.
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
                    background: 'linear-gradient(135deg, #6B8E6F 0%, #5a7a5c 100%)' // Bamboo Green - nature, vitality
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
                  Retirement. Education. Your dream home. Life's biggest milestones flow better when you can visualize and orchestrate them within your complete financial ecosystem. We're engineering programs designed for how you actually live—each creating its own wealth cycle.
                </p>
                <a
                  href="#programs"
                  className="inline-flex items-center font-medium transition-colors group/link"
                  style={{
                    color: '#6B8E6F', // Bamboo Green
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
              Visualize Your Asset Ecosystem
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
              Performance-engineered flows across real-world assets. Visualize, orchestrate, and optimize gold, aviation, real estate, and essential markets—each asset creating cycles that compound within your complete financial ecosystem.
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
              {/* Pure Gold Bullion - Flagship with Terra Cotta premium accent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-2xl p-8 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.02) 100%)',
                  border: '2px solid rgba(255, 193, 7, 0.3)',
                  borderLeft: '4px solid #C77A58' // Terra Cotta premium accent
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
                  Gold has preserved wealth for millennia. Now visualize it flowing through your ecosystem. Our performance-engineered optimization orchestrates your holdings in continuous cycles—maximizing returns while maintaining the stability you expect from precious metals.
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
              Orchestrate Life's Wealth Cycles
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
              Retiring with confidence. Sending kids to college. Buying your dream home. Each milestone creates its own cycle within your financial ecosystem. Visualize and optimize these flows with programs engineered for how you actually live—not one-size-fits-all products.
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
              Your Wealth Ecosystem in Three Flows
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
              Visualize, orchestrate, optimize—from vision to achievement
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
                  Visualize Your Flows
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
                See your complete financial ecosystem. Choose Performance Assets, Life Programs, or combine both flows to create your ideal wealth cycles
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
                  Orchestrate Performance
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
                Watch your ecosystem flow. Performance-engineered optimization creates continuous cycles of rebalancing and compounding across your complete portfolio
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
                  Optimize Your Cycles
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
                Complete the flow. Track each wealth cycle within your ecosystem with measurable progress, complete transparency, and total control
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
              Start Your Wealth Cycles
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
              We're engineering a new financial ecosystem. One you can visualize, orchestrate, and optimize—designed for everyone, not just institutions. Be among the first to experience flow-based wealth architecture.
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

      {/* Footer with Warm Stone horizon - where sky meets earth */}
      <footer
        className="py-12 px-8"
        style={{
          background: 'linear-gradient(to bottom, rgba(155, 139, 126, 0.15) 0%, rgba(155, 139, 126, 0.25) 100%)',
          borderTop: '2px solid rgba(155, 139, 126, 0.35)'
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-sm font-light"
            style={{
              letterSpacing: '0.01em',
              color: '#6b4423', // Warm earth brown for better contrast with subtle warm stone horizon
              fontFamily: 'Inter, sans-serif'
            }}
          >
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PWAInstallInstructions
        isOpen={showPWAInstructions}
        onClose={() => setShowPWAInstructions(false)}
      />
    </div>
  )
}
