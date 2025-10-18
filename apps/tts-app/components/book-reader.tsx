"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { BookMetadata } from "@/lib/book-parsers"
import {
  speakWithGuideVoice,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
} from "@/lib/speech-synthesis"
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Pause,
  Play,
  BookOpen,
  Settings2,
  X
} from "lucide-react"

interface BookReaderProps {
  book: BookMetadata
  onClose: () => void
}

export default function BookReader({ book, onClose }: BookReaderProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1)

  const contentRef = useRef<HTMLDivElement>(null)

  const currentChapter = book.chapters[currentChapterIndex]
  const hasNextChapter = currentChapterIndex < book.chapters.length - 1
  const hasPrevChapter = currentChapterIndex > 0

  // Split content into words for highlighting
  const words = currentChapter?.content.split(/\s+/) || []

  useEffect(() => {
    // Reset when chapter changes
    setHighlightedWordIndex(-1)
    if (isSpeaking) {
      stopSpeech()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [currentChapterIndex])

  const handleSpeak = async () => {
    if (!currentChapter) return

    setIsSpeaking(true)
    setIsPaused(false)
    setHighlightedWordIndex(0)

    // Simulate word-by-word highlighting
    const wordsToSpeak = currentChapter.content
    const wordCount = words.length
    const estimatedDuration = (wordCount / (150 * speechRate)) * 60 * 1000 // ms
    const timePerWord = estimatedDuration / wordCount

    const highlightInterval = setInterval(() => {
      setHighlightedWordIndex(prev => {
        const next = prev + 1
        if (next >= wordCount) {
          clearInterval(highlightInterval)
          return -1
        }
        return next
      })
    }, timePerWord)

    await speakWithGuideVoice(
      wordsToSpeak,
      "mauna",
      () => {
        clearInterval(highlightInterval)
        setIsSpeaking(false)
        setIsPaused(false)
        setHighlightedWordIndex(-1)
      },
      (error) => {
        console.error("Speech error:", error)
        clearInterval(highlightInterval)
        setIsSpeaking(false)
        setIsPaused(false)
        setHighlightedWordIndex(-1)
      },
      {
        rate: speechRate,
        pitch: 1,
        volume: 1
      }
    )
  }

  const handleStop = () => {
    stopSpeech()
    setIsSpeaking(false)
    setIsPaused(false)
    setHighlightedWordIndex(-1)
  }

  const handlePause = () => {
    pauseSpeech()
    setIsPaused(true)
  }

  const handleResume = () => {
    resumeSpeech()
    setIsPaused(false)
  }

  const handleNextChapter = () => {
    if (hasNextChapter) {
      setCurrentChapterIndex(prev => prev + 1)
      contentRef.current?.scrollTo(0, 0)
    }
  }

  const handlePrevChapter = () => {
    if (hasPrevChapter) {
      setCurrentChapterIndex(prev => prev - 1)
      contentRef.current?.scrollTo(0, 0)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-cream-25">
      {/* Top Bar */}
      <div className="glassmorphism border-b border-brushed-silver/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-ink-700 hover:text-ink-950"
          >
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-ink-950">{book.title}</h1>
            <p className="text-sm text-ink-600">{book.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Info */}
          <div className="flex items-center gap-2 bg-ink-50 rounded-lg px-3 py-1.5">
            <Volume2 className="h-4 w-4 text-ink-700" />
            <span className="text-sm font-medium text-ink-700">Mauna</span>
          </div>

          {/* Settings Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-ink-700"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="glassmorphism border-b border-brushed-silver/20 p-4 space-y-4">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div>
              <label className="text-sm font-medium text-ink-700">Font Size</label>
              <Slider
                value={[fontSize]}
                onValueChange={([value]) => setFontSize(value)}
                min={14}
                max={28}
                step={2}
                className="mt-2"
              />
              <span className="text-xs text-ink-600">{fontSize}px</span>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Line Height</label>
              <Slider
                value={[lineHeight]}
                onValueChange={([value]) => setLineHeight(value)}
                min={1.2}
                max={2.0}
                step={0.1}
                className="mt-2"
              />
              <span className="text-xs text-ink-600">{lineHeight.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Speed</label>
              <Slider
                value={[speechRate]}
                onValueChange={([value]) => setSpeechRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="mt-2"
              />
              <span className="text-xs text-ink-600">{speechRate.toFixed(1)}x</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Reading Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-8 bg-gradient-to-b from-cream-25 to-cream-50"
        >
          <div className="max-w-4xl mx-auto">
            {/* Chapter Title */}
            <h2 className="text-2xl font-bold text-ink-950 mb-6 font-montserrat">
              {currentChapter?.title}
            </h2>

            {/* Chapter Progress */}
            <div className="mb-4 text-sm text-ink-600">
              Chapter {currentChapterIndex + 1} of {book.chapters.length}
            </div>

            {/* Content with highlighting */}
            <div
              className="prose prose-lg max-w-none text-ink-800"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
              }}
            >
              {words.map((word, index) => (
                <span
                  key={index}
                  className={`${
                    highlightedWordIndex === index
                      ? 'bg-soft-gold/40 rounded px-1'
                      : ''
                  } transition-colors duration-150`}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="glassmorphism border-t border-brushed-silver/20 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevChapter}
              disabled={!hasPrevChapter}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextChapter}
              disabled={!hasNextChapter}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            {!isSpeaking ? (
              <Button
                onClick={handleSpeak}
                className="bg-logo-blue hover:bg-logo-blue/90"
                size="lg"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Read Aloud
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button
                    onClick={handlePause}
                    variant="secondary"
                    size="lg"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    variant="secondary"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Resume
                  </Button>
                )}
                <Button
                  onClick={handleStop}
                  variant="destructive"
                  size="lg"
                >
                  <VolumeX className="h-5 w-5 mr-2" />
                  Stop
                </Button>
              </>
            )}
          </div>

          {/* Chapter Info */}
          <div className="flex items-center gap-2 text-ink-600">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">
              {currentChapterIndex + 1}/{book.chapters.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
