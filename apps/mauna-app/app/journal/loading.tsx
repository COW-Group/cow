"use client"

import { Loader2 } from "lucide-react"

export default function JournalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-vibrant-blue mx-auto" />
        <p className="text-muted-foreground zen-body">Loading journal...</p>
      </div>
    </div>
  )
}
