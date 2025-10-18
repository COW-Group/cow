import { useState, useEffect } from "react"

interface GoldSpotAskData {
  ask: number
  timestamp: string
}

export function useGoldSpotAsk() {
  const [spotData, setSpotData] = useState<GoldSpotAskData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpotAsk = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://mycow-gsa-766469853327.europe-west1.run.app/")

      if (!response.ok) {
        throw new Error("Failed to fetch gold spot ask data")
      }

      const rawText = await response.text()
      console.log("[Gold Spot Ask] Raw response:", rawText)

      // Check if response is empty
      if (!rawText || rawText.trim() === '') {
        throw new Error("Empty response from gold spot ask endpoint")
      }

      const data = JSON.parse(rawText)
      console.log("[Gold Spot Ask] Parsed data:", data)

      // Extract ask price and timestamp from the response
      // Response structure: { rate: { ask: number, ... }, timestamp: string, ... }
      const spotData = {
        ask: data.rate?.ask || 0,
        timestamp: data.timestamp || new Date().toISOString()
      }

      console.log("[Gold Spot Ask] Extracted data - Ask:", spotData.ask, "Timestamp:", spotData.timestamp)
      setSpotData(spotData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch gold spot ask")
      console.error("[Gold Spot Ask] Error fetching gold spot ask:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpotAsk()
  }, [])

  return {
    ask: spotData?.ask || null,
    timestamp: spotData?.timestamp || null,
    loading,
    error,
    refetch: fetchSpotAsk,
  }
}
