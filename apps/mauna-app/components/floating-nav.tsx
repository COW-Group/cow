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
  Repeat,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SoundSelector } from "@/components/sound-selector"
import { DashboardMenu } from "@/components/dashboard-menu"
import type { AppSettings } from "@/lib/types"

interface FloatingNavProps {
  settings?: AppSettings
  onSettingsUpdate?: (settings: AppSettings) => void
  minimal?: boolean
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
    showHeaderHabits: true,
    showHeaderTimeline: true,
  }

  // Use passed settings or defaults
  const currentSettings = { ...defaultSettings, ...settings }

  const allMenuItems = [
    { icon: LayoutDashboard, label: "Main", path: "/dashboard", settingKey: "showHeaderMain" },
    { icon: Brain, label: "Focus", path: "/focus", settingKey: "showHeaderFocus" },
    { icon: Heart, label: "Emotional", path: "/emotional", settingKey: "showHeaderEmotional" },
    { icon: HeartPulse, label: "Health", path: "/health", settingKey: "showHeaderHealth" },
    { icon: Repeat, label: "Habits", path: "/habits", settingKey: "showHeaderHabits" },
    { icon: Eye, label: "Vision", path: "/vision", settingKey: "showHeaderVision" },
    { icon: DollarSign, label: "Wealth", path: "/wealth", settingKey: "showHeaderWealth" },
    { icon: Users, label: "Social", path: "/social", settingKey: "showHeaderSocial" },
    { icon: Briefcase, label: "Projects", path: "/missions", settingKey: "showHeaderProjects" },
    { icon: TrendingUp, label: "Sales", path: "/sales", settingKey: "showHeaderSales" },
    { icon: ShoppingCart, label: "Marketplace", path: "/marketplace", settingKey: "showHeaderMarketplace" },
    { icon: Clock, label: "Timeline", path: "/timeline", settingKey: "showHeaderTimeline" },
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
    <nav
      className="fixed left-1/2 transform -translate-x-1/2 z-50"
      style={{
        top: `max(2rem, calc(env(safe-area-inset-top) + 1rem))` // Respect safe area + 1rem padding
      }}
    >
      <div
        className="px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-4 sm:gap-6 md:gap-8 transition-all duration-500 touch-manipulation"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Sound Selector - Functional Component */}
        <div className="flex items-center">
          <SoundSelector iconColor={iconColor} />
        </div>

        {/* Brand Identity - Responsive */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center justify-center">
            <LogoMountain className={`h-5 sm:h-6 md:h-7 w-auto ${iconColor} transition-all duration-300`} />
          </div>
          <div className="h-4 sm:h-6 w-px bg-white/15"></div>
          <span
            className="text-sm sm:text-base md:text-lg font-inter font-extralight tracking-wider select-none"
            style={{
              color: textColor,
              letterSpacing: '0.12em',
              fontWeight: '200'
            }}
          >
            mauna
          </span>
        </div>

        {/* Navigation Menu - Mobile Dropdown Design */}
        <div className="relative">
          {/* Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDashboardMenu(!showDashboardMenu)}
            className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95 group touch-target`}
            aria-label={showDashboardMenu ? "Close navigation menu" : "Open navigation menu"}
          >
            {showDashboardMenu ? (
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-current opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-1 h-1 rounded-full bg-current opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div className="w-1 h-1 rounded-full bg-current opacity-20 group-hover:opacity-60 transition-opacity"></div>
              </div>
            )}
          </Button>

          {/* Mobile/PWA Dropdown Menu */}
          {showDashboardMenu && (
            <div
              className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 w-[calc(100vw-2rem)] max-w-80 min-w-72 z-[100] animate-in slide-in-from-top-2 duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.35)',
                backdropFilter: 'blur(80px) saturate(220%)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Dropdown Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm font-medium font-inter"
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Navigation
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDashboardMenu(false)}
                    className={`h-6 w-6 rounded-lg ${iconColor} ${hoverColor} transition-all duration-200`}
                    aria-label="Close menu"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Navigation Items Grid */}
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {menuItems.map((item, index) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => {
                        router.push(item.path)
                        setShowDashboardMenu(false)
                      }}
                      className="flex flex-col items-center gap-2 h-auto p-3 rounded-xl transition-all duration-300 border-0 touch-manipulation group"
                      style={{
                        background: 'rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(15px) saturate(160%)',
                        border: '1px solid rgba(255, 255, 255, 0.25)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      {/* Icon Container */}
                      <div
                        className="p-2 rounded-lg transition-all duration-200"
                        style={{
                          background: 'rgba(255, 255, 255, 0.22)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <item.icon
                          className="h-4 w-4 transition-all duration-200"
                          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                        />
                      </div>

                      {/* Label */}
                      <span
                        className="text-xs font-medium text-center leading-tight font-inter"
                        style={{
                          color: 'rgba(255, 255, 255, 0.92)',
                          textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {item.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Backdrop for mobile (close on tap outside) */}
          {showDashboardMenu && (
            <div
              className="fixed inset-0 z-[99] bg-transparent"
              onClick={() => setShowDashboardMenu(false)}
              aria-label="Close navigation menu"
            />
          )}
        </div>

        {/* Dashboard Settings - Responsive Menu Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDashboardMenuOpen(true)}
            className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg sm:rounded-xl ${iconColor} ${hoverColor} transition-all duration-300 hover:scale-95 group touch-target`}
            aria-label="Open dashboard menu"
          >
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-3 sm:w-4 h-0.5 rounded-full bg-current opacity-80 group-hover:opacity-100 transition-all group-hover:w-4 sm:group-hover:w-5"></div>
              <div className="w-2 sm:w-3 h-0.5 rounded-full bg-current opacity-60 group-hover:opacity-90 transition-all group-hover:w-3 sm:group-hover:w-4"></div>
              <div className="w-1.5 sm:w-2 h-0.5 rounded-full bg-current opacity-40 group-hover:opacity-70 transition-all group-hover:w-2 sm:group-hover:w-3"></div>
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