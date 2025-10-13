-- Automatic sync: Habit groups to task lists
-- This trigger automatically creates task lists and links habits when habit_group changes

-- Function to sync a single habit to its task list
CREATE OR REPLACE FUNCTION sync_habit_to_task_list()
RETURNS TRIGGER AS $$
DECLARE
  v_task_list_id UUID;
  v_max_position INT;
BEGIN
  -- Only process if this is a habit with a habit_group
  IF NEW.tag = 'habit' AND NEW.habit_group IS NOT NULL AND NEW.habit_group != '' THEN
    -- Check if task list exists for this habit group (by user_id and name)
    SELECT id INTO v_task_list_id
    FROM task_lists
    WHERE user_id = NEW.user_id
      AND name = NEW.habit_group
    LIMIT 1;

    -- Create task list if it doesn't exist
    IF v_task_list_id IS NULL THEN
      -- Get highest position
      SELECT COALESCE(MAX(position), -1) INTO v_max_position
      FROM task_lists
      WHERE user_id = NEW.user_id;

      -- Generate a proper UUID
      v_task_list_id := gen_random_uuid();

      -- Create the task list
      INSERT INTO task_lists (id, user_id, name, position, suggested_time_block_range)
      VALUES (v_task_list_id, NEW.user_id, NEW.habit_group, v_max_position + 1, NULL);
    END IF;

    -- Link habit to task list
    NEW.task_list_id := v_task_list_id;

  -- If habit_group is removed, unlink from task list
  ELSIF NEW.tag = 'habit' AND (NEW.habit_group IS NULL OR NEW.habit_group = '') THEN
    NEW.task_list_id := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS sync_habit_to_task_list_trigger ON steps;
CREATE TRIGGER sync_habit_to_task_list_trigger
  BEFORE INSERT OR UPDATE OF habit_group
  ON steps
  FOR EACH ROW
  EXECUTE FUNCTION sync_habit_to_task_list();

-- One-time sync for existing habits
DO $$
DECLARE
  v_habit RECORD;
  v_task_list_id UUID;
  v_max_position INT;
BEGIN
  FOR v_habit IN
    SELECT DISTINCT user_id, habit_group
    FROM steps
    WHERE tag = 'habit'
      AND habit_group IS NOT NULL
      AND habit_group != ''
    ORDER BY user_id, habit_group
  LOOP
    -- Check if task list exists (by user_id and name)
    SELECT id INTO v_task_list_id
    FROM task_lists
    WHERE user_id = v_habit.user_id
      AND name = v_habit.habit_group
    LIMIT 1;

    -- Create if doesn't exist
    IF v_task_list_id IS NULL THEN
      SELECT COALESCE(MAX(position), -1) INTO v_max_position
      FROM task_lists
      WHERE user_id = v_habit.user_id;

      v_task_list_id := gen_random_uuid();

      INSERT INTO task_lists (id, user_id, name, position, suggested_time_block_range)
      VALUES (v_task_list_id, v_habit.user_id, v_habit.habit_group, v_max_position + 1, NULL);
    END IF;

    -- Link habits to task list
    UPDATE steps
    SET task_list_id = v_task_list_id
    WHERE user_id = v_habit.user_id
      AND habit_group = v_habit.habit_group
      AND tag = 'habit'
      AND task_list_id IS NULL;
  END LOOP;
END $$;

-- Add comments
COMMENT ON FUNCTION sync_habit_to_task_list() IS 'Automatically syncs habits to task lists when habit_group is set or changed';
COMMENT ON TABLE task_lists IS 'Task lists including habit groups. Habit groups automatically create and link to task lists.';
