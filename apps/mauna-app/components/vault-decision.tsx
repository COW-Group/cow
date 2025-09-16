"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Vault, Clock, X } from "lucide-react"

interface VaultDecisionProps {
  emotion: {
    name: string
    category: string
  }
  onContinue: (isPainBox: boolean) => void
  onDrop: () => void
}

export function VaultDecision({ emotion, onContinue, onDrop }: VaultDecisionProps) {
  const [isPainBox, setIsPainBox] = useState(false)

  const getEmotionColor = (category: string) => {
    const colors: Record<string, string> = {
      joy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      sadness: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      anger: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      fear: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      disgust: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 zen-heading">
          <Vault className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Emotion Vault
        </CardTitle>
        <p className="text-muted-foreground zen-body">Decide how to proceed with this emotion</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
          <h3 className="text-xl font-medium zen-heading">Processing:</h3>
          <Badge className={`text-lg py-2 px-4 ${getEmotionColor(emotion.category)}`}>{emotion.name}</Badge>
          <p className="text-center text-muted-foreground zen-body">
            You can choose to continue processing this emotion now, store it for later, or let it go
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="pain-box" checked={isPainBox} onCheckedChange={(checked) => setIsPainBox(!!checked)} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="pain-box"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                This is a "Pain Box" emotion
              </label>
              <p className="text-sm text-muted-foreground">
                Mark emotions that are difficult to face but need processing for your wellbeing
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={() => onContinue(isPainBox)}
              className="flex-1 flex items-center justify-center gap-2 bg-vibrant-blue hover:bg-vibrant-blue/90"
            >
              <ArrowRight className="w-4 h-4" />
              Continue Processing
            </Button>
            <Button
              variant="outline"
              onClick={onDrop}
              className="flex-1 flex items-center justify-center gap-2"
              disabled={isPainBox}
            >
              {isPainBox ? (
                <>
                  <X className="w-4 h-4" />
                  Pain Box Emotions Must Be Processed
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  Store For Later
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
