"use client"

import { Header } from "@/components/header"
import { HeartPulse } from "lucide-react"
import { useState } from "react"

export default function HealthPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen">
      <Header isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HeartPulse className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-light zen-heading text-cream-25">Health & Well-being</h1>
          </div>
          <p className="text-lg text-muted-foreground zen-body max-w-2xl mx-auto text-cream-25">
            Cultivate your physical, mental, and emotional health.
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg p-6 border border-white/20 dark:border-black/20 text-cream-25">
            <h2 className="text-2xl font-semibold mb-4">Your Health Dashboard</h2>
            <p>Health tracking and insights coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
