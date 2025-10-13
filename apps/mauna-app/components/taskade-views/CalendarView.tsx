// components/taskade-views/CalendarView.tsx
"use client"

import React, { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Range } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

interface CalendarViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function CalendarView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get all items with lifeline dates
  const getItemsWithDates = () => {
    const items: Array<{
      id: string
      name: string
      type: string
      tag: string | null
      rangeName: string
      date: Date
      path: string
    }> = []

    ranges.forEach((range) => {
      range.mountains?.filter(m => !m.completed).forEach((mountain) => {
        mountain.hills?.filter(h => !h.completed).forEach((hill) => {
          hill.terrains?.filter(t => !t.completed).forEach((terrain) => {
            terrain.lengths?.filter(l => !l.completed).forEach((length) => {
              length.steps?.filter(s => !s.completed && s.lifeline).forEach((step) => {
                items.push({
                  id: step.id,
                  name: step.label,
                  type: "Step",
                  tag: step.tag,
                  rangeName: range.name,
                  date: new Date(step.lifeline!),
                  path: `${range.name} > ${mountain.name} > ${hill.name} > ${terrain.name} > ${length.name}`,
                })
              })
            })
          })
        })
      })
    })

    return items
  }

  const items = getItemsWithDates()

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Array<{ date: Date | null; isCurrentMonth: boolean }> = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, isCurrentMonth: false })
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    return days
  }

  const days = getDaysInMonth()

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const getItemsForDate = (date: Date) => {
    return items.filter((item) => {
      const itemDate = new Date(item.date)
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4">
      {/* Calendar controls */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <h3 className="text-xl font-bold text-cream-25">{monthName}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToToday} className="text-cream-25">
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-cream-25/70 pb-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (!day.date || !day.isCurrentMonth) {
            return <div key={index} className="min-h-[100px] bg-white/5 rounded" />
          }

          const dayItems = getItemsForDate(day.date)
          const isTodayDate = isToday(day.date)

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 rounded border transition-colors ${
                isTodayDate
                  ? "bg-vibrant-blue/20 border-vibrant-blue"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              <div
                className={`text-sm font-semibold mb-2 ${
                  isTodayDate ? "text-vibrant-blue" : "text-cream-25"
                }`}
              >
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className="text-xs p-1 bg-white/10 rounded hover:bg-white/20 transition-colors cursor-pointer group"
                  >
                    <div className="font-medium text-cream-25 truncate">{item.name}</div>
                    {item.tag && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-vibrant-blue/20 text-cream-25 mt-1"
                      >
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-sm text-cream-25/60">
          {items.length} {items.length === 1 ? "item" : "items"} with due dates this month
        </div>
      </div>
    </div>
  )
}
