// components/taskade-views/ListView.tsx
"use client"

import React, { useState } from "react"
import { Circle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Range } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

interface ListViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function ListView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: ListViewProps) {
  const [sortBy, setSortBy] = useState<"name" | "type" | "range">("name")

  // Flatten all items
  const getAllItems = () => {
    const items: Array<{
      id: string
      name: string
      type: string
      tag: string | null
      rangeId: string
      rangeName: string
      path: string
      lifeline?: string | null
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
          path: range.name,
        })

        mountain.hills?.filter(h => !h.completed).forEach((hill) => {
          items.push({
            id: hill.id,
            name: hill.name,
            type: "Hill",
            tag: hill.tag,
            rangeId: range.id,
            rangeName: range.name,
            path: `${range.name} > ${mountain.name}`,
          })

          hill.terrains?.filter(t => !t.completed).forEach((terrain) => {
            items.push({
              id: terrain.id,
              name: terrain.name,
              type: "Terrain",
              tag: terrain.tag,
              rangeId: range.id,
              rangeName: range.name,
              path: `${range.name} > ${mountain.name} > ${hill.name}`,
            })

            terrain.lengths?.filter(l => !l.completed).forEach((length) => {
              items.push({
                id: length.id,
                name: length.name,
                type: "Length",
                tag: length.tag,
                rangeId: range.id,
                rangeName: range.name,
                path: `${range.name} > ${mountain.name} > ${hill.name} > ${terrain.name}`,
              })

              length.steps?.filter(s => !s.completed).forEach((step) => {
                items.push({
                  id: step.id,
                  name: step.label,
                  type: "Step",
                  tag: step.tag,
                  rangeId: range.id,
                  rangeName: range.name,
                  path: `${range.name} > ${mountain.name} > ${hill.name} > ${terrain.name} > ${length.name}`,
                  lifeline: step.lifeline,
                })

                step.breaths?.filter(b => !b.completed).forEach((breath) => {
                  items.push({
                    id: breath.id,
                    name: breath.label,
                    type: "Breath",
                    tag: null,
                    rangeId: range.id,
                    rangeName: range.name,
                    path: `${range.name} > ${mountain.name} > ${hill.name} > ${terrain.name} > ${length.name} > ${step.label}`,
                    lifeline: null,
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

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name)
    if (sortBy === "type") return a.type.localeCompare(b.type)
    if (sortBy === "range") return a.rangeName.localeCompare(b.rangeName)
    return 0
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Mountain":
        return "bg-red-500/20 text-red-300"
      case "Hill":
        return "bg-orange-500/20 text-orange-300"
      case "Terrain":
        return "bg-yellow-500/20 text-yellow-300"
      case "Length":
        return "bg-green-500/20 text-green-300"
      case "Step":
        return "bg-blue-500/20 text-blue-300"
      case "Breath":
        return "bg-purple-500/20 text-purple-300"
      default:
        return "bg-gray-500/20 text-gray-300"
    }
  }

  return (
    <div className="space-y-3">
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <span className="text-sm text-cream-25/70">Sort by:</span>
        <button
          onClick={() => setSortBy("name")}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === "name" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Name
        </button>
        <button
          onClick={() => setSortBy("type")}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === "type" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Type
        </button>
        <button
          onClick={() => setSortBy("range")}
          className={`text-sm px-3 py-1 rounded ${
            sortBy === "range" ? "bg-vibrant-blue text-cream-25" : "text-cream-25/70 hover:bg-white/10"
          }`}
        >
          Range
        </button>
        <div className="ml-auto text-sm text-cream-25/60">{items.length} items</div>
      </div>

      {/* Items list */}
      <div className="space-y-1">
        {sortedItems.length === 0 ? (
          <div className="text-center text-cream-25/50 py-8">
            No items to display. Create some in the Vision Board!
          </div>
        ) : (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 hover:bg-white/5 rounded transition-colors group"
            >
              <Circle className="h-4 w-4 text-cream-25/50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-cream-25 truncate">{item.name}</span>
                  {item.tag && (
                    <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25">
                      {item.tag}
                    </Badge>
                  )}
                  {item.lifeline && (
                    <span className="text-xs text-orange-400 flex-shrink-0">
                      {new Date(item.lifeline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-cream-25/50 truncate">{item.path}</p>
              </div>
              <Badge variant="secondary" className={`text-xs ${getTypeColor(item.type)} flex-shrink-0`}>
                {item.type}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
