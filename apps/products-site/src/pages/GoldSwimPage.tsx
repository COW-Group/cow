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
import { ArrowRight, TrendingUp, Shield, BarChart3, ChevronDown, RefreshCcw, Download, ExternalLink } from "lucide-react";
import cowLogo from "../assets/cow-logo.png";

export default function GoldSwimPage() {
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
      id: `goldswim-${Date.now()}`,
      name: `Gold SWIM Investment (${amount.toLocaleString()})`,
      description: "Strategic wealth Investment management for gold retailing operations",
      price: amount,
      link: "/gold-swim",
    });
  };

  const handleOpenChat = (query?: string) => {
    console.log("Opening chat with query:", query);
  };

  const openDashboard = () => {
    window.open('http://localhost:3000/dashboard/mygold/gold-swim', '_blank');
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0;
        }
        .dark {
          --mode-bg: #0a1628;
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
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={cowLogo}
                alt="COW Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100" style={{ letterSpacing: '0.02em', fontWeight: '300' }}>
                COW
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ProductMenu />
            <CartDropdown />
          </div>

          <div className="hidden lg:flex flex-shrink-0">
            <div className="w-96">
              <CopilotSearchBar onOpenChat={handleOpenChat} />
            </div>
          </div>

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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PWAInstallInstructions isOpen={showPWAInstructions} onClose={() => setShowPWAInstructions(false)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: '#ffffff' }} />
        <div className="absolute inset-0 dark:block hidden" style={{ background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} className="mb-8">
              <div className="flex justify-center mb-6">
                <span className="text-xs font-medium px-4 py-2 rounded-full inline-block" style={{ background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', letterSpacing: '0.02em' }}>
                  FLAGSHIP GOLD VERTICAL
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Strategic Wealth
                <br />
                <span style={{ background: 'linear-gradient(to right, #b45309 0%, #d97706 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '300' }}>
                  Investment Management
                </span>
              </h1>
              <div style={{ width: '120px', height: '2px', background: 'linear-gradient(to right, transparent 0%, #b45309 50%, transparent 100%)', margin: '0 auto 2rem auto' }} />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Comprehensive quarterly projection model for{' '}
              <span style={{ color: '#b45309', fontWeight: '400' }}>gold retailing operations</span>. Track investment growth, sourcing costs, revenue margins, storage and insurance while building predictable wealth through systematic trade cycling.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Button
                  size="lg"
                  className="text-white shadow-2xl border-0 px-8 py-6 text-lg font-light"
                  style={{ background: 'linear-gradient(to right, #b45309, #d97706)', boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.25)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
                  onClick={() => handleAddToCart(1000)}
                >
                  Join Waitlist
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </motion.div>
              <Link to="/research">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-light border-gray-200 dark:border-gray-700 hover:border-[#b45309] dark:hover:border-[#d97706] hover:text-[#b45309] dark:hover:text-[#d97706] transition-all duration-300">
                    View Research
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <span className="text-sm font-light mb-2">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Subtle Horizon Divider */}
      <div className="w-full" style={{ height: '2px', background: 'linear-gradient(to right, transparent 0%, rgba(180, 83, 9, 0.3) 50%, transparent 100%)' }} />

      {/* What is Gold SWIM Section */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                What is Gold SWIM
              </h2>
              <h3 className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                Strategic Wealth Investment Management
              </h3>
              <p className="text-lg font-light text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" style={{ letterSpacing: '0.01em' }}>
                Advanced projection modeling for{' '}
                <span style={{ color: '#b45309', fontWeight: '400' }}>gold retailing operations</span>—our flagship tool enabling systematic value accumulation through strategic trade cycling and margin optimization.
              </p>
              <p className="text-base font-light text-gray-600 dark:text-gray-300 mb-8 leading-relaxed" style={{ letterSpacing: '0.01em' }}>
                Each quarter builds on the last—tracking physical gold procurement, storage costs, retail margins, and realizable gains while our algorithms optimize timing for maximum wealth creation through disciplined trading cycles.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-light text-[#b45309] dark:text-[#f59e0b] mb-1">100%</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Physical Gold</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-1">12-18%</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Target Margins</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-96 rounded-2xl flex items-center justify-center border-2" style={{ background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)', borderColor: 'rgba(180, 83, 9, 0.2)' }}>
                <TrendingUp className="h-32 w-32 text-[#b45309] dark:text-[#f59e0b]" />
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
            --mode-how-bg: linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, transparent 100%);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em' }}>
              Systematic Gold Trading Cycles
            </h2>
            <p className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" style={{ letterSpacing: '0.01em' }}>
              Three integrated flows create predictable wealth—from procurement through retail optimization to compounding reinvestment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { icon: Shield, num: 1, title: "Strategic Procurement", desc: "Quarter begins with optimized gold acquisition—systematic sourcing at favorable pricing through established wholesale channels and vault partnerships" },
              { icon: BarChart3, num: 2, title: "Retail Optimization", desc: "Advanced analytics identify optimal selling windows—capturing maximum retail margins through data-driven timing and market cycle intelligence" },
              { icon: RefreshCcw, num: 3, title: "Value Compounding", desc: "Generated margins fund next quarter's procurement—systematic reinvestment compounds value while maintaining reserve backing and growth trajectory" }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.2 }} className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)' }}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="mb-4">
                  <span className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(180, 83, 9, 0.1)', color: '#b45309', fontWeight: '600' }}>
                    {item.num}
                  </span>
                  <h3 className="mb-3 text-gray-900 dark:text-gray-100" style={{ fontSize: '1.5rem', fontWeight: '500', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300" style={{ fontSize: '0.9375rem', fontWeight: '300', fontFamily: 'Inter, sans-serif', lineHeight: '1.6', letterSpacing: '0.01em' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Comprehensive Analytics
            </h2>
            <h3 className="text-4xl font-light text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em' }}>
              Professional-Grade Gold Retailing Tools
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Quarterly Projections", desc: "Multi-quarter modeling tracks investment growth, sourcing costs, revenue margins, and realizable gains with detailed financial breakdowns" },
              { icon: BarChart3, title: "Detailed Analytics", desc: "Comprehensive cost tracking for storage, insurance, operational expenses—enabling precise margin calculation and profit optimization" },
              { icon: RefreshCcw, title: "Trade Cycling", desc: "Physical gold combined with strategic trade cycling—systematic buy-sell optimization creates predictable value accumulation" },
              { icon: Shield, title: "Risk Management", desc: "Transparent cost modeling and margin tracking—reducing uncertainty through systematic procurement and inventory management" }
            ].map((feature, index) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <Card className="h-full border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(180, 83, 9, 0.1)' }}>
                      <feature.icon className="w-6 h-6 text-[#b45309] dark:text-[#f59e0b]" />
                    </div>
                    <CardTitle className="text-xl font-light text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-light text-gray-600 dark:text-gray-300" style={{ lineHeight: '1.6', letterSpacing: '0.01em' }}>
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-cta-bg)' }}>
        <style>{`
          :root {
            --mode-cta-bg: linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(180, 83, 9, 0.1));
          }
          .dark {
            --mode-cta-bg: linear-gradient(to bottom, rgba(180, 83, 9, 0.08), rgba(217, 119, 6, 0.08));
          }
        `}</style>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em' }}>
            Join the Gold SWIM Waitlist
          </h2>
          <p className="text-lg font-light mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" style={{ letterSpacing: '0.01em', lineHeight: '1.7' }}>
            Be among the first to experience systematic gold retailing optimization—pioneering strategic wealth management through trade cycling intelligence
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-white px-10 py-7 text-lg font-medium"
              style={{ background: 'linear-gradient(to right, #b45309, #d97706)', boxShadow: '0 8px 24px rgba(180, 83, 9, 0.3)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
              onClick={() => handleAddToCart(1000)}
            >
              Join Waitlist ($1,000)
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-light border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10"
              onClick={() => handleAddToCart(5000)}
            >
              Premium Entry ($5,000)
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-[#b45309] dark:hover:text-[#d97706]"
              onClick={openDashboard}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Try Calculator
            </Button>
          </div>

          <p className="text-sm font-light mt-8 text-gray-600 dark:text-gray-400" style={{ letterSpacing: '0.01em' }}>
            Minimum investment: $1,000 • Expected launch: Q2 2025
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8" style={{ background: 'var(--mode-footer-bg)', borderTop: '2px solid var(--mode-footer-border)' }}>
        <style>{`
          :root {
            --mode-footer-bg: linear-gradient(to bottom, rgba(155, 139, 126, 0.15) 0%, rgba(155, 139, 126, 0.25) 100%);
            --mode-footer-border: rgba(155, 139, 126, 0.35);
          }
          .dark {
            --mode-footer-bg: rgba(180, 83, 9, 0.05);
            --mode-footer-border: rgba(180, 83, 9, 0.2);
          }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-light text-gray-700 dark:text-gray-300" style={{ letterSpacing: '0.01em' }}>
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
