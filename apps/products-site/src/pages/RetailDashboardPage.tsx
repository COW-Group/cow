import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Target, 
  BookOpen, 
  Shield, 
  Globe,
  ChevronRight,
  Star,
  BarChart3,
  Wallet,
  GraduationCap,
  Bell,
  Settings
} from 'lucide-react'

export default function RetailDashboardPage() {
  const [activeTab, setActiveTab] = useState('portfolio')

  const portfolioValue = 45750
  const monthlyGain = 2340
  const gainPercentage = 5.4

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900">Welcome back, Alex</h1>
              <p className="text-gray-600">Individual Investor Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Portfolio Value</p>
                  <p className="text-2xl font-semibold text-gray-900">${portfolioValue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{gainPercentage}% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Gain</p>
                  <p className="text-2xl font-semibold text-gray-900">+${monthlyGain.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">vs last month</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Asset Allocation</p>
                  <p className="text-lg font-semibold text-gray-900">Balanced</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">60% RWA / 40% Traditional</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <p className="text-lg font-semibold text-gray-900">Moderate</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Suitable for growth</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-xl rounded-xl p-1 shadow-lg w-fit">
            {[
              { id: 'portfolio', label: 'Portfolio', icon: PieChart },
              { id: 'invest', label: 'Invest', icon: TrendingUp },
              { id: 'learn', label: 'Learn', icon: GraduationCap },
              { id: 'goals', label: 'Goals', icon: Target }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Breakdown */}
            <Card className="lg:col-span-2 bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2 text-amber-600" />
                  Your Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Real Estate Tokens', value: 18300, percentage: 40, color: 'bg-blue-500' },
                    { name: 'Infrastructure Bonds', value: 13725, percentage: 30, color: 'bg-green-500' },
                    { name: 'Gold-backed Assets', value: 9150, percentage: 20, color: 'bg-yellow-500' },
                    { name: 'Traditional ETFs', value: 4575, percentage: 10, color: 'bg-purple-500' }
                  ].map((asset) => (
                    <div key={asset.name} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${asset.color} mr-3`} />
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-600">{asset.percentage}% of portfolio</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${asset.value.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">+2.3%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-amber-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Purchased', asset: 'Real Estate Token', amount: '+$500', time: '2h ago', positive: true },
                    { action: 'Dividend', asset: 'Infrastructure Bond', amount: '+$45', time: '1d ago', positive: true },
                    { action: 'Rebalanced', asset: 'Portfolio', amount: '', time: '3d ago', positive: null },
                    { action: 'Purchased', asset: 'Gold Token', amount: '+$200', time: '5d ago', positive: true }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.asset}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <span className={`font-semibold ${activity.positive ? 'text-green-600' : 'text-red-600'}`}>
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'invest' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Investment Opportunities */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
                  Recommended for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Residential Real Estate Portfolio',
                      description: 'Diversified rental properties across major US cities',
                      minInvestment: '$100',
                      expectedReturn: '8-12%',
                      rating: 4.5,
                      riskLevel: 'Medium'
                    },
                    {
                      name: 'Renewable Energy Infrastructure',
                      description: 'Solar and wind farm investments with stable returns',
                      minInvestment: '$50',
                      expectedReturn: '6-10%',
                      rating: 4.7,
                      riskLevel: 'Low-Medium'
                    },
                    {
                      name: 'Agricultural Land Tokens',
                      description: 'Farmland investments with commodity exposure',
                      minInvestment: '$25',
                      expectedReturn: '5-8%',
                      rating: 4.2,
                      riskLevel: 'Medium'
                    }
                  ].map((investment, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-xl border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{investment.description}</p>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{investment.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Min Investment</p>
                          <p className="font-semibold">{investment.minInvestment}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Return</p>
                          <p className="font-semibold text-green-600">{investment.expectedReturn}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Risk Level</p>
                          <p className="font-semibold">{investment.riskLevel}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                        Invest Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Tools */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-amber-600" />
                  Investment Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Auto-Invest</h3>
                        <p className="text-sm text-gray-600">Set up recurring investments</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Portfolio Rebalancing</h3>
                        <p className="text-sm text-gray-600">Maintain optimal allocation</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                        <p className="text-sm text-gray-600">Update your risk profile</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Tax Optimization</h3>
                        <p className="text-sm text-gray-600">Minimize tax impact</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Educational Content */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-amber-600" />
                  Investment Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Real World Assets 101',
                      description: 'Understanding tokenized real-world assets',
                      progress: 75,
                      duration: '15 min'
                    },
                    {
                      title: 'Diversification Strategies',
                      description: 'Building a balanced investment portfolio',
                      progress: 45,
                      duration: '20 min'
                    },
                    {
                      title: 'Risk Management',
                      description: 'Protecting your investments',
                      progress: 0,
                      duration: '25 min'
                    },
                    {
                      title: 'Tax-Efficient Investing',
                      description: 'Maximizing after-tax returns',
                      progress: 0,
                      duration: '18 min'
                    }
                  ].map((course, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{course.duration}</p>
                        </div>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      </div>
                      {course.progress > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button variant="outline" className="w-full mt-3">
                        {course.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-amber-600" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Real Estate Market Update',
                      summary: 'Commercial real estate showing resilience with 4.2% quarterly growth...',
                      category: 'Real Estate',
                      readTime: '3 min read',
                      trending: true
                    },
                    {
                      title: 'Infrastructure Investment Trends',
                      summary: 'Government spending on renewable energy infrastructure reaches record highs...',
                      category: 'Infrastructure',
                      readTime: '5 min read',
                      trending: false
                    },
                    {
                      title: 'Commodities Outlook 2024',
                      summary: 'Gold and agricultural commodities positioned for growth amid economic uncertainty...',
                      category: 'Commodities',
                      readTime: '4 min read',
                      trending: true
                    }
                  ].map((article, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{article.title}</h3>
                        {article.trending && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                            Trending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-500">{article.readTime}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Read More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Goals */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-amber-600" />
                  Your Financial Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      name: 'Emergency Fund',
                      target: 15000,
                      current: 12000,
                      timeline: '6 months',
                      priority: 'High'
                    },
                    {
                      name: 'Down Payment Fund',
                      target: 50000,
                      current: 28000,
                      timeline: '2 years',
                      priority: 'Medium'
                    },
                    {
                      name: 'Retirement Savings',
                      target: 500000,
                      current: 85000,
                      timeline: '20 years',
                      priority: 'High'
                    }
                  ].map((goal, index) => {
                    const progress = (goal.current / goal.target) * 100
                    return (
                      <div key={index} className="p-4 bg-white/50 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                            <p className="text-sm text-gray-600">{goal.timeline} • {goal.priority} Priority</p>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            ${goal.current.toLocaleString()} saved
                          </span>
                          <span className="font-medium text-gray-900">
                            ${goal.target.toLocaleString()} target
                          </span>
                        </div>
                        <Button variant="outline" className="w-full mt-3">
                          Adjust Goal
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Goal Planning Tools */}
            <Card className="bg-white/60 backdrop-blur-xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-amber-600" />
                  Planning Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Goal Calculator</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Calculate how much you need to save monthly to reach your goals
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Use Calculator
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Retirement Planner</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Plan your retirement with our comprehensive planning tool
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Plan Retirement
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Investment Strategy</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Get personalized investment recommendations for your goals
                    </p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Get Recommendations
                    </Button>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Tax Planning</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Optimize your investments for tax efficiency
                    </p>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      Optimize Taxes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}