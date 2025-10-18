"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

interface ZenCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function ZenCard({ children, className = "", hover = true, onClick }: ZenCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <Card
        className={`bg-cream-50/60 dark:bg-ink-800/60 border-cream-200/40 dark:border-ink-700/40 backdrop-blur-sm shadow-lg shadow-blue-500/5 dark:shadow-blue-400/5 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 ${className}`}
      >
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </motion.div>
  )
}
