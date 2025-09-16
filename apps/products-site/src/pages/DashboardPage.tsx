import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useAuthContext } from "../lib/auth-context"
import { useWeb3 } from "../contexts/web3-context"
import { ProductMenu } from "../components/product-menu"
import { CartDropdown } from "../components/cart-dropdown"
import { ArrowLeft, TrendingUp, TrendingDown, Coins, Plane, Wallet } from "lucide-react"
import { AuthModal } from "../components/auth-modal"

interface Holding {
  id: string
  tokenType: "founder" | "asset"
  tokenName: string
  amount: number
  currentValue: number
  performance: number
  createdAt: string
}

// Mock database service for demo
const mockDatabaseService = {
  async fetchHoldings(userId: string): Promise<Holding[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        tokenType: "asset" as const,
        tokenName: "AuSIRI",
        amount: 5000,
        currentValue: 5750,
        performance: 15.0,
        createdAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "2", 
        tokenType: "asset" as const,
        tokenName: "AuAERO",
        amount: 10000,
        currentValue: 12500,
        performance: 25.0,
        createdAt: "2024-02-20T00:00:00Z",
      }
    ]
  }
}

export default function DashboardPage() {
  const { auth, loading, signOut } = useAuthContext()
  const { isConnected, address, connectWallet, disconnectWallet, error, clearError } = useWeb3()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [holdings, setHoldings] = useState<Holding[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("Dashboard auth check:", { mounted, loading, isAuthenticated: auth.isAuthenticated, user: auth.user })
    // Add a small delay to ensure authentication state has fully loaded from localStorage
    const timeoutId = setTimeout(() => {
      if (mounted && !loading && !auth.isAuthenticated) {
        console.log("Redirecting to home - user not authenticated")
        navigate("/")
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [auth.isAuthenticated, loading, mounted, navigate])

  useEffect(() => {
    if (!mounted) return
    if (error) {
      console.error("Web3Context error details:", error)
      clearError()
    }
  }, [mounted, error, clearError])

  useEffect(() => {
    if (!mounted || !auth.isAuthenticated || !auth.user?.id) return
    const fetchHoldings = async () => {
      try {
        console.log("Fetching holdings for user:", auth.user?.id)
        const fetchedHoldings = await mockDatabaseService.fetchHoldings(auth.user!.id)
        setHoldings(fetchedHoldings)
        console.log("Holdings fetched successfully:", fetchedHoldings)
      } catch (err) {
        console.error("Failed to fetch holdings:", err)
      }
    }
    fetchHoldings()
  }, [mounted, auth.isAuthenticated, auth.user?.id])

  const handleConnectWallet = async () => {
    if (!mounted) return
    try {
      console.log("Attempting to connect wallet")
      await connectWallet()
      console.log("Wallet connected successfully")
    } catch (err: any) {
      console.error("Failed to connect wallet:", err)
      alert(`Failed to connect wallet: ${err.message}`)
    }
  }

  const handleDisconnectWallet = () => {
    try {
      console.log("Disconnecting wallet")
      disconnectWallet()
      console.log("Wallet disconnected successfully")
    } catch (err) {
      console.error("Failed to disconnect wallet:", err)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return null
  }

  const safeHoldings = Array.isArray(holdings) ? holdings : []
  const founderHoldings = safeHoldings.filter(holding => holding.tokenType === "founder")
  const assetHoldings = safeHoldings.filter(holding => holding.tokenType === "asset")
  const totalValue = safeHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
  const totalInvested = safeHoldings.reduce((sum, holding) => sum + holding.amount, 0)
  const totalGains = totalValue - totalInvested
  const totalPerformance = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 border border-gray-800">
          <Link to="/" className="text-xl font-bold">
            COW
          </Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <button onClick={signOut} className="text-sm text-gray-400 hover:text-white">
                  Sign Out
                </button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
            {isConnected ? (
              <>
                <Wallet className="h-5 w-5 text-gray-400" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={handleConnectWallet}
              >
                <Wallet className="h-5 w-5" />
                <div className="h-2 w-2 rounded-full ml-2 bg-red-500" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {auth.profile?.name || "User"}</h1>
            <p className="text-gray-400">Track your token performance and manage your portfolio</p>
            {isConnected && address && (
              <p className="text-sm text-gray-500 mt-2">
                Connected Wallet: <span className="font-mono text-gray-300">{address}</span>
              </p>
            )}
          </div>

          {/* Portfolio Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-2">Total Portfolio Value</h3>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-2">Total Invested</h3>
              <p className="text-2xl font-bold">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-2">Total Gains</h3>
              <p className={`text-2xl font-bold ${totalGains >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${totalGains.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-sm text-gray-400 mb-2">Performance</h3>
              <div className="flex items-center">
                {totalPerformance >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
                )}
                <p className={`text-2xl font-bold ${totalPerformance >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalPerformance.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Founder Holdings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Founder Holdings</h2>
            {founderHoldings.length === 0 ? (
              <div className="bg-gray-900/50 rounded-2xl p-12 border border-gray-800 text-center">
                <Coins className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Founder Holdings Yet</h3>
                <p className="text-gray-400 mb-6">Explore opportunities to acquire founder tokens</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {founderHoldings.map((holding) => (
                  <div key={holding.id} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Coins className="w-8 h-8 text-yellow-400 mr-3" />
                        <div>
                          <h3 className="text-xl font-bold">{holding.tokenName}</h3>
                          <p className="text-sm text-gray-400">
                            Purchased on {new Date(holding.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${holding.currentValue.toLocaleString()}</p>
                        <div className="flex items-center justify-end">
                          {holding.performance >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                          )}
                          <span
                            className={`text-sm font-semibold ${holding.performance >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {holding.performance.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Initial Investment</p>
                        <p className="font-semibold">${holding.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Current Value</p>
                        <p className="font-semibold">${holding.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Gains/Loss</p>
                        <p
                          className={`font-semibold ${(holding.currentValue - holding.amount) >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          ${(holding.currentValue - holding.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Asset Holdings */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Assets</h2>
            {assetHoldings.length === 0 ? (
              <div className="bg-gray-900/50 rounded-2xl p-12 border border-gray-800 text-center">
                <Coins className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Assets Yet</h3>
                <p className="text-gray-400 mb-6">Start building your portfolio with our performance tokens</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/ausiri">
                    <Button className="bg-yellow-400 text-black hover:bg-yellow-300">Explore AuSIRI</Button>
                  </Link>
                  <Link to="/auaero">
                    <Button className="bg-blue-400 text-black hover:bg-blue-300">Explore AuAERO</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {assetHoldings.map((holding) => (
                  <div key={holding.id} className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {holding.tokenName === "AuSIRI" ? (
                          <Coins className="w-8 h-8 text-yellow-400 mr-3" />
                        ) : (
                          <Plane className="w-8 h-8 text-blue-400 mr-3" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold">{holding.tokenName}</h3>
                          <p className="text-sm text-gray-400">
                            Purchased on {new Date(holding.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">${holding.currentValue.toLocaleString()}</p>
                        <div className="flex items-center justify-end">
                          {holding.performance >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                          )}
                          <span
                            className={`text-sm font-semibold ${holding.performance >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {holding.performance.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Initial Investment</p>
                        <p className="font-semibold">${holding.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Current Value</p>
                        <p className="font-semibold">${holding.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Gains/Loss</p>
                        <p
                          className={`font-semibold ${(holding.currentValue - holding.amount) >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          ${(holding.currentValue - holding.amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}