"use client"

import { useEffect, useState } from "react"

interface WorldClockDisplayProps {
  timezone: string | undefined
  onClick: () => void
}

export function WorldClockDisplay({ timezone, onClick }: WorldClockDisplayProps) {
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentLocation, setCurrentLocation] = useState<string>("Select Timezone")

  useEffect(() => {
    const updateTime = () => {
      if (timezone) {
        try {
          const date = new Date()
          const timeString = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: timezone,
          })
          setCurrentTime(timeString)
          // Extract a more readable location name from the timezone string
          const locationName = timezone.split("/").pop()?.replace(/_/g, " ") || "Unknown"
          setCurrentLocation(locationName)
        } catch (error) {
          console.error("Invalid timezone:", timezone, error)
          setCurrentTime("Invalid Timezone")
          setCurrentLocation("Error")
        }
      } else {
        setCurrentTime("--:--")
        setCurrentLocation("Select Timezone")
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000) // Update every second

    return () => clearInterval(interval)
  }, [timezone])

  return (
    <div
      className="glassmorphism rounded-lg px-6 py-3 border border-cream-25/30 backdrop-blur-sm mb-4 cursor-pointer hover:bg-cream-25/10 transition-colors duration-200"
      onClick={onClick}
      aria-label={`Current time in ${currentLocation}: ${currentTime}. Click to change timezone.`}
    >
      <p className="text-cream-25 text-2xl font-bold font-montserrat">{currentTime}</p>
      <p className="text-cream-25/70 text-sm">{currentLocation}</p>
    </div>
  )
}
