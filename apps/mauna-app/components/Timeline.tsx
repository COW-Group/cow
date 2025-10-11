"use client"

import React, { useContext, useState, useEffect, useMemo } from "react"
import { TimelineContext } from "./TimelineWrapper"
import { StepDetailModal } from "./step-detail-modal"
import { AddStepModal } from "./add-step-modal"
import { FocusModeModal } from "./focus-mode-modal"
import {
  Loader2Icon, ChevronLeft, ChevronRight, Circle, CheckCircle2, Zap, Plus, X,
  Briefcase, Coffee, Book, Code, Dumbbell, Heart, Target,
  Music, Palette as PaletteIcon, Camera, Video, ShoppingCart, Home,
  Car, Plane, Mail, DollarSign, Gift, Hammer, Puzzle, BarChart,
  Mic, Phone, Users, Star, Sun, Moon, Cloud, Umbrella, Clock, MoreVertical, Sparkles, Settings
} from "lucide-react"
import { SoundSelector } from "./sound-selector"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek, addWeeks, isSameDay } from "date-fns"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { TIMELINE_CONSTANTS } from "@/lib/timeline-constants"
import {
  type TimelineItem,
  calculateTimelineBounds,
  calculateItemPositions,
  calculateOverlapLayout,
  getItemsForDay,
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
} from "@/lib/timeline-utils"

// Icon map for timeline items
const iconMap: Record<string, any> = {
  Briefcase, Coffee, Book, Code, Dumbbell, Heart, Zap, Target,
  Music, Palette: PaletteIcon, Camera, Video, ShoppingCart, Home,
  Car, Plane, Mail, DollarSign, Gift, Hammer, Puzzle, BarChart,
  Mic, Phone, Users, Star, Sun, Moon, Cloud, Umbrella, CheckCircle2, Clock
}

interface InboxItem {
  id: string
  label: string
  description?: string
  color: string
  duration?: number
  completed?: boolean
  isbuildhabit?: boolean
  frequency?: string
  habit_notes?: {
    _scheduled_time?: string
  }
}

export function Timeline({ currentDate }: { currentDate: Date }) {
  const { items, loading, error, selectedDate, setSelectedDate, updateItem, refreshTimeline } = useContext(TimelineContext)
  const { user } = useAuth(AuthService)
  const { toast } = useToast()
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }))
  const [selectedStep, setSelectedStep] = useState<TimelineItem | null>(null)
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false)
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([])
  const [showBottomMenu, setShowBottomMenu] = useState(false)
  const [showBottomSettings, setShowBottomSettings] = useState(false)
  const [focusModeStep, setFocusModeStep] = useState<TimelineItem | null>(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Check if a task is currently happening
  const isCurrentTask = (item: TimelineItem) => {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const itemStartMinutes = timeToMinutes(item.scheduledTime)
    const itemEndMinutes = itemStartMinutes + item.duration

    // Check if today matches the selected date
    const isToday = isSameDay(now, selectedDate)

    return isToday && currentMinutes >= itemStartMinutes && currentMinutes <= itemEndMinutes
  }

  // Fetch inbox items (unscheduled tasks)
  useEffect(() => {
    if (user?.id && isInboxOpen) {
      fetchInboxItems()
    }
  }, [user, isInboxOpen])

  const fetchInboxItems = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await databaseService.supabase
        .from("steps")
        .select("*")
        .eq("user_id", user.id)
        .is("habit_notes->_scheduled_time", null)
        .order("created_at", { ascending: false })

      if (error) {
        toast({ title: "Error", description: "Failed to load inbox items.", variant: "destructive" })
      } else {
        setInboxItems(data || [])
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error fetching inbox.", variant: "destructive" })
    }
  }

  const handlePrevWeek = () => {
    setWeekStart(addWeeks(weekStart, -1))
  }

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const toggleCompletion = async (e: React.MouseEvent, itemId: string, currentStatus: boolean) => {
    e.stopPropagation()
    await updateItem(itemId, { isCompleted: !currentStatus })
  }

  const handleStepUpdate = async (stepId: string, updates: any) => {
    await updateItem(stepId, updates)

    // Sync journal content to journal table if present
    if (user?.id && (updates.journalContent || updates.cbtNotes)) {
      const step = items.find(item => item.id === stepId)
      if (step) {
        await databaseService.createOrUpdateJournalEntryFromSource(
          user.id,
          'step',
          stepId,
          updates.label || step.label,
          updates.journalContent,
          updates.cbtNotes
        )
      }
    }

    await refreshTimeline()
  }

  const handleStepDelete = async (stepId: string) => {
    if (!user?.id) return

    try {
      const { error } = await databaseService.supabase
        .from("steps")
        .delete()
        .eq("id", stepId)
        .eq("user_id", user.id)

      if (error) {
        toast({ title: "Error", description: "Failed to delete step.", variant: "destructive" })
      } else {
        toast({ title: "Step Deleted", description: "Step was successfully deleted." })
        await refreshTimeline()
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error deleting step.", variant: "destructive" })
    }
  }

  const handleStepDuplicate = async (stepId: string) => {
    if (!user?.id) return

    try {
      const { data: originalStep, error: fetchError } = await databaseService.supabase
        .from("steps")
        .select("*")
        .eq("id", stepId)
        .eq("user_id", user.id)
        .single()

      if (fetchError || !originalStep) {
        toast({ title: "Error", description: "Failed to duplicate step.", variant: "destructive" })
        return
      }

      const { id, created_at, ...stepData } = originalStep
      const duplicateData = {
        ...stepData,
        label: `${originalStep.label} (Copy)`,
      }

      const { error: insertError } = await databaseService.supabase
        .from("steps")
        .insert([duplicateData])

      if (insertError) {
        toast({ title: "Error", description: "Failed to duplicate step.", variant: "destructive" })
      } else {
        toast({ title: "Step Duplicated", description: "Step was successfully duplicated." })
        await refreshTimeline()
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error duplicating step.", variant: "destructive" })
    }
  }

  const handleMoveToInbox = async (stepId: string) => {
    if (!user?.id) return

    try {
      // Fetch the current step to get its habit_notes
      const { data: currentStep, error: fetchError } = await databaseService.supabase
        .from("steps")
        .select("habit_notes")
        .eq("id", stepId)
        .eq("user_id", user.id)
        .single()

      if (fetchError || !currentStep) {
        toast({ title: "Error", description: "Failed to move step to inbox.", variant: "destructive" })
        return
      }

      // Update habit_notes to remove scheduled time
      const updatedHabitNotes = {
        ...(currentStep.habit_notes || {}),
        _scheduled_time: null,
      }

      const { error: updateError } = await databaseService.supabase
        .from("steps")
        .update({ habit_notes: updatedHabitNotes })
        .eq("id", stepId)
        .eq("user_id", user.id)

      if (updateError) {
        toast({ title: "Error", description: "Failed to move step to inbox.", variant: "destructive" })
      } else {
        toast({ title: "Moved to Inbox", description: "Step moved to inbox successfully." })
        await refreshTimeline()
        await fetchInboxItems() // Refresh inbox items
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error moving step to inbox.", variant: "destructive" })
    }
  }

  const handleToggleBreath = async (stepId: string, breathId: string, completed: boolean) => {
    if (!user?.id) return

    try {
      const { error } = await databaseService.supabase
        .from("breaths")
        .update({ completed })
        .eq("id", breathId)

      if (error) {
        toast({ title: "Error", description: "Failed to update breath.", variant: "destructive" })
      } else {
        await refreshTimeline()
        toast({ title: "Updated", description: "Breath status updated." })
      }
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error updating breath.", variant: "destructive" })
    }
  }

  const handleCreateStep = async (stepData: any) => {
    if (!user?.id) return

    try {
      // Extract fields that are not database columns
      const { breaths, scheduledTime, scheduledDate, lengthId, energyLevel, alerts, notes, ...coreStepFields } = stepData

      // Debug: Log received breaths
      console.log("[handleCreateStep] Received stepData:", stepData)
      console.log("[handleCreateStep] Breaths received:", breaths)

      // Prepare step data with only valid database columns
      const stepToInsert = {
        label: stepData.label,
        description: stepData.description || "",
        tag: stepData.tag,
        color: stepData.color,
        duration: stepData.duration,
        frequency: stepData.frequency,
        completed: stepData.completed || false,
        isbuildhabit: stepData.isbuildhabit || false,
        user_id: user.id,
        length_id: lengthId || null,
        scheduled_date: scheduledDate || null, // Add scheduled date for activities
        habit_notes: {
          _scheduled_time: scheduledTime,
          energyLevel: energyLevel,
          alerts: alerts,
          notes: notes,
        },
      }

      // Insert step
      const { data: newStep, error: stepError } = await databaseService.supabase
        .from("steps")
        .insert([stepToInsert])
        .select()
        .single()

      if (stepError) {
        toast({ title: "Error", description: `Failed to create step: ${stepError.message}`, variant: "destructive" })
        return
      }

      // Insert breaths if any
      if (breaths && breaths.length > 0) {
        console.log("[handleCreateStep] Inserting breaths for step:", newStep.id)
        const breathsToInsert = breaths.map((breath: any) => ({
          name: breath.name,
          step_id: newStep.id,
          completed: false,
          is_running: false,
          time_estimation_seconds: breath.timeEstimationSeconds || 300,
          position: breath.position,
        }))

        console.log("[handleCreateStep] Breaths to insert:", breathsToInsert)

        const { data: insertedBreaths, error: breathsError } = await databaseService.supabase
          .from("breaths")
          .insert(breathsToInsert)
          .select()

        if (breathsError) {
          console.error("[handleCreateStep] Breaths insert error:", breathsError)
          toast({ title: "Warning", description: `Step created but breaths failed to save: ${breathsError.message}`, variant: "destructive" })
        } else {
          console.log("[handleCreateStep] Breaths inserted successfully:", insertedBreaths)
        }
      } else {
        console.log("[handleCreateStep] No breaths to insert")
      }

      toast({ title: "Step Created", description: "New step added to your timeline." })
      await refreshTimeline()
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error creating step.", variant: "destructive" })
    }
  }

  // Calculate energy level based on completed items
  const calculateEnergyLevel = () => {
    const totalItems = items.length
    const completedItems = items.filter(item => item.isCompleted).length
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 38) : 0
  }

  // Use memoized timeline bounds calculation
  const timelineBounds = useMemo(() => calculateTimelineBounds(items), [items])
  const timelineRangeMinutes = timelineBounds.end - timelineBounds.start

  // Use memoized time slots generation
  const timeSlots = useMemo(
    () => generateTimeSlots(timelineBounds.start, timelineBounds.end),
    [timelineBounds]
  )

  // Use memoized item position calculations with overlap detection
  const itemsWithPosition = useMemo(
    () => calculateItemPositions(items, timelineBounds),
    [items, timelineBounds]
  )

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 max-w-md text-center">
          <p className="text-cream-25/80 font-inter text-lg mb-2">No steps scheduled for today</p>
          <p className="text-cream-25/50 font-inter text-sm">
            Steps from your habits or activities will appear here when scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    )
  }

  const energyLevel = calculateEnergyLevel()

  return (
    <div className="w-full h-full flex flex-col overflow-hidden pb-0 md:pb-0 px-3 md:px-0 pt-3 md:pt-0">
      {/* Header with Inbox, Energy Level, Month/Year and Week Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0 flex-shrink-0">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
          {/* Inbox Button - Liquid glass style */}
          <Button
            variant="ghost"
            className="px-2 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-all"
            onClick={() => setIsInboxOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <svg
              className="w-5 h-5 text-cream-25"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <span className="hidden sm:inline font-inter text-sm text-cream-25 font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Inbox</span>
          </Button>

          {/* Energy Level Badge - Liquid glass */}
          <div
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" style={{ filter: 'drop-shadow(0 2px 4px rgba(234, 179, 8, 0.3))' }} />
            <span className="text-sm sm:text-base font-bold text-cream-25" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>{energyLevel}</span>
            <span className="hidden sm:inline text-xs text-cream-25/80 font-inter font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Energy</span>
          </div>

          {/* Month/Year - Better contrast */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-lora font-extralight text-cream-25 tracking-wider" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>
            {format(selectedDate, 'MMMM')} <span className="text-cream-25/80">{format(selectedDate, 'yyyy')}</span>
          </h2>

          {/* Week Navigation - Inline on mobile - Liquid glass */}
          <div className="flex items-center gap-1 sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevWeek}
              className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <ChevronLeft className="h-5 w-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextWeek}
              className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <ChevronRight className="h-5 w-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
            </Button>
          </div>
        </div>

        {/* Week Navigation - Desktop only - Liquid glass */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevWeek}
            className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <ChevronLeft className="h-5 w-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextWeek}
            className="h-8 w-8 rounded-lg text-cream-25 hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <ChevronRight className="h-5 w-5" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
          </Button>
        </div>
      </div>

      {/* Week Day Selector with Colored Dots - Liquid glass */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-shrink-0">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const dayOfWeek = format(day, 'EEE')
          const dayOfMonth = format(day, 'd')

          // Get items for this specific day - properly filtered
          const dayItems = getItemsForDay(items, day, TIMELINE_CONSTANTS.MAX_DAY_DOTS)

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className="flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] h-20 rounded-2xl transition-all duration-300 touch-manipulation"
              style={isSelected ? {
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              } : {
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span className="text-xs text-cream-25/80 font-inter font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>{dayOfWeek}</span>
              <span className="text-2xl font-lora font-light text-cream-25" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>{dayOfMonth}</span>

              {/* Colored dots showing scheduled steps */}
              <div className="flex gap-1 mt-1">
                {dayItems.map((item, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 1px 3px ${item.color}80`
                    }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Timeline Content - Vertical Layout */}
      <div className="flex-1 flex overflow-hidden mb-20 md:mb-0">
        {/* Timeline Track with Vertical Scrolling */}
        <div className="flex-1 relative overflow-y-auto scrollbar-hide pb-32 md:pb-8" style={{ maxHeight: 'calc(100vh - 200px)', touchAction: 'pan-y' }}>
          <div className="relative pb-40 md:pb-32" style={{ minHeight: `${(timelineRangeMinutes / 60) * 96 + 200}px` }}>
            {/* Time labels on the left */}
            <div className="absolute left-0 top-0 w-16 flex flex-col">
              {timeSlots.map((slot) => (
                <div key={slot.time} className="h-24 flex items-start">
                  <span className="text-xs text-cream-25/40 font-inter">{slot.time}</span>
                </div>
              ))}
            </div>

            {/* Vertical line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-cream-25/10"
              style={{ left: '100px' }}
            />

            {/* Timeline items positioned at their scheduled times */}
            {itemsWithPosition.map(({ item, itemStartMinutes, itemEndMinutes, topPosition, height, overlaps, index }) => {
              const hasOverlaps = overlaps.length > 0
              const { width, offsetPercent } = calculateOverlapLayout(hasOverlaps, index)

              return (
                  <div
                    key={item.id}
                    className="absolute left-20 cursor-pointer flex items-start gap-2 sm:gap-3"
                    style={{
                      top: `${topPosition}px`,
                      width: width,
                      height: `${height}px`,
                      marginLeft: `${offsetPercent}%`,
                    }}
                    onClick={() => setSelectedStep(item)}
                  >
                    {/* Colored pill - vertical bar like Structured */}
                    <div
                      className="flex-shrink-0 relative overflow-hidden transition-all duration-200"
                      style={{
                        width: window.innerWidth < 640 ? '48px' : '60px',
                        height: '100%',
                        backgroundColor: item.color,
                        boxShadow: `0 4px 16px ${item.color}40`,
                        borderRadius: hasOverlaps ? '16px' : '24px',
                      }}
                    >
                      {/* Icon embedded in colored pill */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          {(() => {
                            const IconComponent = item.icon ? iconMap[item.icon] : Briefcase
                            return IconComponent ? <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" /> : <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Task content - next to the pill */}
                    <div className="flex-1 min-w-0 flex items-start gap-2 sm:gap-3 py-1 sm:py-2">
                      <div className="flex-1 min-w-0">
                        {/* Time range and duration - above task name */}
                        <div className="text-[11px] sm:text-xs text-cream-25/80 font-inter mb-0.5 font-medium" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)' }}>
                          {item.scheduledTime}–{minutesToTime(itemEndMinutes)} ({item.duration}m) {item.frequency && `⟳`}
                        </div>

                        {/* Task name - bold text with shadow */}
                        <div className="text-sm sm:text-base font-semibold text-cream-25 leading-tight mb-1.5 sm:mb-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                          {item.label}
                        </div>

                        {/* Task List Badge */}
                        {item.taskListName && (
                          <div className="mb-1.5 sm:mb-2">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-cream-25/70 border border-white/20">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              {item.taskListName}
                            </span>
                          </div>
                        )}

                        {/* Breaths/subtasks completion */}
                        {item.breaths && item.breaths.length > 0 && (
                          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-cream-25/60 font-inter">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>
                              {item.breaths.filter(b => b.completed).length}/{item.breaths.length}
                            </span>
                          </div>
                        )}

                        {/* Overlapping indicator */}
                        {hasOverlaps && (
                          <div className="text-[11px] sm:text-xs text-cyan-400 font-inter mt-1">
                            Tasks overlapping
                          </div>
                        )}
                      </div>

                      {/* Focus Mode Button - only shown for current tasks */}
                      {isCurrentTask(item) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setFocusModeStep(item)
                          }}
                          className="flex-shrink-0 transition-transform hover:scale-110 touch-manipulation"
                          title="Enter Focus Mode"
                        >
                          <Target className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 animate-pulse" strokeWidth={2.5} />
                        </button>
                      )}

                      {/* Completion circle on the right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCompletion(e, item.id, item.isCompleted)
                        }}
                        className="flex-shrink-0 transition-transform hover:scale-110 touch-manipulation"
                      >
                        {item.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" strokeWidth={2.5} />
                        ) : (
                          <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-cream-25/40 hover:text-cream-25/60 transition-colors" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Styled like FloatingNav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <div
          className="flex items-center justify-around px-3 py-2.5 mx-4 mb-4 rounded-[20px]"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Inbox Button */}
          <button
            onClick={() => setIsInboxOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
          >
            <svg className="w-6 h-6 text-cream-25" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </button>

          {/* Timeline Button - Active indicator */}
          <button className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg touch-manipulation">
            <Clock className="w-6 h-6 text-cyan-400" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
          </button>

          {/* Sound Selector Button */}
          <div className="flex items-center justify-center p-1 touch-manipulation">
            <SoundSelector iconColor="text-cream-25" />
          </div>

          {/* AI Button */}
          <button className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors touch-manipulation">
            <Sparkles className="w-6 h-6 text-cream-25" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
          </button>

          {/* Three Dot Menu */}
          <div className="relative">
            <button
              onClick={() => setShowBottomMenu(!showBottomMenu)}
              className="flex flex-col items-center justify-center gap-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
            >
              <MoreVertical className="w-6 h-6 text-cream-25" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }} />
            </button>

            {/* Menu Dropdown - Opens UP */}
            {showBottomMenu && (
              <>
                <div
                  className="fixed inset-0 z-[60]"
                  onClick={() => setShowBottomMenu(false)}
                />
                <div
                  className="absolute bottom-full right-0 mb-2 w-48 rounded-2xl overflow-hidden z-[61]"
                  style={{
                    background: 'rgba(30, 30, 30, 0.98)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <button className="w-full px-4 py-3 text-left text-sm text-cream-25 hover:bg-white/10 transition-colors">
                    Navigation
                  </button>
                  <button
                    onClick={() => {
                      setShowBottomSettings(true)
                      setShowBottomMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-cream-25 hover:bg-white/10 transition-colors"
                  >
                    Settings
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add Button - Floating style */}
          <button
            onClick={() => setIsAddStepModalOpen(true)}
            className="w-12 h-12 -mt-7 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-xl flex items-center justify-center touch-manipulation"
            style={{ boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)' }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Floating Add Button */}
      <button
        onClick={() => setIsAddStepModalOpen(true)}
        className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center z-40 hover:scale-110"
        aria-label="Add new step"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Step Detail Modal */}
      {selectedStep && (
        <StepDetailModal
          step={selectedStep}
          onClose={() => setSelectedStep(null)}
          onUpdate={handleStepUpdate}
          onDelete={handleStepDelete}
          onDuplicate={handleStepDuplicate}
          onToggleBreath={handleToggleBreath}
          onMoveToInbox={handleMoveToInbox}
        />
      )}

      {/* Add Step Modal */}
      <AddStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        onSave={handleCreateStep}
        selectedDate={selectedDate}
      />

      {/* Focus Mode Modal */}
      {focusModeStep && (
        <FocusModeModal
          step={focusModeStep}
          onClose={() => setFocusModeStep(null)}
          onToggleBreath={handleToggleBreath}
        />
      )}

      {/* Inbox Slide-Over Panel */}
      {isInboxOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300"
            onClick={() => setIsInboxOpen(false)}
          />

          {/* Slide-Over Panel */}
          <div
            className="fixed left-0 top-0 bottom-0 w-full sm:w-96 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-[9999] overflow-hidden flex flex-col animate-slide-in-left"
          >
            {/* Inbox Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-cream-25"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-cream-25">Inbox</h2>
              </div>
              <button
                onClick={() => setIsInboxOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-cream-25" />
              </button>
            </div>

            {/* Inbox Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {inboxItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-cream-25/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-cream-25/60 font-inter text-sm">Your inbox is empty</p>
                  <p className="text-cream-25/40 font-inter text-xs mt-1">Unscheduled tasks will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inboxItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        // Convert inbox item to display format
                        const displayItem = {
                          id: item.id,
                          label: item.label,
                          description: item.description || "",
                          color: item.color,
                          scheduledTime: item.habit_notes?._scheduled_time || "",
                          duration: item.duration,
                          type: item.isbuildhabit ? "habit" : "activity",
                          isCompleted: item.completed || false,
                          frequency: item.frequency,
                          breaths: [], // Would need to fetch separately if needed
                        }
                        setSelectedStep(displayItem)
                        setIsInboxOpen(false)
                      }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {/* Color Indicator */}
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 4px 12px ${item.color}40`,
                          }}
                        >
                          <span className="text-white font-bold text-sm">
                            {item.label.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-cream-25 mb-1 truncate">
                            {item.label}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-cream-25/60 line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            {item.duration && (
                              <span className="text-xs text-cream-25/50 font-inter">
                                {item.duration} min
                              </span>
                            )}
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${item.color}30`,
                                color: item.color,
                              }}
                            >
                              {item.isbuildhabit ? "Habit" : "Activity"}
                            </span>
                          </div>
                        </div>

                        {/* Completion Status */}
                        {item.completed ? (
                          <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="flex-shrink-0 w-5 h-5 text-cream-25/40" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Add Task to Inbox Button */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-white/10">
              <Button
                onClick={() => {
                  setIsInboxOpen(false)
                  setIsAddStepModalOpen(true)
                }}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-cream-25 font-medium transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task to Inbox
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
