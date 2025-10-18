"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateMountain } from "@/app/actions/wealth-vision-actions"
import type { Mountain } from "@/types/wealth-vision"

interface EditMountainModalProps {
  isOpen: boolean
  onClose: () => void
  mountain: Mountain | null
}

export function EditMountainModal({ isOpen, onClose, mountain }: EditMountainModalProps) {
  const [newTitle, setNewTitle] = useState(mountain?.title || "")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (mountain) {
      setNewTitle(mountain.title)
    }
  }, [mountain])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mountain || !newTitle.trim()) {
      toast({
        title: "Error",
        description: "Mountain title cannot be empty.",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const updatedMountain = await updateMountain(mountain.id, newTitle.trim())
      if (updatedMountain) {
        toast({
          title: "Success",
          description: "Mountain updated successfully!",
        })
        router.refresh()
        onClose()
      } else {
        toast({
          title: "Error",
          description: "Failed to update mountain. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700">
        <DialogHeader>
          <DialogTitle className="text-ink-800 dark:text-cream-100">Edit Mountain</DialogTitle>
          <DialogDescription className="text-ink-600 dark:text-cream-300">
            Make changes to your mountain here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-ink-800 dark:text-cream-100">
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3 bg-cream-100 dark:bg-ink-700 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-600"
                disabled={isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-logo-blue text-white hover:bg-logo-blue/90 dark:bg-logo-blue dark:hover:bg-logo-blue/80"
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
