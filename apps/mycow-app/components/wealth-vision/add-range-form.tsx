"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { addRange } from "@/app/actions/wealth-vision-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function AddRangeForm() {
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      toast({ title: "Error", description: "Range title cannot be empty.", variant: "destructive" })
      return
    }

    startTransition(async () => {
      const newRange = await addRange(title)
      if (newRange) {
        toast({ title: "Success", description: `Range "${newRange.title}" added.` })
        setTitle("") // Reset form
      } else {
        toast({ title: "Error", description: "Failed to add range.", variant: "destructive" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 my-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Range Title"
        disabled={isPending}
        className="max-w-xs"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add Range"}
      </Button>
    </form>
  )
}
