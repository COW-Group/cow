"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Eye,
  Folders,
  Waves,
  BarChart3,
  LogOut,
  UserCircle,
  Link,
  Quote,
  HelpCircle,
  Lightbulb,
  Sprout,
  CheckSquare,
  Volume2,
  Clock,
  User,
  Bell,
  Palette,
  LockKeyhole,
  Menu,
  Repeat,
  Cog,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { AppSettings, User as UserType, UserProfile } from "@/lib/types"
import { NavLinks } from "./nav-links"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth-service"

interface DashboardMenuProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  updateSettings: (settings: AppSettings) => void
  openTaskListManager: () => void
  openVisionBoard: () => void
  handleSignOut: () => void
  currentUser: UserType | null
  userProfileName: string | null
  userId: string
}

export function DashboardMenu({
  isOpen,
  onClose,
  settings: localSettings,
  updateSettings,
  openTaskListManager,
  openVisionBoard,
  handleSignOut,
  currentUser,
  userProfileName,
  userId,
}: DashboardMenuProps) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("floating-nav")

  // Background Images Data
  const backgroundImages = {
    morning: [
      { name: "Kalen Emsley", path: "/images/nature-backdrops/morning/kalen-emsley-_LuLiJc1cdo-unsplash.jpg" },
      { name: "Adam Kool", path: "/images/nature-backdrops/morning/adam-kool-ndN00KmbJ1c-unsplash.jpg" }
    ],
    sunrise: [
      { name: "Damian Markutt", path: "/images/nature-backdrops/sunrise/damian-markutt-Dhmn6ete6g8-unsplash.jpg" },
      { name: "Simon Maage", path: "/images/nature-backdrops/sunrise/simon-maage-NcNu8kzunb4-unsplash.jpg" },
      { name: "Simon Wilkes", path: "/images/nature-backdrops/sunrise/simon-wilkes-WtjaOw9G5FA-unsplash.jpg" }
    ],
    daytime: [
      { name: "Fadhil Abhimantra", path: "/images/nature-backdrops/daytime/fadhil-abhimantra-fUfPX4zgOWo-unsplash.jpg" }
    ],
    evening: [
      { name: "Marek Piwnicki", path: "/images/nature-backdrops/evening/marek-piwnicki-5ViMa6gcpsQ-unsplash.jpg" }
    ],
    sunset: [
      { name: "Bruno Aguirre", path: "/images/nature-backdrops/sunset/bruno-aguirre-CLmYbo-btDs-unsplash.jpg" },
      { name: "Dave Hoefler", path: "/images/nature-backdrops/sunset/dave-hoefler-wW0_7-BEOPo-unsplash.jpg" },
      { name: "Harsh Jadav", path: "/images/nature-backdrops/sunset/harsh-jadav-ybw0y8C6clo-unsplash.jpg" },
      { name: "Paul Mocan", path: "/images/nature-backdrops/sunset/paul-mocan-QnOdvmndfu4-unsplash.jpg" },
      { name: "Sebastien Gabriel", path: "/images/nature-backdrops/sunset/sebastien-gabriel--IMlv9Jlb24-unsplash.jpg" }
    ],
    night: [
      { name: "Cee", path: "/images/nature-backdrops/night/cee-R_c77Rx9UzM-unsplash.jpg" },
      { name: "Krzysztof Kowalik", path: "/images/nature-backdrops/night/krzysztof-kowalik-AywBz5soMy4-unsplash.jpg" },
      { name: "Shawn", path: "/images/nature-backdrops/night/shawn-shGeY3Tv1S0-unsplash.jpg" },
      { name: "Vincentiu Solomon", path: "/images/nature-backdrops/night/vincentiu-solomon-ln5drpv_ImI-unsplash.jpg" }
    ]
  }

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileForm, setProfileForm] = useState({ name: "", email: "" })
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" })
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState("morning")
  const [currentBackground, setCurrentBackground] = useState("")

  // Initialize current background from localStorage or settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userSelectedBackground = localStorage.getItem('userSelectedBackground')
      const userSelectedDate = localStorage.getItem('userSelectedBackgroundDate')
      const currentDateString = new Date().toDateString()

      if (userSelectedBackground && userSelectedDate === currentDateString) {
        setCurrentBackground(userSelectedBackground)
      } else if (localSettings.backgroundImage) {
        setCurrentBackground(localSettings.backgroundImage)
      }
    }
  }, [localSettings.backgroundImage])
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(localSettings)

  const { toast } = useToast()

  useEffect(() => {
    setCurrentSettings(localSettings)
  }, [localSettings])

  useEffect(() => {
    if (isOpen && activeCategory === "settings") {
      loadProfileAndSettings()
    }
  }, [isOpen, activeCategory, userId])

  const loadProfileAndSettings = async () => {
    setIsLoading(true)
    try {
      const { profile: fetchedProfile, error: profileError } = await AuthService.getUserProfile(userId)
      if (profileError || !fetchedProfile) {
        console.error("Error loading user profile:", profileError)
        toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" })
        setProfile(null)
        setProfileForm({ name: "", email: "" })
      } else {
        setProfile(fetchedProfile)
        setProfileForm({ name: fetchedProfile.name || "", email: fetchedProfile.email })
      }
    } catch (error) {
      console.error("Error loading profile/settings:", error)
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = async (settingKey: keyof AppSettings, value: any) => {
    const newSettings = { ...currentSettings, [settingKey]: value }
    setCurrentSettings(newSettings)
    updateSettings(newSettings)

    console.log("Mock: Updating settings:", newSettings)
  }

  const handleProfileSave = async () => {
    if (!profile) return

    setIsSavingProfile(true)
    try {
      const { error } = await AuthService.updateProfile(userId, {
        name: profileForm.name,
        email: profileForm.email,
      })
      if (error) throw new Error(error)

      toast({ title: "Profile Updated ✨", description: "Your profile has been saved successfully" })
      setProfile((prev) => (prev ? { ...prev, name: profileForm.name, email: profileForm.email } : null))
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({ title: "Error", description: `Failed to update profile: ${error.message}`, variant: "destructive" })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" })
      return
    }

    setIsSavingPassword(true)
    try {
      const { error } = await AuthService.updatePassword(passwordForm.newPassword)
      if (error) throw new Error(error)

      toast({ title: "Password Updated ✨", description: "Your password has been changed successfully." })
      setPasswordForm({ newPassword: "", confirmPassword: "" })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({ title: "Error", description: `An unexpected error occurred: ${error.message}`, variant: "destructive" })
    } finally {
      setIsSavingPassword(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveCategory("floating-nav")
    }
  }, [isOpen])

  const navigateAndClose = (path: string) => {
    router.push(path)
    onClose()
  }

  const handleBackgroundChange = (imagePath: string) => {
    setCurrentBackground(imagePath)
    // Update background in the parallax-container
    if (typeof window !== 'undefined') {
      const parallaxContainer = document.querySelector('.parallax-container') as HTMLElement
      if (parallaxContainer) {
        parallaxContainer.style.backgroundImage = `url('${imagePath}')`

        // Also update the iOS fallback
        const existingStyle = document.querySelector('#custom-bg-style')
        if (existingStyle) {
          existingStyle.remove()
        }

        const style = document.createElement('style')
        style.id = 'custom-bg-style'
        style.textContent = `
          @supports (-webkit-touch-callout: none) {
            .parallax-container::before {
              background-image: url('${imagePath}') !important;
            }
          }
        `
        document.head.appendChild(style)
      }

      // Store user's manual selection to prevent automatic override
      localStorage.setItem('userSelectedBackground', imagePath)
      localStorage.setItem('userSelectedBackgroundDate', new Date().toDateString())
    }
    // Save to settings
    handleSettingChange("backgroundImage", imagePath)
  }

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      "floating-nav": <LayoutDashboard className="h-6 w-6 text-logo-blue" />,
      "app-features": <CheckSquare className="h-6 w-6 text-sage-600" />,
      "dashboard-elements": <Folders className="h-6 w-6 text-moss-600" />,
      appearance: <Palette className="h-6 w-6 text-soft-gold" />,
      notifications: <Bell className="h-6 w-6 text-emerald-600" />,
      settings: <Cog className="h-6 w-6 text-ink-600" />
    }
    return iconMap[category as keyof typeof iconMap] || <LayoutDashboard className="h-6 w-6 text-logo-blue" />
  }

  const getCategoryDescription = (category: string) => {
    const descriptionMap = {
      "floating-nav": "Control which pages appear in your floating navigation menu",
      "app-features": "Enable or disable specific app features and functionality",
      "dashboard-elements": "Customize what appears on your main dashboard",
      appearance: "Personalize the visual theme and styling of the app",
      notifications: "Configure alerts, sounds, and notification preferences",
      settings: "Manage your account and application preferences"
    }
    return descriptionMap[category as keyof typeof descriptionMap] || "Customize your experience"
  }

  const renderContent = () => {
    switch (activeCategory) {
      case "floating-nav":
        return (
          <div className="space-y-8">
            <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                  <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                    <LayoutDashboard className="h-5 w-5 text-logo-blue" />
                  </div>
                  Navigation Menu Pages
                </CardTitle>
                <CardDescription className="font-inter text-base">Control which pages appear in your floating navigation menu. Toggle pages on or off to customize your experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-logo-blue/10 to-transparent dark:from-logo-blue/5 hover:from-logo-blue/15 dark:hover:from-logo-blue/10 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-logo-blue"></div>
                        <Label htmlFor="show-focus-page" className="font-inter font-medium">
                          Focus Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Deep work and productivity tools for concentrated sessions
                      </p>
                    </div>
                    <Switch
                      id="show-focus-page"
                      checked={currentSettings.showHeaderFocus || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderFocus", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/20 hover:from-emerald-50/40 dark:hover:from-emerald-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        <Label htmlFor="show-health-page" className="font-inter font-medium">
                          Health Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Health tracking, fitness goals, and wellness monitoring
                      </p>
                    </div>
                    <Switch
                      id="show-health-page"
                      checked={currentSettings.showHeaderHealth || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderHealth", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sage-50/30 to-transparent dark:from-sage-900/20 hover:from-sage-50/40 dark:hover:from-sage-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-600"></div>
                        <Label htmlFor="show-emotional-page" className="font-inter font-medium">
                          Emotional Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Mood tracking, emotional intelligence, and mindfulness tools
                      </p>
                    </div>
                    <Switch
                      id="show-emotional-page"
                      checked={currentSettings.showHeaderEmotional || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderEmotional", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-soft-gold/20 to-transparent dark:from-soft-gold/10 hover:from-soft-gold/30 dark:hover:from-soft-gold/15 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-soft-gold"></div>
                        <Label htmlFor="show-vision-page" className="font-inter font-medium">
                          Vision Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Goal visualization, vision boards, and future planning
                      </p>
                    </div>
                    <Switch
                      id="show-vision-page"
                      checked={currentSettings.showHeaderVision || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderVision", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-moss-50/30 to-transparent dark:from-moss-900/20 hover:from-moss-50/40 dark:hover:from-moss-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-moss-600"></div>
                        <Label htmlFor="show-wealth-page" className="font-inter font-medium">
                          Wealth Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Financial tracking, investment tools, and wealth building
                      </p>
                    </div>
                    <Switch
                      id="show-wealth-page"
                      checked={currentSettings.showHeaderWealth || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderWealth", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-50/30 to-transparent dark:from-purple-900/20 hover:from-purple-50/40 dark:hover:from-purple-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        <Label htmlFor="show-social-page" className="font-inter font-medium">
                          Social Page
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Social connections, relationship tracking, and community features
                      </p>
                    </div>
                    <Switch
                      id="show-social-page"
                      checked={currentSettings.showHeaderSocial || false}
                      onCheckedChange={(val) => handleSettingChange("showHeaderSocial", val)}
                      className="ml-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "app-features":
        return (
          <div className="space-y-8">
            <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                  <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-sage-600" />
                  </div>
                  Application Features
                </CardTitle>
                <CardDescription className="font-inter text-base">Enable or disable specific features and functionality across the entire app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-logo-blue/10 to-transparent dark:from-logo-blue/5 hover:from-logo-blue/15 dark:hover:from-logo-blue/10 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-logo-blue"></div>
                        <Label htmlFor="enable-focus-mode" className="font-inter font-medium">
                          Focus Mode Feature
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Enable deep focus sessions with distraction blocking
                      </p>
                    </div>
                    <Switch
                      id="enable-focus-mode"
                      checked={currentSettings.focusMode || false}
                      onCheckedChange={(val) => handleSettingChange("focusMode", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sage-50/30 to-transparent dark:from-sage-900/20 hover:from-sage-50/40 dark:hover:from-sage-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-600"></div>
                        <Label htmlFor="enable-notifications" className="font-inter font-medium">
                          Sound Notifications
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Play audio alerts and chimes for various app events
                      </p>
                    </div>
                    <Switch
                      id="enable-notifications"
                      checked={currentSettings.soundEnabled || false}
                      onCheckedChange={(val) => handleSettingChange("soundEnabled", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-moss-50/30 to-transparent dark:from-moss-900/20 hover:from-moss-50/40 dark:hover:from-moss-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-moss-600"></div>
                        <Label htmlFor="enable-auto-loop" className="font-inter font-medium">
                          Auto Loop Tasks
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Automatically cycle through task lists when completed
                      </p>
                    </div>
                    <Switch
                      id="enable-auto-loop"
                      checked={currentSettings.autoLoop || false}
                      onCheckedChange={(val) => handleSettingChange("autoLoop", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-soft-gold/10 to-transparent dark:from-soft-gold/5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-soft-gold"></div>
                        <Label htmlFor="default-duration" className="font-inter font-medium">
                          Default Task Duration
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Set the default duration for new tasks (1-1439 minutes)
                      </p>
                      <div className="ml-4">
                        <Input
                          id="default-duration"
                          type="number"
                          min={1}
                          max={1439}
                          value={currentSettings.defaultDuration || 30}
                          onChange={(e) =>
                            handleSettingChange("defaultDuration", Number.parseInt(e.target.value, 10) || 30)
                          }
                          className="w-32 bg-cream-50/70 dark:bg-ink-800/70 border-brushed-silver/50 dark:border-ink-700/50 font-inter"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "dashboard-elements":
        return (
          <div className="space-y-8">
            <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                  <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                    <Folders className="h-5 w-5 text-moss-600" />
                  </div>
                  Dashboard Elements
                </CardTitle>
                <CardDescription className="font-inter text-base">Choose what appears on your main dashboard display for a personalized experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sage-50/30 to-transparent dark:from-sage-900/20 hover:from-sage-50/40 dark:hover:from-sage-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-600"></div>
                        <Label htmlFor="show-weather" className="font-inter font-medium">
                          Weather Widget
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Display your local weather information on the dashboard
                      </p>
                    </div>
                    <Switch
                      id="show-weather"
                      checked={currentSettings.showWeather || false}
                      onCheckedChange={(val) => handleSettingChange("showWeather", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-soft-gold/20 to-transparent dark:from-soft-gold/10 hover:from-soft-gold/30 dark:hover:from-soft-gold/15 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-soft-gold"></div>
                        <Label htmlFor="show-greeting" className="font-inter font-medium">
                          Personal Greeting
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Show personalized greeting message in the center
                      </p>
                    </div>
                    <Switch
                      id="show-greeting"
                      checked={currentSettings.showGreeting || false}
                      onCheckedChange={(val) => handleSettingChange("showGreeting", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-moss-50/30 to-transparent dark:from-moss-900/20 hover:from-moss-50/40 dark:hover:from-moss-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-moss-600"></div>
                        <Label htmlFor="show-mantra" className="font-inter font-medium">
                          Daily Mantra
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Display motivational phrases to build positive mental habits
                      </p>
                    </div>
                    <Switch
                      id="show-mantra"
                      checked={currentSettings.showMantra || false}
                      onCheckedChange={(val) => handleSettingChange("showMantra", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-logo-blue/10 to-transparent dark:from-logo-blue/5 hover:from-logo-blue/15 dark:hover:from-logo-blue/10 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-logo-blue"></div>
                        <Label htmlFor="show-tasks" className="font-inter font-medium">
                          Task Overview
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Show your active tasks and progress directly on dashboard
                      </p>
                    </div>
                    <Switch
                      id="show-tasks"
                      checked={currentSettings.showTasks || false}
                      onCheckedChange={(val) => handleSettingChange("showTasks", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/20 hover:from-emerald-50/40 dark:hover:from-emerald-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        <Label htmlFor="show-quotes" className="font-inter font-medium">
                          Inspirational Quotes
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Display daily inspirational quotes at the bottom of dashboard
                      </p>
                    </div>
                    <Switch
                      id="show-quotes"
                      checked={currentSettings.showQuotes || false}
                      onCheckedChange={(val) => handleSettingChange("showQuotes", val)}
                      className="ml-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "appearance":
        return (
          <div className="space-y-8">
            <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                  <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                    <Palette className="h-5 w-5 text-soft-gold" />
                  </div>
                  Visual Appearance
                </CardTitle>
                <CardDescription className="font-inter text-base">Customize the visual theme and styling of your entire app experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-soft-gold/20 to-transparent dark:from-soft-gold/10 hover:from-soft-gold/30 dark:hover:from-soft-gold/15 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-soft-gold"></div>
                        <Label htmlFor="dark-mode" className="font-inter font-medium">
                          Dark Mode
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Switch to a calming dark theme for better focus and reduced eye strain
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={currentSettings.darkMode || false}
                      onCheckedChange={(val) => handleSettingChange("darkMode", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-logo-blue/5 to-transparent dark:from-logo-blue/3">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-logo-blue"></div>
                        <Label className="font-inter font-medium">
                          Background Images
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Choose a background image based on time of day
                      </p>

                      {/* Time of Day Selector */}
                      <div className="ml-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(backgroundImages).map((timeOfDay) => (
                            <Button
                              key={timeOfDay}
                              variant={selectedTimeOfDay === timeOfDay ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTimeOfDay(timeOfDay)}
                              className={`capitalize font-inter text-xs transition-all duration-200 ${
                                selectedTimeOfDay === timeOfDay
                                  ? "bg-logo-blue text-cream-25 shadow-md"
                                  : "glassmorphism border-0 text-ink-700 dark:text-cream-300 hover:bg-cream-25/20 dark:hover:bg-ink-800/30"
                              }`}
                            >
                              {timeOfDay}
                            </Button>
                          ))}
                        </div>

                        {/* Background Image Grid */}
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cream-25/20">
                          {backgroundImages[selectedTimeOfDay as keyof typeof backgroundImages].map((image, index) => (
                            <div
                              key={index}
                              className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                                currentBackground === image.path
                                  ? "border-logo-blue shadow-lg scale-105"
                                  : "border-cream-25/30 dark:border-ink-700/30 hover:border-logo-blue/50 hover:scale-102"
                              }`}
                              onClick={() => handleBackgroundChange(image.path)}
                            >
                              <div className="aspect-video relative">
                                <Image
                                  src={image.path}
                                  alt={image.name}
                                  fill
                                  sizes="(max-width: 400px) 180px, 180px"
                                  className="object-cover transition-all duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-cream-25 text-xs font-inter truncate">{image.name}</p>
                                  </div>
                                </div>
                                {currentBackground === image.path && (
                                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-logo-blue flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-cream-25"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "notifications":
        return (
          <div className="space-y-8">
            <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                  <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                    <Bell className="h-5 w-5 text-emerald-600" />
                  </div>
                  Notifications & Alerts
                </CardTitle>
                <CardDescription className="font-inter text-base">Configure how and when the app notifies you about important events and updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50/30 to-transparent dark:from-emerald-900/20 hover:from-emerald-50/40 dark:hover:from-emerald-900/30 transition-all duration-300">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        <Label htmlFor="sound-notifications" className="font-inter font-medium">
                          Sound Notifications
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Play audio chimes and alerts for task completions and reminders
                      </p>
                    </div>
                    <Switch
                      id="sound-notifications"
                      checked={currentSettings.soundEnabled || false}
                      onCheckedChange={(val) => handleSettingChange("soundEnabled", val)}
                      className="ml-4"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sage-50/20 to-transparent dark:from-sage-900/15">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-sage-600"></div>
                        <Label className="font-inter font-medium">
                          Notification Settings
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground font-inter ml-4">
                        Additional notification preferences and timing controls will be available here
                      </p>
                      <div className="ml-4 p-3 rounded-xl bg-cream-25/20 dark:bg-ink-800/20 border border-cream-25/30 dark:border-ink-700/30">
                        <p className="text-xs font-inter text-muted-foreground">
                          More notification options coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-8">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="glassmorphism grid w-full grid-cols-5 rounded-3xl border-0 shadow-lg p-2 h-16">
                <TabsTrigger value="profile" className="flex items-center gap-2 text-sm font-inter text-cream-25 hover:bg-cream-25/20 data-[state=active]:bg-cream-25/30 data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 h-12">
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2 text-sm font-inter text-cream-25 hover:bg-cream-25/20 data-[state=active]:bg-cream-25/30 data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 h-12">
                  <LockKeyhole className="h-4 w-4" />
                  <span className="hidden sm:inline">Password</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2 text-sm font-inter text-cream-25 hover:bg-cream-25/20 data-[state=active]:bg-cream-25/30 data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 h-12">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
                <TabsTrigger value="audio_tasks" className="flex items-center gap-2 text-sm font-inter text-cream-25 hover:bg-cream-25/20 data-[state=active]:bg-cream-25/30 data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 h-12">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">App</span>
                </TabsTrigger>
                <TabsTrigger value="navigation" className="flex items-center gap-2 text-sm font-inter text-cream-25 hover:bg-cream-25/20 data-[state=active]:bg-cream-25/30 data-[state=active]:shadow-lg rounded-2xl transition-all duration-300 h-12">
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">Navigation</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 space-y-8">
                <TabsContent value="profile" className="space-y-6">
                  <Card className="glassmorphism rounded-3xl shadow-xl border-0 overflow-hidden">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 font-lora zen-heading text-xl">
                        <div className="w-10 h-10 rounded-2xl glassmorphism flex items-center justify-center">
                          <User className="h-5 w-5 text-logo-blue" />
                        </div>
                        Profile Information
                      </CardTitle>
                      <CardDescription className="font-inter text-base">
                        Manage your personal information and account details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      {isLoading ? (
                        <div className="space-y-4">
                          <div className="h-10 bg-cream-100 dark:bg-ink-800 rounded animate-pulse" />
                          <div className="h-10 bg-cream-100 dark:bg-ink-800 rounded animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="profile-name" className="font-inter">
                              Display Name
                            </Label>
                            <Input
                              id="profile-name"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              placeholder="Your display name"
                              className="bg-cream-50/70 dark:bg-ink-800/70 border-brushed-silver/50 dark:border-ink-700/50 font-inter"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-email" className="font-inter">
                              Email Address
                            </Label>
                            <Input
                              id="profile-email"
                              type="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              className="bg-cream-50/70 dark:bg-ink-800/70 border-brushed-silver/50 dark:border-ink-700/50 font-inter"
                            />
                          </div>
                          <Button
                            onClick={handleProfileSave}
                            disabled={isSavingProfile}
                            className="w-full zen-button-primary font-inter"
                          >
                            {isSavingProfile ? "Saving..." : "Save Profile"}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground font-inter">Select a category to customize your app</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[1200px] max-h-[95vh] overflow-hidden p-0 flex border-0"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04)'
        }}
      >
        <DialogTitle className="sr-only">App Configuration</DialogTitle>
        {/* Enhanced Left Sidebar Navigation */}
        <div
          className="w-72 p-8 flex flex-col justify-between border-r"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '24px 0 0 24px',
            border: 'none',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-3">
              <div
                className="w-16 h-16 mx-auto flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px) saturate(150%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <Cog className="h-8 w-8" style={{ color: 'rgba(255, 255, 255, 0.9)' }} />
              </div>
              <h2
                className="font-lora zen-heading text-xl font-extralight tracking-wider"
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  letterSpacing: '0.08em',
                  fontWeight: '200'
                }}
              >
                App Configuration
              </h2>
              <p
                className="text-sm font-inter"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                Customize your entire app experience
              </p>
            </div>

            {/* Navigation with improved styling */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cream-25/20">
              <NavLinks activeCategory={activeCategory} setActiveCategory={setActiveCategory} settings={currentSettings} />
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="space-y-3 pt-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <UserCircle className="h-4 w-4" />
                <span className="font-inter">{userProfileName || "User"}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 font-inter border-0 transition-all duration-300 rounded-xl py-3"
              onClick={handleSignOut}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Enhanced Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Dynamic Header based on active category */}
          <div
            className="px-8 py-6"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(10px) saturate(120%)',
              borderRadius: '0 24px 0 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(activeCategory)}
                <div>
                  <h3
                    className="font-lora zen-heading text-2xl capitalize font-extralight tracking-wider"
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      letterSpacing: '0.06em',
                      fontWeight: '200'
                    }}
                  >
                    {activeCategory === "floating-nav" ? "Navigation Pages" :
                     activeCategory === "app-features" ? "App Features" :
                     activeCategory === "dashboard-elements" ? "Dashboard Elements" :
                     activeCategory.replace(/-/g, " ")}
                  </h3>
                  <p
                    className="text-sm font-inter mt-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    {getCategoryDescription(activeCategory)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area with better scrolling */}
          <div
            className="flex-1 overflow-y-auto px-8 py-6"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(5px) saturate(100%)'
            }}
          >
            <div className="space-y-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
