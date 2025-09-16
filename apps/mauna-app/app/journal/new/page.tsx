"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { databaseService } from "@/lib/database-service"
import type { JournalEntry, Range } from "@/lib/types"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewJournalEntryPage() {
  const router = useRouter()
  const { user: currentUser, loading: authLoading } = useAuth(AuthService)
  const [title, setTitle] = useState("")
  const [entry, setEntry] = useState("")
  const [category, setCategory] = useState("inbox")
  const [visionBoardLevel, setVisionBoardLevel] = useState<string | null>(null)
  const [visionBoardItemId, setVisionBoardItemId] = useState<string | null>(null)
  const [visionBoardItemTitle, setVisionBoardItemTitle] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [type, setType] = useState<string | null>(null)
  const [visionBoardSections, setVisionBoardSections] = useState<Range[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadVisionBoardSections = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const data = await databaseService.fetchRanges(currentUser.id)
      console.log("Fetched vision board ranges:", data)
      setVisionBoardSections(data || [])
    } catch (error: any) {
      console.error("Failed to fetch vision board data:", error)
      toast.error("Failed to load vision board data.")
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (!authLoading && currentUser?.id) {
      loadVisionBoardSections()
    } else if (!authLoading && !currentUser?.id) {
      setError("Please sign in to create a journal entry.")
      router.push("/auth/signin")
    }
  }, [authLoading, currentUser?.id, loadVisionBoardSections, router])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!currentUser?.id) return
      if (!title.trim()) {
        toast.error("Title cannot be empty.")
        return
      }
      setLoading(true)
      try {
        const newEntry: Omit<JournalEntry, "id" | "created_at" | "updated_at" | "is_archived" | "is_favorite"> = {
          userId: currentUser.id,
          title,
          entry,
          category,
          visionboardlevel: visionBoardLevel,
          visionboarditemid: visionBoardItemId,
          visionboarditemtitle: visionBoardItemTitle,
          tags,
          type,
        }
        const { data, error } = await databaseService.createJournalEntry(currentUser.id, newEntry)
        if (error) throw error
        toast.success("Journal entry created successfully!")
        router.push("/journal")
      } catch (err: any) {
        console.error("Failed to create journal entry:", err)
        toast.error("Failed to create journal entry.")
      } finally {
        setLoading(false)
      }
    },
    [currentUser?.id, title, entry, category, visionBoardLevel, visionBoardItemId, visionBoardItemTitle, tags, type, router]
  )

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-cream-25 p-4">
      <div className="h-16 sm:h-20"></div>
      <main className="container mx-auto p-4 sm:p-6 max-w-full flex-1 overflow-hidden">
        <h1 className="text-4xl font-bold mb-6 text-center">New Journal Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50"
            />
          </div>
          <div>
            <label htmlFor="entry" className="block text-sm font-medium">Entry</label>
            <Textarea
              id="entry"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50"
              rows={5}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbox">Inbox</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="visionBoardLevel" className="block text-sm font-medium">Vision Board Level</label>
            <Select
              value={visionBoardLevel || ""}
              onValueChange={(value) => {
                setVisionBoardLevel(value || null)
                setVisionBoardItemId(null)
                setVisionBoardItemTitle(null)
              }}
            >
              <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                <SelectValue placeholder="Select vision board level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="range">Range</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="hill">Hill</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="length">Length</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {visionBoardLevel && (
            <div>
              <label htmlFor="visionBoardItem" className="block text-sm font-medium">Vision Board Item</label>
              <Select
                value={visionBoardItemId || ""}
                onValueChange={(value) => {
                  const selectedItem = visionBoardSections
                    .flatMap((range) => [
                      { id: range.id, name: range.name, level: "range" },
                      ...range.mountains.flatMap((mountain) => [
                        { id: mountain.id, name: mountain.name, level: "mountain" },
                        ...mountain.hills.flatMap((hill) => [
                          { id: hill.id, name: hill.name, level: "hill" },
                          ...hill.terrains.flatMap((terrain) => [
                            { id: terrain.id, name: terrain.name, level: "terrain" },
                            ...terrain.lengths.map((length) => ({
                              id: length.id,
                              name: length.name,
                              level: "length",
                            })),
                          ]),
                        ]),
                      ]),
                    ])
                    .find((item) => item.id === value && item.level === visionBoardLevel);
                  setVisionBoardItemId(value || null)
                  setVisionBoardItemTitle(selectedItem?.name || null)
                }}
              >
                <SelectTrigger className="mt-1 text-cream-25 bg-cream-25/10 border-cream-25/50">
                  <SelectValue placeholder="Select vision board item" />
                </SelectTrigger>
                <SelectContent>
                  {visionBoardSections
                    .flatMap((range) => [
                      { id: range.id, name: range.name, level: "range" },
                      ...range.mountains.flatMap((mountain) => [
                        { id: mountain.id, name: mountain.name, level: "mountain" },
                        ...mountain.hills.flatMap((hill) => [
                          { id: hill.id, name: hill.name, level: "hill" },
                          ...hill.terrains.flatMap((terrain) => [
                            { id: terrain.id, name: terrain.name, level: "terrain" },
                            ...terrain.lengths.map((length) => ({
                              id: length.id,
                              name: length.name,
                              level: "length",
                            })),
                          ]),
                        ]),
                      ]),
                    ])
                    .filter((item) => item.level === visionBoardLevel)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="text-cream-25 border-cream-25/50 hover:bg-cream-25/10"
          >
            {loading ? <Loader2Icon className="h-5 w-5 animate-spin" /> : "Create Entry"}
          </Button>
        </form>
      </main>
    </div>
  )
}