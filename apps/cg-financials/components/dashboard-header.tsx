"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, RefreshCw, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useGoldPriceContext } from "@/contexts/gold-price-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  userEmail: string
}

export default function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const { futuresPrice, futuresUpdated, spotAsk, spotAskTimestamp, eurExchangeRate, eurExchangeRateTimestamp, loading, error, refetch } = useGoldPriceContext()
  const [currentTime, setCurrentTime] = useState<string>("")

  // Use live spot ask price or fallback to default
  const goldSpotAsk = spotAsk || 4030.00

  // Update current time only on client side to prevent hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }))
    }

    // Set initial time
    updateTime()

    // Update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const formatDateTime = (timestamp: number) => {
    // Convert 10-digit epoch timestamp (seconds) to milliseconds
    const epochMs = timestamp * 1000
    const date = new Date(epochMs)

    // Validate the date
    if (isNaN(date.getTime())) {
      console.error("[Header] Invalid timestamp:", timestamp)
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

  const formatISODateTime = (isoTimestamp: string) => {
    try {
      const date = new Date(isoTimestamp)

      // Validate the date
      if (isNaN(date.getTime())) {
        console.error("[Header] Invalid ISO timestamp:", isoTimestamp)
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
    } catch (err) {
      console.error("[Header] Error formatting ISO timestamp:", err)
      return "Invalid Date"
    }
  }

  // Calculate Current Subscription Price per 1/100th Gram
  // Cash Margin Investment: ((Prevailing Gold Spot Ask -- 1 oz)/31.1034768)+18.1)*31.1034768*100/5 for 100 Oz
  const cashMarginPer100OzUSD = ((goldSpotAsk / 31.1034768) + 18.1) * 31.1034768 * 100 / 5
  const subscriptionPrice = ((cashMarginPer100OzUSD / 100) / (1 / 12)) / (31.1034768 * 100)

  return (
    <header className="sticky top-0 z-50 bg-blue-600 border-b border-blue-800 shadow-lg">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 max-w-7xl">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/mycow-logo.png"
                alt="MyCow.io"
                width={70}
                height={70}
                priority
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              {/* Mobile Price Display */}
              <div>
                <p className="text-[10px] text-blue-200">Unit Price</p>
                {loading ? (
                  <div className="h-5 w-20 bg-blue-500 animate-pulse rounded" />
                ) : (
                  <div className="text-base font-bold text-white">
                    ${subscriptionPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
            {/* Mobile Account Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-300 hover:bg-cyan-500 bg-cyan-400 text-white hover:text-white font-semibold shadow-md h-8 w-8 p-0"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-blue-600 font-semibold">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Image
              src="/mycow-logo.png"
              alt="MyCow.io"
              width={100}
              height={100}
              priority
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {/* Price Information */}
          <div className="flex items-center gap-6">
            {/* Current Unit Price */}
            <div className="text-right">
              <p className="text-xs font-medium text-cyan-100">Current Unit Price</p>
              {loading ? (
                <>
                  <div className="h-7 w-28 bg-blue-500 animate-pulse rounded mt-1" />
                  <div className="text-xs text-blue-200 mt-1">Loading...</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-white">
                    ${subscriptionPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-blue-200 font-bold">
                    2.25B Units in Offering
                  </div>
                </>
              )}
            </div>

            {/* CME Gold Futures Price */}
            <div className="text-right border-l-2 border-cyan-300 pl-6">
              <p className="text-xs font-medium text-cyan-100">CME Gold Futures Price (1 oz)</p>
              {error ? (
                <div className="text-red-300 text-xs">Error</div>
              ) : (
                <>
                  {loading ? (
                    <>
                      <div className="h-7 w-28 bg-blue-500 animate-pulse rounded mt-1" />
                      <div className="text-xs text-blue-200 mt-1">Loading...</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-white">
                        ${futuresPrice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {futuresUpdated && (
                        <div className="text-xs text-blue-200">
                          {formatDateTime(futuresUpdated)}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* LBMA Gold Spot Ask Price */}
            <div className="text-right border-l-2 border-cyan-300 pl-6">
              <p className="text-xs font-medium text-cyan-100">LBMA Gold Spot Ask Price (1 oz)</p>
              {error ? (
                <div className="text-red-300 text-xs">Error</div>
              ) : (
                <>
                  {loading ? (
                    <>
                      <div className="h-7 w-28 bg-blue-500 animate-pulse rounded mt-1" />
                      <div className="text-xs text-blue-200 mt-1">Loading...</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-white">
                        ${spotAsk?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}
                      </div>
                      {spotAskTimestamp && (
                        <div className="text-xs text-blue-200">
                          {formatISODateTime(spotAskTimestamp)}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* EUR Exchange Rate */}
            <div className="text-right border-l-2 border-cyan-300 pl-6">
              <p className="text-xs font-medium text-cyan-100">EUR/USD Exchange Rate</p>
              {error ? (
                <div className="text-red-300 text-xs">Error</div>
              ) : (
                <>
                  {loading ? (
                    <>
                      <div className="h-7 w-28 bg-blue-500 animate-pulse rounded mt-1" />
                      <div className="text-xs text-blue-200 mt-1">Loading...</div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-white">
                        {eurExchangeRate?.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 }) || "N/A"}
                      </div>
                      {eurExchangeRateTimestamp && (
                        <div className="text-xs text-blue-200">
                          {formatISODateTime(eurExchangeRateTimestamp)}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Refresh Button and Account Menu */}
            <div className="flex items-center gap-2 border-l-2 border-cyan-300 pl-6">
              <Button
                onClick={refetch}
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-cyan-500 bg-cyan-400 rounded-full shadow-md"
                disabled={loading}
                title="Refresh Prices"
              >
                <RefreshCw className={`h-4 w-4 text-white ${loading ? "animate-spin" : ""}`} />
              </Button>

              {/* Account Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-9 w-9 p-0 hover:bg-cyan-500 bg-cyan-400 rounded-full shadow-md"
                    title="Account"
                  >
                    <User className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Account</p>
                      <p className="text-xs leading-none text-blue-600 font-semibold">
                        {userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
