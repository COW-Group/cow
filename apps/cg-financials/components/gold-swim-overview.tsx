"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Calculator, Hash, Scale, Settings, Info, Sparkles, DollarSign, Percent, Clock, CheckCircle2 } from "lucide-react"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PARAMETERS, FINANCIAL_MODELS, FinancialModelParams } from "@/lib/gold-swim-calculations"

type ModelType = 'conservative' | 'moderate' | 'optimistic' | 'custom'

interface GoldSwimOverviewProps {
  initialInvestment: number
  totalUnitSubscription: number
  defaultTotalUnitSubscription: number
  onTotalUnitSubscriptionChange: (value: number | null) => void
  selectedModel: ModelType
  modelParams: FinancialModelParams
  onModelChange: (model: ModelType) => void
  onParamChange: (paramName: keyof FinancialModelParams, value: number) => void
}

export default function GoldSwimOverview({
  initialInvestment,
  totalUnitSubscription,
  defaultTotalUnitSubscription,
  onTotalUnitSubscriptionChange,
  selectedModel,
  modelParams,
  onModelChange,
  onParamChange
}: GoldSwimOverviewProps) {
  const { spotAsk, eurExchangeRate, loading } = useGoldPriceContext()

  // Use live LBMA Gold Spot Ask price (convert USD to EUR with dynamic exchange rate)
  const exchangeRate = eurExchangeRate || 1.2
  const spotPriceEUR = spotAsk ? spotAsk / exchangeRate : 3434.67

  // Local state for input field
  const [inputValue, setInputValue] = useState<string>(totalUnitSubscription.toFixed(2))

  // Sync input value when totalUnitSubscription changes from external source
  useEffect(() => {
    setInputValue(totalUnitSubscription.toFixed(2))
  }, [totalUnitSubscription])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // Handle input blur - parse and update parent state
  const handleInputBlur = () => {
    const parsed = parseFloat(inputValue)
    if (!isNaN(parsed) && parsed > 0) {
      // If the value is different from default, set as custom
      if (Math.abs(parsed - defaultTotalUnitSubscription) > 0.01) {
        onTotalUnitSubscriptionChange(parsed)
      } else {
        // If it matches default, reset to null (use default)
        onTotalUnitSubscriptionChange(null)
      }
    } else {
      // Invalid input, reset to current value
      setInputValue(totalUnitSubscription.toFixed(2))
    }
  }

  // Number of Units = (Initial Investment Amount) / (((Live Gold Spot Ask Price) / 31.1034768 + 15) / (1 - Transaction Brokerage)) × 100
  const pricePerUnit = ((spotPriceEUR / 31.1034768) + 15) / (1 - modelParams.transactionBrokerage)
  const numberOfUnits = (initialInvestment / pricePerUnit) * 100

  // Number of Grams = (Number of Units) / 100
  const numberOfGrams = numberOfUnits / 100

  // Markup = (Number of Grams) × 13 / (1 - Transaction Brokerage)
  const markupAmount = (numberOfGrams * 13) / (1 - modelParams.transactionBrokerage)
  const sourcingCostIncrease = PARAMETERS.sourcingCostIncrease * 100
  const marginPerGram = modelParams.marginPerGram
  const operatingExpPercent = modelParams.operatingExpPercent * 100
  const storageCostPercent = modelParams.storageCostPercent * 100
  const insuranceCostPercent = modelParams.insuranceCostPercent * 100
  const transactionBrokeragePercent = modelParams.transactionBrokerage * 100
  const effectiveTaxRate = modelParams.effectiveTaxRate * 100

  return (
    <div className="space-y-8">
      {/* Investment Calculator Section */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-lg shadow-xl border border-blue-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Investment Calculator</h2>
              <p className="text-cyan-50 text-xs mt-0.5">Configure your parameters with live LBMA prices</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Total Unit Subscription - EDITABLE */}
            <div className="group">
              <Label htmlFor="totalUnitSubscription" className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                Enter your Desired Investment
              </Label>
              <div className="relative mt-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-lg border-2 border-blue-300 p-4 shadow-lg hover:shadow-xl transition-all">
                  {loading ? (
                    <div className="h-12 w-full bg-gradient-to-r from-blue-200 to-cyan-200 animate-pulse rounded-lg" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-gray-500">EUR</span>
                      <Input
                        id="totalUnitSubscription"
                        type="number"
                        step="0.01"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="text-2xl font-bold text-emerald-700 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Initial Investment - CALCULATED */}
            <div className="group">
              <Label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Physical Gold Investment Portion
              </Label>
              <div className="relative mt-3">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-lg border-2 border-emerald-300 p-4 shadow-lg hover:shadow-xl transition-all">
                  {loading ? (
                    <div className="h-12 w-full bg-gradient-to-r from-emerald-200 to-teal-200 animate-pulse rounded-lg" />
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500">EUR</span>
                        <div className="text-2xl font-bold text-emerald-700">
                          {initialInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <p className="text-xs text-emerald-600 font-medium">25% allocated to physical gold</p>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Formula: 25% × Desired Investment
              </p>
            </div>

            {/* Live Gold Price - LIVE DATA */}
            <div className="group">
              <Label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-600" />
                Live LBMA Spot Ask
              </Label>
              <div className="relative mt-3">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-lg border-2 border-cyan-300 p-4 shadow-lg hover:shadow-xl transition-all">
                  {loading ? (
                    <div className="h-12 w-full bg-gradient-to-r from-cyan-200 to-blue-200 animate-pulse rounded-lg" />
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-500">EUR</span>
                        <div className="text-2xl font-bold text-cyan-700">
                          {spotPriceEUR.toFixed(2)}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">/oz</span>
                      </div>
                      <div className="text-xs text-cyan-600 font-medium flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        Live market data
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Source: LBMA API (USD → EUR conversion)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Model Selector */}
      <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-lg shadow-xl border border-purple-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Financial Model</h2>
              <p className="text-pink-50 text-xs mt-0.5">Select a preset or customize parameters</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {(Object.keys(FINANCIAL_MODELS) as Array<keyof typeof FINANCIAL_MODELS>).map((modelKey) => {
              const model = FINANCIAL_MODELS[modelKey]
              const isSelected = selectedModel === modelKey
              return (
                <button
                  key={modelKey}
                  onClick={() => onModelChange(modelKey)}
                  className={`relative p-5 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                  <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                    {model.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{model.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Margin/gram:</span>
                      <span className="font-semibold">€{model.params.marginPerGram.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Operating Exp:</span>
                      <span className="font-semibold">{(model.params.operatingExpPercent * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax Rate:</span>
                      <span className="font-semibold">{(model.params.effectiveTaxRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedModel === 'custom' && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">Custom Model Active</span>
              </div>
              <p className="text-xs text-amber-700">You've customized the parameters below. Select a preset to reset.</p>
            </div>
          )}
        </div>
      </div>

      {/* Calculated Metrics Grid */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-lg shadow-xl border border-blue-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
              <Hash className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Derived Metrics</h2>
              <p className="text-emerald-50 text-xs mt-0.5">Calculated from your investment parameters</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-bold text-gray-700">Number of Units</span>
              </div>
              {loading ? (
                <div className="h-10 w-32 bg-blue-300 animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {numberOfUnits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border-2 border-amber-300 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-bold text-gray-700">Total Grams</span>
              </div>
              {loading ? (
                <div className="h-10 w-32 bg-amber-300 animate-pulse rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-700 mb-1">
                    {numberOfGrams.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-amber-600 font-medium">grams of gold (Quarter 1)</p>
                </>
              )}
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-lg p-5 border-2 border-rose-300 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-rose-600" />
                <span className="text-sm font-bold text-gray-700">Initial Markup</span>
              </div>
              {loading ? (
                <div className="h-10 w-32 bg-rose-300 animate-pulse rounded" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-rose-700 mb-1">
                    €{markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-rose-600 font-medium">Quarter 1 only</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Investment Parameters */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-lg shadow-xl border border-blue-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Investment Parameters</h2>
              <p className="text-cyan-50 text-xs mt-0.5">Core constants used in projections</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="marginPerGram" className="text-xs font-semibold text-gray-700 mb-2 block">Margin/Gram</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">€</span>
                <Input
                  id="marginPerGram"
                  type="number"
                  step="0.01"
                  value={marginPerGram}
                  onChange={(e) => onParamChange('marginPerGram', parseFloat(e.target.value) || 0)}
                  className="text-base font-bold text-cyan-700 border-cyan-300 focus:border-cyan-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Daily sale margin</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Days/Quarter</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-teal-600" />
                  <span className="text-base font-bold text-teal-700">65</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Q25: 53 days</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="operatingExpPercent" className="text-xs font-semibold text-gray-700 mb-2 block">Operating Exp</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="operatingExpPercent"
                  type="number"
                  step="1"
                  value={operatingExpPercent}
                  onChange={(e) => onParamChange('operatingExpPercent', (parseFloat(e.target.value) || 0) / 100)}
                  className="text-base font-bold text-blue-700 border-blue-300 focus:border-blue-500"
                />
                <Percent className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Of quarterly margin</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="transactionBrokerage" className="text-xs font-semibold text-gray-700 mb-2 block">Trans. Fee</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="transactionBrokerage"
                  type="number"
                  step="0.001"
                  value={transactionBrokeragePercent}
                  onChange={(e) => onParamChange('transactionBrokerage', (parseFloat(e.target.value) || 0) / 100)}
                  className="text-base font-bold text-purple-700 border-purple-300 focus:border-purple-500"
                />
                <Percent className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Brokerage fee</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="storageCostPercent" className="text-xs font-semibold text-gray-700 mb-2 block">Storage Cost</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="storageCostPercent"
                  type="number"
                  step="0.001"
                  value={storageCostPercent}
                  onChange={(e) => onParamChange('storageCostPercent', (parseFloat(e.target.value) || 0) / 100)}
                  className="text-base font-bold text-orange-700 border-orange-300 focus:border-orange-500"
                />
                <Percent className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Quarterly fee</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="insuranceCostPercent" className="text-xs font-semibold text-gray-700 mb-2 block">Insurance</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="insuranceCostPercent"
                  type="number"
                  step="0.001"
                  value={insuranceCostPercent}
                  onChange={(e) => onParamChange('insuranceCostPercent', (parseFloat(e.target.value) || 0) / 100)}
                  className="text-base font-bold text-pink-700 border-pink-300 focus:border-pink-500"
                />
                <Percent className="h-4 w-4 text-pink-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Quarterly premium</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-all">
              <Label htmlFor="effectiveTaxRate" className="text-xs font-semibold text-gray-700 mb-2 block">Tax Rate</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="effectiveTaxRate"
                  type="number"
                  step="0.01"
                  value={effectiveTaxRate}
                  onChange={(e) => onParamChange('effectiveTaxRate', (parseFloat(e.target.value) || 0) / 100)}
                  className="text-base font-bold text-indigo-700 border-indigo-300 focus:border-indigo-500"
                />
                <Percent className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Effective combined</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Cost Increase</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-base font-bold text-emerald-700">{sourcingCostIncrease.toFixed(3)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Per quarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Workflow */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700">How It Works</h2>
          <p className="text-gray-600 text-xs mt-1">Quarter-by-quarter projection methodology</p>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-4">
            {[
              {
                num: 1,
                title: "Investment Allocation",
                desc: "Beginning balance minus 0.1% brokerage determines capital for gold sourcing",
                bgColor: "bg-emerald-50",
                borderColor: "border-emerald-300",
                textColor: "text-emerald-700",
                numBg: "bg-emerald-600"
              },
              {
                num: 2,
                title: "Gold Acquisition",
                desc: "Available capital purchases gold at quarterly sourcing cost (increases 1.977% per quarter)",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-300",
                textColor: "text-blue-700",
                numBg: "bg-blue-600"
              },
              {
                num: 3,
                title: "Revenue Generation",
                desc: "Quarterly revenue = Revenue Grams × Days × €1.00/gram margin",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-300",
                textColor: "text-purple-700",
                numBg: "bg-purple-600"
              },
              {
                num: 4,
                title: "Operating Costs",
                desc: "A stated percentage of margin per gram is deducted for expenses, leaving the remainder as quarterly gains before storage and insurance costs",
                bgColor: "bg-orange-50",
                borderColor: "border-orange-300",
                textColor: "text-orange-700",
                numBg: "bg-orange-600"
              },
              {
                num: 5,
                title: "Holding Costs & Taxes",
                desc: "After operating expenses, a stated percentage of storage, insurance, and tax expenses are deducted to provide realizable gains.",
                bgColor: "bg-pink-50",
                borderColor: "border-pink-300",
                textColor: "text-pink-700",
                numBg: "bg-pink-600"
              },
              {
                num: 6,
                title: "Reinvestment",
                desc: "Net gains reinvested as next quarter's beginning balance for compound growth",
                bgColor: "bg-teal-50",
                borderColor: "border-teal-300",
                textColor: "text-teal-700",
                numBg: "bg-teal-600"
              }
            ].map((step) => (
              <div key={step.num} className={`flex gap-4 ${step.bgColor} rounded-lg p-4 border ${step.borderColor}`}>
                <div className={`flex-shrink-0 w-8 h-8 ${step.numBg} text-white rounded-lg flex items-center justify-center font-bold text-base`}>
                  {step.num}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${step.textColor} mb-1 text-sm`}>{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
