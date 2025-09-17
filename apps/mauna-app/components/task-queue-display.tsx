"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Grip } from "lucide-react"
import type { Step } from "@/lib/types"

interface TaskQueueDisplayProps {
  tasks: Step[]
  currentTaskId?: string
  isTimerRunning?: boolean
  onTaskReorder: (tasks: Step[]) => void
  onTaskEdit: (task: Step) => void
  onTaskDelete: (taskId: string) => void
  onTaskAdd: () => void
}

export function TaskQueueDisplay({
  tasks,
  currentTaskId,
  isTimerRunning = false,
  onTaskReorder,
  onTaskEdit,
  onTaskDelete,
  onTaskAdd,
}: TaskQueueDisplayProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const dragCounter = useRef(0)

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    return `${minutes}m`
  }

  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    e.preventDefault()
    setDraggedIndex(index)
  }

  const handleTouchEnd = () => {
    setDraggedIndex(null)
  }

  const handleSwipeDelete = (taskId: string, e: React.TouchEvent) => {
    const startX = e.touches[0].clientX

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX
      const deltaX = startX - endX

      if (deltaX > 100) {
        onTaskDelete(taskId)
      }

      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchend', handleTouchEnd)
  }

  const handlePinchToAdd = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      )

      const handleTouchEnd = (endEvent: TouchEvent) => {
        if (endEvent.touches.length === 0) {
          const newTouch1 = endEvent.changedTouches[0]
          const newTouch2 = endEvent.changedTouches[1]
          if (newTouch1 && newTouch2) {
            const newDistance = Math.hypot(
              newTouch1.clientX - newTouch2.clientX,
              newTouch1.clientY - newTouch2.clientY
            )

            if (newDistance > distance + 50) {
              onTaskAdd()
            }
          }
        }
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchend', handleTouchEnd)
    }
  }

  const totalDuration = tasks.reduce((sum, task) => sum + (task.duration || 0), 0)
  const totalMinutes = Math.floor(totalDuration / (1000 * 60))

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Total time display */}
      <div className="text-center mb-8">
        <div className="text-4xl font-light text-cream-25 mb-2">
          {totalMinutes}m
        </div>
        <div className="text-sm text-cream-25/60">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {/* Task list */}
      <div
        className="space-y-3"
        onTouchStart={handlePinchToAdd}
      >
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`
              relative flex items-center p-4 rounded-2xl transition-all duration-300
              ${currentTaskId === task.id
                ? `bg-white/20 border-2 border-white/40 scale-105 ${isTimerRunning ? 'animate-pulse' : ''}`
                : 'bg-white/10 border border-white/20'
              }
              ${draggedIndex === index ? 'scale-110 shadow-2xl z-10' : ''}
            `}
            style={{
              backgroundColor: currentTaskId === task.id
                ? `${task.color}40`
                : 'rgba(255, 255, 255, 0.1)'
            }}
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                handleSwipeDelete(task.id, e)
              }
            }}
          >
            {/* Task icon */}
            <div className="text-2xl mr-4">
              {task.icon || '⏱️'}
            </div>

            {/* Task content */}
            <div className="flex-1 min-w-0">
              <div className="text-cream-25 font-medium truncate">
                {task.label}
              </div>
              <div className="text-cream-25/60 text-sm">
                {formatDuration(task.duration || 0)}
              </div>
            </div>

            {/* Drag handle */}
            <div
              className="p-2 text-cream-25/40"
              onTouchStart={(e) => handleTouchStart(index, e)}
              onTouchEnd={handleTouchEnd}
            >
              <Grip className="w-5 h-5" />
            </div>

            {/* Enhanced progress indicator for current task */}
            {currentTaskId === task.id && (
              <>
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-500 ${
                    isTimerRunning ? 'animate-pulse' : ''
                  }`}
                  style={{ backgroundColor: task.color || '#f9fafb' }}
                />
                {isTimerRunning && (
                  <div
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full opacity-60 animate-ping"
                    style={{ backgroundColor: task.color || '#f9fafb' }}
                  />
                )}
              </>
            )}
          </div>
        ))}

        {/* Add task gesture hint */}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-cream-25/40">
            <div className="text-6xl mb-4">⏱️</div>
            <p className="text-sm">Pinch apart to create your first task</p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="text-center py-4 text-cream-25/40">
            <p className="text-xs">Pinch apart to add • Swipe left to delete</p>
          </div>
        )}
      </div>
    </div>
  )
}