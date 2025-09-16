"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Map } from "lucide-react"
import type { Goal } from "@/lib/types"

interface StrategyMapCardProps {
  goals: Goal[]
  onClose: () => void
  missionStatement: string
}

export const StrategyMapCard: React.FC<StrategyMapCardProps> = ({ goals, onClose, missionStatement }) => {
  // A very simplified representation for the strategy map using Mermaid.
  // A full interactive D3.js visualization would be a much larger implementation.

  const generateMermaidGraph = (goals: Goal[], mission: string) => {
    let graph = `graph TD\n`
    graph += `  A["Mission: ${mission}"]\n`

    const companyGoals = goals.filter((g) => g.type === "Objective" && g.parentGoalId === null)
    const teamGoals = goals.filter((g) => g.type === "Key Result")
    const individualGoals = goals.filter((g) => g.type === "Individual Goal")

    companyGoals.forEach((g, i) => {
      graph += `  C${i + 1}["Company Goal: ${g.name}"]\n`
      graph += `  A --> C${i + 1}\n`
    })

    teamGoals.forEach((g, i) => {
      graph += `  T${i + 1}["Team Goal: ${g.name}"]\n`
      const parent = goals.find((pg) => pg.id === g.parentGoalId)
      if (parent && parent.type === "Objective") {
        const parentIndex = companyGoals.findIndex((cg) => cg.id === parent.id)
        if (parentIndex !== -1) {
          graph += `  C${parentIndex + 1} --> T${i + 1}\n`
        }
      }
    })

    individualGoals.forEach((g, i) => {
      graph += `  I${i + 1}["Individual Goal: ${g.name}"]\n`
      const parent = goals.find((pg) => pg.id === g.parentGoalId)
      if (parent && parent.type === "Key Result") {
        const parentIndex = teamGoals.findIndex((tg) => tg.id === parent.id)
        if (parentIndex !== -1) {
          graph += `  T${parentIndex + 1} --> I${i + 1}\n`
        }
      }
    })

    return graph
  }

  const mermaidGraph = generateMermaidGraph(goals, missionStatement)

  return (
    <Card className="glassmorphism-inner-card sunlight-hover mb-6 w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Map className="w-6 h-6 text-logo-blue" />
          <CardTitle className="text-cream-25 font-montserrat text-xl">Strategy Map</CardTitle>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-cream-25 hover:text-cream-100">
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="text-center text-cream-100 font-barlow">
          <p className="text-lg font-semibold text-cream-25">Mission Statement:</p>
          <p className="text-xl font-caveat text-logo-blue">{missionStatement}</p>
        </div>
        <div className="bg-cream-200/5 p-4 rounded-md overflow-auto max-h-[60vh]">
          <p className="text-cream-100 font-barlow mb-2">
            This is a conceptual strategy map. A full interactive visualization would require a dedicated library like
            D3.js.
          </p>
          <pre className="text-sm text-cream-25 bg-ink-900/50 p-3 rounded-md overflow-x-auto">{mermaidGraph}</pre>
          <div className="mermaid text-cream-25 bg-ink-900/50 p-3 rounded-md mt-4">{mermaidGraph}</div>
        </div>
      </CardContent>
    </Card>
  )
}
