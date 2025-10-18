"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import { AuthService } from "@/lib/auth-service"
import { TimelineWrapper } from "@/components/TimelineWrapper"
import { VisionDataProvider } from "@/lib/vision-data-provider"
import { databaseService } from "@/lib/database-service"
import { Loader2Icon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AppSettings } from "@/lib/types"

export default function TimelinePage() {
  console.log("[TimelinePage] Rendering")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const { isEncryptionReady } = useEncryption()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)

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
    showHeaderTimeline: true,
  })

  const handleUpdateAppSettings = (updatedSettings: AppSettings) => {
    console.log("TimelinePage: Updating app settings", updatedSettings)
    setAppSettings(updatedSettings)
  }

  useEffect(() => {
    console.log("[TimelinePage] useEffect running, authLoading:", authLoading, "userId:", user?.id)
    if (!authLoading && user?.id) {
      if (!hasMountedRef.current) {
        setIsLoading(false)
        hasMountedRef.current = true
      }
    } else if (!authLoading && !user?.id) {
      setIsLoading(false)
      setError("Please sign in to view your timeline.")
      router.push("/auth/signin")
    }
  }, [authLoading, user?.id, router])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!authLoading && user && !isEncryptionReady) {
      console.log("[TimelinePage] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [user, authLoading, isEncryptionReady, router])

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <Loader2Icon className="h-10 w-10 animate-spin text-cream-25" />
            <div className="text-xl font-light text-cream-25 text-center">Loading timeline...</div>
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

  if (!user?.id) {
    return null // Let the loading/redirect logic handle this
  }

  return (
    <VisionDataProvider userId={user.id} databaseService={databaseService}>
      {/* FloatingNav removed from timeline page - using bottom nav instead */}
      <div className="min-h-screen relative flex flex-col font-inter">
        <main className="flex-1 flex flex-col items-center justify-start p-0 md:p-4 pt-0 md:pt-36 pb-0 md:pb-8 relative z-10">
          {/* Page Header - Desktop only */}
          <div className="hidden md:block w-full max-w-7xl mb-6">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-lora font-extralight text-cream-25 tracking-wider"
                style={{
                  letterSpacing: '0.08em',
                  fontWeight: '200',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                Timeline
              </h1>
            </div>
          </div>

          {/* Timeline Content - Full screen on mobile, card on desktop */}
          <div className="w-full h-full md:max-w-7xl flex-1">
            {/* Desktop: Liquid glass card */}
            <div className="hidden md:block w-full h-full">
              <Card
                className="w-full h-full overflow-y-auto border-0 shadow-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
                }}
              >
                <CardContent className="p-4 sm:p-6">
                  <TimelineWrapper />
                </CardContent>
              </Card>
            </div>

            {/* Mobile: Transparent full screen */}
            <div className="md:hidden w-full h-full">
              <TimelineWrapper />
            </div>
          </div>
        </main>
      </div>
    </VisionDataProvider>
  )
}
