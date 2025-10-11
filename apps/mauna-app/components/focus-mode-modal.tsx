"use client"

import React, { useState, useEffect } from "react"
import { X, Target, CheckCircle2, Circle, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TimelineItem } from "@/lib/timeline-utils"

interface FocusModeModalProps {
  step: TimelineItem
  onClose: () => void
  onToggleBreath: (stepId: string, breathId: string, completed: boolean) => Promise<void>
}

export function FocusModeModal({ step, onClose, onToggleBreath }: FocusModeModalProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)

  // Calculate total duration in seconds
  const totalSeconds = step.duration * 60

  // Timer effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= totalSeconds) {
          setIsRunning(false)
          return totalSeconds
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const progressPercent = (elapsedSeconds / totalSeconds) * 100

  // Handle breath toggle
  const handleBreathToggle = async (breathId: string, currentStatus: boolean) => {
    await onToggleBreath(step.id, breathId, !currentStatus)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'rgba(30, 30, 30, 0.98)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-inherit">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: step.color,
                boxShadow: `0 4px 16px ${step.color}40`,
              }}
            >
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-cream-25">Focus Mode</h2>
              <p className="text-xs text-cream-25/60">Stay focused on your current task</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-cream-25" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {/* Task Name */}
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-lora font-light text-cream-25 mb-2">
              {step.label}
            </h3>
            {step.description && (
              <p className="text-sm text-cream-25/60">{step.description}</p>
            )}
          </div>

          {/* Timer Display */}
          <div className="mb-8">
            <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden mb-4">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)`,
                  boxShadow: `0 0 20px ${step.color}60`,
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <div className="text-4xl sm:text-5xl font-bold text-cream-25 font-mono tabular-nums">
                  {formatTime(elapsedSeconds)}
                </div>
                <div className="text-xs text-cream-25/50 mt-1">Elapsed</div>
              </div>

              <div className="text-center flex-1">
                <div className="text-4xl sm:text-5xl font-bold text-cream-25/60 font-mono tabular-nums">
                  {formatTime(Math.max(0, totalSeconds - elapsedSeconds))}
                </div>
                <div className="text-xs text-cream-25/50 mt-1">Remaining</div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition-all flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Resume
                  </>
                )}
              </Button>

              <Button
                onClick={() => setElapsedSeconds(0)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-cream-25 font-medium transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
          </div>

          {/* Breaths (Subtasks) */}
          {step.breaths && step.breaths.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-cream-25 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Breaths ({step.breaths.filter(b => b.completed).length}/{step.breaths.length})
              </h4>

              <div className="space-y-3">
                {step.breaths.map((breath) => (
                  <button
                    key={breath.id}
                    onClick={() => handleBreathToggle(breath.id, breath.completed)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      breath.completed
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {breath.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" strokeWidth={2.5} />
                    ) : (
                      <Circle className="w-6 h-6 text-cream-25/40 flex-shrink-0" strokeWidth={2} />
                    )}

                    <div className="flex-1 text-left">
                      <div className={`text-base font-medium ${
                        breath.completed ? "text-green-400 line-through" : "text-cream-25"
                      }`}>
                        {breath.name}
                      </div>
                      {breath.timeEstimationSeconds > 0 && (
                        <div className="text-xs text-cream-25/50 mt-1">
                          ~{Math.round(breath.timeEstimationSeconds / 60)} min
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Breaths Message */}
          {(!step.breaths || step.breaths.length === 0) && (
            <div className="text-center py-8">
              <p className="text-cream-25/60 text-sm">
                No subtasks for this step. Stay focused on completing the main task!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
