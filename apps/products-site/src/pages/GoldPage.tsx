import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useCart } from "../contexts/cart-context";
import { GoldPriceProvider, useGoldPriceContext } from "../contexts/gold-price-context";
import { useAuthContext } from "../lib/auth-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { AuthModal } from "../components/auth-modal";
import { ThemeToggle } from "../components/theme-toggle";
import { CopilotSearchBar } from "../components/copilot-search-bar";
import { PWAInstallInstructions } from "../components/pwa-install-instructions";
import { Milestones } from "../components/milestones";
import { OfferingDisclaimer } from "../components/offering-disclaimer";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  PieChart,
  Calculator,
  Coins,
  DollarSign,
  Target,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Info,
  ChevronDown,
  Download,
  Zap,
  RefreshCcw
} from "lucide-react";
import cowLogo from "../assets/cow-logo.png";
import { supabase, type Product } from "@/lib/supabase";
import { formatCurrency } from "../lib/gold-price-calculations";

// Product allocation interface
interface ProductAllocation {
  id: string;
  product_id: string;
  component_name: string;
  allocation_percent: number;
  description: string | null;
  calculator_path: string | null;
  is_active: boolean;
  display_order: number;
}

function GoldPageInner() {
  const { addToCart } = useCart();
  const { spotAsk, eurExchangeRate, loading: priceLoading } = useGoldPriceContext();
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Access modal states
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [accessMode, setAccessMode] = useState<"invite" | "waitlist">("invite");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Products state
  const [myGoldProduct, setMyGoldProduct] = useState<Product | null>(null);
  const [myGoldAllocations, setMyGoldAllocations] = useState<ProductAllocation[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const VALID_INVITE_CODE = "cow-mygold-2025";

  useEffect(() => {
    setIsClient(true);
    // Check if user already has access from localStorage
    const storedAccess = localStorage.getItem("gold-invite-access");
    if (storedAccess === "true") {
      setHasAccess(true);
    }
    fetchMyGoldProduct();
  }, []);

  const fetchMyGoldProduct = async () => {
    try {
      // Fetch MyGOLD product
      const myGoldResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.mygold&is_active=eq.true&select=*`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (myGoldResponse.ok) {
        const myGoldData = await myGoldResponse.json();
        if (myGoldData && myGoldData.length > 0) {
          const myGold = myGoldData[0];
          setMyGoldProduct(myGold);

          // Fetch MyGOLD allocations
          const allocationsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/product_allocations?product_id=eq.${myGold.id}&is_active=eq.true&select=*&order=display_order.asc`,
            {
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                'Content-Type': 'application/json'
              }
            }
          );

          if (allocationsResponse.ok) {
            const allocationsData = await allocationsResponse.json();
            if (allocationsData) {
              setMyGoldAllocations(allocationsData);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching MyGOLD product:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: Product, amount: number) => {
    const itemName = `${product.name} (${formatCurrency(amount, 'EUR')})`;

    addToCart({
      id: `${product.slug}-${Date.now()}`,
      name: itemName,
      description: product.description || "",
      price: amount,
      link: "/gold",
    });
  };

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

  const handleOpenChat = (query?: string) => {
    console.log("Opening chat with query:", query);
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #ffffff; /* Clean white - 4d1f094 style */
        }
        .dark {
          --mode-bg: #0a1628; /* Navy Deep */
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
              <img src={cowLogo} alt="COW Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100" style={{ letterSpacing: '0.02em', fontWeight: '300' }}>
                COW
              </span>
            </Link>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <ProductMenu />
            <CartDropdown />
          </div>

          {/* Center - Copilot Search */}
          <div className="flex-1 flex justify-center px-4">
            <CopilotSearchBar onOpenChat={handleOpenChat} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPWAInstructions(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              title="Install App"
            >
              <Download className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            {auth.isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 dark:text-gray-300"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-white"
                style={{
                  background: 'linear-gradient(to right, #b45309, #d97706)',
                  fontSize: '12px',
                  fontWeight: '300'
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - 4d1f094 Style */}
        <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full">
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
                  Performance
                  <br />
                  <span style={{
                    background: 'linear-gradient(to right, #b45309 0%, #d97706 50%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '300'
                  }}>
                    MyGOLD
                  </span>
                </h1>
                {/* Gold divider */}
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
                Systematic research into{' '}
                <span style={{ color: '#b45309', fontWeight: '400' }}>gold market alpha generation</span>—discovering how{' '}
                <span className="text-emerald-600 font-normal">quarterly accumulation cycles</span>, derivatives positioning, and{' '}
                <span style={{ color: '#0066FF', fontWeight: '400' }}>algorithmic rebalancing</span>{' '}
                transform precious metals into{' '}
                <span className="text-amber-600 font-normal">compounding wealth engines</span>
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
                      className="px-8 py-6 text-lg font-light border-2 text-gray-700 dark:text-gray-300 transition-all duration-300"
                      style={{
                        borderColor: 'rgba(180, 83, 9, 0.3)'
                      }}
                    >
                      View Research
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Product Metrics */}
              {loadingProducts ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center py-12 mt-12"
                >
                  <div
                    className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: '#d97706', borderTopColor: 'transparent' }}
                  ></div>
                </motion.div>
              ) : myGoldProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
                >
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Target className="w-5 h-5" style={{ color: '#b45309' }} />
                    <span className="font-light">{myGoldProduct.projected_annual_return}% Target APY</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700" />
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <DollarSign className="w-5 h-5" style={{ color: '#b45309' }} />
                    <span className="font-light">Min. {formatCurrency(myGoldProduct.min_investment || 1000, 'EUR')}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-700" />
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Shield className="w-5 h-5" style={{ color: '#b45309' }} />
                    <span className="font-light">Ticker: {myGoldProduct.ticker_symbol}</span>
                  </div>
                </motion.div>
              )}

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="cursor-pointer"
                  onClick={() => {
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <ChevronDown
                    className="w-8 h-8 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Gold Horizon Divider */}
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
            {/* Section Header */}
            <div className="text-center mb-16">
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
                className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Where institutional sophistication meets accessible execution. MyGOLD represents the convergence of{' '}
                <span style={{ color: '#b45309', fontWeight: '400' }}>quantitative trading methodologies</span>, real-time LBMA pricing, and multi-scenario financial modeling
              </p>
            </div>

            {/* Visual Portfolio Allocation */}
            <div className="mb-16">
              <h4 className="text-center text-sm font-semibold text-gray-900 dark:text-gray-100 mb-8 uppercase tracking-wider">
                Portfolio Composition
              </h4>

              {/* Visual Bars */}
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Gold Assets - 33.33% */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-20 text-right">
                      <span className="text-2xl font-light text-[#b45309]">33.33%</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-xl relative overflow-hidden" style={{
                        background: 'linear-gradient(to right, rgba(180, 83, 9, 0.15), rgba(217, 119, 6, 0.08))',
                        border: '1px solid rgba(180, 83, 9, 0.2)'
                      }}>
                        <div className="absolute inset-0 flex items-center px-6">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Gold Assets</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-light">
                              25% Physical Retail • 8.33% COMEX Futures (316 contracts)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cash Reserves - 13.33% */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-20 text-right">
                      <span className="text-2xl font-light text-emerald-600">13.33%</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-xl relative overflow-hidden" style={{
                        background: 'linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <div className="absolute inset-0 flex items-center px-6">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Cash Reserves</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-light">
                              Tactical liquidity for rebalancing and operational flexibility
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Diversified RWAs - 53.34% */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-20 text-right">
                      <span className="text-2xl font-light text-blue-600">53.34%</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-16 rounded-xl relative overflow-hidden" style={{
                        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                      }}>
                        <div className="absolute inset-0 flex items-center px-6">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Diversified RWAs</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-light">
                              Water, Food, Dairy, Alternative Assets
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto font-light leading-relaxed">
                Multi-asset framework engineered to capture gold market alpha while mitigating single-commodity concentration risk through strategic allocation to uncorrelated physical asset classes
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl" style={{
                  background: 'rgba(180, 83, 9, 0.05)',
                  border: '1px solid rgba(180, 83, 9, 0.15)'
                }}
              >
                <div className="text-3xl font-light text-[#b45309] dark:text-[#f59e0b] mb-2">Live</div>
                <div className="text-sm font-light text-gray-600 dark:text-gray-400">LBMA Pricing</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center p-6 rounded-2xl" style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
                }}
              >
                <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-2">{myGoldProduct?.projected_annual_return}%</div>
                <div className="text-sm font-light text-gray-600 dark:text-gray-400">Target APY</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center p-6 rounded-2xl" style={{
                  background: 'rgba(180, 83, 9, 0.05)',
                  border: '1px solid rgba(180, 83, 9, 0.15)'
                }}
              >
                <div className="text-3xl font-light text-[#b45309] dark:text-[#f59e0b] mb-2">65</div>
                <div className="text-sm font-light text-gray-600 dark:text-gray-400">Day Cycles</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center p-6 rounded-2xl" style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
                }}
              >
                <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-2">316</div>
                <div className="text-sm font-light text-gray-600 dark:text-gray-400">COMEX Contracts</div>
              </motion.div>
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
                Quantitative Precision Meets Market Opportunity
              </h2>
              <p
                className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
                style={{ letterSpacing: '0.01em' }}
              >
                Two complementary analytical engines—one modeling quarterly accumulation dynamics, the other optimizing derivatives positioning—working in concert to transform gold market inefficiencies into systematic, compounding returns
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
                  <Calculator className="w-10 h-10 text-white" />
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
                    Accumulation Engine
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
                  Proprietary modeling framework projecting wealth trajectories across 65-day cycles. Calculates precise sourcing costs from live LBMA spot prices, models retailing margins, accounts for operating expenses (storage, insurance, custody), applies effective tax rates, and compounds net gains into exponentially growing gold positions—with conservative, moderate, and optimistic scenarios revealing your complete risk-return profile
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
                    Derivatives Optimization
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
                  COMEX Gold Futures positioning engine calculating exit prices through compound interest formulas, determining precise margin requirements (8% of contract value for 316 contracts totaling 31,600 ounces), and projecting returns across multi-year periods. Eliminates derivatives guesswork through systematic valuation of futures positions, enabling confident allocation decisions backed by quantified risk-return metrics and annualized CAGR projections
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
                Institutional Infrastructure, Democratized Access
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
                  description: "Systematic cycle analysis incorporating margins, operating costs, and tax obligations—providing complete visibility into wealth accumulation trajectories"
                },
                {
                  icon: Coins,
                  title: "Margin Compounding Framework",
                  description: "Reinvestment strategies that transform quarterly gains into additional gold acquisition—modeling how systematic margins compound over time"
                },
                {
                  icon: DollarSign,
                  title: "Position Calculator",
                  description: "Precise margin requirements and strategy modeling for investment positions—eliminating guesswork in gold investment decisions"
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

        {/* Milestones */}
        <Milestones tokenType="ausiri" />

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
              Where Quantitative Rigor Meets Accessible Execution
            </h2>
            <p
              className="text-lg font-light mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              style={{
                letterSpacing: '0.01em',
                lineHeight: '1.7'
              }}
            >
              The same derivatives modeling, cost accounting frameworks, and algorithmic rebalancing that power institutional portfolios—now engineered for systematic wealth accumulation at any scale. Live LBMA pricing. Multi-scenario projections. Transparent compounding mechanics. No guesswork. Just mathematics working in your favor, quarter after quarter.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="text-white px-10 py-7 text-lg font-medium"
                style={{
                  background: 'linear-gradient(to right, #b45309, #d97706)',
                  boxShadow: '0 8px 24px rgba(180, 83, 9, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
                onClick={() => setShowInviteModal(true)}
              >
                Access Vertical
              </Button>
              <Link to="/research">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 text-lg font-light border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10"
                >
                  View Research
                </Button>
              </Link>
            </div>

            <p
              className="text-sm font-light mt-8 text-gray-600 dark:text-gray-400"
              style={{
                letterSpacing: '0.01em'
              }}
            >
              Structured investment products delivering systematic gold exposure through strategic positioning
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-8 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-light text-gray-600 dark:text-gray-400">
            <strong>My Gold Grams Inc.</strong> is an independent company. Securities offered by My Gold Grams Inc.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            For information contact <a href="mailto:ir@mygoldgrams.com" className="text-amber-700 dark:text-amber-500 hover:underline">ir@mygoldgrams.com</a>
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* PWA Install Instructions Modal */}
      <PWAInstallInstructions isOpen={showPWAInstructions} onClose={() => setShowPWAInstructions(false)} />

      {/* Access Vertical Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] px-4"
          onClick={() => setShowInviteModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              border: '1px solid rgba(180, 83, 9, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.25)'
            }}
          >
            {/* Header with Icon */}
            <div
              className="px-8 pt-8 pb-6 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
                borderBottom: '1px solid rgba(180, 83, 9, 0.1)'
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 32px rgba(180, 83, 9, 0.3)'
                }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100 mb-2">
                Access MyGOLD Vertical
              </h2>
              <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                Enter your invite code or join the waitlist
              </p>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setAccessMode("invite")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  accessMode === "invite"
                    ? "text-gray-900 dark:text-gray-100 border-b-2"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                style={{
                  borderBottomColor: accessMode === "invite" ? "#b45309" : "transparent"
                }}
              >
                Invite Code
              </button>
              <button
                onClick={() => setAccessMode("waitlist")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  accessMode === "waitlist"
                    ? "text-gray-900 dark:text-gray-100 border-b-2"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                style={{
                  borderBottomColor: accessMode === "waitlist" ? "#b45309" : "transparent"
                }}
              >
                Join Waitlist
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {accessMode === "invite" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value);
                        setInviteError("");
                      }}
                      placeholder="Enter your invite code"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 transition-all"
                      style={{
                        fontSize: '15px',
                        fontWeight: '300'
                      }}
                    />
                    {inviteError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-light">
                        {inviteError}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    Don't have an invite code?{" "}
                    <button
                      onClick={() => setAccessMode("waitlist")}
                      className="text-amber-700 dark:text-amber-500 hover:underline"
                    >
                      Join the waitlist
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!waitlistSuccess ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={waitlistName}
                          onChange={(e) => setWaitlistName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 transition-all"
                          style={{
                            fontSize: '15px',
                            fontWeight: '300'
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 transition-all"
                          style={{
                            fontSize: '15px',
                            fontWeight: '300'
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                        Already have a code?{" "}
                        <button
                          onClick={() => setAccessMode("invite")}
                          className="text-amber-700 dark:text-amber-500 hover:underline"
                        >
                          Enter it here
                        </button>
                      </p>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        You're on the list!
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                        We'll notify you when access becomes available.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {!waitlistSuccess && (
              <div
                className="px-8 pb-8 flex gap-3"
              >
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={accessMode === "invite" ? handleInviteSubmit : handleWaitlistSubmit}
                  disabled={accessMode === "invite" ? !inviteCode : !waitlistEmail || !waitlistName}
                  className="flex-1 py-3 rounded-xl text-white font-light border-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                    boxShadow: '0 4px 12px rgba(180, 83, 9, 0.3)'
                  }}
                >
                  {accessMode === "invite" ? "Submit Code" : "Join Waitlist"}
                </Button>
              </div>
            )}

            {/* Support Link */}
            <div className="px-8 pb-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
                Need help?{" "}
                <a
                  href="mailto:support@mygoldgrams.com"
                  className="text-amber-700 dark:text-amber-500 hover:underline"
                >
                  Contact support
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
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
