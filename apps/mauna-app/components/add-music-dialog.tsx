"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Music } from "lucide-react"

interface AddMusicDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
}

export function AddMusicDialog({ isOpen, onOpenChange, onBack }: AddMusicDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-cream-25">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="font-lora zen-heading flex items-center gap-2">
              <Music className="h-5 w-5 text-logo-blue" />
              Add music
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="link" className="sr-only">
              Paste Spotify or Youtube link
            </Label>
            <Input id="link" placeholder="Paste Spotify or Youtube link" />
          </div>
          <Button variant="outline" className="text-logo-blue">
            Learn more
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
