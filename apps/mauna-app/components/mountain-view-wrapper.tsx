"use client"

import { useCallback, memo } from "react"
import { DatabaseService } from "@/lib/database-service"
import type { Mountain, Hill, Terrain, Length, Step } from "@/lib/types"
import { toast } from "sonner"
import { VisionBoard } from "@/components/vision-board"
import { useVisionData } from "@/lib/vision-data-provider"

interface MountainViewWrapperProps {
  databaseService: DatabaseService
}

export const MountainViewWrapper = memo(function MountainViewWrapper({ databaseService }: MountainViewWrapperProps) {
  console.log("[MountainViewWrapper] Rendering")
  const { ranges } = useVisionData()

  // Flatten mountains from all ranges for display as columns
  const mountains = ranges.flatMap((range) => range.mountains)

  return (
    <VisionBoard
      data={mountains}
      onAddRange={() => {}} // Placeholder: No ranges in Mountain View
      onUpdateRange={() => {}} // Placeholder
      onUpdateRangeTag={() => {}} // Placeholder
      onDeleteRange={() => {}} // Placeholder
      onAddMountain={() => {}} // Placeholder: Will implement mountain creation
      onUpdateMountain={() => {}} // Placeholder
      onUpdateMountainTag={() => {}} // Placeholder
      onDeleteMountain={() => {}} // Placeholder
      onAddHill={() => {}} // Placeholder: Will implement hill creation
      onUpdateHill={() => {}} // Placeholder
      onUpdateHillTag={() => {}} // Placeholder
      onDeleteHill={() => {}} // Placeholder
      onAddTerrain={() => {}} // Placeholder
      onUpdateTerrain={() => {}} // Placeholder
      onUpdateTerrainTag={() => {}} // Placeholder
      onDeleteTerrain={() => {}} // Placeholder
      onAddLength={() => {}} // Placeholder
      onUpdateLength={() => {}} // Placeholder
      onDeleteLength={() => {}} // Placeholder
      onAddStep={() => {}} // Placeholder
      onUpdateStep={() => {}} // Placeholder
      onDeleteStep={() => {}} // Placeholder
      setVisionBoardData={() => {}} // Placeholder
      taskLists={[]}
      lengths={[]}
      onReorderMountains={() => {}} // Placeholder
      onReorderRanges={() => {}} // Placeholder
    />
  )
})