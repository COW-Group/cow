"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { HabitRow } from "./habit-row"

interface HabitItem {
  id: string
  label: string
  description: string
  color: string
  time: string
  frequency: string
  isBuildHabit: boolean
  habitGroup?: string
  history?: string[]
  notes?: { [date: string]: string }
  units?: { [date: string]: number }
  skipped?: { [date: string]: boolean }
  children?: HabitItem[]
}

interface HabitGroupProps {
  groupName: string
  habits: HabitItem[]
  color: string
  isExpanded?: boolean
  onToggle?: () => void
  onHabitClick?: (habit: HabitItem) => void
}

// Calculate group stats
const calculateGroupStats = (habits: HabitItem[]) => {
  const today = new Date().toISOString().split("T")[0]
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  })

  // Calculate current streak for the group
  let groupStreak = 0
  for (let i = 0; i < 365; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const allCompleted = habits.every((habit) => habit.history?.includes(dateStr))
    if (allCompleted && habits.length > 0) {
      groupStreak++
    } else {
      break
    }
  }

  // Calculate total completions in last 7 days
  const completionsLast7Days = habits.reduce((sum, habit) => {
    return sum + last7Days.filter(date => habit.history?.includes(date)).length
  }, 0)

  const maxPossibleCompletions = habits.length * 7
  const completionPercentage = maxPossibleCompletions > 0
    ? Math.round((completionsLast7Days / maxPossibleCompletions) * 100)
    : 0

  return {
    currentStreak: groupStreak,
    completionPercentage,
    totalHabits: habits.length,
  }
}

export const HabitGroup: React.FC<HabitGroupProps> = ({
  groupName,
  habits,
  color,
  isExpanded = false,
  onToggle,
  onHabitClick,
}) => {
  const [expanded, setExpanded] = useState(isExpanded)
  const stats = calculateGroupStats(habits)

  const handleToggle = () => {
    setExpanded(!expanded)
    onToggle?.()
  }

  return (
    <div className="mb-3 w-full">
      {/* Group Header */}
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer"
        onClick={handleToggle}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Background progress bar */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, ${color}22 0%, ${color}11 ${stats.completionPercentage}%, transparent ${stats.completionPercentage}%)`,
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Expand/Collapse Icon */}
            <div className="flex-shrink-0">
              {expanded ? (
                <ChevronDown className="h-5 w-5 text-cream-25 transition-transform" />
              ) : (
                <ChevronRight className="h-5 w-5 text-cream-25 transition-transform" />
              )}
            </div>

            {/* Group Name */}
            <h3 className="text-sm sm:text-base font-inter font-medium text-cream-25 uppercase tracking-wide truncate">
              {groupName}
            </h3>

            {/* Habit Count Badge */}
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(253, 250, 243, 0.9)',
              }}
            >
              {stats.totalHabits}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
            {/* Completion Percentage */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl font-inter font-light text-cream-25">
                {stats.completionPercentage}%
              </span>
            </div>

            {/* Current Streak */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-sm sm:text-base font-inter text-cream-25/70">
                {stats.currentStreak}
              </span>
              <span className="text-xl sm:text-2xl">🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Habit List */}
      {expanded && (
        <div className="mt-2 space-y-2 pl-4 sm:pl-6">
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onClick={() => onHabitClick?.(habit)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
