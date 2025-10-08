-- Migration: Add missing columns to steps table for timeline functionality
-- Run this in your Supabase SQL editor

-- Add frequency column to store how often a step/habit repeats
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS frequency TEXT;

-- Add habit_notes column to store metadata (scheduled time, energy level, alerts, notes)
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS habit_notes JSONB DEFAULT '{}'::jsonb;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_steps_frequency ON steps(frequency);
CREATE INDEX IF NOT EXISTS idx_steps_habit_notes ON steps USING GIN (habit_notes);

-- Add comment for documentation
COMMENT ON COLUMN steps.frequency IS 'Frequency of the habit/step (e.g., "daily", "weekly", "monthly")';
COMMENT ON COLUMN steps.habit_notes IS 'JSONB field storing metadata like scheduled_time, energyLevel, alerts, and notes';
