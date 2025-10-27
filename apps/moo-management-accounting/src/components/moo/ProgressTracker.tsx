import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calculator, BarChart3, Briefcase, BookOpen, GraduateCapIcon as GraduateCap, Link2 } from 'lucide-react'

type Discipline = "financial_accounting" | "cost_accounting" | "management_accounting" | "financial_management" | "all"

interface ProgressTrackerProps {
  conceptsMastered: Record<Discipline, number>
  currentTopic?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  isCollapsed?: boolean
  onToggle?: () => void
}

const totalConcepts = {
  financial_accounting: 8,
  cost_accounting: 8,
  management_accounting: 8,
  financial_management: 6,
  all: 0
}

const disciplineConfig = [
  {
    key: 'financial_accounting' as Discipline,
    label: 'Financial',
    icon: FileText,
    color: '#3b82f6'
  },
  {
    key: 'cost_accounting' as Discipline,
    label: 'Cost',
    icon: Calculator,
    color: '#C77A58'
  },
  {
    key: 'management_accounting' as Discipline,
    label: 'Management',
    icon: BarChart3,
    color: '#00A5CF'
  },
  {
    key: 'financial_management' as Discipline,
    label: 'Financial Mgmt',
    icon: Briefcase,
    color: '#10b981'
  }
]

export default function ProgressTracker({
  conceptsMastered,
  currentTopic,
  difficulty = 'beginner',
  isCollapsed = false,
  onToggle
}: ProgressTrackerProps) {
  if (isCollapsed) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-4 top-24 z-40"
      >
        <button
          onClick={onToggle}
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #00A5CF 0%, #0ea5e9 100%)'
          }}
        >
          <BarChart3 className="w-5 h-5 text-white" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white dark:bg-gray-800/50 border-l border-gray-200 dark:border-gray-700/50 overflow-y-auto flex-shrink-0"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100">Learning Progress</h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Discipline Progress */}
      <div className="p-6 space-y-6">
        {disciplineConfig.map((disc) => {
          const mastered = conceptsMastered[disc.key] || 0
          const total = totalConcepts[disc.key]
          const percentage = (mastered / total) * 100
          const Icon = disc.icon

          return (
            <div key={disc.key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: disc.color }} />
                  <span className="text-sm font-light text-gray-700 dark:text-gray-300">
                    {disc.label}
                  </span>
                </div>
                <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                  {mastered}/{total}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: disc.color }}
                />
              </div>

              {/* Concept Dots */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i < mastered ? disc.color : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Current Topic */}
      {currentTopic && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/70 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-[#00A5CF]" />
            <span className="text-xs font-light text-gray-500 dark:text-gray-400">Current Topic</span>
          </div>
          <p className="text-sm font-normal text-gray-900 dark:text-gray-100 mb-3">
            {currentTopic}
          </p>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-light text-gray-500 dark:text-gray-400">Difficulty:</span>
            <div className="flex gap-1">
              {['beginner', 'intermediate', 'advanced'].map((level, i) => (
                <div
                  key={level}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i < ['beginner', 'intermediate', 'advanced'].indexOf(difficulty) + 1
                      ? '#10b981'
                      : '#e5e7eb'
                  }}
                />
              ))}
            </div>
            <span className="text-xs font-light text-gray-600 dark:text-gray-400 capitalize">
              {difficulty}
            </span>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-light text-gray-500 dark:text-gray-400 mb-3">Quick Reference</h4>
        <div className="space-y-2">
          {[
            { icon: '📖', label: 'Formulas' },
            { icon: '📚', label: 'Glossary' },
            { icon: '🔗', label: 'Related Concepts' }
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-sm font-light text-gray-700 dark:text-gray-300">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
