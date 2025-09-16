"use client"

import { motion } from "framer-motion"

interface AnimatedMenuButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function AnimatedMenuButton({ isOpen, onClick, className }: AnimatedMenuButtonProps) {
  const common = {
    backgroundColor: "hsl(var(--cream-25))", // Changed to cream-25
    transition: { duration: 0.3 },
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none ${className}`}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <motion.span
        className="block h-0.5 w-6 rounded-full"
        animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: 0 }}
        style={common}
      />
      <motion.span
        className="block h-0.5 w-6 rounded-full my-1"
        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        style={common}
      />
      <motion.span
        className="block h-0.5 w-6 rounded-full"
        animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
        style={common}
      />
    </button>
  )
}
