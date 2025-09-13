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
  FileText, 
  Shield, 
  Users, 
  Building,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuthContext } from '@/lib/auth-context'
import { HeroBackground } from '@/components/hero-background'

export default function InstitutionalDashboardPage() {
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
    totalValue: 12580000,
    todayChange: 156000,
    todayChangePercent: 1.26,
    holdings: [
      {
        symbol: 'AuSIRI',
        name: 'Gold Reserve Token',
        value: 7548000,
        quantity: 1500000,
        price: 5.032,
        change: 0.086,
        changePercent: 1.74,
        allocation: 60
      },
      {
        symbol: 'AuAERO',
        name: 'Aerospace Hybrid Token',
        value: 5032000,
        quantity: 200000,
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
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Professional Navigation */}
      <nav className="relative z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-light text-gray-900 tracking-tight">
                COW
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                  <Building className="w-3 h-3 mr-1" />
                  Institutional
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
            <h1 className="text-4xl font-light text-gray-900">Institutional Portfolio</h1>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                KYC Verified
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                <Shield className="w-3 h-3 mr-1" />
                Accredited
              </Badge>
            </div>
          </div>
          <p className="text-xl text-gray-600 font-light">
            Professional-grade asset management with institutional reporting and compliance tools
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Portfolio Value</p>
                  <p className="text-3xl font-light text-gray-900">${(portfolioData.totalValue / 1000000).toFixed(2)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Today's P&L</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-light text-green-600 mr-2">
                      +${(portfolioData.todayChange / 1000).toFixed(0)}K
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600">+{portfolioData.todayChangePercent}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Asset Classes</p>
                  <p className="text-2xl font-light text-gray-900">2</p>
                  <p className="text-sm text-gray-600">Gold + Aerospace</p>
                </div>
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Risk Score</p>
                  <p className="text-2xl font-light text-amber-600">Moderate</p>
                  <p className="text-sm text-gray-600">4.2/10</p>
                </div>
                <BarChart3 className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institutional Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-xl border border-gray-200/50 p-1 shadow-sm">
            <TabsTrigger value="portfolio" className="font-medium">Portfolio Management</TabsTrigger>
            <TabsTrigger value="reporting" className="font-medium">Institutional Reporting</TabsTrigger>
            <TabsTrigger value="compliance" className="font-medium">Compliance & Risk</TabsTrigger>
            <TabsTrigger value="allocations" className="font-medium">Strategic Allocations</TabsTrigger>
          </TabsList>

          {/* Portfolio Management Tab */}
          <TabsContent value="portfolio">
            <div className="grid gap-6">
              
              {/* Holdings Table */}
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader className="border-b border-gray-200/50">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Current Holdings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
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
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {holding.quantity.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ${holding.price.toFixed(3)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              ${(holding.value / 1000000).toFixed(2)}M
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
                              <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${holding.allocation}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-900">{holding.allocation}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Institutional Analytics */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">30-Day Return</span>
                      <span className="text-sm font-semibold text-green-600">+8.4%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Sharpe Ratio</span>
                      <span className="text-sm font-semibold text-gray-900">2.34</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Max Drawdown</span>
                      <span className="text-sm font-semibold text-red-600">-3.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Beta (vs Gold)</span>
                      <span className="text-sm font-semibold text-gray-900">0.87</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Asset Quality Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Gold Reserve Audit</span>
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Aircraft Utilization</span>
                      <span className="text-sm font-semibold text-gray-900">94.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Revenue Stability</span>
                      <Badge className="bg-blue-100 text-blue-800">High</Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">ESG Score</span>
                      <span className="text-sm font-semibold text-green-600">A-</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Institutional Reporting Tab */}
          <TabsContent value="reporting">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Institutional Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Monthly Performance Report', date: '2025-09-01', status: 'Ready' },
                      { name: 'Quarterly Compliance Report', date: '2025-08-31', status: 'Ready' },
                      { name: 'Annual Audit Report', date: '2024-12-31', status: 'Ready' },
                      { name: 'Risk Assessment', date: '2025-09-10', status: 'Processing' },
                      { name: 'ESG Impact Report', date: '2025-08-30', status: 'Ready' },
                      { name: 'Tax Documentation', date: '2025-09-01', status: 'Ready' }
                    ].map((report) => (
                      <div key={report.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900">{report.name}</h4>
                          <Badge 
                            variant={report.status === 'Ready' ? 'default' : 'secondary'}
                            className={report.status === 'Ready' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{report.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance & Risk Tab */}
          <TabsContent value="compliance">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { item: 'Institutional KYC', status: 'Verified', icon: CheckCircle, color: 'text-green-600' },
                      { item: 'AML Screening', status: 'Current', icon: CheckCircle, color: 'text-green-600' },
                      { item: 'SEC Registration', status: 'Pending', icon: Clock, color: 'text-amber-600' },
                      { item: 'CFTC Compliance', status: 'Current', icon: CheckCircle, color: 'text-green-600' },
                      { item: 'Risk Disclosure', status: 'Acknowledged', icon: CheckCircle, color: 'text-green-600' }
                    ].map((item) => (
                      <div key={item.item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">{item.item}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${item.color}`}>{item.status}</span>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle>Risk Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Portfolio VaR (95%)</span>
                        <span className="font-semibold">$287K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Concentration Risk</span>
                        <span className="font-semibold text-green-600">Low</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Liquidity Risk</span>
                        <span className="font-semibold text-amber-600">Moderate</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Strategic Allocations Tab */}
          <TabsContent value="allocations">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Recommended Strategic Allocations</CardTitle>
                  <p className="text-sm text-gray-600">Based on your institutional investment profile and risk parameters</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        name: 'Conservative Institutional',
                        description: 'Capital preservation focused',
                        allocations: { ausiri: 70, auaero: 30 },
                        expectedReturn: '8-12%',
                        riskLevel: 'Low-Medium'
                      },
                      {
                        name: 'Balanced Institutional',
                        description: 'Growth with stability',
                        allocations: { ausiri: 60, auaero: 40 },
                        expectedReturn: '12-18%',
                        riskLevel: 'Medium',
                        recommended: true
                      },
                      {
                        name: 'Growth Institutional',
                        description: 'Maximum performance',
                        allocations: { ausiri: 40, auaero: 60 },
                        expectedReturn: '18-25%',
                        riskLevel: 'Medium-High'
                      }
                    ].map((allocation) => (
                      <div key={allocation.name} className={`p-6 border-2 rounded-2xl transition-all ${
                        allocation.recommended 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {allocation.recommended && (
                          <Badge className="mb-3 bg-amber-500 text-white">Recommended</Badge>
                        )}
                        <h3 className="font-semibold text-lg mb-2">{allocation.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{allocation.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm">AuSIRI (Gold)</span>
                            <span className="text-sm font-medium">{allocation.allocations.ausiri}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${allocation.allocations.ausiri}%` }}></div>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm">AuAERO (Aerospace)</span>
                            <span className="text-sm font-medium">{allocation.allocations.auaero}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${allocation.allocations.auaero}%` }}></div>
                          </div>
                        </div>

                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Return</span>
                            <span className="font-medium">{allocation.expectedReturn}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Risk Level</span>
                            <span className="font-medium">{allocation.riskLevel}</span>
                          </div>
                        </div>

                        <Button className="w-full mt-4" variant={allocation.recommended ? 'default' : 'outline'}>
                          Apply Allocation
                        </Button>
                      </div>
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