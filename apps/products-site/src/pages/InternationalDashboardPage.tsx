import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Plane, 
  BarChart3, 
  PieChart, 
  Globe, 
  Shield, 
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Info,
  Banknote,
  Scale
} from 'lucide-react'
import { useAuthContext } from '@/lib/auth-context'
import { HeroBackground } from '@/components/hero-background'

export default function InternationalDashboardPage() {
  const { auth, signOut } = useAuthContext()
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')

  useEffect(() => {
    setIsClient(true)
    if (!auth.isAuthenticated) {
      navigate('/')
    }
  }, [auth.isAuthenticated, navigate])

  if (!isClient) {
    return null
  }

  const currencyRates = {
    EUR: 1,
    USD: 1.09,
    GBP: 0.87,
    CHF: 0.96
  }

  const convertCurrency = (amount: number) => {
    return amount * currencyRates[selectedCurrency as keyof typeof currencyRates]
  }

  const formatCurrency = (amount: number) => {
    const symbols = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF' }
    const converted = convertCurrency(amount)
    return `${symbols[selectedCurrency as keyof typeof symbols]}${converted.toLocaleString()}`
  }

  const portfolioData = {
    totalValue: 245000, // Base EUR
    todayChange: 2890,
    todayChangePercent: 1.19,
    yearlyReturn: 19.7,
    holdings: [
      {
        symbol: 'AuSIRI',
        name: 'Gold Reserve Token',
        value: 147000,
        quantity: 29200,
        price: 5.03,
        change: 0.075,
        changePercent: 1.52,
        allocation: 60
      },
      {
        symbol: 'AuAERO',
        name: 'Aerospace Hybrid Token',
        value: 98000,
        quantity: 3890,
        price: 25.19,
        change: -0.38,
        changePercent: -1.49,
        allocation: 40
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Background */}
      <div className="fixed inset-0 z-0">
        <HeroBackground />
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* European-Style Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-light text-gray-900 tracking-tight">
                COW
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                  <Globe className="w-3 h-3 mr-1" />
                  International
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                  🇪🇺 MiFID II
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Currency Selector */}
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF</option>
              </select>
              
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
            <h1 className="text-4xl font-light text-gray-900">International Portfolio</h1>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                MiFID II Compliant
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                <Shield className="w-3 h-3 mr-1" />
                GDPR Protected
              </Badge>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-light">
            European regulatory framework with global investment opportunities and multi-currency support
          </p>
        </div>

        {/* MiFID II Information Banner */}
        <Card className="bg-blue-50/80 border-blue-200 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">MiFID II Investor Protection</h3>
                <p className="text-sm text-blue-800">
                  Your investments are protected under European MiFID II regulations. This includes best execution requirements, 
                  appropriate product matching, and transparent fee disclosure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Portfolio Value</p>
                  <p className="text-3xl font-light text-gray-900">{formatCurrency(portfolioData.totalValue)}</p>
                  <p className="text-xs text-gray-500">Base: €{portfolioData.totalValue.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-center">
                  <DollarSign className="h-6 w-6 text-green-600 mb-1" />
                  <span className="text-xs font-medium">{selectedCurrency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Daily Return</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-light text-green-600 mr-2">
                      +{formatCurrency(portfolioData.todayChange)}
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
                  <p className="text-2xl font-light text-blue-600">{portfolioData.yearlyReturn}%</p>
                  <p className="text-sm text-gray-600">EONIA +{(portfolioData.yearlyReturn + 0.5).toFixed(1)}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ESG Rating</p>
                  <p className="text-2xl font-light text-green-600">A-</p>
                  <p className="text-sm text-gray-600">Sustainable investing</p>
                </div>
                <Scale className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* International Features Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-xl border border-gray-200/50 p-1 shadow-sm">
            <TabsTrigger value="portfolio" className="font-medium">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="compliance" className="font-medium">MiFID II Compliance</TabsTrigger>
            <TabsTrigger value="currencies" className="font-medium">Multi-Currency</TabsTrigger>
            <TabsTrigger value="esg" className="font-medium">ESG & Sustainability</TabsTrigger>
          </TabsList>

          {/* Portfolio Overview Tab */}
          <TabsContent value="portfolio">
            <div className="grid gap-6">
              
              {/* Holdings Table */}
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader className="border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Global Holdings ({selectedCurrency})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holdings</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ({selectedCurrency})</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value ({selectedCurrency})</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EU Compliant</th>
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
                              {formatCurrency(holding.price)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(holding.value)}
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
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Compliant
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Performance */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>European Market Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">vs EURO STOXX 50</span>
                      <span className="text-sm font-semibold text-green-600">+12.4%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">vs Gold (EUR)</span>
                      <span className="text-sm font-semibold text-green-600">+5.8%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Currency Impact</span>
                      <span className="text-sm font-semibold text-blue-600">+2.1%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Inflation Protection</span>
                      <span className="text-sm font-semibold text-green-600">Effective</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Tax Optimization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">EU Tax Efficiency</span>
                      <Badge className="bg-green-100 text-green-800">Optimized</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Withholding Tax</span>
                      <span className="text-sm font-semibold text-gray-900">0%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Capital Gains (Est.)</span>
                      <span className="text-sm font-semibold text-gray-900">15-25%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Treaty Benefits</span>
                      <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* MiFID II Compliance Tab */}
          <TabsContent value="compliance">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    MiFID II Investor Protection Framework
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    
                    {/* Suitability Assessment */}
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-4">Suitability Assessment Status</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Investment Knowledge</span>
                            <Badge className="bg-green-100 text-green-800">Advanced</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Risk Tolerance</span>
                            <Badge className="bg-amber-100 text-amber-800">Moderate-High</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Investment Experience</span>
                            <Badge className="bg-green-100 text-green-800">Qualified</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Financial Situation</span>
                            <Badge className="bg-green-100 text-green-800">Suitable</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Investment Objectives</span>
                            <Badge className="bg-blue-100 text-blue-800">Aligned</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800">Last Assessment</span>
                            <span className="text-sm text-blue-800">2024-08-15</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Product Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">AuSIRI Classification</span>
                            <Badge className="bg-green-100 text-green-800">Non-Complex</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">AuAERO Classification</span>
                            <Badge className="bg-amber-100 text-amber-800">Complex</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">PRIIPs KID</span>
                            <Badge className="bg-blue-100 text-blue-800">Available</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">RTS 28 Reports</span>
                            <Badge className="bg-green-100 text-green-800">Current</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Investor Rights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Best Execution</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Cost Transparency</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Conflicts of Interest</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Client Categorisation</span>
                            <Badge className="bg-blue-100 text-blue-800">Retail</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Regulatory Documents */}
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle>Regulatory Documentation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          {[
                            { name: 'PRIIPs KID - AuSIRI', status: 'Current', date: '2024-09-01' },
                            { name: 'PRIIPs KID - AuAERO', status: 'Current', date: '2024-09-01' },
                            { name: 'MiFID II Disclosures', status: 'Acknowledged', date: '2024-08-15' },
                            { name: 'Cost & Charges Report', status: 'Quarterly', date: '2024-09-30' },
                            { name: 'Best Execution Policy', status: 'Current', date: '2024-01-01' },
                            { name: 'Risk Warnings', status: 'Acknowledged', date: '2024-08-15' }
                          ].map((doc) => (
                            <div key={doc.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-sm text-gray-900">{doc.name}</h4>
                                <FileText className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="space-y-1">
                                <Badge variant="outline" className="text-xs">
                                  {doc.status}
                                </Badge>
                                <p className="text-xs text-gray-500">{doc.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Multi-Currency Tab */}
          <TabsContent value="currencies">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Multi-Currency Portfolio Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    
                    {/* Currency Exposure */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Currency Exposure</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇺🇸</span>
                                <span className="text-sm">USD</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">65%</div>
                                <div className="text-xs text-gray-500">Underlying assets</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🇪🇺</span>
                                <span className="text-sm">EUR</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">25%</div>
                                <div className="text-xs text-gray-500">Reporting currency</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🌍</span>
                                <span className="text-sm">Other</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">10%</div>
                                <div className="text-xs text-gray-500">Diversification</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Currency Hedging</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">USD Hedging Ratio</span>
                            <span className="text-sm font-medium">40%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Currency Impact (YTD)</span>
                            <span className="text-sm font-medium text-green-600">+2.1%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Hedging Cost</span>
                            <span className="text-sm font-medium">-0.3%</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Net Currency Benefit</span>
                            <span className="text-sm font-medium text-green-600">+1.8%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Exchange Rates */}
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle>Current Exchange Rates</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          {Object.entries(currencyRates).map(([currency, rate]) => (
                            <div key={currency} className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">EUR to {currency}</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {rate === 1 ? '1.0000' : rate.toFixed(4)}
                              </div>
                              <div className="text-xs text-green-600">+0.12%</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ESG & Sustainability Tab */}
          <TabsContent value="esg">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    ESG & Sustainable Investing
                  </CardTitle>
                  <p className="text-sm text-gray-600">Environmental, Social, and Governance impact assessment</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    
                    {/* ESG Scores */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="border border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🌱</span>
                          </div>
                          <h3 className="font-semibold text-green-900 mb-2">Environmental</h3>
                          <div className="text-3xl font-bold text-green-700 mb-2">A</div>
                          <p className="text-sm text-green-600">Low carbon footprint, sustainable resource management</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-blue-200 bg-blue-50">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">👥</span>
                          </div>
                          <h3 className="font-semibold text-blue-900 mb-2">Social</h3>
                          <div className="text-3xl font-bold text-blue-700 mb-2">B+</div>
                          <p className="text-sm text-blue-600">Fair labor practices, community investment</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-purple-200 bg-purple-50">
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚖️</span>
                          </div>
                          <h3 className="font-semibold text-purple-900 mb-2">Governance</h3>
                          <div className="text-3xl font-bold text-purple-700 mb-2">A-</div>
                          <p className="text-sm text-purple-600">Transparent reporting, ethical business practices</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Sustainability Metrics */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Sustainability Impact</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Carbon Intensity</span>
                            <span className="text-sm font-medium text-green-600">Low</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Water Usage</span>
                            <span className="text-sm font-medium text-green-600">Minimal</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Waste Generation</span>
                            <span className="text-sm font-medium text-green-600">Very Low</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Renewable Energy</span>
                            <span className="text-sm font-medium text-green-600">78%</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader>
                          <CardTitle className="text-lg">EU Taxonomy Alignment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Climate Mitigation</span>
                            <Badge className="bg-green-100 text-green-800">Aligned</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Climate Adaptation</span>
                            <Badge className="bg-green-100 text-green-800">Aligned</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Circular Economy</span>
                            <Badge className="bg-amber-100 text-amber-800">Partially</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Overall Alignment</span>
                            <span className="text-sm font-medium">67%</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* SFDR Classification */}
                    <Card className="bg-green-50 border border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Scale className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-green-900">SFDR Article 8 Classification</h3>
                            <p className="text-sm text-green-700">Promotes environmental and social characteristics</p>
                          </div>
                        </div>
                        <p className="text-sm text-green-800 leading-relaxed">
                          This portfolio qualifies as an Article 8 product under the EU Sustainable Finance Disclosure Regulation (SFDR), 
                          meaning it promotes environmental and social characteristics while maintaining financial returns as the primary objective.
                        </p>
                      </CardContent>
                    </Card>
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