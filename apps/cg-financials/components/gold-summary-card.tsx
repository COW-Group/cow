"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import { formatUSD, formatEUR } from "@/lib/gold-calculations"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function GoldSummaryCard() {
  const { spotAsk, loading } = useGoldPriceContext()

  // Use live spot ask price or fallback to default
  const goldSpotAsk = spotAsk || 4030.00

  // Calculate Cash Margin Investment per 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / 1.2 // EUR value is USD divided by 1.2

  // Breakdown of Utilization data
  const utilizationData = [
    { name: "Gold", value: 25.00, color: "#FFD700" },
    { name: "Futures", value: 8.33, color: "#3B82F6" },
    { name: "Cash", value: 10.00, color: "#10B981" },
    { name: "Other Commodities", value: 56.67, color: "#8B5CF6" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {/* Overview Card - Left */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700">SiriZ31</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Purpose Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Purpose</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {loading ? (
                  "This document presents the detailed financial summary for Gold Futures contracts of 1/100 Gram size, denominated in usd and euros, assuming Cash Margin Investment and 8.16% year on year compounding. These calculations are based on the COMEX/CME Gold Futures, Dec 2031 contract. A portion of one's subscription into MyCow Units is placed towards Gold Futures."
                ) : (
                  `This document presents the detailed financial summary for Gold Futures contracts of 1/100 Gram size, denominated in usd and euros, assuming ${formatUSD(cashMarginPer100OzUSD, 0)} (${formatEUR(cashMarginPer100OzEUR, 0)}) Cash Margin Investment per 100 Oz and 8.16% year on year compounding. These calculations are based on the COMEX/CME Gold Futures, Dec 2031 contract. A portion of one's subscription into MyCow Units is placed towards Gold Futures.`
                )}
              </p>
            </div>

            {/* Unit Description Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Unit Description</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                Each unit covers 25% in physical gold retailing; 8.33% as cash margin towards gold futures; 10% in cash reserves; and, remaining into other commodities viz., fractional plane seats, whiskey, water, dairy, rice farms, ready to eat meals, MRTS, and Real Estate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Breakdown Card - Right */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="pb-3 px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-blue-600">How is Unit Subscription Money Invested?</CardTitle>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 italic font-bold">Role of Gold Futures in Unit Asset Composition</p>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-lg border border-blue-100 overflow-x-auto">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm font-semibold text-gray-700">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {utilizationData.map((item, index) => (
                    <tr key={index} className="border-t border-blue-100">
                      <td className="px-2 sm:px-3 py-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs sm:text-sm text-gray-800">{item.name}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-right text-xs sm:text-sm text-gray-700 font-medium">{item.value.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
