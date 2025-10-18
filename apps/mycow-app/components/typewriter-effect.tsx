"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypewriterEffectProps {
  words: string[]
  speed?: number // milliseconds per character
  delay?: number // delay before starting
  loop?: boolean
  className?: string
}

export function TypewriterEffect({ words, speed = 70, delay = 0, loop = true, className }: TypewriterEffectProps) {
  const [currentText, setCurrentText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const type = () => {
      const currentWord = words[wordIndex]
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
        if (charIndex === 0) {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        setCurrentText(currentWord.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
        if (charIndex === currentWord.length) {
          if (loop) {
            setIsDeleting(true)
          } else {
            // If not looping, stop at the end of the last word
            if (wordIndex === words.length - 1) return
            setIsDeleting(true)
          }
        }
      }
    }

    const timer = setTimeout(
      type,
      isDeleting ? speed / 2 : speed, // Faster deletion
    )

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, wordIndex, words, speed, loop])

  // Initial delay before starting the effect
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      // Start typing
    }, delay)
    return () => clearTimeout(initialTimer)
  }, [delay])

  return (
    <motion.span className={className} aria-live="polite">
      {currentText}
      <motion.span
        className="inline-block w-0.5 h-full bg-ink-600 dark:bg-cream-300 ml-1 align-middle"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </motion.span>
  )
}
