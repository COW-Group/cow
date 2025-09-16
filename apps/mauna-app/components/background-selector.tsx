"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BackgroundSelectorProps {
  currentBackground: string
  onBackgroundChange: (url: string) => void
}

const CURATED_BACKGROUNDS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
    alt: "Misty mountain landscape",
    description: "Serene Mountains",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop",
    alt: "Dense forest path",
    description: "Forest Path",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80&auto=format&fit=crop",
    alt: "Calm lake reflection",
    description: "Tranquil Lake",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80&auto=format&fit=crop",
    alt: "Rolling hills landscape",
    description: "Rolling Hills",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80&auto=format&fit=crop",
    alt: "Ocean waves at sunset",
    description: "Ocean Sunset",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop",
    alt: "Bamboo forest",
    description: "Bamboo Grove",
  },
]

export function BackgroundSelector({ currentBackground, onBackgroundChange }: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBackgroundSelect = async (url: string, description: string) => {
    setIsLoading(true)
    try {
      // Preload the image to ensure it loads properly
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        onBackgroundChange(url)
        setIsOpen(false)
        toast({
          title: "Background Updated ✨",
          description: `Changed to ${description}`,
        })
        setIsLoading(false)
      }
      img.onerror = () => {
        toast({
          title: "Failed to load background",
          description: "Please try another image.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
      img.src = url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change background.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 right-6 z-40 glassmorphism border-sage-400/30 hover:border-sage-400/50 text-sage-600 hover:text-sage-700 dark:text-sage-400 dark:hover:text-sage-300"
          aria-label="Change background"
        >
          <Camera className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl glassmorphism">
        <DialogHeader>
          <DialogTitle className="font-lora zen-heading flex items-center gap-2">
            <Camera className="h-5 w-5 text-logo-blue" />
            Choose Background
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {CURATED_BACKGROUNDS.map((bg) => (
            <Card
              key={bg.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentBackground === bg.url ? "ring-2 ring-logo-blue" : ""
              }`}
              onClick={() => handleBackgroundSelect(bg.url, bg.description)}
            >
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={bg.url || "/placeholder.svg"}
                  alt={bg.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isLoading && currentBackground === bg.url && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-inter text-center">{bg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-inter">Beautiful nature photography from Unsplash</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
