"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Check, GripVertical, Square, Repeat, Clock, Copy, MoveDown, MoveUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { TaskList } from "@/lib/types"
import { DatabaseService } from "@/lib/database-service"
import { HabitTaskListSyncService } from "@/lib/habit-task-list-sync"
import { AddHabitGroupToTimelineModal } from "./add-habit-group-to-timeline-modal"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { arrayMove } from "@dnd-kit/sortable"

interface TaskListManagerProps {
  isOpen: boolean
  onClose: () => void
  taskLists: TaskList[]
  currentListId: string
  updateTaskLists: (lists: TaskList[]) => void
  switchTaskList: (listId: string) => void
  userId: string
  noTaskListSelectedId: string
}

interface SortableTaskListCardProps {
  list: TaskList
  isCurrent: boolean
  isEditing: boolean
  editingListName: string
  editingSuggestedTimeBlockRange: string
  onEdit: (list: TaskList) => void
  onSaveEdit: () => void
  onDelete: (listId: string) => void
  onSwitch: (listId: string) => void
  onListNameChange: (name: string) => void
  onSuggestedTimeBlockRangeChange: (range: string) => void
  onAddToTimeline?: (list: TaskList) => void
  onDuplicate?: (list: TaskList) => void
  onMoveToTop?: (listId: string) => void
  onMoveToBottom?: (listId: string) => void
  noTaskListSelectedId: string
  allListsCount: number
}

function SortableTaskListCard({
  list,
  isCurrent,
  isEditing,
  editingListName,
  editingSuggestedTimeBlockRange,
  onEdit,
  onSaveEdit,
  onDelete,
  onSwitch,
  onListNameChange,
  onSuggestedTimeBlockRangeChange,
  onAddToTimeline,
  onDuplicate,
  onMoveToTop,
  onMoveToBottom,
  noTaskListSelectedId,
  allListsCount,
}: SortableTaskListCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: list.id })

  // Gesture state
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [swipeOffset, setSwipeOffset] = useState<number>(0)
  const [lastTapTime, setLastTapTime] = useState<number>(0)
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
  }

  const isNoTaskListSelected = list.id === noTaskListSelectedId
  // Check if this list contains any habits
  const isHabitGroupList = list.steps?.some(step => (step as any).tag === 'habit') || false

  // Helper to get distance between two touches
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isNoTaskListSelected || isHabitGroupList) return

    const touchCount = e.touches.length

    if (touchCount === 1) {
      setTouchStartX(e.touches[0].clientX)
      setTouchStartY(e.touches[0].clientY)

      // Check for double tap
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime
      if (timeSinceLastTap < 300) {
        e.preventDefault()
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])
        onEdit(list)
        setLastTapTime(0)
      } else {
        setLastTapTime(now)
      }
    } else if (touchCount === 2) {
      e.preventDefault()
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setInitialPinchDistance(distance)

      // Check for immediate 2-finger tap
      const tapTimeout = setTimeout(() => {
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])
        if (onMoveToTop) onMoveToTop(list.id)
      }, 50)

      const handleTouchEnd = () => {
        clearTimeout(tapTimeout)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      document.addEventListener('touchend', handleTouchEnd, { once: true })
    } else if (touchCount === 3) {
      e.preventDefault()
      if ('vibrate' in navigator) navigator.vibrate([50, 100, 50])
      if (onDuplicate) onDuplicate(list)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isNoTaskListSelected || isHabitGroupList) return
    if (!touchStartX || !touchStartY) return

    const touchCurrentX = e.touches[0].clientX
    const touchCurrentY = e.touches[0].clientY
    const deltaX = touchCurrentX - touchStartX
    const deltaY = touchCurrentY - touchStartY

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      e.preventDefault()
      setSwipeOffset(deltaX)
      setSwipeDirection(deltaX > 0 ? "right" : "left")
    }

    // Handle pinch gestures
    if (e.touches.length === 2 && initialPinchDistance) {
      e.preventDefault()
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      const distanceChange = currentDistance - initialPinchDistance

      // Detect vertical vs horizontal spread
      const touch1Y = e.touches[0].clientY
      const touch2Y = e.touches[1].clientY
      const verticalAlignment = Math.abs(touch1Y - touch2Y)

      if (Math.abs(distanceChange) > 50) {
        if (distanceChange > 0) {
          // Spread gesture
          if (verticalAlignment > 50 && onAddToTimeline) {
            // Vertical spread - show add to timeline hint
          }
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isNoTaskListSelected || isHabitGroupList) return

    const touchCount = e.changedTouches.length

    if (touchCount === 1 && touchStartX !== null && touchStartY !== null) {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const distance = Math.abs(deltaX)

      const swipeThreshold = 80
      const maxVerticalDeviation = 60

      if (distance > swipeThreshold && Math.abs(deltaY) < maxVerticalDeviation) {
        if ('vibrate' in navigator) navigator.vibrate(50)

        if (deltaX > 0) {
          // Swipe right: Delete
          onDelete(list.id)
        } else {
          // Swipe left: Move to bottom
          if (onMoveToBottom) onMoveToBottom(list.id)
        }
      }
    } else if (touchCount === 2 && initialPinchDistance) {
      const finalDistance = getTouchDistance(e.changedTouches[0], e.changedTouches[1])
      const distanceChange = finalDistance - initialPinchDistance
      const touch1Y = e.changedTouches[0].clientY
      const touch2Y = e.changedTouches[1].clientY
      const verticalAlignment = Math.abs(touch1Y - touch2Y)

      if (Math.abs(distanceChange) > 50) {
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])

        if (distanceChange > 0 && verticalAlignment > 50) {
          // Vertical spread - Add to timeline
          if (onAddToTimeline) onAddToTimeline(list)
        }
      }
    }

    // Reset gesture state
    setTouchStartX(null)
    setTouchStartY(null)
    setSwipeDirection(null)
    setSwipeOffset(0)
    setInitialPinchDistance(null)
  }

  return (
    <Card
      ref={setNodeRef}
      style={{
        ...style,
        transform: `${CSS.Transform.toString(transform)} translateX(${swipeOffset}px)`,
      }}
      className={`mb-2 p-3 flex flex-col rounded-lg shadow-sm transition-all duration-200 ease-in-out relative overflow-hidden ${
        isHabitGroupList
          ? `bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/30 ${isCurrent ? "ring-2 ring-purple-400" : ""}`
          : `bg-white/20 border-white/10 ${isCurrent ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe Actions Overlay */}
      {swipeDirection === "right" && swipeOffset > 20 && (
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-start px-6 pointer-events-none">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
      )}
      {swipeDirection === "left" && swipeOffset < -20 && (
        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-end px-6 pointer-events-none">
          <MoveDown className="w-6 h-6 text-blue-500" />
        </div>
      )}
      <CardContent className="p-4 flex items-center justify-between">
        {!isNoTaskListSelected && !isHabitGroupList && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab text-cream-25/70 hover:text-cream-25 mr-2"
            {...listeners}
            {...attributes}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        )}
        {isEditing && !isNoTaskListSelected ? (
          <div className="flex flex-col flex-grow mr-2 gap-2">
            <Input
              value={editingListName}
              onChange={(e) => onListNameChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
              className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
              aria-label="Edit list name"
            />
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-cream-25/70" />
              <Input
                value={editingSuggestedTimeBlockRange}
                onChange={(e) => onSuggestedTimeBlockRangeChange(e.target.value)}
                onBlur={onSaveEdit}
                onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
                placeholder="Suggested Time Block Range"
                className="flex-grow bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
                aria-label="Edit suggested time block range"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-2">
              {isHabitGroupList && (
                <div className="flex-shrink-0 group/habit-badge relative">
                  <Repeat className="w-4 h-4 text-purple-400" title="Habit Group" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-gray-900/95 text-purple-400 text-xs rounded whitespace-nowrap opacity-0 group-hover/habit-badge:opacity-100 transition-opacity pointer-events-none z-50 border border-purple-400/30">
                    Habit Group Task List
                  </div>
                </div>
              )}
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">{list.name}</CardTitle>
              {!isNoTaskListSelected && (
                <span className="text-sm text-cream-25/70 zen-ui">({list.steps.length} {isHabitGroupList ? "habits" : "tasks"})</span>
              )}
            </div>
            {list.suggestedTimeBlockRange && (
              <div className="flex items-center gap-2 text-sm text-cream-25/70 zen-ui mt-1">
                <Square className="h-4 w-4" />
                <span>{list.suggestedTimeBlockRange}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-end">
            {isEditing && !isNoTaskListSelected ? (
              <Button variant="ghost" size="icon" onClick={onSaveEdit} aria-label="Save changes">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            ) : (
              !isNoTaskListSelected && !isHabitGroupList && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(list)}
                  aria-label="Edit list"
                  className="text-cream-25/70 hover:text-cream-25"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )
            )}
            {!isNoTaskListSelected && !isHabitGroupList && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(list.id)}
                aria-label="Delete list"
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {!isNoTaskListSelected && !isHabitGroupList && onAddToTimeline && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddToTimeline(list)}
                aria-label="Add to Timeline"
                className="text-cyan-400 hover:text-cyan-500"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitch(list.id)}
            disabled={isCurrent}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
          >
            {isCurrent ? "Current" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TaskListManager({
  isOpen,
  onClose,
  taskLists,
  currentListId,
  updateTaskLists,
  switchTaskList,
  userId,
  noTaskListSelectedId,
}: TaskListManagerProps) {
  const [localTaskLists, setLocalTaskLists] = useState<TaskList[]>(taskLists || [])
  const [newListName, setNewListName] = useState("")
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListName, setEditingListName] = useState("")
  const [editingSuggestedTimeBlockRange, setEditingSuggestedTimeBlockRange] = useState("")
  const [taskListToAddToTimeline, setTaskListToAddToTimeline] = useState<TaskList | null>(null)
  const [gestureOverlay, setGestureOverlay] = useState<string | null>(null)
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const ALL_ACTIVE_TASKS_ID = "all-active-tasks"

  // Helper function to show gesture overlay
  const showGestureOverlay = (message: string) => {
    setGestureOverlay(message)
    if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current)
    gestureTimeoutRef.current = setTimeout(() => setGestureOverlay(null), 2000)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    console.log("TaskListManager useEffect: taskLists prop changed", taskLists)
    const actualTaskLists = taskLists.filter((list) => list.id !== noTaskListSelectedId)
    setLocalTaskLists(actualTaskLists.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
  }, [taskLists, noTaskListSelectedId])

  const handleCreateList = async () => {
    console.log("handleCreateList: Function called.")
    if (!newListName.trim()) {
      console.log("handleCreateList: New list name is empty.")
      toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" })
      return
    }

    console.log("handleCreateList: Attempting to create list with name:", newListName.trim())
    try {
      const newPosition = localTaskLists.length + 1
      const newList = await DatabaseService.createTaskList(userId, newListName.trim(), newPosition)
      console.log("handleCreateList: List created successfully:", newList)
      const updatedLists = [...localTaskLists, newList].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      setLocalTaskLists(updatedLists)
      updateTaskLists(updatedLists)
      setNewListName("")
      toast({ title: "List Created ✨", description: `Task list "${newList.name}" created.` })
    } catch (error: any) {
      console.error("handleCreateList: Failed to create list:", error)
      toast({ title: "Error", description: `Failed to create list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleEditList = (list: TaskList) => {
    setEditingListId(list.id)
    setEditingListName(list.name)
    setEditingSuggestedTimeBlockRange(list.suggestedTimeBlockRange || "")
  }

  const handleSaveEdit = async () => {
    if (!editingListName.trim() || !editingListId) {
      toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" })
      return
    }
    if (editingListId === noTaskListSelectedId) {
      toast({ title: "Error", description: "Cannot edit 'No Task List Selected'.", variant: "destructive" })
      setEditingListId(null)
      return
    }

    try {
      const updatedList = await DatabaseService.updateTaskList(editingListId, userId, {
        name: editingListName.trim(),
        suggestedTimeBlockRange: editingSuggestedTimeBlockRange.trim() || null,
      })
      const updatedLists = localTaskLists.map((list) =>
        list.id === editingListId
          ? { ...list, name: updatedList.name, suggestedTimeBlockRange: updatedList.suggestedTimeBlockRange }
          : list,
      )
      setLocalTaskLists(updatedLists)
      updateTaskLists(updatedLists)
      setEditingListId(null)
      setEditingListName("")
      setEditingSuggestedTimeBlockRange("")
      toast({ title: "List Updated ✨", description: "Task list updated." })
    } catch (error: any) {
      console.error("handleSaveEdit: Failed to update list:", error)
      toast({ title: "Error", description: `Failed to update list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (listId === noTaskListSelectedId) {
      toast({ title: "Error", description: "Cannot delete 'No Task List Selected'.", variant: "destructive" })
      return
    }
    if (window.confirm("Are you sure you want to delete this task list and all its tasks?")) {
      try {
        await DatabaseService.deleteTaskList(listId, userId)
        const updatedLists = localTaskLists.filter((list) => list.id !== listId)
        const reorderedForDeletion = updatedLists.map((list, index) => ({ ...list, position: index + 1 }))

        setLocalTaskLists(reorderedForDeletion)
        updateTaskLists(reorderedForDeletion)

        if (currentListId === listId && reorderedForDeletion.length > 0) {
          switchTaskList(reorderedForDeletion[0].id)
        } else if (currentListId === listId && reorderedForDeletion.length === 0) {
          switchTaskList(noTaskListSelectedId)
        }
        showGestureOverlay("🗑 List deleted")
        toast({ title: "List Deleted", description: "Task list and its tasks removed." })
      } catch (error: any) {
        console.error("handleDeleteList: Failed to delete list:", error)
        toast({ title: "Error", description: `Failed to delete list: ${error.message}`, variant: "destructive" })
      }
    }
  }

  const handleDuplicateList = async (list: TaskList) => {
    try {
      const newPosition = localTaskLists.length + 1
      const newList = await DatabaseService.createTaskList(userId, `${list.name} (Copy)`, newPosition)

      // Copy all tasks from the original list
      for (const task of list.steps) {
        const newTask = { ...task, id: crypto.randomUUID(), taskListId: newList.id }
        await DatabaseService.createStep(newTask, userId)
      }

      // Fetch updated lists
      const updatedLists = await DatabaseService.fetchTaskLists(userId)
      setLocalTaskLists(updatedLists.filter((l) => l.id !== noTaskListSelectedId).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
      updateTaskLists(updatedLists)

      showGestureOverlay("📋 List duplicated")
      toast({ title: "List Duplicated ✨", description: `"${list.name}" was duplicated.` })
    } catch (error: any) {
      console.error("handleDuplicateList: Failed to duplicate list:", error)
      toast({ title: "Error", description: `Failed to duplicate list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleMoveListToTop = async (listId: string) => {
    try {
      const listIndex = localTaskLists.findIndex((list) => list.id === listId)
      if (listIndex <= 0) return // Already at top or not found

      const reorderedLists = [...localTaskLists]
      const [movedList] = reorderedLists.splice(listIndex, 1)
      reorderedLists.unshift(movedList)

      const reorderedWithPositions = reorderedLists.map((list, index) => ({
        ...list,
        position: index + 1,
      }))

      setLocalTaskLists(reorderedWithPositions)
      updateTaskLists(reorderedWithPositions)

      await DatabaseService.reorderTaskLists(userId, reorderedWithPositions)
      showGestureOverlay("⬆ Moved to top")
      toast({ title: "List Moved", description: "Task list moved to top." })
    } catch (error: any) {
      console.error("handleMoveListToTop: Failed to move list:", error)
      toast({ title: "Error", description: `Failed to move list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleMoveListToBottom = async (listId: string) => {
    try {
      const listIndex = localTaskLists.findIndex((list) => list.id === listId)
      if (listIndex === -1 || listIndex === localTaskLists.length - 1) return // Not found or already at bottom

      const reorderedLists = [...localTaskLists]
      const [movedList] = reorderedLists.splice(listIndex, 1)
      reorderedLists.push(movedList)

      const reorderedWithPositions = reorderedLists.map((list, index) => ({
        ...list,
        position: index + 1,
      }))

      setLocalTaskLists(reorderedWithPositions)
      updateTaskLists(reorderedWithPositions)

      await DatabaseService.reorderTaskLists(userId, reorderedWithPositions)
      showGestureOverlay("⬇ Moved to bottom")
      toast({ title: "List Moved", description: "Task list moved to bottom." })
    } catch (error: any) {
      console.error("handleMoveListToBottom: Failed to move list:", error)
      toast({ title: "Error", description: `Failed to move list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localTaskLists.findIndex((list) => list.id === active.id)
      const newIndex = localTaskLists.findIndex((list) => list.id === over?.id)

      const newOrder = arrayMove(localTaskLists, oldIndex, newIndex)

      const reorderedListsWithPositions = newOrder.map((list, index) => ({
        ...list,
        position: index + 1,
      }))

      setLocalTaskLists(reorderedListsWithPositions)
      updateTaskLists(reorderedListsWithPositions)

      try {
        await DatabaseService.reorderTaskLists(userId, reorderedListsWithPositions)
        toast({ title: "Lists Reordered", description: "Task lists order saved." })
      } catch (error: any) {
        console.error("Failed to save reordered lists:", error)
        toast({ title: "Error", description: `Failed to save reorder: ${error.message}`, variant: "destructive" })
      }
    }
  }

  // Handler to open "Add Task List to Timeline" modal
  const handleAddTaskListToTimeline = (list: TaskList) => {
    setTaskListToAddToTimeline(list)
  }

  // Handler to save task list to timeline (batch create entries)
  const handleSaveTaskListToTimeline = async (data: { startDate: string; endDate: string; daysOfWeek: string[]; time: string; duration: number }) => {
    if (!userId || !taskListToAddToTimeline) return

    try {
      const { startDate, endDate, daysOfWeek, time, duration } = data
      const tasks = taskListToAddToTimeline.steps

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
          // Create main entry with task list name
          const mainEntry = {
            label: taskListToAddToTimeline.name,
            description: `Task list from Focus Board`,
            tag: "task-list",
            color: "#00D9FF",
            duration: duration * 60000,
            frequency: "Daily",
            completed: false,
            isbuildhabit: false,
            user_id: userId,
            start_date: date.toISOString().split('T')[0],
            habit_notes: {
              _scheduled_time: time,
              energyLevel: 3,
              alerts: [],
              notes: "",
            },
          }

          entries.push(mainEntry)
        }
      }

      if (entries.length === 0) {
        toast({ title: "No Entries", description: "No matching days found in the selected date range.", variant: "destructive" })
        return
      }

      // Batch insert all main entries
      const { data: insertedEntries, error: insertError } = await DatabaseService.prototype.supabase
        .from("steps")
        .insert(entries)
        .select()

      if (insertError) {
        toast({ title: "Error", description: `Failed to add task list to timeline: ${insertError.message}`, variant: "destructive" })
        return
      }

      // Now create subtasks (breaths) for each main entry
      if (insertedEntries && insertedEntries.length > 0) {
        const subtasks = []

        for (const mainEntry of insertedEntries) {
          // Add each task in the list as a subtask
          for (const task of tasks) {
            subtasks.push({
              label: task.label,
              description: task.description || "",
              stepId: mainEntry.id,
              color: task.color || "#00D9FF",
              duration: 0,
              completed: false,
              user_id: userId,
              habit_notes: {},
            })
          }
        }

        if (subtasks.length > 0) {
          const { error: subtaskError } = await DatabaseService.prototype.supabase
            .from("breaths")
            .insert(subtasks)

          if (subtaskError) {
            console.error('Error creating subtasks:', subtaskError)
            toast({ title: "Warning", description: "Main entries created but some subtasks failed.", variant: "destructive" })
          }
        }
      }

      toast({
        title: "Added to Timeline",
        description: `Created ${entries.length} timeline entries for "${taskListToAddToTimeline.name}" with ${tasks.length} subtasks each`
      })
      setTaskListToAddToTimeline(null)
    } catch (err) {
      console.error('Error adding task list to timeline:', err)
      toast({ title: "Error", description: "Unexpected error adding task list to timeline.", variant: "destructive" })
    }
  }

  const totalTasks = localTaskLists
    .filter((list) => list.name !== "✅ Completed Tasks")
    .reduce((sum, list) => sum + list.steps.length, 0)

  const sortableItems = localTaskLists.map((list) => list.id)
  const nonSortableItem = taskLists.find((list) => list.id === noTaskListSelectedId)

  // Pinch-to-close gesture detection
  const getTouchDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleManagerTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setInitialPinchDistance(distance)
    }
  }

  const handleManagerTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      const distanceChange = currentDistance - initialPinchDistance

      // Pinch inward to close
      if (distanceChange < -50) {
        showGestureOverlay("🤏 Pinch to close")
      }
    }
  }

  const handleManagerTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 2 && initialPinchDistance) {
      const finalDistance = getTouchDistance(e.changedTouches[0], e.changedTouches[1])
      const distanceChange = finalDistance - initialPinchDistance

      if (distanceChange < -50) {
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])
        onClose()
      }

      setInitialPinchDistance(null)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 bg-ink-950/20 backdrop-blur-sm border border-brushed-silver/20 text-cream-25 shadow-2xl rounded-lg relative"
      onTouchStart={handleManagerTouchStart}
      onTouchMove={handleManagerTouchMove}
      onTouchEnd={handleManagerTouchEnd}
    >
      {/* Gesture Overlay */}
      {gestureOverlay && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="glassmorphism rounded-2xl px-8 py-4 border border-white/30 shadow-2xl">
            <p className="text-2xl font-medium text-cream-25 text-center whitespace-nowrap">
              {gestureOverlay}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-montserrat font-light text-cream-25 zen-heading">
          <Plus className="h-5 w-5 text-cream-25" />
          Manage Step Lists
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-cream-25/70 hover:text-cream-25">
          Close
        </Button>
      </div>
      <p className="font-inter text-cream-25/70 mb-4">Create, edit, and organize your task lists with gestures.</p>

      <div className="flex-1 overflow-y-auto p-1">
        <Card className={`mb-4 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${currentListId === ALL_ACTIVE_TASKS_ID ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col flex-grow">
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">All Active Tasks</CardTitle>
              <span className="text-sm text-cream-25/70 zen-ui">({totalTasks} tasks)</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchTaskList(ALL_ACTIVE_TASKS_ID)}
                disabled={currentListId === ALL_ACTIVE_TASKS_ID}
                className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
              >
                {currentListId === ALL_ACTIVE_TASKS_ID ? "Current" : "Select"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
          />
          <Button onClick={handleCreateList} className="bg-sapphire-blue hover:bg-sapphire-blue/90 text-cream-25">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
          {nonSortableItem && (
            <TaskListCard
              key={nonSortableItem.id}
              list={nonSortableItem}
              isCurrent={nonSortableItem.id === currentListId}
              isEditing={editingListId === nonSortableItem.id}
              editingListName={editingListName}
              editingSuggestedTimeBlockRange={editingSuggestedTimeBlockRange}
              onEdit={handleEditList}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDeleteList}
              onSwitch={switchTaskList}
              onListNameChange={setEditingListName}
              onSuggestedTimeBlockRangeChange={setEditingSuggestedTimeBlockRange}
              onAddToTimeline={handleAddTaskListToTimeline}
              onDuplicate={handleDuplicateList}
              onMoveToTop={handleMoveListToTop}
              onMoveToBottom={handleMoveListToBottom}
              noTaskListSelectedId={noTaskListSelectedId}
              allListsCount={localTaskLists.length}
            />
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {localTaskLists.length === 0 ? (
                  <p className="text-center text-cream-25/70 zen-body">No task lists yet.</p>
                ) : (
                  localTaskLists.map((list) => (
                    <SortableTaskListCard
                      key={list.id}
                      list={list}
                      isCurrent={list.id === currentListId}
                      isEditing={editingListId === list.id}
                      editingListName={editingListName}
                      editingSuggestedTimeBlockRange={editingSuggestedTimeBlockRange}
                      onEdit={handleEditList}
                      onSaveEdit={handleSaveEdit}
                      onDelete={handleDeleteList}
                      onSwitch={switchTaskList}
                      onListNameChange={setEditingListName}
                      onSuggestedTimeBlockRangeChange={setEditingSuggestedTimeBlockRange}
                      onAddToTimeline={handleAddTaskListToTimeline}
                      onDuplicate={handleDuplicateList}
                      onMoveToTop={handleMoveListToTop}
                      onMoveToBottom={handleMoveListToBottom}
                      noTaskListSelectedId={noTaskListSelectedId}
                      allListsCount={localTaskLists.length}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>

          {/* Gesture Guide */}
          {localTaskLists.length > 0 && (
            <div className="mt-6 px-4">
              <div className="glassmorphism rounded-lg p-4 border border-white/10">
                <h4 className="text-xs font-semibold text-cream-25 mb-3 text-center">Available Gestures</h4>
                <div className="grid grid-cols-1 gap-2 text-xs text-cream-25/70">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👆👆</span>
                    <span>Double tap to edit list</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👉</span>
                    <span>Slide right to delete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👈</span>
                    <span>Slide left to move to bottom</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👆👆</span>
                    <span>2-finger tap to move to top</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👆👆👆</span>
                    <span>3-finger tap to duplicate list</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🙌</span>
                    <span>Spread apart vertically to add to timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤏</span>
                    <span>Pinch to close manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👆</span>
                    <span>Drag handle to reorder</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Add Task List to Timeline Modal */}
      {taskListToAddToTimeline && (
        <AddHabitGroupToTimelineModal
          isOpen={!!taskListToAddToTimeline}
          onClose={() => setTaskListToAddToTimeline(null)}
          onSave={handleSaveTaskListToTimeline}
          groupName={taskListToAddToTimeline.name}
          groupColor="#00D9FF"
          habitsCount={taskListToAddToTimeline.steps.length}
        />
      )}
    </div>
  )
}

function TaskListCard({
  list,
  isCurrent,
  isEditing,
  editingListName,
  editingSuggestedTimeBlockRange,
  onEdit,
  onSaveEdit,
  onDelete,
  onSwitch,
  onListNameChange,
  onSuggestedTimeBlockRangeChange,
  onAddToTimeline,
  onDuplicate,
  onMoveToTop,
  onMoveToBottom,
  noTaskListSelectedId,
  allListsCount,
}: SortableTaskListCardProps) {
  const isNoTaskListSelected = list.id === noTaskListSelectedId

  // Note: TaskListCard is for "No Task List Selected" which shouldn't have gestures
  // So we don't add gesture handlers here

  return (
    <Card
      className={`mb-2 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${isCurrent ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        {isEditing && !isNoTaskListSelected ? (
          <div className="flex flex-col flex-grow mr-2 gap-2">
            <Input
              value={editingListName}
              onChange={(e) => onListNameChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
              className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
              aria-label="Edit list name"
            />
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-cream-25/70" />
              <Input
                value={editingSuggestedTimeBlockRange}
                onChange={(e) => onSuggestedTimeBlockRangeChange(e.target.value)}
                onBlur={onSaveEdit}
                onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
                placeholder="Suggested Time Block Range"
                className="flex-grow bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
                aria-label="Edit suggested time block range"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center">
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">{list.name}</CardTitle>
              {!isNoTaskListSelected && (
                <span className="text-sm text-cream-25/70 zen-ui">({list.steps.length} tasks)</span>
              )}
            </div>
            {list.suggestedTimeBlockRange && (
              <div className="flex items-center gap-2 text-sm text-cream-25/70 zen-ui mt-1">
                <Square className="h-4 w-4" />
                <span>{list.suggestedTimeBlockRange}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-end">
            {isEditing && !isNoTaskListSelected ? (
              <Button variant="ghost" size="icon" onClick={onSaveEdit} aria-label="Save changes">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            ) : (
              !isNoTaskListSelected && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(list)}
                  aria-label="Edit list"
                  className="text-cream-25/70 hover:text-cream-25"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )
            )}
            {!isNoTaskListSelected && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(list.id)}
                aria-label="Delete list"
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {!isNoTaskListSelected && onAddToTimeline && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddToTimeline(list)}
                aria-label="Add to Timeline"
                className="text-cyan-400 hover:text-cyan-500"
              >
                <Clock className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitch(list.id)}
            disabled={isCurrent}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
          >
            {isCurrent ? "Current" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
