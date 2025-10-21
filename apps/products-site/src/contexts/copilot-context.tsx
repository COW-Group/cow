import { createContext, useContext, useState, ReactNode } from "react"

interface CopilotSettings {
  name: string
  enabled: boolean
  voice: string
}

interface CopilotContextType {
  settings: CopilotSettings
  updateSettings: (settings: Partial<CopilotSettings>) => void
}

const defaultSettings: CopilotSettings = {
  name: "Moo",
  enabled: true,
  voice: "default",
}

const CopilotContext = createContext<CopilotContextType | undefined>(undefined)

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CopilotSettings>(defaultSettings)

  const updateSettings = (newSettings: Partial<CopilotSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <CopilotContext.Provider value={{ settings, updateSettings }}>
      {children}
    </CopilotContext.Provider>
  )
}

export function useCopilot() {
  const context = useContext(CopilotContext)
  if (context === undefined) {
    throw new Error("useCopilot must be used within a CopilotProvider")
  }
  return context
}
