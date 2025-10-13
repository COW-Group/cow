// components/sortable-mountain-card.tsx
"use client"

import React, { useState, useCallback, useContext, Fragment } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  PlusIcon,
  Trash2Icon,
  EditIcon,
  CheckIcon,
  XIcon,
  GripVertical,
  ChevronDown,
  ChevronRight,
  EyeIcon,
  TrophyIcon,
  RepeatIcon,
  CogIcon,
  CheckCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mountain, Hill, Terrain, Length, Step, TaskList } from "@/lib/types"
import { createPortal } from "react-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ResetContext } from "@/app/vision/page"
import { databaseService } from "@/lib/database-service"

interface SortableMountainCardProps {
  mountain: Mountain
  rangeId: string
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
  taskLists: TaskList[]
  lengths: Length[]
}

interface LengthItemProps {
  length: Length
  terrainId: string
  hillId: string
  mountainId: string
  rangeId: string
  onUpdateLength: (terrainId: string, lengthId: string, newName: string, completed: boolean, tag?: string | null) => Promise<void>
  onDeleteLength: (terrainId: string, lengthId: string) => Promise<void>
  onAddStep: (lengthId: string, label: string) => Promise<void>
  onUpdateStep: (lengthId: string, stepId: string, updatedStep: Partial<Step>) => Promise<void>
  onDeleteStep: (lengthId: string, stepId: string) => Promise<void>
  expandedItems: { [key: string]: boolean }
  toggleExpand: (id: string) => void
  editingStepId: string | null
  editingStep: Partial<Step> | null
  setEditingStepId: (id: string | null) => void
  setEditingStep: (step: Partial<Step> | null) => void
  saveStep: (lengthId: string, stepId: string) => Promise<void>
  taskLists: TaskList[]
}

const LengthItem: React.FC<LengthItemProps> = ({
  length,
  terrainId,
  hillId,
  mountainId,
  rangeId,
  onUpdateLength,
  onDeleteLength,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  expandedItems,
  toggleExpand,
  editingStepId,
  editingStep,
  setEditingStepId,
  setEditingStep,
  saveStep,
  taskLists,
}) => {
  const isExpanded = expandedItems[length.id] ?? true
  const [newStepName, setNewStepName] = useState("")
  const [editingLengthId, setEditingLengthId] = useState<string | null>(null)
  const [editingLengthName, setEditingLengthName] = useState("")
  const { markComplete } = useContext(ResetContext)

  const handleMarkComplete = async () => {
    try {
      await markComplete(rangeId, {
        id: length.id,
        name: length.name,
        type: "Length",
        parentMountainId: mountainId,
        parentHillId: hillId,
        parentTerrainId: terrainId,
        parentLengthId: null,
      })
      await onUpdateLength(terrainId, length.id, length.name, true, length.tag)
      toast.success("Length marked as complete!")
    } catch (err) {
      console.error("[LengthItem] Failed to mark length as complete:", err)
      toast.error("Failed to mark length as complete.")
    }
  }

  const startEditingStep = (step: Step, lengthId: string) => {
    setEditingStepId(step.id)
    setEditingStep({ ...step, lengthId })
  }

  const cancelEditingStep = () => {
    setEditingStepId(null)
    setEditingStep(null)
  }

  const renderStep = (step: Step, lengthId: string) => {
    const isEditing = editingStepId === step.id
    return (
      <div
        key={step.id}
        className={cn(
          "flex flex-col p-2 mb-2 bg-white/10 rounded-lg border border-white/20 transition-all duration-300",
          isEditing ? "min-h-[400px]" : "min-h-[60px]",
        )}
      >
        {isEditing && editingStep ? (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-cream-25">Edit Step</h5>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveStep(lengthId, step.id)}
                  disabled={!editingStep.label?.trim()}
                >
                  <CheckIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEditingStep}>
                  <XIcon className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor={`step-label-${step.id}`} className="text-cream-25">
                  Label
                </Label>
                <Input
                  id={`step-label-${step.id}`}
                  value={editingStep.label || ""}
                  onChange={(e) =>
                    setEditingStep((prev) => ({ ...prev, label: e.target.value }))
                  }
                  className="bg-white/20 border-white/30 text-cream-25"
                  placeholder="Step label"
                />
              </div>
              <div>
                <Label htmlFor={`step-tag-${step.id}`} className="text-cream-25">
                  Tag
                </Label>
                <Select
                  value={editingStep.tag || "none"}
                  onValueChange={(value) =>
                    setEditingStep((prev) => ({
                      ...prev,
                      tag: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger
                    id={`step-tag-${step.id}`}
                    className="bg-white/20 border-white/30 text-cream-25 w-10 h-8 p-1"
                  >
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
              </div>
              {taskLists?.length > 0 && (
                <div>
                  <Label htmlFor={`step-tasklist-${step.id}`} className="text-cream-25">
                    Task List
                  </Label>
                  <Select
                    value={editingStep.taskListId || "none"}
                    onValueChange={(value) =>
                      setEditingStep((prev) => ({
                        ...prev,
                        taskListId: value === "none" ? null : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id={`step-tasklist-${step.id}`}
                      className="bg-white/20 border-white/30 text-cream-25"
                    >
                      <SelectValue placeholder="Select task list" />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-blue text-cream-25">
                      <SelectItem value="none">None</SelectItem>
                      {taskLists.map((taskList) => (
                        <SelectItem key={taskList.id} value={taskList.id}>
                          {taskList.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor={`step-length-${step.id}`} className="text-cream-25">
                  Length
                </Label>
                <Select
                  value={editingStep.lengthId || "none"}
                  onValueChange={(value) =>
                    setEditingStep((prev) => ({
                      ...prev,
                      lengthId: value === "none" ? null : value,
                    }))
                  }
                >
                  <SelectTrigger
                    id={`step-length-${step.id}`}
                    className="bg-white/20 border-white/30 text-cream-25"
                  >
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-blue text-cream-25">
                    <SelectItem value="none">None</SelectItem>
                    {lengths.map((length) => (
                      <SelectItem key={length.id} value={length.id}>
                        {length.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`step-duration-${step.id}`} className="text-cream-25">
                  Duration (minutes)
                </Label>
                <Input
                  id={`step-duration-${step.id}`}
                  type="number"
                  value={editingStep.duration || 0}
                  onChange={(e) =>
                    setEditingStep((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="bg-white/20 border-white/30 text-cream-25"
                  placeholder="Duration"
                />
              </div>
              <div>
                <Label htmlFor={`step-lifeline-${step.id}`} className="text-cream-25">
                  Lifeline (Date & Time)
                </Label>
                <Input
                  id={`step-lifeline-${step.id}`}
                  type="datetime-local"
                  value={editingStep.lifeline || ""}
                  onChange={(e) =>
                    setEditingStep((prev) => ({
                      ...prev,
                      lifeline: e.target.value || null,
                    }))
                  }
                  className="bg-white/20 border-white/30 text-cream-25"
                  placeholder="Select date and time"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(step.id)}
                className="text-cream-25/70 hover:bg-white/10"
              >
                {expandedItems[step.id] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <span className="text-sm text-cream-25 flex-1">
                {step.label}{step.lifeline ? ` (Due: ${new Date(step.lifeline).toLocaleString()})` : ""}
                {step.tag && (
                  <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                    {step.tag}
                  </Badge>
                )}
              </span>
            </div>
            <div className="flex gap-2">
              <Select
                value={step.tag || "none"}
                onValueChange={(value) =>
                  onUpdateStep(lengthId, step.id, { ...step, tag: value === "none" ? null : value })
                }
              >
                <SelectTrigger
                  className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20"
                >
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
                onClick={async () => {
                  try {
                    await markComplete(rangeId, {
                      id: step.id,
                      name: step.label,
                      type: "Step",
                      parentMountainId: mountainId,
                      parentHillId: hillId,
                      parentTerrainId: terrainId,
                      parentLengthId: length.id,
                    })
                    await onUpdateStep(lengthId, step.id, { ...step, completed: true })
                    toast.success("Step marked as complete!")
                  } catch (err) {
                    console.error("[StepItem] Failed to mark step as complete:", err)
                    toast.error("Failed to mark step as complete.")
                  }
                }}
                disabled={step.completed}
              >
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditingStep(step, length.id)}
              >
                <EditIcon className="h-4 w-4 text-vibrant-blue" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteStep(length.id, step.id)}
              >
                <Trash2Icon className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div key={length.id} className="mb-2">
      <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/20">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(length.id)}
            className="text-cream-25/70 hover:bg-white/10"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-cream-25 flex-1">
            {editingLengthId === length.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editingLengthName}
                  onChange={(e) => setEditingLengthName(e.target.value)}
                  className="bg-white/20 border-white/30 text-cream-25"
                  placeholder="Length name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onUpdateLength(terrainId, length.id, editingLengthName, length.completed, length.tag)
                    setEditingLengthId(null)
                  }}
                  disabled={!editingLengthName.trim()}
                >
                  <CheckIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingLengthId(null)}
                >
                  <XIcon className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ) : (
              <>
                {length.name}
                {length.tag && (
                  <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                    {length.tag}
                  </Badge>
                )}
              </>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          {editingLengthId !== length.id && (
            <>
              <Select
                value={length.tag || "none"}
                onValueChange={(value) =>
                  onUpdateLength(
                    terrainId,
                    length.id,
                    length.name,
                    length.completed,
                    value === "none" ? null : value,
                  )
                }
              >
                <SelectTrigger
                  className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20"
                >
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
                onClick={handleMarkComplete}
                disabled={length.completed}
              >
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingLengthId(length.id)
                  setEditingLengthName(length.name)
                }}
              >
                <EditIcon className="h-4 w-4 text-vibrant-blue" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteLength(terrainId, length.id)}
          >
            <Trash2Icon className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {length.steps.filter(step => !step.completed).map((step) => renderStep(step, length.id))}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (newStepName) {
                await onAddStep(length.id, newStepName)
                setNewStepName("")
              }
            }}
            className="flex gap-2 mt-2"
          >
            <Input
              name="newStepName"
              value={newStepName}
              onChange={(e) => setNewStepName(e.target.value)}
              placeholder="Add new step..."
              className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
            />
            <Button type="submit" size="sm">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

interface TerrainItemProps {
  terrain: Terrain
  hillId: string
  mountainId: string
  rangeId: string
  onUpdateTerrain: (hillId: string, terrainId: string, newName: string) => Promise<void>
  onUpdateTerrainTag: (hillId: string, terrainId: string, tag: string | null) => Promise<void>
  onAddLength: (terrainId: string, name: string) => Promise<void>
  onDeleteTerrain: (hillId: string, terrainId: string) => Promise<void>
  onDeleteLength: (terrainId: string, lengthId: string) => Promise<void>
  onAddStep: (lengthId: string, label: string) => Promise<void>
  onUpdateLength: (terrainId: string, lengthId: string, newName: string, completed: boolean, tag?: string | null) => Promise<void>
  onUpdateStep: (lengthId: string, stepId: string, updatedStep: Partial<Step>) => Promise<void>
  onDeleteStep: (lengthId: string, stepId: string) => Promise<void>
  expandedItems: { [key: string]: boolean }
  toggleExpand: (id: string) => void
  editingStepId: string | null
  editingStep: Partial<Step> | null
  setEditingStepId: (id: string | null) => void
  setEditingStep: (step: Partial<Step> | null) => void
  saveStep: (lengthId: string, stepId: string) => Promise<void>
  taskLists: TaskList[]
}

const TerrainItem: React.FC<TerrainItemProps> = ({
  terrain,
  hillId,
  mountainId,
  rangeId,
  onUpdateTerrain,
  onUpdateTerrainTag,
  onAddLength,
  onDeleteTerrain,
  onDeleteLength,
  onAddStep,
  onUpdateLength,
  onUpdateStep,
  onDeleteStep,
  expandedItems,
  toggleExpand,
  editingStepId,
  editingStep,
  setEditingStepId,
  setEditingStep,
  saveStep,
  taskLists,
}) => {
  const isExpanded = expandedItems[terrain.id] ?? true
  const [newLengthName, setNewLengthName] = useState("")
  const [editingTerrainId, setEditingTerrainId] = useState<string | null>(null)
  const [editingTerrainName, setEditingTerrainName] = useState("")
  const { markComplete } = useContext(ResetContext)

  const handleMarkComplete = async () => {
    try {
      // First, mark as completed in database
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
      if (!userId) throw new Error("User not authenticated")

      await databaseService.supabase
        .from("terrains")
        .update({ completed: true, updated_at: new Date().toISOString() })
        .eq("id", terrain.id)
        .eq("user_id", userId)

      // Then archive it
      await markComplete(rangeId, {
        id: terrain.id,
        name: terrain.name,
        type: "Terrain",
        parentMountainId: mountainId,
        parentHillId: hillId,
        parentTerrainId: null,
        parentLengthId: null,
      })

      await onUpdateTerrain(hillId, terrain.id, terrain.name)
      toast.success("Terrain marked as complete!")
    } catch (err) {
      console.error("[TerrainItem] Failed to mark terrain as complete:", err)
      toast.error("Failed to mark terrain as complete.")
    }
  }

  return (
    <div key={terrain.id} className="mb-2">
      <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/20">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(terrain.id)}
            className="text-cream-25/70 hover:bg-white/10"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-cream-25 flex-1">
            {editingTerrainId === terrain.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editingTerrainName}
                  onChange={(e) => setEditingTerrainName(e.target.value)}
                  className="bg-white/20 border-white/30 text-cream-25"
                  placeholder="Terrain name"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onUpdateTerrain(hillId, terrain.id, editingTerrainName)
                    setEditingTerrainId(null)
                  }}
                  disabled={!editingTerrainName.trim()}
                >
                  <CheckIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTerrainId(null)}
                >
                  <XIcon className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ) : (
              <>
                {terrain.name}
                {terrain.tag && (
                  <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                    {terrain.tag}
                  </Badge>
                )}
              </>
            )}
          </span>
        </div>
        <div className="flex gap-2">
          {editingTerrainId !== terrain.id && (
            <>
              <Select
                value={terrain.tag || "none"}
                onValueChange={(value) =>
                  onUpdateTerrainTag(hillId, terrain.id, value === "none" ? null : value)
                }
              >
                <SelectTrigger
                  className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20"
                >
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
                onClick={handleMarkComplete}
                disabled={terrain.completed}
              >
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTerrainId(terrain.id)
                  setEditingTerrainName(terrain.name)
                }}
              >
                <EditIcon className="h-4 w-4 text-vibrant-blue" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteTerrain(hillId, terrain.id)}
          >
            <Trash2Icon className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2">
          {terrain.lengths.filter(length => !length.completed).map((length) => (
            <LengthItem
              key={length.id}
              length={length}
              terrainId={terrain.id}
              hillId={hillId}
              mountainId={mountainId}
              rangeId={rangeId}
              onUpdateLength={onUpdateLength}
              onDeleteLength={onDeleteLength}
              onAddStep={onAddStep}
              onUpdateStep={onUpdateStep}
              onDeleteStep={onDeleteStep}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              editingStepId={editingStepId}
              editingStep={editingStep}
              setEditingStepId={setEditingStepId}
              setEditingStep={setEditingStep}
              saveStep={saveStep}
              taskLists={taskLists}
            />
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (newLengthName) {
                await onAddLength(terrain.id, newLengthName)
                setNewLengthName("")
              }
            }}
            className="flex gap-2 mt-2"
          >
            <Input
              name="newLengthName"
              value={newLengthName}
              onChange={(e) => setNewLengthName(e.target.value)}
              placeholder="Add new length..."
              className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
            />
            <Button type="submit" size="sm">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export function SortableMountainCard({
  mountain,
  rangeId,
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
  taskLists,
  lengths,
}: SortableMountainCardProps) {
  console.log("[SortableMountainCard] Props:", {
    mountainId: mountain.id,
    rangeId,
    onUpdateStepExists: !!onUpdateStep,
  })
  const [editingMountainId, setEditingMountainId] = useState<string | null>(null)
  const [editingMountainName, setEditingMountainName] = useState("")
  const [newHillName, setNewHillName] = useState("")
  const [newTerrainName, setNewTerrainName] = useState("")
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({
    [mountain.id]: true,
  })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<Partial<Step> | null>(null)
  const [editingHillId, setEditingHillId] = useState<string | null>(null)
  const [editingHillName, setEditingHillName] = useState("")
  const { markComplete } = useContext(ResetContext)

  const handleMarkMountainComplete = async () => {
    try {
      // First, mark as completed in database
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
      if (!userId) throw new Error("User not authenticated")

      await databaseService.supabase
        .from("mountains")
        .update({ completed: true, updated_at: new Date().toISOString() })
        .eq("id", mountain.id)
        .eq("user_id", userId)

      // Then archive it
      await markComplete(rangeId, {
        id: mountain.id,
        name: mountain.name,
        type: "Mountain",
        parentMountainId: null,
        parentHillId: null,
        parentTerrainId: null,
        parentLengthId: null,
      })

      await onUpdateMountain(rangeId, mountain.id, mountain.name)
      toast.success("Mountain marked as complete!")
    } catch (err) {
      console.error("[SortableMountainCard] Failed to mark mountain as complete:", err)
      toast.error("Failed to mark mountain as complete.")
    }
  }

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: mountain.id,
    data: {
      type: "Mountain",
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

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id] ?? true,
    }))
  }

  const handleDragStart = useCallback((event: { active: Active }) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (!over || active.id === over.id) return

      const parentLevel = active.data.current?.parentLevel
      const parentId = active.data.current?.parentId

      if (parentLevel && parentId && active.data.current?.type === over.data.current?.type) {
        let newOrder: any[] = []
        let updateCallback: any

        if (parentLevel === "Mountain") {
          const oldIndex = mountain.hills.findIndex((h) => h.id === active.id)
          const newIndex = mountain.hills.findIndex((h) => h.id === over.id)
          if (oldIndex !== -1 && newIndex !== -1) {
            newOrder = arrayMove(mountain.hills, oldIndex, newIndex)
            updateCallback = onUpdateHill
          }
        } else if (parentLevel === "Hill") {
          const hill = mountain.hills.find((h) => h.id === parentId)
          if (hill) {
            const oldIndex = hill.terrains.findIndex((t) => t.id === active.id)
            const newIndex = hill.terrains.findIndex((t) => t.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
              newOrder = arrayMove(hill.terrains, oldIndex, newIndex)
              updateCallback = onUpdateTerrain
            }
          }
        } else if (parentLevel === "Terrain") {
          const hill = mountain.hills.find((h) => h.terrains.find((t) => t.id === parentId))
          const terrain = hill?.terrains.find((t) => t.id === parentId)
          if (terrain) {
            const oldIndex = terrain.lengths.findIndex((l) => l.id === active.id)
            const newIndex = terrain.lengths.findIndex((l) => l.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
              newOrder = arrayMove(terrain.lengths, oldIndex, newIndex)
              updateCallback = onUpdateLength
            }
          }
        } else if (parentLevel === "Length") {
          const hill = mountain.hills.find((h) =>
            h.terrains.find((t) => t.lengths.find((l) => l.id === parentId)),
          )
          const terrain = hill?.terrains.find((t) => t.lengths.find((l) => l.id === parentId))
          const length = terrain?.lengths.find((l) => l.id === parentId)
          if (length) {
            const oldIndex = length.steps.findIndex((s) => s.id === active.id)
            const newIndex = length.steps.findIndex((s) => s.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
              newOrder = arrayMove(length.steps, oldIndex, newIndex)
              updateCallback = onUpdateStep
            }
          }
        }

        if (newOrder.length > 0 && updateCallback) {
          // Update local state or call update callback
        }
      }
    },
    [mountain.hills, onUpdateHill, onUpdateTerrain, onUpdateLength, onUpdateStep],
  )

  const saveStep = async (lengthId: string, stepId: string) => {
    if (editingStep) {
      try {
        await onUpdateStep(lengthId, stepId, {
          label: editingStep.label,
          taskListId: editingStep.taskListId === "none" ? null : editingStep.taskListId || null,
          lengthId: editingStep.lengthId === "none" ? null : editingStep.lengthId || null,
          duration: editingStep.duration || 0,
          completed: editingStep.completed || false,
          locked: editingStep.locked || false,
          color: editingStep.color || "",
          icon: editingStep.icon || "",
          priorityLetter: editingStep.priorityLetter || "None",
          priorityRank: editingStep.priorityRank || 0,
          mantra: editingStep.mantra || "",
          startingRitual: editingStep.startingRitual || "",
          endingRitual: editingStep.endingRitual || "",
          audioUrl: editingStep.audioUrl || null,
          audioType: editingStep.audioType || null,
          timezone: editingStep.timezone || null,
          lifeline: editingStep.lifeline || null,
          tag: editingStep.tag || null,
        })
        setEditingStepId(null)
        setEditingStep(null)
      } catch (err) {
        console.error("Failed to update step:", err)
        toast.error("Failed to update step.")
      }
    }
  }

  const renderHill = (hill: Hill) => {
    const isExpanded = expandedItems[hill.id] ?? true
    const handleMarkComplete = async () => {
      try {
        // First, mark as completed in database
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        if (!userId) throw new Error("User not authenticated")

        await databaseService.supabase
          .from("hills")
          .update({ completed: true, updated_at: new Date().toISOString() })
          .eq("id", hill.id)
          .eq("user_id", userId)

        // Then archive it
        await markComplete(rangeId, {
          id: hill.id,
          name: hill.name,
          type: "Hill",
          parentMountainId: mountain.id,
          parentHillId: null,
          parentTerrainId: null,
          parentLengthId: null,
        })

        await onUpdateHill(mountain.id, hill.id, hill.name)
        toast.success("Hill marked as complete!")
      } catch (err) {
        console.error("[HillItem] Failed to mark hill as complete:", err)
        toast.error("Failed to mark hill as complete.")
      }
    }

    return (
      <div key={hill.id} className="mb-2">
        <div className="flex items-center justify-between p-2 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(hill.id)}
              className="text-cream-25/70 hover:bg-white/10"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-cream-25 flex-1">
              {editingHillId === hill.id ? (
                <div className="flex gap-2 items-center">
                  <Input
                    value={editingHillName}
                    onChange={(e) => setEditingHillName(e.target.value)}
                    className="bg-white/20 border-white/30 text-cream-25"
                    placeholder="Hill name"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onUpdateHill(mountain.id, hill.id, editingHillName)
                      setEditingHillId(null)
                    }}
                    disabled={!editingHillName.trim()}
                  >
                    <CheckIcon className="h-4 w-4 text-green-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingHillId(null)}
                  >
                    <XIcon className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              ) : (
                <>
                  {hill.name}
                  {hill.tag && (
                    <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                      {hill.tag}
                    </Badge>
                  )}
                </>
              )}
            </span>
          </div>
          <div className="flex gap-2">
            {editingHillId !== hill.id && (
              <>
                <Select
                  value={hill.tag || "none"}
                  onValueChange={(value) =>
                    onUpdateHillTag(mountain.id, hill.id, value === "none" ? null : value)
                  }
                >
                  <SelectTrigger
                    className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20"
                  >
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
                  onClick={handleMarkComplete}
                  disabled={hill.completed}
                >
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingHillId(hill.id)
                    setEditingHillName(hill.name)
                  }}
                >
                  <EditIcon className="h-4 w-4 text-vibrant-blue" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteHill(mountain.id, hill.id)}
            >
              <Trash2Icon className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="ml-4 mt-2">
            {hill.terrains.filter(terrain => !terrain.completed).map((terrain) => (
              <TerrainItem
                key={terrain.id}
                terrain={terrain}
                hillId={hill.id}
                mountainId={mountain.id}
                rangeId={rangeId}
                onUpdateTerrain={onUpdateTerrain}
                onUpdateTerrainTag={onUpdateTerrainTag}
                onAddLength={onAddLength}
                onDeleteTerrain={onDeleteTerrain}
                onDeleteLength={onDeleteLength}
                onAddStep={onAddStep}
                onUpdateLength={onUpdateLength}
                onUpdateStep={onUpdateStep}
                onDeleteStep={onDeleteStep}
                expandedItems={expandedItems}
                toggleExpand={toggleExpand}
                editingStepId={editingStepId}
                editingStep={editingStep}
                setEditingStepId={setEditingStepId}
                setEditingStep={setEditingStep}
                saveStep={saveStep}
                taskLists={taskLists}
              />
            ))}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (newTerrainName) {
                  await onAddTerrain(hill.id, newTerrainName)
                  setNewTerrainName("")
                }
              }}
              className="flex gap-2 mt-2"
            >
              <Input
                name="newTerrainName"
                value={newTerrainName}
                onChange={(e) => setNewTerrainName(e.target.value)}
                placeholder="Add new terrain..."
                className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
              />
              <Button type="submit" size="sm">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    )
  }

  const activeItem = React.useMemo(() => {
    if (!activeId) return null
    if (mountain.hills.find((h) => h.id === activeId)) {
      return mountain.hills.find((h) => h.id === activeId)
    }
    for (const hill of mountain.hills) {
      if (hill.terrains.find((t) => t.id === activeId)) {
        return hill.terrains.find((t) => t.id === activeId)
      }
      for (const terrain of hill.terrains) {
        if (terrain.lengths.find((l) => l.id === activeId)) {
          return terrain.lengths.find((l) => l.id === activeId)
        }
        for (const length of terrain.lengths) {
          if (length.steps.find((s) => s.id === activeId)) {
            return length.steps.find((s) => s.id === activeId)
          }
        }
      }
    }
    return null
  }, [activeId, mountain.hills])

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="w-[500px] mb-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
    >
      <CardContent className="p-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
        >
          <div className="flex items-center justify-between mb-2">
            {editingMountainId === mountain.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={editingMountainName}
                  onChange={(e) => setEditingMountainName(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-cream-25"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onUpdateMountain(rangeId, mountain.id, editingMountainName)
                    setEditingMountainId(null)
                  }}
                >
                  <CheckIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingMountainId(null)}
                >
                  <XIcon className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  {...listeners}
                  {...attributes}
                  className="cursor-grab p-0 px-1"
                >
                  <GripVertical className="h-5 w-5 text-cream-25/70" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(mountain.id)}
                  className="text-cream-25/70 hover:bg-white/10"
                >
                  {expandedItems[mountain.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <span className="text-sm font-semibold text-cream-25 flex-1">
                  {mountain.name}
                  {mountain.tag && (
                    <Badge variant="secondary" className="ml-2 bg-vibrant-blue/20 text-cream-25">
                      {mountain.tag}
                    </Badge>
                  )}
                </span>
                <Select
                  value={mountain.tag || "none"}
                  onValueChange={(value) =>
                    onUpdateMountainTag(rangeId, mountain.id, value === "none" ? null : value)
                  }
                >
                  <SelectTrigger
                    className="bg-transparent border-none text-cream-25 w-10 h-8 p-1 hover:bg-white/10 focus:border-white/30 focus:bg-white/20"
                  >
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
                  onClick={handleMarkMountainComplete}
                  disabled={mountain.completed}
                >
                  <CheckCircleIcon className="h-4 w-4 text-green-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingMountainId(mountain.id)
                    setEditingMountainName(mountain.name)
                  }}
                >
                  <EditIcon className="h-4 w-4 text-vibrant-blue" />
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteMountain(rangeId, mountain.id)}
            >
              <Trash2Icon className="h-4 w-4 text-red-400" />
            </Button>
          </div>

          {expandedItems[mountain.id] && (
            <SortableContext items={mountain.hills.filter(h => !h.completed).map((h) => h.id)} strategy={verticalListSortingStrategy}>
              {mountain.hills.filter(hill => !hill.completed).map((hill) => renderHill(hill))}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (newHillName) {
                    await onAddHill(mountain.id, newHillName)
                    setNewHillName("")
                  }
                }}
                className="flex gap-2 mt-4"
              >
                <Input
                  value={newHillName}
                  onChange={(e) => setNewHillName(e.target.value)}
                  placeholder="Add new hill..."
                  className="flex-1 bg-white/20 border-white/30 text-cream-25 placeholder:text-cream-25/70"
                />
                <Button type="submit" size="sm">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </form>
            </SortableContext>
          )}

          {createPortal(
            <DragOverlay>
              {activeId && activeItem ? (
                <Card className="w-[500px] bg-white/20 backdrop-blur-md border border-white/30 shadow-xl text-cream-25">
                  <CardContent className="p-4">
                    <p className="font-semibold">
                      {(activeItem as Hill | Terrain | Length | Step).name || (activeItem as Step).label}
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </CardContent>
    </Card>
  )
}