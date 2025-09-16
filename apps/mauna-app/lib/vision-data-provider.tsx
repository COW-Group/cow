"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { DatabaseService } from "@/lib/database-service"
import { TaskListService } from "@/lib/task-list-service"
import type { Range, TaskList, Length } from "@/lib/types"
import { toast } from "sonner"

interface VisionDataContextType {
  ranges: Range[]
  taskLists: TaskList[]
  lengths: Length[]
  setRanges: React.Dispatch<React.SetStateAction<Range[]>>
  refreshData: (force?: boolean) => Promise<void>
}

const VisionDataContext = createContext<VisionDataContextType | undefined>(undefined)

export function VisionDataProvider({
  children,
  userId,
  databaseService,
}: {
  children: React.ReactNode
  userId: string
  databaseService: DatabaseService
}) {
  console.log("[VisionDataProvider] Mounting, userId:", userId)
  const [ranges, setRanges] = useState<Range[]>([])
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [lengths, setLengths] = useState<Length[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const hasFetchedRef = useRef(false)

  const taskListService = useRef(new TaskListService(userId, databaseService)).current

  const fetchData = useCallback(async () => {
    if (!userId || hasFetchedRef.current) {
      console.log("[VisionDataProvider] Skipping fetch, already fetched or no userId")
      return
    }
    setIsLoading(true)
    try {
      console.log("[VisionDataProvider] Fetching data for userId:", userId)
      const [fetchedRanges, fetchedTaskLists, fetchedLengths] = await Promise.all([
        databaseService.fetchRanges(userId),
        taskListService.getTaskLists(),
        taskListService.getLengths(),
      ])
      console.log("[VisionDataProvider] Fetched vision board ranges:", fetchedRanges)
      console.log("[VisionDataProvider] Fetched task lists:", fetchedTaskLists)
      console.log("[VisionDataProvider] Fetched lengths:", fetchedLengths)
      setRanges(fetchedRanges || [])
      setTaskLists(fetchedTaskLists || [])
      setLengths(fetchedLengths || [])
      hasFetchedRef.current = true
    } catch (err: any) {
      console.error("[VisionDataProvider] Failed to fetch data:", err)
      toast.error("Failed to load vision board data.")
      setRanges([])
      setTaskLists([])
      setLengths([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, databaseService])

  useEffect(() => {
    console.log("[VisionDataProvider] useEffect running, userId:", userId)
    fetchData()
    return () => {
      console.log("[VisionDataProvider] Cleaning up")
    }
  }, [fetchData])

  const refreshData = useCallback(
    async (force = false) => {
      console.log("[VisionDataProvider] refreshData called, force:", force)
      if (force || !hasFetchedRef.current) {
        hasFetchedRef.current = false // Allow refetch
        await fetchData()
      } else {
        console.log("[VisionDataProvider] Skipping refresh, data already fetched")
      }
    },
    [fetchData],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <div className="h-10 w-10 animate-spin text-vibrant-blue" />
      </div>
    )
  }

  return (
    <VisionDataContext.Provider value={{ ranges, taskLists, lengths, setRanges, refreshData }}>
      {children}
    </VisionDataContext.Provider>
  )
}

export function useVisionData() {
  const context = useContext(VisionDataContext)
  if (!context) {
    throw new Error("useVisionData must be used within a VisionDataProvider")
  }
  return context
}