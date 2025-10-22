import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ChevronRight, TrendingUp, ArrowUpCircle, DollarSign, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { GoldPriceProvider } from "@/contexts/gold-price-context"

export default async function MyGoldPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  const userEmail = data.user.email || "unknown@mycow.io"

  return (
    <GoldPriceProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <DashboardHeader userEmail={userEmail} />

        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 max-w-7xl">
          <nav className="flex items-center text-xs sm:text-sm overflow-x-auto mb-4 sm:mb-6">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
            >
              MyCow
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 font-medium whitespace-nowrap">MyGold</span>
          </nav>
        </div>

        <div className="container mx-auto px-3 sm:px-4 max-w-7xl pb-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              MyGold Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Comprehensive gold trading and investment management tools
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gold SWIM Card */}
            <div className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl rounded-xl overflow-hidden bg-white">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <ArrowUpCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">Gold SWIM</h3>
                      <p className="text-blue-100 mt-1 text-sm">
                        Accumulated Value Projection
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    New
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Comprehensive quarterly projection model for gold retailing operations.
                  Track investment growth, sourcing costs, revenue margins, storage and insurance
                  costs, and realizable gains over multiple quarters with detailed analytics.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-gray-600">Allocation</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">25.00%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-medium text-gray-600">Asset</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">Physical Gold + Trade Cycling</p>
                  </div>
                </div>

                <Link href="/dashboard/mygold/gold-swim">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Open Gold SWIM Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* SiriZ31 Card */}
            <div className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl rounded-xl overflow-hidden bg-white">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">SiriZ31</h3>
                      <p className="text-blue-100 mt-1 text-sm">
                        Gold Futures Trading Financials
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Advanced gold futures trading calculator with real-time CME and LBMA pricing.
                  Analyze margin requirements, exit prices, contract values, and projected gains
                  based on live market data and customizable assumptions.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-gray-600">Allocation</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">8.33%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <p className="text-xs font-medium text-gray-600">Asset</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">Gold Futures</p>
                  </div>
                </div>

                <Link href="/dashboard/mygold/siriz31">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Open SiriZ31 Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 pb-4 text-center text-xs text-gray-600">
          © 2025 Cow Group of Companies. All rights reserved.
        </footer>
      </div>
    </GoldPriceProvider>
  )
}
