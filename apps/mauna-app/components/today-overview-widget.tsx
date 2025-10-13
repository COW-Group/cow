"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import { Repeat, Eye, ListTodo, Clock, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface OverviewItem {
  id: string
  label: string
  source: "habit" | "timeline" | "focus" | "vision"
  color: string
  scheduledTime?: string
  duration?: number
  completed: boolean
  icon?: string
  frequency?: string
}

export function TodayOverviewWidget() {
  const { user } = useAuth(AuthService)
  const [items, setItems] = useState<OverviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "habit" | "timeline" | "focus" | "vision">("all")

  useEffect(() => {
    loadTodayItems()
  }, [user?.id])

  const loadTodayItems = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const todayDayName = dayNames[new Date().getDay()]

      // Fetch all steps from database
      const { data: steps, error } = await databaseService.supabase
        .from("steps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })

      if (error) throw error

      const allItems: OverviewItem[] = []

      steps?.forEach((step: any) => {
        const habitNotes = step.habit_notes || {}
        const scheduledTime = habitNotes._scheduled_time
        const startDate = step.start_date
        const endDate = step.end_date
        const tag = step.tag
        const frequency = step.frequency || ""

        // Determine if this item should show today
        let showToday = false
        let source: "habit" | "timeline" | "focus" | "vision" = "timeline"

        if (tag === "habit") {
          source = "habit"
          // Check if habit is active today
          if (startDate && today < startDate) return // Not started yet
          if (endDate && today > endDate) return // Already ended

          if (frequency === "Every day!" || !frequency) {
            showToday = true
          } else if (frequency.includes(todayDayName)) {
            showToday = true
          }
        } else if (tag === "task-list") {
          source = "focus"
          // Focus tasks show if scheduled for today or not completed
          showToday = !step.completed
        } else if (tag === "vision") {
          source = "vision"
          // Vision items show if scheduled for today
          if (startDate === today) {
            showToday = true
          }
        } else if (scheduledTime) {
          // Timeline item with scheduled time
          source = "timeline"
          if (startDate === today || !startDate) {
            showToday = true
          }
        }

        if (showToday) {
          allItems.push({
            id: step.id,
            label: step.label,
            source: source,
            color: step.color || "#00D9FF",
            scheduledTime: scheduledTime,
            duration: step.duration ? Math.round(step.duration / 60000) : undefined,
            completed: step.completed || false,
            icon: step.icon,
            frequency: frequency,
          })
        }
      })

      // Sort by scheduled time if available
      allItems.sort((a, b) => {
        if (a.scheduledTime && b.scheduledTime) {
          return a.scheduledTime.localeCompare(b.scheduledTime)
        }
        if (a.scheduledTime) return -1
        if (b.scheduledTime) return 1
        return 0
      })

      setItems(allItems)
    } catch (error) {
      console.error("Failed to load today's items:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "habit": return <Repeat className="w-3.5 h-3.5" />
      case "timeline": return <Clock className="w-3.5 h-3.5" />
      case "focus": return <ListTodo className="w-3.5 h-3.5" />
      case "vision": return <Eye className="w-3.5 h-3.5" />
      default: return <Circle className="w-3.5 h-3.5" />
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "habit": return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "timeline": return "bg-cream-25/20 text-cream-25 border-cream-25/30"
      case "focus": return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      case "vision": return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      default: return "bg-white/20 text-white border-white/30"
    }
  }

  const filteredItems = selectedFilter === "all"
    ? items
    : items.filter(item => item.source === selectedFilter)

  const completedCount = filteredItems.filter(item => item.completed).length
  const totalCount = filteredItems.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-light text-cream-25 mb-1">Today's Overview</h2>
            <p className="text-sm text-cream-25/60">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-cream-25">{completionPercentage}%</div>
            <div className="text-xs text-cream-25/60">{completedCount}/{totalCount} completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === "all"
                ? "bg-white/20 text-cream-25 border border-white/30"
                : "bg-white/5 text-cream-25/60 border border-white/10 hover:bg-white/10"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setSelectedFilter("habit")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === "habit"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "bg-purple-500/5 text-purple-300/60 border border-purple-500/10 hover:bg-purple-500/10"
            }`}
          >
            <Repeat className="w-3.5 h-3.5 inline mr-1" />
            Habits ({items.filter(i => i.source === "habit").length})
          </button>
          <button
            onClick={() => setSelectedFilter("focus")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === "focus"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-cyan-500/5 text-cyan-300/60 border border-cyan-500/10 hover:bg-cyan-500/10"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 inline mr-1" />
            Focus ({items.filter(i => i.source === "focus").length})
          </button>
          <button
            onClick={() => setSelectedFilter("vision")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedFilter === "vision"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-amber-500/5 text-amber-300/60 border border-amber-500/10 hover:bg-amber-500/10"
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Vision ({items.filter(i => i.source === "vision").length})
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cream-25 mb-2" />
            <p className="text-cream-25/60">Loading today's items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cream-25/60 text-lg mb-2">No items for today</p>
            <p className="text-cream-25/40 text-sm">
              {selectedFilter === "all"
                ? "Add tasks to Focus, schedule habits, or create vision items"
                : `No ${selectedFilter} items for today`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`glassmorphism rounded-xl p-4 border transition-all duration-200 hover:scale-[1.02] ${
                  item.completed ? "opacity-60" : ""
                }`}
                style={{
                  borderColor: `${item.color}40`,
                  background: `linear-gradient(135deg, ${item.color}10, rgba(255,255,255,0.05))`,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${item.color}30` }}
                  >
                    {item.icon || "📋"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-cream-25 truncate ${item.completed ? "line-through" : ""}`}>
                        {item.label}
                      </h4>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getSourceColor(item.source)}`}>
                        {getSourceIcon(item.source)}
                        {item.source}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-cream-25/60">
                      {item.scheduledTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.scheduledTime}
                        </span>
                      )}
                      {item.duration && (
                        <span>{item.duration}min</span>
                      )}
                      {item.frequency && item.frequency !== "Every day!" && (
                        <span className="truncate max-w-[150px]">{item.frequency}</span>
                      )}
                    </div>
                  </div>

                  {/* Completion Status */}
                  <button
                    onClick={() => {
                      // This would toggle completion - we'd need to pass a handler
                      console.log("Toggle completion for", item.id)
                    }}
                    className="flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-6 h-6 text-cream-25/40 hover:text-cream-25/60 transition-colors" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {!loading && filteredItems.length > 0 && (
        <div className="mt-6 px-4">
          <div className="glassmorphism rounded-lg p-4 border border-white/10 text-center">
            <p className="text-sm text-cream-25/70">
              {completedCount === totalCount ? (
                <span className="text-green-400 font-medium">🎉 All tasks completed! Great job!</span>
              ) : (
                <>
                  <span className="font-medium text-cream-25">{totalCount - completedCount}</span> task{totalCount - completedCount !== 1 ? "s" : ""} remaining
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
