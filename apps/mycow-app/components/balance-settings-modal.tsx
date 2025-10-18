"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input" // Import Input for editable balances
import { X } from "lucide-react"

interface BalanceSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  currentCurrency: string
  currentNumberFormat: "standard" | "compact" | "scientific"
  currentUseAccountingFormat: boolean
  openingBalance: number // Pass current opening balance
  closingBalance: number // Pass current closing balance
  onSave: (
    currency: string,
    numberFormat: "standard" | "compact" | "scientific",
    useAccountingFormat: boolean,
    newOpeningBalance: number, // Pass updated opening balance
    newClosingBalance: number, // Pass updated closing balance
  ) => void
}

export function BalanceSettingsModal({
  isOpen,
  onClose,
  currentCurrency,
  currentNumberFormat,
  currentUseAccountingFormat,
  openingBalance,
  closingBalance,
  onSave,
}: BalanceSettingsModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency)
  const [selectedNumberFormat, setSelectedNumberFormat] = useState(currentNumberFormat)
  const [useAccountingFormat, setUseAccountingFormat] = useState(currentUseAccountingFormat)
  const [modalOpeningBalance, setModalOpeningBalance] = useState(openingBalance) // State for editable opening balance
  const [modalClosingBalance, setModalClosingBalance] = useState(closingBalance) // State for editable closing balance

  useEffect(() => {
    setSelectedCurrency(currentCurrency)
    setSelectedNumberFormat(currentNumberFormat)
    setUseAccountingFormat(currentUseAccountingFormat)
    setModalOpeningBalance(openingBalance) // Sync modal state with prop
    setModalClosingBalance(closingBalance) // Sync modal state with prop
  }, [currentCurrency, currentNumberFormat, currentUseAccountingFormat, openingBalance, closingBalance])

  const handleSave = () => {
    onSave(selectedCurrency, selectedNumberFormat, useAccountingFormat, modalOpeningBalance, modalClosingBalance)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-cream-50 dark:bg-ink-800 text-ink-800 dark:text-cream-100 border-cream-200 dark:border-ink-700 rounded-xl shadow-lg">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-light text-ink-800 dark:text-cream-100">
            Balance Display Settings
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
          {/* Editable Opening Balance */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modal-opening-balance" className="text-right text-ink-600 dark:text-cream-300">
              Opening Balance
            </Label>
            <Input
              id="modal-opening-balance"
              type="number"
              value={modalOpeningBalance}
              onChange={(e) => setModalOpeningBalance(Number.parseFloat(e.target.value) || 0)}
              className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
            />
          </div>

          {/* Editable Closing Balance */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modal-closing-balance" className="text-right text-ink-600 dark:text-cream-300">
              Closing Balance
            </Label>
            <Input
              id="modal-closing-balance"
              type="number"
              value={modalClosingBalance}
              onChange={(e) => setModalClosingBalance(Number.parseFloat(e.target.value) || 0)}
              className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right text-ink-600 dark:text-cream-300">
              Currency
            </Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-cream-50 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-ink-800 dark:text-cream-100">
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="HKD">HKD (HK$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number-format" className="text-right text-ink-600 dark:text-cream-300">
              Number Format
            </Label>
            <Select value={selectedNumberFormat} onValueChange={setSelectedNumberFormat as (value: string) => void}>
              <SelectTrigger className="col-span-3 bg-cream-100 dark:bg-ink-700 border-cream-200 dark:border-ink-600 text-ink-800 dark:text-cream-100">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-cream-50 dark:bg-ink-800 border-cream-200 dark:border-ink-700 text-ink-800 dark:text-cream-100">
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="compact">Compact (e.g., 1.2K)</SelectItem>
                <SelectItem value="scientific">Scientific (e.g., 1.23E+4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accounting-format" className="text-right text-ink-600 dark:text-cream-300">
              Accounting Format
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="accounting-format"
                checked={useAccountingFormat}
                onCheckedChange={setUseAccountingFormat}
                className="data-[state=checked]:bg-logo-blue data-[state=unchecked]:bg-cream-300 dark:data-[state=unchecked]:bg-ink-600"
              />
              <span className="ml-2 text-sm text-ink-600 dark:text-cream-300">
                {useAccountingFormat ? "Enabled (e.g., ($1.00))" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-logo-blue hover:bg-blue-700 text-white">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
