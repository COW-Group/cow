// Natural Speech Processor - Makes TTS sound more human and animated

interface SpeechChunk {
  text: string
  rate?: number
  pitch?: number
  volume?: number
  pauseAfter?: number // milliseconds
}

/**
 * Process text to add natural pauses, emphasis, and variation
 * to make speech sound more animated and less robotic
 */
export function processTextForNaturalSpeech(text: string): SpeechChunk[] {
  const chunks: SpeechChunk[] = []

  // Split text into sentences and phrases
  const sentences = splitIntoSentences(text)

  sentences.forEach((sentence, index) => {
    // Process each sentence for natural delivery
    const sentenceChunks = processSentence(sentence, index, sentences.length)
    chunks.push(...sentenceChunks)
  })

  return chunks
}

function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation while preserving it
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]
  return sentences.map(s => s.trim()).filter(s => s.length > 0)
}

function processSentence(sentence: string, sentenceIndex: number, totalSentences: number): SpeechChunk[] {
  const chunks: SpeechChunk[] = []

  // Detect sentence type for appropriate intonation
  const isQuestion = sentence.trim().endsWith('?')
  const isExclamation = sentence.trim().endsWith('!')
  const isEnding = sentenceIndex === totalSentences - 1

  // OPTIMIZATION: Don't split by commas - keep sentences whole for faster playback
  // Only apply prosody at the sentence level, not phrase level
  // This dramatically reduces chunk count and improves responsiveness

  const chunk: SpeechChunk = {
    text: sentence.trim(),
    rate: calculateNaturalRate(sentence, isQuestion, isExclamation),
    pitch: calculateNaturalPitch(sentence, isQuestion, isExclamation, true),
    volume: calculateNaturalVolume(sentence, isExclamation),
    pauseAfter: isEnding ? 300 : (isQuestion || isExclamation ? 350 : 300)
  }

  chunks.push(chunk)

  return chunks
}

function calculateNaturalRate(phrase: string, isQuestion: boolean, isExclamation: boolean): number {
  let baseRate = 1.0

  // Questions tend to be spoken slightly faster at the beginning
  if (isQuestion) {
    baseRate = 1.05
  }

  // Exclamations can vary - add some energy
  if (isExclamation) {
    baseRate = 1.1
  }

  // Longer phrases spoken slightly slower for clarity
  if (phrase.length > 100) {
    baseRate *= 0.95
  }

  // Add slight random variation for naturalness (±3%)
  const variation = (Math.random() - 0.5) * 0.06
  return Math.max(0.8, Math.min(1.3, baseRate + variation))
}

function calculateNaturalPitch(
  phrase: string,
  isQuestion: boolean,
  isExclamation: boolean,
  isLastPhrase: boolean
): number {
  let basePitch = 1.0

  // Questions rise in pitch, especially at the end
  if (isQuestion && isLastPhrase) {
    basePitch = 1.15
  } else if (isQuestion) {
    basePitch = 1.05
  }

  // Exclamations have higher pitch and more variation
  if (isExclamation) {
    basePitch = 1.12
  }

  // Statements end with falling pitch
  if (!isQuestion && isLastPhrase) {
    basePitch = 0.95
  }

  // Add subtle variation for naturalness (±2%)
  const variation = (Math.random() - 0.5) * 0.04
  return Math.max(0.8, Math.min(1.3, basePitch + variation))
}

function calculateNaturalVolume(phrase: string, isExclamation: boolean): number {
  let baseVolume = 1.0

  // Exclamations are louder
  if (isExclamation) {
    baseVolume = 1.0 // Keep at max
  }

  // Check for emphasis words (all caps, important words)
  if (/[A-Z]{3,}/.test(phrase)) {
    baseVolume = 1.0
  }

  return baseVolume
}

function calculateNaturalPause(phrase: string, isLastPhrase: boolean, isEnding: boolean): number {
  // Base pause after phrases
  let pause = 200 // ms

  // Longer pause after sentences
  if (isLastPhrase) {
    pause = 400
  }

  // Even longer pause at the end of the entire text
  if (isEnding && isLastPhrase) {
    pause = 500
  }

  // Commas get shorter pauses
  if (phrase.trim().endsWith(',')) {
    pause = 150
  }

  // Semicolons and colons get medium pauses
  if (phrase.trim().endsWith(';') || phrase.trim().endsWith(':')) {
    pause = 250
  }

  return pause
}

/**
 * Enhance voice selection to prefer higher-quality voices
 */
export function selectBestVoice(voices: SpeechSynthesisVoice[], preferFemale: boolean = true): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null

  // Priority list of high-quality voice identifiers
  const highQualityMarkers = [
    'premium', 'enhanced', 'neural', 'natural', 'high', 'quality',
    'google', 'microsoft', 'apple', 'siri', 'eloquence'
  ]

  // Gender preference
  const genderMarkers = preferFemale
    ? ['female', 'woman', 'samantha', 'zira', 'susan', 'serena', 'victoria', 'karen', 'hazel']
    : ['male', 'man', 'david', 'daniel', 'alex', 'fred', 'tom', 'james']

  // Filter for English voices
  const englishVoices = voices.filter(v => v.lang.startsWith('en'))

  if (englishVoices.length === 0) return voices[0]

  // Score each voice
  const scoredVoices = englishVoices.map(voice => {
    let score = 0
    const nameLower = voice.name.toLowerCase()

    // Prefer local voices (they're usually higher quality)
    if (voice.localService) score += 10

    // Check for high-quality markers
    highQualityMarkers.forEach(marker => {
      if (nameLower.includes(marker)) score += 5
    })

    // Check for gender preference
    genderMarkers.forEach(marker => {
      if (nameLower.includes(marker)) score += 3
    })

    // Prefer US English
    if (voice.lang === 'en-US') score += 2

    return { voice, score }
  })

  // Sort by score and return the best
  scoredVoices.sort((a, b) => b.score - a.score)

  console.log('Voice selection scores:', scoredVoices.map(v => ({
    name: v.voice.name,
    score: v.score,
    local: v.voice.localService
  })))

  return scoredVoices[0].voice
}

/**
 * Add emotion and emphasis to text
 */
export function addEmotionalContext(text: string): string {
  // This function can pre-process text to add hints for better delivery
  // For example, replacing certain patterns with more expressive alternatives

  let processed = text

  // Add slight pauses for better phrasing (using zero-width spaces or commas)
  // Replace multiple spaces with single space
  processed = processed.replace(/\s+/g, ' ')

  // Ensure proper spacing after punctuation
  processed = processed.replace(/([.!?])([A-Z])/g, '$1 $2')

  return processed
}
