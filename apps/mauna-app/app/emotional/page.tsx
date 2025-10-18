"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Waves, Heart, BookOpen, Vault, Zap, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { TriggerForm } from "@/components/trigger-form"
import { ExperienceForm } from "@/components/experience-form"
import { VaultDecision } from "@/components/vault-decision"
import { MindfulSitting } from "@/components/mindful-sitting"
import { RespondForm } from "@/components/respond-form"
import { EmotionLog } from "@/components/emotion-log"
import { emotionService, type Emotion } from "@/lib/emotion-service"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { FloatingNav } from "@/components/floating-nav"

export default function EmotionalPage() {
  const [activeTab, setActiveTab] = useState("trigger")
  const [currentEmotionId, setCurrentEmotionId] = useState<string | null>(null)
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null)
  const [loadingEmotion, setLoadingEmotion] = useState(false)
  const [refreshLog, setRefreshLog] = useState(0)
  const [isLogSheetOpen, setIsLogSheetOpen] = useState(false)

  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const { isEncryptionReady } = useEncryption()
  const { toast } = useToast()

  // Load current emotion if there's an ID or if user changes
  useEffect(() => {
    const userIdToUse = user?.id

    const storedEmotionId = localStorage.getItem("currentEmotionId")
    if (storedEmotionId) {
      setCurrentEmotionId(storedEmotionId)
    } else {
      setCurrentEmotion(null)
    }
  }, [user, authLoading])

  useEffect(() => {
    const loadEmotion = async () => {
      const userIdToUse = user?.id
      if (currentEmotionId && userIdToUse) {
        setLoadingEmotion(true)
        try {
          const emotion = await emotionService.getEmotionById(currentEmotionId, userIdToUse)
          if (emotion) {
            setCurrentEmotion(emotion)
            setActiveTab(emotion.current_step || "trigger")
          } else {
            setCurrentEmotionId(null)
            setCurrentEmotion(null)
            localStorage.removeItem("currentEmotionId")
            toast({
              title: "Emotion Not Found",
              description: "The previous emotion could not be loaded. Starting fresh.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error loading current emotion:", error)
          toast({
            title: "Error",
            description: "Failed to load your emotion data.",
            variant: "destructive",
          })
          setCurrentEmotionId(null)
          setCurrentEmotion(null)
          localStorage.removeItem("currentEmotionId")
        } finally {
          setLoadingEmotion(false)
        }
      }
    }
    loadEmotion()
  }, [currentEmotionId, user, toast])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!authLoading && user && !isEncryptionReady) {
      console.log("[EmotionalPage] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [user, authLoading, isEncryptionReady, router])

  const startNewEmotion = async () => {
    const userIdToUse = user?.id
    if (!userIdToUse) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start a new emotional process.",
        variant: "destructive",
      })
      return
    }

    setLoadingEmotion(true)
    try {
      const newEmotion = await emotionService.createEmotion({
        user_id: userIdToUse,
        current_step: "experience",
      })
      setCurrentEmotionId(newEmotion.id)
      setCurrentEmotion(newEmotion)
      localStorage.setItem("currentEmotionId", newEmotion.id)
      setActiveTab("trigger")
      setRefreshLog((prev) => prev + 1)
    } catch (error) {
      console.error("Error creating new emotion:", error)
      toast({
        title: "Error",
        description: "Failed to start a new emotional process.",
        variant: "destructive",
      })
    } finally {
      setLoadingEmotion(false)
    }
  }

  const updateCurrentEmotionAndTab = useCallback(
    async (updates: Partial<Emotion>, nextTab: string) => {
      const userIdToUse = user?.id
      if (!userIdToUse || !currentEmotion) return

      setLoadingEmotion(true)
      try {
        const updatedEmotion = await emotionService.updateEmotion(currentEmotion.id, {
          ...updates,
          current_step: nextTab as Emotion["current_step"],
        })
        setCurrentEmotion(updatedEmotion)
        setActiveTab(nextTab)
        setRefreshLog((prev) => prev + 1)
      } catch (error) {
        console.error("Error updating emotion:", error)
        toast({
          title: "Error",
          description: "Failed to save your progress.",
          variant: "destructive",
        })
      } finally {
        setLoadingEmotion(false)
      }
    },
    [user, currentEmotion, toast],
  )

  const handleTriggerComplete = (triggerData: { context: string; event: string; worldview: string }) => {
    updateCurrentEmotionAndTab(
      {
        trigger_context: triggerData.context,
        trigger_event: triggerData.event,
        trigger_worldview: triggerData.worldview,
      },
      "vault",
    )
  }

  const handleExperienceComplete = (experienceData: {
    emotion: string
    category: string
    sensations: string
    subjectiveFeelings: string
  }) => {
    updateCurrentEmotionAndTab(
      {
        emotion_name: experienceData.emotion,
        emotion_category: experienceData.category,
        physical_sensations: experienceData.sensations,
        subjective_feelings: experienceData.subjectiveFeelings,
      },
      "trigger",
    )
  }

  const handleVaultContinue = (isPainBox: boolean) => {
    updateCurrentEmotionAndTab(
      {
        is_pain_box: isPainBox,
        is_vaulted: false,
      },
      "sit",
    )
  }

  const handleVaultDrop = async () => {
    const userIdToUse = user?.id
    if (!userIdToUse || !currentEmotion) return

    setLoadingEmotion(true)
    try {
      await emotionService.updateEmotion(currentEmotion.id, {
        is_vaulted: true,
        is_processed: false, // Set to false when stored for later
        current_step: "processed", // Still mark as processed in terms of flow completion
      })

      toast({
        title: "Emotion Stored",
        description: "Your emotion has been stored in the vault for later processing.",
      })

      setCurrentEmotionId(null)
      setCurrentEmotion(null)
      localStorage.removeItem("currentEmotionId")
      setActiveTab("trigger")
      setRefreshLog((prev) => prev + 1)
    } catch (error) {
      console.error("Error storing emotion:", error)
      toast({
        title: "Error",
        description: "Failed to store your emotion.",
        variant: "destructive",
      })
    } finally {
      setLoadingEmotion(false)
    }
  }

  const handleSittingComplete = (reflection: string) => {
    updateCurrentEmotionAndTab(
      {
        notes: reflection,
      },
      "respond",
    )
  }

  const handleRespondComplete = async (responseData: {
    reflection: string
    response: string
    isConstructive: boolean
    painBoxReasons?: string[]
  }) => {
    const userIdToUse = user?.id
    if (!userIdToUse || !currentEmotion) return

    setLoadingEmotion(true)
    try {
      await emotionService.updateEmotion(currentEmotion.id, {
        reflection: responseData.reflection,
        response: responseData.response,
        is_constructive: responseData.isConstructive,
        pain_box_reasons: responseData.painBoxReasons,
        is_processed: true,
        current_step: "processed",
      })

      toast({
        title: "Emotion Processed",
        description: "You've successfully processed this emotion.",
      })

      setCurrentEmotionId(null)
      setCurrentEmotion(null)
      localStorage.removeItem("currentEmotionId")
      setActiveTab("trigger")
      setRefreshLog((prev) => prev + 1)
    } catch (error) {
      console.error("Error finalizing emotion:", error)
      toast({
        title: "Error",
        description: "Failed to complete your emotional processing.",
        variant: "destructive",
      })
    } finally {
      setLoadingEmotion(false)
    }
  }

  const renderContent = () => {
    if (authLoading || loadingEmotion) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      )
    }

    // If user is not logged in, prompt them to sign in
    if (!user) {
      return (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-200/30 dark:border-blue-700/30 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold mb-4">Please sign in to access the Emotional Processing features.</p>
          <Button onClick={() => router.push("/auth/signin")} className="bg-vibrant-blue hover:bg-vibrant-blue/90">
            Sign In
          </Button>
        </div>
      )
    }

    switch (activeTab) {
      case "experience":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-200/30 dark:border-blue-700/30 rounded-lg p-6">
            {!currentEmotion ? (
              <div className="text-center p-8">
                <Button onClick={startNewEmotion} className="bg-vibrant-blue hover:bg-vibrant-blue/90">
                  Start New Emotional Process
                </Button>
              </div>
            ) : (
              <ExperienceForm
                onComplete={handleExperienceComplete}
                initialData={
                  currentEmotion
                    ? {
                        emotion: currentEmotion.emotion_name || "",
                        category: currentEmotion.emotion_category || "",
                        sensations: currentEmotion.physical_sensations || "",
                        subjectiveFeelings: currentEmotion.subjective_feelings || "",
                      }
                    : undefined
                }
              />
            )}
          </div>
        )
      case "trigger":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg">
            {currentEmotion && currentEmotion.emotion_name ? (
              <TriggerForm
                onComplete={handleTriggerComplete}
                initialData={
                  currentEmotion
                    ? {
                        context: currentEmotion.trigger_context || "",
                        event: currentEmotion.trigger_event || "",
                        worldview: currentEmotion.trigger_worldview || "",
                      }
                    : undefined
                }
              />
            ) : (
              <div className="p-8 text-center">
                <p>Please complete the Experience step first.</p>
              </div>
            )}
          </div>
        )
      case "vault":
        return (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-blue-200/30 dark:border-blue-700/30">
              {currentEmotion && currentEmotion.emotion_name ? (
                <VaultDecision
                  emotion={{
                    name: currentEmotion.emotion_name,
                    category: currentEmotion.emotion_category || "unknown",
                  }}
                  onContinue={handleVaultContinue}
                  onDrop={handleVaultDrop}
                />
              ) : (
                <div className="p-8 text-center">
                  <p>Please complete the Experience step first.</p>
                </div>
              )}
            </div>
          </div>
        )
      case "sit":
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-blue-200/30 dark:border-blue-700/30 p-6">
              {currentEmotion && currentEmotion.emotion_name ? (
                <MindfulSitting
                  selectedEmotion={currentEmotion.emotion_name}
                  onReflectionComplete={handleSittingComplete}
                />
              ) : (
                <div className="p-8 text-center">
                  <p>Please complete the Vault step first.</p>
                </div>
              )}
            </div>
          </div>
        )
      case "respond":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-200/30 dark:border-blue-700/30 rounded-lg">
            {currentEmotion && currentEmotion.emotion_name && currentEmotion.trigger_event ? (
              <RespondForm
                emotion={{
                  name: currentEmotion.emotion_name,
                  category: currentEmotion.emotion_category || "unknown",
                }}
                triggerData={{
                  context: currentEmotion.trigger_context || "",
                  event: currentEmotion.trigger_event || "",
                  worldview: currentEmotion.trigger_worldview || "",
                }}
                isPainBox={currentEmotion.is_pain_box || false}
                onComplete={handleRespondComplete}
              />
            ) : (
              <div className="p-8 text-center">
                <p>Please complete the Sit step first.</p>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative">
      <FloatingNav />

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            {/* Glassmorphic wrapper for the main heading */}
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-black/20 max-w-fit mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream-25 zen-heading">
                What's surfacing for you?
              </h1>
            </div>
            {/* Glassmorphic caption */}
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg p-4 border border-white/20 dark:border-black/20 max-w-2xl mx-auto mt-4">
              <p className="text-lg text-cream-25 font-caveat">
                A sacred space for emotional exploration and processing. All feelings are welcome here - they are
                messengers with wisdom to share.
              </p>
            </div>
            {/* Action buttons with glassmorphic background */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {currentEmotion && (
                <Button
                  onClick={() => router.push(`/journal/new?source=emotional&emotionId=${currentEmotion.id}`)}
                  className="flex items-center gap-2 text-cream-25
                             bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg border border-white/20 dark:border-black/20
                             px-4 py-2 hover:bg-white/20 dark:hover:bg-black/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  Journal Reflection
                </Button>
              )}
              <Button
                onClick={() => setIsLogSheetOpen(true)}
                className="flex items-center gap-2 text-cream-25
                           bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg border border-white/20 dark:border-black/20
                           px-4 py-2 hover:bg-white/20 dark:hover:bg-black/20"
              >
                <BookOpen className="w-4 h-4" />
                Log
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="trigger" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Trigger
              </TabsTrigger>
              <TabsTrigger value="vault" className="flex items-center gap-2">
                <Vault className="w-4 h-4" />
                Vault
              </TabsTrigger>
              <TabsTrigger value="sit" className="flex items-center gap-2">
                <Waves className="w-4 h-4" />
                Sit
              </TabsTrigger>
              <TabsTrigger value="respond" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Respond
              </TabsTrigger>
            </TabsList>

            {renderContent()}
          </Tabs>
        </div>
      </div>

      <EmotionLog isOpen={isLogSheetOpen} onClose={() => setIsLogSheetOpen(false)} key={refreshLog} />
    </div>
  )
}
