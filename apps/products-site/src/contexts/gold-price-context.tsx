import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface GoldPriceData {
  futuresPrice: number
  futuresUpdated: number
  spotAsk: number
  spotAskTimestamp: string
  eurExchangeRate: number
  eurExchangeRateTimestamp: string
}

interface GoldPriceContextType {
  futuresPrice: number | null
  futuresUpdated: number | null
  spotAsk: number | null
  spotAskTimestamp: string | null
  eurExchangeRate: number | null
  eurExchangeRateTimestamp: string | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const GoldPriceContext = createContext<GoldPriceContextType | undefined>(undefined)

export function GoldPriceProvider({ children }: { children: ReactNode }) {
  const [priceData, setPriceData] = useState<GoldPriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch both prices in parallel with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const [futuresResponse, spotAskResponse] = await Promise.all([
        fetch("https://mycow-gcf-766469853327.europe-west1.run.app", {
          signal: controller.signal,
          mode: 'cors'
        }).catch(err => {
          console.error("[Gold Price Context] Futures fetch error:", err)
          return null
        }),
        fetch("https://mycow-gsa-766469853327.europe-west1.run.app/", {
          signal: controller.signal,
          mode: 'cors'
        }).catch(err => {
          console.error("[Gold Price Context] Spot ask fetch error:", err)
          return null
        })
      ])

      clearTimeout(timeoutId)

      // Use fallback data if fetch failed
      let futuresData = { price: 2700.00, updated: Math.floor(Date.now() / 1000) }
      let spotAskData = {
        gold_spot: { rate: { ask: 4030.00 }, timestamp: new Date().toISOString() },
        exch_rate: { status: "fallback", base: "USD", currencies: { EUR: 1.2 }, timestamp: new Date().toISOString() }
      }

      if (futuresResponse && futuresResponse.ok) {
        try {
          futuresData = await futuresResponse.json()
        } catch (err) {
          console.error("[Gold Price Context] Error parsing futures data:", err)
        }
      } else {
        console.warn("[Gold Price Context] Using fallback futures price")
      }

      if (spotAskResponse && spotAskResponse.ok) {
        try {
          const spotAskText = await spotAskResponse.text()
          console.log("[Gold Price Context] Spot Ask Raw response:", spotAskText)

          if (spotAskText && spotAskText.trim() !== '') {
            spotAskData = JSON.parse(spotAskText)
            console.log("[Gold Price Context] Spot Ask Parsed data:", spotAskData)
          }
        } catch (err) {
          console.error("[Gold Price Context] Error parsing spot ask data:", err)
        }
      } else {
        console.warn("[Gold Price Context] Using fallback spot ask price")
      }

      // Combine both data sources
      const combinedData = {
        futuresPrice: futuresData.price ? Math.round(futuresData.price * 100) / 100 : futuresData.price,
        futuresUpdated: futuresData.updated,
        spotAsk: spotAskData.gold_spot?.rate?.ask || 4030.00,
        spotAskTimestamp: spotAskData.gold_spot?.timestamp || new Date().toISOString(),
        eurExchangeRate: spotAskData.exch_rate?.currencies?.EUR || 1.2,
        eurExchangeRateTimestamp: spotAskData.exch_rate?.timestamp || new Date().toISOString()
      }

      console.log("[Gold Price Context] Combined data:", combinedData)
      setPriceData(combinedData)

      // Only set error if both APIs failed
      if ((!futuresResponse || !futuresResponse.ok) && (!spotAskResponse || !spotAskResponse.ok)) {
        setError("Unable to fetch live prices. Using fallback data.")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch prices"
      setError(errorMessage)
      console.error("[Gold Price Context] Error fetching prices:", err)

      // Set fallback data even on error
      setPriceData({
        futuresPrice: 2700.00,
        futuresUpdated: Math.floor(Date.now() / 1000),
        spotAsk: 4030.00,
        spotAskTimestamp: new Date().toISOString(),
        eurExchangeRate: 1.2,
        eurExchangeRateTimestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [])

  return (
    <GoldPriceContext.Provider
      value={{
        futuresPrice: priceData?.futuresPrice || null,
        futuresUpdated: priceData?.futuresUpdated || null,
        spotAsk: priceData?.spotAsk || null,
        spotAskTimestamp: priceData?.spotAskTimestamp || null,
        eurExchangeRate: priceData?.eurExchangeRate || null,
        eurExchangeRateTimestamp: priceData?.eurExchangeRateTimestamp || null,
        loading,
        error,
        refetch: fetchPrices,
      }}
    >
      {children}
    </GoldPriceContext.Provider>
  )
}

export function useGoldPriceContext() {
  const context = useContext(GoldPriceContext)
  if (context === undefined) {
    throw new Error("useGoldPriceContext must be used within a GoldPriceProvider")
  }
  return context
}
