"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Check, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditableItemProps {
  id: string
  name: string
  onUpdate: (newName: string, completed?: boolean) => void // Ensure completed is optional for non-breath items
  onDelete: () => void
  onAddChild?: (name: string) => void
  hasChildren?: boolean
  children?: React.ReactNode
  level?: number
  isCompleted?: boolean
  onToggleCompleted?: (completed: boolean) => void
}

export function EditableItem({
  id,
  name,
  onUpdate,
  onDelete,
  onAddChild,
  hasChildren,
  children,
  level = 0,
  isCompleted = false,
  onToggleCompleted,
}: EditableItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentName, setCurrentName] = useState(name)
  const [isExpanded, setIsExpanded] = useState(true)
  const [newChildName, setNewChildName] = useState("")

  const handleSave = () => {
    onUpdate(currentName, isCompleted)
    setIsEditing(false)
  }

  const handleAddChild = () => {
    if (newChildName.trim()) {
      onAddChild?.(newChildName.trim())
      setNewChildName("")
    }
  }

  const paddingLeft = `${level * 1.5}rem` // Adjust padding based on level

  return (
    <div className="mb-2 rounded-md bg-white/5 p-3 shadow-sm border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow min-w-0">
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mr-2 text-cream-25/70 hover:bg-white/10"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          {onToggleCompleted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCompleted(!isCompleted)}
              className="mr-2 text-cream-25/70 hover:bg-white/10"
              aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
              {isCompleted ? <Check className="h-4 w-4 text-green-400" /> : <Check className="h-4 w-4" />}
            </Button>
          )}
          {isEditing ? (
            <Input
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-grow bg-white/10 border-cream-25/30 text-cream-25 placeholder:text-cream-25/70 focus:ring-sapphire-blue focus:border-sapphire-blue"
            />
          ) : (
            <span className={cn("font-medium text-cream-25 truncate", isCompleted && "line-through text-cream-25/50")}>
              {name}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="text-cream-25/70 hover:bg-white/10"
            aria-label="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-400 hover:bg-white/10"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isExpanded && children && <div style={{ paddingLeft: paddingLeft }}>{children}</div>}
      {onAddChild && isExpanded && (
        <div className="mt-2 flex items-center" style={{ paddingLeft: paddingLeft }}>
          <Input
            placeholder="Add new..."
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
            className="flex-grow mr-2 bg-white/10 border-cream-25/30 text-cream-25 placeholder:text-cream-25/70 focus:ring-sapphire-blue focus:border-sapphire-blue"
          />
          <Button onClick={handleAddChild} className="bg-sapphire-blue hover:bg-sapphire-blue/90 text-cream-25">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
