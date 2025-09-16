"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { format, startOfWeek, addDays, subDays, isSameDay, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" // Assuming cn utility is available

interface JournalCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  entries: { createdAt: string }[] // Used to indicate days with entries
}

export function JournalCalendar({ selectedDate, onSelectDate, entries }: JournalCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 })) // Monday as start of week
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const daysInView = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i))
    }
    return days
  }, [currentWeekStart])

  const entryDates = useMemo(() => {
    return new Set(entries.map((entry) => format(new Date(entry.createdAt), "yyyy-MM-dd")))
  }, [entries])

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7))
  }

  // Scroll to center the selected date or today's date initially
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedDayElement = scrollContainerRef.current.querySelector(".day-selected") as HTMLElement
      if (selectedDayElement) {
        selectedDayElement.scrollIntoView({ behavior: "smooth", inline: "center" })
      }
    }
  }, [currentWeekStart, selectedDate]) // Re-center when week changes or selectedDate changes

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-2 bg-cream-paper/70 dark:bg-ink-light/70 backdrop-blur-sm rounded-xl shadow-lg border border-vibrant-blue/20 dark:border-vibrant-blue/80 font-inter">
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousWeek}
        aria-label="Previous week"
        className="zen-button-secondary"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide flex justify-between items-center gap-2"
      >
        {daysInView.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd")
          const hasEntry = entryDates.has(dayKey)
          return (
            <Button
              key={day.toISOString()}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 flex-shrink-0 w-14 h-16 zen-focus",
                isSameDay(day, selectedDate)
                  ? "bg-vibrant-blue text-primary-foreground shadow-md day-selected hover:bg-vibrant-blue/90"
                  : "text-foreground hover:bg-accent/50",
                isToday(day) && !isSameDay(day, selectedDate) && "border-2 border-vibrant-blue/50 text-vibrant-blue",
                hasEntry &&
                  !isSameDay(day, selectedDate) &&
                  "bg-vibrant-blue/10 text-vibrant-blue hover:bg-vibrant-blue/20",
              )}
              onClick={() => onSelectDate(day)}
            >
              <span className="text-xs font-medium uppercase zen-ui">{format(day, "EEE")}</span>
              <span className="text-2xl font-bold zen-heading">{format(day, "d")}</span>
            </Button>
          )
        })}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextWeek}
        aria-label="Next week"
        className="zen-button-secondary"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
