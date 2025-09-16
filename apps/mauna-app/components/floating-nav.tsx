"use client"

import { useState, useEffect } from "react"
import { LogoMountain } from "@/components/logo-mountain"
import {
  MoreHorizontal,
  LayoutDashboard,
  Brain,
  Heart,
  Eye,
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  ShoppingCart,
  X,
  HeartPulse,
  Music,
  Settings,
  Menu,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SoundSelector } from "@/components/sound-selector"
import { DashboardMenu } from "@/components/dashboard-menu"
import type { AppSettings } from "@/lib/types"

interface FloatingNavProps {
  settings?: AppSettings
  onSettingsUpdate?: (settings: AppSettings) => void
}

export function FloatingNav({ settings, onSettingsUpdate }: FloatingNavProps = {}) {
  const [showDashboardMenu, setShowDashboardMenu] = useState(false)
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(true) // Default to dark for better contrast
  const router = useRouter()

  // Detect background brightness (simplified approach)
  useEffect(() => {
    const detectBackgroundBrightness = () => {
      // For now, we'll assume dark background and use light text
      // In a full implementation, you could analyze the background image
      setIsDarkBackground(true)
    }

    detectBackgroundBrightness()
  }, [])

  // Default settings - merged with passed settings
  const defaultSettings: AppSettings = {
    focusMode: false,
    showWeather: true,
    showGreeting: true,
    showMantra: false,
    showTasks: true,
    showQuotes: true,
    darkMode: false,
    soundEnabled: true,
    defaultDuration: 30,
    autoLoop: false,
    showCalendarMenu: true,
    showTasksMenu: true,
    showJournalMenu: true,
    showVisionBoardMenu: true,
    showBalanceMenu: true,
    showWealthManagementMenu: true,
    showLinksMenu: true,
    showMantrasMenu: true,
    showQuotesMenu: true,
    showCompletedMountainsMenu: true,
    showAudioSettingsMenu: true,
    showMountainPreferencesMenu: true,
    showBubblesMenu: true,
    showHelpMenu: true,
    showHeaderMain: true,
    showHeaderFocus: true,
    showHeaderEmotional: true,
    showHeaderHealth: true,
    showHeaderVision: true,
    showHeaderWealth: true,
    showHeaderSocial: true,
    showHeaderProjects: true,
    showHeaderSales: true,
    showHeaderMarketplace: true,
  }

  // Use passed settings or defaults
  const currentSettings = { ...defaultSettings, ...settings }

  const allMenuItems = [
    { icon: LayoutDashboard, label: "Main", path: "/dashboard", settingKey: "showHeaderMain" },
    { icon: Brain, label: "Focus", path: "/focus", settingKey: "showHeaderFocus" },
    { icon: Heart, label: "Emotional", path: "/emotional", settingKey: "showHeaderEmotional" },
    { icon: HeartPulse, label: "Health", path: "/health", settingKey: "showHeaderHealth" },
    { icon: Eye, label: "Vision", path: "/vision", settingKey: "showHeaderVision" },
    { icon: DollarSign, label: "Wealth", path: "/wealth", settingKey: "showHeaderWealth" },
    { icon: Users, label: "Social", path: "/social", settingKey: "showHeaderSocial" },
    { icon: Briefcase, label: "Projects", path: "/missions", settingKey: "showHeaderProjects" },
    { icon: TrendingUp, label: "Sales", path: "/sales", settingKey: "showHeaderSales" },
    { icon: ShoppingCart, label: "Marketplace", path: "/marketplace", settingKey: "showHeaderMarketplace" },
  ] as const

  // Filter menu items based on settings
  const menuItems = allMenuItems.filter(item => {
    const isVisible = currentSettings[item.settingKey as keyof AppSettings] === true
    console.log(`FloatingNav: ${item.label} (${item.settingKey}): ${isVisible}`)
    return isVisible
  })

  console.log(`FloatingNav: Showing ${menuItems.length} out of ${allMenuItems.length} menu items`)

  const handleSignOut = () => {
    // Mock sign out function
    console.log("Sign out clicked")
  }

  const openTaskListManager = () => {
    console.log("Task list manager opened")
  }

  const openVisionBoard = () => {
    console.log("Vision board opened")
  }

  const updateSettings = (updatedSettings: AppSettings) => {
    console.log("FloatingNav: Settings updated:", updatedSettings)
    if (onSettingsUpdate) {
      onSettingsUpdate(updatedSettings)
    }
  }


  // Dynamic color scheme based on background
  const textColor = isDarkBackground ? '#f9fafb' : '#1f2937' // gray-50 for dark bg, gray-800 for light bg
  const iconColor = isDarkBackground ? 'text-gray-50' : 'text-gray-800'
  const hoverColor = isDarkBackground ? 'hover:bg-white/20' : 'hover:bg-black/10'

  return (
    <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="px-6 py-3 flex items-center gap-8 transition-all duration-500"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Sound Selector - Functional Component */}
        <div className="flex items-center">
          <SoundSelector iconColor={iconColor} />
        </div>

        {/* Brand Identity - Refined */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
            <LogoMountain className={`h-7 w-auto ${iconColor} transition-all duration-300`} />
          </div>
          <div className="h-6 w-px bg-white/15"></div>
          <span
            className="text-lg font-inter font-extralight tracking-wider select-none"
            style={{
              color: textColor,
              letterSpacing: '0.12em',
              fontWeight: '200'
            }}
          >
            mauna
          </span>
        </div>

        {/* Refined Navigation Menu */}
        <div className="relative">
          {showDashboardMenu ? (
            // Expanded navigation - Premium glass container
            <div
              className="flex items-center gap-1 px-3 py-2 rounded-2xl backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.04)'
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDashboardMenu(false)}
                className={`h-9 w-9 rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95`}
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="h-5 w-px bg-white/8 mx-1"></div>
              {menuItems.map((item, index) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95`}
                  onClick={() => {
                    router.push(item.path)
                    setShowDashboardMenu(false)
                  }}
                  title={item.label}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <item.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          ) : (
            // Collapsed state - Minimalist dot indicator
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDashboardMenu(true)}
              className={`h-10 w-10 rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95 group`}
              aria-label="Open navigation menu"
            >
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-current opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-1 h-1 rounded-full bg-current opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div className="w-1 h-1 rounded-full bg-current opacity-20 group-hover:opacity-60 transition-opacity"></div>
              </div>
            </Button>
          )}
        </div>

        {/* Dashboard Settings - Refined Menu Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDashboardMenuOpen(true)}
            className={`h-10 w-10 rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95 group`}
            aria-label="Open dashboard menu"
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-4 h-0.5 rounded-full bg-current opacity-80 group-hover:opacity-100 transition-all group-hover:w-5"></div>
              <div className="w-3 h-0.5 rounded-full bg-current opacity-60 group-hover:opacity-90 transition-all group-hover:w-4"></div>
              <div className="w-2 h-0.5 rounded-full bg-current opacity-40 group-hover:opacity-70 transition-all group-hover:w-3"></div>
            </div>
          </Button>
        </div>
      </div>

      {/* Dashboard Menu Modal */}
      <DashboardMenu
        isOpen={isDashboardMenuOpen}
        onClose={() => setIsDashboardMenuOpen(false)}
        settings={currentSettings}
        updateSettings={updateSettings}
        openTaskListManager={openTaskListManager}
        openVisionBoard={openVisionBoard}
        handleSignOut={handleSignOut}
        currentUser={null}
        userProfileName={null}
        userId="mock-user-id"
      />
    </nav>
  )
}