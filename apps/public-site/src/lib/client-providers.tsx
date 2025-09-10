"use client"

import { ReactNode } from "react"
import { AuthProvider } from "./auth-context"
import { Web3Provider } from "./web3-context"
import { HoldingsProvider } from "./holdings-context"

interface ClientProvidersProps {
  children: ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider>
      <Web3Provider>
        <HoldingsProvider>
          {children}
        </HoldingsProvider>
      </Web3Provider>
    </AuthProvider>
  )
}