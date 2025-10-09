"use client"

import { BookOpen, Heart, Zap, Target, Coffee, Moon, Sun, Brain, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface JournalTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  content: string
  prompts?: string[]
  mood?: string
  tags?: string[]
  category?: string
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: "morning-pages",
    name: "Morning Pages",
    description: "Start your day with a brain dump and intentions",
    icon: Sun,
    color: "#FFD700",
    bgColor: "rgba(255, 215, 0, 0.15)",
    category: "daily",
    tags: ["morning", "daily", "reflection"],
    mood: "amazing",
    content: `# Morning Pages - {date}

## Stream of Consciousness
[Write whatever comes to mind for 3 pages or 750 words...]

## Today's Intentions
-
-
-

## Gratitude
I'm grateful for:
1.
2.
3. `,
    prompts: [
      "What's on my mind right now?",
      "What am I grateful for today?",
      "What are my top 3 priorities today?"
    ]
  },
  {
    id: "evening-reflection",
    name: "Evening Reflection",
    description: "Reflect on your day and prepare for tomorrow",
    icon: Moon,
    color: "#673AB7",
    bgColor: "rgba(103, 58, 183, 0.15)",
    category: "daily",
    tags: ["evening", "daily", "reflection"],
    mood: "content",
    content: `# Evening Reflection - {date}

## What Went Well Today
1.
2.
3.

## Challenges & Lessons Learned
- Challenge:
  Lesson:

## Tomorrow's Focus
Top 3 priorities:
1.
2.
3.

## Closing Thoughts
`,
    prompts: [
      "What were my wins today?",
      "What did I learn?",
      "What will I focus on tomorrow?"
    ]
  },
  {
    id: "gratitude-log",
    name: "Gratitude Log",
    description: "Daily gratitude practice for positive mindset",
    icon: Heart,
    color: "#E91E63",
    bgColor: "rgba(233, 30, 99, 0.15)",
    category: "wellness",
    tags: ["gratitude", "wellness", "mindfulness"],
    mood: "happy",
    content: `# Gratitude Log - {date}

## Three Things I'm Grateful For

### 1.
Why:

### 2.
Why:

### 3.
Why:

## Acts of Kindness
Today I was kind when:

## Looking Forward To
`,
    prompts: [
      "What made me smile today?",
      "Who am I grateful for?",
      "What opportunities do I have?"
    ]
  },
  {
    id: "habit-progress",
    name: "Habit Progress",
    description: "Track and reflect on your habits",
    icon: TrendingUp,
    color: "#4CAF50",
    bgColor: "rgba(76, 175, 80, 0.15)",
    category: "habits",
    tags: ["habits", "progress", "goals"],
    mood: "content",
    content: `# Habit Progress - {date}

## Habits Completed Today
- [ ]
- [ ]
- [ ]

## What Helped Me Succeed
-

## Obstacles Overcome
-

## Tomorrow's Habit Strategy
`,
    prompts: [
      "Which habits did I complete?",
      "What made it easy to stick to my habits?",
      "How can I improve tomorrow?"
    ]
  },
  {
    id: "weekly-review",
    name: "Weekly Review",
    description: "Comprehensive weekly reflection and planning",
    icon: Target,
    color: "#2196F3",
    bgColor: "rgba(33, 150, 243, 0.15)",
    category: "planning",
    tags: ["weekly", "review", "planning", "goals"],
    mood: "content",
    content: `# Weekly Review - {date}

## Week's Highlights
### Wins
1.
2.
3.

### Lessons Learned
1.
2.

## Progress Toward Goals
- Goal 1: [Progress]
- Goal 2: [Progress]
- Goal 3: [Progress]

## Next Week's Focus
### Top 3 Priorities
1.
2.
3.

### Habits to Strengthen
-

## Personal Insights
`,
    prompts: [
      "What were my biggest wins?",
      "What patterns do I notice?",
      "What will I focus on next week?"
    ]
  },
  {
    id: "emotional-processing",
    name: "Emotional Processing",
    description: "Work through emotions with CBT techniques",
    icon: Brain,
    color: "#FF9800",
    bgColor: "rgba(255, 152, 0, 0.15)",
    category: "emotional",
    tags: ["emotions", "cbt", "mental-health"],
    mood: "neutral",
    content: `# Emotional Processing - {date}

## What I'm Feeling
Primary emotion:
Intensity (1-10):

## The Situation
What happened:

## My Thoughts
Automatic thoughts:

## Reality Check
Evidence for:
Evidence against:

## Alternative Perspective
A more balanced thought:

## Action Steps
What I can do:
1.
2.

## Self-Compassion
`,
    prompts: [
      "What am I feeling right now?",
      "What triggered this emotion?",
      "What's a more balanced perspective?"
    ]
  },
  {
    id: "vision-alignment",
    name: "Vision Alignment",
    description: "Connect daily actions to long-term vision",
    icon: Zap,
    color: "#9C27B0",
    bgColor: "rgba(156, 39, 176, 0.15)",
    category: "vision",
    tags: ["vision", "goals", "alignment"],
    mood: "content",
    content: `# Vision Alignment Check - {date}

## My Core Vision
[Link to vision board item]

## Recent Actions Toward This Vision
1.
2.
3.

## Alignment Score (1-10):

## Course Corrections Needed
-

## Next Steps
This week:
-
This month:
-

## Inspirational Note to Self
`,
    prompts: [
      "How do my actions align with my vision?",
      "What's working well?",
      "What needs to change?"
    ]
  },
  {
    id: "quick-capture",
    name: "Quick Capture",
    description: "Fast entry for thoughts and ideas",
    icon: Coffee,
    color: "#795548",
    bgColor: "rgba(121, 85, 72, 0.15)",
    category: "general",
    tags: ["quick", "ideas", "thoughts"],
    mood: "neutral",
    content: `# Quick Note - {date}

`,
    prompts: [
      "What's on your mind?",
      "What idea do you want to capture?",
      "What do you need to remember?"
    ]
  },
  {
    id: "free-write",
    name: "Free Write",
    description: "Blank canvas for creative expression",
    icon: BookOpen,
    color: "#00BCD4",
    bgColor: "rgba(0, 188, 212, 0.15)",
    category: "general",
    tags: ["creative", "freeform"],
    mood: "neutral",
    content: `# Journal Entry - {date}

`,
    prompts: []
  }
]

interface JournalTemplatesSelectorProps {
  onSelect: (template: JournalTemplate) => void
  onClose: () => void
}

export function JournalTemplatesSelector({ onSelect, onClose }: JournalTemplatesSelectorProps) {
  const categories = [
    { id: "all", name: "All Templates", templates: JOURNAL_TEMPLATES },
    { id: "daily", name: "Daily Practice", templates: JOURNAL_TEMPLATES.filter(t => t.category === "daily") },
    { id: "wellness", name: "Wellness", templates: JOURNAL_TEMPLATES.filter(t => t.category === "wellness") },
    { id: "planning", name: "Planning", templates: JOURNAL_TEMPLATES.filter(t => t.category === "planning") },
    { id: "emotional", name: "Emotional", templates: JOURNAL_TEMPLATES.filter(t => t.category === "emotional") },
    { id: "general", name: "General", templates: JOURNAL_TEMPLATES.filter(t => t.category === "general") }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-lora font-light text-cream-25">Choose a Template</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-cream-25/70 hover:text-cream-25"
          >
            ✕
          </Button>
        </div>

        {categories.map(category => (
          category.templates.length > 0 && (
            <div key={category.id} className="mb-8">
              <h3 className="text-lg font-medium text-cream-25/80 mb-4">{category.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.templates.map(template => {
                  const Icon = template.icon
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
                      style={{
                        background: `linear-gradient(135deg, ${template.color}25, ${template.color}10)`,
                        backdropFilter: 'blur(40px) saturate(200%)',
                        border: `1px solid ${template.color}80`,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                      onClick={() => onSelect(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${template.color}50` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: '#ffffff' }} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{template.name}</h4>
                            <p className="text-white/80 text-sm">{template.description}</p>
                          </div>
                        </div>
                        {template.tags && template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {template.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-xs rounded-full bg-white/20 text-white/90"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
