// components/taskade-views/BoardView.tsx
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Archive, CheckCircle } from "lucide-react"
import type { Range, Mountain, Hill, Terrain, Length, Step } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

type GroupByMode = "range" | "tag" | "type"

interface BoardViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function BoardView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: BoardViewProps) {
  const [groupBy, setGroupBy] = useState<GroupByMode>("range")
  // Flatten all items into cards grouped by range
  const getAllItems = () => {
    const items: Array<{
      id: string
      name: string
      type: string
      tag: string | null
      rangeId: string
      rangeName: string
      parent?: string
    }> = []

    ranges.forEach((range) => {
      range.mountains?.filter(m => !m.completed).forEach((mountain) => {
        items.push({
          id: mountain.id,
          name: mountain.name,
          type: "Mountain",
          tag: mountain.tag,
          rangeId: range.id,
          rangeName: range.name,
        })

        mountain.hills?.filter(h => !h.completed).forEach((hill) => {
          items.push({
            id: hill.id,
            name: hill.name,
            type: "Hill",
            tag: hill.tag,
            rangeId: range.id,
            rangeName: range.name,
            parent: mountain.name,
          })

          hill.terrains?.filter(t => !t.completed).forEach((terrain) => {
            items.push({
              id: terrain.id,
              name: terrain.name,
              type: "Terrain",
              tag: terrain.tag,
              rangeId: range.id,
              rangeName: range.name,
              parent: `${mountain.name} > ${hill.name}`,
            })

            terrain.lengths?.filter(l => !l.completed).forEach((length) => {
              items.push({
                id: length.id,
                name: length.name,
                type: "Length",
                tag: length.tag,
                rangeId: range.id,
                rangeName: range.name,
                parent: `${mountain.name} > ${hill.name} > ${terrain.name}`,
              })

              length.steps?.filter(s => !s.completed).forEach((step) => {
                items.push({
                  id: step.id,
                  name: step.label,
                  type: "Step",
                  tag: step.tag,
                  rangeId: range.id,
                  rangeName: range.name,
                  parent: `${mountain.name} > ${hill.name} > ${terrain.name} > ${length.name}`,
                })

                step.breaths?.filter(b => !b.completed).forEach((breath) => {
                  items.push({
                    id: breath.id,
                    name: breath.label,
                    type: "Breath",
                    tag: null,
                    rangeId: range.id,
                    rangeName: range.name,
                    parent: `${mountain.name} > ${hill.name} > ${terrain.name} > ${length.name} > ${step.label}`,
                  })
                })
              })
            })
          })
        })
      })
    })

    return items
  }

  const items = getAllItems()

  // Dynamic grouping based on selected mode
  const getGroupedItems = () => {
    if (groupBy === "range") {
      const grouped: Record<string, any[]> = {}
      ranges.forEach((range) => {
        grouped[range.name] = items.filter((item) => item.rangeId === range.id)
      })
      return grouped
    } else if (groupBy === "tag") {
      return {
        Vision: items.filter((item) => item.tag === "vision"),
        Milestone: items.filter((item) => item.tag === "milestone"),
        Habit: items.filter((item) => item.tag === "habit"),
        Activity: items.filter((item) => item.tag === "activity"),
        Untagged: items.filter((item) => !item.tag),
      }
    } else {
      // Group by type
      return {
        Mountain: items.filter((item) => item.type === "Mountain"),
        Hill: items.filter((item) => item.type === "Hill"),
        Terrain: items.filter((item) => item.type === "Terrain"),
        Length: items.filter((item) => item.type === "Length"),
        Step: items.filter((item) => item.type === "Step"),
        Breath: items.filter((item) => item.type === "Breath"),
      }
    }
  }

  const groupedItems = getGroupedItems()

  // Get color for each group
  const getGroupColor = (groupName: string, index: number) => {
    if (groupBy === "range") {
      const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-pink-500"]
      return colors[index % colors.length]
    } else if (groupBy === "tag") {
      const colorMap: Record<string, string> = {
        Vision: "bg-purple-500",
        Milestone: "bg-yellow-500",
        Habit: "bg-green-500",
        Activity: "bg-blue-500",
        Untagged: "bg-gray-500",
      }
      return colorMap[groupName] || "bg-gray-500"
    } else {
      const colorMap: Record<string, string> = {
        Mountain: "bg-red-500",
        Hill: "bg-orange-500",
        Terrain: "bg-yellow-500",
        Length: "bg-green-500",
        Step: "bg-blue-500",
        Breath: "bg-purple-500",
      }
      return colorMap[groupName] || "bg-gray-500"
    }
  }

  const renderCard = (item: any) => (
    <Card
      key={item.id}
      className="mb-3 bg-white/10 border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-cream-25">{item.name}</h4>
          <Badge
            variant="secondary"
            className="text-xs bg-vibrant-blue/30 text-cream-25 flex-shrink-0"
          >
            {item.type}
          </Badge>
        </div>
        {item.parent && (
          <p className="text-xs text-cream-25/60 mb-2 line-clamp-1">{item.parent}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-cream-25/70">{item.rangeName}</span>
        </div>
      </CardContent>
    </Card>
  )

  const renderColumn = (title: string, items: any[], color: string, key: string) => (
    <div key={key} className="flex-1 min-w-[280px] max-w-[320px]">
      <div className="sticky top-0 z-10 bg-deep-blue/80 backdrop-blur-md pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="text-lg font-bold text-cream-25">{title}</h3>
          <Badge variant="secondary" className="bg-white/10 text-cream-25">
            {items.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center text-cream-25/40 py-8 text-sm">No items</div>
        ) : (
          items.map((item) => renderCard(item))
        )}
      </div>
    </div>
  )

  // Get reset periods as cards
  const getResetCards = () => {
    return ranges.map((range) => {
      const period = currentPeriods[range.id]
      if (!period || !period.start_date) return null

      return (
        <Card key={`reset-${range.id}`} className="mb-3 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/25 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-start gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-300 mb-1">{range.name}</h4>
                <div className="text-xs text-cream-25/70 space-y-1">
                  {period.start_date && <div>Start: {new Date(period.start_date).toLocaleDateString()}</div>}
                  {period.end_date && <div>End: {new Date(period.end_date).toLocaleDateString()}</div>}
                  {period.discover && <div className="truncate">Discover: {period.discover}</div>}
                  {period.define && <div className="truncate">Define: {period.define}</div>}
                  {period.ideate && <div className="truncate">Ideate: {period.ideate}</div>}
                  {period.prototype && <div className="truncate">Prototype: {period.prototype}</div>}
                  {period.test && <div className="truncate">Test: {period.test}</div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }).filter(Boolean)
  }

  // Get archive items as cards (grouped by past reset periods)
  const getArchiveCards = () => {
    const cards: JSX.Element[] = []

    ranges.forEach((range) => {
      const rangeArchive = archives[range.id]
      if (!rangeArchive || !rangeArchive.previousResets) return

      // Group completed items by reset_period_id
      const itemsByPeriod: Record<string, ArchivedItem[]> = {}
      const completed = rangeArchive.completed || {}
      const allCompletedItems = Object.values(completed).flat()
      allCompletedItems.forEach((item) => {
        if (item.reset_period_id) {
          if (!itemsByPeriod[item.reset_period_id]) {
            itemsByPeriod[item.reset_period_id] = []
          }
          itemsByPeriod[item.reset_period_id].push(item)
        }
      })

      // Show most recent 3 past periods per range
      const recentPeriods = rangeArchive.previousResets.slice(0, 3)

      recentPeriods.forEach((period) => {
        const periodItems = itemsByPeriod[period.id] || []

        cards.push(
          <Card key={`archive-period-${period.id}`} className="mb-3 bg-green-500/20 border-green-500/30 hover:bg-green-500/25 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-start gap-2 mb-2">
                <Calendar className="h-4 w-4 text-green-300 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-300 mb-1">
                    {new Date(period.start_date).toLocaleDateString()} → {new Date(period.end_date).toLocaleDateString()}
                  </h4>
                  <div className="text-xs text-cream-25/70 mb-2">
                    <div className="font-semibold mb-1">{range.name}</div>
                    <div>{periodItems.length} {periodItems.length === 1 ? 'item' : 'items'} completed</div>
                  </div>
                  {/* DDDPT Notes Preview */}
                  {(period.discover || period.define || period.ideate || period.prototype || period.test) && (
                    <div className="bg-white/10 rounded p-2 mt-2 space-y-0.5 text-xs">
                      {period.discover && (
                        <div className="break-words">
                          <span className="text-purple-300 font-semibold">Discover:</span>
                          <span className="text-cream-25/70 ml-1">{period.discover}</span>
                        </div>
                      )}
                      {period.define && (
                        <div className="break-words">
                          <span className="text-blue-300 font-semibold">Define:</span>
                          <span className="text-cream-25/70 ml-1">{period.define}</span>
                        </div>
                      )}
                      {period.ideate && (
                        <div className="break-words">
                          <span className="text-green-300 font-semibold">Ideate:</span>
                          <span className="text-cream-25/70 ml-1">{period.ideate}</span>
                        </div>
                      )}
                      {period.prototype && (
                        <div className="break-words">
                          <span className="text-yellow-300 font-semibold">Prototype:</span>
                          <span className="text-cream-25/70 ml-1">{period.prototype}</span>
                        </div>
                      )}
                      {period.test && (
                        <div className="break-words">
                          <span className="text-orange-300 font-semibold">Test:</span>
                          <span className="text-cream-25/70 ml-1">{period.test}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Completed Items Preview (max 3) */}
                  {periodItems.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-cream-25/60 font-semibold">Completed:</div>
                      {periodItems.slice(0, 3).map((item) => (
                        <div key={`${item.item_id}-${item.completed_at}`} className="flex items-center gap-1 text-xs">
                          <CheckCircle className="h-2 w-2 text-green-400 flex-shrink-0" />
                          <span className="text-cream-25/70 truncate">{item.item_name}</span>
                          <Badge variant="secondary" className="text-[10px] bg-white/10 text-cream-25/50">
                            {item.item_type}
                          </Badge>
                        </div>
                      ))}
                      {periodItems.length > 3 && (
                        <div className="text-xs text-cream-25/50 italic">+{periodItems.length - 3} more</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })
    })

    return cards
  }

  const resetCards = getResetCards()
  const archiveCards = getArchiveCards()

  return (
    <div className="space-y-4">
      {/* Group By Selector */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <span className="text-sm text-cream-25/70">Group by:</span>
        <button
          onClick={() => setGroupBy("range")}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            groupBy === "range" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Range
        </button>
        <button
          onClick={() => setGroupBy("tag")}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            groupBy === "tag" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Tag
        </button>
        <button
          onClick={() => setGroupBy("type")}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            groupBy === "type" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Type
        </button>
      </div>

      {/* Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {/* Dynamic columns based on grouping */}
        {Object.entries(groupedItems).map(([groupName, groupItems], index) =>
          renderColumn(groupName, groupItems, getGroupColor(groupName, index), `column-${groupName}`)
        )}

        {/* Reset Periods Column */}
        {resetCards.length > 0 && (
          <div className="flex-1 min-w-[280px] max-w-[320px]">
            <div className="sticky top-0 z-10 bg-deep-blue/80 backdrop-blur-md pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-blue-300" />
                <h3 className="text-lg font-bold text-blue-300">Reset Periods</h3>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {resetCards.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">{resetCards}</div>
          </div>
        )}

        {/* Archive Column - Past Weeks */}
        {archiveCards.length > 0 && (
          <div className="flex-1 min-w-[280px] max-w-[320px]">
            <div className="sticky top-0 z-10 bg-deep-blue/80 backdrop-blur-md pb-3">
              <div className="flex items-center gap-2 mb-3">
                <Archive className="w-4 h-4 text-green-300" />
                <h3 className="text-lg font-bold text-green-300">Past Weeks</h3>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {archiveCards.length}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">{archiveCards}</div>
          </div>
        )}
      </div>
    </div>
  )
}
