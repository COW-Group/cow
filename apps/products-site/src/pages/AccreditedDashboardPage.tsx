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
  Award
} from 'lucide-react'
import { useAuthContext } from '@/lib/auth-context'
import { HeroBackground } from '@/components/hero-background'

export default function AccreditedDashboardPage() {
  const { auth, signOut } = useAuthContext()
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (!auth.isAuthenticated) {
      navigate('/')
    }
  }, [auth.isAuthenticated, navigate])

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Sophisticated Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-light text-gray-900 tracking-tight">
                COW
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                  <Star className="w-3 h-3 mr-1" />
                  Accredited
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{auth.profile?.name}</div>
                <div className="text-xs text-gray-500">{auth.profile?.email}</div>
              </div>
              <Button variant="outline" onClick={signOut} className="text-gray-700">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-light text-gray-900">Accredited Investor Portfolio</h1>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                <Award className="w-3 h-3 mr-1" />
                Premium Access
              </Badge>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-light">
            Sophisticated investment tools and exclusive asset access for qualified investors
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
                  <p className="text-sm text-gray-600">Among accredited</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accredited Features Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-xl border border-gray-200/50 p-1 shadow-sm">
            <TabsTrigger value="portfolio" className="font-medium">Advanced Portfolio</TabsTrigger>
            <TabsTrigger value="exclusive" className="font-medium">Exclusive Opportunities</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium">Performance Analytics</TabsTrigger>
            <TabsTrigger value="strategies" className="font-medium">Investment Strategies</TabsTrigger>
          </TabsList>

          {/* Advanced Portfolio Tab */}
          <TabsContent value="portfolio">
            <div className="grid gap-6">
              
              {/* Holdings with Advanced Metrics */}
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader className="border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Advanced Holdings Analysis
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

          {/* Exclusive Opportunities Tab */}
          <TabsContent value="exclusive">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Accredited-Only Investment Opportunities
                  </CardTitle>
                  <p className="text-sm text-gray-600">Exclusive access to pre-launch and limited offerings</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {[
                      {
                        name: 'AuREAL - Real Estate Token',
                        description: 'Commercial real estate backed by premium properties',
                        minInvestment: '$25,000',
                        expectedAPY: '15-20%',
                        status: 'Pre-Launch',
                        timeLeft: '14 days',
                        riskLevel: 'Medium',
                        allocation: 'Limited to 500 investors'
                      },
                      {
                        name: 'AuENERGY - Renewable Energy',
                        description: 'Solar and wind farm revenue sharing tokens',
                        minInvestment: '$50,000',
                        expectedAPY: '18-25%',
                        status: 'Private Sale',
                        timeLeft: '7 days',
                        riskLevel: 'Medium-High',
                        allocation: 'Limited to 200 investors'
                      },
                      {
                        name: 'AuTECH - Technology Assets',
                        description: 'AI and quantum computing infrastructure tokens',
                        minInvestment: '$100,000',
                        expectedAPY: '25-35%',
                        status: 'Coming Soon',
                        timeLeft: '30 days',
                        riskLevel: 'High',
                        allocation: 'Institutional + Accredited only'
                      }
                    ].map((opportunity) => (
                      <Card key={opportunity.name} className="border-2 border-gray-200 hover:border-amber-300 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900 mb-1">{opportunity.name}</h3>
                              <p className="text-gray-600 text-sm">{opportunity.description}</p>
                            </div>
                            <Badge className={`${
                              opportunity.status === 'Pre-Launch' ? 'bg-amber-100 text-amber-800' :
                              opportunity.status === 'Private Sale' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {opportunity.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Min Investment:</span>
                                <span className="text-sm font-medium">{opportunity.minInvestment}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Expected APY:</span>
                                <span className="text-sm font-medium text-green-600">{opportunity.expectedAPY}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Risk Level:</span>
                                <span className="text-sm font-medium">{opportunity.riskLevel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Time Left:</span>
                                <span className="text-sm font-medium text-amber-600">{opportunity.timeLeft}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-amber-50 p-3 rounded-lg mb-4">
                            <p className="text-xs text-amber-800">
                              <Shield className="w-3 h-3 inline mr-1" />
                              {opportunity.allocation}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                              Reserve Allocation
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Learn More
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                    <CardTitle>Advanced Performance Metrics</CardTitle>
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
                  <CardTitle>Recommended Strategies for Accredited Investors</CardTitle>
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
                        suitableFor: 'Risk-averse accredited investors'
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