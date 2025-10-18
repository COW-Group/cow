import ePub from 'epubjs'

export interface BookChapter {
  id: string
  title: string
  content: string
  href?: string
}

export interface BookMetadata {
  title: string
  author: string
  cover?: string
  chapters: BookChapter[]
}

/**
 * Parse EPUB file and extract chapters
 */
export async function parseEPUB(file: File): Promise<BookMetadata> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const book = ePub(arrayBuffer)

    await book.ready

    // Get metadata
    const metadata = await book.loaded.metadata
    const title = metadata.title || 'Untitled Book'
    const author = metadata.creator || 'Unknown Author'

    // Get cover
    let cover: string | undefined
    try {
      const coverUrl = await book.coverUrl()
      if (coverUrl) {
        cover = coverUrl.toString()
      }
    } catch (e) {
      console.log('No cover found')
    }

    // Get navigation/chapters
    const navigation = await book.loaded.navigation
    const toc = navigation.toc

    // Extract chapters
    const chapters: BookChapter[] = []

    for (let i = 0; i < toc.length; i++) {
      const tocItem = toc[i]

      try {
        // Load the chapter content
        const section = book.spine.get(tocItem.href)
        if (section) {
          await section.load(book.load.bind(book))

          // Get text content
          const doc = section.document
          const textContent = doc?.body?.textContent || ''

          chapters.push({
            id: tocItem.id || `chapter-${i}`,
            title: tocItem.label || `Chapter ${i + 1}`,
            content: textContent.trim(),
            href: tocItem.href
          })

          // Unload to free memory
          section.unload()
        }
      } catch (error) {
        console.error(`Error loading chapter ${i}:`, error)
      }
    }

    // If no TOC, try to get all spine items
    if (chapters.length === 0) {
      const spineItems = book.spine.items
      for (let i = 0; i < Math.min(spineItems.length, 50); i++) {
        const section = spineItems[i]
        try {
          await section.load(book.load.bind(book))
          const doc = section.document
          const textContent = doc?.body?.textContent || ''

          if (textContent.trim().length > 100) {
            chapters.push({
              id: section.idref || `chapter-${i}`,
              title: `Chapter ${i + 1}`,
              content: textContent.trim()
            })
          }

          section.unload()
        } catch (error) {
          console.error(`Error loading spine item ${i}:`, error)
        }
      }
    }

    return {
      title,
      author,
      cover,
      chapters
    }
  } catch (error) {
    console.error('Error parsing EPUB:', error)
    throw new Error('Failed to parse EPUB file. Please ensure it\'s a valid EPUB.')
  }
}

/**
 * Parse PDF into book chapters (by pages or sections)
 * This dynamically imports the client-side PDF parser to avoid SSR issues
 */
export async function parsePDFAsBook(file: File): Promise<BookMetadata> {
  // Check if running in browser
  if (typeof window === 'undefined') {
    throw new Error('PDF parsing is only available in the browser')
  }

  try {
    // Dynamically import the client-side PDF parser
    const { parsePDFAsBookClient } = await import('./pdf-parser-client')
    return await parsePDFAsBookClient(file)
  } catch (error) {
    console.error('Error parsing PDF as book:', error)
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Split long text into chapters for better reading
 */
export function splitTextIntoChapters(
  text: string,
  fileName: string,
  wordsPerChapter: number = 1500
): BookMetadata {
  const words = text.split(/\s+/)
  const chapters: BookChapter[] = []

  let chapterNum = 1
  for (let i = 0; i < words.length; i += wordsPerChapter) {
    const chapterWords = words.slice(i, i + wordsPerChapter)
    const chapterContent = chapterWords.join(' ')

    chapters.push({
      id: `chapter-${chapterNum}`,
      title: `Part ${chapterNum}`,
      content: chapterContent
    })

    chapterNum++
  }

  return {
    title: fileName.replace(/\.[^/.]+$/, ''),
    author: 'Unknown Author',
    chapters
  }
}
