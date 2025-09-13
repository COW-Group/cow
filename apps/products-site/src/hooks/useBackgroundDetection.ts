import { useState, useEffect, useCallback } from 'react'

interface BackgroundDetection {
  backgroundType: 'light' | 'medium' | 'dark'
  isVeryLight: boolean
  isVeryDark: boolean
  averageBrightness: number
}

export const useBackgroundDetection = () => {
  const [backgroundDetection, setBackgroundDetection] = useState<BackgroundDetection>({
    backgroundType: 'medium',
    isVeryLight: false,
    isVeryDark: false,
    averageBrightness: 0.5
  })

  const analyzeBackground = useCallback(() => {
    try {
      // Create a canvas to sample the background
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 100
      canvas.height = 100

      // Sample the area behind the navigation (top center of viewport)
      const sampleArea = {
        x: window.innerWidth / 2 - 50,
        y: 50,
        width: 100,
        height: 100
      }

      // Use html2canvas-like approach to sample background
      // For now, we'll use a simpler heuristic based on scroll position and time
      // This could be enhanced with actual canvas sampling in production
      
      const scrollPosition = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollRatio = scrollPosition / Math.max(maxScroll, 1)
      
      // Simulate varying background brightness based on scroll and Vanta.js behavior
      // Vanta.js typically creates darker areas in clouds and lighter sky areas
      const timeVariation = (Date.now() % 10000) / 10000 // 10-second cycle
      const cloudDensity = Math.sin(scrollRatio * Math.PI + timeVariation * Math.PI * 2) * 0.3 + 0.5
      
      // Calculate brightness (0 = dark, 1 = light)
      const brightness = 0.3 + cloudDensity * 0.4 // Range: 0.3 to 0.7 (sky-like)
      
      let backgroundType: 'light' | 'medium' | 'dark' = 'medium'
      
      if (brightness > 0.6) {
        backgroundType = 'light'
      } else if (brightness < 0.4) {
        backgroundType = 'dark'
      }

      setBackgroundDetection({
        backgroundType,
        isVeryLight: brightness > 0.7,
        isVeryDark: brightness < 0.3,
        averageBrightness: brightness
      })
      
    } catch (error) {
      console.warn('Background detection failed:', error)
      // Fallback to medium background
      setBackgroundDetection({
        backgroundType: 'medium',
        isVeryLight: false,
        isVeryDark: false,
        averageBrightness: 0.5
      })
    }
  }, [])

  useEffect(() => {
    // Initial analysis
    analyzeBackground()

    // Analyze on scroll (throttled)
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(analyzeBackground, 100)
    }

    // Analyze periodically for Vanta.js animation changes
    const interval = setInterval(analyzeBackground, 2000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', analyzeBackground)

    return () => {
      clearTimeout(scrollTimeout)
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', analyzeBackground)
    }
  }, [analyzeBackground])

  return backgroundDetection
}