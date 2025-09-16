"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { JournalEntry, VisionBoardSection } from "@/lib/types"

interface JournalEntryFormProps {
  initialData?: JournalEntry | null
  onSave: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "isArchived" | "isFavorite">,
    isNew: boolean,
  ) => void
  onCancel: () => void
  visionBoardItems: VisionBoardSection[]
  visionBoardLevel?: JournalEntry["visionBoardLevel"]
  visionBoardItemId?: string | null
  visionBoardItemTitle?: string | null
}

export function JournalEntryForm({ initialData, onSave, onCancel, visionBoardLevel, visionBoardItemId, visionBoardItemTitle }: JournalEntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [entry, setEntry] = useState(initialData?.entry || "")

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setEntry(initialData.entry || "")
    } else {
      setTitle("")
      setEntry("")
    }
  }, [initialData])

  const handleSubmit = () => {
    const entryToSave: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "isArchived" | "isFavorite"> = {
      title,
      entry, // Changed from content to entry
      category: "inbox",
      visionBoardLevel: visionBoardLevel || null,
      visionBoardItemId: visionBoardItemId || null,
      visionBoardItemTitle: visionBoardItemTitle || null,
      tags: [],
    }
    onSave(entryToSave, !initialData)
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Entry title..." value={title} onChange={(e) => setTitle(e.target.value)} />

      <Textarea
        placeholder="Write your thoughts..."
        value={entry} // Changed from content to entry
        onChange={(e) => setEntry(e.target.value)}
        rows={8}
        className="resize-none"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{initialData ? "Update" : "Save"} Entry</Button>
      </div>
    </div>
  )
}