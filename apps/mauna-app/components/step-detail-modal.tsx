"use client"

import React, { useState, useEffect } from "react"
import {
  X, Clock, Palette, Trash2, Copy, CheckCircle2, Circle, Inbox, Plus, Pencil, Save,
  Briefcase, Coffee, Book, Code, Dumbbell, Heart, Zap, Target,
  Music, Palette as PaletteIcon, Camera, Video, ShoppingCart, Home,
  Car, Plane, Mail, DollarSign, Gift, Hammer, Puzzle, BarChart,
  Mic, Phone, Users, Star, Sun, Moon, Cloud, Umbrella
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import { useToast } from "@/hooks/use-toast"

interface Breath {
  id: string
  name: string
  completed: boolean
  isRunning: boolean
  timeEstimationSeconds: number
  position: number
}

interface StepItem {
  id: string
  label: string
  description: string
  journalContent?: string
  cbtNotes?: string
  color: string
  scheduledTime: string
  startDate?: string
  endDate?: string
  duration: number
  type: "habit" | "activity"
  isCompleted: boolean
  icon?: string
  frequency?: string
  isBuildHabit?: boolean
  history?: string[]
  breaths?: Breath[]
}

interface StepDetailModalProps {
  step: StepItem
  onClose: () => void
  onUpdate: (stepId: string, updates: Partial<StepItem>) => Promise<void>
  onDelete?: (stepId: string) => Promise<void>
  onDuplicate?: (stepId: string) => Promise<void>
  onToggleBreath?: (stepId: string, breathId: string, completed: boolean) => Promise<void>
  onMoveToInbox?: (stepId: string) => Promise<void>
}

const colorOptions = [
  "#FF8C00", // Orange
  "#00B7EB", // Blue
  "#FF4040", // Red
  "#00CD00", // Green
  "#9B30FF", // Purple
  "#FFD700", // Gold
  "#00CED1", // Cyan
  "#808080", // Gray
]

const iconOptions = [
  { name: "Briefcase", icon: Briefcase },
  { name: "Coffee", icon: Coffee },
  { name: "Book", icon: Book },
  { name: "Code", icon: Code },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "Heart", icon: Heart },
  { name: "Zap", icon: Zap },
  { name: "Target", icon: Target },
  { name: "Music", icon: Music },
  { name: "Palette", icon: PaletteIcon },
  { name: "Camera", icon: Camera },
  { name: "Video", icon: Video },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Home", icon: Home },
  { name: "Car", icon: Car },
  { name: "Plane", icon: Plane },
  { name: "Mail", icon: Mail },
  { name: "DollarSign", icon: DollarSign },
  { name: "Gift", icon: Gift },
  { name: "Hammer", icon: Hammer },
  { name: "Puzzle", icon: Puzzle },
  { name: "BarChart", icon: BarChart },
  { name: "Mic", icon: Mic },
  { name: "Phone", icon: Phone },
  { name: "Users", icon: Users },
  { name: "Star", icon: Star },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "Umbrella", icon: Umbrella },
  { name: "CheckCircle2", icon: CheckCircle2 },
  { name: "Clock", icon: Clock },
]

const frequencyOptions = [
  { value: "Every day!", label: "Every day" },
  { value: "Monday, Tuesday, Wednesday, Thursday, Friday", label: "Weekdays" },
  { value: "Saturday, Sunday", label: "Weekends" },
  { value: "", label: "Once" },
  { value: "custom", label: "Custom" },
]

const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Scrollbar styles
const scrollbarStyles = `
  .step-modal-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .step-modal-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .step-modal-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .step-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Firefox */
  .step-modal-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }
`

export function StepDetailModal({
  step,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleBreath,
  onMoveToInbox,
}: StepDetailModalProps) {
  const { user } = useAuth(AuthService)
  const { toast } = useToast()
  const [editLabel, setEditLabel] = useState(step.label)
  const [editDescription, setEditDescription] = useState(step.description || "")
  const [editJournalContent, setEditJournalContent] = useState(step.journalContent || "")
  const [editCbtNotes, setEditCbtNotes] = useState(step.cbtNotes || "")
  const [editColor, setEditColor] = useState(step.color)
  const [editIcon, setEditIcon] = useState(step.icon || "Briefcase")
  const [editScheduledTime, setEditScheduledTime] = useState(step.scheduledTime)
  const [editStartDate, setEditStartDate] = useState(step.startDate || "")
  const [editEndDate, setEditEndDate] = useState(step.endDate || "")
  const [editDuration, setEditDuration] = useState(step.duration)
  const [editFrequency, setEditFrequency] = useState(step.frequency || "Every day!")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isCustomFrequency, setIsCustomFrequency] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Breath management state
  const [editBreaths, setEditBreaths] = useState<Breath[]>(step.breaths || [])
  const [newBreathName, setNewBreathName] = useState("")
  const [editingBreathId, setEditingBreathId] = useState<string | null>(null)
  const [editingBreathName, setEditingBreathName] = useState("")
  const [editingBreathEstimation, setEditingBreathEstimation] = useState(0)

  // Inject scrollbar styles
  useEffect(() => {
    const styleId = 'step-modal-scrollbar-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = scrollbarStyles
      document.head.appendChild(style)
    }
  }, [])

  useEffect(() => {
    // Parse frequency into selected days for custom mode
    if (step.frequency && step.frequency !== "Every day!") {
      const days = step.frequency.split(", ").filter(d => dayOptions.includes(d))
      setSelectedDays(days)

      // Check if it's a preset or custom
      const isWeekdays = step.frequency === "Monday, Tuesday, Wednesday, Thursday, Friday"
      const isWeekends = step.frequency === "Saturday, Sunday"
      setIsCustomFrequency(!isWeekdays && !isWeekends && days.length > 0)
    }
  }, [step.frequency])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(step.id, {
        label: editLabel,
        description: editDescription,
        journalContent: editJournalContent,
        cbtNotes: editCbtNotes,
        color: editColor,
        icon: editIcon,
        scheduledTime: editScheduledTime,
        startDate: editStartDate || undefined,
        endDate: editEndDate || undefined,
        duration: editDuration,
        frequency: editFrequency,
      })
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${step.label}"? This action cannot be undone.`
    )

    if (confirmDelete) {
      await onDelete(step.id)
      onClose()
    }
  }

  const handleDuplicate = async () => {
    if (!onDuplicate) return
    await onDuplicate(step.id)
    onClose()
  }

  const handleMoveToInbox = async () => {
    if (!onMoveToInbox) return

    const confirmMove = window.confirm(
      `Move "${step.label}" to inbox? This will remove its scheduled time.`
    )

    if (confirmMove) {
      await onMoveToInbox(step.id)
      onClose()
    }
  }

  const handleComplete = async () => {
    await onUpdate(step.id, { isCompleted: !step.isCompleted })
  }

  const handleToggleBreathCompletion = async (e: React.MouseEvent, breathId: string, currentCompleted: boolean) => {
    e.stopPropagation()
    if (onToggleBreath) {
      await onToggleBreath(step.id, breathId, !currentCompleted)
    }
  }

  const handleFrequencyChange = (value: string) => {
    if (value === "custom") {
      setIsCustomFrequency(true)
      setEditFrequency("")
    } else {
      setIsCustomFrequency(false)
      setEditFrequency(value)
      setSelectedDays([])
    }
  }

  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day]

    setSelectedDays(newDays)

    // Update frequency string
    if (newDays.length === 7) {
      setEditFrequency("Every day!")
      setIsCustomFrequency(false)
    } else if (newDays.length === 0) {
      setEditFrequency("")
    } else {
      setEditFrequency(newDays.join(", "))
    }
  }

  // Breath management handlers
  const handleAddBreath = async () => {
    if (!user?.id || !newBreathName.trim()) return

    try {
      const nextPosition = editBreaths.length > 0 ? Math.max(...editBreaths.map(b => b.position || 0)) + 1 : 1
      const newBreath = await databaseService.createBreath(user.id, step.id, newBreathName.trim(), nextPosition)

      setEditBreaths([...editBreaths, newBreath])
      setNewBreathName("")
      toast({ title: "Breath Added", description: `"${newBreathName.trim()}" has been added.` })
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to add breath.", variant: "destructive" })
    }
  }

  const handleEditBreath = (breath: Breath) => {
    setEditingBreathId(breath.id)
    setEditingBreathName(breath.name)
    setEditingBreathEstimation(Math.floor(breath.timeEstimationSeconds / 60))
  }

  const handleSaveBreath = async () => {
    if (!user?.id || !editingBreathId) return

    try {
      const updates = {
        name: editingBreathName,
        timeEstimationSeconds: editingBreathEstimation * 60,
      }

      await databaseService.updateBreathTiming(editingBreathId, user.id, updates)

      setEditBreaths(editBreaths.map(b =>
        b.id === editingBreathId
          ? { ...b, name: editingBreathName, timeEstimationSeconds: editingBreathEstimation * 60 }
          : b
      ))

      setEditingBreathId(null)
      toast({ title: "Breath Updated", description: "Breath has been updated." })
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update breath.", variant: "destructive" })
    }
  }

  const handleDeleteBreath = async (breathId: string) => {
    if (!user?.id) return

    const confirmDelete = window.confirm("Are you sure you want to delete this breath?")
    if (!confirmDelete) return

    try {
      await databaseService.deleteBreath(breathId, user.id)
      setEditBreaths(editBreaths.filter(b => b.id !== breathId))
      toast({ title: "Breath Deleted", description: "Breath has been removed." })
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete breath.", variant: "destructive" })
    }
  }

  // Count completed breaths
  const completedBreaths = editBreaths.filter(b => b.completed).length
  const totalBreaths = editBreaths.length

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="h-full w-full sm:h-auto sm:w-auto sm:absolute sm:inset-4 sm:m-auto sm:max-w-2xl sm:max-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
        <div className="w-full h-full bg-gray-900/95 backdrop-blur-xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: "100%" }}>
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                className="w-3 h-10 rounded-full flex-shrink-0 shadow-lg"
                style={{
                  backgroundColor: step.color,
                  boxShadow: `0 4px 12px ${step.color}60`,
                }}
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-cream-25 truncate">{step.label}</h2>
                <p className="text-xs sm:text-sm text-cream-25/60 truncate capitalize">{step.type}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-cream-25" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 step-modal-scroll">
            <div className="space-y-4 sm:space-y-5">
              {/* Step Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25">Step Name</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 placeholder:text-cream-25/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                  placeholder="Enter step name"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="min-h-[80px] bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 resize-none focus:border-white/30"
                  placeholder="Enter step description"
                />
              </div>

              {/* Journal Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25">Journal Entry</label>
                <Textarea
                  value={editJournalContent}
                  onChange={(e) => setEditJournalContent(e.target.value)}
                  className="h-[100px] bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 resize-none focus:border-white/30"
                  placeholder="Write your thoughts, reflections, or notes about this step..."
                />
              </div>

              {/* CBT Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25">CBT Notes</label>
                <p className="text-xs text-cream-25/60">Situation / Event → Automatic Thoughts or Emotions in Body → Worldview / History / Origins of Emotion or Thoughts → Sit → Constructive Response → Outcome</p>
                <Textarea
                  value={editCbtNotes}
                  onChange={(e) => setEditCbtNotes(e.target.value)}
                  className="h-[100px] bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 resize-none focus:border-white/30"
                  placeholder="Enter your CBT notes here..."
                />
              </div>

              {/* Time and Duration Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* When - Scheduled Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    When?
                  </label>
                  <input
                    type="time"
                    value={editScheduledTime}
                    onChange={(e) => setEditScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all font-mono text-lg"
                  />
                </div>

                {/* How long - Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">Duration (min)</label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-lg"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Date Range Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cream-25">
                    Start Date {step.type === "habit" ? "(Habit begins)" : "(Scheduled date)"}
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                  />
                </div>

                {/* End Date - Only for habits */}
                {step.type === "habit" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-cream-25">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={editEndDate}
                      onChange={(e) => setEditEndDate(e.target.value)}
                      min={editStartDate}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-cream-25 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                      placeholder="Leave empty for ongoing"
                    />
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditColor(color)}
                      className={`w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                        editColor === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105"
                          : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        boxShadow: editColor === color ? `0 4px 12px ${color}80` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-cream-25">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map((iconOption) => {
                    const IconComponent = iconOption.icon
                    return (
                      <button
                        key={iconOption.name}
                        onClick={() => setEditIcon(iconOption.name)}
                        className={`w-full aspect-square rounded-xl transition-all hover:scale-110 flex items-center justify-center ${
                          editIcon === iconOption.name
                            ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105 bg-white/15"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 text-cream-25" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Frequency */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-cream-25">Frequency</label>

                {/* Preset Frequency Options */}
                <div className="grid grid-cols-2 gap-2">
                  {frequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFrequencyChange(option.value)}
                      className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                        (option.value === "custom" && isCustomFrequency) ||
                        (option.value !== "custom" && editFrequency === option.value)
                          ? "bg-white/15 text-cream-25 border-2 border-white/30"
                          : "bg-white/5 text-cream-25/70 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Custom Day Selector */}
                {isCustomFrequency && (
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                        const fullDay = dayOptions[index]
                        const isSelected = selectedDays.includes(fullDay)

                        return (
                          <button
                            key={`${day}-${index}`}
                            onClick={() => handleDayToggle(fullDay)}
                            className={`flex-1 h-12 rounded-lg font-semibold text-sm transition-all ${
                              isSelected
                                ? "bg-green-500 text-white shadow-lg scale-105"
                                : "bg-white/5 text-cream-25/50 border border-white/10 hover:bg-white/10"
                            }`}
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Breaths Section - Editable */}
              <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-cream-25 uppercase tracking-wide">Breaths</label>
                  <span className="text-xs font-medium text-cream-25/60 px-2 py-1 rounded-full bg-white/10">
                    {completedBreaths}/{totalBreaths} completed
                  </span>
                </div>

                {/* Add new breath */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a new breath..."
                    value={newBreathName}
                    onChange={(e) => setNewBreathName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddBreath()
                      }
                    }}
                    className="flex-1 bg-white/10 border-white/10 text-cream-25 placeholder:text-cream-25/50 focus:border-white/30"
                  />
                  <Button
                    onClick={handleAddBreath}
                    disabled={!newBreathName.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Breath list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {editBreaths
                    .sort((a, b) => a.position - b.position)
                    .map((breath) => {
                      const breathMinutes = Math.ceil(breath.timeEstimationSeconds / 60)
                      const isEditing = editingBreathId === breath.id

                      return (
                        <div
                          key={breath.id}
                          className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2"
                        >
                          {/* Breath item row */}
                          <div className="flex items-center gap-3">
                            {/* Checkbox */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (onToggleBreath) {
                                  onToggleBreath(step.id, breath.id, !breath.completed)
                                }
                              }}
                              className="flex-shrink-0"
                            >
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center transition-all hover:scale-110"
                                style={{
                                  borderWidth: '2px',
                                  borderColor: breath.completed ? step.color : "rgba(249, 250, 251, 0.3)",
                                  backgroundColor: breath.completed ? step.color : "transparent",
                                  boxShadow: breath.completed ? `0 4px 8px ${step.color}40` : 'none'
                                }}
                              >
                                {breath.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                                ) : (
                                  <Circle className="w-3 h-3 text-cream-25/20" />
                                )}
                              </div>
                            </button>

                            {/* Name */}
                            <div className="flex-1">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={editingBreathName}
                                  onChange={(e) => setEditingBreathName(e.target.value)}
                                  className="bg-white/10 border-white/10 text-cream-25 h-8 text-sm"
                                />
                              ) : (
                                <span
                                  className="text-sm font-medium"
                                  style={{
                                    color: breath.completed ? "rgba(249, 250, 251, 0.5)" : "rgba(249, 250, 251, 0.9)",
                                    textDecoration: breath.completed ? "line-through" : "none",
                                  }}
                                >
                                  {breath.name}
                                </span>
                              )}
                            </div>

                            {/* Time estimation */}
                            <div className="text-xs text-cream-25/60">
                              {breathMinutes}m
                            </div>

                            {/* Actions */}
                            {isEditing ? (
                              <Button
                                onClick={handleSaveBreath}
                                size="sm"
                                variant="ghost"
                                className="text-green-500 hover:text-green-600 h-8 w-8 p-0"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleEditBreath(breath)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-cream-25/70 hover:text-cream-25 h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteBreath(breath.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-500 h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Time estimation input (when editing) */}
                          {isEditing && (
                            <div className="flex items-center gap-2 ml-9">
                              <label className="text-xs text-cream-25/70">
                                Est. (min):
                              </label>
                              <Input
                                type="number"
                                min="0"
                                value={editingBreathEstimation}
                                onChange={(e) => setEditingBreathEstimation(Number(e.target.value))}
                                className="w-20 h-7 text-xs bg-white/10 border-white/10 text-cream-25"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}

                  {editBreaths.length === 0 && (
                    <div className="text-center py-6 text-cream-25/50 text-sm">
                      No breaths yet. Add one above to get started!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t border-white/10 space-y-3 bg-gray-900/50">
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleComplete}
                disabled={isSaving}
                className="py-3 text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: step.isCompleted ? "rgba(255, 255, 255, 0.1)" : "#00CD00",
                  color: "white",
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                {step.isCompleted ? "Completed" : "Mark Complete"}
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="py-3 text-base font-semibold rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: "#FF4040", color: "white" }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-3">
              {onMoveToInbox && (
                <Button
                  onClick={handleMoveToInbox}
                  disabled={isSaving}
                  className="py-2.5 text-sm font-medium rounded-xl border-2 hover:bg-white/5 transition-all"
                  style={{
                    backgroundColor: "transparent",
                    color: "rgba(249, 250, 251, 0.7)",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  To Inbox
                </Button>
              )}

              {onDuplicate && (
                <Button
                  onClick={handleDuplicate}
                  disabled={isSaving}
                  className="py-2.5 text-sm font-medium rounded-xl border-2 hover:bg-white/5 transition-all"
                  style={{
                    backgroundColor: "transparent",
                    color: "rgba(249, 250, 251, 0.7)",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
              )}

              {onDelete && (
                <Button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="py-2.5 text-sm font-medium rounded-xl border-2 hover:bg-red-500/10 transition-all"
                  style={{
                    backgroundColor: "transparent",
                    color: "#DC2626",
                    borderColor: "#DC2626"
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
