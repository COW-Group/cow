"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { JournalEntry, VisionBoardSection } from "@/lib/types"

interface SearchResultsModalProps {
  results: JournalEntry[]
  onSelectEntry: (entry: JournalEntry) => void
  onClose: () => void
  visionBoardSections: VisionBoardSection[]
}

export function SearchResultsModal({ results, onSelectEntry, onClose, visionBoardSections }: SearchResultsModalProps) {
  const getCategoryDisplayName = (catValue: string) => {
    if (catValue === "inbox") return "📥 Inbox"
    if (catValue === "brainstorming") return "💡 Brainstorming"
    if (catValue === "reflection") return "📖 Reflection"
    const vbSection = visionBoardSections.find((section) => section.id === catValue)
    return vbSection ? `🏔️ ${vbSection.title}` : catValue
  }

  const getCategoryColorClass = (category: string) => {
    const baseClasses = "font-inter text-xs px-2 py-1 rounded-full"
    if (category === "inbox") return `${baseClasses} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200`
    if (category === "brainstorming")
      return `${baseClasses} bg-purple-200 text-purple-700 dark:bg-purple-700 dark:text-purple-200`
    if (category === "reflection") return `${baseClasses} bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-200`

    const vbSection = visionBoardSections.find((section) => section.id === category)
    if (vbSection) return `${baseClasses} bg-vibrant-blue/20 text-vibrant-blue`

    return `${baseClasses} bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-background p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="zen-heading text-2xl font-light text-vibrant-blue mb-4">Search Results</h2>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close search results"
        >
          <X className="h-5 w-5" />
        </Button>

        {results.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg border-border text-muted-foreground zen-body">
            <p>No entries found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((entry) => (
              <Card
                key={entry.id}
                className="zen-card p-4 cursor-pointer hover:bg-accent"
                onClick={() => onSelectEntry(entry)}
              >
                <CardHeader className="p-0 mb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium text-foreground zen-heading">{entry.title}</CardTitle>
                  <Badge className={getCategoryColorClass(entry.category)}>
                    {getCategoryDisplayName(entry.category)}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0 text-muted-foreground zen-body text-sm line-clamp-3">
                  {entry.content}
                </CardContent>
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-inter text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-3 zen-ui">
                  {format(new Date(entry.createdAt), "PPP 'at' p")}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
