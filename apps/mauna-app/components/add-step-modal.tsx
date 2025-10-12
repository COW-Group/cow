"use client"

import React, { useState, useEffect } from "react"
import { X, Plus, Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useVisionData } from "@/lib/vision-data-provider"
import { databaseService } from "@/lib/database-service"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { useToast } from "@/hooks/use-toast"

interface Breath {
  id?: string
  name: string
  timeEstimationSeconds: number
  position: number
}

interface AddStepModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stepData: any) => Promise<void>
  selectedDate: Date
}

const ENERGY_LEVELS = [
  { value: 1, icon: "😴", label: "Very Low" },
  { value: 2, icon: "😐", label: "Low" },
  { value: 3, icon: "🙂", label: "Medium" },
  { value: 4, icon: "😊", label: "High" },
  { value: 5, icon: "⚡", label: "Very High" },
]

const COLORS = [
  "#00D9FF", // Cyan
  "#FF6B9D", // Pink
  "#FF8A65", // Orange
  "#FFD93D", // Yellow
  "#6BCF7F", // Green
  "#5DADE2", // Blue
  "#9B59B6", // Purple
  "#E74C3C", // Red
  "#F39C12", // Gold
  "#1ABC9C", // Teal
]

const DURATIONS = [1, 5, 10, 15, 30, 45, 60, 90, 120]

const STEP_TYPES = [
  { value: "habit", label: "Habit", description: "Recurring activity" },
  { value: "activity", label: "Activity", description: "One-time task" },
]

export function AddStepModal({ isOpen, onClose, onSave, selectedDate }: AddStepModalProps) {
  const { user } = useAuth(AuthService)
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    label: "",
    description: "",
    type: "habit" as "habit" | "activity",
    scheduledTime: "09:00",
    duration: 15,
    color: "#00D9FF",
    energyLevel: 3,
    frequency: "Every day!" as string,
    alerts: [] as string[],
    breaths: [] as Breath[],
    notes: "",
  })

  const [selectedRangeId, setSelectedRangeId] = useState<string>("")
  const [selectedMountainId, setSelectedMountainId] = useState<string>("")
  const [selectedHillId, setSelectedHillId] = useState<string>("")
  const [selectedTerrainId, setSelectedTerrainId] = useState<string>("")
  const [selectedLengthId, setSelectedLengthId] = useState<string>("")

  // State for adding new hierarchy items
  const [showAddRange, setShowAddRange] = useState(false)
  const [showAddMountain, setShowAddMountain] = useState(false)
  const [showAddHill, setShowAddHill] = useState(false)
  const [showAddTerrain, setShowAddTerrain] = useState(false)
  const [showAddLength, setShowAddLength] = useState(false)

  const [newRangeName, setNewRangeName] = useState("")
  const [newMountainName, setNewMountainName] = useState("")
  const [newHillName, setNewHillName] = useState("")
  const [newTerrainName, setNewTerrainName] = useState("")
  const [newLengthName, setNewLengthName] = useState("")

  const { ranges, refreshData } = useVisionData()

  // Calculate available options based on selections
  const availableMountains = ranges.find((r) => r.id === selectedRangeId)?.mountains || []
  const availableHills = availableMountains.find((m) => m.id === selectedMountainId)?.hills || []
  const availableTerrains = availableHills.find((h) => h.id === selectedHillId)?.terrains || []
  const availableLengths = availableTerrains.find((t) => t.id === selectedTerrainId)?.lengths || []

  const [newBreathName, setNewBreathName] = useState("")

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      console.log("[AddStepModal] Vision data loaded:", {
        rangesCount: ranges.length,
        ranges: ranges,
        selectedRangeId,
        availableMountainsCount: availableMountains.length,
      })
    }
  }, [isOpen, ranges, selectedRangeId, availableMountains])

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setCurrentStep(1)
      setFormData({
        label: "",
        description: "",
        type: "habit",
        scheduledTime: "09:00",
        duration: 15,
        color: "#00D9FF",
        energyLevel: 3,
        frequency: "Every day!",
        alerts: [],
        breaths: [],
        notes: "",
      })
      setSelectedRangeId("")
      setSelectedMountainId("")
      setSelectedHillId("")
      setSelectedTerrainId("")
      setSelectedLengthId("")
      setNewBreathName("")
    }
  }, [isOpen])

  const handleAddBreath = () => {
    if (newBreathName.trim()) {
      setFormData({
        ...formData,
        breaths: [
          ...formData.breaths,
          {
            name: newBreathName,
            timeEstimationSeconds: 300, // Default 5 minutes
            position: formData.breaths.length,
          },
        ],
      })
      setNewBreathName("")
    }
  }

  const handleRemoveBreath = (index: number) => {
    setFormData({
      ...formData,
      breaths: formData.breaths.filter((_, i) => i !== index),
    })
  }

  const toggleAlert = (alertType: string) => {
    const alerts = formData.alerts.includes(alertType)
      ? formData.alerts.filter((a) => a !== alertType)
      : [...formData.alerts, alertType]
    setFormData({ ...formData, alerts })
  }

  // Handlers for adding new hierarchy items
  const handleAddRange = async () => {
    if (!user?.id || !newRangeName.trim()) return
    try {
      const newRange = await databaseService.createRange(user.id, newRangeName.trim())
      await refreshData(true)
      setSelectedRangeId(newRange.id)
      setNewRangeName("")
      setShowAddRange(false)
      toast({ title: "Range Created", description: `"${newRangeName.trim()}" has been added.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create range.", variant: "destructive" })
    }
  }

  const handleAddMountain = async () => {
    if (!user?.id || !newMountainName.trim() || !selectedRangeId) return
    try {
      const newMountain = await databaseService.createMountain(user.id, selectedRangeId, newMountainName.trim())
      await refreshData(true)
      setSelectedMountainId(newMountain.id)
      setNewMountainName("")
      setShowAddMountain(false)
      toast({ title: "Mountain Created", description: `"${newMountainName.trim()}" has been added.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create mountain.", variant: "destructive" })
    }
  }

  const handleAddHill = async () => {
    if (!user?.id || !newHillName.trim() || !selectedMountainId) return
    try {
      const newHill = await databaseService.createHill(user.id, selectedMountainId, newHillName.trim())
      await refreshData(true)
      setSelectedHillId(newHill.id)
      setNewHillName("")
      setShowAddHill(false)
      toast({ title: "Hill Created", description: `"${newHillName.trim()}" has been added.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create hill.", variant: "destructive" })
    }
  }

  const handleAddTerrain = async () => {
    if (!user?.id || !newTerrainName.trim() || !selectedHillId) return
    try {
      const newTerrain = await databaseService.createTerrain(user.id, selectedHillId, newTerrainName.trim())
      await refreshData(true)
      setSelectedTerrainId(newTerrain.id)
      setNewTerrainName("")
      setShowAddTerrain(false)
      toast({ title: "Terrain Created", description: `"${newTerrainName.trim()}" has been added.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create terrain.", variant: "destructive" })
    }
  }

  const handleAddLength = async () => {
    if (!user?.id || !newLengthName.trim() || !selectedTerrainId) return
    try {
      const newLength = await databaseService.createLength(user.id, selectedTerrainId, newLengthName.trim())
      await refreshData(true)
      setSelectedLengthId(newLength.id)
      setNewLengthName("")
      setShowAddLength(false)
      toast({ title: "Length Created", description: `"${newLengthName.trim()}" has been added.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to create length.", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    // Determine tag based on frequency: "Once" (empty string) = activity, otherwise habit
    const isActivity = formData.frequency === ""

    const stepData = {
      label: formData.label,
      description: formData.description,
      tag: isActivity ? "activity" : "habit",
      color: formData.color,
      duration: formData.duration * 60000, // Convert to milliseconds
      frequency: formData.frequency,
      scheduledTime: formData.scheduledTime,
      scheduledDate: selectedDate.toISOString().split('T')[0], // Add scheduled date for activities
      energyLevel: formData.energyLevel,
      lengthId: selectedLengthId || null,
      alerts: formData.alerts,
      notes: formData.notes,
      breaths: formData.breaths,
      completed: false,
      isbuildhabit: !isActivity,
    }

    console.log("[AddStepModal] Creating step with frequency:", formData.frequency, "tag:", stepData.tag)

    await onSave(stepData)
    onClose()
  }

  if (!isOpen) return null

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">What?</label>
              <Input
                placeholder="Step name..."
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 mb-4"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                {STEP_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value as "habit" | "activity" })}
                    className={`p-4 rounded-xl text-left transition-all ${
                      formData.type === type.value
                        ? "bg-cyan-500 text-white"
                        : "bg-white/5 text-cream-25/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs opacity-70 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>

              <label className="text-sm font-semibold text-cream-25 mb-3 block">Vision Hierarchy</label>
              <div className="space-y-3">
                {/* Range */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-cream-25/60">Range</label>
                    <button
                      type="button"
                      onClick={() => setShowAddRange(!showAddRange)}
                      className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add New
                    </button>
                  </div>

                  {showAddRange ? (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="New range name..."
                        value={newRangeName}
                        onChange={(e) => setNewRangeName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddRange()}
                        className="bg-white/5 border-white/10 text-cream-25 text-sm"
                      />
                      <Button
                        onClick={handleAddRange}
                        disabled={!newRangeName.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  ) : null}

                  <select
                    value={selectedRangeId}
                    onChange={(e) => {
                      setSelectedRangeId(e.target.value)
                      setSelectedMountainId("")
                      setSelectedHillId("")
                      setSelectedTerrainId("")
                      setSelectedLengthId("")
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-cream-25 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="" className="bg-gray-900">Select Range</option>
                    {ranges.map((range) => (
                      <option key={range.id} value={range.id} className="bg-gray-900">
                        {range.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mountain */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-cream-25/60">Mountain</label>
                    {selectedRangeId && (
                      <button
                        type="button"
                        onClick={() => setShowAddMountain(!showAddMountain)}
                        className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add New
                      </button>
                    )}
                  </div>

                  {showAddMountain && selectedRangeId ? (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="New mountain name..."
                        value={newMountainName}
                        onChange={(e) => setNewMountainName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddMountain()}
                        className="bg-white/5 border-white/10 text-cream-25 text-sm"
                      />
                      <Button
                        onClick={handleAddMountain}
                        disabled={!newMountainName.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  ) : null}

                  <select
                    value={selectedMountainId}
                    onChange={(e) => {
                      setSelectedMountainId(e.target.value)
                      setSelectedHillId("")
                      setSelectedTerrainId("")
                      setSelectedLengthId("")
                    }}
                    disabled={!selectedRangeId}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-cream-25 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Select Mountain</option>
                    {availableMountains.map((mountain) => (
                      <option key={mountain.id} value={mountain.id} className="bg-gray-900">
                        {mountain.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hill */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-cream-25/60">Hill</label>
                    {selectedMountainId && (
                      <button
                        type="button"
                        onClick={() => setShowAddHill(!showAddHill)}
                        className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add New
                      </button>
                    )}
                  </div>

                  {showAddHill && selectedMountainId ? (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="New hill name..."
                        value={newHillName}
                        onChange={(e) => setNewHillName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddHill()}
                        className="bg-white/5 border-white/10 text-cream-25 text-sm"
                      />
                      <Button
                        onClick={handleAddHill}
                        disabled={!newHillName.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  ) : null}

                  <select
                    value={selectedHillId}
                    onChange={(e) => {
                      setSelectedHillId(e.target.value)
                      setSelectedTerrainId("")
                      setSelectedLengthId("")
                    }}
                    disabled={!selectedMountainId}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-cream-25 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Select Hill</option>
                    {availableHills.map((hill) => (
                      <option key={hill.id} value={hill.id} className="bg-gray-900">
                        {hill.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Terrain */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-cream-25/60">Terrain</label>
                    {selectedHillId && (
                      <button
                        type="button"
                        onClick={() => setShowAddTerrain(!showAddTerrain)}
                        className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add New
                      </button>
                    )}
                  </div>

                  {showAddTerrain && selectedHillId ? (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="New terrain name..."
                        value={newTerrainName}
                        onChange={(e) => setNewTerrainName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTerrain()}
                        className="bg-white/5 border-white/10 text-cream-25 text-sm"
                      />
                      <Button
                        onClick={handleAddTerrain}
                        disabled={!newTerrainName.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  ) : null}

                  <select
                    value={selectedTerrainId}
                    onChange={(e) => {
                      setSelectedTerrainId(e.target.value)
                      setSelectedLengthId("")
                    }}
                    disabled={!selectedHillId}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-cream-25 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Select Terrain</option>
                    {availableTerrains.map((terrain) => (
                      <option key={terrain.id} value={terrain.id} className="bg-gray-900">
                        {terrain.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Length */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-cream-25/60">Length</label>
                    {selectedTerrainId && (
                      <button
                        type="button"
                        onClick={() => setShowAddLength(!showAddLength)}
                        className="text-xs text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add New
                      </button>
                    )}
                  </div>

                  {showAddLength && selectedTerrainId ? (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="New length name..."
                        value={newLengthName}
                        onChange={(e) => setNewLengthName(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddLength()}
                        className="bg-white/5 border-white/10 text-cream-25 text-sm"
                      />
                      <Button
                        onClick={handleAddLength}
                        disabled={!newLengthName.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  ) : null}

                  <select
                    value={selectedLengthId}
                    onChange={(e) => setSelectedLengthId(e.target.value)}
                    disabled={!selectedTerrainId}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-cream-25 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-40"
                  >
                    <option value="" className="bg-gray-900">Select Length</option>
                    {availableLengths.map((length) => (
                      <option key={length.id} value={length.id} className="bg-gray-900">
                        {length.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">When?</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-cream-25/60 mb-2 block">Time</label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="bg-white/5 border-white/10 text-cream-25"
                  />
                </div>
                <div>
                  <label className="text-xs text-cream-25/60 mb-2 block">Date</label>
                  <Input
                    type="date"
                    defaultValue={format(selectedDate, "yyyy-MM-dd")}
                    className="bg-white/5 border-white/10 text-cream-25"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">How long?</label>
              <div className="grid grid-cols-5 gap-2">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setFormData({ ...formData, duration })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      formData.duration === duration
                        ? "bg-cyan-500 text-white"
                        : "bg-white/5 text-cream-25/70 hover:bg-white/10"
                    }`}
                  >
                    {duration}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">How much energy?</label>
              <div className="grid grid-cols-5 gap-2">
                {ENERGY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData({ ...formData, energyLevel: level.value })}
                    className={`p-4 rounded-xl text-center transition-all ${
                      formData.energyLevel === level.value
                        ? "bg-cyan-500 scale-110"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    title={level.label}
                  >
                    <div className="text-2xl">{level.icon}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">What color?</label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-full h-12 rounded-xl transition-all ${
                      formData.color === color ? "ring-2 ring-white scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">How often?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "Every day!", label: "Daily" },
                  { value: "Monday, Tuesday, Wednesday, Thursday, Friday", label: "Weekdays" },
                  { value: "Saturday, Sunday", label: "Weekends" },
                  { value: "", label: "Once" },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => setFormData({ ...formData, frequency: freq.value })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      formData.frequency === freq.value
                        ? "bg-cyan-500 text-white"
                        : "bg-white/5 text-cream-25/70 hover:bg-white/10"
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-cream-25">Needs alerts?</label>
                <span className="text-xs text-cyan-500 font-medium">🔔 Nudge</span>
              </div>
              <div className="space-y-2">
                {[
                  { id: "start", label: "At start of task" },
                  { id: "end", label: "At end of task" },
                  { id: "1min", label: "1m before start" },
                  { id: "5min", label: "5m before start" },
                  { id: "10min", label: "10m before start" },
                ].map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => toggleAlert(alert.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      formData.alerts.includes(alert.id)
                        ? "bg-cyan-500/20 border-cyan-500/50"
                        : "bg-white/5 border-transparent hover:bg-white/10"
                    } border`}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm text-cream-25">{alert.label}</span>
                    </div>
                    {formData.alerts.includes(alert.id) && (
                      <X className="w-4 h-4 text-cyan-500" onClick={() => toggleAlert(alert.id)} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-cream-25 mb-3 block">Any details?</label>

              {/* Breaths/Subtasks */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    placeholder="Add a breath (subtask)..."
                    value={newBreathName}
                    onChange={(e) => setNewBreathName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddBreath()}
                    className="bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40"
                  />
                  <Button
                    onClick={handleAddBreath}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.breaths.length > 0 && (
                  <div className="space-y-2">
                    {formData.breaths.map((breath, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <span className="text-sm text-cream-25">{breath.name}</span>
                        <button
                          onClick={() => handleRemoveBreath(index)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Textarea
                placeholder="Add notes, meeting links or phone numbers..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/5 border-white/10 text-cream-25 placeholder:text-cream-25/40 min-h-[100px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-inherit">
          <h2 className="text-2xl font-lora font-light text-cream-25">
            New <span className="text-cyan-500">Step</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-cream-25" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 px-6 pt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full transition-all ${
                step <= currentStep ? "bg-cyan-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">{renderStepContent()}</div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-4 p-6 border-t border-white/10 bg-inherit">
          {currentStep > 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              className="flex-1 border-white/10 text-cream-25 hover:bg-white/10"
            >
              Back
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!formData.label.trim()}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!formData.label.trim()}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50"
            >
              Create Step
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
