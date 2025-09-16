CREATE TABLE IF NOT EXISTS public.time_blocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_list_id uuid REFERENCES public.task_lists(id) ON DELETE SET NULL,
  step_id uuid REFERENCES public.steps(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  label text,
  color text,
  icon text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own time blocks" ON public.time_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own time blocks" ON public.time_blocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own time blocks" ON public.time_blocks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time blocks" ON public.time_blocks
  FOR DELETE USING (auth.uid() = user_id);

-- Add a trigger to update the 'updated_at' column automatically
CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON public.time_blocks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();
