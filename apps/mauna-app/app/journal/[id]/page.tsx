"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { JournalEntryForm } from "@/components/journal-entry-form"
import { databaseService } from "@/lib/database-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useEncryption } from "@/lib/encryption-context"
import type { JournalEntry, VisionBoardSection } from "@/lib/types"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JournalLinkedItems } from "@/components/journal-linked-items"

interface JournalEntryPageProps {
  params: Promise<{ id: string }>
}

export default function JournalEntryPage({ params }: JournalEntryPageProps) {
  const router = useRouter()
  const { user: currentUser, loading: isAuthLoading } = useAuth()
  const { isEncryptionReady } = useEncryption()
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visionBoardSections, setVisionBoardSections] = useState<VisionBoardSection[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredItems, setFilteredItems] = useState<{ id: string; title: string }[]>([])
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string } | null>(null)
  const { toast } = useToast()

  const loadEntry = useCallback(
    async (userId: string, entryId: string) => {
      setIsLoading(true)
      try {
        console.log("Supabase: Loading entry for user:", userId, "with id:", entryId)
        const { data, error } = await databaseService.getJournalEntryById(userId, entryId)
        console.log("Supabase: getJournalEntryById response (raw):", { data: typeof data === "string" ? data : JSON.stringify(data, null, 2), error })
        if (error) throw error
        if (!data) {
          toast({ title: "Error", description: "Journal entry not found.", variant: "destructive" })
          router.push("/journal")
          return
        }
        // Parse the data if it's a string, otherwise use as is
        let parsedData
        try {
          parsedData = typeof data === "string" ? JSON.parse(data) : data
          console.log("Supabase: Parsed data:", JSON.stringify(parsedData, null, 2))
        } catch (parseError) {
          console.error("Supabase: Failed to parse data:", parseError, "Raw data:", data)
          throw new Error("Invalid data format from Supabase")
        }
        setEntry(parsedData)
        if (parsedData.visionBoardLevel && parsedData.visionBoardItemId && parsedData.visionBoardItemTitle) {
          setSelectedLevel(parsedData.visionBoardLevel)
          setSelectedItem({ id: parsedData.visionBoardItemId, title: parsedData.visionBoardItemTitle })
        }
      } catch (error: any) {
        console.error("Error loading journal entry:", error)
        toast({ title: "Error", description: `Failed to load entry: ${error.message}`, variant: "destructive" })
        router.push("/journal")
      } finally {
        setIsLoading(false)
      }
    },
    [toast, router],
  )

  const loadVisionBoardSections = useCallback(async () => {
    if (!currentUser?.id) return
    try {
      const { data, error } = await databaseService.getVisionBoardSections(currentUser.id)
      if (error) throw error
      setVisionBoardSections(data || [])
    } catch (error: any) {
      console.error("Error loading vision board sections:", error)
      toast({ title: "Error", description: `Failed to load vision board data: ${error.message}`, variant: "destructive" })
    }
  }, [currentUser?.id, toast])

  const searchItems = useCallback(() => {
    if (!selectedLevel || !searchTerm.trim()) {
      setFilteredItems([])
      return
    }
    const results: { id: string; title: string }[] = []
    visionBoardSections.forEach((section) => {
      if (selectedLevel === "range") {
        results.push({ id: section.id, title: section.title })
      }
      section.mountains.forEach((mountain) => {
        if (selectedLevel === "mountain") {
          results.push({ id: mountain.id, title: mountain.title })
        }
        mountain.hills.forEach((hill) => {
          if (selectedLevel === "hill") {
            results.push({ id: hill.id, title: hill.title })
          }
          hill.terrains.forEach((terrain) => {
            if (selectedLevel === "terrain") {
              results.push({ id: terrain.id, title: terrain.title })
            }
            terrain.lengths.forEach((length) => {
              if (selectedLevel === "length") {
                results.push({ id: length.id, title: length.title })
              }
              length.steps.forEach((step) => {
                if (selectedLevel === "step") {
                  results.push({ id: step.id, title: step.title })
                }
              })
            })
          })
        })
      })
    })
    setFilteredItems(
      results.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [selectedLevel, searchTerm, visionBoardSections])

  const paramsData = React.use(params)
  const paramId = paramsData.id

  useEffect(() => {
    console.log("useEffect triggered for user:", currentUser?.id, "with paramId:", paramId)
    if (!isAuthLoading && currentUser?.id) {
      loadEntry(currentUser.id, paramId)
      loadVisionBoardSections()
    }
  }, [currentUser, isAuthLoading, loadEntry, loadVisionBoardSections, paramId])

  useEffect(() => {
    searchItems()
  }, [searchTerm, selectedLevel, searchItems])

  // Redirect to unlock page if user is logged in but encryption key is not available
  useEffect(() => {
    if (!isAuthLoading && currentUser && !isEncryptionReady) {
      console.log("[JournalEntryPage] User logged in but encryption not ready, redirecting to unlock")
      router.push("/unlock")
    }
  }, [currentUser, isAuthLoading, isEncryptionReady, router])

  const handleSaveEntry = async (
    updatedEntry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "isArchived" | "isFavorite">,
  ) => {
    if (!currentUser?.id || !entry?.id) {
      toast({ title: "Error", description: "You must be logged in to update entries.", variant: "destructive" })
      return
    }
    try {
      const entryWithVisionBoard = {
        ...updatedEntry,
        visionBoardLevel: selectedLevel || null,
        visionBoardItemId: selectedItem?.id || null,
        visionBoardItemTitle: selectedItem?.title || null,
      }
      const { error } = await databaseService.updateJournalEntry(currentUser.id, entry.id, entryWithVisionBoard)
      if (error) throw error
      toast({ title: "Entry Updated ✨", description: "Your journal entry has been updated." })
      router.push("/journal")
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to update entry: ${error.message}`, variant: "destructive" })
    }
  }

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 mx-auto border-2 border-vibrant-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground zen-body">Loading entry...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground zen-body">Journal entry not found or you are not authorized.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl flex-1">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/journal")}
          aria-label="Back to Journal"
          className="zen-button-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="zen-heading text-3xl font-light text-vibrant-blue">Edit Journal Entry</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4">
        <Select value={selectedLevel} onValueChange={(value) => {
          setSelectedLevel(value)
          setSearchTerm("")
          setSelectedItem(null)
        }}>
          <SelectTrigger className="zen-input font-inter">
            <SelectValue placeholder="Select vision board level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="range">Range</SelectItem>
            <SelectItem value="mountain">Mountain</SelectItem>
            <SelectItem value="hill">Hill</SelectItem>
            <SelectItem value="terrain">Terrain</SelectItem>
            <SelectItem value="length">Length</SelectItem>
            <SelectItem value="step">Step</SelectItem>
          </SelectContent>
        </Select>
        {selectedLevel && (
          <div className="relative">
            <Input
              placeholder={`Search ${selectedLevel}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="zen-input pr-10 font-inter"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
        {selectedLevel && filteredItems.length > 0 && (
          <div className="max-h-40 overflow-y-auto border rounded-lg bg-background">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedItem?.id === item.id ? "bg-vibrant-blue/20" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        )}
          </div>
          <JournalEntryForm
            initialData={entry}
            onSave={(data) => handleSaveEntry(data)}
            onCancel={() => router.push("/journal")}
            visionBoardItems={visionBoardSections}
            visionBoardLevel={selectedLevel}
            visionBoardItemId={selectedItem?.id}
            visionBoardItemTitle={selectedItem?.title}
          />
        </div>

        {/* Sidebar - Linked Items */}
        <div className="lg:col-span-1">
          <JournalLinkedItems
            userId={currentUser.id}
            entryDate={entry.created_at}
            sourceType={entry.sourceType}
            sourceId={entry.sourceId}
            visionBoardItemId={entry.visionboarditemid}
            visionBoardItemTitle={entry.visionboarditemtitle}
            visionBoardLevel={entry.visionboardlevel}
          />
        </div>
      </div>
    </div>
  )
}