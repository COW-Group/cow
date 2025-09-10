"use client"

import { useState } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface InvestorNavigationProps {
  currentPath?: string
}

export default function InvestorNavigation({ currentPath }: InvestorNavigationProps) {
  const { auth, signOut } = useAuthContext()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/investor/dashboard',
      icon: '📊',
      description: 'Portfolio overview and key metrics'
    },
    {
      name: 'Portfolio',
      href: '/investor/portfolio',
      icon: '💼',
      description: 'Your investment holdings'
    },
    {
      name: 'Opportunities',
      href: '/investor/opportunities',
      icon: '🎯',
      description: 'Browse new investments'
    },
    {
      name: 'Transactions',
      href: '/investor/transactions',
      icon: '📋',
      description: 'Order history and activity'
    },
    {
      name: 'Profile',
      href: '/investor/profile',
      icon: '👤',
      description: 'Account and verification settings'
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isCurrentPath = (href: string) => {
    if (!currentPath) return false
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">COW</span>
                </div>
                <span className="font-semibold text-gray-900">Cycles of Wealth</span>
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-blue-600 font-medium">Investor Portal</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isCurrentPath(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              ))}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                {auth.profile?.avatar_url ? (
                  <img
                    src={auth.profile.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">
                      {auth.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-700 font-medium">
                  {auth.profile?.name || 'Investor'}
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-1">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 mb-4">
                {auth.profile?.avatar_url ? (
                  <img
                    src={auth.profile.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">
                      {auth.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {auth.profile?.name || 'Investor'}
                  </p>
                  <p className="text-xs text-gray-500">{auth.profile?.email}</p>
                </div>
              </div>

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isCurrentPath(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Breadcrumb (Optional) */}
      {currentPath && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/investor/dashboard" className="hover:text-blue-600">
                Investor Portal
              </a>
              {currentPath !== '/investor/dashboard' && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {currentPath.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Quick Access Widget for Dashboard
export function QuickAccessWidget() {
  const quickActions = [
    {
      name: 'Browse Investments',
      href: '/investor/opportunities',
      icon: '🎯',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'View Portfolio',
      href: '/investor/portfolio',
      icon: '💼',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Transaction History',
      href: '/investor/transactions',
      icon: '📋',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Update Profile',
      href: '/investor/profile',
      icon: '👤',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => (
          <a
            key={action.name}
            href={action.href}
            className={`${action.color} text-white p-4 rounded-lg transition-colors block text-center hover:shadow-lg`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.name}</div>
          </a>
        ))}
      </div>
    </Card>
  )
}