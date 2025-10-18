"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mountain, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react" // Import Edit icon
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Hill, Terrain } from "@/types/wealth-vision"
import { TerrainCard } from "./terrain-card"
import { AddTerrainModal } from "./add-terrain-modal"
import { EditHillModal } from "./wealth-vision/edit-hill-modal" // Import EditHillModal
import { getTerrainsByHillId } from "@/app/actions/wealth-vision-actions"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase/client"

interface HillCardProps {
  hill: Hill
}

export function HillCard({ hill }: HillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddTerrainModalOpen, setIsAddTerrainModalOpen] = useState(false)
  const [isEditHillModalOpen, setIsEditHillModalOpen] = useState(false) // State for Edit Hill modal
  const [terrains, setTerrains] = useState<Terrain[]>([])
  const [loadingTerrains, setLoadingTerrains] = useState(true)
  const [errorTerrains, setErrorTerrains] = useState<string | null>(null)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchTerrains()
      }

      channel = supabase
        .channel(`terrains_for_hill_${hill.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "terrains",
            filter: `hill_id=eq.${hill.id}`,
          },
          (payload) => {
            console.log("Realtime change received for terrains:", payload)
            if (payload.eventType === "INSERT") {
              setTerrains((prev) =>
                [...prev, payload.new as Terrain].sort((a, b) => (a.position || 0) - (b.position || 0)),
              )
            } else if (payload.eventType === "UPDATE") {
              setTerrains((prev) => prev.map((t) => (t.id === payload.old.id ? (payload.new as Terrain) : t)))
            } else if (payload.eventType === "DELETE") {
              setTerrains((prev) => prev.filter((t) => t.id !== payload.old.id))
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
  }, [hill.id, isExpanded])

  const fetchTerrains = async () => {
    setLoadingTerrains(true)
    setErrorTerrains(null)
    try {
      const fetchedTerrains = await getTerrainsByHillId(hill.id)
      setTerrains(fetchedTerrains)
    } catch (err: any) {
      console.error(`Error fetching terrains for hill ${hill.id}:`, err.message)
      setErrorTerrains("Failed to load terrains.")
    } finally {
      setLoadingTerrains(false)
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mountain className="w-5 h-5 text-logo-blue" />
          <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{hill.title}</h3>
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
                onClick={() => setIsAddTerrainModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Terrain
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditHillModalOpen(true)} // Open Edit Hill modal
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Hill
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
            className="mt-4 pl-6 space-y-3 overflow-hidden"
          >
            {loadingTerrains ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Terrains...</div>
            ) : errorTerrains ? (
              <div className="text-red-500 text-center py-4">Error: {errorTerrains}</div>
            ) : terrains.length > 0 ? (
              terrains.map((terrain) => <TerrainCard key={terrain.id} terrain={terrain} />)
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Terrains defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddTerrainModal
        isOpen={isAddTerrainModalOpen}
        onClose={() => setIsAddTerrainModalOpen(false)}
        hillId={hill.id}
      />
      <EditHillModal isOpen={isEditHillModalOpen} onClose={() => setIsEditHillModalOpen(false)} hill={hill} />
    </ZenCard>
  )
}
