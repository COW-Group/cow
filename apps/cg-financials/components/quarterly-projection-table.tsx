"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Quarterly data from Excel (first 12 quarters for display)
const quarterlyData = [
  {
    quarter: 1,
    days: 65,
    investmentBalance: 3375000000,
    brokerage: 3375000,
    sourcingCost: 117.29,
    revenueGrams: 28746738,
    margin: 1868537999,
    opEx: 467134500,
    quarterlyGains: 1401403499,
    totalGrams: 40463572,
    marketPrice: 130.29,
    grossValue: 5271886318,
    storageCost: 2635943,
    insuranceCost: 1317972,
    realizableGain: 1397449584
  },
  {
    quarter: 2,
    days: 65,
    investmentBalance: 4542267198,
    brokerage: 4542267,
    sourcingCost: 119.61,
    revenueGrams: 37938945,
    margin: 2466031407,
    opEx: 616507852,
    quarterlyGains: 1849523555,
    totalGrams: 53102628,
    marketPrice: 132.86,
    grossValue: 7055374358,
    storageCost: 3527687,
    insuranceCost: 1763844,
    realizableGain: 1844232024
  },
  {
    quarter: 3,
    days: 65,
    investmentBalance: 6084379052,
    brokerage: 6084379,
    sourcingCost: 121.97,
    revenueGrams: 49834098,
    margin: 3239216353,
    opEx: 809804088,
    quarterlyGains: 2429412265,
    totalGrams: 69365968,
    marketPrice: 135.49,
    grossValue: 9398374129,
    storageCost: 4699187,
    insuranceCost: 2349594,
    realizableGain: 2422363484
  },
  {
    quarter: 4,
    days: 65,
    investmentBalance: 8112129711,
    brokerage: 8112130,
    sourcingCost: 124.38,
    revenueGrams: 65154286,
    margin: 4235028610,
    opEx: 1058757153,
    quarterlyGains: 3176271458,
    totalGrams: 90195651,
    marketPrice: 138.17,
    grossValue: 12462182495,
    storageCost: 6231091,
    insuranceCost: 3115546,
    realizableGain: 3166924821
  },
  {
    quarter: 5,
    days: 65,
    investmentBalance: 10766104617,
    brokerage: 10766105,
    sourcingCost: 126.84,
    revenueGrams: 84793872,
    margin: 5511601712,
    opEx: 1377900428,
    quarterlyGains: 4133701284,
    totalGrams: 116751700,
    marketPrice: 140.90,
    grossValue: 16450304880,
    storageCost: 8225152,
    insuranceCost: 4112576,
    realizableGain: 4121363555
  },
  {
    quarter: 6,
    days: 65,
    investmentBalance: 14223848764,
    brokerage: 14223849,
    sourcingCost: 129.35,
    revenueGrams: 109855238,
    margin: 7140590456,
    opEx: 1785147614,
    quarterlyGains: 5355442842,
    totalGrams: 150455731,
    marketPrice: 143.69,
    grossValue: 21618308330,
    storageCost: 10809154,
    insuranceCost: 5404577,
    realizableGain: 5339229111
  },
  {
    quarter: 7,
    days: 65,
    investmentBalance: 18708540197,
    brokerage: 18708540,
    sourcingCost: 131.91,
    revenueGrams: 141690689,
    margin: 9209894789,
    opEx: 2302473697,
    quarterlyGains: 6907421092,
    totalGrams: 193041774,
    marketPrice: 146.53,
    grossValue: 28285672100,
    storageCost: 14142836,
    insuranceCost: 7071418,
    realizableGain: 6886206837
  },
  {
    quarter: 8,
    days: 65,
    investmentBalance: 24499433030,
    brokerage: 24499433,
    sourcingCost: 134.51,
    revenueGrams: 181951321,
    margin: 11826835874,
    opEx: 2956708969,
    quarterlyGains: 8870126906,
    totalGrams: 246615132,
    marketPrice: 149.42,
    grossValue: 36849971339,
    storageCost: 18424986,
    insuranceCost: 9212493,
    realizableGain: 8842489427
  },
  {
    quarter: 9,
    days: 65,
    investmentBalance: 31944369682,
    brokerage: 31944370,
    sourcingCost: 137.17,
    revenueGrams: 232643686,
    margin: 15121839617,
    opEx: 3780459904,
    quarterlyGains: 11341379713,
    totalGrams: 313720210,
    marketPrice: 152.38,
    grossValue: 47803771622,
    storageCost: 23901886,
    insuranceCost: 11950943,
    realizableGain: 11305526884
  },
  {
    quarter: 10,
    days: 65,
    investmentBalance: 41474700199,
    brokerage: 41474700,
    sourcingCost: 139.88,
    revenueGrams: 296195170,
    margin: 19252686020,
    opEx: 4813171505,
    quarterlyGains: 14439514515,
    totalGrams: 397418259,
    marketPrice: 155.39,
    grossValue: 61754656983,
    storageCost: 30877328,
    insuranceCost: 15438664,
    realizableGain: 14393198523
  },
  {
    quarter: 11,
    days: 65,
    investmentBalance: 53622987200,
    brokerage: 53622987,
    sourcingCost: 142.65,
    revenueGrams: 375529007,
    margin: 24409385429,
    opEx: 6102346357,
    quarterlyGains: 18307039072,
    totalGrams: 501376008,
    marketPrice: 158.46,
    grossValue: 79448861363,
    storageCost: 39724431,
    insuranceCost: 19862215,
    realizableGain: 18247452426
  },
  {
    quarter: 12,
    days: 65,
    investmentBalance: 69043917960,
    brokerage: 69043918,
    sourcingCost: 145.47,
    revenueGrams: 474149919,
    margin: 30819744750,
    opEx: 7704936187,
    quarterlyGains: 23114808562,
    totalGrams: 629966200,
    marketPrice: 161.59,
    grossValue: 101799022824,
    storageCost: 50899511,
    insuranceCost: 25449756,
    realizableGain: 23038459295
  },
]

export default function QuarterlyProjectionTable() {
  const [showAll, setShowAll] = useState(false)
  const displayData = showAll ? quarterlyData : quarterlyData.slice(0, 6)

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `€${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(2)}M`
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(2)}K`
    }
    return `€${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quarterly Projection Details</CardTitle>
        <CardDescription>
          Quarter-by-quarter breakdown of investment, costs, revenue, and gains
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-2 bg-gray-50 font-semibold sticky left-0">Q</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Investment Balance</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Sourcing Cost/g</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Revenue Grams</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Quarterly Margin</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Operating Exp</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Quarterly Gains</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Total Gold (g)</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Market Price/g</th>
                <th className="text-right p-2 bg-gray-50 font-semibold">Realizable Gain</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row) => (
                <tr key={row.quarter} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="p-2 font-semibold sticky left-0 bg-white">{row.quarter}</td>
                  <td className="text-right p-2 font-mono text-xs">{formatCurrency(row.investmentBalance)}</td>
                  <td className="text-right p-2 font-mono text-xs">€{row.sourcingCost.toFixed(2)}</td>
                  <td className="text-right p-2 font-mono text-xs">{formatNumber(row.revenueGrams)}</td>
                  <td className="text-right p-2 font-mono text-xs text-green-700">{formatCurrency(row.margin)}</td>
                  <td className="text-right p-2 font-mono text-xs text-red-600">{formatCurrency(row.opEx)}</td>
                  <td className="text-right p-2 font-mono text-xs font-semibold text-blue-700">{formatCurrency(row.quarterlyGains)}</td>
                  <td className="text-right p-2 font-mono text-xs">{formatNumber(row.totalGrams)}</td>
                  <td className="text-right p-2 font-mono text-xs">€{row.marketPrice.toFixed(2)}</td>
                  <td className="text-right p-2 font-mono text-xs font-semibold text-emerald-700">{formatCurrency(row.realizableGain)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            {showAll ? "Show Less" : "Show All Quarters"}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-200">
          <div className="bg-emerald-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Final Realizable Gain (Q12)</p>
            <p className="text-xl font-bold text-emerald-700">
              {formatCurrency(quarterlyData[quarterlyData.length - 1].realizableGain)}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Total Gold Accumulated (Q12)</p>
            <p className="text-xl font-bold text-blue-700">
              {formatNumber(quarterlyData[quarterlyData.length - 1].totalGrams)} grams
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Growth Rate</p>
            <p className="text-xl font-bold text-purple-700">
              {(((quarterlyData[quarterlyData.length - 1].realizableGain / quarterlyData[0].investmentBalance) - 1) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
