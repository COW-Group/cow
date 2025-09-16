"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Vault, ArrowRight } from "lucide-react"
import { emotionService, type Emotion } from "@/lib/emotion-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export function EmotionVault() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [vaultedEmotions, setVaultedEmotions] = useState<Emotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !authLoading) {
      fetchVaultedEmotions()
    } else if (!user && !authLoading) {
      setVaultedEmotions([])
      setLoading(false)
    }
  }, [user, authLoading])

  const fetchVaultedEmotions = async () => {
    if (!user) return
    setLoading(true)
    try {
      const allEmotions = await emotionService.getEmotions(user.id)
      const vaulted = allEmotions.filter((e) => e.is_vaulted && !e.is_processed)
      setVaultedEmotions(vaulted)
    } catch (error) {
      console.error("Failed to fetch vaulted emotions:", error)
      toast({
        title: "Error",
        description: "Failed to load vaulted emotions.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContinueProcessing = async (emotionId: string) => {
    if (!user) return
    try {
      await emotionService.updateEmotion(emotionId, { is_vaulted: false, current_step: "sit" })
      toast({
        title: "Emotion Unvaulted",
        description: "You can now continue processing this emotion.",
      })
      fetchVaultedEmotions() // Refresh the list
      // Optionally, navigate to the sit tab or trigger a global state change
    } catch (error) {
      console.error("Failed to unvault emotion:", error)
      toast({
        title: "Error",
        description: "Failed to unvault emotion.",
        variant: "destructive",
      })
    }
  }

  const getEmotionColor = (category: string | null) => {
    const colors: Record<string, string> = {
      joy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      sadness: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      anger: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      fear: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      disgust: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    }
    return colors[category || ""] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 zen-heading">
          <Vault className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Your Emotion Vault
        </CardTitle>
        <CardDescription className="zen-body">
          Emotions you've acknowledged but stored for later processing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : vaultedEmotions.length === 0 ? (
          <p className="text-center text-muted-foreground zen-body">No emotions currently in the vault.</p>
        ) : (
          <div className="grid gap-4">
            {vaultedEmotions.map((emotion) => (
              <Card
                key={emotion.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/30 dark:border-blue-700/30"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-base py-1 px-3 ${getEmotionColor(emotion.emotion_category)}`}>
                      {emotion.emotion_name || "Unnamed"}
                    </Badge>
                    {emotion.is_pain_box && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:text-red-300">
                        Pain Box
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground zen-body">Trigger: {emotion.trigger_event || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    Vaulted on: {format(new Date(emotion.created_at), "PPP")}
                  </p>
                </div>
                <Button
                  onClick={() => handleContinueProcessing(emotion.id)}
                  className="mt-3 sm:mt-0 bg-vibrant-blue hover:bg-vibrant-blue/90 flex items-center gap-2"
                >
                  Continue Processing
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
