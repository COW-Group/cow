CREATE TYPE public.goal_type AS ENUM ('Objective', 'Key Result', 'Individual Goal');
CREATE TYPE public.metric_type AS ENUM ('Numeric', 'Percentage', 'Currency');
CREATE TYPE public.goal_status AS ENUM ('On Track', 'At Risk', 'Off Track');

CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type goal_type NOT NULL,
  description text,
  target_value float,
  metric_type metric_type,
  time_period text, -- e.g., "Q1 2025", "Annual 2025", "Custom"
  start_date date,
  end_date date,
  owners uuid[] DEFAULT '{}'::uuid[], -- Array of user IDs
  visibility jsonb DEFAULT '{}'::jsonb NOT NULL, -- { type: "Company"/"Team"/"Private", ids: ["uuid1", "uuid2"] }
  parent_goal_id uuid REFERENCES public.goals(id) ON DELETE SET NULL,
  related_work uuid[] DEFAULT '{}'::uuid[], -- Array of project/task/portfolio IDs
  progress float DEFAULT 0 NOT NULL, -- 0-100
  status goal_status DEFAULT 'On Track'::goal_status NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for owners and visible entities" ON public.goals FOR SELECT USING (
  auth.uid() = user_id OR
  auth.uid() = ANY(owners) OR
  (visibility->>'type' = 'Company' AND EXISTS (SELECT 1 FROM public.companies WHERE id::text = ANY(ARRAY(SELECT jsonb_array_elements_text(visibility->'ids'))))) OR
  (visibility->>'type' = 'Team' AND EXISTS (SELECT 1 FROM public.teams WHERE id::text = ANY(ARRAY(SELECT jsonb_array_elements_text(visibility->'ids')))))
);

CREATE POLICY "Enable insert for authenticated users only" ON public.goals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for owners" ON public.goals FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = ANY(owners));
CREATE POLICY "Enable delete for owners" ON public.goals FOR DELETE USING (auth.uid() = user_id OR auth.uid() = ANY(owners));
