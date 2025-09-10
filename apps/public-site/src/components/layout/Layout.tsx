import { ReactNode } from "react"
import { MainNavigation } from "../navigation/MainNavigation"
import { ClientProviders } from "@/lib/client-providers"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <ClientProviders>
      <div className="min-h-screen bg-gray-950">
        <MainNavigation />
        <main className="pt-16">
          {children}
        </main>
      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">COW</span>
                </div>
                <span className="text-white font-bold text-lg">Cycles of Wealth</span>
              </div>
              <p className="text-gray-400 text-sm">
                Regulatory-compliant tokenization platform revolutionizing how businesses access capital.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/investment-process" className="text-gray-400 hover:text-white transition-colors">Investment Process</a></li>
                <li><a href="/portfolio-companies" className="text-gray-400 hover:text-white transition-colors">Portfolio Companies</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
                <li><a href="/investor-relations" className="text-gray-400 hover:text-white transition-colors">Investor Relations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="https://support.cyclesofwealth.com" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
                <li><a href="/legal" className="text-gray-400 hover:text-white transition-colors">Legal</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Access</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://app.cyclesofwealth.com" className="text-gray-400 hover:text-white transition-colors">Platform App</a></li>
                <li><a href="/investor-portal" className="text-gray-400 hover:text-white transition-colors">Investor Portal</a></li>
                <li><a href="https://admin.cyclesofwealth.com" className="text-gray-400 hover:text-white transition-colors">Admin Portal</a></li>
                <li><a href="/get-started" className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Cycles of Wealth. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/legal/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="/legal/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="/legal/risk-disclosures" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Risk Disclosures
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs text-center">
                Securities offered through Cycles of Wealth are subject to regulatory approval and compliance requirements. 
                All investments carry risk of loss. Please read all risk disclosures and regulatory filings before investing.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ClientProviders>
  )
}