import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  const navigate = useNavigate()
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
    navigate('/moo', { state: { initialQuery: query } })
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
        {/* Background gradient layer - Light mode: clean white for text contrast */}
        <div className="absolute inset-0" style={{
          background: '#ffffff' // Clean white for better text contrast
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
                <span style={{
                  background: 'linear-gradient(to right, #0066FF 0%, #0ea5e9 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '300'
                }}>
                  Cycles of Wealth
                </span>
              </h1>
              {/* Deep Cyan logo divider */}
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, transparent 0%, #0066FF 50%, transparent 100%)',
                margin: '0 auto 2rem auto'
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Visualize, orchestrate, and optimize your complete financial ecosystem through
              <span style={{ color: '#0066FF', fontWeight: '400' }}> intuitive flow-based architecture</span> and
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
                    className="text-white shadow-2xl border-0 px-8 py-6 text-lg font-light"
                    style={{
                      background: 'linear-gradient(to right, #0066FF, #0080FF)',
                      boxShadow: '0 25px 50px -12px rgba(0, 102, 255, 0.25)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0052CC, #0066FF)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0066FF, #0080FF)'}
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

      {/* Subtle Deep Cyan divider - logo color thread */}
      <div style={{ height: '2px', background: 'linear-gradient(to right, transparent 0%, #0066FF 50%, transparent 100%)', opacity: 0.3 }} />

      {/* Two Paths to Wealth Section - Light with subtle earth warmth, Dark with vibrant Deep Cyan */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-section-bg)' }}>
        <style>{`
          :root {
            --mode-section-bg: linear-gradient(to bottom, #ffffff 0%, rgba(201, 184, 168, 0.08) 50%, #ffffff 100%); /* Subtle Soft Clay wash */
          }
          .dark {
            --mode-section-bg: linear-gradient(135deg, #0a1628 0%, rgba(0, 102, 255, 0.08) 50%, #0a1628 100%); /* Navy with Deep Cyan energy */
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
              className="mb-6 inline-block text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                borderBottom: '2px solid rgba(0, 102, 255, 0.2)', // Subtle Deep Cyan accent
                paddingBottom: '0.5rem'
              }}
            >
              Two Flows in Your Financial Ecosystem
            </h2>
            <p
              className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
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
              className="group relative rounded-2xl p-12 transition-all duration-500 border overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="relative z-10">
                {/* Deep Cyan logo color pop */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF 0%, #0052CC 100%)', // Deep Cyan logo pop
                    boxShadow: '0 8px 16px rgba(0, 102, 255, 0.25)'
                  }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="mb-4 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Performance Assets
                </h3>
                <p
                  className="mb-8 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em'
                  }}
                >
                  Flow-based optimization that visualizes and orchestrates your asset performance in real-time. Our algorithms create continuous cycles of rebalancing and compounding across gold, aviation, real estate—engineering your ecosystem to maximize returns while you focus on what matters.
                </p>
                <a
                  href="#assets"
                  className="inline-flex items-center font-medium transition-colors group/link text-[#0066FF] dark:text-[#38bdf8]"
                  style={{
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
              className="group relative rounded-2xl p-12 transition-all duration-500 border overflow-hidden bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50"
              style={{
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald green - life, growth
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="mb-4 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.875rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Life Solutions
                </h3>
                <p
                  className="mb-8 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em'
                  }}
                >
                  Retirement. Education. Your dream home. Life's biggest milestones flow better when you can visualize and orchestrate them within your complete financial ecosystem. We're engineering programs designed for how you actually live—each creating its own wealth cycle.
                </p>
                <a
                  href="#programs"
                  className="inline-flex items-center font-medium transition-colors group/link text-[#10b981] dark:text-[#6B8E6F]"
                  style={{
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

      {/* Terra Cotta Horizon Strip with subtle logo color accent - hidden in dark mode */}
      <div
        className="w-full dark:hidden"
        style={{
          height: '80px',
          background: 'linear-gradient(135deg, #C9724B 0%, #B86239 100%)',
          borderTop: '3px solid rgba(0, 102, 255, 0.4)', // Deep Cyan logo color thread
          boxShadow: 'inset 0 3px 8px rgba(0, 102, 255, 0.15)' // Subtle Deep Cyan glow
        }}
      />

      {/* Dark mode divider - subtle Deep Cyan */}
      <div
        className="w-full hidden dark:block"
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent 0%, rgba(0, 102, 255, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* Performance Assets Section */}
      <section id="assets" className="py-32 px-8" style={{ background: 'var(--mode-assets-bg)' }}>
        <style>{`
          :root {
            --mode-assets-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-assets-bg: linear-gradient(to bottom, rgba(0, 102, 255, 0.05) 0%, rgba(56, 189, 248, 0.08) 50%, rgba(16, 185, 129, 0.05) 100%); /* Sky Blue to Emerald gradient */
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6 inline-block text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                borderBottom: '2px solid rgba(0, 102, 255, 0.2)', // Subtle Deep Cyan accent
                paddingBottom: '0.5rem'
              }}
            >
              Visualize Your Asset Ecosystem
            </h2>
            <p
              className="max-w-3xl text-gray-600 dark:text-gray-300"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.7'
              }}
            >
              Performance-engineered flows across real-world assets. Visualize, orchestrate, and optimize gold, aviation, real estate, and essential markets—each asset creating cycles that compound within your complete financial ecosystem.
            </p>
          </motion.div>

          {/* Featured Assets */}
          <div className="mb-16">
            <h3
              className="mb-8 text-gray-600 dark:text-gray-400"
              style={{
                fontSize: '0.875rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Flagship Assets
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Pure Gold Bullion - Flagship with Deep Cyan premium accent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-2xl p-8 transition-all duration-300 bg-white dark:bg-gray-800/70 border-2 border-yellow-400/30 dark:border-[#0066FF]/40"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: '#0066FF' // Deep Cyan logo pop for premium
                }}
              >
                {/* Deep Cyan corner accent - logo pop */}
                <div
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#0066FF]/20 to-transparent dark:from-[#0066FF]/30 dark:to-transparent rounded-tr-2xl"
                />
                <div
                  className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-4 bg-[#0066FF]/10 dark:bg-[#0066FF]/20 text-[#0066FF]"
                  style={{
                    letterSpacing: '0.02em'
                  }}
                >
                  Flagship
                </div>
                <h4
                  className="mb-3"
                  className="text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Pure Gold Bullion
                </h4>
                <p
                  className="mb-6 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em'
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
                className="group rounded-2xl p-8 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
              >
                <h4
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Aviation Assets
                </h4>
                <p
                  className="mb-6 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  Access commercial aviation economics through fractional asset ownership
                </p>
                <button
                  className="font-medium inline-flex items-center group/btn transition-colors text-[#0066FF] dark:text-[#38bdf8]"
                  style={{
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
                className="group rounded-2xl p-8 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
              >
                <h4
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Real Estate
                </h4>
                <p
                  className="mb-6 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  Residential and commercial mixed-use properties with long-duration value
                </p>
                <button
                  className="font-medium inline-flex items-center group/btn transition-colors text-[#0066FF] dark:text-[#38bdf8]"
                  style={{
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
            className="mb-8 text-gray-600 dark:text-gray-400"
            style={{
              fontSize: '0.875rem',
              fontWeight: '300',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.08em',
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
                className="group rounded-xl p-6 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
              >
                <h4
                  className="mb-2 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {asset.name}
                </h4>
                <p
                  className="mb-4 text-gray-600 dark:text-gray-300"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: '300',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  {asset.description}
                </p>
                <button
                  className="text-sm font-medium inline-flex items-center group/btn transition-colors text-[#0066FF] dark:text-[#38bdf8]"
                  style={{
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
      <section id="programs" className="py-32 px-8" style={{ background: 'var(--mode-programs-bg)' }}>
        <style>{`
          :root {
            --mode-programs-bg: #ffffff;
          }
          .dark {
            --mode-programs-bg: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, #0a1628 50%, rgba(107, 142, 111, 0.08) 100%); /* Emerald to Bamboo glow */
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6 inline-block text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                borderBottom: '2px solid rgba(0, 102, 255, 0.2)', // Subtle Deep Cyan accent
                paddingBottom: '0.5rem'
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
                lineHeight: '1.7'
              }}
            >
              Retiring with confidence. Sending kids to college. Buying your dream home. Each milestone creates its own cycle within your financial ecosystem. Visualize and optimize these flows with programs engineered for how you actually live—not one-size-fits-all products.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Life Stages */}
            <div>
              <h3
                className="mb-8 flex items-center text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4 bg-[#0066FF] dark:bg-[#38bdf8]" />
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
                    className="rounded-xl p-6 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-[#0066FF]/20 dark:border-[#38bdf8]/30"
                  >
                    <h4
                      className="mb-3 text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4 text-gray-600 dark:text-gray-300"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-[#0066FF]/10 dark:bg-[#38bdf8]/20 text-[#0066FF] dark:text-[#38bdf8]"
                      style={{
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
                className="mb-8 flex items-center text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4 bg-[#6B8E6F] dark:bg-[#8A9A7B]" />
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
                    className="rounded-xl p-6 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-[#6B8E6F]/20 dark:border-[#8A9A7B]/30"
                  >
                    <h4
                      className="mb-3 text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4 text-gray-600 dark:text-gray-300"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-[#6B8E6F]/10 dark:bg-[#8A9A7B]/20 text-[#6B8E6F] dark:text-[#8A9A7B]"
                      style={{
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
                className="mb-8 flex items-center text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4 bg-[#C77A58] dark:bg-[#D4BFA0]" />
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
                    className="rounded-xl p-6 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-[#C77A58]/20 dark:border-[#D4BFA0]/30"
                  >
                    <h4
                      className="mb-3 text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4 text-gray-600 dark:text-gray-300"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-[#C77A58]/10 dark:bg-[#D4BFA0]/20 text-[#C77A58] dark:text-[#D4BFA0]"
                      style={{
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
                className="mb-8 flex items-center text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: '1.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em'
                }}
              >
                <div className="w-2 h-8 rounded-full mr-4 bg-[#C9B8A8] dark:bg-[#9B8B7E]" />
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
                    className="rounded-xl p-6 transition-all duration-300 bg-white dark:bg-gray-800/50 border border-[#C9B8A8]/20 dark:border-[#9B8B7E]/30"
                  >
                    <h4
                      className="mb-3 text-gray-900 dark:text-gray-100"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '500',
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {program.name}
                    </h4>
                    <p
                      className="mb-4 text-gray-600 dark:text-gray-300"
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: '300',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {program.description}
                    </p>
                    <button
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-colors bg-[#C9B8A8]/10 dark:bg-[#9B8B7E]/20 text-[#C9B8A8] dark:text-[#9B8B7E]"
                      style={{
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
      <section className="py-32 px-8" style={{ background: 'var(--mode-how-it-works-bg)' }}>
        <style>{`
          :root {
            --mode-how-it-works-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-how-it-works-bg: radial-gradient(ellipse at top, rgba(56, 189, 248, 0.12) 0%, #0a1628 50%, rgba(0, 102, 255, 0.06) 100%); /* Sky Blue radial burst */
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2
              className="mb-6 inline-block text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                borderBottom: '2px solid rgba(0, 102, 255, 0.2)', // Subtle Deep Cyan accent
                paddingBottom: '0.5rem'
              }}
            >
              Your Wealth Ecosystem in Three Flows
            </h2>
            <p
              className="max-w-3xl text-gray-600 dark:text-gray-300"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em'
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
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)', // Sky Blue - lightest logo color
                  boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
                }}
              >
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontWeight: '600'
                  }}
                >
                  1
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Visualize Your Flows
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
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
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)', // Sky Blue - lightest logo color
                  boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
                }}
              >
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontWeight: '600'
                  }}
                >
                  2
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Orchestrate Performance
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
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
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)', // Sky Blue - lightest logo color
                  boxShadow: '0 8px 16px rgba(56, 189, 248, 0.2)'
                }}
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontWeight: '600'
                  }}
                >
                  3
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Optimize Your Cycles
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
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
        className="py-32 px-8 relative overflow-hidden bg-gradient-to-b from-[rgba(201,184,168,0.15)] to-[rgba(155,139,126,0.25)] dark:from-gray-900 dark:to-gray-800"
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
              className="mb-6 inline-block text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: '200',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '-0.025em',
                borderBottom: '2px solid rgba(0, 102, 255, 0.2)', // Subtle Deep Cyan accent
                paddingBottom: '0.5rem'
              }}
            >
              Start Your Wealth Cycles
            </h2>
            <p
              className="mb-12 max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
              style={{
                fontSize: '1.125rem',
                fontWeight: '300',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.7'
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
                  className="flex-1 px-6 py-4 rounded-xl border transition-all bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  style={{
                    fontSize: '15px',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  type="submit"
                  className="px-8 py-4 font-medium rounded-xl transition-all text-white"
                  style={{
                    background: 'linear-gradient(to right, #0066FF, #0080FF)',
                    fontSize: '16px',
                    fontWeight: '500',
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0052CC, #0066FF)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0066FF, #0080FF)'}
                >
                  Get Early Access
                </button>
              </div>
              <p
                className="text-sm mt-4 text-gray-600 dark:text-gray-400"
                style={{
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                No investment required. Join the waitlist to stay informed.
              </p>
            </form>

            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div
                    className="mb-2 text-gray-900 dark:text-gray-100"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    14+
                  </div>
                  <div
                    className="text-gray-700 dark:text-gray-300"
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Asset Verticals
                  </div>
                </div>
                <div>
                  <div
                    className="mb-2 text-gray-900 dark:text-gray-100"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    17+
                  </div>
                  <div
                    className="text-gray-700 dark:text-gray-300"
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Life Programs
                  </div>
                </div>
                <div>
                  <div
                    className="mb-2 text-gray-900 dark:text-gray-100"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    ∞
                  </div>
                  <div
                    className="text-gray-700 dark:text-gray-300"
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: '300',
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
        className="py-16 px-8"
        style={{
          background: 'linear-gradient(to bottom, rgba(155, 139, 126, 0.15) 0%, rgba(155, 139, 126, 0.25) 100%)',
          borderTop: '2px solid rgba(155, 139, 126, 0.35)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            <Link
              to="/moo"
              className="text-gray-700 dark:text-gray-300 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors duration-200 font-light"
              style={{
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Moo
            </Link>
            <Link
              to="/research"
              className="text-gray-700 dark:text-gray-300 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors duration-200 font-light"
              style={{
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Research
            </Link>
            <a
              href="https://mauna.mycow.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors duration-200 font-light"
              style={{
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Mauna
            </a>
            <Link
              to="/missions"
              className="text-gray-700 dark:text-gray-300 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors duration-200 font-light"
              style={{
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Missions
            </Link>
            <a
              href="mailto:support@mycow.io"
              className="text-gray-700 dark:text-gray-300 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors duration-200 font-light"
              style={{
                fontSize: '0.9375rem',
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Support
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
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
