// components/range-column.tsx
"use client"

import React, { useState, useCallback } from "react"
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
  DragOverlay,
  type Active,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Trash2Icon, EditIcon, CheckIcon, XIcon, GripVertical, ChevronDown, ChevronRight, EyeIcon, TrophyIcon, RepeatIcon, CogIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Range, Mountain, Hill, Terrain, Length, Step, TaskList } from "@/lib/types"
import { createPortal } from "react-dom"
import { SortableMountainCard } from "@/components/sortable-mountain-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ResetCard } from "@/components/ResetCard"

interface RangeColumnProps {
  range: Range
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
  onUpdateLength: (terrainId: string, lengthId: string, newName: string, completed: boolean, tag?: string | null) => Promise<void>
  onDeleteLength: (terrainId: string, lengthId: string) => Promise<void>
  onAddStep: (lengthId: string, label: string) => Promise<void>
  onUpdateStep: (lengthId: string, stepId: string, updatedStep: Partial<Step>) => Promise<void>
  onDeleteStep: (lengthId: string, stepId: string) => Promise<void>
  setVisionBoardData: React.Dispatch<React.SetStateAction<Range[]>>
  taskLists: TaskList[]
  lengths: Length[]
  onReorderMountains: (rangeId: string, reorderedMountains: Mountain[]) => Promise<void>
}

export function RangeColumn({
  range,
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
}: RangeColumnProps) {
  const [editingRangeId, setEditingRangeId] = useState<string | null>(null)
  const [editingRangeName, setEditingRangeName] = useState("")
  const [newMountainName, setNewMountainName] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)
  const [isResetExpanded, setIsResetExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: range.id,
    data: {
      type: "Range",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: (args) => {
        const { currentCoordinates, context } = args
        return {
          x: currentCoordinates.x,
          y: currentCoordinates.y + context.delta.y,
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

      if (active.data.current?.type === "Mountain" && over.data.current?.type === "Mountain") {
        const oldIndex = range.mountains.findIndex((m) => m.id === active.id)
        const newIndex = range.mountains.findIndex((m) => m.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedMountains = arrayMove(range.mountains, oldIndex, newIndex)
          setVisionBoardData((prevData) =>
            prevData.map((r) => (r.id === range.id ? { ...r, mountains: reorderedMountains } : r)),
          )
          await onReorderMountains(range.id, reorderedMountains)
        }
      }
    },
    [range.id, range.mountains, setVisionBoardData, onReorderMountains],
  )

  const activeMountain = React.useMemo(() => {
    if (!activeId) return null
    return range.mountains.find((mountain) => mountain.id === activeId)
  }, [activeId, range.mountains])

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex-shrink-0 w-[525px] bg-white/10 backdrop-blur-md border border-white/20 shadow-lg h-full max-h-[calc(100vh-160px)] overflow-y-auto"
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 sticky top-0 bg-deep-blue/80 backdrop-blur-md z-10 border-b border-white/20">
        {editingRangeId === range.id ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={editingRangeName}
              onChange={(e) => setEditingRangeName(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onUpdateRange(range.id, editingRangeName)
                setEditingRangeId(null)
              }}
            >
              <CheckIcon className="h-4 w-4 text-green-400" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingRangeId(null)}>
              <XIcon className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ) : (
          <CardTitle className="text-xl font-bold flex-1 flex items-center gap-2">
            <Button variant="ghost" size="sm" {...listeners} {...attributes} className="cursor-grab p-0 px-1">
              <GripVertical className="h-5 w-5 text-cream-25/70" />
            </Button>
            <span className="flex-1">
              {range.name}
              {range.tag && (
                <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                  {range.tag}
                </Badge>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cream-25/70 hover:bg-white/10"
              aria-label={isExpanded ? "Collapse mountains" : "Expand mountains"}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Select
              value={range.tag || "none"}
              onValueChange={(value) => onUpdateRangeTag(range.id, value === "none" ? null : value)}
            >
              <SelectTrigger className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-deep-blue text-cream-25">
                <SelectItem value="none"><XIcon className="h-4 w-4" /></SelectItem>
                <SelectItem value="vision"><EyeIcon className="h-4 w-4" /></SelectItem>
                <SelectItem value="milestone"><TrophyIcon className="h-4 w-4" /></SelectItem>
                <SelectItem value="habit"><RepeatIcon className="h-4 w-4" /></SelectItem>
                <SelectItem value="activity"><CogIcon className="h-4 w-4" /></SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingRangeId(range.id)
                setEditingRangeName(range.name)
              }}
            >
              <EditIcon className="h-4 w-4 text-vibrant-blue" />
            </Button>
          </CardTitle>
        )}
        <Button variant="ghost" size="sm" onClick={() => onDeleteRange(range.id)}>
          <Trash2Icon className="h-4 w-4 text-red-400" />
        </Button>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {isExpanded && (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
            >
              <SortableContext items={range.mountains.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                {range.mountains.map((mountain) => (
                  <SortableMountainCard
                    key={mountain.id}
                    mountain={mountain}
                    rangeId={range.id}
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
                    taskLists={taskLists}
                    lengths={lengths}
                  />
                ))}
              </SortableContext>

              {createPortal(
                <DragOverlay>
                  {activeId && activeMountain ? (
                    <Card className="w-[525px] bg-white/20 backdrop-blur-md border border-white/30 shadow-xl text-cream-25">
                      <CardContent className="p-4">
                        <p className="font-semibold">{activeMountain.name}</p>
                      </CardContent>
                    </Card>
                  ) : null}
                </DragOverlay>,
                document.body,
              )}
            </DndContext>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (newMountainName) {
                  await onAddMountain(range.id, newMountainName)
                  setNewMountainName("")
                }
              }}
              className="flex gap-2 mt-4"
            >
              <Input
                name="newMountainName"
                value={newMountainName}
                onChange={(e) => setNewMountainName(e.target.value)}
                placeholder="Add new mountain..."
                className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
              />
              <Button type="submit" size="sm">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-4">
              <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResetExpanded(!isResetExpanded)}
                    className="text-cream-25/70 hover:bg-white/10"
                  >
                    {isResetExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm font-semibold text-cream-25">Reset</span>
                </div>
              </div>
              {isResetExpanded && (
                <div className="ml-4 mt-2">
                  <ResetCard rangeId={range.id} />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}