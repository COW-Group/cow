"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  speakWithGuideVoice,
  stopSpeech,
  pauseSpeech,
  resumeSpeech,
  recordUserInteraction
} from "@/lib/speech-synthesis"
import { parseFile, parseMarkdown, isMarkdown } from "@/lib/file-parsers"
import { parseEPUB, parsePDFAsBook, splitTextIntoChapters, type BookMetadata } from "@/lib/book-parsers"
import BookReader from "@/components/book-reader"
import { Volume2, VolumeX, Mic, Pause, Play, Clock, Type, FileText, Keyboard, Upload, FileUp, X, BookOpen } from "lucide-react"

export default function TTSWithReader() {
  const [text, setText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [book, setBook] = useState<BookMetadata | null>(null)

  // Speech controls
  const [speechRate, setSpeechRate] = useState(1)
  const [speechPitch, setSpeechPitch] = useState(1)
  const [speechVolume, setSpeechVolume] = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    recordUserInteraction()
  }, [])

  useEffect(() => {
    const chars = text.length
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length
    const avgWordsPerMin = 150 * speechRate
    const estimatedMin = words / avgWordsPerMin

    setCharCount(chars)
    setWordCount(words)
    setEstimatedTime(estimatedMin)
  }, [text, speechRate])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (book) return // Disable shortcuts when book is open

      if (e.code === "Space" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault()
        if (isSpeaking && !isPaused) {
          handlePause()
        } else if (isPaused) {
          handleResume()
        } else if (text.trim()) {
          handleSpeak()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.code === "Enter") {
        e.preventDefault()
        handleSpeak()
      }
      if (e.code === "Escape") {
        e.preventDefault()
        handleStop()
      }
      if ((e.ctrlKey || e.metaKey) && e.code === "KeyK") {
        e.preventDefault()
        handleClear()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [text, isSpeaking, isPaused, book])

  const handleSpeak = async () => {
    if (!text.trim()) return

    setIsSpeaking(true)
    setIsPaused(false)

    await speakWithGuideVoice(
      text,
      "mauna",
      () => {
        setIsSpeaking(false)
        setIsPaused(false)
      },
      (error) => {
        console.error("Speech error:", error)
        setIsSpeaking(false)
        setIsPaused(false)
      },
      {
        rate: speechRate,
        pitch: speechPitch,
        volume: speechVolume
      }
    )
  }

  const handleStop = () => {
    stopSpeech()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const handlePause = () => {
    pauseSpeech()
    setIsPaused(true)
  }

  const handleResume = () => {
    resumeSpeech()
    setIsPaused(false)
  }

  const handleClear = () => {
    setText("")
    setUploadedFileName(null)
    setBook(null)
    stopSpeech()
    setIsSpeaking(false)
    setIsPaused(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase()

      if (fileExt === 'epub') {
        // Parse as EPUB book
        const bookData = await parseEPUB(file)
        setBook(bookData)
        setUploadedFileName(`${file.name} (EPUB Book)`)
      } else {
        // Regular file parsing (markdown, text)
        const result = await parseFile(file)
        setText(result.text)
        setUploadedFileName(`${result.fileName} (${result.fileType})`)
      }
    } catch (error) {
      console.error('File upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')
    if (isMarkdown(pastedText)) {
      e.preventDefault()
      const plainText = parseMarkdown(pastedText)
      setText(plainText)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)}s`
    }
    const mins = Math.floor(minutes)
    const secs = Math.round((minutes - mins) * 60)
    return `${mins}m ${secs}s`
  }

  // Show book reader if book is loaded
  if (book) {
    return <BookReader book={book} onClose={() => setBook(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4FC3E0] via-[#00A5CF] to-[#007BA7] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-montserrat drop-shadow-lg">
            Voice Synthesis Pro
          </h1>
          <p className="text-lg text-white/90 drop-shadow">
            Powered by MAUNA Group
          </p>
        </div>

        <Card className="glassmorphism shadow-2xl">
          {/* Header */}
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">
                    Advanced Text to Speech
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    EPUB & Markdown • Book Reader • Unlimited text
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Keyboard className="h-4 w-4" />
                Shortcuts
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6 bg-white/5">
            {/* Keyboard Shortcuts Info */}
            {showSettings && (
              <div className="bg-white/10 p-4 rounded-lg border border-white/20 backdrop-blur">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-white/90">
                  <div><kbd className="px-2 py-1 bg-white/20 rounded border border-white/30">Space</kbd> Play/Pause</div>
                  <div><kbd className="px-2 py-1 bg-white/20 rounded border border-white/30">Ctrl+Enter</kbd> Speak</div>
                  <div><kbd className="px-2 py-1 bg-white/20 rounded border border-white/30">Esc</kbd> Stop</div>
                  <div><kbd className="px-2 py-1 bg-white/20 rounded border border-white/30">Ctrl+K</kbd> Clear</div>
                </div>
              </div>
            )}

            {/* Text Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Type className="h-4 w-4" />
                  <span className="text-xs font-medium">CHARACTERS</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {charCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 text-white mb-1">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-medium">WORDS</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {wordCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">EST. TIME</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatTime(estimatedTime)}
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-white">Upload File (EPUB, Markdown, or Text)</Label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".epub,.md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </>
                  )}
                </Button>
                {uploadedFileName && (
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-md border border-white/20 backdrop-blur">
                    <FileUp className="h-4 w-4 text-white/80" />
                    <span className="text-sm text-white/90 truncate">{uploadedFileName}</span>
                    <button
                      onClick={() => {
                        setUploadedFileName(null)
                        setText('')
                        setBook(null)
                      }}
                      className="ml-auto text-white/70 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/70">
                EPUB opens in book reader • Markdown auto-converts • Unlimited text
              </p>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-white">
                Enter or paste your text (unlimited • Markdown supported)
              </Label>
              <Textarea
                id="text-input"
                placeholder="Type, paste markdown, or upload a file... No limits!"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={handlePaste}
                className="min-h-[250px] text-base bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur"
              />
            </div>

            {/* Voice Info */}
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Volume2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Mauna Voice</h3>
                  <p className="text-sm text-white/70">Natural sounding AI voice</p>
                </div>
              </div>
            </div>

            {/* Speech Controls */}
            <div className="space-y-4 bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
              <h3 className="font-semibold text-white">Speech Controls</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-white">Speed: {speechRate.toFixed(1)}x</Label>
                    <span className="text-xs text-white/70">0.5x - 2.0x</span>
                  </div>
                  <Slider
                    value={[speechRate]}
                    onValueChange={([value]) => setSpeechRate(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-white">Pitch: {speechPitch.toFixed(1)}</Label>
                    <span className="text-xs text-white/70">0.5 - 2.0</span>
                  </div>
                  <Slider
                    value={[speechPitch]}
                    onValueChange={([value]) => setSpeechPitch(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm text-white">Volume: {Math.round(speechVolume * 100)}%</Label>
                    <span className="text-xs text-white/70">0% - 100%</span>
                  </div>
                  <Slider
                    value={[speechVolume]}
                    onValueChange={([value]) => setSpeechVolume(value)}
                    min={0}
                    max={1}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <Button
                onClick={handleSpeak}
                disabled={!text.trim() || (isSpeaking && !isPaused)}
                className="col-span-2 h-14 text-base font-medium bg-white text-[#007BA7] hover:bg-white/90"
                size="lg"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                Speak
              </Button>

              {isSpeaking && !isPaused && (
                <Button
                  onClick={handlePause}
                  variant="secondary"
                  className="h-14 text-base bg-white/20 text-white hover:bg-white/30"
                  size="lg"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              )}

              {isPaused && (
                <Button
                  onClick={handleResume}
                  variant="secondary"
                  className="h-14 text-base bg-white/20 text-white hover:bg-white/30"
                  size="lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </Button>
              )}

              {!isSpeaking && (
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="h-14 text-base bg-white/10 border-white/20 text-white hover:bg-white/20"
                  disabled={!text}
                >
                  Clear
                </Button>
              )}

              <Button
                onClick={handleStop}
                disabled={!isSpeaking}
                variant="destructive"
                className="h-14 text-base bg-red-500/80 hover:bg-red-500"
                size="lg"
              >
                <VolumeX className="mr-2 h-5 w-5" />
                Stop
              </Button>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="bg-white/10 backdrop-blur px-6 py-4 rounded-b-lg border-t border-white/10">
            <div className="text-sm text-white/90 text-center space-y-1">
              <p className="font-medium">
                Using Mauna voice technology • EPUB book reader • Advanced controls
              </p>
              <p className="text-white/70">
                Upload EPUB books for immersive reading • Follow along with highlighting • Works offline as PWA
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/80 drop-shadow">
          <p>Part of the MAUNA Group ecosystem • v3.0.0 Reader Edition</p>
        </div>
      </div>
    </div>
  )
}
