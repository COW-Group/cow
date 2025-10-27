"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard/mygold")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex justify-center mb-2 sm:mb-4">
            <Image
              src="/mycow-logo.png"
              alt="MyCow.io"
              width={140}
              height={140}
              className="sm:w-[180px] sm:h-[180px]"
              priority
            />
          </div>
          <Card className="border-blue-100 shadow-xl">
            <CardHeader className="space-y-1 px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-blue-600">MyCow.io Portal</CardTitle>
              <CardDescription className="text-center text-sm">Internal Members Access</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="member@mycow.io"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-blue-200 focus:border-blue-400 h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-blue-200 focus:border-blue-400 h-11"
                    />
                  </div>
                  {error && <p className="text-xs sm:text-sm text-red-500 bg-red-50 p-2 sm:p-3 rounded">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <p className="text-center text-xs sm:text-sm text-gray-600 px-4">© 2025 Cow Group of Companies. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
