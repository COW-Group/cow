"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flag, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react"
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Length, Step } from "@/types/wealth-vision" // Corrected types
import { StepCard } from "./step-card" // Corrected import
import { AddStepModal } from "./add-step-modal" // Corrected import
import { EditLengthModal } from "./wealth-vision/edit-length-modal" // Corrected import
import { getStepsByLengthId } from "@/app/actions/wealth-vision-actions" // Corrected import
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase/client"

interface LengthCardProps {
  // Corrected interface name
  length: Length // Corrected prop name and type
}

export function LengthCard({ length }: LengthCardProps) {
  // Corrected component name and prop
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false)
  const [isEditLengthModalOpen, setIsEditLengthModalOpen] = useState(false) // Corrected state name
  const [steps, setSteps] = useState<Step[]>([])
  const [loadingSteps, setLoadingSteps] = useState(true)
  const [errorSteps, setErrorSteps] = useState<string | null>(null)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchSteps()
      }

      channel = supabase
        .channel(`steps_for_length_${length.id}`) // Corrected channel name and filter
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "steps", // Corrected table name
            filter: `length_id=eq.${length.id}`, // Corrected filter
          },
          (payload) => {
            console.log("Realtime change received for steps:", payload)
            if (payload.eventType === "INSERT") {
              setSteps((prev) => [...prev, payload.new as Step].sort((a, b) => (a.position || 0) - (b.position || 0)))
            } else if (payload.eventType === "UPDATE") {
              setSteps((prev) => prev.map((s) => (s.id === payload.old.id ? (payload.new as Step) : s)))
            } else if (payload.eventType === "DELETE") {
              setSteps((prev) => prev.filter((s) => s.id !== payload.old.id))
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
  }, [length.id, isExpanded, supabase]) // Corrected dependency

  const fetchSteps = async () => {
    setLoadingSteps(true)
    setErrorSteps(null)
    try {
      const fetchedSteps = await getStepsByLengthId(length.id) // Corrected function call and argument
      setSteps(fetchedSteps)
    } catch (err: any) {
      console.error(`Error fetching steps for length ${length.id}:`, err.message)
      setErrorSteps("Failed to load steps.")
    } finally {
      setLoadingSteps(false)
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flag className="w-5 h-5 text-logo-blue" />
          <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{length.title}</h3>{" "}
          {/* Corrected prop usage */}
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
                onClick={() => setIsAddStepModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Step {/* Corrected text */}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditLengthModalOpen(true)} // Corrected state setter
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Length {/* Corrected text */}
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
            {loadingSteps ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Steps...</div>
            ) : errorSteps ? (
              <div className="text-red-500 text-center py-4">Error: {errorSteps}</div>
            ) : steps.length > 0 ? (
              steps.map((step) => <StepCard key={step.id} step={step} />)
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Steps defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        lengthId={length.id} // Corrected prop
      />
      <EditLengthModal
        isOpen={isEditLengthModalOpen}
        onClose={() => setIsEditLengthModalOpen(false)}
        length={length} // Corrected prop
      />
    </ZenCard>
  )
}
