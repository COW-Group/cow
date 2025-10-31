-- Migration: Create MyGOLD Product with Allocation Structure
-- Purpose: Consolidate GOLD SWIM and SIRI Z31 into single MyGOLD offering
-- Date: 2025-01-30

-- Step 1: Create product_allocations table
CREATE TABLE IF NOT EXISTS product_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  component_name VARCHAR(255) NOT NULL,
  allocation_percent DECIMAL(10, 8) NOT NULL CHECK (allocation_percent > 0 AND allocation_percent <= 100),
  description TEXT,
  calculator_path VARCHAR(255), -- Path to component calculator page
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add indexes
CREATE INDEX IF NOT EXISTS idx_product_allocations_product_id ON product_allocations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_allocations_is_active ON product_allocations(is_active);

-- Step 3: Create MyGOLD product
INSERT INTO products (
  slug,
  name,
  product_type,
  is_active,
  description,
  ticker_symbol,
  base_price,
  min_investment,
  max_investment,
  projected_annual_return
) VALUES (
  'mygold',
  'MyGOLD',
  'security_token',
  true,
  'Diversified gold-backed asset allocation combining physical gold retailing (25%), systematic futures positioning (8.33%), cash reserves (18.33%), and alternative real-world assets (48.33%) including whiskey, water, dairy, food, and metro infrastructure.',
  'MYGLD',
  0.00, -- Dynamic pricing based on live gold spot
  1000.00,
  NULL, -- No max investment
  21.5
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  description = EXCLUDED.description,
  ticker_symbol = EXCLUDED.ticker_symbol,
  updated_at = NOW();

-- Step 4: Insert MyGOLD allocation breakdown
INSERT INTO product_allocations (
  product_id,
  component_name,
  allocation_percent,
  description,
  calculator_path,
  is_active,
  display_order
) VALUES
  (
    (SELECT id FROM products WHERE slug = 'mygold'),
    'Physical Gold Retailing (GOLD SWIM)',
    25.000000,
    'Quarterly physical gold retailing strategy with €1.00/gram margin targeting. Systematic trading cycles generate returns through controlled markup pricing and gold accumulation.',
    '/invest/gold-swim',
    true,
    1
  ),
  (
    (SELECT id FROM products WHERE slug = 'mygold'),
    'Gold Futures Hedging (SIRI Z31)',
    8.333333,
    'Systematic Investment Return Initiative using gold futures contracts for leveraged exposure. Professional-grade margin management with 8% initial margin and position limits.',
    '/invest/siriz31',
    true,
    2
  ),
  (
    (SELECT id FROM products WHERE slug = 'mygold'),
    'Cash Reserves',
    18.333333,
    'Liquid capital reserves for operational flexibility, margin calls, and strategic opportunities. Maintained in USD and EUR across multiple banking relationships.',
    NULL,
    true,
    3
  ),
  (
    (SELECT id FROM products WHERE slug = 'mygold'),
    'Alternative Real-World Assets',
    48.333334,
    'Diversified portfolio of tangible assets including premium whiskey casks, water rights, dairy production facilities, food supply chain infrastructure, metropolitan transportation assets, and other income-generating real estate.',
    NULL,
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Step 5: Deactivate standalone GOLD SWIM and SIRI Z31 products (keep for historical reference)
UPDATE products
SET
  is_active = false,
  updated_at = NOW()
WHERE slug IN ('gold-swim', 'siri-z31');

-- Step 6: Add comment explaining deactivation
COMMENT ON COLUMN products.is_active IS
'Product visibility flag. Deactivated products (gold-swim, siri-z31) are now components of MyGOLD but kept for data integrity and historical orders.';

-- Step 7: Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_allocations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_allocations_updated_at_trigger ON product_allocations;
CREATE TRIGGER product_allocations_updated_at_trigger
  BEFORE UPDATE ON product_allocations
  FOR EACH ROW
  EXECUTE FUNCTION update_product_allocations_updated_at();

-- Step 8: Grant permissions
GRANT SELECT ON product_allocations TO authenticated;
GRANT SELECT ON product_allocations TO anon;

-- Step 9: Enable RLS on product_allocations
ALTER TABLE product_allocations ENABLE ROW LEVEL SECURITY;

-- Step 10: Create RLS policies
DROP POLICY IF EXISTS "Anyone can view active product allocations" ON product_allocations;
CREATE POLICY "Anyone can view active product allocations"
  ON product_allocations
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage product allocations" ON product_allocations;
CREATE POLICY "Admins can manage product allocations"
  ON product_allocations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Verification queries (for testing)
-- SELECT * FROM products WHERE slug = 'mygold';
-- SELECT * FROM product_allocations WHERE product_id = (SELECT id FROM products WHERE slug = 'mygold') ORDER BY display_order;
-- SELECT slug, name, is_active FROM products WHERE slug IN ('mygold', 'gold-swim', 'siri-z31');
