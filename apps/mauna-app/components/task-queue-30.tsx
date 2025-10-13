"use client"

import React, { useState, useRef } from "react"
import { GripVertical, Trash2, MoveDown, Play, Pause, MoveUp, Edit, RotateCcw } from "lucide-react"
import type { Step } from "@/lib/types"
import { formatTimeDigital } from "@/lib/utils"

interface TaskQueue30Props {
  tasks: Step[]
  currentTaskId?: string
  onTaskClick: (task: Step) => void
  onTaskDelete: (taskId: string) => void
  onTaskReorder: (taskId: string, newPosition: number) => void
  onTaskMoveToBottom: (taskId: string) => void
  onTaskMoveToTop?: (taskId: string) => void
  onTaskEdit?: (task: Step) => void
  onInsertNewTask?: (position: number) => void
  onPauseAll?: () => void
  onUndo?: () => void
  onCopyTask?: (taskId: string) => void
  isRunning?: boolean
  autoloopEnabled?: boolean
  autoloopEndIndex?: number | null
  timeRemaining?: number
}

// 30/30 inspired color palette
const TASK_COLORS = [
  "#FF8C42", // Orange
  "#FF4757", // Red
  "#A05EB5", // Purple
  "#26A6D1", // Blue
  "#4CAF50", // Green
  "#9B59B6", // Violet
  "#E17B77", // Pink/Coral
  "#FFA834", // Amber
  "#00D9FF", // Cyan
]

export function TaskQueue30({
  tasks,
  currentTaskId,
  onTaskClick,
  onTaskDelete,
  onTaskReorder,
  onTaskMoveToBottom,
  onTaskMoveToTop,
  onTaskEdit,
  onInsertNewTask,
  onPauseAll,
  onUndo,
  onCopyTask,
  isRunning = false,
  autoloopEnabled = false,
  autoloopEndIndex = null,
  timeRemaining = 0,
}: TaskQueue30Props) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  // Multi-touch gesture tracking
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null)
  const [lastTapTime, setLastTapTime] = useState<number>(0)
  const [lastTapTaskId, setLastTapTaskId] = useState<string | null>(null)
  const [gestureOverlay, setGestureOverlay] = useState<string | null>(null)
  const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Long press & drag-to-reorder tracking
  const [isDragging, setIsDragging] = useState(false)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragY, setDragY] = useState<number>(0)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Shake detection
  const [lastShakeTime, setLastShakeTime] = useState<number>(0)
  const shakeThreshold = 15 // Acceleration threshold
  const shakeTimeout = 1000 // Min time between shakes

  // Copy debouncing
  const lastCopyTimeRef = useRef<number>(0)
  const copyDebounceMs = 1000 // Prevent multiple copies within 1 second

  // Helper function to show gesture overlay
  const showGestureOverlay = (message: string) => {
    setGestureOverlay(message)
    if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current)
    gestureTimeoutRef.current = setTimeout(() => setGestureOverlay(null), 2000)
  }

  // Calculate distance between two touch points
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Shake detection with DeviceMotion API
  React.useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity
      if (!acceleration) return

      const { x = 0, y = 0, z = 0 } = acceleration
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z)

      const now = Date.now()
      if (totalAcceleration > shakeThreshold && now - lastShakeTime > shakeTimeout) {
        setLastShakeTime(now)
        if ('vibrate' in navigator) navigator.vibrate([50, 100, 50])
        showGestureOverlay("🔄 Shake to undo")
        if (onUndo) {
          onUndo()
        }
      }
    }

    // Request permission for iOS 13+ devices
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion)
          }
        })
        .catch(console.error)
    } else {
      // For non-iOS devices
      window.addEventListener('devicemotion', handleDeviceMotion)
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }
  }, [lastShakeTime, onUndo])

  const handleTouchStart = (e: React.TouchEvent, taskId: string) => {
    const touchCount = e.touches.length

    if (touchCount === 1) {
      // Single touch - could be tap, double tap, swipe, or long press
      setTouchStartX(e.touches[0].clientX)
      setTouchStartY(e.touches[0].clientY)
      setSwipedTaskId(taskId)

      // Check for double tap
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime
      if (timeSinceLastTap < 300 && lastTapTaskId === taskId) {
        // Double tap detected - cancel any pending long press
        e.preventDefault()
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current)
          longPressTimeoutRef.current = null
        }
        if (onTaskEdit) {
          const task = tasks.find(t => t.id === taskId)
          if (task) {
            if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])
            showGestureOverlay("✏️ Edit task")
            onTaskEdit(task)
          }
        }
        setLastTapTime(0)
        setLastTapTaskId(null)
      } else {
        setLastTapTime(now)
        setLastTapTaskId(taskId)

        // Start long press timer (600ms to avoid conflicts with double tap)
        longPressTimeoutRef.current = setTimeout(() => {
          // Long press detected - enter drag mode
          if ('vibrate' in navigator) navigator.vibrate([50, 100, 50])
          showGestureOverlay("👆 Hold to reorder")
          setIsDragging(true)
          setDraggedTaskId(taskId)
          setDragY(e.touches[0].clientY)
        }, 600)
      }
    } else if (touchCount === 2) {
      // Two finger gesture - cancel any long press
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }
      e.preventDefault()
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setInitialPinchDistance(distance)
    } else if (touchCount === 3) {
      // Three finger tap - copy task - cancel any long press
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }
      e.preventDefault()

      // Debounce to prevent multiple copies
      const now = Date.now()
      if (now - lastCopyTimeRef.current < copyDebounceMs) {
        return // Ignore duplicate copy within debounce period
      }
      lastCopyTimeRef.current = now

      if ('vibrate' in navigator) navigator.vibrate([50, 100, 50])
      showGestureOverlay("📋 Copy task")
      if (onCopyTask) {
        onCopyTask(taskId)
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchCount = e.touches.length

    if (touchCount === 1) {
      if (!touchStartX || !touchStartY) return

      const touchCurrentX = e.touches[0].clientX
      const touchCurrentY = e.touches[0].clientY
      const deltaX = touchCurrentX - touchStartX
      const deltaY = touchCurrentY - touchStartY

      // If dragging, update drag position
      if (isDragging && draggedTaskId) {
        e.preventDefault()
        setDragY(touchCurrentY)

        // Calculate drop target index based on Y position
        const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId)
        const TASK_HEIGHT = 80 // Approximate task card height
        const deltaYFromStart = touchCurrentY - (touchStartY || 0)
        const positionChange = Math.round(deltaYFromStart / TASK_HEIGHT)
        const newIndex = Math.max(0, Math.min(tasks.length - 1, draggedIndex + positionChange))
        setDropTargetIndex(newIndex)
        return
      }

      // Cancel long press if user swipes before timeout
      if (longPressTimeoutRef.current && (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20)) {
        clearTimeout(longPressTimeoutRef.current)
        longPressTimeoutRef.current = null
      }

      // Track horizontal swipes (only if not dragging)
      if (!isDragging && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 50) {
          setSwipeDirection(deltaX > 0 ? "right" : "left")
        }
      }
    } else if (touchCount === 2 && initialPinchDistance) {
      // Pinch/spread gesture detection
      e.preventDefault()
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1])
      const distanceChange = currentDistance - initialPinchDistance
      const touch1Y = e.touches[0].clientY
      const touch2Y = e.touches[1].clientY
      const verticalAlignment = Math.abs(touch1Y - touch2Y)

      // Detect gesture direction
      if (Math.abs(distanceChange) > 50) {
        if (distanceChange < 0) {
          // Pinch inward - Undo
          if (verticalAlignment < 100) {
            showGestureOverlay("↶ Undo")
          }
        } else {
          // Spread outward
          if (verticalAlignment < 50) {
            // Horizontal spread - Pause all
            showGestureOverlay("⏸ Pause all")
          } else {
            // Vertical spread - Insert task
            showGestureOverlay("➕ Insert new task")
          }
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent, taskId?: string) => {
    const touchCount = e.changedTouches.length

    // Clear long press timeout if still pending
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }

    // If in drag mode, finalize the reorder
    if (isDragging && draggedTaskId && dropTargetIndex !== null) {
      e.preventDefault()
      if ('vibrate' in navigator) navigator.vibrate(50)
      showGestureOverlay("✅ Task reordered")
      onTaskReorder(draggedTaskId, dropTargetIndex)

      // Reset drag state
      setIsDragging(false)
      setDraggedTaskId(null)
      setDragY(0)
      setDropTargetIndex(null)
      setTouchStartX(null)
      setTouchStartY(null)
      setSwipedTaskId(null)
      setSwipeDirection(null)
      return
    }

    if (touchCount === 1 && touchStartX !== null && touchStartY !== null) {
      // Single finger release - check for swipe or tap
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY
      const distance = Math.abs(deltaX)

      const swipeThreshold = 80
      const maxVerticalDeviation = 60

      if (distance > swipeThreshold && Math.abs(deltaY) < maxVerticalDeviation && taskId) {
        if ('vibrate' in navigator) {
          navigator.vibrate(50)
        }

        if (deltaX > 0) {
          // Swipe right: Delete
          showGestureOverlay("🗑 Delete")
          onTaskDelete(taskId)
        } else {
          // Swipe left: Move to bottom
          showGestureOverlay("⬇ Move to bottom")
          onTaskMoveToBottom(taskId)
        }
      }

      setTouchStartX(null)
      setTouchStartY(null)
      setSwipedTaskId(null)
      setSwipeDirection(null)
    } else if (touchCount === 2 && initialPinchDistance) {
      // Two finger release - finalize pinch/spread gesture
      const finalDistance = getTouchDistance(e.changedTouches[0], e.changedTouches[1])
      const distanceChange = finalDistance - initialPinchDistance
      const touch1Y = e.changedTouches[0].clientY
      const touch2Y = e.changedTouches[1].clientY
      const verticalAlignment = Math.abs(touch1Y - touch2Y)

      if (Math.abs(distanceChange) > 50) {
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])

        if (distanceChange < 0) {
          // Pinch - Undo
          if (verticalAlignment < 100 && onUndo) {
            onUndo()
          }
        } else {
          // Spread
          if (verticalAlignment < 50) {
            // Horizontal spread - Pause all
            if (onPauseAll) {
              onPauseAll()
            }
          } else {
            // Vertical spread - Insert new task
            if (onInsertNewTask && taskId) {
              const taskIndex = tasks.findIndex(t => t.id === taskId)
              if (taskIndex !== -1) {
                onInsertNewTask(taskIndex + 1)
              }
            }
          }
        }
      }

      setInitialPinchDistance(null)
    }
  }

  // Handle 2-finger tap to move to top
  const handleTwoFingerTap = (e: React.TouchEvent, taskId: string) => {
    if (e.touches.length === 2) {
      e.preventDefault()
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30])
      showGestureOverlay("⬆ Move to top")
      if (onTaskMoveToTop) {
        onTaskMoveToTop(taskId)
      }
    }
  }

  const getTaskColor = (index: number, task: Step) => {
    // Use task's existing color if available
    if (task.color && task.color !== "var(--sapphire-blue)") {
      return task.color
    }
    // Otherwise cycle through 30/30 colors
    return TASK_COLORS[index % TASK_COLORS.length]
  }

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000)
    return `${minutes}:00`
  }

  // Calculate estimated times for all tasks
  const calculateEstimatedTimes = () => {
    const now = new Date()
    const currentTaskIndex = tasks.findIndex(t => t.id === currentTaskId)

    let cumulativeTime = 0

    return tasks.map((task, index) => {
      if (index === 0 && currentTaskId === task.id && isRunning) {
        // Current running task - use actual time remaining
        cumulativeTime = timeRemaining
      } else if (index === 0 && currentTaskId === task.id) {
        // Current paused task - use its full duration
        cumulativeTime = task.duration || 0
      } else if (index < currentTaskIndex) {
        // Tasks before current (shouldn't happen in practice)
        cumulativeTime = 0
      } else {
        // Future tasks
        if (index === 0) {
          cumulativeTime = task.duration || 0
        } else {
          cumulativeTime += task.duration || 0
        }
      }

      const startTime = new Date(now.getTime() + (index === 0 && currentTaskId === task.id ? 0 : cumulativeTime - (task.duration || 0)))
      const endTime = new Date(now.getTime() + cumulativeTime)

      return {
        startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      }
    })
  }

  const estimatedTimes = calculateEstimatedTimes()

  return (
    <div className="w-full max-w-2xl mx-auto pb-6 relative">
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

      {/* Header */}
      <div className="mb-6 px-4">
        <h3 className="text-2xl font-light text-cream-25 text-center mb-2">Today's Queue</h3>
        <p className="text-sm text-cream-25/60 text-center">Gesture-based task management</p>
      </div>

      {/* Task List */}
      <div className="space-y-3 px-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cream-25/60 text-lg">No tasks in queue</p>
            <p className="text-cream-25/40 text-sm mt-2">Add tasks from Focus, Habits, or Vision</p>
          </div>
        ) : (
          tasks.map((task, index) => {
            const isCurrent = task.id === currentTaskId
            const color = getTaskColor(index, task)
            const isSwipedTask = swipedTaskId === task.id
            const swipeOffset = isSwipedTask && swipeDirection === "right" ? 20 : isSwipedTask && swipeDirection === "left" ? -20 : 0
            const isBeingDragged = isDragging && draggedTaskId === task.id
            const isDropTarget = dropTargetIndex === index && isDragging

            return (
              <React.Fragment key={task.id}>
                {/* Drop Indicator */}
                {isDropTarget && dropTargetIndex !== tasks.findIndex(t => t.id === draggedTaskId) && (
                  <div className="h-1 bg-cyan-400 rounded-full my-2 animate-pulse" />
                )}

                <div
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    isCurrent ? "ring-2 ring-white ring-opacity-60 scale-105" : ""
                  } ${
                    isBeingDragged ? "scale-110 opacity-50 z-50 shadow-2xl" : ""
                  }`}
                  style={{
                    backgroundColor: color,
                    transform: isBeingDragged
                      ? `translateX(${swipeOffset}px) scale(1.1)`
                      : `translateX(${swipeOffset}px)`,
                    boxShadow: isCurrent ? `0 8px 24px ${color}60` : `0 4px 12px ${color}40`,
                  }}
                  onTouchStart={(e) => {
                    handleTouchStart(e, task.id)
                    // Check for 2-finger tap immediately
                    if (e.touches.length === 2) {
                      handleTwoFingerTap(e, task.id)
                    }
                  }}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={(e) => handleTouchEnd(e, task.id)}
                  onClick={() => !isSwipedTask && !isDragging && onTaskClick(task)}
                >
                {/* Swipe Actions Overlay */}
                {isSwipedTask && swipeDirection === "right" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-start px-6">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                )}
                {isSwipedTask && swipeDirection === "left" && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-end px-6">
                    <MoveDown className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Task Card Content */}
                <div className="relative flex items-center gap-4 p-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0">
                    <GripVertical className="w-6 h-6 text-white/60 cursor-grab active:cursor-grabbing" />
                  </div>

                  {/* Task Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                    {task.icon || "📝"}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-medium text-white truncate">{task.label}</h4>
                    {task.tag && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                        {task.tag === "habit" && "Habit"}
                        {task.tag === "task-list" && "Focus"}
                        {task.tag === "vision" && "Vision"}
                      </span>
                    )}
                    {/* Time Estimation - hide if after autoloop bar */}
                    {(!autoloopEnabled || autoloopEndIndex === null || index <= autoloopEndIndex) && estimatedTimes[index] && (
                      <div className="mt-1 text-xs text-white/70 font-mono">
                        {estimatedTimes[index].startTime} → {estimatedTimes[index].endTime}
                      </div>
                    )}
                  </div>

                  {/* Duration & Status */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="text-white/90 font-mono text-lg font-semibold">
                      {formatDuration(task.duration || 0)}
                    </div>
                    {isCurrent && isRunning && (
                      <div className="flex items-center gap-1">
                        <Pause className="w-4 h-4 text-white" />
                        <span className="text-white/80 text-xs">Running</span>
                      </div>
                    )}
                    {isCurrent && !isRunning && (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4 text-white" />
                        <span className="text-white/80 text-xs">Ready</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Indicator for Current Task */}
                {isCurrent && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                    <div
                      className="h-full bg-white transition-all duration-1000"
                      style={{ width: "0%" }} // This would be connected to actual progress
                    />
                  </div>
                )}
              </div>
              </React.Fragment>
            )
          })
        )}
        {/* Auto-Loop Bar - show after tasks */}
        {autoloopEnabled && autoloopEndIndex !== null && tasks.length > 0 && (
          <div className="my-4 relative">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
              <div className="glassmorphism px-4 py-2 rounded-full border border-cyan-400/30">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Auto-Loop Restart</span>
                </div>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-cream-25/50">Tasks below will repeat from the beginning</p>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text - Gesture Guide */}
      {tasks.length > 0 && (
        <div className="mt-6 px-4">
          <div className="glassmorphism rounded-lg p-4 border border-white/10">
            <h4 className="text-xs font-semibold text-cream-25 mb-3 text-center">Available Gestures</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-cream-25/70">
              <div className="flex items-center gap-2">
                <span className="text-lg">👆</span>
                <span>Touch & hold to move</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👇👇</span>
                <span>Double tap to edit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🙌</span>
                <span>Spread apart vertically to create</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👉</span>
                <span>Slide right to delete</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span>Shake to undo</span>
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
                <span>3-finger tap to copy a task</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
