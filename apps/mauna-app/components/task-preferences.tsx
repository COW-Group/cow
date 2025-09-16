"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface TaskPreferencesProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  settings: {
    defaultDuration: number
    autoLoop: boolean
  } | undefined
  onSave: (newSettings: { defaultDuration?: number; autoLoop?: boolean }) => void
}

export function TaskPreferences({ isOpen, onOpenChange, settings, onSave }: TaskPreferencesProps) {
  const [localDefaultDuration, setLocalDefaultDuration] = useState(settings?.defaultDuration ?? 300) // Default to 5 minutes
  const [localAutoLoop, setLocalAutoLoop] = useState(settings?.autoLoop ?? false)

  useEffect(() => {
    setLocalDefaultDuration(settings?.defaultDuration ?? 300)
    setLocalAutoLoop(settings?.autoLoop ?? false)
  }, [settings])

  const handleSave = useCallback(() => {
    onSave({
      defaultDuration: localDefaultDuration,
      autoLoop: localAutoLoop,
    })
    onOpenChange(false)
  }, [localDefaultDuration, localAutoLoop, onSave, onOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="defaultDuration" className="text-right">
              Default Duration (s)
            </Label>
            <Input
              id="defaultDuration"
              type="number"
              value={localDefaultDuration}
              onChange={(e) => setLocalDefaultDuration(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="autoLoop" className="text-right">
              Auto Loop Tasks
            </Label>
            <Switch id="autoLoop" checked={localAutoLoop} onCheckedChange={setLocalAutoLoop} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}