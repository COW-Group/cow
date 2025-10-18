"use client"

import { useState } from "react"
import { CheckSquare, Square, Edit, MoreVertical } from "lucide-react"
import { ZenCard } from "./zen-card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Breath } from "@/types/wealth-vision"
import { EditBreathModal } from "./wealth-vision/edit-breath-modal" // Import EditBreathModal

interface BreathCardProps {
  breath: Breath
}

export function BreathCard({ breath }: BreathCardProps) {
  const [isCompleted, setIsCompleted] = useState(breath.completed)
  const [isEditBreathModalOpen, setIsEditBreathModalOpen] = useState(false) // State for Edit Breath modal

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
          <h4
            className={`text-base font-normal ${isCompleted ? "line-through text-ink-400" : "text-ink-800 dark:text-cream-100"}`}
          >
            {breath.label}
          </h4>
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
                onClick={() => setIsEditBreathModalOpen(true)} // Open Edit Breath modal
                className="cursor-pointer hover:bg-cream-100 dark:hover:bg-ink-700"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Breath
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <EditBreathModal isOpen={isEditBreathModalOpen} onClose={() => setIsEditBreathModalOpen(false)} breath={breath} />
    </ZenCard>
  )
}
