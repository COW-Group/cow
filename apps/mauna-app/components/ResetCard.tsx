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
        Object.entries(archive.completed).map(([period, items]) => (
          <div key={period} className="mb-4">
            <h4 className="font-semibold">{period}</h4>
            <ul className="list-disc pl-4">
              {items.map((item) => (
                <li key={item.id}>{item.item_name} ({item.item_type})</li>
              ))}
            </ul>
          </div>
        ))
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