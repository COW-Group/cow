"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Step, TaskList as TTaskList, Length } from "@/lib/types"
import { TaskListService } from "@/lib/task-list-service"
import { useAuth } from "@/hooks/use-auth"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { DatabaseService } from "@/lib/database-service"

interface TaskEditDialogProps {
  task: Step
  onSave: (updatedTask: Step) => void
  onClose: () => void
  taskLists: TTaskList[]
  currentTaskListId: string
  onTaskListChange: (taskId: string, newTaskListId: string) => void
  databaseService?: DatabaseService
}

export function TaskEditDialog({
  task,
  onSave,
  onClose,
  taskLists,
  currentTaskListId,
  onTaskListChange,
  databaseService,
}: TaskEditDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const taskListService = user ? new TaskListService(user.id, databaseService) : null

  const [label, setLabel] = useState(task.label)
  const [duration, setDuration] = useState(task.duration / 60000)
  const [color, setColor] = useState(task.color || "")
  const [icon, setIcon] = useState(task.icon || "")
  const [completed, setCompleted] = useState(task.completed)
  const [locked, setLocked] = useState(task.locked)
  const [priorityLetter, setPriorityLetter] = useState(task.priorityLetter || "None")
  const [priorityRank, setPriorityRank] = useState(task.priorityRank || 0)
  const [mantra, setMantra] = useState(task.mantra || "")
  const [startingRitual, setStartingRitual] = useState(task.startingRitual || "")
  const [endingRitual, setEndingRitual] = useState(task.endingRitual || "")
  const [selectedTaskListId, setSelectedTaskListId] = useState(task.taskListId || currentTaskListId)
  const [selectedLengthId, setSelectedLengthId] = useState(task.lengthId || "none")
  const [position, setPosition] = useState(task.position) // New state for position
  const [lengths, setLengths] = useState<Length[]>([])

  // Fetch lengths when the dialog opens
  useEffect(() => {
    const fetchLengths = async () => {
      if (user?.id && databaseService) {
        try {
          const fetchedLengths = await databaseService.fetchLengths(user.id)
          setLengths(fetchedLengths)
        } catch (error: any) {
          toast({
            title: "Error",
            description: `Failed to fetch lengths: ${error.message}`,
            variant: "destructive",
          })
        }
      }
    }

    fetchLengths()
  }, [user?.id, databaseService, toast])

  useEffect(() => {
    setLabel(task.label)
    setDuration(task.duration / 60000)
    setColor(task.color || "")
    setIcon(task.icon || "")
    setCompleted(task.completed)
    setLocked(task.locked)
    setPriorityLetter(task.priorityLetter || "None")
    setPriorityRank(task.priorityRank || 0)
    setMantra(task.mantra || "")
    setStartingRitual(task.startingRitual || "")
    setEndingRitual(task.endingRitual || "")
    setSelectedTaskListId(task.taskListId || currentTaskListId)
    setSelectedLengthId(task.lengthId || "none")
    setPosition(task.position) // Update position on task change
  }, [task, currentTaskListId])

  const handleSave = useCallback(async () => {
    if (!taskListService) return

    const updatedTask: Step = {
      ...task,
      label,
      duration: duration * 60000,
      color,
      icon,
      completed,
      locked,
      priorityLetter: priorityLetter as Step["priorityLetter"],
      priorityRank,
      mantra,
      startingRitual,
      endingRitual,
      taskListId: selectedTaskListId,
      lengthId: selectedLengthId === "none" ? null : selectedLengthId,
      position, // Include position in updated task
    }

    try {
      if (selectedTaskListId !== task.taskListId && task.taskListId) {
        await taskListService.deleteTaskFromTaskList(task.taskListId, task.id)
        const addedTask = await taskListService.addTaskToTaskList(selectedTaskListId, {
          ...updatedTask,
          id: crypto.randomUUID(),
          taskListId: selectedTaskListId,
        })
        onSave(addedTask)
        onTaskListChange(task.id, selectedTaskListId)
        toast({
          title: "Task Moved",
          description: `Task moved to "${taskLists.find((l) => l.id === selectedTaskListId)?.name}".`,
        })
      } else {
        await taskListService.updateTaskInTaskList(currentTaskListId, updatedTask)
        onSave(updatedTask)
        toast({ title: "Task Updated", description: "Task details saved." })
      }
      onClose()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to save task: ${error.message}`, variant: "destructive" })
    }
  }, [
    task,
    label,
    duration,
    color,
    icon,
    completed,
    locked,
    priorityLetter,
    priorityRank,
    mantra,
    startingRitual,
    endingRitual,
    selectedTaskListId,
    selectedLengthId,
    position, // Add position to dependency array
    taskListService,
    onSave,
    onClose,
    currentTaskListId,
    onTaskListChange,
    toast,
    taskLists,
  ])

  return (
    <Card className="bg-cream-50/10 backdrop-blur-sm border border-cream-25/30 rounded-xl p-6 shadow-lg w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-cream-25">Edit Task</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-cream-25 hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="label" className="text-cream-25">
                Label
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="icon" className="text-cream-25">
                Icon
              </Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration" className="text-cream-25">
                Duration (min)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="color" className="text-cream-25">
                Color
              </Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="position" className="text-cream-25">
                Position
              </Label>
              <Input
                id="position"
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priorityLetter" className="text-cream-25">
                Priority Letter
              </Label>
              <Select value={priorityLetter} onValueChange={setPriorityLetter}>
                <SelectTrigger className="glassmorphism-inner-card border-none text-cream-25 data-[state=open]:bg-cream-25/20">
                  <SelectValue placeholder="Select a letter" />
                </SelectTrigger>
                <SelectContent className="glassmorphism-select-content text-cream-25 border-brushed-silver/20 dark:border-ink-800/20">
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="S">S (Strategic)</SelectItem>
                  <SelectItem value="E">E (Essential)</SelectItem>
                  <SelectItem value="R">R (Routine)</SelectItem>
                  <SelectItem value="N">N (Non-Urgent)</SelectItem>
                  <SelectItem value="T">T (Trivial)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="priorityRank" className="text-cream-25">
                Priority Rank
              </Label>
              <Input
                id="priorityRank"
                type="number"
                value={priorityRank}
                onChange={(e) => setPriorityRank(Number(e.target.value))}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="mantra" className="text-cream-25">
                Mantra
              </Label>
              <Textarea
                id="mantra"
                value={mantra}
                onChange={(e) => setMantra(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="startingRitual" className="text-cream-25">
                Starting Ritual
              </Label>
              <Textarea
                id="startingRitual"
                value={startingRitual}
                onChange={(e) => setStartingRitual(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endingRitual" className="text-cream-25">
                Ending Ritual
              </Label>
              <Textarea
                id="endingRitual"
                value={endingRitual}
                onChange={(e) => setEndingRitual(e.target.value)}
                className="glassmorphism-inner-card border-none text-cream-25 placeholder:text-cream-25/70"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="taskList" className="text-cream-25">
                Move to List
              </Label>
              <Select value={selectedTaskListId} onValueChange={setSelectedTaskListId}>
                <SelectTrigger className="glassmorphism-inner-card border-none text-cream-25 data-[state=open]:bg-cream-25/20">
                  <SelectValue placeholder="Select a task list" />
                </SelectTrigger>
                <SelectContent className="glassmorphism-select-content text-cream-25 border-brushed-silver/20 dark:border-ink-800/20">
                  {taskLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="length" className="text-cream-25">
                Assign to Length
              </Label>
              <Select value={selectedLengthId} onValueChange={setSelectedLengthId}>
                <SelectTrigger className="glassmorphism-inner-card border-none text-cream-25 data-[state=open]:bg-cream-25/20">
                  <SelectValue placeholder="Select a length" />
                </SelectTrigger>
                <SelectContent className="glassmorphism-select-content text-cream-25 border-brushed-silver/20 dark:border-ink-800/20">
                  <SelectItem value="none">None</SelectItem>
                  {lengths.map((length) => (
                    <SelectItem key={length.id} value={length.id}>
                      {length.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <Checkbox
                id="completed"
                checked={completed}
                onCheckedChange={(checked) => setCompleted(Boolean(checked))}
              />
              <Label htmlFor="completed" className="text-cream-25">
                Completed
              </Label>
            </div>
            <div className="flex items-center space-x-2 justify-end">
              <Checkbox id="locked" checked={locked} onCheckedChange={(checked) => setLocked(Boolean(checked))} />
              <Label htmlFor="locked" className="text-cream-25">
                Locked
              </Label>
            </div>
          </div>
          {task.history && task.history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-brushed-silver/20 dark:border-ink-800/20">
              <h3 className="text-lg font-montserrat font-semibold mb-2 text-cream-25">Completion History</h3>
              <ul className="list-disc pl-5 text-cream-25/70">
                {task.history.map((entry, index) => (
                  <li key={index} className="mb-1 font-lora italic">
                    {entry.startTime} - {entry.endTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button type="submit" onClick={handleSave} className="font-inter zen-button-primary">
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
