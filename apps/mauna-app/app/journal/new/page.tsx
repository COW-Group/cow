"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { JournalEntry, Range } from "@/lib/types"
import { toast } from "sonner"
import { Loader2Icon, BookTemplate, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JournalTemplatesSelector, type JournalTemplate, JOURNAL_TEMPLATES } from "@/components/journal-templates"
import { Badge } from "@/components/ui/badge"
import { TagCategoriesSelector, QuickTagsSelector } from "@/components/tag-categories"
import { MarkdownEditor } from "@/components/markdown-editor"

export default function NewJournalEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: currentUser, loading: authLoading } = useAuth(AuthService)
  const [title, setTitle] = useState("")
  const [entry, setEntry] = useState("")
  const [category, setCategory] = useState("inbox")
  const [visionBoardLevel, setVisionBoardLevel] = useState<string | null>(null)
  const [visionBoardItemId, setVisionBoardItemId] = useState<string | null>(null)
  const [visionBoardItemTitle, setVisionBoardItemTitle] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [type, setType] = useState<string | null>(null)
  const [visionBoardSections, setVisionBoardSections] = useState<Range[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null)
  const [mood, setMood] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState("")

  const loadVisionBoardSections = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const data = await databaseService.fetchRanges(currentUser.id)
      console.log("Fetched vision board ranges:", data)
      setVisionBoardSections(data || [])
    } catch (error: any) {
      console.error("Failed to fetch vision board data:", error)
      toast.error("Failed to load vision board data.")
    }
  }, [currentUser?.id])

  const handleTemplateSelect = useCallback((template: JournalTemplate) => {
    // Format current date
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })

    // Replace {date} placeholder with formatted date
    const populatedContent = template.content.replace(/{date}/g, formattedDate)

    // Set title if empty
    if (!title.trim()) {
      setTitle(template.name)
    }

    // Populate entry with template content
    setEntry(populatedContent)

    // Apply template tags
    if (template.tags && template.tags.length > 0) {
      setTags(template.tags)
    }

    // Apply template mood
    if (template.mood) {
      setMood(template.mood)
      setType(template.mood)
    }

    // Store selected template
    setSelectedTemplate(template)

    // Close modal
    setShowTemplateSelector(false)

    toast.success(`Template "${template.name}" applied!`)
  }, [title])

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }, [tagInput, tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }, [tags])

  const handleTagToggle = useCallback((tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }, [tags])

  const loadHabitsProgress = useCallback(async () => {
    if (!currentUser?.id) return

    try {
      const today = new Date()
      const dateStr = today.toISOString().split("T")[0]
      const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })

      // Fetch all habits
      const { data: habitsData } = await databaseService.supabase
        .from("steps")
        .select("id, label, color, history, habit_notes, habit_units")
        .eq("user_id", currentUser.id)
        .eq("tag", "habit")

      if (!habitsData) return

      // Filter habits completed today
      const completedToday = habitsData.filter((habit: any) =>
        habit.history?.includes(dateStr)
      )

      // Build habit progress content
      let habitContent = `# Habit Progress - ${formattedDate}\n\n`

      if (completedToday.length > 0) {
        habitContent += `## Habits Completed Today\n`
        completedToday.forEach((habit: any) => {
          habitContent += `- [x] ${habit.label}`

          // Add units if available
          const units = habit.habit_units?.[dateStr]
          if (units) {
            habitContent += ` (${units} units)`
          }

          // Add notes if available
          const notes = habit.habit_notes?.[dateStr]
          if (notes && notes !== habit.habit_notes?._scheduled_time) {
            habitContent += `\n  Note: ${notes}`
          }

          habitContent += `\n`
        })
        habitContent += `\n`
      } else {
        habitContent += `## Habits Completed Today\n- No habits completed yet today\n\n`
      }

      habitContent += `## What Helped Me Succeed\n-\n\n`
      habitContent += `## Obstacles Overcome\n-\n\n`
      habitContent += `## Tomorrow's Habit Strategy\n`

      // Find and apply habit progress template
      const habitTemplate = JOURNAL_TEMPLATES.find(t => t.id === "habit-progress")
      if (habitTemplate) {
        setSelectedTemplate(habitTemplate)
        setTags(habitTemplate.tags || ["habits", "progress"])
        setMood(habitTemplate.mood || "content")
        setType(habitTemplate.mood || "content")
      }

      setTitle(`Habit Progress - ${formattedDate}`)
      setEntry(habitContent)
      toast.success(`Loaded progress for ${completedToday.length} habits completed today!`)
    } catch (error) {
      console.error("Error loading habits progress:", error)
      toast.error("Failed to load habits progress")
    }
  }, [currentUser?.id])

  const loadEmotionalProcessing = useCallback(async (emotionId: string) => {
    if (!currentUser?.id) return

    try {
      const { data: emotionData } = await databaseService.supabase
        .from("emotion_entries")
        .select("*")
        .eq("id", emotionId)
        .eq("user_id", currentUser.id)
        .single()

      if (!emotionData) {
        toast.error("Emotion not found")
        return
      }

      const today = new Date()
      const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })

      // Build emotional processing content
      let emotionContent = `# Emotional Processing - ${formattedDate}\n\n`

      emotionContent += `## What I'm Feeling\n`
      emotionContent += `Primary emotion: ${emotionData.emotion_name || "Not specified"}\n`
      emotionContent += `Intensity (1-10): ${emotionData.intensity || "Not specified"}\n\n`

      emotionContent += `## The Situation\n`
      emotionContent += `What happened: ${emotionData.trigger_event || ""}\n\n`

      if (emotionData.trigger_context) {
        emotionContent += `Context: ${emotionData.trigger_context}\n\n`
      }

      emotionContent += `## My Thoughts\n`
      if (emotionData.trigger_worldview) {
        emotionContent += `Automatic thoughts: ${emotionData.trigger_worldview}\n\n`
      } else {
        emotionContent += `Automatic thoughts:\n\n`
      }

      emotionContent += `## Physical Experience\n`
      emotionContent += `${emotionData.physical_sensations || ""}\n\n`

      if (emotionData.notes) {
        emotionContent += `## Reflection\n`
        emotionContent += `${emotionData.notes}\n\n`
      }

      if (emotionData.response) {
        emotionContent += `## My Response\n`
        emotionContent += `${emotionData.response}\n\n`
      }

      emotionContent += `## Self-Compassion\n`

      // Find and apply emotional processing template
      const emotionTemplate = JOURNAL_TEMPLATES.find(t => t.id === "emotional-processing")
      if (emotionTemplate) {
        setSelectedTemplate(emotionTemplate)
        setTags(emotionTemplate.tags || ["emotions", "cbt", "mental-health"])
        setMood(emotionTemplate.mood || "neutral")
        setType(emotionTemplate.mood || "neutral")
      }

      setTitle(`Emotional Processing - ${emotionData.emotion_name || "Reflection"}`)
      setEntry(emotionContent)
      toast.success("Loaded emotional processing data!")
    } catch (error) {
      console.error("Error loading emotional processing:", error)
      toast.error("Failed to load emotional processing")
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (!authLoading && currentUser?.id) {
      loadVisionBoardSections()

      // Check if coming from habits or emotional page
      const source = searchParams.get("source")
      const emotionId = searchParams.get("emotionId")

      if (source === "habits") {
        loadHabitsProgress()
      } else if (source === "emotional" && emotionId) {
        loadEmotionalProcessing(emotionId)
      }
    } else if (!authLoading && !currentUser?.id) {
      setError("Please sign in to create a journal entry.")
      router.push("/auth/signin")
    }
  }, [authLoading, currentUser?.id, loadVisionBoardSections, searchParams, loadHabitsProgress, loadEmotionalProcessing, router])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!currentUser?.id) return
      if (!title.trim()) {
        toast.error("Title cannot be empty.")
        return
      }
      setLoading(true)
      try {
        const newEntry: Omit<JournalEntry, "id" | "created_at" | "updated_at" | "is_archived" | "is_favorite"> = {
          userId: currentUser.id,
          title,
          entry,
          category,
          visionboardlevel: visionBoardLevel,
          visionboarditemid: visionBoardItemId,
          visionboarditemtitle: visionBoardItemTitle,
          tags,
          type,
        }
        const { data, error } = await databaseService.createJournalEntry(currentUser.id, newEntry)
        if (error) throw error
        toast.success("Journal entry created successfully!")
        router.push("/journal")
      } catch (err: any) {
        console.error("Failed to create journal entry:", err)
        toast.error("Failed to create journal entry.")
      } finally {
        setLoading(false)
      }
    },
    [currentUser?.id, title, entry, category, visionBoardLevel, visionBoardItemId, visionBoardItemTitle, tags, type, router]
  )

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25 p-4">
      <div className="h-16 sm:h-20"></div>
      <main className="container mx-auto p-4 sm:p-6 max-w-full flex-1 overflow-hidden">
        <h1 className="text-4xl font-bold mb-6 text-center">New Journal Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {/* Template Selection Button */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              onClick={() => setShowTemplateSelector(true)}
              variant="outline"
              className="text-cream-25 border-cream-25/50 hover:bg-cream-25/10"
            >
              <BookTemplate className="h-4 w-4 mr-2" />
              {selectedTemplate ? "Change Template" : "Choose Template"}
            </Button>
            {selectedTemplate && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-cream-25/70">Using:</span>
                <Badge
                  style={{
                    backgroundColor: selectedTemplate.bgColor,
                    borderColor: selectedTemplate.color,
                    color: selectedTemplate.color,
                  }}
                  className="border"
                >
                  {selectedTemplate.name}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate(null)
                    setEntry("")
                    setTags([])
                    setMood(null)
                    setType(null)
                  }}
                  className="h-6 w-6 p-0 text-cream-25/50 hover:text-cream-25"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Template Prompts */}
          {selectedTemplate && selectedTemplate.prompts && selectedTemplate.prompts.length > 0 && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: selectedTemplate.bgColor,
                borderColor: `${selectedTemplate.color}33`,
              }}
            >
              <h3 className="text-sm font-medium text-cream-25 mb-2">Reflection Prompts:</h3>
              <ul className="space-y-1">
                {selectedTemplate.prompts.map((prompt, index) => (
                  <li key={index} className="text-sm text-cream-25/70">
                    • {prompt}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50"
            />
          </div>
          <div>
            <label htmlFor="entry" className="block text-sm font-medium mb-2">Entry</label>
            <MarkdownEditor
              value={entry}
              onChange={setEntry}
              placeholder="Start writing your journal entry... Use markdown for formatting!"
              minRows={12}
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label htmlFor="mood" className="block text-sm font-medium mb-2">Mood</label>
            <Select value={mood || ""} onValueChange={(value) => { setMood(value); setType(value); }}>
              <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                <SelectValue placeholder="How are you feeling?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazing">☀️ Amazing</SelectItem>
                <SelectItem value="happy">😊 Happy</SelectItem>
                <SelectItem value="content">❤️ Content</SelectItem>
                <SelectItem value="neutral">😐 Neutral</SelectItem>
                <SelectItem value="anxious">⚡ Anxious</SelectItem>
                <SelectItem value="sad">☁️ Sad</SelectItem>
                <SelectItem value="upset">😞 Upset</SelectItem>
                <SelectItem value="tired">🌙 Tired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">Tags</label>

            {/* Selected Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-cream-25/20 text-cream-25 cursor-pointer hover:bg-cream-25/30"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Tags Selector */}
            <div className="mb-3">
              <h4 className="text-xs font-medium text-cream-25/70 mb-2">Quick Tags</h4>
              <QuickTagsSelector selectedTags={tags} onTagToggle={handleTagToggle} />
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2 mb-3">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add custom tag..."
                className="flex-1 text-cream-25 bg-cream-25/10 border-cream-25/50"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="text-cream-25 border-cream-25/50 hover:bg-cream-25/10"
              >
                Add
              </Button>
            </div>

            {/* Full Tag Categories - Collapsible */}
            <details className="group">
              <summary className="cursor-pointer text-xs text-cream-25/70 hover:text-cream-25 mb-2 list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▶</span>
                Browse all tag categories
              </summary>
              <div className="mt-3 p-4 rounded-lg bg-cream-25/5 border border-cream-25/10 max-h-[400px] overflow-y-auto">
                <TagCategoriesSelector selectedTags={tags} onTagToggle={handleTagToggle} />
              </div>
            </details>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbox">Inbox</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="visionBoardLevel" className="block text-sm font-medium">Vision Board Level</label>
            <Select
              value={visionBoardLevel || ""}
              onValueChange={(value) => {
                setVisionBoardLevel(value || null)
                setVisionBoardItemId(null)
                setVisionBoardItemTitle(null)
              }}
            >
              <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                <SelectValue placeholder="Select vision board level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="range">Range</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="hill">Hill</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="length">Length</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {visionBoardLevel && (
            <div>
              <label htmlFor="visionBoardItem" className="block text-sm font-medium">Vision Board Item</label>
              <Select
                value={visionBoardItemId || ""}
                onValueChange={(value) => {
                  const selectedItem = visionBoardSections
                    .flatMap((range) => [
                      { id: range.id, name: range.name, level: "range" },
                      ...range.mountains.flatMap((mountain) => [
                        { id: mountain.id, name: mountain.name, level: "mountain" },
                        ...mountain.hills.flatMap((hill) => [
                          { id: hill.id, name: hill.name, level: "hill" },
                          ...hill.terrains.flatMap((terrain) => [
                            { id: terrain.id, name: terrain.name, level: "terrain" },
                            ...terrain.lengths.map((length) => ({
                              id: length.id,
                              name: length.name,
                              level: "length",
                            })),
                          ]),
                        ]),
                      ]),
                    ])
                    .find((item) => item.id === value && item.level === visionBoardLevel);
                  setVisionBoardItemId(value || null)
                  setVisionBoardItemTitle(selectedItem?.name || null)
                }}
              >
                <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                  <SelectValue placeholder="Select vision board item" />
                </SelectTrigger>
                <SelectContent>
                  {visionBoardSections
                    .flatMap((range) => [
                      { id: range.id, name: range.name, level: "range" },
                      ...range.mountains.flatMap((mountain) => [
                        { id: mountain.id, name: mountain.name, level: "mountain" },
                        ...mountain.hills.flatMap((hill) => [
                          { id: hill.id, name: hill.name, level: "hill" },
                          ...hill.terrains.flatMap((terrain) => [
                            { id: terrain.id, name: terrain.name, level: "terrain" },
                            ...terrain.lengths.map((length) => ({
                              id: length.id,
                              name: length.name,
                              level: "length",
                            })),
                          ]),
                        ]),
                      ]),
                    ])
                    .filter((item) => item.level === visionBoardLevel)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="text-cream-25 border-cream-25/50 hover:bg-cream-25/10"
          >
            {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : "Create Entry"}
          </Button>
        </form>
      </main>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <JournalTemplatesSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  )
}