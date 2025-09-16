"use client"

import { useState, useCallback } from "react"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToHorizontalAxis, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"
import { Mountain, Hill } from "@/lib/types"
import { MountainColumn } from "@/components/mountain-column"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface MountainBoardProps {
  data: Mountain[]
  onAddMountain: (name: string) => Promise<void>
  onUpdateMountain: (mountainId: string, newName: string) => Promise<void>
  onUpdateMountainTag: (mountainId: string, tag: string | null) => Promise<void>
  onDeleteMountain: (mountainId: string) => Promise<void>
  onAddHill: (mountainId: string, name: string) => Promise<void>
  onUpdateHill: (mountainId: string, hillId: string, newName: string) => Promise<void>
  onUpdateHillTag: (mountainId: string, hillId: string, tag: string | null) => Promise<void>
  onDeleteHill: (mountainId: string, hillId: string) => Promise<void>
  onReorderHills: (mountainId: string, reorderedHills: Hill[]) => Promise<void>
}

export function MountainBoard({
  data,
  onAddMountain,
  onUpdateMountain,
  onUpdateMountainTag,
  onDeleteMountain,
  onAddHill,
  onUpdateHill,
  onUpdateHillTag,
  onDeleteHill,
  onReorderHills,
}: MountainBoardProps) {
  console.log("[MountainBoard] Rendering with data:", data)

  const [isAddingMountain, setIsAddingMountain] = useState(false)
  const [newMountainName, setNewMountainName] = useState("")

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const mountainId = active.data.current?.mountainId
      const activeId = active.id as string
      const overId = over.id as string

      if (mountainId) {
        // Reordering hills within a mountain
        const mountain = data.find((m) => m.id === mountainId)
        if (mountain) {
          const oldIndex = mountain.hills.findIndex((hill) => hill.id === activeId)
          const newIndex = mountain.hills.findIndex((hill) => hill.id === overId)
          if (oldIndex !== newIndex) {
            const reorderedHills = [...mountain.hills]
            const [movedHill] = reorderedHills.splice(oldIndex, 1)
            reorderedHills.splice(newIndex, 0, movedHill)
            await onReorderHills(mountainId, reorderedHills)
          }
        }
      }
    },
    [data, onReorderHills],
  )

  const handleAddMountain = async () => {
    if (!newMountainName.trim()) return
    await onAddMountain(newMountainName)
    setNewMountainName("")
    setIsAddingMountain(false)
  }

  return (
    <div className="p-4 bg-white/10 rounded-lg">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis, restrictToFirstScrollableAncestor]}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          <SortableContext
            items={data.map((mountain) => mountain.id)}
            strategy={horizontalListSortingStrategy}
          >
            {data.map((mountain) => (
              <MountainColumn
                key={mountain.id}
                mountain={mountain}
                onUpdateMountain={onUpdateMountain}
                onUpdateMountainTag={onUpdateMountainTag}
                onDeleteMountain={onDeleteMountain}
                onAddHill={onAddHill}
                onUpdateHill={onUpdateHill}
                onUpdateHillTag={onUpdateHillTag}
                onDeleteHill={onDeleteHill}
              />
            ))}
          </SortableContext>
          {isAddingMountain ? (
            <div className="flex-shrink-0 w-64 p-4 bg-gray-800/50 rounded-lg">
              <input
                type="text"
                value={newMountainName}
                onChange={(e) => setNewMountainName(e.target.value)}
                placeholder="Enter mountain name"
                className="w-full p-2 mb-2 bg-gray-900 text-cream-25 rounded"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={handleAddMountain} size="sm">
                  Add
                </Button>
                <Button onClick={() => setIsAddingMountain(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingMountain(true)}
              className="flex-shrink-0 w-64 h-12 bg-vibrant-blue/20 text-cream-25"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Mountain
            </Button>
          )}
        </div>
      </DndContext>
    </div>
  )
}