// components/taskade-views/GanttView.tsx
"use client"

import React, { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import type { Range } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

interface GanttViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function GanttView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: GanttViewProps) {
  const [viewMode, setViewMode] = useState<"week" | "month">("week")

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

    return items.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const items = getItemsWithDates()

  // Generate timeline dates
  const generateTimeline = () => {
    if (items.length === 0) return []

    const today = new Date()
    const dates: Date[] = []

    if (viewMode === "week") {
      // Show 14 days (2 weeks)
      for (let i = -7; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(date)
      }
    } else {
      // Show 60 days (2 months)
      for (let i = -30; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push(date)
      }
    }

    return dates
  }

  const timeline = generateTimeline()

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatDate = (date: Date) => {
    if (viewMode === "week") {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mountain":
        return "bg-red-500"
      case "Hill":
        return "bg-orange-500"
      case "Terrain":
        return "bg-yellow-500"
      case "Length":
        return "bg-green-500"
      case "Step":
        return "bg-blue-500"
      case "Breath":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* View mode controls */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <span className="text-sm text-cream-25/70">View:</span>
        <button
          onClick={() => setViewMode("week")}
          className={`text-sm px-3 py-1 rounded ${
            viewMode === "week" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`text-sm px-3 py-1 rounded ${
            viewMode === "month" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Month
        </button>
        <div className="ml-auto text-sm text-cream-25/60">
          {items.length} {items.length === 1 ? "item" : "items"} with due dates
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center text-cream-25/50 py-8">
          No items with due dates. Add lifeline dates to your steps!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-flex gap-2 min-w-full pb-4">
            {timeline.map((date, index) => {
              const dayItems = getItemsForDate(date)
              const isTodayDate = isToday(date)

              return (
                <div
                  key={index}
                  className={`flex-shrink-0 ${viewMode === "week" ? "w-32" : "w-20"} border-l border-white/10 px-2`}
                >
                  {/* Date header */}
                  <div
                    className={`text-xs font-semibold mb-3 pb-2 border-b sticky top-0 z-10 ${
                      isTodayDate
                        ? "text-vibrant-blue border-vibrant-blue bg-deep-blue/90"
                        : "text-cream-25/70 border-white/10 bg-deep-blue/80"
                    }`}
                  >
                    {formatDate(date)}
                  </div>

                  {/* Items for this date */}
                  <div className="space-y-2 min-h-[200px]">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-white/10 rounded border-l-2 hover:bg-white/15 transition-colors cursor-pointer group"
                        style={{ borderLeftColor: getTypeColor(item.type).replace("bg-", "") }}
                      >
                        <div className="text-xs font-medium text-cream-25 mb-1 line-clamp-2">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] ${getTypeColor(item.type)}/20 text-cream-25`}
                          >
                            {item.type}
                          </Badge>
                          {item.tag && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-vibrant-blue/20 text-cream-25"
                            >
                              {item.tag}
                            </Badge>
                          )}
                        </div>
                        <div className="text-[10px] text-cream-25/50 line-clamp-1">{item.path}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
