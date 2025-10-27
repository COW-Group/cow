import React from 'react'

interface MarkdownProps {
  content: string
  className?: string
}

/**
 * Simple Markdown renderer for Moo responses
 * Handles: **bold**, *italic*, • bullets, — em dashes, code blocks
 */
export function Markdown({ content, className = '' }: MarkdownProps) {
  const renderContent = () => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeBlockLang = ''

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeBlockLang = line.trim().slice(3)
          codeBlockContent = []
        } else {
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto">
              <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                {codeBlockContent.join('\n')}
              </code>
            </pre>
          )
          inCodeBlock = false
          codeBlockContent = []
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Empty lines
      if (line.trim() === '') {
        elements.push(<br key={`br-${index}`} />)
        return
      }

      // Headers
      if (line.startsWith('###')) {
        const text = line.slice(3).trim()
        elements.push(
          <h3 key={index} className="text-lg font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {renderInlineMarkdown(text)}
          </h3>
        )
        return
      }

      if (line.startsWith('##')) {
        const text = line.slice(2).trim()
        elements.push(
          <h2 key={index} className="text-xl font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">
            {renderInlineMarkdown(text)}
          </h2>
        )
        return
      }

      // Bullets (• or -)
      if (line.trim().startsWith('•') || line.trim().startsWith('- ')) {
        const text = line.trim().startsWith('•') ? line.trim().slice(1).trim() : line.trim().slice(2).trim()
        elements.push(
          <div key={index} className="flex gap-2 my-1.5 ml-4">
            <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">•</span>
            <span className="text-gray-900 dark:text-gray-100">{renderInlineMarkdown(text)}</span>
          </div>
        )
        return
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="text-gray-900 dark:text-gray-100 my-2 leading-relaxed">
          {renderInlineMarkdown(line)}
        </p>
      )
    })

    return elements
  }

  const renderInlineMarkdown = (text: string) => {
    // Handle **bold**, *italic*, `code`, em dashes
    const parts: (string | JSX.Element)[] = []
    let remaining = text
    let keyCounter = 0

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index))
        }
        parts.push(
          <strong key={`bold-${keyCounter++}`} className="font-semibold text-gray-900 dark:text-gray-100">
            {boldMatch[1]}
          </strong>
        )
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
        continue
      }

      // Italic *text* (but not part of **)
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+?)\*(?!\*)/)
      if (italicMatch && italicMatch.index !== undefined) {
        if (italicMatch.index > 0) {
          parts.push(remaining.slice(0, italicMatch.index))
        }
        parts.push(
          <em key={`italic-${keyCounter++}`} className="italic">
            {italicMatch[1]}
          </em>
        )
        remaining = remaining.slice(italicMatch.index + italicMatch[0].length)
        continue
      }

      // Inline code `text`
      const codeMatch = remaining.match(/`(.+?)`/)
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remaining.slice(0, codeMatch.index))
        }
        parts.push(
          <code
            key={`code-${keyCounter++}`}
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100"
          >
            {codeMatch[1]}
          </code>
        )
        remaining = remaining.slice(codeMatch.index + codeMatch[0].length)
        continue
      }

      // No more matches, add the rest
      parts.push(remaining)
      break
    }

    return <>{parts}</>
  }

  return (
    <div className={`markdown-content ${className}`}>
      {renderContent()}
    </div>
  )
}
