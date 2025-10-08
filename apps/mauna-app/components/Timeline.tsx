"use client"

import React, { useContext, useState, useEffect } from "react"
import { TimelineContext } from "./TimelineWrapper"
import { StepDetailModal } from "./step-detail-modal"
import { AddStepModal } from "./add-step-modal"
import { Loader2Icon, ChevronLeft, ChevronRight, Circle, CheckCircle2, Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek, addWeeks, isSameDay } from "date-fns"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

// Custom scrollbar styles - completely hidden
const scrollbarStyles = `
  .timeline-scroll {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .timeline-scroll::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

export function Timeline({ currentDate }: { currentDate: Date }) {
  const { items, loading, error, selectedDate, setSelectedDate, updateItem, refreshTimeline } = useContext(TimelineContext)
  const { user } = useAuth(AuthService)
  const { toast } = useToast()
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }))
  const [selectedStep, setSelectedStep] = useState<any>(null)
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false)

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

  const toggleCompletion = async (e: React.MouseEvent, itemId: string, currentStatus: boolean) => {
    e.stopPropagation()
    await updateItem(itemId, { isCompleted: !currentStatus })
  }

  const handleStepUpdate = async (stepId: string, updates: any) => {
    await updateItem(stepId, updates)
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
      console.log("[Timeline.handleCreateStep] Received stepData:", stepData)

      // Extract fields that are not database columns
      const { breaths, scheduledTime, lengthId, energyLevel, alerts, notes, ...coreStepFields } = stepData

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
        habit_notes: {
          _scheduled_time: scheduledTime,
          energyLevel: energyLevel,
          alerts: alerts,
          notes: notes,
        },
      }

      console.log("[Timeline.handleCreateStep] Inserting step:", stepToInsert)

      // Insert step
      const { data: newStep, error: stepError } = await databaseService.supabase
        .from("steps")
        .insert([stepToInsert])
        .select()
        .single()

      if (stepError) {
        console.error("[Timeline.handleCreateStep] Error creating step:", stepError)
        toast({ title: "Error", description: `Failed to create step: ${stepError.message}`, variant: "destructive" })
        return
      }

      console.log("[Timeline.handleCreateStep] Step created successfully:", newStep)

      // Insert breaths if any
      if (breaths && breaths.length > 0) {
        const breathsToInsert = breaths.map((breath: any) => ({
          name: breath.name,
          step_id: newStep.id,
          completed: false,
          is_running: false,
          time_estimation_seconds: breath.timeEstimationSeconds || 300,
          position: breath.position,
        }))

        console.log("[Timeline.handleCreateStep] Inserting breaths:", breathsToInsert)

        const { error: breathsError } = await databaseService.supabase
          .from("breaths")
          .insert(breathsToInsert)

        if (breathsError) {
          console.error("[Timeline.handleCreateStep] Error inserting breaths:", breathsError)
          toast({ title: "Warning", description: "Step created but some breaths failed to save.", variant: "destructive" })
        }
      }

      toast({ title: "Step Created", description: "New step added to your timeline." })
      await refreshTimeline()
    } catch (err) {
      console.error("[Timeline.handleCreateStep] Unexpected error:", err)
      toast({ title: "Error", description: "Unexpected error creating step.", variant: "destructive" })
    }
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

  // Calculate timeline bounds
  const getTimelineBounds = () => {
    if (items.length === 0) {
      return { start: 0, end: 1440 }
    }

    const startMinutes = items.map(item => timeToMinutes(item.scheduledTime))
    const endMinutes = items.map(item => timeToMinutes(item.scheduledTime) + item.duration)

    const earliestStart = Math.min(...startMinutes)
    const latestEnd = Math.max(...endMinutes)

    // Round to nearest hour
    const startHour = Math.floor(earliestStart / 60) * 60
    const endHour = Math.ceil(latestEnd / 60) * 60

    return { start: startHour, end: endHour }
  }

  const timelineBounds = getTimelineBounds()
  const timelineRangeMinutes = timelineBounds.end - timelineBounds.start

  // Generate time slots for the active range
  const generateTimeSlots = () => {
    const slots = []
    const startHour = Math.floor(timelineBounds.start / 60)
    const endHour = Math.ceil(timelineBounds.end / 60)

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        minutes: hour * 60
      })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header with Inbox, Month/Year and Week Navigation */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Inbox Button */}
          <Button
            variant="ghost"
            className="px-4 py-2 rounded-lg text-cream-25 hover:bg-white/10 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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
            <span className="font-inter text-sm">Inbox</span>
          </Button>

          {/* Month/Year */}
          <h2 className="text-2xl sm:text-3xl font-lora font-extralight text-cream-25 tracking-wider">
            {format(selectedDate, 'MMMM')} <span className="text-cream-25/60">{format(selectedDate, 'yyyy')}</span>
          </h2>
        </div>

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

      {/* Week Day Selector with Colored Dots */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 flex-shrink-0">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const dayOfWeek = format(day, 'EEE')
          const dayOfMonth = format(day, 'd')

          // Get items for this specific day (simplified - would need actual date-based filtering)
          const dayItems = items.slice(0, 4) // Show max 4 colored dots

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

              {/* Colored dots showing scheduled steps */}
              <div className="flex gap-1 mt-1">
                {dayItems.map((item, i) => (
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

      {/* Timeline Content - Vertical Layout like Structured */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Energy Level Sidebar */}
        <div className="flex-shrink-0 w-20 flex flex-col items-center pt-4">
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

        {/* Timeline Track with Vertical Scrolling */}
        <div className="flex-1 relative overflow-y-auto timeline-scroll">
          <div className="relative" style={{ minHeight: `${(timelineRangeMinutes / 60) * 96}px` }}>
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
            {items.map((item, index) => {
              const itemStartMinutes = timeToMinutes(item.scheduledTime)
              const itemEndMinutes = itemStartMinutes + item.duration
              const topPosition = ((itemStartMinutes - timelineBounds.start) / 60) * 96
              const height = (item.duration / 60) * 96

              return (
                <div
                  key={item.id}
                  className="absolute left-20"
                  style={{
                    top: `${topPosition}px`,
                    width: 'calc(100% - 80px)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Circular bubble icon */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 relative z-10"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 4px 16px ${item.color}60`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedStep(item)
                      }}
                    >
                      <span className="text-white font-bold text-lg">
                        {item.label.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Item content */}
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedStep(item)}
                    >
                      {/* Time range with duration */}
                      <div className="text-xs text-cream-25/60 font-inter mb-1">
                        {item.scheduledTime} - {minutesToTime(itemEndMinutes)} ({item.duration} min)
                      </div>

                      {/* Task name - bold and prominent */}
                      <div className="text-base font-semibold text-cream-25 mb-1 leading-tight">
                        {item.label}
                      </div>

                      {/* Breaths/subtasks completion with icon */}
                      {item.breaths && item.breaths.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-cream-25/50 font-inter mt-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>
                            {item.breaths.filter(b => b.completed).length}/{item.breaths.length}
                          </span>
                        </div>
                      )}

                      {/* Type badge */}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {item.type === 'habit' ? 'Habit' : 'Activity'}
                        </span>
                        {item.frequency && (
                          <span className="text-xs text-cream-25/40 font-inter">
                            {item.frequency}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Completion circle on the right */}
                    <button
                      onClick={(e) => toggleCompletion(e, item.id, item.isCompleted)}
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-cream-25/30 hover:text-cream-25/60 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddStepModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
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
        />
      )}

      {/* Add Step Modal */}
      <AddStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        onSave={handleCreateStep}
        selectedDate={selectedDate}
      />
    </div>
  )
}
