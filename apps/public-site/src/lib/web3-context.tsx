"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { TokenOffering } from "./types"

interface Web3ContextType {
  provider: any | null
  signer: any | null
  account: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  
  connect: () => Promise<void>
  disconnect: () => void
  
  getTokenContract: (tokenAddress: string) => any | null
  getTokenBalance: (tokenAddress: string, userAddress?: string) => Promise<string>
  purchaseTokens: (tokenOffering: TokenOffering, amount: number) => Promise<string>
  
  getGovernanceContract: () => any | null
  createProposal: (description: string, targets: string[], values: number[], calldatas: string[]) => Promise<string>
  vote: (proposalId: string, support: number) => Promise<string>
  
  formatEther: (value: string) => string
  parseEther: (value: string) => bigint
  getTransactionReceipt: (txHash: string) => Promise<any>
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  getTokenContract: () => null,
  getTokenBalance: async () => "0",
  purchaseTokens: async () => "",
  getGovernanceContract: () => null,
  createProposal: async () => "",
  vote: async () => "",
  formatEther: () => "0",
  parseEther: () => BigInt(0),
  getTransactionReceipt: async () => null,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<any | null>(null)
  const [signer, setSigner] = useState<any | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Mock implementation - replace with actual Web3 integration later
      setAccount("0x742d35cc6634c0532925a3b8d0002f8e8e51c0ae")
      setChainId(1)
      setIsConnected(true)
    } catch (err: any) {
      setError(err.message || "Failed to connect to wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
    setIsConnected(false)
    setError(null)
  }

  const getTokenContract = (tokenAddress: string): any | null => {
    // Mock implementation
    return null
  }

  const getTokenBalance = async (tokenAddress: string, userAddress?: string): Promise<string> => {
    // Mock implementation
    return "100.0"
  }

  const purchaseTokens = async (tokenOffering: TokenOffering, amount: number): Promise<string> => {
    if (!account) {
      throw new Error("Wallet not connected")
    }

    try {
      // Mock implementation
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
      return txHash
    } catch (err: any) {
      console.error("Error purchasing tokens:", err)
      throw new Error(err.message || "Failed to purchase tokens")
    }
  }

  const getGovernanceContract = (): any | null => {
    // Mock implementation
    return null
  }

  const createProposal = async (
    description: string, 
    targets: string[], 
    values: number[], 
    calldatas: string[]
  ): Promise<string> => {
    if (!account) {
      throw new Error("Wallet not connected")
    }

    try {
      // Mock implementation
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
      return txHash
    } catch (err: any) {
      console.error("Error creating proposal:", err)
      throw new Error(err.message || "Failed to create proposal")
    }
  }

  const vote = async (proposalId: string, support: number): Promise<string> => {
    if (!account) {
      throw new Error("Wallet not connected")
    }

    try {
      // Mock implementation
      const txHash = `0x${Math.random().toString(16).substring(2, 66)}`
      return txHash
    } catch (err: any) {
      console.error("Error voting:", err)
      throw new Error(err.message || "Failed to vote")
    }
  }

  const formatEther = (value: string): string => {
    // Mock implementation - would normally use ethers.formatEther
    try {
      return (parseFloat(value) / 1e18).toString()
    } catch (err) {
      return "0"
    }
  }

  const parseEther = (value: string): bigint => {
    // Mock implementation - would normally use ethers.parseEther
    try {
      return BigInt(Math.floor(parseFloat(value) * 1e18))
    } catch (err) {
      return BigInt(0)
    }
  }

  const getTransactionReceipt = async (txHash: string) => {
    // Mock implementation
    return {
      transactionHash: txHash,
      blockNumber: 123456,
      status: 1
    }
  }

  const contextValue: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    getTokenContract,
    getTokenBalance,
    purchaseTokens,
    getGovernanceContract,
    createProposal,
    vote,
    formatEther,
    parseEther,
    getTransactionReceipt,
  }

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3Context() {
  return useContext(Web3Context)
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}