'use client'

import type { BookMetadata, BookChapter } from './book-parsers'

/**
 * Client-side only PDF parser using PDF.js
 * This file is imported dynamically to avoid SSR issues
 */
export async function parsePDFAsBookClient(file: File): Promise<BookMetadata> {
  try {
    // Import PDF.js only when this function is called (client-side only)
    const pdfjs = await import('pdfjs-dist')

    // Set worker source using CDN
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

    const chapters: BookChapter[] = []

    // Create chapters from pages (group pages into chapters)
    const pagesPerChapter = 10
    const totalPages = pdf.numPages

    for (let chapterStart = 1; chapterStart <= totalPages; chapterStart += pagesPerChapter) {
      const chapterEnd = Math.min(chapterStart + pagesPerChapter - 1, totalPages)
      let chapterContent = ''

      // Extract text from pages in this chapter
      for (let pageNum = chapterStart; pageNum <= chapterEnd; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')

        chapterContent += pageText + '\n\n'
      }

      if (chapterContent.trim()) {
        chapters.push({
          id: `chapter-${chapterStart}`,
          title: `Pages ${chapterStart}-${chapterEnd}`,
          content: chapterContent.trim()
        })
      }
    }

    return {
      title: file.name.replace('.pdf', ''),
      author: 'Unknown Author',
      chapters
    }
  } catch (error) {
    console.error('Error parsing PDF as book:', error)
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
