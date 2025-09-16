"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, MoreHorizontal } from "lucide-react"
import * as LucideIcons from "lucide-react"
import type { Sound, SoundParameter } from "@/types/sound"

interface SoundSettingsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onBack: () => void
  sound: Sound
  onParameterChange: (soundId: string, paramId: string, value: number[]) => void
}

export function SoundSettingsDialog({
  isOpen,
  onOpenChange,
  onBack,
  sound,
  onParameterChange,
}: SoundSettingsDialogProps) {
  const handleSliderChange = (paramId: string, value: number[]) => {
    onParameterChange(sound.id, paramId, value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-cream-25">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="font-lora zen-heading flex items-center gap-2">
              <span className="text-2xl">{sound.icon}</span>
              {sound.name}
            </DialogTitle>
          </div>
          <Button variant="ghost" size="icon" className="text-cream-25">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {sound.parameters?.map((param: SoundParameter) => {
            // Dynamically get Lucide icon component
            const IconComponent = LucideIcons[param.lucideIcon as keyof typeof LucideIcons] || null
            return (
              <div key={param.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  {IconComponent && <IconComponent className="h-6 w-6 text-cream-25" />}
                  <span className="text-sm text-cream-25">{param.label}</span>
                </div>
                <Slider
                  value={[param.value]}
                  onValueChange={(val) => handleSliderChange(param.id, val)}
                  max={param.max}
                  min={param.min}
                  step={1}
                  className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-cream-25/50 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-cream-25 [&>span:first-child>span]:h-3 [&>span:first-child>span]:w-3 [&>span:first-child>span]:-mt-1"
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
