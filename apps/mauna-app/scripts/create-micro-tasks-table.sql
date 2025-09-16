-- Create the 'micro_tasks' table
CREATE TABLE public.micro_tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    step_id uuid NOT NULL REFERENCES public.steps(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label text NOT NULL,
    completed boolean DEFAULT FALSE,
    is_running boolean DEFAULT FALSE,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    paused_time integer DEFAULT 0, -- in seconds
    total_time_seconds integer DEFAULT 0, -- in seconds
    time_estimation_seconds integer DEFAULT 0, -- in seconds
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.micro_tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to SELECT their own micro_tasks
CREATE POLICY "Users can view their own micro_tasks." ON public.micro_tasks
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to INSERT their own micro_tasks
CREATE POLICY "Users can create micro_tasks for themselves." ON public.micro_tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to UPDATE their own micro_tasks
CREATE POLICY "Users can update their own micro_tasks." ON public.micro_tasks
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for authenticated users to DELETE their own micro_tasks
CREATE POLICY "Users can delete their own micro_tasks." ON public.micro_tasks
FOR DELETE USING (auth.uid() = user_id);

-- Optional: Add indexes for faster lookups
CREATE INDEX ON public.micro_tasks (step_id);
CREATE INDEX ON public.micro_tasks (user_id);
