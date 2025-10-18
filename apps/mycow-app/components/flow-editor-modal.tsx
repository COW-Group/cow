"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Inflow {
  name: string
  amount: number
  type: "income" | "assets"
  color: string
  goalLinked: string | null
}

interface Outflow {
  name: string
  amount: number
  type: "expenses" | "liabilities" | "goals"
  color: string
  goalLinked: string | null
}

interface FlowLink {
  source: string
  target: string
  value: number
  color?: string
  goalLinked?: string | null
}

interface FlowEditorModalProps {
  isOpen: boolean
  onClose: () => void
  inflows: Inflow[]
  outflows: Outflow[]
  currentFlowLinks: FlowLink[]
  onSave: (inflowName: string, newAllocations: { target: string; value: number }[], updatedInflowAmount: number) => void // Updated onSave signature
  selectedInflow: Inflow | null // Allow pre-selection
}

export function FlowEditorModal({
  isOpen,
  onClose,
  inflows,
  outflows,
  currentFlowLinks,
  onSave,
  selectedInflow,
}: FlowEditorModalProps) {
  const [selectedInflowName, setSelectedInflowName] = useState<string | undefined>(selectedInflow?.name)
  const [editableInflowAmount, setEditableInflowAmount] = useState(selectedInflow?.amount || 0) // New state for editable inflow amount
  const [allocations, setAllocations] = useState<Record<string, number>>({})
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const currentInflow = selectedInflowName ? inflows.find((i) => i.name === selectedInflowName) : null

  useEffect(() => {
    if (currentInflow) {
      setEditableInflowAmount(currentInflow.amount) // Initialize editable amount
      const initialAllocations: Record<string, number> = {}
      let allocatedSum = 0

      currentFlowLinks
        .filter((link) => link.source === currentInflow.name)
        .forEach((link) => {
          initialAllocations[link.target] = link.value
          allocatedSum += link.value
        })

      setAllocations(initialAllocations)
      setRemainingAmount(currentInflow.amount - allocatedSum)
      setError(null)
    } else {
      setEditableInflowAmount(0)
      setAllocations({})
      setRemainingAmount(0)
      setError(null)
    }
  }, [selectedInflowName, currentInflow, currentFlowLinks, inflows])

  // Recalculate remaining amount whenever allocations or editableInflowAmount changes
  useEffect(() => {
    const currentAllocatedSum = Object.values(allocations).reduce((sum, val) => sum + val, 0)
    const newRemaining = editableInflowAmount - currentAllocatedSum
    setRemainingAmount(newRemaining)

    if (newRemaining < 0) {
      setError("Allocated amount exceeds total inflow.")
    } else {
      setError(null)
    }
  }, [allocations, editableInflowAmount])

  const handleAllocationChange = (targetName: string, value: string) => {
    const parsedValue = Number.parseInt(value, 10) || 0
    const newAllocations = { ...allocations, [targetName]: parsedValue }
    setAllocations(newAllocations)
  }

  const handleInflowAmountChange = (value: string) => {
    const parsedValue = Number.parseInt(value, 10) || 0
    setEditableInflowAmount(parsedValue)
  }

  const handleSave = () => {
    if (!currentInflow) {
      setError("Please select an inflow.")
      return
    }
    if (remainingAmount < 0) {
      setError("Allocated amount cannot exceed total inflow.")
      return
    }

    const newAllocations = Object.entries(allocations).map(([target, value]) => ({
      target,
      value,
    }))

    onSave(currentInflow.name, newAllocations, editableInflowAmount) // Pass updatedInflowAmount
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700 rounded-xl shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-light text-ink-800 dark:text-cream-100">
            Edit Financial Flows
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 text-ink-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inflow" className="text-right text-ink-600 dark:text-cream-300">
              Inflow
            </Label>
            <Select onValueChange={setSelectedInflowName} value={selectedInflowName} disabled={!!selectedInflow}>
              <SelectTrigger className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100">
                <SelectValue placeholder="Select an inflow" />
              </SelectTrigger>
              <SelectContent className="bg-cream-50 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-ink-800 dark:text-cream-100">
                {inflows.map((inflow) => (
                  <SelectItem key={inflow.name} value={inflow.name}>
                    {inflow.name} (${inflow.amount.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentInflow && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inflow-amount" className="text-right text-ink-600 dark:text-cream-300">
                  Inflow Amount
                </Label>
                <Input
                  id="inflow-amount"
                  type="number"
                  value={editableInflowAmount}
                  onChange={(e) => handleInflowAmountChange(e.target.value)}
                  className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
                />
              </div>

              <div className="text-center text-sm font-medium">
                Remaining to Allocate:{" "}
                <span className={remainingAmount < 0 ? "text-red-500" : "text-logo-blue"}>
                  ${remainingAmount.toLocaleString()}
                </span>
              </div>
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {outflows.map((outflow) => (
                  <div key={outflow.name} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`alloc-${outflow.name}`} className="text-right text-ink-600 dark:text-cream-300">
                      {outflow.name}
                    </Label>
                    <Input
                      id={`alloc-${outflow.name}`}
                      type="number"
                      value={allocations[outflow.name] || ""}
                      onChange={(e) => handleAllocationChange(outflow.name, e.target.value)}
                      className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!currentInflow || remainingAmount < 0}
            className="bg-logo-blue hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
