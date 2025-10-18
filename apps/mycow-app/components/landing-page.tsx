"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PWAInstallInstructions } from "@/components/pwa-install-instructions"
import { ThemeToggle } from "@/components/theme-toggle"
import { CopilotSearchBar } from "@/components/copilot-search-bar"
import { CopilotChatModal } from "@/components/copilot-chat-modal"
import { TypewriterEffect } from "@/components/typewriter-effect" // Import the new component
import { recordUserInteraction } from "@/lib/speech-synthesis" // Ensure this is imported
import {
  Compass,
  HandHeart,
  TrendingUp,
  Car,
  Shield,
  ArrowRight,
  Download,
  Smartphone,
  Zap,
  Eye,
  Target,
  Mountain,
  Star,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { CopilotProvider } from "@/contexts/copilot-context" // Ensure CopilotProvider is imported

export function LandingPage() {
  const [showPWAInstructions, setShowPWAInstructions] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInitialQuery, setChatInitialQuery] = useState("")
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Parallax effects
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -50])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      icon: <Compass className="w-7 h-7" />,
      title: "Flow Compass",
      description: "Visualize financial flows with interactive Sankey diagrams and intelligent balance tracking.",
      color: "from-blue-500 to-blue-600",
      accent: "bg-blue-500/10 dark:bg-blue-400/10",
      delay: 0,
    },
    {
      icon: <Mountain className="w-7 h-7" />,
      title: "Wealth Vision",
      description: "Hierarchical goal architecture from Ranges to Mountains, Hills, and micro-tasks.",
      color: "from-emerald-500 to-emerald-600",
      accent: "bg-emerald-500/10 dark:bg-emerald-400/10",
      delay: 0.1,
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Asset Intelligence",
      description: "Portfolio optimization with intelligent categorization and performance analytics.",
      color: "from-purple-500 to-purple-600",
      accent: "bg-purple-500/10 dark:bg-purple-400/10",
      delay: 0.2,
    },
    {
      icon: <Car className="w-7 h-7" />,
      title: "Vehicle Analytics",
      description: "Comprehensive tracking of values, maintenance cycles, and depreciation patterns.",
      color: "from-orange-500 to-orange-600",
      accent: "bg-orange-500/10 dark:bg-orange-400/10",
      delay: 0.3,
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Protection Strategy",
      description: "Insurance portfolio management with coverage optimization and risk assessment.",
      color: "from-red-500 to-red-600",
      accent: "bg-red-500/10 dark:bg-red-400/10",
      delay: 0.4,
    },
    {
      icon: <HandHeart className="w-7 h-7" />,
      title: "Impact Alignment",
      description: "Purpose-driven wealth through charitable giving and social impact measurement.",
      color: "from-pink-500 to-pink-600",
      accent: "bg-pink-500/10 dark:bg-pink-400/10",
      delay: 0.5,
    },
  ]

  const benefits = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Unified Visibility",
      description: "Complete financial ecosystem in one elegant interface",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Intentional Growth",
      description: "Goal hierarchies that connect vision to daily actions",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-Time Flow",
      description: "Instant synchronization across all touchpoints",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Seamless Experience",
      description: "Native-quality performance on every device",
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Wealth Advisor",
      content:
        "MyCOW's flow visualization transformed how I present complex portfolios to clients. Elegant and powerful.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Entrepreneur",
      content: "The hierarchical goal system bridges the gap between my business vision and personal wealth strategy.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emma Thompson",
      role: "Portfolio Manager",
      content: "Sophisticated yet intuitive. The real-time sync and mobile experience set a new standard.",
      rating: 5,
      avatar: "ET",
    },
  ]

  // Handler to open chat modal from search bar
  const handleOpenChat = (query?: string) => {
    setChatInitialQuery(query || "")
    setIsChatOpen(true)
  }

  // Handler to close chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false)
    setChatInitialQuery("")
  }

  // Poetic texts for typewriter effect
  const goalWords = [
    "A quiet harbor for unforeseen storms",
    "The foundation of your future home",
    "Journeys etched in golden light",
    "A tranquil dawn, where dreams unfold",
    "Seeds of knowledge, blossoming bright",
  ]

  const vehicleWords = [
    "A timeless path to deferred dreams",
    "Growth untaxed, a legacy unseen",
    "Employer's hand, a future's steady climb",
    "Health's quiet shield, a tax-free grace",
    "Education's beacon, shining bright",
    "Open seas for bold investment's flight",
  ]

  const assetWords = [
    "The ancient gleam, a steadfast hold",
    "Earth's embrace, a tangible wealth",
    "Horizons beckon, freedom's flight",
    "Aged wisdom, a liquid gold",
    "Innovation's pulse, a future's stride",
    "Steady currents, a tranquil tide",
  ]

  return (
    <CopilotProvider>
      <div className="min-h-screen bg-gradient-to-br from-cream-25 via-cream-50 to-cream-25 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 overflow-hidden">
        {/* Ambient Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute w-96 h-96 bg-gradient-to-r from-logo-blue/5 to-emerald-500/5 rounded-full blur-3xl"
            style={{
              left: mousePosition.x * 0.02 + 100,
              top: mousePosition.y * 0.02 + 100,
            }}
          />
          <div
            className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
            style={{
              right: mousePosition.x * -0.015 + 150,
              bottom: mousePosition.y * -0.015 + 150,
            }}
          />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed top-0 left-0 right-0 z-50 bg-cream-25/80 dark:bg-ink-950/80 backdrop-blur-xl border-b border-cream-200/30 dark:border-ink-800/30"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <motion.div
                className="flex items-center flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="relative">
                  <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-9 h-9 mr-4" />
                  <div className="absolute inset-0 bg-logo-blue/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h1 className="text-2xl font-extralight tracking-wide text-ink-800 dark:text-cream-100">
                  My<span className="font-medium text-logo-blue">COW</span>
                </h1>
              </motion.div>

              {/* Copilot Search Bar in Header */}
              <div className="flex-grow justify-center mx-4 hidden md:flex">
                <CopilotSearchBar onOpenChat={handleOpenChat} />
              </div>

              {/* Right-aligned buttons */}
              <div className="flex items-center space-x-6 flex-shrink-0">
                <ThemeToggle />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPWAInstructions(true)}
                    className="hidden sm:flex items-center space-x-2 text-ink-600 dark:text-cream-300 hover:text-logo-blue dark:hover:text-logo-blue transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-light">Install</span>
                  </Button>
                </motion.div>
                <Link href="/auth/signin">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-logo-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 border-0 font-light px-6">
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-8"
              >
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extralight text-ink-800 dark:text-cream-100 mb-6 leading-[0.9] tracking-tight">
                  Let's Create Your
                  <br />
                  <span className="bg-gradient-to-r from-logo-blue via-blue-600 to-emerald-500 bg-clip-text text-transparent font-light">
                    Cycles of Wealth
                  </span>
                </h1>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl sm:text-2xl font-light text-ink-600 dark:text-cream-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                Visualize, orchestrate, and optimize your complete financial ecosystem through
                <span className="text-logo-blue font-normal"> intuitive flow-based architecture</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <Link href="/onboarding">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-logo-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl shadow-blue-500/25 border-0 px-8 py-4 text-lg font-light"
                      onClick={recordUserInteraction} // Added onClick
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
                    onClick={() => setShowPWAInstructions(true)}
                    className="px-8 py-4 text-lg font-light border-ink-200 dark:border-ink-700 hover:border-logo-blue dark:hover:border-logo-blue hover:text-logo-blue dark:hover:text-logo-blue transition-all duration-300"
                  >
                    <Download className="mr-3 w-5 h-5" />
                    Install App
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex md:hidden mt-12 w-full max-w-md mx-auto px-4"
              >
                <CopilotSearchBar onOpenChat={handleOpenChat} />
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
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="flex flex-col items-center text-ink-400 dark:text-cream-500"
            >
              <span className="text-sm font-light mb-2">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* New "Get Started" Section */}
        <section className="py-32 px-6 lg:px-8 relative bg-gradient-to-br from-cream-50 to-cream-100 dark:from-ink-900 dark:to-ink-800">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-extralight text-ink-800 dark:text-cream-100 mb-6">
                Get Started with
                <span className="block text-logo-blue font-light">MyCOW</span>
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
              {/* Set Goals */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border-cream-200/50 dark:border-ink-700/50 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10">
                  <CardContent className="p-8 flex flex-col items-center">
                    <Target className="w-12 h-12 text-emerald-500 mb-4" />
                    <h3 className="text-2xl font-light text-ink-800 dark:text-cream-100 mb-3">Set Goals</h3>
                    <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed h-16 flex items-center justify-center">
                      <TypewriterEffect words={goalWords} speed={50} loop={true} className="text-center" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Select Vehicles */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border-cream-200/50 dark:border-ink-700/50 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10">
                  <CardContent className="p-8 flex flex-col items-center">
                    <Car className="w-12 h-12 text-purple-500 mb-4" />
                    <h3 className="text-2xl font-light text-ink-800 dark:text-cream-100 mb-3">Select Vehicles</h3>
                    <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed h-16 flex items-center justify-center">
                      <TypewriterEffect words={vehicleWords} speed={50} loop={true} className="text-center" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Turbocharge Assets */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border-cream-200/50 dark:border-ink-700/50 hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-orange-500/10">
                  <CardContent className="p-8 flex flex-col items-center">
                    <TrendingUp className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-2xl font-light text-ink-800 dark:text-cream-100 mb-3">Turbocharge Assets</h3>
                    <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed h-16 flex items-center justify-center">
                      <TypewriterEffect words={assetWords} speed={50} loop={true} className="text-center" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-2xl shadow-logo-blue/25 border-0 px-10 py-4 text-lg font-light"
                  onClick={recordUserInteraction} // Added onClick
                >
                  Drive Your Wealth Starting at $15.00
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-extralight text-ink-800 dark:text-cream-100 mb-6">
                Complete Financial
                <span className="block text-logo-blue font-light">Ecosystem</span>
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
              <p className="text-lg font-light text-ink-600 dark:text-cream-300 max-w-3xl mx-auto leading-relaxed">
                Six integrated modules orchestrated in harmony, providing complete visibility and control over your
                financial landscape.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border-cream-200/50 dark:border-ink-700/50 hover:border-logo-blue/30 dark:hover:border-logo-blue/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-logo-blue/10">
                    <CardContent className="p-8">
                      <div
                        className={`w-16 h-16 ${feature.accent} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-4 group-hover:text-logo-blue dark:group-hover:text-logo-blue transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-cream-50 to-cream-100 dark:from-ink-900 dark:to-ink-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-extralight text-ink-800 dark:text-cream-100 mb-6">
                Why Choose
                <span className="block text-logo-blue font-light">MyCOW?</span>
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
              <p className="text-lg font-light text-ink-600 dark:text-cream-300 max-w-3xl mx-auto leading-relaxed">
                Engineered for modern financial management with cutting-edge technology and human-centered design
                philosophy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="text-center group"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <div className="text-white">{benefit.icon}</div>
                  </div>
                  <h3 className="text-lg font-light text-ink-800 dark:text-cream-100 mb-3 group-hover:text-logo-blue dark:group-hover:text-logo-blue transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl sm:text-5xl font-extralight text-ink-800 dark:text-cream-100 mb-6">
                Trusted by
                <span className="block text-logo-blue font-light">Financial Professionals</span>
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
              <p className="text-lg font-light text-ink-600 dark:text-cream-300 max-w-2xl mx-auto leading-relaxed">
                Discover what industry leaders are saying about their MyCOW experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border-cream-200/50 dark:border-ink-700/50 hover:border-logo-blue/30 dark:hover:border-logo-blue/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-logo-blue/10">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        ))}
                      </div>
                      <p className="text-ink-700 dark:text-cream-200 mb-8 italic font-light leading-relaxed text-lg">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-logo-blue to-emerald-500 rounded-full flex items-center justify-center text-white font-medium mr-4">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-ink-800 dark:text-cream-100">{testimonial.name}</p>
                          <p className="text-sm text-ink-600 dark:text-cream-300 font-light">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 lg:px-8 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 dark:from-ink-950 dark:via-ink-900 dark:to-ink-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.1),transparent_50%)]" />

          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-6xl font-extralight text-cream-100 mb-8 leading-tight">
                Ready to Transform Your
                <span className="block bg-gradient-to-r from-logo-blue to-emerald-400 bg-clip-text text-transparent font-light">
                  Financial Life?
                </span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-8" />
              <p className="text-xl font-light text-cream-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of users who have discovered the power of flow-based financial management. Experience the
                future of wealth orchestration.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/onboarding">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-logo-blue to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-2xl shadow-logo-blue/25 border-0 px-10 py-4 text-lg font-light"
                      onClick={recordUserInteraction} // Added onClick
                    >
                      Begin Free Journey
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/auth/signin">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-10 py-4 text-lg font-light border-cream-300/30 text-cream-100 hover:border-logo-blue hover:text-logo-blue hover:bg-logo-blue/10 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 lg:px-8 bg-ink-950 border-t border-ink-800/50">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-8">
                <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-8 h-8 mr-4" />
                <h3 className="text-xl font-extralight text-cream-100 tracking-wide">
                  My<span className="font-medium text-logo-blue">COW</span>
                </h3>
              </div>
              <p className="text-cream-300 mb-6 font-light text-lg">Zen Financial Flow Management</p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cream-400 to-transparent mx-auto mb-6" />
              <p className="text-sm text-cream-400 font-light">
                © {new Date().getFullYear()} MyCOW. Crafted with intention for financial clarity and peace of mind.
              </p>
            </motion.div>
          </div>
        </footer>

        {/* PWA Install Instructions Modal */}
        <PWAInstallInstructions isOpen={showPWAInstructions} onClose={() => setShowPWAInstructions(false)} />

        {/* Copilot Chat Modal */}
        <CopilotChatModal isOpen={isChatOpen} onClose={handleCloseChat} initialQuery={chatInitialQuery} />
      </div>
    </CopilotProvider>
  )
}
