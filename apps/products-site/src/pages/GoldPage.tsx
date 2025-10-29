import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useCart } from "../contexts/cart-context";
import { GoldPriceProvider, useGoldPriceContext } from "../contexts/gold-price-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { AuthModal } from "../components/auth-modal";
import { ThemeToggle } from "../components/theme-toggle";
import { CopilotSearchBar } from "../components/copilot-search-bar";
import { PWAInstallInstructions } from "../components/pwa-install-instructions";
import { Milestones } from "../components/milestones";
import { OfferingDisclaimer } from "../components/offering-disclaimer";
import { ArrowRight, TrendingUp, Shield, Zap, ChevronDown, Coins, RefreshCcw, Download, DollarSign, Sparkles } from "lucide-react";
import cowLogo from "../assets/cow-logo.png";
import { supabase, type Product } from "@cow/supabase-client";
import { calculateGoldSwimUnitPrice, calculateSiriZ31UnitPrice, formatCurrency } from "../lib/gold-price-calculations";

function GoldPageInner() {
  const { addToCart } = useCart();
  const { spotAsk, eurExchangeRate, loading: priceLoading } = useGoldPriceContext();
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [accessMode, setAccessMode] = useState<"invite" | "waitlist">("invite");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Products state
  const [goldSwimProduct, setGoldSwimProduct] = useState<Product | null>(null);
  const [siriZ31Product, setSiriZ31Product] = useState<Product | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const VALID_INVITE_CODE = "cow-swim-z31-gold";

  useEffect(() => {
    setIsClient(true);
    // Check if user already has access from localStorage
    const storedAccess = localStorage.getItem("gold-invite-access");
    if (storedAccess === "true") {
      setHasAccess(true);
    }

    // Fetch products from Supabase
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch GOLD SWIM product
      const { data: goldSwim, error: goldSwimError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', 'gold-swim')
        .eq('is_active', true)
        .single();

      if (goldSwimError) {
        console.error('Error fetching GOLD SWIM:', goldSwimError);
      } else {
        setGoldSwimProduct(goldSwim);
      }

      // Fetch SIRI Z31 product
      const { data: siriZ31, error: siriZ31Error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', 'siri-z31')
        .eq('is_active', true)
        .single();

      if (siriZ31Error) {
        console.error('Error fetching SIRI Z31:', siriZ31Error);
      } else {
        setSiriZ31Product(siriZ31);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!isClient) {
    return null;
  }

  const handleInviteSubmit = () => {
    if (inviteCode.toLowerCase().trim() === VALID_INVITE_CODE.toLowerCase()) {
      setHasAccess(true);
      setShowInviteModal(false);
      setInviteError("");
      localStorage.setItem("gold-invite-access", "true");
    } else {
      setInviteError("Invalid invite code. Please check and try again.");
    }
  };

  const handleWaitlistSubmit = () => {
    if (!waitlistEmail || !waitlistName) {
      return;
    }
    // Simulate submission
    setWaitlistSuccess(true);
    setTimeout(() => {
      setShowInviteModal(false);
      setWaitlistSuccess(false);
      setWaitlistEmail("");
      setWaitlistName("");
      setAccessMode("invite");
    }, 2000);
  };

  const handleAddToCart = (product: Product, amount: number) => {
    if (!hasAccess) {
      setShowInviteModal(true);
      return;
    }

    const itemName = `${product.name} (${formatCurrency(amount, 'EUR')})`;

    addToCart({
      id: `${product.slug}-${Date.now()}`,
      name: itemName,
      description: product.description || "",
      price: amount,
      link: "/gold",
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

      {/* Access Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border-2"
            style={{ borderColor: 'rgba(180, 83, 9, 0.2)' }}
          >
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-light text-center mb-2 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
                Access Gold Vertical
              </h2>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6 font-light">
                Enter your invite code or join the waitlist for early access
              </p>

              {/* Tab Selection */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAccessMode("invite")}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-light transition-all duration-300"
                  style={{
                    background: accessMode === "invite" ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: accessMode === "invite" ? '#b45309' : '#6b7280',
                    border: accessMode === "invite" ? '1px solid rgba(180, 83, 9, 0.3)' : '1px solid rgba(107, 114, 128, 0.2)'
                  }}
                >
                  Invite Code
                </button>
                <button
                  onClick={() => setAccessMode("waitlist")}
                  className="flex-1 py-2 px-4 rounded-lg text-sm font-light transition-all duration-300"
                  style={{
                    background: accessMode === "waitlist" ? 'rgba(180, 83, 9, 0.1)' : 'transparent',
                    color: accessMode === "waitlist" ? '#b45309' : '#6b7280',
                    border: accessMode === "waitlist" ? '1px solid rgba(180, 83, 9, 0.3)' : '1px solid rgba(107, 114, 128, 0.2)'
                  }}
                >
                  Join Waitlist
                </button>
              </div>

              {/* Invite Code Form */}
              {accessMode === "invite" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value);
                        setInviteError("");
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleInviteSubmit()}
                      placeholder="Enter your invite code"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:border-[#b45309] dark:focus:border-[#d97706] focus:outline-none transition-colors"
                      style={{ letterSpacing: '0.01em' }}
                    />
                    {inviteError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-light">
                        {inviteError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      onClick={() => {
                        setShowInviteModal(false);
                        setInviteCode("");
                        setInviteError("");
                        setAccessMode("invite");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 text-white"
                      style={{ background: 'linear-gradient(to right, #b45309, #d97706)' }}
                      onClick={handleInviteSubmit}
                    >
                      Submit Code
                    </Button>
                  </div>
                </div>
              )}

              {/* Waitlist Form */}
              {accessMode === "waitlist" && (
                <div className="space-y-4">
                  {waitlistSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">
                        You're on the list!
                      </p>
                      <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                        We'll notify you when access is available
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={waitlistName}
                          onChange={(e) => setWaitlistName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:border-[#b45309] dark:focus:border-[#d97706] focus:outline-none transition-colors"
                          style={{ letterSpacing: '0.01em' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleWaitlistSubmit()}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-light focus:border-[#b45309] dark:focus:border-[#d97706] focus:outline-none transition-colors"
                          style={{ letterSpacing: '0.01em' }}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                          onClick={() => {
                            setShowInviteModal(false);
                            setWaitlistEmail("");
                            setWaitlistName("");
                            setAccessMode("invite");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 text-white"
                          style={{ background: 'linear-gradient(to right, #b45309, #d97706)' }}
                          onClick={handleWaitlistSubmit}
                          disabled={!waitlistEmail || !waitlistName}
                        >
                          Join Waitlist
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!waitlistSuccess && (
                <>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-6 font-light">
                    {accessMode === "invite" ? "Have an invite code? Enter it above for immediate access" : "Join the waitlist to be notified when access opens"}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="mailto:support@mycow.io"
                      className="block w-full text-center text-xs font-light text-gray-600 dark:text-gray-400 hover:text-[#b45309] dark:hover:text-[#d97706] transition-colors duration-200"
                    >
                      Need help? Contact support
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section with Sumi-e Sky + Earth Background */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Background gradient layer - Light mode: clean white for text contrast */}
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
              {/* Gold vertical badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="text-xs font-medium px-4 py-2 rounded-full inline-block"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
                    letterSpacing: '0.02em'
                  }}
                >
                  FLAGSHIP GOLD VERTICAL
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Pioneering
                <br />
                <span style={{
                  background: 'linear-gradient(to right, #b45309 0%, #d97706 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '300'
                }}>
                  Self-Optimizing Gold
                </span>
              </h1>
              {/* Deep Cyan logo divider */}
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, transparent 0%, #b45309 50%, transparent 100%)',
                margin: '0 auto 2rem auto'
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Rigorous frameworks for capturing consistent returns from gold operations—providing investors systematic access to{' '}
              <span style={{ color: '#b45309', fontWeight: '400' }}>retail margin opportunities</span> and{' '}
              <span className="text-emerald-600 font-normal">futures market positioning</span> through quarterly modeling and live LBMA pricing
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
                    background: 'linear-gradient(to right, #b45309, #d97706)',
                    boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.25)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
                  onClick={() => setShowInviteModal(true)}
                >
                  <Sparkles className="mr-2 w-5 h-5" />
                  Access Vertical
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Link to="/research">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg font-light border-2 border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10 transition-all duration-300"
                  >
                    View Research
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </Link>
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

      {/* Subtle Horizon Divider - Gold accent */}
      <div
        className="w-full"
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent 0%, rgba(180, 83, 9, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* Gold Vertical Overview Section */}
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
                Gold Vertical
              </h2>
              <h3
                className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
                style={{
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}
              >
                Strategic Wealth Investment Management
              </h3>
              <p
                className="text-lg font-light text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Institutional-grade investment products democratizing access to{' '}
                <span style={{ color: '#b45309', fontWeight: '400' }}>gold retailing margins and futures opportunities</span>—our flagship vertical translating complex precious metal operations into systematic investment frameworks for wealth generation.
              </p>
              <p
                className="text-base font-light text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                GOLD SWIM captures compounding returns from €1.00/gram retail margins over quarterly cycles, while SIRI Z31 provides futures-hedged gold exposure with systematic positioning—two distinct investment products delivering transparent, repeatable strategies for building wealth through precious metals.
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-light text-[#b45309] dark:text-[#f59e0b] mb-1">Live</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">LBMA Pricing</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-1">€1.00</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Margin Per Gram</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div
                className="w-full h-96 rounded-2xl flex items-center justify-center border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                  borderColor: 'rgba(180, 83, 9, 0.2)'
                }}
              >
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
            <h2
              className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
              style={{
                letterSpacing: '-0.02em'
              }}
            >
              Strategic Gold Investment Products
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ letterSpacing: '0.01em' }}
            >
              Two structured investment opportunities—quarterly retailing margins and futures-hedged positions for systematic wealth generation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
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
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                }}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
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
                  Gold SWIM Quarterly Projections
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
                Transform initial capital into compounding quarterly returns—model exactly how €1.00/gram retail margins generate revenue over 65-day cycles with live LBMA pricing, accounting for all costs (operating, custodial, insurance, tax) to project your wealth accumulation trajectory
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
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                }}
              >
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
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
                  SiriZ31 Futures Analysis
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
                Eliminate futures trading guesswork—calculate precise margin requirements, identify optimal exit prices, and value contract positions before committing capital, enabling confident derivatives decisions through systematic risk quantification
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
              Flagship Vertical Features
            </h2>
            <h3
              className="text-4xl font-light text-gray-900 dark:text-gray-100"
              style={{ letterSpacing: '-0.02em' }}
            >
              Discovering Performance in Precious Metals
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Live LBMA Pricing",
                description: "Real-time spot price integration for accurate gold valuation and sourcing cost calculations—ensuring projections reflect current market conditions"
              },
              {
                icon: RefreshCcw,
                title: "Quarterly Projection Modeling",
                description: "Systematic 65-day cycle analysis incorporating margins, operating costs, and tax obligations—providing complete visibility into wealth accumulation trajectories"
              },
              {
                icon: Coins,
                title: "Margin Compounding Framework",
                description: "Reinvestment strategies that transform quarterly gains into additional gold acquisition—modeling how €1.00/gram retail margins compound over time"
              },
              {
                icon: DollarSign,
                title: "Futures Position Calculator",
                description: "Precise margin requirements and exit price modeling for derivatives positions—eliminating guesswork in gold futures trading decisions"
              },
              {
                icon: Zap,
                title: "Multi-Scenario Analysis",
                description: "Conservative, moderate, and optimistic financial models for risk assessment—enabling investors to stress-test assumptions and understand outcomes"
              },
              {
                icon: Shield,
                title: "Transparent Cost Accounting",
                description: "Complete visibility into operating expenses, custodial fees, insurance, and tax impacts—no hidden costs in your projection models"
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
                        background: 'rgba(180, 83, 9, 0.1)'
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-[#b45309] dark:text-[#f59e0b]" />
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

      {/* Milestones / Timeline Section */}
      <Milestones tokenType="ausiri" />

      {/* Gold Vertical Products Section */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Flagship Gold Vertical
            </h2>
            <h3 className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Choose Your Gold Strategy
            </h3>
            <p className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" style={{ letterSpacing: '0.01em' }}>
              Two structured investment products—each engineered for specific strategies within our flagship gold vertical
            </p>
          </div>

          {loadingProducts ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#b45309] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Gold SWIM Card */}
            {goldSwimProduct && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Card className="h-full border-2 border-[#b45309]/20 dark:border-[#d97706]/20 bg-white dark:bg-gray-800/50 hover:shadow-xl hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)' }}>
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-light text-center text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
                      {goldSwimProduct.name}
                    </CardTitle>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-light mt-2">
                      {goldSwimProduct.ticker_symbol} • Security Token
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-light text-gray-600 dark:text-gray-300 leading-relaxed text-center" style={{ letterSpacing: '0.01em' }}>
                      {goldSwimProduct.description}
                    </p>
                    <div className="pt-4 space-y-2">
                      {goldSwimProduct.projected_annual_return && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-light">Projected APY</span>
                          <span className="text-emerald-600 dark:text-emerald-500 font-medium">{goldSwimProduct.projected_annual_return}%</span>
                        </div>
                      )}
                      {spotAsk && eurExchangeRate && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-light">Unit Price (Live)</span>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {priceLoading ? 'Loading...' : formatCurrency(calculateGoldSwimUnitPrice(spotAsk, eurExchangeRate), 'EUR')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-light">Min. Investment (1 unit)</span>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {priceLoading ? 'Loading...' : formatCurrency(calculateGoldSwimUnitPrice(spotAsk, eurExchangeRate), 'EUR')}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-light">Status</span>
                        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: goldSwimProduct.is_active ? 'rgb(220, 252, 231)' : 'rgb(254, 202, 202)', color: goldSwimProduct.is_active ? 'rgb(21, 128, 61)' : 'rgb(153, 27, 27)' }}>
                          {goldSwimProduct.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 space-y-2">
                      <Link to="/gold-swim">
                        <Button variant="outline" className="w-full border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10">
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/gold" className="w-full">
                        <Button
                          className="w-full text-white"
                          style={{ background: 'linear-gradient(to right, #b45309, #d97706)' }}
                        >
                          Access Vertical <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* SiriZ31 Card with Tiers */}
            {siriZ31Product && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                <Card className="h-full border-2 border-[#b45309]/20 dark:border-[#d97706]/20 bg-white dark:bg-gray-800/50 hover:shadow-xl hover:border-[#b45309]/40 dark:hover:border-[#d97706]/40 transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)', boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)' }}>
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-light text-center text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
                      {siriZ31Product.name}
                    </CardTitle>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-light mt-2">
                      {siriZ31Product.ticker_symbol} • Trading Platform
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm font-light text-gray-600 dark:text-gray-300 leading-relaxed text-center" style={{ letterSpacing: '0.01em' }}>
                      {siriZ31Product.description}
                    </p>

                    <div className="pt-4 space-y-2">
                      {spotAsk && eurExchangeRate && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-light">Unit Price (Live)</span>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {priceLoading ? 'Loading...' : formatCurrency(calculateSiriZ31UnitPrice(spotAsk, eurExchangeRate), 'EUR')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-light">Min. Investment (1 unit)</span>
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {priceLoading ? 'Loading...' : formatCurrency(calculateSiriZ31UnitPrice(spotAsk, eurExchangeRate), 'EUR')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center pt-2">
                            2.25B Units in Offering • Hedged by gold futures
                          </div>
                        </>
                      )}
                      <div className="flex items-center justify-between text-sm pt-2">
                        <span className="text-gray-600 dark:text-gray-400 font-light">Status</span>
                        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: siriZ31Product.is_active ? 'rgb(220, 252, 231)' : 'rgb(254, 202, 202)', color: siriZ31Product.is_active ? 'rgb(21, 128, 61)' : 'rgb(153, 27, 27)' }}>
                          {siriZ31Product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Link to="/siriz31">
                        <Button variant="outline" className="w-full border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10">
                          Learn More <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to="/gold" className="w-full">
                        <Button
                          className="w-full text-white"
                          style={{ background: 'linear-gradient(to right, #b45309, #d97706)' }}
                        >
                          Access Vertical <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          )}

          {/* Legal Disclaimer */}
          <div className="mt-16 max-w-4xl mx-auto">
            <OfferingDisclaimer />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-32 px-8"
        style={{
          background: 'var(--mode-cta-bg)'
        }}
      >
        <style>{`
          :root {
            --mode-cta-bg: linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(180, 83, 9, 0.1));
          }
          .dark {
            --mode-cta-bg: linear-gradient(to bottom, rgba(180, 83, 9, 0.08), rgba(217, 119, 6, 0.08));
          }
        `}</style>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Start Your Gold Journey
          </h2>
          <p
            className="text-lg font-light mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            style={{
              letterSpacing: '0.01em',
              lineHeight: '1.7'
            }}
          >
            Access the same analytical rigor institutional investors demand—model your quarterly gold retailing returns with Gold SWIM or optimize your futures positioning with SiriZ31
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/gold-swim">
              <Button
                size="lg"
                className="text-white px-10 py-7 text-lg font-medium"
                style={{
                  background: 'linear-gradient(to right, #b45309, #d97706)',
                  boxShadow: '0 8px 24px rgba(180, 83, 9, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
              >
                Explore Gold SWIM
              </Button>
            </Link>
            <Link to="/siriz31">
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-7 text-lg font-light border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10"
              >
                Explore SiriZ31
              </Button>
            </Link>
          </div>

          <p
            className="text-sm font-light mt-8 text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.01em'
            }}
          >
            Structured investment products delivering systematic gold exposure through retailing margins and futures positioning
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
            --mode-footer-bg: rgba(180, 83, 9, 0.05);
            --mode-footer-border: rgba(180, 83, 9, 0.2);
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

export default function GoldPage() {
  return (
    <GoldPriceProvider>
      <GoldPageInner />
    </GoldPriceProvider>
  );
}
