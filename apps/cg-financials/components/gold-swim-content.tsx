"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { GoldPriceProvider, useGoldPriceContext } from "@/contexts/gold-price-context"
import DashboardHeader from "@/components/dashboard-header"
import GoldSwimOverviewSection from "@/components/gold-swim-overview-section"
import GoldSwimOverview from "@/components/gold-swim-overview"
import QuarterlyProjectionTable from "@/components/quarterly-projection-table"
import QuarterlyGrowthChart from "@/components/quarterly-growth-chart"
import { FileSpreadsheet, TrendingUp, Table, BarChart3, ChevronRight, Menu, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PARAMETERS, FINANCIAL_MODELS, FinancialModelParams } from "@/lib/gold-swim-calculations"

interface GoldSwimContentProps {
  userEmail: string
}

type Section = "overview" | "assumptions" | "charts" | "table"

const sections = [
  { id: "overview" as Section, label: "Overview", icon: FileSpreadsheet },
  { id: "assumptions" as Section, label: "Assumptions", icon: Calculator },
  { id: "table" as Section, label: "Quarterly Projection Table", icon: Table },
  { id: "charts" as Section, label: "Growth Visualizations", icon: BarChart3 },
]

function GoldSwimContentInner({ userEmail }: GoldSwimContentProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { spotAsk, eurExchangeRate } = useGoldPriceContext()

  // Currency State
  type Currency = 'EUR' | 'USD'
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR')

  // Financial Model State
  type ModelType = 'conservative' | 'moderate' | 'optimistic' | 'custom'
  const [selectedModel, setSelectedModel] = useState<ModelType>('moderate')
  const [modelParams, setModelParams] = useState<FinancialModelParams>(FINANCIAL_MODELS.moderate.params)

  // Calculate default Total Unit Subscription
  const exchangeRate = eurExchangeRate || 1.2
  const spotPriceEUR = spotAsk ? spotAsk / exchangeRate : 3434.67
  const defaultTotalUnitSubscription = (((spotPriceEUR) / 31.1034768 + 15) / (1 - modelParams.transactionBrokerage)) * 1000

  // State for custom Total Unit Subscription (null means use default)
  const [customTotalUnitSubscription, setCustomTotalUnitSubscription] = useState<number | null>(null)

  // Use custom value if set, otherwise use calculated default
  const totalUnitSubscription = customTotalUnitSubscription ?? defaultTotalUnitSubscription

  // Initial Investment Amount = 25% × Total Unit Subscription
  const initialInvestment = totalUnitSubscription * 0.25

  // Handle model selection
  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model)
    if (model !== 'custom') {
      setModelParams(FINANCIAL_MODELS[model].params)
    }
  }

  // Handle individual parameter changes
  const handleParamChange = (paramName: keyof FinancialModelParams, value: number) => {
    setSelectedModel('custom')
    setModelParams(prev => ({ ...prev, [paramName]: value }))
  }

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <GoldSwimOverviewSection />
      case "assumptions":
        return (
          <GoldSwimOverview
            initialInvestment={initialInvestment}
            totalUnitSubscription={totalUnitSubscription}
            defaultTotalUnitSubscription={defaultTotalUnitSubscription}
            onTotalUnitSubscriptionChange={setCustomTotalUnitSubscription}
            selectedModel={selectedModel}
            modelParams={modelParams}
            onModelChange={handleModelChange}
            onParamChange={handleParamChange}
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />
        )
      case "charts":
        return <QuarterlyGrowthChart initialInvestment={initialInvestment} modelParams={modelParams} />
      case "table":
        return <QuarterlyProjectionTable initialInvestment={initialInvestment} totalUnitSubscription={totalUnitSubscription} modelParams={modelParams} selectedCurrency={selectedCurrency} />
      default:
        return <GoldSwimOverviewSection />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader userEmail={userEmail} />

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 max-w-7xl">
        <nav className="flex items-center text-xs sm:text-sm overflow-x-auto mb-4 sm:mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-cyan-500 hover:underline transition-colors whitespace-nowrap font-medium"
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
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-between shadow-md"
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
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-normal">{section.label}</span>
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
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    MyCow.io
                  </h2>
                  <span className="text-sm font-semibold text-white bg-white/25 px-2.5 py-1 rounded-full shadow-sm">
                    Gold SWIM
                  </span>
                </div>
                <p className="text-xs font-medium text-cyan-50 tracking-wide uppercase">
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
                              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:shadow-sm bg-transparent"
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
                          <span className={`text-xs font-normal flex-1 text-left ${
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
                  src="/abstract-pink-purple-gold.jpg"
                  alt="Abstract Pink Purple and Gold"
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
  )
}

export default function GoldSwimContent({ userEmail }: GoldSwimContentProps) {
  return (
    <GoldPriceProvider>
      <GoldSwimContentInner userEmail={userEmail} />
    </GoldPriceProvider>
  )
}
