-- Create financial_inflows table
CREATE TABLE IF NOT EXISTS financial_inflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'assets')),
  category VARCHAR(100),
  description TEXT,
  work_start_date DATE,
  inflow_arrival_date DATE,
  frequency VARCHAR(50) DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually', 'one-time')),
  is_active BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#10b981',
  goal_linked VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_outflows table
CREATE TABLE IF NOT EXISTS financial_outflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('expenses', 'liabilities', 'goals')),
  category VARCHAR(100),
  description TEXT,
  due_date DATE,
  payment_date DATE,
  frequency VARCHAR(50) DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'annually', 'one-time')),
  is_active BOOLEAN DEFAULT true,
  color VARCHAR(7) DEFAULT '#f97316',
  goal_linked VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_inflows_user_id ON financial_inflows(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_inflows_type ON financial_inflows(type);
CREATE INDEX IF NOT EXISTS idx_financial_outflows_user_id ON financial_outflows(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_outflows_type ON financial_outflows(type);

-- Enable RLS
ALTER TABLE financial_inflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_outflows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own inflows" ON financial_inflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inflows" ON financial_inflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inflows" ON financial_inflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inflows" ON financial_inflows
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own outflows" ON financial_outflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outflows" ON financial_outflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outflows" ON financial_outflows
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outflows" ON financial_outflows
  FOR DELETE USING (auth.uid() = user_id);
