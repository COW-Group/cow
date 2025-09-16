import type React from "react" // Import React for React.ElementType

export interface SoundParameter {
  id: string
  label: string
  lucideIcon: string // Name of Lucide icon component (e.g., "CloudRain")
  value: number
  min: number
  max: number
}

export interface Sound {
  id: string
  name: string
  description: string
  url: string
  icon: string // Emoji for display
  lucideIcon?: React.ElementType // Use React.ElementType directly
  parameters?: SoundParameter[]
}

export interface ActiveSound extends Sound {
  audioElement: HTMLAudioElement
  currentVolume: number
}
