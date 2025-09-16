"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2 } from "lucide-react"
import type { AppSettings } from "@/lib/types"

interface AudioSettingsProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  updateSettings: (settings: AppSettings) => void
}

export function AudioSettings({ isOpen, onClose, settings, updateSettings }: AudioSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Audio Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sound Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">Play sound when tasks complete</p>
                </div>
                <Switch
                  checked={localSettings.soundEnabled}
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, soundEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audio Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supported Platforms</Label>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• Apple Music</div>
                  <div>• Spotify</div>
                  <div>• YouTube</div>
                  <div>• Audio Files</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Add audio links to your tasks for background music during focus sessions.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
