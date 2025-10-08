"use client"

import React from "react"

interface HabitItem {
  id: string
  label: string
  description: string
  color: string
  time: string
  frequency: string
  isBuildHabit: boolean
  habitGroup?: string
  lengthId?: string | null
  history?: string[]
  notes?: { [date: string]: string }
  units?: { [date: string]: number }
  skipped?: { [date: string]: boolean }
  children?: HabitItem[]
}

interface HabitRowProps {
  habit: HabitItem
  onClick?: () => void
}

// Color pairs for gradient visualization
const colorPairs: {
  [key: string]: { light: { r: number; g: number; b: number }; dark: { r: number; g: number; b: number } }
} = {
  "#FF8C00": { light: { r: 255, g: 220, b: 120 }, dark: { r: 255, g: 69, b: 0 } },
  "#00B7EB": { light: { r: 135, g: 206, b: 255 }, dark: { r: 0, g: 100, b: 255 } },
  "#FF4040": { light: { r: 255, g: 160, b: 180 }, dark: { r: 220, g: 20, b: 60 } },
  "#00CD00": { light: { r: 144, g: 255, b: 144 }, dark: { r: 50, g: 205, b: 50 } },
  "#9B30FF": { light: { r: 221, g: 160, b: 255 }, dark: { r: 138, g: 43, b: 226 } },
  "#FFD700": { light: { r: 255, g: 255, b: 150 }, dark: { r: 255, g: 215, b: 0 } },
  "#00CED1": { light: { r: 175, g: 255, b: 255 }, dark: { r: 0, g: 206, b: 209 } },
  "#808080": { light: { r: 220, g: 220, b: 220 }, dark: { r: 128, g: 128, b: 128 } },
}

// Calculate color saturation based on streak
const getColorWithSaturation = (habitColor: string, intensity: number, habit: HabitItem, targetDate: string) => {
  if (intensity === 0) {
    return { backgroundColor: "rgba(255, 255, 255, 0.05)" }
  }

  const colorPair = colorPairs[habitColor] || colorPairs["#808080"]
  const totalCompletions = habit.history?.filter(Boolean).length || 0
  if (totalCompletions === 0) return { backgroundColor: "rgba(255, 255, 255, 0.05)" }

  const completionDates = (habit.history || []).sort()
  const targetIndex = completionDates.indexOf(targetDate)
  if (targetIndex === -1) return { backgroundColor: "rgba(255, 255, 255, 0.05)" }

  let streakStart = targetIndex
  let streakEnd = targetIndex

  // Find streak start
  for (let i = targetIndex - 1; i >= 0; i--) {
    const currentDate = new Date(completionDates[i])
    const nextDate = new Date(completionDates[i + 1])
    const dayDiff = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    if (dayDiff === 1) {
      streakStart = i
    } else {
      break
    }
  }

  // Find streak end
  for (let i = targetIndex + 1; i < completionDates.length; i++) {
    const currentDate = new Date(completionDates[i])
    const prevDate = new Date(completionDates[i - 1])
    const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    if (dayDiff === 1) {
      streakEnd = i
    } else {
      break
    }
  }

  const streakLength = streakEnd - streakStart + 1
  const positionInStreak = targetIndex - streakStart + 1
  const baseProgress = positionInStreak / Math.max(streakLength, 10)

  let progress: number
  if (baseProgress <= 0.5) {
    progress = Math.sqrt(baseProgress * 2) * 0.5
  } else {
    const remaining = (baseProgress - 0.5) * 2
    progress = 0.5 + remaining * remaining * 0.5
  }

  progress = Math.max(0.2, Math.min(0.95, progress))

  const r = Math.round(colorPair.light.r + (colorPair.dark.r - colorPair.light.r) * progress)
  const g = Math.round(colorPair.light.g + (colorPair.dark.g - colorPair.light.g) * progress)
  const b = Math.round(colorPair.light.b + (colorPair.dark.b - colorPair.light.b) * progress)

  return { backgroundColor: `rgb(${r}, ${g}, ${b})` }
}

// Calculate current streak
const calculateCurrentStreak = (history: string[], skipped?: { [date: string]: boolean }) => {
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  // Check if there's any activity (completed or skipped) today or yesterday
  const hasActivityToday = history?.includes(today) || skipped?.[today]
  const hasActivityYesterday = history?.includes(yesterdayStr) || skipped?.[yesterdayStr]

  if (!hasActivityToday && !hasActivityYesterday) {
    return 0
  }

  let streak = 0
  let currentDate = new Date()

  // Count consecutive days with activity (completed OR skipped)
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split("T")[0]
    const isCompleted = history?.includes(dateStr)
    const isSkipped = skipped?.[dateStr]

    if (isCompleted || isSkipped) {
      // Only count completed days in streak number
      if (isCompleted) {
        streak++
      }
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, onClick }) => {
  // Get last 7-14 days for visualization
  const recentDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return date.toISOString().split("T")[0]
  })

  const currentStreak = calculateCurrentStreak(habit.history || [], habit.skipped)
  const longestStreak = habit.history?.length || 0
  const totalCount = habit.history?.length || 0

  return (
    <div
      className="rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.01]"
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
        {/* Habit Name */}
        <div className="flex-1 min-w-0 mr-3">
          <span className="text-xs sm:text-sm font-inter text-cream-25 truncate block">
            {habit.label}
          </span>
        </div>

        {/* Recent Days Visualization */}
        <div className="hidden md:flex items-center gap-0.5 sm:gap-1 mr-3 sm:mr-4">
          {recentDays.slice(-7).map((date, index) => {
            const isCompleted = habit.history?.includes(date)
            const isSkipped = habit.skipped?.[date]
            const intensity = isCompleted ? 1 : 0
            const style = isCompleted
              ? getColorWithSaturation(habit.color, intensity, habit, date)
              : { backgroundColor: "rgba(255, 255, 255, 0.05)" }

            return (
              <div
                key={`${habit.id}-${date}-${index}`}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded transition-all duration-200"
                style={style}
                title={date}
              />
            )
          })}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          {/* Current Streak */}
          <div className="flex flex-col items-center min-w-[2rem]">
            <span className="font-inter font-light text-cream-25/90">{currentStreak}</span>
            <span className="text-[10px] sm:text-xs text-cream-25/50 uppercase">streak</span>
          </div>

          {/* Total Count */}
          <div className="hidden sm:flex flex-col items-center min-w-[2rem]">
            <span className="font-inter font-light text-cream-25/90">{totalCount}</span>
            <span className="text-xs text-cream-25/50 uppercase">total</span>
          </div>
        </div>
      </div>
    </div>
  )
}
