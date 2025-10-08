"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { JournalEntry, Range, AppSettings } from "@/lib/types"
import { toast } from "sonner"
import {
  Loader2Icon,
  Plus,
  Calendar,
  List,
  Search,
  Filter,
  Smile,
  Meh,
  Frown,
  Heart,
  Zap,
  Cloud,
  Sun,
  Moon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingNav } from "@/components/floating-nav"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mood configurations with colors
const MOODS = {
  amazing: { icon: Sun, label: "Amazing", color: "#FFD700", bgColor: "rgba(255, 215, 0, 0.15)" },
  happy: { icon: Smile, label: "Happy", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.15)" },
  content: { icon: Heart, label: "Content", color: "#00B7EB", bgColor: "rgba(0, 183, 235, 0.15)" },
  neutral: { icon: Meh, label: "Neutral", color: "#9E9E9E", bgColor: "rgba(158, 158, 158, 0.15)" },
  anxious: { icon: Zap, label: "Anxious", color: "#FF9800", bgColor: "rgba(255, 152, 0, 0.15)" },
  sad: { icon: Cloud, label: "Sad", color: "#2196F3", bgColor: "rgba(33, 150, 243, 0.15)" },
  upset: { icon: Frown, label: "Upset", color: "#F44336", bgColor: "rgba(244, 67, 54, 0.15)" },
  tired: { icon: Moon, label: "Tired", color: "#673AB7", bgColor: "rgba(103, 58, 183, 0.15)" },
} as const

type MoodKey = keyof typeof MOODS

export default function JournalPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [visionBoardData, setVisionBoardData] = useState<Range[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // View state
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("timeline")

  // Filter & search state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("all")
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all")

  // App settings for FloatingNav
  const [appSettings, setAppSettings] = useState<AppSettings>({
    focusMode: false,
    showWeather: true,
    showGreeting: true,
    showMantra: false,
    showTasks: true,
    showQuotes: true,
    darkMode: false,
    soundEnabled: true,
    defaultDuration: 30,
    autoLoop: false,
    showCalendarMenu: true,
    showTasksMenu: true,
    showJournalMenu: true,
    showVisionBoardMenu: true,
    showBalanceMenu: true,
    showWealthManagementMenu: true,
    showLinksMenu: true,
    showMantrasMenu: true,
    showQuotesMenu: true,
    showCompletedMountainsMenu: true,
    showAudioSettingsMenu: true,
    showMountainPreferencesMenu: true,
    showBubblesMenu: true,
    showHabitsMenu: true,
    showHelpMenu: true,
    showHeaderMain: true,
    showHeaderFocus: true,
    showHeaderEmotional: true,
    showHeaderHealth: true,
    showHeaderHabits: true,
    showHeaderVision: true,
    showHeaderWealth: true,
    showHeaderSocial: true,
    showHeaderProjects: true,
    showHeaderSales: true,
    showHeaderMarketplace: true,
    showHeaderTimeline: true,
  })

  const handleUpdateAppSettings = (updatedSettings: AppSettings) => {
    setAppSettings(updatedSettings)
  }

  const fetchJournalEntries = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await databaseService.getJournalEntries(user.id)
      if (error) throw error
      console.log("Fetched journal entries:", data)
      setJournalEntries(data || [])
    } catch (err: any) {
      console.error("Failed to fetch journal entries:", err)
      setError("Failed to load journal entries. Please try again.")
      toast.error("Failed to load journal entries.")
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  const fetchVisionBoardData = useCallback(async () => {
    if (!user?.id) return
    try {
      const data = await databaseService.fetchRanges(user.id)
      console.log("Fetched vision board ranges:", data)
      setVisionBoardData(data)
    } catch (err: any) {
      console.error("Failed to fetch vision board data:", err)
      toast.error("Failed to load vision board data.")
    }
  }, [user?.id])

  useEffect(() => {
    if (!authLoading && user?.id) {
      fetchJournalEntries()
      fetchVisionBoardData()
    } else if (!authLoading && !user?.id) {
      setLoading(false)
      setError("Please sign in to view your journal.")
      router.push("/auth/signin")
    }
  }, [user?.id, authLoading, fetchJournalEntries, fetchVisionBoardData, router])

  const handleDeleteEntry = useCallback(
    async (entryId: string) => {
      if (!user?.id) return
      try {
        await databaseService.deleteJournalEntry(entryId, user.id)
        setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId))
        toast.success("Journal entry deleted successfully!")
      } catch (err: any) {
        console.error("Failed to delete journal entry:", err)
        toast.error("Failed to delete journal entry.")
      }
    },
    [user?.id],
  )

  // Extract mood from entry content or tags (temporary until DB is updated)
  const getEntryMood = (entry: JournalEntry): MoodKey | null => {
    // Check tags for mood
    if (entry.tags) {
      const moodTag = entry.tags.find(tag => tag in MOODS)
      if (moodTag) return moodTag as MoodKey
    }

    // Check entry content for mood keywords
    const content = (entry.entry || "").toLowerCase()
    for (const [mood] of Object.entries(MOODS)) {
      if (content.includes(mood)) {
        return mood as MoodKey
      }
    }

    return null
  }

  // Get all unique tags from entries
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    journalEntries.forEach(entry => {
      entry.tags?.forEach(tag => {
        if (!(tag in MOODS)) { // Exclude mood tags
          tags.add(tag)
        }
      })
    })
    return Array.from(tags).sort()
  }, [journalEntries])

  // Filtered entries based on search and filters
  const filteredEntries = useMemo(() => {
    return journalEntries.filter(entry => {
      // Search filter
      const matchesSearch = searchQuery === "" ||
        (entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         entry.entry?.toLowerCase().includes(searchQuery.toLowerCase()))

      // Mood filter
      const entryMood = getEntryMood(entry)
      const matchesMood = selectedMoodFilter === "all" || entryMood === selectedMoodFilter

      // Tag filter
      const matchesTag = selectedTagFilter === "all" ||
        entry.tags?.includes(selectedTagFilter)

      return matchesSearch && matchesMood && matchesTag
    })
  }, [journalEntries, searchQuery, selectedMoodFilter, selectedTagFilter])

  // Group entries by date for calendar view
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, JournalEntry[]>()
    filteredEntries.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString()
      if (!grouped.has(date)) {
        grouped.set(date, [])
      }
      grouped.get(date)!.push(entry)
    })
    return grouped
  }, [filteredEntries])

  if (loading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <Loader2Icon className="h-10 w-10 animate-spin text-cream-25" />
            <div className="text-xl font-light text-cream-25 text-center">Loading journal...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <p className="text-lg text-cream-25">{error}</p>
        </div>
      </div>
    )
  }

  const MoodIcon = ({ mood }: { mood: MoodKey }) => {
    const Icon = MOODS[mood].icon
    return <Icon className="w-5 h-5" style={{ color: MOODS[mood].color }} />
  }

  const EntryCard = ({ entry }: { entry: JournalEntry }) => {
    const mood = getEntryMood(entry)
    const moodConfig = mood ? MOODS[mood] : null

    return (
      <Card
        className="w-full overflow-hidden border-0 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        style={{
          background: moodConfig?.bgColor || 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '24px',
          border: `1px solid ${moodConfig?.color || 'rgba(255, 255, 255, 0.12)'}33`,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
        }}
        onClick={() => router.push(`/journal/${entry.id}`)}
      >
        <CardContent className="p-6">
          {/* Header with mood and date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {mood && <MoodIcon mood={mood} />}
              <span className="text-sm text-cream-25/70">
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {entry.tags?.filter(tag => !(tag in MOODS)).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-cream-25/20 text-cream-25"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-lora font-light text-cream-25 mb-3">
            {entry.title || "Untitled Entry"}
          </h2>

          {/* Entry preview */}
          <p className="text-cream-25/80 text-sm line-clamp-3 mb-4">
            {entry.entry ? entry.entry.slice(0, 200) + (entry.entry.length > 200 ? "..." : "") : "No content"}
          </p>

          {/* Vision board link */}
          {entry.visionboardlevel && entry.visionboarditemtitle && (
            <div className="flex items-center gap-2 text-xs text-cream-25/60 mt-3 pt-3 border-t border-cream-25/10">
              <Heart className="w-4 h-4" />
              <span>
                Linked to: {entry.visionboardlevel} - {entry.visionboarditemtitle}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const TimelineView = () => (
    <div className="space-y-4">
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-cream-25/70 text-lg">No journal entries found.</p>
          <p className="text-cream-25/50 text-sm mt-2">
            {searchQuery || selectedMoodFilter !== "all" || selectedTagFilter !== "all"
              ? "Try adjusting your filters."
              : "Create your first entry to get started!"}
          </p>
        </div>
      ) : (
        filteredEntries.map(entry => <EntryCard key={entry.id} entry={entry} />)
      )}
    </div>
  )

  const CalendarView = () => {
    const sortedDates = Array.from(entriesByDate.keys()).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    )

    return (
      <div className="space-y-6">
        {sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cream-25/70 text-lg">No journal entries found.</p>
            <p className="text-cream-25/50 text-sm mt-2">
              {searchQuery || selectedMoodFilter !== "all" || selectedTagFilter !== "all"
                ? "Try adjusting your filters."
                : "Create your first entry to get started!"}
            </p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-xl font-lora font-light text-cream-25 mb-4 sticky top-0 bg-gray-900/50 backdrop-blur-sm py-2 px-4 -mx-4 z-10">
                {date}
              </h3>
              <div className="space-y-4">
                {entriesByDate.get(date)?.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  return (
    <>
      <FloatingNav settings={appSettings} onSettingsUpdate={handleUpdateAppSettings} />
      <div className="min-h-screen relative flex flex-col font-inter">
        <main className="flex-1 flex flex-col items-center justify-start p-4 pt-32 md:pt-36 sm:pt-28 relative z-10">
          {/* Page Header */}
          <div className="w-full max-w-6xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-lora font-extralight text-cream-25 tracking-wider"
                style={{
                  letterSpacing: '0.08em',
                  fontWeight: '200',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                Journal
              </h1>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-xl p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("timeline")}
                    className={`h-9 px-3 rounded-lg ${
                      viewMode === "timeline"
                        ? "bg-white/20 text-cream-25"
                        : "text-cream-25/70 hover:text-cream-25"
                    }`}
                  >
                    <List className="w-4 h-4 mr-2" />
                    Timeline
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={`h-9 px-3 rounded-lg ${
                      viewMode === "calendar"
                        ? "bg-white/20 text-cream-25"
                        : "text-cream-25/70 hover:text-cream-25"
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendar
                  </Button>
                </div>

                {/* New Entry Button */}
                <Button
                  onClick={() => router.push("/journal/new")}
                  className="h-10 px-4 rounded-xl text-cream-25"
                  style={{
                    background: 'rgba(76, 175, 80, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Entry
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-25/50" />
                <Input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-white/10 border-white/20 text-cream-25 placeholder:text-cream-25/50"
                />
              </div>

              {/* Mood Filter */}
              <Select value={selectedMoodFilter} onValueChange={setSelectedMoodFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-white/10 border-white/20 text-cream-25">
                  <Smile className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All moods</SelectItem>
                  {Object.entries(MOODS).map(([key, { label, icon: Icon, color }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color }} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl bg-white/10 border-white/20 text-cream-25">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Journal Content */}
          <div className="w-full max-w-6xl flex-1">
            {viewMode === "timeline" ? <TimelineView /> : <CalendarView />}
          </div>
        </main>
      </div>
    </>
  )
}
