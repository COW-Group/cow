"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorLayout from '../../components/layout/InvestorLayout'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import type { InvestmentHolding } from '../../lib/types'

interface PortfolioSummary {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  bestPerformer: InvestmentHolding | null
  worstPerformer: InvestmentHolding | null
}

export default function InvestorPortfolio() {
  const { auth, loading: authLoading } = useAuthContext()
  const [holdings, setHoldings] = useState<InvestmentHolding[]>([])
  const [summary, setSummary] = useState<PortfolioSummary>({
    totalValue: 0,
    totalInvested: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    bestPerformer: null,
    worstPerformer: null
  })
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'date'>('value')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (auth.user && !authLoading) {
      loadPortfolioData()
    }
  }, [auth.user, authLoading])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const { databaseService } = await import('../../lib/database-service')
      const holdingsData = await databaseService.fetchUserHoldings(auth.user!.id)
      
      setHoldings(holdingsData)
      
      if (holdingsData.length > 0) {
        const totalValue = holdingsData.reduce((sum, h) => sum + h.totalValue, 0)
        const totalInvested = holdingsData.reduce((sum, h) => sum + (h.quantity * h.purchasePrice), 0)
        const totalGainLoss = holdingsData.reduce((sum, h) => sum + h.unrealizedGainLoss, 0)
        
        const bestPerformer = holdingsData.reduce((best, current) => {
          const bestPercent = best ? (best.unrealizedGainLoss / (best.quantity * best.purchasePrice)) : -Infinity
          const currentPercent = current.unrealizedGainLoss / (current.quantity * current.purchasePrice)
          return currentPercent > bestPercent ? current : best
        }, null as InvestmentHolding | null)
        
        const worstPerformer = holdingsData.reduce((worst, current) => {
          const worstPercent = worst ? (worst.unrealizedGainLoss / (worst.quantity * worst.purchasePrice)) : Infinity
          const currentPercent = current.unrealizedGainLoss / (current.quantity * current.purchasePrice)
          return currentPercent < worstPercent ? current : worst
        }, null as InvestmentHolding | null)

        setSummary({
          totalValue,
          totalInvested,
          totalGainLoss,
          totalGainLossPercent: totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0,
          bestPerformer,
          worstPerformer
        })
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedHoldings = [...holdings].sort((a, b) => {
    let aValue: number
    let bValue: number

    switch (sortBy) {
      case 'value':
        aValue = a.totalValue
        bValue = b.totalValue
        break
      case 'gainLoss':
        aValue = a.unrealizedGainLoss
        bValue = b.unrealizedGainLoss
        break
      case 'date':
        aValue = new Date(a.purchaseDate).getTime()
        bValue = new Date(b.purchaseDate).getTime()
        break
      default:
        aValue = a.totalValue
        bValue = b.totalValue
    }

    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  })

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

  const getPerformancePercent = (holding: InvestmentHolding) => {
    const invested = holding.quantity * holding.purchasePrice
    return invested > 0 ? (holding.unrealizedGainLoss / invested) * 100 : 0
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Access Required</h2>
          <p className="text-gray-600 text-center mb-6">Please sign in to view your portfolio.</p>
          <Button className="w-full">
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <InvestorLayout 
      currentPath="/investor/portfolio"
      title="Portfolio"
      description="Track your investment holdings and performance"
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-end mb-8">
          <Button>
            <a href="/investor/opportunities">Browse Opportunities</a>
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalValue)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Invested</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalInvested)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total P&L</h3>
            <p className={`text-2xl font-bold ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.totalGainLoss)}
            </p>
            <p className={`text-sm ${summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(summary.totalGainLossPercent)}
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Holdings</h3>
            <p className="text-2xl font-bold text-gray-900">{holdings.length}</p>
            <p className="text-sm text-gray-600">Active positions</p>
          </Card>
        </div>

        {/* Performance Highlights */}
        {(summary.bestPerformer || summary.worstPerformer) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {summary.bestPerformer && (
              <Card className="p-6">
                <h3 className="text-sm font-medium text-green-600 mb-2">Best Performer</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{summary.bestPerformer.tokenSymbol}</p>
                    <p className="text-sm text-gray-600">{summary.bestPerformer.quantity.toLocaleString()} tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">
                      +{formatPercent(getPerformancePercent(summary.bestPerformer))}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(summary.bestPerformer.unrealizedGainLoss)}
                    </p>
                  </div>
                </div>
              </Card>
            )}
            
            {summary.worstPerformer && (
              <Card className="p-6">
                <h3 className="text-sm font-medium text-red-600 mb-2">Needs Attention</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{summary.worstPerformer.tokenSymbol}</p>
                    <p className="text-sm text-gray-600">{summary.worstPerformer.quantity.toLocaleString()} tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">
                      {formatPercent(getPerformancePercent(summary.worstPerformer))}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(summary.worstPerformer.unrealizedGainLoss)}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Holdings Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Holdings Details</h3>
            <div className="flex items-center space-x-4">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="value">Sort by Value</option>
                <option value="gainLoss">Sort by P&L</option>
                <option value="date">Sort by Date</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </Button>
            </div>
          </div>

          {holdings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No holdings yet</p>
              <p className="text-sm text-gray-500 mb-6">Start building your portfolio by investing in token offerings</p>
              <Button>
                <a href="/investor/opportunities">Browse Opportunities</a>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Token</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Avg. Price</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Current Value</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">P&L</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Purchase Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHoldings.map(holding => (
                    <tr key={holding.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{holding.tokenSymbol}</p>
                          <p className="text-sm text-gray-600">{holding.tokenName}</p>
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {holding.tokenType}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{holding.quantity.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{formatCurrency(holding.purchasePrice)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{formatCurrency(holding.totalValue)}</p>
                        <p className="text-sm text-gray-600">
                          @ {formatCurrency(holding.currentPrice)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className={`font-medium ${holding.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(holding.unrealizedGainLoss)}
                        </p>
                        <p className={`text-sm ${holding.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(getPerformancePercent(holding))}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(holding.purchaseDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </InvestorLayout>
  )
}