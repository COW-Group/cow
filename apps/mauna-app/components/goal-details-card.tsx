"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Target, X, Edit, LinkIcon, ChevronDown, ChevronUp } from "lucide-react"
import type { Goal, GoalStatus, MetricType, UserProfile, Company, Team } from "@/lib/types"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { databaseService } from "@/lib/database-service"

interface GoalDetailsCardProps {
  goal: Goal
  onClose: () => void
  onEdit: (goal: Goal) => void
}

export const GoalDetailsCard: React.FC<GoalDetailsCardProps> = ({ goal, onClose, onEdit }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [showSubGoals, setShowSubGoals] = useState(false)
  const [subGoals, setSubGoals] = useState<Goal[]>([])
  const [existingGoals, setExistingGoals] = useState<Goal[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [users, companies, teams, fetchedGoals] = await Promise.all([
        databaseService.fetchUsers(""), // Fetch all users
        databaseService.fetchCompanies(),
        databaseService.fetchTeams(),
        databaseService.fetchGoals(goal.userId), // Fetch all goals to find sub-goals
      ])
      setAllUsers(users)
      setAllCompanies(companies)
      setAllTeams(teams)
      setSubGoals(fetchedGoals.filter((sub) => sub.parentGoalId === goal.id))
      setExistingGoals(fetchedGoals)
    }
    fetchData()
  }, [goal.userId, goal.id])

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

  const getOwnerNames = (ownerIds: string[]) => {
    return ownerIds.map((id) => allUsers.find((user) => user.id === id)?.preferred_name || "Unknown User").join(", ")
  }

  const getVisibilityText = (visibility: Goal["visibility"]) => {
    if (visibility.type === "Private") {
      return "Private (visible only to owners)"
    } else if (visibility.type === "Company" && visibility.ids) {
      const names = visibility.ids
        .map((id) => allCompanies.find((c) => c.id === id)?.name || "Unknown Company")
        .join(", ")
      return `Company: ${names}`
    } else if (visibility.type === "Team" && visibility.ids) {
      const names = visibility.ids.map((id) => allTeams.find((t) => t.id === id)?.name || "Unknown Team").join(", ")
      return `Team: ${names}`
    }
    return "N/A"
  }

  return (
    <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-6 h-6 text-logo-blue" />
          <CardTitle className="text-cream-25 font-montserrat text-xl">{goal.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(goal)}
            variant="ghost"
            size="icon"
            className="text-cream-25 hover:text-cream-100"
          >
            <Edit className="w-5 h-5" />
            <span className="sr-only">Edit Goal</span>
          </Button>
          <Button onClick={onClose} variant="ghost" size="icon" className="text-cream-25 hover:text-cream-100">
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="space-y-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-cream-100 font-barlow">
          <div>
            <p>
              <span className="font-semibold text-cream-25">Type:</span> {goal.type}
            </p>
            <p>
              <span className="font-semibold text-cream-25">Status:</span>{" "}
              <Badge className={`${getStatusColor(goal.status)} text-xs`}>{goal.status}</Badge>
            </p>
            {goal.startDate && goal.endDate && (
              <p>
                <span className="font-semibold text-cream-25">Time Period:</span> {goal.timePeriod} (
                {format(new Date(goal.startDate), "MMM dd, yyyy")} - {format(new Date(goal.endDate), "MMM dd, yyyy")})
              </p>
            )}
            {goal.targetValue !== null && (
              <p>
                <span className="font-semibold text-cream-25">Target:</span>{" "}
                {formatTargetValue(goal.targetValue, goal.metricType)}
              </p>
            )}
          </div>
          <div>
            <p>
              <span className="font-semibold text-cream-25">Owners:</span> {getOwnerNames(goal.owners)}
            </p>
            <p>
              <span className="font-semibold text-cream-25">Visibility:</span> {getVisibilityText(goal.visibility)}
            </p>
            {goal.parentGoalId && (
              <p>
                <span className="font-semibold text-cream-25">Parent Goal:</span>{" "}
                {existingGoals.find((g) => g.id === goal.parentGoalId)?.name || "N/A"}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-cream-25 font-barlow">Description:</h3>
          <p className="text-cream-100 font-barlow">{goal.description || "No description provided."}</p>
        </div>

        {goal.relatedWork && goal.relatedWork.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-cream-25 font-barlow">Related Work:</h3>
            <div className="flex flex-wrap gap-2">
              {goal.relatedWork.map((link, index) => (
                <Badge key={index} className="bg-ink-700 text-cream-25 font-barlow">
                  <LinkIcon className="w-3 h-3 mr-1" /> {link}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => setShowSubGoals(!showSubGoals)}
            className="text-cream-25 hover:text-cream-100 font-barlow w-full justify-between"
          >
            Sub-Goals ({subGoals.length})
            {showSubGoals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {showSubGoals && (
            <div className="border border-cream-200/10 rounded-md p-4 space-y-2">
              {subGoals.length === 0 ? (
                <p className="text-cream-100 font-barlow">No sub-goals for this goal.</p>
              ) : (
                subGoals.map((subGoal) => (
                  <div key={subGoal.id} className="flex items-center justify-between text-cream-100 font-barlow">
                    <span>{subGoal.name}</span>
                    <Badge className={`${getStatusColor(subGoal.status)} text-xs`}>{subGoal.status}</Badge>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Placeholder for Comments */}
        <div className="space-y-2">
          <h3 className="font-semibold text-cream-25 font-barlow">Comments:</h3>
          <div className="border border-cream-200/10 rounded-md p-4 text-cream-100 font-barlow">
            <p>No comments yet. (Feature coming soon)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
