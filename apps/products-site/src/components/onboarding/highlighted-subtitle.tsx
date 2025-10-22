// "use client" - Not needed in React (Next.js specific)

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HighlightedSubtitleProps {
  text?: string
  highlightWords?: string[]
  isAnimating: boolean
  className?: string
}

export const HighlightedSubtitle: React.FC<HighlightedSubtitleProps> = ({
  text = "",
  highlightWords = [],
  isAnimating,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Typing animation effect
  useEffect(() => {
    const safeText = text || ""

    if (!isAnimating) {
      setDisplayedText(safeText)
      return
    }

    setDisplayedText("")
    setCurrentIndex(0)

    const typingInterval = setInterval(() => {
      if (currentIndex < safeText.length) {
        setDisplayedText((prev) => prev + safeText[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      } else {
        clearInterval(typingInterval)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [text, isAnimating, currentIndex])

  // Function to highlight words
  const highlightText = (inputText: string) => {
    const safeText = inputText || ""

    if (!Array.isArray(highlightWords) || highlightWords.length === 0) {
      return safeText
    }

    let result = safeText

    // Sort highlight words by length (descending) to avoid partial matches
    const sortedHighlightWords = [...highlightWords].sort((a, b) => b.length - a.length)

    // Use a temporary map to store highlighted segments and their placeholders
    const highlightedSegments = new Map<string, string>()
    let placeholderId = 0

    for (const word of sortedHighlightWords) {
      if (word && typeof word === "string") {
        // Escape special characters in the word for use in RegExp
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`\\b${escapedWord}\\b`, "gi")

        // Replace the word with a unique placeholder to prevent re-matching
        result = result.replace(regex, (match) => {
          const placeholder = `__HIGHLIGHT_PLACEHOLDER_${placeholderId++}__`
          highlightedSegments.set(placeholder, `<span class="highlight">${match}</span>`)
          return placeholder
        })
      }
    }

    // After all words are replaced with placeholders, replace placeholders with actual HTML
    highlightedSegments.forEach((htmlString, placeholder) => {
      result = result.replace(placeholder, htmlString)
    })

    return result
  }

  return (
    <motion.div
      className={`text-center text-slate-800 dark:text-white text-lg font-medium ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p
        dangerouslySetInnerHTML={{ __html: highlightText(displayedText) }}
        className="[&_.highlight]:text-[#0066FF] [&_.highlight]:dark:text-emerald-400 [&_.highlight]:font-bold"
      />

      {isAnimating && text && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block ml-1"
        >
          |
        </motion.span>
      )}
    </motion.div>
  )
}
