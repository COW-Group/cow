"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GripVertical, ChevronUp, Save, ListOrdered } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Step, TaskList as TTaskList } from "@/lib/types"

interface GlobalTaskOrderDisplayProps {
  taskLists: TTaskList[]
  noTaskListSelectedId: string
  userId: string
  databaseService: DatabaseService | null
  updateTaskLists: (taskLists: TTaskList[]) => void
  onClose: () => void
}

interface SortableTaskItemProps {
  task: Step
  position: number
  taskListName: string
}

const ALL_ACTIVE_TASKS_ID = "all-active-tasks"

const SortableTaskItem = ({ task, position, taskListName }: SortableTaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityDisplay = task.priorityLetter ? `${task.priorityLetter}${task.priorityRank || ""}` : "None"

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-4 bg-white/20 border border-brushed-silver/20 rounded-lg hover:bg-white/30 transition-all duration-200 min-h-[80px]"
    >
      <span className="text-2xl font-bold text-sapphire-blue w-12 flex-shrink-0">{position}</span>
      <GripVertical {...listeners} {...attributes} className="h-6 w-6 text-cream-25/70 cursor-grab flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-base text-cream-25 break-words">{task.label}</span>
        <div className="flex gap-2 text-sm text-cream-25/70">
          <span>List: {taskListName}</span>
          <span>Priority: {priorityDisplay}</span>
        </div>
      </div>
    </div>
  )
}

export function GlobalTaskOrderDisplay({
  taskLists,
  noTaskListSelectedId,
  userId,
  databaseService,
  updateTaskLists,
  onClose,
}: GlobalTaskOrderDisplayProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Step[]>(() =>
    taskLists
      .filter((list) => list.id !== noTaskListSelectedId && list.name !== "✅ Completed Tasks")
      .flatMap((list) => list.steps)
      .filter((step) => !step.completed)
      .sort((a, b) => (a.positionWhenAllListsActive ?? 9999) - (b.positionWhenAllListsActive ?? 9999))
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        setTasks((prevTasks) => {
          const oldIndex = prevTasks.findIndex((task) => task.id === active.id)
          const newIndex = prevTasks.findIndex((task) => task.id === over?.id)

          if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = Array.from(prevTasks)
            const [movedTask] = reordered.splice(oldIndex, 1)
            reordered.splice(newIndex, 0, movedTask)
            return reordered.map((task, index) => ({
              ...task,
              positionWhenAllListsActive: index + 1,
            }))
          }
          return prevTasks
        })
      }
    },
    []
  )

  const handleSave = useCallback(async () => {
    if (!databaseService || !userId) {
      toast({
        title: "Error",
        description: "Cannot save task order: No database service or user ID.",
        variant: "destructive",
      })
      return
    }

    try {
      await databaseService.reorderStepsAllActive(userId, tasks)
      const updatedTaskLists = await databaseService.fetchTaskLists(userId)
      if (updatedTaskLists) {
        updateTaskLists(updatedTaskLists)
      }
      toast({
        title: "Task Order Saved",
        description: "Global task order has been updated.",
      })
    } catch (error: any) {
      console.error("Error saving global task order:", error)
      toast({
        title: "Error",
        description: `Failed to save task order: ${error.message}`,
        variant: "destructive",
      })
    }
  }, [databaseService, userId, tasks, updateTaskLists, toast])

  return (
    <Card className="w-full max-w-4xl bg-ink-950/20 border border-brushed-silver/20 text-cream-25 font-barlow">
      <CardHeader className="pb-4 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-2xl flex items-center gap-3 text-cream-25 flex-1 break-words">
          <ListOrdered className="h-7 w-7 text-sapphire-blue" />
          Global Task Order
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-cream-25/70 hover:text-cream-25 flex-shrink-0"
          aria-label="Close global task order display"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-lg text-cream-25/80 text-center py-6">No active tasks. Add tasks to your lists to reorder them here.</p>
        ) : (
          <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-3">
                  {tasks.map((task, index) => {
                    const taskListName = taskLists.find((list) => list.id === task.taskListId)?.name || "Unknown List"
                    return (
                      <SortableTaskItem
                        key={task.id}
                        task={task}
                        position={index + 1}
                        taskListName={taskListName}
                      />
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-sapphire-blue text-cream-25 hover:bg-sapphire-blue/80"
                aria-label="Save global task order"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Order
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}