import { marked } from 'marked'

/**
 * Parse PDF file and extract text content
 * Note: PDF parsing is currently disabled due to library compatibility issues with Next.js
 */
export async function parsePDF(file: File): Promise<string> {
  throw new Error('PDF text extraction is currently unavailable. Please use EPUB format for book reading, or convert your PDF to text/markdown.')
}

/**
 * Parse markdown and convert to plain text for TTS
 */
export function parseMarkdown(markdown: string): string {
  try {
    // Configure marked to output plain text
    marked.setOptions({
      breaks: true,
      gfm: true,
    })

    // Convert markdown to HTML first
    const html = marked.parse(markdown) as string

    // Strip HTML tags to get plain text
    const plainText = html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace nbsp
      .replace(/&amp;/g, '&') // Replace amp
      .replace(/&lt;/g, '<') // Replace lt
      .replace(/&gt;/g, '>') // Replace gt
      .replace(/&quot;/g, '"') // Replace quot
      .replace(/&#39;/g, "'") // Replace apos
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .trim()

    return plainText
  } catch (error) {
    console.error('Error parsing markdown:', error)
    throw new Error('Failed to parse markdown content.')
  }
}

/**
 * Parse text file
 */
export async function parseTextFile(file: File): Promise<string> {
  try {
    const text = await file.text()
    return text.trim()
  } catch (error) {
    console.error('Error reading text file:', error)
    throw new Error('Failed to read text file.')
  }
}

/**
 * Detect if text contains markdown
 */
export function isMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/, // Headers
    /\*\*.*\*\*/, // Bold
    /_.*_/, // Italic
    /\[.*\]\(.*\)/, // Links
    /^[-*+]\s/, // Lists
    /^>\s/, // Blockquotes
    /```/, // Code blocks
    /`[^`]+`/, // Inline code
  ]

  return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Main file parser - automatically detects file type and parses accordingly
 */
export async function parseFile(file: File): Promise<{
  text: string
  fileType: string
  fileName: string
}> {
  const fileName = file.name
  const fileExt = fileName.split('.').pop()?.toLowerCase()

  let text = ''
  let fileType = 'unknown'

  if (fileExt === 'md' || fileExt === 'markdown') {
    const rawText = await parseTextFile(file)
    text = parseMarkdown(rawText)
    fileType = 'Markdown'
  } else if (fileExt === 'txt') {
    text = await parseTextFile(file)
    fileType = 'Text'
  } else {
    // Try to read as text anyway
    text = await parseTextFile(file)

    // Check if it's markdown
    if (isMarkdown(text)) {
      text = parseMarkdown(text)
      fileType = 'Markdown (detected)'
    } else {
      fileType = 'Text'
    }
  }

  return {
    text,
    fileType,
    fileName
  }
}
