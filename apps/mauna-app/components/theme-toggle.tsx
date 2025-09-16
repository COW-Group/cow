"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isAnimating, setIsAnimating] = React.useState(false)

  const toggleTheme = () => {
    setIsAnimating(true)
    setTheme(theme === "dark" ? "light" : "dark")
  }

  React.useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300) // Match animation duration
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full border border-brushed-silver/50 dark:border-ink-800/50",
        "bg-cream-25 text-ink-950 dark:bg-ink-950 dark:text-cream-25",
        "hover:bg-cream-100 dark:hover:bg-ink-900",
        "transition-colors duration-300",
        isAnimating ? "animate-rotate-toggle" : "",
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] fill-cream-900 text-cream-900" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] fill-soft-gold text-soft-gold" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
