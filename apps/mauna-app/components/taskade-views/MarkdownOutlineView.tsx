// components/taskade-views/MarkdownOutlineView.tsx
"use client"

import React, { useState, useRef, useEffect, KeyboardEvent, useCallback, useContext } from "react"
import {
  ChevronDown, ChevronRight, Calendar, Archive, CheckCircle, Plus, Circle, Heart, Square,
  Mountain as MountainIcon, Triangle, Layers, Ruler, Footprints, Wind, GripVertical, Eraser, RefreshCw,
  Clock
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddToTodayModal } from "@/components/add-to-today-modal"
import { AddHabitToTimelineModal } from "@/components/add-habit-to-timeline-modal"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import { useToast } from "@/hooks/use-toast"
import type { Range, Mountain, Hill, Terrain, Length, Step } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"
import { ResetContext } from "@/app/vision/page"

type BulletType = "checkbox" | "bullet" | "number" | "heart"

interface MarkdownOutlineViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

interface FocusableItem {
  id: string
  type: string
  parentId?: string
  index: number
}

export function MarkdownOutlineView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: MarkdownOutlineViewProps) {
  const resetContext = useContext(ResetContext)
  const { user } = useAuth(AuthService)
  const { toast } = useToast()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<{ [key: string]: string }>({})
  const [bulletTypes, setBulletTypes] = useState<{ [key: string]: BulletType }>({})
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [showAllArchives, setShowAllArchives] = useState<{ [rangeId: string]: boolean }>({})
  const [addToTodayItem, setAddToTodayItem] = useState<{ id: string; name: string; type: string; lengthId?: string } | null>(null)
  const [addHabitToTimelineItem, setAddHabitToTimelineItem] = useState<{ id: string; name: string; color: string; frequency?: string } | null>(null)
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})

  // Build flat list of all focusable items in document order
  const buildFocusableItems = useCallback((): FocusableItem[] => {
    const items: FocusableItem[] = []
    let index = 0

    ranges.forEach((range) => {
      items.push({ id: range.id, type: 'range', index: index++ })

      if (expanded.has(range.id)) {
        range.mountains?.filter(m => !m.completed).forEach((mountain) => {
          items.push({ id: mountain.id, type: 'mountain', parentId: range.id, index: index++ })

          if (expanded.has(mountain.id)) {
            mountain.hills?.filter(h => !h.completed).forEach((hill) => {
              items.push({ id: hill.id, type: 'hill', parentId: mountain.id, index: index++ })

              if (expanded.has(hill.id)) {
                hill.terrains?.filter(t => !t.completed).forEach((terrain) => {
                  items.push({ id: terrain.id, type: 'terrain', parentId: hill.id, index: index++ })

                  if (expanded.has(terrain.id)) {
                    terrain.lengths?.filter(l => !l.completed).forEach((length) => {
                      items.push({ id: length.id, type: 'length', parentId: terrain.id, index: index++ })

                      if (expanded.has(length.id)) {
                        length.steps?.filter(s => !s.completed).forEach((step) => {
                          items.push({ id: step.id, type: 'step', parentId: length.id, index: index++ })

                          if (expanded.has(step.id)) {
                            step.breaths?.filter(b => !b.completed).forEach((breath) => {
                              items.push({ id: breath.id, type: 'breath', parentId: step.id, index: index++ })
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })

        // Add reset period fields
        const resetId = `reset-${range.id}`
        if (expanded.has(resetId)) {
          items.push({ id: `${resetId}-start`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-end`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-discover`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-define`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-ideate`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-prototype`, type: 'reset-field', parentId: resetId, index: index++ })
          items.push({ id: `${resetId}-test`, type: 'reset-field', parentId: resetId, index: index++ })
        }
      }
    })

    return items
  }, [ranges, expanded])

  // Global keyboard shortcuts (work without focusing on textarea)
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Get the target item (selected or hovered)
      const targetItemId = selectedItemId || hoveredItemId
      if (!targetItemId) return

      // Only trigger on simple key presses (no modifiers)
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return
      }

      // H: Set as habit
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault()
        handleSetTag(targetItemId, 'habit')
        toast({ title: "Habit", description: "Marked as habit" })
      }
      // A: Set as activity
      else if (e.key.toLowerCase() === 'a') {
        e.preventDefault()
        handleSetTag(targetItemId, 'activity')
        toast({ title: "Activity", description: "Marked as activity" })
      }
      // M: Set as milestone
      else if (e.key.toLowerCase() === 'm') {
        e.preventDefault()
        handleSetTag(targetItemId, 'milestone')
        toast({ title: "Milestone", description: "Marked as milestone" })
      }
      // V: Set as vision
      else if (e.key.toLowerCase() === 'v') {
        e.preventDefault()
        handleSetTag(targetItemId, 'vision')
        toast({ title: "Vision", description: "Marked as vision" })
      }
      // X: Toggle archive
      else if (e.key.toLowerCase() === 'x') {
        e.preventDefault()
        handleToggleArchive(targetItemId)
        toast({ title: "Archive", description: "Toggled archive status" })
      }
      // E: Focus and edit the item
      else if (e.key.toLowerCase() === 'e') {
        e.preventDefault()
        focusItem(targetItemId)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [selectedItemId, hoveredItemId, toast])

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const cycleBulletType = (itemId: string) => {
    const currentType = bulletTypes[itemId] || "checkbox"
    const types: BulletType[] = ["checkbox", "bullet", "number", "heart"]
    const currentIndex = types.indexOf(currentType)
    const nextType = types[(currentIndex + 1) % types.length]
    setBulletTypes({ ...bulletTypes, [itemId]: nextType })
  }

  const handleAddItem = async (afterItemId: string) => {
    if (onUpdateItem) {
      await onUpdateItem({
        action: 'add-after',
        id: afterItemId,
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', itemId)
  }

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItemId(itemId)
  }

  const handleDragLeave = () => {
    setDragOverItemId(null)
  }

  const handleDrop = async (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault()
    if (draggedItemId && draggedItemId !== dropTargetId && onUpdateItem) {
      await onUpdateItem({
        action: 'reorder',
        draggedId: draggedItemId,
        targetId: dropTargetId,
      })
    }
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }

  const DragHandleAndAddButton = ({ itemId, visible }: { itemId: string; visible: boolean }) => (
    <div className={`flex items-center gap-1 transition-opacity ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, itemId)}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing hover:bg-white/10 rounded p-0.5 transition-colors"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-cream-25/40" />
      </button>
      <button
        onClick={() => handleAddItem(itemId)}
        className="hover:bg-white/10 rounded p-0.5 transition-colors"
        title="Add item below"
      >
        <Plus className="h-4 w-4 text-cream-25/40" />
      </button>
    </div>
  )

  const BulletIcon = ({ itemId, index = 0, checked = false, onChange }: { itemId: string; index?: number; checked?: boolean; onChange?: () => void }) => {
    const bulletType = bulletTypes[itemId] || "checkbox"

    const handleClick = (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey) {
        // Cmd/Ctrl + click cycles bullet type
        e.preventDefault()
        e.stopPropagation()
        cycleBulletType(itemId)
      } else {
        // Normal click toggles completion
        onChange?.()
      }
    }

    switch (bulletType) {
      case "checkbox":
        return (
          <div
            onClick={handleClick}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {checked ? (
              <CheckCircle className="h-4 w-4 text-green-400 fill-green-400/20" />
            ) : (
              <Square className="h-4 w-4 text-cream-25/40" />
            )}
          </div>
        )
      case "bullet":
        return (
          <div
            onClick={handleClick}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Circle className="h-2 w-2 text-cream-25/60 fill-cream-25/60 mt-1.5" />
          </div>
        )
      case "number":
        return (
          <div
            onClick={handleClick}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity min-w-[20px]"
          >
            <span className="text-sm text-cream-25/60 font-medium">{index + 1}.</span>
          </div>
        )
      case "heart":
        return (
          <div
            onClick={handleClick}
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          >
            {checked ? (
              <Heart className="h-4 w-4 text-red-400 fill-red-400" />
            ) : (
              <Heart className="h-4 w-4 text-cream-25/40" />
            )}
          </div>
        )
      default:
        return (
          <Circle className="h-2 w-2 text-cream-25/60 fill-cream-25/60 flex-shrink-0 mt-1.5" />
        )
    }
  }

  const focusItem = (id: string) => {
    setFocusedItemId(id)
    setTimeout(() => {
      const input = inputRefs.current[id]
      if (input) {
        input.focus()
        // Move cursor to end
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }, 0)
  }

  const handleIndent = async (itemId: string) => {
    // Indent (increase hierarchy level / move right)
    if (onUpdateItem) {
      await onUpdateItem({
        id: itemId,
        action: 'indent',
      })
    }
  }

  const handleOutdent = async (itemId: string) => {
    // Outdent (decrease hierarchy level / move left)
    if (onUpdateItem) {
      await onUpdateItem({
        id: itemId,
        action: 'outdent',
      })
    }
  }

  const handleSetTag = async (itemId: string, tag: string) => {
    if (onUpdateItem) {
      await onUpdateItem({
        id: itemId,
        action: 'set-tag',
        tag,
      })
    }
  }

  const handleToggleArchive = async (itemId: string) => {
    if (onUpdateItem) {
      await onUpdateItem({
        id: itemId,
        action: 'toggle-archive',
      })
    }
  }

  const handleAddToTimeline = async (data: { time: string; duration: number; date: string; taskListId?: string | null }) => {
    if (!user?.id || !addToTodayItem) return

    try {
      const stepData = {
        label: addToTodayItem.name,
        description: `Added from ${addToTodayItem.type}`,
        tag: "vision", // Vision items get 'vision' tag
        color: "#00D9FF",
        duration: data.duration * 60000, // Convert to milliseconds
        frequency: "", // Once (activity)
        scheduledTime: data.time,
        scheduledDate: data.date,
        energyLevel: 3,
        lengthId: addToTodayItem.lengthId || null,
        taskListId: data.taskListId || null,
        alerts: [],
        notes: "",
        breaths: [],
        completed: false,
        isbuildhabit: false,
      }

      // Insert step
      const { data: newStep, error: stepError } = await databaseService.supabase
        .from("steps")
        .insert([{
          label: stepData.label,
          description: stepData.description,
          tag: stepData.tag,
          color: stepData.color,
          duration: stepData.duration,
          frequency: stepData.frequency,
          completed: stepData.completed,
          isbuildhabit: stepData.isbuildhabit,
          user_id: user.id,
          length_id: stepData.lengthId,
          task_list_id: stepData.taskListId,
          start_date: stepData.scheduledDate,
          habit_notes: {
            _scheduled_time: stepData.scheduledTime,
            energyLevel: stepData.energyLevel,
            alerts: stepData.alerts,
            notes: stepData.notes,
          },
        }])
        .select()
        .single()

      if (stepError) {
        toast({ title: "Error", description: `Failed to add to timeline: ${stepError.message}`, variant: "destructive" })
        return
      }

      const successMessage = data.taskListId
        ? `"${addToTodayItem.name}" has been added to your timeline for ${data.date} and linked to the selected task list`
        : `"${addToTodayItem.name}" has been added to your timeline for ${data.date}`

      toast({ title: "Added to Timeline", description: successMessage })
      setAddToTodayItem(null)
    } catch (err) {
      toast({ title: "Error", description: "Unexpected error adding to timeline.", variant: "destructive" })
    }
  }

  const handleAddHabitToTimeline = async (data: { startDate: string; endDate: string; daysOfWeek: string[]; time: string; duration: number }) => {
    if (!user?.id || !addHabitToTimelineItem) return

    try {
      const { startDate, endDate, daysOfWeek, time, duration } = data

      // Create timeline entries for each selected day between start and end date
      const start = new Date(startDate)
      const end = new Date(endDate)
      const entries = []

      // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = { S: 0, M: 1, T: 2, W: 3, Th: 4, F: 5, Sa: 6 }

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay()
        const dayNames = Object.keys(dayMap).filter(key => dayMap[key] === dayOfWeek)

        // Check if this day of week is selected
        if (dayNames.some(dayName => daysOfWeek.includes(dayName))) {
          entries.push({
            label: addHabitToTimelineItem.name,
            description: `Habit from vision board`,
            tag: "habit",
            color: addHabitToTimelineItem.color || "#00D9FF",
            duration: duration * 60000,
            frequency: addHabitToTimelineItem.frequency || "Daily",
            completed: false,
            isbuildhabit: false,
            user_id: user.id,
            start_date: date.toISOString().split('T')[0],
            habit_notes: {
              _scheduled_time: time,
              energyLevel: 3,
              alerts: [],
              notes: "",
            },
          })
        }
      }

      if (entries.length === 0) {
        toast({ title: "No Entries", description: "No matching days found in the selected date range.", variant: "destructive" })
        return
      }

      // Batch insert all entries
      const { error: insertError } = await databaseService.supabase
        .from("steps")
        .insert(entries)

      if (insertError) {
        toast({ title: "Error", description: `Failed to add habit to timeline: ${insertError.message}`, variant: "destructive" })
        return
      }

      toast({
        title: "Added to Timeline",
        description: `Created ${entries.length} timeline entries for "${addHabitToTimelineItem.name}"`
      })
      setAddHabitToTimelineItem(null)
    } catch (err) {
      console.error('Error adding habit to timeline:', err)
      toast({ title: "Error", description: "Unexpected error adding habit to timeline.", variant: "destructive" })
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, itemId: string) => {
    const focusableItems = buildFocusableItems()
    const currentIndex = focusableItems.findIndex(item => item.id === itemId)

    if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) {
        // Shift+Tab: Outdent (move left in hierarchy)
        handleOutdent(itemId)
      } else {
        // Tab: Indent (move right in hierarchy)
        handleIndent(itemId)
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
      // Cmd+H: Set as habit
      e.preventDefault()
      if (e.shiftKey) {
        // Cmd+Shift+H: Set as activity
        handleSetTag(itemId, 'activity')
      } else {
        // Cmd+H: Set as habit
        handleSetTag(itemId, 'habit')
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
      // Cmd+M: Set as milestone
      e.preventDefault()
      handleSetTag(itemId, 'milestone')
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      // Cmd+V: Set as vision (but not Cmd+V for paste)
      if (!e.shiftKey) {
        // Skip if it's the paste command
      } else {
        e.preventDefault()
        handleSetTag(itemId, 'vision')
      }
    } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
      // Cmd+Shift+A: Toggle archive
      e.preventDefault()
      handleToggleArchive(itemId)
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      // Cmd+Enter: Add new item after current
      e.preventDefault()
      handleAddItem(itemId)
    } else if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
      // Cmd+\ or Ctrl+\: Toggle expand/collapse
      e.preventDefault()
      toggleExpanded(itemId)
    } else if ((e.metaKey || e.ctrlKey) && e.key === '.') {
      // Cmd+. or Ctrl+.: Cycle bullet type
      e.preventDefault()
      cycleBulletType(itemId)
    } else if (e.key === 'ArrowUp' && !e.shiftKey) {
      e.preventDefault()
      if (currentIndex > 0) {
        const prevItem = focusableItems[currentIndex - 1]
        focusItem(prevItem.id)
      }
    } else if (e.key === 'ArrowDown' && !e.shiftKey) {
      e.preventDefault()
      if (currentIndex < focusableItems.length - 1) {
        const nextItem = focusableItems[currentIndex + 1]
        focusItem(nextItem.id)
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Save current and move to next (or create new item in future)
      handleBlur(itemId)
      if (currentIndex < focusableItems.length - 1) {
        const nextItem = focusableItems[currentIndex + 1]
        focusItem(nextItem.id)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      // Cancel editing
      const textarea = e.currentTarget
      textarea.blur()
      setFocusedItemId(null)
    }
  }

  // Debounced auto-save without page reload
  const debouncedSave = useRef<{ [key: string]: NodeJS.Timeout }>({})

  const handleAutoSave = (itemId: string, value: string) => {
    // Clear existing timeout for this item
    if (debouncedSave.current[itemId]) {
      clearTimeout(debouncedSave.current[itemId])
    }

    // Set new timeout for auto-save after 1 second of inactivity
    debouncedSave.current[itemId] = setTimeout(async () => {
      if (onUpdateItem) {
        try {
          // Parse itemId to determine update type
          if (itemId.startsWith('reset-') && itemId.includes('-')) {
            const parts = itemId.split('-')
            if (parts.length >= 3) {
              const rangeId = parts[1]
              const field = parts.slice(2).join('-')
              await onUpdateItem({
                type: 'reset-period',
                rangeId,
                field,
                value,
              })
            }
          } else if (itemId.startsWith('archive-')) {
            await onUpdateItem({
              type: 'archive',
              id: itemId,
              field: 'item_name',
              value,
            })
          } else {
            // Regular item update
            await onUpdateItem({
              id: itemId,
              field: 'name',
              value,
            })
          }
        } catch (error) {
          console.error('Auto-save error:', error)
          // Silently fail to avoid disrupting user experience
        }
      }
    }, 1000) // Auto-save after 1 second of no typing
  }

  const handleBlur = async (itemId: string) => {
    // Clear debounce timeout on blur and save immediately
    if (debouncedSave.current[itemId]) {
      clearTimeout(debouncedSave.current[itemId])
      delete debouncedSave.current[itemId]
    }

    const newValue = editingValues[itemId]
    if (newValue !== undefined && onUpdateItem) {
      try {
        // Parse itemId to determine update type
        if (itemId.startsWith('reset-') && itemId.includes('-')) {
          const parts = itemId.split('-')
          if (parts.length >= 3) {
            const rangeId = parts[1]
            const field = parts.slice(2).join('-')
            await onUpdateItem({
              type: 'reset-period',
              rangeId,
              field,
              value: newValue,
            })
          }
        } else if (itemId.startsWith('archive-')) {
          await onUpdateItem({
            type: 'archive',
            id: itemId,
            field: 'item_name',
            value: newValue,
          })
        } else {
          // Regular item update
          await onUpdateItem({
            id: itemId,
            field: 'name',
            value: newValue,
          })
        }
      } catch (error) {
        console.error('Save on blur error:', error)
        // Silently fail to avoid disrupting user experience
      }
    }
  }

  const EditableText = ({
    id,
    value,
    placeholder = "Type something...",
    className = "",
    prefix = "",
    multiline = false
  }: {
    id: string
    value: string
    placeholder?: string
    className?: string
    prefix?: string
    multiline?: boolean
  }) => {
    const isFocused = focusedItemId === id
    const displayValue = editingValues[id] !== undefined ? editingValues[id] : value
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Auto-resize on mount and when value changes
    useEffect(() => {
      const textarea = textareaRef.current || inputRefs.current[id]
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = textarea.scrollHeight + 'px'
      }
    }, [displayValue, id])

    return (
      <div className="flex-1 relative group">
        {prefix && <span className={className}>{prefix}</span>}
        <textarea
          ref={(el) => {
            inputRefs.current[id] = el
            textareaRef.current = el
          }}
          value={displayValue}
          placeholder={placeholder}
          onChange={(e) => {
            const newValue = e.target.value
            setEditingValues({ ...editingValues, [id]: newValue })
            // Trigger auto-save after 1 second of inactivity
            handleAutoSave(id, newValue)
          }}
          onFocus={() => setFocusedItemId(id)}
          onBlur={() => {
            handleBlur(id)
            if (focusedItemId === id) setFocusedItemId(null)
          }}
          onKeyDown={(e) => handleKeyDown(e, id)}
          className={`
            ${className}
            bg-transparent border-none outline-none resize-none w-full
            ${isFocused ? 'bg-white/5 rounded px-1' : 'px-1'}
            hover:bg-white/5 hover:rounded
            transition-colors
          `}
          rows={1}
          style={{
            overflow: 'hidden',
            minHeight: multiline ? '3em' : '1.5em',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = Math.min(target.scrollHeight, 200) + 'px'
          }}
        />
      </div>
    )
  }

  const renderResetPeriod = (rangeId: string, indent: number) => {
    const period = currentPeriods[rangeId]
    const isExpanded = expanded.has(`reset-${rangeId}`)
    const id = `reset-${rangeId}`

    return (
      <div className="mb-3 font-mono" style={{ marginLeft: `${indent * 24}px` }}>
        <div
          className="flex items-start gap-2 py-2 px-3 hover:bg-white/5 rounded transition-colors cursor-pointer bg-blue-500/10 border border-blue-500/20"
          onClick={() => toggleExpanded(id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-300" /> : <ChevronRight className="h-4 w-4 text-blue-300" />}
            <Calendar className="h-4 w-4 text-blue-300 flex-shrink-0" />
            <span className="font-bold text-blue-300">Reset Period</span>
            {period?.start_date && period?.end_date && (
              <span className="text-xs text-cream-25/70">
                {new Date(period.start_date).toLocaleDateString()} → {new Date(period.end_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 ml-10 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-cream-25/70 font-semibold w-24">Start:</span>
              <EditableText
                id={`${id}-start`}
                value={period?.start_date ? new Date(period.start_date).toLocaleDateString() : ""}
                placeholder="Add start date"
                className="text-cream-25"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cream-25/70 font-semibold w-24">End:</span>
              <EditableText
                id={`${id}-end`}
                value={period?.end_date ? new Date(period.end_date).toLocaleDateString() : ""}
                placeholder="Add end date"
                className="text-cream-25"
              />
            </div>
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="text-cream-25/70 font-semibold mb-1 text-xs">DDDPT Framework</div>
              <div className="space-y-1 ml-4">
                <div className="flex items-start gap-2">
                  <span className="text-purple-300 font-semibold w-24 text-xs">Discover:</span>
                  <EditableText
                    id={`${id}-discover`}
                    value={period?.discover || ""}
                    placeholder="What are you discovering?"
                    className="text-cream-25/80 text-xs"
                    multiline
                  />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-300 font-semibold w-24 text-xs">Define:</span>
                  <EditableText
                    id={`${id}-define`}
                    value={period?.define || ""}
                    placeholder="What are you defining?"
                    className="text-cream-25/80 text-xs"
                    multiline
                  />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-300 font-semibold w-24 text-xs">Ideate:</span>
                  <EditableText
                    id={`${id}-ideate`}
                    value={period?.ideate || ""}
                    placeholder="What ideas are you exploring?"
                    className="text-cream-25/80 text-xs"
                    multiline
                  />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-300 font-semibold w-24 text-xs">Prototype:</span>
                  <EditableText
                    id={`${id}-prototype`}
                    value={period?.prototype || ""}
                    placeholder="What are you prototyping?"
                    className="text-cream-25/80 text-xs"
                    multiline
                  />
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-300 font-semibold w-24 text-xs">Test:</span>
                  <EditableText
                    id={`${id}-test`}
                    value={period?.test || ""}
                    placeholder="What are you testing?"
                    className="text-cream-25/80 text-xs"
                    multiline
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 ml-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  resetContext?.clearCurrentPeriod(rangeId)
                }}
                className="text-xs bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
              >
                <Eraser className="h-3 w-3 mr-1" />
                Clear DDDPT
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  resetContext?.startNewPeriod(rangeId)
                }}
                className="text-xs bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-300"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Start New Week
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderArchives = (rangeId: string, indent: number) => {
    const rangeArchive = archives[rangeId]
    const previousResets = rangeArchive?.previousResets || []
    const hasData = previousResets.length > 0
    const isExpanded = expanded.has(`archive-${rangeId}`)
    const showAll = showAllArchives[rangeId] || false
    const INITIAL_DISPLAY_COUNT = 4

    // Determine which periods to show
    const periodsToShow = showAll ? previousResets : previousResets.slice(0, INITIAL_DISPLAY_COUNT)
    const hasMore = previousResets.length > INITIAL_DISPLAY_COUNT

    // Group completed items by reset_period_id
    const itemsByPeriod: Record<string, ArchivedItem[]> = {}
    const completed = rangeArchive?.completed || {}
    const allCompletedItems = Object.values(completed).flat()
    allCompletedItems.forEach((item) => {
      if (item.reset_period_id) {
        if (!itemsByPeriod[item.reset_period_id]) {
          itemsByPeriod[item.reset_period_id] = []
        }
        itemsByPeriod[item.reset_period_id].push(item)
      }
    })

    return (
      <div className="mb-3 font-mono" style={{ marginLeft: `${indent * 24}px` }}>
        <div
          className="flex items-start gap-2 py-2 px-3 hover:bg-white/5 rounded transition-colors cursor-pointer bg-green-500/10 border border-green-500/20"
          onClick={() => toggleExpanded(`archive-${rangeId}`)}
        >
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-green-300" /> : <ChevronRight className="h-4 w-4 text-green-300" />}
            <Archive className="h-4 w-4 text-green-300 flex-shrink-0" />
            <span className="font-bold text-green-300">Past Weeks (Archive)</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
              {previousResets.length}
            </Badge>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 ml-10 space-y-3">
            {hasData ? (
              <>
                {periodsToShow.map((period) => {
                  const periodExpanded = expanded.has(`archive-period-${period.id}`)
                  const periodItems = itemsByPeriod[period.id] || []

                  return (
                    <div key={period.id} className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded px-2 py-1 transition-colors"
                        onClick={() => toggleExpanded(`archive-period-${period.id}`)}
                      >
                        {periodExpanded ? <ChevronDown className="h-4 w-4 text-green-300" /> : <ChevronRight className="h-4 w-4 text-green-300" />}
                        <Calendar className="h-4 w-4 text-green-300 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-green-300">
                            {new Date(period.start_date).toLocaleDateString()} → {new Date(period.end_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-cream-25/60 mt-0.5">
                            {periodItems.length} {periodItems.length === 1 ? 'item' : 'items'} completed
                          </div>
                        </div>
                      </div>

                      {periodExpanded && (
                        <div className="mt-3 ml-6 space-y-3">
                          {/* DDDPT Notes */}
                          {(period.discover || period.define || period.ideate || period.prototype || period.test) && (
                            <div className="bg-white/5 rounded p-3 border border-white/10">
                              <div className="text-xs text-cream-25/70 font-semibold mb-2">DDDPT Framework Notes:</div>
                              <div className="space-y-1 text-xs">
                                {period.discover && (
                                  <div>
                                    <span className="text-purple-300 font-semibold">Discover:</span>
                                    <span className="text-cream-25/80 ml-2">{period.discover}</span>
                                  </div>
                                )}
                                {period.define && (
                                  <div>
                                    <span className="text-blue-300 font-semibold">Define:</span>
                                    <span className="text-cream-25/80 ml-2">{period.define}</span>
                                  </div>
                                )}
                                {period.ideate && (
                                  <div>
                                    <span className="text-green-300 font-semibold">Ideate:</span>
                                    <span className="text-cream-25/80 ml-2">{period.ideate}</span>
                                  </div>
                                )}
                                {period.prototype && (
                                  <div>
                                    <span className="text-yellow-300 font-semibold">Prototype:</span>
                                    <span className="text-cream-25/80 ml-2">{period.prototype}</span>
                                  </div>
                                )}
                                {period.test && (
                                  <div>
                                    <span className="text-orange-300 font-semibold">Test:</span>
                                    <span className="text-cream-25/80 ml-2">{period.test}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Completed Items */}
                          {periodItems.length > 0 ? (
                            <div className="space-y-2">
                              <div className="text-xs text-cream-25/70 font-semibold">Completed Items:</div>
                              {periodItems.map((item) => (
                                <div
                                  key={`${item.item_id}-${item.completed_at}`}
                                  className="group flex items-start gap-2 py-2 px-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-300 flex-shrink-0 mt-1" />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm text-cream-25 font-medium">{item.item_name}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70">
                                        {item.item_type}
                                      </Badge>
                                      <span className="text-xs text-cream-25/50">
                                        {new Date(item.completed_at).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleToggleArchive(item.item_id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-white/10 rounded p-1"
                                    title="Restore to current period"
                                  >
                                    <Archive className="h-3 w-3 text-cream-25/60" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-cream-25/50 italic text-xs">No items completed in this period.</div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Show More/Less Button */}
                {hasMore && !showAll && (
                  <button
                    onClick={() => setShowAllArchives({ ...showAllArchives, [rangeId]: true })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors w-full justify-center text-sm font-medium text-green-300"
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span>Show More ({previousResets.length - INITIAL_DISPLAY_COUNT} older periods)</span>
                  </button>
                )}

                {showAll && hasMore && (
                  <button
                    onClick={() => setShowAllArchives({ ...showAllArchives, [rangeId]: false })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors w-full justify-center text-sm font-medium text-green-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span>Show Less</span>
                  </button>
                )}
              </>
            ) : (
              <div className="text-cream-25/50 italic text-sm">No archived periods yet.</div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderBreath = (breath: any, indent: number, index: number = 0) => {
    const isHovered = hoveredItemId === breath.id
    const isSelected = selectedItemId === breath.id
    const isDragging = draggedItemId === breath.id
    const isDragOver = dragOverItemId === breath.id

    return (
      <div
        key={breath.id}
        ref={(el) => { itemRefs.current[breath.id] = el }}
        className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
          isDragging ? 'opacity-50' : ''
        } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
          isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
        }`}
        style={{ marginLeft: `${indent * 24}px` }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName !== 'TEXTAREA') {
            setSelectedItemId(breath.id)
          }
        }}
        onMouseEnter={() => setHoveredItemId(breath.id)}
        onMouseLeave={() => setHoveredItemId(null)}
        onDragOver={(e) => handleDragOver(e, breath.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, breath.id)}
      >
        <DragHandleAndAddButton itemId={breath.id} visible={isHovered} />
        <Wind className="h-3 w-3 text-purple-400 flex-shrink-0 mr-1" />
        <BulletIcon
          itemId={breath.id}
          index={index}
          checked={false}
          onChange={() => onUpdateItem?.({ id: breath.id, completed: true })}
        />
        <EditableText
          id={breath.id}
          value={breath.label}
          placeholder="New breath..."
          className="text-sm text-cream-25/80"
        />
      </div>
    )
  }

  const renderStep = (step: Step, indent: number, index: number = 0) => {
    const isExpanded = expanded.has(step.id)
    const hasBreaths = step.breaths && step.breaths.filter(b => !b.completed).length > 0
    const isHovered = hoveredItemId === step.id
    const isSelected = selectedItemId === step.id
    const isDragging = draggedItemId === step.id
    const isDragOver = dragOverItemId === step.id

    return (
      <div key={step.id}>
        <div
          ref={(el) => { itemRefs.current[step.id] = el }}
          className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
            isDragging ? 'opacity-50' : ''
          } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
            isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
          }`}
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.tagName !== 'TEXTAREA') {
              setSelectedItemId(step.id)
            }
          }}
          onMouseEnter={() => setHoveredItemId(step.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onDragOver={(e) => handleDragOver(e, step.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, step.id)}
        >
          {hasBreaths && (
            <button onClick={() => toggleExpanded(step.id)} className="flex-shrink-0">
              {isExpanded ? <ChevronDown className="h-3 w-3 text-cream-25/50" /> : <ChevronRight className="h-3 w-3 text-cream-25/50" />}
            </button>
          )}
          <DragHandleAndAddButton itemId={step.id} visible={isHovered} />
          <Footprints className="h-3 w-3 text-blue-400 flex-shrink-0 mr-1" />
          <BulletIcon
            itemId={step.id}
            index={index}
            checked={false}
            onChange={() => onUpdateItem?.({ id: step.id, completed: true })}
          />
          <EditableText
            id={step.id}
            value={step.label}
            placeholder="New step..."
            className="text-sm text-cream-25 font-medium"
          />
          {step.tag && (
            <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70 flex-shrink-0">
              {step.tag}
            </Badge>
          )}
          {step.lifeline && (
            <span className="text-xs text-orange-400 ml-auto flex-shrink-0">
              {new Date(step.lifeline).toLocaleDateString()}
            </span>
          )}
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Check if this step is marked as a habit
                const isHabit = step.tag === 'habit'

                if (isHabit) {
                  // Open habit modal
                  setAddHabitToTimelineItem({
                    id: step.id,
                    name: step.label,
                    color: "#00D9FF",
                    frequency: "Daily"
                  })
                } else {
                  // Open activity modal
                  // Find the parent length to link to
                  const getParentLength = (stepId: string): string | undefined => {
                    for (const range of ranges) {
                      for (const mountain of range.mountains || []) {
                        for (const hill of mountain.hills || []) {
                          for (const terrain of hill.terrains || []) {
                            for (const length of terrain.lengths || []) {
                              if (length.steps?.some(s => s.id === stepId)) {
                                return length.id
                              }
                            }
                          }
                        }
                      }
                    }
                    return undefined
                  }
                  setAddToTodayItem({
                    id: step.id,
                    name: step.label,
                    type: "Step",
                    lengthId: getParentLength(step.id)
                  })
                }
              }}
              className="ml-2 p-1.5 hover:bg-cyan-500/20 rounded-lg transition-colors flex-shrink-0"
              title={step.tag === 'habit' ? "Add Habit to Timeline" : "Add to Timeline"}
            >
              <Clock className="h-4 w-4 text-cyan-400" />
            </button>
          )}
        </div>
        {isExpanded && hasBreaths && (
          <div className="mt-1">
            {step.breaths!.filter(b => !b.completed).map((breath, idx) => renderBreath(breath, indent + 1, idx))}
          </div>
        )}
      </div>
    )
  }

  const renderLength = (length: Length, indent: number) => {
    const isExpanded = expanded.has(length.id)
    const hasSteps = length.steps && length.steps.filter(s => !s.completed).length > 0
    const isHovered = hoveredItemId === length.id
    const isSelected = selectedItemId === length.id
    const isDragging = draggedItemId === length.id
    const isDragOver = dragOverItemId === length.id

    return (
      <div key={length.id} className="mb-1">
        <div
          ref={(el) => { itemRefs.current[length.id] = el }}
          className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
            isDragging ? 'opacity-50' : ''
          } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
            isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
          }`}
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.tagName !== 'TEXTAREA') {
              setSelectedItemId(length.id)
            }
          }}
          onMouseEnter={() => setHoveredItemId(length.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onDragOver={(e) => handleDragOver(e, length.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, length.id)}
        >
          <button onClick={() => toggleExpanded(length.id)} className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-cream-25/70" /> : <ChevronRight className="h-4 w-4 text-cream-25/70" />}
          </button>
          <DragHandleAndAddButton itemId={length.id} visible={isHovered} />
          <Ruler className="h-4 w-4 text-green-400 flex-shrink-0" />
          <EditableText
            id={length.id}
            value={length.name}
            placeholder="New length..."
            className="text-base text-cream-25 font-semibold"
          />
          {length.tag && (
            <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70 flex-shrink-0">
              {length.tag}
            </Badge>
          )}
          {hasSteps && (
            <Badge variant="secondary" className="bg-white/10 text-cream-25/60 text-xs ml-auto flex-shrink-0">
              {length.steps!.filter(s => !s.completed).length}
            </Badge>
          )}
        </div>
        {isExpanded && hasSteps && (
          <div className="mt-1">
            {length.steps!.filter(s => !s.completed).map((step, idx) => renderStep(step, indent + 1, idx))}
          </div>
        )}
      </div>
    )
  }

  const renderTerrain = (terrain: Terrain, indent: number) => {
    const isExpanded = expanded.has(terrain.id)
    const hasLengths = terrain.lengths && terrain.lengths.filter(l => !l.completed).length > 0
    const isHovered = hoveredItemId === terrain.id
    const isSelected = selectedItemId === terrain.id
    const isDragging = draggedItemId === terrain.id
    const isDragOver = dragOverItemId === terrain.id

    return (
      <div key={terrain.id} className="mb-2">
        <div
          ref={(el) => { itemRefs.current[terrain.id] = el }}
          className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
            isDragging ? 'opacity-50' : ''
          } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
            isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
          }`}
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.tagName !== 'TEXTAREA') {
              setSelectedItemId(terrain.id)
            }
          }}
          onMouseEnter={() => setHoveredItemId(terrain.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onDragOver={(e) => handleDragOver(e, terrain.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, terrain.id)}
        >
          <button onClick={() => toggleExpanded(terrain.id)} className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-4 w-4 text-cream-25" /> : <ChevronRight className="h-4 w-4 text-cream-25" />}
          </button>
          <DragHandleAndAddButton itemId={terrain.id} visible={isHovered} />
          <Layers className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          <EditableText
            id={terrain.id}
            value={terrain.name}
            placeholder="New terrain..."
            className="text-lg text-cream-25 font-bold"
          />
          {terrain.tag && (
            <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70 flex-shrink-0">
              {terrain.tag}
            </Badge>
          )}
          {hasLengths && (
            <Badge variant="secondary" className="bg-white/10 text-cream-25/60 text-xs ml-auto flex-shrink-0">
              {terrain.lengths!.filter(l => !l.completed).length}
            </Badge>
          )}
        </div>
        {isExpanded && hasLengths && (
          <div className="mt-1">
            {terrain.lengths!.filter(l => !l.completed).map((length) => renderLength(length, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderHill = (hill: Hill, indent: number) => {
    const isExpanded = expanded.has(hill.id)
    const hasTerrains = hill.terrains && hill.terrains.filter(t => !t.completed).length > 0
    const isHovered = hoveredItemId === hill.id
    const isSelected = selectedItemId === hill.id
    const isDragging = draggedItemId === hill.id
    const isDragOver = dragOverItemId === hill.id

    return (
      <div key={hill.id} className="mb-3">
        <div
          ref={(el) => { itemRefs.current[hill.id] = el }}
          className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
            isDragging ? 'opacity-50' : ''
          } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
            isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
          }`}
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.tagName !== 'TEXTAREA') {
              setSelectedItemId(hill.id)
            }
          }}
          onMouseEnter={() => setHoveredItemId(hill.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onDragOver={(e) => handleDragOver(e, hill.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, hill.id)}
        >
          <button onClick={() => toggleExpanded(hill.id)} className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-5 w-5 text-cream-25" /> : <ChevronRight className="h-5 w-5 text-cream-25" />}
          </button>
          <DragHandleAndAddButton itemId={hill.id} visible={isHovered} />
          <Triangle className="h-4 w-4 text-orange-400 flex-shrink-0" />
          <EditableText
            id={hill.id}
            value={hill.name}
            placeholder="New hill..."
            className="text-xl text-cream-25 font-bold"
          />
          {hill.tag && (
            <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70 flex-shrink-0">
              {hill.tag}
            </Badge>
          )}
          {hasTerrains && (
            <Badge variant="secondary" className="bg-white/10 text-cream-25/60 text-xs ml-auto flex-shrink-0">
              {hill.terrains!.filter(t => !t.completed).length}
            </Badge>
          )}
        </div>
        {isExpanded && hasTerrains && (
          <div className="mt-1">
            {hill.terrains!.filter(t => !t.completed).map((terrain) => renderTerrain(terrain, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderMountain = (mountain: Mountain, rangeId: string, indent: number) => {
    const isExpanded = expanded.has(mountain.id)
    const hasHills = mountain.hills && mountain.hills.filter(h => !h.completed).length > 0
    const isHovered = hoveredItemId === mountain.id
    const isSelected = selectedItemId === mountain.id
    const isDragging = draggedItemId === mountain.id
    const isDragOver = dragOverItemId === mountain.id

    return (
      <div key={mountain.id} className="mb-4">
        <div
          ref={(el) => { itemRefs.current[mountain.id] = el }}
          className={`flex items-center gap-2 py-1 px-2 rounded transition-all font-mono group cursor-pointer ${
            isDragging ? 'opacity-50' : ''
          } ${isDragOver ? 'bg-vibrant-blue/20 border-t-2 border-vibrant-blue' : ''} ${
            isSelected ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'hover:bg-white/5'
          }`}
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={(e) => {
            // Only set selected if not clicking on textarea
            const target = e.target as HTMLElement
            if (target.tagName !== 'TEXTAREA') {
              setSelectedItemId(mountain.id)
            }
          }}
          onMouseEnter={() => setHoveredItemId(mountain.id)}
          onMouseLeave={() => setHoveredItemId(null)}
          onDragOver={(e) => handleDragOver(e, mountain.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, mountain.id)}
        >
          <button onClick={() => toggleExpanded(mountain.id)} className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-5 w-5 text-cream-25" /> : <ChevronRight className="h-5 w-5 text-cream-25" />}
          </button>
          <DragHandleAndAddButton itemId={mountain.id} visible={isHovered} />
          <MountainIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
          <EditableText
            id={mountain.id}
            value={mountain.name}
            placeholder="New mountain..."
            className="text-2xl text-cream-25 font-bold"
          />
          {mountain.tag && (
            <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25/70 flex-shrink-0">
              {mountain.tag}
            </Badge>
          )}
          {hasHills && (
            <Badge variant="secondary" className="bg-white/10 text-cream-25/60 text-xs ml-auto flex-shrink-0">
              {mountain.hills!.filter(h => !h.completed).length}
            </Badge>
          )}
        </div>
        {isExpanded && hasHills && (
          <div className="mt-2">
            {mountain.hills!.filter(h => !h.completed).map((hill) => renderHill(hill, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderRange = (range: Range) => {
    const isExpanded = expanded.has(range.id)
    const hasMountains = range.mountains && range.mountains.filter(m => !m.completed).length > 0

    return (
      <div key={range.id} className="mb-6 border-b border-white/10 pb-6">
        <div
          ref={(el) => { itemRefs.current[range.id] = el }}
          className="flex items-center gap-3 py-2 px-3 hover:bg-white/5 rounded transition-colors bg-vibrant-blue/10 border border-vibrant-blue/20 font-mono group"
        >
          <button onClick={() => toggleExpanded(range.id)} className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-6 w-6 text-vibrant-blue" /> : <ChevronRight className="h-6 w-6 text-vibrant-blue" />}
          </button>
          <EditableText
            id={range.id}
            value={range.name}
            placeholder="New range..."
            className="text-3xl text-vibrant-blue font-bold"
          />
          {hasMountains && (
            <Badge variant="secondary" className="bg-vibrant-blue/20 text-cream-25 ml-auto flex-shrink-0">
              {range.mountains!.filter(m => !m.completed).length} mountains
            </Badge>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4">
            {hasMountains && range.mountains!.filter(m => !m.completed).map((mountain) => renderMountain(mountain, range.id, 0))}
            {renderResetPeriod(range.id, 0)}
            {renderArchives(range.id, 0)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2 max-w-5xl mx-auto">
      <div className="text-xs text-cream-25/50 mb-4 italic font-mono px-2 space-y-1">
        <div>⌨️ <span className="text-cream-25/70">Editor Shortcuts & Features:</span></div>
        <div className="ml-4 space-y-0.5">
          <div className="grid grid-cols-2 gap-x-4">
            <span>• Click to edit • ↑↓ navigate</span>
            <span>• Enter save & move • Esc cancel</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <span>• Tab/Shift+Tab indent/outdent</span>
            <span>• Cmd+Enter add new item</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-yellow-300 font-bold">• H habit • A activity</span>
            <span className="text-yellow-300 font-bold">• M milestone • V vision</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-yellow-300 font-bold">• X toggle archive • E edit item</span>
            <span>• Cmd+\ toggle dropdown</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <span>• Cmd+. cycle bullet type</span>
            <span>• Cmd+click bullet to cycle</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <span>• Click item to select (yellow ring)</span>
            <span>• Hover: drag handle + add button</span>
          </div>
          <div className="text-yellow-300 font-bold mt-1">
            💡 Vim-style shortcuts: Just press H, A, M, V, X, or E on any selected/hovered item!
          </div>
        </div>
      </div>
      {ranges.map((range) => renderRange(range))}

      {/* Add to Today Modal (for activities) */}
      {addToTodayItem && (
        <AddToTodayModal
          isOpen={!!addToTodayItem}
          onClose={() => setAddToTodayItem(null)}
          onSave={handleAddToTimeline}
          itemName={addToTodayItem.name}
          itemColor="#00D9FF"
        />
      )}

      {/* Add Habit to Timeline Modal (for habits) */}
      {addHabitToTimelineItem && (
        <AddHabitToTimelineModal
          isOpen={!!addHabitToTimelineItem}
          onClose={() => setAddHabitToTimelineItem(null)}
          onSave={handleAddHabitToTimeline}
          habitName={addHabitToTimelineItem.name}
          habitColor={addHabitToTimelineItem.color}
          defaultFrequency={addHabitToTimelineItem.frequency}
        />
      )}
    </div>
  )
}
