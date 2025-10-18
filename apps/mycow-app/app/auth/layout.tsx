import type React from "react"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-25 dark:bg-ink-950 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
