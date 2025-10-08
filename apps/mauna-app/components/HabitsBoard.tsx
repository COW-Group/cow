import React, { useContext, useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { HabitsContext } from "./HabitsBoardWrapper"
import { HabitDetailModal } from "./habit-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, ChevronLeft, ChevronDown, ChevronRight, Edit2, Loader2Icon, Check, LayoutGrid, LayoutList, SlidersHorizontal, Circle, Menu, Bell, Palette, GripVertical, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  archived?: boolean
}

interface Category {
  id: string
  name: string
  color: string
  habits: HabitItem[]
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

// Generate calendar dates (last 14 days by default)
const generateCalendarDates = (numDays = 14) => {
  const dates = []
  const today = new Date()

  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push({
      date: date.toISOString().split("T")[0],
      day: date.getDate(),
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      isToday: i === 0,
    })
  }

  return dates
}

// Calculate color saturation based on streak
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

// Sortable Category Component
interface SortableCategoryProps {
  category: Category
  isExpanded: boolean
  isUncategorized: boolean
  groupStats: { completionPercentage: number; currentStreak: number }
  calendarDates: any[]
  showQuickActions: boolean
  toggleGroup: (groupId: string) => void
  children: React.ReactNode
}

const SortableCategory: React.FC<SortableCategoryProps> = ({
  category,
  isExpanded,
  isUncategorized,
  groupStats,
  calendarDates,
  showQuickActions,
  toggleGroup,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={isUncategorized ? '' : 'border-b border-white/5'}>
      {/* Group Row - for both categorized and uncategorized */}
      {isUncategorized ? (
        /* Uncategorized drag handle - minimal UI */
        <div className="flex items-stretch">
          {/* Quick Actions Spacer */}
          {showQuickActions && (
            <div className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] sticky left-0 bg-gray-900 z-20" />
          )}

          {/* Drag Handle for Uncategorized */}
          <div
            className={`flex-shrink-0 px-2 py-1 sticky bg-gray-900/50 border-r border-white/10 z-10 flex items-center ${
              showQuickActions ? 'left-[240px] sm:left-[280px] md:left-[320px]' : 'left-0'
            }`}
          >
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors"
              title="Drag to reorder"
            >
              <GripVertical className="w-3 h-3 text-cream-25/40" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-stretch hover:bg-white/5 transition-colors"
        >
          {/* Quick Actions Spacer for Group Row */}
          {showQuickActions && (
            <div className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] sticky left-0 bg-gray-900 z-20" />
          )}

          {/* Group Label */}
          <div
            className={`flex-shrink-0 px-4 py-3 sticky bg-gray-900 border-r border-white/10 z-10 flex items-center gap-2 ${
              showQuickActions ? 'left-[240px] sm:left-[280px] md:w-[320px] w-32 sm:w-40' : 'left-0 w-48 sm:w-64'
            }`}
          >
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded transition-colors"
              title="Drag to reorder categories"
            >
              <GripVertical className="w-4 h-4 text-cream-25/60" />
            </button>

            {/* Expand/Collapse */}
            <button
              onClick={() => toggleGroup(category.id)}
              className="flex items-center gap-2 flex-1"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-cream-25" />
              ) : (
                <ChevronRight className="w-4 h-4 text-cream-25" />
              )}
              <div
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium text-cream-25 uppercase tracking-wide truncate">
                {category.name}
              </span>
            </button>
          </div>

          {/* Group Progress Bar */}
          {calendarDates.map((dateInfo, index) => (
            <div
              key={`group-${category.id}-${index}`}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center"
              style={{
                background: `linear-gradient(90deg, ${category.color}33 0%, ${category.color}22 100%)`,
              }}
            >
              <div className="w-full h-full" />
            </div>
          ))}

          {/* Group Stats */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-lg font-medium text-cream-25">{groupStats.currentStreak}</div>
            </div>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-lg font-medium text-cream-25">{groupStats.completionPercentage}%</div>
            </div>
            <div className="w-20 px-2 text-center">
              <div className="text-lg font-medium text-cream-25">{category.habits.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Habits Content */}
      {children}
    </div>
  )
}

// Sortable Habit Row Component
interface SortableHabitRowProps {
  habit: HabitItem
  calendarDates: any[]
  showQuickActions: boolean
  showColorPicker: string | null
  setShowColorPicker: (id: string | null) => void
  showTimePicker: string | null
  setShowTimePicker: (id: string | null) => void
  selectedTime: { hour: string; minute: string }
  setSelectedTime: (time: { hour: string; minute: string }) => void
  selectedMetric: 'streak' | 'count' | 'rate'
  handleHabitClick: (habit: HabitItem) => void
  handleMarkComplete: (habit: HabitItem, date: string) => void
  handleUpdateHabit: (habitId: string, updates: Partial<HabitItem>) => Promise<void>
  calculateCurrentStreak: (history: string[], skipped?: { [date: string]: boolean }) => number
  calculateLongestStreak: (history: string[], skipped?: { [date: string]: boolean }) => number
  getColorWithSaturation: (habitColor: string, habit: HabitItem, targetDate: string) => any
  colorOptions: any[]
  toast: any
}

const SortableHabitRow: React.FC<SortableHabitRowProps> = ({
  habit,
  calendarDates,
  showQuickActions,
  showColorPicker,
  setShowColorPicker,
  showTimePicker,
  setShowTimePicker,
  selectedTime,
  setSelectedTime,
  selectedMetric,
  handleHabitClick,
  handleMarkComplete,
  handleUpdateHabit,
  calculateCurrentStreak,
  calculateLongestStreak,
  getColorWithSaturation,
  colorOptions,
  toast,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  const colorPickerButtonRef = useRef<HTMLButtonElement>(null)
  const [colorPickerPosition, setColorPickerPosition] = useState<{ top: number; left: number } | null>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const currentStreak = calculateCurrentStreak(habit.history || [], habit.skipped)
  const longestStreak = calculateLongestStreak(habit.history || [], habit.skipped)
  const totalCount = habit.history?.length || 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-stretch"
    >
      {/* Quick Action Icons - Colored tiles touching */}
      {showQuickActions && (
        <div className="flex items-stretch flex-shrink-0 sticky left-0 z-20 bg-gray-900">
          {/* Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleHabitClick(habit)
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ backgroundColor: `${habit.color}40` }}
            title="Edit habit"
          >
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Color Picker Toggle - Circle Icon */}
          <div className="relative">
            <button
              ref={colorPickerButtonRef}
              onClick={(e) => {
                e.stopPropagation()
                if (showColorPicker === habit.id) {
                  setShowColorPicker(null)
                  setColorPickerPosition(null)
                } else {
                  const rect = colorPickerButtonRef.current?.getBoundingClientRect()
                  if (rect) {
                    setColorPickerPosition({
                      top: rect.bottom + window.scrollY,
                      left: rect.left + window.scrollX,
                    })
                  }
                  setShowColorPicker(habit.id)
                }
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ backgroundColor: `${habit.color}60` }}
              title="Change color"
            >
              <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Color Picker Dropdown */}
            {showColorPicker === habit.id && colorPickerPosition && typeof window !== 'undefined' && ReactDOM.createPortal(
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 999998 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowColorPicker(null)
                    setColorPickerPosition(null)
                  }}
                />

                {/* Dropdown */}
                <div
                  className="absolute rounded-lg shadow-2xl"
                  style={{
                    zIndex: 999999,
                    background: 'rgba(40, 40, 40, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    top: `${colorPickerPosition.top}px`,
                    left: `${colorPickerPosition.left}px`,
                  }}
                >
                  <div className="flex">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={async (e) => {
                          e.stopPropagation()
                          await handleUpdateHabit(habit.id, { color: color.value })
                          setShowColorPicker(null)
                          setColorPickerPosition(null)
                        }}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity relative"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {habit.color === color.value && (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>

          {/* Reorder/Drag */}
          <button
            {...attributes}
            {...listeners}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity cursor-grab active:cursor-grabbing"
            style={{ backgroundColor: `${habit.color}80` }}
            title="Drag to reorder"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Notifications */}
          <button
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{ backgroundColor: `${habit.color}A0` }}
            title="Toggle notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Time */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Parse current time or use default
                const currentTime = habit.time || "08:00"
                const [hour, minute] = currentTime.split(':')
                setSelectedTime({ hour: hour.padStart(2, '0'), minute: (minute || '00').padStart(2, '0') })
                setShowTimePicker(showTimePicker === habit.id ? null : habit.id)
              }}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center hover:opacity-80 transition-opacity"
              style={{ backgroundColor: habit.color }}
              title="Set time"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>

            {/* Time Picker Modal */}
            {showTimePicker === habit.id && typeof window !== 'undefined' && ReactDOM.createPortal(
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/70"
                  style={{ zIndex: 999998 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTimePicker(null)
                  }}
                />

                {/* Time Picker */}
                <div
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
                  style={{
                    zIndex: 999999,
                    background: 'rgba(20, 20, 20, 0.98)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    {/* Time Selectors */}
                    <div className="flex gap-4 mb-6">
                      {/* Hour Selector */}
                      <div className="flex flex-col items-center">
                        <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                          {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
                            <button
                              key={hour}
                              onClick={() => setSelectedTime({ ...selectedTime, hour })}
                              className={`w-16 h-12 flex items-center justify-center text-lg font-mono transition-colors ${
                                selectedTime.hour === hour
                                  ? 'text-cream-25 font-semibold'
                                  : 'text-cream-25/40 hover:text-cream-25/70'
                              }`}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Separator */}
                      <div className="flex items-center text-2xl text-cream-25 font-mono">:</div>

                      {/* Minute Selector */}
                      <div className="flex flex-col items-center">
                        <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                          {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
                            <button
                              key={minute}
                              onClick={() => setSelectedTime({ ...selectedTime, minute })}
                              className={`w-16 h-12 flex items-center justify-center text-lg font-mono transition-colors ${
                                selectedTime.minute === minute
                                  ? 'text-cream-25 font-semibold'
                                  : 'text-cream-25/40 hover:text-cream-25/70'
                              }`}
                            >
                              {minute}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          const newTime = `${selectedTime.hour}:${selectedTime.minute}`
                          await handleUpdateHabit(habit.id, { time: newTime })
                          setShowTimePicker(null)
                          toast({ title: "Time Updated", description: `Habit time set to ${newTime}` })
                        }}
                        className="flex-1 px-4 py-2 rounded-lg text-blue-400 hover:bg-blue-400/10 transition-colors font-medium"
                      >
                        Ok
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTimePicker(null)
                        }}
                        className="flex-1 px-4 py-2 rounded-lg text-cream-25/60 hover:bg-white/10 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      )}

      {/* Habit Label */}
      <div
        className={`flex-shrink-0 px-4 py-2 flex items-center gap-2 sticky bg-gray-900 border-r border-white/10 z-10 ${
          showQuickActions ? 'left-[240px] sm:left-[280px] md:left-[320px] w-32 sm:w-40' : 'left-0 w-48 sm:w-64'
        }`}
      >
        {/* Habit Label */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => handleHabitClick(habit)}
        >
          <span className="text-xs sm:text-sm text-cream-25/90 truncate block">{habit.label}</span>
        </div>

        {/* Time Indicator */}
        {habit.time && habit.time !== "08:00" && (
          <span className="text-[10px] sm:text-xs text-cream-25/50 flex-shrink-0 font-mono">
            {habit.time}
          </span>
        )}
      </div>

      {/* Habit Tiles */}
      {calendarDates.map((dateInfo, index) => {
        const colorData = getColorWithSaturation(habit.color, habit, dateInfo.date)
        const isCompleted = habit.history?.includes(dateInfo.date)
        const isSkipped = habit.skipped?.[dateInfo.date]

        return (
          <div
            key={`habit-${habit.id}-${index}`}
            className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 cursor-pointer transition-all flex items-center justify-center group relative overflow-hidden"
            style={{ backgroundColor: colorData.backgroundColor }}
            onClick={() => handleMarkComplete(habit, dateInfo.date)}
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
            {isCompleted && (
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white/90 relative z-10" />
            )}
          </div>
        )
      })}

      {/* Habit Stats */}
      <div className="flex-shrink-0 flex items-center bg-gray-900">
        {selectedMetric === 'streak' && (
          <>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium text-cream-25">{currentStreak}</div>
            </div>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium text-cream-25">{longestStreak}</div>
            </div>
            <div className="w-20 px-2 text-center">
              <div className="text-sm font-medium text-cream-25">{totalCount}</div>
            </div>
          </>
        )}
        {selectedMetric === 'count' && (
          <>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium text-cream-25">{calculatePeriodCount(habit.history || [], 'week')}</div>
            </div>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium text-cream-25">{calculatePeriodCount(habit.history || [], 'month')}</div>
            </div>
            <div className="w-20 px-2 text-center">
              <div className="text-sm font-medium text-cream-25">{calculatePeriodCount(habit.history || [], 'year')}</div>
            </div>
          </>
        )}
        {selectedMetric === 'rate' && (
          <>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium" style={{ color: calculateCompletionRate(habit.history || [], habit.skipped, 'week') >= 70 ? '#00CD00' : calculateCompletionRate(habit.history || [], habit.skipped, 'week') >= 40 ? '#FFD700' : '#FF4040' }}>
                {calculateCompletionRate(habit.history || [], habit.skipped, 'week')}%
              </div>
            </div>
            <div className="w-20 px-2 text-center border-r border-white/5">
              <div className="text-sm font-medium" style={{ color: calculateCompletionRate(habit.history || [], habit.skipped, 'month') >= 70 ? '#00CD00' : calculateCompletionRate(habit.history || [], habit.skipped, 'month') >= 40 ? '#FFD700' : '#FF4040' }}>
                {calculateCompletionRate(habit.history || [], habit.skipped, 'month')}%
              </div>
            </div>
            <div className="w-20 px-2 text-center">
              <div className="text-sm font-medium" style={{ color: calculateCompletionRate(habit.history || [], habit.skipped, 'year') >= 70 ? '#00CD00' : calculateCompletionRate(habit.history || [], habit.skipped, 'year') >= 40 ? '#FFD700' : '#FF4040' }}>
                {calculateCompletionRate(habit.history || [], habit.skipped, 'year')}%
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Calculate week/month/year counts
const calculatePeriodCount = (history: string[], period: 'week' | 'month' | 'year') => {
  if (!history || history.length === 0) return 0

  const now = new Date()
  let startDate = new Date()

  if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
  }

  return history.filter(date => {
    const d = new Date(date)
    return d >= startDate && d <= now
  }).length
}

// Calculate completion rate for a period
const calculateCompletionRate = (history: string[], skipped: { [date: string]: boolean } | undefined, period: 'week' | 'month' | 'year') => {
  const now = new Date()
  let startDate = new Date()
  let totalDays = 0

  if (period === 'week') {
    startDate.setDate(now.getDate() - 7)
    totalDays = 7
  } else if (period === 'month') {
    startDate.setMonth(now.getMonth() - 1)
    totalDays = 30
  } else {
    startDate.setFullYear(now.getFullYear() - 1)
    totalDays = 365
  }

  const completed = history?.filter(date => {
    const d = new Date(date)
    return d >= startDate && d <= now
  }).length || 0

  return totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0
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

// Calculate group stats
const calculateGroupStats = (habits: HabitItem[], calendarDates: any[]) => {
  const last7Dates = calendarDates.slice(-7).map(d => d.date)

  let completedCount = 0
  let totalPossible = habits.length * last7Dates.length

  habits.forEach(habit => {
    last7Dates.forEach(date => {
      if (habit.history?.includes(date)) {
        completedCount++
      }
    })
  })

  const completionPercentage = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0
  const currentStreak = habits.length > 0 ? Math.min(...habits.map(h => calculateCurrentStreak(h.history || [], h.skipped))) : 0

  return { completionPercentage, currentStreak }
}

export const HabitsBoard = ({ currentMonth = new Date() }: { currentMonth?: Date }) => {
  const { categories, loading, error, refreshHabits, addHabit, updateHabit, deleteHabit } = useContext(HabitsContext)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedHabit, setSelectedHabit] = useState<HabitItem | null>(null)
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitGroup, setNewHabitGroup] = useState("")
  const [newHabitColor, setNewHabitColor] = useState("#FFD700")
  const [newHabitTime, setNewHabitTime] = useState("")
  const [newGroupName, setNewGroupName] = useState("")
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [isCompactView, setIsCompactView] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [showGroupFilter, setShowGroupFilter] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState({ hour: '08', minute: '00' })
  const [selectedMetric, setSelectedMetric] = useState<'streak' | 'count' | 'rate'>('streak')
  const [localCategories, setLocalCategories] = useState(categories)
  const [categoryOrder, setCategoryOrder] = useState<string[]>([])
  const { toast } = useToast()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load category order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('habitsCategoryOrder')
    if (savedOrder) {
      try {
        setCategoryOrder(JSON.parse(savedOrder))
      } catch (e) {
        console.error('Failed to parse category order:', e)
      }
    }
  }, [])

  // Update local categories when categories change, applying saved order
  useEffect(() => {
    if (categoryOrder.length > 0) {
      // Sort categories based on saved order
      const orderedCategories = [...categories].sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.id)
        const bIndex = categoryOrder.indexOf(b.id)

        // If both are in the order, sort by their index
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }
        // If only a is in the order, it comes first
        if (aIndex !== -1) return -1
        // If only b is in the order, it comes first
        if (bIndex !== -1) return 1
        // Neither in order, maintain original order
        return 0
      })
      setLocalCategories(orderedCategories)
    } else {
      setLocalCategories(categories)
    }
  }, [categories, categoryOrder])

  const calendarDates = generateCalendarDates(14)

  const filteredCategories = selectedGroup
    ? localCategories.filter((cat) => cat.id === selectedGroup)
    : localCategories

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) {
      toast({ title: "Error", description: "Please enter a habit name.", variant: "destructive" })
      return
    }

    const newHabit: HabitItem = {
      id: "",
      label: newHabitName,
      description: "",
      color: newHabitColor,
      time: newHabitTime || "08:00",
      frequency: "Everyday",
      isBuildHabit: true,
      habitGroup: newHabitGroup || null,
      history: [],
      notes: {},
      units: {},
      skipped: {},
    }

    await addHabit(newHabit)
    setNewHabitName("")
    setNewHabitGroup("")
    setNewHabitColor("#FFD700")
    setNewHabitTime("")
    setShowAddHabit(false)
  }

  const handleMarkComplete = async (habit: HabitItem, date: string) => {
    const updatedHistory = [...(habit.history || [])]
    const updatedSkipped = { ...(habit.skipped || {}) }
    const isCompleted = updatedHistory.includes(date)
    const isSkipped = updatedSkipped[date]

    if (isCompleted) {
      // Completed -> Skipped
      const index = updatedHistory.indexOf(date)
      updatedHistory.splice(index, 1)
      updatedSkipped[date] = true
    } else if (isSkipped) {
      // Skipped -> Not completed
      delete updatedSkipped[date]
    } else {
      // Not completed -> Completed
      updatedHistory.push(date)
      delete updatedSkipped[date]
    }

    try {
      await updateHabit(habit.id, { history: updatedHistory, skipped: updatedSkipped })
      toast({ title: "Habit Updated", description: `Status updated for ${date}` })
    } catch (err) {
      toast({ title: "Error", description: "Failed to update habit.", variant: "destructive" })
    }
  }

  const handleHabitClick = (habit: HabitItem) => {
    setSelectedHabit(habit)
  }

  const handleNextHabit = () => {
    if (!selectedHabit) return
    const allHabits = filteredCategories.flatMap(cat => cat.habits)
    const currentIndex = allHabits.findIndex(h => h.id === selectedHabit.id)
    const nextIndex = (currentIndex + 1) % allHabits.length
    setSelectedHabit(allHabits[nextIndex])
  }

  const handlePreviousHabit = () => {
    if (!selectedHabit) return
    const allHabits = filteredCategories.flatMap(cat => cat.habits)
    const currentIndex = allHabits.findIndex(h => h.id === selectedHabit.id)
    const prevIndex = currentIndex === 0 ? allHabits.length - 1 : currentIndex - 1
    setSelectedHabit(allHabits[prevIndex])
  }

  const handleDragEnd = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setLocalCategories((categories) => {
      return categories.map((category) => {
        if (category.id !== categoryId) {
          return category
        }

        const oldIndex = category.habits.findIndex((h) => h.id === active.id)
        const newIndex = category.habits.findIndex((h) => h.id === over.id)

        const newHabits = arrayMove(category.habits, oldIndex, newIndex)

        // TODO: Persist the new order to the database
        // You can add an order field to habits and update it here

        return {
          ...category,
          habits: newHabits,
        }
      })
    })

    toast({ title: "Habit Reordered", description: "Habit order updated successfully" })
  }

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    setLocalCategories((categories) => {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id)
      const newIndex = categories.findIndex((cat) => cat.id === over.id)

      const reorderedCategories = arrayMove(categories, oldIndex, newIndex)

      // Save the new order to localStorage
      const newOrder = reorderedCategories.map(cat => cat.id)
      localStorage.setItem('habitsCategoryOrder', JSON.stringify(newOrder))
      setCategoryOrder(newOrder)

      return reorderedCategories
    })

    toast({ title: "Categories Reordered", description: "Category order updated successfully" })
  }

  // Scroll to today on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth
    }
  }, [])

  // Auto expand/collapse groups based on compact view toggle
  useEffect(() => {
    if (isCompactView) {
      // Collapse all groups in compact view (but keep uncategorized always visible)
      setExpandedGroups(new Set(['uncategorized']))
    } else {
      // Expand all groups in detailed view
      setExpandedGroups(new Set(categories.map(cat => cat.id)))
    }
  }, [isCompactView, categories])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="h-8 w-8 animate-spin text-cream-25" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-end gap-2 sm:gap-4 px-4 sm:px-6 py-4 border-b border-white/10">
        {/* Compact View Toggle */}
        <Button
          onClick={() => setIsCompactView(!isCompactView)}
          variant="ghost"
          className="rounded-xl px-2 sm:px-3 py-2 text-cream-25 hover:bg-white/10"
          title={isCompactView ? "Switch to detailed view" : "Switch to compact view"}
        >
          {isCompactView ? <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" /> : <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />}
        </Button>

        <Button
          onClick={() => setShowAddHabit(true)}
          className="rounded-xl px-3 sm:px-5 py-2 sm:py-3 text-white"
          style={{
            background: 'rgba(76, 175, 80, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {/* Scrollable Calendar Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="min-w-max">
          {/* Calendar Header */}
          <div className="sticky top-0 z-20 flex bg-gray-900/95 backdrop-blur-md border-b border-white/10">
            {/* Quick Actions Header Spacer */}
            {showQuickActions && (
              <div className="flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] sticky left-0 bg-gray-900 z-30 border-r border-white/10" />
            )}

            {/* Habit Label Column Header */}
            <div
              className={`flex-shrink-0 px-4 py-3 sticky bg-gray-900 border-r border-white/10 z-30 ${
                showQuickActions ? 'left-[240px] sm:left-[280px] md:left-[320px] w-32 sm:w-40' : 'left-0 w-48 sm:w-64'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowGroupFilter(!showGroupFilter)}
                  className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-cream-25 transition-transform ${showGroupFilter ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium text-cream-25 uppercase tracking-wide">HABITS</span>
                </button>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className={`p-1 rounded transition-colors ${showQuickActions ? 'bg-green-500/80 text-white' : 'hover:bg-white/10 text-cream-25'}`}
                  title="Toggle quick actions"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Group Filter Dropdown */}
              {showGroupFilter && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 999998 }}
                    onClick={() => setShowGroupFilter(false)}
                  />

                  {/* Dropdown */}
                  <div
                    className="absolute top-full left-0 mt-2 min-w-[250px] rounded-2xl overflow-hidden"
                    style={{
                      zIndex: 999999,
                      background: 'rgba(30, 30, 30, 0.95)',
                      backdropFilter: 'blur(40px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div className="py-2">
                      {/* All Habits Option */}
                      <button
                        onClick={() => {
                          setSelectedGroup(null)
                          setShowGroupFilter(false)
                        }}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-1 h-6 rounded-full"
                            style={{ backgroundColor: "rgba(253, 250, 243, 0.5)" }}
                          />
                          <span className="text-base font-inter text-cream-25">
                            All Habits
                          </span>
                        </div>
                        {!selectedGroup && (
                          <Check className="h-5 w-5 text-cream-25" />
                        )}
                      </button>

                      {/* Divider */}
                      <div
                        className="my-1.5 mx-3 h-px"
                        style={{ background: "rgba(253, 250, 243, 0.15)" }}
                      />

                      {/* Individual Groups */}
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedGroup(category.id)
                            setShowGroupFilter(false)
                          }}
                          className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-1 h-6 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div className="flex flex-col items-start">
                              <span className="text-base font-inter text-cream-25">
                                {category.name}
                              </span>
                              <span className="text-xs text-cream-25/60">
                                {category.habits.length} {category.habits.length === 1 ? "habit" : "habits"}
                              </span>
                            </div>
                          </div>
                          {selectedGroup === category.id && (
                            <Check className="h-5 w-5 text-cream-25" />
                          )}
                        </button>
                      ))}

                      {/* Add Group Option */}
                      <div
                        className="my-1.5 mx-3 h-px"
                        style={{ background: "rgba(253, 250, 243, 0.15)" }}
                      />
                      <button
                        onClick={() => {
                          setShowAddGroup(true)
                          setShowGroupFilter(false)
                        }}
                        className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-cream-25/20 flex items-center justify-center">
                          <span className="text-cream-25 text-lg">+</span>
                        </div>
                        <span className="text-base font-inter text-cream-25">
                          Add Group
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Date Headers */}
            {calendarDates.map((dateInfo, index) => (
              <div
                key={`header-${index}`}
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 px-1 py-2 text-center flex flex-col items-center justify-center"
              >
                <div className="text-[9px] sm:text-[10px] md:text-xs text-cream-25/60 uppercase">{dateInfo.dayName}</div>
                <div className={`text-xs sm:text-sm md:text-base font-medium ${dateInfo.isToday ? 'text-green-400' : 'text-cream-25'}`}>
                  {dateInfo.day}
                </div>
              </div>
            ))}

            {/* Stats Headers */}
            <div className="flex-shrink-0 flex">
              {selectedMetric === 'streak' && (
                <>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">current</div>
                    <div className="text-xs text-cream-25/60 uppercase">streak</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">longest</div>
                    <div className="text-xs text-cream-25/60 uppercase">streak</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center">
                    <div className="text-xs text-cream-25/60 uppercase">total</div>
                    <div className="text-xs text-cream-25/60 uppercase">count</div>
                  </div>
                </>
              )}
              {selectedMetric === 'count' && (
                <>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">week</div>
                    <div className="text-xs text-cream-25/60 uppercase">count</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">month</div>
                    <div className="text-xs text-cream-25/60 uppercase">count</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center">
                    <div className="text-xs text-cream-25/60 uppercase">year</div>
                    <div className="text-xs text-cream-25/60 uppercase">count</div>
                  </div>
                </>
              )}
              {selectedMetric === 'rate' && (
                <>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">week</div>
                    <div className="text-xs text-cream-25/60 uppercase">compl. rate</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center border-r border-white/5">
                    <div className="text-xs text-cream-25/60 uppercase">month</div>
                    <div className="text-xs text-cream-25/60 uppercase">compl. rate</div>
                  </div>
                  <div className="w-20 px-2 py-3 text-center">
                    <div className="text-xs text-cream-25/60 uppercase">year</div>
                    <div className="text-xs text-cream-25/60 uppercase">compl. rate</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Habits List */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cream-25/60 text-lg">No habits yet. Create your first habit!</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleCategoryDragEnd}
            >
              <SortableContext
                items={filteredCategories.map(cat => cat.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredCategories.map((category) => {
                  const isExpanded = expandedGroups.has(category.id)
                  const groupStats = calculateGroupStats(category.habits, calendarDates)
                  const isUncategorized = category.id === 'uncategorized'

                  return (
                    <SortableCategory
                      key={category.id}
                      category={category}
                      isExpanded={isExpanded}
                      isUncategorized={isUncategorized}
                      groupStats={groupStats}
                      calendarDates={calendarDates}
                      showQuickActions={showQuickActions}
                      toggleGroup={toggleGroup}
                    >
                      {/* Habits - always shown for uncategorized, conditionally for grouped */}
                      {(isUncategorized || isExpanded) && (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) => handleDragEnd(event, category.id)}
                        >
                          <SortableContext
                            items={category.habits.map(h => h.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {category.habits.map((habit) => (
                              <SortableHabitRow
                                key={habit.id}
                                habit={habit}
                                calendarDates={calendarDates}
                                showQuickActions={showQuickActions}
                                showColorPicker={showColorPicker}
                                setShowColorPicker={setShowColorPicker}
                                showTimePicker={showTimePicker}
                                setShowTimePicker={setShowTimePicker}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                                selectedMetric={selectedMetric}
                                handleHabitClick={handleHabitClick}
                                handleMarkComplete={handleMarkComplete}
                                handleUpdateHabit={updateHabit}
                                calculateCurrentStreak={calculateCurrentStreak}
                                calculateLongestStreak={calculateLongestStreak}
                                getColorWithSaturation={getColorWithSaturation}
                                colorOptions={colorOptions}
                                toast={toast}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </SortableCategory>
                  )
                })}
              </SortableContext>
            </DndContext>
          )}

          {/* Daily Totals with Metric Selector */}
          {filteredCategories.length > 0 && (
            <div className="sticky bottom-0 z-10 flex bg-gray-900 border-t border-white/10">
              {/* Label Column */}
              <div
                className={`flex-shrink-0 px-4 py-3 sticky left-0 bg-gray-900 border-r border-white/10 z-30 flex items-center ${
                  showQuickActions ? 'w-[calc(240px+8rem)] sm:w-[calc(280px+10rem)] md:w-[calc(320px+10rem)]' : 'w-48 sm:w-64'
                }`}
              >
                <span className="text-sm font-medium text-cream-25 uppercase tracking-wide">DAILY TOTAL</span>
              </div>

              {/* Daily Total Counts */}
              {calendarDates.map((dateInfo, index) => {
                const allHabits = filteredCategories.flatMap(cat => cat.habits)
                const totalCompleted = allHabits.filter(habit => habit.history?.includes(dateInfo.date)).length

                return (
                  <div
                    key={`total-${index}`}
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-sm font-medium text-cream-25"
                  >
                    {totalCompleted > 0 ? totalCompleted : '-'}
                  </div>
                )
              })}

              {/* Metric Selector */}
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedMetric('streak')}
                  className={`w-20 px-2 py-3 text-center border-r border-white/5 text-xs transition-colors ${
                    selectedMetric === 'streak' ? 'text-cream-25 bg-white/10' : 'text-cream-25/40 hover:text-cream-25/60'
                  }`}
                >
                  STREAK
                </button>
                <button
                  onClick={() => setSelectedMetric('count')}
                  className={`w-20 px-2 py-3 text-center border-r border-white/5 text-xs transition-colors ${
                    selectedMetric === 'count' ? 'text-cream-25 bg-white/10' : 'text-cream-25/40 hover:text-cream-25/60'
                  }`}
                >
                  COUNT
                </button>
                <button
                  onClick={() => setSelectedMetric('rate')}
                  className={`w-20 px-2 py-3 text-center text-xs transition-colors ${
                    selectedMetric === 'rate' ? 'text-cream-25 bg-white/10' : 'text-cream-25/40 hover:text-cream-25/60'
                  }`}
                >
                  RATE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Habit</h2>
              <Button variant="ghost" onClick={() => setShowAddHabit(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Habit Name</label>
                <Input
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Morning Meditation"
                  onKeyPress={(e) => e.key === "Enter" && handleAddHabit()}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium">Group</label>
                <Input
                  value={newHabitGroup}
                  onChange={(e) => setNewHabitGroup(e.target.value)}
                  placeholder="e.g., Morning, Evening, Work"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Time (Optional)</label>
                <Input
                  type="time"
                  value={newHabitTime}
                  onChange={(e) => setNewHabitTime(e.target.value)}
                  placeholder="e.g., 08:00"
                  className="font-mono"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Color</label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewHabitColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        newHabitColor === color.value ? "ring-2 ring-offset-2 ring-gray-900" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleAddHabit} className="flex-1 bg-green-500 hover:bg-green-600">
                  Add Habit
                </Button>
                <Button variant="outline" onClick={() => setShowAddHabit(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {showAddGroup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Group</h2>
              <Button variant="ghost" onClick={() => setShowAddGroup(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g., Morning Routine"
                  autoFocus
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => {
                    setNewHabitGroup(newGroupName)
                    setNewGroupName("")
                    setShowAddGroup(false)
                    setShowAddHabit(true)
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                >
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setShowAddGroup(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Habit Detail Modal */}
      {selectedHabit && (
        <HabitDetailModal
          habit={selectedHabit}
          allHabits={filteredCategories.flatMap(cat => cat.habits)}
          onClose={() => setSelectedHabit(null)}
          onNext={handleNextHabit}
          onPrevious={handlePreviousHabit}
          onUpdate={async (habitId, updates) => {
            await updateHabit(habitId, updates)
            // Update selectedHabit with the new data
            setSelectedHabit(prev => prev ? { ...prev, ...updates } : null)
          }}
          onDelete={deleteHabit}
        />
      )}
    </div>
  )
}
