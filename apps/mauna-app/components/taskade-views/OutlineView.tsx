// components/taskade-views/OutlineView.tsx
"use client"

import React, { useState } from "react"
import { ChevronRight, ChevronDown, CheckCircle, Circle, Calendar, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Range, Mountain, Hill, Terrain, Length, Step, Breath } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"
import { Badge } from "@/components/ui/badge"

interface OutlineViewProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function OutlineView({ ranges, currentPeriods = {}, archives = {}, onUpdateItem }: OutlineViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const renderBreath = (breath: Breath, stepId: string, indent: number) => {
    if (breath.completed) return null

    return (
      <div
        key={breath.id}
        className="flex items-start gap-2 py-1 hover:bg-white/5 rounded px-2 transition-colors"
        style={{ marginLeft: `${indent * 24}px` }}
      >
        <div className="flex items-center gap-2 flex-1">
          <Circle className="h-2 w-2 text-cream-25/40 flex-shrink-0 mt-1" />
          <span className="text-xs text-cream-25/80">{breath.label}</span>
          {breath.duration && (
            <span className="text-xs text-cream-25/50">{breath.duration}m</span>
          )}
        </div>
      </div>
    )
  }

  const renderStep = (step: Step, lengthId: string, indent: number) => {
    if (step.completed) return null

    const isExpanded = expanded.has(step.id)
    const hasBreaths = step.breaths && step.breaths.filter(b => !b.completed).length > 0

    return (
      <div key={step.id}>
        <div
          className="flex items-start gap-2 py-1 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => hasBreaths && toggleExpanded(step.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasBreaths ? (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-cream-25/70 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-3 w-3 text-cream-25/70 flex-shrink-0" />
              )
            ) : (
              <Circle className="h-3 w-3 text-cream-25/50 flex-shrink-0 mt-1" />
            )}
            <span className="text-sm text-cream-25/90">{step.label}</span>
            {step.tag && (
              <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25">
                {step.tag}
              </Badge>
            )}
            {step.lifeline && (
              <span className="text-xs text-orange-400">
                Due: {new Date(step.lifeline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {isExpanded && hasBreaths && (
          <div className="mt-1">
            {step.breaths.filter(b => !b.completed).map((breath) => renderBreath(breath, step.id, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderLength = (length: Length, terrainId: string, indent: number) => {
    if (length.completed) return null

    const isExpanded = expanded.has(length.id)
    const hasSteps = length.steps && length.steps.filter(s => !s.completed).length > 0

    return (
      <div key={length.id}>
        <div
          className="flex items-start gap-2 py-1 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => hasSteps && toggleExpanded(length.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasSteps ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-cream-25/70 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-cream-25/70 flex-shrink-0" />
              )
            ) : (
              <Circle className="h-3 w-3 text-cream-25/50 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-medium text-cream-25">{length.name}</span>
            {length.tag && (
              <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25">
                {length.tag}
              </Badge>
            )}
          </div>
        </div>
        {isExpanded && hasSteps && (
          <div className="mt-1">
            {length.steps.filter(s => !s.completed).map((step) => renderStep(step, length.id, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderTerrain = (terrain: Terrain, hillId: string, indent: number) => {
    if (terrain.completed) return null

    const isExpanded = expanded.has(terrain.id)
    const hasLengths = terrain.lengths && terrain.lengths.filter(l => !l.completed).length > 0

    return (
      <div key={terrain.id}>
        <div
          className="flex items-start gap-2 py-1 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => hasLengths && toggleExpanded(terrain.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasLengths ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-cream-25/70 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-cream-25/70 flex-shrink-0" />
              )
            ) : (
              <Circle className="h-3 w-3 text-cream-25/50 flex-shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-semibold text-cream-25">{terrain.name}</span>
            {terrain.tag && (
              <Badge variant="secondary" className="text-xs bg-vibrant-blue/20 text-cream-25">
                {terrain.tag}
              </Badge>
            )}
          </div>
        </div>
        {isExpanded && hasLengths && (
          <div className="mt-1">
            {terrain.lengths.filter(l => !l.completed).map((length) => renderLength(length, terrain.id, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderHill = (hill: Hill, mountainId: string, indent: number) => {
    if (hill.completed) return null

    const isExpanded = expanded.has(hill.id)
    const hasTerrains = hill.terrains && hill.terrains.filter(t => !t.completed).length > 0

    return (
      <div key={hill.id}>
        <div
          className="flex items-start gap-2 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => hasTerrains && toggleExpanded(hill.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasTerrains ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-cream-25 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-cream-25 flex-shrink-0" />
              )
            ) : (
              <Circle className="h-3 w-3 text-cream-25/50 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-semibold text-base text-cream-25">{hill.name}</span>
            {hill.tag && (
              <Badge variant="secondary" className="bg-vibrant-blue/20 text-cream-25">
                {hill.tag}
              </Badge>
            )}
          </div>
        </div>
        {isExpanded && hasTerrains && (
          <div className="mt-1">
            {hill.terrains.filter(t => !t.completed).map((terrain) => renderTerrain(terrain, hill.id, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderMountain = (mountain: Mountain, rangeId: string, indent: number) => {
    if (mountain.completed) return null

    const isExpanded = expanded.has(mountain.id)
    const hasHills = mountain.hills && mountain.hills.filter(h => !h.completed).length > 0

    return (
      <div key={mountain.id} className="mb-4">
        <div
          className="flex items-start gap-2 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => hasHills && toggleExpanded(mountain.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasHills ? (
              isExpanded ? (
                <ChevronDown className="h-5 w-5 text-cream-25 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-5 w-5 text-cream-25 flex-shrink-0" />
              )
            ) : (
              <Circle className="h-4 w-4 text-cream-25/50 flex-shrink-0" />
            )}
            <span className="font-bold text-lg text-cream-25">{mountain.name}</span>
            {mountain.tag && (
              <Badge variant="secondary" className="bg-vibrant-blue/20 text-cream-25">
                {mountain.tag}
              </Badge>
            )}
          </div>
        </div>
        {isExpanded && hasHills && (
          <div className="mt-1">
            {mountain.hills.filter(h => !h.completed).map((hill) => renderHill(hill, mountain.id, indent + 1))}
          </div>
        )}
      </div>
    )
  }

  const renderResetPeriod = (rangeId: string, indent: number) => {
    const period = currentPeriods[rangeId]
    const isExpanded = expanded.has(`reset-${rangeId}`)
    const hasData = period && (period.start_date || period.end_date || period.discover || period.define || period.ideate || period.prototype || period.test)

    return (
      <div className="mb-4">
        <div
          className="flex items-start gap-2 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer bg-blue-500/10 border border-blue-500/20"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => toggleExpanded(`reset-${rangeId}`)}
        >
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-blue-300 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-blue-300 flex-shrink-0" />
            )}
            <Calendar className="h-5 w-5 text-blue-300 flex-shrink-0" />
            <span className="font-bold text-lg text-blue-300">Current Reset Period</span>
            {period?.start_date && period?.end_date && (
              <span className="text-sm text-cream-25/70">
                {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2 ml-12 space-y-2 text-sm text-cream-25/80">
            {hasData && period ? (
              <>
                {period.start_date && (
                  <div><span className="text-cream-25 font-semibold">Start:</span> {new Date(period.start_date).toLocaleDateString()}</div>
                )}
                {period.end_date && (
                  <div><span className="text-cream-25 font-semibold">End:</span> {new Date(period.end_date).toLocaleDateString()}</div>
                )}
                {period.discover && (
                  <div><span className="text-cream-25 font-semibold">Discover:</span> {period.discover}</div>
                )}
                {period.define && (
                  <div><span className="text-cream-25 font-semibold">Define:</span> {period.define}</div>
                )}
                {period.ideate && (
                  <div><span className="text-cream-25 font-semibold">Ideate:</span> {period.ideate}</div>
                )}
                {period.prototype && (
                  <div><span className="text-cream-25 font-semibold">Prototype:</span> {period.prototype}</div>
                )}
                {period.test && (
                  <div><span className="text-cream-25 font-semibold">Test:</span> {period.test}</div>
                )}
              </>
            ) : (
              <div className="text-cream-25/50 italic">No reset period data yet. Add one in the Vision Board.</div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderArchives = (rangeId: string, indent: number) => {
    const rangeArchive = archives[rangeId]
    const previousResets = rangeArchive?.previousResets || []
    const hasData = previousResets.length > 0
    const isExpanded = expanded.has(`archive-${rangeId}`)

    // Group completed items by reset_period_id
    const itemsByPeriod: Record<string, ArchivedItem[]> = {}
    const completed = rangeArchive?.completed || {}
    const allCompletedItems = Object.values(completed).flat()
    allCompletedItems.forEach((item) => {
      if (item.reset_period_id) {
        if (!itemsByPeriod[item.reset_period_id]) {
          itemsByPeriod[item.reset_period_id] = []
        }
        itemsByPeriod[item.reset_period_id].push(item)
      }
    })

    return (
      <div className="mb-4">
        <div
          className="flex items-start gap-2 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer bg-green-500/10 border border-green-500/20"
          style={{ marginLeft: `${indent * 24}px` }}
          onClick={() => toggleExpanded(`archive-${rangeId}`)}
        >
          <div className="flex items-center gap-2 flex-1">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-green-300 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-green-300 flex-shrink-0" />
            )}
            <Archive className="h-5 w-5 text-green-300 flex-shrink-0" />
            <span className="font-bold text-lg text-green-300">Past Weeks (Archive)</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {previousResets.length} weeks
            </Badge>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2 ml-12 space-y-3">
            {hasData ? (
              previousResets.map((period) => {
                const periodExpanded = expanded.has(`archive-period-${period.id}`)
                const periodItems = itemsByPeriod[period.id] || []

                return (
                  <div key={period.id} className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                    <div
                      className="flex items-center gap-2 py-1 hover:bg-white/5 rounded px-2 cursor-pointer"
                      onClick={() => toggleExpanded(`archive-period-${period.id}`)}
                    >
                      {periodExpanded ? (
                        <ChevronDown className="h-4 w-4 text-green-300 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-green-300 flex-shrink-0" />
                      )}
                      <Calendar className="h-4 w-4 text-green-300 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-green-300">
                          {new Date(period.start_date).toLocaleDateString()} → {new Date(period.end_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-cream-25/60">
                          {periodItems.length} {periodItems.length === 1 ? 'item' : 'items'} completed
                        </div>
                      </div>
                    </div>
                    {periodExpanded && (
                      <div className="mt-2 ml-6 space-y-2">
                        {/* DDDPT Notes */}
                        {(period.discover || period.define || period.ideate || period.prototype || period.test) && (
                          <div className="bg-white/5 rounded p-2 border border-white/10">
                            <div className="text-xs text-cream-25/70 font-semibold mb-1">DDDPT Framework Notes:</div>
                            <div className="space-y-0.5 text-xs">
                              {period.discover && (
                                <div>
                                  <span className="text-purple-300 font-semibold">Discover:</span>
                                  <span className="text-cream-25/80 ml-2">{period.discover}</span>
                                </div>
                              )}
                              {period.define && (
                                <div>
                                  <span className="text-blue-300 font-semibold">Define:</span>
                                  <span className="text-cream-25/80 ml-2">{period.define}</span>
                                </div>
                              )}
                              {period.ideate && (
                                <div>
                                  <span className="text-green-300 font-semibold">Ideate:</span>
                                  <span className="text-cream-25/80 ml-2">{period.ideate}</span>
                                </div>
                              )}
                              {period.prototype && (
                                <div>
                                  <span className="text-yellow-300 font-semibold">Prototype:</span>
                                  <span className="text-cream-25/80 ml-2">{period.prototype}</span>
                                </div>
                              )}
                              {period.test && (
                                <div>
                                  <span className="text-orange-300 font-semibold">Test:</span>
                                  <span className="text-cream-25/80 ml-2">{period.test}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Completed Items */}
                        {periodItems.length > 0 ? (
                          <div className="space-y-1">
                            <div className="text-xs text-cream-25/70 font-semibold">Completed Items:</div>
                            {periodItems.map((item) => (
                              <div key={`${item.item_id}-${item.completed_at}`} className="flex items-center gap-2 py-1 px-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
                                <CheckCircle className="h-3 w-3 text-green-300 flex-shrink-0" />
                                <span className="text-xs text-cream-25">{item.item_name}</span>
                                <Badge variant="secondary" className="text-[10px] bg-vibrant-blue/20 text-cream-25/70">
                                  {item.item_type}
                                </Badge>
                                <span className="text-[10px] text-cream-25/50 ml-auto">
                                  {new Date(item.completed_at).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-cream-25/50 italic text-xs">No items completed in this period.</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-cream-25/50 italic">No archived periods yet.</div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderRange = (range: Range) => {
    const isExpanded = expanded.has(range.id)
    const hasMountains = range.mountains && range.mountains.filter(m => !m.completed).length > 0

    return (
      <div key={range.id} className="mb-6 border-b border-white/10 pb-6">
        <div
          className="flex items-center gap-3 py-2 hover:bg-white/5 rounded px-2 transition-colors cursor-pointer"
          onClick={() => hasMountains && toggleExpanded(range.id)}
        >
          {hasMountains ? (
            isExpanded ? (
              <ChevronDown className="h-6 w-6 text-cream-25 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-6 w-6 text-cream-25 flex-shrink-0" />
            )
          ) : (
            <Circle className="h-5 w-5 text-cream-25/50 flex-shrink-0" />
          )}
          <h2 className="text-2xl font-bold text-cream-25">{range.name}</h2>
          {range.tag && (
            <Badge variant="secondary" className="bg-vibrant-blue/20 text-cream-25">
              {range.tag}
            </Badge>
          )}
        </div>
        {isExpanded && (
          <div className="mt-2">
            {hasMountains && range.mountains.filter(m => !m.completed).map((mountain) => renderMountain(mountain, range.id, 0))}
            {renderResetPeriod(range.id, 0)}
            {renderArchives(range.id, 0)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {ranges.length === 0 ? (
        <div className="text-center text-cream-25/50 py-8">
          No items to display. Create some in the Vision Board!
        </div>
      ) : (
        ranges.map((range) => renderRange(range))
      )}
    </div>
  )
}
