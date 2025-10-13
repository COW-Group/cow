"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"

interface AddHabitGroupToTimelineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    startDate: string
    endDate: string
    daysOfWeek: string[]
    time: string
    duration: number
  }) => void
  groupName: string
  groupColor: string
  habitsCount: number
}

export function AddHabitGroupToTimelineModal({
  isOpen,
  onClose,
  onSave,
  groupName,
  groupColor,
  habitsCount
}: AddHabitGroupToTimelineModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(nextWeek)
  const [time, setTime] = useState("08:00")
  const [duration, setDuration] = useState(30)
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(["M", "T", "W", "Th", "F", "S", "Sa"])

  const daysOptions = [
    { label: "S", value: "S", full: "Sunday" },
    { label: "M", value: "M", full: "Monday" },
    { label: "T", value: "T", full: "Tuesday" },
    { label: "W", value: "W", full: "Wednesday" },
    { label: "Th", value: "Th", full: "Thursday" },
    { label: "F", value: "F", full: "Friday" },
    { label: "Sa", value: "Sa", full: "Saturday" }
  ]

  const toggleDay = (day: string) => {
    setDaysOfWeek(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const selectAllDays = () => {
    setDaysOfWeek(daysOptions.map(d => d.value))
  }

  const selectNone = () => {
    setDaysOfWeek([])
  }

  const handleSave = () => {
    if (daysOfWeek.length === 0) {
      alert("Please select at least one day of the week")
      return
    }

    onSave({
      startDate,
      endDate,
      daysOfWeek,
      time,
      duration
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-deep-blue to-dark-purple border-vibrant-blue/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cream-25 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-vibrant-blue" />
            Add "{groupName}" to Timeline
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-sm text-cream-25/70">
              This habit group contains <span className="font-bold text-vibrant-blue">{habitsCount} habit{habitsCount !== 1 ? 's' : ''}</span>.
              They will be added as subtasks in each timeline entry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date" className="text-cream-25/70">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/10 border-white/20 text-cream-25"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-cream-25/70">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/10 border-white/20 text-cream-25"
              />
            </div>
          </div>

          <div>
            <Label className="text-cream-25/70 mb-2 block">Days of Week</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllDays}
                className="text-xs bg-white/5 hover:bg-white/10 border-white/20"
              >
                All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectNone}
                className="text-xs bg-white/5 hover:bg-white/10 border-white/20"
              >
                None
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {daysOptions.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${daysOfWeek.includes(day.value)
                      ? 'bg-vibrant-blue text-cream-25 ring-2 ring-vibrant-blue/50'
                      : 'bg-white/10 text-cream-25/60 hover:bg-white/20'
                    }
                  `}
                  title={day.full}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time" className="text-cream-25/70">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white/10 border-white/20 text-cream-25"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-cream-25/70">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min={1}
                className="bg-white/10 border-white/20 text-cream-25"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-vibrant-blue hover:bg-vibrant-blue/90"
              style={{ backgroundColor: groupColor }}
            >
              Add to Timeline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
