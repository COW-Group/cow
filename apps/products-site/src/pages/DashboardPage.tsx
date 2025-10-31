import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Plane,
  BarChart3,
  PieChart,
  Target,
  Shield,
  Star,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle,
  Award,
  User,
  Wallet
} from 'lucide-react'
import { useAuthContext } from '@/lib/auth-context'
import { useWeb3 } from '@/contexts/web3-context'
import { useCart } from '@/contexts/cart-context'
import { HeroBackground } from '@/components/hero-background'
import { ProductMenu } from '@/components/product-menu'
import { CartDropdown } from '@/components/cart-dropdown'
import { ThemeToggle } from '@/components/theme-toggle'
import { supabase, type Product, type ProductTier } from "@/lib/supabase"
import { GoldPriceProvider, useGoldPriceContext } from '@/contexts/gold-price-context'
import { calculateGoldSwimUnitPrice, calculateSiriZ31UnitPrice, formatCurrency } from '@/lib/gold-price-calculations'

// Product allocation interface
interface ProductAllocation {
  id: string
  product_id: string
  component_name: string
  allocation_percent: number
  description: string | null
  calculator_path: string | null
  is_active: boolean
  display_order: number
}

function DashboardPageInner() {
  const { auth, signOut } = useAuthContext()
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { spotAsk, eurExchangeRate, loading: priceLoading } = useGoldPriceContext()
  const [isClient, setIsClient] = useState(false)

  // Products state
  const [myGoldProduct, setMyGoldProduct] = useState<Product | null>(null)
  const [myGoldAllocations, setMyGoldAllocations] = useState<ProductAllocation[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    setIsClient(true)
    if (!auth.isAuthenticated) {
      navigate('/')
    } else {
      // Fetch products when authenticated
      fetchProducts()
    }
  }, [auth.isAuthenticated, navigate])

  const fetchProducts = async () => {
    try {
      // WORKAROUND: Use raw fetch() instead of Supabase client (Chrome Promise issue)

      // Fetch MyGOLD product
      const myGoldResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.mygold&is_active=eq.true&select=*`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          }
        }
      )

      if (myGoldResponse.ok) {
        const myGoldData = await myGoldResponse.json()
        if (myGoldData && myGoldData.length > 0) {
          const myGold = myGoldData[0]
          setMyGoldProduct(myGold)

          // Fetch MyGOLD allocations
          const allocationsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/product_allocations?product_id=eq.${myGold.id}&is_active=eq.true&select=*&order=display_order.asc`,
            {
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                'Content-Type': 'application/json'
              }
            }
          )

          if (allocationsResponse.ok) {
            const allocationsData = await allocationsResponse.json()
            if (allocationsData) {
              setMyGoldAllocations(allocationsData)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleAddToCart = (product: Product, amount: number, tier?: ProductTier) => {
    const itemName = tier
      ? `${product.name} - ${tier.name} ($${tier.price}/mo)`
      : `${product.name} ($${amount.toLocaleString()})`

    addToCart({
      id: `${product.slug}-${tier?.id || Date.now()}`,
      name: itemName,
      description: product.description || "",
      price: tier ? Number(tier.price) : amount,
      link: "/gold",
    })
  }

  if (!isClient) {
    return null
  }

  const portfolioData = {
    totalValue: 285000,
    todayChange: 3420,
    todayChangePercent: 1.22,
    yearlyReturn: 23.4,
    holdings: [
      {
        symbol: 'AuSIRI',
        name: 'Gold Reserve Token',
        value: 171000,
        quantity: 34000,
        price: 5.032,
        change: 0.086,
        changePercent: 1.74,
        allocation: 60
      },
      {
        symbol: 'AuAERO',
        name: 'Aerospace Hybrid Token',
        value: 114000,
        quantity: 4532,
        price: 25.16,
        change: -0.42,
        changePercent: -1.64,
        allocation: 40
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
      </div>

      {/* Floating Navigation with Complete Profile */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className="px-8 py-4 flex items-center gap-8 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-gray-700/40 shadow-lg"
        >
          <Link to="/" className="text-xl font-light tracking-tight text-gray-900 dark:text-gray-100">
            COW
          </Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-4">
            {/* Complete Profile Button (KYC Flow) */}
            <Link to="/complete-profile">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full transition-all duration-300 text-sm font-medium border-green-700/30 dark:border-green-600/30 bg-green-700/10 dark:bg-green-600/10 text-green-800 dark:text-green-400 hover:bg-green-700/20 dark:hover:bg-green-600/20"
              >
                <User className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </Link>

            <ThemeToggle />

            <button
              onClick={signOut}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 font-light"
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
                  onClick={disconnectWallet}
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
                onClick={connectWallet}
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

      {/* Main Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100">Investment Portfolio</h1>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
            Professional investment tools and asset management for your portfolio
          </p>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Portfolio Value</p>
                  <p className="text-3xl font-light text-gray-900">${portfolioData.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Today's Return</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-light text-green-600 mr-2">
                      +${portfolioData.todayChange.toLocaleString()}
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600">+{portfolioData.todayChangePercent}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Annual Return</p>
                  <p className="text-2xl font-light text-amber-600">{portfolioData.yearlyReturn}%</p>
                  <p className="text-sm text-gray-600">vs 7.2% market avg</p>
                </div>
                <Target className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Performance Rank</p>
                  <p className="text-2xl font-light text-blue-600">Top 15%</p>
                  <p className="text-sm text-gray-600">Among investors</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-1 shadow-sm">
            <TabsTrigger value="opportunities" className="font-medium">Opportunities</TabsTrigger>
            <TabsTrigger value="portfolio" className="font-medium">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">Analytics</TabsTrigger>
            <TabsTrigger value="strategies" className="font-medium">Strategies</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <div className="grid gap-6">

              {/* Holdings with Advanced Metrics */}
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader className="border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Holdings Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holdings</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Performance</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield (APY)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {portfolioData.holdings.map((holding) => (
                          <tr key={holding.symbol} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {holding.symbol === 'AuSIRI' ? (
                                  <Coins className="h-8 w-8 text-amber-600 mr-3" />
                                ) : (
                                  <Plane className="h-8 w-8 text-orange-600 mr-3" />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                                  <div className="text-sm text-gray-500">{holding.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 font-medium">
                                {holding.quantity.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {holding.allocation}% allocation
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ${holding.price.toFixed(3)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                ${holding.value.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center ${holding.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {holding.changePercent >= 0 ? (
                                  <ArrowUpRight className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-4 w-4 mr-1" />
                                )}
                                <span className="text-sm font-medium">
                                  {Math.abs(holding.changePercent)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-green-600">
                                {holding.symbol === 'AuSIRI' ? '18.2%' : '24.7%'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" className="text-xs">
                                  Buy More
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  Rebalance
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Plus className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Increase Position</h3>
                    <p className="text-sm text-gray-600 mb-4">Add to your existing holdings</p>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Invest More
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rebalance Portfolio</h3>
                    <p className="text-sm text-gray-600 mb-4">Optimize your allocation</p>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                      Rebalance
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Auto-Invest</h3>
                    <p className="text-sm text-gray-600 mb-4">Set up recurring investments</p>
                    <Button size="sm" variant="outline" className="border-green-300 text-green-700">
                      Setup Auto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Opportunities Tab - COW Brand Aligned */}
          <TabsContent value="opportunities">
            <div className="space-y-6">
              <Card
                className="backdrop-blur-xl shadow-lg border-b-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'rgba(155, 139, 126, 0.2)',
                  borderBottomColor: '#9B8B7E'
                }}
              >
                <CardHeader style={{ borderBottom: '1px solid rgba(155, 139, 126, 0.15)' }}>
                  <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100 tracking-tight font-light text-2xl">
                    <Star
                      className="w-5 h-5"
                      style={{ color: '#00A5CF' }}
                    />
                    Investment Opportunities
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Performance real-world assets designed for optimal returns</p>
                </CardHeader>
                <CardContent>
                  {loadingProducts ? (
                    <div className="text-center py-12">
                      <div
                        className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor: '#0ea5e9', borderTopColor: 'transparent' }}
                      ></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading opportunities...</p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {/* MyGOLD Product */}
                      {myGoldProduct && (
                        <Card
                          className="border-2 transition-all duration-300 bg-white dark:bg-gray-900 shadow-lg relative overflow-hidden"
                          style={{
                            borderColor: 'rgba(0, 165, 207, 0.3)',
                            borderBottom: '4px solid #9B8B7E'
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-2xl text-gray-900 dark:text-gray-100 mb-2 tracking-tight">{myGoldProduct.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 leading-relaxed font-light">{myGoldProduct.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">{myGoldProduct.ticker_symbol} • Security Token</p>
                              </div>
                              <Badge
                                className="font-semibold"
                                style={{
                                  background: 'rgba(5, 150, 105, 0.1)',
                                  color: '#059669',
                                  border: '1px solid rgba(5, 150, 105, 0.2)'
                                }}
                              >
                                Available Now
                              </Badge>
                            </div>

                            {/* Asset Allocation Breakdown */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 tracking-tight">Strategic Asset Allocation</h4>
                              <div className="space-y-3">
                                {myGoldAllocations.map((allocation, index) => (
                                  <div
                                    key={allocation.id}
                                    className="rounded-lg p-3 border-l-4"
                                    style={{
                                      background: 'rgba(255, 255, 255, 0.6)',
                                      borderLeftColor: '#00A5CF',
                                      border: '1px solid rgba(0, 165, 207, 0.2)',
                                      borderLeft: '4px solid #00A5CF'
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                          {allocation.component_name}
                                        </span>
                                        {allocation.calculator_path && (
                                          <Link to={allocation.calculator_path}>
                                            <Badge
                                              variant="outline"
                                              className="text-xs cursor-pointer"
                                              style={{
                                                borderColor: 'rgba(14, 165, 233, 0.3)',
                                                color: '#0ea5e9'
                                              }}
                                            >
                                              Calculator
                                            </Badge>
                                          </Link>
                                        )}
                                      </div>
                                      <span
                                        className="font-bold"
                                        style={{ color: '#b45309' }}
                                      >
                                        {allocation.allocation_percent.toFixed(2)}%
                                      </span>
                                    </div>
                                    {allocation.description && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 font-light leading-relaxed">{allocation.description}</p>
                                    )}
                                    {/* Progress bar */}
                                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                      <div
                                        className="h-1.5 rounded-full"
                                        style={{
                                          background: 'linear-gradient(to right, #d97706, #b45309)',
                                          width: `${allocation.allocation_percent}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Min Investment:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(myGoldProduct.min_investment || 1000, 'EUR')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Ticker Symbol:</span>
                                  <span className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100">{myGoldProduct.ticker_symbol}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Target APY:</span>
                                  <span className="text-sm font-semibold" style={{ color: '#10b981' }}>{myGoldProduct.projected_annual_return || 0}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600 dark:text-gray-400 font-light">Asset Class:</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Diversified Gold</span>
                                </div>
                              </div>
                            </div>

                            <div
                              className="p-4 rounded-lg mb-4 border"
                              style={{
                                background: 'rgba(249, 243, 221, 0.5)',
                                borderColor: 'rgba(180, 83, 9, 0.2)',
                                borderLeft: '4px solid #9B8B7E'
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <Shield
                                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                                  style={{ color: '#00A5CF' }}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">Full Asset Backing</p>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 font-light leading-relaxed">
                                    Diversified allocation across physical gold operations, futures positioning, cash reserves, and real-world assets for optimal risk-adjusted returns.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                className="flex-1 text-white font-semibold shadow-lg transition-all duration-300"
                                style={{
                                  background: 'linear-gradient(to right, #0ea5e9, #00A5CF)'
                                }}
                                onClick={() => handleAddToCart(myGoldProduct, myGoldProduct.min_investment || 1000)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Total Return (YTD)</span>
                      <span className="text-sm font-semibold text-green-600">+23.4%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Sharpe Ratio</span>
                      <span className="text-sm font-semibold text-gray-900">2.87</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Alpha (vs S&P 500)</span>
                      <span className="text-sm font-semibold text-green-600">+8.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Beta</span>
                      <span className="text-sm font-semibold text-gray-900">0.34</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Max Drawdown</span>
                      <span className="text-sm font-semibold text-red-600">-4.1%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Calmar Ratio</span>
                      <span className="text-sm font-semibold text-gray-900">5.71</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Portfolio Volatility</span>
                        <span className="font-semibold">12.4%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <p className="text-xs text-green-600">Low volatility compared to crypto markets</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Correlation to Gold</span>
                        <span className="font-semibold">0.76</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Correlation to S&P 500</span>
                        <span className="font-semibold">0.23</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                      <p className="text-xs text-blue-600">Low correlation provides diversification</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Benchmark Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Your Portfolio', value: 23.4, color: 'bg-amber-500' },
                      { name: 'Gold ETF (GLD)', value: 14.2, color: 'bg-yellow-500' },
                      { name: 'S&P 500', value: 11.8, color: 'bg-blue-500' },
                      { name: 'Real Estate (REITs)', value: 8.6, color: 'bg-green-500' },
                      { name: 'Bonds (AGG)', value: 2.1, color: 'bg-gray-500' }
                    ].map((benchmark) => (
                      <div key={benchmark.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-4 h-4 rounded ${benchmark.color}`}></div>
                          <span className="text-sm font-medium text-gray-900">{benchmark.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${benchmark.color}`}
                              style={{ width: `${Math.min((benchmark.value / 25) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                            {benchmark.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investment Strategies Tab */}
          <TabsContent value="strategies">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Recommended Investment Strategies</CardTitle>
                  <p className="text-sm text-gray-600">Sophisticated allocation strategies based on your risk profile and investment goals</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        name: 'Wealth Preservation Plus',
                        description: 'Conservative strategy with enhanced yield generation',
                        allocation: { ausiri: 75, auaero: 25 },
                        expectedReturn: '15-20%',
                        riskLevel: 'Low-Medium',
                        features: ['Capital protection focus', 'Steady income generation', 'Low volatility', 'Inflation hedge'],
                        suitableFor: 'Risk-averse investors'
                      },
                      {
                        name: 'Balanced Growth',
                        description: 'Optimal risk-adjusted returns with diversification',
                        allocation: { ausiri: 60, auaero: 40 },
                        expectedReturn: '20-28%',
                        riskLevel: 'Medium',
                        features: ['Balanced risk-return', 'Active rebalancing', 'Growth potential', 'Diversified exposure'],
                        suitableFor: 'Growth-oriented investors',
                        recommended: true
                      },
                      {
                        name: 'Aggressive Performance',
                        description: 'Maximum growth potential for qualified investors',
                        allocation: { ausiri: 40, auaero: 60 },
                        expectedReturn: '25-35%',
                        riskLevel: 'Medium-High',
                        features: ['High growth potential', 'Active management', 'Performance focus', 'Higher volatility'],
                        suitableFor: 'Sophisticated risk-tolerant investors'
                      }
                    ].map((strategy) => (
                      <Card key={strategy.name} className={`border-2 transition-all duration-300 ${
                        strategy.recommended
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">{strategy.name}</h3>
                              <p className="text-gray-600 text-sm mb-2">{strategy.description}</p>
                              <p className="text-xs text-gray-500">{strategy.suitableFor}</p>
                            </div>
                            {strategy.recommended && (
                              <Badge className="bg-amber-500 text-white">Recommended</Badge>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Asset Allocation</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">AuSIRI (Gold)</span>
                                  <span className="text-sm font-medium">{strategy.allocation.ausiri}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${strategy.allocation.ausiri}%` }}></div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm">AuAERO (Aerospace)</span>
                                  <span className="text-sm font-medium">{strategy.allocation.auaero}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${strategy.allocation.auaero}%` }}></div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Strategy Features</h4>
                              <ul className="space-y-2">
                                {strategy.features.map((feature, index) => (
                                  <li key={index} className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{strategy.expectedReturn}</div>
                              <div className="text-xs text-gray-600">Expected Annual Return</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{strategy.riskLevel}</div>
                              <div className="text-xs text-gray-600">Risk Level</div>
                            </div>
                          </div>

                          <Button className="w-full" variant={strategy.recommended ? 'default' : 'outline'}>
                            {strategy.recommended ? 'Apply Recommended Strategy' : 'Apply Strategy'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <GoldPriceProvider>
      <DashboardPageInner />
    </GoldPriceProvider>
  )
}
