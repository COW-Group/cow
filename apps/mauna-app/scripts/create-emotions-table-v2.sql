-- Create the 'emotions' table
CREATE TABLE public.emotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emotion_name text,
    emotion_category text,
    intensity integer,
    notes text,
    is_vaulted boolean DEFAULT FALSE,
    is_pain_box boolean DEFAULT FALSE,
    is_processed boolean DEFAULT FALSE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    -- New fields for the emotional processing flow
    trigger_context text,
    trigger_event text,
    trigger_worldview text,
    physical_sensations text,
    subjective_feelings text,
    reflection text,
    response text,
    is_constructive boolean,
    pain_box_reasons text[], -- Array of text for pain box reasons
    current_step text -- 'trigger', 'experience', 'vault', 'sit', 'respond', 'processed'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.emotions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to SELECT their own emotions
CREATE POLICY "Users can view their own emotions." ON public.emotions
FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to INSERT their own emotions
CREATE POLICY "Users can create emotions for themselves." ON public.emotions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to UPDATE their own emotions
CREATE POLICY "Users can update their own emotions." ON public.emotions
FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for authenticated users to DELETE their own emotions
CREATE POLICY "Users can delete their own emotions." ON public.emotions
FOR DELETE USING (auth.uid() = user_id);

-- Optional: Add an index for faster lookups by user_id
CREATE INDEX ON public.emotions (user_id);
