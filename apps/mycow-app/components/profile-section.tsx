"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { tokens } from "@/lib/data"
import { User, Award, Settings, ArrowRight, LogOut } from "lucide-react" // Added LogOut icon
import { ZenCard } from "./zen-card"
import { getClientSupabaseClient } from "@/lib/supabase/client" // Import Supabase client
import { useRouter } from "next/navigation" // Import useRouter

export function ProfileSection() {
  const supabase = getClientSupabaseClient()
  const router = useRouter()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error.message)
      // Optionally display an error message to the user
    } else {
      router.push("/auth/signin") // Redirect to sign-in page after successful sign out
    }
  }

  return (
    <div className="space-y-6">
      <ZenCard>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-cream-100 dark:bg-ink-800 flex items-center justify-center overflow-hidden">
              <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-24 h-24 object-contain" />
            </div>
            <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-cream-200 dark:text-ink-700"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="#0000FF"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={2 * Math.PI * 60 * (1 - 0.65)}
              />
            </svg>
          </div>

          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl font-light text-ink-800 dark:text-cream-100">Level 3: Financial Navigator</h2>
            <p className="text-ink-600 dark:text-cream-400 mb-4">
              You're mastering the flow of wealth—excellent progress!
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="bg-logo-blue hover:bg-blue-700">Continue Journey</Button>
              <Button variant="outline" className="border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut} // Add sign out handler
                className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </ZenCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ZenCard>
          <h3 className="text-lg font-light text-ink-800 dark:text-cream-100 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-3 text-logo-blue" />
            Achievements
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-cream-100/50 dark:bg-ink-700/50 rounded-xl border border-cream-200/50 dark:border-ink-600/50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-logo-blue/10 flex items-center justify-center text-logo-blue mr-3">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-ink-800 dark:text-cream-100">Diversification Master</div>
                  <div className="text-sm text-ink-500 dark:text-cream-400">5+ asset classes</div>
                </div>
              </div>
              <Badge className="bg-logo-blue/10 text-logo-blue border-logo-blue/20">Earned</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-cream-100/50 dark:bg-ink-700/50 rounded-xl border border-cream-200/50 dark:border-ink-600/50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-logo-blue/10 flex items-center justify-center text-logo-blue mr-3">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-ink-800 dark:text-cream-100">Goal Setter</div>
                  <div className="text-sm text-ink-500 dark:text-cream-400">3 goals in progress</div>
                </div>
              </div>
              <Badge className="bg-logo-blue/10 text-logo-blue border-logo-blue/20">Earned</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-cream-100/50 dark:bg-ink-700/50 rounded-xl border border-cream-200/50 dark:border-ink-600/50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-cream-200 dark:bg-ink-600 flex items-center justify-center text-ink-500 dark:text-cream-400 mr-3">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-ink-800 dark:text-cream-100">Mission Contributor</div>
                  <div className="text-sm text-ink-500 dark:text-cream-400">Support 5 missions</div>
                </div>
              </div>
              <div className="text-sm text-ink-500 dark:text-cream-400">2/5</div>
            </div>
          </div>
        </ZenCard>

        <ZenCard>
          <h3 className="text-lg font-light text-ink-800 dark:text-cream-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-3 text-logo-blue" />
            Wallet Balances
          </h3>
          <div className="space-y-3">
            {tokens.slice(0, 4).map((token) => (
              <div
                key={token.symbol}
                className="flex justify-between items-center p-3 bg-cream-100/50 dark:bg-ink-700/50 rounded-xl border border-cream-200/50 dark:border-ink-600/50"
              >
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium mr-3"
                    style={{ background: getTokenColor(token.symbol) }}
                  >
                    {token.symbol.substring(0, 2)}
                  </div>
                  <span className="text-ink-800 dark:text-cream-100">{token.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-ink-800 dark:text-cream-100">{token.amount} tokens</div>
                  <div className="text-sm text-ink-500 dark:text-cream-400">${token.value.toLocaleString()}</div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300 mt-2"
            >
              View All Tokens
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </ZenCard>
      </div>
    </div>
  )
}

function getTokenColor(symbol: string): string {
  const colors: Record<string, string> = {
    AUGOLD: "#eab308", // amber-500
    AUSQFT: "#10b981", // emerald-500
    AUAERO: "#3b82f6", // blue-500
    AUSURA: "#8b5cf6", // purple-500
    AUTECH: "#ec4899", // pink-500
    AUBOND: "#6366f1", // indigo-500
  }

  return colors[symbol] || "#0000FF"
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{children}</span>
}
