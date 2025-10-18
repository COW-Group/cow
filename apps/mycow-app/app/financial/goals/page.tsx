"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Target } from "lucide-react"
import { ZenCard } from "@/components/zen-card"
import type { FinancialOutflow, Range, Mountain, Hill, Terrain, Milestone, Task, MicroTask } from "@/lib/types"
import {
  getFinancialOutflows,
  addFinancialOutflow,
  updateFinancialOutflow,
  deleteFinancialOutflow,
  getAllRanges,
  getVisionItemsByLevel, // Import new action
} from "@/app/actions/financial-actions"

export default function GoalsPage() {
  const router = useRouter()
  const [outflows, setOutflows] = useState<FinancialOutflow[]>([])
  const [ranges, setRanges] = useState<Range[]>([])
  const [visionItems, setVisionItems] = useState<Array<Mountain | Hill | Terrain | Milestone | Task | MicroTask>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOutflow, setEditingOutflow] = useState<FinancialOutflow | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "goals" as "expenses" | "liabilities" | "goals",
    category_id: "" as string | null, // Changed to category_id
    description: "",
    due_date: "",
    payment_date: "", // Can be used for target completion date or last contribution
    frequency: "one-time" as const, // Default to one-time for goals, or 'monthly' for contributions
    priority: "medium" as const,
    color: "#d97706", // Amber color for goals
    goal_linked: "", // Still present for now, but will be deprecated
    goal_vision_level: "Mountain" as FinancialOutflow["goal_vision_level"], // New field with default value
    goal_vision_item_id: null as string | null, // New field
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Load vision items when goal_vision_level changes
    const loadVisionItems = async () => {
      if (formData.goal_vision_level) {
        const items = await getVisionItemsByLevel(formData.goal_vision_level)
        setVisionItems(items)
      } else {
        setVisionItems([])
      }
    }
    loadVisionItems()
  }, [formData.goal_vision_level])

  const loadData = async () => {
    setIsLoading(true)
    const [outflowsData, rangesData] = await Promise.all([getFinancialOutflows(), getAllRanges()])
    setOutflows(outflowsData.filter((o) => o.type === "goals"))
    setRanges(rangesData)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const outflowData = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
      is_active: true,
      category_id: formData.category_id || null,
      goal_vision_level: formData.goal_vision_level || null,
      goal_vision_item_id: formData.goal_vision_item_id || null,
    }

    if (editingOutflow) {
      await updateFinancialOutflow(editingOutflow.id, outflowData)
    } else {
      await addFinancialOutflow(outflowData)
    }

    resetForm()
    loadData()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      type: "goals",
      category_id: null,
      description: "",
      due_date: "",
      payment_date: "",
      frequency: "one-time",
      priority: "medium",
      color: "#d97706",
      goal_linked: "",
      goal_vision_level: "Mountain", // Reset to default value
      goal_vision_item_id: null,
    })
    setEditingOutflow(null)
    setIsFormOpen(false)
  }

  const handleEdit = (outflow: FinancialOutflow) => {
    setFormData({
      name: outflow.name,
      amount: outflow.amount.toString(),
      type: outflow.type,
      category_id: outflow.category_id || null,
      description: outflow.description || "",
      due_date: outflow.due_date || "",
      payment_date: outflow.payment_date || "",
      frequency: outflow.frequency,
      priority: outflow.priority,
      color: outflow.color,
      goal_linked: outflow.goal_linked || "",
      goal_vision_level: outflow.goal_vision_level || "Mountain", // Default to "Mountain"
      goal_vision_item_id: outflow.goal_vision_item_id || null,
    })
    setEditingOutflow(outflow)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteFinancialOutflow(id)
      loadData()
    }
  }

  const totalGoals = outflows.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="min-h-screen bg-cream-25 dark:bg-ink-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-ink-600 dark:text-cream-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-light text-ink-800 dark:text-cream-100">Goals</h1>
              <p className="text-ink-600 dark:text-cream-400">Manage your financial goals</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-logo-blue hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Summary Card */}
        <ZenCard className="col-span-full bg-gradient-to-br from-yellow-50/50 to-amber-100/50 dark:from-yellow-900/20 dark:to-amber-900/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Goal Requirements</h3>
              <div className="text-2xl font-light text-amber-700 dark:text-amber-400">
                ${totalGoals.toLocaleString()}
              </div>
            </div>
            <Target className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
        </ZenCard>

        {/* Form */}
        {isFormOpen && (
          <ZenCard>
            <CardHeader>
              <CardTitle className="text-ink-800 dark:text-cream-100">
                {editingOutflow ? "Edit Goal" : "Add New Goal"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Goal Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Target Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Contribution Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category_id">Category (Wealth Vision Range)</Label>
                    <Select
                      value={formData.category_id || ""}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value || null })}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue placeholder="Select a Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {ranges.map((range) => (
                          <SelectItem key={range.id} value={range.id}>
                            {range.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Target Completion Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment_date">Last Contribution Date</Label>
                    <Input
                      id="payment_date"
                      type="date"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="bg-cream-100 dark:bg-ink-700 h-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal_vision_level">Goal Vision Level</Label>
                    <Select
                      value={formData.goal_vision_level || ""}
                      onValueChange={(value: FinancialOutflow["goal_vision_level"]) => {
                        setFormData({ ...formData, goal_vision_level: value, goal_vision_item_id: null }) // Reset item ID when level changes
                      }}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue placeholder="Select a Vision Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="Hill">Hill</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Milestone">Milestone</SelectItem>
                        <SelectItem value="Task">Task</SelectItem>
                        <SelectItem value="Breath">Breath</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal_vision_item_id">Linked Wealth Vision Item</Label>
                    <Select
                      value={formData.goal_vision_item_id || ""}
                      onValueChange={(value) => setFormData({ ...formData, goal_vision_item_id: value || null })}
                      disabled={!formData.goal_vision_level || visionItems.length === 0}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {visionItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title || (item as MicroTask).label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-cream-100 dark:bg-ink-700"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-logo-blue hover:bg-blue-700 text-white">
                    {editingOutflow ? "Update" : "Add"} Goal
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </ZenCard>
        )}

        {/* Goals List */}
        <ZenCard>
          <CardHeader>
            <CardTitle className="text-ink-800 dark:text-cream-100">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-ink-600 dark:text-cream-400">Loading...</p>
            ) : outflows.length === 0 ? (
              <p className="text-ink-600 dark:text-cream-400">No goals added yet.</p>
            ) : (
              <div className="space-y-4">
                {outflows.map((outflow) => (
                  <div
                    key={outflow.id}
                    className="flex items-center justify-between p-4 bg-cream-50 dark:bg-ink-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: outflow.color }} />
                      <div>
                        <h3 className="font-medium text-ink-800 dark:text-cream-100">{outflow.name}</h3>
                        <p className="text-sm text-ink-600 dark:text-cream-400">
                          Target: ${outflow.amount.toLocaleString()} • {outflow.frequency}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {outflow.category_name && <Badge variant="secondary">{outflow.category_name}</Badge>}
                          {outflow.goal_vision_level && outflow.goal_item_name && (
                            <Badge variant="outline" className="bg-logo-blue/10 text-logo-blue">
                              {outflow.goal_vision_level}: {outflow.goal_item_name}
                            </Badge>
                          )}
                          <Badge
                            variant={
                              outflow.priority === "high"
                                ? "destructive"
                                : outflow.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {outflow.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(outflow)}
                        className="text-ink-600 dark:text-cream-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(outflow.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </ZenCard>
      </div>
    </div>
  )
}
