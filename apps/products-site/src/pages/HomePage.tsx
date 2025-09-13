import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, Shield, TrendingUp, Coins, Wallet, Plane, Star, CheckCircle, Clock, Circle } from "lucide-react"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { HeroBackground } from "../components/hero-background"
import { AuthModal } from "../components/auth-modal"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTechModal, setShowTechModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation - Square Dark Liquid Glass Container */}
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
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px'
              }}
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

      {/* Hero Section - Apple Engineering Precision */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        {/* Apple Engineering Content Architecture */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-8">
          {/* Apple Typography Engineering */}
          <h1 
            className="mb-12 text-white"
            style={{
              fontSize: 'clamp(4.5rem, 9vw, 9.5rem)',
              fontWeight: '200',
              letterSpacing: '-0.025em',
              lineHeight: '0.82',
              marginBottom: '3rem',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Cycles of Wealth
          </h1>
          
          {/* Simplified Product Description */}
          <div className="max-w-4xl mx-auto mb-16">
            <p 
              className="text-white"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.4',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)'
              }}
            >
              The world's first performance real world asset tokens backed by gold and optimized assets.
            </p>
          </div>
          
          {/* Advanced Apple Liquid Glass CTAs */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            {/* Explore Tokens - Light Mode Liquid Glass */}
            <button 
              className="group relative overflow-hidden px-12 py-6 font-medium transition-all duration-500"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(25px) saturate(180%) brightness(110%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                fontSize: '1.125rem',
                fontWeight: '500',
                letterSpacing: '0.005em',
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.backdropFilter = 'blur(30px) saturate(200%) brightness(120%)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.2), 0 12px 40px rgba(255, 255, 255, 0.25), 0 6px 24px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.backdropFilter = 'blur(25px) saturate(180%) brightness(110%)'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Liquid refraction effect */}
              <div 
                className="absolute inset-0 rounded-20px opacity-30 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
                  filter: 'blur(0.5px)',
                  borderRadius: '20px'
                }}
              ></div>
              <span className="relative flex items-center gap-3">
                Explore Tokens
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            
            {/* Learn More - Dark Mode Liquid Glass */}
            <button 
              className="group relative overflow-hidden px-12 py-6 font-medium transition-all duration-500"
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(25px) saturate(120%) brightness(80%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                fontSize: '1.125rem',
                fontWeight: '400',
                letterSpacing: '0.005em',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.35)'
                e.currentTarget.style.backdropFilter = 'blur(30px) saturate(140%) brightness(90%)'
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.4), 0 12px 40px rgba(0, 0, 0, 0.3), 0 6px 24px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'
                e.currentTarget.style.backdropFilter = 'blur(25px) saturate(120%) brightness(80%)'
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Dark liquid refraction effect */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
                  filter: 'blur(0.5px)',
                  borderRadius: '20px'
                }}
              ></div>
              <span className="relative">
                Learn More
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Apple-Level Product Showcase */}
      <section 
        className="py-32 px-8" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.9) 25%, rgba(251, 246, 236, 0.85) 50%, rgba(255, 255, 255, 0.9) 75%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(60px) saturate(150%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 
              className="mb-8 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: '200',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Revolutionary Asset Engineering
            </h2>
            <p 
              className="text-gray-600 max-w-4xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.2vw, 1.5rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5'
              }}
            >
              Experience the future of wealth creation through COW's performance real-world asset tokens,{' '}
              designed for institutional sophistication and retail accessibility.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* AuSIRI Card - Advanced Liquid Glass */}
            <div className="group">
              <div 
                className="p-8 rounded-3xl transition-all duration-500 group-hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 16px 64px rgba(245, 158, 11, 0.15), 0 4px 16px rgba(245, 158, 11, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(245, 158, 11))',
                      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    <Coins className="w-7 h-7 text-gray-900 drop-shadow-sm" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <span 
                    className="text-xs px-3 py-1 rounded-full font-medium tracking-wide"
                    style={{
                      background: 'rgba(251, 243, 201, 0.8)',
                      color: 'rgb(180, 83, 9)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Pre-Launch
                  </span>
                </div>
                
                <h3 className="text-3xl font-light tracking-tight text-gray-900 mb-3">
                  AuSIRI
                </h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                  Gold-backed Systematic Investment Return Initiative. Pure gold-backed token with retail cycle optimization, 
                  delivering predictable 15-25% APY through proprietary market timing algorithms.
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500 font-light">Starting at $1,000</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-green-400 font-light">Available</span>
                  </div>
                </div>
                
                <Link to="/ausiri" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors group-hover:translate-x-1 transition-transform duration-300">
                  <span className="font-light tracking-wide">Explore AuSIRI</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* AuAERO Card - Advanced Liquid Glass */}
            <div className="group">
              <div 
                className="p-8 rounded-3xl transition-all duration-500 group-hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 16px 64px rgba(251, 146, 60, 0.15), 0 4px 16px rgba(251, 146, 60, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgb(251, 146, 60), rgb(239, 68, 68))',
                      boxShadow: '0 8px 32px rgba(251, 146, 60, 0.4), 0 4px 16px rgba(251, 146, 60, 0.2)'
                    }}
                  >
                    <Plane className="w-7 h-7 text-gray-900 drop-shadow-sm" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <span 
                    className="text-xs px-3 py-1 rounded-full font-medium tracking-wide"
                    style={{
                      background: 'rgba(255, 237, 213, 0.8)',
                      color: 'rgb(194, 65, 12)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    Pre-Launch
                  </span>
                </div>
                
                <h3 className="text-3xl font-light tracking-tight text-gray-900 mb-3">
                  AuAERO
                </h3>
                <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                  Gold-Aerospace Enhanced Return Optimization. Hybrid token backed by gold and commercial airline assets, 
                  targeting 25-40% APY through advanced financial engineering and aviation partnerships.
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500 font-light">Starting at $5,000</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-orange-400 font-light">Coming Soon</span>
                  </div>
                </div>
                
                <Link to="/auaero" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 transition-transform duration-300">
                  <span className="font-light tracking-wide">Explore AuAERO</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Apple-Level Technical Depth Sections */}
          
          {/* AuSIRI Technical Deep Dive */}
          <section className="mt-24">
            <div className="text-center mb-16">
              <h3 
                className="mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '200',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.1'
                }}
              >
                AuSIRI Technical Architecture
              </h3>
              <p 
                className="text-gray-600 max-w-3xl mx-auto"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '300',
                  letterSpacing: '0.01em',
                  lineHeight: '1.5'
                }}
              >
                Systematic Investment Return Initiative powered by advanced algorithmic optimization
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {/* Algorithm Engine */}
              <div 
                className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                
                <h4 
                  className="text-center text-gray-900 mb-4"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em'
                  }}
                >
                  Cycle Detection Engine
                </h4>
                
                <div className="space-y-4 text-center">
                  <div 
                    className="text-3xl font-light text-orange-600 mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    15ms
                  </div>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    Market cycle detection latency using proprietary ML algorithms trained on 50+ years of gold market data
                  </p>
                  
                  <div className="border-t pt-4 mt-4" style={{ borderColor: 'rgba(245, 158, 11, 0.1)' }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Algorithm Accuracy:</span>
                      <span className="text-gray-900 font-medium">94.3%</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Training Dataset:</span>
                      <span className="text-gray-900 font-medium">2.1M data points</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gold Reserve System */}
              <div 
                className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  boxShadow: '0 8px 32px rgba(251, 191, 36, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    boxShadow: '0 4px 16px rgba(251, 191, 36, 0.3)'
                  }}
                >
                  <Coins className="w-8 h-8 text-white" />
                </div>
                
                <h4 
                  className="text-center text-gray-900 mb-4"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em'
                  }}
                >
                  Reserve Architecture
                </h4>
                
                <div className="space-y-4 text-center">
                  <div 
                    className="text-3xl font-light text-yellow-600 mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    1,000oz
                  </div>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    LBMA-certified gold reserves held in allocated accounts with real-time blockchain verification
                  </p>
                  
                  <div className="border-t pt-4 mt-4" style={{ borderColor: 'rgba(251, 191, 36, 0.1)' }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Storage Location:</span>
                      <span className="text-gray-900 font-medium">London Vaults</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Insurance Coverage:</span>
                      <span className="text-gray-900 font-medium">Lloyd's of London</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div 
                className="p-8 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(45, 74, 107, 0.2)',
                  boxShadow: '0 8px 32px rgba(45, 74, 107, 0.1)'
                }}
              >
                <div 
                  className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #2d4a6b, #3b82f6)',
                    boxShadow: '0 4px 16px rgba(45, 74, 107, 0.3)'
                  }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </div>
                
                <h4 
                  className="text-center text-gray-900 mb-4"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em'
                  }}
                >
                  Risk Management
                </h4>
                
                <div className="space-y-4 text-center">
                  <div 
                    className="text-3xl font-light text-blue-600 mb-2"
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '200',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    5.2%
                  </div>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    Maximum drawdown through Monte Carlo simulation across 10,000 market scenarios
                  </p>
                  
                  <div className="border-t pt-4 mt-4" style={{ borderColor: 'rgba(45, 74, 107, 0.1)' }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sharpe Ratio:</span>
                      <span className="text-gray-900 font-medium">2.87</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Volatility:</span>
                      <span className="text-gray-900 font-medium">8.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* AuAERO Advanced Specifications */}
          <section className="mt-24">
            <div className="text-center mb-16">
              <h3 
                className="mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '200',
                  letterSpacing: '-0.015em',
                  lineHeight: '1.1'
                }}
              >
                AuAERO Hybrid Asset Engineering
              </h3>
              <p 
                className="text-gray-600 max-w-3xl mx-auto"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontWeight: '300',
                  letterSpacing: '0.01em',
                  lineHeight: '1.5'
                }}
              >
                Gold + Aerospace Enhanced Return Optimization through advanced financial engineering
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Asset Composition */}
              <div 
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(240, 114, 13, 0.2)',
                  boxShadow: '0 8px 32px rgba(240, 114, 13, 0.1)'
                }}
              >
                <div className="flex items-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl mr-4 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #f0720d, #ea580c)',
                      boxShadow: '0 4px 16px rgba(240, 114, 13, 0.25)'
                    }}
                  >
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <h4 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '500',
                      letterSpacing: '-0.005em'
                    }}
                  >
                    Aviation Fleet Portfolio
                  </h4>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div 
                        className="text-2xl font-light text-orange-600 mb-1"
                        style={{ fontWeight: '200', letterSpacing: '-0.01em' }}
                      >
                        2
                      </div>
                      <div className="text-xs text-gray-600 font-medium">A380 Aircraft</div>
                    </div>
                    <div>
                      <div 
                        className="text-2xl font-light text-orange-600 mb-1"
                        style={{ fontWeight: '200', letterSpacing: '-0.01em' }}
                      >
                        20
                      </div>
                      <div className="text-xs text-gray-600 font-medium">A320-321 XLR</div>
                    </div>
                    <div>
                      <div 
                        className="text-2xl font-light text-orange-600 mb-1"
                        style={{ fontWeight: '200', letterSpacing: '-0.01em' }}
                      >
                        50
                      </div>
                      <div className="text-xs text-gray-600 font-medium">UDAN Routes</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4" style={{ borderColor: 'rgba(240, 114, 13, 0.1)' }}>
                    <h5 className="text-gray-900 font-medium mb-3">Performance Metrics</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fleet Utilization Rate:</span>
                        <span className="text-gray-900 font-medium">87.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Load Factor:</span>
                        <span className="text-gray-900 font-medium">89.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue Per Flight Hour:</span>
                        <span className="text-gray-900 font-medium">$4,230</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Flight Hours:</span>
                        <span className="text-gray-900 font-medium">156,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tokenomics Architecture */}
              <div 
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  boxShadow: '0 8px 32px rgba(251, 191, 36, 0.1)'
                }}
              >
                <div className="flex items-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl mr-4 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      boxShadow: '0 4px 16px rgba(251, 191, 36, 0.25)'
                    }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '500',
                      letterSpacing: '-0.005em'
                    }}
                  >
                    Hybrid Token Structure
                  </h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="text-gray-900 font-medium mb-3">Asset Allocation</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded" style={{ background: '#fbbf24' }}></div>
                          <span className="ml-2 text-gray-700 text-sm">Gold Reserves</span>
                        </div>
                        <span className="text-gray-900 font-medium">40%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded" style={{ background: '#f0720d' }}></div>
                          <span className="ml-2 text-gray-700 text-sm">Aviation Assets</span>
                        </div>
                        <span className="text-gray-900 font-medium">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded" style={{ background: '#3b82f6' }}></div>
                          <span className="ml-2 text-gray-700 text-sm">Operational Capital</span>
                        </div>
                        <span className="text-gray-900 font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4" style={{ borderColor: 'rgba(251, 191, 36, 0.1)' }}>
                    <h5 className="text-gray-900 font-medium mb-3">Return Optimization</h5>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div 
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.4)',
                          border: '1px solid rgba(251, 191, 36, 0.1)'
                        }}
                      >
                        <div 
                          className="text-xl font-light text-yellow-600 mb-1"
                          style={{ fontWeight: '200' }}
                        >
                          25-40%
                        </div>
                        <div className="text-xs text-gray-600">Target APY Range</div>
                      </div>
                      <div 
                        className="p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.4)',
                          border: '1px solid rgba(251, 191, 36, 0.1)'
                        }}
                      >
                        <div 
                          className="text-xl font-light text-orange-600 mb-1"
                          style={{ fontWeight: '200' }}
                        >
                          12.3%
                        </div>
                        <div className="text-xs text-gray-600">Max Volatility</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Apple-Level Investment Excellence */}
      <section 
        className="relative py-32 px-8" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(251, 246, 236, 0.9) 20%, rgba(254, 249, 195, 0.85) 40%, rgba(251, 246, 236, 0.9) 60%, rgba(255, 255, 255, 0.95) 80%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(60px) saturate(160%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 
              className="mb-8 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: '200',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Built for Investment Excellence
            </h2>
            <p 
              className="text-gray-600 max-w-5xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.2vw, 1.5rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5'
              }}
            >
              Our platform combines cutting-edge blockchain technology with institutional-grade investment strategies,{' '}
              providing unprecedented access to tokenized real-world assets through Regulation D 506(c) and Regulation S frameworks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="p-8 rounded-2xl transition-all duration-500 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                boxShadow: '0 4px 24px rgba(245, 158, 11, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(245, 158, 11, 0.08)'
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)'
                }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 
                className="mb-4 text-gray-900"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em',
                  lineHeight: '1.3'
                }}
              >
                Institutional Grade
              </h3>
              <p 
                className="text-gray-600 leading-relaxed"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  lineHeight: '1.6'
                }}
              >
                Access high-quality assets traditionally reserved for institutional investors, 
                now available through tokenization with accessible minimum investments.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl transition-all duration-500 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(45, 74, 107, 0.1)',
                boxShadow: '0 4px 24px rgba(45, 74, 107, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(45, 74, 107, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(45, 74, 107, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'
                e.currentTarget.style.borderColor = 'rgba(45, 74, 107, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(45, 74, 107, 0.08)'
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #2d4a6b, #3b82f6)',
                  boxShadow: '0 4px 16px rgba(45, 74, 107, 0.25)'
                }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 
                className="mb-4 text-gray-900"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em',
                  lineHeight: '1.3'
                }}
              >
                Blockchain Secured
              </h3>
              <p 
                className="text-gray-600 leading-relaxed"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  lineHeight: '1.6'
                }}
              >
                Every transaction recorded on-chain with immutable proof of ownership and 
                transparent asset performance tracking. Smart contracts ensure automated compliance.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl transition-all duration-500 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(255, 242, 220, 0.2)',
                boxShadow: '0 4px 24px rgba(245, 158, 11, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(255, 242, 220, 0.3)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'
                e.currentTarget.style.borderColor = 'rgba(255, 242, 220, 0.2)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(245, 158, 11, 0.06)'
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  boxShadow: '0 4px 16px rgba(217, 119, 6, 0.25)'
                }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 
                className="mb-4 text-gray-900"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em',
                  lineHeight: '1.3'
                }}
              >
                Regulatory Compliant
              </h3>
              <p 
                className="text-gray-600 leading-relaxed"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  lineHeight: '1.6'
                }}
              >
                Built with compliance at the core, supporting Regulation D 506(c) and Regulation S 
                frameworks with registrations across multiple jurisdictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-Level RWA Democratization */}
      <section 
        className="relative py-32 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 249, 195, 0.92) 20%, rgba(251, 191, 36, 0.08) 40%, rgba(254, 249, 195, 0.92) 60%, rgba(255, 255, 255, 0.98) 80%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(60px) saturate(170%)',
          borderTop: '1px solid rgba(251, 191, 36, 0.15)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 
              className="mb-8 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: '200',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Democratizing Institutional Performance
            </h2>
            <p 
              className="text-gray-600 max-w-5xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.2vw, 1.5rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5'
              }}
            >
              Real World Assets represent more than tokenization—they return us to the fundamental bartering system.{' '}
              Own the gold, share the profits. Own the plane seat, earn on every flight. Simple, transparent, powerful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                boxShadow: '0 4px 24px rgba(245, 158, 11, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(245, 158, 11, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(245, 158, 11, 0.06)'
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                }}
              >
                <div className="w-4 h-4 bg-white rounded opacity-90"></div>
              </div>
              <h4 
                className="text-lg font-medium tracking-tight mb-3 text-gray-900"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Commercial Real Estate
              </h4>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Prime office buildings, retail centers, and industrial properties. Own fractional shares, 
                receive rental income distributions.
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(45, 74, 107, 0.1)',
                boxShadow: '0 4px 24px rgba(45, 74, 107, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(45, 74, 107, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(45, 74, 107, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(45, 74, 107, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(45, 74, 107, 0.06)'
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #2d4a6b, #3b82f6)',
                  boxShadow: '0 2px 8px rgba(45, 74, 107, 0.2)'
                }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h4 
                className="text-lg font-medium tracking-tight mb-3 text-gray-900"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Infrastructure Assets
              </h4>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Essential infrastructure including renewable energy projects and telecommunications. 
                Own part of the wind farm, earn from every kilowatt generated.
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(251, 191, 36, 0.1)',
                boxShadow: '0 4px 24px rgba(251, 191, 36, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(251, 191, 36, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(251, 191, 36, 0.06)'
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
                }}
              >
                <Coins className="w-4 h-4 text-white" />
              </div>
              <h4 
                className="text-lg font-medium tracking-tight mb-3 text-gray-900"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Precious Metals & Credit
              </h4>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Direct gold ownership with active trading strategies. Your gold works for you—
                stored securely, traded professionally, profits shared transparently.
              </p>
            </div>

            <div 
              className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] group cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(240, 114, 13, 0.1)',
                boxShadow: '0 4px 24px rgba(240, 114, 13, 0.06)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                e.currentTarget.style.borderColor = 'rgba(240, 114, 13, 0.2)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(240, 114, 13, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(240, 114, 13, 0.1)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(240, 114, 13, 0.06)'
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #f0720d, #ea580c)',
                  boxShadow: '0 2px 8px rgba(240, 114, 13, 0.2)'
                }}
              >
                <Plane className="w-4 h-4 text-white" />
              </div>
              <h4 
                className="text-lg font-medium tracking-tight mb-3 text-gray-900"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Aviation Assets
              </h4>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Own fractional aircraft shares. Every seat sold, every cargo shipment, every route flown 
                generates returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Pipeline - Pharma R&D Style */}
      <section 
        className="relative py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 220, 0.03) 0%, rgba(242, 184, 64, 0.05) 20%, rgba(240, 114, 13, 0.04) 40%, rgba(45, 74, 107, 0.06) 60%, rgba(59, 130, 246, 0.03) 80%, rgba(0, 0, 0, 0.1) 100%)',
          backdropFilter: 'blur(60px) saturate(180%)',
          borderTop: '1px solid rgba(242, 184, 64, 0.15)',
          borderBottom: '1px solid rgba(45, 74, 107, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '200',
                letterSpacing: '-0.015em',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}
            >
              Investment Development Pipeline
            </h2>
            <p 
              className="text-gray-600 max-w-5xl mx-auto"
              style={{
                fontSize: '19px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5',
                marginBottom: '3rem'
              }}
            >
              From R&D to market launch, our systematic approach ensures rigorous asset evaluation, 
              compliance validation, and performance optimization at every stage.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(242, 184, 64, 0.2)',
                  boxShadow: '0 4px 24px rgba(242, 184, 64, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #f2b840, #f0720d)',
                    boxShadow: '0 4px 16px rgba(242, 184, 64, 0.25)'
                  }}
                >
                  <div className="w-6 h-6 bg-white rounded opacity-90"></div>
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Discovery
                </h3>
                <div className="w-full bg-orange-200 rounded-full h-1 mt-4">
                  <div className="bg-orange-500 h-1 rounded-full w-full"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Asset identification, due diligence, and initial feasibility analysis with 
                comprehensive market research and regulatory assessment.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(45, 74, 107, 0.2)',
                  boxShadow: '0 4px 24px rgba(45, 74, 107, 0.1)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #2d4a6b, #3b82f6)',
                    boxShadow: '0 4px 16px rgba(45, 74, 107, 0.25)'
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Development
                </h3>
                <div className="w-full bg-blue-200 rounded-full h-1 mt-4">
                  <div className="bg-blue-500 h-1 rounded-full w-3/4"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Smart contract development, tokenization architecture, and compliance framework implementation 
                with regulatory submission processes.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(255, 242, 220, 0.3)',
                  boxShadow: '0 4px 24px rgba(251, 191, 36, 0.08)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    boxShadow: '0 4px 16px rgba(251, 191, 36, 0.25)'
                  }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Validation
                </h3>
                <div className="w-full bg-yellow-200 rounded-full h-1 mt-4">
                  <div className="bg-yellow-500 h-1 rounded-full w-1/2"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Pilot testing with limited investor groups including performance validation, 
                risk assessment, and operational optimization.
              </p>
            </div>

            <div className="text-center group">
              <div 
                className="rounded-2xl p-8 mb-6 group-hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(240, 114, 13, 0.2)',
                  boxShadow: '0 4px 24px rgba(240, 114, 13, 0.08)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #f0720d, #ea580c)',
                    boxShadow: '0 4px 16px rgba(240, 114, 13, 0.25)'
                  }}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h3 
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em',
                    lineHeight: '1.2'
                  }}
                >
                  Launch
                </h3>
                <div className="w-full bg-orange-200 rounded-full h-1 mt-4">
                  <div className="bg-orange-500 h-1 rounded-full w-1/4"></div>
                </div>
              </div>
              <p 
                className="text-gray-600 text-sm leading-relaxed"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}
              >
                Full market launch with institutional distribution and retail accessibility 
                including continuous monitoring and performance reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Preview */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Development Milestones</h2>
            <p className="text-gray-500 text-lg">
              Track our progress in building a global ecosystem for tokenized assets.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(242, 184, 64, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(242, 184, 64, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(242, 184, 64, 0.3), rgba(245, 158, 11, 0.2))',
                      boxShadow: '0 4px 16px rgba(242, 184, 64, 0.25)'
                    }}
                  >
                    <Shield className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '300',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.2'
                    }}
                  >
                    AuSIRI Milestones
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Secured 1,000 oz gold reserves (Q4 2024)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Implementing AI-driven retail cycle optimization (Q2 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Circle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Targeting 25% APY by Q1 2026</span>
                  </div>
                </div>
                <Link to="/ausiri" className="mt-6 inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
                  <span style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>See All Milestones</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div 
              className="rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(240, 114, 13, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 32px rgba(240, 114, 13, 0.08), 0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(240, 114, 13, 0.3), rgba(239, 68, 68, 0.2))',
                      boxShadow: '0 4px 16px rgba(240, 114, 13, 0.25)'
                    }}
                  >
                    <Plane className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 
                    className="text-gray-900"
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '300',
                      letterSpacing: '-0.01em',
                      lineHeight: '1.2'
                    }}
                  >
                    AuAERO Milestones
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Launched 2 A380 and 20 A320-321 XLR planes (Q1 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Securing 50 UDAN routes in India (Q2 2025)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Circle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600" style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>Targeting top 10 airline provider by 2034</span>
                  </div>
                </div>
                <Link to="/auaero" className="mt-6 inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  <span style={{ fontSize: '15px', fontWeight: '300', letterSpacing: '0.01em' }}>See All Milestones</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Excellence */}
      <section 
        className="py-20 px-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(242, 184, 64, 0.04) 20%, rgba(240, 114, 13, 0.03) 40%, rgba(45, 74, 107, 0.02) 60%, rgba(255, 242, 220, 0.03) 80%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(40px) saturate(160%)',
          borderTop: '1px solid rgba(242, 184, 64, 0.2)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="mb-4 bg-gradient-to-r from-gray-900 via-orange-600 to-orange-700 bg-clip-text text-transparent"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '200',
                letterSpacing: '-0.015em',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}
            >
              Performance Excellence
            </h2>
            <p 
              className="text-gray-600 max-w-4xl mx-auto"
              style={{
                fontSize: '19px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.5',
                marginBottom: '3rem'
              }}
            >
              Quantifiable results that speak for themselves. Built on precision, delivered through innovation.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(242, 184, 64, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(242, 184, 64, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div 
                className="text-4xl font-light mb-3"
                style={{
                  color: '#D97706',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                25%
              </div>
              <h4 
                className="text-lg font-light mb-2 text-gray-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Target APY
              </h4>
              <p 
                className="text-gray-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                AuSIRI projected annual performance yield
              </p>
            </div>
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(240, 114, 13, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(240, 114, 13, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div 
                className="text-4xl font-light mb-3"
                style={{
                  color: '#EA580C',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                1,000oz
              </div>
              <h4 
                className="text-lg font-light mb-2 text-gray-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Gold Reserves
              </h4>
              <p 
                className="text-gray-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Verified and audited physical gold backing
              </p>
            </div>
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(45, 74, 107, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(45, 74, 107, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div 
                className="text-4xl font-light mb-3"
                style={{
                  color: '#3B82F6',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                3
              </div>
              <h4 
                className="text-lg font-light mb-2 text-gray-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Jurisdictions
              </h4>
              <p 
                className="text-gray-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Cyprus, Estonia, Luxembourg regulatory compliance
              </p>
            </div>
            
            <div 
              className="p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(25px) saturate(180%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(16, 185, 129, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div 
                className="text-4xl font-light mb-3"
                style={{
                  color: '#10B981',
                  fontSize: '3rem',
                  fontWeight: '200',
                  letterSpacing: '-0.02em'
                }}
              >
                24/7
              </div>
              <h4 
                className="text-lg font-light mb-2 text-gray-900"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '300',
                  letterSpacing: '-0.01em'
                }}
              >
                Transparency
              </h4>
              <p 
                className="text-gray-600 text-sm font-light"
                style={{
                  fontSize: '14px',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.5'
                }}
              >
                Real-time blockchain asset verification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sophisticated Securities Platform Footer */}
      <footer 
        className="relative py-16 px-8"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.95) 25%, rgba(251, 246, 236, 0.92) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(40px) saturate(140%)',
          borderTop: '1px solid rgba(245, 158, 11, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Footer Navigation */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Products
              </h4>
              <ul className="space-y-3">
                <li><Link to="/ausiri" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>AuSIRI</Link></li>
                <li><Link to="/auaero" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>AuAERO</Link></li>
                <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>All Products</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Legal
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Form CRS</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Business Continuity</a></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Support
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Investor Support</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Regulatory Inquiries</a></li>
              </ul>
            </div>
            
            <div>
              <h4 
                className="text-gray-900 mb-4"
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  letterSpacing: '-0.005em'
                }}
              >
                Company
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>About COW</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Leadership</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Newsroom</a></li>
              </ul>
            </div>
          </div>
          
          {/* Regulatory Disclosures */}
          <div 
            className="border-t pt-8 mb-8"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div className="space-y-6">
              {/* Primary Risk Disclosure */}
              <div 
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(245, 158, 11, 0.1)'
                }}
              >
                <h5 
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    letterSpacing: '-0.005em'
                  }}
                >
                  Investment Risk Disclosure
                </h5>
                <p 
                  className="text-gray-600 leading-relaxed"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '400',
                    lineHeight: '1.6'
                  }}
                >
                  <strong>Investing involves risk, including possible loss of principal.</strong> Real World Asset (RWA) tokens involve 
                  substantial risk and may not be suitable for all investors. Past performance does not guarantee future results. 
                  You will pay fees and costs whether you make or lose money on your investments. Fees and costs will reduce 
                  any amount of money you make on your investments over time.
                </p>
              </div>
              
              {/* Regulatory Registration */}
              <div 
                className="grid md:grid-cols-2 gap-6"
              >
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(245, 158, 11, 0.08)'
                  }}
                >
                  <h6 
                    className="text-gray-900 mb-2"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    Regulatory Information
                  </h6>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    COW Securities LLC is registered with the Securities and Exchange Commission (SEC) as an investment adviser 
                    under the Investment Advisers Act of 1940. Registration does not imply endorsement by the SEC.
                  </p>
                </div>
                
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(245, 158, 11, 0.08)'
                  }}
                >
                  <h6 
                    className="text-gray-900 mb-2"
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    International Compliance
                  </h6>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '400',
                      lineHeight: '1.5'
                    }}
                  >
                    Licensed in Cyprus (CySEC), Estonia (FIU), with passporting to Luxembourg for public listings. 
                    Offerings made pursuant to Regulation D 506(c) and Regulation S frameworks.
                  </p>
                </div>
              </div>
              
              {/* Additional Disclosures */}
              <div 
                className="text-gray-600"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  letterSpacing: '0.01em'
                }}
              >
                <p className="mb-2">
                  <strong>Important Information:</strong> This website is for informational purposes only and does not constitute 
                  an offer to sell or a solicitation of an offer to buy any securities. Any such offer or solicitation will be made 
                  only through definitive offering documents. Potential investors should read all offering materials carefully before investing.
                </p>
                <p className="mb-2">
                  Securities offered through COW Securities LLC. Member FINRA/SIPC. Advisory services offered through 
                  COW Investment Advisors LLC, a SEC-registered investment adviser. Please see our 
                  <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors"> Form CRS </a> 
                  for important information about our services and fees.
                </p>
                <p>
                  For complaints or regulatory inquiries, contact: compliance@cow.com | FINRA BrokerCheck: 
                  <a href="https://brokercheck.finra.org" className="text-orange-600 hover:text-orange-700 transition-colors"> brokercheck.finra.org</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Copyright and Final Information */}
          <div 
            className="flex flex-col md:flex-row justify-between items-center pt-6 border-t"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.1)'
            }}
          >
            <div 
              className="text-gray-600 mb-4 md:mb-0"
              style={{
                fontSize: '0.8rem',
                fontWeight: '400'
              }}
            >
              © 2025 COW Group. All rights reserved. 
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Accessibility
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Cookie Policy
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                style={{ fontSize: '0.8rem', fontWeight: '400' }}
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}