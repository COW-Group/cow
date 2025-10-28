/**
 * COW Investor Platform - TypeScript Database Types
 * Auto-generated from Supabase schema
 * Generated: October 28, 2025
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// =====================================================
// USER PROFILES & AUTHENTICATION
// =====================================================

export interface Profile {
  id: string // UUID
  email: string
  full_name?: string | null
  phone?: string | null
  avatar_url?: string | null
  wallet_address?: string | null
  investor_type?: 'individual' | 'institutional' | 'accredited' | null
  accreditation_verified: boolean
  kyc_status: 'not_started' | 'pending' | 'in_review' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  metadata: Json
}

export interface ProfileInsert extends Omit<Profile, 'created_at' | 'updated_at'> {
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdate extends Partial<ProfileInsert> {}

// =====================================================
// KYC / COMPLIANCE
// =====================================================

export interface KYCApplication {
  id: string
  user_id: string
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'resubmission_required'

  // Personal Information
  first_name: string
  last_name: string
  date_of_birth: string // Date in YYYY-MM-DD format
  nationality?: string | null
  country_of_residence?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state_province?: string | null
  postal_code?: string | null

  // Identity Documents
  id_document_type?: 'passport' | 'drivers_license' | 'national_id' | 'other' | null
  id_document_number?: string | null
  id_document_front_url?: string | null
  id_document_back_url?: string | null
  selfie_url?: string | null

  // Accredited Investor
  accredited_investor_claim: boolean
  accreditation_proof_url?: string | null
  accreditation_type?: 'income' | 'net_worth' | 'entity' | 'professional' | 'none' | null

  // AML/Sanctions
  aml_check_status: 'pending' | 'passed' | 'failed' | 'manual_review'
  aml_check_provider?: string | null
  aml_check_reference_id?: string | null
  sanctions_check_passed?: boolean | null

  // Review
  reviewed_by?: string | null
  reviewed_at?: string | null
  rejection_reason?: string | null
  admin_notes?: string | null

  // Timestamps
  submitted_at: string
  approved_at?: string | null
  created_at: string
  updated_at: string
  metadata: Json
}

export interface KYCApplicationInsert extends Omit<KYCApplication, 'id' | 'created_at' | 'updated_at' | 'submitted_at'> {
  id?: string
  submitted_at?: string
  created_at?: string
  updated_at?: string
}

export interface KYCApplicationUpdate extends Partial<KYCApplicationInsert> {}

// =====================================================
// PRODUCTS & OFFERINGS
// =====================================================

export interface Product {
  id: string
  slug: string
  name: string
  description?: string | null
  product_type: 'security_token' | 'subscription' | 'fund' | 'service'

  // Product Details
  ticker_symbol?: string | null
  blockchain_network?: string | null
  contract_address?: string | null
  token_standard?: string | null

  // Pricing
  base_price?: number | null
  currency: string
  min_investment?: number | null
  max_investment?: number | null
  total_supply?: number | null
  available_supply?: number | null

  // Status
  is_active: boolean
  is_featured: boolean
  requires_accreditation: boolean
  requires_kyc: boolean
  sale_start_date?: string | null
  sale_end_date?: string | null

  // Financials
  projected_annual_return?: number | null
  dividend_frequency?: string | null
  risk_rating?: 'low' | 'medium' | 'high' | null

  // Media
  image_url?: string | null
  whitepaper_url?: string | null
  prospectus_url?: string | null

  created_at: string
  updated_at: string
  metadata: Json
}

export interface ProductInsert extends Omit<Product, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface ProductUpdate extends Partial<ProductInsert> {}

export interface ProductTier {
  id: string
  product_id: string
  name: string
  slug: string
  description?: string | null
  price: number
  billing_period: 'monthly' | 'quarterly' | 'annual' | 'one_time'
  features: Json
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface ProductTierInsert extends Omit<ProductTier, 'id' | 'created_at'> {
  id?: string
  created_at?: string
}

export interface ProductTierUpdate extends Partial<ProductTierInsert> {}

// =====================================================
// CART & CHECKOUT
// =====================================================

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  tier_id?: string | null
  quantity: number
  price_at_addition: number
  created_at: string
  updated_at: string
}

export interface CartItemInsert extends Omit<CartItem, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface CartItemUpdate extends Partial<CartItemInsert> {}

// =====================================================
// ORDERS & TRANSACTIONS
// =====================================================

export interface Order {
  id: string
  order_number: string
  user_id: string

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded'
  fulfillment_status: 'pending' | 'processing' | 'fulfilled' | 'failed'

  // Pricing
  subtotal: number
  tax: number
  fees: number
  total: number
  currency: string

  // Payment
  payment_method?: string | null
  payment_provider?: string | null
  payment_intent_id?: string | null

  // Timestamps
  created_at: string
  updated_at: string
  paid_at?: string | null
  completed_at?: string | null

  metadata: Json
}

export interface OrderInsert extends Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> {
  id?: string
  order_number?: string
  created_at?: string
  updated_at?: string
}

export interface OrderUpdate extends Partial<OrderInsert> {}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  tier_id?: string | null

  product_name: string
  tier_name?: string | null
  quantity: number
  unit_price: number
  subtotal: number

  // Token fulfillment
  token_transaction_hash?: string | null
  tokens_issued: boolean
  tokens_issued_at?: string | null

  created_at: string
  metadata: Json
}

export interface OrderItemInsert extends Omit<OrderItem, 'id' | 'created_at'> {
  id?: string
  created_at?: string
}

export interface OrderItemUpdate extends Partial<OrderItemInsert> {}

// =====================================================
// SUBSCRIPTIONS
// =====================================================

export interface Subscription {
  id: string
  user_id: string
  product_id: string
  tier_id?: string | null

  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due'
  billing_period: string
  price: number
  currency: string

  stripe_subscription_id?: string | null
  current_period_start: string
  current_period_end: string
  next_billing_date?: string | null

  trial_ends_at?: string | null
  started_at: string
  cancelled_at?: string | null
  cancel_at_period_end: boolean

  created_at: string
  updated_at: string
  metadata: Json
}

export interface SubscriptionInsert extends Omit<Subscription, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface SubscriptionUpdate extends Partial<SubscriptionInsert> {}

// =====================================================
// PAYMENT TRANSACTIONS
// =====================================================

export interface PaymentTransaction {
  id: string
  user_id: string
  order_id?: string | null
  subscription_id?: string | null

  transaction_type: 'payment' | 'refund' | 'chargeback' | 'payout'
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled'
  amount: number
  currency: string

  provider: string
  provider_transaction_id?: string | null
  payment_method?: string | null

  error_code?: string | null
  error_message?: string | null
  processed_at?: string | null
  created_at: string
  metadata: Json
}

export interface PaymentTransactionInsert extends Omit<PaymentTransaction, 'id' | 'created_at'> {
  id?: string
  created_at?: string
}

export interface PaymentTransactionUpdate extends Partial<PaymentTransactionInsert> {}

// =====================================================
// ASSETS & HOLDINGS
// =====================================================

export interface Asset {
  id: string
  user_id: string
  product_id?: string | null

  asset_type: string
  asset_name: string
  ticker_symbol?: string | null

  quantity: number
  cost_basis?: number | null
  current_value?: number | null

  blockchain_network?: string | null
  wallet_address?: string | null

  acquired_at?: string | null
  created_at: string
  updated_at: string
  metadata: Json
}

export interface AssetInsert extends Omit<Asset, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface AssetUpdate extends Partial<AssetInsert> {}

// =====================================================
// MISSIONS & GOALS
// =====================================================

export interface Goal {
  id: string
  user_id: string

  title: string
  description?: string | null
  goal_type: 'savings' | 'investment' | 'retirement' | 'education' | 'custom'

  target_amount: number
  current_amount: number
  currency: string

  target_date?: string | null
  status: 'active' | 'completed' | 'abandoned' | 'paused'

  linked_asset_ids?: string[] | null

  created_at: string
  updated_at: string
  completed_at?: string | null
  metadata: Json
}

export interface GoalInsert extends Omit<Goal, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface GoalUpdate extends Partial<GoalInsert> {}

export interface Campaign {
  id: string
  name: string
  description?: string | null
  campaign_type?: string | null

  target_amount?: number | null
  raised_amount: number
  participant_count: number

  start_date?: string | null
  end_date?: string | null
  status: 'draft' | 'active' | 'completed' | 'cancelled'

  created_at: string
  updated_at: string
  metadata: Json
}

export interface CampaignInsert extends Omit<Campaign, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface CampaignUpdate extends Partial<CampaignInsert> {}

export interface CampaignParticipant {
  id: string
  campaign_id: string
  user_id: string
  contribution_amount: number
  joined_at: string
}

export interface CampaignParticipantInsert extends Omit<CampaignParticipant, 'id' | 'joined_at'> {
  id?: string
  joined_at?: string
}

export interface CampaignParticipantUpdate extends Partial<CampaignParticipantInsert> {}

// =====================================================
// SUPPORT CENTER
// =====================================================

export interface SupportTicket {
  id: string
  ticket_number: string
  user_id?: string | null

  subject: string
  description: string
  category?: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed'

  assigned_to?: string | null

  created_at: string
  updated_at: string
  resolved_at?: string | null
  closed_at?: string | null

  metadata: Json
}

export interface SupportTicketInsert extends Omit<SupportTicket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'> {
  id?: string
  ticket_number?: string
  created_at?: string
  updated_at?: string
}

export interface SupportTicketUpdate extends Partial<SupportTicketInsert> {}

export interface SupportMessage {
  id: string
  ticket_id: string
  sender_id: string

  message: string
  is_internal_note: boolean
  attachments: Json

  created_at: string
}

export interface SupportMessageInsert extends Omit<SupportMessage, 'id' | 'created_at'> {
  id?: string
  created_at?: string
}

export interface SupportMessageUpdate extends Partial<SupportMessageInsert> {}

// =====================================================
// COMPANIES & TEAMS
// =====================================================

export interface Company {
  id: string
  name: string
  legal_name?: string | null
  tax_id?: string | null
  company_type?: string | null

  address_line1?: string | null
  city?: string | null
  country?: string | null

  created_at: string
  updated_at: string
  metadata: Json
}

export interface CompanyInsert extends Omit<Company, 'id' | 'created_at' | 'updated_at'> {
  id?: string
  created_at?: string
  updated_at?: string
}

export interface CompanyUpdate extends Partial<CompanyInsert> {}

export interface Team {
  id: string
  company_id: string
  user_id: string

  role?: string | null
  permissions: Json

  invited_at: string
  joined_at?: string | null
}

export interface TeamInsert extends Omit<Team, 'id' | 'invited_at'> {
  id?: string
  invited_at?: string
}

export interface TeamUpdate extends Partial<TeamInsert> {}

// =====================================================
// AUDIT LOG
// =====================================================

export interface AuditLog {
  id: string
  user_id?: string | null

  action: string
  entity_type?: string | null
  entity_id?: string | null

  ip_address?: string | null
  user_agent?: string | null

  changes?: Json | null
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical'

  created_at: string
  metadata: Json
}

export interface AuditLogInsert extends Omit<AuditLog, 'id' | 'created_at'> {
  id?: string
  created_at?: string
}

export interface AuditLogUpdate extends Partial<AuditLogInsert> {}

// =====================================================
// DATABASE TYPE
// =====================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      kyc_applications: {
        Row: KYCApplication
        Insert: KYCApplicationInsert
        Update: KYCApplicationUpdate
      }
      products: {
        Row: Product
        Insert: ProductInsert
        Update: ProductUpdate
      }
      product_tiers: {
        Row: ProductTier
        Insert: ProductTierInsert
        Update: ProductTierUpdate
      }
      cart_items: {
        Row: CartItem
        Insert: CartItemInsert
        Update: CartItemUpdate
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: OrderUpdate
      }
      order_items: {
        Row: OrderItem
        Insert: OrderItemInsert
        Update: OrderItemUpdate
      }
      subscriptions: {
        Row: Subscription
        Insert: SubscriptionInsert
        Update: SubscriptionUpdate
      }
      payment_transactions: {
        Row: PaymentTransaction
        Insert: PaymentTransactionInsert
        Update: PaymentTransactionUpdate
      }
      assets: {
        Row: Asset
        Insert: AssetInsert
        Update: AssetUpdate
      }
      goals: {
        Row: Goal
        Insert: GoalInsert
        Update: GoalUpdate
      }
      campaigns: {
        Row: Campaign
        Insert: CampaignInsert
        Update: CampaignUpdate
      }
      campaign_participants: {
        Row: CampaignParticipant
        Insert: CampaignParticipantInsert
        Update: CampaignParticipantUpdate
      }
      support_tickets: {
        Row: SupportTicket
        Insert: SupportTicketInsert
        Update: SupportTicketUpdate
      }
      support_messages: {
        Row: SupportMessage
        Insert: SupportMessageInsert
        Update: SupportMessageUpdate
      }
      companies: {
        Row: Company
        Insert: CompanyInsert
        Update: CompanyUpdate
      }
      teams: {
        Row: Team
        Insert: TeamInsert
        Update: TeamUpdate
      }
      audit_log: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: AuditLogUpdate
      }
    }
  }
}
