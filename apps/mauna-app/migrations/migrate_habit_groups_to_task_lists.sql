-- Migration: Link existing habit groups to task lists
-- This creates task lists for habit groups and links habits to them
-- This function can be called anytime to sync habit groups with task lists

-- Create a permanent function to sync habit groups with task lists
CREATE OR REPLACE FUNCTION sync_habit_groups_to_task_lists()
RETURNS TABLE (
  user_id_result UUID,
  habit_group_result TEXT,
  task_list_id_result TEXT,
  habits_linked_count INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id UUID;
  v_habit_group TEXT;
  v_task_list_id TEXT;
  v_max_position INT;
  v_habits_count INT;
BEGIN
  -- Loop through all unique user_id + habit_group combinations
  FOR v_user_id, v_habit_group IN
    SELECT DISTINCT s.user_id, s.habit_group
    FROM steps s
    WHERE s.tag = 'habit'
      AND s.habit_group IS NOT NULL
      AND s.habit_group != ''
    ORDER BY s.user_id, s.habit_group
  LOOP
    -- Check if a task list already exists for this user + habit group
    SELECT tl.id INTO v_task_list_id
    FROM task_lists tl
    WHERE tl.user_id = v_user_id
      AND tl.name = v_habit_group
      AND tl.id::text LIKE 'habit-group-%'
    LIMIT 1;

    -- If task list doesn't exist, create it
    IF v_task_list_id IS NULL THEN
      -- Get the highest position for this user
      SELECT COALESCE(MAX(position), -1) INTO v_max_position
      FROM task_lists
      WHERE user_id = v_user_id;

      -- Generate task list ID
      v_task_list_id := 'habit-group-' ||
                        LOWER(REPLACE(v_habit_group, ' ', '-')) || '-' ||
                        EXTRACT(EPOCH FROM NOW())::TEXT;

      -- Create the task list
      INSERT INTO task_lists (id, user_id, name, position, suggested_time_block_range)
      VALUES (v_task_list_id, v_user_id, v_habit_group, v_max_position + 1, NULL);
    END IF;

    -- Link all habits in this group to the task list
    UPDATE steps
    SET task_list_id = v_task_list_id
    WHERE user_id = v_user_id
      AND habit_group = v_habit_group
      AND tag = 'habit'
      AND task_list_id IS NULL;

    -- Get count of habits linked
    GET DIAGNOSTICS v_habits_count = ROW_COUNT;

    -- Return results for logging
    user_id_result := v_user_id;
    habit_group_result := v_habit_group;
    task_list_id_result := v_task_list_id;
    habits_linked_count := v_habits_count;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- Execute the initial sync
SELECT * FROM sync_habit_groups_to_task_lists();

-- Add comments
COMMENT ON TABLE task_lists IS 'Task lists including habit groups. Task lists with IDs starting with "habit-group-" are automatically created from habit groups.';
COMMENT ON FUNCTION sync_habit_groups_to_task_lists() IS 'Syncs all habit groups to task lists. Creates task lists for groups and links habits. Can be called anytime to ensure sync.';
