"use client"

import React, { useContext, useState, useEffect } from "react"
import { TimelineContext } from "./TimelineWrapper"
import { Loader2Icon, ChevronLeft, ChevronRight, Zap, Circle, CheckCircle2, Coffee, Sun, Moon, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, subDays, startOfWeek, addWeeks, isSameDay } from "date-fns"

// Custom scrollbar styles
const scrollbarStyles = `
  .timeline-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .timeline-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .timeline-scroll::-webkit-scrollbar-thumb {
    background: rgba(249, 250, 251, 0.08);
    border-radius: 3px;
  }
  .timeline-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(249, 250, 251, 0.15);
  }
`

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0')
  return `${hour}:00`
})

const ENERGY_ICONS: { [key: string]: React.ElementType } = {
  "wake": Sun,
  "breakfast": Coffee,
  "lunch": Utensils,
  "dinner": Utensils,
  "sleep": Moon,
}

export function Timeline({ currentDate }: { currentDate: Date }) {
  const { items, loading, error, selectedDate, setSelectedDate, updateItem } = useContext(TimelineContext)
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Inject custom scrollbar styles
  useEffect(() => {
    const styleId = 'timeline-scrollbar-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = scrollbarStyles
      document.head.appendChild(style)
    }
    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  const handlePrevWeek = () => {
    setWeekStart(addWeeks(weekStart, -1))
  }

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const toggleCompletion = async (itemId: string, currentStatus: boolean) => {
    await updateItem(itemId, { isCompleted: !currentStatus })
  }

  // Calculate energy level based on completed items
  const calculateEnergyLevel = () => {
    const totalItems = items.length
    const completedItems = items.filter(item => item.isCompleted).length
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 38) : 0
  }

  // Helper to convert HH:mm to minutes from midnight
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Helper to convert minutes to HH:mm
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60).toString().padStart(2, '0')
    const mins = (minutes % 60).toString().padStart(2, '0')
    return `${hours}:${mins}`
  }

  // Group items into time blocks and identify gaps
  const timeBlocks: Array<{ type: 'item' | 'gap', data: any }> = []
  let lastEndTime = 0 // Start of day

  items.forEach((item, index) => {
    const itemStart = timeToMinutes(item.scheduledTime)
    const itemEnd = itemStart + item.duration

    // Add gap if there's unused time
    if (itemStart > lastEndTime && lastEndTime >= timeToMinutes("04:00")) {
      timeBlocks.push({
        type: 'gap',
        data: {
          start: lastEndTime,
          end: itemStart,
          duration: itemStart - lastEndTime,
        }
      })
    }

    // Add the item
    timeBlocks.push({
      type: 'item',
      data: item
    })

    lastEndTime = itemEnd
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2Icon className="h-10 w-10 animate-spin text-cream-25" />
        <p className="text-cream-25 font-inter">Loading timeline...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-400 font-inter">{error}</p>
      </div>
    )
  }

  const energyLevel = calculateEnergyLevel()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header with Month/Year and Week Navigation */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h2 className="text-2xl sm:text-3xl font-lora font-extralight text-cream-25 tracking-wider">
          {format(selectedDate, 'MMMM')} <span className="text-cream-25/60">{format(selectedDate, 'yyyy')}</span>
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Week Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-shrink-0 scrollbar-thin scrollbar-thumb-cream-25/20 scrollbar-track-transparent">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const dayOfWeek = format(day, 'EEE')
          const dayOfMonth = format(day, 'd')

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className="flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] h-20 rounded-2xl transition-all duration-300"
              style={isSelected ? {
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              } : {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span className="text-xs text-cream-25/60 font-inter">{dayOfWeek}</span>
              <span className="text-2xl font-lora font-light text-cream-25">{dayOfMonth}</span>
              {/* Habit completion indicators */}
              <div className="flex gap-1 mt-1">
                {items.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex gap-6 overflow-y-auto timeline-scroll pr-2" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(249, 250, 251, 0.08) transparent'
      }}>
        {/* Energy Level Sidebar */}
        <div className="flex-shrink-0 w-20 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Zap className="h-8 w-8 text-yellow-400" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cream-25">{energyLevel}</div>
            <div className="text-xs text-cream-25/60 font-inter leading-tight mt-1">Energy<br/>Level</div>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="flex-1 relative">
          {/* Time labels on the left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col">
            {TIME_SLOTS.filter((_, i) => i % 2 === 0).map((time) => (
              <div key={time} className="h-24 flex items-start">
                <span className="text-xs text-cream-25/40 font-inter">{time}</span>
              </div>
            ))}
          </div>

          {/* Timeline items */}
          <div className="ml-20 relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5"
              style={{ background: 'rgba(255, 255, 255, 0.1)' }}
            />

            {/* Render time blocks */}
            <div className="relative">
              {timeBlocks.map((block, index) => {
                if (block.type === 'gap') {
                  const { start, end, duration } = block.data
                  const heightPx = (duration / 60) * 48 // 48px per hour

                  return (
                    <div
                      key={`gap-${index}`}
                      className="relative pl-8 flex items-center"
                      style={{ height: `${heightPx}px` }}
                    >
                      <div className="flex items-center gap-2 text-xs text-cream-25/40 font-inter">
                        <Zap className="h-3 w-3" />
                        Time well utilized!
                      </div>
                    </div>
                  )
                }

                // Item block
                const item = block.data
                const itemDuration = item.duration
                const heightPx = (itemDuration / 60) * 48 // 48px per hour
                const itemEnd = timeToMinutes(item.scheduledTime) + itemDuration
                const itemEndTime = minutesToTime(itemEnd)

                // Determine icon
                const IconComponent = ENERGY_ICONS[item.label.toLowerCase()] || Circle

                return (
                  <div
                    key={item.id}
                    className="relative pl-8 mb-0"
                    style={{ minHeight: `${heightPx}px` }}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute left-0 top-6 w-12 h-12 rounded-2xl flex items-center justify-center -translate-x-1/2 cursor-pointer transition-transform hover:scale-110"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 20px ${item.color}40`,
                      }}
                      onClick={() => toggleCompletion(item.id, item.isCompleted)}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    {/* Item content */}
                    <div
                      className="ml-6 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        minHeight: `${Math.max(heightPx - 16, 64)}px`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-xs text-cream-25/60 font-inter mb-1">
                            {item.scheduledTime} - {itemEndTime} ({itemDuration} min)
                          </div>
                          <div className="text-lg font-medium text-cream-25 mb-1">{item.label}</div>
                          {item.description && item.description !== "No description" && (
                            <div className="text-sm text-cream-25/70 font-inter">{item.description}</div>
                          )}
                          {item.frequency && (
                            <div className="text-xs text-cream-25/50 font-inter mt-2">
                              {item.frequency}
                            </div>
                          )}
                        </div>

                        {/* Completion status */}
                        <div className="ml-4">
                          {item.isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                          ) : (
                            <Circle className="h-6 w-6 text-cream-25/30" />
                          )}
                        </div>
                      </div>

                      {/* Progress indicator for habits with history */}
                      {item.type === 'habit' && item.history && item.history.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="text-xs text-cream-25/60 font-inter">{item.history.length}/7</div>
                          <div className="flex-1 h-1 rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((item.history.length / 7) * 100, 100)}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Breaths / Subtasks */}
                      {item.breaths && item.breaths.length > 0 && (
                        <div className="mt-4 ml-2 space-y-2 border-l-2 pl-3" style={{ borderColor: `${item.color}40` }}>
                          {item.breaths.map((breath, breathIndex) => {
                            const breathMinutes = Math.ceil(breath.timeEstimationSeconds / 60)
                            return (
                              <div
                                key={breath.id}
                                className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-white/5"
                              >
                                <div
                                  className="flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all"
                                  style={{
                                    borderColor: breath.completed ? item.color : 'rgba(249, 250, 251, 0.3)',
                                    backgroundColor: breath.completed ? item.color : 'transparent',
                                  }}
                                >
                                  {breath.completed && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                  <span
                                    className="text-sm font-inter"
                                    style={{
                                      color: breath.completed ? 'rgba(249, 250, 251, 0.5)' : 'rgba(249, 250, 251, 0.8)',
                                      textDecoration: breath.completed ? 'line-through' : 'none',
                                    }}
                                  >
                                    {breath.name}
                                  </span>
                                  <span className="text-xs text-cream-25/40 font-inter">
                                    {breathMinutes}m
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Completion status on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col justify-start gap-4 pt-6">
            {items.map((item) => (
              <div
                key={`status-${item.id}`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => toggleCompletion(item.id, item.isCompleted)}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                ) : (
                  <Circle className="h-6 w-6 text-cream-25/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
