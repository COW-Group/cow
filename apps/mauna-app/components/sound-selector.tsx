"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Settings,
  Music,
  Plus,
  Sparkles,
  Mic,
  CloudRain,
  Sailboat,
  Flame,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AddMusicDialog } from "./add-music-dialog"
import { SoundSettingsDialog } from "./sound-settings-dialog"
import type { Sound, ActiveSound } from "@/types/sound"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const SOUNDSCAPES: Sound[] = [
  {
    id: "rain",
    name: "Rainfall",
    description: "Gentle rain on leaves",
    url: "/sounds/rain.mp3",
    icon: "🌧️",
    lucideIcon: CloudRain,
    parameters: [
      { id: "rainIntensity", label: "Intensity", lucideIcon: "CloudRain", value: 50, min: 0, max: 100 },
      { id: "umbrellaEffect", label: "Umbrella", lucideIcon: "Umbrella", value: 50, min: 0, max: 100 },
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Rhythmic waves on shore",
    url: "/sounds/ocean.mp3",
    icon: "🌊",
    lucideIcon: Sailboat,
    parameters: [
      { id: "boat", label: "Boat", lucideIcon: "Sailboat", value: 50, min: 0, max: 100 },
      { id: "waves", label: "Waves", lucideIcon: "Waves", value: 50, min: 0, max: 100 },
      { id: "seagulls", label: "Seagulls", lucideIcon: "Bird", value: 50, min: 0, max: 100 },
      { id: "wind", label: "Wind", lucideIcon: "Wind", value: 50, min: 0, max: 100 },
      { id: "tide", label: "Tide", lucideIcon: "Tide", value: 50, min: 0, max: 100 },
    ],
  },
  {
    id: "campfire",
    name: "Campfire",
    description: "Crackling fire sounds",
    url: "/sounds/fire.mp3",
    icon: "🔥",
    lucideIcon: Flame,
    parameters: [
      { id: "fireIntensity", label: "Fire", lucideIcon: "Flame", value: 50, min: 0, max: 100 },
      { id: "tentEffect", label: "Tent", lucideIcon: "Tent", value: 50, min: 0, max: 100 },
    ],
  },
  {
    id: "noise",
    name: "Noise",
    description: "White noise for focus",
    url: "/sounds/noise.mp3",
    icon: "📺",
    lucideIcon: Music,
  },
  {
    id: "binaural",
    name: "Binaural",
    description: "Binaural beats for relaxation",
    url: "/sounds/binaural.mp3",
    icon: "〰️",
    lucideIcon: Music,
  },
  {
    id: "beach",
    name: "Beach",
    description: "Relaxing beach ambiance",
    url: "/sounds/beach.mp3",
    icon: "🏖️",
    lucideIcon: Music,
  },
  {
    id: "train",
    name: "Train",
    description: "Rhythmic train sounds",
    url: "/sounds/train.mp3",
    icon: "🚂",
    lucideIcon: Music,
  },
  {
    id: "forest",
    name: "Forest",
    description: "Birds and rustling leaves",
    url: "/sounds/forest.mp3",
    icon: "🌲",
    lucideIcon: Music,
  },
  {
    id: "garden",
    name: "Garden",
    description: "Peaceful garden sounds",
    url: "/sounds/garden.mp3",
    icon: "🌸",
    lucideIcon: Music,
  },
  {
    id: "cafe",
    name: "Cafe",
    description: "Coffee shop ambiance",
    url: "sounds/cafe.mp3",
    icon: "☕",
    lucideIcon: Music,
  },
  {
    id: "thunderstorm",
    name: "Thunderstorm",
    description: "Distant thunder and rain",
    url: "/sounds/thunderstorm.mp3",
    icon: "⛈️",
    lucideIcon: Music,
  },
  {
    id: "creek",
    name: "Creek",
    description: "Gentle flowing water",
    url: "/sounds/creek.mp3",
    icon: "🏞️",
    lucideIcon: Music,
  },
  {
    id: "office",
    name: "Office",
    description: "Subtle office background noise",
    url: "/sounds/office.mp3",
    icon: "🏢",
    lucideIcon: Music,
  },
  {
    id: "silence",
    name: "Silence",
    description: "Pure quiet for deep focus",
    url: "",
    icon: "🤫",
    lucideIcon: Music,
  },
]

interface SoundSelectorProps {
  iconColor?: string
}

export function SoundSelector({ iconColor = 'text-gray-700' }: SoundSelectorProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddMusicOpen, setIsAddMusicOpen] = useState(false)
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false)
  const [selectedSoundForSettings, setSelectedSoundForSettings] = useState<Sound | null>(null)

  const [activeSounds, setActiveSounds] = useState<Map<string, ActiveSound>>(new Map())
  const [globalVolume, setGlobalVolume] = useState([50])
  const [isPlayingGlobally, setIsPlayingGlobally] = useState(false)
  const [currentTab, setCurrentTab] = useState("soundscapes")

  // Debugging log for dialog state changes
  useEffect(() => {
    console.log("isDialogOpen state changed to:", isDialogOpen)
  }, [isDialogOpen])

  const handleAudioEnded = useCallback(
    (event: Event) => {
      const audio = event.target as HTMLAudioElement
      const soundId = Array.from(activeSounds.entries()).find(([, val]) => val.audioElement === audio)?.[0]
      if (soundId) {
        setActiveSounds((prev) => {
          const newMap = new Map(prev)
          newMap.delete(soundId)
          return newMap
        })
        if (activeSounds.size === 1) {
          setIsPlayingGlobally(false)
        }
      }
    },
    [activeSounds],
  )

  const stopAllSounds = useCallback(() => {
    activeSounds.forEach((activeSound) => {
      if (activeSound.audioElement) {
        activeSound.audioElement.pause()
        activeSound.audioElement.removeEventListener("ended", handleAudioEnded)
      }
    })
    setActiveSounds(new Map())
    setIsPlayingGlobally(false)
    toast({ title: "All Sounds Stopped", description: "All background sounds stopped." })
  }, [activeSounds, handleAudioEnded, toast])

  // Effect to manage global volume for all active sounds
  useEffect(() => {
    activeSounds.forEach((activeSound) => {
      if (activeSound.audioElement) {
        activeSound.audioElement.volume = (activeSound.currentVolume / 100) * (globalVolume[0] / 100)
      }
    })
  }, [globalVolume, activeSounds])

  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      activeSounds.forEach((activeSound) => {
        if (activeSound.audioElement) {
          activeSound.audioElement.pause()
          activeSound.audioElement.removeEventListener("ended", handleAudioEnded)
        }
      })
    }
  }, [activeSounds, handleAudioEnded])

  const playSound = useCallback(
    async (sound: Sound, initialVolume = 50) => {
      if (sound.id === "silence") {
        stopAllSounds()
        toast({ title: "Silence Selected 🤫", description: "Enjoying the quiet for deep focus" })
        return
      }

      if (activeSounds.has(sound.id)) {
        // If sound is already active, open its settings
        setSelectedSoundForSettings(activeSounds.get(sound.id)!)
        setIsSoundSettingsOpen(true)
        return
      }

      try {
        const audio = new Audio(sound.url)
        audio.loop = true
        audio.volume = (initialVolume / 100) * (globalVolume[0] / 100)
        audio.addEventListener("ended", handleAudioEnded)

        await audio.play()

        setActiveSounds((prev) => {
          const newMap = new Map(prev)
          newMap.set(sound.id, { ...sound, audioElement: audio, currentVolume: initialVolume })
          return newMap
        })
        setIsPlayingGlobally(true)
        toast({ title: `${sound.icon} ${sound.name}`, description: `Now playing: ${sound.description}` })
      } catch (error) {
        console.error("Audio playback error:", error)
        toast({
          title: "Audio Error",
          description: "Failed to play sound. Please ensure audio files exist at the specified URLs.",
          variant: "destructive",
        })
        setIsPlayingGlobally(false)
      }
    },
    [activeSounds, globalVolume, handleAudioEnded, toast, stopAllSounds],
  )

  const pauseSound = useCallback(
    (soundId: string) => {
      const activeSound = activeSounds.get(soundId)
      if (activeSound?.audioElement) {
        activeSound.audioElement.pause()
      }
    },
    [activeSounds],
  )

  const resumeSound = useCallback(
    (soundId: string) => {
      const activeSound = activeSounds.get(soundId)
      if (activeSound?.audioElement) {
        activeSound.audioElement.play()
      }
    },
    [activeSounds],
  )

  const stopSound = useCallback(
    (soundId: string) => {
      const activeSound = activeSounds.get(soundId)
      if (activeSound?.audioElement) {
        activeSound.audioElement.pause()
        activeSound.audioElement.removeEventListener("ended", handleAudioEnded)
      }
      setActiveSounds((prev) => {
        const newMap = new Map(prev)
        newMap.delete(soundId)
        return newMap
      })
      if (activeSounds.size === 1 && activeSounds.has(soundId)) {
        setIsPlayingGlobally(false)
      }
      toast({ title: "Sound Stopped", description: `${activeSound?.name} stopped.` })
    },
    [activeSounds, handleAudioEnded, toast],
  )

  const toggleGlobalPlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log("Toggle global play/pause clicked. Current isPlayingGlobally:", isPlayingGlobally)
    if (activeSounds.size === 0) {
      setIsDialogOpen(true) // Open dialog if no sound is selected
      console.log("No active sounds, opening dialog.")
      return
    }

    if (isPlayingGlobally) {
      activeSounds.forEach((activeSound) => activeSound.audioElement?.pause())
      setIsPlayingGlobally(false)
      toast({ title: "All Sounds Paused", description: "Background sounds paused" })
    } else {
      activeSounds.forEach((activeSound) => activeSound.audioElement?.play())
      setIsPlayingGlobally(true)
      toast({ title: "All Sounds Resumed", description: "Background sounds resumed" })
    }
  }

  const handleIndividualVolumeChange = useCallback(
    (soundId: string, newVolume: number[]) => {
      setActiveSounds((prev) => {
        const newMap = new Map(prev)
        const activeSound = newMap.get(soundId)
        if (activeSound) {
          activeSound.currentVolume = newVolume[0]
          activeSound.audioElement.volume = (activeSound.currentVolume / 100) * (globalVolume[0] / 100)
        }
        return newMap
      })
    },
    [globalVolume],
  )

  const handleSoundParameterChange = useCallback(
    (soundId: string, paramId: string, value: number[]) => {
      setActiveSounds((prev) => {
        const newMap = new Map(prev)
        const activeSound = newMap.get(soundId)
        if (activeSound && activeSound.parameters) {
          const updatedParameters = activeSound.parameters.map((p) =>
            p.id === paramId ? { ...p, value: value[0] } : p,
          )
          newMap.set(soundId, { ...activeSound, parameters: updatedParameters })
        }
        return newMap
      })
      toast({
        title: "Parameter Changed",
        description: `Sound: ${soundId}, Parameter: ${paramId}, Value: ${value[0]}`,
        duration: 1000,
      })
    },
    [toast],
  )

  const handleGenerateAICustomMusic = async () => {
    toast({
      title: "Generating AI Music...",
      description: "This is a simulated generation. Actual audio output requires backend integration.",
      duration: 3000,
    })
    try {
      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt:
          "Generate a short description for a calming AI-generated focus music track. Include elements like 'ambient pads', 'gentle piano', and 'subtle nature sounds'.",
      })
      toast({
        title: "AI Music Generated (Simulated)",
        description: `Description: ${text}`,
        duration: 5000,
      })
    } catch (error) {
      console.error("AI music generation error:", error)
      toast({
        title: "AI Music Generation Failed",
        description: "Could not generate AI music. Check API key and network.",
        variant: "destructive",
      })
    }
  }

  const firstActiveSound = activeSounds.values().next().value as ActiveSound | undefined

  const renderPillContent = () => {
    if (!firstActiveSound) {
      return (
        <div className="flex items-center justify-center group">
          <Music className={`h-5 w-5 ${iconColor} transition-colors duration-200`} />
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg animate-pulse">{firstActiveSound.icon}</span>
            <div className={`text-xs font-inter font-medium ${iconColor} hidden sm:block max-w-20 truncate`}>
              {firstActiveSound.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleGlobalPlayPause}
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${iconColor} hover:bg-gray-200/30 rounded-full transition-all duration-200 hover:scale-105`}
              aria-label={isPlayingGlobally ? "Pause sound" : "Play sound"}
            >
              {isPlayingGlobally ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <div className="flex items-center gap-1.5">
              <Volume2 className={`h-3.5 w-3.5 ${iconColor}`} />
              <Slider
                value={globalVolume}
                onValueChange={setGlobalVolume}
                max={100}
                step={1}
                className="flex-1 w-12 [&>span:first-child]:h-0.5 [&>span:first-child]:bg-gray-300/80 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-gray-700 [&>span:first-child>span]:h-2 [&>span:first-child>span]:w-2 [&>span:first-child>span]:-mt-0.5 [&>span:first-child>span]:rounded-full [&>span:first-child>span]:transition-all [&>span:first-child>span]:hover:scale-110"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Volume: ${globalVolume[0]}%`}
              />
              <span className={`text-xs ${iconColor} font-inter w-6 text-right`}>
                {globalVolume[0]}
              </span>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out font-inter",
              "text-gray-700",
              "hover:bg-gray-100/50",
              {
                "h-10 w-10 justify-center": !firstActiveSound,
                "h-10 w-48 justify-between px-3": firstActiveSound,
              },
            )}
            style={{
              background: 'transparent',
              backdropFilter: 'none',
              border: 'none',
              boxShadow: 'none',
            }}
            onClick={() => {
              console.log("DialogTrigger div clicked. This should open the dialog.")
            }}
          >
            {renderPillContent()}
          </div>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-3xl max-h-[85vh] border-0 p-0 overflow-hidden flex flex-col"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(40px) saturate(180%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 16px 64px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06)'
          }}
        >
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-inter font-normal tracking-tight flex items-center justify-between text-gray-900">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  <Music className="h-5 w-5 text-blue-600" />
                </div>
                <span>Sound Selection</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddMusicOpen(true)}
                className="text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2 font-inter font-medium transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Music
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-4 flex-1 overflow-y-auto">
            <Tabs defaultValue="soundscapes" className="w-full h-full flex flex-col" onValueChange={setCurrentTab}>
              <TabsList
                className="grid w-full grid-cols-4 h-12 p-1 rounded-xl border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <TabsTrigger
                  value="soundscapes"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-inter font-medium transition-all duration-200 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Soundscapes
                </TabsTrigger>
                <TabsTrigger
                  value="now-playing"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-inter font-medium transition-all duration-200 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Playing ({activeSounds.size})
                </TabsTrigger>
                <TabsTrigger
                  value="ai-custom-focus-music"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-inter font-medium transition-all duration-200 data-[state=active]:text-gray-900 text-gray-600"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  AI Music
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm font-inter font-medium transition-all duration-200 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Custom
                </TabsTrigger>
              </TabsList>

            <TabsContent value="recent" className="mt-4">
              <p className="text-center text-muted-foreground">Recently played sounds will appear here.</p>
            </TabsContent>

              <TabsContent value="soundscapes" className="mt-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-6 max-h-[50vh] overflow-y-auto pr-2">
                  {SOUNDSCAPES.map((sound) => (
                    <Card
                      key={sound.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 border-0 overflow-hidden group relative",
                        activeSounds.has(sound.id) && "ring-2 ring-blue-500"
                      )}
                      style={{
                        background: activeSounds.has(sound.id)
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)'
                          : 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        border: activeSounds.has(sound.id)
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: activeSounds.has(sound.id)
                          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(59, 130, 246, 0.1)'
                          : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.03)'
                      }}
                      onClick={() => playSound(sound)}
                    >
                      {/* Active Sound Indicator */}
                      {activeSounds.has(sound.id) && (
                        <div className="absolute top-2 right-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        </div>
                      )}

                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200 select-none">
                          {sound.icon}
                        </div>
                        <h3 className="font-inter font-medium text-sm mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {sound.name}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                          {sound.description}
                        </p>

                        {/* Quick Action Hint */}
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="text-xs text-blue-600 font-inter font-medium">
                            {activeSounds.has(sound.id) ? 'Tap to configure' : 'Tap to play'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

            <TabsContent value="spotify" className="mt-4">
              <p className="text-center text-muted-foreground">
                Spotify integration coming soon. Use the "Add" button to paste links.
              </p>
            </TabsContent>

            <TabsContent value="youtube" className="mt-4">
              <p className="text-center text-muted-foreground">
                YouTube integration coming soon. Use the "Add" button to paste links.
              </p>
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <p className="text-center text-muted-foreground">Upload your custom sounds here.</p>
            </TabsContent>

              <TabsContent value="now-playing" className="mt-6 flex-1 overflow-y-auto">
                {activeSounds.size === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎵</div>
                    <p className="text-gray-600 text-sm">No sounds are currently playing</p>
                    <p className="text-gray-500 text-xs mt-1">Select a soundscape to begin</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-6 max-h-[50vh] overflow-y-auto pr-2">
                    {Array.from(activeSounds.values()).map((activeSound) => (
                      <Card
                        key={activeSound.id}
                        className="border-0"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(20px) saturate(150%)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 16px rgba(59, 130, 246, 0.06)'
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{activeSound.icon}</span>
                              <div>
                                <h3 className="font-inter font-medium text-gray-900">{activeSound.name}</h3>
                                <p className="text-sm text-gray-600">{activeSound.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() =>
                                  activeSound.audioElement.paused
                                    ? resumeSound(activeSound.id)
                                    : pauseSound(activeSound.id)
                                }
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
                              >
                                {activeSound.audioElement.paused ? (
                                  <Play className="h-4 w-4" />
                                ) : (
                                  <Pause className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                onClick={() => stopSound(activeSound.id)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                              >
                                <VolumeX className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => {
                                  setSelectedSoundForSettings(activeSound)
                                  setIsSoundSettingsOpen(true)
                                }}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Volume2 className="h-4 w-4 text-gray-600" />
                            <Slider
                              value={[activeSound.currentVolume]}
                              onValueChange={(val) => handleIndividualVolumeChange(activeSound.id, val)}
                              max={100}
                              step={1}
                              className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-300 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-blue-600 [&>span:first-child>span]:h-3 [&>span:first-child>span]:w-3 [&>span:first-child>span]:-mt-1 [&>span:first-child>span]:rounded-full"
                            />
                            <span className="text-sm text-gray-600 font-inter font-medium w-12 text-right">
                              {activeSound.currentVolume}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

            <TabsContent value="ai-guide-voice" className="mt-4">
              <p className="text-center text-muted-foreground">
                AI-powered guided voice sessions for focus and meditation. (Coming Soon)
              </p>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" className="text-logo-blue">
                  Explore AI Guides
                </Button>
              </div>
            </TabsContent>

              <TabsContent value="ai-custom-focus-music" className="mt-6">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-lg font-inter font-medium text-gray-900 mb-3">AI Custom Focus Music</h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    Generate personalized focus music tailored to your current mood and productivity needs using advanced AI.
                  </p>
                  <Button
                    onClick={handleGenerateAICustomMusic}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2.5 font-inter font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Custom Music
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-6">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎧</div>
                  <h3 className="text-lg font-inter font-medium text-gray-900 mb-3">Custom Sounds</h3>
                  <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                    Upload your own audio files or add music from streaming services.
                  </p>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6 py-2.5 font-inter font-medium transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Sound
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Music Dialog */}
      <AddMusicDialog
        isOpen={isAddMusicOpen}
        onOpenChange={setIsAddMusicOpen}
        onBack={() => setIsAddMusicOpen(false)}
      />

      {/* Sound Settings Dialog */}
      {selectedSoundForSettings && (
        <SoundSettingsDialog
          isOpen={isSoundSettingsOpen}
          onOpenChange={setIsSoundSettingsOpen}
          onBack={() => {
            setIsSoundSettingsOpen(false)
            setSelectedSoundForSettings(null) // Clear selected sound when closing settings
          }}
          sound={selectedSoundForSettings}
          onParameterChange={handleSoundParameterChange}
        />
      )}

      {/* Display current sound name below the header player */}
      {firstActiveSound && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 text-cream-25 text-sm font-inter">
          {firstActiveSound.name}
        </div>
      )}
    </>
  )
}
