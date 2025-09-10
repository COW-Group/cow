"use client"

import { ReactNode } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorNavigation from '../investor/InvestorNavigation'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

interface InvestorLayoutProps {
  children: ReactNode
  currentPath?: string
  title?: string
  description?: string
}

export default function InvestorLayout({ 
  children, 
  currentPath, 
  title,
  description 
}: InvestorLayoutProps) {
  const { auth, loading } = useAuthContext()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InvestorNavigation currentPath={currentPath} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to access the investor portal.
              </p>
              <div className="space-y-3">
                <Button className="w-full">
                  <a href="/sign-in">Sign In to Continue</a>
                </Button>
                <Button variant="outline" className="w-full">
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Insufficient permissions (not an investor)
  if (auth.profile && !['investor', 'staff', 'admin'].includes(auth.profile.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <InvestorNavigation currentPath={currentPath} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-2">
                This area is reserved for investors only.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Current role: <span className="font-medium capitalize">{auth.profile.role}</span>
              </p>
              <div className="space-y-3">
                <Button className="w-full">
                  <a href="mailto:support@cyclesofwealth.com">Request Investor Access</a>
                </Button>
                <Button variant="outline" className="w-full">
                  <a href="/">Return to Homepage</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Successful render with navigation and content
  return (
    <div className="min-h-screen bg-gray-50">
      <InvestorNavigation currentPath={currentPath} />
      
      {/* Page Header (optional) */}
      {(title || description) && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            )}
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">COW</span>
                </div>
                <span className="font-semibold text-gray-900">Cycles of Wealth</span>
              </div>
              <p className="text-sm text-gray-600">
                Democratizing access to tokenized real estate and alternative investments.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Investor Portal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/investor/dashboard" className="hover:text-blue-600">Dashboard</a></li>
                <li><a href="/investor/portfolio" className="hover:text-blue-600">Portfolio</a></li>
                <li><a href="/investor/opportunities" className="hover:text-blue-600">Opportunities</a></li>
                <li><a href="/investor/transactions" className="hover:text-blue-600">Transactions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/help" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="/contact" className="hover:text-blue-600">Contact Support</a></li>
                <li><a href="/docs" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="/api" className="hover:text-blue-600">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="/compliance" className="hover:text-blue-600">Compliance</a></li>
                <li><a href="/disclosures" className="hover:text-blue-600">Risk Disclosures</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 Cycles of Wealth. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-xs text-gray-500">
                  Securities offered through FINRA registered broker-dealer
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}