"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ZenNavigation } from "@/components/zen-navigation"
import { FlowCompass } from "@/components/flow-compass"
import { AssetsSection } from "@/components/assets-section"
import { VehiclesSection } from "@/components/vehicles-section"
import { ProtectSection } from "@/components/protect-section"
import { ContributeSection } from "@/components/contribute-section"
import { ProfileSection } from "@/components/profile-section"
import type React from "react"
import { useRouter } from "next/navigation"
import { getClientSupabaseClient } from "@/lib/supabase/client"
import { CopilotChatModal } from "@/components/copilot-chat-modal"
import { ChatIcon } from "@/components/chat-icon"
// import { CopilotProvider } from "@/contexts/copilot-context" // Add this import

export default function MyCOWApp() {
  const [activeTab, setActiveTab] = useState("compass")
  const [showNotification, setShowNotification] = useState(false)
  const [mooMessage, setMooMessage] = useState("")
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatInitialQuery, setChatInitialQuery] = useState("")
  const router = useRouter()
  const supabase = getClientSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      console.log("app/page.tsx: Checking user session...")
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        console.log("app/page.tsx: No session found, redirecting to landing page.")
        router.push("/landing")
      } else {
        console.log("app/page.tsx: Session found, user is authenticated.")
        setLoadingAuth(false)
        setTimeout(() => {
          setShowNotification(true)
          setMooMessage("Welcome to your zen financial journey")
          setTimeout(() => setShowNotification(false), 4000)
        }, 1000)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("app/page.tsx: Auth state changed event:", _event, "Session:", session)
      if (!session) {
        console.log("app/page.tsx: Auth state changed - no session, redirecting to landing page.")
        router.push("/landing")
      } else {
        console.log("app/page.tsx: Auth state changed - session found, setting loadingAuth to false.")
        setLoadingAuth(false)
      }
    })

    return () => {
      authListener?.data?.subscription?.unsubscribe()
    }
  }, [router, supabase])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const messages = {
      compass: "Finding balance in your financial flows",
      contribute: "Aligning wealth with purpose",
      assets: "Nurturing your portfolio growth",
      vehicles: "Cultivating wealth vehicles",
      protect: "Securing your financial peace",
      profile: "Reflecting on your journey",
    }
    setMooMessage(messages[tabId as keyof typeof messages])
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  const handleOpenChat = (query?: string) => {
    setChatInitialQuery(query || "")
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setChatInitialQuery("")
  }

  if (loadingAuth) {
    console.log("app/page.tsx: Loading authentication...")
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-25 dark:bg-ink-950">
        <p className="text-ink-600 dark:text-cream-300">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-25 dark:bg-ink-950">
      <ZenNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="h-20" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: showNotification ? 1 : 0, y: showNotification ? 0 : -50 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md"
      >
        <div className="bg-cream-50/95 dark:bg-ink-800/95 text-ink-800 dark:text-cream-100 p-4 rounded-2xl shadow-lg backdrop-blur-md border border-cream-200/50 dark:border-ink-700/50 flex items-center space-x-3 mx-4">
          <div className="flex-shrink-0">
            <img src="/images/logo-clean.png" alt="MyCOW Logo" className="w-6 h-6" />
          </div>
          <p className="flex-1 font-light">{mooMessage}</p>
        </div>
      </motion.div>
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection isActive={activeTab === "compass"}>
            <FlowCompass />
          </AnimatedSection>
          <AnimatedSection isActive={activeTab === "assets"}>
            <AssetsSection />
          </AnimatedSection>
          <AnimatedSection isActive={activeTab === "vehicles"}>
            <VehiclesSection />
          </AnimatedSection>
          <AnimatedSection isActive={activeTab === "protect"}>
            <ProtectSection />
          </AnimatedSection>
          <AnimatedSection isActive={activeTab === "contribute"}>
            <ContributeSection />
          </AnimatedSection>
          <AnimatedSection isActive={activeTab === "profile"}>
            <ProfileSection />
          </AnimatedSection>
        </div>
      </main>
      <ChatIcon onOpenChat={() => handleOpenChat()} />
      <CopilotChatModal isOpen={isChatOpen} onClose={handleCloseChat} initialQuery={chatInitialQuery} />
    </div>
  )
}

function AnimatedSection({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 20,
        display: isActive ? "block" : "none",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
