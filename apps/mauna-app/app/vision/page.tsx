"use client"

import { useState, useEffect, useRef, createContext } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import { VisionDataProvider } from "@/lib/vision-data-provider"
import { VisionBoardWrapper } from "@/components/vision-board-wrapper"
import { MountainViewWrapper } from "@/components/mountain-view-wrapper"
import { Button } from "@/components/ui/button"
import { Loader2Icon, LayoutDashboard, Calendar, Mountain } from "lucide-react"
import { DailyPlanner } from "@/components/DailyPlanner"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"
import { toast } from "sonner"

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
  markComplete: (rangeId: string, item: { id: string; name: string; type: string }) => Promise<void>
} | null>(null)

export default function VisionPage() {
  console.log("[VisionPage] Rendering")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)
  const [showVisionBoard, setShowVisionBoard] = useState(true)
  const [showDailyPlanner, setShowDailyPlanner] = useState(false)
  const [showMountainView, setShowMountainView] = useState(false)
  const [currentPeriods, setCurrentPeriods] = useState<{ [rangeId: string]: Partial<ResetPeriod> }>({})
  const [archives, setArchives] = useState<{
    [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }
  }>({})

  useEffect(() => {
    console.log("[VisionPage] useEffect running, authLoading:", authLoading, "userId:", user?.id)
    const fetchInitialData = async () => {
      if (!authLoading && user?.id) {
        if (!hasMountedRef.current) {
          try {
            // Fetch ranges to initialize periods and archives
            const ranges = await databaseService.fetchRanges(user.id)
            const initialPeriods: { [rangeId: string]: Partial<ResetPeriod> } = {}
            const initialArchives: {
              [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }
            } = {}

            for (const range of ranges) {
              const periods = await databaseService.fetchResetPeriods(user.id, range.id)
              initialPeriods[range.id] = periods[0] || {
                start_date: "",
                end_date: "",
                discover: "",
                define: "",
                ideate: "",
                prototype: "",
                test: "",
              }
              const archivedItems = await databaseService.fetchArchivedItems(user.id, range.id)
              const groupedCompleted = archivedItems.reduce((acc, item) => {
                const date = new Date(item.completed_at).toISOString().split("T")[0]
                if (!acc[date]) acc[date] = []
                acc[date].push(item)
                return acc
              }, {} as Record<string, ArchivedItem[]>)
              initialArchives[range.id] = { previousResets: periods.slice(1), completed: groupedCompleted }
            }

            setCurrentPeriods(initialPeriods)
            setArchives(initialArchives)
            setIsLoading(false)
            hasMountedRef.current = true
          } catch (err) {
            console.error("[VisionPage] Error fetching initial data:", err)
            setError("Failed to load vision board data.")
            setIsLoading(false)
          }
        }
      } else if (!authLoading && !user?.id) {
        setIsLoading(false)
        setError("Please sign in to view your vision board.")
        router.push("/auth/signin")
      }
    }
    fetchInitialData()
  }, [authLoading, user?.id, router])

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
    if (user?.id && period) {
      try {
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
        // Start new period
        setCurrentPeriods((prev) => ({
          ...prev,
          [rangeId]: {
            start_date: "",
            end_date: "",
            discover: "",
            define: "",
            ideate: "",
            prototype: "",
            test: "",
          },
        }))
        // Refresh periods
        const periods = await databaseService.fetchResetPeriods(user.id, rangeId)
        setArchives((prev) => ({ ...prev, [rangeId]: { ...prev[rangeId], previousResets: periods } }))
        toast.success("Started new reset period!")
      } catch (err) {
        console.error(`[VisionPage] Error starting new period for range ${rangeId}:`, err)
        toast.error("Failed to start new period.")
      }
    }
  }

  const markComplete = async (rangeId: string, item: { id: string; name: string; type: string }) => {
    if (user?.id) {
      try {
        await databaseService.archiveCompletedItem(user.id, rangeId, item)
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
      value={{ currentPeriods, setCurrentPeriods, archives, saveCurrentPeriod, startNewPeriod, markComplete }}
    >
      <VisionDataProvider userId={user!.id} databaseService={databaseService}>
        <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25 p-4">
          <div className="h-16 sm:h-20"></div>
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
              </div>
            </div>
            <div className="space-y-4">
              {showVisionBoard && <VisionBoardWrapper databaseService={databaseService} />}
              {showDailyPlanner && <DailyPlanner />}
              {showMountainView && <MountainViewWrapper databaseService={databaseService} />}
            </div>
          </main>
        </div>
      </VisionDataProvider>
    </ResetContext.Provider>
  )
}