"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { GoldPriceProvider } from "@/contexts/gold-price-context"
import DashboardHeader from "@/components/dashboard-header"
import GoldSwimOverviewSection from "@/components/gold-swim-overview-section"
import GoldSwimOverview from "@/components/gold-swim-overview"
import QuarterlyProjectionTable from "@/components/quarterly-projection-table"
import QuarterlyGrowthChart from "@/components/quarterly-growth-chart"
import { FileSpreadsheet, TrendingUp, Table, BarChart3, ChevronRight, Menu, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GoldSwimContentProps {
  userEmail: string
}

type Section = "overview" | "assumptions" | "charts" | "table"

const sections = [
  { id: "overview" as Section, label: "Overview", icon: FileSpreadsheet },
  { id: "assumptions" as Section, label: "Assumptions", icon: Calculator },
  { id: "charts" as Section, label: "Growth Visualizations", icon: BarChart3 },
  { id: "table" as Section, label: "Quarterly Projection Table", icon: Table },
]

export default function GoldSwimContent({ userEmail }: GoldSwimContentProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <GoldSwimOverviewSection />
      case "assumptions":
        return <GoldSwimOverview />
      case "charts":
        return <QuarterlyGrowthChart />
      case "table":
        return <QuarterlyProjectionTable />
      default:
        return <GoldTradeCyclingOverviewSection />
    }
  }

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
            <Link
              href="/dashboard/mygold"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors whitespace-nowrap"
            >
              MyGold
            </Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700 font-medium whitespace-nowrap">Gold SWIM</span>
          </nav>
        </div>

        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          {/* Mobile Section Selector */}
          <div className="lg:hidden mb-4">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                <span>{sections.find(s => s.id === activeSection)?.label || "Menu"}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </Button>

            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-lg border border-blue-200 overflow-hidden">
                <ul className="divide-y divide-gray-100">
                  {sections.map((section) => {
                    const Icon = section.icon
                    return (
                      <li key={section.id}>
                        <button
                          onClick={() => {
                            setActiveSection(section.id)
                            setMobileMenuOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                            activeSection === section.id
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{section.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {/* Desktop Sidebar Navigation */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <nav className="bg-white rounded-lg shadow-lg border border-blue-200 overflow-hidden">
                {/* Title */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      MyCow.io
                    </h2>
                    <span className="text-sm font-semibold text-purple-200 bg-white/20 px-2.5 py-1 rounded-full">
                      Gold SWIM
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-100 tracking-wide uppercase">
                    Accumulated Value Projection
                  </p>
                </div>

                <div className="p-2.5 bg-gradient-to-b from-gray-50 to-white">
                  {/* Navigation Items */}
                  <ul className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon
                      const isActive = activeSection === section.id
                      return (
                        <li key={section.id}>
                          <button
                            onClick={() => setActiveSection(section.id)}
                            className={`group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20"
                                : "text-gray-700 hover:bg-white hover:shadow-sm bg-transparent"
                            }`}
                          >
                            <div className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                              isActive
                                ? "bg-white/20"
                                : "bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-200 group-hover:to-cyan-200"
                            }`}>
                              <Icon className={`h-4 w-4 ${
                                isActive ? "text-white" : "text-blue-600"
                              }`} />
                            </div>
                            <span className={`text-xs font-semibold flex-1 text-left ${
                              isActive ? "text-white" : "text-gray-800 group-hover:text-blue-600"
                            }`}>
                              {section.label}
                            </span>
                            {isActive && (
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            )}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </nav>

              {/* Featured Image */}
              <div className="mt-4 bg-white rounded-lg shadow-lg border border-blue-200 overflow-hidden">
                <div className="relative w-full h-48">
                  <Image
                    src="/bullion-close-up.png"
                    alt="Gold Bullion Close Up"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {renderSection()}
            </main>
          </div>

          <footer className="mt-6 pb-4 text-center text-xs text-gray-600">
            © 2025 Cow Group of Companies. All rights reserved.
          </footer>
        </div>
      </div>
    </GoldPriceProvider>
  )
}
