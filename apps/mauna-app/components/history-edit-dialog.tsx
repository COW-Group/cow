"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Step, TimeInterval } from "@/lib/types"
import { TaskListService } from "@/lib/task-list-service" // Import the service
import { useAuth } from "@/hooks/use-auth" // Import useAuth to get userId

interface HistoryEditDialogProps {
  task: Step
  onSave: (updatedTask: Step) => void
  onClose: () => void
}

export function HistoryEditDialog({ task, onSave, onClose }: HistoryEditDialogProps) {
  const { user } = useAuth()
  const userId = user?.id || "" // Get userId from auth hook
  const taskListService = new TaskListService(userId) // Initialize service with userId

  const [history, setHistory] = useState<TimeInterval[]>(task.history || [])
  const { toast } = useToast()

  useEffect(() => {
    setHistory(task.history || [])
  }, [task])

  const handleAddEntry = () => {
    setHistory([...history, { startTime: new Date().toISOString(), endTime: null }])
  }

  const handleUpdateEntry = (index: number, field: keyof TimeInterval, value: string) => {
    const newHistory = [...history]
    newHistory[index] = { ...newHistory[index], [field]: value }
    setHistory(newHistory)
  }

  const handleDeleteEntry = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    setHistory(newHistory)
  }

  const handleSave = async () => {
    if (!task.taskListId) {
      toast({ title: "Error", description: "Task is not associated with a task list.", variant: "destructive" })
      return
    }
    try {
      const updatedTask = await taskListService.updateTaskHistory(task.taskListId, task.id, history)
      onSave(updatedTask)
      toast({ title: "History Updated", description: "Task history saved successfully." })
      onClose()
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to save history: ${error.message}`, variant: "destructive" })
    }
  }

  const formatDateTimeLocal = (isoString: string | null) => {
    if (!isoString) return ""
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-cream-25 dark:bg-ink-950 border border-brushed-silver/20 dark:border-ink-800/20 shadow-2xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-lora font-light text-logo-blue zen-heading">
            Edit History for "{task.label}"
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleAddEntry} className="zen-button-primary">
            Add New Entry
          </Button>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground zen-body">No history entries yet.</p>
              ) : (
                history.map((entry, index) => (
                  <div key={index} className="border p-3 rounded-lg flex flex-col gap-2 bg-background/30">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor={`start-${index}`} className="zen-body">
                        Start Time:
                      </Label>
                      <Input
                        id={`start-${index}`}
                        type="datetime-local"
                        value={formatDateTimeLocal(entry.startTime)}
                        onChange={(e) => handleUpdateEntry(index, "startTime", new Date(e.target.value).toISOString())}
                        className="col-span-2 zen-input font-inter"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor={`end-${index}`} className="zen-body">
                        End Time:
                      </Label>
                      <Input
                        id={`end-${index}`}
                        type="datetime-local"
                        value={formatDateTimeLocal(entry.endTime)}
                        onChange={(e) => handleUpdateEntry(index, "endTime", new Date(e.target.value).toISOString())}
                        className="col-span-2 zen-input font-inter"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(index)}
                      className="self-end text-red-500 hover:text-red-700 zen-icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="zen-button-secondary font-inter">
            Cancel
          </Button>
          <Button onClick={handleSave} className="zen-button-primary font-inter">
            Save History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
