-- Add onboarding-related columns to the public.users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_adult BOOLEAN,
ADD COLUMN IF NOT EXISTS has_investment_experience TEXT,
ADD COLUMN IF NOT EXISTS wealth_class TEXT,
ADD COLUMN IF NOT EXISTS life_stage TEXT,
ADD COLUMN IF NOT EXISTS life_goals JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS monthly_income NUMERIC,
ADD COLUMN IF NOT EXISTS monthly_expenses NUMERIC,
ADD COLUMN IF NOT EXISTS assets NUMERIC,
ADD COLUMN IF NOT EXISTS liabilities NUMERIC,
ADD COLUMN IF NOT EXISTS skills_to_improve JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS financial_freedom_goals JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS minimum_annual_income NUMERIC,
ADD COLUMN IF NOT EXISTS maximum_annual_income NUMERIC,
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT,
ADD COLUMN IF NOT EXISTS stress_level TEXT,
ADD COLUMN IF NOT EXISTS help_needed TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Add comments for clarity
COMMENT ON COLUMN public.users.is_adult IS 'Indicates if the user is 18 or older.';
COMMENT ON COLUMN public.users.has_investment_experience IS 'User''s investment experience level.';
COMMENT ON COLUMN public.users.wealth_class IS 'User''s selected wealth class (e.g., Apprentice, Adventurer, Master).';
COMMENT ON COLUMN public.users.life_stage IS 'User''s selected life stage (e.g., Young Adult, Adult, Midlife).';
COMMENT ON COLUMN public.users.life_goals IS 'JSONB array of user''s selected life goals.';
COMMENT ON COLUMN public.users.monthly_income IS 'User''s approximate monthly income.';
COMMENT ON COLUMN public.users.monthly_expenses IS 'User''s approximate monthly expenses.';
COMMENT ON COLUMN public.users.assets IS 'User''s approximate total assets value.';
COMMENT ON COLUMN public.users.liabilities IS 'User''s approximate total liabilities/debt.';
COMMENT ON COLUMN public.users.skills_to_improve IS 'JSONB array of skills user wants to improve.';
COMMENT ON COLUMN public.users.financial_freedom_goals IS 'JSONB object of user''s financial freedom income goals.';
COMMENT ON COLUMN public.users.country IS 'User''s country of residence.';
COMMENT ON COLUMN public.users.currency IS 'User''s local currency.';
COMMENT ON COLUMN public.users.minimum_annual_income IS 'User''s minimum annual income.';
COMMENT ON COLUMN public.users.maximum_annual_income IS 'User''s maximum annual income.';
COMMENT ON COLUMN public.users.risk_tolerance IS 'User''s financial risk tolerance.';
COMMENT ON COLUMN public.users.stress_level IS 'User''s stress level about money.';
COMMENT ON COLUMN public.users.help_needed IS 'User''s desired level of help with wealth-building.';
COMMENT ON COLUMN public.users.is_premium IS 'Indicates if the user has a premium plan.';
