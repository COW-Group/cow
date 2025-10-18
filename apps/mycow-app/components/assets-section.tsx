"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { tokens } from "@/lib/data"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { ZenCard } from "./zen-card"

export function AssetsSection() {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <ZenCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 flex items-center">
            <BarChart3 className="w-5 h-5 mr-3 text-logo-blue" />
            Token Portfolio
          </h2>
          <div className="text-right">
            <div className="text-2xl font-light text-logo-blue">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-ink-500 dark:text-cream-400">Total Portfolio Value</div>
          </div>
        </div>

        {/* Portfolio Allocation Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="text-lg font-light text-ink-800 dark:text-cream-100">Asset Allocation</h3>
            <div className="flex flex-wrap gap-2">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="flex-1 min-w-[120px] h-4 rounded-sm"
                  style={{
                    background: getTokenColor(token.symbol),
                    width: `${token.allocation}%`,
                  }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ background: getTokenColor(token.symbol) }} />
                  <span className="text-ink-600 dark:text-cream-300">
                    {token.symbol}: {token.allocation}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-light text-ink-800 dark:text-cream-100">Performance</h3>
            <div className="space-y-2">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between p-2 rounded-xl bg-cream-100/50 dark:bg-ink-700/50 cursor-pointer hover:bg-cream-200/50 dark:hover:bg-ink-600/50 transition-colors"
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <span className="text-ink-700 dark:text-cream-300">{token.name}</span>
                  <div className="flex items-center space-x-2">
                    {token.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-sage-500" />
                    ) : token.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : (
                      <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                    )}
                    <Badge
                      className={`${
                        token.change > 0
                          ? "bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      } border-none`}
                    >
                      {token.change > 0 ? "+" : ""}
                      {token.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ZenCard>

      {/* Token Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tokens.map((token) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: selectedToken ? (selectedToken === token.symbol ? 1 : 0.7) : 1,
              y: 0,
              scale: selectedToken === token.symbol ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <ZenCard
              className={`hover:shadow-lg transition-shadow ${
                selectedToken === token.symbol ? "ring-2 ring-logo-blue" : ""
              }`}
              onClick={() => setSelectedToken(token.symbol === selectedToken ? null : token.symbol)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ background: getTokenColor(token.symbol) }}
                    >
                      {token.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{token.symbol}</h3>
                      <p className="text-sm text-ink-500 dark:text-cream-400">{token.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-ink-500 dark:text-cream-400">Holdings</div>
                      <div className="text-lg font-medium text-ink-800 dark:text-cream-100">{token.amount} tokens</div>
                    </div>
                    <div>
                      <div className="text-sm text-ink-500 dark:text-cream-400">Value</div>
                      <div className="text-lg font-medium text-ink-800 dark:text-cream-100">
                        ${token.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${
                      token.change > 0
                        ? "bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    } border-none mb-2`}
                  >
                    {token.change > 0 ? "+" : ""}
                    {token.change}%
                  </Badge>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-logo-blue hover:bg-blue-700">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Trade
                    </Button>
                  </div>
                </div>
              </div>
            </ZenCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getTokenColor(symbol: string): string {
  const colors: Record<string, string> = {
    AUGOLD: "#eab308", // amber-500
    AUSQFT: "#10b981", // emerald-500
    AUAERO: "#3b82f6", // blue-500
    AUSURA: "#8b5cf6", // purple-500
    AUTECH: "#ec4899", // pink-500
    AUBOND: "#6366f1", // indigo-500
  }

  return colors[symbol] || "#0000FF"
}
