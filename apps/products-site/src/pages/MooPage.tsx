import { useState, useRef, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, TrendingUp, DollarSign, PieChart, Calculator, FileText, BarChart3, Briefcase, BookOpen, Folder, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import ProgressTracker from "../components/moo/ProgressTracker"
import { ThemeToggle } from "../components/theme-toggle"
import cowLogo from "../assets/cow-logo.png"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

type Mode = "learning" | "project"
type Discipline = "financial_accounting" | "cost_accounting" | "management_accounting" | "financial_management" | "all"

interface SuggestedPrompt {
  icon: typeof TrendingUp
  title: string
  prompt: string
  discipline: Discipline
  mode?: Mode
}

// Learning Mode Prompts - Concept Exploration
const learningPrompts: SuggestedPrompt[] = [
  // Financial Accounting
  {
    icon: FileText,
    title: "Accounting Equation",
    prompt: "Explain the accounting equation with examples",
    discipline: "financial_accounting",
    mode: "learning"
  },
  {
    icon: FileText,
    title: "Journal Entries",
    prompt: "How do I prepare journal entries?",
    discipline: "financial_accounting",
    mode: "learning"
  },
  {
    icon: FileText,
    title: "Accrual vs Cash",
    prompt: "What's the difference between accrual and cash basis accounting?",
    discipline: "financial_accounting",
    mode: "learning"
  },
  // Cost Accounting
  {
    icon: Calculator,
    title: "Activity-Based Costing",
    prompt: "Explain Activity-Based Costing with examples",
    discipline: "cost_accounting",
    mode: "learning"
  },
  {
    icon: Calculator,
    title: "Product Cost",
    prompt: "How do I calculate full product cost?",
    discipline: "cost_accounting",
    mode: "learning"
  },
  {
    icon: Calculator,
    title: "FIFO vs LIFO",
    prompt: "Compare FIFO vs LIFO inventory methods",
    discipline: "cost_accounting",
    mode: "learning"
  },
  // Management Accounting
  {
    icon: BarChart3,
    title: "Break-Even Analysis",
    prompt: "Teach me break-even analysis with an example",
    discipline: "management_accounting",
    mode: "learning"
  },
  {
    icon: BarChart3,
    title: "Make-or-Buy",
    prompt: "How do I analyze make-or-buy decisions?",
    discipline: "management_accounting",
    mode: "learning"
  },
  {
    icon: BarChart3,
    title: "Relevant Costs",
    prompt: "What are relevant costs for business decisions?",
    discipline: "management_accounting",
    mode: "learning"
  },
  // Financial Management
  {
    icon: Briefcase,
    title: "Net Present Value",
    prompt: "Explain Net Present Value and how to calculate it",
    discipline: "financial_management",
    mode: "learning"
  },
  {
    icon: Briefcase,
    title: "Investment Projects",
    prompt: "How do I evaluate investment projects?",
    discipline: "financial_management",
    mode: "learning"
  },
  {
    icon: Briefcase,
    title: "Time Value of Money",
    prompt: "Explain time value of money with practical examples",
    discipline: "financial_management",
    mode: "learning"
  },
  // Integration
  {
    icon: Sparkles,
    title: "Integrated Learning",
    prompt: "Show me how all four disciplines work together in a business decision",
    discipline: "all",
    mode: "learning"
  },
]

// Project Mode Prompts - Real-World Applications
const projectPrompts: SuggestedPrompt[] = [
  // Financial Accounting Projects
  {
    icon: FileText,
    title: "Financial Statement Prep",
    prompt: "Help me prepare a complete set of financial statements from a trial balance",
    discipline: "financial_accounting",
    mode: "project"
  },
  {
    icon: FileText,
    title: "Closing Entries",
    prompt: "Guide me through year-end closing entries and adjustments",
    discipline: "financial_accounting",
    mode: "project"
  },
  // Cost Accounting Projects
  {
    icon: Calculator,
    title: "ABC Implementation",
    prompt: "Help me implement activity-based costing for our manufacturing operation",
    discipline: "cost_accounting",
    mode: "project"
  },
  {
    icon: Calculator,
    title: "Product Pricing",
    prompt: "Calculate optimal product pricing using full absorption costing",
    discipline: "cost_accounting",
    mode: "project"
  },
  // Management Accounting Projects
  {
    icon: BarChart3,
    title: "Budget Variance Analysis",
    prompt: "Analyze budget variances and identify root causes for corrective action",
    discipline: "management_accounting",
    mode: "project"
  },
  {
    icon: BarChart3,
    title: "Segment Profitability",
    prompt: "Evaluate profitability by business segment for resource allocation decisions",
    discipline: "management_accounting",
    mode: "project"
  },
  // Financial Management Projects
  {
    icon: Briefcase,
    title: "Capital Budgeting",
    prompt: "Evaluate a capital investment project using NPV, IRR, and payback analysis",
    discipline: "financial_management",
    mode: "project"
  },
  {
    icon: Briefcase,
    title: "Lease vs Buy",
    prompt: "Perform lease vs purchase analysis for equipment acquisition decision",
    discipline: "financial_management",
    mode: "project"
  },
  // Integration Projects
  {
    icon: Sparkles,
    title: "Business Case Analysis",
    prompt: "Build a comprehensive business case integrating all four financial disciplines",
    discipline: "all",
    mode: "project"
  },
]

export default function MooPage() {
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<Mode>("learning")
  const [discipline, setDiscipline] = useState<Discipline>("all")
  const [conceptsMastered, setConceptsMastered] = useState<Record<Discipline, number>>({
    financial_accounting: 0,
    cost_accounting: 0,
    management_accounting: 0,
    financial_management: 0,
    all: 0
  })
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false)
  const [currentTopic, setCurrentTopic] = useState<string>()
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-collapse progress tracker on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsProgressCollapsed(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load progress from session storage
  useEffect(() => {
    const savedProgress = sessionStorage.getItem('moo-progress')
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress)
        setConceptsMastered(parsed.conceptsMastered || conceptsMastered)
        setCurrentTopic(parsed.currentTopic)
        setDifficulty(parsed.difficulty || 'beginner')
      } catch (e) {
        console.error('Failed to load progress:', e)
      }
    }
  }, [])

  // Save progress to session storage
  useEffect(() => {
    const progressData = {
      conceptsMastered,
      currentTopic,
      difficulty
    }
    sessionStorage.setItem('moo-progress', JSON.stringify(progressData))
  }, [conceptsMastered, currentTopic, difficulty])

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

    // Update current topic based on question
    const topicKeywords: Record<string, string> = {
      'accounting equation': 'Accounting Equation',
      'journal': 'Journal Entries',
      'accrual': 'Accrual vs Cash Basis',
      'activity-based': 'Activity-Based Costing',
      'product costing': 'Product Costing',
      'fifo': 'Inventory Valuation (FIFO/LIFO)',
      'lifo': 'Inventory Valuation (FIFO/LIFO)',
      'break-even': 'Break-Even Analysis',
      'make-or-buy': 'Make-or-Buy Decisions',
      'relevant cost': 'Relevant Costs',
      'npv': 'Net Present Value',
      'net present value': 'Net Present Value',
      'investment': 'Investment Analysis',
      'time value': 'Time Value of Money',
      'depreciation': 'Depreciation Methods',
      'variance': 'Variance Analysis',
      'cvp': 'Cost-Volume-Profit Analysis'
    }

    for (const [keyword, topic] of Object.entries(topicKeywords)) {
      if (text.toLowerCase().includes(keyword)) {
        setCurrentTopic(topic)
        break
      }
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response with sophisticated COW voice
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: mode === "learning"
          ? `I understand you're asking about "${text}".

Let me help you master this concept across four interconnected disciplines:

**Financial Accounting** — External reporting, financial statements, GAAP/IFRS compliance
**Cost Accounting** — Product costing, overhead allocation, inventory valuation methods
**Management Accounting** — Internal decision support, CVP analysis, variance analysis
**Financial Management** — Capital budgeting, investment analysis, NPV/IRR calculations

These disciplines work together to provide complete business analysis. Would you like me to:

• Explain this concept step-by-step with clear examples
• Walk through a worked calculation showing the methodology
• Generate a practice problem to test your understanding
• Show cross-discipline connections for integrated learning`
          : `I understand you need help with "${text}".

In Project Mode, I can guide you through structured financial analysis projects:

**Financial Statement Preparation** — Transform trial balance data into complete GAAP-compliant statements
**Product Costing Analysis** — Calculate full product cost using activity-based or traditional methods
**Capital Budgeting Decision** — Evaluate investment opportunities using NPV, IRR, and payback analysis
**Make-or-Buy Analysis** — Perform relevant cost analysis for strategic sourcing decisions
**Variance Investigation** — Compare actual performance against budget with root cause analysis
**Segment Profitability** — Analyze business units for resource allocation and strategic planning

Which project template aligns with your current needs? I'll walk you through the complete analysis with clear documentation.`,
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
    <div className="min-h-screen h-full transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          background: var(--mode-bg);
        }
      `}</style>
      <style>{`
        /* Luminance Layer 1: Atmospheric (60-70%) - The Canvas */
        :root {
          --mode-bg: #F5F3F0; /* Rice Paper - Sumi-e warmth */
          --mode-surface: #ffffff; /* Pure White - elevated cards */
          --mode-text-primary: #0f172a; /* Black Ink - highest contrast */
          --mode-text-secondary: #475569; /* Medium Ink - body text */
          --mode-text-tertiary: #64748b; /* Light Ink - supporting */

          /* Luminance Layer 3: Accent (5-10%) - The Brushstrokes */
          --accent-electric: #2563eb; /* Electric Blue - primary CTAs */
          --accent-cerulean: #00A5CF; /* Cerulean - brand identity */
          --accent-emerald: #10b981; /* Emerald - success */

          /* Warm Earth Grounding (20-30% in light mode) */
          --earth-stone: #9B8B7E; /* Warm Stone - grounding */
          --earth-clay: #C9B8A8; /* Soft Clay - warmth */
          --earth-bamboo: #6B8E6F; /* Bamboo Green - life */
        }

        .dark {
          /* Luminance Layer 1: Atmospheric - Night Sky */
          --mode-bg: #0f172a; /* Night Sky - YOUR SITE! */
          --mode-surface: #1e293b; /* Dawn Approach - elevated */
          --mode-text-primary: #f8fafc; /* Luminous Ink - WCAG AAA */
          --mode-text-secondary: #cbd5e1; /* Secondary - readable */
          --mode-text-tertiary: #94a3b8; /* Tertiary - supporting */

          /* Accents glow in darkness */
          --accent-electric: #2563eb;
          --accent-cerulean: #0ea5e9; /* Brighter in dark */
          --accent-emerald: #10b981;

          /* Warm Earth Grounding (10-15% in dark mode) */
          --earth-stone: #9B8B7E;
          --earth-clay: #C9B8A8;
          --earth-bamboo: #6B8E6F;
        }

        /* Input box glassmorphism */
        .input-glass {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(229, 231, 235, 0.6);
        }
        .dark .input-glass {
          background: rgba(30, 41, 59, 0.95);
          border: 1px solid rgba(71, 85, 105, 0.6);
        }
      `}</style>

      {/* Floating Navigation - Anthropic Level */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-7xl">
        <div
          className="px-6 py-3 flex items-center justify-between gap-4 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 border border-white/40 dark:border-gray-700/40"
          style={{
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Left: Logo + Moo Title */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={cowLogo}
                alt="COW Logo"
                className="h-8 w-8 object-contain"
              />
            </Link>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00A5CF 0%, #0ea5e9 100%)',
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1
                  className="text-lg font-light tracking-tight text-gray-900 dark:text-gray-100"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Moo
                </h1>
                <p className="text-[10px] font-light text-gray-500 dark:text-gray-400">
                  Financial Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Center: Mode + Discipline Selectors */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Mode Selector */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => setMode("learning")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-light transition-all duration-200 flex items-center gap-1.5",
                  mode === "learning"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learning</span>
              </button>
              <button
                onClick={() => setMode("project")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-light transition-all duration-200 flex items-center gap-1.5",
                  mode === "project"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Project</span>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

            {/* Discipline Quick Filter (compact) */}
            <div className="flex gap-1.5">
              {[
                { value: "financial_accounting" as Discipline, icon: FileText, color: "#3b82f6" },
                { value: "cost_accounting" as Discipline, icon: Calculator, color: "#C77A58" },
                { value: "management_accounting" as Discipline, icon: BarChart3, color: "#00A5CF" },
                { value: "financial_management" as Discipline, icon: Briefcase, color: "#10b981" },
                { value: "all" as Discipline, icon: Sparkles, color: "#6B8E6F" }
              ].map((disc) => (
                <button
                  key={disc.value}
                  onClick={() => setDiscipline(disc.value)}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all duration-200 flex items-center justify-center",
                    discipline === disc.value
                      ? "shadow-sm"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  style={{
                    background: discipline === disc.value ? disc.color : "transparent",
                  }}
                  title={disc.value === "all" ? "All Disciplines" : disc.value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                >
                  <disc.icon
                    className="w-4 h-4"
                    style={{
                      color: discipline === disc.value ? "#ffffff" : disc.color
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Theme Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="h-screen flex pt-24">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4">
          {/* Hero Section (Welcome State) */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center max-w-4xl"
              >
                {/* Icon */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #0066FF 0%, #0ea5e9 50%, #10b981 100%)',
                    boxShadow: '0 8px 32px rgba(0, 102, 255, 0.2)'
                  }}
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-thin text-gray-800 dark:text-gray-100 mb-4 leading-[0.9] tracking-tight"
                >
                  {mode === "learning" ? "Master Financial Intelligence" : "Apply Financial Intelligence"}
                </h1>

                {/* Divider */}
                <div style={{
                  width: '120px',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent 0%, #00A5CF 50%, transparent 100%)',
                  margin: '0 auto 1.5rem auto'
                }} />

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  {mode === "learning" ? (
                    <>
                      Rigorous training across{' '}
                      <span style={{ color: '#00A5CF', fontWeight: '400' }}>four interconnected disciplines</span>{' '}
                      of accounting and finance—designed for{' '}
                      <span className="text-emerald-600 font-normal">deep understanding</span>, not surface learning
                    </>
                  ) : (
                    <>
                      Professional-grade financial analysis{' '}
                      <span style={{ color: '#00A5CF', fontWeight: '400' }}>integrating all four disciplines</span>—structured workflows for{' '}
                      <span className="text-emerald-600 font-normal">real-world decisions</span>, not theoretical exercises
                    </>
                  )}
                </p>

                {/* Mode Description */}
                <div className="mb-12 p-6 rounded-2xl bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {mode === "learning" ? (
                      <BookOpen className="w-5 h-5" style={{ color: '#2563eb' }} />
                    ) : (
                      <Folder className="w-5 h-5" style={{ color: '#2563eb' }} />
                    )}
                    <h3 className="text-lg font-normal text-gray-900 dark:text-gray-100">
                      {mode === "learning" ? "Learning Mode" : "Project Mode"}
                    </h3>
                  </div>
                  <p className="text-sm font-light text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {mode === "learning"
                      ? "Explore concepts with step-by-step explanations, worked examples, and cross-discipline connections. Build mastery through rigorous practice."
                      : "Apply your knowledge to real-world financial analysis projects. Structured workflows with complete documentation and professional-grade outputs."}
                  </p>
                </div>

                {/* Suggested Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {(mode === "learning" ? learningPrompts : projectPrompts)
                    .filter(p => discipline === "all" ? true : p.discipline === discipline || p.discipline === "all")
                    .slice(0, 6)
                    .map((suggestion, index) => {
                      const getDisciplineColor = (disc: Discipline) => {
                        switch(disc) {
                          case "financial_accounting": return "#3b82f6"
                          case "cost_accounting": return "#C77A58"
                          case "management_accounting": return "#00A5CF"
                          case "financial_management": return "#10b981"
                          default: return "#6B8E6F"
                        }
                      }

                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.5 }}
                          onClick={() => handleSubmit(suggestion.prompt)}
                          className="group p-5 rounded-xl text-left transition-all duration-300 bg-white/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600"
                        >
                          <suggestion.icon
                            className="w-5 h-5 mb-3 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: getDisciplineColor(suggestion.discipline) }}
                          />
                          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1.5">{suggestion.title}</h3>
                          <p className="text-xs font-light text-gray-600 dark:text-gray-400 leading-relaxed">{suggestion.prompt}</p>
                        </motion.button>
                      )
                    })}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Messages Area */
            <div className="flex-1 overflow-y-auto py-8 px-2">
              <div className="space-y-6 max-w-4xl mx-auto">
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
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #00A5CF 0%, #0ea5e9 100%)',
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-6 py-4",
                          message.role === "user"
                            ? "bg-gradient-to-br from-[#0066FF] to-[#0080FF] text-white shadow-lg"
                            : "bg-white dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50"
                        )}
                      >
                        <p
                          className={cn(
                            "font-light leading-relaxed whitespace-pre-wrap",
                            message.role === "user" ? "text-white" : "text-gray-900 dark:text-gray-100"
                          )}
                          style={{ fontSize: '15px' }}
                        >
                          {message.content}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-3 font-light",
                            message.role === "user" ? "text-blue-100" : "text-gray-500 dark:text-gray-500"
                          )}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #00A5CF 0%, #0ea5e9 100%)',
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-6 py-4">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-[#00A5CF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[#00A5CF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[#00A5CF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input Area - Floating */}
          <div className="px-6 pb-6 mt-auto">
            <div className="max-w-4xl mx-auto">
              <div
                className="input-glass relative flex items-end gap-3 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-[#00A5CF] transition-all"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={mode === "learning" ? "Ask about financial concepts..." : "Describe your project needs..."}
                  className="flex-1 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-light"
                  rows={1}
                  style={{ maxHeight: '200px', fontSize: '15px' }}
                />
                <Button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl text-white shadow-lg"
                  style={{
                    background: input.trim() ? 'linear-gradient(to right, #00A5CF, #0ea5e9)' : undefined,
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-3 font-light">
                Moo can make mistakes. Verify important financial information.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker
          conceptsMastered={conceptsMastered}
          currentTopic={currentTopic}
          difficulty={difficulty}
          isCollapsed={isProgressCollapsed}
          onToggle={() => setIsProgressCollapsed(!isProgressCollapsed)}
        />
      </div>
    </div>
  )
}
