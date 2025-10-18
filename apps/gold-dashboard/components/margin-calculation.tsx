"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  calculateInitialMarginPerContract,
  calculateTotalInitialMargin,
  calculateSpotPriceEUR,
  formatEUR,
  formatUSD,
  formatPercentage,
  DEFAULT_PARAMETERS,
} from "@/lib/gold-calculations"

export default function MarginCalculation() {
  const { futuresPrice, spotAsk, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const goldSpotAsk = spotAsk || 4030.00
  const { contractPriceEUR, totalContracts, contractSize, marginRequirement, eurUsdRate } = DEFAULT_PARAMETERS

  // Calculate derived values
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, eurUsdRate)
  // Current Futures Price/Unit (1/100th Gram) - using new formula
  const futuresPricePerHundredthGramUSD = ((spotPriceUSD + 1.00) / (31.1034768 * 100)) + 0.10
  const futuresPricePerHundredthGramEUR = futuresPricePerHundredthGramUSD * eurUsdRate // EUR value is 1.2x USD value
  const contractNotionalValue = futuresPricePerHundredthGramEUR * (31.1034768 * 100) // Contract Notional Value (Entry Price per oz)
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/3 for 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / 1.2 // EUR value is USD divided by 1.2
  const cashMarginPerHundredthGramUSD = cashMarginPer100OzUSD / (100 * 31.1034768 * 100)
  const cashMarginPerHundredthGramEUR = cashMarginPer100OzEUR / (100 * 31.1034768 * 100)
  const initialMarginPerUnit = cashMarginPerHundredthGramEUR
  const totalUnitsBought = 2250000000 // 2.25B Units
  const totalCashMargin = initialMarginPerUnit * totalUnitsBought
  const initialMarginPerContract = calculateInitialMarginPerContract(
    contractPriceEUR,
    contractSize,
    marginRequirement
  )
  const totalInitialMargin = calculateTotalInitialMargin(contractPriceEUR, totalContracts, contractSize, marginRequirement)

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-3xl font-bold text-blue-700">Margin Calculation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Description</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">
                  Formula / Calculation
                </th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (USD)</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (EUR)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Initial Margin per Unit (1/100th Gram)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  Cash Margin per 1/100th Gram
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(cashMarginPerHundredthGramUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(cashMarginPerHundredthGramEUR, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Total Units Bought</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  # of units
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>
                  {totalUnitsBought.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Total Cash Margin</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  (Initial Margin per Unit (1/100th Gram)) x (Total Units Bought)
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(cashMarginPerHundredthGramUSD * totalUnitsBought, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(totalCashMargin, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-600 italic">*rounded ≈ € 10,000,000 including sundry expenses.</p>
      </CardContent>
    </Card>
  )
}
