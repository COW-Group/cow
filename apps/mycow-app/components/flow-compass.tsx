"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { SankeyDiagram } from "./sankey-diagram"
import { ZenCard } from "./zen-card"
import { financialData } from "@/lib/data"
import {
  Target,
  TrendingUp,
  TrendingDown,
  Edit,
  SlidersHorizontal,
  Wallet,
  Scale,
  LayoutGrid,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Settings,
  Edit3,
} from "lucide-react"
import { motion } from "framer-motion"
import { FlowEditorModal } from "./flow-editor-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WealthVisionSection } from "./wealth-vision-section"
import {
  format,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  parseISO,
  differenceInYears,
} from "date-fns"
import { BalanceSettingsModal } from "./balance-settings-modal"
import { useRouter } from "next/navigation"
import { getFinancialDataForPeriod } from "@/app/actions/financial-actions"
import { getUserBirthday, saveUserBirthday } from "@/app/actions/user-actions"
import type { FinancialInflow, FinancialOutflow } from "@/lib/types"
import { BirthdayEditModal } from "./birthday-edit-modal"

// Define types for financial data to ensure consistency
interface Inflow {
  name: string
  amount: number
  type: "income" | "assets"
  color: string
  goalLinked: string | null
}

interface Outflow {
  name: string
  amount: number
  type: "expenses" | "liabilities" | "goals"
  color: string
  goalLinked: string | null
}

// Define FlowLink type for consistency (raw data links)
interface FlowLink {
  source: string
  target: string
  value: number
  goalLinked?: string | null
}

// Updated SankeyNode type to match D3's processed nodes
interface SankeyNodeProcessed {
  name: string
  category: string
  value?: number
  color?: string
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}

// Updated SankeyLink type to match D3's processed links
interface SankeyLinkProcessed {
  source: SankeyNodeProcessed
  target: SankeyNodeProcessed
  value: number
  color?: string
  goalLinked?: string | null
  y0?: number
  y1?: number
  width?: number
}

interface FinancialDataEntry {
  inflows: Inflow[]
  outflows: Outflow[]
  flowLinks: FlowLink[]
}

// Updated SankeyData interface to pass indices for links to SankeyDiagram
interface SankeyData {
  nodes: SankeyNodeProcessed[]
  links: { source: number; target: number; value: number; goalLinked?: string | null; color?: string }[] // Links with indices and color
}

export function FlowCompass() {
  const router = useRouter()
  const [currentAge, setCurrentAge] = useState([35]) // Default age
  const sankeyContainerRef = useRef<HTMLDivElement>(null)
  const [sankeyWidth, setSankeyWidth] = useState(0)
  const sankeyHeight = 400

  const [isFlowEditorModalOpen, setIsFlowEditorModalOpen] = useState(false)
  const [selectedInflowForEditing, setSelectedInflowForEditing] = useState<Inflow | null>(null)
  const [currentFinancialData, setCurrentFinancialData] = useState<Record<number, FinancialDataEntry>>(financialData)

  // New state variables for section visibility
  const [showTimelineSection, setShowTimelineSection] = useState(true)
  const [showQuadrantsSection, setShowQuadrantsSection] = useState(true)
  const [showGoalsSection, setShowGoalsSection] = useState(true)
  const [showFlowExecutionPlan, setShowFlowExecutionPlan] = useState(false)

  // State for selected flow link for animation and execution plan
  const [selectedFlowLink, setSelectedFlowLink] = useState<SankeyLinkProcessed | null>(null)

  // New state for Opening and Closing Balances
  const [openingBalance, setOpeningBalance] = useState(100000) // Default value
  const [closingBalance, setClosingBalance] = useState(120000) // Default value

  // New states for time period and interval controls
  const [selectedPeriodStart, setSelectedPeriodStart] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [selectedInterval, setSelectedInterval] = useState<string>("1 year")

  // States for Balance Settings Modal
  const [isBalanceSettingsModalOpen, setIsBalanceSettingsModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedNumberFormat, setSelectedNumberFormat] = useState<"standard" | "compact" | "scientific">("standard")
  const [useAccountingFormat, setUseAccountingFormat] = useState(false)

  // State for real financial data
  const [realFinancialData, setRealFinancialData] = useState<{
    inflows: FinancialInflow[]
    outflows: FinancialOutflow[]
  }>({ inflows: [], outflows: [] })

  // Loading state for financial data
  const [isLoadingFinancialData, setIsLoadingFinancialData] = useState(true)

  // New states for Birthday and Birthday Modal
  const [userBirthday, setUserBirthday] = useState<string | null>(null)
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false)

  // Load saved preferences and birthday from database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      if (typeof window !== "undefined") {
        const savedPeriodStart = localStorage.getItem("selectedPeriodStart")
        const savedInterval = localStorage.getItem("selectedInterval")

        if (savedPeriodStart && !isNaN(parseISO(savedPeriodStart).getTime())) {
          setSelectedPeriodStart(savedPeriodStart)
        } else {
          setSelectedPeriodStart(format(new Date(), "yyyy-MM-dd")) // Fallback to current date
        }
        if (savedInterval) {
          setSelectedInterval(savedInterval)
        }
      }

      // Load birthday from database
      try {
        const birthday = await getUserBirthday()
        if (birthday) {
          setUserBirthday(birthday)
        }
      } catch (error) {
        console.error("Error loading user birthday:", error)
      }
    }

    loadInitialData()
  }, [])

  // Calculate age based on birthday and selected period start
  const calculatedAge = useMemo(() => {
    if (userBirthday && !isNaN(parseISO(userBirthday).getTime()) && !isNaN(parseISO(selectedPeriodStart).getTime())) {
      return differenceInYears(parseISO(selectedPeriodStart), parseISO(userBirthday))
    }
    return null // Return null if birthday or period start is invalid/not set
  }, [userBirthday, selectedPeriodStart])

  // Update currentAge state when calculatedAge changes
  useEffect(() => {
    if (calculatedAge !== null) {
      setCurrentAge([calculatedAge])
    }
  }, [calculatedAge])

  const handlePeriodStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedPeriodStart(newDate)
    localStorage.setItem("selectedPeriodStart", newDate)
  }

  const handleIntervalChange = (value: string) => {
    setSelectedInterval(value)
    localStorage.setItem("selectedInterval", value)
  }

  const handleSaveBirthday = async (birthday: string) => {
    try {
      const success = await saveUserBirthday(birthday)
      if (success) {
        setUserBirthday(birthday)
      } else {
        console.error("Failed to save birthday")
      }
    } catch (error) {
      console.error("Error saving birthday:", error)
    }
  }

  const calculatePeriodEnd = (start: string, interval: string): string => {
    const startDateObj = parseISO(start) // Use parseISO for robust parsing

    if (isNaN(startDateObj.getTime())) {
      console.error("Invalid start date provided to calculatePeriodEnd:", start)
      return "" // Return empty string or handle error appropriately
    }

    let endDateObj = startDateObj

    switch (interval) {
      case "1 hour":
        endDateObj = addHours(startDateObj, 1)
        break
      case "1 day":
        endDateObj = addDays(startDateObj, 1)
        break
      case "1 week":
        endDateObj = addWeeks(startDateObj, 1)
        break
      case "2 weeks":
        endDateObj = addWeeks(startDateObj, 2)
        break
      case "1 month":
        endDateObj = addMonths(startDateObj, 1)
        break
      case "1 quarter":
        endDateObj = addQuarters(startDateObj, 1)
        break
      case "1 year":
        endDateObj = addYears(startDateObj, 1)
        break
      default:
        endDateObj = addYears(startDateObj, 1) // Default to 1 year
    }
    return format(endDateObj, "yyyy-MM-dd")
  }

  const selectedPeriodEnd = useMemo(
    () => calculatePeriodEnd(selectedPeriodStart, selectedInterval),
    [selectedPeriodStart, selectedInterval],
  )

  // Load real financial data when period changes
  const loadFinancialData = useCallback(async () => {
    setIsLoadingFinancialData(true)
    try {
      const data = await getFinancialDataForPeriod(selectedPeriodStart, selectedPeriodEnd)
      setRealFinancialData(data)
    } catch (error) {
      console.error("Error loading financial data:", error)
    } finally {
      setIsLoadingFinancialData(false)
    }
  }, [selectedPeriodStart, selectedPeriodEnd])

  useEffect(() => {
    loadFinancialData()
  }, [loadFinancialData])

  // Add a function to refresh financial data
  const refreshFinancialData = useCallback(() => {
    loadFinancialData()
  }, [loadFinancialData])

  // Listen for storage events to sync data across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "financialDataUpdated") {
        refreshFinancialData()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [refreshFinancialData])

  // Add visibility change listener to refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshFinancialData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [refreshFinancialData])

  const getIntervalDurationRatio = (interval: string): number => {
    const oneYearInHours = 365 * 24
    let durationInHours = 0
    switch (interval) {
      case "1 hour":
        durationInHours = 1
        break
      case "1 day":
        durationInHours = 24
        break
      case "1 week":
        durationInHours = 7 * 24
        break
      case "2 weeks":
        durationInHours = 14 * 24
        break
      case "1 month":
        durationInHours = 30 * 24 // Approx
        break
      case "1 quarter":
        durationInHours = 90 * 24 // Approx
        break
      case "1 year":
        durationInHours = oneYearInHours
        break
      default:
        durationInHours = oneYearInHours
    }
    return durationInHours / oneYearInHours
  }

  const handleSankeyNodeClick = (node: SankeyNodeProcessed) => {
    if (node.category === "income" || node.category === "assets") {
      const inflow = currentFinancialData[currentAge[0]].inflows.find((i) => i.name === node.name)
      if (inflow) {
        handleOpenFlowEditor(inflow)
      }
    }
    // Clear any selected link when a node is clicked
    setSelectedFlowLink(null)
    setShowFlowExecutionPlan(false)
    setShowTimelineSection(true)
    setShowQuadrantsSection(true)
    setShowGoalsSection(true)
  }

  const handleSankeyLinkClick = (link: SankeyLinkProcessed) => {
    if (
      selectedFlowLink &&
      selectedFlowLink.source.name === link.source.name &&
      selectedFlowLink.target.name === link.target.name
    ) {
      // If the same link is clicked, deselect it
      setSelectedFlowLink(null)
      setShowFlowExecutionPlan(false)
      setShowTimelineSection(true)
      setShowQuadrantsSection(true)
      setShowGoalsSection(true)
    } else {
      // Select the new link and show the execution plan
      setSelectedFlowLink(link)
      setShowFlowExecutionPlan(true)
      setShowTimelineSection(false)
      setShowQuadrantsSection(false)
      setShowGoalsSection(false)
    }
  }

  useEffect(() => {
    const updateWidth = () => {
      if (sankeyContainerRef.current) {
        // Defer the state update to the next animation frame
        requestAnimationFrame(() => {
          if (sankeyContainerRef.current) {
            // Check again in case component unmounted
            setSankeyWidth(sankeyContainerRef.current.offsetWidth)
          }
        })
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const getCurrentData = (): FinancialDataEntry => {
    // Use real data if available, otherwise fall back to mock data
    if (realFinancialData.inflows.length > 0 || realFinancialData.outflows.length > 0) {
      const inflows: Inflow[] = realFinancialData.inflows.map((inflow) => ({
        name: inflow.name,
        amount: inflow.amount,
        type: inflow.type,
        color: inflow.color,
        goalLinked: inflow.goal_linked || null,
      }))

      const outflows: Outflow[] = realFinancialData.outflows.map((outflow) => ({
        name: outflow.name,
        amount: outflow.amount,
        type: outflow.type,
        color: outflow.color,
        goalLinked: outflow.goal_linked || null,
      }))

      // Generate simple flow links (each inflow to each outflow proportionally)
      const flowLinks: FlowLink[] = []
      const totalOutflow = outflows.reduce((sum, o) => sum + o.amount, 0)

      if (totalOutflow > 0) {
        inflows.forEach((inflow) => {
          outflows.forEach((outflow) => {
            const proportion = outflow.amount / totalOutflow
            const value = inflow.amount * proportion
            if (value > 0) {
              flowLinks.push({
                source: inflow.name,
                target: outflow.name,
                value: Math.round(value),
                goalLinked: outflow.goalLinked,
              })
            }
          })
        })
      }

      return { inflows, outflows, flowLinks }
    }

    // Fall back to mock data
    const age = currentAge[0]
    const ages = Object.keys(currentFinancialData)
      .map(Number)
      .sort((a, b) => a - b)
    const closestAge = ages.reduce((prev, curr) => (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev))
    return currentFinancialData[closestAge as keyof typeof currentFinancialData]
  }

  const sankeyData = useMemo<SankeyData>(() => {
    const data = getCurrentData()

    const allNodeNames = new Set<string>()
    data.inflows.forEach((item) => allNodeNames.add(item.name))
    data.outflows.forEach((item) => allNodeNames.add(item.name))

    const nodes: SankeyNodeProcessed[] = Array.from(allNodeNames).map((name) => {
      const inflow = data.inflows.find((i) => i.name === name)
      const outflow = data.outflows.find((o) => o.name === name)
      if (inflow) return { name, category: inflow.type, value: inflow.amount, color: inflow.color }
      if (outflow) return { name, category: outflow.type, value: outflow.amount, color: outflow.color }
      return { name, category: "unknown", color: "#94a3b8" }
    })

    const nodeMap = new Map<string, number>()
    nodes.forEach((node, i) => nodeMap.set(node.name, i))

    // Construct links with numeric indices for source and target
    const links = data.flowLinks
      .map((link) => {
        const sourceIndex = nodeMap.get(link.source)
        const targetIndex = nodeMap.get(link.target)

        if (sourceIndex === undefined || targetIndex === undefined) {
          console.warn(
            `Sankey data warning: Missing node for link source '${link.source}' or target '${link.target}'. This link will be skipped.`,
          )
          return null // Skip this link
        }

        return {
          source: sourceIndex, // Pass index
          target: targetIndex, // Pass index
          value: link.value,
          goalLinked: link.goalLinked,
        }
      })
      .filter(Boolean) as { source: number; target: number; value: number; goalLinked?: string | null }[] // Filter out nulls

    // Calculate unaccounted amounts and add "Unaccounted" node/links
    let unaccountedNodeIndex: number | undefined
    const totalLinkedOutflowValues = new Map<string, number>()

    links.forEach((link) => {
      const targetName = nodes[link.target].name
      totalLinkedOutflowValues.set(targetName, (totalLinkedOutflowValues.get(targetName) || 0) + link.value)
    })

    data.outflows.forEach((outflow) => {
      const linkedValue = totalLinkedOutflowValues.get(outflow.name) || 0
      const unaccountedValue = outflow.amount - linkedValue

      if (unaccountedValue > 0) {
        // Ensure "Unaccounted" node exists
        if (unaccountedNodeIndex === undefined) {
          const unaccountedNode: SankeyNodeProcessed = {
            name: "Unaccounted",
            category: "unaccounted",
            value: 0, // Value will be sum of all unaccounted links
            color: "#ef4444", // Red color for unaccounted
          }
          nodes.push(unaccountedNode)
          unaccountedNodeIndex = nodes.length - 1
          nodeMap.set("Unaccounted", unaccountedNodeIndex)
        }

        // Add link from "Unaccounted" to the current outflow
        const targetIndex = nodeMap.get(outflow.name)
        if (targetIndex !== undefined) {
          links.push({
            source: unaccountedNodeIndex,
            target: targetIndex,
            value: unaccountedValue,
            color: "#ef4444", // Explicitly set link color to red
          })
          // Update the value of the "Unaccounted" node
          nodes[unaccountedNodeIndex].value = (nodes[unaccountedNodeIndex].value || 0) + unaccountedValue
        }
      }
    })

    return { nodes, links }
  }, [currentAge, currentFinancialData, realFinancialData, isLoadingFinancialData])

  const currentData = getCurrentData()
  const totalInflow = currentData.inflows.reduce((sum, item) => sum + item.amount, 0)
  const totalOutflow = currentData.outflows.reduce((sum, item) => sum + item.amount, 0)
  const netFlow = totalInflow - totalOutflow
  const savingsRate = totalInflow > 0 ? Math.round((netFlow / totalInflow) * 100) : 0

  // New calculations for Assets, Liabilities, and Goals
  const totalAssets = currentData.inflows
    .filter((item) => item.type === "assets")
    .reduce((sum, item) => sum + item.amount, 0)

  const totalLiabilities = currentData.outflows
    .filter((item) => item.type === "liabilities")
    .reduce((sum, item) => sum + item.amount, 0)

  const totalGoals = currentData.outflows
    .filter((item) => item.type === "goals")
    .reduce((sum, item) => sum + item.amount, 0)

  const totalExpenses = currentData.outflows
    .filter((item) => item.type === "expenses")
    .reduce((sum, item) => sum + item.amount, 0)

  const handleOpenFlowEditor = (inflow: Inflow) => {
    setSelectedInflowForEditing(inflow)
    setIsFlowEditorModalOpen(true)
  }

  const handleSaveFlows = (
    inflowName: string,
    newAllocations: { target: string; value: number }[],
    updatedInflowAmount: number,
  ) => {
    const age = currentAge[0]
    setCurrentFinancialData((prevData) => {
      const newData = { ...prevData }
      const currentEntry = { ...newData[age] }

      // Update the inflow's amount
      const inflowIndex = currentEntry.inflows.findIndex((i) => i.name === inflowName)
      if (inflowIndex !== -1) {
        currentEntry.inflows[inflowIndex] = {
          ...currentEntry.inflows[inflowIndex],
          amount: updatedInflowAmount,
        }
      }

      // Filter out old links from this inflow
      currentEntry.flowLinks = currentEntry.flowLinks.filter((link) => link.source !== inflowName)

      // Add new links based on allocations
      newAllocations.forEach((alloc) => {
        if (alloc.value > 0) {
          const targetOutflow = currentEntry.outflows.find((o) => o.name === alloc.target)
          currentEntry.flowLinks.push({
            source: inflowName,
            target: alloc.target,
            value: alloc.value,
            goalLinked: targetOutflow?.goalLinked,
          })
        }
      })

      newData[age] = currentEntry
      return newData
    })
    setIsFlowEditorModalOpen(false)
    setSelectedInflowForEditing(null)
  }

  const formatBalance = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: selectedCurrency,
      notation: selectedNumberFormat,
      currencySign: useAccountingFormat ? "accounting" : "standard",
      minimumFractionDigits: 2, // Ensure 2 decimal places
      maximumFractionDigits: 2, // Ensure 2 decimal places
    }).format(value)
  }

  const handleSaveBalanceSettings = (
    currency: string,
    numberFormat: "standard" | "compact" | "scientific",
    accountingFormat: boolean,
    newOpeningBalance: number,
    newClosingBalance: number,
  ) => {
    setSelectedCurrency(currency)
    setSelectedNumberFormat(numberFormat)
    setUseAccountingFormat(accountingFormat)
    setOpeningBalance(newOpeningBalance) // Update opening balance from modal
    setClosingBalance(newClosingBalance) // Update closing balance from modal
  }

  return (
    <div className="space-y-8">
      {/* Opening and Closing Balance Section */}
      <ZenCard hover={false}>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <Label htmlFor="opening-balance-display" className="text-ink-600 dark:text-cream-300 mb-2">
              Opening Balance
            </Label>
            <div
              id="opening-balance-display"
              className="text-2xl font-bold text-ink-800 dark:text-cream-100 bg-cream-100 dark:bg-ink-700 border border-cream-200 dark:border-ink-600 rounded-md p-2"
            >
              {formatBalance(openingBalance)}
            </div>
          </div>
          <div className="flex flex-col">
            <Label htmlFor="closing-balance-display" className="text-ink-600 dark:text-cream-300 mb-2">
              Closing Balance
            </Label>
            <div
              id="closing-balance-display"
              className="text-2xl font-bold text-ink-800 dark:text-cream-100 bg-cream-100 dark:bg-ink-700 border border-cream-200 dark:border-ink-600 rounded-md p-2"
            >
              {formatBalance(closingBalance)}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsBalanceSettingsModalOpen(true)}
              className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-10 h-10 shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Balance Display Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </ZenCard>

      {/* Sankey Diagram */}
      <ZenCard hover={false}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light text-ink-800 dark:text-cream-100">Financial Flow Visualization</h2>
          {isLoadingFinancialData && (
            <div className="text-sm text-ink-600 dark:text-cream-400">Loading financial data...</div>
          )}
        </div>
        {/* New Period and Interval Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="period-start" className="text-ink-600 dark:text-cream-300">
              Beginning Period
            </Label>
            <Input
              id="period-start"
              type="date"
              value={selectedPeriodStart}
              onChange={handlePeriodStartChange}
              className="mt-1 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
            />
          </div>
          <div>
            <Label htmlFor="time-interval" className="text-ink-600 dark:text-cream-300">
              Time Interval
            </Label>
            <Select value={selectedInterval} onValueChange={handleIntervalChange}>
              <SelectTrigger className="mt-1 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent className="bg-cream-50 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-ink-800 dark:text-cream-100">
                <SelectItem value="1 hour">1 Hour</SelectItem>
                <SelectItem value="1 day">1 Day</SelectItem>
                <SelectItem value="1 week">1 Week</SelectItem>
                <SelectItem value="2 weeks">2 Weeks</SelectItem>
                <SelectItem value="1 month">1 Month</SelectItem>
                <SelectItem value="1 quarter">1 Quarter</SelectItem>
                <SelectItem value="1 year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-center text-sm font-medium text-ink-600 dark:text-cream-300 mb-4">
          {selectedInterval === "1 hour" || selectedInterval === "1 day" ? (
            <span className="text-logo-blue">Daily/Hourly View (Zoomed In)</span>
          ) : (
            <span>Standard View</span>
          )}
        </div>

        <div ref={sankeyContainerRef} className="w-full h-[400px]">
          {sankeyWidth > 0 && (
            <SankeyDiagram
              key={`sankey-${realFinancialData.inflows.length}-${realFinancialData.outflows.length}-${selectedPeriodStart}-${selectedInterval}`} // Force re-render when data changes
              data={sankeyData}
              width={sankeyWidth}
              height={sankeyHeight}
              onNodeClick={handleSankeyNodeClick}
              onLinkClick={handleSankeyLinkClick}
              selectedLink={selectedFlowLink}
            />
          )}
        </div>

        {/* New control buttons below Sankey Diagram */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setIsFlowEditorModalOpen(true)
              setSelectedFlowLink(null)
              setShowFlowExecutionPlan(false)
              setShowTimelineSection(true)
              setShowQuadrantsSection(true)
              setShowGoalsSection(true)
            }}
            className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Edit Flows"
          >
            <Edit className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowTimelineSection(!showTimelineSection)
              setSelectedFlowLink(null)
              setShowFlowExecutionPlan(false)
            }}
            className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label={showTimelineSection ? "Hide Financial Flow Timeline" : "Show Financial Flow Timeline"}
          >
            <SlidersHorizontal className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowGoalsSection(!showGoalsSection)
              setSelectedFlowLink(null)
              setShowFlowExecutionPlan(false)
            }}
            className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label={showGoalsSection ? "Hide Wealth Vision" : "Show Wealth Vision"}
          >
            <Target className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowQuadrantsSection(!showQuadrantsSection)
              setSelectedFlowLink(null)
              setShowFlowExecutionPlan(false)
            }}
            className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label={showQuadrantsSection ? "Hide Quadrants" : "Show Quadrants"}
          >
            <LayoutGrid className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshFinancialData}
            className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-ink-600 rounded-full w-12 h-12 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Refresh Financial Data"
            disabled={isLoadingFinancialData}
          >
            <motion.div
              animate={isLoadingFinancialData ? { rotate: 360 } : {}}
              transition={{
                duration: 1,
                repeat: isLoadingFinancialData ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
              }}
            >
              <Settings className="w-6 h-6" />
            </motion.div>
          </Button>
        </div>

        {/* Period Dates */}
        <div className="flex justify-between items-center mt-6 text-sm text-ink-600 dark:text-cream-400">
          <div className="text-left">
            <span className="font-medium">Beginning Period:</span> {format(parseISO(selectedPeriodStart), "PPP")}
          </div>
          <div className="text-right">
            <span className="font-medium">Ending Period:</span> {format(parseISO(selectedPeriodEnd), "PPP")}
          </div>
        </div>
      </ZenCard>

      {/* Flow Editor Modal */}
      {isFlowEditorModalOpen && (
        <FlowEditorModal
          isOpen={isFlowEditorModalOpen}
          onClose={() => setIsFlowEditorModalOpen(false)}
          inflows={getCurrentData().inflows}
          outflows={getCurrentData().outflows}
          currentFlowLinks={getCurrentData().flowLinks}
          onSave={handleSaveFlows}
          selectedInflow={selectedInflowForEditing}
        />
      )}

      {/* Balance Settings Modal */}
      {isBalanceSettingsModalOpen && (
        <BalanceSettingsModal
          isOpen={isBalanceSettingsModalOpen}
          onClose={() => setIsBalanceSettingsModalOpen(false)}
          currentCurrency={selectedCurrency}
          currentNumberFormat={selectedNumberFormat}
          currentUseAccountingFormat={useAccountingFormat}
          openingBalance={openingBalance}
          closingBalance={closingBalance}
          onSave={handleSaveBalanceSettings}
        />
      )}

      {/* Birthday Edit Modal */}
      {isBirthdayModalOpen && (
        <BirthdayEditModal
          isOpen={isBirthdayModalOpen}
          onClose={() => setIsBirthdayModalOpen(false)}
          currentBirthday={userBirthday}
          onSave={handleSaveBirthday}
        />
      )}

      {/* Flow Execution Plan Section */}
      {showFlowExecutionPlan && selectedFlowLink && (
        <motion.div
          key={`flow-execution-plan-${selectedFlowLink.source.name}-${selectedFlowLink.target.name}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ZenCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 flex items-center">
                <XCircle className="w-5 h-5 mr-3 text-logo-blue" />
                Flow Execution Plan: {selectedFlowLink.source.name} to {selectedFlowLink.target.name}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFlowLink(null)
                  setShowFlowExecutionPlan(false)
                  setShowTimelineSection(true)
                  setShowQuadrantsSection(true)
                  setShowGoalsSection(true)
                }}
                className="bg-logo-blue hover:bg-blue-700 text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Close Plan
              </Button>
            </div>
            <div className="space-y-4 text-ink-600 dark:text-cream-300">
              <p>
                This section is dedicated to planning the execution of the flow from{" "}
                <span className="font-medium text-logo-blue">{selectedFlowLink.source.name}</span> (
                {selectedFlowLink.source.category}) to{" "}
                <span className="font-medium text-logo-blue">{selectedFlowLink.target.name}</span> (
                {selectedFlowLink.target.category}).
              </p>
              <p>**Amount:** ${selectedFlowLink.value.toLocaleString()}</p>
              {selectedFlowLink.goalLinked && <p>**Linked Goal:** {selectedFlowLink.goalLinked}</p>}
              <p>
                Here you can add specific tasks, deadlines, and strategies to optimize this financial flow. For example,
                if this is a "Salary to Retirement" flow, you might plan to increase your 401k contributions or explore
                additional investment options.
              </p>
              {/* Placeholder for execution planning inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task" className="text-ink-600 dark:text-cream-300">
                    Next Action Item
                  </Label>
                  <Input
                    id="task"
                    placeholder="e.g., Review investment portfolio"
                    className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline" className="text-ink-600 dark:text-cream-300">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
                  />
                </div>
              </div>
              <Button className="bg-logo-blue hover:bg-blue-700 text-white">Save Plan</Button>
            </div>
          </ZenCard>
        </motion.div>
      )}

      {/* Age Selector (Financial Flow Timeline) */}
      {showTimelineSection && (
        <motion.div
          key={`age-snapshot-timeline-${currentAge[0]}-${calculatedAge}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ZenCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 flex items-center">
                Age Snapshot Timeline
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsBirthdayModalOpen(true)}
                  className="ml-2 text-ink-600 dark:text-cream-300"
                  aria-label="Edit Birthday"
                >
                  <Edit3 className="w-5 h-5" />
                </Button>
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentAge([Math.max(20, currentAge[0] - 1)])}
                  className="text-ink-600 dark:text-cream-300"
                  disabled={calculatedAge !== null} // Disable if age is calculated
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-logo-blue font-medium text-lg">Age: {currentAge[0]}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentAge([Math.min(80, currentAge[0] + 1)])}
                  className="text-ink-600 dark:text-cream-300"
                  disabled={calculatedAge !== null} // Disable if age is calculated
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <Slider
              value={currentAge}
              onValueChange={setCurrentAge}
              max={80}
              min={20}
              step={1}
              className="w-full"
              disabled={calculatedAge !== null} // Disable if age is calculated
            />
            <div className="flex justify-between text-sm text-ink-500 dark:text-cream-400 mt-3">
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span>60</span>
              <span>70</span>
              <span>80</span>
            </div>
          </ZenCard>
        </motion.div>
      )}

      {/* Quadrants Section */}
      {showQuadrantsSection && (
        <motion.div
          key={`quadrants-section-${totalInflow}-${totalExpenses}-${totalAssets}-${totalLiabilities}-${totalGoals}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <ZenCard>
            <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-6">Quadrants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ZenCard
                className="bg-gradient-to-br from-emerald-50/50 to-green-100/50 dark:from-emerald-900/20 dark:to-green-900/30 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push("/financial/income")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Income</h3>
                    <div className="text-2xl font-light text-emerald-700 dark:text-emerald-400">
                      ${totalInflow.toLocaleString()}
                    </div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </ZenCard>

              <ZenCard
                className="bg-gradient-to-br from-orange-50/50 to-red-100/50 dark:from-orange-900/20 dark:to-red-900/30 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push("/financial/expenses")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Expenses</h3>
                    <div className="text-2xl font-light text-orange-700 dark:text-orange-400">
                      ${totalExpenses.toLocaleString()}
                    </div>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </ZenCard>

              <ZenCard
                className="bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/30 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push("/financial/assets")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Assets</h3>
                    <div className="text-2xl font-light text-blue-700 dark:text-blue-400">
                      ${totalAssets.toLocaleString()}
                    </div>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </ZenCard>

              <ZenCard
                className="bg-gradient-to-br from-purple-50/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/30 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push("/financial/liabilities")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Liabilities</h3>
                    <div className="text-2xl font-light text-purple-700 dark:text-purple-400">
                      ${totalLiabilities.toLocaleString()}
                    </div>
                  </div>
                  <Scale className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </ZenCard>

              <ZenCard
                className="col-span-full bg-gradient-to-br from-yellow-50/50 to-amber-100/50 dark:from-yellow-900/20 dark:to-amber-900/30 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push("/financial/goals")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">
                      Total Goal Requirements
                    </h3>
                    <div className="text-2xl font-light text-amber-700 dark:text-amber-400">
                      ${totalGoals.toLocaleString()}
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
              </ZenCard>
            </div>
          </ZenCard>
        </motion.div>
      )}

      {/* Wealth Vision Section (replaces Goals Tracker) */}
      {showGoalsSection && (
        <motion.div
          key="wealth-vision-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <WealthVisionSection />
        </motion.div>
      )}
    </div>
  )
}
