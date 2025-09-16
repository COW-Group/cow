"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LogoMountain } from "@/components/logo-mountain"

// Array of local background images (copied from app/page.tsx for consistency)
const backgroundImages = [
  "/images/unsplash-library/harsh-jadav-ybw0y8C6clo-unsplash.jpg",
  "/images/unsplash-library/bruno-aguirre-CLmYbo-btDs-unsplash.jpg",
  "/images/unsplash-library/sebastien-gabriel--IMlv9Jlb24-unsplash.jpg",
  "/images/unsplash-library/simon-wilkes-WtjaOw9G5FA-unsplash.jpg",
  "/images/unsplash-library/simon-maage-NcNu8kzunb4-unsplash.jpg",
  "/images/unsplash-library/marek-piwnicki-5ViMa6gcpsQ-unsplash.jpg",
  "/images/unsplash-library/fadhil-abhimantra-fUfPX4zgOWo-unsplash.jpg",
]

export default function AuthConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Confirming your email...")
  const hasProcessedRef = useRef(false)

  const [currentBackgroundImage, setCurrentBackgroundImage] = useState<string>("")

  useEffect(() => {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 0)
    const diff = today.getTime() - startOfYear.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    const imageIndex = dayOfYear % backgroundImages.length
    setCurrentBackgroundImage(backgroundImages[imageIndex])

    if (hasProcessedRef.current) {
      return
    }

    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    if (error) {
      setStatus("error")
      setMessage(errorDescription || "An error occurred during email confirmation.")
      toast({
        title: "Email Confirmation Failed",
        description: errorDescription || "Please try signing in or signing up again.",
        variant: "destructive",
      })
    } else {
      setStatus("success")
      setMessage("Your email has been successfully confirmed! Redirecting to dashboard...")
      toast({
        title: "Email Confirmed!",
        description: "Your account is now active. Redirecting...",
      })
    }

    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    hasProcessedRef.current = true

    return () => clearTimeout(timer)
  }, [searchParams, router, toast])

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-center font-inter bg-cover bg-center transition-all duration-1000 ease-in-out p-4"
      style={{ backgroundImage: `url(${currentBackgroundImage})` }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Logo at the top center */}
      <div className="absolute top-10 z-10">
        <LogoMountain size={80} iconSize={40} />
      </div>

      <Card className="w-full max-w-md shadow-2xl zen-card text-center relative z-10">
        <CardHeader>
          <CardTitle
            className={`text-3xl font-montserrat ${
              status === "success" ? "text-logo-blue" : "text-ink-950 dark:text-cream-25"
            }`}
          >
            {status === "loading" && "Processing..."}
            {status === "success" && "Success!"}
            {status === "error" && "Error!"}
          </CardTitle>
          <CardDescription
            className={`font-inter ${status === "success" ? "text-white" : "text-ink-700 dark:text-cream-100"}`}
          >
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {status === "loading" && (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-logo-blue"></div>
          )}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-white" />}
          {status === "error" && <XCircle className="h-16 w-16 text-destructive" />}
          {status !== "loading" && (
            <Button
              asChild
              className="mt-4 zen-button-primary bg-logo-blue hover:bg-logo-blue/90 text-white font-bold hover:scale-[1.02]"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
