import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { useAuthContext } from "../lib/auth-context"
import { useWeb3 } from "../contexts/web3-context"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import {
  TrendingUp,
  TrendingDown,
  Coins,
  Plane,
  Wallet,
  User,
  DollarSign,
  BarChart3,
  PieChart,
  FileText,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Target
} from "lucide-react"
import { AuthModal } from "../components/auth-modal"

interface Holding {
  id: string
  tokenType: "founder" | "asset"
  tokenName: string
  amount: number
  currentValue: number
  performance: number
  createdAt: string
}

// Mock database service for demo
const mockDatabaseService = {
  async fetchHoldings(userId: string): Promise<Holding[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        tokenType: "asset" as const,
        tokenName: "AuSIRI",
        amount: 5000,
        currentValue: 5750,
        performance: 15.0,
        createdAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "2",
        tokenType: "asset" as const,
        tokenName: "AuAERO",
        amount: 10000,
        currentValue: 12500,
        performance: 25.0,
        createdAt: "2024-02-20T00:00:00Z",
      }
    ]
  }
}

export default function DashboardPage() {
  const { auth, loading, signOut } = useAuthContext()
  const { isConnected, address, connectWallet, disconnectWallet, error, clearError } = useWeb3()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [holdings, setHoldings] = useState<Holding[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("Dashboard auth check:", { mounted, loading, isAuthenticated: auth.isAuthenticated, user: auth.user })
    const timeoutId = setTimeout(() => {
      if (mounted && !loading && !auth.isAuthenticated) {
        console.log("Redirecting to home - user not authenticated")
        navigate("/")
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [auth.isAuthenticated, loading, mounted, navigate])

  useEffect(() => {
    if (!mounted) return
    if (error) {
      console.error("Web3Context error details:", error)
      clearError()
    }
  }, [mounted, error, clearError])

  useEffect(() => {
    if (!mounted || !auth.isAuthenticated || !auth.user?.id) return
    const fetchHoldings = async () => {
      try {
        console.log("Fetching holdings for user:", auth.user?.id)
        const fetchedHoldings = await mockDatabaseService.fetchHoldings(auth.user!.id)
        setHoldings(fetchedHoldings)
        console.log("Holdings fetched successfully:", fetchedHoldings)
      } catch (err) {
        console.error("Failed to fetch holdings:", err)
      }
    }
    fetchHoldings()
  }, [mounted, auth.isAuthenticated, auth.user?.id])

  const handleConnectWallet = async () => {
    if (!mounted) return
    try {
      console.log("Attempting to connect wallet")
      await connectWallet()
      console.log("Wallet connected successfully")
    } catch (err: any) {
      console.error("Failed to connect wallet:", err)
      alert(`Failed to connect wallet: ${err.message}`)
    }
  }

  const handleDisconnectWallet = () => {
    try {
      console.log("Disconnecting wallet")
      disconnectWallet()
      console.log("Wallet disconnected successfully")
    } catch (err) {
      console.error("Failed to disconnect wallet:", err)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3F0' }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#007BA7' }}
          ></div>
          <p style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif', fontWeight: '300' }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  const safeHoldings = Array.isArray(holdings) ? holdings : []
  const founderHoldings = safeHoldings.filter(holding => holding.tokenType === "founder")
  const assetHoldings = safeHoldings.filter(holding => holding.tokenType === "asset")
  const totalValue = safeHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalInvested = safeHoldings.reduce((sum, holding) => sum + holding.amount, 0)
  const totalGains = totalValue - totalInvested
  const totalPerformance = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Floating Navigation with Onboarding Button */}
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
              fontWeight: '300',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            COW
          </Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-4">
            {/* Onboarding Button */}
            <Link to="/onboarding">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full transition-all duration-300"
                style={{
                  background: 'rgba(139, 149, 109, 0.1)',
                  border: '1px solid rgba(139, 149, 109, 0.3)',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '0.01em',
                  padding: '8px 16px',
                  color: '#8B956D',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </Link>

            <button
              onClick={signOut}
              className="text-sm transition-colors duration-200"
              style={{
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300'
              }}
            >
              Sign Out
            </button>

            {isConnected ? (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" style={{ color: '#8B956D' }} />
                <div className="h-2 w-2 rounded-full" style={{ background: '#8B956D' }} />
                <span className="text-sm font-mono" style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full transition-all duration-300"
                  onClick={handleDisconnectWallet}
                  style={{
                    background: 'rgba(0, 0, 0, 0.03)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    fontSize: '13px',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    padding: '8px 16px',
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full transition-all duration-300"
                onClick={handleConnectWallet}
                style={{
                  background: 'rgba(0, 0, 0, 0.03)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  fontSize: '13px',
                  fontWeight: '300',
                  letterSpacing: '0.01em',
                  padding: '8px 16px',
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero with Horizon Gradient */}
      <section className="relative overflow-hidden" style={{ minHeight: '400px' }}>
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
        <div className="absolute z-10 left-0 right-0 px-8" style={{ top: '45%' }}>
          <div className="max-w-7xl mx-auto">
          <h1
            className="text-white mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '200',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.1)',
              marginTop: 'calc(-0.6 * clamp(2.5rem, 5vw, 4rem))'
            }}
          >
            Welcome back, {auth.profile?.name || "Investor"}
          </h1>
          <p
            className="text-white max-w-2xl"
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              fontWeight: '300',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.01em',
              lineHeight: '1.6',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)'
            }}
          >
            Your investments are working for you. Here's how they're performing today.
          </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Portfolio Overview Cards */}
        <div className="mb-12">
          <h2
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
            Portfolio Snapshot
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderBottom: '4px solid #9B8B7E', // Warm Stone grounding
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Total Value
              </h3>
              <p
                style={{
                  fontSize: '2rem',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  color: '#111827'
                }}
              >
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderBottom: '4px solid #9B8B7E',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Invested
              </h3>
              <p
                style={{
                  fontSize: '2rem',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  color: '#111827'
                }}
              >
                ${totalInvested.toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderBottom: '4px solid #9B8B7E',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Total Returns
              </h3>
              <p
                style={{
                  fontSize: '2rem',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  color: totalGains >= 0 ? '#8B956D' : '#C9724B'
                }}
              >
                ${totalGains.toLocaleString()}
              </p>
            </div>
            <div
              className="rounded-2xl p-8 transition-all duration-300"
              style={{
                background: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderBottom: '4px solid #9B8B7E',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
            >
              <h3
                className="mb-2"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Performance
              </h3>
              <div className="flex items-center">
                {totalPerformance >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-2" style={{ color: '#8B956D' }} />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2" style={{ color: '#C9724B' }} />
                )}
                <p
                  style={{
                    fontSize: '2rem',
                    fontWeight: '200',
                    fontFamily: 'Inter, sans-serif',
                    color: totalPerformance >= 0 ? '#8B956D' : '#C9724B'
                  }}
                >
                  {totalPerformance.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-8">
          <TabsList
            className="rounded-xl p-1"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <TabsTrigger
              value="portfolio"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
            >
              Portfolio
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="allocations"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
            >
              Allocations
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <div className="space-y-8">
              <h2
                className="mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.025em',
                  color: '#111827'
                }}
              >
                Your Performance Assets
              </h2>
          {assetHoldings.length === 0 ? (
            <div
              className="rounded-2xl p-16 text-center"
              style={{
                background: 'rgba(249, 250, 251, 0.6)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Coins className="w-16 h-16 mx-auto mb-6" style={{ color: '#C9B8A8' }} />
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.01em',
                  color: '#111827'
                }}
              >
                Ready to start building?
              </h3>
              <p
                className="mb-8 max-w-xl mx-auto"
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.7',
                  letterSpacing: '0.01em',
                  color: '#6b7280'
                }}
              >
                Begin your journey with performance-engineered assets. Gold that optimizes itself. Aviation that compounds. Real estate that works for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/ausiri">
                  <Button
                    className="rounded-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '12px 24px',
                      fontFamily: 'Inter, sans-serif',
                      border: 'none'
                    }}
                  >
                    Explore Gold
                  </Button>
                </Link>
                <Link to="/auaero">
                  <Button
                    variant="outline"
                    className="rounded-xl transition-all duration-300"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(0, 123, 167, 0.3)',
                      color: '#007BA7',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '12px 24px',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Explore Aviation
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {assetHoldings.map((holding) => (
                <div
                  key={holding.id}
                  className="rounded-2xl p-8 transition-all duration-300"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {holding.tokenName === "AuSIRI" ? (
                        <Coins className="w-10 h-10 mr-4" style={{ color: '#f59e0b' }} />
                      ) : (
                        <Plane className="w-10 h-10 mr-4" style={{ color: '#007BA7' }} />
                      )}
                      <div>
                        <h3
                          style={{
                            fontSize: '1.5rem',
                            fontWeight: '500',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '-0.01em',
                            color: '#111827'
                          }}
                        >
                          {holding.tokenName}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: '300',
                            fontFamily: 'Inter, sans-serif',
                            color: '#6b7280'
                          }}
                        >
                          Acquired {new Date(holding.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        style={{
                          fontSize: '2rem',
                          fontWeight: '200',
                          fontFamily: 'Inter, sans-serif',
                          color: '#111827'
                        }}
                      >
                        ${holding.currentValue.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end">
                        {holding.performance >= 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" style={{ color: '#8B956D' }} />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" style={{ color: '#C9724B' }} />
                        )}
                        <span
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            fontFamily: 'Inter, sans-serif',
                            color: holding.performance >= 0 ? '#8B956D' : '#C9724B'
                          }}
                        >
                          {holding.performance.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '300',
                          fontFamily: 'Inter, sans-serif',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}
                      >
                        Initial Investment
                      </p>
                      <p
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          fontFamily: 'Inter, sans-serif',
                          color: '#111827'
                        }}
                      >
                        ${holding.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '300',
                          fontFamily: 'Inter, sans-serif',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}
                      >
                        Current Value
                      </p>
                      <p
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          fontFamily: 'Inter, sans-serif',
                          color: '#111827'
                        }}
                      >
                        ${holding.currentValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '300',
                          fontFamily: 'Inter, sans-serif',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}
                      >
                        Total Returns
                      </p>
                      <p
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: '500',
                          fontFamily: 'Inter, sans-serif',
                          color: (holding.currentValue - holding.amount) >= 0 ? '#8B956D' : '#C9724B'
                        }}
                      >
                        ${(holding.currentValue - holding.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-8">
              <h2
                className="mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.025em',
                  color: '#111827'
                }}
              >
                Performance Analytics
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card
                  className="rounded-2xl"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                      Returns Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        7-Day Return
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>
                        +2.4%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        30-Day Return
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>
                        +8.7%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.06)' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        90-Day Return
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>
                        +18.2%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                        All-Time Return
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>
                        +{totalPerformance.toFixed(1)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="rounded-2xl"
                  style={{
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <CardHeader>
                    <CardTitle style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                      Risk Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Portfolio Volatility</span>
                        <span style={{ fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>Low</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                        <div className="rounded-full h-2" style={{ width: '28%', background: '#8B956D' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Diversification Score</span>
                        <span style={{ fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>Good</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                        <div className="rounded-full h-2" style={{ width: '72%', background: '#8B956D' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Performance Stability</span>
                        <span style={{ fontWeight: '600', color: '#8B956D', fontFamily: 'Inter, sans-serif' }}>High</span>
                      </div>
                      <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                        <div className="rounded-full h-2" style={{ width: '85%', background: '#8B956D' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-8">
              <h2
                className="mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.025em',
                  color: '#111827'
                }}
              >
                Account Reports
              </h2>

              <Card
                className="rounded-2xl"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText className="w-5 h-5" />
                    Available Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Monthly Performance Statement', date: '2025-09-01', status: 'Ready' },
                      { name: 'Quarterly Portfolio Summary', date: '2025-08-31', status: 'Ready' },
                      { name: 'Tax Statement', date: '2024-12-31', status: 'Ready' },
                      { name: 'Asset Holdings Detail', date: '2025-09-10', status: 'Ready' },
                      { name: 'Transaction History', date: '2025-09-01', status: 'Ready' },
                      { name: 'Annual Report', date: '2024-12-31', status: 'Ready' }
                    ].map((report) => (
                      <div
                        key={report.name}
                        className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md"
                        style={{
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          background: 'white'
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 style={{ fontWeight: '500', fontSize: '0.875rem', color: '#111827', fontFamily: 'Inter, sans-serif' }}>
                            {report.name}
                          </h4>
                          <Badge
                            style={{
                              background: '#8B956D',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                          {report.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Allocations Tab */}
          <TabsContent value="allocations">
            <div className="space-y-8">
              <h2
                className="mb-6"
                style={{
                  fontSize: 'clamp(1.875rem, 3vw, 2.5rem)',
                  fontWeight: '200',
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '-0.025em',
                  color: '#111827'
                }}
              >
                Strategic Allocations
              </h2>

              <Card
                className="rounded-2xl"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                    Recommended Portfolio Allocations
                  </CardTitle>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                    Choose a strategy that aligns with your investment goals
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        name: 'Conservative',
                        description: 'Capital preservation focused',
                        allocations: { gold: 70, aviation: 30 },
                        expectedReturn: '8-12%',
                        riskLevel: 'Low'
                      },
                      {
                        name: 'Balanced',
                        description: 'Growth with stability',
                        allocations: { gold: 60, aviation: 40 },
                        expectedReturn: '12-18%',
                        riskLevel: 'Medium',
                        recommended: true
                      },
                      {
                        name: 'Growth',
                        description: 'Maximum performance',
                        allocations: { gold: 40, aviation: 60 },
                        expectedReturn: '18-25%',
                        riskLevel: 'Medium-High'
                      }
                    ].map((allocation) => (
                      <div
                        key={allocation.name}
                        className="p-6 rounded-2xl transition-all duration-300"
                        style={{
                          border: allocation.recommended ? '2px solid #f59e0b' : '1px solid rgba(0, 0, 0, 0.08)',
                          background: allocation.recommended ? 'rgba(245, 158, 11, 0.05)' : 'white'
                        }}
                      >
                        {allocation.recommended && (
                          <Badge
                            className="mb-3"
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            Recommended
                          </Badge>
                        )}
                        <h3 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
                          {allocation.name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                          {allocation.description}
                        </p>

                        <div className="space-y-4 mb-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>Gold (AuSIRI)</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
                                {allocation.allocations.gold}%
                              </span>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                              <div
                                className="rounded-full h-2"
                                style={{ width: `${allocation.allocations.gold}%`, background: '#f59e0b' }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-2">
                              <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>Aviation (AuAERO)</span>
                              <span style={{ fontSize: '0.875rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
                                {allocation.allocations.aviation}%
                              </span>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ background: '#e5e7eb' }}>
                              <div
                                className="rounded-full h-2"
                                style={{ width: `${allocation.allocations.aviation}%`, background: '#007BA7' }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Expected Return</span>
                            <span style={{ fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>{allocation.expectedReturn}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Risk Level</span>
                            <span style={{ fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>{allocation.riskLevel}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full mt-4 rounded-xl"
                          style={{
                            background: allocation.recommended ? '#007BA7' : 'transparent',
                            color: allocation.recommended ? 'white' : '#007BA7',
                            border: allocation.recommended ? 'none' : '1px solid #007BA7',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: '500'
                          }}
                        >
                          Apply Strategy
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer with Earth-Tone Grounding */}
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
