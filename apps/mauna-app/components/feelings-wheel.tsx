"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Frown, Angry, Zap, X } from "lucide-react"

interface FeelingsWheelProps {
  onEmotionSelect: (emotion: string, category: string) => void
}

const emotionCategories = {
  joy: {
    icon: Heart,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    emotions: ["Happy", "Excited", "Grateful", "Peaceful", "Confident", "Loved", "Optimistic", "Proud"],
  },
  sadness: {
    icon: Frown,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    emotions: ["Sad", "Lonely", "Disappointed", "Grief", "Melancholy", "Despair", "Hurt", "Rejected"],
  },
  anger: {
    icon: Angry,
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    emotions: ["Angry", "Frustrated", "Irritated", "Resentful", "Furious", "Annoyed", "Outraged", "Bitter"],
  },
  fear: {
    icon: Zap,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    emotions: ["Afraid", "Anxious", "Worried", "Nervous", "Scared", "Panicked", "Terrified", "Insecure"],
  },
  disgust: {
    icon: X,
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    emotions: ["Disgusted", "Revolted", "Contempt", "Loathing", "Repulsed", "Sickened", "Appalled", "Offended"],
  },
}

export function FeelingsWheel({ onEmotionSelect }: FeelingsWheelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handleEmotionSelect = (emotion: string, category: string) => {
    onEmotionSelect(emotion, category)
    setSelectedCategory(null)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center zen-heading">Feelings Wheel</CardTitle>
        <p className="text-center text-muted-foreground zen-body">Click on a category to explore specific emotions</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(emotionCategories).map(([category, data]) => {
            const IconComponent = data.icon
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`h-20 flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedCategory === category ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <IconComponent className="w-6 h-6" />
                <span className="capitalize font-medium">{category}</span>
              </Button>
            )
          })}
        </div>

        {/* Specific Emotions */}
        {selectedCategory && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            <h3 className="text-lg font-medium text-center capitalize zen-heading">{selectedCategory} Emotions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {emotionCategories[selectedCategory as keyof typeof emotionCategories].emotions.map((emotion) => (
                <Badge
                  key={emotion}
                  className={`${emotionCategories[selectedCategory as keyof typeof emotionCategories].color} cursor-pointer hover:opacity-80 transition-opacity p-2 text-center justify-center`}
                  onClick={() => handleEmotionSelect(emotion, selectedCategory)}
                >
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
