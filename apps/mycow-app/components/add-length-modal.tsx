"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import { addLength } from "@/app/actions/wealth-vision-actions" // Corrected import
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AddLengthModalProps {
  // Corrected interface name
  isOpen: boolean
  onClose: () => void
  terrainId: string
}

export function AddLengthModal({ isOpen, onClose, terrainId }: AddLengthModalProps) {
  // Corrected component name
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Length title cannot be empty.") // Corrected message
      return
    }
    if (!terrainId) {
      setError("Parent Terrain ID is missing.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const newLength = await addLength(terrainId, title) // Corrected function call
        if (newLength) {
          toast({ title: "Success", description: `Length "${newLength.title}" added.` }) // Corrected message
          setTitle("")
          onClose()
          router.refresh()
        } else {
          toast({ title: "Error", description: "Failed to add length.", variant: "destructive" }) // Corrected message
        }
      } catch (err: any) {
        setError("Failed to add length: " + err.message) // Corrected message
        toast({ title: "Error", description: "Failed to add length: " + err.message, variant: "destructive" }) // Corrected message
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700 rounded-xl shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-light text-ink-800 dark:text-cream-100">Add New Length</DialogTitle>{" "}
          {/* Corrected title */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-ink-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-ink-600 dark:text-cream-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
              placeholder="e.g., Complete Financial Literacy Course"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending} className="bg-logo-blue hover:bg-blue-700 text-white">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Length"} {/* Corrected button text */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
