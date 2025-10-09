"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, X, Calendar as CalendarIcon, Tag as TagIcon } from "lucide-react"
import { format } from "date-fns"

export interface JournalFilters {
  searchText: string
  moods: string[]
  tags: string[]
  dateFrom: Date | undefined
  dateTo: Date | undefined
  category: string
  templateType: string
}

interface JournalFiltersProps {
  filters: JournalFilters
  onChange: (filters: JournalFilters) => void
  availableTags: string[]
}

const MOODS = [
  { value: "amazing", label: "☀️ Amazing" },
  { value: "happy", label: "😊 Happy" },
  { value: "content", label: "❤️ Content" },
  { value: "neutral", label: "😐 Neutral" },
  { value: "anxious", label: "⚡ Anxious" },
  { value: "sad", label: "☁️ Sad" },
  { value: "upset", label: "😞 Upset" },
  { value: "tired", label: "🌙 Tired" },
]

const TEMPLATE_TYPES = [
  "Morning Pages",
  "Evening Reflection",
  "Gratitude Log",
  "Habit Progress",
  "Weekly Review",
  "Emotional Processing",
  "Vision Alignment",
  "Quick Capture",
  "Free Write"
]

export function JournalFilters({ filters, onChange, availableTags }: JournalFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = <K extends keyof JournalFilters>(key: K, value: JournalFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const toggleMood = (mood: string) => {
    const newMoods = filters.moods.includes(mood)
      ? filters.moods.filter(m => m !== mood)
      : [...filters.moods, mood]
    updateFilter("moods", newMoods)
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    updateFilter("tags", newTags)
  }

  const clearFilters = () => {
    onChange({
      searchText: "",
      moods: [],
      tags: [],
      dateFrom: undefined,
      dateTo: undefined,
      category: "all",
      templateType: "all"
    })
  }

  const activeFilterCount = [
    filters.searchText ? 1 : 0,
    filters.moods.length,
    filters.tags.length,
    filters.dateFrom ? 1 : 0,
    filters.dateTo ? 1 : 0,
    filters.category !== "all" ? 1 : 0,
    filters.templateType !== "all" ? 1 : 0
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-25/50" />
          <Input
            placeholder="Search journal entries..."
            value={filters.searchText}
            onChange={(e) => updateFilter("searchText", e.target.value)}
            className="pl-10 bg-cream-25/10 border-cream-25/20 text-cream-25"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2 bg-cream-25/10 border-cream-25/20 text-cream-25"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-vibrant-blue text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="text-cream-25/70 hover:text-cream-25"
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.moods.map(mood => {
            const moodLabel = MOODS.find(m => m.value === mood)?.label || mood
            return (
              <Badge
                key={mood}
                variant="secondary"
                className="cursor-pointer bg-cream-25/20 hover:bg-cream-25/30"
                onClick={() => toggleMood(mood)}
              >
                {moodLabel}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )
          })}
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer bg-vibrant-blue/20 hover:bg-vibrant-blue/30"
              onClick={() => toggleTag(tag)}
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.dateFrom && (
            <Badge variant="secondary" className="bg-cream-25/20">
              From: {format(filters.dateFrom, "MMM d, yyyy")}
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="bg-cream-25/20">
              To: {format(filters.dateTo, "MMM d, yyyy")}
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 rounded-lg bg-cream-25/5 border border-cream-25/10 space-y-4">
          {/* Mood Filter */}
          <div>
            <label className="text-sm font-medium text-cream-25 mb-2 block">Filter by Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(mood => (
                <Badge
                  key={mood.value}
                  variant={filters.moods.includes(mood.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMood(mood.value)}
                  style={{
                    backgroundColor: filters.moods.includes(mood.value) ? "rgba(33, 150, 243, 0.8)" : "transparent"
                  }}
                >
                  {mood.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-cream-25 mb-2 block">Filter by Tags</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                    style={{
                      backgroundColor: filters.tags.includes(tag) ? "rgba(33, 150, 243, 0.8)" : "transparent"
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-cream-25 mb-2 block">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-cream-25/10 border-cream-25/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => updateFilter("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium text-cream-25 mb-2 block">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-cream-25/10 border-cream-25/20"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => updateFilter("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Category & Template Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-cream-25 mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger className="bg-cream-25/10 border-cream-25/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-cream-25 mb-2 block">Template Type</label>
              <Select value={filters.templateType} onValueChange={(value) => updateFilter("templateType", value)}>
                <SelectTrigger className="bg-cream-25/10 border-cream-25/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  {TEMPLATE_TYPES.map(template => (
                    <SelectItem key={template} value={template}>{template}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
