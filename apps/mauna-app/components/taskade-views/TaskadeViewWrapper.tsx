// components/taskade-views/TaskadeViewWrapper.tsx
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  LayoutList,
  LayoutGrid,
  Calendar,
  ListTree,
  GanttChartSquare,
  TableIcon,
  FileEdit
} from "lucide-react"
import { OutlineView } from "./OutlineView"
import { MarkdownOutlineView } from "./MarkdownOutlineView"
import { BoardView } from "./BoardView"
import { ListView } from "./ListView"
import { GanttView } from "./GanttView"
import { CalendarView } from "./CalendarView"
import { TableView } from "./TableView"
import type { Range } from "@/lib/types"
import type { ResetPeriod, ArchivedItem } from "@/lib/database-service"

type ViewType = "outline" | "markdown" | "board" | "list" | "gantt" | "calendar" | "table"

interface TaskadeViewWrapperProps {
  ranges: Range[]
  currentPeriods?: { [rangeId: string]: Partial<ResetPeriod> }
  archives?: { [rangeId: string]: { previousResets: ResetPeriod[]; completed: Record<string, ArchivedItem[]> } }
  onUpdateItem?: (updates: any) => Promise<void>
}

export function TaskadeViewWrapper({
  ranges,
  currentPeriods = {},
  archives = {},
  onUpdateItem
}: TaskadeViewWrapperProps) {
  const [currentView, setCurrentView] = useState<ViewType>("outline")

  // Keyboard shortcuts for switching views
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // Switch views based on key pressed
      switch (event.key.toLowerCase()) {
        case 'o':
          event.preventDefault()
          setCurrentView('outline')
          break
        case 'e':
          event.preventDefault()
          setCurrentView('markdown')
          break
        case 'b':
          event.preventDefault()
          setCurrentView('board')
          break
        case 'l':
          event.preventDefault()
          setCurrentView('list')
          break
        case 't':
          event.preventDefault()
          setCurrentView('table')
          break
        case 'g':
          event.preventDefault()
          setCurrentView('gantt')
          break
        case 'c':
          event.preventDefault()
          setCurrentView('calendar')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const views = [
    { id: "outline" as ViewType, label: "Outline", icon: ListTree, shortcut: "O" },
    { id: "markdown" as ViewType, label: "Editor", icon: FileEdit, shortcut: "E" },
    { id: "board" as ViewType, label: "Board", icon: LayoutGrid, shortcut: "B" },
    { id: "list" as ViewType, label: "List", icon: LayoutList, shortcut: "L" },
    { id: "table" as ViewType, label: "Table", icon: TableIcon, shortcut: "T" },
    { id: "gantt" as ViewType, label: "Gantt", icon: GanttChartSquare, shortcut: "G" },
    { id: "calendar" as ViewType, label: "Calendar", icon: Calendar, shortcut: "C" },
  ]

  const renderView = () => {
    switch (currentView) {
      case "outline":
        return <OutlineView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "markdown":
        return <MarkdownOutlineView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "board":
        return <BoardView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "list":
        return <ListView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "gantt":
        return <GanttView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "calendar":
        return <CalendarView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      case "table":
        return <TableView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
      default:
        return <OutlineView ranges={ranges} currentPeriods={currentPeriods} archives={archives} onUpdateItem={onUpdateItem} />
    }
  }

  return (
    <div className="w-full bg-white/5 backdrop-blur-md rounded-lg border border-white/20 p-4">
      {/* View Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/20 pb-4">
        <span className="text-sm font-semibold text-cream-25 mr-2">View:</span>
        {views.map((view) => {
          const Icon = view.icon
          return (
            <Button
              key={view.id}
              variant={currentView === view.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView(view.id)}
              title={`${view.label} (Press ${view.shortcut})`}
              className={`flex items-center gap-2 relative ${
                currentView === view.id
                  ? "bg-vibrant-blue text-cream-25"
                  : "text-cream-25/70 hover:text-cream-25 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{view.label}</span>
              <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-xs bg-black/20 rounded border border-white/10">
                {view.shortcut}
              </kbd>
            </Button>
          )
        })}
      </div>

      {/* Current View */}
      <div className="min-h-[500px]">
        {renderView()}
      </div>
    </div>
  )
}
