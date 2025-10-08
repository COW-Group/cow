"use client"

import React, { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
  habits: any[]
}

interface HabitGroupFilterProps {
  categories: Category[]
  selectedGroup: string | null
  onSelectGroup: (groupId: string | null) => void
  onAddGroup?: () => void
}

export const HabitGroupFilter: React.FC<HabitGroupFilterProps> = ({
  categories,
  selectedGroup,
  onSelectGroup,
  onAddGroup,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCategory = selectedGroup
    ? categories.find(cat => cat.id === selectedGroup)
    : null

  const displayName = selectedCategory ? selectedCategory.name : "All Habits"

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105"
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 24px rgba(0, 0, 0, 0.06)',
        }}
      >
        <span className="text-sm sm:text-base font-inter font-medium text-cream-25 tracking-wide uppercase">
          {displayName}
        </span>
        <ChevronDown
          className={`h-4 w-4 sm:h-5 sm:w-5 text-cream-25 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="absolute top-full mt-2 left-0 min-w-[200px] sm:min-w-[250px] rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(60px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 20px 40px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="py-2">
              {/* All Habits Option */}
              <button
                onClick={() => {
                  onSelectGroup(null)
                  setIsOpen(false)
                }}
                className="w-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: "rgba(253, 250, 243, 0.5)" }}
                  />
                  <span className="text-sm sm:text-base font-inter text-cream-25">
                    All Habits
                  </span>
                </div>
                {!selectedGroup && (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-cream-25" />
                )}
              </button>

              {/* Divider */}
              <div
                className="my-1.5 mx-3 h-px"
                style={{ background: "rgba(253, 250, 243, 0.1)" }}
              />

              {/* Individual Groups */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onSelectGroup(category.id)
                    setIsOpen(false)
                  }}
                  className="w-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-1 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm sm:text-base font-inter text-cream-25">
                        {category.name}
                      </span>
                      <span className="text-xs text-cream-25/60">
                        {category.habits.length} {category.habits.length === 1 ? "habit" : "habits"}
                      </span>
                    </div>
                  </div>
                  {selectedGroup === category.id && (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-cream-25" />
                  )}
                </button>
              ))}

              {/* Add Group Option */}
              {onAddGroup && (
                <>
                  <div
                    className="my-1.5 mx-3 h-px"
                    style={{ background: "rgba(253, 250, 243, 0.1)" }}
                  />
                  <button
                    onClick={() => {
                      onAddGroup()
                      setIsOpen(false)
                    }}
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-cream-25/20 flex items-center justify-center">
                      <span className="text-cream-25 text-lg">+</span>
                    </div>
                    <span className="text-sm sm:text-base font-inter text-cream-25">
                      Add Group
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
