"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type CopilotName = "Moo" | "Moolah"

interface CopilotSettings {
  name: CopilotName
  voiceRate: number
  voicePitch: number
}

interface CopilotContextType {
  settings: CopilotSettings
  updateSettings: (settings: Partial<CopilotSettings>) => void
}

const defaultSettings: CopilotSettings = {
  name: "Moo",
  voiceRate: 0.9,
  voicePitch: 0.8,
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined)

export const CopilotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CopilotSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("copilotSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse copilot settings:", error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<CopilotSettings>) => {
    const updated = { ...settings, ...newSettings }

    // Adjust voice settings based on copilot name
    if (newSettings.name) {
      if (newSettings.name === "Moo") {
        updated.voiceRate = 0.9
        updated.voicePitch = 0.8
      } else if (newSettings.name === "Moolah") {
        updated.voiceRate = 1.1
        updated.voicePitch = 1.2
      }
    }

    setSettings(updated)
    localStorage.setItem("copilotSettings", JSON.stringify(updated))
  }

  return <CopilotContext.Provider value={{ settings, updateSettings }}>{children}</CopilotContext.Provider>
}

export const useCopilot = () => {
  const context = useContext(CopilotContext)
  if (context === undefined) {
    throw new Error("useCopilot must be used within a CopilotProvider")
  }
  return context
}
