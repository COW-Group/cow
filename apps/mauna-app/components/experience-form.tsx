"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"
import { FeelingsWheel } from "./feelings-wheel"

interface ExperienceFormProps {
  onComplete: (experienceData: {
    emotion: string
    category: string
    sensations: string
    subjectiveFeelings: string
  }) => void
  initialData?: {
    emotion?: string
    category?: string
    sensations?: string
    subjectiveFeelings?: string
  }
}

export function ExperienceForm({ onComplete, initialData }: ExperienceFormProps) {
  const [selectedEmotion, setSelectedEmotion] = useState(initialData?.emotion || "")
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "")
  const [sensations, setSensations] = useState(initialData?.sensations || "")
  const [subjectiveFeelings, setSubjectiveFeelings] = useState(initialData?.subjectiveFeelings || "")

  const handleEmotionSelect = (emotion: string, category: string) => {
    setSelectedEmotion(emotion)
    setSelectedCategory(category)
  }

  const handleSubmit = () => {
    onComplete({
      emotion: selectedEmotion,
      category: selectedCategory,
      sensations,
      subjectiveFeelings,
    })
  }

  const isComplete = selectedEmotion !== ""

  return (
    <div className="space-y-8">
      <FeelingsWheel onEmotionSelect={handleEmotionSelect} />

      {selectedEmotion && (
        <Card className="w-full max-w-4xl mx-auto animate-in fade-in-50 duration-300">
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-medium zen-heading">
                You're experiencing: <span className="text-blue-600 dark:text-blue-400">{selectedEmotion}</span>
              </h3>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-medium zen-subheading">Physical Sensations</h4>
              <p className="text-sm text-muted-foreground zen-body">
                Where do you feel this emotion in your body? What physical sensations arise?
              </p>
              <Textarea
                placeholder="I feel tightness in my chest, my shoulders are tense..."
                value={sensations}
                onChange={(e) => setSensations(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-medium zen-subheading">Subjective Experience</h4>
              <p className="text-sm text-muted-foreground zen-body">
                How does this emotion color your perception of the situation?
              </p>
              <Textarea
                placeholder="This makes me see the situation as threatening, I feel like I can't trust..."
                value={subjectiveFeelings}
                onChange={(e) => setSubjectiveFeelings(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!isComplete}
                className="flex items-center gap-2 bg-vibrant-blue hover:bg-vibrant-blue/90"
              >
                Continue to Vault
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
