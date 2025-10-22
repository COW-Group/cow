import { useState, useEffect } from "react"

interface GoldPriceData {
  price: number
  updated: number
}

export function useGoldPrice() {
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

      const data = await response.json()
      // Round spotPriceUSD to 2 decimal places
      const roundedData = {
        ...data,
        price: data.price ? Math.round(data.price * 100) / 100 : data.price
      }
      setPriceData(roundedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch price")
      console.error("Error fetching gold price:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  return {
    price: priceData?.price || null,
    updated: priceData?.updated || null,
    loading,
    error,
    refetch: fetchPrice,
  }
}
