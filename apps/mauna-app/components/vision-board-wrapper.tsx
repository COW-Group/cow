// components/vision-board-wrapper.tsx
"use client"

import { useCallback, memo } from "react"
import { DatabaseService } from "@/lib/database-service"
import type { Range, TaskList, Length, Step, Mountain, Hill, Terrain } from "@/lib/types"
import { toast } from "sonner"
import { VisionBoard } from "@/components/vision-board"
import { useVisionData } from "@/lib/vision-data-provider"

interface VisionBoardWrapperProps {
  databaseService: DatabaseService
}

export const VisionBoardWrapper = memo(function VisionBoardWrapper({ databaseService }: VisionBoardWrapperProps) {
  console.log("[VisionBoardWrapper] Rendering")
  const { ranges, taskLists, lengths, setRanges, refreshData } = useVisionData()

  const handleAddRange = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        toast.error("Column name cannot be empty.")
        return
      }
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newRange = await databaseService.createRange(userId, name)
        setRanges((prev) => [...prev, newRange])
        toast.success("Column added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add range (column):", err)
        toast.error("Failed to add column.")
      }
    },
    [databaseService],
  )

  const handleUpdateRange = useCallback(
    async (rangeId: string, newName: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedRange = await databaseService.updateRange(rangeId, userId, newName)
        setRanges((prev) =>
          prev.map((range) => (range.id === rangeId ? { ...range, name: updatedRange.name } : range)),
        )
        toast.success("Column updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update range (column):", err)
        toast.error("Failed to update column.")
      }
    },
    [databaseService],
  )

  const handleUpdateRangeTag = useCallback(
    async (rangeId: string, tag: string | null) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedRange = await databaseService.updateRangeTag(rangeId, userId, tag)
        setRanges((prev) =>
          prev.map((range) => (range.id === rangeId ? { ...range, tag: updatedRange.tag } : range)),
        )
        toast.success("Column tag updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update range tag:", err)
        toast.error("Failed to update column tag.")
      }
    },
    [databaseService],
  )

  const handleDeleteRange = useCallback(
    async (rangeId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteRange(rangeId, userId)
        setRanges((prev) => prev.filter((range) => range.id !== rangeId))
        toast.success("Column deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete range (column):", err)
        toast.error("Failed to delete column.")
      }
    },
    [databaseService],
  )

  const handleAddMountain = useCallback(
    async (rangeId: string, name: string) => {
      if (!name.trim()) {
        toast.error("Hill name cannot be empty.")
        return
      }
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newMountain = await databaseService.createMountain(userId, rangeId, name)
        setRanges((prev) =>
          prev.map((range) =>
            range.id === rangeId ? { ...range, mountains: [...range.mountains, newMountain] } : range,
          ),
        )
        toast.success("Hill added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add mountain (hill):", err)
        toast.error("Failed to add hill.")
      }
    },
    [databaseService],
  )

  const handleUpdateMountain = useCallback(
    async (rangeId: string, mountainId: string, newName: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedMountain = await databaseService.updateMountain(mountainId, userId, newName)
        setRanges((prev) =>
          prev.map((range) =>
            range.id === rangeId
              ? {
                  ...range,
                  mountains: range.mountains.map((mountain) =>
                    mountain.id === mountainId ? { ...mountain, name: updatedMountain.name } : mountain,
                  ),
                }
              : range,
          ),
        )
        toast.success("Hill updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update mountain (hill):", err)
        toast.error("Failed to update hill.")
      }
    },
    [databaseService],
  )

  const handleUpdateMountainTag = useCallback(
    async (rangeId: string, mountainId: string, tag: string | null) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedMountain = await databaseService.updateMountainTag(mountainId, userId, tag)
        setRanges((prev) =>
          prev.map((range) =>
            range.id === rangeId
              ? {
                  ...range,
                  mountains: range.mountains.map((mountain) =>
                    mountain.id === mountainId ? { ...mountain, tag: updatedMountain.tag } : mountain,
                  ),
                }
              : range,
          ),
        )
        toast.success("Hill tag updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update mountain tag:", err)
        toast.error("Failed to update hill tag.")
      }
    },
    [databaseService],
  )

  const handleDeleteMountain = useCallback(
    async (rangeId: string, mountainId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteMountain(mountainId, userId)
        setRanges((prev) =>
          prev.map((range) =>
            range.id === rangeId
              ? {
                  ...range,
                  mountains: range.mountains.filter((mountain) => mountain.id !== mountainId),
                }
              : range,
          ),
        )
        toast.success("Hill deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete mountain (hill):", err)
        toast.error("Failed to delete hill.")
      }
    },
    [databaseService],
  )

  const handleAddHill = useCallback(
    async (mountainId: string, name: string) => {
      if (!name.trim()) {
        toast.error("Terrain name cannot be empty.")
        return
      }
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newHill = await databaseService.createHill(userId, mountainId, name)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) =>
              mountain.id === mountainId ? { ...mountain, hills: [...mountain.hills, newHill] } : mountain,
            ),
          })),
        )
        toast.success("Terrain added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add hill (terrain):", err)
        toast.error("Failed to add terrain.")
      }
    },
    [databaseService],
  )

  const handleUpdateHill = useCallback(
    async (mountainId: string, hillId: string, newName: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedHill = await databaseService.updateHill(hillId, userId, newName)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) =>
              mountain.id === mountainId
                ? {
                    ...mountain,
                    hills: mountain.hills.map((hill) =>
                      hill.id === hillId ? { ...hill, name: updatedHill.name } : hill,
                    ),
                  }
                : mountain,
            ),
          })),
        )
        toast.success("Terrain updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update hill (terrain):", err)
        toast.error("Failed to update terrain.")
      }
    },
    [databaseService],
  )

  const handleUpdateHillTag = useCallback(
    async (mountainId: string, hillId: string, tag: string | null) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedHill = await databaseService.updateHillTag(hillId, userId, tag)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) =>
              mountain.id === mountainId
                ? {
                    ...mountain,
                    hills: mountain.hills.map((hill) =>
                      hill.id === hillId ? { ...hill, tag: updatedHill.tag } : hill,
                    ),
                  }
                : mountain,
            ),
          })),
        )
        toast.success("Terrain tag updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update hill tag:", err)
        toast.error("Failed to update terrain tag.")
      }
    },
    [databaseService],
  )

  const handleDeleteHill = useCallback(
    async (mountainId: string, hillId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteHill(hillId, userId)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) =>
              mountain.id === mountainId
                ? {
                    ...mountain,
                    hills: mountain.hills.filter((hill) => hill.id !== hillId),
                  }
                : mountain,
            ),
          })),
        )
        toast.success("Terrain deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete hill (terrain):", err)
        toast.error("Failed to delete terrain.")
      }
    },
    [databaseService],
  )

  const handleAddTerrain = useCallback(
    async (hillId: string, name: string) => {
      if (!name.trim()) {
        toast.error("Length name cannot be empty.")
        return
      }
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newTerrain = await databaseService.createTerrain(userId, hillId, name)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) =>
                hill.id === hillId ? { ...hill, terrains: [...hill.terrains, newTerrain] } : hill,
              ),
            })),
          })),
        )
        toast.success("Length added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add terrain (length):", err)
        toast.error("Failed to add length.")
      }
    },
    [databaseService],
  )

  const handleUpdateTerrain = useCallback(
    async (hillId: string, terrainId: string, newName: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedTerrain = await databaseService.updateTerrain(terrainId, userId, newName)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) =>
                hill.id === hillId
                  ? {
                      ...hill,
                      terrains: hill.terrains.map((terrain) =>
                        terrain.id === terrainId ? { ...terrain, name: updatedTerrain.name } : terrain,
                      ),
                    }
                  : hill,
              ),
            })),
          })),
        )
        toast.success("Length updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update terrain (length):", err)
        toast.error("Failed to update length.")
      }
    },
    [databaseService],
  )

  const handleUpdateTerrainTag = useCallback(
    async (hillId: string, terrainId: string, tag: string | null) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedTerrain = await databaseService.updateTerrainTag(terrainId, userId, tag)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) =>
                hill.id === hillId
                  ? {
                      ...hill,
                      terrains: hill.terrains.map((terrain) =>
                        terrain.id === terrainId ? { ...terrain, tag: updatedTerrain.tag } : terrain,
                      ),
                    }
                  : hill,
              ),
            })),
          })),
        )
        toast.success("Length tag updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update terrain tag:", err)
        toast.error("Failed to update length tag.")
      }
    },
    [databaseService],
  )

  const handleDeleteTerrain = useCallback(
    async (hillId: string, terrainId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteTerrain(terrainId, userId)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) =>
                hill.id === hillId
                  ? {
                      ...hill,
                      terrains: hill.terrains.filter((terrain) => terrain.id !== terrainId),
                    }
                  : hill,
              ),
            })),
          })),
        )
        toast.success("Length deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete terrain:", err)
        toast.error("Failed to delete length.")
      }
    },
    [databaseService],
  )

  const handleAddLength = useCallback(
    async (terrainId: string, name: string) => {
      if (!name.trim()) {
        toast.error("Step name cannot be empty.")
        return
      }
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newLength = await databaseService.createLength(userId, terrainId, name)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) => ({
                ...hill,
                terrains: hill.terrains.map((terrain) =>
                  terrain.id === terrainId ? { ...terrain, lengths: [...terrain.lengths, newLength] } : terrain,
                ),
              })),
            })),
          })),
        )
        toast.success("Step added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add length (step):", err)
        toast.error("Failed to add step.")
      }
    },
    [databaseService],
  )

  const handleUpdateLength = useCallback(
    async (terrainId: string, lengthId: string, newName: string, completed: boolean, tag?: string | null) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const updatedLength = await databaseService.updateLength(lengthId, userId, {
          name: newName,
          completed,
          tag,
        })
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) => ({
                ...hill,
                terrains: hill.terrains.map((terrain) =>
                  terrain.id === terrainId
                    ? {
                        ...terrain,
                        lengths: terrain.lengths.map((length) =>
                          length.id === lengthId
                            ? { ...length, name: updatedLength.name, completed: updatedLength.completed, tag: updatedLength.tag }
                            : length,
                        ),
                      }
                    : terrain,
                ),
              })),
            })),
          })),
        )
        toast.success("Step updated successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update length (step):", err)
        toast.error("Failed to update step.")
      }
    },
    [databaseService],
  )

  const handleDeleteLength = useCallback(
    async (terrainId: string, lengthId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteLength(lengthId, userId)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) => ({
                ...hill,
                terrains: hill.terrains.map((terrain) =>
                  terrain.id === terrainId
                    ? {
                        ...terrain,
                        lengths: terrain.lengths.filter((length) => length.id !== lengthId),
                      }
                    : terrain,
                ),
              })),
            })),
          })),
        )
        toast.success("Step deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete length:", err)
        toast.error("Failed to delete step.")
      }
    },
    [databaseService],
  )

  const handleAddStep = useCallback(
    async (lengthId: string, label: string) => {
      if (!label.trim()) {
        toast.error("Sub-step label cannot be empty.")
        return
      }
      try {
        let currentPosition = 0
        let found = false
        for (const range of ranges) {
          for (const mountain of range.mountains) {
            for (const hill of mountain.hills) {
              for (const terrain of hill.terrains) {
                const length = terrain.lengths.find((l) => l.id === lengthId)
                if (length) {
                  currentPosition = length.steps.length
                  found = true
                  break
                }
              }
              if (found) break
            }
            if (found) break
          }
          if (found) break
        }

        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const newStep = await databaseService.createStep(userId, label, currentPosition, { lengthId })
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) => ({
                ...hill,
                terrains: hill.terrains.map((terrain) => ({
                  ...terrain,
                  lengths: terrain.lengths.map((length) =>
                    length.id === lengthId ? { ...length, steps: [...length.steps, newStep] } : length,
                  ),
                })),
              })),
            })),
          })),
        )
        toast.success("Sub-step added successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to add step:", err)
        toast.error("Failed to add sub-step.")
      }
    },
    [databaseService, ranges],
  )

  const handleUpdateStep = useCallback(
    async (lengthId: string, stepId: string, updatedStep: Partial<Step>) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        const data = await databaseService.updateStep(stepId, userId, updatedStep)
        console.log("[handleUpdateStep] Supabase response:", { data, updatedStep })
        if (updatedStep.lengthId && updatedStep.lengthId !== lengthId) {
          await refreshData(true)
          toast.success("Sub-step moved successfully!")
        } else {
          setRanges((prev) =>
            prev.map((range) => ({
              ...range,
              mountains: range.mountains.map((mountain) => ({
                ...mountain,
                hills: mountain.hills.map((hill) => ({
                  ...hill,
                  terrains: hill.terrains.map((terrain) => ({
                    ...terrain,
                    lengths: terrain.lengths.map((length) =>
                      length.id === lengthId
                        ? {
                            ...length,
                            steps: length.steps.map((step) =>
                              step.id === stepId ? { ...step, ...data } : step,
                            ),
                          }
                        : length,
                    ),
                  })),
                })),
              })),
            })),
          )
          toast.success("Sub-step updated successfully!")
        }
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to update step:", err)
        toast.error("Failed to update sub-step.")
      }
    },
    [databaseService, refreshData],
  )

  const handleDeleteStep = useCallback(
    async (lengthId: string, stepId: string) => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        await databaseService.deleteStep(stepId, userId)
        setRanges((prev) =>
          prev.map((range) => ({
            ...range,
            mountains: range.mountains.map((mountain) => ({
              ...mountain,
              hills: mountain.hills.map((hill) => ({
                ...hill,
                terrains: hill.terrains.map((terrain) => ({
                  ...terrain,
                  lengths: terrain.lengths.map((length) =>
                    length.id === lengthId
                      ? {
                          ...length,
                          steps: length.steps.filter((step) => step.id !== stepId),
                        }
                      : length,
                  ),
                })),
              })),
            })),
          }))
        )
        toast.success("Sub-step deleted successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to delete step:", err)
        toast.error("Failed to delete sub-step.")
      }
    },
    [databaseService],
  )

  const handleReorderMountains = useCallback(
    async (rangeId: string, reorderedMountains: Mountain[]) => {
      try {
        setRanges((prev) =>
          prev.map((range) =>
            range.id === rangeId ? { ...range, mountains: reorderedMountains } : range,
          ),
        )
        await refreshData(true)
        toast.success("Mountains reordered successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to reorder mountains:", err)
        toast.error("Failed to reorder mountains.")
      }
    },
    [refreshData],
  )

  const handleReorderRanges = useCallback(
    async (reorderedRanges: Range[]) => {
      try {
        setRanges(reorderedRanges)
        await refreshData(true)
        toast.success("Columns reordered successfully!")
      } catch (err: any) {
        console.error("[VisionBoardWrapper] Failed to reorder ranges:", err)
        toast.error("Failed to reorder columns.")
      }
    },
    [refreshData],
  )

  return (
    <VisionBoard
      data={ranges}
      onAddRange={handleAddRange}
      onUpdateRange={handleUpdateRange}
      onUpdateRangeTag={handleUpdateRangeTag}
      onDeleteRange={handleDeleteRange}
      onAddMountain={handleAddMountain}
      onUpdateMountain={handleUpdateMountain}
      onUpdateMountainTag={handleUpdateMountainTag}
      onDeleteMountain={handleDeleteMountain}
      onAddHill={handleAddHill}
      onUpdateHill={handleUpdateHill}
      onUpdateHillTag={handleUpdateHillTag}
      onDeleteHill={handleDeleteHill}
      onAddTerrain={handleAddTerrain}
      onUpdateTerrain={handleUpdateTerrain}
      onUpdateTerrainTag={handleUpdateTerrainTag}
      onDeleteTerrain={handleDeleteTerrain}
      onAddLength={handleAddLength}
      onUpdateLength={handleUpdateLength}
      onDeleteLength={handleDeleteLength}
      onAddStep={handleAddStep}
      onUpdateStep={handleUpdateStep}
      onDeleteStep={handleDeleteStep}
      setVisionBoardData={setRanges}
      taskLists={taskLists}
      lengths={lengths}
      onReorderMountains={handleReorderMountains}
      onReorderRanges={handleReorderRanges}
    />
  )
})