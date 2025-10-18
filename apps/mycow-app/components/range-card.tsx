"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Telescope, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react"
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import type { VisionBoardSection, Mountain } from "@/types/wealth-vision"
import { MountainCard } from "./mountain-card"
import { AddMountainModal } from "./add-mountain-modal"
import { EditRangeModal } from "./wealth-vision/edit-range-modal"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface RangeCardProps {
  range: VisionBoardSection
}

export function RangeCard({ range }: RangeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mountains, setMountains] = useState<Mountain[]>([])
  const [loadingMountains, setLoadingMountains] = useState(true)
  const [errorMountains, setErrorMountains] = useState<string | null>(null)
  const [isAddMountainModalOpen, setIsAddMountainModalOpen] = useState(false)
  const [isEditRangeModalOpen, setIsEditRangeModalOpen] = useState(false)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchMountains()
      }

      channel = supabase
        .channel(`mountains_for_range_${range.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "mountains",
            filter: `range_id=eq.${range.id}`,
          },
          (payload) => {
            console.log("Realtime change received for mountains:", payload)
            if (payload.eventType === "INSERT") {
              setMountains((prev) =>
                [...prev, payload.new as Mountain].sort((a, b) => (a.position || 0) - (b.position || 0)),
              )
            } else if (payload.eventType === "UPDATE") {
              setMountains((prev) => prev.map((m) => (m.id === payload.old.id ? (payload.new as Mountain) : m)))
            } else if (payload.eventType === "DELETE") {
              setMountains((prev) => prev.filter((m) => m.id !== payload.old.id))
            }
          },
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [range.id, isExpanded])

  const fetchMountains = async () => {
    setLoadingMountains(true)
    setErrorMountains(null)
    try {
      const { data, error } = await supabase
        .from("mountains")
        .select("*")
        .eq("range_id", range.id)
        .order("position", { ascending: true })

      if (error) throw error
      setMountains(data || [])
    } catch (err: any) {
      console.error(`Error fetching mountains for range ${range.id}:`, err.message)
      setErrorMountains("Failed to load mountains.")
    } finally {
      setLoadingMountains(false)
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Telescope className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-ink-800 dark:text-cream-100">{range.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-ink-600 dark:text-cream-300">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cream-50 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-ink-800 dark:text-cream-100">
              <DropdownMenuItem
                onClick={() => setIsAddMountainModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Mountain
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditRangeModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-ink-600 dark:text-cream-300"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-4 pl-6 space-y-4 overflow-hidden"
          >
            {loadingMountains ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Mountains...</div>
            ) : errorMountains ? (
              <div className="text-red-500 text-center py-4">Error: {errorMountains}</div>
            ) : mountains.length > 0 ? (
              mountains.map((mountain) => <MountainCard key={mountain.id} mountain={mountain} />)
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Mountains defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddMountainModal
        isOpen={isAddMountainModalOpen}
        onClose={() => setIsAddMountainModalOpen(false)}
        rangeId={range.id}
      />
      <EditRangeModal isOpen={isEditRangeModalOpen} onClose={() => setIsEditRangeModalOpen(false)} range={range} />
    </ZenCard>
  )
}
