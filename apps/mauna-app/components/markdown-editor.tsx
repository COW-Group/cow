"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Link,
  Eye,
  Edit
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import TextareaAutosize from "react-textarea-autosize"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minRows?: number
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minRows = 12,
  className = ""
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = useCallback((before: string, after: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const insertLinePrefix = useCallback((prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lines = value.split("\n")
    let currentPos = 0
    let lineIndex = 0

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (currentPos + lines[i].length >= start) {
        lineIndex = i
        break
      }
      currentPos += lines[i].length + 1 // +1 for newline
    }

    // Insert prefix at start of line
    lines[lineIndex] = prefix + lines[lineIndex]
    const newText = lines.join("\n")
    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }, [value, onChange])

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: Heading1, label: "Heading 1", action: () => insertLinePrefix("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertLinePrefix("## ") },
    { icon: Heading3, label: "Heading 3", action: () => insertLinePrefix("### ") },
    { icon: List, label: "Bullet List", action: () => insertLinePrefix("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertLinePrefix("1. ") },
    { icon: Quote, label: "Quote", action: () => insertLinePrefix("> ") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
  ]

  return (
    <div className={`space-y-2 ${className}`}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")}>
        <div className="flex items-center justify-between mb-2">
          <TabsList className="bg-cream-25/10">
            <TabsTrigger value="write" className="gap-2">
              <Edit className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="mt-0 space-y-2">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-cream-25/5 border border-cream-25/10">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon
              return (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="h-8 w-8 p-0 text-cream-25/70 hover:text-cream-25 hover:bg-cream-25/10"
                  title={button.label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* Textarea */}
          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            minRows={minRows}
            className="w-full px-4 py-3 rounded-lg bg-cream-25/10 border border-cream-25/20 text-cream-25 placeholder:text-cream-25/50 focus:outline-none focus:ring-2 focus:ring-vibrant-blue/50 resize-none font-inter"
            style={{
              lineHeight: "1.6",
              fontSize: "15px"
            }}
          />

          {/* Markdown Help */}
          <details className="text-xs text-cream-25/60">
            <summary className="cursor-pointer hover:text-cream-25">Markdown Cheatsheet</summary>
            <div className="mt-2 p-3 rounded-lg bg-cream-25/5 space-y-1 font-mono">
              <div><strong>**bold**</strong> or <strong>__bold__</strong></div>
              <div><em>*italic*</em> or <em>_italic_</em></div>
              <div># Heading 1</div>
              <div>## Heading 2</div>
              <div>### Heading 3</div>
              <div>- Bullet list</div>
              <div>1. Numbered list</div>
              <div>&gt; Blockquote</div>
              <div>`code`</div>
              <div>[Link](url)</div>
              <div>---  Horizontal rule</div>
            </div>
          </details>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[300px] p-4 rounded-lg bg-cream-25/5 border border-cream-25/10">
            {value ? (
              <div className="prose prose-invert prose-cream-25 max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-cream-25" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 text-cream-25" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 text-cream-25" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 text-cream-25/90 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 text-cream-25/90 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 text-cream-25/90 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-cream-25/90" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-vibrant-blue pl-4 italic my-4 text-cream-25/80" {...props} />
                    ),
                    code: ({node, inline, ...props}) =>
                      inline ? (
                        <code className="px-1.5 py-0.5 rounded bg-cream-25/20 text-cream-25 font-mono text-sm" {...props} />
                      ) : (
                        <code className="block p-3 rounded-lg bg-cream-25/20 text-cream-25 font-mono text-sm overflow-x-auto" {...props} />
                      ),
                    a: ({node, ...props}) => <a className="text-vibrant-blue hover:underline" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-6 border-cream-25/20" {...props} />,
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-cream-25/50 italic">Nothing to preview yet. Start writing in the Write tab!</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
