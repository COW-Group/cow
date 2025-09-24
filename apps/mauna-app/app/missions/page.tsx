"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Search,
  Plus,
  Calendar,
  Target,
  Users,
  ArrowLeft,
  ListTodo,
  FolderKanban,
  Globe,
  Rocket,
  Lightbulb,
  Box,
  GitFork,
  Atom,
} from "lucide-react"
import { ProjectRoadmap } from "@/components/project-roadmap"
import { GoalsCard } from "@/components/goals-card"
import { AddGoalCard } from "@/components/add-goal-card"
import { GoalDetailsCard } from "@/components/goal-details-card"
import { StrategyMapCard } from "@/components/strategy-map-card"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import type { Project, UserProfile, Goal } from "@/lib/types"

// Define types for Mirror Box, Fiber, Strand, Pillar, and SampleMission
interface MirrorBoxEntry {
  theory: string
  perspective: string
}

interface Fiber {
  id: string
  name: string
  description: string
  mirrorBox: MirrorBoxEntry[]
}

interface Strand {
  id: string
  name: string
  description: string
  fibers: Fiber[]
  mirrorBox: MirrorBoxEntry[]
}

interface Pillar {
  id: string
  name: string // Changed from title to name for consistency
  description: string
  strands: Strand[]
  mirrorBox: MirrorBoxEntry[]
}

interface SampleMission {
  id: string
  name: string
  description: string
  status: "active" | "planning" | "completed" | "on-hold" | "cancelled"
  progress: number
  dueDate: string
  areas: string[]
  teamMembers: string[]
  pillars: Pillar[]
  mirrorBox: MirrorBoxEntry[]
}

export default function MissionsPage() {
  const { user } = useAuth()
  const userId = user?.id

  const missionStatement = "Empower Teams to Achieve Greatness" // Example Mission Statement

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompanyProject, setSelectedCompanyProject] = useState<Project | null>(null)
  const [activeCard, setActiveCard] = useState<
    | "companies"
    | "goals"
    | "portfolios"
    | "projects"
    | "search"
    | "create-company"
    | "add-goal"
    | "goal-details"
    | "strategy-map"
    | "missions"
    | "pillars"
    | "strands" // New
    | "fibers" // New
    | "mirror-box" // New
    | null
  >("missions") // Default to showing missions

  const [newCompanyProject, setNewCompanyProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    areas: [] as string[],
    teamMembers: [] as string[],
  })
  const [companyProjects, setCompanyProjects] = useState<Project[]>([])
  const [filteredCompanyProjects, setFilteredCompanyProjects] = useState<Project[]>([])

  // State for Goals
  const [goals, setGoals] = useState<Goal[]>([])
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([])
  const [currentGoalFilter, setCurrentGoalFilter] = useState<"Company" | "Team" | "My" | "All">("All")
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all-time") // New state for time frame filter

  // State for selected mission, pillar, strand, fiber to display their details/children
  const [selectedMission, setSelectedMission] = useState<SampleMission | null>(null)
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null)
  const [selectedStrand, setSelectedStrand] = useState<Strand | null>(null)
  const [selectedFiber, setSelectedFiber] = useState<Fiber | null>(null)

  // State for the item whose mirror box is currently being viewed
  const [selectedMirrorBoxItem, setSelectedMirrorBoxItem] = useState<{
    name: string
    type: "Mission" | "Pillar" | "Strand" | "Fiber"
    data: MirrorBoxEntry[]
  } | null>(null)

  // Sample Missions Data with Pillars, Strands, Fibers, and Mirror Box data
  const sampleMissions: SampleMission[] = [
    {
      id: "mission-1",
      name: "Thriving Communities",
      description:
        "Foster vibrant, inclusive, and resilient communities worldwide through sustainable development and social equity initiatives.",
      status: "active",
      progress: 75,
      dueDate: "2025-12-31",
      areas: ["Education", "Healthcare", "Infrastructure"],
      teamMembers: ["Alice", "Bob"],
      pillars: [
        {
          id: "pillar-1-1",
          name: "Food Security",
          description: "Ensuring consistent access to safe, nutritious food for all.",
          strands: [
            {
              id: "strand-1-1-1",
              name: "AI-Driven Crop Optimization",
              description: "Using AI to predict crop yields and optimize distribution.",
              fibers: [
                {
                  id: "fiber-1-1-1-1",
                  name: "Predictive Analytics for Yields",
                  description: "Leveraging machine learning to forecast crop output.",
                  mirrorBox: [
                    { theory: "Technological Determinism", perspective: "AI will solve food scarcity." },
                    {
                      theory: "Agrarianism",
                      perspective: "Technology must support traditional farming, not replace it.",
                    },
                  ],
                },
                {
                  id: "fiber-1-1-1-2",
                  name: "Supply Chain Optimization",
                  description: "Streamlining food distribution from farm to table.",
                  mirrorBox: [
                    { theory: "Logistics Theory", perspective: "Efficiency is key to reducing waste." },
                    { theory: "Food Sovereignty", perspective: "Local control over food systems is paramount." },
                  ],
                },
              ],
              mirrorBox: [
                {
                  theory: "Systems Thinking",
                  perspective: "Food security is interconnected with climate, economy, and social factors.",
                },
                {
                  theory: "Techno-Optimism",
                  perspective: "Technology is the primary driver for progress in food systems.",
                },
              ],
            },
            {
              id: "strand-1-1-2",
              name: "Blockchain for Transparent Aid",
              description: "Using blockchain to ensure transparent food aid delivery.",
              fibers: [
                {
                  id: "fiber-1-1-2-1",
                  name: "Immutable Ledger for Donations",
                  description: "Creating an unchangeable record of food aid transactions.",
                  mirrorBox: [
                    { theory: "Trustless Systems", perspective: "Blockchain removes the need for intermediaries." },
                    {
                      theory: "Humanitarian Aid Ethics",
                      perspective: "Transparency must not compromise privacy or dignity.",
                    },
                  ],
                },
              ],
              mirrorBox: [
                { theory: "Decentralization Theory", perspective: "Distributing control enhances accountability." },
                {
                  theory: "Critical Blockchain Studies",
                  perspective: "Blockchain's benefits may be overstated without proper governance.",
                },
              ],
            },
            {
              id: "strand-1-1-3",
              name: "Climate-Resilient Crops",
              description: "Prioritizing and developing crops that can withstand climate change.",
              fibers: [
                {
                  id: "fiber-1-1-3-1",
                  name: "Genetic Engineering for Resilience",
                  description: "Developing new crop varieties through biotechnology.",
                  mirrorBox: [
                    {
                      theory: "Biotechnology Ethics",
                      perspective: "Genetic modification raises questions about naturalness and control.",
                    },
                    {
                      theory: "Food Security Pragmatism",
                      perspective: "GM crops are a necessary tool for feeding a growing population.",
                    },
                  ],
                },
              ],
              mirrorBox: [
                { theory: "Ecological Economics", perspective: "Economic systems must align with ecological limits." },
                { theory: "Adaptation Theory", perspective: "Societies must adapt to unavoidable climate impacts." },
              ],
            },
          ],
          mirrorBox: [
            { theory: "Maslow's Hierarchy", perspective: "Food is a fundamental physiological need." },
            {
              theory: "Amartya Sen's Capability Approach",
              perspective: "Food security is about the ability to access food, not just its availability.",
            },
          ],
        },
        {
          id: "pillar-1-2",
          name: "Water Access",
          description: "Ensuring equitable and sustainable access to clean water.",
          strands: [], // Placeholder
          mirrorBox: [
            {
              theory: "Environmental Justice",
              perspective: "Access to clean water is a human right, often unequally distributed.",
            },
            {
              theory: "Tragedy of the Commons",
              perspective: "Unregulated access to shared water resources leads to depletion.",
            },
          ],
        },
        {
          id: "pillar-1-3",
          name: "Health Equity",
          description: "Achieving the highest level of health for all people.",
          strands: [], // Placeholder
          mirrorBox: [
            {
              theory: "Social Determinants of Health",
              perspective: "Health is shaped by social, economic, and environmental factors.",
            },
            {
              theory: "Public Health Ethics",
              perspective: "Prioritizing collective well-being while respecting individual autonomy.",
            },
          ],
        },
        {
          id: "pillar-1-4",
          name: "Economic Resilience",
          description: "Building economies that can withstand shocks and promote shared prosperity.",
          strands: [], // Placeholder
          mirrorBox: [
            { theory: "Development Economics", perspective: "Focus on sustainable growth and poverty reduction." },
            {
              theory: "Vulnerability Theory",
              perspective: "Understanding factors that make communities susceptible to economic shocks.",
            },
          ],
        },
      ],
      mirrorBox: [
        {
          theory: "Community Development Theory",
          perspective: "Empowering local communities to drive their own change.",
        },
        {
          theory: "Global Citizenship",
          perspective: "Recognizing interconnectedness and shared responsibility for global well-being.",
        },
      ],
    },
    {
      id: "mission-2",
      name: "Empowered Futures",
      description:
        "Equip individuals with the knowledge, skills, and resources to shape their own prosperous and fulfilling futures.",
      status: "planning",
      progress: 30,
      dueDate: "2026-06-30",
      areas: ["Skill Development", "Financial Literacy", "Mentorship"],
      teamMembers: ["Charlie", "Dana"],
      pillars: [
        {
          id: "pillar-2-1",
          name: "Digital Literacy",
          description: "Empowering individuals with essential digital skills.",
          strands: [],
          mirrorBox: [],
        },
      ],
      mirrorBox: [],
    },
    {
      id: "mission-3",
      name: "Regenerative Economies",
      description:
        "Transition to economic systems that restore and regenerate natural resources, promote circularity, and create shared prosperity.",
      status: "on-hold",
      progress: 10,
      dueDate: "2027-01-01",
      areas: ["Circular Economy", "Sustainable Agriculture", "Green Tech"],
      teamMembers: ["Eve", "Frank"],
      pillars: [
        {
          id: "pillar-3-1",
          name: "Sustainable Production",
          description: "Innovating for eco-friendly manufacturing processes.",
          strands: [],
          mirrorBox: [],
        },
      ],
      mirrorBox: [],
    },
    {
      id: "mission-4",
      name: "Platetary Restoration",
      description: "Heal and protect Earth's ecosystems, biodiversity, and climate for current and future generations.",
      status: "active",
      progress: 90,
      dueDate: "2024-12-31",
      areas: ["Conservation", "Climate Action", "Pollution Control"],
      teamMembers: ["Grace", "Heidi"],
      pillars: [
        {
          id: "pillar-4-1",
          name: "Biodiversity Conservation",
          description: "Protecting and restoring diverse life forms.",
          strands: [],
          mirrorBox: [],
        },
      ],
      mirrorBox: [],
    },
    {
      id: "mission-5",
      name: "Just Systems",
      description:
        "Advocate for and build equitable and fair systems that uphold human rights, justice, and dignity for all.",
      status: "completed",
      progress: 100,
      dueDate: "2024-06-30",
      areas: ["Legal Reform", "Human Rights", "Social Justice"],
      teamMembers: ["Ivan", "Judy"],
      pillars: [
        {
          id: "pillar-5-1",
          name: "Equitable Governance",
          description: "Promoting fair and transparent decision-making.",
          strands: [],
          mirrorBox: [],
        },
      ],
      mirrorBox: [],
    },
  ]

  // State for user search for team members (for projects/company projects)
  const [teamMemberSearchQuery, setTeamMemberSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<UserProfile[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCompanyProjects = useCallback(async () => {
    if (userId) {
      try {
        const fetchedProjects = await databaseService.fetchProjects(userId) // Still fetching from 'projects' table
        setCompanyProjects(fetchedProjects)
        setFilteredCompanyProjects(fetchedProjects) // Initialize filtered with all
      } catch (error) {
        console.error("Failed to fetch company projects:", error)
        // Handle error (e.g., show a toast)
      }
    }
  }, [userId])

  // Helper to get quarter/year dates
  const getDatesForTimeframe = (timeframe: string) => {
    const now = new Date()
    let startDate: Date | null = null
    let endDate: Date | null = null

    switch (timeframe) {
      case "current-quarter": {
        const currentQuarter = Math.floor(now.getMonth() / 3) // 0, 1, 2, 3
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1)
        endDate = new Date(now.getFullYear(), currentQuarter * 3 + 3, 0) // Last day of the quarter
        break
      }
      case "next-quarter": {
        let nextQuarterMonth = Math.floor(now.getMonth() / 3) * 3 + 3
        let nextQuarterYear = now.getFullYear()
        if (nextQuarterMonth >= 12) {
          nextQuarterMonth -= 12
          nextQuarterYear += 1
        }
        startDate = new Date(nextQuarterYear, nextQuarterMonth, 1)
        endDate = new Date(nextQuarterYear, nextQuarterMonth + 3, 0)
        break
      }
      case "current-year":
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      case "next-year":
        startDate = new Date(now.getFullYear() + 1, 0, 1)
        endDate = new Date(now.getFullYear() + 1, 11, 31)
        break
      case "semi-annual-h1":
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 5, 30)
        break
      case "semi-annual-h2":
        startDate = new Date(now.getFullYear(), 6, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      case "all-time":
      default:
        // No date filtering
        break
    }
    return { startDate, endDate }
  }

  // Centralized filtering function
  const applyAllFilters = useCallback(() => {
    let tempGoals = [...goals]

    // 1. Apply Goal Type Filter (Company, Team, My, All)
    if (currentGoalFilter !== "All") {
      tempGoals = tempGoals.filter((goal) => {
        if (currentGoalFilter === "Company") {
          return goal.visibility?.type === "Company"
        }
        if (currentGoalFilter === "Team") {
          return goal.visibility?.type === "Team"
        }
        if (currentGoalFilter === "My") {
          return goal.owners.includes(userId || "") // Assuming 'My' means owned by current user
        }
        return true // Should not reach here if currentGoalFilter is not "All"
      })
    }

    // 2. Apply Search Query Filter
    if (searchQuery.trim()) {
      tempGoals = tempGoals.filter(
        (goal) =>
          goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          goal.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // 3. Apply Timeframe Filter
    const { startDate: filterStartDate, endDate: filterEndDate } = getDatesForTimeframe(selectedTimeframe)

    if (filterStartDate && filterEndDate) {
      tempGoals = tempGoals.filter((goal) => {
        if (!goal.startDate && !goal.endDate) return false // Goals without dates don't fit a time range

        const goalStart = goal.startDate ? new Date(goal.startDate) : null
        const goalEnd = goal.endDate ? new Date(goal.endDate) : null

        // Check for overlap:
        // (Goal starts before or during filter end) AND (Goal ends after or during filter start)
        const overlaps = (!goalStart || goalStart <= filterEndDate) && (!goalEnd || goalEnd >= filterStartDate)

        return overlaps
      })
    }

    setFilteredGoals(tempGoals)
  }, [goals, currentGoalFilter, searchQuery, selectedTimeframe, userId])

  const fetchGoals = useCallback(async () => {
    if (userId) {
      try {
        // Fetch ALL goals for the user, filtering will happen client-side
        const fetchedGoals = await databaseService.fetchGoals(userId, undefined)
        setGoals(fetchedGoals)
      } catch (error) {
        console.error("Failed to fetch goals:", error)
      }
    }
  }, [userId])

  // Fetch company projects and goals on component mount or user change
  useEffect(() => {
    fetchCompanyProjects()
    fetchGoals()
  }, [fetchCompanyProjects, fetchGoals])

  // Apply filters whenever relevant states change
  useEffect(() => {
    applyAllFilters()
  }, [applyAllFilters])

  // Debounce user search for team members
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (teamMemberSearchQuery.length > 2) {
      setIsSearchingUsers(true)
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await databaseService.fetchUsers(teamMemberSearchQuery)
          setUserSearchResults(results)
        } catch (error) {
          console.error("Error searching users:", error)
          setUserSearchResults([])
        } finally {
          setIsSearchingUsers(false)
        }
      }, 500) // Debounce for 500ms
    } else {
      setUserSearchResults([])
      setIsSearchingUsers(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [teamMemberSearchQuery])

  const handleCompanyProjectSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = companyProjects.filter(
        (companyProject) =>
          companyProject.name.toLowerCase().includes(query.toLowerCase()) ||
          companyProject.description?.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredCompanyProjects(filtered)
    } else {
      setFilteredCompanyProjects(companyProjects) // Show all if search query is empty
    }
  }

  const handleGoalSearch = (query: string) => {
    setSearchQuery(query) // Update search query state
    // applyAllFilters will be called via useEffect due to searchQuery change
  }

  const handleGoalFilterChange = (filter: "Company" | "Team" | "My" | "All") => {
    setCurrentGoalFilter(filter)
    // applyAllFilters will be called via useEffect due to currentGoalFilter change
  }

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe)
    // applyAllFilters will be called via useEffect due to selectedTimeframe change
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "active":
        return "bg-sage-500 text-cream-25"
      case "planning":
        return "bg-logo-blue text-cream-25"
      case "completed":
        return "bg-moss-500 text-cream-25"
      case "on-hold":
        return "bg-ink-400 text-cream-25"
      default:
        return "bg-ink-300 text-ink-900"
    }
  }

  const resetCreateCompanyProjectForm = () => {
    setNewCompanyProject({ name: "", description: "", dueDate: "", areas: [], teamMembers: [] })
    setTeamMemberSearchQuery("")
    setUserSearchResults([])
    setActiveCard("companies") // Go back to companies list after creating
  }

  const handleCreateCompanyProject = async () => {
    if (!userId) {
      console.error("User not authenticated.")
      return
    }
    try {
      const createdCompanyProject = await databaseService.createProject(userId, {
        name: newCompanyProject.name,
        description: newCompanyProject.description,
        dueDate: newCompanyProject.dueDate,
        areas: newCompanyProject.areas,
        teamMembers: newCompanyProject.teamMembers,
        status: "planning", // Default status for new company projects
        progress: 0, // Default progress for new company projects
      })
      setCompanyProjects((prev) => [createdCompanyProject, ...prev])
      setFilteredCompanyProjects((prev) => [createdCompanyProject, ...prev]) // Update filtered list too
      resetCreateCompanyProjectForm()
      // Optionally, show a success toast
    } catch (error) {
      console.error("Failed to create company project:", error)
      // Optionally, show an error toast
    }
  }

  const handleSaveGoal = async (goalData: Omit<Goal, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!userId) {
      console.error("User not authenticated.")
      return
    }
    try {
      if (goalToEdit) {
        const updatedGoal = await databaseService.updateGoal(goalToEdit.id, userId, goalData)
        setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)))
      } else {
        const createdGoal = await databaseService.createGoal(userId, goalData)
        setGoals((prev) => [createdGoal, ...prev])
      }
      setSelectedGoal(null) // Clear selected goal if any
      setGoalToEdit(null) // Clear goal being edited
      setActiveCard("goals") // Go back to goals list
    } catch (error) {
      console.error("Failed to save goal:", error)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!userId) {
      console.error("User not authenticated.")
      return
    }
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await databaseService.deleteGoal(goalId, userId)
        setGoals((prev) => prev.filter((g) => g.id !== goalId))
        if (selectedGoal?.id === goalId) {
          setSelectedGoal(null)
          setActiveCard("goals")
        }
      } catch (error) {
        console.error("Failed to delete goal:", error)
      }
    }
  }

  // Render Project Roadmap if a company project is selected
  if (selectedCompanyProject) {
    return (
      <div className="min-h-screen">
        <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
        <main className="pt-20 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedCompanyProject(null)}
                className="glassmorphism text-cream-25 hover:text-cream-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
              <div className="glassmorphism rounded-lg px-4 py-2">
                <h1 className="text-2xl font-montserrat font-semibold text-cream-25">{selectedCompanyProject.name}</h1>
                <p className="text-cream-100 font-barlow">{selectedCompanyProject.description}</p>
              </div>
            </div>

            <ProjectRoadmap project={selectedCompanyProject} />
          </div>
        </main>
      </div>
    )
  }

  // Render Mirror Box card
  if (activeCard === "mirror-box" && selectedMirrorBoxItem) {
    const backAction = () => {
      if (selectedFiber) {
        setSelectedFiber(null)
        setActiveCard("fibers")
      } else if (selectedStrand) {
        setSelectedStrand(null)
        setActiveCard("strands")
      } else if (selectedPillar) {
        setSelectedPillar(null)
        setActiveCard("pillars")
      } else if (selectedMission) {
        setSelectedMission(null)
        setActiveCard("missions")
      }
      setSelectedMirrorBoxItem(null)
    }

    return (
      <div className="min-h-screen">
        <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
        <main className="pt-20 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={backAction} className="glassmorphism text-cream-25 hover:text-cream-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {selectedMirrorBoxItem.type}
              </Button>
              <div className="glassmorphism rounded-lg px-4 py-2">
                <h1 className="text-2xl font-montserrat font-semibold text-cream-25">
                  Mirror Box: {selectedMirrorBoxItem.name}
                </h1>
                <p className="text-cream-100 font-barlow">
                  Exploring different theories and perspectives on this {selectedMirrorBoxItem.type.toLowerCase()}.
                </p>
              </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Lenses of Understanding</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedMirrorBoxItem.data.length > 0 ? (
                      selectedMirrorBoxItem.data.map((entry, index) => (
                        <Card key={index} className="glassmorphism border-cream-200/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-5 h-5 text-sage-500" />
                              <CardTitle className="text-cream-25 font-montserrat text-lg">{entry.theory}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-cream-100 font-barlow text-sm">{entry.perspective}</p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-cream-100 font-barlow text-center col-span-full">
                        No specific theories or perspectives defined for this item yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Render Fibers card
  if (activeCard === "fibers" && selectedStrand) {
    return (
      <div className="min-h-screen">
        <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
        <main className="pt-20 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedFiber(null)
                  setActiveCard("strands")
                }}
                className="glassmorphism text-cream-25 hover:text-cream-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Strands
              </Button>
              <div className="glassmorphism rounded-lg px-4 py-2">
                <h1 className="text-2xl font-montserrat font-semibold text-cream-25">{selectedStrand.name}</h1>
                <p className="text-cream-100 font-barlow">{selectedStrand.description}</p>
              </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">
                    Fibers of {selectedStrand.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedStrand.fibers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedStrand.fibers.map((fiber) => (
                        <Card key={fiber.id} className="glassmorphism border-cream-200/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Atom className="w-5 h-5 text-moss-500" />
                                <CardTitle className="text-cream-25 font-montserrat text-lg">{fiber.name}</CardTitle>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-cream-200 hover:text-cream-25"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent card click
                                  setSelectedMirrorBoxItem({ name: fiber.name, type: "Fiber", data: fiber.mirrorBox })
                                  setActiveCard("mirror-box")
                                }}
                              >
                                <Box className="w-5 h-5" />
                                <span className="sr-only">Mirror Box</span>
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-cream-100 font-barlow text-sm">{fiber.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-cream-100 font-barlow text-center">No fibers defined for this strand yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Render Strands card
  if (activeCard === "strands" && selectedPillar) {
    return (
      <div className="min-h-screen">
        <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
        <main className="pt-20 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedStrand(null)
                  setActiveCard("pillars")
                }}
                className="glassmorphism text-cream-25 hover:text-cream-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pillars
              </Button>
              <div className="glassmorphism rounded-lg px-4 py-2">
                <h1 className="text-2xl font-montserrat font-semibold text-cream-25">{selectedPillar.name}</h1>
                <p className="text-cream-100 font-barlow">{selectedPillar.description}</p>
              </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">
                    Strands of {selectedPillar.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPillar.strands.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedPillar.strands.map((strand) => (
                        <Card
                          key={strand.id}
                          className="glassmorphism border-cream-200/20 hover:border-cream-200/40 transition-all duration-300 cursor-pointer group"
                          onClick={() => {
                            setSelectedStrand(strand)
                            setActiveCard("fibers")
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GitFork className="w-5 h-5 text-logo-blue" />
                                <CardTitle className="text-cream-25 font-montserrat text-lg group-hover:text-cream-100 transition-colors">
                                  {strand.name}
                                </CardTitle>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-cream-200 hover:text-cream-25"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent card click
                                  setSelectedMirrorBoxItem({
                                    name: strand.name,
                                    type: "Strand",
                                    data: strand.mirrorBox,
                                  })
                                  setActiveCard("mirror-box")
                                }}
                              >
                                <Box className="w-5 h-5" />
                                <span className="sr-only">Mirror Box</span>
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-cream-100 font-barlow text-sm">{strand.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-cream-100 font-barlow text-center">No strands defined for this pillar yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Render Pillars card
  if (activeCard === "pillars" && selectedMission) {
    return (
      <div className="min-h-screen">
        <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
        <main className="pt-20 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedPillar(null)
                  setActiveCard("missions")
                }}
                className="glassmorphism text-cream-25 hover:text-cream-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Missions
              </Button>
              <div className="glassmorphism rounded-lg px-4 py-2">
                <h1 className="text-2xl font-montserrat font-semibold text-cream-25">{selectedMission.name}</h1>
                <p className="text-cream-100 font-barlow">{selectedMission.description}</p>
              </div>
            </div>

            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">
                    Pillars of {selectedMission.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMission.pillars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedMission.pillars.map((pillar) => (
                        <Card
                          key={pillar.id}
                          className="glassmorphism border-cream-200/20 hover:border-cream-200/40 transition-all duration-300 cursor-pointer group"
                          onClick={() => {
                            setSelectedPillar(pillar)
                            setActiveCard("strands")
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-logo-blue" />
                                <CardTitle className="text-cream-25 font-montserrat text-lg group-hover:text-cream-100 transition-colors">
                                  {pillar.name}
                                </CardTitle>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-cream-200 hover:text-cream-25"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent card click
                                  setSelectedMirrorBoxItem({
                                    name: pillar.name,
                                    type: "Pillar",
                                    data: pillar.mirrorBox,
                                  })
                                  setActiveCard("mirror-box")
                                }}
                              >
                                <Box className="w-5 h-5" />
                                <span className="sr-only">Mirror Box</span>
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-cream-100 font-barlow text-sm">{pillar.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-cream-100 font-barlow text-center">No pillars defined for this mission yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={false} onToggleMenu={() => console.log('Menu toggle')} />
      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Rocket className="w-8 h-8 text-logo-blue" /> {/* Changed icon to Rocket */}
              <h1 className="text-3xl font-montserrat font-light text-cream-25">Missions</h1>{" "}
              {/* Changed title to Missions */}
            </div>
            <p className="text-lg text-cream-100 font-barlow max-w-2xl mx-auto">
              Define and track your overarching global missions and their foundational pillars.
            </p>
            {/* Mission Statement Banner */}
            <div className="glassmorphism rounded-lg p-4 mt-6 max-w-xl mx-auto border border-logo-blue/20">
              <h2 className="text-xl font-montserrat font-semibold text-logo-blue mb-2">Our Mission</h2>
              <p className="text-cream-100 font-caveat text-2xl">{missionStatement}</p>
            </div>
          </div>

          {/* Control Menu */}
          <div className="flex justify-center gap-4 mb-8 glassmorphism rounded-lg p-2">
            <Button
              onClick={() => setActiveCard("missions")} // New button for Missions
              className={`zen-control-button ${activeCard === "missions" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <Globe className="w-5 h-5" /> {/* Globe icon for Missions */}
              <span className="sr-only">Missions</span>
            </Button>
            <Button
              onClick={() => setActiveCard("companies")}
              className={`zen-control-button ${activeCard === "companies" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <ListTodo className="w-5 h-5" />
              <span className="sr-only">Companies</span>
            </Button>
            <Button
              onClick={() => setActiveCard("goals")}
              className={`zen-control-button ${activeCard === "goals" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <Target className="w-5 h-5" />
              <span className="sr-only">Goals</span>
            </Button>
            <Button
              onClick={() => setActiveCard("portfolios")}
              className={`zen-control-button ${
                activeCard === "portfolios" ? "bg-logo-blue/20 border-logo-blue/40" : ""
              }`}
            >
              <FolderKanban className="w-5 h-5" />
              <span className="sr-only">Portfolios</span>
            </Button>
            <Button
              onClick={() => setActiveCard("projects")}
              className={`zen-control-button ${activeCard === "projects" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <Briefcase className="w-5 h-5" />
              <span className="sr-only">Projects</span>
            </Button>
            <Button
              onClick={() => setActiveCard("search")}
              className={`zen-control-button ${activeCard === "search" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button
              onClick={() => setActiveCard("create-company")}
              className={`zen-control-button ${activeCard === "create-company" ? "bg-logo-blue/20 border-logo-blue/40" : ""}`}
            >
              <Plus className="w-5 h-5" />
              <span className="sr-only">Create Company</span>
            </Button>
          </div>

          {/* Missions Card (New Section) */}
          {activeCard === "missions" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Global Missions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleMissions.map((mission) => (
                      <Card
                        key={mission.id}
                        className="glassmorphism border-cream-200/20 hover:border-cream-200/40 transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                          setSelectedMission(mission)
                          setActiveCard("pillars")
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Globe className="w-5 h-5 text-logo-blue" />
                              <CardTitle className="text-cream-25 font-montserrat text-lg group-hover:text-cream-100 transition-colors">
                                {mission.name}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getStatusColor(mission.status)} font-barlow text-xs`}>
                                {mission.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-cream-200 hover:text-cream-25"
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent card click
                                  setSelectedMirrorBoxItem({
                                    name: mission.name,
                                    type: "Mission",
                                    data: mission.mirrorBox,
                                  })
                                  setActiveCard("mirror-box")
                                }}
                              >
                                <Box className="w-5 h-5" />
                                <span className="sr-only">Mirror Box</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-cream-100 font-barlow text-sm line-clamp-2">{mission.description}</p>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-cream-200 font-barlow">Progress</span>
                              <span className="text-cream-25 font-barlow">{mission.progress}%</span>
                            </div>
                            <div className="w-full bg-cream-200/20 rounded-full h-2">
                              <div
                                className="bg-logo-blue h-2 rounded-full transition-all duration-300"
                                style={{ width: `${mission.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Mission Details */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-cream-200">
                              <Users className="w-4 h-4" />
                              <span className="font-barlow">{mission.teamMembers.length}</span>
                            </div>
                            <div className="flex items-center gap-1 text-cream-200">
                              <Calendar className="w-4 h-4" />
                              <span className="font-barlow">{mission.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1 text-cream-200">
                              <Target className="w-4 h-4" />
                              <span className="font-barlow">{mission.areas.length} areas</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Companies List Card (formerly Missions List Card) */}
          {activeCard === "companies" && companyProjects.length > 0 && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Your Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanyProjects.map(
                      (
                        companyProject, // Changed to filteredCompanyProjects
                      ) => (
                        <Card
                          key={companyProject.id}
                          className="glassmorphism border-cream-200/20 hover:border-cream-200/40 transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedCompanyProject(companyProject)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-cream-25 font-montserrat text-lg group-hover:text-cream-100 transition-colors">
                                {companyProject.name}
                              </CardTitle>
                              <Badge className={`${getStatusColor(companyProject.status)} font-barlow text-xs`}>
                                {companyProject.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-cream-100 font-barlow text-sm line-clamp-2">
                              {companyProject.description}
                            </p>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-cream-200 font-barlow">Progress</span>
                                <span className="text-cream-25 font-barlow">{companyProject.progress}%</span>
                              </div>
                              <div className="w-full bg-cream-200/20 rounded-full h-2">
                                <div
                                  className="bg-logo-blue h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${companyProject.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Company Project Details */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-cream-200">
                                <Users className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.teamMembers.length}</span>
                              </div>
                              <div className="flex items-center gap-1 text-cream-200">
                                <Calendar className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-cream-200">
                                <Target className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.areas.length} areas</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State for Companies (when no companies and 'companies' card is active) */}
          {activeCard === "companies" && companyProjects.length === 0 && (
            <div className="text-center py-12 animate-in slide-in-from-top-4 duration-300">
              <div className="glassmorphism rounded-xl p-8 max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-logo-blue mx-auto mb-4" />
                <h3 className="text-xl font-montserrat font-medium text-cream-25 mb-2">Ready to Get Started?</h3>
                <p className="text-cream-100 font-barlow mb-6">
                  Use the menu above to search existing companies or create a new one.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => setActiveCard("search")}
                    variant="outline"
                    className="glassmorphism-inner-card border-cream-200/20 text-cream-25 hover:text-cream-100 font-barlow"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Companies
                  </Button>
                  <Button
                    onClick={() => setActiveCard("create-company")}
                    className="bg-logo-blue hover:bg-logo-blue/90 text-cream-25 font-barlow"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Company
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search Company Project Card (formerly Search Mission Card) */}
          {activeCard === "search" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Search Companies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cream-200" />
                    <Input
                      placeholder="Search companies by name or description..."
                      value={searchQuery}
                      onChange={(e) => handleCompanyProjectSearch(e.target.value)}
                      className="pl-10 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
                    />
                  </div>
                  {searchQuery && (
                    <div className="text-sm text-cream-200 font-barlow">
                      Found {filteredCompanyProjects.length} compan{filteredCompanyProjects.length !== 1 ? "ies" : "y"}
                    </div>
                  )}
                  {filteredCompanyProjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {filteredCompanyProjects.map((companyProject) => (
                        <Card
                          key={companyProject.id}
                          className="glassmorphism border-cream-200/20 hover:border-cream-200/40 transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedCompanyProject(companyProject)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-cream-25 font-montserrat text-lg group-hover:text-cream-100 transition-colors">
                                {companyProject.name}
                              </CardTitle>
                              <Badge className={`${getStatusColor(companyProject.status)} font-barlow text-xs`}>
                                {companyProject.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-cream-100 font-barlow text-sm line-clamp-2">
                              {companyProject.description}
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-cream-200 font-barlow">Progress</span>
                                <span className="text-cream-25 font-barlow">{companyProject.progress}%</span>
                              </div>
                              <div className="w-full bg-cream-200/20 rounded-full h-2">
                                <div
                                  className="bg-logo-blue h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${companyProject.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-cream-200">
                                <Users className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.teamMembers.length}</span>
                              </div>
                              <div className="flex items-center gap-1 text-cream-200">
                                <Calendar className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-cream-200">
                                <Target className="w-4 h-4" />
                                <span className="font-barlow">{companyProject.areas.length} areas</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  {searchQuery && filteredCompanyProjects.length === 0 && (
                    <div className="text-center text-cream-100 font-barlow">
                      No companies found matching your search.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Create Company Project Card (formerly Create Mission Card) */}
          {activeCard === "create-company" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Create New Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-cream-25 font-barlow font-medium">Company Name</label>
                      <Input
                        placeholder="Enter company name..."
                        value={newCompanyProject.name}
                        onChange={(e) => setNewCompanyProject({ ...newCompanyProject, name: e.target.value })}
                        className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-cream-25 font-barlow font-medium">Due Date</label>
                      <Input
                        type="date"
                        value={newCompanyProject.dueDate}
                        onChange={(e) => setNewCompanyProject({ ...newCompanyProject, dueDate: e.target.value })}
                        className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-cream-25 font-barlow font-medium">Description</label>
                    <textarea
                      placeholder="Describe your company project..."
                      value={newCompanyProject.description}
                      onChange={(e) => setNewCompanyProject({ ...newCompanyProject, description: e.target.value })}
                      rows={3}
                      className="w-full glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow rounded-md px-3 py-2 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-cream-25 font-barlow font-medium">Company Areas</label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Add company area (press Enter)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              const value = e.currentTarget.value.trim()
                              if (value && !newCompanyProject.areas.includes(value)) {
                                setNewCompanyProject({
                                  ...newCompanyProject,
                                  areas: [...newCompanyProject.areas, value],
                                })
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                          className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newCompanyProject.areas.map((area, index) => (
                            <Badge
                              key={index}
                              className="bg-logo-blue text-cream-25 font-barlow cursor-pointer hover:bg-logo-blue/80"
                              onClick={() =>
                                setNewCompanyProject({
                                  ...newCompanyProject,
                                  areas: newCompanyProject.areas.filter((_, i) => i !== index),
                                })
                              }
                            >
                              {area} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-cream-25 font-barlow font-medium">Team Members</label>
                      <div className="relative space-y-2">
                        <Input
                          placeholder="Search and add team member..."
                          value={teamMemberSearchQuery}
                          onChange={(e) => setTeamMemberSearchQuery(e.target.value)}
                          className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
                        />
                        {isSearchingUsers && teamMemberSearchQuery.length > 2 && (
                          <div className="absolute z-10 w-full bg-ink-800/80 backdrop-blur-md rounded-md shadow-lg mt-1 p-2 text-cream-200 font-barlow">
                            Searching...
                          </div>
                        )}
                        {userSearchResults.length > 0 && teamMemberSearchQuery.length > 2 && !isSearchingUsers && (
                          <ul className="absolute z-10 w-full bg-ink-800/80 backdrop-blur-md rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {userSearchResults.map((userProfile) => (
                              <li
                                key={userProfile.id}
                                className="px-3 py-2 cursor-pointer hover:bg-logo-blue/20 text-cream-25 font-barlow"
                                onClick={() => {
                                  if (!newCompanyProject.teamMembers.includes(userProfile.preferred_name)) {
                                    setNewCompanyProject({
                                      ...newCompanyProject,
                                      teamMembers: [...newCompanyProject.teamMembers, userProfile.preferred_name],
                                    })
                                  }
                                  setTeamMemberSearchQuery("") // Clear search input
                                  setUserSearchResults([]) // Clear search results
                                }}
                              >
                                {userProfile.preferred_name}
                              </li>
                            ))}
                          </ul>
                        )}
                        {userSearchResults.length === 0 && teamMemberSearchQuery.length > 2 && !isSearchingUsers && (
                          <div className="absolute z-10 w-full bg-ink-800/80 backdrop-blur-md rounded-md shadow-lg mt-1 p-2 text-cream-200 font-barlow">
                            No users found.
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newCompanyProject.teamMembers.map((member, index) => (
                            <Badge
                              key={index}
                              className="bg-sage-500 text-cream-25 font-barlow cursor-pointer hover:bg-sage-500/80"
                              onClick={() =>
                                setNewCompanyProject({
                                  ...newCompanyProject,
                                  teamMembers: newCompanyProject.teamMembers.filter((_, i) => i !== index),
                                })
                              }
                            >
                              {member} ✕
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      variant="ghost"
                      onClick={resetCreateCompanyProjectForm}
                      className="text-cream-200 hover:text-cream-25 font-barlow"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCompanyProject}
                      disabled={!newCompanyProject.name || !newCompanyProject.description || !userId}
                      className="bg-logo-blue hover:bg-logo-blue/90 text-cream-25 font-barlow disabled:opacity-50"
                    >
                      Create Company
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Goals Card */}
          {activeCard === "goals" && (
            <GoalsCard
              goals={filteredGoals}
              onAddGoalClick={() => {
                setGoalToEdit(null) // Ensure we're adding, not editing
                setActiveCard("add-goal")
              }}
              onGoalSelect={(goal) => {
                setSelectedGoal(goal)
                setActiveCard("goal-details")
              }}
              onFilterChange={handleGoalFilterChange}
              onSearch={handleGoalSearch}
              onEditGoal={(goal) => {
                setGoalToEdit(goal)
                setActiveCard("add-goal")
              }}
              onDeleteGoal={handleDeleteGoal}
              currentFilter={currentGoalFilter}
              currentTimeframe={selectedTimeframe} // Pass new prop
              onTimeframeChange={handleTimeframeChange} // Pass new prop
            />
          )}

          {/* Add/Edit Goal Card */}
          {activeCard === "add-goal" && (
            <AddGoalCard
              goalToEdit={goalToEdit}
              onSave={handleSaveGoal}
              onCancel={() => {
                setGoalToEdit(null)
                setActiveCard("goals")
              }}
              existingGoals={goals} // Pass all goals for parent goal selection
            />
          )}

          {/* Goal Details Card */}
          {activeCard === "goal-details" && selectedGoal && (
            <GoalDetailsCard
              goal={selectedGoal}
              onClose={() => {
                setSelectedGoal(null)
                setActiveCard("goals")
              }}
              onEdit={(goal) => {
                setGoalToEdit(goal)
                setActiveCard("add-goal")
              }}
            />
          )}

          {/* Strategy Map Card */}
          {activeCard === "strategy-map" && (
            <StrategyMapCard goals={goals} onClose={() => setActiveCard("goals")} missionStatement={missionStatement} />
          )}

          {/* Portfolios Card */}
          {activeCard === "portfolios" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Portfolios Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-cream-100 font-barlow">
                  {/* Content for Portfolios Overview */}
                  <p>Manage your various portfolios, whether personal projects, investments, or creative works.</p>
                  <p className="mt-2">Coming soon: Portfolio visualization and detailed asset tracking.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projects Card (if distinct from companies) */}
          {activeCard === "projects" && (
            <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
              <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
                <CardHeader>
                  <CardTitle className="text-cream-25 font-montserrat text-xl">Project Deep Dive</CardTitle>
                </CardHeader>
                <CardContent className="text-cream-100 font-barlow">
                  {/* Content for Project Deep Dive */}
                  <p>Explore specific projects in detail, breaking down tasks and timelines.</p>
                  <p className="mt-2">Coming soon: Advanced project planning and collaboration tools.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
