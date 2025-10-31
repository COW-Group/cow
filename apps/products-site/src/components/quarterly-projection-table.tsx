"use client"

import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { useGoldPriceContext } from "../contexts/gold-price-context"
import { calculateAllQuarters, type FinancialModelParams } from "../lib/gold-price-calculations"

type Currency = 'EUR' | 'USD'

interface QuarterlyProjectionTableProps {
  initialInvestment: number
  totalUnitSubscription: number
  modelParams?: FinancialModelParams
  selectedCurrency?: Currency
}

export default function QuarterlyProjectionTable({ initialInvestment, totalUnitSubscription, modelParams, selectedCurrency = 'EUR' }: QuarterlyProjectionTableProps) {
  const { spotAsk, eurExchangeRate, loading } = useGoldPriceContext()
  const [showAll, setShowAll] = useState(false)

  // Convert USD to EUR with dynamic exchange rate
  const exchangeRate = eurExchangeRate || 1.2
  const spotPriceEUR = spotAsk ? spotAsk / exchangeRate : 3434.67

  // Currency conversion helpers
  const toDisplayCurrency = (eurValue: number) => {
    return selectedCurrency === 'USD' ? eurValue * exchangeRate : eurValue
  }
  const getCurrencySymbol = () => selectedCurrency === 'USD' ? '$' : '€'

  // Calculate all quarters dynamically based on live price, user input, and model parameters
  const quarterlyData = useMemo(() => {
    return calculateAllQuarters(spotPriceEUR, initialInvestment, 25, modelParams)
  }, [spotPriceEUR, initialInvestment, modelParams])

  const displayData = showAll ? quarterlyData : quarterlyData.slice(0, 6)

  const formatCurrency = (eurValue: number) => {
    const value = toDisplayCurrency(eurValue)
    const symbol = getCurrencySymbol()
    if (value >= 1000000000) {
      return `${symbol}${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(2)}K`
    }
    return `${symbol}${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quarterly Projection Details</h2>
              <p className="text-gray-600 mt-1">
                Quarter-by-quarter breakdown of investment, costs, revenue, and gains
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-cyan-200">
                <div className="h-4 w-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="px-4 sm:px-6 py-6 border-b border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics at Quarter {quarterlyData.length}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4 border-2 border-emerald-200 shadow-sm">
              <p className="text-xs font-semibold text-emerald-700 mb-2">Initial Gold Investment</p>
              <p className="text-2xl font-bold text-emerald-800">
                {formatCurrency(initialInvestment)}
              </p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">25% of Total Unit Subscription</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-cyan-300 shadow-md">
              <p className="text-xs font-semibold text-blue-700 mb-2">Total Gold Accumulated</p>
              <p className="text-2xl font-bold text-blue-800">
                {quarterlyData[24] ? `${((quarterlyData[24].revenueGrams + (quarterlyData[24].investibleGainNetTax / quarterlyData[24].sourcingCostEnd)) / 1000000).toFixed(2)}M` : 0}
              </p>
              <p className="text-xs text-cyan-700 mt-1 font-medium">grams at Q25</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 border-2 border-blue-400 shadow-md">
              <p className="text-xs font-semibold text-cyan-700 mb-2">Cumulative ROI</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(quarterlyData[quarterlyData.length - 1].cumulativeROI)}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">Total gain from Q1 investment</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 border-2 border-cyan-400 shadow-md">
              <p className="text-xs font-semibold text-blue-800 mb-2">ROI %</p>
              <p className="text-2xl font-bold text-blue-900">
                {quarterlyData[24] ? Math.round((quarterlyData[24].cumulativeROI / quarterlyData[0].investmentBalanceBeginning) * 100).toLocaleString('en-US') : 0}%
              </p>
              <p className="text-xs text-cyan-700 mt-1 font-medium">Return on investment at Q25</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border-2 border-indigo-300 shadow-md">
              <p className="text-xs font-semibold text-indigo-700 mb-1">ROI % on Total Inv</p>
              <p className="text-xl font-bold text-indigo-800">
                {quarterlyData[24] ? Math.round((quarterlyData[24].cumulativeROI / totalUnitSubscription) * 100).toLocaleString('en-US') : 0}%
              </p>
              <p className="text-xs text-indigo-600 mt-1 font-medium">vs Desired Investment</p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
            <table className="text-xs border-collapse table-fixed" style={{ width: '3400px' }}>
              <thead>
                <tr className="bg-blue-600">
                  <th className="text-center py-2 px-2 font-semibold text-white sticky left-0 bg-gradient-to-r from-blue-600 to-cyan-500 w-[40px] z-10 shadow-md border-b border-b-gray-200">Q</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Investment</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Markup</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Inv. Net Markup</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Trans. Brokerage</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Inv. for Sourcing</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Cost/g</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Revenue Grams</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Margin</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">OpEx</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Gains</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Qtr End Cost/g</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">New Grams</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Total Gold</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Qtr End Market {getCurrencySymbol()}/g</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Expected Gross Value</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Storage Cost</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Insurance Cost</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Total Costs</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Gross Gain</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Tax</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Net Gain</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Net Grams</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Qtr End Total Grams</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Qtr End Value (Lower)</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Qtr End Total Value</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">Cumulative ROI</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">ROI %</th>
                  <th className="text-center py-2 px-2 font-semibold text-white border-l border-l-blue-500 w-[120px]">ROI % on Total Inv</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, idx) => (
                  <tr
                    key={row.quarter}
                    className={`border-b border-gray-200 hover:bg-blue-50/30 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-1.5 px-2 font-bold sticky left-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-[40px] z-10 shadow-sm text-center">Q{row.quarter}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.investmentBalanceBeginning)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{row.markup > 0 ? formatCurrency(row.markup) : '-'}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{row.investmentBalanceNetInitialMarkup > 0 ? formatCurrency(row.investmentBalanceNetInitialMarkup) : '-'}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.transactionBrokerage)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.investmentForSourcing)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{getCurrencySymbol()}{(toDisplayCurrency(row.sourcingCostBeginning)).toFixed(2)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatNumber(row.revenueGrams)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.margin)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.operatingExp)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.quarterlyGains)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{getCurrencySymbol()}{(toDisplayCurrency(row.sourcingCostEnd)).toFixed(2)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatNumber(row.newGramsPurchasable)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatNumber(row.totalGramsEnd)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{getCurrencySymbol()}{(toDisplayCurrency(row.marketPriceEnd)).toFixed(2)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.grossValueEnd)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.storageCost)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.insuranceCost)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.totalCosts)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.realizableGainEnd)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.taxAmount)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.investibleGainNetTax)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatNumber(row.investibleGainNetTax / row.sourcingCostEnd)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatNumber(row.revenueGrams + (row.investibleGainNetTax / row.sourcingCostEnd))}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{getCurrencySymbol()}{(toDisplayCurrency(Math.min(row.marketPriceEnd, row.sourcingCostEnd))).toFixed(2)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.qtrEndTotalValue)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{formatCurrency(row.cumulativeROI)}</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{((row.cumulativeROI / quarterlyData[0].investmentBalanceBeginning) * 100).toFixed(2)}%</td>
                    <td className="text-right py-1.5 px-2 text-gray-700 w-[120px]">{((row.cumulativeROI / totalUnitSubscription) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show More/Less Button */}
        <div className="px-4 sm:px-6 pb-4 flex justify-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 font-medium"
          >
            {showAll ? "Show Less Quarters" : `Show All ${quarterlyData.length} Quarters`}
          </Button>
        </div>
      </div>
    </div>
  )
}
