"use client"

import { TrendingUp, DollarSign, Coins, Calendar } from "lucide-react"

export default function GoldSwimOverview() {
  // Key assumptions from Excel
  const initialInvestment = 3375000000 // €3.375B
  const spotPrice = 3586 // €3,586 per oz
  const sourcingCostIncrease = 1.977 // % per quarter
  const marginPerGram = 1.00 // €1.00/gram
  const operatingExpPercent = 25 // 25%
  const storageCostPercent = 0.05 // 0.05%
  const insuranceCostPercent = 0.025 // 0.025%
  const transactionBrokeragePercent = 0.1 // 0.1%

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <div className="pb-3 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-blue-50 to-cyan-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Initial Investment
              </h3>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="px-4 sm:px-6 pt-4 pb-4 sm:pb-6">
            <div className="text-2xl font-bold text-gray-900">
              €{(initialInvestment / 1000000000).toFixed(3)}B
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Allocable Investment Capital
            </p>
          </div>
        </div>

        <div className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <div className="pb-3 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Gold Spot Price
              </h3>
              <TrendingUp className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div className="px-4 sm:px-6 pt-4 pb-4 sm:pb-6">
            <div className="text-2xl font-bold text-gray-900">
              €{spotPrice.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Per Troy Ounce (1 oz)
            </p>
          </div>
        </div>

        <div className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <div className="pb-3 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-blue-50 to-cyan-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Margin per Gram
              </h3>
              <Coins className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="px-4 sm:px-6 pt-4 pb-4 sm:pb-6">
            <div className="text-2xl font-bold text-gray-900">
              €{marginPerGram.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Quarterly Sale Margin
            </p>
          </div>
        </div>

        <div className="border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
          <div className="pb-3 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Projection Period
              </h3>
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div className="px-4 sm:px-6 pt-4 pb-4 sm:pb-6">
            <div className="text-2xl font-bold text-gray-900">
              25+ Quarters
            </div>
            <p className="text-xs text-gray-600 mt-1">
              ~6.25 Years Forward
            </p>
          </div>
        </div>
      </div>

      {/* Key Assumptions */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Key Business Assumptions</h2>
          <p className="text-gray-600 mt-1">
            Core parameters driving the accumulated value projection model
          </p>
        </div>
        <div className="px-4 sm:px-6 pt-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Sourcing Cost Increase</span>
                <span className="text-lg font-bold text-emerald-700">{sourcingCostIncrease}%</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Quarterly increase in gold sourcing cost per gram</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
                <span className="text-lg font-bold text-blue-700">{operatingExpPercent}%</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Percentage of margin</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Transaction Brokerage</span>
                <span className="text-lg font-bold text-purple-700">{transactionBrokeragePercent}%</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Fee on investment balance per quarter</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Storage Costs</span>
                <span className="text-lg font-bold text-orange-700">{storageCostPercent}%</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Quarterly storage fee based on gold value</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Insurance Costs</span>
                <span className="text-lg font-bold text-pink-700">{insuranceCostPercent}%</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Quarterly insurance fee based on gold value</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Days per Quarter</span>
                <span className="text-lg font-bold text-teal-700">65</span>
              </div>
              <p className="text-xs text-gray-500 px-3">Standard quarterly period (last quarter: 53 days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Description */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">How the Model Works</h2>
          <p className="text-gray-600 mt-1">
            Understanding the accumulated value projection methodology
          </p>
        </div>
        <div className="px-4 sm:px-6 pt-6 pb-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Investment Allocation</h4>
                <p className="text-sm text-gray-600">
                  Beginning balance minus transaction brokerage (0.1%) determines the capital available for gold sourcing each quarter.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Gold Acquisition</h4>
                <p className="text-sm text-gray-600">
                  Available capital is used to purchase gold at the quarterly sourcing cost (which increases 1.977% per quarter).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Revenue Generation</h4>
                <p className="text-sm text-gray-600">
                  Gold grams are sold quarterly with a €1.00/gram margin multiplied by the number of days in the quarter and revenue grams held.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Operating Costs</h4>
                <p className="text-sm text-gray-600">
                  25% of quarterly revenue is deducted for operating expenses, leaving 75% as quarterly gains.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Reinvestment & Growth</h4>
                <p className="text-sm text-gray-600">
                  Quarterly gains are added back to the investment balance, allowing purchase of more gold in subsequent quarters, creating compound growth.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Value Assessment</h4>
                <p className="text-sm text-gray-600">
                  At quarter end, total gold holdings are valued at the expected market price, minus storage (0.05%) and insurance (0.025%) costs to calculate realizable gain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
