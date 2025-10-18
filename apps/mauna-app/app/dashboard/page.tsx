"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { TaskList, AppSettings } from "@/lib/types"
import { FloatingNav } from "@/components/floating-nav"
import { TaskListManager } from "@/components/task-list-manager"
import { getTimeOfDayGreeting } from "@/lib/utils"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth(AuthService)
  const { isEncryptionReady } = useEncryption()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState("")
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [isTaskListManagerOpen, setIsTaskListManagerOpen] = useState(false)
  const [userProfileName, setUserProfileName] = useState<string | null>(null)
  const noTaskListSelectedId = "no-list-selected"

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

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!loading && user && !isEncryptionReady) {
      console.log("[Dashboard] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [user, loading, isEncryptionReady, router])

  useEffect(() => {
    if (user?.id) {
      // Fetch task lists
      databaseService
        .fetchTaskLists(user.id)
        .then((lists) => {
          setTaskLists(lists)
        })
        .catch((error: any) => {
          console.error("Failed to fetch task lists:", error)
          toast({
            title: "Error",
            description: `Failed to load task lists: ${error.message}`,
            variant: "destructive",
          })
        })

      // Fetch user profile
      AuthService.getUserProfile(user.id)
        .then(({ profile, error }) => {
          if (error || !profile) {
            console.error("Failed to fetch user profile:", error)
          } else {
            setUserProfileName(profile.name)
          }
        })
        .catch((error: any) => {
          console.error("Failed to fetch user profile:", error)
        })
    }
  }, [user, toast])

  const handleUpdateTaskLists = (updatedLists: TaskList[]) => {
    console.log("DashboardPage: Updating task lists in parent state", updatedLists)
    setTaskLists(updatedLists)
  }

  const handleSwitchTaskList = (listId: string) => {
    console.log("Switching to task list:", listId)
  }

  const handleUpdateAppSettings = (updatedSettings: AppSettings) => {
    console.log("Dashboard: Updating app settings", updatedSettings)
    setAppSettings(updatedSettings)
  }

  const displayedUserName = userProfileName || user?.email?.split("@")[0] || "User"
  const capitalizedUserName = displayedUserName.charAt(0).toUpperCase() + displayedUserName.slice(1)
  const greeting = getTimeOfDayGreeting()

  const hasTasks = taskLists.some((list) => list.steps.length > 0)

  if (loading) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
        <div className="glassmorphism p-8 rounded-2xl shadow-lg">
          <div className="text-2xl font-light text-cream-25 text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center font-inter" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)'
    }}>
      <FloatingNav settings={appSettings} onSettingsUpdate={handleUpdateAppSettings} />
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10 relative z-10 w-full">
        {/* Central Content Container */}
        <div className="flex flex-col items-center space-y-10 md:space-y-12 lg:space-y-12 w-full">
          {/* Time Display Section */}
          <div className="flex flex-col items-center space-y-6 md:space-y-7 lg:space-y-8 w-full">
            {/* Primary Time Display */}
            <div className="relative w-full flex justify-center">
              <div
                className="text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-inter font-extralight text-cream-25 leading-none"
                style={{
                  fontFeatureSettings: '"tnum" 1, "lnum" 1',
                  fontWeight: '200',
                  letterSpacing: '-0.04em',
                  textShadow: '0 0 40px rgba(249, 250, 251, 0.1)'
                }}
              >
                {currentTime}
              </div>
            </div>

            {/* Date and Greeting Responsive Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-8 md:space-x-10 text-center w-full px-4 md:px-0">
              {/* Date */}
              <div className="flex flex-col items-center min-w-0">
                <div className="text-sm md:text-sm lg:text-sm font-inter font-light text-cream-25/60 uppercase tracking-[0.15em] mb-1.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-lg md:text-lg lg:text-xl font-inter font-normal text-cream-25/80 tracking-wide">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Vertical/Horizontal Divider */}
              <div className="hidden sm:block h-12 w-px bg-cream-25/20 flex-shrink-0"></div>
              <div className="sm:hidden w-20 h-px bg-cream-25/20"></div>

              {/* Greeting */}
              <div className="flex flex-col items-center min-w-0">
                <div className="text-sm md:text-sm lg:text-sm font-inter font-light text-cream-25/60 uppercase tracking-[0.15em] mb-1.5">
                  {greeting}
                </div>
                <div className="text-lg md:text-lg lg:text-xl font-inter font-normal text-cream-25/80 tracking-wide">
                  {capitalizedUserName}
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 lg:gap-8 w-full max-w-3xl px-4 sm:px-6 md:px-0">
          {/* Focus Button */}
          <Button
            variant="ghost"
            className="group relative text-cream-25 text-lg md:text-lg lg:text-xl px-7 py-5 md:px-8 md:py-6 lg:px-10 lg:py-7 rounded-2xl transition-all duration-300 border-0 touch-manipulation min-h-[72px] md:min-h-[64px] lg:min-h-[80px]"
            style={{
              background: hasTasks
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.03)',
            }}
            onClick={() => hasTasks && router.push("/focus")}
            disabled={!hasTasks}
          >
            <div className="flex items-center space-x-3.5">
              <Play className={`h-6 w-6 md:h-5 md:w-5 lg:h-5 lg:w-5 text-cream-25 transition-opacity duration-200 flex-shrink-0 ${
                !hasTasks ? 'opacity-40' : ''
              }`} />
              <div className="flex flex-col items-start min-w-0">
                <span className={`font-inter font-light tracking-wide ${
                  !hasTasks ? 'opacity-60' : ''
                } transition-opacity duration-200`}>
                  {hasTasks ? 'Start Focusing' : 'No Tasks Available'}
                </span>
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="group relative text-cream-25 text-lg md:text-lg lg:text-xl px-7 py-5 md:px-8 md:py-6 lg:px-10 lg:py-7 rounded-2xl transition-all duration-300 border-0 touch-manipulation min-h-[72px] md:min-h-[64px] lg:min-h-[80px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 6px 18px rgba(0, 0, 0, 0.03)',
            }}
            onClick={() => router.push("/timeline")}
          >
            <div className="flex items-center space-x-3.5">
              <Clock className="h-6 w-6 md:h-5 md:w-5 lg:h-5 lg:w-5 text-cream-25 flex-shrink-0" />
              <div className="flex flex-col items-start min-w-0">
                <span className="font-inter font-light tracking-wide">
                  Timeline
                </span>
              </div>
            </div>
          </Button>
        </div>
        </div>
      </main>
      {isTaskListManagerOpen && (
        <TaskListManager
          isOpen={isTaskListManagerOpen}
          onClose={() => setIsTaskListManagerOpen(false)}
          taskLists={taskLists}
          currentListId={taskLists.length > 0 ? taskLists[0].id : noTaskListSelectedId}
          updateTaskLists={handleUpdateTaskLists}
          switchTaskList={handleSwitchTaskList}
          userId={user.id}
          noTaskListSelectedId={noTaskListSelectedId}
        />
      )}
    </div>
  )
}