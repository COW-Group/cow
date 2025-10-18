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
import { ArrowLeft, Plus, Edit, Trash2, DollarSign } from "lucide-react"
import { ZenCard } from "@/components/zen-card"
import type { FinancialInflow, Range } from "@/lib/types"
import {
  getFinancialInflows,
  addFinancialInflow,
  updateFinancialInflow,
  deleteFinancialInflow,
  getAllRanges, // Import new action
} from "@/app/actions/financial-actions"

export default function IncomePage() {
  const router = useRouter()
  const [inflows, setInflows] = useState<FinancialInflow[]>([])
  const [ranges, setRanges] = useState<Range[]>([]) // New state for ranges
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingInflow, setEditingInflow] = useState<FinancialInflow | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "income" as "income" | "assets",
    category_id: "" as string | null, // Changed to category_id
    description: "",
    work_start_date: "",
    inflow_arrival_date: "",
    frequency: "monthly" as const,
    color: "#10b981",
    goal_linked: "", // Still present for now, but will be deprecated
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [inflowsData, rangesData] = await Promise.all([
      getFinancialInflows(),
      getAllRanges(), // Fetch ranges
    ])
    setInflows(inflowsData)
    setRanges(rangesData)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const inflowData = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
      is_active: true,
      category_id: formData.category_id || null, // Ensure null if empty string
    }

    if (editingInflow) {
      await updateFinancialInflow(editingInflow.id, inflowData)
    } else {
      await addFinancialInflow(inflowData)
    }

    resetForm()
    loadData() // Reload all data
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      type: "income",
      category_id: null, // Reset to null
      description: "",
      work_start_date: "",
      inflow_arrival_date: "",
      frequency: "monthly",
      color: "#10b981",
      goal_linked: "",
    })
    setEditingInflow(null)
    setIsFormOpen(false)
  }

  const handleEdit = (inflow: FinancialInflow) => {
    setFormData({
      name: inflow.name,
      amount: inflow.amount.toString(),
      type: inflow.type,
      category_id: inflow.category_id || null, // Set category_id
      description: inflow.description || "",
      work_start_date: inflow.work_start_date || "",
      inflow_arrival_date: inflow.inflow_arrival_date || "",
      frequency: inflow.frequency,
      color: inflow.color,
      goal_linked: inflow.goal_linked || "",
    })
    setEditingInflow(inflow)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income source?")) {
      await deleteFinancialInflow(id)
      loadData() // Reload all data
    }
  }

  const totalIncome = inflows.filter((i) => i.type === "income").reduce((sum, i) => sum + i.amount, 0)
  const totalAssets = inflows.filter((i) => i.type === "assets").reduce((sum, i) => sum + i.amount, 0)

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
              <h1 className="text-2xl font-light text-ink-800 dark:text-cream-100">Income & Assets</h1>
              <p className="text-ink-600 dark:text-cream-400">Manage your income sources and asset inflows</p>
            </div>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="bg-logo-blue hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Income Source
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ZenCard className="bg-gradient-to-br from-emerald-50/50 to-green-100/50 dark:from-emerald-900/20 dark:to-green-900/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Income</h3>
                <div className="text-2xl font-light text-emerald-700 dark:text-emerald-400">
                  ${totalIncome.toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </ZenCard>

          <ZenCard className="bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-ink-600 dark:text-cream-400 mb-1">Total Assets</h3>
                <div className="text-2xl font-light text-blue-700 dark:text-blue-400">
                  ${totalAssets.toLocaleString()}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </ZenCard>
        </div>

        {/* Form */}
        {isFormOpen && (
          <ZenCard>
            <CardHeader>
              <CardTitle className="text-ink-800 dark:text-cream-100">
                {editingInflow ? "Edit Income Source" : "Add New Income Source"}
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
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "income" | "assets") => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-cream-100 dark:bg-ink-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="assets">Assets</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="work_start_date">Work Start Date</Label>
                    <Input
                      id="work_start_date"
                      type="date"
                      value={formData.work_start_date}
                      onChange={(e) => setFormData({ ...formData, work_start_date: e.target.value })}
                      className="bg-cream-100 dark:bg-ink-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflow_arrival_date">Inflow Arrival Date</Label>
                    <Input
                      id="inflow_arrival_date"
                      type="date"
                      value={formData.inflow_arrival_date}
                      onChange={(e) => setFormData({ ...formData, inflow_arrival_date: e.target.value })}
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
                    {editingInflow ? "Update" : "Add"} Income Source
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </ZenCard>
        )}

        {/* Income List */}
        <ZenCard>
          <CardHeader>
            <CardTitle className="text-ink-800 dark:text-cream-100">Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-ink-600 dark:text-cream-400">Loading...</p>
            ) : inflows.length === 0 ? (
              <p className="text-ink-600 dark:text-cream-400">No income sources added yet.</p>
            ) : (
              <div className="space-y-4">
                {inflows.map((inflow) => (
                  <div
                    key={inflow.id}
                    className="flex items-center justify-between p-4 bg-cream-50 dark:bg-ink-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: inflow.color }} />
                      <div>
                        <h3 className="font-medium text-ink-800 dark:text-cream-100">{inflow.name}</h3>
                        <p className="text-sm text-ink-600 dark:text-cream-400">
                          ${inflow.amount.toLocaleString()} • {inflow.frequency}
                        </p>
                        {inflow.category_name && ( // Display category_name
                          <Badge variant="secondary" className="mt-1">
                            {inflow.category_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(inflow)}
                        className="text-ink-600 dark:text-cream-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(inflow.id)}
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
