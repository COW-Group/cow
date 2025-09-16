"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthService } from "@/lib/auth-service"
import { HabitsBoardWrapper } from "@/components/HabitsBoardWrapper"
import { Button } from "@/components/ui/button"
import { Loader2Icon, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HabitsPage() {
  console.log("[HabitsPage] Rendering")
  const router = useRouter()
  const { user, loading: authLoading } = useAuth(AuthService)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasMountedRef = useRef(false)
  const [showHabitsBoard, setShowHabitsBoard] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date("2025-08-08T22:11:00-07:00")) // 10:11 PM PDT, August 08, 2025

  useEffect(() => {
    console.log("[HabitsPage] useEffect running, authLoading:", authLoading, "userId:", user?.id)
    if (!authLoading && user?.id) {
      if (!hasMountedRef.current) {
        setIsLoading(false)
        hasMountedRef.current = true
      }
    } else if (!authLoading && !user?.id) {
      setIsLoading(false)
      setError("Please sign in to view your habits.")
      router.push("/auth/signin")
    }
  }, [authLoading, user?.id, router])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 shadow-lg">
          <Loader2Icon className="h-10 w-10 animate-spin text-white" />
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-4 shadow-lg">
          <p className="text-lg text-white">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue to-dark-purple text-white p-4">
      <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 bg-gray-900/50 border-b border-white/20 rounded-t-lg">
        <h1 className="text-3xl font-bold">Habits</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="text-white hover:bg-white/20"
            title="Previous Month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg">
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="text-white hover:bg-white/20"
            title="Next Month"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHabitsBoard(!showHabitsBoard)}
            className={showHabitsBoard ? "bg-white/20" : "bg-black/20 backdrop-blur-md"}
            title="Toggle Habits Board"
          >
            <Calendar className="h-5 w-5 text-white" />
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 max-w-[1280px] flex-1 flex overflow-x-auto">
        {showHabitsBoard && (
          <Card className="w-full h-full flex overflow-x-auto bg-gray-900/50 border border-white/20 rounded-b-lg shadow-lg">
            <HabitsBoardWrapper currentMonth={currentMonth} />
          </Card>
        )}
      </main>
    </div>
  )
}