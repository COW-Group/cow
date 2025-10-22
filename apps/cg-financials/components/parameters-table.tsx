"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  calculateSpotPriceEUR,
  calculateContractPriceUSD,
  calculateTotalOunces,
  calculateExitPrice,
  formatEUR,
  formatUSD,
  formatPercentage,
  DEFAULT_PARAMETERS,
} from "@/lib/gold-calculations"

export default function ParametersTable() {
  const { futuresPrice, spotAsk, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const goldSpotAsk = spotAsk || 4030.00
  const { eurUsdRate, contractPriceEUR, totalContracts, contractSize, compoundingRate, period, marginRequirement } =
    DEFAULT_PARAMETERS

  // Calculate derived values
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, eurUsdRate)
  const contractPriceUSD = calculateContractPriceUSD(contractPriceEUR, eurUsdRate)
  const totalOunces = calculateTotalOunces(totalContracts, contractSize)
  const exitPriceEUR = calculateExitPrice(spotPriceEUR, compoundingRate, period)
  const exitPriceUSD = exitPriceEUR * eurUsdRate
  // Current Futures Price/Unit (1/100th Gram) - using new formula
  const futuresPricePerHundredthGramUSD = ((spotPriceUSD + 1.00) / (31.1034768 * 100)) + 0.10
  const futuresPricePerHundredthGramEUR = futuresPricePerHundredthGramUSD / 1.2 // EUR value is USD divided by 1.2
  // Contract Notional Value (P₀) = Current Futures Price × (1.03263^Contract Term)
  const contractNotionalValueUSD = futuresPricePerHundredthGramUSD * Math.pow(1.03263, period)
  const contractNotionalValueEUR = contractNotionalValueUSD / 1.2 // EUR value is USD divided by 1.2
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/3 for 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 3
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / 1.2 // EUR value is USD divided by 1.2
  const cashMarginPerHundredthGramUSD = cashMarginPer100OzUSD / (100 * 31.1034768 * 100)
  const cashMarginPerHundredthGramEUR = cashMarginPer100OzEUR / (100 * 31.1034768 * 100)
  // MyCow's Cash Margin to the Exchange: $19,980 per 100 Oz
  const mycowMarginPer100Oz = 19980
  const mycowMarginPerHundredthGram = mycowMarginPer100Oz / (100 * 31.1034768 * 100)
  const totalUnitsOffered = 2250000000 // 2.25B Units
  const totalUnitsOfferedInOz = totalUnitsOffered / (31.1034768 * 100)
  const ouncesPerStandardContract = 100
  const numberOfContracts = totalUnitsOfferedInOz / ouncesPerStandardContract
  console.log(spotPriceEUR, ',', spotPriceUSD)
  console.log(contractNotionalValueUSD, ",", Math.pow(1.03263, 6))

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700">Assumptions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0 sm:px-6 pb-4 sm:pb-6">
        <div className="overflow-x-auto px-4 sm:px-0">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-blue-100">Parameter</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-blue-100">Value (USD)</th>
                <th className="px-2 sm:px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 border border-blue-100">Value (EUR)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-blue-100">Contract Expiry</td>
                <td className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-blue-100" colSpan={2}>December 2031</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Contract Term</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{period.toFixed(2)} years (until Dec 26, 2031)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">EUR / USD exchange rate</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{eurUsdRate.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Annual compounding rate</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{formatPercentage(compoundingRate, 2)}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Prevailing Gold Spot Ask -- 1 oz</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(goldSpotAsk, 2)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(goldSpotAsk / eurUsdRate, 2)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Prevailing Gold Spot Ask -- 1/100th Gram</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(goldSpotAsk / 31.1034768 / 100, 6)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(goldSpotAsk / eurUsdRate / 31.1034768 / 100, 6)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Current Futures Price/Unit (1 oz)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(spotPriceUSD, 2)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(spotPriceEUR, 2)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Current Futures Price/Unit (1/100th Gram)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(futuresPricePerHundredthGramUSD, 6)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(futuresPricePerHundredthGramEUR, 6)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Contract Notional Value (Entry Price per 1/100th Gram) (P₀)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(contractNotionalValueUSD, 6)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(contractNotionalValueEUR, 6)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Cash Margin Investment per 100 Oz OR 1/100th Gram</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    <>
                      {formatUSD(cashMarginPer100OzUSD, 0)} per 100 oz <strong>OR</strong><br></br>{formatUSD(cashMarginPerHundredthGramUSD, 6)} per 1/100th of a gram
                    </>
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    <>
                      {formatEUR(cashMarginPer100OzEUR, 0)} per 100 oz <strong>OR</strong><br></br>{formatEUR(cashMarginPerHundredthGramEUR, 6)} per 1/100th of a gram
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">MyCow's Cash Margin to the Exchange</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {formatUSD(mycowMarginPer100Oz, 0)} per 100 oz <strong>OR</strong><br></br>{formatUSD(mycowMarginPerHundredthGram, 6)} per 1/100th of a gram
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {formatEUR(mycowMarginPer100Oz / eurUsdRate, 0)} per 100 oz <strong>OR</strong><br></br>{formatEUR(mycowMarginPerHundredthGram / eurUsdRate, 6)} per 1/100th of a gram
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Total Units Offered</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{totalUnitsOffered.toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Number of Ounces</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{totalUnitsOfferedInOz.toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Ounces Per Standard Contract</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{ouncesPerStandardContract}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Number of Contracts</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>{numberOfContracts.toLocaleString('en-US')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
console.log('Total Units: 2.25B')
