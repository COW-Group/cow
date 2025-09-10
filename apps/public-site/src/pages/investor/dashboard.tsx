"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorLayout from '../../components/layout/InvestorLayout'
import { QuickAccessWidget } from '../../components/investor/InvestorNavigation'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import type { InvestmentHolding, TokenOffering, TradeOrder } from '../../lib/types'

interface DashboardStats {
  totalPortfolioValue: number
  totalInvested: number
  unrealizedGainLoss: number
  unrealizedGainLossPercent: number
  activeInvestments: number
  pendingOrders: number
}

export default function InvestorDashboard() {
  const { auth, loading: authLoading } = useAuthContext()
  const [holdings, setHoldings] = useState<InvestmentHolding[]>([])
  const [opportunities, setOpportunities] = useState<TokenOffering[]>([])
  const [recentOrders, setRecentOrders] = useState<TradeOrder[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPortfolioValue: 0,
    totalInvested: 0,
    unrealizedGainLoss: 0,
    unrealizedGainLossPercent: 0,
    activeInvestments: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth.user && !authLoading) {
      loadDashboardData()
    }
  }, [auth.user, authLoading])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const { databaseService } = await import('../../lib/database-service')

      const [holdingsData, opportunitiesData, ordersData] = await Promise.all([
        databaseService.fetchUserHoldings(auth.user!.id),
        databaseService.fetchTokenOfferings('active'),
        databaseService.fetchUserTradeOrders(auth.user!.id)
      ])

      setHoldings(holdingsData)
      setOpportunities(opportunitiesData.slice(0, 3))
      
      const pendingOrders = ordersData.filter(order => order.status === 'pending')
      setRecentOrders(ordersData.slice(0, 5))

      const dashboardStats: DashboardStats = {
        totalPortfolioValue: holdingsData.reduce((sum, holding) => sum + holding.totalValue, 0),
        totalInvested: holdingsData.reduce((sum, holding) => sum + (holding.quantity * holding.purchasePrice), 0),
        unrealizedGainLoss: holdingsData.reduce((sum, holding) => sum + holding.unrealizedGainLoss, 0),
        unrealizedGainLossPercent: 0,
        activeInvestments: holdingsData.length,
        pendingOrders: pendingOrders.length
      }

      if (dashboardStats.totalInvested > 0) {
        dashboardStats.unrealizedGainLossPercent = (dashboardStats.unrealizedGainLoss / dashboardStats.totalInvested) * 100
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-300 rounded"></div>
            <div className="h-80 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Access Required</h2>
          <p className="text-gray-600 text-center mb-6">Please sign in to access your investor dashboard.</p>
          <Button className="w-full">
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  return (
    <InvestorLayout 
      currentPath="/investor/dashboard"
      title={`Welcome back, ${auth.profile?.name || 'Investor'}`}
      description="Here's your investment portfolio overview"
    >
      <div className="max-w-7xl mx-auto p-6">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalPortfolioValue)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Invested</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalInvested)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Unrealized P&L</h3>
            <p className={`text-3xl font-bold ${stats.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.unrealizedGainLoss)}
            </p>
            <p className={`text-sm ${stats.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(stats.unrealizedGainLossPercent)}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Investments</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.activeInvestments}</p>
            {stats.pendingOrders > 0 && (
              <p className="text-sm text-orange-600">{stats.pendingOrders} pending orders</p>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <QuickAccessWidget />
          
          {/* Recent Holdings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Holdings</h3>
              <Button variant="outline" size="sm">
                <a href="/investor/portfolio">View All</a>
              </Button>
            </div>
            
            {holdings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No investments yet</p>
                <Button>
                  <a href="/investor/opportunities">Browse Opportunities</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {holdings.slice(0, 5).map(holding => (
                  <div key={holding.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{holding.tokenSymbol}</p>
                      <p className="text-sm text-gray-600">{holding.quantity.toLocaleString()} tokens</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(holding.totalValue)}</p>
                      <p className={`text-sm ${holding.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(holding.unrealizedGainLoss)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Investment Opportunities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">New Opportunities</h3>
              <Button variant="outline" size="sm">
                <a href="/investor/opportunities">View All</a>
              </Button>
            </div>
            
            <div className="space-y-4">
              {opportunities.map(opportunity => (
                <div key={opportunity.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{opportunity.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.symbol}</p>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(opportunity.pricePerToken)} per token
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {((opportunity.raisedAmount / opportunity.targetAmount) * 100).toFixed(0)}% funded
                      </p>
                      <Button size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentOrders.length > 0 && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="outline" size="sm">
                <a href="/investor/transactions">View All</a>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{order.orderType} Order</p>
                    <p className="text-sm text-gray-600">
                      {order.quantity.toLocaleString()} tokens at {formatCurrency(order.pricePerToken)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      order.status === 'executed' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </InvestorLayout>
  )
}