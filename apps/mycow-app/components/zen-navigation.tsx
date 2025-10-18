"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Compass, HandHeart, TrendingUp, Car, Shield, User, Bell, LogOut } from "lucide-react" // Added LogOut icon
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedMenuButton } from "@/components/animated-menu-button"
import { navItems } from "@/lib/data"
import { getClientSupabaseClient } from "@/lib/supabase/client" // Import Supabase client
import { useRouter } from "next/navigation" // Import useRouter

interface ZenNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function ZenNavigation({ activeTab, onTabChange }: ZenNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = getClientSupabaseClient()
  const router = useRouter()

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5" }
    switch (iconName) {
      case "Compass":
        return <Compass {...iconProps} />
      case "HandHeart":
        return <HandHeart {...iconProps} />
      case "TrendingUp":
        return <TrendingUp {...iconProps} />
      case "Car":
        return <Car {...iconProps} />
      case "Shield":
        return <Shield {...iconProps} />
      case "User":
        return <User {...iconProps} />
      default:
        return <Compass {...iconProps} />
    }
  }

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMenuOpen(false)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error.message)
      // Optionally display an error message to the user
    } else {
      router.push("/auth/signin") // Redirect to sign-in page after successful sign out
      setIsMenuOpen(false) // Close menu after sign out
    }
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream-50/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-cream-200/50 dark:border-ink-700/50 h-16">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto h-full">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/images/logo-clean.png"
                alt="MyCOW Logo"
                className="w-8 h-8 object-contain filter drop-shadow-sm"
              />
            </div>
            <h1 className="text-2xl font-light text-ink-800 dark:text-cream-100 tracking-wide">
              My<span className="font-medium text-logo-blue">COW</span>
            </h1>
          </motion.div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="text-ink-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-800 relative"
            >
              <Bell className="h-5 w-5" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-logo-blue rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>

            <AnimatedMenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>
      </header>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-900/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 right-4 z-50 w-64 bg-cream-50/95 dark:bg-ink-900/95 backdrop-blur-lg rounded-2xl border border-cream-200/50 dark:border-ink-700/50 shadow-xl"
            >
              <div className="p-6 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = activeTab === item.id
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-logo-blue/10 text-logo-blue border border-logo-blue/20"
                          : "text-ink-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-800"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {getIcon(item.icon)}
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  )
                })}
                <motion.button
                  onClick={handleSignOut}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="flex items-center space-x-3 w-full p-3 rounded-xl transition-all text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
