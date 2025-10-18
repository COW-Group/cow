-- Create encrypted_user_data table for zero-knowledge encryption
-- This table stores all sensitive user data as encrypted JSON blobs
-- Even database administrators cannot read the encrypted data without user's password

CREATE TABLE IF NOT EXISTS encrypted_user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Encrypted JSON blob containing all sensitive data
  encrypted_data TEXT NOT NULL,

  -- Salt for password-based key derivation (not secret, safe to store unencrypted)
  salt TEXT NOT NULL,

  -- Schema version for handling data migrations
  data_version INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_encrypted_user_data_user_id
  ON encrypted_user_data(user_id);

-- Enable Row Level Security
ALTER TABLE encrypted_user_data ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own encrypted data
CREATE POLICY "Users can view their own encrypted data"
  ON encrypted_user_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own encrypted data
CREATE POLICY "Users can insert their own encrypted data"
  ON encrypted_user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own encrypted data
CREATE POLICY "Users can update their own encrypted data"
  ON encrypted_user_data
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own encrypted data
CREATE POLICY "Users can delete their own encrypted data"
  ON encrypted_user_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_encrypted_data_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp on data changes
CREATE TRIGGER update_encrypted_user_data_timestamp
  BEFORE UPDATE ON encrypted_user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_encrypted_data_timestamp();

-- Add comments for documentation
COMMENT ON TABLE encrypted_user_data IS
  'Zero-knowledge encrypted storage for sensitive user data. Data is encrypted client-side before storage.';

COMMENT ON COLUMN encrypted_user_data.encrypted_data IS
  'AES-256 encrypted JSON blob. Can only be decrypted with user password.';

COMMENT ON COLUMN encrypted_user_data.salt IS
  'Salt for PBKDF2 key derivation. Not secret - safe to store unencrypted.';

COMMENT ON COLUMN encrypted_user_data.data_version IS
  'Schema version number. Used for handling data structure migrations.';
