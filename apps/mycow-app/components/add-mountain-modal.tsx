"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"
import { addMountain } from "@/app/actions/wealth-vision-actions" // Import the server action
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation" // Import useRouter

interface AddMountainModalProps {
  isOpen: boolean
  onClose: () => void
  rangeId: string // New prop to pass the parent range ID
}

export function AddMountainModal({ isOpen, onClose, rangeId }: AddMountainModalProps) {
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter() // Initialize useRouter

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Mountain title cannot be empty.")
      return
    }
    if (!rangeId) {
      setError("Parent Range ID is missing.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        // Call the server action directly
        const newMountain = await addMountain(rangeId, title)
        if (newMountain) {
          toast({ title: "Success", description: `Mountain "${newMountain.title}" added.` })
          setTitle("") // Clear input on success
          onClose()
          router.refresh() // Refresh the page to show the new mountain
        } else {
          toast({ title: "Error", description: "Failed to add mountain.", variant: "destructive" })
        }
      } catch (err: any) {
        setError("Failed to add mountain: " + err.message)
        toast({ title: "Error", description: "Failed to add mountain: " + err.message, variant: "destructive" })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700 rounded-xl shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-light text-ink-800 dark:text-cream-100">Add New Mountain</DialogTitle>
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
              placeholder="e.g., Special Activities & Experiences"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending} className="bg-logo-blue hover:bg-blue-700 text-white">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Mountain"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
