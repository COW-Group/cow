// Remove the incorrect import from "web-audio-api"
// import {
//   type AudioContext,
//   type AnalyserNode,
//   SpeechSynthesisUtterance,
//   type SpeechSynthesisVoice,
// } from "web-audio-api"

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
const mediaStreamDestination: MediaStreamAudioDestinationNode | null = null // Use correct type for MediaStreamDestinationNode

function initializeAudioAnalysis() {
  if (typeof window === "undefined") return

  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    console.log("AudioContext initialized.")
  }

  if (!analyser) {
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Smaller FFT size for faster updates, fewer bins
    analyser.smoothingTimeConstant = 0.7 // Smooth out the data
    console.log("AnalyserNode initialized.")
  }

  // We need a MediaStreamDestination to capture the audio from SpeechSynthesisUtterance
  // However, SpeechSynthesisUtterance does not directly expose a MediaStream to connect.
  // This part of the Web Audio API integration with SpeechSynthesis is tricky and often requires
  // browser-specific workarounds or is not fully supported.
  // For now, we'll connect the analyser directly to the audio context's destination,
  // assuming the browser routes SpeechSynthesis output to the default audio output.
  // A more robust solution for direct analysis of TTS would involve a custom AudioWorklet
  // or a library that bridges this gap, which is beyond the scope of a simple fix.

  if (!mediaStreamDestination) {
    // This line is problematic as SpeechSynthesisUtterance doesn't directly connect to a MediaStreamDestination
    // For now, we'll comment out the direct connection attempt and rely on the analyser
    // picking up system audio if the browser routes TTS there, or focus on visual animation
    // driven by a simpler time-based or simulated audio input if direct analysis fails.
    // mediaStreamDestination = audioContext.createMediaStreamDestination();
    // console.log("MediaStreamDestinationNode initialized.");
  }

  // Connect analyser to speakers (default audio output)
  if (analyser.context.destination !== audioContext.destination) {
    analyser.connect(audioContext.destination)
    console.log("Analyser connected to AudioContext destination.")
  }

  // If we had a way to get a MediaStream from SpeechSynthesis, we would connect it here:
  // if (mediaStreamDestination) {
  //   mediaStreamDestination.connect(analyser);
  //   console.log("MediaStreamDestination connected to Analyser.");
  // }

  // Ensure audio context is running
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      console.log("AudioContext resumed successfully.")
    })
  }
}

export function getAudioFrequencyData(): Uint8Array | null {
  if (!analyser) {
    return null
  }
  const dataArray = new Uint8Array(analyser.frequencyBinCount)
  analyser.getByteFrequencyData(dataArray)
  return dataArray
}

export function speakText(text: string, voiceName?: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("SpeechSynthesis API not supported in this environment.")
    return
  }

  window.speechSynthesis.cancel() // Stop any ongoing speech before starting new one

  const utterance = new SpeechSynthesisUtterance(text)

  if (voiceName) {
    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = voices.find((voice) => voice.name === voiceName)
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log(`speakText: Using specific voice "${voiceName}"`)
    } else {
      console.warn(`speakText: Voice "${voiceName}" not found. Using default voice.`)
    }
  } else {
    console.log("speakText: Using default browser voice (no specific voiceName provided).")
  }

  utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
    // Use correct type
    console.error("SpeechSynthesisUtterance error:", event.error, "message:", event.message, "for text:", text)
  }

  // Direct connection of SpeechSynthesisUtterance to Web Audio API for analysis
  // is not straightforward and often not directly supported by browsers.
  // We rely on the analyser listening to the default audio output.
  window.speechSynthesis.speak(utterance)
  console.log(`speakText: Attempting to speak: "${text.substring(0, 50)}..."`)
}

export function stopSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return
  }
  window.speechSynthesis.cancel()
  console.log("stopSpeech: Speech cancelled.")
}

export async function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return []
  }
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices())
      window.speechSynthesis.onvoiceschanged = null
    }
  })
}

let mooVoice: SpeechSynthesisVoice | null = null
let voicesLoaded = false

function loadGuideVoices() {
  const voices = window.speechSynthesis.getVoices()

  if (voices.length === 0) {
    console.warn("loadGuideVoices: No voices available yet")
    return false
  }

  console.log(
    "loadGuideVoices: Available voices:",
    voices.map((v) => ({ name: v.name, lang: v.lang })),
  )

  // Helper function to find female voices
  const findFemaleVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // First, try to find explicitly female voices
    const explicitFemale = voices.find(
      (voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes("female"),
    )
    if (explicitFemale) {
      console.log("Found explicit female voice:", explicitFemale.name)
      return explicitFemale
    }

    // Then try common female voice names
    const femaleNames = ["zira", "susan", "samantha", "serena", "victoria", "karen", "hazel"]
    for (const name of femaleNames) {
      const found = voices.find((voice) => voice.lang.startsWith("en") && voice.name.toLowerCase().includes(name))
      if (found) {
        console.log("Found female voice by name:", found.name)
        return found
      }
    }

    // Finally, find any English voice that contains 'female' or common female indicators
    const female = voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        (voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman")),
    )
    if (female) {
      console.log("Found female English voice:", female.name)
      return female
    }

    console.warn("No suitable female voice found")
    return null
  }

  // Load Moo voice (female)
  mooVoice = findFemaleVoice(voices)

  voicesLoaded = true
  console.log("loadGuideVoices: Moo voice (Female) selected:", mooVoice?.name || "None found")

  return true
}

// Enhanced voice loading with retry mechanism
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (voicesLoaded && mooVoice) {
      resolve()
      return
    }

    const tryLoad = () => {
      if (loadGuideVoices()) {
        resolve()
      } else {
        // Retry after a short delay
        setTimeout(tryLoad, 100)
      }
    }

    tryLoad()
  })
}

let speechQueue: {
  text: string
  voice: SpeechSynthesisVoice | null
  onEnd?: () => void
  onError?: (error: string) => void
}[] = []
let isSpeaking = false
let userInteracted = false

// Updated function to support Moo guide voice (Female)
export async function speakWithGuideVoice(
  text: string,
  guideType: "Moo" | "moo",
  onEnd?: () => void,
  onError?: (error: string) => void,
) {
  console.log(`speakWithGuideVoice called with guideType: "${guideType}"`)

  // Ensure voices are loaded
  await ensureVoicesLoaded()

  const voice = mooVoice

  console.log(`Selected Moo voice (Female):`, voice?.name || "default")

  if (!voice) {
    console.warn(`No specific Moo voice found. Using default browser voice.`)
  }

  speakFullText(text, voice, onEnd, onError)
}

export const recordUserInteraction = () => {
  if (!userInteracted) {
    userInteracted = true
    console.log("User interaction recorded. Speech synthesis enabled.")
    // Resume audio context on user interaction
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed by user interaction.")
      })
    }
    // Process any queued speech that was waiting for user interaction
    if (speechQueue.length > 0 && !isSpeaking) {
      console.log("Processing queued speech after user interaction.")
      speakNextInQueue()
    }
  }
}

const speakNextInQueue = () => {
  if (speechQueue.length === 0 || isSpeaking) {
    return
  }

  if (!userInteracted) {
    console.warn("Speech synthesis blocked: No user interaction detected. Waiting for interaction.")
    return
  }

  const { text, voice, onEnd, onError } = speechQueue[0]
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = voice

  utterance.onend = () => {
    speechQueue.shift()
    isSpeaking = false
    onEnd?.()
    speakNextInQueue()
  }

  utterance.onerror = (event) => {
    console.error(
      `Speech synthesis error: ${event.error} for text: ${text.substring(0, 50)}... with voice: ${voice?.name || "default"}`,
    )
    speechQueue.shift()
    isSpeaking = false
    onError?.(event.error || "unknown error")
    speakNextInQueue()
  }

  isSpeaking = true
  window.speechSynthesis.speak(utterance)
  console.log(
    `speakNextInQueue: Speaking with voice: "${utterance.voice?.name || "default"}" for text: "${text.substring(0, 50)}..."`,
  )
}

export const speakFullText = (
  text: string,
  voice: SpeechSynthesisVoice | null,
  onEnd?: () => void,
  onError?: (error: string) => void,
) => {
  // Initialize audio analysis when speech starts
  initializeAudioAnalysis()
  speechQueue.push({ text, voice, onEnd, onError })
  if (!isSpeaking) {
    speakNextInQueue()
  }
}

export const clearQueue = () => {
  window.speechSynthesis.cancel()
  speechQueue = []
  isSpeaking = false
}

// Initial setup to record interaction on first user gesture
if (typeof window !== "undefined") {
  const handleFirstInteraction = () => {
    recordUserInteraction()
    window.removeEventListener("click", handleFirstInteraction)
    window.removeEventListener("keydown", handleFirstInteraction)
  }
  window.addEventListener("click", handleFirstInteraction, { once: true })
  window.addEventListener("keydown", handleFirstInteraction, { once: true })
}
