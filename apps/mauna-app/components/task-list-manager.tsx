"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Check, GripVertical, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { TaskList } from "@/lib/types"
import { DatabaseService } from "@/lib/database-service"

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
import { arrayMove } from "@dnd-kit/sortable"

interface TaskListManagerProps {
  isOpen: boolean
  onClose: () => void
  taskLists: TaskList[]
  currentListId: string
  updateTaskLists: (lists: TaskList[]) => void
  switchTaskList: (listId: string) => void
  userId: string
  noTaskListSelectedId: string
}

interface SortableTaskListCardProps {
  list: TaskList
  isCurrent: boolean
  isEditing: boolean
  editingListName: string
  editingSuggestedTimeBlockRange: string
  onEdit: (list: TaskList) => void
  onSaveEdit: () => void
  onDelete: (listId: string) => void
  onSwitch: (listId: string) => void
  onListNameChange: (name: string) => void
  onSuggestedTimeBlockRangeChange: (range: string) => void
  noTaskListSelectedId: string
}

function SortableTaskListCard({
  list,
  isCurrent,
  isEditing,
  editingListName,
  editingSuggestedTimeBlockRange,
  onEdit,
  onSaveEdit,
  onDelete,
  onSwitch,
  onListNameChange,
  onSuggestedTimeBlockRangeChange,
  noTaskListSelectedId,
}: SortableTaskListCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: list.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
  }

  const isNoTaskListSelected = list.id === noTaskListSelectedId

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-2 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${isCurrent ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        {!isNoTaskListSelected && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab text-cream-25/70 hover:text-cream-25 mr-2"
            {...listeners}
            {...attributes}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        )}
        {isEditing && !isNoTaskListSelected ? (
          <div className="flex flex-col flex-grow mr-2 gap-2">
            <Input
              value={editingListName}
              onChange={(e) => onListNameChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
              className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
              aria-label="Edit list name"
            />
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-cream-25/70" />
              <Input
                value={editingSuggestedTimeBlockRange}
                onChange={(e) => onSuggestedTimeBlockRangeChange(e.target.value)}
                onBlur={onSaveEdit}
                onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
                placeholder="Suggested Time Block Range"
                className="flex-grow bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
                aria-label="Edit suggested time block range"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center">
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">{list.name}</CardTitle>
              {!isNoTaskListSelected && (
                <span className="text-sm text-cream-25/70 zen-ui">({list.steps.length} tasks)</span>
              )}
            </div>
            {list.suggestedTimeBlockRange && (
              <div className="flex items-center gap-2 text-sm text-cream-25/70 zen-ui mt-1">
                <Square className="h-4 w-4" />
                <span>{list.suggestedTimeBlockRange}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-end">
            {isEditing && !isNoTaskListSelected ? (
              <Button variant="ghost" size="icon" onClick={onSaveEdit} aria-label="Save changes">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            ) : (
              !isNoTaskListSelected && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(list)}
                  aria-label="Edit list"
                  className="text-cream-25/70 hover:text-cream-25"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )
            )}
            {!isNoTaskListSelected && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(list.id)}
                aria-label="Delete list"
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitch(list.id)}
            disabled={isCurrent}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
          >
            {isCurrent ? "Current" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TaskListManager({
  isOpen,
  onClose,
  taskLists,
  currentListId,
  updateTaskLists,
  switchTaskList,
  userId,
  noTaskListSelectedId,
}: TaskListManagerProps) {
  const [localTaskLists, setLocalTaskLists] = useState<TaskList[]>(taskLists || [])
  const [newListName, setNewListName] = useState("")
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListName, setEditingListName] = useState("")
  const [editingSuggestedTimeBlockRange, setEditingSuggestedTimeBlockRange] = useState("")
  const { toast } = useToast()

  const ALL_ACTIVE_TASKS_ID = "all-active-tasks"

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    console.log("TaskListManager useEffect: taskLists prop changed", taskLists)
    const actualTaskLists = taskLists.filter((list) => list.id !== noTaskListSelectedId)
    setLocalTaskLists(actualTaskLists.sort((a, b) => (a.position ?? 0) - (b.position ?? 0)))
  }, [taskLists, noTaskListSelectedId])

  const handleCreateList = async () => {
    console.log("handleCreateList: Function called.")
    if (!newListName.trim()) {
      console.log("handleCreateList: New list name is empty.")
      toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" })
      return
    }

    console.log("handleCreateList: Attempting to create list with name:", newListName.trim())
    try {
      const newPosition = localTaskLists.length + 1
      const newList = await DatabaseService.createTaskList(userId, newListName.trim(), newPosition)
      console.log("handleCreateList: List created successfully:", newList)
      const updatedLists = [...localTaskLists, newList].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      setLocalTaskLists(updatedLists)
      updateTaskLists(updatedLists)
      setNewListName("")
      toast({ title: "List Created ✨", description: `Task list "${newList.name}" created.` })
    } catch (error: any) {
      console.error("handleCreateList: Failed to create list:", error)
      toast({ title: "Error", description: `Failed to create list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleEditList = (list: TaskList) => {
    setEditingListId(list.id)
    setEditingListName(list.name)
    setEditingSuggestedTimeBlockRange(list.suggestedTimeBlockRange || "")
  }

  const handleSaveEdit = async () => {
    if (!editingListName.trim() || !editingListId) {
      toast({ title: "Error", description: "List name cannot be empty.", variant: "destructive" })
      return
    }
    if (editingListId === noTaskListSelectedId) {
      toast({ title: "Error", description: "Cannot edit 'No Task List Selected'.", variant: "destructive" })
      setEditingListId(null)
      return
    }

    try {
      const updatedList = await DatabaseService.updateTaskList(editingListId, userId, {
        name: editingListName.trim(),
        suggestedTimeBlockRange: editingSuggestedTimeBlockRange.trim() || null,
      })
      const updatedLists = localTaskLists.map((list) =>
        list.id === editingListId
          ? { ...list, name: updatedList.name, suggestedTimeBlockRange: updatedList.suggestedTimeBlockRange }
          : list,
      )
      setLocalTaskLists(updatedLists)
      updateTaskLists(updatedLists)
      setEditingListId(null)
      setEditingListName("")
      setEditingSuggestedTimeBlockRange("")
      toast({ title: "List Updated ✨", description: "Task list updated." })
    } catch (error: any) {
      console.error("handleSaveEdit: Failed to update list:", error)
      toast({ title: "Error", description: `Failed to update list: ${error.message}`, variant: "destructive" })
    }
  }

  const handleDeleteList = async (listId: string) => {
    if (listId === noTaskListSelectedId) {
      toast({ title: "Error", description: "Cannot delete 'No Task List Selected'.", variant: "destructive" })
      return
    }
    if (window.confirm("Are you sure you want to delete this task list and all its tasks?")) {
      try {
        await DatabaseService.deleteTaskList(listId, userId)
        const updatedLists = localTaskLists.filter((list) => list.id !== listId)
        const reorderedForDeletion = updatedLists.map((list, index) => ({ ...list, position: index + 1 }))

        setLocalTaskLists(reorderedForDeletion)
        updateTaskLists(reorderedForDeletion)

        if (currentListId === listId && reorderedForDeletion.length > 0) {
          switchTaskList(reorderedForDeletion[0].id)
        } else if (currentListId === listId && reorderedForDeletion.length === 0) {
          switchTaskList(noTaskListSelectedId)
        }
        toast({ title: "List Deleted", description: "Task list and its tasks removed." })
      } catch (error: any) {
        console.error("handleDeleteList: Failed to delete list:", error)
        toast({ title: "Error", description: `Failed to delete list: ${error.message}`, variant: "destructive" })
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localTaskLists.findIndex((list) => list.id === active.id)
      const newIndex = localTaskLists.findIndex((list) => list.id === over?.id)

      const newOrder = arrayMove(localTaskLists, oldIndex, newIndex)

      const reorderedListsWithPositions = newOrder.map((list, index) => ({
        ...list,
        position: index + 1,
      }))

      setLocalTaskLists(reorderedListsWithPositions)
      updateTaskLists(reorderedListsWithPositions)

      try {
        await DatabaseService.reorderTaskLists(userId, reorderedListsWithPositions)
        toast({ title: "Lists Reordered", description: "Task lists order saved." })
      } catch (error: any) {
        console.error("Failed to save reordered lists:", error)
        toast({ title: "Error", description: `Failed to save reorder: ${error.message}`, variant: "destructive" })
      }
    }
  }

  const totalTasks = localTaskLists
    .filter((list) => list.name !== "✅ Completed Tasks")
    .reduce((sum, list) => sum + list.steps.length, 0)

  const sortableItems = localTaskLists.map((list) => list.id)
  const nonSortableItem = taskLists.find((list) => list.id === noTaskListSelectedId)

  if (!isOpen) return null

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-ink-950/20 backdrop-blur-sm border border-brushed-silver/20 text-cream-25 shadow-2xl rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-xl font-montserrat font-light text-cream-25 zen-heading">
          <Plus className="h-5 w-5 text-cream-25" />
          Manage Step Lists
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-cream-25/70 hover:text-cream-25">
          Close
        </Button>
      </div>
      <p className="font-inter text-cream-25/70 mb-4">Create, edit, and organize your task lists.</p>

      <div className="flex-1 overflow-y-auto p-1">
        <Card className={`mb-4 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${currentListId === ALL_ACTIVE_TASKS_ID ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col flex-grow">
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">All Active Tasks</CardTitle>
              <span className="text-sm text-cream-25/70 zen-ui">({totalTasks} tasks)</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchTaskList(ALL_ACTIVE_TASKS_ID)}
                disabled={currentListId === ALL_ACTIVE_TASKS_ID}
                className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
              >
                {currentListId === ALL_ACTIVE_TASKS_ID ? "Current" : "Select"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateList()}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
          />
          <Button onClick={handleCreateList} className="bg-sapphire-blue hover:bg-sapphire-blue/90 text-cream-25">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(90vh-200px)] pr-4">
          {nonSortableItem && (
            <TaskListCard
              key={nonSortableItem.id}
              list={nonSortableItem}
              isCurrent={nonSortableItem.id === currentListId}
              isEditing={editingListId === nonSortableItem.id}
              editingListName={editingListName}
              editingSuggestedTimeBlockRange={editingSuggestedTimeBlockRange}
              onEdit={handleEditList}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDeleteList}
              onSwitch={switchTaskList}
              onListNameChange={setEditingListName}
              onSuggestedTimeBlockRangeChange={setEditingSuggestedTimeBlockRange}
              noTaskListSelectedId={noTaskListSelectedId}
            />
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {localTaskLists.length === 0 ? (
                  <p className="text-center text-cream-25/70 zen-body">No task lists yet.</p>
                ) : (
                  localTaskLists.map((list) => (
                    <SortableTaskListCard
                      key={list.id}
                      list={list}
                      isCurrent={list.id === currentListId}
                      isEditing={editingListId === list.id}
                      editingListName={editingListName}
                      editingSuggestedTimeBlockRange={editingSuggestedTimeBlockRange}
                      onEdit={handleEditList}
                      onSaveEdit={handleSaveEdit}
                      onDelete={handleDeleteList}
                      onSwitch={switchTaskList}
                      onListNameChange={setEditingListName}
                      onSuggestedTimeBlockRangeChange={setEditingSuggestedTimeBlockRange}
                      noTaskListSelectedId={noTaskListSelectedId}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
      </div>
    </div>
  )
}

function TaskListCard({
  list,
  isCurrent,
  isEditing,
  editingListName,
  editingSuggestedTimeBlockRange,
  onEdit,
  onSaveEdit,
  onDelete,
  onSwitch,
  onListNameChange,
  onSuggestedTimeBlockRangeChange,
  noTaskListSelectedId,
}: SortableTaskListCardProps) {
  const isNoTaskListSelected = list.id === noTaskListSelectedId

  return (
    <Card
      className={`mb-2 p-3 flex flex-col bg-white/20 border border-white/10 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${isCurrent ? "border-vibrant-blue ring-1 ring-vibrant-blue" : ""}`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        {isEditing && !isNoTaskListSelected ? (
          <div className="flex flex-col flex-grow mr-2 gap-2">
            <Input
              value={editingListName}
              onChange={(e) => onListNameChange(e.target.value)}
              onBlur={onSaveEdit}
              onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
              className="bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
              aria-label="Edit list name"
            />
            <div className="flex items-center gap-2">
              <Square className="h-4 w-4 text-cream-25/70" />
              <Input
                value={editingSuggestedTimeBlockRange}
                onChange={(e) => onSuggestedTimeBlockRangeChange(e.target.value)}
                onBlur={onSaveEdit}
                onKeyPress={(e) => e.key === "Enter" && onSaveEdit()}
                placeholder="Suggested Time Block Range"
                className="flex-grow bg-white/10 border-brushed-silver/30 text-cream-25 placeholder:text-cream-25/70 focus-visible:ring-sapphire-blue focus-visible:ring-offset-0 font-inter"
                aria-label="Edit suggested time block range"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow">
            <div className="flex items-center">
              <CardTitle className="text-lg font-medium text-cream-25 zen-heading mr-2">{list.name}</CardTitle>
              {!isNoTaskListSelected && (
                <span className="text-sm text-cream-25/70 zen-ui">({list.steps.length} tasks)</span>
              )}
            </div>
            {list.suggestedTimeBlockRange && (
              <div className="flex items-center gap-2 text-sm text-cream-25/70 zen-ui mt-1">
                <Square className="h-4 w-4" />
                <span>{list.suggestedTimeBlockRange}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-end">
            {isEditing && !isNoTaskListSelected ? (
              <Button variant="ghost" size="icon" onClick={onSaveEdit} aria-label="Save changes">
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            ) : (
              !isNoTaskListSelected && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(list)}
                  aria-label="Edit list"
                  className="text-cream-25/70 hover:text-cream-25"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )
            )}
            {!isNoTaskListSelected && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(list.id)}
                aria-label="Delete list"
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitch(list.id)}
            disabled={isCurrent}
            className="bg-white/10 border-brushed-silver/30 text-cream-25 hover:bg-white/20 text-xs font-inter w-full mt-2"
          >
            {isCurrent ? "Current" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}