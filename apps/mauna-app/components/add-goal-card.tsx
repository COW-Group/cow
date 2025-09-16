"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import type { Goal, GoalType, MetricType } from "@/lib/types"

interface AddGoalCardProps {
  goalToEdit?: Goal | null
  onSave: (goalData: Omit<Goal, "id" | "createdAt" | "updatedAt" | "userId">) => void
  onCancel: () => void
  existingGoals: Goal[] // For parent goal selection
}

export const AddGoalCard: React.FC<AddGoalCardProps> = ({ goalToEdit, onSave, onCancel, existingGoals }) => {
  const [name, setName] = useState(goalToEdit?.name || "")
  const [type, setType] = useState<GoalType>(goalToEdit?.type || "Individual Goal")
  const [description, setDescription] = useState(goalToEdit?.description || "")
  const [targetValue, setTargetValue] = useState<number | null>(goalToEdit?.targetValue || null)
  const [metricType, setMetricType] = useState<MetricType | null>(goalToEdit?.metricType || null)
  const [timePeriod, setTimePeriod] = useState(goalToEdit?.timePeriod || "")
  const [startDate, setStartDate] = useState<Date | undefined>(
    goalToEdit?.startDate ? new Date(goalToEdit.startDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    goalToEdit?.endDate ? new Date(goalToEdit.endDate) : undefined,
  )
  const [owners, setOwners] = useState<string[]>(goalToEdit?.owners || [])
  const [visibilityType, setVisibilityType] = useState<"Company" | "Team" | "Private">(
    goalToEdit?.visibility?.type || "Private",
  )
  const [visibilityIds, setVisibilityIds] = useState<string[]>(goalToEdit?.visibility?.ids || [])
  const [parentGoalId, setParentGoalId] = useState<string | null>(goalToEdit?.parentGoalId || null)
  const [relatedWork, setRelatedWork] = useState<string[]>(goalToEdit?.relatedWork || [])

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name)
      setType(goalToEdit.type)
      setDescription(goalToEdit.description || "")
      setTargetValue(goalToEdit.targetValue || null)
      setMetricType(goalToEdit.metricType || null)
      setTimePeriod(goalToEdit.timePeriod || "")
      setStartDate(goalToEdit.startDate ? new Date(goalToEdit.startDate) : undefined)
      setEndDate(goalToEdit.endDate ? new Date(goalToEdit.endDate) : undefined)
      setOwners(goalToEdit.owners || [])
      setVisibilityType(goalToEdit.visibility?.type || "Private")
      setVisibilityIds(goalToEdit.visibility?.ids || [])
      setParentGoalId(goalToEdit.parentGoalId || null)
      setRelatedWork(goalToEdit.relatedWork || [])
    } else {
      // Reset form for new goal
      setName("")
      setType("Individual Goal")
      setDescription("")
      setTargetValue(null)
      setMetricType(null)
      setTimePeriod("")
      setStartDate(undefined)
      setEndDate(undefined)
      setOwners([])
      setVisibilityType("Private")
      setVisibilityIds([])
      setParentGoalId(null)
      setRelatedWork([])
    }
  }, [goalToEdit])

  const handleSave = () => {
    const newGoal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "userId"> = {
      name,
      type,
      description: description || null,
      targetValue: targetValue,
      metricType: metricType,
      timePeriod: timePeriod || null,
      startDate: startDate ? startDate.toISOString().split("T")[0] : null,
      endDate: endDate ? endDate.toISOString().split("T")[0] : null,
      owners,
      visibility: { type: visibilityType, ids: visibilityIds },
      parentGoalId: parentGoalId,
      relatedWork,
      progress: goalToEdit?.progress || 0, // Maintain existing progress or default to 0
      status: goalToEdit?.status || "On Track", // Maintain existing status or default
    }
    onSave(newGoal)
  }

  const handleAddOwner = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.trim()
      if (value && !owners.includes(value)) {
        setOwners([...owners, value])
        e.currentTarget.value = ""
      }
    }
  }

  const handleRemoveOwner = (ownerToRemove: string) => {
    setOwners(owners.filter((owner) => owner !== ownerToRemove))
  }

  const handleAddRelatedWork = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = e.currentTarget.value.trim()
      if (value && !relatedWork.includes(value)) {
        setRelatedWork([...relatedWork, value])
        e.currentTarget.value = ""
      }
    }
  }

  const handleRemoveRelatedWork = (itemToRemove: string) => {
    setRelatedWork(relatedWork.filter((item) => item !== itemToRemove))
  }

  const filteredParentGoals = existingGoals.filter((goal) => goal.id !== goalToEdit?.id)

  return (
    <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
      <CardHeader>
        <CardTitle className="text-cream-25 font-montserrat text-xl">
          {goalToEdit ? "Edit Goal" : "Add New Goal"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-cream-25 font-barlow font-medium">
              Goal Name
            </Label>
            <Input
              id="name"
              placeholder="Enter goal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-cream-25 font-barlow font-medium">
              Goal Type
            </Label>
            <Select value={type} onValueChange={(value: GoalType) => setType(value)}>
              <SelectTrigger className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectItem value="Objective">Objective</SelectItem>
                <SelectItem value="Key Result">Key Result</SelectItem>
                <SelectItem value="Individual Goal">Individual Goal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-cream-25 font-barlow font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your goal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="targetValue" className="text-cream-25 font-barlow font-medium">
              Target Value
            </Label>
            <Input
              id="targetValue"
              type="number"
              placeholder="e.g., 100, 95, 10000"
              value={targetValue === null ? "" : targetValue}
              onChange={(e) => setTargetValue(e.target.value === "" ? null : Number.parseFloat(e.target.value))}
              className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metricType" className="text-cream-25 font-barlow font-medium">
              Metric Type
            </Label>
            <Select value={metricType || ""} onValueChange={(value: MetricType) => setMetricType(value)}>
              <SelectTrigger className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectValue placeholder="Select metric type" />
              </SelectTrigger>
              <SelectContent className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectItem value="Numeric">Numeric</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Currency">Currency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="timePeriod" className="text-cream-25 font-barlow font-medium">
              Time Period
            </Label>
            <Input
              id="timePeriod"
              placeholder="e.g., Q1 2025, Annual 2025"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-cream-25 font-barlow font-medium">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow",
                    !startDate && "text-cream-200",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glassmorphism-inner-card border-cream-200/20">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="text-cream-25"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-cream-25 font-barlow font-medium">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow",
                    !endDate && "text-cream-200",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glassmorphism-inner-card border-cream-200/20">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="text-cream-25"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="owners" className="text-cream-25 font-barlow font-medium">
              Owners
            </Label>
            <Input
              id="owners"
              placeholder="Add owner (press Enter)"
              onKeyPress={handleAddOwner}
              className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {owners.map((owner, index) => (
                <Badge
                  key={index}
                  className="bg-sage-500 text-cream-25 font-barlow cursor-pointer hover:bg-sage-500/80"
                  onClick={() => handleRemoveOwner(owner)}
                >
                  {owner} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="visibilityType" className="text-cream-25 font-barlow font-medium">
              Visibility
            </Label>
            <Select
              value={visibilityType}
              onValueChange={(value: "Company" | "Team" | "Private") => setVisibilityType(value)}
            >
              <SelectTrigger className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentGoal" className="text-cream-25 font-barlow font-medium">
              Parent Goal
            </Label>
            <Select
              value={parentGoalId || "none-selected"} // Use "none-selected" for null
              onValueChange={(value) => setParentGoalId(value === "none-selected" ? null : value)}
            >
              <SelectTrigger className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectValue placeholder="Select parent goal (optional)" />
              </SelectTrigger>
              <SelectContent className="glassmorphism-inner-card border-cream-200/20 text-cream-25 font-barlow">
                <SelectItem value="none-selected">None</SelectItem> {/* Changed value */}
                {filteredParentGoals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relatedWork" className="text-cream-25 font-barlow font-medium">
            Related Work (Projects/Tasks)
          </Label>
          <Input
            id="relatedWork"
            placeholder="Add related work ID (press Enter)"
            onKeyPress={handleAddRelatedWork}
            className="glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200 font-barlow"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {relatedWork.map((item, index) => (
              <Badge
                key={index}
                className="bg-ink-400 text-cream-25 font-barlow cursor-pointer hover:bg-ink-400/80"
                onClick={() => handleRemoveRelatedWork(item)}
              >
                {item} <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost" onClick={onCancel} className="text-cream-200 hover:text-cream-25 font-barlow">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-logo-blue hover:bg-logo-blue/90 text-cream-25 font-barlow disabled:opacity-50"
          >
            {goalToEdit ? "Save Changes" : "Create Goal"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
