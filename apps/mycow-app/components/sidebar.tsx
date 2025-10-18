"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Compass, HandHeart, TrendingUp, Car, Shield, User, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { navItems } from "@/lib/data"

interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Compass":
        return <Compass className="w-5 h-5" />
      case "HandHeart":
        return <HandHeart className="w-5 h-5" />
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5" />
      case "Car":
        return <Car className="w-5 h-5" />
      case "Shield":
        return <Shield className="w-5 h-5" />
      case "User":
        return <User className="w-5 h-5" />
      default:
        return <Compass className="w-5 h-5" />
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        >
          {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isExpanded ? "auto" : "none" }}
      >
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl"
          initial={{ x: "100%" }}
          animate={{ x: isExpanded ? 0 : "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-8 mt-2">
              <div className="flex items-center">
                <img src="/images/logo.png" alt="MyCOW Logo" className="w-8 h-8 mr-2" />
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">MyCOW</h1>
              </div>
              <ThemeToggle />
            </div>

            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                  onClick={() => {
                    onTabChange(item.id)
                    setIsExpanded(false)
                  }}
                >
                  {getIcon(item.icon)}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </div>

            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex flex-col h-screen w-16 hover:w-64 fixed left-0 top-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-30 transition-all duration-300 ease-in-out"
        animate={{ width: isExpanded ? 256 : 64 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800">
          <img src="/images/logo.png" alt="MyCOW Logo" className="w-8 h-8" />
          <motion.h1
            className="ml-3 text-xl font-semibold text-slate-900 dark:text-white whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            MyCOW
          </motion.h1>
        </div>

        <div className="flex flex-col flex-1 py-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`justify-start rounded-none h-12 px-4 mb-1 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-r-4 border-blue-600 dark:border-blue-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              {getIcon(item.icon)}
              <motion.span
                className="ml-4 whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              {!isExpanded && activeTab === item.id && (
                <div className="absolute right-0 w-1 h-12 bg-blue-600 dark:bg-blue-400" />
              )}
            </Button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <ThemeToggle />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: isExpanded ? 1 : 0 }} transition={{ duration: 0.2 }}>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
