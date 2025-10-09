"use client"

import { useState, useEffect } from "react"

const imageCategories = {
  sunrise: [
    "/images/nature-backdrops/sunrise/simon-maage-NcNu8kzunb4-unsplash.jpg",
    "/images/nature-backdrops/sunrise/simon-wilkes-WtjaOw9G5FA-unsplash.jpg",
    "/images/nature-backdrops/sunrise/damian-markutt-Dhmn6ete6g8-unsplash.jpg",
  ],
  morning: [
    "/images/nature-backdrops/morning/adam-kool-ndN00KmbJ1c-unsplash.jpg",
    "/images/nature-backdrops/morning/kalen-emsley-_LuLiJc1cdo-unsplash.jpg",
  ],
  daytime: ["/images/nature-backdrops/daytime/fadhil-abhimantra-fUfPX4zgOWo-unsplash.jpg"],
  sunset: [
    "/images/nature-backdrops/sunset/bruno-aguirre-CLmYbo-btDs-unsplash.jpg",
    "/images/nature-backdrops/sunset/harsh-jadav-ybw0y8C6clo-unsplash.jpg",
    "/images/nature-backdrops/sunset/sebastien-gabriel--IMlv9Jlb24-unsplash.jpg",
    "/images/nature-backdrops/sunset/paul-mocan-QnOdvmndfu4-unsplash.jpg",
    "/images/nature-backdrops/sunset/dave-hoefler-wW0_7-BEOPo-unsplash.jpg",
  ],
  evening: ["/images/nature-backdrops/evening/marek-piwnicki-5ViMa6gcpsQ-unsplash.jpg"],
  night: [
    "/images/nature-backdrops/night/vincentiu-solomon-ln5drpv_ImI-unsplash.jpg",
    "/images/nature-backdrops/night/cee-R_c77Rx9UzM-unsplash.jpg",
    "/images/nature-backdrops/night/krzysztof-kowalik-AywBz5soMy4-unsplash.jpg",
    "/images/nature-backdrops/night/shawn-shGeY3Tv1S0-unsplash.jpg",
  ],
}

type TimeCategory = keyof typeof imageCategories

const getTimeCategory = (hour: number): TimeCategory => {
  if (hour >= 5 && hour < 7) return "sunrise"
  if (hour >= 7 && hour < 11) return "morning"
  if (hour >= 11 && hour < 17) return "daytime"
  if (hour >= 17 && hour < 19) return "sunset"
  if (hour >= 19 && hour < 21) return "evening"
  return "night" // 9 PM to 5 AM
}

export default function DynamicParallaxBackground() {
  const [currentBackground, setCurrentBackground] = useState<string | null>(null)

  useEffect(() => {
    console.log("[useEffect] DynamicParallaxBackground component mounted or updated.")

    const updateBackground = () => {
      console.log("[updateBackground] Running background update logic.")

      // Check if running in browser
      if (typeof window === 'undefined') {
        console.log("[updateBackground] Not in browser environment, skipping")
        return
      }

      // Check if user has manually selected a background
      const userSelectedBackground = localStorage.getItem('userSelectedBackground')
      const userSelectedDate = localStorage.getItem('userSelectedBackgroundDate')
      const currentDateString = new Date().toDateString()

      // If user selected a background today, use it instead of automatic selection
      if (userSelectedBackground && userSelectedDate === currentDateString) {
        setCurrentBackground(userSelectedBackground)
        console.log("[updateBackground] Using user-selected background:", userSelectedBackground)
        return
      }

      // Clear old user selection if it's from a previous day
      if (userSelectedDate && userSelectedDate !== currentDateString) {
        localStorage.removeItem('userSelectedBackground')
        localStorage.removeItem('userSelectedBackgroundDate')
        console.log("[updateBackground] Cleared old user background selection")
      }

      const now = new Date()
      const hour = now.getHours()
      const category = getTimeCategory(hour)

      if (category === "night") {
        const storedNightImage = localStorage.getItem("lastSelectedNightImage")
        const storedNightDate = localStorage.getItem("lastSelectedNightDate")

        if (storedNightDate !== currentDateString || !storedNightImage) {
          // It's a new day for night, or no night image stored yet
          const nightImages = imageCategories.night
          if (nightImages && nightImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * nightImages.length)
            const selectedImage = nightImages[randomIndex]
            setCurrentBackground(selectedImage)
            localStorage.setItem("lastSelectedNightImage", selectedImage)
            localStorage.setItem("lastSelectedNightDate", currentDateString)
            console.log("[updateBackground] New night image selected:", selectedImage, "for date:", currentDateString)
          } else {
            console.warn("[updateBackground] No night images found for night category. Setting background to null.")
            setCurrentBackground(null)
          }
        } else {
          // Same night/day, use the stored image
          setCurrentBackground(storedNightImage)
          console.log("[updateBackground] Using stored night image:", storedNightImage)
        }
      } else {
        // Not night, select a random image for the current category
        const images = imageCategories[category]
        if (images && images.length > 0) {
          const randomIndex = Math.floor(Math.random() * images.length)
          const selectedImage = images[randomIndex]
          setCurrentBackground(selectedImage)
          console.log(`[updateBackground] Selected image for category '${category}':`, selectedImage)
        } else {
          console.warn(`[updateBackground] No images found for category: '${category}'. Setting background to null.`)
          setCurrentBackground(null)
        }
        // Clear night specific storage when not night, so a new one is picked next night
        localStorage.removeItem("lastSelectedNightImage")
        localStorage.removeItem("lastSelectedNightDate")
        console.log("[updateBackground] Cleared stored night image data for next night cycle.")
      }
    }

    updateBackground() // Set initial background
    const intervalId = setInterval(updateBackground, 60 * 1000) // Update every minute

    return () => {
      console.log("[useEffect] Cleaning up interval.")
      clearInterval(intervalId)
    }
  }, []) // Empty dependency array means this runs once on mount

  console.log("[render] currentBackground state:", currentBackground)

  return (
    <>
      <div
        className="parallax-container"
        style={currentBackground ? { backgroundImage: `url('${currentBackground}')` } : {}}
      />
      {/* iOS fallback background for background-attachment: fixed */}
      {currentBackground && (
        <div
          className="parallax-container-ios-fallback"
          style={{ backgroundImage: `url('${currentBackground}')` }}
        />
      )}
      {/* Overlay for text readability, placed above parallax-container */}
      <div className="absolute inset-0 bg-black/0 z-[-99]"></div>
    </>
  )
}
