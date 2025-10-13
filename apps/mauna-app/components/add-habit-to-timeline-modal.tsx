"use client"

import React, { useState } from "react"
import { X, Calendar, Clock, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format, addDays } from "date-fns"

interface AddHabitToTimelineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    startDate: string
    endDate: string
    frequency: string[]
    time: string
    duration: number
  }) => Promise<void>
  habitName: string
  habitColor?: string
  habitFrequency?: string
  habitTime?: string
}

const DAYS_OF_WEEK = [
  { short: 'M', full: 'Monday' },
  { short: 'T', full: 'Tuesday' },
  { short: 'W', full: 'Wednesday' },
  { short: 'T', full: 'Thursday' },
  { short: 'F', full: 'Friday' },
  { short: 'S', full: 'Saturday' },
  { short: 'S', full: 'Sunday' },
]

const QUICK_DURATIONS = [5, 15, 30, 45, 60, 90, 120]

export function AddHabitToTimelineModal({
  isOpen,
  onClose,
  onSave,
  habitName,
  habitColor = "#00D9FF",
  habitFrequency = "",
  habitTime = "",
}: AddHabitToTimelineModalProps) {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"))
  const [time, setTime] = useState(() => {
    if (habitTime) return habitTime
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  })
  const [duration, setDuration] = useState(30)
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    // Parse habit frequency to pre-select days
    if (habitFrequency === "Every day!") {
      return DAYS_OF_WEEK.map(d => d.full)
    }
    const days: string[] = []
    DAYS_OF_WEEK.forEach(day => {
      if (habitFrequency.includes(day.full)) {
        days.push(day.full)
      }
    })
    return days.length > 0 ? days : DAYS_OF_WEEK.map(d => d.full) // Default to all days if none selected
  })
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const toggleDay = (dayFull: string) => {
    setSelectedDays(prev =>
      prev.includes(dayFull)
        ? prev.filter(d => d !== dayFull)
        : [...prev, dayFull]
    )
  }

  const selectAllDays = () => {
    setSelectedDays(DAYS_OF_WEEK.map(d => d.full))
  }

  const deselectAllDays = () => {
    setSelectedDays([])
  }

  const handleSave = async () => {
    if (selectedDays.length === 0) {
      alert("Please select at least one day")
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        startDate,
        endDate,
        frequency: selectedDays,
        time,
        duration,
      })
      onClose()
    } catch (error) {
      console.error("Failed to add habit to timeline:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "rgba(30, 30, 30, 0.98)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-10 rounded-full"
              style={{
                backgroundColor: habitColor,
                boxShadow: `0 0 12px ${habitColor}60`,
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-cream-25">Schedule Habit</h2>
              <p className="text-sm text-cream-25/60 truncate max-w-[300px]">{habitName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-cream-25" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/5 border-white/10 text-cream-25 focus:border-cyan-400/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="bg-white/5 border-white/10 text-cream-25 focus:border-cyan-400/50"
              />
            </div>
          </div>

          {/* Days of Week */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                Repeat On
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllDays}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  All
                </button>
                <button
                  onClick={deselectAllDays}
                  className="text-xs text-cream-25/60 hover:text-cream-25 transition-colors"
                >
                  None
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.full)
                return (
                  <button
                    key={day.full}
                    onClick={() => toggleDay(day.full)}
                    className={`flex-1 h-12 rounded-lg font-semibold text-sm transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-white scale-105'
                        : 'bg-white/5 text-cream-25/50 hover:bg-white/10'
                    }`}
                  >
                    {day.short}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-cream-25/50">
              {selectedDays.length === 7
                ? 'Repeats every day'
                : selectedDays.length > 0
                ? `Repeats on ${selectedDays.join(', ')}`
                : 'No days selected'}
            </p>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/5 border-white/10 text-cream-25 focus:border-cyan-400/50 font-mono text-lg"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cream-25">
              Duration (minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    duration === d
                      ? "bg-cyan-500 text-white scale-105"
                      : "bg-white/5 text-cream-25/70 hover:bg-white/10"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min="1"
              className="bg-white/5 border-white/10 text-cream-25 focus:border-cyan-400/50 mt-2"
              placeholder="Custom duration..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-white/10 bg-gray-900/50">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/10 text-cream-25 hover:bg-white/10"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
            disabled={isSaving || selectedDays.length === 0}
          >
            {isSaving ? "Scheduling..." : "Schedule Habit"}
          </Button>
        </div>
      </div>
    </div>
  )
}
