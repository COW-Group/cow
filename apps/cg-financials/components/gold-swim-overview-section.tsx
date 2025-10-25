"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import { formatUSD, formatEUR } from "@/lib/gold-calculations"

export default function GoldSwimOverviewSection() {
  const { spotAsk, eurExchangeRate, loading } = useGoldPriceContext()

  // Use live spot ask price or fallback to default
  const goldSpotAsk = spotAsk || 4030.00
  const exchangeRate = eurExchangeRate || 1.2

  // Calculate Cash Margin Investment per 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / exchangeRate

  // Breakdown of Utilization data
  const utilizationData = [
    { name: "Gold", value: 25.00, color: "#06B6D4" }, // cyan-500
    { name: "Futures", value: 8.33, color: "#2563EB" }, // blue-600
    { name: "Cash", value: 10.00, color: "#0EA5E9" }, // sky-500
    { name: "Other Commodities", value: 56.67, color: "#3B82F6" }, // blue-500
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overview Card - Left */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700">Gold SWIM</h2>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Purpose Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Purpose</h4>
              <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
                This document presents a detailed financial summary of MyCow's investment in Gold and retail trade cycling under the Gold SWIM program. The financials are based on the current LBMA Gold Spot Ask Price (1 oz). A portion of one's subscription into MyCow Units is placed towards Physical Investment-Grade Gold Retail Cycling.
              </p>
            </div>

            {/* Unit Description Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Unit Description</h4>
              <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
                Each unit covers 25% in physical gold retailing; 8.33% as cash margin towards gold futures; 10% in cash reserves; and, remaining into other commodities viz., fractional plane seats, whiskey, water, dairy, rice farms, ready to eat meals, MRTS, and Real Estate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Breakdown Card - Right */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-100">
          <h2 className="text-base sm:text-lg font-bold text-blue-600">How is Unit Subscription Money Invested?</h2>
          <p className="text-xs text-gray-600 mt-1 italic font-bold">Role of Gold Trade Cycling in Unit Asset Composition</p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Pie Chart */}
            <div className="w-full h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-lg border border-blue-100 overflow-x-auto">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-gray-700">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {utilizationData.map((item, index) => (
                    <tr key={index} className="border-t border-blue-100">
                      <td className="px-2 sm:px-3 py-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[10px] sm:text-xs text-gray-800">{item.name}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs text-gray-700 font-medium">{item.value.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
