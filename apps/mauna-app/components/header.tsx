"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatedMenuButton } from "@/components/animated-menu-button"
import { SoundSelector } from "@/components/sound-selector"
import type { AppSettings } from "@/lib/types" // Import AppSettings

interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
  settings: AppSettings // This type implies it's always present
}

export function Header({ isMenuOpen, onToggleMenu, settings }: HeaderProps) {
  const [showDashboardMenu, setShowDashboardMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isRootPage = pathname === "/"

  // Define default settings in case 'settings' prop is unexpectedly undefined or null
  const effectiveSettings: AppSettings = settings || {
    focusMode: false,
    showWeather: false,
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

  const menuItems = [
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

  if (isRootPage) {
    // Root page layout: only centered logo with MAUNA text in Apple liquid glass
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-center w-full bg-transparent">
        <div className="glassmorphism p-4 rounded-2xl shadow-lg flex items-center gap-3">
          <LogoMountain className="h-8 w-auto text-cream-25" />
          <span className="text-2xl font-montserrat font-semibold text-cream-25 tracking-wide">MAUNA</span>
        </div>
      </header>
    )
  }

  // Non-root page layout: full header with all elements
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex flex-col items-center w-full bg-transparent">
      {/* Top Row: Sound Selector, Logo, Hamburger Menu */}
      <div className="flex items-center justify-between w-full max-w-screen-xl px-4">
        {/* Left side - Sound Selector */}
        <SoundSelector />
        {/* Center Section: Logo */}
        <LogoMountain className="h-10 w-auto text-cream-25" />
        {/* Right Section: Animated Menu Button */}
        <AnimatedMenuButton isOpen={isMenuOpen} onClick={onToggleMenu} className="rounded-full" />
      </div>

      {/* Three-dot menu below the top row, centered */}
      <div className="relative mt-2">
        {showDashboardMenu ? (
          // Expanded menu (glassmorphic)
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center gap-2 p-2 rounded-full glassmorphism animate-in fade-in duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDashboardMenu(false)}
              className="h-10 w-10 rounded-full text-cream-25 hover:bg-white/20 dark:hover:bg-black/20"
              aria-label="Close dashboard menu"
            >
              <X className="h-6 w-6" />
            </Button>
            {menuItems.map((item) => {
              // Conditionally render based on effectiveSettings
              const settingValue = effectiveSettings[item.settingKey as keyof AppSettings]
              if (settingValue === false) {
                return null
              }
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-cream-25 hover:bg-white/20 dark:hover:bg-black/20"
                  onClick={() => {
                    router.push(item.path)
                    setShowDashboardMenu(false)
                  }}
                >
                  {item.icon && <item.icon className="h-6 w-6" />}
                  <span className="sr-only">{item.label}</span>
                </Button>
              )
            })}
          </div>
        ) : (
          // Collapsed menu (transparent background)
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDashboardMenu(true)}
            className="h-10 w-10 rounded-full text-cream-25 hover:bg-white/20 dark:hover:bg-black/20"
            aria-label="Open dashboard menu"
          >
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        )}
      </div>
    </header>
  )
}
