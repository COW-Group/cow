import { useEffect, useRef, useState } from "react"

export function ResearchHeroBackground() {
  const elementRef = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadVanta = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === "undefined") return

        // Load Three.js
        if (!(window as any).THREE) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
            script.onload = () => {
              console.log("Three.js loaded successfully.")
              resolve()
            }
            script.onerror = () => reject(new Error("Failed to load Three.js"))
            document.head.appendChild(script)
          })
        }

        // Load Vanta.js
        if (!(window as any).VANTA) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js"
            script.onload = () => {
              console.log("Vanta.js loaded successfully.")
              resolve()
            }
            script.onerror = () => reject(new Error("Failed to load Vanta.js"))
            document.head.appendChild(script)
          })
        }

        // Cerulean sky settings - bright, clear blue tones
        const ceruleanSettings = {
          backgroundColor: 0x007ba7,  // Cerulean blue
          skyColor: 0x3b82f6,         // Bright sky blue
          cloudShadowColor: 0x1e40af, // Deep blue
          sunColor: 0xffffff,         // Pure white (like sun through blue sky)
          speed: 0.6,                 // Slightly faster for energy
          sunlightColor: 0xe0f2fe,    // Very light blue (sky light)
          sunGlareColor: 0xbfdbfe,    // Light blue glare
          sunIntensity: 1.2           // Brighter for clarity
        }

        // Initialize Vanta effect
        if (mounted && elementRef.current && (window as any).VANTA?.CLOUDS) {
          vantaRef.current = (window as any).VANTA.CLOUDS({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: ceruleanSettings.backgroundColor,
            skyColor: ceruleanSettings.skyColor,
            cloudShadowColor: ceruleanSettings.cloudShadowColor,
            sunColor: ceruleanSettings.sunColor,
            speed: ceruleanSettings.speed,
            sunlightColor: ceruleanSettings.sunlightColor,
            sunGlareColor: ceruleanSettings.sunGlareColor,
            sunIntensity: ceruleanSettings.sunIntensity,
          })
          console.log("Vanta.js CLOUDS effect initialized with cerulean settings:", ceruleanSettings)
        }
      } catch (error) {
        console.warn("Vanta.js failed to load, using fallback:", error)
        if (mounted) {
          setFallback(true)
        }
      }
    }

    loadVanta()

    return () => {
      mounted = false
      if (vantaRef.current?.destroy) {
        try {
          vantaRef.current.destroy()
          console.log("Vanta effect destroyed.")
        } catch (error) {
          console.warn("Error destroying Vanta effect:", error)
        }
      }
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${fallback ? "vanta-fallback" : ""}`}
      style={
        fallback
          ? {
              background: "linear-gradient(135deg, #007ba7 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #007ba7 100%)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
            }
          : undefined
      }
    />
  )
}
