import { useRef, useEffect, useCallback } from "react"
import { speakWithGuideVoice, stopSpeech } from "@/lib/speech-synthesis"
import { type GuideType } from "@/contexts/onboarding-context"

interface UseGuideSpeechProps {
  autoPlayText?: string // Optional text for autoplay
  autoPlayGuideType?: GuideType | null // Optional guide type for autoplay
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
}

export const useGuideSpeech = ({
  autoPlayText,
  autoPlayGuideType,
  onSpeechStart,
  onSpeechEnd,
}: UseGuideSpeechProps = {}) => {
  const spokenTextRef = useRef<Set<string>>(new Set()) // Track spoken text globally for this hook instance
  const currentTextRef = useRef<string>("") // Track the last text that was *attempted* to be spoken by this hook

  const speak = useCallback(
    (guideType: GuideType | null, text: string) => {
      if (!text || !guideType) return

      // Check if this exact text has already been spoken by this hook instance
      if (spokenTextRef.current.has(text)) {
        console.log("Speech text already spoken, skipping:", text.substring(0, 50) + "...")
        return
      }

      // Mark this text as spoken immediately
      spokenTextRef.current.add(text)
      currentTextRef.current = text // Update current text reference

      console.log(
        `useGuideSpeech: Calling speakWithGuideVoice for ${guideType} with text: "${text.substring(0, 50)}..."`,
      )

      speakWithGuideVoice(
        text,
        guideType,
        () => {
          onSpeechStart?.()
        },
        () => {
          onSpeechEnd?.()
        },
      )
    },
    [onSpeechStart, onSpeechEnd],
  )

  const stop = useCallback(() => {
    stopSpeech()
  }, [])

  const clearSpokenText = useCallback(() => {
    spokenTextRef.current.clear()
    currentTextRef.current = "" // Also clear the current text reference
    console.log("Cleared spoken text history.")
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (autoPlayText && autoPlayGuideType) {
      // Only attempt to speak if this specific text hasn't been spoken by this hook instance yet
      // The `speak` function itself has the `spokenTextRef.current.has(text)` check,
      // but this outer check prevents unnecessary `setTimeout` and `speak` calls.
      if (!spokenTextRef.current.has(autoPlayText)) {
        const timer = setTimeout(() => {
          speak(autoPlayGuideType, autoPlayText)
        }, 500)

        return () => clearTimeout(timer)
      }
    }
  }, [autoPlayText, autoPlayGuideType, speak])

  // Removed the problematic useEffect that cleared spokenTextRef based on text changes.
  // Clearing will now be handled externally by OnboardingStep.

  // Stop speech when component unmounts (e.g., browser back/forward)
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return { speak, stop, clearSpokenText }
}
