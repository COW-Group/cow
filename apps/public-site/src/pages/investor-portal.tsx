"use client"

import { useAuthContext } from '../lib/auth-context'
import InvestorLayout from '../components/layout/InvestorLayout'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export default function InvestorPortal() {
  const { auth } = useAuthContext()

  // If authenticated, redirect to dashboard
  if (auth.isAuthenticated) {
    window.location.href = '/investor/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investor Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Access your investment portfolio, browse opportunities, and manage your account
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              <a href="/sign-in" className="flex items-center space-x-2">
                <span>Sign In to Portal</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Portfolio Dashboard</h3>
            <p className="text-gray-600 text-sm">
              Track your investments, view performance metrics, and monitor your portfolio in real-time
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Investment Opportunities</h3>
            <p className="text-gray-600 text-sm">
              Browse and invest in tokenized real estate, commodities, and alternative assets
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
            <p className="text-gray-600 text-sm">
              View your complete trading history, manage orders, and export reports
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Secure & Compliant</h3>
            <p className="text-gray-600 text-sm">
              KYC verification, accreditation management, and regulatory compliance
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Mobile Optimized</h3>
            <p className="text-gray-600 text-sm">
              Access your investments anywhere with our responsive, mobile-first design
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-lg font-semibold mb-3">Premium Assets</h3>
            <p className="text-gray-600 text-sm">
              Access exclusive investment opportunities in tokenized premium assets
            </p>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Investor Portal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">🔒 Institutional-Grade Security</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Multi-factor authentication</li>
                <li>• End-to-end encryption</li>
                <li>• Regular security audits</li>
                <li>• Compliance with financial regulations</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">📈 Professional Tools</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time portfolio analytics</li>
                <li>• Advanced filtering and sorting</li>
                <li>• Performance tracking and reporting</li>
                <li>• Investment opportunity research</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">🌍 Global Access</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 24/7 platform availability</li>
                <li>• Multi-currency support</li>
                <li>• International compliance</li>
                <li>• Cross-border investments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">🎯 Curated Opportunities</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vetted investment opportunities</li>
                <li>• Detailed due diligence reports</li>
                <li>• Risk assessment and ratings</li>
                <li>• Expert market analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of investors accessing premium tokenized assets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              <a href="/sign-in">Access Investor Portal</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p className="mb-2">
            Securities offered through FINRA registered broker-dealer. 
            Investment products are not FDIC insured and may lose value.
          </p>
          <p>
            By accessing this portal, you acknowledge that you have read and understood our 
            <a href="/terms" className="text-blue-600 hover:underline"> Terms of Service</a> and 
            <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}