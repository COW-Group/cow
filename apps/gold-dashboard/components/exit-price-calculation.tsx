"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  calculateSpotPriceEUR,
  calculateExitPrice,
  formatEUR,
  formatUSD,
  formatPercentage,
  DEFAULT_PARAMETERS,
} from "@/lib/gold-calculations"

export default function ExitPriceCalculation() {
  const { futuresPrice, spotAsk, loading } = useGoldPriceContext()

  // Use live price or fallback to default
  const spotPriceUSD = futuresPrice || DEFAULT_PARAMETERS.spotPriceUSD
  const goldSpotAsk = spotAsk || 4030.00
  const { eurUsdRate, compoundingRate, period } = DEFAULT_PARAMETERS

  // Calculate derived values
  const spotPriceEUR = calculateSpotPriceEUR(spotPriceUSD, eurUsdRate)
  // Prevailing Gold Spot Ask -- 1/100th Gram (this is P₀ for exit price calculation)
  const goldSpotAskPerHundredthGramUSD = goldSpotAsk / 31.1034768 / 100
  const goldSpotAskPerHundredthGramEUR = goldSpotAsk / eurUsdRate / 31.1034768 / 100
  // Exit Price = Prevailing Gold Spot Ask (1/100th Gram) × (1 + r)^t
  const exitPriceEUR = calculateExitPrice(goldSpotAskPerHundredthGramEUR, compoundingRate, period)
  const exitPriceUSD = exitPriceEUR * eurUsdRate

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-3xl font-bold text-blue-700">Exit Price Calculation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Formula Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="mb-3">
              <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Formula</h3>
              <div className="bg-white rounded-md p-3 border border-blue-100 shadow-sm">
                <p className="text-base font-mono text-left text-gray-800">
                  P<sub className="text-base">exit</sub> = P₀ × (1 + r)<sup className="text-base">t</sup>
                </p>
              </div>
            </div>

            {/* Variables */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-3 mt-3">
              <p className="text-sm text-green-700 italic font-medium">
                where P₀ = (d), r = (i) and t is (g)
              </p>
            </div>

            {/* Note */}
            <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-2">
              <p className="text-xs text-amber-900">
                <strong>Note:</strong> Term period changes – computed as fractional years between the purchase date until the closing of Dec 2031, Contract
              </p>
            </div>
          </div>

          {/* Calculation Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-200">
            <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Calculation</h3>
            <div className="bg-white rounded-md p-3 border border-blue-100 shadow-sm">
              {loading ? (
                <p className="text-center text-sm text-gray-400">Loading...</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-base font-mono text-gray-800">
                    P<sub>exit</sub> = {formatEUR(goldSpotAskPerHundredthGramEUR, 6)} × ({1 + compoundingRate})<sup>{period}</sup> = {formatEUR(exitPriceEUR, 6)} ≈ {formatUSD(exitPriceUSD, 6)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
