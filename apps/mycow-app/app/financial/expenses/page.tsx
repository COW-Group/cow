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
import { ArrowLeft, Plus, Edit, Trash2, TrendingDown } from "lucide-react"
import { ZenCard } from "@/components/zen-card"
import type { FinancialOutflow, Range } from "@/lib/types"
import {
  getFinancialOutflows,
  addFinancialOutflow,
  updateFinancialOutflow,
  deleteFinancialOutflow,
  getAllRanges, // Import new action
} from "@/app/actions/financial-actions"

export default function ExpensesPage() {
  const router = useRouter()
  const [outflows, setOutflows] = useState<FinancialOutflow[]>([])
  const [ranges, setRanges] = useState<Range[]>([]) // New state for ranges
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOutflow, setEditingOutflow] = useState<FinancialOutflow | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "expenses" as "expenses" | "liabilities" | "goals",
    category_id: "" as string | null, // Changed to category_id
    description: "",
    due_date: "",
    payment_date: "",
    frequency: "monthly" as const,
    priority: "medium" as const,
    color: "#f97316",
    goal_linked: "", // Still present for now, but will be deprecated
    goal_vision_level: null, // New field
    goal_vision_item_id: null, // New field
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [outflowsData, rangesData] = await Promise.all([
      getFinancialOutflows(),
      getAllRanges(), // Fetch ranges
    ])
    setOutflows(outflowsData.filter((o) => o.type === "expenses"))
    setRanges(rangesData)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const outflowData = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
      is_active: true,
      category_id: formData.category_id || null, // Ensure null if empty string
      goal_vision_level: null, // Expenses don't link to specific vision items
      goal_vision_item_id: null, // Expenses don't link to specific vision items
    }

    if (editingOutflow) {
      await updateFinancialOutflow(editingOutflow.id, outflowData)
    } else {
      await addFinancialOutflow(outflowData)
    }

    resetForm()
    loadData() // Reload all data
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      type: "expenses",
      category_id: null, // Reset to null
      description: "",
      due_date: "",
      payment_date: "",
      frequency: "monthly",
      priority: "medium",
      color: "#f97316",
      goal_linked: "",
      goal_vision_level: null,
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
      category_id: outflow.category_id || null, // Set category_id
      description: outflow.description || "",
      due_date: outflow.due_date || "",
      payment_date: outflow.payment_date || "",
      frequency: outflow.frequency,
      priority: outflow.priority,
      color: outflow.color,
      goal_linked: outflow.goal_linked || "",
      goal_vision_level: outflow.goal_vision_level || null,
      goal_vision_item_id: outflow.goal_vision_item_id || null,
    })
    setEditingOutflow(outflow)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteFinancialOutflow(id)
      loadData() // Reload all data
    }
  }

  const totalExpenses = outflows.reduce((sum, o) => sum + o.amount, 0)

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
              <h1 className="text-2xl font-light text-ink-800 dark:text-cream-100">Expenses</h1>
              <p className="text-ink-600 dark:text-cream-400">Manage your expense outflows</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-logo-blue hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Summary Card */}
        <ZenCard className="bg-gradient-to-br from-orange-50/50 to-red-100/50 dark:from-orange-900/20 dark:to-red-900/30">
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

        {/* Form */}
        {isFormOpen && (
          <ZenCard>
            <CardHeader>
              <CardTitle className="text-ink-800 dark:text-cream-100">
                {editingOutflow ? "Edit Expense" : "Add New Expense"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount *</Label>
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
                    <Label htmlFor="frequency">Frequency</Label>
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
                      value={formData.category_id || "none"} // Updated default value to "none"
                      onValueChange={(value) => setFormData({ ...formData, category_id: value || null })}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue placeholder="Select a Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {ranges.map((range) => (
                          <SelectItem key={range.id} value={range.id}>
                            {range.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment_date">Payment Date</Label>
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
                <div>
                  <Label htmlFor="goal_linked">Goal Linked (Deprecated)</Label>
                  <Input
                    id="goal_linked"
                    value={formData.goal_linked}
                    onChange={(e) => setFormData({ ...formData, goal_linked: e.target.value })}
                    className="bg-cream-100 dark:bg-ink-700"
                    disabled // Disable this field as it's deprecated
                  />
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
                    {editingOutflow ? "Update" : "Add"} Expense
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </ZenCard>
        )}

        {/* Expenses List */}
        <ZenCard>
          <CardHeader>
            <CardTitle className="text-ink-800 dark:text-cream-100">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-ink-600 dark:text-cream-400">Loading...</p>
            ) : outflows.length === 0 ? (
              <p className="text-ink-600 dark:text-cream-400">No expenses added yet.</p>
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
                          ${outflow.amount.toLocaleString()} • {outflow.frequency}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {outflow.category_name && <Badge variant="secondary">{outflow.category_name}</Badge>}
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
