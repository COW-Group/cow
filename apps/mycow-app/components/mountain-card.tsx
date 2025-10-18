"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MountainIcon, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react" // Import Edit icon
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Mountain, Hill } from "@/types/wealth-vision"
import { HillCard } from "./hill-card"
import { AddHillModal } from "./add-hill-modal"
import { EditMountainModal } from "./wealth-vision/edit-mountain-modal" // Import EditMountainModal
import { getHillsByMountainId } from "@/app/actions/wealth-vision-actions"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase/client"

interface MountainCardProps {
  mountain: Mountain
}

export function MountainCard({ mountain }: MountainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddHillModalOpen, setIsAddHillModalOpen] = useState(false)
  const [isEditMountainModalOpen, setIsEditMountainModalOpen] = useState(false) // State for Edit Mountain modal
  const [hills, setHills] = useState<Hill[]>([])
  const [loadingHills, setLoadingHills] = useState(true)
  const [errorHills, setErrorHills] = useState<string | null>(null)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchHills()
      }

      channel = supabase
        .channel(`hills_for_mountain_${mountain.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "hills",
            filter: `mountain_id=eq.${mountain.id}`,
          },
          (payload) => {
            console.log("Realtime change received for hills:", payload)
            if (payload.eventType === "INSERT") {
              setHills((prev) => [...prev, payload.new as Hill].sort((a, b) => (a.position || 0) - (b.position || 0)))
            } else if (payload.eventType === "UPDATE") {
              setHills((prev) => prev.map((h) => (h.id === payload.old.id ? (payload.new as Hill) : h)))
            } else if (payload.eventType === "DELETE") {
              setHills((prev) => prev.filter((h) => h.id !== payload.old.id))
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
  }, [mountain.id, isExpanded])

  const fetchHills = async () => {
    setLoadingHills(true)
    setErrorHills(null)
    try {
      const fetchedHills = await getHillsByMountainId(mountain.id)
      setHills(fetchedHills)
    } catch (err: any) {
      console.error(`Error fetching hills for mountain ${mountain.id}:`, err.message)
      setErrorHills("Failed to load hills.")
    } finally {
      setLoadingHills(false)
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MountainIcon className="w-6 h-6 text-logo-blue" />
          <h2 className="text-xl font-light text-ink-800 dark:text-cream-100">{mountain.title}</h2>
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
                onClick={() => setIsAddHillModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Hill
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditMountainModalOpen(true)} // Open Edit Mountain modal
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Mountain
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
            className="mt-4 pl-4 space-y-4 overflow-hidden"
          >
            {loadingHills ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Hills...</div>
            ) : errorHills ? (
              <div className="text-red-500 text-center py-4">Error: {errorHills}</div>
            ) : hills.length > 0 ? (
              hills.map((hill) => <HillCard key={hill.id} hill={hill} />)
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Hills defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddHillModal isOpen={isAddHillModalOpen} onClose={() => setIsAddHillModalOpen(false)} mountainId={mountain.id} />
      <EditMountainModal
        isOpen={isEditMountainModalOpen}
        onClose={() => setIsEditMountainModalOpen(false)}
        mountain={mountain}
      />
    </ZenCard>
  )
}
