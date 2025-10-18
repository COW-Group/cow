"use client"

import type React from "react"
import { useRef, useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import { Color, MathUtils, Vector3 } from "@/lib/three-utils"
import { useGuideSpeech } from "@/hooks/use-guide-speech"
import { type GuideType } from "@/contexts/onboarding-context"
import { getAudioFrequencyData } from "@/lib/speech-synthesis" // Import the new function

interface AnimatedOrbProps {
  isActive: boolean
  guideType: GuideType | null
  speechText: string
  autoPlay?: boolean
  children?: React.ReactNode
}

// Custom theme colors based on the provided image
const ORB_COLORS = {
  base: "#005F7F", // Darker blue for the core
  glow: "#00D4FF", // Bright cyan-blue for the main glow/ring
  wave: "#00D4FF", // Same as glow for wave rings
  accentRed: "#FF0055", // For the subtle red hues
}

interface SiriOrbProps {
  isSpeaking: boolean
  guideType: GuideType | null
}

const SiriOrb: React.FC<SiriOrbProps> = ({ isSpeaking, guideType }) => {
  const mainOrbRef = useRef<any>(null!)
  const wave1Ref = useRef<any>(null!)
  const wave2Ref = useRef<any>(null!)
  const wave3Ref = useRef<any>(null!)
  const redLightRef = useRef<any>(null!) // Ref for the red light

  const baseColor = useMemo(() => new Color(ORB_COLORS.base), [])
  const glowColor = useMemo(() => new Color(ORB_COLORS.glow), [])
  const waveColor = useMemo(() => new Color(ORB_COLORS.wave), [])
  const accentRedColor = useMemo(() => new Color(ORB_COLORS.accentRed), [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const frequencyData = getAudioFrequencyData()
    let overallAmplitude = 0
    let bassAmplitude = 0

    if (frequencyData) {
      // Calculate overall amplitude (average of all frequencies)
      for (let i = 0; i < frequencyData.length; i++) {
        overallAmplitude += frequencyData[i]
      }
      overallAmplitude /= frequencyData.length
      overallAmplitude = overallAmplitude / 255 // Normalize to 0-1

      // Calculate bass amplitude (average of lower frequencies, e.g., first 10-20 bins)
      const bassBins = Math.min(20, frequencyData.length) // Adjust as needed
      for (let i = 0; i < bassBins; i++) {
        bassAmplitude += frequencyData[i]
      }
      bassAmplitude /= bassBins
      bassAmplitude = bassAmplitude / 255 // Normalize to 0-1
    }

    // Map amplitude to animation intensity
    const speakingIntensity = isSpeaking ? 1 : 0 // Base intensity if speaking
    const audioDrivenIntensity = MathUtils.lerp(0, 1, overallAmplitude * 1.5) // Amplify audio effect
    const currentIntensity = Math.max(speakingIntensity, audioDrivenIntensity) // Use max of speaking or audio

    const bassDrivenWaveStrength = MathUtils.lerp(0, 1, bassAmplitude * 2) // Bass makes waves stronger

    // Main orb subtle breathing and glow
    if (mainOrbRef.current) {
      const breathScale = 1 + Math.sin(time * 2) * 0.02 * (1 + currentIntensity * 0.5) // Subtle breathing, more with intensity
      mainOrbRef.current.scale.lerp(new Vector3(breathScale, breathScale, breathScale), 0.1)
      mainOrbRef.current.material.emissiveIntensity = MathUtils.lerp(0.1, 0.5, currentIntensity) // Orb glows more with sound
    }

    // Animated wave rings when speaking or with audio input
    if (wave1Ref.current) {
      const wave1Scale = 1.2 + Math.sin(time * 3 + bassDrivenWaveStrength * 2) * 0.15 * (1 + bassDrivenWaveStrength)
      wave1Ref.current.scale.lerp(new Vector3(wave1Scale, wave1Scale, wave1Scale), 0.1)
      wave1Ref.current.material.opacity = MathUtils.lerp(
        0,
        0.4,
        currentIntensity * (0.5 + bassDrivenWaveStrength * 0.5),
      )
    }

    if (wave2Ref.current) {
      const wave2Scale =
        1.4 + Math.sin(time * 2.5 + 1 + bassDrivenWaveStrength * 2) * 0.2 * (1 + bassDrivenWaveStrength)
      wave2Ref.current.scale.lerp(new Vector3(wave2Scale, wave2Scale, wave2Scale), 0.1)
      wave2Ref.current.material.opacity = MathUtils.lerp(
        0,
        0.3,
        currentIntensity * (0.4 + bassDrivenWaveStrength * 0.5),
      )
    }

    if (wave3Ref.current) {
      const wave3Scale = 1.6 + Math.sin(time * 2 + 2 + bassDrivenWaveStrength * 2) * 0.25 * (1 + bassDrivenWaveStrength)
      wave3Ref.current.scale.lerp(new Vector3(wave3Scale, wave3Scale, wave3Scale), 0.1)
      wave3Ref.current.material.opacity = MathUtils.lerp(
        0,
        0.2,
        currentIntensity * (0.3 + bassDrivenWaveStrength * 0.5),
      )
    }

    // Red accent light
    if (redLightRef.current) {
      // Position the light slightly off-center to create edge highlights
      redLightRef.current.position.set(
        Math.sin(time * 0.5) * 0.5,
        Math.cos(time * 0.7) * 0.5,
        Math.sin(time * 0.3) * 0.5,
      )
      // Intensity driven by overall amplitude, subtle
      redLightRef.current.intensity = MathUtils.lerp(0.05, 0.3, overallAmplitude * 2)
    }
  })

  return (
    <group>
      {/* Main Orb - Darker center, glowing edges */}
      <Sphere ref={mainOrbRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={baseColor} // Darker blue core
          emissive={glowColor} // Bright cyan glow
          emissiveIntensity={0.1} // Base glow intensity, will be animated
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>

      {/* Red accent light for subtle hues */}
      <pointLight ref={redLightRef} color={accentRedColor} intensity={0.05} distance={3} decay={2} />

      {/* Wave ring 1 */}
      <Sphere ref={wave1Ref} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color={waveColor} transparent opacity={0} wireframe={true} />
      </Sphere>

      {/* Wave ring 2 */}
      <Sphere ref={wave2Ref} args={[1, 24, 24]} position={[0, 0, 0]}>
        <meshBasicMaterial color={waveColor} transparent opacity={0} wireframe={true} />
      </Sphere>

      {/* Wave ring 3 */}
      <Sphere ref={wave3Ref} args={[1, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color={waveColor} transparent opacity={0} wireframe={true} />
      </Sphere>
    </group>
  )
}

export const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  isActive,
  guideType,
  speechText,
  autoPlay = false,
  children,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const { speak, stop } = useGuideSpeech({
    autoPlayText: speechText,
    autoPlayGuideType: guideType,
    onSpeechStart: () => setIsSpeaking(true),
    onSpeechEnd: () => setIsSpeaking(false),
  })

  // Ensure speech stops if component becomes inactive
  useEffect(() => {
    if (!isActive) {
      stop()
    }
  }, [isActive, stop])

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const containerVariants = {
    active: {
      scale: 1,
      filter: `drop-shadow(0px 0px 20px ${ORB_COLORS.glow})`, // Use the new glow color
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    inactive: {
      scale: 1,
      filter: `drop-shadow(0px 0px 10px ${ORB_COLORS.glow}33)`, // Lighter shadow for inactive
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto">
      <motion.div
        className="relative w-48 h-48 rounded-full flex items-center justify-center overflow-hidden"
        variants={containerVariants}
        animate={isActive ? "active" : "inactive"}
        style={{
          background: `radial-gradient(circle, ${ORB_COLORS.base}1A 0%, ${ORB_COLORS.base}0D 70%, transparent 100%)`, // Use base color for background gradient
        }}
      >
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={0.6} color={ORB_COLORS.glow} /> {/* Main light */}
            <pointLight position={[-5, -5, 5]} intensity={0.3} color={ORB_COLORS.wave} /> {/* Secondary light */}
            <SiriOrb isSpeaking={isSpeaking} guideType={guideType} />
          </Canvas>
        </div>
      </motion.div>

      <div className="mt-8 text-lg text-center text-ink-600 dark:text-cream-300 mb-8">{children}</div>
    </div>
  )
}
