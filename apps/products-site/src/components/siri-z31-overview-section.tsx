"use client"

import { Shield, TrendingUp, DollarSign } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function SiriZ31OverviewSection() {
  // Strategy allocation breakdown
  const strategyData = [
    { name: "Futures Positions", value: 40.00, color: "#2563EB" }, // blue-600
    { name: "Margin Reserves", value: 20.00, color: "#06B6D4" }, // cyan-500
    { name: "Hedging Strategy", value: 25.00, color: "#0EA5E9" }, // sky-500
    { name: "Risk Management", value: 15.00, color: "#3B82F6" }, // blue-500
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overview Card - Left */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700">SIRI Z31</h2>
          <p className="text-xs text-blue-600 mt-1">Systematic Investment Return Initiative</p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Purpose Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Purpose</h4>
              <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
                SIRI Z31 provides systematic exposure to gold futures markets through a disciplined positioning strategy.
                The program utilizes professional-grade margin management, exit price optimization, and comprehensive risk controls
                to target 15-25% annual returns while maintaining strict capital preservation protocols.
              </p>
            </div>

            {/* Strategy Description Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <h4 className="text-xs sm:text-sm font-bold text-blue-700 mb-2">Trading Strategy</h4>
              <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed">
                Each position is managed with precision margin calculation, systematic entry/exit timing, and multi-scenario
                profit/loss modeling. The strategy combines futures contracts (100 oz each) with comprehensive hedging mechanisms,
                maintaining disciplined position limits and continuous risk monitoring.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700">Margin Req.</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-blue-600">8%</div>
                <div className="text-[9px] sm:text-[10px] text-gray-500">Initial</div>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-700">Target Return</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-600">15-25%</div>
                <div className="text-[9px] sm:text-[10px] text-gray-500">Annual</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Allocation Card - Right */}
      <div className="border-2 border-blue-200 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-100">
          <h2 className="text-base sm:text-lg font-bold text-blue-600">Strategy Capital Allocation</h2>
          <p className="text-xs text-gray-600 mt-1 italic font-bold">How Investment Capital is Deployed</p>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Pie Chart */}
            <div className="w-full h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={strategyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {strategyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white rounded-lg border border-blue-100 overflow-x-auto">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs font-semibold text-gray-700">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyData.map((item, index) => (
                    <tr key={index} className="border-t border-blue-100">
                      <td className="px-2 sm:px-3 py-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[10px] sm:text-xs text-gray-800">{item.name}</span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 text-right text-[10px] sm:text-xs text-gray-700 font-medium">{item.value.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Risk Disclosure */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[10px] sm:text-xs font-bold text-amber-800 mb-1">Risk Disclosure</h5>
                  <p className="text-[9px] sm:text-[10px] text-amber-700 leading-relaxed">
                    Futures trading involves substantial risk of loss. Past performance does not guarantee future results.
                    Position limits and margin requirements are enforced. This calculator is for illustrative purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
