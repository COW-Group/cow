"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckSquare, Square, ChevronDown, ChevronUp, MoreVertical, Edit } from "lucide-react"
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Step, Breath } from "@/types/wealth-vision" // Corrected types
import { BreathCard } from "./breath-card"
import { AddBreathModal } from "./add-breath-modal"
import { EditStepModal } from "./wealth-vision/edit-step-modal" // Corrected import
import { getBreathsByStepId } from "@/app/actions/wealth-vision-actions" // Corrected import
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getClientSupabaseClient } from "@/lib/supabase/client"

interface StepCardProps {
  // Corrected interface name
  step: Step // Corrected prop name and type
}

export function StepCard({ step }: StepCardProps) {
  // Corrected component name and prop
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAddBreathModalOpen, setIsAddBreathModalOpen] = useState(false)
  const [isEditStepModalOpen, setIsEditStepModalOpen] = useState(false) // Corrected state name
  const [breaths, setBreaths] = useState<Breath[]>([])
  const [loadingBreaths, setLoadingBreaths] = useState(true)
  const [errorBreaths, setErrorBreaths] = useState<string | null>(null)

  const supabase = getClientSupabaseClient()

  useEffect(() => {
    let channel: RealtimeChannel | null = null

    const setupRealtime = async () => {
      if (isExpanded) {
        await fetchBreaths()
      }

      channel = supabase
        .channel(`breaths_for_step_${step.id}`) // Corrected channel name and filter
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "breaths", // Corrected table name
            filter: `step_id=eq.${step.id}`, // Corrected filter
          },
          (payload) => {
            console.log("Realtime change received for breaths:", payload)
            if (payload.eventType === "INSERT") {
              setBreaths((prev) =>
                [...prev, payload.new as Breath].sort((a, b) => (a.position || 0) - (b.position || 0)),
              )
            } else if (payload.eventType === "UPDATE") {
              setBreaths((prev) => prev.map((b) => (b.id === payload.old.id ? (payload.new as Breath) : b)))
            } else if (payload.eventType === "DELETE") {
              setBreaths((prev) => prev.filter((b) => b.id !== payload.old.id))
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
  }, [step.id, isExpanded, supabase]) // Corrected dependency

  const fetchBreaths = async () => {
    setLoadingBreaths(true)
    setErrorBreaths(null)
    try {
      const fetchedBreaths = await getBreathsByStepId(step.id) // Corrected function call and argument
      setBreaths(fetchedBreaths)
    } catch (err: any) {
      console.error(`Error fetching breaths for step ${step.id}:`, err.message)
      setErrorBreaths("Failed to load breaths.")
    } finally {
      setLoadingBreaths(false)
    }
  }

  return (
    <ZenCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCompleted(!isCompleted)}
            className="text-ink-600 dark:text-cream-300 hover:bg-transparent"
          >
            {isCompleted ? (
              <CheckSquare className="w-5 h-5 text-sage-500" />
            ) : (
              <Square className="w-5 h-5 text-ink-400" />
            )}
          </Button>
          <h3
            className={`text-lg font-medium ${isCompleted ? "line-through text-ink-400" : "text-ink-800 dark:text-cream-100"}`}
          >
            {step.title} {/* Corrected prop usage */}
          </h3>
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
                onClick={() => setIsAddBreathModalOpen(true)}
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                Add Breath
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditStepModalOpen(true)} // Corrected state setter
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Step {/* Corrected text */}
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
            {loadingBreaths ? (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">Loading Breaths...</div>
            ) : errorBreaths ? (
              <div className="text-red-500 text-center py-4">Error: {errorBreaths}</div>
            ) : breaths.length > 0 ? (
              breaths.map((breath) => <BreathCard key={breath.id} breath={breath} />)
            ) : (
              <div className="text-center text-ink-600 dark:text-cream-300 py-4">No Breaths defined yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AddBreathModal isOpen={isAddBreathModalOpen} onClose={() => setIsAddBreathModalOpen(false)} stepId={step.id} />{" "}
      {/* Corrected prop */}
      <EditStepModal isOpen={isEditStepModalOpen} onClose={() => setIsEditStepModalOpen(false)} step={step} />{" "}
      {/* Corrected component and prop */}
    </ZenCard>
  )
}
