"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import { AuthService } from "@/lib/auth-service"
import { databaseService, type UserSettings } from "@/lib/database-service"
import { VisionDataProvider, useVisionData } from "@/lib/vision-data-provider"
import { VisionBoardWrapper } from "@/components/vision-board-wrapper"
import { MountainViewWrapper } from "@/components/mountain-view-wrapper"
import { TaskadeViewWrapper } from "@/components/taskade-views/TaskadeViewWrapper"
import { Button } from "@/components/ui/button"
import { Loader2Icon, LayoutDashboard, Calendar, Mountain, ListTree } from "lucide-react"
import { DailyPlanner } from "@/components/DailyPlanner"
import { FloatingNav } from "@/components/floating-nav"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"
import { toast } from "sonner"
import { getCurrentWeekBoundaries, isCurrentWeek } from "@/lib/week-utils"

const WeeklyPlanner: React.FC = () => {
  return <div className="p-4 bg-white/10 rounded-lg text-cream-25">Weekly Planner Placeholder</div>
}

const MonthlyPlanner: React.FC = () => {
  return <div className="p-4 bg-white/10 rounded-lg text-cream-25">Monthly Planner Placeholder</div>
}

const YearlyPlanner: React.FC = () => {
  return <div className="p-4 bg-white/10 rounded-lg text-cream-25">Yearly Planner Placeholder</div>
}

export const ResetContext = createContext<{
  currentPeriods: { [rangeId: string]: Partial<ResetPeriod> }
  setCurrentPeriods: React.Dispatch<React.SetStateAction<{ [rangeId: string]: Partial<ResetPeriod> }>>
  archives: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  saveCurrentPeriod: (rangeId: string) => Promise<void>
  startNewPeriod: (rangeId: string) => Promise<void>
  clearCurrentPeriod: (rangeId: string) => Promise<void>
  markComplete: (rangeId: string, item: {
    id: string;
    name: string;
    type: string;
    parentMountainId?: string | null;
    parentHillId?: string | null;
    parentTerrainId?: string | null;
    parentLengthId?: string | null;
  }) => Promise<void>
} | null>(null)

export default function VisionPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const { isEncryptionReady } = useEncryption()
  console.log("[VisionPage] Rendering - authLoading:", authLoading, "user?.id:", user?.id)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)
  const [showVisionBoard, setShowVisionBoard] = useState(true)
  const [showDailyPlanner, setShowDailyPlanner] = useState(false)
  const [showMountainView, setShowMountainView] = useState(false)
  const [showTaskadeViews, setShowTaskadeViews] = useState(false)
  const [currentPeriods, setCurrentPeriods] = useState<{ [rangeId: string]: Partial<ResetPeriod> }>({})
  const [archives, setArchives] = useState<{
    [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }
  }>({})
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    console.log("[VisionPage] useEffect running, authLoading:", authLoading, "userId:", user?.id, "hasMounted:", hasMountedRef.current)
    const fetchInitialData = async () => {
      if (!authLoading && user?.id) {
        console.log("[VisionPage] Auth completed. Starting data fetch...")
        // Always run the logic, but prevent duplicate runs
        if (!hasMountedRef.current) {
          hasMountedRef.current = true
          console.log("[VisionPage] First mount - running period check logic")
          try {
            // Load user settings first
            const settings = await databaseService.fetchUserSettings(user.id)
            console.log("[VisionPage] User settings loaded:", settings)
            setUserSettings(settings)

            // Calculate current week boundaries
            const currentWeek = getCurrentWeekBoundaries(settings.week_start, settings.time_zone)

            // Fetch ranges to initialize periods and archives
            const ranges = await databaseService.fetchRanges(user.id)
            const initialPeriods: { [rangeId: string]: Partial<ResetPeriod> } = {}
            const initialArchives: {
              [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }
            } = {}

            for (const range of ranges) {
              const periods = await databaseService.fetchResetPeriods(user.id, range.id)
              let currentPeriod = periods[0]

              console.log(`[VisionPage] Range ${range.name}:`, {
                currentWeekBoundaries: currentWeek,
                existingPeriod: currentPeriod ? {
                  id: currentPeriod.id,
                  start: currentPeriod.start_date,
                  end: currentPeriod.end_date,
                  discover: currentPeriod.discover ? currentPeriod.discover.substring(0, 50) + '...' : 'empty',
                  define: currentPeriod.define ? currentPeriod.define.substring(0, 50) + '...' : 'empty',
                  ideate: currentPeriod.ideate ? currentPeriod.ideate.substring(0, 50) + '...' : 'empty',
                  hasData: !!(currentPeriod.discover || currentPeriod.define || currentPeriod.ideate || currentPeriod.prototype || currentPeriod.test)
                } : null
              })

              // Check if current period exists and matches current week
              if (currentPeriod) {
                const isCurrentWeekPeriod = isCurrentWeek(
                  currentPeriod.start_date,
                  currentPeriod.end_date,
                  settings.week_start,
                  settings.time_zone
                )
                const hasOldData = !!(currentPeriod.discover || currentPeriod.define || currentPeriod.ideate || currentPeriod.prototype || currentPeriod.test)

                console.log(`[VisionPage] Is current week? ${isCurrentWeekPeriod}, Has data? ${hasOldData}`)

                // If period doesn't match current week OR has old data that needs archiving, create new one
                if (!isCurrentWeekPeriod || (isCurrentWeekPeriod && hasOldData)) {
                  if (!isCurrentWeekPeriod) {
                    console.log(`[VisionPage] Period is outdated. Archiving and creating new one for range ${range.name}`)
                  } else {
                    console.log(`[VisionPage] Period has old data from previous week. Archiving and creating fresh period for range ${range.name}`)
                  }

                  // Archive the old period by moving it to the past (it's already in the database)
                  // Just create a new period with current week dates
                  currentPeriod = await databaseService.createResetPeriod(user.id, range.id, {
                    startDate: currentWeek.startDate,
                    endDate: currentWeek.endDate,
                    discover: "",
                    define: "",
                    ideate: "",
                    prototype: "",
                    test: "",
                  })

                  console.log(`[VisionPage] Created new period for current week:`, {
                    id: currentPeriod.id,
                    start: currentPeriod.start_date,
                    end: currentPeriod.end_date
                  })
                }
              } else {
                // No period exists, create one for current week
                console.log(`[VisionPage] No period exists. Creating new period for range ${range.name}`)
                currentPeriod = await databaseService.createResetPeriod(user.id, range.id, {
                  startDate: currentWeek.startDate,
                  endDate: currentWeek.endDate,
                  discover: "",
                  define: "",
                  ideate: "",
                  prototype: "",
                  test: "",
                })
              }

              initialPeriods[range.id] = currentPeriod

              // Fetch all periods again for archives (excluding current)
              const allPeriods = await databaseService.fetchResetPeriods(user.id, range.id)
              console.log(`[VisionPage] Total periods for ${range.name}: ${allPeriods.length}. Archive will have: ${allPeriods.length - 1}`)
              const archivedItems = await databaseService.fetchArchivedItems(user.id, range.id)
              console.log(`[VisionPage] Archived items for ${range.name}: ${archivedItems.length}`)
              const groupedCompleted = archivedItems.reduce((acc, item) => {
                const date = new Date(item.completed_at).toISOString().split("T")[0]
                if (!acc[date]) acc[date] = []
                acc[date].push(item)
                return acc
              }, {} as Record<string, ArchivedItem[]>)
              initialArchives[range.id] = { previousResets: allPeriods.slice(1), completed: groupedCompleted }
            }

            setCurrentPeriods(initialPeriods)
            setArchives(initialArchives)
            setIsLoading(false)
          } catch (err) {
            console.error("[VisionPage] Error fetching initial data:", err)
            setError("Failed to load vision board data.")
            setIsLoading(false)
          }
        }
      } else if (!authLoading && !user?.id) {
        console.log("[VisionPage] No user found, redirecting to signin")
        setIsLoading(false)
        setError("Please sign in to view your vision board.")
        router.push("/auth/signin")
      }
    }
    fetchInitialData()
  }, [authLoading, user?.id, router])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!authLoading && user && !isEncryptionReady) {
      console.log("[VisionPage] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [user, authLoading, isEncryptionReady, router])

  const saveCurrentPeriod = async (rangeId: string) => {
    const period = currentPeriods[rangeId]
    if (user?.id && period) {
      try {
        if (period.id) {
          await databaseService.updateResetPeriod(period.id, user.id, rangeId, {
            startDate: period.start_date,
            endDate: period.end_date,
            discover: period.discover,
            define: period.define,
            ideate: period.ideate,
            prototype: period.prototype,
            test: period.test,
          })
          toast.success("Reset period updated successfully!")
        } else {
          const newPeriod = await databaseService.createResetPeriod(user.id, rangeId, {
            startDate: period.start_date || "",
            endDate: period.end_date || "",
            discover: period.discover || "",
            define: period.define || "",
            ideate: period.ideate || "",
            prototype: period.prototype || "",
            test: period.test || "",
          })
          setCurrentPeriods((prev) => ({ ...prev, [rangeId]: newPeriod }))
          toast.success("Reset period created successfully!")
        }
        // Refresh periods
        const periods = await databaseService.fetchResetPeriods(user.id, rangeId)
        setCurrentPeriods((prev) => ({ ...prev, [rangeId]: periods[0] || prev[rangeId] }))
        setArchives((prev) => ({ ...prev, [rangeId]: { ...prev[rangeId], previousResets: periods.slice(1) } }))
      } catch (err) {
        console.error(`[VisionPage] Error saving period for range ${rangeId}:`, err)
        toast.error("Failed to save reset period.")
      }
    }
  }

  const startNewPeriod = async (rangeId: string) => {
    const period = currentPeriods[rangeId]
    if (user?.id && period && userSettings) {
      try {
        // Get current week boundaries
        const currentWeek = getCurrentWeekBoundaries(userSettings.week_start, userSettings.time_zone)

        // Archive current period if it exists and has data
        if (period.id && (period.start_date || period.end_date || period.discover || period.define || period.ideate || period.prototype || period.test)) {
          await databaseService.updateResetPeriod(period.id, user.id, rangeId, {
            startDate: period.start_date,
            endDate: period.end_date,
            discover: period.discover,
            define: period.define,
            ideate: period.ideate,
            prototype: period.prototype,
            test: period.test,
          })
        }

        // Create new period with current week dates
        const newPeriod = await databaseService.createResetPeriod(user.id, rangeId, {
          startDate: currentWeek.startDate,
          endDate: currentWeek.endDate,
          discover: "",
          define: "",
          ideate: "",
          prototype: "",
          test: "",
        })

        setCurrentPeriods((prev) => ({
          ...prev,
          [rangeId]: newPeriod,
        }))

        // Refresh periods for archives
        const periods = await databaseService.fetchResetPeriods(user.id, rangeId)
        setArchives((prev) => ({ ...prev, [rangeId]: { ...prev[rangeId], previousResets: periods.slice(1) } }))
        toast.success("Started new reset period for current week!")
      } catch (err) {
        console.error(`[VisionPage] Error starting new period for range ${rangeId}:`, err)
        toast.error("Failed to start new period.")
      }
    }
  }

  const clearCurrentPeriod = async (rangeId: string) => {
    const period = currentPeriods[rangeId]
    if (user?.id && period?.id) {
      try {
        // Clear all DDDPT fields but keep the dates
        await databaseService.updateResetPeriod(period.id, user.id, rangeId, {
          startDate: period.start_date,
          endDate: period.end_date,
          discover: "",
          define: "",
          ideate: "",
          prototype: "",
          test: "",
        })

        // Update local state
        setCurrentPeriods((prev) => ({
          ...prev,
          [rangeId]: {
            ...prev[rangeId],
            discover: "",
            define: "",
            ideate: "",
            prototype: "",
            test: "",
          },
        }))

        toast.success("Cleared DDDPT fields!")
      } catch (err) {
        console.error(`[VisionPage] Error clearing period for range ${rangeId}:`, err)
        toast.error("Failed to clear period.")
      }
    }
  }

  const markComplete = async (rangeId: string, item: {
    id: string;
    name: string;
    type: string;
    parentMountainId?: string | null;
    parentHillId?: string | null;
    parentTerrainId?: string | null;
    parentLengthId?: string | null;
  }) => {
    if (user?.id) {
      try {
        // Get current reset period ID for this range
        const currentPeriod = currentPeriods[rangeId]
        if (!currentPeriod?.id) {
          toast.error("Please create a reset period first before marking items complete.")
          return
        }

        await databaseService.archiveCompletedItem(user.id, rangeId, currentPeriod.id, item)
        // Refresh archived items
        const archivedItems = await databaseService.fetchArchivedItems(user.id, rangeId)
        const groupedCompleted = archivedItems.reduce((acc, item) => {
          const date = new Date(item.completed_at).toISOString().split("T")[0]
          if (!acc[date]) acc[date] = []
          acc[date].push(item)
          return acc
        }, {} as Record<string, ArchivedItem[]>)
        setArchives((prev) => ({
          ...prev,
          [rangeId]: { ...prev[rangeId], completed: groupedCompleted },
        }))
        toast.success(`Marked ${item.type} as complete!`)
      } catch (err) {
        console.error(`[VisionPage] Error marking item complete for range ${rangeId}:`, err)
        toast.error("Failed to mark item as complete.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <Loader2Icon className="h-10 w-10 animate-spin text-vibrant-blue" />
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue-to-dark-purple text-cream-25">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    )
  }
  return (
    <ResetContext.Provider
      value={{ currentPeriods, setCurrentPeriods, archives, saveCurrentPeriod, startNewPeriod, clearCurrentPeriod, markComplete }}
    >
      <VisionDataProvider userId={user!.id} databaseService={databaseService}>
        <VisionPageContent
          showVisionBoard={showVisionBoard}
          setShowVisionBoard={setShowVisionBoard}
          showDailyPlanner={showDailyPlanner}
          setShowDailyPlanner={setShowDailyPlanner}
          showMountainView={showMountainView}
          setShowMountainView={setShowMountainView}
          showTaskadeViews={showTaskadeViews}
          setShowTaskadeViews={setShowTaskadeViews}
          databaseService={databaseService}
        />
      </VisionDataProvider>
    </ResetContext.Provider>
  )
}

function VisionPageContent({
  showVisionBoard,
  setShowVisionBoard,
  showDailyPlanner,
  setShowDailyPlanner,
  showMountainView,
  setShowMountainView,
  showTaskadeViews,
  setShowTaskadeViews,
  databaseService,
}: {
  showVisionBoard: boolean
  setShowVisionBoard: (show: boolean) => void
  showDailyPlanner: boolean
  setShowDailyPlanner: (show: boolean) => void
  showMountainView: boolean
  setShowMountainView: (show: boolean) => void
  showTaskadeViews: boolean
  setShowTaskadeViews: (show: boolean) => void
  databaseService: typeof databaseService
}) {
  const { ranges, refreshData } = useVisionData()
  const resetContext = useContext(ResetContext)
  const { user } = useAuth(AuthService)

  // Helper to find item type by searching through the hierarchy
  const findItemType = (itemId: string): 'range' | 'mountain' | 'hill' | 'terrain' | 'length' | 'step' | 'breath' | null => {
    for (const range of ranges) {
      if (range.id === itemId) return 'range'
      for (const mountain of range.mountains || []) {
        if (mountain.id === itemId) return 'mountain'
        for (const hill of mountain.hills || []) {
          if (hill.id === itemId) return 'hill'
          for (const terrain of hill.terrains || []) {
            if (terrain.id === itemId) return 'terrain'
            for (const length of terrain.lengths || []) {
              if (length.id === itemId) return 'length'
              for (const step of length.steps || []) {
                if (step.id === itemId) return 'step'
                for (const breath of step.breaths || []) {
                  if (breath.id === itemId) return 'breath'
                }
              }
            }
          }
        }
      }
    }
    return null
  }

  // Handler for updating items (including reset period fields)
  const handleUpdateItem = async (updates: any) => {
    if (updates.type === 'reset-period' && resetContext) {
      // Update reset period field
      const { rangeId, field, value } = updates
      const currentPeriod = resetContext.currentPeriods[rangeId]

      if (currentPeriod) {
        // Update local state immediately for responsiveness
        resetContext.setCurrentPeriods((prev) => ({
          ...prev,
          [rangeId]: {
            ...prev[rangeId],
            [field]: value,
          },
        }))

        // Save to database
        await resetContext.saveCurrentPeriod(rangeId)

        // Show success toast
        toast.success("Saved!", { duration: 1000 })
      }
    } else if (updates.action === 'set-tag') {
      // Handle setting tag (habit, activity, milestone, vision)
      const { id, tag } = updates

      if (!user?.id) return

      try {
        // Find what type of item this is
        const itemType = findItemType(id)

        // Update in database based on item type
        switch (itemType) {
          case 'range':
            await databaseService.updateRangeTag(id, user.id, tag)
            break
          case 'mountain':
            await databaseService.updateMountainTag(id, user.id, tag)
            break
          case 'hill':
            await databaseService.updateHillTag(id, user.id, tag)
            break
          case 'terrain':
            await databaseService.updateTerrainTag(id, user.id, tag)
            break
          case 'length':
            await databaseService.updateLength(id, user.id, { tag })
            break
          case 'step':
            await databaseService.updateStep(id, user.id, { tag })
            break
          default:
            console.error('Unknown item type for id:', id)
            toast.error('Failed to update tag: Unknown item type')
            return
        }

        // Refresh the data to show updated tags
        await refreshData(true)
      } catch (error) {
        console.error('Error updating tag:', error)
        toast.error('Failed to update tag')
      }
    }
    // Add handlers for other update types here as needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25 p-4">
      <FloatingNav />
      <main className="container mx-auto p-4 sm:p-6 max-w-full flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-center">Vision Board</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVisionBoard(!showVisionBoard)}
              className={showVisionBoard ? "bg-vibrant-blue/20" : ""}
              title="Toggle Vision Board"
            >
              <LayoutDashboard className="h-5 w-5 text-cream-25" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDailyPlanner(!showDailyPlanner)}
              className={showDailyPlanner ? "bg-vibrant-blue/20" : ""}
              title="Toggle Daily Planner"
            >
              <Calendar className="h-5 w-5 text-cream-25" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMountainView(!showMountainView)}
              className={showMountainView ? "bg-vibrant-blue/20" : ""}
              title="Toggle Mountain View"
            >
              <Mountain className="h-5 w-5 text-cream-25" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTaskadeViews(!showTaskadeViews)}
              className={showTaskadeViews ? "bg-vibrant-blue/20" : ""}
              title="Toggle Taskade Views"
            >
              <ListTree className="h-5 w-5 text-cream-25" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {showVisionBoard && <VisionBoardWrapper databaseService={databaseService} />}
          {showDailyPlanner && <DailyPlanner />}
          {showMountainView && <MountainViewWrapper databaseService={databaseService} />}
          {showTaskadeViews && (
            <TaskadeViewWrapper
              ranges={ranges}
              currentPeriods={resetContext?.currentPeriods}
              archives={resetContext?.archives}
              onUpdateItem={handleUpdateItem}
            />
          )}
        </div>
      </main>
    </div>
  )
}