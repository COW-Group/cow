// components/taskade-views/TableView.tsx
"use client"

import React, { useState } from "react"
import { ArrowUpDown, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Range } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

interface TableViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

type SortField = "name" | "type" | "range" | "tag" | "path"
type SortDirection = "asc" | "desc"

export function TableView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === "type") {
      comparison = a.type.localeCompare(b.type)
    } else if (sortField === "range") {
      comparison = a.rangeName.localeCompare(b.rangeName)
    } else if (sortField === "tag") {
      const aTag = a.tag || ""
      const bTag = b.tag || ""
      comparison = aTag.localeCompare(bTag)
    } else if (sortField === "path") {
      comparison = a.path.localeCompare(b.path)
    }

    return sortDirection === "asc" ? comparison : -comparison
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

  const TableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-cream-25 cursor-pointer hover:bg-white/5 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown className="h-3 w-3" />
        {sortField === field && (
          <span className="text-vibrant-blue text-xs">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </th>
  )

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="text-sm text-cream-25/60 pb-3 border-b border-white/10">
        {items.length} {items.length === 1 ? "item" : "items"} total
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-white/20">
        <table className="w-full">
          <thead className="bg-white/10 border-b border-white/20">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <TableHeader field="name" label="Name" />
              <TableHeader field="type" label="Type" />
              <TableHeader field="tag" label="Tag" />
              <TableHeader field="range" label="Range" />
              <TableHeader field="path" label="Path" />
              <th className="px-4 py-3 text-left text-sm font-semibold text-cream-25">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-cream-25/50 py-8">
                  No items to display. Create some in the Vision Board!
                </td>
              </tr>
            ) : (
              sortedItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                    index % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Circle className="h-3 w-3 text-cream-25/50" />
                  </td>
                  <td className="px-4 py-3 text-sm text-cream-25 font-medium max-w-xs truncate">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {item.tag && (
                      <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25">
                        {item.tag}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-cream-25/70">{item.rangeName}</td>
                  <td className="px-4 py-3 text-sm text-cream-25/50 max-w-md truncate">
                    {item.path}
                  </td>
                  <td className="px-4 py-3 text-sm text-orange-400">
                    {item.lifeline ? new Date(item.lifeline).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
