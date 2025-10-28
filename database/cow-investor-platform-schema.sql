-- COW Investor Platform - Complete Database Schema
-- For MVP: Investor Dashboard, KYC, Products, Orders, Support, Missions App
-- Generated: October 28, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USER PROFILES & AUTHENTICATION
-- =====================================================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  wallet_address VARCHAR(255),
  investor_type VARCHAR(50) CHECK (investor_type IN ('individual', 'institutional', 'accredited')),
  accreditation_verified BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(50) DEFAULT 'not_started' CHECK (kyc_status IN ('not_started', 'pending', 'in_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- KYC / COMPLIANCE SYSTEM
-- =====================================================

-- KYC applications and verification
CREATE TABLE kyc_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'resubmission_required')),

  -- Personal Information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  nationality VARCHAR(100),
  country_of_residence VARCHAR(100),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state_province VARCHAR(100),
  postal_code VARCHAR(20),

  -- Identity Documents
  id_document_type VARCHAR(50) CHECK (id_document_type IN ('passport', 'drivers_license', 'national_id', 'other')),
  id_document_number VARCHAR(100),
  id_document_front_url TEXT,
  id_document_back_url TEXT,
  selfie_url TEXT,

  -- Accredited Investor Verification (US only)
  accredited_investor_claim BOOLEAN DEFAULT FALSE,
  accreditation_proof_url TEXT,
  accreditation_type VARCHAR(100) CHECK (accreditation_type IN ('income', 'net_worth', 'entity', 'professional', 'none')),

  -- AML/Sanctions Screening
  aml_check_status VARCHAR(50) DEFAULT 'pending' CHECK (aml_check_status IN ('pending', 'passed', 'failed', 'manual_review')),
  aml_check_provider VARCHAR(100), -- e.g., 'jumio', 'onfido', 'manual'
  aml_check_reference_id VARCHAR(255),
  sanctions_check_passed BOOLEAN,

  -- Review & Approval
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  admin_notes TEXT,

  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- PRODUCTS & OFFERINGS
-- =====================================================

-- Investment products (GOLD SWIM, SIRI Z31, etc.)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_type VARCHAR(50) CHECK (product_type IN ('security_token', 'subscription', 'fund', 'service')),

  -- Product Details
  ticker_symbol VARCHAR(10), -- e.g., 'GOLD', 'SIRI'
  blockchain_network VARCHAR(50), -- e.g., 'ethereum', 'polygon'
  contract_address VARCHAR(255), -- Smart contract address
  token_standard VARCHAR(50), -- e.g., 'ERC-1400', 'ERC-3643'

  -- Pricing & Availability
  base_price DECIMAL(15, 2), -- Price per token/unit
  currency VARCHAR(10) DEFAULT 'USD',
  min_investment DECIMAL(15, 2),
  max_investment DECIMAL(15, 2),
  total_supply BIGINT,
  available_supply BIGINT,

  -- Status & Visibility
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  requires_accreditation BOOLEAN DEFAULT FALSE,
  requires_kyc BOOLEAN DEFAULT TRUE,
  sale_start_date TIMESTAMP WITH TIME ZONE,
  sale_end_date TIMESTAMP WITH TIME ZONE,

  -- Financial Projections (GOLD SWIM specific)
  projected_annual_return DECIMAL(5, 2), -- e.g., 8.5 for 8.5%
  dividend_frequency VARCHAR(50), -- 'quarterly', 'annual', 'none'
  risk_rating VARCHAR(20) CHECK (risk_rating IN ('low', 'medium', 'high')),

  -- Media & Documentation
  image_url TEXT,
  whitepaper_url TEXT,
  prospectus_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}' -- Store product-specific config
);

-- Product pricing tiers (for subscription products like SIRI Z31 plans)
CREATE TABLE product_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., 'Basic', 'Pro', 'Enterprise'
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL,
  billing_period VARCHAR(50) CHECK (billing_period IN ('monthly', 'quarterly', 'annual', 'one_time')),
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, slug)
);

-- =====================================================
-- CART & CHECKOUT
-- =====================================================

-- Shopping cart items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES product_tiers(id) ON DELETE CASCADE,
  quantity DECIMAL(15, 8) NOT NULL DEFAULT 1, -- Support fractional quantities for tokens
  price_at_addition DECIMAL(15, 2) NOT NULL, -- Lock price when added
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, tier_id)
);

-- =====================================================
-- ORDERS & TRANSACTIONS
-- =====================================================

-- Orders (completed purchases)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE, -- Human-readable order number
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,

  -- Order Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
  fulfillment_status VARCHAR(50) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'processing', 'fulfilled', 'failed')),

  -- Pricing
  subtotal DECIMAL(15, 2) NOT NULL,
  tax DECIMAL(15, 2) DEFAULT 0,
  fees DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',

  -- Payment Information
  payment_method VARCHAR(50), -- 'card', 'ach', 'wire', 'crypto'
  payment_provider VARCHAR(50), -- 'stripe', 'coinbase', etc.
  payment_intent_id VARCHAR(255), -- Stripe payment intent ID

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  metadata JSONB DEFAULT '{}'
);

-- Order line items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  tier_id UUID REFERENCES product_tiers(id) ON DELETE RESTRICT,

  product_name VARCHAR(255) NOT NULL, -- Snapshot at time of purchase
  tier_name VARCHAR(255),
  quantity DECIMAL(15, 8) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  subtotal DECIMAL(15, 2) NOT NULL,

  -- Token fulfillment (for security tokens)
  token_transaction_hash VARCHAR(255), -- Blockchain transaction hash
  tokens_issued BOOLEAN DEFAULT FALSE,
  tokens_issued_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

-- Recurring subscriptions (SIRI Z31 trading plans, etc.)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  tier_id UUID REFERENCES product_tiers(id) ON DELETE RESTRICT,

  -- Subscription Details
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'expired', 'past_due')),
  billing_period VARCHAR(50) NOT NULL,
  price DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',

  -- Billing
  stripe_subscription_id VARCHAR(255) UNIQUE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  next_billing_date TIMESTAMP WITH TIME ZONE,

  -- Lifecycle
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- PAYMENT TRANSACTIONS
-- =====================================================

-- Payment transaction log
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Transaction Details
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('payment', 'refund', 'chargeback', 'payout')),
  status VARCHAR(50) CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',

  -- Provider Information
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'coinbase', etc.
  provider_transaction_id VARCHAR(255),
  payment_method VARCHAR(50),

  -- Metadata
  error_code VARCHAR(100),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- ASSETS & HOLDINGS (Investor Dashboard)
-- =====================================================

-- User's asset holdings
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  asset_type VARCHAR(50) NOT NULL, -- 'security_token', 'cryptocurrency', 'cash', 'other'
  asset_name VARCHAR(255) NOT NULL,
  ticker_symbol VARCHAR(10),

  quantity DECIMAL(20, 8) NOT NULL DEFAULT 0,
  cost_basis DECIMAL(15, 2), -- What they paid
  current_value DECIMAL(15, 2), -- Current market value

  blockchain_network VARCHAR(50),
  wallet_address VARCHAR(255),

  acquired_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- MISSIONS & GOALS (Missions App)
-- =====================================================

-- Financial goals/missions
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type VARCHAR(50) CHECK (goal_type IN ('savings', 'investment', 'retirement', 'education', 'custom')),

  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'USD',

  target_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'paused')),

  linked_asset_ids UUID[], -- Assets contributing to this goal

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Mission campaigns (collective goals)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(50),

  target_amount DECIMAL(15, 2),
  raised_amount DECIMAL(15, 2) DEFAULT 0,
  participant_count INTEGER DEFAULT 0,

  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- User participation in campaigns
CREATE TABLE campaign_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  contribution_amount DECIMAL(15, 2) DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(campaign_id, user_id)
);

-- =====================================================
-- SUPPORT CENTER
-- =====================================================

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100), -- 'kyc', 'payment', 'technical', 'general'
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),

  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,

  metadata JSONB DEFAULT '{}'
);

-- Support ticket messages
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  message TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT FALSE, -- For admin-only notes
  attachments JSONB DEFAULT '[]',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMPANIES & TEAMS (For institutional investors)
-- =====================================================

-- Companies/Organizations
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  tax_id VARCHAR(100),
  company_type VARCHAR(100),

  address_line1 VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Team members (for company accounts)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  role VARCHAR(100), -- 'owner', 'admin', 'member', 'viewer'
  permissions JSONB DEFAULT '[]',

  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(company_id, user_id)
);

-- =====================================================
-- AUDIT LOG
-- =====================================================

-- System audit log for compliance
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  action VARCHAR(100) NOT NULL, -- 'kyc_submitted', 'order_created', 'payment_processed', etc.
  entity_type VARCHAR(100), -- 'order', 'kyc_application', 'user', etc.
  entity_id UUID,

  ip_address INET,
  user_agent TEXT,

  changes JSONB, -- Before/after for updates
  severity VARCHAR(50) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX idx_profiles_kyc_status ON profiles(kyc_status);

-- KYC Applications
CREATE INDEX idx_kyc_user_id ON kyc_applications(user_id);
CREATE INDEX idx_kyc_status ON kyc_applications(status);
CREATE INDEX idx_kyc_aml_status ON kyc_applications(aml_check_status);
CREATE INDEX idx_kyc_submitted_at ON kyc_applications(submitted_at DESC);

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Cart
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_product_id ON cart_items(product_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- Payment Transactions
CREATE INDEX idx_payment_txns_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_txns_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_txns_created_at ON payment_transactions(created_at DESC);
CREATE INDEX idx_payment_txns_provider_id ON payment_transactions(provider_transaction_id);

-- Assets
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_product_id ON assets(product_id);
CREATE INDEX idx_assets_type ON assets(asset_type);

-- Goals
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);

-- Campaigns
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_participants_campaign_id ON campaign_participants(campaign_id);
CREATE INDEX idx_campaign_participants_user_id ON campaign_participants(user_id);

-- Support
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_messages_ticket_id ON support_messages(ticket_id);

-- Audit Log
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_updated_at BEFORE UPDATE ON kyc_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'COW-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Function to generate ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number = 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('ticket_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE SEQUENCE IF NOT EXISTS ticket_number_seq;

CREATE TRIGGER set_ticket_number BEFORE INSERT ON support_tickets
    FOR EACH ROW WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION generate_ticket_number();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- KYC: Users can view and create their own applications
CREATE POLICY "Users can view own KYC" ON kyc_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own KYC" ON kyc_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KYC" ON kyc_applications
    FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'resubmission_required'));

-- Products: Public read, admin write
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view product tiers" ON product_tiers
    FOR SELECT USING (is_active = TRUE);

-- Cart: Users can manage their own cart
CREATE POLICY "Users can view own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- Orders: Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

-- Subscriptions: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Payment Transactions: Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON payment_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Assets: Users can view their own assets
CREATE POLICY "Users can view own assets" ON assets
    FOR SELECT USING (auth.uid() = user_id);

-- Goals: Users can manage their own goals
CREATE POLICY "Users can manage own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

-- Campaigns: Public read for active campaigns
CREATE POLICY "Anyone can view active campaigns" ON campaigns
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view campaign participation" ON campaign_participants
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can join campaigns" ON campaign_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support: Users can view and create their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ticket messages" ON support_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
    );

CREATE POLICY "Users can send messages on own tickets" ON support_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = ticket_id AND support_tickets.user_id = auth.uid())
    );

-- Companies & Teams: Members can view their company data
CREATE POLICY "Team members can view company" ON companies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM teams WHERE teams.company_id = companies.id AND teams.user_id = auth.uid())
    );

CREATE POLICY "Team members can view team" ON teams
    FOR SELECT USING (auth.uid() = user_id);

-- Audit Log: Read-only for compliance (admin access only in future)
CREATE POLICY "Users can view own audit logs" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- SEED DATA - GOLD SWIM & SIRI Z31 PRODUCTS
-- =====================================================

-- Insert GOLD SWIM product
INSERT INTO products (
    slug, name, description, product_type, ticker_symbol,
    blockchain_network, token_standard, base_price, currency,
    min_investment, max_investment, total_supply, available_supply,
    is_active, is_featured, requires_accreditation, requires_kyc,
    projected_annual_return, dividend_frequency, risk_rating,
    metadata
) VALUES (
    'gold-swim',
    'GOLD SWIM - Securities Wealth Investment & Management',
    'A diversified securities investment vehicle providing quarterly returns through managed gold-backed asset allocation.',
    'security_token',
    'GOLD',
    'ethereum',
    'ERC-1400',
    1000.00,
    'USD',
    5000.00,
    1000000.00,
    1000000,
    1000000,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    8.5,
    'quarterly',
    'medium',
    '{
        "scenario_projections": {
            "conservative": {"annual_return": 6.5, "quarterly_dividend": 1.625},
            "moderate": {"annual_return": 8.5, "quarterly_dividend": 2.125},
            "optimistic": {"annual_return": 12.0, "quarterly_dividend": 3.0}
        },
        "asset_allocation": {
            "gold_etfs": 40,
            "dividend_stocks": 30,
            "bonds": 20,
            "cash_equivalents": 10
        }
    }'
) ON CONFLICT (slug) DO NOTHING;

-- Insert SIRI Z31 product
INSERT INTO products (
    slug, name, description, product_type, ticker_symbol,
    base_price, currency, min_investment,
    is_active, is_featured, requires_accreditation, requires_kyc,
    risk_rating,
    metadata
) VALUES (
    'siri-z31',
    'SIRI Z31 - AI-Powered Trading Platform',
    'Advanced algorithmic trading system with real-time market analysis and automated execution.',
    'subscription',
    'SIRI',
    0.00,
    'USD',
    0.00,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    'high',
    '{
        "features": ["Real-time signals", "Portfolio analytics", "Risk management", "Automated trading"],
        "supported_markets": ["crypto", "forex", "stocks", "commodities"]
    }'
) ON CONFLICT (slug) DO NOTHING;

-- Insert SIRI Z31 pricing tiers
INSERT INTO product_tiers (product_id, name, slug, description, price, billing_period, features, is_active, sort_order)
SELECT
    p.id,
    'Basic',
    'basic',
    'Essential trading signals and analytics',
    29.99,
    'monthly',
    '["Basic signals", "Email alerts", "Limited backtesting"]'::jsonb,
    TRUE,
    1
FROM products p WHERE p.slug = 'siri-z31'
ON CONFLICT (product_id, slug) DO NOTHING;

INSERT INTO product_tiers (product_id, name, slug, description, price, billing_period, features, is_active, sort_order)
SELECT
    p.id,
    'Pro',
    'pro',
    'Advanced trading with automated execution',
    99.99,
    'monthly',
    '["Advanced signals", "Automated trading", "Full backtesting", "Priority support"]'::jsonb,
    TRUE,
    2
FROM products p WHERE p.slug = 'siri-z31'
ON CONFLICT (product_id, slug) DO NOTHING;

INSERT INTO product_tiers (product_id, name, slug, description, price, billing_period, features, is_active, sort_order)
SELECT
    p.id,
    'Enterprise',
    'enterprise',
    'Full platform access with custom strategies',
    299.99,
    'monthly',
    '["All Pro features", "Custom strategies", "API access", "Dedicated account manager", "White-label option"]'::jsonb,
    TRUE,
    3
FROM products p WHERE p.slug = 'siri-z31'
ON CONFLICT (product_id, slug) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON kyc_applications TO authenticated;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON product_tiers TO authenticated;
GRANT ALL ON cart_items TO authenticated;
GRANT SELECT, INSERT ON orders TO authenticated;
GRANT SELECT ON order_items TO authenticated;
GRANT SELECT ON subscriptions TO authenticated;
GRANT SELECT ON payment_transactions TO authenticated;
GRANT ALL ON assets TO authenticated;
GRANT ALL ON goals TO authenticated;
GRANT SELECT ON campaigns TO authenticated;
GRANT ALL ON campaign_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON support_tickets TO authenticated;
GRANT SELECT, INSERT ON support_messages TO authenticated;
GRANT SELECT ON companies TO authenticated;
GRANT SELECT ON teams TO authenticated;
GRANT SELECT ON audit_log TO authenticated;

-- Grant sequence usage
GRANT USAGE ON SEQUENCE order_number_seq TO authenticated;
GRANT USAGE ON SEQUENCE ticket_number_seq TO authenticated;

-- =====================================================
-- COMPLETION
-- =====================================================

-- This schema is ready for production deployment
-- Next steps:
-- 1. Review RLS policies for admin roles
-- 2. Set up Stripe webhook handlers
-- 3. Implement KYC service integration
-- 4. Deploy smart contracts and update contract_address fields
-- 5. Set up monitoring and alerting
