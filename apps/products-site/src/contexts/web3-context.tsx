import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface Web3ContextType {
  provider: any | null
  signer: any | null
  address: string | null
  chainId: number | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  error: string | null
  clearError: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null)
  const [signer, setSigner] = useState<any | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const connectWallet = useCallback(async () => {
    clearError()
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" })
        // Mock wallet connection for demo
        setAddress("0x1234567890abcdef1234567890abcdef12345678")
        setIsConnected(true)
        console.log("Mock wallet connected successfully")
      } catch (err: any) {
        console.error("Error connecting to wallet:", err)
        setError(`Failed to connect wallet: ${err.message || "Unknown error"}`)
      }
    } else {
      // Mock wallet for demo purposes
      setAddress("0x1234567890abcdef1234567890abcdef12345678")
      setIsConnected(true)
      console.log("Mock wallet connected (no MetaMask detected)")
    }
  }, [clearError])

  const disconnectWallet = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setChainId(null)
    setIsConnected(false)
    setError(null)
  }, [])

  const value = React.useMemo(
    () => ({
      provider,
      signer,
      address,
      chainId,
      isConnected,
      connectWallet,
      disconnectWallet,
      error,
      clearError,
    }),
    [provider, signer, address, chainId, isConnected, connectWallet, disconnectWallet, error, clearError],
  )

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}