"use client"

import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  calculateSpotPriceEUR,
  calculateExitPrice,
  calculateTotalOunces,
  calculateContractValue,
  calculateExitValue,
  calculateTotalGain,
  calculateROI,
  calculateCAGR,
  formatEUR,
  formatUSD,
  formatPercentage,
  DEFAULT_PARAMETERS,
} from "@/lib/gold-calculations"

export default function SummaryTable() {
  const { futuresPrice, spotAsk, eurExchangeRate, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const exchangeRate = eurExchangeRate || 1.2
  const { eurUsdRate, contractPriceEUR, totalContracts, contractSize, compoundingRate, period } = DEFAULT_PARAMETERS

  // Calculate derived values
  // Use live gold spot ask or fallback to default
  const liveSpotAsk = spotAsk || 4030.00
  const prevailingSpotAskUSD = liveSpotAsk / 31.1034768 / 100 // Prevailing Gold Spot Ask -- 1/100th Gram in USD
  const prevailingSpotAskEUR = liveSpotAsk / exchangeRate / 31.1034768 / 100 // Prevailing Gold Spot Ask -- 1/100th Gram in EUR
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, exchangeRate)
  // Current Futures Price/Unit (1/100th Gram) - using new formula
  const futuresPricePerHundredthGramUSD = ((spotPriceUSD + 1.00) / (31.1034768 * 100)) + 0.10
  const futuresPricePerHundredthGramEUR = futuresPricePerHundredthGramUSD / exchangeRate
  // Contract Notional Value (P₀) = Current Futures Price × (1.03263^Contract Term)
  const contractNotionalValueUSD = futuresPricePerHundredthGramUSD * Math.pow(1.03263, period)
  const contractNotionalValueEUR = contractNotionalValueUSD / exchangeRate
  const entryPriceEUR = contractNotionalValueEUR // Using Contract Notional Value (P₀)
  const entryPriceUSD = contractNotionalValueUSD // Using Contract Notional Value (P₀)
  const goldSpotAskPerHundredthGramEUR = prevailingSpotAskEUR // Use Prevailing Gold Spot Ask for exit price calculation
  const exitPriceEUR = calculateExitPrice(goldSpotAskPerHundredthGramEUR, compoundingRate, period) // Match Exit Price Calculation section
  const exitPriceUSD = exitPriceEUR * exchangeRate
  const totalOunces = calculateTotalOunces(totalContracts, contractSize)
  const totalUnitsBought = 2250000000 // 2.25B Units - Total Units Bought from Margin Calculation
  const contractValue = entryPriceEUR * totalUnitsBought // Entry Price per Unit × Units
  const contractValueUSD = entryPriceUSD * totalUnitsBought // Entry Price per Unit × Units
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/5 for 100 Oz
  const cashMarginPer100OzUSD = ((liveSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 5
  const cashMarginPer100OzEUR = cashMarginPer100OzUSD / exchangeRate
  const cashMarginPerHundredthGramUSD = cashMarginPer100OzUSD / (100 * 31.1034768 * 100)
  const cashMarginPerHundredthGramEUR = cashMarginPer100OzEUR / (100 * 31.1034768 * 100)
  const initialMarginPerUnit = cashMarginPerHundredthGramEUR
  const totalCashMargin = initialMarginPerUnit * totalUnitsBought // Total Cash Margin from Margin Calculation
  // MyCow's Cash Margin to the Exchange: $21,960 per 100 Oz
  const mycowMarginPer100OzUSD = 21960
  const mycowMarginPer100OzEUR = mycowMarginPer100OzUSD / exchangeRate
  // Number of Contracts calculation
  const totalUnitsOfferedInOz = totalUnitsBought / (31.1034768 * 100)
  const ouncesPerStandardContract = 100
  const numberOfContracts = totalUnitsOfferedInOz / ouncesPerStandardContract
  // Margin Invested = Cash Margin Investment per 1/100th Gram × Total Units Bought
  const marginInvestedUSD = cashMarginPerHundredthGramUSD * totalUnitsBought
  const marginInvested = marginInvestedUSD / exchangeRate // EUR value is USD divided by exchange rate
  const exitValue = exitPriceEUR * totalUnitsBought // Exit Price EUR × Total Units Bought
  const exitValueUSD = exitValue * exchangeRate
  const totalGain = exitValue - contractValue // Contract value end - Contract value start
  const totalGainUSD = totalGain * exchangeRate
  const investorShareUSD = totalGainUSD * (3/4) // Investor Share USD = 3/4 of Total Gain USD
  const investorShare = investorShareUSD / exchangeRate // Investor Share EUR = USD / exchange rate
  const cowGroupShareUSD = totalGainUSD * (1/4) // Cow Group Share USD = 1/4 of Total Gain USD
  const cowGroupShare = cowGroupShareUSD / exchangeRate // Cow Group Share EUR = USD / exchange rate
  const roi = investorShare / marginInvested // ROI = Investor Share (3/4) / Margin Invested
  const cagr = calculateCAGR(roi, period)

  // Format large numbers in millions
  const formatMillion = (value: number, currency: "EUR" | "USD") => {
    const millions = value / 1000000
    return currency === "EUR"
      ? `€ ${millions.toFixed(2)} M`
      : `$ ${millions.toFixed(2)} M`
  }

  return (
    <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700">Summary Table</h2>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Metric</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (USD)</th>
                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border border-blue-100">Value (EUR)</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Spot Ask Price Per Unit</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatUSD(prevailingSpotAskUSD, 6)
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    formatEUR(prevailingSpotAskEUR, 6)
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Entry Price per Unit (1/100th Gram)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(entryPriceUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(entryPriceEUR, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Exit price (Dec 2031)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(exitPriceUSD, 6)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(exitPriceEUR, 6)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Units</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100" colSpan={2}>
                  {totalUnitsBought.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Contract value start</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(contractValueUSD, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(contractValue, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Contract value end</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(exitValueUSD, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(exitValue, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Total Gain</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(totalGainUSD, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(totalGain, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Margin invested</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">{formatUSD(marginInvestedUSD, 0)}</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">{formatEUR(marginInvested, 0)}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Investor Share (3/4)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(investorShareUSD, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(investorShare, 0)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-sm border border-blue-100">Cow Group Share (1/4)</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatUSD(cowGroupShareUSD, 0)}
                </td>
                <td className="px-3 py-1.5 text-sm border border-blue-100">
                  {loading ? <span className="text-gray-400">Loading...</span> : formatEUR(cowGroupShare, 0)}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold">ROI on Margin</td>
                <td className="px-3 py-1.5 text-sm border border-blue-100 font-semibold text-blue-600" colSpan={2}>
                  {loading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    `${roi.toFixed(2)}× (~${formatPercentage(roi, 1)})`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
          <p className="text-base font-bold text-blue-700 text-left">
            Annualized Return (CAGR) ={" "}
            {loading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              `{(1 + ROI)^(1/${period.toFixed(2)})} − 1 ≈ ${formatPercentage(cagr, 1)} p.a.`
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
