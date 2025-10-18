"use client"

   import type React from "react"
   import { useState, useEffect, useRef } from "react"
   import { Input } from "@/components/ui/input"
   import { Button } from "@/components/ui/button"
   import { Mic, MicOff, ArrowRight } from "lucide-react"
   import { useCopilot } from "@/contexts/copilot-context"
   import { cn } from "@/lib/utils"

   interface CopilotSearchBarProps {
     onOpenChat: (query?: string) => void
   }

   export function CopilotSearchBar({ onOpenChat }: CopilotSearchBarProps) {
     console.log("CopilotSearchBar rendered")
     const { settings } = useCopilot()
     const [query, setQuery] = useState("")
     const [isListening, setIsListening] = useState(false)
     const [recognition, setRecognition] = useState<any | null>(null)
     const [isVoiceSupported, setIsVoiceSupported] = useState(false)
     const inputRef = useRef<HTMLInputElement>(null)

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
             setQuery(transcript)
             onOpenChat(transcript)
           }

           rec.onend = () => {
             setIsListening(false)
             if (inputRef.current) {
               inputRef.current.focus()
             }
           }
           rec.onerror = (event) => {
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
       <div className="flex flex-col items-center w-full max-w-md">
         {" "}
         {/* Adjusted max-w for header fit */}
         <div className="relative w-full flex items-center rounded-full bg-transparent border border-transparent transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
           {" "}
           {/* Removed shadow, background, and made border transparent */}
           <Input
             ref={inputRef}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder={`Ask ${settings.name} about your Wealth Hero journey...`}
             className={cn(
               "w-full py-2 pl-6 pr-20 rounded-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
               "text-ink-900 dark:text-cream-50 placeholder:text-ink-400 dark:placeholder:text-cream-400",
               "font-light text-base", // Slightly smaller font for header
             )}
             onKeyPress={handleKeyPress}
             aria-label={`Ask ${settings.name} about your financial journey`}
             disabled={isListening}
           />
           <div className="absolute right-2 flex items-center gap-1">
             {isVoiceSupported && (
               <Button
                 onClick={handleVoiceToggle}
                 variant="ghost"
                 size="icon"
                 className={cn(
                   "rounded-full text-ink-500 dark:text-cream-300 hover:bg-cream-200/50 dark:hover:bg-ink-700/50",
                   isListening && "text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/50",
                 )}
                 aria-label={isListening ? "Stop listening" : "Start voice chat"}
               >
                 {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
               </Button>
             )}
             <Button
               onClick={handleSearch}
               variant="ghost"
               size="icon"
               className="rounded-full text-ink-500 dark:text-cream-300 hover:bg-cream-200/50 dark:hover:bg-ink-700/50"
               aria-label="Submit query"
               disabled={isListening || !query.trim()}
             >
               <ArrowRight className="w-5 h-5" />
             </Button>
           </div>
         </div>
         {isListening && (
           <div className="mt-1 flex items-center gap-2 text-blue-600 dark:text-blue-400">
             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
             <span className="text-xs font-medium">Listening...</span> {/* Smaller text for listening indicator */}
           </div>
         )}
         {!isVoiceSupported && (
           <p className="text-xs text-gray-500 mt-1 text-center">Voice chat unavailable in this browser.</p>
         )}
       </div>
     )
   }
