"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react"
import type { Step } from "@/lib/types"

interface FocusTimerDisplayProps {
  timeRemaining: number
  isRunning: boolean
  currentTask?: Step
  totalSessionDuration: number
  onToggleTimer: () => void
  onSkipTask: () => void
  onResetTimer: () => void
  onTaskComplete: () => void
}

export function FocusTimerDisplay({
  timeRemaining,
  isRunning,
  currentTask,
  totalSessionDuration,
  onToggleTimer,
  onSkipTask,
  onResetTimer,
  onTaskComplete,
}: FocusTimerDisplayProps) {
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = totalSessionDuration > 0
    ? ((totalSessionDuration - timeRemaining) / totalSessionDuration) * 100
    : 0

  const taskColor = currentTask?.color || "#3B82F6"
  const taskIcon = currentTask?.icon || "⏱️"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {/* Main Timer Circle */}
      <div className="relative">
        <svg width="320" height="320" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke={taskColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progressPercentage / 100)}`}
            style={{
              transition: "stroke-dashoffset 0.5s ease-in-out",
            }}
          />
        </svg>

        {/* Timer content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-cream-25">
          <div className="text-6xl mb-2">{taskIcon}</div>
          <div
            className="text-6xl font-light font-mono tracking-wider"
            style={{
              fontFeatureSettings: '"tnum" 1',
              letterSpacing: '-0.02em'
            }}
          >
            {formatTime(timeRemaining)}
          </div>
          {currentTask && (
            <div className="text-lg font-light mt-4 text-center max-w-xs">
              {currentTask.label}
            </div>
          )}
        </div>
      </div>

      {/* Gesture hint */}
      <div className="mt-12 text-center text-cream-25/60">
        <p className="text-sm">Tap to {isRunning ? 'pause' : 'start'}</p>
        <p className="text-xs mt-1">Swipe up to skip • Swipe down to reset</p>
      </div>

      {/* Hidden touch areas for gestures */}
      <div
        className="absolute inset-0 z-10"
        onClick={onToggleTimer}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY
          const startX = e.touches[0].clientX

          const handleTouchEnd = (endEvent: TouchEvent) => {
            const endY = endEvent.changedTouches[0].clientY
            const endX = endEvent.changedTouches[0].clientX
            const deltaY = startY - endY
            const deltaX = Math.abs(startX - endX)

            // Only trigger swipe if vertical movement is significant and horizontal is minimal
            if (deltaX < 50 && Math.abs(deltaY) > 80) {
              if (deltaY > 0) {
                // Swiped up - skip task
                onSkipTask()
              } else {
                // Swiped down - reset timer
                onResetTimer()
              }
            } else if (deltaX < 30 && Math.abs(deltaY) < 30) {
              // Tap - toggle timer
              onToggleTimer()
            }

            document.removeEventListener('touchend', handleTouchEnd)
          }

          document.addEventListener('touchend', handleTouchEnd)
        }}
      />
    </div>
  )
}