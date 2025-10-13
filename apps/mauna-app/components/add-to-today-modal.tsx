"use client"

import React, { useState, useEffect } from "react"
import { X, Calendar, Clock, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"

interface AddToTodayModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { time: string; duration: number; date: string; taskListId?: string | null }) => Promise<void>
  itemName: string
  itemColor?: string
}

const QUICK_DURATIONS = [5, 15, 30, 45, 60, 90, 120]

export function AddToTodayModal({
  isOpen,
  onClose,
  onSave,
  itemName,
  itemColor = "#00D9FF",
}: AddToTodayModalProps) {
  const { user } = useAuth(AuthService)
  const [time, setTime] = useState(() => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  })
  const [duration, setDuration] = useState(30)
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [isSaving, setIsSaving] = useState(false)
  const [taskLists, setTaskLists] = useState<Array<{ id: string; name: string }>>([])
  const [selectedTaskListId, setSelectedTaskListId] = useState<string | null>(null)

  // Fetch task lists when modal opens
  useEffect(() => {
    const fetchTaskLists = async () => {
      if (!user?.id || !isOpen) return

      try {
        const lists = await databaseService.fetchTaskLists(user.id)
        // Filter out special lists
        const regularLists = lists.filter(list =>
          list.name !== "All Active Tasks" &&
          list.name !== "No Task List Selected" &&
          list.name !== "✅ Completed Tasks"
        )
        setTaskLists(regularLists)
      } catch (error) {
        console.error("Failed to fetch task lists:", error)
      }
    }

    fetchTaskLists()
  }, [user?.id, isOpen])

  if (!isOpen) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({ time, duration, date, taskListId: selectedTaskListId })
      onClose()
    } catch (error) {
      console.error("Failed to add to timeline:", error)
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
        className="w-full max-w-md rounded-2xl overflow-hidden"
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
                backgroundColor: itemColor,
                boxShadow: `0 0 12px ${itemColor}60`,
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-cream-25">Add to Timeline</h2>
              <p className="text-sm text-cream-25/60 truncate max-w-[250px]">{itemName}</p>
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
        <div className="p-5 space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border-white/10 text-cream-25 focus:border-cyan-400/50"
            />
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

          {/* Task List (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
              <List className="w-4 h-4" />
              Add to Task List (Optional)
            </label>
            <select
              value={selectedTaskListId || ""}
              onChange={(e) => setSelectedTaskListId(e.target.value || null)}
              className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:border-cyan-400/50 focus:outline-none"
            >
              <option value="">No task list (Timeline only)</option>
              {taskLists.map((list) => (
                <option key={list.id} value={list.id} className="bg-gray-800">
                  {list.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-cream-25/50">
              Select a task list to also add this item to Focus page
            </p>
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
            disabled={isSaving}
          >
            {isSaving ? "Adding..." : "Add to Timeline"}
          </Button>
        </div>
      </div>
    </div>
  )
}
