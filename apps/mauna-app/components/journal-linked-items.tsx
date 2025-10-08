"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { databaseService } from "@/lib/database-service"
import { Target, Calendar, Heart, BookOpen, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface LinkedItemsProps {
  userId: string
  entryDate: string
  sourceType?: "step" | "habit" | null
  sourceId?: string | null
  visionBoardItemId?: string | null
  visionBoardItemTitle?: string | null
  visionBoardLevel?: string | null
}

interface HabitItem {
  id: string
  label: string
  color: string
  history: string[]
}

interface JournalEntryItem {
  id: string
  title: string | null
  type: string | null
  created_at: string
}

export function JournalLinkedItems({
  userId,
  entryDate,
  sourceType,
  sourceId,
  visionBoardItemId,
  visionBoardItemTitle,
  visionBoardLevel,
}: LinkedItemsProps) {
  const router = useRouter()
  const [sourceHabit, setSourceHabit] = useState<HabitItem | null>(null)
  const [relatedHabits, setRelatedHabits] = useState<HabitItem[]>([])
  const [relatedEntries, setRelatedEntries] = useState<JournalEntryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLinkedItems = async () => {
      try {
        setLoading(true)

        // Get the date string for comparison (YYYY-MM-DD format)
        const dateStr = new Date(entryDate).toISOString().split("T")[0]

        // Load source habit if sourceId is provided
        if (sourceId && sourceType === "habit") {
          const { data: habitData } = await databaseService.supabase
            .from("steps")
            .select("id, label, color, history")
            .eq("id", sourceId)
            .eq("user_id", userId)
            .eq("tag", "habit")
            .single()

          if (habitData) {
            setSourceHabit(habitData)
          }
        }

        // Load habits that were completed on the same date
        const { data: habitsData } = await databaseService.supabase
          .from("steps")
          .select("id, label, color, history")
          .eq("user_id", userId)
          .eq("tag", "habit")

        if (habitsData) {
          const habitsOnDate = habitsData.filter(
            (habit: HabitItem) =>
              habit.history?.includes(dateStr) &&
              (!sourceId || habit.id !== sourceId)
          )
          setRelatedHabits(habitsOnDate)
        }

        // Load journal entries from the same date (excluding current entry)
        const startOfDay = new Date(entryDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(entryDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: entriesData } = await databaseService.supabase
          .from("journal_entries")
          .select("id, title, type, created_at")
          .eq("user_id", userId)
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString())
          .limit(5)

        if (entriesData) {
          setRelatedEntries(entriesData)
        }
      } catch (error) {
        console.error("Error loading linked items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLinkedItems()
  }, [userId, entryDate, sourceId, sourceType])

  if (loading) {
    return (
      <Card className="bg-cream-25/5 border-cream-25/10">
        <CardHeader>
          <CardTitle className="text-cream-25 flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Linked Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cream-25/50 text-sm">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  const hasLinkedItems =
    sourceHabit ||
    visionBoardItemId ||
    relatedHabits.length > 0 ||
    relatedEntries.length > 0

  if (!hasLinkedItems) {
    return null
  }

  return (
    <Card className="bg-cream-25/5 border-cream-25/10">
      <CardHeader>
        <CardTitle className="text-cream-25 flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Linked Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Source Habit */}
        {sourceHabit && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cream-25/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Source Habit
            </h4>
            <div
              className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${sourceHabit.color}20`,
                borderLeft: `4px solid ${sourceHabit.color}`,
              }}
              onClick={() => router.push("/habits")}
            >
              <p className="text-cream-25 font-medium">{sourceHabit.label}</p>
              <p className="text-cream-25/50 text-xs mt-1">
                Logged {sourceHabit.history?.length || 0} times
              </p>
            </div>
          </div>
        )}

        {/* Vision Board Item */}
        {visionBoardItemId && visionBoardItemTitle && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cream-25/70 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Vision Board
            </h4>
            <div
              className="p-3 rounded-lg bg-vibrant-blue/20 border-l-4 border-vibrant-blue cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/focus")}
            >
              <Badge variant="secondary" className="mb-2 text-xs">
                {visionBoardLevel}
              </Badge>
              <p className="text-cream-25 font-medium">{visionBoardItemTitle}</p>
            </div>
          </div>
        )}

        {/* Related Habits */}
        {relatedHabits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cream-25/70 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Habits on this day ({relatedHabits.length})
            </h4>
            <div className="space-y-2">
              {relatedHabits.slice(0, 3).map((habit) => (
                <div
                  key={habit.id}
                  className="p-2 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: `${habit.color}15`,
                    borderLeft: `3px solid ${habit.color}`,
                  }}
                  onClick={() => router.push("/habits")}
                >
                  <p className="text-cream-25">{habit.label}</p>
                </div>
              ))}
              {relatedHabits.length > 3 && (
                <p className="text-xs text-cream-25/50 pl-2">
                  +{relatedHabits.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Related Journal Entries */}
        {relatedEntries.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cream-25/70 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Other entries today ({relatedEntries.length - 1})
            </h4>
            <div className="space-y-2">
              {relatedEntries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="p-2 rounded-lg bg-cream-25/10 border-l-3 border-cream-25/30 text-sm cursor-pointer hover:bg-cream-25/20 transition-colors"
                  onClick={() => router.push(`/journal/${entry.id}`)}
                >
                  <p className="text-cream-25">
                    {entry.title || "Untitled Entry"}
                  </p>
                  {entry.type && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {entry.type}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
