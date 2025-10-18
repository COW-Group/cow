"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CashflowQuadrantProps {
  income: number
  expenses: number
}

export const CashflowQuadrant: React.FC<CashflowQuadrantProps> = ({ income, expenses }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw quadrant lines
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    ctx.strokeStyle = "#94a3b8" // slate-400
    ctx.lineWidth = 1

    // Horizontal line
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(rect.width, centerY)
    ctx.stroke()

    // Vertical line
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, rect.height)
    ctx.stroke()

    // Draw quadrant labels
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.fillStyle = "#475569" // slate-600

    // Employee (E)
    ctx.fillText("E", centerX - 40, centerY - 20)

    // Self-employed (S)
    ctx.fillText("S", centerX + 30, centerY - 20)

    // Business Owner (B)
    ctx.fillText("B", centerX - 40, centerY + 40)

    // Investor (I)
    ctx.fillText("I", centerX + 30, centerY + 40)

    // Draw user's position based on income and expenses
    if (income > 0 || expenses > 0) {
      const x = centerX + (income > 0 ? 20 : -20)
      const y = centerY + (expenses > income ? 20 : -20)

      ctx.fillStyle = "#3b82f6" // blue-500
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#eff6ff" // blue-50
      ctx.font = "bold 10px Inter, system-ui, sans-serif"
      ctx.fillText("YOU", x - 12, y + 3)
    }
  }, [income, expenses])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full aspect-square max-w-[240px] mx-auto mt-4"
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ maxWidth: "100%", maxHeight: "100%" }} />
    </motion.div>
  )
}
