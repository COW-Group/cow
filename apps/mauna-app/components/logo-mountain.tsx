import type React from "react"
import { Mountain } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoMountainProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number // Size in pixels (width and height)
  iconSize?: number // Icon size in pixels
  className?: string
}

export function LogoMountain({ size = 40, iconSize = 24, className, ...props }: LogoMountainProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        className, // Allow external classes to override or add
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Mountain icon: transparent fill, cream stroke */}
      <Mountain
        fill="none"
        stroke="currentColor"
        className="text-cream-25" // Set stroke color to cream-25
        style={{ width: iconSize, height: iconSize }}
        aria-label="MAUNA Logo"
      />
    </div>
  )
}
