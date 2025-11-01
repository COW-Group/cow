"use client"

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
  const { futuresPrice, spotAsk, eurExchangeRate, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const goldSpotAsk = spotAsk || 4030.00
  const exchangeRate = eurExchangeRate || 1.2
  const { contractPriceEUR, totalContracts, contractSize, marginRequirement, eurUsdRate } = DEFAULT_PARAMETERS

  // Calculate derived values
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, exchangeRate)
  // Current Futures Price/Unit (1/100th Gram) - using new formula
  const futuresPricePerHundredthGramUSD = ((spotPriceUSD + 1.00) / (31.1034768 * 100)) + 0.10
  const futuresPricePerHundredthGramEUR = futuresPricePerHundredthGramUSD * exchangeRate // EUR value is exchangeRate x USD value
  const contractNotionalValue = futuresPricePerHundredthGramEUR * (31.1034768 * 100) // Contract Notional Value (Entry Price per oz)
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/5 for 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 5
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / exchangeRate
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
    <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700">Margin Calculation</h2>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6">
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
      </div>
    </div>
  )
}
