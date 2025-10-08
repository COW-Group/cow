"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Edit2, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useVisionData } from "@/lib/vision-data-provider"

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

interface HabitDetailModalProps {
  habit: HabitItem
  allHabits: HabitItem[]
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  onUpdate: (habitId: string, updates: Partial<HabitItem>) => Promise<void>
  onDelete?: (habitId: string) => Promise<void>
}

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

const getColorWithSaturation = (habitColor: string, habit: HabitItem, targetDate: string) => {
  const isCompleted = habit.history?.includes(targetDate)
  const isSkipped = habit.skipped?.[targetDate]
  const colorPair = colorPairs[habitColor] || colorPairs["#808080"]

  // If not completed and not skipped, return default
  if (!isCompleted && !isSkipped) {
    return {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      gradientColor: habitColor
    }
  }

  // Build a combined timeline of completed AND skipped dates for streak calculation
  const allActivityDates = new Set([
    ...(habit.history || []),
    ...Object.keys(habit.skipped || {}).filter(d => habit.skipped?.[d])
  ])
  const sortedActivityDates = Array.from(allActivityDates).sort()

  const targetIndex = sortedActivityDates.indexOf(targetDate)
  if (targetIndex === -1) {
    return {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      gradientColor: habitColor
    }
  }

  let streakStart = targetIndex
  let streakEnd = targetIndex

  // Find streak start (going backwards) - include skipped days in streak
  for (let i = targetIndex - 1; i >= 0; i--) {
    const [y1, m1, d1] = sortedActivityDates[i].split('-').map(Number)
    const [y2, m2, d2] = sortedActivityDates[i + 1].split('-').map(Number)
    const currentDate = new Date(y1, m1 - 1, d1)
    const nextDate = new Date(y2, m2 - 1, d2)
    const dayDiff = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    if (dayDiff === 1) {
      streakStart = i
    } else {
      break
    }
  }

  // Find streak end (going forwards) - include skipped days in streak
  for (let i = targetIndex + 1; i < sortedActivityDates.length; i++) {
    const [y1, m1, d1] = sortedActivityDates[i].split('-').map(Number)
    const [y2, m2, d2] = sortedActivityDates[i - 1].split('-').map(Number)
    const currentDate = new Date(y1, m1 - 1, d1)
    const prevDate = new Date(y2, m2 - 1, d2)
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

  const gradientColor = `rgb(${r}, ${g}, ${b})`

  return {
    backgroundColor: isCompleted ? gradientColor : "rgba(255, 255, 255, 0.08)",
    gradientColor
  }
}

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

const calculateLongestStreak = (history: string[], skipped?: { [date: string]: boolean }) => {
  // Combine completed and skipped dates for streak calculation
  const allActivityDates = new Set([
    ...(history || []),
    ...Object.keys(skipped || {}).filter(d => skipped?.[d])
  ])

  if (allActivityDates.size === 0) return 0

  const sortedDates = Array.from(allActivityDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  let longestStreak = 0
  let currentStreak = 0

  for (let i = 0; i < sortedDates.length; i++) {
    const currDate = new Date(sortedDates[i])

    if (i === 0) {
      currentStreak = history?.includes(sortedDates[i]) ? 1 : 0
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        // Only count if it's a completed day
        if (history?.includes(sortedDates[i])) {
          currentStreak++
        }
      } else {
        currentStreak = history?.includes(sortedDates[i]) ? 1 : 0
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak)
  }

  return longestStreak
}

export function HabitDetailModal({
  habit,
  allHabits,
  onClose,
  onNext,
  onPrevious,
  onUpdate,
  onDelete,
}: HabitDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "calendar" | "journal">("overview")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [journalNote, setJournalNote] = useState("")
  const [isEditingJournal, setIsEditingJournal] = useState(false)
  const [units, setUnits] = useState(0)
  const [isEditingHabit, setIsEditingHabit] = useState(false)
  const [editLabel, setEditLabel] = useState(habit.label)
  const [editDescription, setEditDescription] = useState(habit.description || "")
  const [editColor, setEditColor] = useState(habit.color)
  const [selectedRangeId, setSelectedRangeId] = useState<string>("")
  const [selectedMountainId, setSelectedMountainId] = useState<string>("")
  const [selectedHillId, setSelectedHillId] = useState<string>("")
  const [selectedTerrainId, setSelectedTerrainId] = useState<string>("")
  const [selectedLengthId, setSelectedLengthId] = useState<string>("")
  const calendarScrollRef = React.useRef<HTMLDivElement>(null)

  // Get vision data for hierarchy selectors
  const { ranges, lengths } = useVisionData()

  // Compute available options based on selections
  const availableMountains = ranges.find(r => r.id === selectedRangeId)?.mountains || []
  const availableHills = availableMountains.find(m => m.id === selectedMountainId)?.hills || []
  const availableTerrains = availableHills.find(h => h.id === selectedHillId)?.terrains || []
  const availableLengths = availableTerrains.find(t => t.id === selectedTerrainId)?.lengths || []

  const currentStreak = calculateCurrentStreak(habit.history || [], habit.skipped)
  const longestStreak = calculateLongestStreak(habit.history || [], habit.skipped)
  const totalCount = habit.history?.length || 0

  // Initialize hierarchy from habit's lengthId
  useEffect(() => {
    if (habit.lengthId && ranges.length > 0) {
      // Find the full hierarchy path from lengthId
      for (const range of ranges) {
        for (const mountain of range.mountains || []) {
          for (const hill of mountain.hills || []) {
            for (const terrain of hill.terrains || []) {
              const length = terrain.lengths?.find(l => l.id === habit.lengthId)
              if (length) {
                setSelectedRangeId(range.id)
                setSelectedMountainId(mountain.id)
                setSelectedHillId(hill.id)
                setSelectedTerrainId(terrain.id)
                setSelectedLengthId(length.id)
                return
              }
            }
          }
        }
      }
    }
  }, [habit.lengthId, ranges])

  useEffect(() => {
    setJournalNote(habit.notes?.[selectedDate] || "")
    setUnits(habit.units?.[selectedDate] || 0)
  }, [selectedDate, habit.notes, habit.units])

  const handleSaveNote = async () => {
    const updatedNotes = { ...(habit.notes || {}), [selectedDate]: journalNote }
    const updatedUnits = { ...(habit.units || {}), [selectedDate]: units }
    await onUpdate(habit.id, { notes: updatedNotes, units: updatedUnits })
    setIsEditingJournal(false)
  }

  const handleToggleCompletion = async () => {
    const updatedHistory = [...(habit.history || [])]
    const updatedSkipped = { ...(habit.skipped || {}) }
    const isCompleted = updatedHistory.includes(selectedDate)
    const isSkipped = updatedSkipped[selectedDate]

    if (isCompleted) {
      // Completed -> Skipped
      const index = updatedHistory.indexOf(selectedDate)
      updatedHistory.splice(index, 1)
      updatedSkipped[selectedDate] = true
    } else if (isSkipped) {
      // Skipped -> Not completed
      delete updatedSkipped[selectedDate]
    } else {
      // Not completed -> Completed
      updatedHistory.push(selectedDate)
      delete updatedSkipped[selectedDate]
    }

    await onUpdate(habit.id, { history: updatedHistory, skipped: updatedSkipped })
  }

  const handleSaveHabitEdit = async () => {
    await onUpdate(habit.id, {
      label: editLabel,
      description: editDescription,
      color: editColor,
      lengthId: selectedLengthId || null,
    })
    setIsEditingHabit(false)
  }

  const handleDeleteHabit = async () => {
    if (!onDelete) return

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${habit.label}"? This action cannot be undone.`
    )

    if (confirmDelete) {
      await onDelete(habit.id)
      onClose()
    }
  }

  const generateMultiMonthDates = () => {
    const today = new Date()
    const dates = []

    // Generate dates from 120 days ago through end of current month + next month
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 120)

    // Get end of next month
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)

    // Generate all dates in range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const year = d.getFullYear()
      const month = d.getMonth()
      const day = d.getDate()
      const monthStr = String(month + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      dates.push(`${year}-${monthStr}-${dayStr}`)
    }

    return dates
  }

  const allDates = generateMultiMonthDates()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && onPrevious) {
        onPrevious()
      } else if (e.key === "ArrowRight" && onNext) {
        onNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onPrevious, onNext, onClose])

  // Auto-scroll to show last 30 days when calendar tab becomes active
  useEffect(() => {
    if (activeTab === "calendar" && calendarScrollRef.current) {
      // Scroll to show approximately the last 30 days
      // Each week is roughly 1 row, so ~4 weeks
      // Assuming each tile is about 60px (including gap), 4 rows = ~240px from bottom
      setTimeout(() => {
        if (calendarScrollRef.current) {
          const scrollHeight = calendarScrollRef.current.scrollHeight
          const clientHeight = calendarScrollRef.current.clientHeight
          // Scroll to position that shows last ~4 weeks (30 days)
          calendarScrollRef.current.scrollTop = scrollHeight - clientHeight - 240
        }
      }, 100)
    }
  }, [activeTab])

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm overflow-hidden">
      {onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-[10001] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-[10001] p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </button>
      )}

      <div className="h-full w-full sm:h-auto sm:w-auto sm:absolute sm:inset-4 sm:m-auto sm:max-w-6xl sm:max-h-[calc(100vh-2rem)] flex items-center justify-center">
        <div className="w-full h-full bg-gray-900/95 backdrop-blur-xl sm:rounded-3xl flex flex-col overflow-hidden" style={{ maxHeight: "100%" }}>
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={isEditingHabit ? () => setIsEditingHabit(false) : onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cream-25" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-1 h-8 sm:h-12 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-cream-25 truncate">
                    {isEditingHabit ? "Edit Habit" : habit.label}
                  </h2>
                  <p className="text-xs sm:text-sm text-cream-25/60 truncate">{habit.habitGroup}</p>
                </div>
              </div>
            </div>

            {!isEditingHabit && (
              <button
                onClick={() => setIsEditingHabit(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-cream-25" />
              </button>
            )}
          </div>

          {!isEditingHabit && (
            <div className="flex-shrink-0 flex gap-1 px-4 sm:px-6 py-2 sm:py-3 border-b border-white/10">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "overview" ? "bg-white/15 text-cream-25" : "text-cream-25/60 hover:bg-white/5"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "calendar" ? "bg-white/15 text-cream-25" : "text-cream-25/60 hover:bg-white/5"
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab("journal")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "journal" ? "bg-white/15 text-cream-25" : "text-cream-25/60 hover:bg-white/5"
                }`}
              >
                Journal
              </button>
            </div>
          )}

          {/* Instagram-Story-Style Habit Navigation Tracker */}
          {!isEditingHabit && (
            <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-white/5">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {allHabits.map((h, index) => {
                  const isActive = h.id === habit.id
                  const habitStreak = calculateCurrentStreak(h.history || [], h.skipped)
                  const habitTotal = h.history?.length || 0

                  return (
                    <button
                      key={h.id}
                      onClick={() => {
                        // Find the index and navigate
                        const currentIndex = allHabits.findIndex(hab => hab.id === habit.id)
                        const targetIndex = index
                        const diff = targetIndex - currentIndex

                        if (diff > 0) {
                          // Navigate forward
                          for (let i = 0; i < diff; i++) {
                            onNext?.()
                          }
                        } else if (diff < 0) {
                          // Navigate backward
                          for (let i = 0; i < Math.abs(diff); i++) {
                            onPrevious?.()
                          }
                        }
                      }}
                      className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all duration-300 ${
                        isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* Circular Avatar with Ring */}
                      <div className="relative">
                        {/* Progress Ring */}
                        <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="3"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={h.color}
                            strokeWidth={isActive ? "4" : "3"}
                            strokeLinecap="round"
                            strokeDasharray={`${(habitTotal > 0 ? Math.min(habitStreak / 30, 1) : 0) * 283} 283`}
                            className="transition-all duration-500"
                            style={{
                              filter: isActive ? `drop-shadow(0 0 4px ${h.color})` : 'none'
                            }}
                          />
                        </svg>

                        {/* Inner Circle with Color */}
                        <div
                          className={`absolute inset-0 m-2 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300`}
                          style={{
                            backgroundColor: h.color,
                            opacity: isActive ? 1 : 0.8,
                            boxShadow: isActive ? `0 4px 12px ${h.color}60` : 'none'
                          }}
                        >
                          {habitStreak > 0 ? habitStreak : h.label.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Habit Name */}
                      <span className={`text-[10px] sm:text-xs font-medium transition-colors max-w-[60px] truncate ${
                        isActive ? 'text-cream-25' : 'text-cream-25/60'
                      }`}>
                        {h.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-4 sm:py-6" style={{ flex: "1 1 0%" }}>
            {isEditingHabit ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Habit Name</label>
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 placeholder:text-cream-25/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Enter habit name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Description</label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="min-h-[100px] bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 resize-none"
                    placeholder="Enter habit description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Color</label>
                  <div className="grid grid-cols-8 gap-2">
                    {Object.keys(colorPairs).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-10 h-10 rounded-lg transition-all ${
                          editColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Scheduled Time</label>
                  <input
                    type="time"
                    value={habit.time || "08:00"}
                    onChange={(e) => onUpdate(habit.id, { time: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/20 transition-colors font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Group</label>
                  <input
                    type="text"
                    value={habit.habitGroup || ""}
                    onChange={(e) => onUpdate(habit.id, { habitGroup: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 placeholder:text-cream-25/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="e.g., Morning, Evening, Health"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Frequency</label>
                  <input
                    type="text"
                    value={habit.frequency || ""}
                    onChange={(e) => onUpdate(habit.id, { frequency: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 placeholder:text-cream-25/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="e.g., Daily, Weekly, Custom"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 placeholder:text-cream-25/40 focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                {/* Hierarchical Structure */}
                <div className="pt-2 space-y-3">
                  <h3 className="text-sm font-semibold text-cream-25 uppercase tracking-wide">Hierarchy</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-cream-25/70">Range</label>
                      <select
                        value={selectedRangeId}
                        onChange={(e) => {
                          setSelectedRangeId(e.target.value)
                          setSelectedMountainId("")
                          setSelectedHillId("")
                          setSelectedTerrainId("")
                          setSelectedLengthId("")
                        }}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="" className="bg-gray-900">Select Range</option>
                        {ranges.map(range => (
                          <option key={range.id} value={range.id} className="bg-gray-900">
                            {range.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-cream-25/70">Mountain</label>
                      <select
                        value={selectedMountainId}
                        onChange={(e) => {
                          setSelectedMountainId(e.target.value)
                          setSelectedHillId("")
                          setSelectedTerrainId("")
                          setSelectedLengthId("")
                        }}
                        disabled={!selectedRangeId}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-cream-25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="" className="bg-gray-900">Select Mountain</option>
                        {availableMountains.map(mountain => (
                          <option key={mountain.id} value={mountain.id} className="bg-gray-900">
                            {mountain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-cream-25/70">Hill</label>
                      <select
                        value={selectedHillId}
                        onChange={(e) => {
                          setSelectedHillId(e.target.value)
                          setSelectedTerrainId("")
                          setSelectedLengthId("")
                        }}
                        disabled={!selectedMountainId}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-cream-25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="" className="bg-gray-900">Select Hill</option>
                        {availableHills.map(hill => (
                          <option key={hill.id} value={hill.id} className="bg-gray-900">
                            {hill.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-cream-25/70">Terrain</label>
                      <select
                        value={selectedTerrainId}
                        onChange={(e) => {
                          setSelectedTerrainId(e.target.value)
                          setSelectedLengthId("")
                        }}
                        disabled={!selectedHillId}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-cream-25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="" className="bg-gray-900">Select Terrain</option>
                        {availableTerrains.map(terrain => (
                          <option key={terrain.id} value={terrain.id} className="bg-gray-900">
                            {terrain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-xs font-medium text-cream-25/70">Length</label>
                      <select
                        value={selectedLengthId}
                        onChange={(e) => setSelectedLengthId(e.target.value)}
                        disabled={!selectedTerrainId}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-cream-25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-white/20 transition-colors"
                      >
                        <option value="" className="bg-gray-900">Select Length</option>
                        {availableLengths.map(length => (
                          <option key={length.id} value={length.id} className="bg-gray-900">
                            {length.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleSaveHabitEdit}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl"
                    style={{ backgroundColor: "#FF4040", color: "white" }}
                  >
                    Save Changes
                  </Button>

                  {onDelete && (
                    <Button
                      onClick={handleDeleteHabit}
                      className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl border-2 hover:bg-red-500/10 transition-all"
                      style={{
                        backgroundColor: "transparent",
                        color: "#DC2626",
                        borderColor: "#DC2626"
                      }}
                    >
                      Delete Habit
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* Current Streak */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">Current Streak</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">{currentStreak}</div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">days in a row</div>
                      </div>

                      {/* Longest Streak */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">Longest Streak</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">{longestStreak}</div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">days total</div>
                      </div>

                      {/* Total Completions */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">Total</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">{totalCount}</div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">completions</div>
                      </div>

                      {/* This Week */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">This Week</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">
                          {(() => {
                            const today = new Date()
                            const startOfWeek = new Date(today)
                            startOfWeek.setDate(today.getDate() - today.getDay() + 1) // Monday
                            const weekDays = Array.from({ length: 7 }, (_, i) => {
                              const date = new Date(startOfWeek)
                              date.setDate(startOfWeek.getDate() + i)
                              return date.toISOString().split("T")[0]
                            })
                            return weekDays.filter(d => habit.history?.includes(d) && new Date(d) <= today).length
                          })()}
                        </div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">of 7 days</div>
                      </div>

                      {/* This Month */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">This Month</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">
                          {(() => {
                            const today = new Date()
                            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
                            const monthDates = []
                            for (let d = new Date(monthStart); d <= today; d.setDate(d.getDate() + 1)) {
                              monthDates.push(new Date(d).toISOString().split("T")[0])
                            }
                            return monthDates.filter(d => habit.history?.includes(d)).length
                          })()}
                        </div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">
                          of {new Date().getDate()} days
                        </div>
                      </div>

                      {/* Completion Rate */}
                      <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10">
                        <div className="text-xs sm:text-sm text-cream-25/60 uppercase tracking-wide mb-1 sm:mb-2">Success Rate</div>
                        <div className="text-2xl sm:text-4xl font-bold text-cream-25">
                          {(() => {
                            const today = new Date()
                            const last30Days = Array.from({ length: 30 }, (_, i) => {
                              const date = new Date()
                              date.setDate(today.getDate() - i)
                              return date.toISOString().split("T")[0]
                            })
                            const completed = last30Days.filter(d => habit.history?.includes(d)).length
                            return Math.round((completed / 30) * 100)
                          })()}%
                        </div>
                        <div className="text-[10px] sm:text-xs text-cream-25/50 mt-0.5 sm:mt-1">last 30 days</div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="text-base sm:text-lg font-semibold text-cream-25">Recent Activity</h3>
                      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                        {Array.from({ length: 30 }, (_, i) => {
                          const date = new Date()
                          date.setDate(date.getDate() - (29 - i))
                          const dateStr = date.toISOString().split("T")[0]
                          const colorData = getColorWithSaturation(habit.color, habit, dateStr)
                          const isCompleted = habit.history?.includes(dateStr)
                          const isSkipped = habit.skipped?.[dateStr]

                          return (
                            <div key={dateStr} className="flex flex-col items-center gap-1 flex-shrink-0">
                              <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: colorData.backgroundColor }}
                              >
                                {isSkipped && (
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundImage: `linear-gradient(
                                        to top right,
                                        ${colorData.gradientColor} 0%,
                                        ${colorData.gradientColor} 50%,
                                        transparent 50%,
                                        transparent 100%
                                      )`,
                                    }}
                                  />
                                )}
                                {isCompleted && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full relative z-10" />}
                              </div>
                              <div className="text-[9px] sm:text-[10px] text-cream-25/50">{date.getDate()}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {habit.description && (
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold text-cream-25">Description</h3>
                        <p className="text-sm sm:text-base text-cream-25/80">{habit.description}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "calendar" && (
                  <div className="h-full flex flex-col overflow-hidden">
                    {/* Day headers - sticky */}
                    <div className="grid grid-cols-7 gap-2 pb-3 border-b border-white/5 flex-shrink-0">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <div key={i} className="text-center text-[10px] sm:text-xs text-cream-25/50 font-medium tracking-wider">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Scrollable calendar grid */}
                    <div ref={calendarScrollRef} className="flex-1 overflow-y-auto mt-3">
                      <div className="grid grid-cols-7 gap-2">
                        {allDates.map((dateStr, index) => {
                          const [year, month, day] = dateStr.split('-').map(Number)
                          const date = new Date(year, month - 1, day)
                          const isCompleted = habit.history?.includes(dateStr)
                          const isSkipped = habit.skipped?.[dateStr]
                          const colorData = getColorWithSaturation(habit.color, habit, dateStr)
                          const isToday = dateStr === new Date().toISOString().split("T")[0]
                          const isFuture = new Date(dateStr) > new Date(new Date().toISOString().split("T")[0])
                          const isFirstOfMonth = day === 1

                          // Add month label on 1st of month OR first date in the array
                          if (isFirstOfMonth || index === 0) {
                            const monthLabel = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase() + " " + day
                            const dayOfWeek = (date.getDay() + 6) % 7 // Monday = 0, Sunday = 6

                            return (
                              <React.Fragment key={dateStr}>
                                {/* Only add empty cells for the very first date in array */}
                                {index === 0 && Array.from({ length: dayOfWeek }).map((_, i) => (
                                  <div key={`empty-before-${dateStr}-${i}`} className="aspect-square" />
                                ))}

                                <button
                                  type="button"
                                  disabled={isFuture}
                                  onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (isFuture) return

                                    const updatedHistory = [...(habit.history || [])]
                                    const updatedSkipped = { ...(habit.skipped || {}) }

                                    if (isCompleted) {
                                      const idx = updatedHistory.indexOf(dateStr)
                                      updatedHistory.splice(idx, 1)
                                      updatedSkipped[dateStr] = true
                                    } else if (isSkipped) {
                                      delete updatedSkipped[dateStr]
                                    } else {
                                      updatedHistory.push(dateStr)
                                      delete updatedSkipped[dateStr]
                                    }

                                    await onUpdate(habit.id, { history: updatedHistory, skipped: updatedSkipped })
                                  }}
                                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 overflow-hidden ${
                                    isFuture ? 'opacity-30 cursor-not-allowed' : isCompleted || isSkipped ? 'hover:opacity-90' : 'hover:bg-white/5'
                                  }`}
                                  style={{ backgroundColor: colorData.backgroundColor }}
                                >
                                  {/* Diagonal fill for skipped */}
                                  {isSkipped && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundImage: `linear-gradient(
                                          to top right,
                                          ${habit.color} 0%,
                                          ${habit.color} 50%,
                                          transparent 50%,
                                          transparent 100%
                                        )`,
                                      }}
                                    />
                                  )}
                                  <span className={`text-xs font-normal relative z-10 ${
                                    isToday
                                      ? 'font-bold text-white'
                                      : isCompleted || isSkipped
                                        ? 'text-white/95'
                                        : 'text-cream-25/40'
                                  }`}>
                                    {monthLabel}
                                  </span>
                                </button>
                              </React.Fragment>
                            )
                          }

                          // Regular date (not 1st of month)
                          return (
                            <button
                              key={dateStr}
                              type="button"
                              disabled={isFuture}
                              onClick={async (e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (isFuture) return

                                const updatedHistory = [...(habit.history || [])]
                                const updatedSkipped = { ...(habit.skipped || {}) }

                                if (isCompleted) {
                                  const idx = updatedHistory.indexOf(dateStr)
                                  updatedHistory.splice(idx, 1)
                                  updatedSkipped[dateStr] = true
                                } else if (isSkipped) {
                                  delete updatedSkipped[dateStr]
                                } else {
                                  updatedHistory.push(dateStr)
                                  delete updatedSkipped[dateStr]
                                }

                                await onUpdate(habit.id, { history: updatedHistory, skipped: updatedSkipped })
                              }}
                              className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200 overflow-hidden ${
                                isFuture ? 'opacity-30 cursor-not-allowed' : isCompleted || isSkipped ? 'hover:opacity-90' : 'hover:bg-white/5'
                              }`}
                              style={{ backgroundColor: colorData.backgroundColor }}
                            >
                              {/* Diagonal triangle fill for skipped */}
                              {isSkipped && (
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundImage: `linear-gradient(
                                      to top right,
                                      ${colorData.gradientColor} 0%,
                                      ${colorData.gradientColor} 50%,
                                      transparent 50%,
                                      transparent 100%
                                    )`,
                                  }}
                                />
                              )}
                              <span className={`text-sm font-normal relative z-10 ${
                                isToday
                                  ? 'font-bold text-white'
                                  : isCompleted || isSkipped
                                    ? 'text-white/95'
                                    : 'text-cream-25/40'
                              }`}>
                                {date.getDate()}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "journal" && (
                  <div className="h-full flex flex-col">
                    {isEditingJournal ? (
                      <>
                        <div className="flex items-center justify-between mb-4 flex-shrink-0">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-cream-25/60">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                          </div>
                          <button
                            onClick={() => setIsEditingJournal(false)}
                            className="text-xs text-cream-25/60 hover:text-cream-25 transition-colors"
                          >
                            Close
                          </button>
                        </div>

                        <div className="mb-4 flex-shrink-0">
                          <div className="flex items-center gap-3 sm:gap-4 mb-4">
                            {(() => {
                              const colorData = getColorWithSaturation(habit.color, habit, selectedDate)
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleToggleCompletion()
                                  }}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0 transition-all duration-200 hover:opacity-90 border border-white/10 relative overflow-hidden"
                                  style={{ backgroundColor: colorData.backgroundColor }}
                                >
                                  {/* Diagonal triangle fill for skipped */}
                                  {habit.skipped?.[selectedDate] && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundImage: `linear-gradient(
                                          to top right,
                                          ${colorData.gradientColor} 0%,
                                          ${colorData.gradientColor} 50%,
                                          transparent 50%,
                                          transparent 100%
                                        )`,
                                      }}
                                    />
                                  )}
                                </button>
                              )
                            })()}
                            <div className="flex items-baseline gap-2 flex-1">
                              <input
                                type="number"
                                value={units}
                                onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                                className="w-16 sm:w-20 bg-transparent border-b border-white/20 text-2xl sm:text-3xl font-semibold text-cream-25 focus:outline-none focus:border-white/40 transition-colors"
                              />
                              <span className="text-sm sm:text-base text-cream-25/50">units, e.g. steps</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col mb-4 min-h-0">
                          <Textarea
                            value={journalNote}
                            onChange={(e) => setJournalNote(e.target.value)}
                            placeholder="Write your thoughts, reflections, or notes about this habit..."
                            className="flex-1 bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 resize-none min-h-[200px]"
                            autoFocus
                          />
                        </div>

                        <div className="mt-auto flex-shrink-0">
                          <Button
                            onClick={handleSaveNote}
                            className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-all hover:scale-[1.02]"
                            style={{
                              backgroundColor: "#FF4040",
                              color: "white",
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto space-y-3">
                          {Array.from({ length: 30 }, (_, i) => {
                            const date = new Date()
                            date.setDate(date.getDate() - i)
                            const dateStr = date.toISOString().split("T")[0]
                            const isCompleted = habit.history?.includes(dateStr)
                            const isSkipped = habit.skipped?.[dateStr]
                            const hasNote = habit.notes?.[dateStr]
                            const dateUnits = habit.units?.[dateStr] || 0
                            const colorData = getColorWithSaturation(habit.color, habit, dateStr)

                            return (
                              <div key={dateStr} className="flex gap-3 sm:gap-4">
                                <button
                                  type="button"
                                  onClick={async (e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const updatedHistory = [...(habit.history || [])]
                                    const updatedSkipped = { ...(habit.skipped || {}) }

                                    if (isCompleted) {
                                      // Completed -> Skipped
                                      const index = updatedHistory.indexOf(dateStr)
                                      updatedHistory.splice(index, 1)
                                      updatedSkipped[dateStr] = true
                                    } else if (isSkipped) {
                                      // Skipped -> Not completed
                                      delete updatedSkipped[dateStr]
                                    } else {
                                      // Not completed -> Completed
                                      updatedHistory.push(dateStr)
                                      delete updatedSkipped[dateStr]
                                    }

                                    await onUpdate(habit.id, { history: updatedHistory, skipped: updatedSkipped })
                                  }}
                                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0 transition-all duration-200 hover:opacity-90 border border-white/10 relative overflow-hidden"
                                  style={{ backgroundColor: colorData.backgroundColor }}
                                >
                                  {/* Diagonal fill for skipped */}
                                  {isSkipped && (
                                    <div
                                      className="absolute inset-0"
                                      style={{
                                        backgroundImage: `linear-gradient(
                                          to top right,
                                          ${habit.color} 0%,
                                          ${habit.color} 50%,
                                          transparent 50%,
                                          transparent 100%
                                        )`,
                                      }}
                                    />
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedDate(dateStr)
                                    setIsEditingJournal(true)
                                  }}
                                  className="flex-1 p-4 sm:p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-all text-left"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-cream-25">
                                      {new Date(dateStr).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric"
                                      })}
                                    </span>
                                    {dateUnits > 0 && (
                                      <span className="text-xs text-cream-25/50">
                                        {dateUnits} units
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm sm:text-base text-cream-25/70">
                                    {habit.description || "Tap to add a journal entry"}
                                  </p>
                                  {hasNote && (
                                    <p className="text-xs sm:text-sm text-cream-25/50 mt-2 line-clamp-2">
                                      {hasNote}
                                    </p>
                                  )}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
