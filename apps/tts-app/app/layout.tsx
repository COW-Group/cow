import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "COW Voice Synthesis - Text to Speech",
  description: "Convert unlimited text to speech using MyCow onboarding voices. Powered by COW Group. Works offline as a Progressive Web App.",
  keywords: ["text to speech", "TTS", "voice synthesis", "COW", "MyCow", "accessibility", "PWA"],
  authors: [{ name: "COW Group" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "COW Voice",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "COW Voice Synthesis",
    title: "COW Voice Synthesis - Text to Speech",
    description: "Convert unlimited text to speech using MyCow onboarding voices",
  },
  twitter: {
    card: "summary",
    title: "COW Voice Synthesis",
    description: "Convert unlimited text to speech using MyCow onboarding voices",
  },
}

export const viewport: Viewport = {
  themeColor: "#007BA7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
