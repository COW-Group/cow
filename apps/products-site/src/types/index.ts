export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface Holding {
  id: string
  userId: string
  tokenName: string
  tokenType: 'founder' | 'asset'
  amount: number
  currentValue: number
  performance: number
  createdAt: string
  updatedAt: string
}

export interface Mission {
  id: string
  title: string
  description: string
  type: 'portfolio' | 'trading' | 'research' | 'social'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  reward: number
  progress: number
  maxProgress: number
  isCompleted: boolean
  deadline?: string
  requirements: string[]
  createdAt: string
}

export interface Product {
  id: string
  name: string
  symbol: string
  description: string
  type: 'real-estate' | 'commodities' | 'stocks' | 'bonds'
  currentPrice: number
  priceChange24h: number
  priceChangePercent24h: number
  marketCap: number
  volume24h: number
  totalSupply: number
  circulatingSupply: number
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export interface DashboardStats {
  totalPortfolioValue: number
  totalInvested: number
  totalGains: number
  totalPerformance: number
  activeTokens: number
  completedMissions: number
  portfolioAllocation: {
    realEstate: number
    commodities: number
    stocks: number
    bonds: number
  }
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  isAuthenticated: boolean
}