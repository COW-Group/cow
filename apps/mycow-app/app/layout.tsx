import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CopilotProvider } from "@/contexts/copilot-context"
import { OnboardingProvider } from "@/contexts/onboarding-context" // Import OnboardingProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MyCOW - Financial Flow Management",
  description: "Manage your financial flows with MyCOW",
  manifest: "/manifest.json", // Link to your PWA manifest
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover", // Ensures content extends into safe areas
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#fefdfb" }, // Cream-25 hex
      { media: "(prefers-color-scheme: dark)", color: "#0C0C0D" }, // Ink-950 hex
    ],
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CopilotProvider>
          <OnboardingProvider>{children}</OnboardingProvider>
        </CopilotProvider>
      </body>
    </html>
  )
}
