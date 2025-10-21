import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Mic, MicOff, ArrowRight } from "lucide-react"
import { useCopilot } from "../contexts/copilot-context"
import { cn } from "../lib/utils"

interface CopilotSearchBarProps {
  onOpenChat: (query?: string) => void
}

const wealthTopics = [
  "economics",
  "finance",
  "futures",
  "investing",
  "real assets",
  "wealth cycles",
  "tokenization",
  "gold",
  "retirement",
  "passive income"
]

export function CopilotSearchBar({ onOpenChat }: CopilotSearchBarProps) {
  console.log("CopilotSearchBar rendered")
  const { settings } = useCopilot()
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any | null>(null)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rotate topics when not focused
  useEffect(() => {
    if (!isFocused) {
      const interval = setInterval(() => {
        setCurrentTopicIndex((prev) => (prev + 1) % wealthTopics.length)
      }, 2000) // Change topic every 2 seconds
      return () => clearInterval(interval)
    }
  }, [isFocused])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsVoiceSupported(true)
        const rec = new SpeechRecognition()
        rec.continuous = false
        rec.interimResults = false
        rec.lang = "en-US"

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setQuery(transcript)
          onOpenChat(transcript)
        }

        rec.onend = () => {
          setIsListening(false)
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }
        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }

        setRecognition(rec)
      }
    }
  }, [onOpenChat])

  const handleVoiceToggle = () => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
    } else {
      setQuery("")
      recognition.start()
      setIsListening(true)
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onOpenChat(query)
      setQuery("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Rotating topics - visible when not focused */}
      {!isFocused && !query && (
        <div className="mb-3 h-7 flex items-center justify-center">
          <motion.span
            key={currentTopicIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-sm font-light tracking-wide"
            style={{
              background: 'linear-gradient(to right, #0066FF, #0ea5e9, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {wealthTopics[currentTopicIndex]}
          </motion.span>
        </div>
      )}

      <div
        className={cn(
          "relative w-full flex items-center rounded-full transition-all duration-300",
          "backdrop-blur-xl",
          isFocused
            ? "bg-white/95 dark:bg-gray-800/95 shadow-lg"
            : "bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg"
        )}
        style={{
          border: isFocused
            ? '1.5px solid rgba(0, 102, 255, 0.3)'
            : '1px solid rgba(155, 139, 126, 0.2)',
          boxShadow: isFocused
            ? '0 8px 32px rgba(0, 102, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      >
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? "Type your question..." : "Ask Moo about __________"}
          className={cn(
            "w-full py-3.5 pl-5 pr-24 rounded-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400",
            "font-light text-base tracking-wide",
          )}
          onKeyPress={handleKeyPress}
          aria-label="Ask Moo about your financial journey"
          disabled={isListening}
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {isVoiceSupported && (
            <Button
              onClick={handleVoiceToggle}
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full transition-all duration-200",
                isListening
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#0066FF] dark:hover:text-[#38bdf8] hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
              )}
              aria-label={isListening ? "Stop listening" : "Start voice chat"}
            >
              {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </Button>
          )}
          <Button
            onClick={handleSearch}
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-200",
              query.trim()
                ? "text-white hover:scale-105"
                : "text-gray-400 dark:text-gray-500",
            )}
            style={{
              background: query.trim()
                ? 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 100%)'
                : 'transparent',
              boxShadow: query.trim()
                ? '0 4px 12px rgba(0, 102, 255, 0.3)'
                : 'none'
            }}
            aria-label="Submit query"
            disabled={isListening || !query.trim()}
          >
            <ArrowRight className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: '#0066FF' }}
          >
            Listening...
          </span>
        </motion.div>
      )}
      {!isVoiceSupported && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center font-light">
          Voice chat unavailable in this browser.
        </p>
      )}
    </div>
  )
}
