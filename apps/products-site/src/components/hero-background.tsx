import { useEffect, useRef, useState } from "react"

export function HeroBackground() {
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

        // Custom color scheme
        const getNaturalCOWSettings = () => {
          return {
            // White background
            backgroundColor: 0xffffff,  // White

            // Mid-tone cerulean
            skyColor: 0x0096C7,         // Mid Cerulean

            // Light blue-grey clouds with dark blue shadows
            cloudColor: 0xadc1de,       // Light blue-grey
            cloudShadowColor: 0x183550, // Dark blue

            // Orange sun
            sunColor: 0xff9919,         // Orange

            // Orange sunlight
            sunlightColor: 0xff9933,    // Orange

            // Calm movement
            speed: 0.3
          }
        }

        // Initialize Vanta effect with natural COW colors
        if (mounted && elementRef.current && (window as any).VANTA?.CLOUDS) {
          const settings = getNaturalCOWSettings()
          vantaRef.current = (window as any).VANTA.CLOUDS({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: settings.backgroundColor,
            skyColor: settings.skyColor,
            cloudColor: settings.cloudColor,
            cloudShadowColor: settings.cloudShadowColor,
            sunColor: settings.sunColor,
            sunlightColor: settings.sunlightColor,
            speed: settings.speed,
          })
          console.log("Vanta.js CLOUDS initialized with natural COW zen colors:", settings)
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
              // Natural fallback gradient with COW colors
              background: "linear-gradient(to bottom, #4FC3E0 0%, #B0E0E6 40%, #C9B8A8 100%)",
            }
          : undefined
      }
    />
  )
}
