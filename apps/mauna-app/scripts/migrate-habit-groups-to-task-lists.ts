#!/usr/bin/env tsx
/**
 * Migration script to link existing habit groups to task lists
 *
 * This script:
 * 1. Finds all habits with habit_group set
 * 2. Creates task lists for each unique habit group
 * 3. Links habits to their corresponding task lists
 *
 * Run with: npx tsx scripts/migrate-habit-groups-to-task-lists.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🔄 Habit Groups to Task Lists Migration Script\n')

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // 1. Fetch all habits with habit_group set
    console.log('📊 Analyzing existing habits...')
    const { data: habits, error: habitsError } = await supabase
      .from('steps')
      .select('id, user_id, habit_group, label, task_list_id')
      .eq('tag', 'habit')
      .not('habit_group', 'is', null)

    if (habitsError) {
      throw new Error(`Failed to fetch habits: ${habitsError.message}`)
    }

    if (!habits || habits.length === 0) {
      console.log('✅ No habits with groups found. Migration not needed.')
      rl.close()
      return
    }

    // Group habits by user and habit_group
    const habitsByUser = new Map<string, Map<string, typeof habits>>()

    for (const habit of habits) {
      if (!habitsByUser.has(habit.user_id)) {
        habitsByUser.set(habit.user_id, new Map())
      }
      const userHabits = habitsByUser.get(habit.user_id)!
      if (!userHabits.has(habit.habit_group)) {
        userHabits.set(habit.habit_group, [])
      }
      userHabits.get(habit.habit_group)!.push(habit)
    }

    console.log(`\nFound ${habits.length} habits across ${habitsByUser.size} users`)
    console.log(`Unique habit groups: ${Array.from(habitsByUser.values()).reduce((sum, map) => sum + map.size, 0)}`)

    // Show summary
    console.log('\n📋 Migration Summary:')
    for (const [userId, userGroups] of habitsByUser.entries()) {
      console.log(`\nUser: ${userId}`)
      for (const [groupName, groupHabits] of userGroups.entries()) {
        const alreadyLinked = groupHabits.filter(h => h.task_list_id !== null).length
        const needsLinking = groupHabits.length - alreadyLinked
        console.log(`  - "${groupName}": ${groupHabits.length} habits (${needsLinking} need linking)`)
      }
    }

    const answer = await question('\n⚠️  Proceed with migration? (yes/no): ')
    if (answer.toLowerCase() !== 'yes') {
      console.log('Migration cancelled.')
      rl.close()
      return
    }

    // 2. Perform migration
    console.log('\n🔄 Starting migration...')
    let createdTaskLists = 0
    let linkedHabits = 0
    let skippedHabits = 0
    let errors = 0

    for (const [userId, userGroups] of habitsByUser.entries()) {
      console.log(`\n👤 Processing user: ${userId}`)

      for (const [groupName, groupHabits] of userGroups.entries()) {
        try {
          // Check if task list already exists for this group
          const taskListId = `habit-group-${groupName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

          const { data: existingList } = await supabase
            .from('task_lists')
            .select('id')
            .eq('user_id', userId)
            .eq('name', groupName)
            .like('id', 'habit-group-%')
            .maybeSingle()

          let finalTaskListId: string

          if (existingList) {
            console.log(`  ℹ️  Task list "${groupName}" already exists, using existing ID`)
            finalTaskListId = existingList.id
          } else {
            // Get highest position for this user
            const { data: existingLists } = await supabase
              .from('task_lists')
              .select('position')
              .eq('user_id', userId)
              .order('position', { ascending: false })
              .limit(1)

            const maxPosition = existingLists && existingLists.length > 0 ? existingLists[0].position : 0

            // Create new task list
            const { data: newList, error: createError } = await supabase
              .from('task_lists')
              .insert({
                id: taskListId,
                user_id: userId,
                name: groupName,
                position: maxPosition + 1,
                suggested_time_block_range: null,
              })
              .select()
              .single()

            if (createError) {
              throw new Error(`Failed to create task list: ${createError.message}`)
            }

            finalTaskListId = newList.id
            createdTaskLists++
            console.log(`  ✅ Created task list "${groupName}"`)
          }

          // Link all habits in this group to the task list
          const habitsToLink = groupHabits.filter(h => h.task_list_id === null)

          if (habitsToLink.length > 0) {
            const { error: updateError } = await supabase
              .from('steps')
              .update({ task_list_id: finalTaskListId })
              .in('id', habitsToLink.map(h => h.id))

            if (updateError) {
              throw new Error(`Failed to link habits: ${updateError.message}`)
            }

            linkedHabits += habitsToLink.length
            console.log(`  ✅ Linked ${habitsToLink.length} habits to "${groupName}"`)
          }

          skippedHabits += groupHabits.length - habitsToLink.length
          if (groupHabits.length !== habitsToLink.length) {
            console.log(`  ℹ️  Skipped ${groupHabits.length - habitsToLink.length} already-linked habits`)
          }

        } catch (error: any) {
          errors++
          console.error(`  ❌ Error processing "${groupName}": ${error.message}`)
        }
      }
    }

    // 3. Summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ Migration Complete!')
    console.log('='.repeat(60))
    console.log(`📊 Task Lists Created: ${createdTaskLists}`)
    console.log(`🔗 Habits Linked: ${linkedHabits}`)
    console.log(`⏭️  Habits Skipped (already linked): ${skippedHabits}`)
    if (errors > 0) {
      console.log(`❌ Errors: ${errors}`)
    }
    console.log('='.repeat(60))

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
