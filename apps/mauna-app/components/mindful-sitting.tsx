"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Play, Pause, RotateCcw } from "lucide-react"

interface MindfulSittingProps {
  selectedEmotion: string | null
  onReflectionComplete: (reflection: string) => void
}

export function MindfulSitting({ selectedEmotion, onReflectionComplete }: MindfulSittingProps) {
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(0)
  const [reflection, setReflection] = useState("")
  const [phase, setPhase] = useState<"prepare" | "sitting" | "reflect">("prepare")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && phase === "sitting") {
      interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, phase])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startSitting = () => {
    setPhase("sitting")
    setIsActive(true)
  }

  const pauseSitting = () => {
    setIsActive(false)
  }

  const completeSitting = () => {
    setIsActive(false)
    setPhase("reflect")
  }

  const reset = () => {
    setIsActive(false)
    setTime(0)
    setPhase("prepare")
    setReflection("")
  }

  const submitReflection = () => {
    onReflectionComplete(reflection)
    reset()
  }

  if (!selectedEmotion) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground zen-body">
            Select an emotion from the feelings wheel to begin mindful sitting
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        {phase === "prepare" && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-light zen-heading">
              Sitting with: <span className="text-blue-600 dark:text-blue-400">{selectedEmotion}</span>
            </h3>
            <p className="text-sm text-muted-foreground zen-body leading-relaxed">
              Find a comfortable position. Allow yourself to simply be with this feeling. There's no need to change or
              fix anything - just acknowledge and observe.
            </p>
            <Button onClick={startSitting} className="w-full zen-button-primary">
              <Play className="w-4 h-4 mr-2" />
              Begin Sitting
            </Button>
          </div>
        )}

        {phase === "sitting" && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-light zen-heading">
              Sitting with: <span className="text-blue-600 dark:text-blue-400">{selectedEmotion}</span>
            </h3>

            <div className="text-4xl font-mono p-6 rounded-full bg-blue-50 dark:bg-blue-900/20">{formatTime(time)}</div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground zen-body">
                Breathe naturally. Notice where you feel this emotion in your body. It's okay if your mind wanders -
                gently return to the feeling.
              </p>

              <div className="flex gap-3 justify-center">
                <Button onClick={isActive ? pauseSitting : () => setIsActive(true)} variant="outline" size="sm">
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button onClick={completeSitting} size="sm">
                  Complete
                </Button>
                <Button onClick={reset} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === "reflect" && (
          <div className="space-y-6">
            <h3 className="text-xl font-light text-center zen-heading">
              Reflection on: <span className="text-blue-600 dark:text-blue-400">{selectedEmotion}</span>
            </h3>
            <p className="text-sm text-muted-foreground zen-body text-center">
              What did you notice? How did the emotion feel in your body? Any insights or messages from this feeling?
            </p>

            <Textarea
              placeholder="Share what you discovered during your sitting..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-32"
            />

            <div className="flex gap-3">
              <Button onClick={submitReflection} className="flex-1">
                Save to Vault
              </Button>
              <Button onClick={reset} variant="outline">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
