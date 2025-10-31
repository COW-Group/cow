import { useEffect, useRef, useState } from "react"

export function VantaBackground() {
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

        // Get time-based colors and settings
        const getTimeBasedSettings = () => {
          const hour = new Date().getHours()

          if (hour >= 5 && hour < 8) {
            // Dawn - Soft pastels with warm pinks and light blues
            return {
              backgroundColor: 0xffd4a3,  // Soft peach
              skyColor: 0xff9a8b,         // Warm coral
              cloudShadowColor: 0x6b8db5, // Soft blue-gray
              sunColor: 0xffeaa7,         // Gentle yellow
              speed: 0.3,                 // Slower for peaceful dawn
              sunlightColor: 0xfff8dc     // Soft cream sunlight
            }
          } else if (hour >= 8 && hour < 12) {
            // Morning - Bright and fresh
            return {
              backgroundColor: 0x87ceeb,  // Sky blue
              skyColor: 0x4682b4,         // Steel blue
              cloudShadowColor: 0x2f4f4f, // Dark slate gray
              sunColor: 0xffd700,         // Pure gold
              speed: 0.4,                 // Gentle morning breeze
              sunlightColor: 0xfffacd     // Light golden sunlight
            }
          } else if (hour >= 12 && hour < 17) {
            // Afternoon - Warm and energetic (Enhanced Original)
            return {
              backgroundColor: 0xf2b840,  // Golden
              skyColor: 0xf0720d,         // Orange-red
              cloudShadowColor: 0x2d4a6b, // Deep blue
              sunColor: 0xfff2dc,         // Bright cream
              speed: 0.5,                 // Normal speed
              sunlightColor: 0xffeaa7     // Warm afternoon light
            }
          } else if (hour >= 17 && hour < 20) {
            // Sunset - Original Enhanced Vibrant Settings (The Best!)
            return {
              backgroundColor: 0xf2b840,  // Brighter golden
              skyColor: 0xf0720d,         // Vibrant orange-red
              cloudShadowColor: 0x2d4a6b, // Deeper blue
              sunColor: 0xfff2dc,         // Brighter cream
              speed: 0.5                  // Original speed
            }
          } else if (hour >= 20 && hour < 22) {
            // Dusk - Deep blues and purples
            return {
              backgroundColor: 0x2d3436,  // Dark gray-blue
              skyColor: 0x6c5ce7,         // Purple
              cloudShadowColor: 0x2d3436, // Darker gray
              sunColor: 0xe17055,         // Muted orange
              speed: 0.4,                 // Calm dusk
              sunlightColor: 0xf39c12     // Warm dusk light
            }
          } else {
            // Night - Realistic dark blues and grays like real night sky
            return {
              backgroundColor: 0x141852,  // Space cadet (natural night sky)
              skyColor: 0x2B2F77,         // St. Patrick's blue (realistic night blue)
              cloudShadowColor: 0x4a4a4a, // Dark gray (real cloud shadows at night)
              sunColor: 0xf5f5dc,         // Beige (soft moonlight color)
              speed: 0.4,                 // Calm night movement
              sunlightColor: 0xe6e6fa     // Lavender (gentle moonlight)
            }
          }
        }

        // Initialize Vanta effect
        if (mounted && elementRef.current && (window as any).VANTA?.CLOUDS) {
          const settings = getTimeBasedSettings()
          vantaRef.current = (window as any).VANTA.CLOUDS({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: settings.backgroundColor,
            skyColor: settings.skyColor,
            cloudShadowColor: settings.cloudShadowColor,
            sunColor: settings.sunColor,
            speed: settings.speed || 0.5,
            sunlightColor: settings.sunlightColor,
            sunGlareColor: settings.sunGlareColor,
            sunIntensity: settings.sunIntensity || 1.0,
          })
          console.log("Vanta.js CLOUDS effect initialized with sunshine settings:", settings)
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
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #3d3d3d 50%, #2d2d2d 75%, #1a1a1a 100%)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
            }
          : undefined
      }
    />
  )
}