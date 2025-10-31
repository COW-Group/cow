"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { generateSiriZ31ExitScenarios, formatCurrency, type SiriZ31Params } from "../lib/gold-price-calculations"

interface SiriZ31ExitAnalysisProps {
  params: SiriZ31Params
}

export default function SiriZ31ExitAnalysis({ params }: SiriZ31ExitAnalysisProps) {
  const scenarios = generateSiriZ31ExitScenarios(
    params.entryPrice,
    params.numberOfContracts,
    params.investmentAmount
  )

  // Prepare chart data
  const chartData = scenarios.map(s => ({
    scenario: s.scenario.replace(/\([^)]*\)/, '').trim(), // Remove percentage from label
    profitLoss: s.profitLoss,
    roi: s.returnOnInvestment
  }))

  const getBarColor = (value: number) => {
    if (value < 0) return '#EF4444' // red-500
    if (value > 15) return '#10B981' // green-500
    return '#F59E0B' // amber-500
  }

  return (
    <div className="space-y-6">
      {/* Exit Scenarios Table */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Exit Price Scenarios</h2>
          <p className="text-gray-600 text-sm mt-1">
            Profit/Loss analysis across multiple price points
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Scenario</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Exit Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Price Change</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Profit/Loss</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">ROI</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === scenarios.length - 2 || index === scenarios.length - 1 ? 'bg-green-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {scenario.scenario}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700 font-mono">
                    {formatCurrency(scenario.exitPrice, 'USD')}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-mono ${
                    scenario.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {scenario.priceChangePercent >= 0 ? '+' : ''}{scenario.priceChangePercent.toFixed(2)}%
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${
                    scenario.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(scenario.profitLoss, 'USD', 0)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${
                    scenario.returnOnInvestment >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {scenario.returnOnInvestment >= 0 ? '+' : ''}{scenario.returnOnInvestment.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    {scenario.profitLoss > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600 inline" />
                    ) : scenario.profitLoss < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-600 inline" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit/Loss Visualization */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Return on Investment by Scenario</h2>
          <p className="text-gray-600 text-sm mt-1">
            Visual representation of potential outcomes
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="scenario"
                angle={-45}
                textAnchor="end"
                height={100}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
                labelFormatter={(label) => `Scenario: ${label}`}
              />
              <Legend />
              <Bar dataKey="roi" name="Return on Investment" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.roi)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Best Case */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">Best Case (+25%)</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatCurrency(scenarios[scenarios.length - 1].profitLoss, 'USD', 0)}
          </div>
          <div className="text-xs text-gray-600">
            {scenarios[scenarios.length - 1].returnOnInvestment.toFixed(2)}% ROI
          </div>
        </div>

        {/* Break Even */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Break Even (0%)</span>
          </div>
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {formatCurrency(scenarios[2].profitLoss, 'USD', 0)}
          </div>
          <div className="text-xs text-gray-600">
            {scenarios[2].returnOnInvestment.toFixed(2)}% ROI
          </div>
        </div>

        {/* Worst Case */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-gray-700">Worst Case (-10%)</span>
          </div>
          <div className="text-2xl font-bold text-red-600 mb-1">
            {formatCurrency(scenarios[0].profitLoss, 'USD', 0)}
          </div>
          <div className="text-xs text-gray-600">
            {scenarios[0].returnOnInvestment.toFixed(2)}% ROI
          </div>
        </div>
      </div>
    </div>
  )
}
