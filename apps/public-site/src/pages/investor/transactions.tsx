"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorLayout from '../../components/layout/InvestorLayout'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import type { TradeOrder, InvestmentHolding } from '../../lib/types'

interface TransactionSummary {
  totalOrders: number
  totalInvested: number
  pendingOrders: number
  pendingAmount: number
  completedOrders: number
  completedAmount: number
}

export default function InvestorTransactions() {
  const { auth, loading: authLoading } = useAuthContext()
  const [tradeOrders, setTradeOrders] = useState<TradeOrder[]>([])
  const [holdings, setHoldings] = useState<InvestmentHolding[]>([])
  const [summary, setSummary] = useState<TransactionSummary>({
    totalOrders: 0,
    totalInvested: 0,
    pendingOrders: 0,
    pendingAmount: 0,
    completedOrders: 0,
    completedAmount: 0
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'executed' | 'rejected' | 'cancelled'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (auth.user && !authLoading) {
      loadTransactionData()
    }
  }, [auth.user, authLoading])

  const loadTransactionData = async () => {
    try {
      setLoading(true)
      const { databaseService } = await import('../../lib/database-service')

      const [ordersData, holdingsData] = await Promise.all([
        databaseService.fetchUserTradeOrders(auth.user!.id),
        databaseService.fetchUserHoldings(auth.user!.id)
      ])

      setTradeOrders(ordersData)
      setHoldings(holdingsData)

      // Calculate summary
      const pending = ordersData.filter(order => order.status === 'pending')
      const executed = ordersData.filter(order => order.status === 'executed')
      
      const totalInvested = holdingsData.reduce((sum, holding) => 
        sum + (holding.quantity * holding.purchasePrice), 0)

      setSummary({
        totalOrders: ordersData.length,
        totalInvested,
        pendingOrders: pending.length,
        pendingAmount: pending.reduce((sum, order) => sum + order.totalAmount, 0),
        completedOrders: executed.length,
        completedAmount: executed.reduce((sum, order) => sum + order.totalAmount, 0)
      })
    } catch (error) {
      console.error('Error loading transaction data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = tradeOrders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.submittedAt).getTime()
        bValue = new Date(b.submittedAt).getTime()
        break
      case 'amount':
        aValue = a.totalAmount
        bValue = b.totalAmount
        break
      case 'status':
        aValue = a.status
        bValue = b.status
        break
      default:
        aValue = new Date(a.submittedAt).getTime()
        bValue = new Date(b.submittedAt).getTime()
    }

    if (sortBy === 'status') {
      return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
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

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      executed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      const { databaseService } = await import('../../lib/database-service')
      await databaseService.updateTradeOrder(orderId, { status: 'cancelled' })
      await loadTransactionData()
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order. Please try again.')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3"></div>
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
          <p className="text-gray-600 text-center mb-6">Please sign in to view your transactions.</p>
          <Button className="w-full">
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <InvestorLayout 
      currentPath="/investor/transactions"
      title="Transaction History"
      description="View your investment orders and trading activity"
    >
      <div className="max-w-7xl mx-auto p-6">

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{summary.totalOrders}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Invested</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalInvested)}</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Orders</h3>
            <p className="text-2xl font-bold text-orange-600">{summary.pendingOrders}</p>
            {summary.pendingAmount > 0 && (
              <p className="text-sm text-gray-600">{formatCurrency(summary.pendingAmount)}</p>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Orders</h3>
            <p className="text-2xl font-bold text-green-600">{summary.completedOrders}</p>
            {summary.completedAmount > 0 && (
              <p className="text-sm text-gray-600">{formatCurrency(summary.completedAmount)}</p>
            )}
          </Card>
        </div>

        {/* Transaction Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Order History</h3>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="executed">Executed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="status">Sort by Status</option>
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

          {sortedOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {filter === 'all' ? 'No transactions yet' : `No ${filter} orders found`}
              </p>
              <p className="text-sm text-gray-500 mb-6">Start investing to see your transaction history</p>
              <Button>
                <a href="/investor/opportunities">Browse Opportunities</a>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Order Details</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Total Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-600">Token Offering ID: {order.tokenOfferingId.slice(-8)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                          order.orderType === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.orderType.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{order.quantity.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{formatCurrency(order.pricePerToken)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <p className="text-sm">{new Date(order.submittedAt).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.submittedAt).toLocaleTimeString()}
                        </p>
                        {order.executedAt && (
                          <p className="text-xs text-green-600">
                            Executed: {new Date(order.executedAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          {order.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Export Options */}
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Export Transaction History</h3>
              <p className="text-sm text-gray-600">Download your transaction data for record keeping or tax purposes</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline">
                Export CSV
              </Button>
              <Button variant="outline">
                Export PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </InvestorLayout>
  )
}