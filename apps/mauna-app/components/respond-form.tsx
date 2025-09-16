"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check } from "lucide-react"

interface RespondFormProps {
  emotion: {
    name: string
    category: string
  }
  triggerData: {
    context: string
    event: string
    worldview: string
  }
  isPainBox: boolean
  onComplete: (responseData: {
    reflection: string
    response: string
    isConstructive: boolean
    painBoxReasons?: string[]
  }) => void
}

export function RespondForm({ emotion, triggerData, isPainBox, onComplete }: RespondFormProps) {
  const [reflection, setReflection] = useState("")
  const [response, setResponse] = useState("")
  const [isConstructive, setIsConstructive] = useState<boolean | null>(null)
  const [painBoxReasons, setPainBoxReasons] = useState<string[]>([])
  const [otherReason, setOtherReason] = useState("")

  const painBoxOptions = [
    "I'm avoiding it to protect myself.",
    "It doesn't feel safe to feel this right now.",
    "I believe this feeling is wrong or weak.",
    "It's too overwhelming to face.",
    "I don't know how to process this.",
  ]

  const handlePainBoxReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setPainBoxReasons([...painBoxReasons.filter((r) => r !== "Other"), reason])
    } else {
      setPainBoxReasons(painBoxReasons.filter((r) => r !== reason))
    }
  }

  const handleOtherReasonChange = (value: string) => {
    setOtherReason(value)
    if (value && !painBoxReasons.includes("Other")) {
      setPainBoxReasons([...painBoxReasons, "Other"])
    } else if (!value && painBoxReasons.includes("Other")) {
      setPainBoxReasons(painBoxReasons.filter((r) => r !== "Other"))
    }
  }

  const handleSubmit = () => {
    const finalPainBoxReasons = painBoxReasons.includes("Other")
      ? [...painBoxReasons.filter((r) => r !== "Other"), `Other: ${otherReason}`]
      : painBoxReasons

    onComplete({
      reflection,
      response,
      isConstructive: !!isConstructive,
      painBoxReasons: isPainBox ? finalPainBoxReasons : undefined,
    })
  }

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

  const isComplete =
    reflection.trim() !== "" &&
    response.trim() !== "" &&
    isConstructive !== null &&
    (!isPainBox || painBoxReasons.length > 0)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center zen-heading">Respond to Your Emotion</CardTitle>
        <div className="flex justify-center">
          <Badge className={`text-lg py-2 px-4 ${getEmotionColor(emotion.category)}`}>{emotion.name}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">Reflect on the Trigger</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md space-y-2 text-sm">
            <p>
              <span className="font-medium">Context:</span> {triggerData.context}
            </p>
            <p>
              <span className="font-medium">Event:</span> {triggerData.event}
            </p>
            <p>
              <span className="font-medium">Worldview:</span> {triggerData.worldview}
            </p>
          </div>
          <Textarea
            placeholder="What insights do you have about how this trigger led to your emotional experience?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-24 mt-2"
          />
        </div>

        {isPainBox && (
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
            <h3 className="text-lg font-medium zen-subheading">Pain Box Reflection</h3>
            <p className="text-sm text-muted-foreground zen-body">Why might this feeling be hard to process?</p>

            <div className="space-y-2">
              {painBoxOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`reason-${option}`}
                    checked={painBoxReasons.includes(option)}
                    onCheckedChange={(checked) => handlePainBoxReasonChange(option, !!checked)}
                    className="data-[state=checked]:bg-vibrant-blue data-[state=checked]:border-vibrant-blue"
                  />
                  <label
                    htmlFor={`reason-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reason-other"
                  checked={painBoxReasons.includes("Other")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPainBoxReasons([...painBoxReasons, "Other"])
                    } else {
                      setPainBoxReasons(painBoxReasons.filter((r) => r !== "Other"))
                      setOtherReason("")
                    }
                  }}
                  className="data-[state=checked]:bg-vibrant-blue data-[state=checked]:border-vibrant-blue"
                />
                <label
                  htmlFor="reason-other"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other
                </label>
              </div>

              {painBoxReasons.includes("Other") && (
                <Input
                  placeholder="Specify other reason..."
                  value={otherReason}
                  onChange={(e) => handleOtherReasonChange(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <Button
              className="w-full bg-vibrant-blue hover:bg-vibrant-blue/90 animate-pulse"
              onClick={() => {
                // This just logs the current state but doesn't finalize
                console.log("Pain box reasons logged:", painBoxReasons)
              }}
            >
              Log This Bubble
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">Your Response</h3>
          <p className="text-sm text-muted-foreground zen-body">
            How would you like to respond to this emotion and situation?
          </p>
          <Textarea
            placeholder="I will..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium zen-subheading">Is this response constructive?</h3>
          <p className="text-sm text-muted-foreground zen-body">
            A constructive response helps you grow and heal, while a destructive one might cause more harm.
          </p>

          <RadioGroup
            value={isConstructive === null ? undefined : isConstructive ? "constructive" : "destructive"}
            onValueChange={(value) => setIsConstructive(value === "constructive")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="constructive" id="constructive" />
              <Label htmlFor="constructive">Yes, this response is constructive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="destructive" id="destructive" />
              <Label htmlFor="destructive">No, I need to rethink my response</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="flex items-center gap-2 bg-vibrant-blue hover:bg-vibrant-blue/90"
          >
            <Check className="w-4 h-4" />
            Processed
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
