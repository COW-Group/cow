"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, parseISO, addMinutes, differenceInMinutes } from "date-fns"
import { Plus, X, Edit, Trash2, CalendarDays } from "lucide-react"
import type { TimeBlock, TaskList } from "@/lib/types"
import type { DatabaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimeBlockScheduleProps {
  onClose: () => void
  databaseService: DatabaseService | null
  taskLists: TaskList[]
}

export function TimeBlockSchedule({ onClose, databaseService, taskLists }: TimeBlockScheduleProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTimeBlock, setEditingTimeBlock] = useState<TimeBlock | null>(null)
  const [newBlockData, setNewBlockData] = useState({
    taskListId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "",
    endTime: "",
    label: "",
    color: "",
    icon: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const fetchTimeBlocks = useCallback(async () => {
    if (user?.id && databaseService) {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd")
        const fetchedBlocks = await databaseService.fetchTimeBlocks(user.id, formattedDate)
        setTimeBlocks(fetchedBlocks)
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Failed to fetch time blocks: ${error.message}`,
          variant: "destructive",
        })
      }
    }
  }, [user, databaseService, toast, selectedDate])

  useEffect(() => {
    fetchTimeBlocks()
  }, [fetchTimeBlocks])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewBlockData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewBlockData((prev) => ({ ...prev, [id]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const handleOpenDialog = (block?: TimeBlock) => {
    if (block) {
      setEditingTimeBlock(block)
      const blockDate = block.startTime ? parseISO(block.startTime) : new Date()
      setNewBlockData({
        taskListId: block.taskListId,
        date: format(blockDate, "yyyy-MM-dd"),
        startTime: block.startTime ? format(parseISO(block.startTime), "HH:mm") : "",
        endTime: block.endTime ? format(parseISO(block.endTime), "HH:mm") : "",
        label: block.label || "",
        color: block.color || "",
        icon: block.icon || "",
      })
    } else {
      setEditingTimeBlock(null)
      setNewBlockData({
        taskListId: taskLists[0]?.id || "",
        date: format(new Date(), "yyyy-MM-dd"),
        startTime: format(new Date(), "HH:mm"),
        endTime: format(addMinutes(new Date(), 30), "HH:mm"),
        label: "",
        color: "",
        icon: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveTimeBlock = async () => {
    if (!user?.id || !databaseService) return

    // Store times in local time without 'Z' to avoid UTC offset
    const fullStartTime = `${newBlockData.date}T${newBlockData.startTime}:00`
    const fullEndTime = `${newBlockData.date}T${newBlockData.endTime}:00`

    if (new Date(fullStartTime) >= new Date(fullEndTime)) {
      toast({
        title: "Invalid Time Range",
        description: "Start time must be before end time.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingTimeBlock) {
        const updatedBlock = await databaseService.updateTimeBlock(editingTimeBlock.id, user.id, {
          taskListId: newBlockData.taskListId,
          startTime: fullStartTime,
          endTime: fullEndTime,
          label: newBlockData.label,
          color: newBlockData.color,
          icon: newBlockData.icon,
        })
        setTimeBlocks((prev) => prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)))
        toast({ title: "Time Block Updated", description: "Your time block has been updated." })
      } else {
        const createdBlock = await databaseService.createTimeBlock(user.id, {
          taskListId: newBlockData.taskListId,
          startTime: fullStartTime,
          endTime: fullEndTime,
          label: newBlockData.label,
          color: newBlockData.color,
          icon: newBlockData.icon,
        })
        setTimeBlocks((prev) => [...prev, createdBlock])
        toast({ title: "Time Block Created", description: "A new time block has been added." })
      }
      setIsDialogOpen(false)
      setEditingTimeBlock(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to save time block: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteTimeBlock = async (blockId: string) => {
    if (!user?.id || !databaseService) return

    try {
      await databaseService.deleteTimeBlock(blockId, user.id)
      setTimeBlocks((prev) => prev.filter((b) => b.id !== blockId))
      toast({ title: "Time Block Deleted", description: "The time block has been removed." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete time block: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getTaskListName = (taskListId: string) => {
    return taskLists.find((list) => list.id === taskListId)?.name || "Unknown Task List"
  }

  const formatDuration = (start: string, end: string) => {
    const startDate = parseISO(start)
    const endDate = parseISO(end)
    const minutes = differenceInMinutes(endDate, startDate)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours} hr, ${remainingMinutes} min`
    } else if (hours > 0) {
      return `${hours} hr`
    } else {
      return `${remainingMinutes} min`
    }
  }

  const getHourMarkers = () => {
    const markers = []
    for (let i = 0; i < 24; i++) {
      markers.push(
        <div key={i} className="relative h-12">
          <span className="absolute left-0 top-0 -translate-y-1/2 text-xs text-cream-25/70">
            {format(new Date().setHours(i, 0, 0, 0), "h a")}
          </span>
        </div>,
      )
    }
    return markers
  }

  const calculateBlockPosition = (block: TimeBlock) => {
    if (!block.startTime || !block.endTime) {
      console.warn(`Invalid time block: missing startTime or endTime for block ID ${block.id}`)
      return { top: "0%", height: "0%" }
    }

    const startOfDay = new Date(selectedDate).setHours(0, 0, 0, 0)
    const blockStart = parseISO(block.startTime).getTime()
    const blockEnd = parseISO(block.endTime).getTime()

    const totalDayMinutes = 24 * 60
    const minutesFromStart = differenceInMinutes(blockStart, startOfDay)
    const durationMinutes = differenceInMinutes(blockEnd, blockStart)

    const topPercentage = (minutesFromStart / totalDayMinutes) * 100
    const heightPercentage = (durationMinutes / totalDayMinutes) * 100

    return { top: `${topPercentage}%`, height: `${heightPercentage}%` }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism border border-cream-25/30 backdrop-blur-sm text-cream-25">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-cream-25">Time Block Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-[140px] justify-start text-left font-normal text-cream-25 hover:bg-cream-25/10",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border border-cream-25/30">
              <div className="p-4 text-cream-25">Calendar component goes here.</div>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog()}
            className="text-cream-25 hover:bg-cream-25/10"
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add Time Block</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-cream-25 hover:bg-cream-25/10">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative h-[600px] overflow-y-auto p-4">
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0">{getHourMarkers()}</div>
        <div className="relative h-full w-full pl-16">
          {timeBlocks.map((block) => {
            const { top, height } = calculateBlockPosition(block)
            if (top === "0%" && height === "0%") return null
            const blockColor = block.color || "var(--sapphire-blue)"
            return (
              <div
                key={block.id}
                className="absolute w-[calc(100%-4rem)] rounded-lg p-2 text-sm text-cream-25 flex items-center gap-2 group"
                style={{ top, height, backgroundColor: blockColor, opacity: 0.8 }}
              >
                <span className="text-lg">{block.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{block.label || getTaskListName(block.taskListId)}</div>
                  <div className="text-xs opacity-80">
                    {block.startTime && block.endTime
                      ? `${format(parseISO(block.startTime), "h:mm a")} - ${format(
                          parseISO(block.endTime),
                          "h:mm a",
                        )} (${formatDuration(block.startTime, block.endTime)})`
                      : "Invalid time range"}
                  </div>
                </div>
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(block)}
                    className="h-6 w-6 text-cream-25 hover:bg-cream-25/20"
                  >
                    <Edit className="h-3 w-3" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTimeBlock(block.id)}
                    className="h-6 w-6 text-red-400 hover:bg-cream-25/20"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-cream-25 border border-cream-25/30">
          <DialogHeader>
            <DialogTitle className="text-cream-25">
              {editingTimeBlock ? "Edit Time Block" : "Add New Time Block"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskListId" className="text-right text-cream-25">
                Task List
              </Label>
              <Select
                value={newBlockData.taskListId}
                onValueChange={(value) => handleSelectChange("taskListId", value)}
              >
                <SelectTrigger className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25">
                  <SelectValue placeholder="Select a task list" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-cream-25/30 text-cream-25">
                  {taskLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right text-cream-25">
                Label (Optional)
              </Label>
              <Input
                id="label"
                value={newBlockData.label}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
                placeholder="e.g., Deep Work Session"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-cream-25">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newBlockData.date}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right text-cream-25">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={newBlockData.startTime}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right text-cream-25">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={newBlockData.endTime}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right text-cream-25">
                Color (Hex/CSS)
              </Label>
              <Input
                id="color"
                value={newBlockData.color}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
                placeholder="#FF0000 or red"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right text-cream-25">
                Icon (Emoji)
              </Label>
              <Input
                id="icon"
                value={newBlockData.icon}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-cream-25/30 text-cream-25"
                placeholder="💡"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTimeBlock} className="zen-button-primary">
              {editingTimeBlock ? "Save Changes" : "Add Time Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
