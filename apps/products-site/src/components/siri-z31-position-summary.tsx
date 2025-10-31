"use client"

import { Shield, TrendingUp, DollarSign, BarChart3, AlertCircle, CheckCircle } from "lucide-react"
import { calculateSiriZ31Position, formatCurrency, type SiriZ31Params } from "../lib/gold-price-calculations"

interface SiriZ31PositionSummaryProps {
  params: SiriZ31Params
}

export default function SiriZ31PositionSummary({ params }: SiriZ31PositionSummaryProps) {
  const analysis = calculateSiriZ31Position(params)

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl font-bold text-gray-900">Position Summary</h2>
          <p className="text-gray-600 text-sm mt-1">
            Comprehensive overview of your futures position
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Entry Price */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">Entry Price</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(analysis.entryPrice, 'USD')}
              </div>
              <div className="text-xs text-gray-600 mt-1">per troy oz</div>
            </div>

            {/* Contracts */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-semibold text-gray-700">Contracts</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {analysis.numberOfContracts}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.totalOunces.toLocaleString()} oz total
              </div>
            </div>

            {/* Target Exit */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-xs font-semibold text-gray-700">Target Exit</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.targetExitPrice, 'USD')}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                +{analysis.priceChangePercent.toFixed(2)}% gain
              </div>
            </div>

            {/* Expected Return */}
            <div className={`border-2 rounded-lg p-4 ${
              analysis.returnOnInvestment >= 15
                ? 'bg-green-50 border-green-200'
                : analysis.returnOnInvestment >= 0
                ? 'bg-blue-50 border-blue-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${
                  analysis.returnOnInvestment >= 15
                    ? 'text-green-600'
                    : analysis.returnOnInvestment >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`} />
                <span className="text-xs font-semibold text-gray-700">Expected Return</span>
              </div>
              <div className={`text-2xl font-bold ${
                analysis.returnOnInvestment >= 15
                  ? 'text-green-600'
                  : analysis.returnOnInvestment >= 0
                  ? 'text-blue-600'
                  : 'text-red-600'
              }`}>
                {analysis.returnOnInvestment >= 0 ? '+' : ''}{analysis.returnOnInvestment.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {formatCurrency(analysis.profitLoss, 'USD', 0)} P/L
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Position Metrics */}
        <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <h3 className="text-lg font-bold text-gray-900">Position Metrics</h3>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Position Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(analysis.positionValue, 'USD', 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Investment Amount</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(params.investmentAmount, 'USD', 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Price Change</span>
                <span className={`text-sm font-semibold ${
                  analysis.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analysis.priceChange >= 0 ? '+' : ''}{formatCurrency(analysis.priceChange, 'USD')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Price Change %</span>
                <span className={`text-sm font-semibold ${
                  analysis.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analysis.priceChangePercent >= 0 ? '+' : ''}{analysis.priceChangePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700">Total Ounces</span>
                <span className="text-sm font-semibold text-gray-900">
                  {analysis.totalOunces.toLocaleString()} oz
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Margin & Risk */}
        <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
            <h3 className="text-lg font-bold text-gray-900">Margin & Risk</h3>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Initial Margin</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(analysis.initialMarginRequired, 'USD', 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Maintenance Margin</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(analysis.maintenanceMarginRequired, 'USD', 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Margin Utilization</span>
                <span className={`text-sm font-semibold ${
                  analysis.marginUtilization > 80
                    ? 'text-red-600'
                    : analysis.marginUtilization > 50
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {analysis.marginUtilization.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">Position Limit</span>
                <span className="text-sm font-semibold text-gray-900">
                  {analysis.numberOfContracts} / {analysis.maxContracts}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700">Compliance Status</span>
                <div className="flex items-center gap-2">
                  {analysis.isWithinLimits ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">Compliant</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-semibold text-red-600">Exceeds Limit</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h3 className="text-lg font-bold text-gray-900">Risk Analysis</h3>
        </div>
        <div className="px-4 sm:px-6 py-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Position Risk */}
            <div className={`border-2 rounded-lg p-4 ${
              !analysis.isWithinLimits
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Shield className={`w-5 h-5 ${
                  !analysis.isWithinLimits ? 'text-red-600' : 'text-green-600'
                }`} />
                <span className="text-xs font-semibold text-gray-700">Position Risk</span>
              </div>
              <div className={`text-lg font-bold ${
                !analysis.isWithinLimits ? 'text-red-600' : 'text-green-600'
              }`}>
                {!analysis.isWithinLimits ? 'High' : 'Normal'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {!analysis.isWithinLimits ? 'Exceeds position limits' : 'Within position limits'}
              </div>
            </div>

            {/* Margin Risk */}
            <div className={`border-2 rounded-lg p-4 ${
              analysis.marginUtilization > 80
                ? 'bg-red-50 border-red-200'
                : analysis.marginUtilization > 50
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className={`w-5 h-5 ${
                  analysis.marginUtilization > 80
                    ? 'text-red-600'
                    : analysis.marginUtilization > 50
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
                <span className="text-xs font-semibold text-gray-700">Margin Risk</span>
              </div>
              <div className={`text-lg font-bold ${
                analysis.marginUtilization > 80
                  ? 'text-red-600'
                  : analysis.marginUtilization > 50
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}>
                {analysis.marginUtilization > 80 ? 'High' : analysis.marginUtilization > 50 ? 'Moderate' : 'Low'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.marginUtilization.toFixed(1)}% utilization
              </div>
            </div>

            {/* Return Potential */}
            <div className={`border-2 rounded-lg p-4 ${
              analysis.returnOnInvestment >= 15
                ? 'bg-green-50 border-green-200'
                : analysis.returnOnInvestment >= 0
                ? 'bg-blue-50 border-blue-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className={`w-5 h-5 ${
                  analysis.returnOnInvestment >= 15
                    ? 'text-green-600'
                    : analysis.returnOnInvestment >= 0
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`} />
                <span className="text-xs font-semibold text-gray-700">Return Potential</span>
              </div>
              <div className={`text-lg font-bold ${
                analysis.returnOnInvestment >= 15
                  ? 'text-green-600'
                  : analysis.returnOnInvestment >= 0
                  ? 'text-blue-600'
                  : 'text-red-600'
              }`}>
                {analysis.returnOnInvestment >= 15 ? 'Excellent' : analysis.returnOnInvestment >= 0 ? 'Moderate' : 'Negative'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {analysis.returnOnInvestment >= 0 ? '+' : ''}{analysis.returnOnInvestment.toFixed(2)}% ROI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
