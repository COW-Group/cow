-- Rename the 'micro_tasks' table to 'breaths'
ALTER TABLE public.micro_tasks RENAME TO breaths;

-- Rename the foreign key constraint on the 'breaths' table
ALTER TABLE public.breaths RENAME CONSTRAINT micro_tasks_step_id_fkey TO breaths_step_id_fkey;
ALTER TABLE public.breaths RENAME CONSTRAINT micro_tasks_user_id_fkey TO breaths_user_id_fkey;

-- Rename the RLS policies
ALTER POLICY "Users can view their own micro_tasks." ON public.breaths RENAME TO "Users can view their own breaths.";
ALTER POLICY "Users can create micro_tasks for themselves." ON public.breaths RENAME TO "Users can create breaths for themselves.";
ALTER POLICY "Users can update their own micro_tasks." ON public.breaths RENAME TO "Users can update their own breaths.";
ALTER POLICY "Users can delete their own micro_tasks." ON public.breaths RENAME TO "Users can delete their own breaths.";

-- Rename the index
ALTER INDEX public.micro_tasks_step_id_idx RENAME TO breaths_step_id_idx;
ALTER INDEX public.micro_tasks_user_id_idx RENAME TO breaths_user_id_idx;

-- Update the 'updated_at' trigger function if it references the old table name (assuming it's generic, but good to check)
-- If you have a specific trigger function for 'micro_tasks', you might need to recreate it or alter it.
-- For example, if you had:
-- CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.micro_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
-- You would need to:
-- DROP TRIGGER set_timestamp ON public.micro_tasks;
-- CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.breaths FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
-- (Assuming set_updated_at_timestamp is a generic function)
