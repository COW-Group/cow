"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Loader2 } from "lucide-react"
import { emotionService, type Emotion, type UpdateEmotionData } from "@/lib/emotion-service"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/hooks/use-auth"

interface EmotionLogProps {
  isOpen: boolean
  onClose: () => void
}

export function EmotionLog({ isOpen, onClose }: EmotionLogProps) {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "processed" | "vaulted">("all")

  useEffect(() => {
    if (isOpen && user && !authLoading) {
      fetchEmotions()
    } else if (!user && !authLoading) {
      setEmotions([])
      setLoading(false)
    }
  }, [isOpen, user, authLoading])

  const fetchEmotions = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const fetchedEmotions = await emotionService.getEmotions(user.id)
      setEmotions(fetchedEmotions)
    } catch (error) {
      console.error("Failed to fetch emotions:", error)
      toast({
        title: "Error",
        description: "Failed to load emotion log.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (emotion: Emotion) => {
    setEditingEmotion(emotion)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingEmotion || !user) return

    const updates: UpdateEmotionData = {
      emotion_name: editingEmotion.emotion_name,
      emotion_category: editingEmotion.emotion_category,
      intensity: editingEmotion.intensity,
      notes: editingEmotion.notes,
      is_vaulted: editingEmotion.is_vaulted,
      is_pain_box: editingEmotion.is_pain_box,
      is_processed: editingEmotion.is_processed,
      trigger_context: editingEmotion.trigger_context,
      trigger_event: editingEmotion.trigger_event,
      trigger_worldview: editingEmotion.trigger_worldview,
      physical_sensations: editingEmotion.physical_sensations,
      subjective_feelings: editingEmotion.subjective_feelings,
      reflection: editingEmotion.reflection,
      response: editingEmotion.response,
      is_constructive: editingEmotion.is_constructive,
      pain_box_reasons: editingEmotion.pain_box_reasons,
      current_step: editingEmotion.current_step,
    }

    try {
      const updated = await emotionService.updateEmotion(editingEmotion.id, updates)
      toast({
        title: "Emotion Updated",
        description: "The emotion entry has been updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingEmotion(null)
      fetchEmotions()
    } catch (error) {
      console.error("Failed to update emotion:", error)
      toast({
        title: "Error",
        description: "Failed to update emotion entry.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEmotion = async (id: string) => {
    if (!user) return
    if (window.confirm("Are you sure you want to delete this emotion entry?")) {
      try {
        await emotionService.deleteEmotion(id, user.id)
        toast({
          title: "Emotion Deleted",
          description: "The emotion entry has been removed.",
        })
        fetchEmotions()
      } catch (error) {
        console.error("Failed to delete emotion:", error)
        toast({
          title: "Error",
          description: "Failed to delete emotion entry.",
          variant: "destructive",
        })
      }
    }
  }

  const getEmotionColor = (category: string | null) => {
    const colors: Record<string, string> = {
      joy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      sadness: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      anger: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      fear: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      disgust: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    }
    return colors[category || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  const filteredEmotions = emotions.filter((emotion) => {
    if (filter === "processed") return emotion.is_processed
    if (filter === "vaulted") return emotion.is_vaulted && !emotion.is_processed
    return true
  })

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="zen-heading">Emotion Log</SheetTitle>
            <CardDescription className="zen-body">Review and manage your emotional journey.</CardDescription>
          </SheetHeader>
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="filter">Filter:</Label>
            <Select value={filter} onValueChange={(value) => setFilter(value as "all" | "processed" | "vaulted")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter emotions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entries</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="vaulted">Vaulted (Unprocessed)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {filteredEmotions.length === 0 ? (
                  <p className="text-center text-muted-foreground zen-body">No emotion entries yet.</p>
                ) : (
                  filteredEmotions.map((emotion) => (
                    <Card key={emotion.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg zen-subheading">
                            {emotion.emotion_name || "Unnamed Emotion"}
                          </CardTitle>
                          <div className="flex gap-2">
                            {emotion.is_pain_box && (
                              <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:text-red-300">
                                Pain Box
                              </Badge>
                            )}
                            {emotion.is_processed ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                Processed
                              </Badge>
                            ) : emotion.is_vaulted ? (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                Vaulted
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          {format(new Date(emotion.created_at), "PPP p")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm zen-body">
                        {/* Only show essential info here, full details in edit dialog */}
                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(emotion)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteEmotion(emotion.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Dialog (remains unchanged with all fields) */}
      {editingEmotion && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="zen-heading">Edit Emotion Entry</DialogTitle>
              <CardDescription className="zen-body">Make changes to your emotional record.</CardDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emotion_name" className="text-right">
                  Emotion
                </Label>
                <Input
                  id="emotion_name"
                  value={editingEmotion.emotion_name || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, emotion_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="emotion_category" className="text-right">
                  Category
                </Label>
                <Input
                  id="emotion_category"
                  value={editingEmotion.emotion_category || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, emotion_category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="intensity" className="text-right">
                  Intensity
                </Label>
                <Input
                  id="intensity"
                  type="number"
                  value={editingEmotion.intensity || ""}
                  onChange={(e) =>
                    setEditingEmotion({ ...editingEmotion, intensity: Number.parseInt(e.target.value) || null })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="physical_sensations" className="text-right">
                  Physical Sensations
                </Label>
                <Textarea
                  id="physical_sensations"
                  value={editingEmotion.physical_sensations || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, physical_sensations: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subjective_feelings" className="text-right">
                  Subjective Feelings
                </Label>
                <Textarea
                  id="subjective_feelings"
                  value={editingEmotion.subjective_feelings || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, subjective_feelings: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trigger_event" className="text-right">
                  Trigger Event
                </Label>
                <Textarea
                  id="trigger_event"
                  value={editingEmotion.trigger_event || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, trigger_event: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trigger_context" className="text-right">
                  Trigger Context
                </Label>
                <Textarea
                  id="trigger_context"
                  value={editingEmotion.trigger_context || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, trigger_context: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trigger_worldview" className="text-right">
                  Trigger Worldview
                </Label>
                <Textarea
                  id="trigger_worldview"
                  value={editingEmotion.trigger_worldview || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, trigger_worldview: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Reflection (Sit)
                </Label>
                <Textarea
                  id="notes"
                  value={editingEmotion.notes || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, notes: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="response" className="text-right">
                  Response
                </Label>
                <Textarea
                  id="response"
                  value={editingEmotion.response || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, response: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reflection" className="text-right">
                  Reflection (Respond)
                </Label>
                <Textarea
                  id="reflection"
                  value={editingEmotion.reflection || ""}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, reflection: e.target.value })}
                  className="col-span-3 min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_constructive" className="text-right">
                  Constructive
                </Label>
                <input
                  type="checkbox"
                  id="is_constructive"
                  checked={editingEmotion.is_constructive || false}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, is_constructive: e.target.checked })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pain_box_reasons" className="text-right">
                  Pain Box Reasons (comma-separated)
                </Label>
                <Input
                  id="pain_box_reasons"
                  value={editingEmotion.pain_box_reasons?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingEmotion({
                      ...editingEmotion,
                      pain_box_reasons: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_pain_box" className="text-right">
                  Pain Box
                </Label>
                <input
                  type="checkbox"
                  id="is_pain_box"
                  checked={editingEmotion.is_pain_box}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, is_pain_box: e.target.checked })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_processed" className="text-right">
                  Processed
                </Label>
                <input
                  type="checkbox"
                  id="is_processed"
                  checked={editingEmotion.is_processed}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, is_processed: e.target.checked })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_vaulted" className="text-right">
                  Vaulted
                </Label>
                <input
                  type="checkbox"
                  id="is_vaulted"
                  checked={editingEmotion.is_vaulted}
                  onChange={(e) => setEditingEmotion({ ...editingEmotion, is_vaulted: e.target.checked })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current_step" className="text-right">
                  Current Step
                </Label>
                <Select
                  value={editingEmotion.current_step || ""}
                  onValueChange={(value) =>
                    setEditingEmotion({
                      ...editingEmotion,
                      current_step: value as Emotion["current_step"],
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select step" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="trigger">Trigger</SelectItem>
                    <SelectItem value="vault">Vault</SelectItem>
                    <SelectItem value="sit">Sit</SelectItem>
                    <SelectItem value="respond">Respond</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
