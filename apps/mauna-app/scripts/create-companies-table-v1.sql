CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON public.companies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON public.companies FOR DELETE USING (auth.role() = 'authenticated');

-- Add some sample companies
INSERT INTO public.companies (name) VALUES
('Acme Corp'),
('Beta Inc.'),
('Gamma Solutions');
