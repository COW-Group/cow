import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, TrendingUp, DollarSign, PieChart, Mic, MicOff } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  {
    icon: TrendingUp,
    title: "Build Wealth Cycles",
    prompt: "How can I create sustainable wealth cycles with my income?"
  },
  {
    icon: DollarSign,
    title: "Asset Performance",
    prompt: "What are the best performing real-world asset classes right now?"
  },
  {
    icon: PieChart,
    title: "Portfolio Strategy",
    prompt: "Help me design a diversified portfolio strategy for long-term growth"
  }
]

export default function MooPage() {
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial query from navigation state
  useEffect(() => {
    const initialQuery = (location.state as any)?.initialQuery
    if (initialQuery) {
      handleSubmit(initialQuery)
    }
  }, [location.state])

  const handleSubmit = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `I'm Moo, your wealth intelligence assistant. I understand you're asking about "${text}".

In the COW ecosystem, we approach wealth building through three interconnected flows:

1. **Performance Assets**: Real-world tokenized assets that generate returns
2. **Life Solutions**: Programs designed for major life milestones
3. **Wealth Cycles**: Continuous optimization of your financial ecosystem

Would you like me to dive deeper into any specific aspect of your wealth journey?`,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0; /* Rice Paper - warm, inviting */
        }
        .dark {
          --mode-bg: #0a1628; /* Navy Deep - family's favorite! */
        }
      `}</style>

      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-6 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 100%)',
                  boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)'
                }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900 dark:text-gray-100">Moo</h1>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">Wealth Intelligence Assistant</p>
              </div>
            </div>
            <a
              href="/"
              className="text-sm font-light text-gray-600 dark:text-gray-400 hover:text-[#0066FF] dark:hover:text-[#38bdf8] transition-colors"
            >
              Back to Home
            </a>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 50%, #10b981 100%)',
                  boxShadow: '0 8px 24px rgba(0, 102, 255, 0.25)'
                }}
              >
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2
                className="text-4xl font-thin mb-4 text-gray-900 dark:text-gray-100"
                style={{ letterSpacing: '-0.02em' }}
              >
                Welcome to Moo
              </h2>
              <p className="text-lg font-light text-gray-600 dark:text-gray-300 mb-12 max-w-2xl">
                Your AI assistant for <span className="text-[#0066FF] font-normal">economics</span>,{' '}
                <span className="text-emerald-600 font-normal">personal finance</span>, and all aspects of{' '}
                <span className="text-[#0ea5e9] font-normal">wealth building</span>
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {suggestedPrompts.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubmit(suggestion.prompt)}
                    className="p-6 rounded-2xl text-left transition-all duration-300 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <suggestion.icon className="w-6 h-6 mb-3 text-[#0066FF] dark:text-[#38bdf8]" />
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{suggestion.title}</h3>
                    <p className="text-sm font-light text-gray-600 dark:text-gray-400">{suggestion.prompt}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex gap-4",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 100%)',
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-6 py-4",
                        message.role === "user"
                          ? "bg-[#0066FF] text-white"
                          : "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
                      )}
                    >
                      <p
                        className={cn(
                          "font-light leading-relaxed whitespace-pre-wrap",
                          message.role === "user" ? "text-white" : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-2",
                          message.role === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-500"
                        )}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 100%)',
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl px-6 py-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-[#0066FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-[#0066FF] transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Moo about economics, finance, wealth building..."
                className="flex-1 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400 font-light"
                rows={1}
                style={{ maxHeight: '200px' }}
              />
              <Button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isLoading}
                className="rounded-xl text-white"
                style={{
                  background: input.trim() ? 'linear-gradient(to right, #0066FF, #0080FF)' : undefined,
                }}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
              Moo can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
