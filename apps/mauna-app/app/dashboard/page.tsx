"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { TaskList, AppSettings } from "@/lib/types"
import { FloatingNav } from "@/components/floating-nav"
import { TaskListManager } from "@/components/task-list-manager"
import { getTimeOfDayGreeting } from "@/lib/utils"
import { Play, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth(AuthService)
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState("")
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [isTaskListManagerOpen, setIsTaskListManagerOpen] = useState(false)
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

  useEffect(() => {
    if (user?.id) {
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

  const displayedUserName = user?.user_metadata?.preferred_name || user?.email?.split("@")[0] || "User"
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
    <div className="min-h-screen relative flex flex-col items-center justify-center font-inter">
      <FloatingNav settings={appSettings} onSettingsUpdate={handleUpdateAppSettings} />
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Central Content Container */}
        <div className="flex flex-col items-center space-y-12">
          {/* Time Display Section */}
          <div className="flex flex-col items-center space-y-8">
            {/* Primary Time Display */}
            <div className="relative">
              <div
                className="text-[4rem] xs:text-[5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] font-inter font-extralight text-cream-25 leading-none"
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
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center">
              {/* Date */}
              <div className="flex flex-col items-center">
                <div className="text-xs sm:text-sm font-inter font-light text-cream-25/60 uppercase tracking-[0.2em] mb-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </div>
                <div className="text-base sm:text-lg font-inter font-normal text-cream-25/80 tracking-wide">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Vertical/Horizontal Divider */}
              <div className="hidden sm:block h-12 w-px bg-cream-25/20"></div>
              <div className="sm:hidden w-16 h-px bg-cream-25/20"></div>

              {/* Greeting */}
              <div className="flex flex-col items-center">
                <div className="text-xs sm:text-sm font-inter font-light text-cream-25/60 uppercase tracking-[0.2em] mb-1">
                  {greeting}
                </div>
                <div className="text-base sm:text-lg font-inter font-normal text-cream-25/80 tracking-wide">
                  {capitalizedUserName}
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-3xl mt-6 sm:mt-8 px-4 sm:px-0">
          {/* Focus Button */}
          <Button
            variant="ghost"
            className="group relative text-cream-25 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 border-0 touch-manipulation"
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
            <div className="flex items-center space-x-3">
              <Play className={`h-5 w-5 text-cream-25 transition-opacity duration-200 ${
                !hasTasks ? 'opacity-40' : ''
              }`} />
              <div className="flex flex-col items-start">
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
            className="group relative text-cream-25 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 border-0 touch-manipulation"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 6px 18px rgba(0, 0, 0, 0.03)',
            }}
            onClick={() => {
              toast({
                title: "Calendar Integration",
                description: "Connect your calendar to view and manage events seamlessly from your dashboard.",
              })
            }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-cream-25" />
              <div className="flex flex-col items-start">
                <span className="font-inter font-light tracking-wide">
                  Calendar
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