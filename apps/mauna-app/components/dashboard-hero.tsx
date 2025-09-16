"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Target } from "lucide-react"
import { formatTimeDigital } from "@/lib/utils"

interface DashboardHeroProps {
  dailyGoal: string
  setDailyGoal: (goal: string) => void
  pomodoroTime: number
  pomodoroRunning: boolean
  pomodoroPhase: "work" | "break"
  onTogglePomodoro: () => void
  onResetPomodoro: () => void
}

export function DashboardHero({
  dailyGoal,
  setDailyGoal,
  pomodoroTime,
  pomodoroRunning,
  pomodoroPhase,
  onTogglePomodoro,
  onResetPomodoro,
}: DashboardHeroProps) {
  const [isEditingGoal, setIsEditingGoal] = useState(false)

  const progress =
    pomodoroPhase === "work" ? ((25 * 60 - pomodoroTime) / (25 * 60)) * 100 : ((5 * 60 - pomodoroTime) / (5 * 60)) * 100

  const circumference = 2 * Math.PI * 60
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="text-center space-y-8 mb-12">
      {/* Daily Goal Setter */}
      <Card className="glassmorphism border-brushed-silver/30 dark:border-ink-800/30 shadow-xl max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-logo-blue" />
            {/* Applied font-caveat here */}
            <h2 className="text-xl font-caveat zen-heading">Today's Focus</h2>
          </div>

          {isEditingGoal || !dailyGoal ? (
            <div className="flex gap-2">
              <Input
                placeholder="What's your main focus today?"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
                className="flex-1 h-12 glassmorphism border-logo-blue/30 focus:border-logo-blue text-center font-inter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingGoal(false)
                  }
                }}
                autoFocus
              />
              <Button onClick={() => setIsEditingGoal(false)} className="zen-button-primary">
                Set
              </Button>
            </div>
          ) : (
            <div
              className="text-lg font-inter text-center p-4 rounded-lg bg-logo-blue/10 cursor-pointer hover:bg-logo-blue/20 transition-colors"
              onClick={() => setIsEditingGoal(true)}
            >
              {dailyGoal}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pomodoro Timer */}
      <Card className="glassmorphism border-brushed-silver/30 dark:border-ink-800/30 shadow-xl max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h3 className="text-lg font-inter zen-heading">
              {pomodoroPhase === "work" ? "Focus Session" : "Break Time"}
            </h3>

            {/* Circular Timer */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="transparent"
                  stroke={pomodoroPhase === "work" ? "hsl(var(--moss-500))" : "hsl(var(--sage-500))"}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-inter">{formatTimeDigital(pomodoroTime)}</span>
                <span className="text-xs text-muted-foreground font-inter">
                  {pomodoroPhase === "work" ? "25 min" : "5 min"}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={onTogglePomodoro}
                className={pomodoroRunning ? "zen-button-secondary" : "zen-button-primary"}
                size="lg"
              >
                {pomodoroRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                onClick={onResetPomodoro}
                variant="outline"
                className="zen-button-secondary bg-transparent"
                size="lg"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
