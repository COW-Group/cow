import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Coins,
  Plane,
  Milk,
  Wheat,
  Train,
  Wine,
  ArrowRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductMenu } from '../components/product-menu';
import { CartDropdown } from '../components/cart-dropdown';
import { AuthModal } from '../components/auth-modal';
import { ThemeToggle } from '../components/theme-toggle';
import { CopilotSearchBar } from '../components/copilot-search-bar';
import { PWAInstallInstructions } from '../components/pwa-install-instructions';
import cowLogo from '../assets/cow-logo.png';

// COW Token Products
const cowProducts = [
  {
    id: 'ausiri',
    name: 'AuSIRI',
    fullName: 'Gold-Backed Systematic Investment Return Initiative',
    description: 'Pioneering tokenized gold ownership with retail cycle optimization—flagship vertical exploring fractional bullion through systematic margin compounding',
    icon: Coins,
    gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
    iconBg: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
    category: 'Gold Vertical',
    apy: '15-25%',
    status: 'Pre-Launch',
    statusColor: '#b45309',
    statusBg: '#fef3c7',
    link: '/ausiri',
    features: ['100% Gold Backed', 'Retail Cycle Optimization', 'Predictable Returns']
  },
  {
    id: 'auaero',
    name: 'AuAERO',
    fullName: 'Gold-Aerospace Enhanced Return Optimization',
    description: 'Charting new territory in aggressive performance optimization—combining gold stability with commercial aviation returns through financial engineering',
    icon: Plane,
    gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    iconBg: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
    category: 'Aviation Vertical',
    apy: '25-40%',
    status: 'Pre-Launch',
    statusColor: '#1d4ed8',
    statusBg: '#dbeafe',
    link: '/auaero',
    features: ['Hybrid Asset Backing', 'Aviation Performance', 'Aggressive Returns']
  },
  {
    id: 'dairy',
    name: 'Dairy',
    fullName: 'Dairy Production & Distribution Asset Token',
    description: 'Exploring systematic optimization in dairy supply chains—discovering how tokenization transforms agricultural production through infrastructure ownership',
    icon: Milk,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
    iconBg: 'linear-gradient(to bottom right, #60a5fa, #3b82f6)',
    category: 'Agricultural Vertical',
    apy: '12-18%',
    status: 'Coming Soon',
    statusColor: '#1e40af',
    statusBg: '#dbeafe',
    link: '/dairy',
    features: ['Dairy Infrastructure', 'Supply Chain Optimization', 'Steady Income']
  },
  {
    id: 'food',
    name: 'Food',
    fullName: 'Food Supply Chain & Agriculture Asset Token',
    description: 'Navigating agricultural transformation—pioneering tokenized food production with supply chain intelligence and sustainable farming infrastructure',
    icon: Wheat,
    gradient: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)',
    iconBg: 'linear-gradient(to bottom right, #22c55e, #16a34a)',
    category: 'Agricultural Vertical',
    apy: '10-20%',
    status: 'Coming Soon',
    statusColor: '#15803d',
    statusBg: '#dcfce7',
    link: '/food',
    features: ['Food Production', 'Sustainable Agriculture', 'Supply Chain Assets']
  },
  {
    id: 'aurail',
    name: 'AuRail',
    fullName: 'Railway Infrastructure & Operations Asset Token',
    description: 'Charting the future of rail transportation—discovering systematic optimization in railway operations through infrastructure tokenization',
    icon: Train,
    gradient: 'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
    iconBg: 'linear-gradient(to bottom right, #a855f7, #9333ea)',
    category: 'Infrastructure Vertical',
    apy: '18-28%',
    status: 'Coming Soon',
    statusColor: '#7e22ce',
    statusBg: '#f3e8ff',
    link: '/aurail',
    features: ['Railway Infrastructure', 'Cargo Operations', 'Transportation Network']
  },
  {
    id: 'sura',
    name: 'Sura',
    fullName: 'Premium Whiskey Production & Cask Investment Token',
    description: 'Pioneering luxury spirits investment—exploring how premium whiskey cask ownership creates predictable wealth through aging optimization',
    icon: Wine,
    gradient: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)',
    iconBg: 'linear-gradient(to bottom right, #d97706, #92400e)',
    category: 'Luxury Assets Vertical',
    apy: '20-35%',
    status: 'Coming Soon',
    statusColor: '#92400e',
    statusBg: '#fef3c7',
    link: '/sura',
    features: ['Premium Cask Ownership', 'Aging Appreciation', 'Luxury Asset Class']
  }
];

export default function ProductsPage() {
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPWAInstructions, setShowPWAInstructions] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleOpenChat = (query?: string) => {
    console.log('Opening chat with query:', query);
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0; /* Rice Paper */
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
          <div className="hidden lg:flex flex-shrink-0">
            <div className="w-96">
              <CopilotSearchBar onOpenChat={handleOpenChat} />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" onClick={() => setShowPWAInstructions(true)} className="hidden sm:flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200 px-2">
                <Download className="w-4 h-4" />
                <span className="font-light text-sm">Install</span>
              </Button>
            </motion.div>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
            <Button variant="outline" size="sm" className="rounded-full text-gray-900 dark:text-gray-100 transition-all duration-300 hidden md:flex" onClick={() => setShowAuthModal(true)} style={{ background: 'rgba(0, 0, 0, 0.03)', border: '1px solid rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', fontSize: '12px', fontWeight: '300', letterSpacing: '0.01em', padding: '6px 14px', color: '#374151' }}>
              Sign In
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300 hidden lg:flex" style={{ background: 'rgba(0, 0, 0, 0.03)', border: '1px solid rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', fontSize: '12px', fontWeight: '300', letterSpacing: '0.01em', padding: '6px 14px', color: '#374151' }}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <PWAInstallInstructions isOpen={showPWAInstructions} onClose={() => setShowPWAInstructions(false)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8">
        <div className="absolute inset-0" style={{ background: '#ffffff' }} />
        <div className="absolute inset-0 dark:block hidden" style={{ background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <span className="text-xs font-medium px-4 py-2 rounded-full inline-block" style={{ background: 'rgba(0, 102, 255, 0.1)', color: '#0066FF', letterSpacing: '0.02em' }}>
                  PERFORMANCE REAL-WORLD ASSET TOKENS
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Discover
                <br />
                <span style={{ background: 'linear-gradient(to right, #0066FF 0%, #0ea5e9 50%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: '300' }}>
                  COW Asset Tokens
                </span>
              </h1>
              <div style={{ width: '120px', height: '2px', background: 'linear-gradient(to right, transparent 0%, #0066FF 50%, transparent 100%)', margin: '0 auto 2rem auto' }} />
            </div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Exploring systematic optimization across{' '}
              <span style={{ color: '#0066FF', fontWeight: '400' }}>six verticals</span>—from gold and aviation to agriculture, rail, and luxury assets—creating{' '}
              <span className="text-emerald-600 font-normal">predictable wealth</span> through tokenized real-world assets
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Horizon Divider */}
      <div className="w-full" style={{ height: '2px', background: 'linear-gradient(to right, transparent 0%, rgba(0, 102, 255, 0.3) 50%, transparent 100%)' }} />

      {/* Products Grid */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400" style={{ letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              Asset Verticals
            </h2>
            <h3 className="text-4xl font-light text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.02em' }}>
              Six Paths to Performance Optimization
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cowProducts.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <Link to={product.link} className="block group">
                  <Card className="h-full border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header with Gradient */}
                      <div className="p-8 pb-6" style={{ background: `${product.gradient}15` }}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: product.iconBg, boxShadow: `0 8px 24px ${product.statusColor}40` }}>
                            <product.icon className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: product.statusBg, color: product.statusColor }}>
                            {product.status}
                          </span>
                        </div>
                        <h3 className="text-2xl font-light mb-2 text-gray-900 dark:text-gray-100" style={{ letterSpacing: '-0.01em' }}>
                          {product.name}
                        </h3>
                        <p className="text-sm font-light mb-1" style={{ color: product.statusColor }}>
                          {product.category}
                        </p>
                      </div>

                      {/* Content */}
                      <div className="p-8 pt-6">
                        <p className="text-sm font-light text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" style={{ letterSpacing: '0.01em', minHeight: '4.5rem' }}>
                          {product.description}
                        </p>

                        {/* Features */}
                        <div className="space-y-2 mb-6">
                          {product.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: product.statusColor }} />
                              <span className="font-light text-gray-600 dark:text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* APY Badge */}
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs font-light text-gray-500 dark:text-gray-400">Expected APY</span>
                          <span className="text-lg font-light" style={{ color: product.statusColor }}>
                            {product.apy}
                          </span>
                        </div>

                        {/* CTA */}
                        <Button className="w-full group-hover:scale-[1.02] transition-transform duration-300" style={{ background: product.gradient, color: 'white', border: 'none' }}>
                          <span className="font-light">Explore {product.name}</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
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
            --mode-footer-bg: rgba(0, 102, 255, 0.05);
            --mode-footer-border: rgba(0, 102, 255, 0.2);
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
