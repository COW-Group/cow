"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  calculateSpotPriceEUR,
  calculateExitPrice,
  calculateTotalOunces,
  calculateContractValue,
  calculateExitValue,
  calculateTotalGain,
  calculateTotalInitialMargin,
  calculateROI,
  calculateCAGR,
  formatEUR,
  formatUSD,
  formatPercentage,
  DEFAULT_PARAMETERS,
} from "@/lib/gold-calculations"

export default function ContractValueGain() {
  const { futuresPrice, spotAsk, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const goldSpotAsk = spotAsk || 4030.00
  const { eurUsdRate, contractPriceEUR, totalContracts, contractSize, compoundingRate, period, marginRequirement } =
    DEFAULT_PARAMETERS

  // Calculate derived values
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, eurUsdRate)
  // Current Futures Price/Unit (1/100th Gram) - using new formula
  const futuresPricePerHundredthGramUSD = ((spotPriceUSD + 1.00) / (31.1034768 * 100)) + 0.10
  const futuresPricePerHundredthGramEUR = futuresPricePerHundredthGramUSD / 1.2 // EUR value is USD divided by 1.2
  // Contract Notional Value (P₀) = Current Futures Price × (1.03263^Contract Term)
  const contractNotionalValueUSD = futuresPricePerHundredthGramUSD * Math.pow(1.03263, period)
  const contractNotionalValueEUR = contractNotionalValueUSD / 1.2 // EUR value is USD divided by 1.2
  // Prevailing Gold Spot Ask -- 1/100th Gram (used for exit price calculation)
  const goldSpotAskPerHundredthGramUSD = goldSpotAsk / 31.1034768 / 100
  const goldSpotAskPerHundredthGramEUR = goldSpotAsk / eurUsdRate / 31.1034768 / 100
  // Exit Price = Prevailing Gold Spot Ask (1/100th Gram) × (1 + r)^t
  const exitPriceEUR = calculateExitPrice(goldSpotAskPerHundredthGramEUR, compoundingRate, period)
  const exitPriceUSD = exitPriceEUR * eurUsdRate
  const totalOunces = calculateTotalOunces(totalContracts, contractSize)
  const contractValue = calculateContractValue(contractPriceEUR, totalOunces)
  const exitValue = calculateExitValue(exitPriceEUR, totalOunces)
  const totalGain = exitPriceEUR - contractNotionalValueEUR // Total Gain = Exit Value - Contract Value
  const investorGain = totalGain * (2/3) // Investor Gain = 2/3 of Total Gain
  const totalUnitsBought = 1000
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/3 for 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / 1.2 // EUR value is USD divided by 1.2
  const cashMarginPerHundredthGramUSD = cashMarginPer100OzUSD / (100 * 31.1034768 * 100)
  const cashMarginPerHundredthGramEUR = cashMarginPer100OzEUR / (100 * 31.1034768 * 100)
  // MyCow's Cash Margin to the Exchange: $19,980 per 100 Oz
  const mycowMarginPer100Oz = 19980
  const mycowMarginPerHundredthGramUSD = mycowMarginPer100Oz / (100 * 31.1034768 * 100)
  const mycowMarginPerHundredthGramEUR = mycowMarginPer100Oz / eurUsdRate / (100 * 31.1034768 * 100)
  const totalCashMargin = mycowMarginPerHundredthGramEUR * totalUnitsBought
  const marginInvested = mycowMarginPerHundredthGramEUR // Using MyCow's Margin per Unit (1/100th Gram)
  const roi = (investorGain / marginInvested) * 100 // ROI as percentage (using Investor Gain)
  const marginInvestedUSD = mycowMarginPerHundredthGramUSD
  const investorGainUSD = investorGain * eurUsdRate
  const roiUSD = (investorGainUSD / marginInvestedUSD) * 100 // ROI in USD
  const roiEUR = (investorGain / marginInvested) * 100 // ROI in EUR
  const cagr = calculateCAGR(investorGain / marginInvested, period)

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-3xl font-bold text-blue-700">Contract Value and Gain</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Description</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Formula</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (USD)</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (EUR)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Contract Value</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  Contract Notional Value (Entry Price per 1/100th Gram) (P₀)
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(contractNotionalValueUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(contractNotionalValueEUR, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Exit Value</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  Exit price calculation (as provided above)
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(exitPriceUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(exitPriceEUR, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Total Gain</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  Exit Value − Contract Value
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(totalGain * eurUsdRate, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(totalGain, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Investor Gain [2/3 of Total]</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  (2/3) × Total Gain
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD((totalGain * 2/3) * eurUsdRate, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(totalGain * 2/3, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Margin Invested</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">MyCow's Cash Margin to the Exchange (1/100th Gram)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(marginInvestedUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(marginInvested, 6)}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold">ROI on Margin</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold">
                  Investor Gain / Margin Invested
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold text-blue-600">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    <>
                      {roiUSD.toFixed(2)}%
                    </>
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold text-blue-600">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    <>
                      {roiEUR.toFixed(2)}%
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
          <p className="text-base font-bold text-blue-700">
            Annualized Return (CAGR) ={" "}
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <>
                {"{(1 + ROI)^(1/" + period + ")} − 1 ≈ " + formatPercentage(cagr, 1) + " p.a."}
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
