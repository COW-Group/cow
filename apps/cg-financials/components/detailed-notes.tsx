"use client"

import { useGoldPriceContext } from "@/contexts/gold-price-context"

export default function DetailedNotes() {
  const { eurExchangeRate } = useGoldPriceContext()
  const exchangeRate = eurExchangeRate || 1.2

  return (
    <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700">Detailed Notes</h2>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <ol className="space-y-1.5 list-decimal list-inside text-sm text-gray-700">
            <li>Spot price converted to euros using current EUR/USD exchange rate = {exchangeRate.toFixed(4)}</li>
            <li>Contract Size 1/100th Gram; Total Units Offered: 2,250,000,000 units (723,400 Oz)</li>
            <li>Margin per 100 Oz Standard Contract [((Spot Ask Price / 31.1034768)+18.1)*31.1034768*100/3] / 1 Oz.</li>
            <li>
              Exit price, Formula: P<sub>exit</sub> = P₀ × (1 + r) <sup>t</sup> calculated using 8.16% annual compounding over Contract term (~6 years)
            </li>
            <li>Total gain calculated as exit value minus contract value</li>
            <li>ROI calculated as total gain divided by margin invested</li>
            <li>Annualized return (CAGR) estimated using ROI over Contract Term (~6 years)</li>
            <li>All values shown in euros; USD equivalents are calculated using 1 EUR = {exchangeRate.toFixed(4)} USD</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
