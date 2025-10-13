// components/ResetCard.tsx
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { databaseService } from "@/lib/database-service"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"
import { toast } from "sonner"

interface EditableCardProps {
  title: string
  description: string
  content: string
  onChange: (value: string) => void
}

const EditableCard = ({ title, description, content, onChange }: EditableCardProps) => {
  return (
    <div className="p-4 bg-white/10 rounded-lg text-cream-25 mb-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <textarea
        className="w-full h-32 bg-transparent border border-cream-25/20 rounded p-2 text-cream-25"
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

interface CurrentPeriodCardProps {
  rangeId: string
  currentPeriod: Partial<ResetPeriod>
  setCurrentPeriod: (period: Partial<ResetPeriod>) => void
  onSave: (rangeId: string) => Promise<void>
  onNewPeriod: (rangeId: string) => Promise<void>
}

const CurrentPeriodCard = ({ rangeId, currentPeriod, setCurrentPeriod, onSave, onNewPeriod }: CurrentPeriodCardProps) => {
  const handleChange = (field: keyof ResetPeriod, value: string) => {
    setCurrentPeriod({ ...currentPeriod, [field]: value })
  }

  return (
    <div className="p-4 bg-white/10 rounded-lg text-cream-25 mb-4">
      <h2 className="font-bold text-xl mb-4">Current Period</h2>
      <div className="flex gap-4 mb-4">
        <div>
          <Label className="block text-sm mb-1">Start Date</Label>
          <Input
            type="date"
            className="bg-transparent border border-cream-25/20 rounded p-2 text-cream-25"
            value={currentPeriod.start_date || ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />
        </div>
        <div>
          <Label className="block text-sm mb-1">End Date</Label>
          <Input
            type="date"
            className="bg-transparent border border-cream-25/20 rounded p-2 text-cream-25"
            value={currentPeriod.end_date || ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />
        </div>
      </div>
      <EditableCard
        title="Discover"
        description="Understand problems or desired result in this area"
        content={currentPeriod.discover || ""}
        onChange={(value) => handleChange("discover", value)}
      />
      <EditableCard
        title="Define"
        description="Define features, routines, or activities that will lead to result of vision"
        content={currentPeriod.define || ""}
        onChange={(value) => handleChange("define", value)}
      />
      <EditableCard
        title="Ideate"
        description="Brainstorm solutions to implement features or execute results"
        content={currentPeriod.ideate || ""}
        onChange={(value) => handleChange("ideate", value)}
      />
      <EditableCard
        title="Prototype"
        description="Solution Routines and Activities; Simulate Likki's Experience by working into schedule and thinking about Cue => Routine => Reward. Change the routine for the reward we are looking for. Or ways to better the existing routine"
        content={currentPeriod.prototype || ""}
        onChange={(value) => handleChange("prototype", value)}
      />
      <EditableCard
        title="Test"
        description="Testing Phase happens throughout the week. Evaluation and Discovery happen on Friday at Reset"
        content={currentPeriod.test || ""}
        onChange={(value) => handleChange("test", value)}
      />
      <div className="flex gap-2">
        <Button onClick={() => onSave(rangeId)}>Save</Button>
        <Button onClick={() => onNewPeriod(rangeId)}>Start New Period</Button>
      </div>
    </div>
  )
}

interface ArchiveCardProps {
  archive: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }
}

const ArchiveCard = ({ archive }: ArchiveCardProps) => {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())
  const [expandedHierarchy, setExpandedHierarchy] = useState<Set<string>>(new Set())

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
  }

  const toggleHierarchy = (key: string) => {
    setExpandedHierarchy(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Deduplicate items by item_id, keeping only the most recent completion
  const deduplicateItems = (items: ArchivedItem[]): ArchivedItem[] => {
    const itemMap = new Map<string, ArchivedItem>()
    items.forEach(item => {
      const existing = itemMap.get(item.item_id)
      if (!existing || new Date(item.completed_at) > new Date(existing.completed_at)) {
        itemMap.set(item.item_id, item)
      }
    })
    return Array.from(itemMap.values())
  }

  // Build hierarchical structure from flat archived items
  const buildHierarchy = (items: ArchivedItem[]) => {
    const hierarchy: any = {}

    items.forEach(item => {
      const mountain = item.parent_mountain_name || "No Range"
      const hill = item.parent_hill_name || "No Hill"
      const terrain = item.parent_terrain_name || "No Terrain"
      const length = item.parent_length_name || "No Length"

      if (!hierarchy[mountain]) hierarchy[mountain] = {}
      if (!hierarchy[mountain][hill]) hierarchy[mountain][hill] = {}
      if (!hierarchy[mountain][hill][terrain]) hierarchy[mountain][hill][terrain] = {}
      if (!hierarchy[mountain][hill][terrain][length]) hierarchy[mountain][hill][terrain][length] = []

      hierarchy[mountain][hill][terrain][length].push(item)
    })

    return hierarchy
  }

  return (
    <div className="p-4 bg-white/10 rounded-lg text-cream-25">
      <h2 className="font-bold text-xl mb-4">Archive</h2>
      <h3 className="font-semibold mb-2">Previous Resets</h3>
      {archive.previousResets?.length > 0 ? (
        archive.previousResets.map((period, index) => (
          <div key={index} className="mb-4 border-b border-cream-25/20 pb-2">
            <h4 className="font-semibold">
              {period.start_date && period.end_date ? `${period.start_date} to ${period.end_date}` : "Unspecified Period"}
            </h4>
            <p>Discover: {period.discover}</p>
            <p>Define: {period.define}</p>
            <p>Ideate: {period.ideate}</p>
            <p>Prototype: {period.prototype}</p>
            <p>Test: {period.test}</p>
          </div>
        ))
      ) : (
        <p>No previous resets available.</p>
      )}
      <h3 className="font-semibold mb-2">Completed Items</h3>
      {Object.keys(archive.completed).length > 0 ? (
        Object.entries(archive.completed).map(([date, items]) => {
          const deduplicatedItems = deduplicateItems(items)
          const hierarchy = buildHierarchy(deduplicatedItems)
          const isDateExpanded = expandedDates.has(date)

          return (
            <div key={date} className="mb-4">
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded"
                onClick={() => toggleDate(date)}
              >
                <span className="text-lg">{isDateExpanded ? '▼' : '▶'}</span>
                <h4 className="font-semibold">{date} ({deduplicatedItems.length} item{deduplicatedItems.length !== 1 ? 's' : ''})</h4>
              </div>
              {isDateExpanded && (
                <div className="ml-4 mt-2">
                  {Object.entries(hierarchy).map(([mountain, hills]: [string, any]) => {
                    const mountainKey = `${date}-${mountain}`
                    const isMountainExpanded = expandedHierarchy.has(mountainKey)

                    return (
                      <div key={mountainKey} className="mb-2">
                        <div
                          className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                          onClick={() => toggleHierarchy(mountainKey)}
                        >
                          <span>{isMountainExpanded ? '▼' : '▶'}</span>
                          <span className="font-medium">{mountain}</span>
                        </div>
                        {isMountainExpanded && (
                          <div className="ml-4">
                            {Object.entries(hills).map(([hill, terrains]: [string, any]) => {
                              const hillKey = `${mountainKey}-${hill}`
                              const isHillExpanded = expandedHierarchy.has(hillKey)

                              return (
                                <div key={hillKey} className="mb-1">
                                  <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                                    onClick={() => toggleHierarchy(hillKey)}
                                  >
                                    <span>{isHillExpanded ? '▼' : '▶'}</span>
                                    <span>{hill}</span>
                                  </div>
                                  {isHillExpanded && (
                                    <div className="ml-4">
                                      {Object.entries(terrains).map(([terrain, lengths]: [string, any]) => {
                                        const terrainKey = `${hillKey}-${terrain}`
                                        const isTerrainExpanded = expandedHierarchy.has(terrainKey)

                                        return (
                                          <div key={terrainKey} className="mb-1">
                                            <div
                                              className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                                              onClick={() => toggleHierarchy(terrainKey)}
                                            >
                                              <span>{isTerrainExpanded ? '▼' : '▶'}</span>
                                              <span>{terrain}</span>
                                            </div>
                                            {isTerrainExpanded && (
                                              <div className="ml-4">
                                                {Object.entries(lengths).map(([lengthName, lengthItems]: [string, any]) => {
                                                  const lengthKey = `${terrainKey}-${lengthName}`
                                                  const isLengthExpanded = expandedHierarchy.has(lengthKey)

                                                  return (
                                                    <div key={lengthKey} className="mb-1">
                                                      <div
                                                        className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                                                        onClick={() => toggleHierarchy(lengthKey)}
                                                      >
                                                        <span>{isLengthExpanded ? '▼' : '▶'}</span>
                                                        <span>{lengthName}</span>
                                                      </div>
                                                      {isLengthExpanded && (
                                                        <ul className="ml-6 mt-1">
                                                          {lengthItems.map((item: ArchivedItem) => (
                                                            <li key={item.id} className="text-sm text-cream-25/80">
                                                              • {item.item_name} <span className="text-vibrant-blue">({item.item_type})</span>
                                                            </li>
                                                          ))}
                                                        </ul>
                                                      )}
                                                    </div>
                                                  )
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      ) : (
        <p>No completed items available.</p>
      )}
    </div>
  )
}

interface ResetCardProps {
  rangeId: string
}

export const ResetCard = ({ rangeId }: ResetCardProps) => {
  const [currentPeriod, setCurrentPeriod] = useState<Partial<ResetPeriod>>({
    start_date: "",
    end_date: "",
    discover: "",
    define: "",
    ideate: "",
    prototype: "",
    test: "",
  })
  const [archive, setArchive] = useState<{ previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> }>({
    previousResets: [],
    completed: {},
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
        if (!userId) throw new Error("User not authenticated")

        // Fetch reset periods
        const periods = await databaseService.fetchResetPeriods(userId, rangeId)
        const latestPeriod = periods[0] || { start_date: "", end_date: "", discover: "", define: "", ideate: "", prototype: "", test: "" }
        setCurrentPeriod(latestPeriod)

        // Fetch archived items and group by completion date
        const archivedItems = await databaseService.fetchArchivedItems(userId, rangeId)
        const groupedCompleted = archivedItems.reduce((acc, item) => {
          const date = new Date(item.completed_at).toISOString().split("T")[0]
          if (!acc[date]) acc[date] = []
          acc[date].push(item)
          return acc
        }, {} as Record<string, ArchivedItem[]>)
        setArchive({ previousResets: periods.slice(1), completed: groupedCompleted })
      } catch (err) {
        console.error("[ResetCard] Error fetching data:", err)
        toast.error("Failed to load reset data.")
      }
    }
    fetchData()
  }, [rangeId])

  const handleSave = async (rangeId: string) => {
    try {
      const userId = await databaseService.supabase.auth.getUser().then((res) => res.data.user?.id || "")
      if (!userId) throw new Error("User not authenticated")

      if (currentPeriod.id) {
        await databaseService.updateResetPeriod(currentPeriod.id, userId, rangeId, {
          startDate: currentPeriod.start_date,
          endDate: currentPeriod.end_date,
          discover: currentPeriod.discover,
          define: currentPeriod.define,
          ideate: currentPeriod.ideate,
          prototype: currentPeriod.prototype,
          test: currentPeriod.test,
        })
        toast.success("Reset period updated successfully!")
      } else {
        await databaseService.createResetPeriod(userId, rangeId, {
          startDate: currentPeriod.start_date || "",
          endDate: currentPeriod.end_date || "",
          discover: currentPeriod.discover || "",
          define: currentPeriod.define || "",
          ideate: currentPeriod.ideate || "",
          prototype: currentPeriod.prototype || "",
          test: currentPeriod.test || "",
        })
        toast.success("Reset period created successfully!")
      }

      // Refresh periods
      const periods = await databaseService.fetchResetPeriods(userId, rangeId)
      setCurrentPeriod(periods[0] || { start_date: "", end_date: "", discover: "", define: "", ideate: "", prototype: "", test: "" })
      setArchive((prev) => ({ ...prev, previousResets: periods.slice(1) }))
    } catch (err) {
      console.error("[ResetCard] Error saving reset period:", err)
      toast.error("Failed to save reset period.")
    }
  }

  const handleNewPeriod = async (rangeId: string) => {
    try {
      setCurrentPeriod({
        start_date: "",
        end_date: "",
        discover: "",
        define: "",
        ideate: "",
        prototype: "",
        test: "",
      })
      toast.success("Started new reset period!")
    } catch (err) {
      console.error("[ResetCard] Error starting new period:", err)
      toast.error("Failed to start new period.")
    }
  }

  return (
    <div className="p-4 bg-white/10 rounded-lg text-cream-25 mt-4">
      <CurrentPeriodCard
        rangeId={rangeId}
        currentPeriod={currentPeriod}
        setCurrentPeriod={setCurrentPeriod}
        onSave={handleSave}
        onNewPeriod={handleNewPeriod}
      />
      <ArchiveCard archive={archive} />
    </div>
  )
}