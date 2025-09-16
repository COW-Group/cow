import React, { useContext, useState, useEffect, useRef } from "react"
import { HabitsContext } from "./HabitsBoardWrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ChevronLeft, Loader2Icon, Check, X, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HabitItem {
  id: string
  label: string
  description: string
  color: string
  time: string
  frequency: string
  isBuildHabit: boolean
  history?: string[]
  notes?: { date: string; text: string }[]
  children?: HabitItem[]
  skipped?: { [date: string]: boolean }
  units?: { [date: string]: number }
  archived?: boolean
}

interface Category {
  id: string
  name: string
  habits: HabitItem[]
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
  "bg-orange-400": { light: { r: 255, g: 220, b: 120 }, dark: { r: 255, g: 69, b: 0 } },
  "bg-blue-400": { light: { r: 135, g: 206, b: 255 }, dark: { r: 0, g: 100, b: 255 } },
  "bg-red-400": { light: { r: 255, g: 160, b: 180 }, dark: { r: 220, g: 20, b: 60 } },
  "bg-green-400": { light: { r: 144, g: 255, b: 144 }, dark: { r: 50, g: 205, b: 50 } },
  "bg-purple-400": { light: { r: 221, g: 160, b: 255 }, dark: { r: 138, g: 43, b: 226 } },
  "bg-yellow-400": { light: { r: 255, g: 255, b: 150 }, dark: { r: 255, g: 215, b: 0 } },
  "bg-teal-400": { light: { r: 175, g: 255, b: 255 }, dark: { r: 0, g: 206, b: 209 } },
  "bg-gray-400": { light: { r: 220, g: 220, b: 220 }, dark: { r: 128, g: 128, b: 128 } },
}

const colorOptions = [
  { name: "Orange", value: "#FF8C00", class: "bg-[#FF8C00]" },
  { name: "Blue", value: "#00B7EB", class: "bg-[#00B7EB]" },
  { name: "Red", value: "#FF4040", class: "bg-[#FF4040]" },
  { name: "Green", value: "#00CD00", class: "bg-[#00CD00]" },
  { name: "Purple", value: "#9B30FF", class: "bg-[#9B30FF]" },
  { name: "Yellow", value: "#FFD700", class: "bg-[#FFD700]" },
  { name: "Teal", value: "#00CED1", class: "bg-[#00CED1]" },
  { name: "Gray", value: "#808080", class: "bg-[#808080]" },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const getColorWithSaturation = (habitColor: string, intensity: number, habit: HabitItem, targetDate: string) => {
  if (intensity === 0) {
    return { backgroundColor: "white" }
  }

  const colorPair = colorPairs[habitColor] || colorPairs["#808080"]
  const totalCompletions = habit.history?.filter(Boolean).length || 0
  if (totalCompletions === 0) return { backgroundColor: "white" }

  const completionDates = (habit.history || []).sort()
  const targetIndex = completionDates.indexOf(targetDate)
  if (targetIndex === -1) return { backgroundColor: "white" }

  let streakStart = targetIndex
  let streakEnd = targetIndex

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

const generateCalendarDates = () => {
  const dates = []
  const today = new Date()
  const seenDates = new Set<string>()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split("T")[0]
    if (!seenDates.has(dateStr)) {
      seenDates.add(dateStr)
      dates.push({
        date: dateStr,
        day: date.getDate(),
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        index: i,
        month: date.toLocaleDateString("en-US", { month: "short" }),
        year: date.getFullYear(),
      })
    }
  }
  console.log("[generateCalendarDates] Generated dates count:", dates.length, "Unique dates:", seenDates.size)
  return dates
}

const flattenHabits = (categories: Category[]): HabitItem[] => {
  console.log("[flattenHabits] Input categories:", categories)
  const allHabits: HabitItem[] = []
  if (!categories) return allHabits
  categories.forEach((category) => {
    console.log("[flattenHabits] Processing category:", category.name, "with habits:", category.habits)
    category.habits.forEach((habit) => {
      allHabits.push(habit)
      if (habit.children) {
        allHabits.push(...flattenHabitsInChildren(habit.children))
      }
    })
  })
  console.log("[flattenHabits] All habits:", allHabits)
  return allHabits.filter((habit) => !habit.archived)
}

const flattenHabitsInChildren = (children: HabitItem[]): HabitItem[] => {
  const allHabits: HabitItem[] = []
  children.forEach((child) => {
    allHabits.push(child)
    if (child.children) {
      allHabits.push(...flattenHabitsInChildren(child.children))
    }
  })
  return allHabits
}

const calculateCurrentStreak = (history: string[]) => {
  let streak = 0
  let currentDate = new Date()
  while (true) {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toISOString().split("T")[0]
    if (history.includes(dateStr)) {
      streak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return streak
}

const calculateLongestStreak = (history: string[]) => {
  if (history.length === 0) return 0
  const sortedHistory = history.map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime())
  let maxStreak = 1
  let currentStreak = 1
  for (let i = 1; i < sortedHistory.length; i++) {
    const prevDate = new Date(sortedHistory[i - 1])
    const currentDate = new Date(sortedHistory[i])
    const diffTime = currentDate.getTime() - prevDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else if (diffDays > 1) {
      currentStreak = 1
    }
  }
  return maxStreak
}

const calculateCompletionRate = (history: string[], period: "week" | "month" | "year") => {
  const now = new Date()
  const startDate = new Date()
  switch (period) {
    case "week":
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate.setDate(now.getDate() - 30)
      break
    case "year":
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }
  const relevantDates = []
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0]
    relevantDates.push(dateStr)
  }
  const completedDates = history.filter((date) => relevantDates.includes(date))
  return relevantDates.length > 0 ? Math.round((completedDates.length / relevantDates.length) * 100) : 0
}

const calculateStreakIntensity = (history: string[], targetDate: string) => {
  if (!history.includes(targetDate)) return 0
  const completionDates = history.sort()
  const targetIndex = completionDates.indexOf(targetDate)
  if (targetIndex === -1) return 0
  let streak = 1
  for (let i = targetIndex - 1; i >= 0; i--) {
    const prevDate = new Date(completionDates[i])
    const currentDate = new Date(completionDates[i + 1])
    const dayDiff = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    if (dayDiff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

const HabitDetailOverlay = ({ habit, onClose }: { habit: HabitItem; onClose: () => void }) => {
  const [overlayTab, setOverlayTab] = useState<"Overview" | "Calendar" | "Journal">("Overview")
  const [isOpen, setIsOpen] = useState(false)
  const { updateHabit } = useContext(HabitsContext)
  const { toast } = useToast()
  const [showEditOverlay, setShowEditOverlay] = useState(false)
  const [journalEditDate, setJournalEditDate] = useState<string | null>(null)
  const [journalUnits, setJournalUnits] = useState(0)
  const [journalNote, setJournalNote] = useState("")
  const [journalCompleted, setJournalCompleted] = useState(false)

  useEffect(() => {
    console.log("[HabitDetailOverlay] Opening overlay for habit:", habit.label)
    setIsOpen(true)
    return () => {
      console.log("[HabitDetailOverlay] Cleaning up overlay for habit:", habit.label)
    }
  }, [habit.label])

  useEffect(() => {
    if (journalEditDate) {
      const units = habit.units?.[journalEditDate] || 0
      const note = habit.notes?.find((n) => n.date === journalEditDate)?.text || ""
      const completed = habit.history?.includes(journalEditDate) || false
      setJournalUnits(units)
      setJournalNote(note)
      setJournalCompleted(completed)
    }
  }, [journalEditDate, habit])

  const handleClose = () => {
    console.log("[HabitDetailOverlay] Closing overlay")
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  const generateHabitGrid = () => {
    const grid = []
    const today = new Date()
    // First row: 28 most recent days
    const recentDays = []
    for (let i = 0; i < 28; i++) {
      const current = new Date(today)
      current.setDate(today.getDate() - i)
      const dateStr = current.toISOString().split("T")[0]
      const completed = habit.history?.includes(dateStr) || false
      const skipped = habit.skipped?.[dateStr] || false
      const streakIntensity = completed ? calculateStreakIntensity(habit.history || [], dateStr) : 0
      recentDays.push({ date: dateStr, completed, skipped, streakIntensity })
    }
    grid.push(recentDays)
    // Remaining 49 weeks (343 days) in 7-day rows
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 28 - 343) // Start 371 days ago to cover 28 + 343
    for (let week = 0; week < 49; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        const current = new Date(startDate)
        current.setDate(startDate.getDate() + week * 7 + day)
        const dateStr = current.toISOString().split("T")[0]
        const completed = habit.history?.includes(dateStr) || false
        const skipped = habit.skipped?.[dateStr] || false
        const streakIntensity = completed ? calculateStreakIntensity(habit.history || [], dateStr) : 0
        weekDays.push({ date: dateStr, completed, skipped, streakIntensity })
      }
      grid.push(weekDays)
    }
    console.log("[generateHabitGrid] Generated grid structure:", JSON.stringify({
      totalRows: grid.length,
      firstRowColumns: grid[0]?.length || 0,
      otherRowColumns: grid[1]?.length || 0,
      sampleFirstRow: grid[0]?.map((day) => ({ date: day.date, completed: day.completed })) || [],
      sampleSecondRow: grid[1]?.map((day) => ({ date: day.date, completed: day.completed })) || []
    }, null, 2))
    return grid
  }

  const generateCalendarView = () => {
    const today = new Date()
    const months = []
    for (let monthOffset = 0; monthOffset >= -6; monthOffset--) {
      const month = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
      const monthData = {
        name: month.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        shortName: month.toLocaleDateString("en-US", { month: "short" }),
        weeks: [],
      }
      const startDate = new Date(month)
      const dayOfWeek = (startDate.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
      startDate.setDate(startDate.getDate() - dayOfWeek)
      for (let week = 0; week < 6; week++) {
        const weekDays = []
        for (let day = 0; day < 7; day++) {
          const current = new Date(startDate)
          current.setDate(startDate.getDate() + week * 7 + day)
          const dateStr = current.toISOString().split("T")[0]
          const isCurrentMonth = current.getMonth() === month.getMonth()
          const isToday = current.toDateString() === today.toDateString()
          const isPast = current < today && !isToday
          const completed = habit.history?.includes(dateStr) || false
          const skipped = habit.skipped?.[dateStr] || false
          const units = habit.units?.[dateStr] || 0
          const streakIntensity = completed ? calculateStreakIntensity(habit.history || [], dateStr) : 0
          weekDays.push({
            date: current.getDate(),
            dateStr,
            isCurrentMonth,
            isToday,
            isPast,
            completed,
            skipped,
            units,
            streakIntensity,
          })
        }
        monthData.weeks.push(weekDays)
      }
      months.push(monthData)
    }
    return months.reverse() // Current month at top
  }

  const generateJournalEntries = () => {
    const entries = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const completed = habit.history?.includes(dateStr) || false
      const skipped = habit.skipped?.[dateStr] || false
      const units = habit.units?.[dateStr] || 0
      const streakIntensity = completed ? calculateStreakIntensity(habit.history || [], dateStr) : 0
      entries.push({
        label: date.getDate().toString(),
        completed,
        skipped,
        units,
        dateStr,
        date,
        streakIntensity,
      })
    }
    return entries
  }

  const handleMarkComplete = async (habitId: string, date: string) => {
    const isCompleted = habit.history?.includes(date) || false
    const isSkipped = habit.skipped?.[date] || false
    let updatedHistory = [...(habit.history || [])]
    let updatedSkipped = { ...(habit.skipped || {}) }
    if (!isCompleted && !isSkipped) {
      updatedHistory = [...updatedHistory, date]
      delete updatedSkipped[date]
    } else if (isCompleted && !isSkipped) {
      updatedHistory = updatedHistory.filter((d) => d !== date)
      updatedSkipped[date] = true
    } else {
      updatedHistory = updatedHistory.filter((d) => d !== date)
      delete updatedSkipped[date]
    }
    try {
      await updateHabit(habitId, { history: updatedHistory, skipped: updatedSkipped })
      if (journalEditDate === date) {
        setJournalCompleted(!isCompleted && !isSkipped)
      }
      toast({ title: "Habit Marked", description: `Habit marked for ${date}.` })
    } catch (err) {
      console.error("[HabitDetailOverlay] Error marking habit:", err)
      toast({ title: "Error", description: "Failed to mark habit.", variant: "destructive" })
    }
  }

  const handleSaveJournalEdit = async (dateStr: string) => {
    try {
      const updatedUnits = { ...(habit.units || {}), [dateStr]: journalUnits }
      const existingNotes = (habit.notes || []).filter((n) => n.date !== dateStr)
      const updatedNotes = journalNote ? [...existingNotes, { date: dateStr, text: journalNote }] : existingNotes
      await updateHabit(habit.id, { units: updatedUnits, notes: updatedNotes })
      setJournalEditDate(null)
      toast({ title: "Journal Updated", description: `Journal entry for ${dateStr} saved.` })
    } catch (err) {
      console.error("[HabitDetailOverlay] Error saving journal:", err)
      toast({ title: "Error", description: "Failed to save journal entry.", variant: "destructive" })
    }
  }

  const habitGrid = generateHabitGrid()
  const calendarMonths = generateCalendarView()
  const journalEntries = generateJournalEntries()
  const currentStreak = calculateCurrentStreak(habit.history || [])
  const longestStreak = calculateLongestStreak(habit.history || [])
  const totalCount = habit.history?.length || 0
  const yearRate = calculateCompletionRate(habit.history || [], "year")
  const currentWeekday = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // Adjust for Monday start

  return (
    <div
      className="fixed inset-0 bg-white z-50 animate-in slide-in-from-right duration-300"
      style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button variant="ghost" onClick={handleClose} className="text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(["Overview", "Calendar", "Journal"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setOverlayTab(tab)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                overlayTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <Button variant="ghost" className="text-yellow-600" onClick={() => setShowEditOverlay(true)}>
          <Edit2 className="w-5 h-5" />
        </Button>
      </div>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{habit.label}</h1>
        </div>
        {habit.description && <p className="text-gray-600">{habit.description}</p>}
      </div>
      <div className="p-6 min-h-full">
        {overlayTab === "Overview" && (
          <div className="space-y-8">
            <div
              className="flex justify-center"
              ref={(el) => {
                if (el) {
                  const styles = window.getComputedStyle(el);
                  console.log("[HabitDetailOverlay] Container computed styles:", {
                    width: styles.width,
                    maxWidth: styles.maxWidth,
                    display: styles.display,
                    parentWidth: el.parentElement ? window.getComputedStyle(el.parentElement).width : "N/A",
                    parentDisplay: el.parentElement ? window.getComputedStyle(el.parentElement).display : "N/A"
                  });
                }
              }}
            >
              <div
                className="grid grid-cols-[repeat(28,16px)] gap-1 auto-rows-[16px] debug-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(28, 16px)', minWidth: '448px' }}
                ref={(el) => {
                  if (el) {
                    const styles = window.getComputedStyle(el);
                    console.log("[HabitDetailOverlay] Grid computed styles:", {
                      display: styles.display,
                      gridTemplateColumns: styles.gridTemplateColumns,
                      width: styles.width,
                      maxWidth: styles.maxWidth,
                      childCount: el.children.length
                    });
                  }
                }}
              >
                {habitGrid.map((week, weekIndex) =>
                  Array.from({ length: 28 }).map((_, dayIndex) => {
                    const day = week[dayIndex];
                    const colorStyle = day && day.completed
                      ? getColorWithSaturation(habit.color, day.streakIntensity, habit, day.date)
                      : null;
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-4 h-4 ${!day || !day.completed ? "bg-gray-100" : ""} border border-gray-300 debug-cell`}
                        style={colorStyle || {}}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-600">{currentStreak}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Current Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">{longestStreak}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Longest Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Total Count</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">{yearRate}%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Completion Rate</div>
              </div>
            </div>
          </div>
        )}
        {overlayTab === "Calendar" && (
          <div className="space-y-0 max-h-[calc(100vh-300px)] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pb-2">
              <div className="grid grid-cols-7 gap-0 text-center text-sm font-medium text-gray-600">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div key={`weekday-${index}`} className="py-2">
                    {index === currentWeekday ? (
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto">
                        {day}
                      </div>
                    ) : (
                      day
                    )}
                  </div>
                ))}
              </div>
            </div>
            {calendarMonths.map((monthData, monthIndex) => (
              <div key={monthIndex} className="space-y-0">
                <div className="grid grid-cols-7 gap-0">
                  {monthData.weeks.map((week, weekIndex) =>
                    week.map((day, dayIndex) => {
                      const colorStyle = day.completed
                        ? getColorWithSaturation(habit.color, day.streakIntensity, habit, day.dateStr)
                        : day.skipped
                        ? { backgroundColor: "#f3f4f6" }
                        : null
                      return (
                        <div
                          key={`${monthIndex}-${weekIndex}-${dayIndex}`}
                          onClick={() => handleMarkComplete(habit.id, day.dateStr)}
                          className={`h-16 w-full flex flex-col items-center justify-center text-sm cursor-pointer hover:opacity-80 transition-opacity relative ${
                            day.isToday
                              ? "bg-orange-500 text-white font-bold"
                              : day.isCurrentMonth
                              ? day.isPast
                                ? "text-red-500"
                                : "text-black"
                              : "text-gray-400"
                          } ${!day.completed && !day.skipped && !day.isToday ? "bg-white hover:bg-gray-50" : ""}`}
                          style={{
                            ...(day.completed || day.skipped ? colorStyle : {}),
                            minHeight: "64px",
                            aspectRatio: "1.2/1",
                          }}
                        >
                          {day.skipped && !day.completed && !day.isToday && (
                            <div className="absolute inset-0">
                              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <polygon
                                  points="0,0 100,0 0,100"
                                  fill={colorStyle ? (colorStyle as any).backgroundColor : "#f59e0b"}
                                  opacity="0.9"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="relative z-10 font-medium">{day.date}</span>
                          {day.units > 0 && (
                            <span className="relative z-10 text-xs font-bold mt-0.5 bg-black bg-opacity-30 text-white px-1.5 py-0.5 rounded">
                              {day.units}
                            </span>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
                {monthIndex < calendarMonths.length - 1 &&
                  monthData.weeks.some((week) => week.some((day) => day.date === 1 && day.isCurrentMonth)) && (
                    <div className="text-center text-xs text-gray-500 py-1 bg-gray-50">{monthData.shortName}</div>
                  )}
              </div>
            ))}
          </div>
        )}
        {overlayTab === "Journal" && (
          <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {journalEntries.map((entry, index) => {
              const colorStyle = entry.completed
                ? getColorWithSaturation(habit.color, entry.streakIntensity, habit, entry.dateStr)
                : entry.skipped
                ? { backgroundColor: "#f3f4f6" }
                : { backgroundColor: "#e5e7eb" }
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setJournalEditDate(entry.dateStr)}
                >
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center relative shadow-md"
                    style={colorStyle}
                  >
                    {entry.skipped && !entry.completed && (
                      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon
                          points="0,0 100,0 0,100"
                          fill={(colorStyle as any).backgroundColor || "#f59e0b"}
                          opacity="0.7"
                        />
                      </svg>
                    )}
                    <span
                      className={`text-xl font-bold relative z-10 ${entry.completed || entry.skipped ? "text-white" : "text-gray-600"}`}
                    >
                      {entry.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span className="font-medium">
                        {entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {entry.units > 0 && <span className="text-orange-500 font-semibold">{entry.units} units</span>}
                    </div>
                    {habit.notes?.find((n) => n.date === entry.dateStr)?.text && (
                      <div className="text-sm text-gray-800 truncate">
                        {habit.notes.find((n) => n.date === entry.dateStr)?.text}
                      </div>
                    )}
                    {!habit.notes?.find((n) => n.date === entry.dateStr)?.text && (
                      <div className="text-xs text-gray-400 italic">No note</div>
                    )}
                  </div>
                </div>
              )
            })}
            {journalEditDate && (
              <div className="fixed inset-x-0 bottom-0 bg-white z-60 p-6 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Edit Journal for {journalEditDate}</h2>
                  <Button variant="ghost" onClick={() => setJournalEditDate(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Units</label>
                    <input
                      type="number"
                      value={journalUnits}
                      onChange={(e) => setJournalUnits(Number(e.target.value))}
                      className="w-full text-lg border-none outline-none border-b border-gray-300 focus:border-gray-500 pb-2 bg-transparent"
                      placeholder="e.g., steps"
                    />
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{
                          backgroundColor: journalCompleted || habit.skipped?.[journalEditDate]
                            ? getColorWithSaturation(habit.color, calculateStreakIntensity(habit.history || [], journalEditDate), habit, journalEditDate).backgroundColor
                            : "#d1d5db",
                          width: journalCompleted || habit.skipped?.[journalEditDate]
                            ? `${Math.min(100, (journalUnits / 100) * 100 + 20)}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Note</label>
                    <textarea
                      value={journalNote}
                      onChange={(e) => setJournalNote(e.target.value)}
                      className="w-full text-lg border-none outline-none border-b border-gray-300 focus:border-gray-500 pb-2 bg-transparent resize-none"
                      placeholder="Add Note"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleMarkComplete(habit.id, journalEditDate)}
                      className={`flex-1 ${journalCompleted ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    >
                      {journalCompleted ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                    <Button
                      onClick={() => handleSaveJournalEdit(journalEditDate)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {showEditOverlay && <HabitEditOverlay habit={habit} onClose={() => setShowEditOverlay(false)} />}
      </div>
    </div>
  )
}

const HabitEditOverlay = ({ habit, onClose }: { habit: HabitItem; onClose: () => void }) => {
  const { updateHabit, deleteHabit, refreshHabits } = useContext(HabitsContext)
  const { toast } = useToast()
  const [editingHabitData, setEditingHabitData] = useState<HabitItem>({
    ...habit,
    time: habit.time.includes("min") ? "00:00" : habit.time, // Fix incorrect duration
  })
  const [selectedDays, setSelectedDays] = useState<string[]>(
    editingHabitData.frequency === "Everyday" ? daysOfWeek : editingHabitData.frequency.split(",").filter(Boolean)
  )
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedHour, setSelectedHour] = useState(editingHabitData.time.split(":")[0] || "00")
  const [selectedMinute, setSelectedMinute] = useState(editingHabitData.time.split(":")[1] || "00")

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const toggleEveryday = () => {
    setSelectedDays((prev) => (prev.length === 7 ? [] : [...daysOfWeek]))
  }

  const saveHabitChanges = async () => {
    const frequency = selectedDays.length === 7 ? "Everyday" : selectedDays.join(",")
    const time = `${selectedHour.padStart(2, "0")}:${selectedMinute.padStart(2, "0")}`
    try {
      await updateHabit(editingHabitData.id, {
        label: editingHabitData.label,
        description: editingHabitData.description,
        color: editingHabitData.color,
        time,
        frequency,
        isBuildHabit: editingHabitData.isBuildHabit,
        archived: editingHabitData.archived,
      })
      await refreshHabits()
      toast({ title: "Habit Updated", description: `"${editingHabitData.label}" was successfully updated.` })
      onClose()
    } catch (err) {
      console.error("[HabitEditOverlay] Error updating habit:", err)
      toast({ title: "Error", description: "Failed to update habit.", variant: "destructive" })
    }
  }

  const handleDeleteHabit = async () => {
    try {
      await deleteHabit(habit.id)
      await refreshHabits()
      toast({ title: "Habit Deleted", description: `"${habit.label}" was successfully deleted.` })
      onClose()
    } catch (err) {
      console.error("[HabitEditOverlay] Error deleting habit:", err)
      toast({ title: "Error", description: "Failed to delete habit.", variant: "destructive" })
    }
  }

  const resetHabit = async () => {
    try {
      await updateHabit(habit.id, { history: [], notes: [], skipped: {}, units: {} })
      setEditingHabitData({ ...editingHabitData, history: [], notes: [], skipped: {}, units: {} })
      await refreshHabits()
      toast({ title: "Habit Reset", description: `"${habit.label}" history and notes were reset.` })
    } catch (err) {
      console.error("[HabitEditOverlay] Error resetting habit:", err)
      toast({ title: "Error", description: "Failed to reset habit.", variant: "destructive" })
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button variant="ghost" onClick={onClose} className="text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Edit Habit</h1>
        <Button variant="ghost" onClick={saveHabitChanges} className="text-green-600 font-semibold">
          Save
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Habit</label>
          <input
            type="text"
            value={editingHabitData.label}
            onChange={(e) => setEditingHabitData({ ...editingHabitData, label: e.target.value })}
            className="w-full text-lg font-medium border-none outline-none border-b border-gray-300 focus:border-gray-500 pb-2 bg-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</label>
          <textarea
            value={editingHabitData.description || ""}
            onChange={(e) => setEditingHabitData({ ...editingHabitData, description: e.target.value })}
            className="w-full text-base border-none outline-none border-b border-gray-300 focus:border-gray-500 pb-2 bg-transparent resize-none"
            rows={3}
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pick a color</label>
          <div className="flex gap-4 flex-wrap">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => setEditingHabitData({ ...editingHabitData, color: color.value })}
                className={`w-12 h-12 rounded-lg ${color.class} flex items-center justify-center hover:scale-105 transition-transform`}
              >
                {editingHabitData.color === color.value && <Check className="w-6 h-6 text-white" />}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Scheduled Time</label>
          <div
            className="text-lg font-medium text-gray-900 cursor-pointer"
            onClick={() => setShowTimePicker(true)}
          >
            {`${selectedHour.padStart(2, "0")}:${selectedMinute.padStart(2, "0")}`}
          </div>
          {showTimePicker && (
            <div className="fixed inset-x-0 bottom-0 bg-white z-60 p-6 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex gap-4 mb-4">
                <Select value={selectedHour} onValueChange={setSelectedHour}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowTimePicker(false)}
                  className="flex-1 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowTimePicker(false)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Frequency</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDays.length === 7 ? "default" : "outline"}
              onClick={toggleEveryday}
              className="text-sm"
            >
              Everyday
            </Button>
            {daysOfWeek.map((day) => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? "default" : "outline"}
                onClick={() => toggleDay(day)}
                className="text-sm"
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Build Habit</label>
          <button
            onClick={() => setEditingHabitData({ ...editingHabitData, isBuildHabit: !editingHabitData.isBuildHabit })}
            className={`w-12 h-6 rounded-full transition-colors ${editingHabitData.isBuildHabit ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${editingHabitData.isBuildHabit ? "translate-x-6" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Archive</label>
          <button
            onClick={() => setEditingHabitData({ ...editingHabitData, archived: !editingHabitData.archived })}
            className={`w-12 h-6 rounded-full transition-colors ${editingHabitData.archived ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${editingHabitData.archived ? "translate-x-6" : "translate-x-0.5"}`}
            />
          </button>
        </div>
        <button
          onClick={resetHabit}
          className="w-full text-left text-sm font-medium text-gray-500 uppercase tracking-wide py-4 border-t border-gray-200 hover:text-gray-700"
        >
          Reset habit
        </button>
        <button
          onClick={handleDeleteHabit}
          className="w-full text-left text-sm font-medium text-red-500 uppercase tracking-wide py-4 hover:text-red-700"
        >
          Delete habit
        </button>
      </div>
    </div>
  )
}

export const HabitsBoard = ({ currentMonth = new Date() }: { currentMonth?: Date }) => {
  const { categories, loading, error, userId, refreshHabits, updateHabit, deleteHabit, addHabit } = useContext(HabitsContext)
  const { toast } = useToast()
  const [selectedHabit, setSelectedHabit] = useState<HabitItem | null>(null)
  const [view, setView] = useState<"all" | "board" | "calendar" | "journal" | "edit" | "add">("all")
  const [newHabit, setNewHabit] = useState<HabitItem>({
    id: "",
    label: "",
    description: "",
    color: "#FFD700",
    time: "00:00",
    frequency: "Everyday",
    isBuildHabit: true,
    history: [],
    notes: [],
    children: [],
    skipped: {},
    units: {},
    archived: false,
  })
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})
  const scrollableRef = useRef<HTMLDivElement>(null)

  const calendarDates = generateCalendarDates()

  const monthGroups = calendarDates.reduce((acc, date) => {
    const key = `${date.month} ${date.year}`
    if (!acc[key]) {
      acc[key] = { month: date.month, year: date.year, startIndex: date.index, count: 0 }
    }
    acc[key].count++
    return acc
  }, {} as { [key: string]: { month: string; year: number; startIndex: number; count: number } })

  const allHabits = flattenHabits(categories)

  useEffect(() => {
    if (loading || allHabits.length === 0 || !scrollableRef.current) return
    const scroller = scrollableRef.current
    scroller.scrollLeft = scroller.scrollWidth - scroller.clientWidth
    console.log("[HabitsBoard] Initial scroll position set to:", scroller.scrollLeft)
  }, [allHabits, loading])

  useEffect(() => {
    if (loading || allHabits.length === 0) return
    console.log("[HabitsBoard] Rendering conditions:", {
      loading,
      error,
      allHabitsLength: allHabits.length,
      userId,
      categories,
      categoriesDefined: !!categories,
      categoriesLength: categories?.length,
    })
    if (scrollableRef.current) {
      const table = scrollableRef.current.querySelector("table")
      if (table) {
        console.log("[HabitsBoard] Scrollable container width:", scrollableRef.current.offsetWidth)
        console.log("[HabitsBoard] Table width:", table.offsetWidth)
        console.log("[HabitsBoard] Scrollable width:", scrollableRef.current.scrollWidth)
        console.log("[HabitsBoard] Scroll left position:", scrollableRef.current.scrollLeft)
        console.log("[HabitsBoard] Container computed style overflow-x:", getComputedStyle(scrollableRef.current).overflowX)
        console.log("[HabitsBoard] Container computed style width:", getComputedStyle(scrollableRef.current).width)
        console.log("[HabitsBoard] Container computed style max-width:", getComputedStyle(scrollableRef.current).maxWidth)
        console.log("[HabitsBoard] Parent container width:", scrollableRef.current.parentElement?.offsetWidth)
        console.log("[HabitsBoard] Parent computed style overflow-x:", scrollableRef.current.parentElement ? getComputedStyle(scrollableRef.current.parentElement).overflowX : "N/A")
        console.log("[HabitsBoard] Parent computed style width:", scrollableRef.current.parentElement ? getComputedStyle(scrollableRef.current.parentElement).width : "N/A")
        console.log("[HabitsBoard] Parent computed style max-width:", scrollableRef.current.parentElement ? getComputedStyle(scrollableRef.current.parentElement).maxWidth : "N/A")
      } else {
        console.error("[HabitsBoard] Table element not found in scrollable container")
      }
    } else {
      console.error("[HabitsBoard] Scrollable container ref not set")
    }
  }, [categories, allHabits.length, loading, error, userId])

  useEffect(() => {
    if (loading || allHabits.length === 0) return
    if (scrollableRef.current) {
      const table = scrollableRef.current.querySelector("table") as HTMLTableElement
      if (table) {
        const rows = table.querySelectorAll("tbody tr")
        console.log("[HabitsBoard] Row Heights:", Array.from(rows).map((row) => row.offsetHeight))
      } else {
        console.error("[HabitsBoard] Table not found for height debugging")
      }
    }
  }, [allHabits, loading])

  console.log("[HabitsBoard] Categories:", categories)
  console.log("[HabitsBoard] User ID:", userId)
  console.log("[HabitsBoard] Calendar dates count:", calendarDates.length)
  console.log("[HabitsBoard] First few dates:", calendarDates.slice(0, 5).map((d) => d.date))
  console.log("[HabitsBoard] Month groups:", monthGroups)

  const handleAddHabit = async () => {
    if (!newHabit.label) {
      toast({ title: "Error", description: "Habit name is required.", variant: "destructive" })
      return
    }
    try {
      const habitToCreate = {
        ...newHabit,
        id: crypto.randomUUID(),
        history: [],
        notes: [],
        children: [],
        skipped: {},
        units: {},
        archived: false,
      }
      console.log("[HabitsBoard.handleAddHabit] Creating habit:", habitToCreate)
      await addHabit(habitToCreate)
      await refreshHabits()
      setNewHabit({
        id: "",
        label: "",
        description: "",
        color: "#FFD700",
        time: "00:00",
        frequency: "Everyday",
        isBuildHabit: true,
        history: [],
        notes: [],
        children: [],
        skipped: {},
        units: {},
        archived: false,
      })
      setView("all")
      toast({ title: "Habit Added", description: `"${habitToCreate.label}" was successfully added.` })
    } catch (err) {
      console.error("[HabitsBoard] Error adding habit:", err)
      toast({ title: "Error", description: "Failed to add habit.", variant: "destructive" })
    }
  }

  const handleMarkComplete = async (habitId: string, date: string) => {
    console.log("[HabitsBoard.handleMarkComplete] Attempting to mark habit complete:", { habitId, date })
    console.log("[HabitsBoard.handleMarkComplete] User ID from context:", userId)
    console.log("[HabitsBoard] All habits:", allHabits)
    const habitToUpdate = allHabits.find((h) => h.id === habitId)
    console.log("[HabitsBoard.handleMarkComplete] Found habit:", habitToUpdate)
    if (!habitToUpdate) {
      console.error("[HabitsBoard.handleMarkComplete] Habit not found for ID:", habitId)
      toast({ title: "Error", description: "Habit not found.", variant: "destructive" })
      return
    }
    if (!userId) {
      console.error("[HabitsBoard.handleMarkComplete] No user ID available")
      toast({ title: "Error", description: "Please log in to update habits.", variant: "destructive" })
      return
    }
    const isCompleted = habitToUpdate.history?.includes(date) || false
    const isSkipped = habitToUpdate.skipped?.[date] || false
    let updatedHistory = [...(habitToUpdate.history || [])]
    let updatedSkipped = { ...(habitToUpdate.skipped || {}) }
    if (!isCompleted && !isSkipped) {
      updatedHistory = [...updatedHistory, date]
      delete updatedSkipped[date]
    } else if (isCompleted && !isSkipped) {
      updatedHistory = updatedHistory.filter((d) => d !== date)
      updatedSkipped[date] = true
    } else {
      updatedHistory = updatedHistory.filter((d) => d !== date)
      delete updatedSkipped[date]
    }
    console.log("[HabitsBoard.handleMarkComplete] Updated history:", updatedHistory)
    console.log("[HabitsBoard.handleMarkComplete] Updated skipped:", updatedSkipped)
    const updatedHabit = { ...habitToUpdate, history: updatedHistory, skipped: updatedSkipped }
    try {
      console.log("[HabitsBoard.handleMarkComplete] Calling updateHabit with:", {
        habitId,
        updates: { history: updatedHistory, skipped: updatedSkipped },
      })
      await updateHabit(habitId, { history: updatedHistory, skipped: updatedSkipped })
      await refreshHabits()
      if (selectedHabit?.id === habitId) {
        setSelectedHabit(updatedHabit)
      }
      toast({ title: "Habit Marked", description: `Habit marked for ${date}.` })
    } catch (err) {
      console.error("[HabitsBoard.handleMarkComplete] Error marking habit:", err)
      toast({ title: "Error", description: "Failed to mark habit.", variant: "destructive" })
    }
  }

  console.log("[HabitsBoard] Before render:", {
    loading,
    error,
    allHabitsLength: allHabits.length,
    userId,
    categories,
    categoriesDefined: !!categories,
    categoriesLength: categories?.length,
  })

  if (loading) {
    console.log("[HabitsBoard] Rendering loading state")
    return (
      <div className="text-center text-white">
        <Loader2Icon className="h-8 w-8 animate-spin mx-auto" />
        <p>Loading habits...</p>
      </div>
    )
  }
  if (error) {
    console.log("[HabitsBoard] Rendering error state:", error)
    return <div className="text-center text-red-400">{error}</div>
  }
  if (allHabits.length === 0) {
    console.log("[HabitsBoard] Rendering no habits state")
    return (
      <div className="text-center text-white p-6">
        <p>No habits found. Add a new habit to get started!</p>
        <Button
          size="sm"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          onClick={() => setView("add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>
    )
  }

  console.log("[HabitsBoard] Rendering table with habits:", allHabits)

  return (
    <div className="h-[100vh] bg-gray-900/20 backdrop-blur-md border border-white/20 rounded-lg flex flex-col w-full max-w-[1280px]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="w-6 h-2 bg-green-500 rounded"></div>
            <div className="w-6 h-2 bg-green-500 rounded"></div>
            <div className="w-6 h-2 bg-green-500 rounded"></div>
          </div>
          <span className="text-sm font-medium text-white uppercase tracking-wide">HABITS</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
            onClick={() => setView("add")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          ref={scrollableRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{ scrollBehavior: "smooth" }}
        >
          <table
            className="table-auto border-collapse bg-white/10 backdrop-blur-md text-white"
            style={{ width: `${364 * 48 + 3 * 80}px` }}
          >
            <thead>
              <tr className="sticky top-0 bg-white/10 backdrop-blur-md z-20">
                <th className="w-[100px] px-6 py-3 text-left bg-gray-900 z-40 sticky left-0 top-0">
                  <span className="text-xs font-medium text-white uppercase tracking-wide">HABITS</span>
                </th>
                {calendarDates.map((date, index) => (
                  <th
                    key={`header-${date.date}-${index}`}
                    className="px-2 py-2 text-center bg-white/10 backdrop-blur-md z-10"
                    style={{ width: "48px", height: "48px", aspectRatio: "1" }}
                  >
                    {index === 0 || calendarDates[index - 1].month !== date.month ? (
                      <div className="text-xs font-medium text-white uppercase mb-1">
                        {date.month} {date.year}
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-white uppercase mb-1">&nbsp;</div>
                    )}
                    <div className="text-xs font-medium text-white uppercase mb-1">{date.dayName}</div>
                    <div
                      className={`text-sm font-bold ${
                        date.date === new Date().toISOString().split("T")[0]
                          ? "bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                          : "text-white"
                      }`}
                    >
                      {date.day}
                    </div>
                  </th>
                ))}
                <th className="w-20 px-2 py-3 text-center bg-white/10 backdrop-blur-md z-10">
                  <span className="text-xs font-medium text-white">current streak</span>
                </th>
                <th className="w-20 px-2 py-3 text-center bg-white/10 backdrop-blur-md z-10">
                  <span className="text-xs font-medium text-white">longest streak</span>
                </th>
                <th className="w-20 px-2 py-3 text-center bg-white/10 backdrop-blur-md z-10">
                  <span className="text-xs font-medium text-white">total count</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {allHabits.map((habit) => (
                <tr key={habit.id} className="hover:bg-white/20">
                  <td className="w-[100px] px-6 py-3 text-left bg-gray-900 z-30 sticky left-0">
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:bg-white/20"
                      onClick={() => {
                        setSelectedHabit(habit)
                        setView("all")
                      }}
                    >
                      <span className="text-sm font-medium text-white truncate">{habit.label}</span>
                    </div>
                  </td>
                  {calendarDates.map((date, index) => {
                    const isCompleted = habit.history?.includes(date.date) || false
                    const isSkipped = habit.skipped?.[date.date] || false
                    const units = habit.units?.[date.date] || 0
                    const streakIntensity = isCompleted ? calculateStreakIntensity(habit.history || [], date.date) : 0
                    const cellStyle = getColorWithSaturation(habit.color, streakIntensity, habit, date.date)
                    return (
                      <td
                        key={`${habit.id}-${date.date}-${index}`}
                        className="text-center cursor-pointer hover:opacity-90 relative border-0 z-10"
                        style={{ width: "48px", height: "48px", aspectRatio: "1" }}
                        onClick={() => handleMarkComplete(habit.id, date.date)}
                      >
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            isCompleted ? "" : isSkipped ? "" : "bg-transparent hover:bg-white/20"
                          }`}
                          style={isCompleted || isSkipped ? cellStyle : {}}
                        >
                          {isSkipped && !isCompleted && (
                            <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <polygon
                                points="0,0 100,0 0,100"
                                fill={(cellStyle as any).backgroundColor || "#f59e0b"}
                                opacity="0.9"
                              />
                            </svg>
                          )}
                          {isCompleted && <span className="text-white text-xs font-bold">✓</span>}
                          {units > 0 && (
                            <span className="relative z-10 text-xs font-bold bg-black bg-opacity-30 text-white px-1.5 py-0.5 rounded">
                              {units}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                  <td className="w-20 px-2 py-3 text-center z-10">
                    <span className="text-sm text-white">{calculateCurrentStreak(habit.history || [])}</span>
                  </td>
                  <td className="w-20 px-2 py-3 text-center z-10">
                    <span className="text-sm text-white">{calculateLongestStreak(habit.history || [])}</span>
                  </td>
                  <td className="w-20 px-2 py-3 text-center z-10">
                    <span className="text-sm text-white">{habit.history?.length || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedHabit && <HabitDetailOverlay habit={selectedHabit} onClose={() => setSelectedHabit(null)} />}
      {view === "add" && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Add New Habit</h2>
              <Button variant="ghost" onClick={() => setView("all")} className="text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Enter habit name..."
                value={newHabit.label}
                onChange={(e) => setNewHabit({ ...newHabit, label: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleAddHabit()}
                autoFocus
                className="bg-white/10 text-white border-white/20"
              />
              <div className="flex gap-4">
                <Button onClick={handleAddHabit} className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Habit
                </Button>
                <Button variant="outline" onClick={() => setView("all")} className="flex-1 text-white border-white/20">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}