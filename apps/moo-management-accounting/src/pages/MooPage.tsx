import { useState, useRef, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, TrendingUp, DollarSign, PieChart, Calculator, FileText, BarChart3, Briefcase, BookOpen, Folder, ArrowLeft, Save, Upload, Download, FolderPlus, LogIn, LogOut, User, Paperclip, Plug, X, FileSpreadsheet, File, ChevronLeft, ChevronRight, Plus, Trash2, TrendingUpIcon, Menu } from "lucide-react"
import { Button } from "../components/ui/button"
import { cn } from "../lib/utils"
import ProgressTracker from "../components/moo/ProgressTracker"
import { ThemeToggle } from "../components/theme-toggle"
import { Markdown } from "../components/Markdown"
import { useAuthContext } from "../lib/auth-context"
import { AuthModal } from "../components/auth-modal"
import cowLogo from "../assets/cow-logo.png"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Project {
  id: number
  name: string
  description?: string
  discipline: Discipline
  created_at: string
  conversation_count: number
}

interface Artifact {
  id: string
  type: 'spreadsheet' | 'document' | 'code' | 'chart'
  title: string
  content: string | any // Can be CSV data, text, or chart config
  createdAt: Date
  updatedAt: Date
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
  const { auth, signOut } = useAuthContext()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
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
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(true)
  const [currentTopic, setCurrentTopic] = useState<string>()
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [showAttachmentsMenu, setShowAttachmentsMenu] = useState(false)
  const [showIntegrationsMenu, setShowIntegrationsMenu] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [menuTab, setMenuTab] = useState<'learning' | 'projects' | 'progress'>('learning')
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [isArtifactsPanelOpen, setIsArtifactsPanelOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Create sample artifact for testing
  const createSampleArtifact = (type: Artifact['type']) => {
    const sampleContent = {
      spreadsheet: 'Account,Debit,Credit\nCash,5000,0\nAccounts Receivable,3000,0\nRevenue,0,8000',
      document: 'Financial Analysis Report\n\nQ4 2024 Summary:\n- Revenue increased by 15%\n- Operating expenses decreased by 8%\n- Net profit margin improved to 22%',
      code: 'function calculateROI(investment, return) {\n  return ((return - investment) / investment) * 100;\n}\n\nconst roi = calculateROI(10000, 12000);\nconsole.log(`ROI: ${roi}%`);',
      chart: { type: 'bar', data: [10, 20, 30, 40], labels: ['Q1', 'Q2', 'Q3', 'Q4'] }
    };

    const newArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      type,
      title: type === 'spreadsheet' ? 'Trial Balance' :
             type === 'document' ? 'Financial Analysis' :
             type === 'code' ? 'ROI Calculator' :
             'Quarterly Revenue',
      content: sampleContent[type],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setArtifacts(prev => [...prev, newArtifact]);
    setIsArtifactsPanelOpen(true);
  };

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

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      inputRef.current.style.height = Math.min(scrollHeight, 200) + 'px'
    }
  }, [input])

  // File handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files).filter(file => {
        // Support Excel, PDF, and Markdown files
        const validTypes = [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/pdf',
          'text/markdown',
          'text/plain'
        ]
        return validTypes.includes(file.type) || file.name.endsWith('.md')
      })
      setAttachedFiles(prev => [...prev, ...newFiles])
      setShowAttachmentsMenu(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDownloadConversation = () => {
    const conversationText = messages.map(msg =>
      `${msg.role === 'user' ? 'You' : 'Moo'}: ${msg.content}\n\n`
    ).join('')

    const blob = new Blob([conversationText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moo-conversation-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowAttachmentsMenu(false)
  }

  // Projects functions
  const loadProjects = async () => {
    if (!auth?.user?.id) return

    try {
      const response = await fetch(`http://localhost:8000/projects?user_id=${auth.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const createProject = async () => {
    if (!auth?.user?.id || !newProjectName.trim()) return

    try {
      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          discipline: discipline,
          user_id: auth.user.id
        })
      })

      if (response.ok) {
        const newProject = await response.json()
        setProjects(prev => [newProject, ...prev])
        setNewProjectName("")
        setIsCreatingProject(false)
      }
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        if (selectedProject?.id === projectId) {
          setSelectedProject(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  // Load projects when user logs in
  useEffect(() => {
    if (auth?.user?.id) {
      loadProjects()
    }
  }, [auth?.user?.id])

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

    // Add file context to message if files are attached
    let messageContent = text
    if (attachedFiles.length > 0) {
      const fileList = attachedFiles.map(f => f.name).join(', ')
      messageContent += `\n\n[Attached files: ${fileList}]`
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: messageContent,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Prepare file data for API (for future implementation)
      const fileMetadata = attachedFiles.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))

      // Call Moo API backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          mode: mode,
          discipline: discipline,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          attachments: fileMetadata  // Send file metadata to API
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Clear attached files after successful submission
      setAttachedFiles([])
    } catch (error) {
      console.error('Error calling Moo API:', error)
      // Fallback to error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to the Moo service right now. Please check that the backend server is running on http://localhost:8000 and try again.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
          /* Luminance Layer 1: Atmospheric - Navy Cosmos */
          --mode-bg: #0a1628; /* Navy Deep - like research page */
          --mode-surface: #0f1d2e; /* Medium Navy - elevated cards */
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

      {/* Arrow Tab Toggle - Signature Design */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300"
        style={{
          left: isMenuOpen ? '320px' : '0px',
          background: 'linear-gradient(135deg, #007BA7 0%, #00A5CF 100%)',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          padding: '24px 8px',
          boxShadow: '2px 0 12px rgba(0, 165, 207, 0.3)'
        }}
        title={isMenuOpen ? "Hide Menu" : "Show Menu"}
      >
        {isMenuOpen ? (
          <ChevronLeft className="w-4 h-4 text-white" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <div className="h-screen flex relative">
        {/* Unified Menu Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 border-r shadow-2xl z-40 flex flex-col"
              style={{
                background: 'var(--mode-surface)',
                borderRightColor: 'rgba(107, 142, 111, 0.15)', // Bamboo Green accent
                backdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Gradient Header - Signature Moo Style */}
              <div
                className="relative p-6 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #007BA7 0%, #00A5CF 100%)',
                  minHeight: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Logo and Title */}
                <Link to="/" className="flex items-center gap-3">
                  <img
                    src={cowLogo}
                    alt="COW Logo"
                    className="h-10 w-10 object-contain"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-light tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
                        Moo
                      </h1>
                      <span
                        className="px-2 py-0.5 text-[9px] font-medium rounded uppercase tracking-wide"
                        style={{
                          background: 'rgba(255, 255, 255, 0.25)',
                          color: 'white',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        Beta
                      </span>
                    </div>
                    <p className="text-xs font-light mt-0.5" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Financial Intelligence Assistant
                    </p>
                  </div>
                </Link>

                {/* Auth & Theme Controls */}
                <div className="flex items-center gap-2 mt-4">
                  {auth.isAuthenticated ? (
                    <>
                      <button
                        onClick={() => signOut()}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-light transition-all"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          backdropFilter: 'blur(10px)'
                        }}
                        title="Sign Out"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate text-xs">{auth.profile?.name?.split(' ')[0] || 'User'}</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center justify-center">
                        <ThemeToggle />
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all shadow-sm hover:shadow-md"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#007BA7'
                        }}
                        title="Sign In"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In</span>
                      </button>
                      <div className="flex items-center justify-center">
                        <ThemeToggle />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Horizon Divider - Sumi-e inspired */}
              <div
                style={{
                  height: '2px',
                  background: 'linear-gradient(to right, transparent 0%, rgba(0, 165, 207, 0.3) 50%, transparent 100%)'
                }}
              />

              {/* Tab Navigation - Earth Tone Inspired */}
              <div className="p-3" style={{
                background: 'rgba(201, 184, 168, 0.08)', // Soft Clay tint for grounding
              }}>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMenuTab('learning');
                      setMode('learning'); // Auto-switch to learning mode
                    }}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-xs font-light transition-all"
                    style={{
                      background: menuTab === 'learning'
                        ? 'linear-gradient(135deg, #8B956D 0%, #6B7553 100%)'
                        : 'transparent',
                      color: menuTab === 'learning' ? 'white' : undefined
                    }}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Learn</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuTab('project');
                      setMode('project'); // Auto-switch to project mode
                    }}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-xs font-light transition-all"
                    style={{
                      background: menuTab === 'project'
                        ? 'linear-gradient(135deg, #C9724B 0%, #B86239 100%)'
                        : 'transparent',
                      color: menuTab === 'project' ? 'white' : undefined
                    }}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Project Mode</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuTab('projects');
                      setMode('project'); // Keep project mode
                    }}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-xs font-light transition-all"
                    style={{
                      background: menuTab === 'projects'
                        ? 'linear-gradient(135deg, #C9724B 0%, #B86239 100%)'
                        : 'transparent',
                      color: menuTab === 'projects' ? 'white' : undefined
                    }}
                  >
                    <Folder className="w-4 h-4" />
                    <span>Projects</span>
                  </button>
                  <button
                    onClick={() => setMenuTab('progress')}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-lg text-xs font-light transition-all"
                    style={{
                      background: menuTab === 'progress'
                        ? 'linear-gradient(135deg, #9B8B7E 0%, #8A7B6E 100%)'
                        : 'transparent',
                      color: menuTab === 'progress' ? 'white' : undefined
                    }}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Progress</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Learning Tab */}
                {menuTab === 'learning' && (
                  <div className="p-4 space-y-4">
                    {/* Discipline Selector - Learning Mode is implicit */}
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{
                        color: 'var(--mode-text-secondary)'
                      }}>
                        Choose Your Discipline
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "financial_accounting" as Discipline, icon: FileText, color: "#3b82f6", label: "Financial" },
                          { value: "cost_accounting" as Discipline, icon: Calculator, color: "#C77A58", label: "Cost" },
                          { value: "management_accounting" as Discipline, icon: BarChart3, color: "#00A5CF", label: "Management" },
                          { value: "financial_management" as Discipline, icon: Briefcase, color: "#10b981", label: "Finance" },
                          { value: "all" as Discipline, icon: Sparkles, color: "#6B8E6F", label: "All" }
                        ].map((disc) => (
                          <button
                            key={disc.value}
                            onClick={() => {
                              setDiscipline(disc.value);
                              setMode("learning"); // Ensure learning mode when in Learning tab
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 shadow-sm"
                            style={
                              discipline === disc.value
                                ? {
                                    background: disc.color,
                                    color: 'white'
                                  }
                                : {
                                    background: 'transparent',
                                    color: 'var(--mode-text-secondary)',
                                  }
                            }
                            onMouseEnter={(e) => {
                              if (discipline !== disc.value) {
                                e.currentTarget.style.background = 'rgba(107, 142, 111, 0.08)'; // Bamboo tint on hover
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (discipline !== disc.value) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <disc.icon className="w-4 h-4" />
                            <span>{disc.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Start Guide */}
                    <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(139, 149, 109, 0.1)' }}>
                      <h3 className="text-xs font-medium mb-2 flex items-center gap-2" style={{
                        color: 'var(--mode-text-secondary)'
                      }}>
                        <BookOpen className="w-3.5 h-3.5" />
                        Learning Mode
                      </h3>
                      <p className="text-xs leading-relaxed" style={{
                        color: 'var(--mode-text-tertiary)'
                      }}>
                        Ask questions, explore concepts, and get instant explanations across financial disciplines.
                      </p>
                    </div>
                  </div>
                )}

                {/* Project Mode Tab */}
                {menuTab === 'project' && (
                  <div className="p-4 space-y-4">
                    {/* Discipline Selector - Project Mode is implicit */}
                    <div>
                      <label className="text-xs font-medium mb-2 block" style={{
                        color: 'var(--mode-text-secondary)'
                      }}>
                        Choose Your Discipline
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "financial_accounting" as Discipline, icon: FileText, color: "#3b82f6", label: "Financial" },
                          { value: "cost_accounting" as Discipline, icon: Calculator, color: "#C77A58", label: "Cost" },
                          { value: "management_accounting" as Discipline, icon: BarChart3, color: "#00A5CF", label: "Management" },
                          { value: "financial_management" as Discipline, icon: Briefcase, color: "#10b981", label: "Finance" },
                          { value: "all" as Discipline, icon: Sparkles, color: "#6B8E6F", label: "All" }
                        ].map((disc) => (
                          <button
                            key={disc.value}
                            onClick={() => {
                              setDiscipline(disc.value);
                              setMode("project"); // Ensure project mode when in Project Mode tab
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-light transition-all duration-200 shadow-sm"
                            style={
                              discipline === disc.value
                                ? {
                                    background: disc.color,
                                    color: 'white'
                                  }
                                : {
                                    background: 'transparent',
                                    color: 'var(--mode-text-secondary)',
                                  }
                            }
                            onMouseEnter={(e) => {
                              if (discipline !== disc.value) {
                                e.currentTarget.style.background = 'rgba(107, 142, 111, 0.08)'; // Bamboo tint on hover
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (discipline !== disc.value) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            <disc.icon className="w-4 h-4" />
                            <span>{disc.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Start Guide */}
                    <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(201, 114, 75, 0.1)' }}>
                      <h3 className="text-xs font-medium mb-2 flex items-center gap-2" style={{
                        color: 'var(--mode-text-secondary)'
                      }}>
                        <Briefcase className="w-3.5 h-3.5" />
                        Project Mode
                      </h3>
                      <p className="text-xs leading-relaxed" style={{
                        color: 'var(--mode-text-tertiary)'
                      }}>
                        Build comprehensive financial analyses, upload files, and create professional-grade outputs.
                      </p>
                    </div>
                  </div>
                )}

                {/* Projects Tab */}
                {menuTab === 'projects' && (
                  <div className="flex flex-col h-full">
                    {/* Project Mode Info */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(201, 114, 75, 0.1)' }}>
                        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Folder className="w-3.5 h-3.5" />
                          Project Mode
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Build comprehensive financial analyses, upload files, and organize work into saved projects.
                        </p>
                      </div>

                      {auth.isAuthenticated ? (
                        <button
                          onClick={() => setIsCreatingProject(true)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-light text-white transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #00A5CF 0%, #0ea5e9 100%)',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          New Project
                        </button>
                      ) : (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-medium">Sign in to save projects</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Projects help you organize your conversations and keep track of your learning journey.</p>
                          <button
                            onClick={() => {
                              setIsMenuOpen(false)
                              setIsAuthModalOpen(true)
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md"
                            style={{
                              background: 'linear-gradient(to right, #0066FF, #0080FF)',
                            }}
                          >
                            <LogIn className="w-4 h-4" />
                            Sign In
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Create Project Form */}
                    {isCreatingProject && (
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <input
                          type="text"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              createProject()
                            }
                          }}
                          placeholder="Project name..."
                          className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A5CF]"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={createProject}
                            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#00A5CF] text-white hover:bg-[#0090b8] transition-colors"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => {
                              setIsCreatingProject(false)
                              setNewProjectName("")
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Projects List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {!auth.isAuthenticated ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                          <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p className="font-medium">Organize your conversations</p>
                          <p className="text-xs mt-2 px-4">Sign in to create projects and save your chat history across sessions</p>
                        </div>
                      ) : projects.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
                          <Folder className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>No projects yet</p>
                          <p className="text-xs mt-1">Create a project to organize your conversations</p>
                        </div>
                      ) : (
                        projects.map((project) => (
                          <div
                            key={project.id}
                            className={cn(
                              "group p-3 rounded-lg border transition-all cursor-pointer",
                              selectedProject?.id === project.id
                                ? "bg-[#00A5CF]/10 border-[#00A5CF] dark:bg-[#00A5CF]/20"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#00A5CF]/50 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                            )}
                            onClick={() => setSelectedProject(project)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {project.name}
                                </h3>
                                {project.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                    {project.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  <span>{project.conversation_count} conversations</span>
                                  <span>•</span>
                                  <span className="capitalize">{project.discipline.replace(/_/g, ' ')}</span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`Delete project "${project.name}"?`)) {
                                    deleteProject(project.id)
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Tab */}
                {menuTab === 'progress' && (
                  <div className="p-4">
                    <ProgressTracker
                      conceptsMastered={conceptsMastered}
                      currentTopic={currentTopic}
                      difficulty={difficulty}
                      mode={mode}
                      discipline={discipline}
                      isCollapsed={false}
                      onToggleCollapse={() => {}}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col mx-auto w-full px-4 transition-all duration-300",
          isMenuOpen ? "max-w-4xl ml-80" : "max-w-5xl"
        )}>
          {/* Hero Section (Welcome State) */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center max-w-3xl w-full"
              >
                {/* COW Logo */}
                <div className="flex flex-col items-center mb-6">
                  <motion.img
                    src={cowLogo}
                    alt="COW Logo"
                    className="h-16 w-16 object-contain mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <span
                    className="text-xs font-medium tracking-widest"
                    style={{
                      color: 'rgba(0, 165, 207, 0.7)',
                      letterSpacing: '0.15em'
                    }}
                  >
                    BETA
                  </span>
                </div>

                {/* Time-based Greeting */}
                <h1 className="text-3xl sm:text-4xl font-light text-gray-800 dark:text-gray-100 mb-8">
                  {(() => {
                    const hour = new Date().getHours()
                    let greeting = "Good evening"
                    if (hour < 12) greeting = "Good morning"
                    else if (hour < 18) greeting = "Good afternoon"

                    const firstName = auth.profile?.name?.split(' ')[0]
                    return firstName ? `${greeting}, ${firstName}` : greeting
                  })()}
                </h1>

                {/* Mode-specific content revealed after selection from sidebar */}
                {mode && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full"
                  >
                    {/* Mode Description */}
                    <div className="mb-6 p-4 rounded-xl bg-white/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {mode === "learning" ? (
                          <BookOpen className="w-4 h-4" style={{ color: '#8B956D' }} />
                        ) : (
                          <Folder className="w-4 h-4" style={{ color: '#C9724B' }} />
                        )}
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {mode === "learning" ? "Learning Mode" : "Project Mode"}
                        </h3>
                      </div>
                      <p className="text-xs font-light text-gray-600 dark:text-gray-400">
                        {mode === "learning"
                          ? "Explore concepts with step-by-step explanations and worked examples"
                          : "Apply knowledge to real-world financial analysis projects"}
                      </p>
                    </div>

                    {/* Suggested Prompts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {(mode === "learning" ? learningPrompts : projectPrompts)
                        .filter(p => discipline === "all" ? true : p.discipline === discipline || p.discipline === "all")
                        .slice(0, 4)
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
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              onClick={() => handleSubmit(suggestion.prompt)}
                              className="group p-4 rounded-lg text-left transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#00A5CF] dark:hover:border-[#00A5CF] hover:shadow-md"
                            >
                              <suggestion.icon
                                className="w-4 h-4 mb-2"
                                style={{ color: getDisciplineColor(suggestion.discipline) }}
                              />
                              <h3 className="font-medium text-xs text-gray-900 dark:text-gray-100 mb-1">{suggestion.title}</h3>
                              <p className="text-xs font-light text-gray-600 dark:text-gray-400">{suggestion.prompt}</p>
                            </motion.button>
                          )
                        })}
                    </div>

                    {/* Test Artifacts Button - TEMPORARY */}
                    <div className="mt-6 flex gap-3 justify-center">
                      <button
                        onClick={() => createSampleArtifact('spreadsheet')}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: 'rgba(107, 142, 111, 0.1)',
                          color: 'var(--earth-bamboo)',
                          border: '1px solid rgba(107, 142, 111, 0.3)'
                        }}
                      >
                        + Add Sample Spreadsheet
                      </button>
                      <button
                        onClick={() => createSampleArtifact('document')}
                        className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: 'rgba(107, 142, 111, 0.1)',
                          color: 'var(--earth-bamboo)',
                          border: '1px solid rgba(107, 142, 111, 0.3)'
                        }}
                      >
                        + Add Sample Document
                      </button>
                    </div>
                  </motion.div>
                )}
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
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, #007BA7 0%, #00A5CF 100%)',
                          }}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-6 py-4 shadow-sm"
                        )}
                        style={message.role === "user" ? {
                          background: 'linear-gradient(135deg, #007BA7 0%, #00A5CF 100%)',
                          color: 'white'
                        } : {
                          background: 'var(--mode-surface)',
                          border: '1px solid rgba(0, 165, 207, 0.1)'
                        }}
                      >
                        {message.role === "user" ? (
                          <p className="font-light leading-relaxed" style={{ fontSize: '15px', letterSpacing: '0.01em' }}>
                            {message.content}
                          </p>
                        ) : (
                          <Markdown
                            content={message.content}
                            className="font-light leading-relaxed text-sm"
                          />
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <p
                            className="text-xs font-light"
                            style={{
                              color: message.role === "user" ? 'rgba(255, 255, 255, 0.7)' : 'var(--mode-text-tertiary)'
                            }}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.role === "assistant" && (
                            <div className="flex items-center gap-1">
                              <span
                                className="text-[10px] font-light px-2 py-0.5 rounded-full"
                                style={{
                                  background: 'rgba(0, 165, 207, 0.1)',
                                  color: '#00A5CF'
                                }}
                              >
                                AI
                              </span>
                            </div>
                          )}
                        </div>
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
              {/* Action Buttons - Only show when messages exist */}
              {messages.length > 0 && (
                <div className="flex items-center gap-2 mb-3 px-2">
                  <button
                    onClick={() => auth.isAuthenticated ? console.log('TODO: Save chat') : setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title={auth.isAuthenticated ? "Save Chat" : "Sign in to save this chat"}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Chat</span>
                  </button>
                  <button
                    onClick={() => auth.isAuthenticated ? console.log('TODO: Create project') : setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-light text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title={auth.isAuthenticated ? "New Project" : "Sign in to organize chats into projects"}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </button>
                </div>
              )}
              <div
                className="input-glass relative flex items-center gap-3 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-[#00A5CF] transition-all"
                style={{
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => {
                      setShowAttachmentsMenu(!showAttachmentsMenu)
                      setShowIntegrationsMenu(false)
                    }}
                    className={cn(
                      "relative flex items-center justify-center rounded-lg p-2 transition-colors",
                      showAttachmentsMenu
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    title="Attachments (Upload/Download files locally)"
                  >
                    <Paperclip className="w-4 h-4" />
                    {attachedFiles.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#00A5CF] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                        {attachedFiles.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowIntegrationsMenu(!showIntegrationsMenu)
                      setShowAttachmentsMenu(false)
                    }}
                    className={cn(
                      "flex items-center justify-center rounded-lg p-2 transition-colors",
                      showIntegrationsMenu
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    title="Integrations"
                  >
                    <Plug className="w-4 h-4" />
                  </button>

                  {/* Attachments Menu */}
                  <AnimatePresence>
                    {showAttachmentsMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[280px]"
                      >
                        <div className="p-2">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Attachments</span>
                            <button
                              onClick={() => setShowAttachmentsMenu(false)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                          >
                            <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Upload Files</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Excel, PDF, Markdown</div>
                            </div>
                          </button>

                          <button
                            onClick={handleDownloadConversation}
                            disabled={messages.length === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Download Chat</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Save as Markdown</div>
                            </div>
                          </button>

                          {attachedFiles.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 mb-1">
                                Attached Files ({attachedFiles.length})
                              </div>
                              {attachedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? (
                                      <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    ) : file.name.endsWith('.pdf') ? (
                                      <File className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    )}
                                    <span className="text-xs text-gray-900 dark:text-gray-100 truncate">{file.name}</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Integrations Menu */}
                  <AnimatePresence>
                    {showIntegrationsMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[280px]"
                      >
                        <div className="p-2">
                          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Integrations</span>
                            <button
                              onClick={() => setShowIntegrationsMenu(false)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                            Coming soon: Connect to QuickBooks, Excel Online, Google Sheets, and more
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.pdf,.md,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={mode === "learning" ? "Ask about financial concepts..." : "Describe your project needs..."}
                  className="flex-1 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-light leading-relaxed"
                  rows={1}
                  style={{
                    maxHeight: '200px',
                    minHeight: '24px',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    overflow: 'auto'
                  }}
                />
                <Button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl shadow-lg"
                  style={{
                    background: input.trim() ? 'linear-gradient(to right, #00A5CF, #0ea5e9)' : '#e5e7eb',
                    color: input.trim() ? '#ffffff' : '#9ca3af'
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

        {/* Artifacts Panel - Right Side */}
        <AnimatePresence>
          {isArtifactsPanelOpen && artifacts.length > 0 && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-96 border-l shadow-2xl z-40 flex flex-col"
              style={{
                background: 'var(--mode-surface)',
                borderLeftColor: 'rgba(107, 142, 111, 0.15)', // Bamboo Green accent
                backdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              {/* Header */}
              <div
                className="relative p-6 overflow-hidden border-b"
                style={{
                  borderBottomColor: 'rgba(107, 142, 111, 0.15)',
                  background: 'linear-gradient(135deg, rgba(107, 142, 111, 0.08) 0%, rgba(107, 142, 111, 0.03) 100%)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5" style={{ color: 'var(--earth-bamboo)' }} />
                    <h2 className="text-lg font-light" style={{ color: 'var(--mode-text-primary)' }}>
                      Artifacts
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsArtifactsPanelOpen(false)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--mode-text-secondary)' }} />
                  </button>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--mode-text-tertiary)' }}>
                  {artifacts.length} document{artifacts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Artifacts List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {artifacts.map((artifact) => (
                  <button
                    key={artifact.id}
                    onClick={() => setSelectedArtifact(artifact)}
                    className="w-full p-4 rounded-lg border transition-all text-left"
                    style={{
                      background: selectedArtifact?.id === artifact.id
                        ? 'rgba(107, 142, 111, 0.1)'
                        : 'transparent',
                      borderColor: selectedArtifact?.id === artifact.id
                        ? 'rgba(107, 142, 111, 0.3)'
                        : 'rgba(107, 142, 111, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedArtifact?.id !== artifact.id) {
                        e.currentTarget.style.background = 'rgba(107, 142, 111, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedArtifact?.id !== artifact.id) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(107, 142, 111, 0.15)' }}>
                        {artifact.type === 'spreadsheet' && <FileSpreadsheet className="w-4 h-4" style={{ color: 'var(--earth-bamboo)' }} />}
                        {artifact.type === 'document' && <File className="w-4 h-4" style={{ color: 'var(--earth-bamboo)' }} />}
                        {artifact.type === 'code' && <FileText className="w-4 h-4" style={{ color: 'var(--earth-bamboo)' }} />}
                        {artifact.type === 'chart' && <BarChart3 className="w-4 h-4" style={{ color: 'var(--earth-bamboo)' }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate" style={{ color: 'var(--mode-text-primary)' }}>
                          {artifact.title}
                        </h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--mode-text-tertiary)' }}>
                          {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--mode-text-tertiary)' }}>
                          {new Date(artifact.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Artifact Preview */}
              {selectedArtifact && (
                <div className="border-t p-4" style={{ borderTopColor: 'rgba(107, 142, 111, 0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium" style={{ color: 'var(--mode-text-primary)' }}>
                      {selectedArtifact.title}
                    </h3>
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Download className="w-4 h-4" style={{ color: 'var(--mode-text-secondary)' }} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-3 rounded-lg font-mono text-xs" style={{
                    background: 'rgba(107, 142, 111, 0.05)',
                    color: 'var(--mode-text-secondary)'
                  }}>
                    {typeof selectedArtifact.content === 'string' ? (
                      <pre className="whitespace-pre-wrap">{selectedArtifact.content}</pre>
                    ) : (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(selectedArtifact.content, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Artifacts Toggle Button - Right Side */}
        {artifacts.length > 0 && (
          <button
            onClick={() => setIsArtifactsPanelOpen(!isArtifactsPanelOpen)}
            className="fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300"
            style={{
              right: isArtifactsPanelOpen ? '384px' : '0px',
              background: 'linear-gradient(135deg, #6B8E6F 0%, #5A7D5E 100%)',
              borderTopLeftRadius: '12px',
              borderBottomLeftRadius: '12px',
              padding: '24px 8px',
              boxShadow: '-2px 0 12px rgba(107, 142, 111, 0.3)'
            }}
            title={isArtifactsPanelOpen ? "Hide Artifacts" : "Show Artifacts"}
          >
            {isArtifactsPanelOpen ? (
              <ChevronRight className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
