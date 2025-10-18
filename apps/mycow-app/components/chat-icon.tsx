"use client"

import { MessageCircle } from "lucide-react"
import { useCopilot } from "@/contexts/copilot-context"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatIconProps {
  onOpenChat: () => void
}

export function ChatIcon({ onOpenChat }: ChatIconProps) {
  console.log("ChatIcon rendered")
  const { settings } = useCopilot()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onOpenChat}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-600 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 focus:scale-110 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open financial copilot chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="mb-2">
          <p>Chat with {settings.name} via text or voice</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
