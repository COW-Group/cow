// components/vision-board.tsx
"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type Active,
  MeasuringStrategy,
} from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { restrictToHorizontalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import type { Range, Mountain, Hill, Terrain, Length, Step, TaskList } from "@/lib/types"
import { createPortal } from "react-dom"
import { RangeColumn } from "@/components/range-column"
import { useVisionData } from "@/lib/vision-data-provider"

interface VisionBoardProps {
  data: Range[]
  onAddRange: (name: string) => Promise<void>
  onUpdateRange: (rangeId: string, newName: string) => Promise<void>
  onUpdateRangeTag: (rangeId: string, tag: string | null) => Promise<void>
  onDeleteRange: (rangeId: string) => Promise<void>
  onAddMountain: (rangeId: string, name: string) => Promise<void>
  onUpdateMountain: (rangeId: string, mountainId: string, newName: string) => Promise<void>
  onUpdateMountainTag: (rangeId: string, mountainId: string, tag: string | null) => Promise<void>
  onDeleteMountain: (rangeId: string, mountainId: string) => Promise<void>
  onAddHill: (mountainId: string, name: string) => Promise<void>
  onUpdateHill: (mountainId: string, hillId: string, newName: string) => Promise<void>
  onUpdateHillTag: (mountainId: string, hillId: string, tag: string | null) => Promise<void>
  onDeleteHill: (mountainId: string, hillId: string) => Promise<void>
  onAddTerrain: (hillId: string, name: string) => Promise<void>
  onUpdateTerrain: (hillId: string, terrainId: string, newName: string) => Promise<void>
  onUpdateTerrainTag: (hillId: string, terrainId: string, tag: string | null) => Promise<void>
  onDeleteTerrain: (hillId: string, terrainId: string) => Promise<void>
  onAddLength: (terrainId: string, name: string) => Promise<void>
  onUpdateLength: (terrainId: string, lengthId: string, newName: string, completed: boolean) => Promise<void>
  onDeleteLength: (terrainId: string, lengthId: string) => Promise<void>
  onAddStep: (lengthId: string, label: string) => Promise<void>
  onUpdateStep: (lengthId: string, stepId: string, updatedStep: Partial<Step>) => Promise<void>
  onDeleteStep: (lengthId: string, stepId: string) => Promise<void>
  setVisionBoardData: React.Dispatch<React.SetStateAction<Range[]>>
  taskLists: TaskList[]
  lengths: Length[]
  onReorderMountains: (rangeId: string, reorderedMountains: Mountain[]) => Promise<void>
  onReorderRanges: (reorderedRanges: Range[]) => Promise<void>
}

const getParentIds = (
  data: Range[],
  itemId: string,
): {
  rangeId?: string
  mountainId?: string
  type?: string
} => {
  for (const range of data) {
    if (range.id === itemId) return { rangeId: range.id, type: "Range" }
    for (const mountain of range.mountains) {
      if (mountain.id === itemId) return { rangeId: range.id, mountainId: mountain.id, type: "Mountain" }
    }
  }
  return {}
}

export function VisionBoard({
  data,
  onAddRange,
  onUpdateRange,
  onUpdateRangeTag,
  onDeleteRange,
  onAddMountain,
  onUpdateMountain,
  onUpdateMountainTag,
  onDeleteMountain,
  onAddHill,
  onUpdateHill,
  onUpdateHillTag,
  onDeleteHill,
  onAddTerrain,
  onUpdateTerrain,
  onUpdateTerrainTag,
  onDeleteTerrain,
  onAddLength,
  onUpdateLength,
  onDeleteLength,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  setVisionBoardData,
  taskLists,
  lengths,
  onReorderMountains,
  onReorderRanges,
}: VisionBoardProps) {
  const { setRanges } = useVisionData()
  const [newRangeName, setNewRangeName] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: (args) => {
        const { currentCoordinates, containerNodeRect, collisionRect } = args
        if (containerNodeRect && collisionRect && containerNodeRect.width > containerNodeRect.height) {
          return {
            x: currentCoordinates.x,
            y: containerNodeRect.top + containerNodeRect.height / 2,
          }
        }
        return {
          x: currentCoordinates.x,
          y: currentCoordinates.y,
        }
      },
    }),
  )

  const handleDragStart = useCallback((event: { active: Active }) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id) return

      const activeItemParents = getParentIds(data, active.id as string)
      const overItemParents = getParentIds(data, over.id as string)

      // Reordering Ranges
      if (activeItemParents.type === "Range" && overItemParents.type === "Range") {
        const oldIndex = data.findIndex((range) => range.id === active.id)
        const newIndex = data.findIndex((range) => range.id === over.id)
        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(data, oldIndex, newIndex)
          setRanges(newOrder)
          await onReorderRanges(newOrder)
        }
      }

      // Moving Mountain between Ranges
      if (activeItemParents.type === "Mountain" && overItemParents.type === "Mountain") {
        if (activeItemParents.rangeId !== overItemParents.rangeId) {
          const movedMountainId = active.id as string
          const sourceRangeId = activeItemParents.rangeId as string
          const targetRangeId = overItemParents.rangeId as string

          setRanges((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData)) as Range[]
            const sourceRangeIndex = newData.findIndex((r) => r.id === sourceRangeId)
            const movedMountain = newData[sourceRangeIndex].mountains.find((m) => m.id === movedMountainId)

            if (!movedMountain) return prevData

            newData[sourceRangeIndex].mountains = newData[sourceRangeIndex].mountains.filter(
              (m) => m.id !== movedMountainId,
            )

            const targetRangeIndex = newData.findIndex((r) => r.id === targetRangeId)
            if (targetRangeIndex !== -1) {
              const overMountainIndex = newData[targetRangeIndex].mountains.findIndex((m) => m.id === over.id)
              if (overMountainIndex !== -1) {
                newData[targetRangeIndex].mountains.splice(overMountainIndex, 0, movedMountain)
              } else {
                newData[targetRangeIndex].mountains.push(movedMountain)
              }
            }

            return newData
          })
          await onReorderMountains(targetRangeId, data.find((r) => r.id === targetRangeId)?.mountains || [])
        }
      }

      // Moving Mountain to an empty Range
      if (activeItemParents.type === "Mountain" && overItemParents.type === "Range") {
        const movedMountainId = active.id as string
        const sourceRangeId = activeItemParents.rangeId as string
        const targetRangeId = over.id as string

        setRanges((prevData) => {
          const newData = JSON.parse(JSON.stringify(prevData)) as Range[]
          const sourceRangeIndex = newData.findIndex((r) => r.id === sourceRangeId)
          const movedMountain = newData[sourceRangeIndex].mountains.find((m) => m.id === movedMountainId)

          if (!movedMountain) return prevData

          newData[sourceRangeIndex].mountains = newData[sourceRangeIndex].mountains.filter(
            (m) => m.id !== movedMountainId,
          )

          const targetRangeIndex = newData.findIndex((r) => r.id === targetRangeId)
          if (targetRangeIndex !== -1) {
            newData[targetRangeIndex].mountains.push(movedMountain)
          }
          return newData
        })
        await onReorderMountains(targetRangeId, data.find((r) => r.id === targetRangeId)?.mountains || [])
      }
    },
    [data, setRanges, onReorderRanges, onReorderMountains],
  )

  const activeOverlayItem = useMemo(() => {
    if (!activeId) return null
    const itemDetails = getParentIds(data, activeId)
    if (itemDetails.type === "Range" && itemDetails.rangeId) {
      return data.find((r) => r.id === itemDetails.rangeId)
    }
    if (itemDetails.type === "Mountain" && itemDetails.rangeId && itemDetails.mountainId) {
      const range = data.find((r) => r.id === itemDetails.rangeId)
      return range?.mountains.find((m) => m.id === itemDetails.mountainId)
    }
    return null
  }, [data, activeId])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <div className="flex overflow-x-auto gap-4 p-4 min-h-[calc(100vh-120px)] items-start">
        <SortableContext items={data.map((r) => r.id)} strategy={horizontalListSortingStrategy}>
          {data.map((range) => (
            <RangeColumn
              key={range.id}
              range={range}
              onUpdateRange={onUpdateRange}
              onUpdateRangeTag={onUpdateRangeTag}
              onDeleteRange={onDeleteRange}
              onAddMountain={onAddMountain}
              onUpdateMountain={onUpdateMountain}
              onUpdateMountainTag={onUpdateMountainTag}
              onDeleteMountain={onDeleteMountain}
              onAddHill={onAddHill}
              onUpdateHill={onUpdateHill}
              onUpdateHillTag={onUpdateHillTag}
              onDeleteHill={onDeleteHill}
              onAddTerrain={onAddTerrain}
              onUpdateTerrain={onUpdateTerrain}
              onUpdateTerrainTag={onUpdateTerrainTag}
              onDeleteTerrain={onDeleteTerrain}
              onAddLength={onAddLength}
              onUpdateLength={onUpdateLength}
              onDeleteLength={onDeleteLength}
              onAddStep={onAddStep}
              onUpdateStep={onUpdateStep}
              onDeleteStep={onDeleteStep}
              setVisionBoardData={setVisionBoardData}
              taskLists={taskLists}
              lengths={lengths}
              onReorderMountains={onReorderMountains}
            />
          ))}
        </SortableContext>

        <Card className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-cream-25 h-fit">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xl font-bold">Add Range</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (newRangeName.trim()) {
                  await onAddRange(newRangeName)
                  setNewRangeName("")
                }
              }}
              className="flex gap-2"
            >
              <Input
                value={newRangeName}
                onChange={(e) => setNewRangeName(e.target.value)}
                placeholder="New Range Name"
                className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
              />
              <Button type="submit" size="sm">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {createPortal(
        <DragOverlay>
          {activeOverlayItem && activeOverlayItem.type === "Range" ? (
            <Card className="w-80 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl text-cream-25 opacity-80">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold">{activeOverlayItem.name}</CardTitle>
              </CardHeader>
            </Card>
          ) : activeOverlayItem && activeOverlayItem.type === "Mountain" ? (
            <Card className="w-80 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl text-cream-25 opacity-80">
              <CardContent className="p-4">
                <p className="font-semibold">{activeOverlayItem.name}</p>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}