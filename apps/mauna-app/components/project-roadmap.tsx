"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus } from "lucide-react"
import type { Project, RoadmapItem } from "@/lib/types" // Import types

interface ProjectRoadmapProps {
  project: Project
}

type TimePeriodView = "Week" | "Month" | "Quarter" | "Year"

// Mock roadmap data for demonstration. In a real app, this would come from the database.
const mockRoadmapItems: RoadmapItem[] = [
  {
    id: "rm1",
    projectId: "1",
    name: "Define Scope",
    description: "Outline the boundaries and key deliverables of the project.",
    position: 1,
    area: "Planning",
    timePeriod: "Month",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    status: "done",
    createdAt: "2023-12-20T10:00:00Z",
    updatedAt: "2024-01-05T14:30:00Z",
  },
  {
    id: "rm2",
    projectId: "1",
    name: "UI/UX Design",
    description: "Create wireframes and mockups for the new website.",
    position: 2,
    area: "Design",
    timePeriod: "Month",
    startDate: "2024-01-08",
    endDate: "2024-01-31",
    status: "in-progress",
    createdAt: "2024-01-01T11:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "rm3",
    projectId: "1",
    name: "Backend API Development",
    description: "Develop the core API endpoints for data management.",
    position: 3,
    area: "Development",
    timePeriod: "Quarter",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    status: "todo",
    createdAt: "2024-01-10T15:00:00Z",
    updatedAt: "2024-01-10T15:00:00Z",
  },
  {
    id: "rm4",
    projectId: "2",
    name: "Market Research",
    description: "Conduct surveys and analyze competitor apps.",
    position: 1,
    area: "Research",
    timePeriod: "Month",
    startDate: "2024-06-01",
    endDate: "2024-06-07",
    status: "in-progress",
    createdAt: "2024-05-20T09:00:00Z",
    updatedAt: "2024-06-03T11:00:00Z",
  },
  {
    id: "rm5",
    projectId: "1",
    name: "Content Strategy",
    description: "Plan content for website sections.",
    position: 4,
    area: "Content",
    timePeriod: "Month",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    status: "done",
    createdAt: "2024-01-10T12:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "rm6",
    projectId: "1",
    name: "Initial QA",
    description: "Perform initial quality assurance tests.",
    position: 5,
    area: "Testing",
    timePeriod: "Month",
    startDate: "2024-02-01",
    endDate: "2024-02-07",
    status: "todo",
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T09:00:00Z",
  },
]

export function ProjectRoadmap({ project }: ProjectRoadmapProps) {
  const [timePeriodView, setTimePeriodView] = useState<TimePeriodView>("Month")

  // Filter roadmap items relevant to the current project
  const projectRoadmapItems = useMemo(() => {
    // In a real application, you would fetch these from the database based on project.id
    return mockRoadmapItems.filter((item) => item.projectId === project.id)
  }, [project.id])

  // Get unique areas from the project's areas and roadmap items
  const areas = useMemo(() => {
    const uniqueAreas = new Set<string>(project.areas) // Start with areas defined in the project
    projectRoadmapItems.forEach((item) => uniqueAreas.add(item.area))
    return Array.from(uniqueAreas).sort() // Sort areas alphabetically
  }, [project.areas, projectRoadmapItems])

  // Determine time periods based on selected view
  const getTimePeriods = (mode: TimePeriodView): string[] => {
    const currentYear = new Date().getFullYear()
    switch (mode) {
      case "Week":
        // Generate 12 weeks for demonstration
        return Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`)
      case "Month":
        return [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
      case "Quarter":
        return ["Q1", "Q2", "Q3", "Q4"]
      case "Year":
        return Array.from({ length: 3 }, (_, i) => `${currentYear + i}`) // Current year + next 2 years
      default:
        return []
    }
  }

  const timePeriods = useMemo(() => getTimePeriods(timePeriodView), [timePeriodView])

  const getStatusBadgeColor = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "todo":
        return "bg-ink-400 text-cream-25"
      case "in-progress":
        return "bg-logo-blue text-cream-25"
      case "done":
        return "bg-moss-500 text-cream-25"
      default:
        return "bg-ink-300 text-ink-900"
    }
  }

  // Helper to check if a roadmap item falls within a given period string
  const isItemInPeriod = (item: RoadmapItem, period: string, viewMode: TimePeriodView): boolean => {
    const itemStartDate = new Date(item.startDate)
    const itemEndDate = new Date(item.endDate)

    switch (viewMode) {
      case "Week":
        // This is a simplified check. For real week tracking, you'd need a more robust date library
        // or a 'week_number' field in your RoadmapItem.
        // For mock, let's assume 'Week 1' means the first week of the year, etc.
        // This mock check is very basic and might not align perfectly with actual dates.
        const periodNumber = Number.parseInt(period.replace("Week ", ""))
        // A more robust check would involve comparing week numbers of the year.
        // For now, let's just check if the item's timePeriod type matches the view.
        return item.timePeriod === "week" // This needs refinement for actual week-based filtering
      case "Month":
        return item.timePeriod === "month" && itemStartDate.toLocaleString("default", { month: "long" }) === period
      case "Quarter":
        const quarter = `Q${Math.floor(itemStartDate.getMonth() / 3) + 1}`
        return item.timePeriod === "quarter" && quarter === period
      case "Year":
        return item.timePeriod === "year" && itemStartDate.getFullYear().toString() === period
      default:
        return false
    }
  }

  return (
    <Card className="glassmorphism border-cream-200/20 p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-cream-25 font-montserrat text-2xl">Project Roadmap</CardTitle>
        <div className="flex gap-2">
          {(["Week", "Month", "Quarter", "Year"] as TimePeriodView[]).map((view) => (
            <Button
              key={view}
              variant={timePeriodView === view ? "default" : "outline"}
              onClick={() => setTimePeriodView(view)}
              className={`font-barlow ${
                timePeriodView === view
                  ? "bg-logo-blue hover:bg-logo-blue/90 text-cream-25"
                  : "glassmorphism-inner-card border-cream-200/20 text-cream-25 hover:text-cream-100"
              }`}
            >
              {view}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {projectRoadmapItems.length === 0 ? (
          <div className="text-center py-8 text-cream-100 font-barlow">
            No roadmap items defined for this project yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="glassmorphism-inner-card">
                  <TableHead className="text-cream-25 font-montserrat min-w-[120px]">Time Period</TableHead>
                  {areas.map((area) => (
                    <TableHead key={area} className="text-cream-25 font-montserrat min-w-[180px]">
                      {area}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {timePeriods.map((period) => (
                  <TableRow key={period} className="hover:bg-ink-800/10 transition-colors">
                    <TableCell className="font-medium text-cream-25 font-barlow align-top py-4">{period}</TableCell>
                    {areas.map((area) => (
                      <TableCell key={`${period}-${area}`} className="align-top py-4">
                        <div className="space-y-2">
                          {projectRoadmapItems
                            .filter((item) => item.area === area && isItemInPeriod(item, period, timePeriodView))
                            .map((item) => (
                              <Card key={item.id} className="glassmorphism-inner-card border-cream-200/20 p-3">
                                <CardTitle className="text-cream-25 font-montserrat text-sm mb-1">
                                  {item.name}
                                </CardTitle>
                                {item.description && (
                                  <p className="text-cream-100 font-barlow text-xs mb-2 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-cream-200 font-barlow">
                                  <div className="flex items-center gap-1">
                                    <CalendarDays className="w-3 h-3" />
                                    <span>{item.startDate}</span>
                                  </div>
                                  <Badge className={`${getStatusBadgeColor(item.status)} text-xs`}>{item.status}</Badge>
                                </div>
                              </Card>
                            ))}
                          {/* Add Task Button for empty cells */}
                          {projectRoadmapItems.filter(
                            (item) => item.area === area && isItemInPeriod(item, period, timePeriodView),
                          ).length === 0 && (
                            <Button
                              variant="ghost"
                              className="w-full h-16 glassmorphism-inner-card border-2 border-dashed border-cream-200/20 hover:border-cream-200/40 text-cream-200 hover:text-cream-25"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              <span className="font-barlow text-sm">Add Task</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
