"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, ArrowRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EcosystemMenu } from "./EcosystemMenu"
import { useAuthContext } from '@/lib/auth-context'

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { auth, signOut } = useAuthContext()

  const navigationLinks = [
    { name: "Investment Process", href: "/investment-process" },
    { name: "Portfolio Companies", href: "/portfolio-companies" },
    { name: "Investor Relations", href: "/investor-relations" },
    { name: "Compliance", href: "/compliance" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ]

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">COW</span>
            </div>
            <span className="text-white font-bold text-xl">Cycles of Wealth</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-800/50"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <EcosystemMenu />
            
            {auth.isAuthenticated ? (
              <>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <Link to="/investor-portal" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
                
                <Button 
                  onClick={signOut}
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  asChild
                  variant="ghost" 
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50"
                >
                  <Link to="/sign-in" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link to="/get-started" className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <EcosystemMenu />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-gray-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-800 pt-3 mt-3">
                {auth.isAuthenticated ? (
                  <>
                    <Link
                      to="/investor-portal"
                      className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-gray-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    
                    <button
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-gray-800/50 w-full text-left mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/sign-in"
                      className="text-gray-300 hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-gray-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                    
                    <Link
                      to="/get-started"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}