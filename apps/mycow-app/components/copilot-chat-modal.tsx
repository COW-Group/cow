"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Mic, MicOff, Send, X } from "lucide-react"
import { useCopilot, CopilotProvider } from "@/contexts/copilot-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SpeechRecognition } from "web-speech-api"

interface Message {
  role: "user" | "ai"
  content: string
  timestamp: Date
}

interface CopilotChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialQuery?: string
}

function CopilotChatContent({ isOpen, onClose, initialQuery = "" }: CopilotChatModalProps) {
  const { settings } = useCopilot()
  const [mode, setMode] = useState<"text" | "voice">("text")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isVoiceSupported, setIsVoiceSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    const responses = {
      moo: [
        "Let's take a mindful approach to your **Wealth Hero** journey. Have you explored the **Assets** section for building your Moo Mix?",
        "Your financial peace comes from understanding your flows. Check the **Compass** to see your current balance.",
        "Remember, wealth building is like tending a garden - it requires patience and consistent care. What specific goal would you like to focus on?",
        "I sense you're ready to grow your financial wisdom. The **Learn** section has resources to help you level up your skills.",
        "Every great journey begins with a single step. Let's curate a **Moo Mix** that aligns with your values and goals.",
      ],
      moolah: [
        "Hey there, future mogul! 🚀 Ready to **turbocharge** your assets? Let's dive into that Moo Mix!",
        "Time to make your money work harder than you do! Check out the **Vehicles** section for some exciting opportunities.",
        "Your **Wealth Hero** story is just getting started! What's the first mountain you want to conquer?",
        "Let's turn those financial dreams into reality! The **Contribute** section shows how wealth can change the world.",
        "Money talks, but wealth whispers - and I'm here to help you hear it loud and clear! What's your next move?",
      ],
    }
    const copilotResponses = settings.name === "Moo" ? responses.moo : responses.moolah
    if (lowerMessage.includes("asset") || lowerMessage.includes("invest")) {
      return copilotResponses[0]
    } else if (lowerMessage.includes("goal") || lowerMessage.includes("plan")) {
      return copilotResponses[2]
    } else if (lowerMessage.includes("learn") || lowerMessage.includes("skill")) {
      return copilotResponses[3]
    } else {
      return copilotResponses[Math.floor(Math.random() * copilotResponses.length)]
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsVoiceSupported(true)
        const rec = new SpeechRecognition()
        rec.continuous = false
        rec.interimResults = false
        rec.lang = "en-US"
        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          handleSend(transcript)
        }
        rec.onend = () => setIsListening(false)
        rec.onerror = () => setIsListening(false)
        setRecognition(rec)
      }
    }
  }, [])

  useEffect(() => {
    if (initialQuery && isOpen && messages.length === 0) {
      handleSend(initialQuery)
    }
  }, [initialQuery, isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (text = input) => {
    if (!text.trim()) return
    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    }
    const aiResponse: Message = {
      role: "ai",
      content: getResponse(text),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage, aiResponse])
    setInput("")
    if (window.speechSynthesis) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(aiResponse.content.replace(/\*\*/g, ""))
      utterance.rate = settings.voiceRate
      utterance.pitch = settings.voicePitch
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleVoiceToggle = () => {
    if (!recognition) return
    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatMessage = (content: string) => {
    return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-blue-500 to-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse mr-3 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-300 to-yellow-300" />
              </div>
              Chat with {settings.name}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as "text" | "voice")}
            className="mt-4 bg-white/10 rounded-lg p-1"
          >
            <ToggleGroupItem value="text" className="text-white data-[state=on]:bg-white data-[state=on]:text-blue-600">
              Text
            </ToggleGroupItem>
            {isVoiceSupported && (
              <ToggleGroupItem
                value="voice"
                className="text-white data-[state=on]:bg-white data-[state=on]:text-blue-600"
              >
                Voice
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </DialogHeader>
        <ScrollArea className="flex-1 p-6" role="log" aria-label="Chat messages">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/30" />
                </div>
                <p>Start a conversation with {settings.name}!</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.role === "ai" && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 mr-2 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white/50" />
                      </div>
                      <span className="text-sm font-medium">{settings.name}</span>
                    </div>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    className="prose prose-sm max-w-none"
                  />
                  {message.role === "ai" && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSpeaking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                    {settings.name} is speaking...
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="p-6 pt-4 border-t">
          {mode === "text" ? (
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message to ${settings.name}...`}
                className="flex-1 min-h-[60px] resize-none"
                onKeyPress={handleKeyPress}
                aria-label={`Type your message to ${settings.name}`}
              />
              <Button onClick={() => handleSend()} disabled={!input.trim()} size="icon" className="self-end">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleVoiceToggle}
                variant={isListening ? "destructive" : "default"}
                className="w-full"
                disabled={!isVoiceSupported}
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                {isListening ? "Stop Listening" : "Start Listening"}
              </Button>
              {isListening && (
                <div className="text-center text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm">Listening for your voice...</span>
                </div>
              )}
              {!isVoiceSupported && (
                <p className="text-sm text-gray-500 text-center">Voice chat is not supported in this browser</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CopilotChatModal(props: CopilotChatModalProps) {
  return (
    <CopilotProvider>
      <CopilotChatContent {...props} />
    </CopilotProvider>
  )
}
