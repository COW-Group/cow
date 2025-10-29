-- Migration: Add price calculation formula fields to products table
-- This allows storing formulas for dynamically calculating prices based on live gold prices

-- Add formula fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price_formula TEXT,
ADD COLUMN IF NOT EXISTS price_formula_description TEXT;

-- Add comment explaining the formula
COMMENT ON COLUMN products.price_formula IS 'JavaScript formula to calculate unit price from live gold prices. Available variables: spotAsk (USD/oz), eurExchangeRate, transactionBrokerage';
COMMENT ON COLUMN products.price_formula_description IS 'Human-readable description of the pricing formula';

-- Update GOLD SWIM with its pricing formula
UPDATE products
SET
  price_formula = '((spotAsk / eurExchangeRate / 31.1034768) + 15) / (1 - 0.001)',
  price_formula_description = 'Price per unit = (Spot EUR per gram + €15 premium) / (1 - 0.1% transaction fee)',
  min_investment = 123.00,
  base_price = 123.00
WHERE slug = 'gold-swim';

-- Update SIRI Z31 with its pricing formula
UPDATE products
SET
  price_formula = '(((spotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3) / (100 * 31.1034768 * 100) / eurExchangeRate',
  price_formula_description = 'Cash margin per unit (1/100th gram) = (((Spot Ask/31.1034768)+18.1)*31.1034768*100/3) / (100*31.1034768*100) converted to EUR',
  min_investment = 0.41,
  base_price = 0.41
WHERE slug = 'siri-z31';

-- Add API endpoints for live gold pricing
COMMENT ON TABLE products IS 'Investment products with dynamic pricing based on live LBMA gold prices. Live prices fetched from: https://mycow-gcf-766469853327.europe-west1.run.app (futures) and https://mycow-gsa-766469853327.europe-west1.run.app/ (spot ask + EUR rate)';
