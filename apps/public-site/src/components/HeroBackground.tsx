"use client"

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

        // Initialize Vanta effect
        if (mounted && elementRef.current && (window as any).VANTA?.CLOUDS) {
          vantaRef.current = (window as any).VANTA.CLOUDS({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            backgroundColor: 0xe6a632,
            skyColor: 0xe16611,
            cloudShadowColor: 0x3c5e84,
            sunColor: 0xe8dbd0,
            speed: 0.5,
          })
          console.log("Vanta.js CLOUDS effect initialized.")
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