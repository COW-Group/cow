"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components
import { Target, Plus, Search, CalendarDays, ChevronRight, Edit, Trash2 } from "lucide-react"
import type { Goal, GoalStatus, MetricType } from "@/lib/types"
import { format } from "date-fns"

interface GoalsCardProps {
  goals: Goal[]
  onAddGoalClick: () => void
  onGoalSelect: (goal: Goal) => void
  onFilterChange: (filter: "Company" | "Team" | "My" | "All") => void
  onSearch: (query: string) => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
  currentFilter: "Company" | "Team" | "My" | "All"
  currentTimeframe: string // New prop for current timeframe
  onTimeframeChange: (timeframe: string) => void // New prop for timeframe change handler
}

const GoalRow: React.FC<{
  goal: Goal
  onSelect: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
}> = ({ goal, onSelect, onEdit, onDelete }) => {
  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case "On Track":
        return "bg-moss-500 text-cream-25"
      case "At Risk":
        return "bg-amber-500 text-cream-900"
      case "Off Track":
        return "bg-red-500 text-cream-25"
      default:
        return "bg-ink-300 text-ink-900"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-moss-500"
    if (progress >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const formatTargetValue = (value: number | null, type: MetricType | null) => {
    if (value === null) return "N/A"
    switch (type) {
      case "Percentage":
        return `${value}%`
      case "Currency":
        return `$${value.toLocaleString()}`
      case "Numeric":
      default:
        return value.toLocaleString()
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-cream-200/10 last:border-b-0 hover:bg-cream-200/5 transition-colors duration-200">
      <div className="flex-1 cursor-pointer" onClick={() => onSelect(goal)}>
        <h3 className="font-montserrat text-lg font-semibold text-cream-25 hover:text-cream-100 transition-colors">
          {goal.name}
        </h3>
        <div className="flex items-center gap-4 text-sm text-cream-100 mt-1">
          <Badge className={`${getStatusColor(goal.status)} font-barlow text-xs`}>{goal.status}</Badge>
          {goal.endDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span className="font-barlow">Due: {format(new Date(goal.endDate), "MMM dd, yyyy")}</span>
            </div>
          )}
          {goal.targetValue !== null && (
            <span className="font-barlow">Target: {formatTargetValue(goal.targetValue, goal.metricType)}</span>
          )}
        </div>
        <div className="w-full mt-3">
          <div className="flex justify-between text-sm text-cream-100 mb-1">
            <span className="font-barlow">Progress</span>
            <span className="font-barlow">{goal.progress}%</span>
          </div>
          <Progress
            value={goal.progress}
            className="h-2 bg-cream-200/20"
            indicatorClassName={getProgressColor(goal.progress)}
          />
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(goal)} className="text-cream-25 hover:text-cream-25">
          <Edit className="w-4 h-4" />
          <span className="sr-only">Edit Goal</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(goal.id)}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
          <span className="sr-only">Delete Goal</span>
        </Button>
      </div>
    </div>
  )
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  goals,
  onAddGoalClick,
  onGoalSelect,
  onFilterChange,
  onSearch,
  onEditGoal,
  onDeleteGoal,
  currentFilter,
  currentTimeframe, // Destructure new prop
  onTimeframeChange, // Destructure new prop
}) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-logo-blue" />
          <CardTitle className="text-cream-25 font-montserrat text-xl">Goals</CardTitle>
        </div>
        <Button onClick={onAddGoalClick} className="bg-logo-blue hover:bg-logo-blue/90 text-cream-25 font-barlow">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              onClick={() => onFilterChange("All")}
              className={`text-cream-25 font-barlow ${currentFilter === "All" ? "bg-cream-200/10" : "hover:bg-cream-200/5"}`}
            >
              All Goals
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange("Company")}
              className={`text-cream-25 font-barlow ${currentFilter === "Company" ? "bg-cream-200/10" : "hover:bg-cream-200/5"}`}
            >
              Company Goals
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange("Team")}
              className={`text-cream-25 font-barlow ${currentFilter === "Team" ? "bg-cream-200/10" : "hover:bg-cream-200/5"}`}
            >
              Team Goals
            </Button>
            <Button
              variant="ghost"
              onClick={() => onFilterChange("My")}
              className={`text-cream-25 font-barlow ${currentFilter === "My" ? "bg-cream-200/10" : "hover:bg-cream-200/5"}`}
            >
              My Goals
            </Button>
          </div>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cream-200" />
            <Input
              placeholder="Search goals..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
            />
          </div>
        </div>

        {/* New Timeframe Selector */}
        <div className="mb-6">
          <Select value={currentTimeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-full md:w-[200px] glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="next-quarter">Next Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="next-year">Next Year</SelectItem>
              <SelectItem value="semi-annual-h1">Semi-annual (H1)</SelectItem>
              <SelectItem value="semi-annual-h2">Semi-annual (H2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {goals.length === 0 ? (
          <div className="text-center py-8 text-cream-100 font-barlow">
            No goals found. Click &quot;Add Goal&quot; to create one!
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((goal) => (
              <GoalRow key={goal.id} goal={goal} onSelect={onGoalSelect} onEdit={onEditGoal} onDelete={onDeleteGoal} />
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button variant="ghost" className="text-cream-25 hover:text-cream-100 font-barlow">
            View Strategy Map <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
