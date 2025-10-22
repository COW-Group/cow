"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface GoldPriceData {
  price: number
  updated: number
}

interface LiveGoldPriceProps {
  align?: "left" | "right"
}

export default function LiveGoldPrice({ align = "left" }: LiveGoldPriceProps) {
  const [priceData, setPriceData] = useState<GoldPriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrice = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://mycow-gcf-766469853327.europe-west1.run.app")

      if (!response.ok) {
        throw new Error("Failed to fetch price data")
      }

      const rawText = await response.text()
      console.log("[v0] Raw response text:", rawText)
      console.log("[v0] Response type:", typeof rawText)

      const data = JSON.parse(rawText)
      console.log("[v0] Parsed data:", data)
      console.log("[v0] Data type:", typeof data)
      console.log("[v0] Data keys:", Object.keys(data))
      console.log("[v0] Price value:", data.price)
      console.log("[v0] Update value:", data.updated)
      console.log("[v0] Epoch timestamp:", data.updated)

      setPriceData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch price")
      console.error("[v0] Error fetching gold price:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  const formatDateTime = (timestamp: number) => {
    // Convert 10-digit epoch timestamp (seconds) to milliseconds
    const epochMs = timestamp * 1000
    const date = new Date(epochMs)

    // Validate the date
    if (isNaN(date.getTime())) {
      console.error("[v0] Invalid timestamp:", timestamp)
      return "Invalid Date"
    }

    // Format to user's local time
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })
  }

  if (loading && !priceData) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm">Error: {error}</div>
        <Button onClick={fetchPrice} size="sm" variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  const alignmentClasses = align === "right" ? "justify-end text-right" : "justify-start text-left"

  return (
    <div className={`space-y-1 w-full ${align === "right" ? "flex flex-col items-end" : ""}`}>
      <div className={`flex items-center gap-2 ${alignmentClasses}`}>
        <span className="text-2xl font-bold text-blue-600">
          ${priceData?.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <Button
          onClick={fetchPrice}
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 hover:bg-blue-100"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 text-blue-600 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {priceData && (
        <div className={`text-xs text-gray-600 ${align === "right" ? "text-right" : "text-left"}`}>
          Updated: {formatDateTime(priceData.updated)}
        </div>
      )}
    </div>
  )
}
