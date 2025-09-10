"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorLayout from '../../components/layout/InvestorLayout'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import type { TokenOffering, Company } from '../../lib/types'

interface OpportunityFilters {
  status: 'all' | 'active' | 'upcoming' | 'closing_soon'
  tokenType: 'all' | 'ausiri' | 'auaero' | 'company_token'
  priceRange: 'all' | 'under_100' | '100_500' | 'over_500'
  industry: string
}

export default function InvestmentOpportunities() {
  const { auth, loading: authLoading } = useAuthContext()
  const [opportunities, setOpportunities] = useState<TokenOffering[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<TokenOffering[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOpportunity, setSelectedOpportunity] = useState<TokenOffering | null>(null)
  const [filters, setFilters] = useState<OpportunityFilters>({
    status: 'all',
    tokenType: 'all',
    priceRange: 'all',
    industry: 'all'
  })

  useEffect(() => {
    loadOpportunities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [opportunities, filters])

  const loadOpportunities = async () => {
    try {
      setLoading(true)
      const { databaseService } = await import('../../lib/database-service')
      
      const [opportunitiesData, companiesData] = await Promise.all([
        databaseService.fetchTokenOfferings(),
        databaseService.fetchCompanies()
      ])
      
      setOpportunities(opportunitiesData)
      setCompanies(companiesData)
    } catch (error) {
      console.error('Error loading opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...opportunities]

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'closing_soon') {
        filtered = filtered.filter(opp => {
          if (!opp.endDate) return false
          const endDate = new Date(opp.endDate)
          const now = new Date()
          const daysLeft = (endDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
          return daysLeft <= 7 && daysLeft > 0
        })
      } else {
        filtered = filtered.filter(opp => opp.status === filters.status)
      }
    }

    // Token type filter
    if (filters.tokenType !== 'all') {
      filtered = filtered.filter(opp => opp.tokenType === filters.tokenType)
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(opp => {
        switch (filters.priceRange) {
          case 'under_100':
            return opp.pricePerToken < 100
          case '100_500':
            return opp.pricePerToken >= 100 && opp.pricePerToken <= 500
          case 'over_500':
            return opp.pricePerToken > 500
          default:
            return true
        }
      })
    }

    // Industry filter
    if (filters.industry !== 'all') {
      const relevantCompanies = companies.filter(c => c.industry === filters.industry)
      const relevantCompanyIds = relevantCompanies.map(c => c.id)
      filtered = filtered.filter(opp => relevantCompanyIds.includes(opp.companyId))
    }

    setFilteredOpportunities(filtered)
  }

  const getUniqueIndustries = () => {
    const industries = companies.map(c => c.industry).filter(Boolean)
    return [...new Set(industries)]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (opportunity: TokenOffering) => {
    const now = new Date()
    const launchDate = new Date(opportunity.launchDate)
    const endDate = opportunity.endDate ? new Date(opportunity.endDate) : null

    if (opportunity.status === 'sold_out') {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">Sold Out</span>
    }
    
    if (opportunity.status === 'closed') {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Closed</span>
    }

    if (launchDate > now) {
      return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Upcoming</span>
    }

    if (endDate && endDate <= now) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Ended</span>
    }

    if (endDate) {
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
      if (daysLeft <= 7) {
        return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">Ending Soon</span>
      }
    }

    return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
  }

  const getFundingProgress = (opportunity: TokenOffering) => {
    return Math.min((opportunity.raisedAmount / opportunity.targetAmount) * 100, 100)
  }

  const getRemainingDays = (opportunity: TokenOffering) => {
    if (!opportunity.endDate) return null
    const endDate = new Date(opportunity.endDate)
    const now = new Date()
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    return daysLeft > 0 ? daysLeft : 0
  }

  const handleInvest = (opportunity: TokenOffering) => {
    if (!auth.isAuthenticated) {
      window.location.href = '/sign-in'
      return
    }
    
    // Here you would typically navigate to investment flow or open investment modal
    setSelectedOpportunity(opportunity)
    // For now, just show alert
    alert(`Investment flow for ${opportunity.name} would open here`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3"></div>
          <div className="h-12 bg-gray-300 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <InvestorLayout 
      currentPath="/investor/opportunities"
      title="Investment Opportunities"
      description="Discover and invest in tokenized assets and company offerings"
    >
      <div className="max-w-7xl mx-auto p-6">

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="closing_soon">Closing Soon</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Token Type</label>
              <select
                value={filters.tokenType}
                onChange={(e) => setFilters({...filters, tokenType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="ausiri">AUSIRI</option>
                <option value="auaero">AUAERO</option>
                <option value="company_token">Company Token</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Prices</option>
                <option value="under_100">Under $100</option>
                <option value="100_500">$100 - $500</option>
                <option value="over_500">Over $500</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({...filters, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Industries</option>
                {getUniqueIndustries().map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>

        {/* Opportunities Grid */}
        {filteredOpportunities.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No opportunities match your current filters</p>
            <Button onClick={() => setFilters({ status: 'all', tokenType: 'all', priceRange: 'all', industry: 'all' })}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(opportunity => {
              const company = companies.find(c => c.id === opportunity.companyId)
              const fundingProgress = getFundingProgress(opportunity)
              const remainingDays = getRemainingDays(opportunity)
              
              return (
                <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {company?.logo && (
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <img src={company.logo} alt={company.name} className="h-16 w-16 object-contain" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.name}</h3>
                        <p className="text-sm text-gray-600">{opportunity.symbol}</p>
                        {company && (
                          <p className="text-xs text-gray-500">{company.name}</p>
                        )}
                      </div>
                      {getStatusBadge(opportunity)}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{opportunity.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price per token</span>
                        <span className="font-medium">{formatCurrency(opportunity.pricePerToken)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Min. Investment</span>
                        <span className="font-medium">{formatCurrency(opportunity.minInvestment)}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Funding Progress</span>
                          <span className="font-medium">{fundingProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${fundingProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatCurrency(opportunity.raisedAmount)} raised</span>
                          <span>{formatCurrency(opportunity.targetAmount)} goal</span>
                        </div>
                      </div>

                      {opportunity.apyRange && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Expected APY</span>
                          <span className="font-medium text-green-600">{opportunity.apyRange}</span>
                        </div>
                      )}

                      {remainingDays !== null && remainingDays > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Time Remaining</span>
                          <span className="font-medium text-orange-600">
                            {remainingDays} day{remainingDays !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleInvest(opportunity)}
                        disabled={opportunity.status === 'sold_out' || opportunity.status === 'closed'}
                      >
                        {opportunity.status === 'sold_out' ? 'Sold Out' : 
                         opportunity.status === 'closed' ? 'Closed' : 'Invest Now'}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </InvestorLayout>
  )
}