"use client"

import { useMemo } from "react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import { calculateAllQuarters, FinancialModelParams } from "@/lib/gold-swim-calculations"

interface QuarterlyGrowthChartProps {
  initialInvestment: number
  modelParams?: FinancialModelParams
}

export default function QuarterlyGrowthChart({ initialInvestment, modelParams }: QuarterlyGrowthChartProps) {
  const { spotAsk, eurExchangeRate } = useGoldPriceContext()

  // Convert USD to EUR with dynamic exchange rate
  const exchangeRate = eurExchangeRate || 1.2
  const spotPriceEUR = spotAsk ? spotAsk / exchangeRate : 3434.67

  // Calculate all quarters dynamically based on live price, user input, and model parameters
  const quarterlyData = useMemo(() => {
    return calculateAllQuarters(spotPriceEUR, initialInvestment, 25, modelParams)
  }, [spotPriceEUR, initialInvestment, modelParams])

  // Transform data for charts with appropriate units
  const chartData = useMemo(() => {
    return quarterlyData.map(row => ({
      quarter: row.quarter,
      investment: row.investmentBalanceBeginning / 1000000, // Convert to millions
      realizableGain: row.realizableGainEnd / 1000000, // Convert to millions (Gross Gain)
      totalGold: (row.revenueGrams + (row.investibleGainNetTax / row.sourcingCostEnd)) / 1000, // Convert to thousands of grams
      sourcingCost: row.sourcingCostBeginning, // Keep in euros (Cost/g column)
    }))
  }, [quarterlyData])
  return (
    <div className="space-y-6">
      {/* Investment & Realizable Gain Growth */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Investment Balance & Realizable Gain Growth</h2>
          <p className="text-gray-600 text-sm mt-1">
            Quarterly progression showing compound growth (values in millions €)
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'Millions €', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}M`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorInvestment)"
                name="Investment Balance"
              />
              <Area
                type="monotone"
                dataKey="realizableGain"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorGain)"
                name="Realizable Gain"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gold Accumulation */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Gold Accumulation Over Time</h2>
          <p className="text-gray-600 text-sm mt-1">
            Total gold holdings in thousands of grams
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'Thousand Grams', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}K grams`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalGold"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorGold)"
                name="Total Gold Holdings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sourcing Cost Trend */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Sourcing Cost per Gram Trend</h2>
          <p className="text-gray-600 text-sm mt-1">
            Cost increases at 1.977% per quarter
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'EUR', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sourcingCost"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                name="Sourcing Cost/Gram"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
