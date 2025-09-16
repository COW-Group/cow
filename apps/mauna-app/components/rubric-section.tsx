"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RubricData, Task } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

interface RubricSectionProps {
  task?: Task // Make task prop optional
  onSaveRubric: (taskId: string, rubric: RubricData) => void
  onClose: () => void
}

export function RubricSection({ task, onSaveRubric, onClose }: RubricSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [criteria, setCriteria] = useState<{ id: string; name: string }[]>(
    task?.rubric?.criteria || [{ id: uuidv4(), name: "Quality" }], // Safely access task.rubric
  )
  const [levels, setLevels] = useState<{ id: string; name: string; points: number }[]>(
    task?.rubric?.levels || [{ id: uuidv4(), name: "Basic", points: 5 }], // Safely access task.rubric
  )
  const [cells, setCells] = useState<{ criterionId: string; levelId: string; content: string }[]>(
    task?.rubric?.cells || [], // Safely access task.rubric
  )
  const [selectedFulfillment, setSelectedFulfillment] = useState<{ [criterionId: string]: string }>(
    task?.rubric?.selectedFulfillment || {}, // Safely access task.rubric
  )

  // Initialize cells if they are empty or new criteria/levels are added
  useEffect(() => {
    const newCells: { criterionId: string; levelId: string; content: string }[] = []
    criteria.forEach((criterion) => {
      levels.forEach((level) => {
        const existingCell = cells.find((c) => c.criterionId === criterion.id && c.levelId === level.id)
        newCells.push(existingCell || { criterionId: criterion.id, levelId: level.id, content: "" })
      })
    })
    setCells(newCells)
  }, [criteria, levels]) // Only re-run when criteria or levels change

  useEffect(() => {
    if (task?.rubric) {
      // Safely access task.rubric
      setCriteria(task.rubric.criteria || [{ id: uuidv4(), name: "Quality" }])
      setLevels(task.rubric.levels || [{ id: uuidv4(), name: "Basic", points: 5 }])
      setCells(task.rubric.cells || [])
      setSelectedFulfillment(task.rubric.selectedFulfillment || {})
    } else {
      // Reset to default if rubric is removed from task or task is undefined
      setCriteria([{ id: uuidv4(), name: "Quality" }])
      setLevels([{ id: uuidv4(), name: "Basic", points: 5 }])
      setCells([])
      setSelectedFulfillment({})
    }
  }, [task]) // Depend on task itself, not just task.rubric

  const handleAddCriterion = () => {
    setCriteria([...criteria, { id: uuidv4(), name: `Criterion ${criteria.length + 1}` }])
  }

  const handleRemoveCriterion = (id: string) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((c) => c.id !== id))
      setCells(cells.filter((cell) => cell.criterionId !== id))
      setSelectedFulfillment((prev) => {
        const newSelection = { ...prev }
        delete newSelection[id]
        return newSelection
      })
    }
  }

  const handleUpdateCriterionName = (id: string, name: string) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, name } : c)))
  }

  const handleAddLevel = () => {
    setLevels([...levels, { id: uuidv4(), name: `Level ${levels.length + 1}`, points: (levels.length + 1) * 5 }])
  }

  const handleRemoveLevel = (id: string) => {
    if (levels.length > 1) {
      setLevels(levels.filter((l) => l.id !== id))
      setCells(cells.filter((cell) => cell.levelId !== id))
    }
  }

  const handleUpdateLevel = (id: string, field: "name" | "points", value: string | number) => {
    setLevels(
      levels
        .map((l) => (l.id === id ? { ...l, [field]: value } : l))
        .sort((a, b) => a.points - b.points), // Keep levels sorted by points
    )
  }

  const handleUpdateCellContent = (criterionId: string, levelId: string, content: string) => {
    setCells((prevCells) => {
      const existingCellIndex = prevCells.findIndex((c) => c.criterionId === criterionId && c.levelId === levelId)
      if (existingCellIndex > -1) {
        const newCells = [...prevCells]
        newCells[existingCellIndex] = { ...newCells[existingCellIndex], content }
        return newCells
      } else {
        return [...prevCells, { criterionId, levelId, content }]
      }
    })
  }

  const handleSave = () => {
    if (!task?.id) {
      // Ensure task and its ID exist before saving
      console.error("Cannot save rubric: task or task ID is missing.")
      return
    }
    const rubricData: RubricData = {
      criteria,
      levels,
      cells,
      selectedFulfillment,
    }
    onSaveRubric(task.id, rubricData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original task rubric data
    if (task?.rubric) {
      // Safely access task.rubric
      setCriteria(task.rubric.criteria || [{ id: uuidv4(), name: "Quality" }])
      setLevels(task.rubric.levels || [{ id: uuidv4(), name: "Basic", points: 5 }])
      setCells(task.rubric.cells || [])
      setSelectedFulfillment(task.rubric.selectedFulfillment || {})
    } else {
      setCriteria([{ id: uuidv4(), name: "Quality" }])
      setLevels([{ id: uuidv4(), name: "Basic", points: 5 }])
      setCells([])
      setSelectedFulfillment({})
    }
    setIsEditing(false)
  }

  const handleSelectFulfillment = (criterionId: string, levelId: string) => {
    setSelectedFulfillment((prev) => ({
      ...prev,
      [criterionId]: prev[criterionId] === levelId ? "" : levelId, // Toggle selection
    }))
  }

  const calculateProgress = useMemo(() => {
    if (criteria.length === 0 || levels.length === 0) return 0

    let totalPossiblePoints = 0
    let achievedPoints = 0

    criteria.forEach((criterion) => {
      const selectedLevelId = selectedFulfillment[criterion.id]
      if (selectedLevelId) {
        const selectedLevel = levels.find((level) => level.id === selectedLevelId)
        if (selectedLevel) {
          achievedPoints += selectedLevel.points
        }
      }
      // Max points for each criterion is the highest level's points
      const maxLevelPoints = Math.max(...levels.map((l) => l.points))
      totalPossiblePoints += maxLevelPoints
    })

    if (totalPossiblePoints === 0) return 0
    return (achievedPoints / totalPossiblePoints) * 100
  }, [criteria, levels, selectedFulfillment])

  // Only render if task exists AND (rubric exists OR is being edited)
  if (!task || (!task.rubric && !isEditing)) {
    return null
  }

  return (
    <Card className="bg-cream-50/10 backdrop-blur-sm border border-cream-25/30 rounded-xl p-6 shadow-lg w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-cream-25">Rubric</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-cream-25 hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
      </CardHeader>
      <CardContent className="text-cream-25/80">
        {isEditing ? (
          <div className="space-y-4">
            {/* Criteria Management */}
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Criteria:</h3>
              <Button variant="outline" size="sm" onClick={handleAddCriterion}>
                <Plus className="h-4 w-4 mr-2" /> Add Criterion
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex items-center gap-1">
                  <Input
                    value={criterion.name}
                    onChange={(e) => handleUpdateCriterionName(criterion.id, e.target.value)}
                    maxLength={20}
                    className="w-32 h-8 text-sm"
                    placeholder="Criterion Name"
                  />
                  {criteria.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveCriterion(criterion.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Fulfillment Levels Management */}
            <div className="flex items-center gap-2 mt-4">
              <h3 className="font-medium">Fulfillment Levels:</h3>
              <Button variant="outline" size="sm" onClick={handleAddLevel}>
                <Plus className="h-4 w-4 mr-2" /> Add Level
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <div key={level.id} className="flex items-center gap-1">
                  <Input
                    value={level.name}
                    onChange={(e) => handleUpdateLevel(level.id, "name", e.target.value)}
                    maxLength={15}
                    className="w-24 h-8 text-sm"
                    placeholder="Level Name"
                  />
                  <Input
                    type="number"
                    min={5}
                    max={50}
                    step={5}
                    value={level.points}
                    onChange={(e) =>
                      handleUpdateLevel(
                        level.id,
                        "points",
                        Math.max(5, Math.min(50, Number.parseInt(e.target.value) || 5)),
                      )
                    }
                    className="w-16 h-8 text-sm"
                    placeholder="Points"
                  />
                  {levels.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveLevel(level.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Rubric Grid Editor */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left w-24"></th>
                    {levels.map((level) => (
                      <th key={level.id} className="border p-2 text-center font-semibold">
                        {level.name} ({level.points} pts)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((criterion) => (
                    <tr key={criterion.id}>
                      <td className="border p-2 font-medium">{criterion.name}</td>
                      {levels.map((level) => (
                        <td key={level.id} className="border p-1">
                          <Textarea
                            value={
                              cells.find((c) => c.criterionId === criterion.id && c.levelId === level.id)?.content || ""
                            }
                            onChange={(e) => handleUpdateCellContent(criterion.id, level.id, e.target.value)}
                            maxLength={100}
                            rows={3}
                            className="w-full text-xs resize-none"
                            placeholder="Description"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                <Ban className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save Rubric
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {criteria.length === 0 || levels.length === 0 ? (
              <p className="text-muted-foreground text-center">No rubric defined. Click "Edit Rubric" to create one.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 text-left w-24"></th>
                        {levels.map((level) => (
                          <th key={level.id} className="border p-2 text-center font-semibold">
                            {level.name} ({level.points} pts)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((criterion) => (
                        <tr key={criterion.id}>
                          <td className="border p-2 font-medium">{criterion.name}</td>
                          {levels.map((level) => (
                            <td key={level.id} className="border p-1">
                              <Button
                                variant={selectedFulfillment[criterion.id] === level.id ? "default" : "ghost"}
                                className={cn(
                                  "w-full h-auto min-h-[60px] text-wrap whitespace-normal text-left justify-start items-start p-2",
                                  selectedFulfillment[criterion.id] === level.id
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "hover:bg-muted",
                                )}
                                onClick={() => handleSelectFulfillment(criterion.id, level.id)}
                              >
                                {cells.find((c) => c.criterionId === criterion.id && c.levelId === level.id)?.content ||
                                  "N/A"}
                              </Button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">Progress: {calculateProgress.toFixed(0)}% Quality Fulfillment</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculateProgress}%` }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
