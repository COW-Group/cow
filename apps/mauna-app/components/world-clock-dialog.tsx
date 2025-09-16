"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay, // Import DialogOverlay
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface WorldClockDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (timezone: string) => void
  initialTimezone?: string
}

// A curated list of common timezones for demonstration.
// In a real app, you might use a library like 'moment-timezone' or 'luxon'
// to get a more comprehensive and searchable list.
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

// Helper to format timezone for display
const formatTimezoneForDisplay = (tz: string) => {
  try {
    const now = new Date()
    const timeString = now.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset", // e.g., "GMT-5"
    })
    // Extract the city/region part from the timezone ID and replace underscores
    const region = tz.split("/").pop()?.replace(/_/g, " ")
    return `${region} (${timeString})`
  } catch (error) {
    console.error("Error formatting timezone:", tz, error)
    return tz.replace(/_/g, " ") // Fallback for invalid timezones
  }
}

export function WorldClockDialog({ isOpen, onClose, onSave, initialTimezone }: WorldClockDialogProps) {
  const [selectedTimezone, setSelectedTimezone] = useState<string>(initialTimezone || "")
  const { toast } = useToast()

  const handleSave = useCallback(() => {
    if (selectedTimezone) {
      onSave(selectedTimezone)
      toast({ title: "Timezone Saved", description: `World clock set to ${selectedTimezone}.` })
      onClose()
    } else {
      toast({ title: "Selection Required", description: "Please select a timezone.", variant: "destructive" })
    }
  }, [selectedTimezone, onSave, onClose, toast])

  console.log("WorldClockDialog: isOpen =", isOpen, "selectedTimezone =", selectedTimezone)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40" /> {/* Standard overlay */}
      <DialogContent className="sm:max-w-[425px] text-ink-950 dark:text-cream-25 border-brushed-silver/20 dark:border-ink-800/20 shadow-2xl rounded-lg font-montserrat glassmorphism-dialog z-50">
        {" "}
        {/* Reapplied glassmorphism and z-index */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-barlow font-light text-logo-blue zen-heading">
            Select World Clock Timezone
          </DialogTitle>
          <DialogDescription className="text-ink-700 dark:text-cream-25/70 font-montserrat">
            Choose a timezone to display in the world clock.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[200px] pr-4">
          <div className="grid gap-4 py-4">
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
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className="font-montserrat zen-button-primary">
            Save Timezone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
