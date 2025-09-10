"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { 
  TokenOffering, 
  InvestmentHolding, 
  InvestmentIntent, 
  TradeOrder 
} from "./types"
import { useAuthContext } from "./auth-context"
import { useWeb3Context } from "./web3-context"

interface HoldingsContextType {
  holdings: InvestmentHolding[]
  intents: InvestmentIntent[]
  tradeOrders: TradeOrder[]
  
  loading: boolean
  error: string | null
  
  addToIntents: (tokenOffering: TokenOffering, quantity: number) => void
  removeFromIntents: (tokenOfferingId: string) => void
  updateIntentQuantity: (tokenOfferingId: string, quantity: number) => void
  clearIntents: () => void
  
  executeIntent: (intent: InvestmentIntent) => Promise<string>
  placeSellOrder: (holdingId: string, quantity: number, pricePerToken: number) => Promise<void>
  cancelTradeOrder: (orderId: string) => Promise<void>
  
  getTotalPortfolioValue: () => number
  getTotalUnrealizedGainLoss: () => number
  getTotalIntentsValue: () => number
  getHoldingsByTokenType: (tokenType: string) => InvestmentHolding[]
  
  refreshHoldings: () => Promise<void>
  refreshTradeOrders: () => Promise<void>
}

const HoldingsContext = createContext<HoldingsContextType>({
  holdings: [],
  intents: [],
  tradeOrders: [],
  loading: false,
  error: null,
  addToIntents: () => {},
  removeFromIntents: () => {},
  updateIntentQuantity: () => {},
  clearIntents: () => {},
  executeIntent: async () => "",
  placeSellOrder: async () => {},
  cancelTradeOrder: async () => {},
  getTotalPortfolioValue: () => 0,
  getTotalUnrealizedGainLoss: () => 0,
  getTotalIntentsValue: () => 0,
  getHoldingsByTokenType: () => [],
  refreshHoldings: async () => {},
  refreshTradeOrders: async () => {},
})

export function HoldingsProvider({ children }: { children: ReactNode }) {
  const [holdings, setHoldings] = useState<InvestmentHolding[]>([])
  const [intents, setIntents] = useState<InvestmentIntent[]>([])
  const [tradeOrders, setTradeOrders] = useState<TradeOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { auth } = useAuthContext()
  const { purchaseTokens, isConnected } = useWeb3Context()

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      loadUserData()
    } else {
      setHoldings([])
      setIntents([])
      setTradeOrders([])
    }
  }, [auth.isAuthenticated, auth.user?.id])

  useEffect(() => {
    const savedIntents = localStorage.getItem('investment-intents')
    if (savedIntents) {
      try {
        setIntents(JSON.parse(savedIntents))
      } catch (err) {
        console.error('Error loading saved intents:', err)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('investment-intents', JSON.stringify(intents))
  }, [intents])

  const loadUserData = async () => {
    if (!auth.user) return

    setLoading(true)
    setError(null)

    try {
      await Promise.all([
        refreshHoldings(),
        refreshTradeOrders()
      ])
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio data')
    } finally {
      setLoading(false)
    }
  }

  const refreshHoldings = async () => {
    if (!auth.user) return

    try {
      // Mock implementation - would normally fetch from database
      const mockHoldings: InvestmentHolding[] = [
        {
          id: "holding-1",
          userId: auth.user.id,
          tokenOfferingId: "token-1",
          tokenName: "AUSIRI Token",
          tokenSymbol: "AUSIRI",
          tokenType: "ausiri",
          quantity: 100,
          purchasePrice: 10.50,
          currentPrice: 12.75,
          totalValue: 1275,
          unrealizedGainLoss: 225,
          purchaseDate: "2024-01-15T10:00:00Z",
          lastUpdated: new Date().toISOString(),
          status: "active"
        }
      ]
      setHoldings(mockHoldings)
    } catch (err) {
      console.error('Error refreshing holdings:', err)
      throw err
    }
  }

  const refreshTradeOrders = async () => {
    if (!auth.user) return

    try {
      // Mock implementation - would normally fetch from database
      const mockOrders: TradeOrder[] = []
      setTradeOrders(mockOrders)
    } catch (err) {
      console.error('Error refreshing trade orders:', err)
      throw err
    }
  }

  const addToIntents = (tokenOffering: TokenOffering, quantity: number) => {
    const existingIntent = intents.find(intent => intent.tokenOfferingId === tokenOffering.id)
    
    if (existingIntent) {
      updateIntentQuantity(tokenOffering.id, existingIntent.intendedQuantity + quantity)
    } else {
      const newIntent: InvestmentIntent = {
        id: `intent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tokenOfferingId: tokenOffering.id,
        tokenName: tokenOffering.name,
        tokenSymbol: tokenOffering.symbol,
        pricePerToken: tokenOffering.pricePerToken,
        intendedQuantity: quantity,
        totalAmount: tokenOffering.pricePerToken * quantity,
        minInvestment: tokenOffering.minInvestment,
        maxInvestment: tokenOffering.maxInvestment,
        addedAt: new Date().toISOString(),
      }
      setIntents(prev => [...prev, newIntent])
    }
  }

  const removeFromIntents = (tokenOfferingId: string) => {
    setIntents(prev => prev.filter(intent => intent.tokenOfferingId !== tokenOfferingId))
  }

  const updateIntentQuantity = (tokenOfferingId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromIntents(tokenOfferingId)
      return
    }

    setIntents(prev => prev.map(intent => 
      intent.tokenOfferingId === tokenOfferingId
        ? { ...intent, intendedQuantity: quantity, totalAmount: intent.pricePerToken * quantity }
        : intent
    ))
  }

  const clearIntents = () => {
    setIntents([])
  }

  const executeIntent = async (intent: InvestmentIntent): Promise<string> => {
    if (!auth.user) throw new Error('User must be authenticated')
    if (!isConnected) throw new Error('Web3 wallet must be connected')

    setLoading(true)
    setError(null)

    try {
      // Mock token offering for purchase
      const mockTokenOffering: TokenOffering = {
        id: intent.tokenOfferingId,
        companyId: "company-1",
        name: intent.tokenName,
        symbol: intent.tokenSymbol,
        description: "Mock token offering",
        tokenType: "ausiri",
        pricePerToken: intent.pricePerToken,
        minInvestment: intent.minInvestment,
        maxInvestment: intent.maxInvestment || 0,
        totalSupply: 1000000,
        availableTokens: 500000,
        raisedAmount: 0,
        targetAmount: 1000000,
        launchDate: new Date().toISOString(),
        status: "active"
      }

      const txHash = await purchaseTokens(mockTokenOffering, intent.intendedQuantity)

      removeFromIntents(intent.tokenOfferingId)

      await Promise.all([refreshHoldings(), refreshTradeOrders()])

      return txHash
    } catch (err: any) {
      setError(err.message || 'Failed to execute investment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const placeSellOrder = async (holdingId: string, quantity: number, pricePerToken: number) => {
    if (!auth.user) throw new Error('User must be authenticated')

    const holding = holdings.find(h => h.id === holdingId)
    if (!holding) throw new Error('Holding not found')

    if (quantity > holding.quantity) {
      throw new Error('Cannot sell more tokens than you own')
    }

    setLoading(true)
    try {
      // Mock implementation - would normally create trade order in database
      console.log('Mock sell order placed:', { holdingId, quantity, pricePerToken })
      await refreshTradeOrders()
    } catch (err: any) {
      setError(err.message || 'Failed to place sell order')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelTradeOrder = async (orderId: string) => {
    setLoading(true)
    try {
      // Mock implementation - would normally update order in database
      console.log('Mock order cancelled:', orderId)
      await refreshTradeOrders()
    } catch (err: any) {
      setError(err.message || 'Failed to cancel trade order')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getTotalPortfolioValue = (): number => {
    return holdings.reduce((total, holding) => total + holding.totalValue, 0)
  }

  const getTotalUnrealizedGainLoss = (): number => {
    return holdings.reduce((total, holding) => total + holding.unrealizedGainLoss, 0)
  }

  const getTotalIntentsValue = (): number => {
    return intents.reduce((total, intent) => total + intent.totalAmount, 0)
  }

  const getHoldingsByTokenType = (tokenType: string): InvestmentHolding[] => {
    return holdings.filter(holding => holding.tokenType === tokenType)
  }

  const contextValue: HoldingsContextType = {
    holdings,
    intents,
    tradeOrders,
    loading,
    error,
    addToIntents,
    removeFromIntents,
    updateIntentQuantity,
    clearIntents,
    executeIntent,
    placeSellOrder,
    cancelTradeOrder,
    getTotalPortfolioValue,
    getTotalUnrealizedGainLoss,
    getTotalIntentsValue,
    getHoldingsByTokenType,
    refreshHoldings,
    refreshTradeOrders,
  }

  return (
    <HoldingsContext.Provider value={contextValue}>
      {children}
    </HoldingsContext.Provider>
  )
}

export function useHoldingsContext() {
  return useContext(HoldingsContext)
}