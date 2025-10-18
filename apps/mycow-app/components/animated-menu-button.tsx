"use client"

import { motion } from "framer-motion"

interface AnimatedMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

export function AnimatedMenuButton({ isOpen, onClick }: AnimatedMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-cream-100 dark:bg-ink-800 border border-cream-200 dark:border-ink-700 hover:bg-cream-200 dark:hover:bg-ink-700 transition-colors"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <motion.span
          className="block h-0.5 w-6 bg-ink-600 dark:bg-cream-200"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 2 : -2,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="block h-0.5 w-6 bg-ink-600 dark:bg-cream-200 mt-1"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? -10 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="block h-0.5 w-6 bg-ink-600 dark:bg-cream-200 mt-1"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -2 : 2,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  )
}
