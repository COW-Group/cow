"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react" // Import X icon for close button

interface WorldClockSectionProps {
  initialTimezone?: string
  onSave: (timezone: string) => void
  onClose: () => void
}

const commonTimezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Africa/Cairo",
  "UTC",
]

const formatTimezoneForDisplay = (tz: string) => {
  try {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    })
    const region = tz.split("/").pop()?.replace(/_/g, " ")
    return `${region} (${timeString})`
  } catch (error) {
    console.error("Error formatting timezone:", tz, error)
    return tz.replace(/_/g, " ")
  }
}

export function WorldClockSection({ initialTimezone, onSave, onClose }: WorldClockSectionProps) {
  const [selectedTimezone, setSelectedTimezone] = useState<string>(initialTimezone || "")
  const { toast } = useToast()

  useEffect(() => {
    setSelectedTimezone(initialTimezone || "")
  }, [initialTimezone])

  const handleSave = useCallback(() => {
    if (selectedTimezone) {
      onSave(selectedTimezone)
      toast({ title: "Timezone Saved", description: `World clock set to ${selectedTimezone}.` })
      onClose() // Close the section after saving
    } else {
      toast({ title: "Selection Required", description: "Please select a timezone.", variant: "destructive" })
    }
  }, [selectedTimezone, onSave, onClose, toast])

  return (
    <div className="relative glassmorphism rounded-lg px-6 py-4 border border-cream-25/30 backdrop-blur-sm text-ink-950 dark:text-cream-25 font-montserrat">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-2 right-2 text-cream-25 hover:bg-cream-25/10"
        aria-label="Close timezone selection"
      >
        <X className="h-4 w-4" />
      </Button>
      <h3 className="text-xl font-barlow font-light text-logo-blue zen-heading mb-4">Select World Clock Timezone</h3>
      <p className="text-ink-700 dark:text-cream-25/70 font-montserrat mb-4">
        Choose a timezone to display for your current task.
      </p>
      <ScrollArea className="h-[150px] pr-4 mb-4">
        <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
          <SelectTrigger className="w-full bg-transparent border-cream-25/20 text-ink-950 dark:text-cream-25 placeholder:text-ink-700 dark:placeholder:text-cream-25/70 font-montserrat">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent className="glassmorphism-select-content text-ink-950 dark:text-cream-25 font-montserrat">
            {commonTimezones.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {formatTimezoneForDisplay(tz)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ScrollArea>
      <Button type="submit" onClick={handleSave} className="font-montserrat zen-button-primary w-full">
        Save Timezone
      </Button>
    </div>
  )
}
