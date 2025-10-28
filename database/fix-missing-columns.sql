-- Fix Missing Columns Migration
-- Adds missing columns to existing tables

-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investor_type VARCHAR(50) CHECK (investor_type IN ('individual', 'institutional', 'accredited'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accreditation_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'not_started' CHECK (kyc_status IN ('not_started', 'pending', 'in_review', 'approved', 'rejected'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add missing columns to assets table
ALTER TABLE assets ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_type VARCHAR(50) NOT NULL DEFAULT 'security_token';
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_name VARCHAR(255) NOT NULL DEFAULT 'Unknown Asset';
ALTER TABLE assets ADD COLUMN IF NOT EXISTS ticker_symbol VARCHAR(10);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS quantity DECIMAL(20, 8) NOT NULL DEFAULT 0;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS cost_basis DECIMAL(15, 2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS current_value DECIMAL(15, 2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS blockchain_network VARCHAR(50);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(255);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS acquired_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Fix teams table - check if it needs company_id or uses a different structure
-- First check if company_id column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='company_id') THEN
        -- If company_id doesn't exist but owner_id does, we might need to understand the existing schema better
        -- For now, add company_id if it's missing
        ALTER TABLE teams ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='user_id') THEN
        ALTER TABLE teams ADD COLUMN user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_assets_product_id ON assets(product_id);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);

-- Drop and recreate the teams policy with correct column references
DROP POLICY IF EXISTS "Team members can view team" ON teams;
CREATE POLICY "Team members can view team" ON teams
    FOR SELECT USING (
        CASE
            WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='user_id')
            THEN auth.uid() = user_id
            ELSE TRUE  -- Fallback if column structure is different
        END
    );

COMMENT ON COLUMN profiles.wallet_address IS 'Blockchain wallet address for Web3 authentication';
COMMENT ON COLUMN profiles.kyc_status IS 'KYC verification status for compliance';
COMMENT ON COLUMN assets.product_id IS 'Link to the product this asset represents';
COMMENT ON COLUMN assets.asset_type IS 'Type of asset: security_token, cryptocurrency, cash, etc.';
