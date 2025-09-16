import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Active, Over } from "@dnd-kit/core"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
}

export function formatTimeDigital(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatTimeWords(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
  } else if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  } else {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
  }
}

export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours()

  if (hour >= 17 || hour < 4) {
    return "Good evening"
  }
  if (hour >= 4 && hour < 12) {
    return "Good morning"
  }
  if (hour >= 12 && hour < 17) {
    return "Good afternoon"
  }
  return "Hello" // Fallback, though all hours should be covered
}

export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array]
  const [item] = newArray.splice(from, 1)
  newArray.splice(to, 0, item)
  return newArray
}

export function findItemInArray<T extends { id: string }>(items: T[], id: Active | Over): T | undefined {
  if (typeof id === "string") {
    return items.find((item) => item.id === id)
  }
  return items.find((item) => item.id === id.id)
}
