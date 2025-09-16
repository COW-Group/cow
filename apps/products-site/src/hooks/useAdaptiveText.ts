import { useState, useEffect } from 'react'

interface AdaptiveTextStyles {
  color: string
  textShadow: string
  filter: string
  backdropFilter?: string
}

interface BackgroundLuminance {
  luminance: number
  hue: number
  saturation: number
}

export function useAdaptiveText(): AdaptiveTextStyles {
  const [textStyles, setTextStyles] = useState<AdaptiveTextStyles>({
    color: 'rgba(255, 255, 255, 0.95)',
    textShadow: '0 2px 20px rgba(0,0,0,0.4), 0 4px 40px rgba(0,0,0,0.3)',
    filter: 'contrast(1.1) brightness(1.05)'
  })

  useEffect(() => {
    const updateTextStyles = () => {
      const hour = new Date().getHours()
      let bgLuminance: BackgroundLuminance

      // Match Vanta.js time-based color scheme
      if (hour >= 6 && hour < 12) {
        // Morning - brighter, warmer
        bgLuminance = { luminance: 0.7, hue: 45, saturation: 0.8 }
      } else if (hour >= 12 && hour < 17) {
        // Afternoon - brightest, golden
        bgLuminance = { luminance: 0.85, hue: 40, saturation: 0.9 }
      } else if (hour >= 17 && hour < 20) {
        // Evening - warm, medium
        bgLuminance = { luminance: 0.5, hue: 25, saturation: 0.7 }
      } else {
        // Night - dark, cool
        bgLuminance = { luminance: 0.2, hue: 220, saturation: 0.6 }
      }

      // Calculate adaptive text properties
      const isLight = bgLuminance.luminance > 0.6
      const isWarm = bgLuminance.hue < 60
      const contrast = isLight ? 'high' : 'medium'

      let adaptiveStyles: AdaptiveTextStyles

      // Always use black text - clean and professional
      adaptiveStyles = {
        color: 'rgba(0, 0, 0, 0.9)',
        textShadow: 'none',
        filter: 'none'
      }

      setTextStyles(adaptiveStyles)
    }

    // Initial update
    updateTextStyles()

    // Update every minute to match time-based changes
    const interval = setInterval(updateTextStyles, 60000)

    // Also update on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateTextStyles()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return textStyles
}

// Helper hook for adaptive button styles
export function useAdaptiveButton() {
  const [buttonStyles, setButtonStyles] = useState({
    primary: {
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px) saturate(180%)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px) saturate(160%)'
    }
  })

  useEffect(() => {
    const updateButtonStyles = () => {
      const hour = new Date().getHours()
      const isLight = hour >= 6 && hour < 20 && (hour < 17 || hour >= 12)

      if (isLight) {
        setButtonStyles({
          primary: {
            background: 'rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(0, 0, 0, 0.15)',
            color: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px) saturate(150%)'
          },
          secondary: {
            background: 'rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            color: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(20px) saturate(140%)'
          }
        })
      } else {
        setButtonStyles({
          primary: {
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)'
          },
          secondary: {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px) saturate(160%)'
          }
        })
      }
    }

    updateButtonStyles()
    const interval = setInterval(updateButtonStyles, 60000)

    return () => clearInterval(interval)
  }, [])

  return buttonStyles
}