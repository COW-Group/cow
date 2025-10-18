"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react" // Import Edit icon
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Terrain, Length } from "@/types/wealth-vision" // Corrected type
import { LengthCard } from "./length-card" // Corrected import
import { AddLengthModal } from "./add-length-modal" // Corrected import
import { EditTerrainModal } from "./wealth-vision/edit-terrain-modal" // Import EditTerrainModal
import { getLengthsByTerrainId } from "@/app/actions/wealth-vision-actions" // Corrected import
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase/client"

interface TerrainCardProps {
  terrain: Terrain
}

export function TerrainCard({ terrain }: TerrainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddLengthModalOpen, setIsAddLengthModalOpen] = useState(false) // Corrected state name
  const [isEditTerrainModalOpen, setIsEditTerrainModalOpen] = useState(false) // State for Edit Terrain modal
  const [lengths, setLengths] = useState<Length[]>([]) // Corrected state name and type
  const [loadingLengths, setLoadingLengths] = useState(true) // Corrected state name
  const [errorLengths, setErrorLengths] = useState<string | null>(null) // Corrected state name

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchLengths() // Corrected function call
      }

      channel = supabase
        .channel(`lengths_for_terrain_${terrain.id}`) // Corrected channel name and filter
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "lengths", // Corrected table name
            filter: `terrain_id=eq.${terrain.id}`, // Corrected filter
          },
          (payload) => {
            console.log("Realtime change received for lengths:", payload)
            if (payload.eventType === "INSERT") {
              setLengths((prev) =>
                [...prev, payload.new as Length].sort((a, b) => (a.position || 0) - (b.position || 0)),
              )
            } else if (payload.eventType === "UPDATE") {
              setLengths((prev) => prev.map((m) => (m.id === payload.old.id ? (payload.new as Length) : m)))
            } else if (payload.eventType === "DELETE") {
              setLengths((prev) => prev.filter((m) => m.id !== payload.old.id))
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
  }, [terrain.id, isExpanded])

  const fetchLengths = async () => {
    // Corrected function name
    setLoadingLengths(true) // Corrected state setter
    setErrorLengths(null) // Corrected state setter
    try {
      const fetchedLengths = await getLengthsByTerrainId(terrain.id) // Corrected function call and argument
      setLengths(fetchedLengths) // Corrected state setter
    } catch (err: any) {
      console.error(`Error fetching lengths for terrain ${terrain.id}:`, err.message) // Corrected message
      setErrorLengths("Failed to load lengths.") // Corrected message
    } finally {
      setLoadingLengths(false) // Corrected state setter
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Map className="w-5 h-5 text-logo-blue" />
          <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{terrain.title}</h3>
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
                onClick={() => setIsAddLengthModalOpen(true)} // Corrected state setter
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Length {/* Corrected text */}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditTerrainModalOpen(true)} // Open Edit Terrain modal
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Terrain
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
            {loadingLengths ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Lengths...</div>
            ) : errorLengths ? (
              <div className="text-red-500 text-center py-4">Error: {errorLengths}</div>
            ) : lengths.length > 0 ? (
              lengths.map((length) => <LengthCard key={length.id} length={length} />) // Corrected component and prop
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Lengths defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddLengthModal
        isOpen={isAddLengthModalOpen}
        onClose={() => setIsAddLengthModalOpen(false)}
        terrainId={terrain.id}
      />
      <EditTerrainModal
        isOpen={isEditTerrainModalOpen}
        onClose={() => setIsEditTerrainModalOpen(false)}
        terrain={terrain}
      />
    </ZenCard>
  )
}
