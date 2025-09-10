// Authentication Types
export interface UserProfile {
  id: string
  name: string | null
  email: string
  avatar_url?: string
  created_at: string
  role?: 'investor' | 'staff' | 'admin'
  accreditation_status?: 'pending' | 'verified' | 'rejected'
  kyc_status?: 'pending' | 'approved' | 'rejected'
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata: {
    full_name?: string
    role?: string
  }
}

export interface Auth {
  user: AuthUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
}

// Investment & Token Types
export interface TokenOffering {
  id: string
  companyId: string
  name: string
  symbol: string
  description: string
  tokenType: 'ausiri' | 'auaero' | 'company_token'
  pricePerToken: number
  minInvestment: number
  maxInvestment?: number
  totalSupply: number
  availableTokens: number
  raisedAmount: number
  targetAmount: number
  launchDate: string
  endDate?: string
  status: 'upcoming' | 'active' | 'closed' | 'sold_out'
  apyRange?: string
  backingAssets?: string[]
  complianceDocuments?: string[]
  prospectusUrl?: string
}

export interface InvestmentHolding {
  id: string
  userId: string
  tokenOfferingId: string
  tokenName: string
  tokenSymbol: string
  tokenType: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  totalValue: number
  unrealizedGainLoss: number
  realizedGainLoss?: number
  purchaseDate: string
  lastUpdated: string
  status: 'active' | 'pending' | 'sold'
}

export interface InvestmentIntent {
  id: string
  tokenOfferingId: string
  tokenName: string
  tokenSymbol: string
  pricePerToken: number
  intendedQuantity: number
  totalAmount: number
  minInvestment: number
  maxInvestment?: number
  addedAt: string
}

// Company Types
export interface Company {
  id: string
  name: string
  description: string
  industry: string
  website?: string
  logo?: string
  foundedYear?: number
  headquarters?: string
  employees?: string
  revenue?: string
  valuation?: number
  tokenOfferings: TokenOffering[]
  documents?: CompanyDocument[]
  kycRequired: boolean
  accreditationRequired: boolean
  created_at: string
  updated_at: string
}

export interface CompanyDocument {
  id: string
  companyId: string
  title: string
  type: 'prospectus' | 'financial_statement' | 'legal_document' | 'compliance_report'
  url: string
  uploadDate: string
  requiresAuth: boolean
}

// Compliance Types
export interface KYCData {
  id: string
  userId: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  submittedAt: string
  reviewedAt?: string
  expiresAt?: string
  documents: KYCDocument[]
  notes?: string
}

export interface KYCDocument {
  id: string
  type: 'id_front' | 'id_back' | 'address_proof' | 'selfie'
  filename: string
  uploadedAt: string
  verified: boolean
}

export interface AccreditationData {
  id: string
  userId: string
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  type: 'income' | 'net_worth' | 'professional'
  submittedAt: string
  verifiedAt?: string
  expiresAt?: string
  documents: string[]
}

// Trading Types
export interface TradeOrder {
  id: string
  userId: string
  tokenOfferingId: string
  orderType: 'buy' | 'sell'
  quantity: number
  pricePerToken: number
  totalAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled'
  submittedAt: string
  executedAt?: string
  adminNotes?: string
}

// Goals & Analytics (from your existing system)
export interface Goal {
  id: string
  userId: string
  name: string
  description?: string
  targetDate?: string
  status: "not_started" | "in_progress" | "completed" | "on_hold" | "cancelled" | "on_track" | "at_risk" | "off_track" | "achieved" | "partial" | "missed" | "dropped"
  priority?: string
  companyId?: string
  teamId?: string
  type: "company" | "team" | "personal" | "investment"
  owners?: string[]
  progress?: number
  measurementType?: "percentage" | "number" | "currency" | "manual"
  targetValue?: number
  currentValue?: number
  privacy?: "public" | "private"
  subGoals?: Goal[]
  connectedWork?: string[]
  likes?: number
  hasLightningBolt?: boolean
  productType?: string
  createdAt: string
  updatedAt?: string
}

export interface Team {
  id: string
  companyId: string
  name: string
  description: string | null
  createdAt: string
}

// Cart/Shopping Cart Types (for token purchasing workflow)
export interface CartItem {
  id: string
  tokenOfferingId: string
  tokenName: string
  tokenSymbol: string
  pricePerToken: number
  quantity: number
  totalAmount: number
  minInvestment: number
  maxInvestment?: number
  addedAt: string
  validationErrors?: string[]
}

export interface Cart {
  items: CartItem[]
  totalValue: number
  totalItems: number
  updatedAt: string
}

// Web3 Provider Types
export interface Web3Provider {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  isMetaMask?: boolean
  isConnected?: () => boolean
  chainId?: string
  selectedAddress?: string | null
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
}

export interface ChainConfig {
  chainId: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

// Smart Contract Types
export interface ContractConfig {
  address: string
  abi: any[]
  chainId: number
}

export interface TokenContractData {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  balanceOf: string
  allowance?: string
}

// Database Schema Types (for Supabase tables)
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at'>
        Update: Partial<Omit<UserProfile, 'id'>>
      }
      companies: {
        Row: Company
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Company, 'id'>>
      }
      token_offerings: {
        Row: TokenOffering
        Insert: Omit<TokenOffering, 'id'>
        Update: Partial<Omit<TokenOffering, 'id'>>
      }
      investment_holdings: {
        Row: InvestmentHolding
        Insert: Omit<InvestmentHolding, 'id' | 'lastUpdated'>
        Update: Partial<Omit<InvestmentHolding, 'id'>>
      }
      trade_orders: {
        Row: TradeOrder
        Insert: Omit<TradeOrder, 'id' | 'submittedAt'>
        Update: Partial<Omit<TradeOrder, 'id'>>
      }
      kyc_data: {
        Row: KYCData
        Insert: Omit<KYCData, 'id'>
        Update: Partial<Omit<KYCData, 'id'>>
      }
      accreditation_data: {
        Row: AccreditationData
        Insert: Omit<AccreditationData, 'id'>
        Update: Partial<Omit<AccreditationData, 'id'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'createdAt'>
        Update: Partial<Omit<Goal, 'id'>>
      }
      teams: {
        Row: Team
        Insert: Omit<Team, 'id' | 'createdAt'>
        Update: Partial<Omit<Team, 'id'>>
      }
    }
  }
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
  actionText?: string
}

// File Upload Types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  url?: string
  error?: string
}

// Utility Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isSubmitting: boolean
  isValid: boolean
}