"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, TrendingUp, ArrowUpCircle, DollarSign, BarChart3, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard-header"
import { GoldPriceProvider } from "@/contexts/gold-price-context"

export default function MyGoldPage() {
  const [userEmail, setUserEmail] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push("/login")
      } else {
        setUserEmail(data.user.email || "unknown@mycow.io")
      }
    }
    checkUser()
  }, [router])

  if (!userEmail) {
    return null
  }

  return (
    <GoldPriceProvider>
      <div className="min-h-screen bg-white">
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
          {/* Dashboard Cards */}
          <div id="dashboard-cards" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* MyGold Dashboard Card */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-72 h-72 -mb-12 drop-shadow-2xl">
                <Image
                  src="/gold-token-coin.png"
                  alt="Gold Investment Visualization"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center mb-2">
                <h1 className="text-3xl font-light font-poppins bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  MyGold Dashboard
                </h1>
                <p className="text-gray-600 text-sm">
                  Comprehensive financial estimates for MyGold
                </p>
              </div>
              <ChevronDown className="h-12 w-12 text-blue-600 animate-pulse lg:hidden" />
              <ChevronRight className="h-12 w-12 text-blue-600 animate-pulse hidden lg:block" />
            </div>

            {/* Gold SWIM Card */}
            <div className="border-2 border-cyan-300 shadow-lg hover:shadow-2xl rounded-lg overflow-hidden bg-white flex flex-col transition-all duration-300">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <ArrowUpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Gold SWIM</h3>
                      <p className="text-cyan-100 mt-1 text-xs">
                        Accumulated Value Projection
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    New
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="h-[84px] mb-6 overflow-auto">
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Comprehensive quarterly projection model for gold retailing operations.
                    Track investment growth, sourcing costs, revenue margins, storage and insurance
                    costs, and realizable gains over multiple quarters with detailed analytics.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 h-[76px] flex flex-col justify-between border border-cyan-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                      <p className="text-xs font-medium text-gray-600">Allocation</p>
                    </div>
                    <p className="text-xs font-bold text-blue-700">25.00%</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 h-[76px] flex flex-col justify-between border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-3.5 w-3.5 text-cyan-600" />
                      <p className="text-xs font-medium text-gray-600">Asset</p>
                    </div>
                    <p className="text-xs font-bold text-cyan-700">Physical Gold + Trade Cycling</p>
                  </div>
                </div>

                <Link href="/dashboard/mygold/gold-swim" className="mt-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md">
                    Open Gold SWIM Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* SiriZ31 Card */}
            <div className="border-2 border-cyan-300 shadow-lg hover:shadow-2xl rounded-lg overflow-hidden bg-white flex flex-col transition-all duration-300">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">SiriZ31</h3>
                      <p className="text-cyan-100 mt-1 text-xs">
                        Gold Futures Trading Financials
                      </p>
                    </div>
                  </div>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="h-[84px] mb-6 overflow-auto">
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Advanced gold futures trading calculator with real-time CME and LBMA pricing.
                    Analyze margin requirements, exit prices, contract values, and projected gains
                    based on live market data and customizable assumptions.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 h-[76px] flex flex-col justify-between border border-cyan-200">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
                      <p className="text-xs font-medium text-gray-600">Allocation</p>
                    </div>
                    <p className="text-xs font-bold text-blue-700">8.33%</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 h-[76px] flex flex-col justify-between border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-3.5 w-3.5 text-cyan-600" />
                      <p className="text-xs font-medium text-gray-600">Asset</p>
                    </div>
                    <p className="text-xs font-bold text-cyan-700">Gold Futures</p>
                  </div>
                </div>

                <Link href="/dashboard/mygold/siriz31" className="mt-auto">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md">
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
