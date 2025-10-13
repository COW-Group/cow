"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { TaskListManager } from "@/components/task-list-manager"
import { VisionBoard } from "@/components/vision-board"
import { DashboardMenu } from "@/components/dashboard-menu"
import { useAuthContext } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { AppSettings } from "@/lib/types"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import DynamicParallaxBackground from "@/components/dynamic-parallax-background"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false)
  const [isTaskListManagerOpen, setIsTaskListManagerOpen] = useState(false)
  const [isVisionBoardOpen, setIsVisionBoardOpen] = useState(false)
  const [appSettings, setAppSettings] = useState<AppSettings>({
    focusMode: false,
    showWeather: false,
    showGreeting: true,
    showMantra: false,
    showTasks: true,
    showQuotes: true,
    darkMode: false, // Default to false
    soundEnabled: true, // Default to true
    defaultDuration: 30, // Default duration
    autoLoop: false, // Default autoLoop
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
    // Initialize new header menu visibility settings to true by default
    showHeaderMain: true,
    showHeaderFocus: true,
    showHeaderEmotional: true,
    showHeaderHealth: true,
    showHeaderVision: true,
    showHeaderWealth: true,
    showHeaderSocial: true,
    showHeaderProjects: true,
    showHeaderSales: true,
    showHeaderMarketplace: true,
    showHeaderHabits: true,
    showHeaderTimeline: true,
  })
  const { user, signOut, loading } = useAuthContext()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const router = useRouter()
  const isDashboardPage = pathname === "/dashboard"
  const isFocusPage = pathname === "/focus"
  const isHabitsPage = pathname === "/habits"
  const isTimelinePage = pathname === "/timeline"
  const isVisionPage = pathname === "/vision"
  const isEmotionalPage = pathname === "/emotional"

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Cmd (Mac) or Ctrl (Windows/Linux) is pressed
      if (!(event.metaKey || event.ctrlKey)) return

      // Don't trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      // Navigation shortcuts
      switch (event.key.toLowerCase()) {
        case "h":
          event.preventDefault()
          router.push("/habits")
          break
        case "f":
          event.preventDefault()
          router.push("/focus")
          break
        case "t":
          event.preventDefault()
          router.push("/timeline")
          break
        case "v":
          event.preventDefault()
          router.push("/vision")
          break
        case "d":
          event.preventDefault()
          router.push("/dashboard")
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  if (loading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <DynamicParallaxBackground />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-2xl">Loading...</div>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    )
  }

  const toggleAppMenu = () => setIsAppMenuOpen(!isAppMenuOpen)
  const openTaskListManager = () => setIsTaskListManagerOpen(true)
  const closeTaskListManager = () => setIsTaskListManagerOpen(false)
  const openVisionBoard = () => setIsVisionBoardOpen(true)
  const closeVisionBoard = () => setIsVisionBoardOpen(false)

  const handleSignOut = async () => {
    await signOut()
    toast({ title: "Signed Out", description: "You have been successfully signed out." })
    setIsAppMenuOpen(false)
  }

  const updateSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <DynamicParallaxBackground />
        <div
          className={cn(
            "flex min-h-screen flex-col bg-transparent font-sans antialiased overflow-y-auto",
          )}
        >
          {!isDashboardPage && !isFocusPage && !isHabitsPage && !isTimelinePage && !isVisionPage && !isEmotionalPage && (
            <>
              <Header isMenuOpen={isAppMenuOpen} onToggleMenu={toggleAppMenu} settings={appSettings} />
              <DashboardMenu
                isOpen={isAppMenuOpen}
                onClose={toggleAppMenu}
                settings={appSettings}
                updateSettings={updateSettings}
                openTaskListManager={openTaskListManager}
                openVisionBoard={openVisionBoard}
                handleSignOut={handleSignOut}
                currentUser={user}
                userProfileName={user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                userId={user?.id || "temp-user-id"}
              />
            </>
          )}
          {isTaskListManagerOpen && (
            <TaskListManager
              isOpen={isTaskListManagerOpen}
              onClose={closeTaskListManager}
              userId={user?.id || "temp-user-id"}
            />
          )}
          {isVisionBoardOpen && <VisionBoard isOpen={isVisionBoardOpen} onClose={closeVisionBoard} />}
          {children}
        </div>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
