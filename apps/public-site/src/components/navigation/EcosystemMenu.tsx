"use client"

import { useState } from "react"
import { ChevronDown, Grid3X3, Users, Building2, LifeBuoy, Settings, User } from "lucide-react"
import { useAuthContext } from '@/lib/auth-context'

interface EcosystemApp {
  name: string
  description: string
  icon: React.ComponentType<any>
  url: string
  badge?: string
  requiresAuth?: boolean
  roles?: string[]
}

interface MenuSection {
  title: string
  apps: EcosystemApp[]
}

export function EcosystemMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { auth, hasRole } = useAuthContext()
  
  const isAuthenticated = auth.isAuthenticated
  const userRole = auth.profile?.role || "public"

  const menuSections: MenuSection[] = [
    {
      title: "Public Access",
      apps: [
        {
          name: "Marketing Site",
          description: "Learn about tokenization opportunities",
          icon: Building2,
          url: "https://cyclesofwealth.com",
          badge: "You are here"
        },
        {
          name: "Investment Opportunities",
          description: "Browse available tokens and companies",
          icon: Building2,
          url: "/opportunities"
        },
        {
          name: "Support Center",
          description: "Get help and find answers",
          icon: LifeBuoy,
          url: "https://support.cyclesofwealth.com"
        }
      ]
    },
    {
      title: "Investor Portal",
      apps: [
        {
          name: "Investor Dashboard",
          description: "Manage your investment portfolio",
          icon: User,
          url: "https://app.cyclesofwealth.com/investors",
          requiresAuth: true,
          roles: ['investor', 'staff', 'admin']
        },
        {
          name: "Token Trading",
          description: "Trade and manage your tokens",
          icon: Grid3X3,
          url: "https://app.cyclesofwealth.com/trading",
          requiresAuth: true,
          roles: ['investor', 'staff', 'admin']
        },
        {
          name: "Portfolio Analytics",
          description: "Track performance and returns",
          icon: Grid3X3,
          url: "https://app.cyclesofwealth.com/analytics",
          requiresAuth: true,
          roles: ['investor', 'staff', 'admin']
        }
      ]
    },
    {
      title: "Business Operations",
      apps: [
        {
          name: "Platform Dashboard",
          description: "Main business operations center",
          icon: Grid3X3,
          url: "https://app.cyclesofwealth.com",
          requiresAuth: true,
          roles: ['staff', 'admin']
        },
        {
          name: "Company Management",
          description: "Manage tokenized companies",
          icon: Building2,
          url: "https://app.cyclesofwealth.com/companies",
          requiresAuth: true,
          roles: ['staff', 'admin']
        },
        {
          name: "Compliance Center",
          description: "KYC/AML and regulatory compliance",
          icon: Settings,
          url: "https://app.cyclesofwealth.com/compliance",
          requiresAuth: true,
          roles: ['staff', 'admin']
        }
      ]
    },
    {
      title: "Administration",
      apps: [
        {
          name: "Admin Portal",
          description: "Executive oversight and system admin",
          icon: Settings,
          url: "https://admin.cyclesofwealth.com",
          requiresAuth: true,
          roles: ['admin'],
          badge: "Admin Only"
        },
        {
          name: "Business Analytics",
          description: "Comprehensive business intelligence",
          icon: Grid3X3,
          url: "https://admin.cyclesofwealth.com/analytics",
          requiresAuth: true,
          roles: ['admin']
        }
      ]
    }
  ]

  const canAccessApp = (app: EcosystemApp) => {
    if (!app.requiresAuth) return true
    if (!isAuthenticated) return false
    if (!app.roles || app.roles.length === 0) return true
    return hasRole(app.roles)
  }

  const getVisibleSections = () => {
    return menuSections.map(section => ({
      ...section,
      apps: section.apps.filter(canAccessApp)
    })).filter(section => section.apps.length > 0)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        onBlur={(e) => {
          // Close dropdown when clicking outside
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setTimeout(() => setIsOpen(false), 150)
          }
        }}
      >
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded grid grid-cols-2 gap-0.5 p-1">
          <div className="bg-white/80 rounded-sm"></div>
          <div className="bg-white/60 rounded-sm"></div>
          <div className="bg-white/60 rounded-sm"></div>
          <div className="bg-white/80 rounded-sm"></div>
        </div>
        <span className="text-white font-medium">COW Ecosystem</span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden z-50">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Cycles of Wealth</h3>
              <p className="text-sm text-gray-400">Navigate the complete tokenization ecosystem</p>
            </div>

            {/* Menu sections */}
            <div className="space-y-6">
              {getVisibleSections().map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.apps.map((app, appIndex) => {
                      const Icon = app.icon
                      const isExternal = app.url.startsWith('http')
                      const isCurrentSite = app.badge === "You are here"
                      
                      return (
                        <a
                          key={appIndex}
                          href={app.url}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                            isCurrentSite 
                              ? "bg-blue-600/20 border border-blue-500/30" 
                              : "hover:bg-gray-800/50 hover:border-gray-700 border border-transparent"
                          }`}
                          onClick={() => !isCurrentSite && setIsOpen(false)}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isCurrentSite ? "bg-blue-500/30" : "bg-gray-700/50 group-hover:bg-gray-600/50"
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isCurrentSite ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${
                                isCurrentSite ? "text-blue-300" : "text-white group-hover:text-blue-300"
                              }`}>
                                {app.name}
                              </p>
                              {app.badge && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  app.badge === "You are here" 
                                    ? "bg-blue-500/20 text-blue-300"
                                    : app.badge === "Admin Only"
                                    ? "bg-red-500/20 text-red-300" 
                                    : "bg-gray-500/20 text-gray-300"
                                }`}>
                                  {app.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">{app.description}</p>
                          </div>
                          {!isCurrentSite && (
                            <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90 group-hover:text-blue-400 transition-colors" />
                          )}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Authentication Status */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    {isAuthenticated ? `Signed in as ${userRole}${auth.profile?.name ? ` (${auth.profile.name})` : ''}` : "Not signed in"}
                  </p>
                </div>
                {!isAuthenticated && (
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500 text-center">©2025 Cycles of Wealth</p>
              <p className="text-xs text-gray-500 text-center">Regulatory-Compliant Tokenization Platform</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}