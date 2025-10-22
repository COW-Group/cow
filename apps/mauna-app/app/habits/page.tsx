"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import { AuthService } from "@/lib/auth-service"
import { HabitsBoardWrapper } from "@/components/HabitsBoardWrapper"
import { FloatingNav } from "@/components/floating-nav"
import { Button } from "@/components/ui/button"
import { Loader2Icon, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AppSettings } from "@/lib/types"

export default function HabitsPage() {
  console.log("[HabitsPage] Rendering")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const { isEncryptionReady } = useEncryption()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)
  const [showHabitsBoard, setShowHabitsBoard] = useState(true)

  // App settings state
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
  })

  const handleUpdateAppSettings = (updatedSettings: AppSettings) => {
    console.log("HabitsPage: Updating app settings", updatedSettings)
    setAppSettings(updatedSettings)
  }

  useEffect(() => {
    console.log("[HabitsPage] useEffect running, authLoading:", authLoading, "userId:", user?.id)
    if (!authLoading && user?.id) {
      if (!hasMountedRef.current) {
        setIsLoading(false)
        hasMountedRef.current = true
      }
    } else if (!authLoading && !user?.id) {
      setIsLoading(false)
      setError("Please sign in to view your habits.")
      router.push("/auth/signin")
    }
  }, [authLoading, user?.id, router])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!authLoading && user && !isEncryptionReady) {
      console.log("[HabitsPage] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [user, authLoading, isEncryptionReady, router])

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <Loader2Icon className="h-10 w-10 animate-spin text-cream-25" />
            <div className="text-xl font-light text-cream-25 text-center">Loading habits...</div>
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

  return (
    <>
      <FloatingNav settings={appSettings} onSettingsUpdate={handleUpdateAppSettings} />
      <div className="min-h-screen relative flex flex-col font-inter">
        <main className="flex-1 flex flex-col items-center justify-start p-4 pt-32 md:pt-36 sm:pt-28 relative z-10">
          {/* Page Header with Controls */}
          <div className="w-full max-w-7xl mb-6">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-lora font-extralight text-cream-25 tracking-wider transition-all duration-300 hover:scale-[1.02]"
                style={{
                  letterSpacing: '0.08em',
                  fontWeight: '200',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                Habits
              </h1>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHabitsBoard(!showHabitsBoard)}
                  className="h-10 w-10 rounded-xl text-cream-25 hover:bg-white/20 transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{
                    background: showHabitsBoard ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                  title="Toggle Habits Board"
                >
                  <Calendar className="h-5 w-5 transition-transform duration-200" />
                </Button>
              </div>
            </div>
          </div>

          {/* Habits Board Content */}
          {showHabitsBoard && (
            <div className="w-full max-w-7xl flex-1 animate-in fade-in duration-300">
              <Card
                className="w-full h-full overflow-x-auto border-0 shadow-xl transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
                }}
              >
                <CardContent className="p-4 sm:p-6 transition-all duration-300">
                  <HabitsBoardWrapper />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
