import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "./ui/card"
import { X, Smartphone, Monitor, Share, Plus, Download, Chrome, Zap } from "lucide-react"

interface PWAInstallInstructionsProps {
  isOpen: boolean
  onClose: () => void
  variant?: "modal" | "inline"
}

export function PWAInstallInstructions({ isOpen, onClose, variant = "modal" }: PWAInstallInstructionsProps) {
  const [activeTab, setActiveTab] = useState<"ios" | "android" | "desktop">("ios")

  const instructions = {
    ios: {
      icon: <Smartphone className="w-6 h-6" />,
      title: "iPhone/iPad",
      subtitle: "Safari Browser",
      steps: [
        { icon: <Smartphone className="w-5 h-5" />, text: "Open COW Products in Safari browser" },
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
        { icon: <Chrome className="w-5 h-5" />, text: "Open COW Products in Chrome browser" },
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
        { icon: <Chrome className="w-5 h-5" />, text: "Open COW Products in Chrome or Edge" },
        { icon: <Download className="w-5 h-5" />, text: "Click install icon in address bar" },
        { icon: <Plus className="w-5 h-5" />, text: "Click 'Install' in the popup dialog" },
        { icon: <Monitor className="w-5 h-5" />, text: "COW Products will launch as a native app" },
      ],
    },
  }

  const content = (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <h3 className="text-3xl font-extralight text-gray-800 dark:text-gray-100">
            Install <span className="font-medium text-blue-600">COW Products</span>
          </h3>
        </div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto mb-6" />
        <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed">
          Add COW Products to your home screen for the optimal native app experience
        </p>
      </div>

      {/* Device Tabs */}
      <div className="flex justify-center space-x-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl p-2 backdrop-blur-sm">
        {Object.entries(instructions).map(([key, { icon, title, subtitle }]) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key as keyof typeof instructions)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-center space-y-2 rounded-xl px-4 py-3 transition-all duration-300 ${
              activeTab === key
                ? "bg-white dark:bg-gray-700 text-blue-600 shadow-lg shadow-blue-600/10"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white/50 dark:hover:bg-gray-700/50"
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
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-medium">{index + 1}</span>
              </div>
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-blue-600">{step.icon}</div>
                <p className="text-gray-700 dark:text-gray-200 font-light leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="text-center pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 rounded-full px-4 py-2">
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
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex justify-end mb-6">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
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
