-- Enable RLS for wealth vision tables if not already enabled
ALTER TABLE vision_board_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mountains ENABLE ROW LEVEL SECURITY;
ALTER TABLE hills ENABLE ROW LEVEL SECURITY;
ALTER TABLE terrains ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_tasks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for vision_board_sections
-- Assuming SELECT and INSERT policies are already in place from previous steps,
-- adding UPDATE and DELETE for completeness if they are not.
CREATE POLICY "Users can update their own vision_board_sections" ON vision_board_sections
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vision_board_sections" ON vision_board_sections
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for mountains
CREATE POLICY "Users can view their own mountains" ON mountains
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mountains" ON mountains
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mountains" ON mountains
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mountains" ON mountains
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for hills
CREATE POLICY "Users can view their own hills" ON hills
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own hills" ON hills
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hills" ON hills
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hills" ON hills
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for terrains
CREATE POLICY "Users can view their own terrains" ON terrains
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own terrains" ON terrains
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own terrains" ON terrains
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own terrains" ON terrains
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for milestones
CREATE POLICY "Users can view their own milestones" ON milestones
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own milestones" ON milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON milestones
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own milestones" ON milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for SELECT, INSERT, UPDATE, DELETE for micro_tasks
CREATE POLICY "Users can view their own micro_tasks" ON micro_tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own micro_tasks" ON micro_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own micro_tasks" ON micro_tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own micro_tasks" ON micro_tasks
  FOR DELETE USING (auth.uid() = user_id);
