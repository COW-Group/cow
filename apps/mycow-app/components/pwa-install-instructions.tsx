"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { X, Smartphone, Monitor, Share, Plus, Download, Chrome, AppleIcon as Safari, Zap } from "lucide-react"

interface PWAInstallInstructionsProps {
  isOpen: boolean
  onClose: () => void
  variant?: "modal" | "inline"
}

export function PWAInstallInstructions({ isOpen, onClose, variant = "modal" }: PWAInstallInstructionsProps) {
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("ios")

  const instructions = {
    ios: {
      icon: <Safari className="w-6 h-6" />,
      title: "iPhone/iPad",
      subtitle: "Safari Browser",
      steps: [
        { icon: <Safari className="w-5 h-5" />, text: "Open MyCOW in Safari browser" },
        { icon: <Share className="w-5 h-5" />, text: "Tap the Share button at the bottom" },
        { icon: <Plus className="w-5 h-5" />, text: "Select 'Add to Home Screen'" },
        { icon: <Smartphone className="w-5 h-5" />, text: "Tap 'Add' to complete installation" },
      ],
    },
    android: {
      icon: <Chrome className="w-6 h-6" />,
      title: "Android",
      subtitle: "Chrome Browser",
      steps: [
        { icon: <Chrome className="w-5 h-5" />, text: "Open MyCOW in Chrome browser" },
        { icon: <Download className="w-5 h-5" />, text: "Look for 'Install' banner or menu option" },
        { icon: <Plus className="w-5 h-5" />, text: "Tap 'Install' or 'Add to Home Screen'" },
        { icon: <Smartphone className="w-5 h-5" />, text: "Confirm installation to complete" },
      ],
    },
    desktop: {
      icon: <Monitor className="w-6 h-6" />,
      title: "Desktop",
      subtitle: "Chrome/Edge Browser",
      steps: [
        { icon: <Chrome className="w-5 h-5" />, text: "Open MyCOW in Chrome or Edge" },
        { icon: <Download className="w-5 h-5" />, text: "Click install icon in address bar" },
        { icon: <Plus className="w-5 h-5" />, text: "Click 'Install' in the popup dialog" },
        { icon: <Monitor className="w-5 h-5" />, text: "MyCOW will launch as a native app" },
      ],
    },
  }

  const content = (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-14 h-14 mr-4" />
            <div className="absolute inset-0 bg-logo-blue/20 rounded-full blur-lg scale-150" />
          </div>
          <h3 className="text-3xl font-extralight text-ink-800 dark:text-cream-100">
            Install My<span className="font-medium text-logo-blue">COW</span>
          </h3>
        </div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-logo-blue to-transparent mx-auto mb-6" />
        <p className="text-ink-600 dark:text-cream-300 font-light leading-relaxed">
          Add MyCOW to your home screen for the optimal native app experience
        </p>
      </div>

      {/* Device Tabs */}
      <div className="flex justify-center space-x-2 bg-cream-100/50 dark:bg-ink-800/50 rounded-2xl p-2 backdrop-blur-sm">
        {Object.entries(instructions).map(([key, { icon, title, subtitle }]) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key as keyof typeof instructions)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center space-y-2 rounded-xl px-4 py-3 transition-all duration-300 ${
              activeTab === key
                ? "bg-white dark:bg-ink-700 text-logo-blue shadow-lg shadow-logo-blue/10"
                : "text-ink-600 dark:text-cream-300 hover:text-ink-800 dark:hover:text-cream-100 hover:bg-white/50 dark:hover:bg-ink-700/50"
            }`}
          >
            {icon}
            <div className="text-center">
              <div className="text-sm font-medium">{title}</div>
              <div className="text-xs opacity-70">{subtitle}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-4"
        >
          {instructions[activeTab].steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-cream-50 to-cream-100 dark:from-ink-800 dark:to-ink-700 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-logo-blue to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">{index + 1}</span>
              </div>
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-logo-blue">{step.icon}</div>
                <p className="text-ink-700 dark:text-cream-200 font-light leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center pt-6 border-t border-cream-200/50 dark:border-ink-700/50">
        <div className="inline-flex items-center space-x-2 text-ink-500 dark:text-cream-400 bg-cream-100/50 dark:bg-ink-800/50 rounded-full px-4 py-2">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-light">Works offline • Faster loading • Native experience</span>
        </div>
      </div>
    </div>
  )

  if (variant === "inline") {
    return <div className="w-full">{content}</div>
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="bg-white/95 dark:bg-ink-900/95 backdrop-blur-xl border-cream-200/50 dark:border-ink-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-end mb-6">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-cream-100 dark:bg-ink-800 flex items-center justify-center text-ink-600 dark:text-cream-300 hover:text-ink-800 dark:hover:text-cream-100 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>
                {content}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
