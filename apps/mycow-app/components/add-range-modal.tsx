"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2 } from "lucide-react"

interface AddRangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string) => Promise<void>
}

export function AddRangeModal({ isOpen, onClose, onSave }: AddRangeModalProps) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Range title cannot be empty.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onSave(title)
      setTitle("") // Clear input on success
      onClose()
    } catch (err: any) {
      setError("Failed to add range: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700 rounded-xl shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-light text-ink-800 dark:text-cream-100">Add New Range</DialogTitle>
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
              placeholder="e.g., Financial Freedom"
            />
          </div>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading} className="bg-logo-blue hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Range"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
