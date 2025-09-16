"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Eye, Folders, Volume2, Clock, BookOpen, Waves } from "lucide-react"

interface MenuSectionProps {
  openCompletedTasks: () => void
  openVisionBoard: () => void
  openTaskListManager: () => void
  openAudioSettings: () => void
  openTaskPreferences: () => void
  openBubbles: () => void
}

export function MenuSection({
  openCompletedTasks,
  openVisionBoard,
  openTaskListManager,
  openAudioSettings,
  openTaskPreferences,
  openBubbles,
}: MenuSectionProps) {
  return (
    <Card className="overflow-hidden mx-auto max-w-2xl">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openCompletedTasks}>
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Completed</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openVisionBoard}>
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Vision Board</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openTaskListManager}>
            <Folders className="h-4 w-4" />
            <span className="hidden sm:inline">Task Lists</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openAudioSettings}>
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Audio</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openTaskPreferences}>
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center"
            onClick={() => (window.location.href = "/journal")}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Journal</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2 justify-center" onClick={openBubbles}>
            <Waves className="h-4 w-4" />
            <span className="hidden sm:inline">Bubbles</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
