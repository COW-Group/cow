"use client"

import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Shield, TrendingUp, AlertCircle, Info } from "lucide-react"
import { useGoldPriceContext } from "../contexts/gold-price-context"
import { calculateSiriZ31Position, formatCurrency, SIRI_Z31_CONSTANTS, type SiriZ31Params } from "../lib/gold-price-calculations"

interface SiriZ31PositionCalculatorProps {
  params: SiriZ31Params
  onParamChange: (param: keyof SiriZ31Params, value: number) => void
  onReset: () => void
}

export default function SiriZ31PositionCalculator({
  params,
  onParamChange,
  onReset
}: SiriZ31PositionCalculatorProps) {
  const { spotAsk, loading } = useGoldPriceContext()

  // Calculate position analysis
  const analysis = calculateSiriZ31Position(params)

  // Use live spot price or fallback
  const currentSpotPrice = spotAsk || 2650.00

  const handleUseSpotPrice = () => {
    onParamChange('entryPrice', currentSpotPrice)
    // Set target exit price to +15% of spot
    onParamChange('targetExitPrice', currentSpotPrice * 1.15)
  }

  return (
    <div className="space-y-6">
      {/* Position Parameters Card */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Position Parameters</h2>
              <p className="text-gray-600 text-sm mt-1">
                Configure your futures position specifications
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="text-gray-600 hover:text-gray-900"
            >
              Reset
            </Button>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Entry Price */}
            <div className="space-y-2">
              <Label htmlFor="entryPrice" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Entry Price ($/oz)
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="entryPrice"
                  type="number"
                  value={params.entryPrice}
                  onChange={(e) => onParamChange('entryPrice', parseFloat(e.target.value) || 0)}
                  className="text-base"
                  min={0}
                  step={0.01}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseSpotPrice}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  Use Spot
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Current spot: {loading ? 'Loading...' : formatCurrency(currentSpotPrice, 'USD')}
              </p>
            </div>

            {/* Number of Contracts */}
            <div className="space-y-2">
              <Label htmlFor="contracts" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Number of Contracts
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </Label>
              <Input
                id="contracts"
                type="number"
                value={params.numberOfContracts}
                onChange={(e) => onParamChange('numberOfContracts', parseInt(e.target.value) || 0)}
                className="text-base"
                min={1}
                max={SIRI_Z31_CONSTANTS.POSITION_LIMIT}
                step={1}
              />
              <p className="text-xs text-gray-500">
                Max position limit: {SIRI_Z31_CONSTANTS.POSITION_LIMIT} contracts
                {!analysis.isWithinLimits && <span className="text-red-600 ml-1">⚠ Limit exceeded</span>}
              </p>
            </div>

            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="investment" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Investment Amount ($)
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </Label>
              <Input
                id="investment"
                type="number"
                value={params.investmentAmount}
                onChange={(e) => onParamChange('investmentAmount', parseFloat(e.target.value) || 0)}
                className="text-base"
                min={0}
                step={1000}
              />
              <p className="text-xs text-gray-500">
                Total capital available for trading
              </p>
            </div>

            {/* Target Exit Price */}
            <div className="space-y-2">
              <Label htmlFor="exitPrice" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Target Exit Price ($/oz)
                <Info className="w-3.5 h-3.5 text-gray-400" />
              </Label>
              <Input
                id="exitPrice"
                type="number"
                value={params.targetExitPrice}
                onChange={(e) => onParamChange('targetExitPrice', parseFloat(e.target.value) || 0)}
                className="text-base"
                min={0}
                step={0.01}
              />
              <p className="text-xs text-gray-500">
                Projected exit price for position
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Margin Requirements Card */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Margin Requirements</h2>
          <p className="text-gray-600 text-sm mt-1">
            Capital required to establish and maintain position
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Position Value */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">Position Value</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analysis.positionValue, 'USD', 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.totalOunces.toLocaleString()} oz total
              </div>
            </div>

            {/* Initial Margin */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-semibold text-gray-700">Initial Margin</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(analysis.initialMarginRequired, 'USD', 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.initialMarginPercent.toFixed(1)}% of position
              </div>
            </div>

            {/* Maintenance Margin */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-xs font-semibold text-gray-700">Maintenance Margin</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.maintenanceMarginRequired, 'USD', 0)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.maintenanceMarginPercent.toFixed(1)}% of position
              </div>
            </div>

            {/* Margin Utilization */}
            <div className={`bg-gradient-to-br border rounded-lg p-4 ${
              analysis.marginUtilization > 80
                ? 'from-red-50 to-rose-50 border-red-200'
                : analysis.marginUtilization > 50
                ? 'from-yellow-50 to-amber-50 border-yellow-200'
                : 'from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`w-5 h-5 ${
                  analysis.marginUtilization > 80
                    ? 'text-red-600'
                    : analysis.marginUtilization > 50
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
                <span className="text-xs font-semibold text-gray-700">Margin Utilization</span>
              </div>
              <div className={`text-2xl font-bold ${
                analysis.marginUtilization > 80
                  ? 'text-red-600'
                  : analysis.marginUtilization > 50
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.marginUtilization.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.marginUtilization > 80 ? 'High risk' : analysis.marginUtilization > 50 ? 'Moderate' : 'Conservative'}
              </div>
            </div>
          </div>

          {/* Position Limit Warning */}
          {!analysis.isWithinLimits && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800 mb-1">Position Limit Exceeded</h4>
                  <p className="text-xs text-red-700">
                    Number of contracts ({params.numberOfContracts}) exceeds maximum position limit of {analysis.maxContracts} contracts.
                    Reduce position size to comply with risk management protocols.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Margin Utilization Warning */}
          {analysis.marginUtilization > 80 && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 mb-1">High Margin Utilization</h4>
                  <p className="text-xs text-amber-700">
                    Margin utilization is above 80%. Consider increasing investment capital or reducing position size
                    to maintain adequate risk buffer and avoid potential margin calls.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
