"use client"

import { Badge } from "@/components/ui/badge"
import { Tag } from "lucide-react"

export interface TagCategory {
  id: string
  name: string
  color: string
  bgColor: string
  tags: string[]
}

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: "productivity",
    name: "Productivity",
    color: "#2196F3",
    bgColor: "rgba(33, 150, 243, 0.15)",
    tags: ["work", "goals", "planning", "tasks", "focus", "deep-work", "productivity"]
  },
  {
    id: "wellness",
    name: "Wellness",
    color: "#4CAF50",
    bgColor: "rgba(76, 175, 80, 0.15)",
    tags: ["health", "fitness", "exercise", "nutrition", "sleep", "wellness", "self-care"]
  },
  {
    id: "emotions",
    name: "Emotions",
    color: "#E91E63",
    bgColor: "rgba(233, 30, 99, 0.15)",
    tags: ["emotions", "feelings", "mood", "mental-health", "therapy", "cbt", "mindfulness"]
  },
  {
    id: "habits",
    name: "Habits",
    color: "#9C27B0",
    bgColor: "rgba(156, 39, 176, 0.15)",
    tags: ["habits", "routines", "progress", "tracking", "consistency", "daily"]
  },
  {
    id: "relationships",
    name: "Relationships",
    color: "#FF9800",
    bgColor: "rgba(255, 152, 0, 0.15)",
    tags: ["relationships", "family", "friends", "social", "connection", "communication"]
  },
  {
    id: "learning",
    name: "Learning",
    color: "#00BCD4",
    bgColor: "rgba(0, 188, 212, 0.15)",
    tags: ["learning", "education", "skills", "books", "courses", "growth", "development"]
  },
  {
    id: "creativity",
    name: "Creativity",
    color: "#673AB7",
    bgColor: "rgba(103, 58, 183, 0.15)",
    tags: ["creative", "art", "writing", "music", "ideas", "inspiration", "projects"]
  },
  {
    id: "gratitude",
    name: "Gratitude",
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.15)",
    tags: ["gratitude", "thankful", "appreciation", "blessings", "positive"]
  },
  {
    id: "reflection",
    name: "Reflection",
    color: "#795548",
    bgColor: "rgba(121, 85, 72, 0.15)",
    tags: ["reflection", "review", "insights", "lessons", "introspection", "journal"]
  },
  {
    id: "vision",
    name: "Vision & Goals",
    color: "#F44336",
    bgColor: "rgba(244, 67, 54, 0.15)",
    tags: ["vision", "goals", "dreams", "aspirations", "future", "planning", "alignment"]
  }
]

interface TagCategoriesSelectorProps {
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  maxVisible?: number
}

export function TagCategoriesSelector({
  selectedTags,
  onTagToggle,
  maxVisible = 5
}: TagCategoriesSelectorProps) {
  return (
    <div className="space-y-4">
      {TAG_CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h4 className="text-sm font-medium text-cream-25">{category.name}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.tags.slice(0, maxVisible).map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: isSelected ? category.color : category.bgColor,
                    color: isSelected ? "#fff" : category.color,
                    borderColor: category.color,
                  }}
                >
                  {tag}
                </Badge>
              )
            })}
            {category.tags.length > maxVisible && (
              <Badge
                variant="outline"
                className="text-xs text-cream-25/60 border-cream-25/30"
              >
                +{category.tags.length - maxVisible} more
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

interface QuickTagsSelectorProps {
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

export function QuickTagsSelector({ selectedTags, onTagToggle }: QuickTagsSelectorProps) {
  // Get 3 most popular tags from each category
  const popularTags = TAG_CATEGORIES.flatMap(cat =>
    cat.tags.slice(0, 3).map(tag => ({ tag, category: cat }))
  ).slice(0, 15)

  return (
    <div className="flex flex-wrap gap-2">
      {popularTags.map(({ tag, category }) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <Badge
            key={tag}
            onClick={() => onTagToggle(tag)}
            className="cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: isSelected ? category.color : category.bgColor,
              color: isSelected ? "#fff" : category.color,
              borderColor: category.color,
            }}
          >
            <Tag className="w-3 h-3 mr-1" />
            {tag}
          </Badge>
        )
      })}
    </div>
  )
}
