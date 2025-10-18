"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { parseISO } from "date-fns"

interface BirthdayEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentBirthday: string | null
  onSave: (birthday: string) => void
}

export function BirthdayEditModal({ isOpen, onClose, currentBirthday, onSave }: BirthdayEditModalProps) {
  const [birthdayInput, setBirthdayInput] = useState<string>(currentBirthday || "")

  useEffect(() => {
    setBirthdayInput(currentBirthday || "")
  }, [currentBirthday])

  const handleSave = () => {
    if (birthdayInput && !isNaN(parseISO(birthdayInput).getTime())) {
      onSave(birthdayInput)
      onClose()
    } else {
      alert("Please enter a valid date for your birthday.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700">
        <DialogHeader>
          <DialogTitle className="text-ink-800 dark:text-cream-100">Edit Birthday</DialogTitle>
          <DialogDescription className="text-ink-600 dark:text-cream-300">
            Enter your birth date to automatically calculate your age on the timeline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthday" className="text-right text-ink-600 dark:text-cream-300">
              Birthday
            </Label>
            <Input
              id="birthday"
              type="date"
              value={birthdayInput}
              onChange={(e) => setBirthdayInput(e.target.value)}
              className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} className="bg-logo-blue hover:bg-blue-700 text-white">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
