"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

interface TriggerFormProps {
  onComplete: (triggerData: {
    context: string
    event: string
    worldview: string
  }) => void
  initialData?: {
    context?: string
    event?: string
    worldview?: string
  }
}

export function TriggerForm({ onComplete, initialData }: TriggerFormProps) {
  const [context, setContext] = useState(initialData?.context || "")
  const [event, setEvent] = useState(initialData?.event || "")
  const [worldview, setWorldview] = useState(initialData?.worldview || "")

  const handleSubmit = () => {
    onComplete({
      context,
      event,
      worldview,
    })
  }

  const isComplete = context.trim() !== "" && event.trim() !== ""

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center zen-heading">What triggered this emotional experience?</CardTitle>
        <p className="text-center text-muted-foreground zen-body">
          Understanding what triggers our emotions helps us respond more mindfully
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">Current Circumstances & Feelings</h3>
          <p className="text-sm text-muted-foreground zen-body">
            What was happening in your life and how were you feeling before this event?
          </p>
          <Textarea
            placeholder="I was feeling tired after a long day at work and was looking forward to relaxing..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">The Event</h3>
          <p className="text-sm text-muted-foreground zen-body">
            Describe what happened that triggered your emotional response
          </p>
          <Textarea
            placeholder="My friend canceled our plans at the last minute..."
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">Your Worldview</h3>
          <p className="text-sm text-muted-foreground zen-body">
            How might your past experiences or beliefs be influencing how you see this situation?
          </p>
          <Textarea
            placeholder="In the past, people have often let me down when I needed them..."
            value={worldview}
            onChange={(e) => setWorldview(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="flex items-center gap-2 bg-vibrant-blue hover:bg-vibrant-blue/90"
          >
            Continue to Experience
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
