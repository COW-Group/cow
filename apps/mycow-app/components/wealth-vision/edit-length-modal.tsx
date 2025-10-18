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
import { updateLength } from "@/app/actions/wealth-vision-actions" // Corrected import
import type { Length } from "@/types/wealth-vision" // Corrected type

interface EditLengthModalProps {
  // Corrected interface name
  isOpen: boolean
  onClose: () => void
  length: Length | null // Corrected prop name and type
}

export function EditLengthModal({ isOpen, onClose, length }: EditLengthModalProps) {
  // Corrected component name and prop
  const [newTitle, setNewTitle] = useState(length?.title || "")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (length) {
      setNewTitle(length.title)
    }
  }, [length]) // Corrected dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!length || !newTitle.trim()) {
      toast({
        title: "Error",
        description: "Length title cannot be empty.", // Corrected message
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      const updatedLength = await updateLength(length.id, newTitle.trim()) // Corrected function call and arguments
      if (updatedLength) {
        toast({
          title: "Success",
          description: "Length updated successfully!", // Corrected message
        })
        router.refresh()
        onClose()
      } else {
        toast({
          title: "Error",
          description: "Failed to update length. Please try again.", // Corrected message
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700">
        <DialogHeader>
          <DialogTitle className="text-ink-800 dark:text-cream-100">Edit Length</DialogTitle> {/* Corrected title */}
          <DialogDescription className="text-ink-600 dark:text-cream-300">
            Make changes to your length here. Click save when you're done. {/* Corrected description */}
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
