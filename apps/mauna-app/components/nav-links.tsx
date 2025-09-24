"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Eye,
  Folders,
  Waves,
  BarChart3,
  Link,
  Quote,
  HelpCircle,
  Lightbulb,
  Sprout,
  Cog,
  CheckSquare,
  Volume2,
  Clock,
  Repeat,
  Palette,
  Bell,
} from "lucide-react"
import type { AppSettings } from "@/lib/types"

interface NavLinksProps {
  activeCategory: string
  setActiveCategory: (category: string) => void
  settings: AppSettings
}

const createGlassButton = (
  category: string,
  activeCategory: string,
  setActiveCategory: (category: string) => void,
  icon: React.ElementType,
  label: string
) => {
  const IconComponent = icon
  const isActive = activeCategory === category

  return (
    <Button
      key={category}
      variant="ghost"
      className="w-full justify-start gap-2 sm:gap-3 font-inter h-10 sm:h-12 rounded-xl sm:rounded-2xl transition-all duration-300 border-0 touch-manipulation"
      onClick={() => setActiveCategory(category)}
      style={isActive ? {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.95)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      } : {
        color: 'rgba(255, 255, 255, 0.7)',
        background: 'transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
        }
      }}
    >
      <div
        className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl"
        style={isActive ? {
          background: 'rgba(255, 255, 255, 0.2)'
        } : {
          background: 'transparent'
        }}
      >
        <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
      <span className="font-medium text-sm sm:text-base">{label}</span>
    </Button>
  )
}

export function NavLinks({ activeCategory, setActiveCategory, settings }: NavLinksProps) {
  return (
    <nav className="space-y-2 sm:space-y-3">
      {/* Page Management Section */}
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider px-1 sm:px-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Page Management</p>
        {createGlassButton("floating-nav", activeCategory, setActiveCategory, LayoutDashboard, "Navigation Pages")}
        {createGlassButton("app-features", activeCategory, setActiveCategory, CheckSquare, "App Features")}
      </div>

      {/* Dashboard Configuration Section */}
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <p className="text-xs font-medium uppercase tracking-wider px-1 sm:px-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Dashboard</p>
        {createGlassButton("dashboard-elements", activeCategory, setActiveCategory, Folders, "Dashboard Elements")}
      </div>

      {/* App Preferences Section */}
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <p className="text-xs font-medium uppercase tracking-wider px-1 sm:px-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Preferences</p>
        {createGlassButton("appearance", activeCategory, setActiveCategory, Palette, "Appearance")}
        {createGlassButton("notifications", activeCategory, setActiveCategory, Bell, "Notifications")}
      </div>

      {/* Account Section */}
      <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <p className="text-xs font-medium uppercase tracking-wider px-1 sm:px-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Account</p>
        {createGlassButton("settings", activeCategory, setActiveCategory, Cog, "Settings")}
      </div>
    </nav>
  )
}