import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useCart } from "../contexts/cart-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { AuthModal } from "../components/auth-modal";
import { ThemeToggle } from "../components/theme-toggle";
import { CopilotSearchBar } from "../components/copilot-search-bar";
import { PWAInstallInstructions } from "../components/pwa-install-instructions";
import { Milestones } from "../components/milestones";
import { ArrowRight, Plane, Shield, Zap, ChevronDown, TrendingUp, BarChart, Download } from "lucide-react";
import cowLogo from "../assets/cow-logo.png";

export default function AuAeroPage() {
  const { addToCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleAddToCart = (amount: number) => {
    addToCart({
      id: `auaero-${Date.now()}`,
      name: `AuAERO Token (${amount.toLocaleString()})`,
      description: "Dual-asset backed token with gold stability and aviation performance optimization",
      price: amount,
      link: "/auaero",
    });
  };

  const handleOpenChat = (query?: string) => {
    console.log("Opening chat with query:", query);
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* PWA Install Instructions */}
      <PWAInstallInstructions
        isOpen={showPWAInstructions}
        onClose={() => setShowPWAInstructions(false)}
      />

      {/* Hero Section with Sumi-e Sky + Earth Background */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Background gradient layer */}
        <div className="absolute inset-0" style={{
          background: '#ffffff'
        }} />
        <div className="absolute inset-0 dark:block hidden" style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)'
        }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              {/* Aviation vertical badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="text-xs font-medium px-4 py-2 rounded-full inline-block"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    letterSpacing: '0.02em'
                  }}
                >
                  AVIATION PERFORMANCE VERTICAL
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Pioneering
                <br />
                <span style={{
                  background: 'linear-gradient(to right, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '300'
                }}>
                  Aerospace-Enhanced Assets
                </span>
              </h1>
              {/* Sky Blue divider */}
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, transparent 0%, #2563eb 50%, transparent 100%)',
                margin: '0 auto 2rem auto'
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Exploring aggressive performance optimization in{' '}
              <span style={{ color: '#2563eb', fontWeight: '400' }}>commercial aviation assets</span>—discovering how{' '}
              <span className="text-emerald-600 font-normal">dual-asset backing</span> creates enhanced returns through financial engineering
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  size="lg"
                  className="text-white shadow-2xl border-0 px-8 py-6 text-lg font-light"
                  style={{
                    background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                    boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.25)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #2563eb)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #3b82f6)'}
                  onClick={() => handleAddToCart(5000)}
                >
                  Join Waitlist
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </motion.div>
              <Link to="/auaero-whitepaper">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg font-light border-gray-200 dark:border-gray-700 hover:border-[#2563eb] dark:hover:border-[#60a5fa] hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-all duration-300"
                  >
                    View Whitepaper
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
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

      {/* Subtle Horizon Divider - Blue accent */}
      <div
        className="w-full"
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* What is AuAERO Section */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400"
                style={{
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                What is AuAERO
              </h2>
              <h3
                className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
                style={{
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}
              >
                Gold-Aerospace Enhanced Return Optimization
              </h3>
              <p
                className="text-lg font-light text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Charting new territory in{' '}
                <span style={{ color: '#2563eb', fontWeight: '400' }}>aggressive performance optimization</span>—combining gold stability with commercial aviation asset returns through sophisticated financial engineering and operational excellence.
              </p>
              <p
                className="text-base font-light text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Each AuAERO token represents diversified backing from both physical gold reserves and optimized commercial airline assets—creating enhanced return potential through dual-revenue streams while maintaining downside protection through precious metal allocation.
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-light text-[#2563eb] dark:text-[#60a5fa] mb-1">Hybrid</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Gold + Aviation</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-1">25-40%</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Expected APY</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div
                className="w-full h-96 rounded-2xl flex items-center justify-center border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                  borderColor: 'rgba(37, 99, 235, 0.2)'
                }}
              >
                <Plane className="h-32 w-32 text-[#2563eb] dark:text-[#60a5fa]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-how-bg)' }}>
        <style>{`
          :root {
            --mode-how-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-how-bg: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, transparent 100%);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2
              className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
              style={{
                letterSpacing: '-0.02em'
              }}
            >
              Navigating Dual-Asset Performance Optimization
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ letterSpacing: '0.01em' }}
            >
              Three integrated flows create aggressive returns—combining gold stability, aviation performance, and financial engineering excellence
            </p>
          </div>

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
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
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
                  Diversified Asset Acquisition
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
                Token proceeds acquire strategic portfolio of physical gold and high-performing commercial airline assets—creating diversified backing with dual revenue potential
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
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                }}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
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
                  Operational Excellence Engineering
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
                Expert teams employ sophisticated financial engineering and business optimization strategies—maximizing aviation asset performance through operational improvements and problem-solving
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
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                }}
              >
                <BarChart className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
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
                  Aggressive Value Compounding
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
                Generated returns from optimized aviation operations compound into token value—creating aggressive 25-40% APY through dual-stream performance while maintaining gold downside protection
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2
              className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400"
              style={{
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              Aviation Vertical Features
            </h2>
            <h3
              className="text-4xl font-light text-gray-900 dark:text-gray-100"
              style={{ letterSpacing: '-0.02em' }}
            >
              Discovering Aggressive Performance in Aviation
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Hybrid Asset Backing",
                description: "Diversified backing combines gold stability with aviation growth—balancing downside protection through precious metals with upside potential from optimized operations"
              },
              {
                icon: Plane,
                title: "Commercial Aviation Assets",
                description: "Strategic portfolio of passenger airline assets—optimized for performance through operational excellence, financial engineering, and business problem-solving"
              },
              {
                icon: TrendingUp,
                title: "Aggressive Performance",
                description: "Sophisticated optimization strategies maximize aviation returns—targeting 25-40% expected APY through dual-stream revenue generation and compounding mechanics"
              },
              {
                icon: BarChart,
                title: "Financial Engineering",
                description: "Advanced techniques optimize asset performance—employing business transformation strategies to unlock value in commercial aviation operations"
              },
              {
                icon: Shield,
                title: "Gold Downside Protection",
                description: "Precious metal allocation provides stability—gold backing creates floor value while aviation assets drive upside performance"
              },
              {
                icon: Zap,
                title: "Enhanced Returns",
                description: "Dual-asset structure enables aggressive compounding—aviation optimization generates margins while gold provides portfolio ballast and security"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: 'rgba(37, 99, 235, 0.1)'
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-[#2563eb] dark:text-[#60a5fa]" />
                    </div>
                    <CardTitle
                      className="text-xl font-light text-gray-900 dark:text-gray-100"
                      style={{
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm font-light text-gray-600 dark:text-gray-300"
                      style={{
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Scenarios Section */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-scenarios-bg)' }}>
        <style>{`
          :root {
            --mode-scenarios-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-scenarios-bg: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
          }
        `}</style>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2
              className="text-4xl font-light mb-6 text-gray-900 dark:text-gray-100"
              style={{ letterSpacing: '-0.02em' }}
            >
              Performance Optimization Scenarios
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300"
              style={{ letterSpacing: '0.01em' }}
            >
              Projected returns across conservative and aggressive asset allocation strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-[#2563eb]/30 dark:border-[#60a5fa]/30 bg-gradient-to-br from-blue-50/50 dark:from-blue-950/30 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-light text-gray-900 dark:text-gray-100">
                  Conservative Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Expected APY:</span>
                  <span className="text-2xl font-light text-[#2563eb] dark:text-[#60a5fa]">25-30%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Asset Allocation:</span>
                  <span className="font-light text-gray-900 dark:text-gray-100">60% Gold, 40% Aviation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Risk Profile:</span>
                  <span className="font-light text-gray-900 dark:text-gray-100">Moderate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 dark:from-emerald-950/30 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-light text-gray-900 dark:text-gray-100">
                  Aggressive Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Expected APY:</span>
                  <span className="text-2xl font-light text-emerald-600 dark:text-emerald-500">35-40%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Asset Allocation:</span>
                  <span className="font-light text-gray-900 dark:text-gray-100">40% Gold, 60% Aviation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-light">Risk Profile:</span>
                  <span className="font-light text-gray-900 dark:text-gray-100">Higher</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Milestones / Timeline Section */}
      <Milestones tokenType="auaero" />

      {/* CTA Section */}
      <section
        className="py-32 px-8"
        style={{
          background: 'var(--mode-cta-bg)'
        }}
      >
        <style>{`
          :root {
            --mode-cta-bg: linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(37, 99, 235, 0.08));
          }
          .dark {
            --mode-cta-bg: linear-gradient(to bottom, rgba(37, 99, 235, 0.08), rgba(59, 130, 246, 0.08));
          }
        `}</style>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Join the AuAERO Waitlist
          </h2>
          <p
            className="text-lg font-light mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            style={{
              letterSpacing: '0.01em',
              lineHeight: '1.7'
            }}
          >
            Experience aggressive performance optimization through dual-asset backing—pioneering aviation excellence with gold stability
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-white px-10 py-7 text-lg font-medium"
              style={{
                background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #2563eb)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #3b82f6)'}
              onClick={() => handleAddToCart(5000)}
            >
              Join Waitlist ($5,000)
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-light border-[#2563eb] dark:border-[#3b82f6] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#2563eb]/10 dark:hover:bg-[#3b82f6]/10"
              onClick={() => handleAddToCart(10000)}
            >
              Premium Entry ($10,000)
            </Button>
          </div>

          <p
            className="text-sm font-light mt-8 text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.01em'
            }}
          >
            Minimum investment: $5,000 • Expected launch: Q3 2025
          </p>
        </div>
      </section>

      {/* Footer - Sumi-e Grounding */}
      <footer
        className="py-12 px-8"
        style={{
          background: 'var(--mode-footer-bg)',
          borderTop: '2px solid var(--mode-footer-border)'
        }}
      >
        <style>{`
          :root {
            --mode-footer-bg: linear-gradient(to bottom, rgba(155, 139, 126, 0.15) 0%, rgba(155, 139, 126, 0.25) 100%);
            --mode-footer-border: rgba(155, 139, 126, 0.35);
          }
          .dark {
            --mode-footer-bg: rgba(37, 99, 235, 0.05);
            --mode-footer-border: rgba(37, 99, 235, 0.2);
          }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-sm font-light text-gray-700 dark:text-gray-300"
            style={{
              letterSpacing: '0.01em'
            }}
          >
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
