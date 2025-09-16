"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  MessageCircle,
  Search,
  PlusCircle,
  List,
  CalendarDays,
  Lightbulb,
  Sparkles,
  Mail,
  FileText,
  Handshake,
  Send,
  UserX,
  MailWarning,
  Gift,
  ShoppingCart,
  MessageSquareText,
  Leaf,
  UserMinus,
  Megaphone,
  Facebook,
  Youtube,
  ShoppingBag,
  ChromeIcon as Google,
  Pin,
  Linkedin,
  Music,
  Globe,
  LayoutTemplate,
  DollarSign,
  Flag,
  Info,
  HelpCircle,
  TrendingUp,
  Phone,
  Star,
  PlayCircle,
  ClipboardList,
  ListChecks,
  Shield,
  Headset,
  MessageSquare,
  Truck,
  ReceiptText,
  BookText,
  Wrench,
  Undo2,
  CreditCard,
  Briefcase,
  MailOpen,
  Flame,
  Rss,
  Instagram,
  X,
  Settings,
  Headphones,
  Video,
  FileStack,
  ListOrdered,
  Newspaper,
  Square,
  ImageIcon,
  Share2,
} from "lucide-react"

// Data structure for content categories and types
const contentCategories = [
  {
    name: "Emails",
    icon: Mail,
    types: [
      { name: "Newsletter Copy", icon: FileText },
      { name: "Welcome Series", icon: Handshake },
      { name: "Warm Outbound Email Seq...", icon: Send },
      { name: "Newsletter Ideas", icon: Lightbulb },
      { name: "Didn't Sign Up", icon: UserX },
      { name: "Cold Outbound Email Seq...", icon: MailWarning },
      { name: "Promotional Email Sequence", icon: Gift },
      { name: "Abandoned Cart", icon: ShoppingCart },
      { name: "SMS Message Copy", icon: MessageSquareText },
      { name: "Nurture Sequence", icon: Leaf },
      { name: "Lost Customer", icon: UserMinus },
    ],
  },
  {
    name: "Ads",
    icon: Megaphone,
    types: [
      { name: "Facebook Ad Copy", icon: Facebook },
      { name: "YouTube Ad Copy", icon: Youtube },
      { name: "Amazon Ad Copy", icon: ShoppingBag },
      { name: "Google Ad Copy", icon: Google },
      { name: "Bing Ad Copy", icon: Search },
      { name: "Pinterest Ad Copy", icon: Pin },
      { name: "LinkedIn Ad Copy", icon: Linkedin },
      { name: "TikTok Ad Copy", icon: Music },
    ],
  },
  {
    name: "Website",
    icon: Globe,
    types: [
      { name: "Landing Page", icon: LayoutTemplate },
      { name: "Pricing Page", icon: DollarSign },
      { name: "Mission Page", icon: Flag },
      { name: "About Us Page", icon: Info },
      { name: "FAQ Page", icon: HelpCircle },
      { name: "Impact Page", icon: TrendingUp },
    ],
  },
  {
    name: "Sales",
    icon: DollarSign,
    types: [
      { name: "Sales One Pager", icon: FileText },
      { name: "Sales Call Script", icon: Phone },
      { name: "Sales Testimonial", icon: Star },
      { name: "Product Demo Script", icon: PlayCircle },
      { name: "Customer Research Brief", icon: ClipboardList },
      { name: "Pre-call Checklist", icon: ListChecks },
      { name: "Sales Battle Card", icon: Shield },
    ],
  },
  {
    name: "Customer Service",
    icon: Headset,
    types: [
      { name: "Customer Reply Templates", icon: MessageSquare },
      { name: "Shipping Policy", icon: Truck },
      { name: "Payment Confirmation Copy", icon: ReceiptText },
      { name: "Customer Help Docs", icon: BookText },
      { name: "Product Care Instructions", icon: Wrench },
      { name: "Return Policy", icon: Undo2 },
      { name: "Billing and Payments FAQs", icon: CreditCard },
    ],
  },
  {
    name: "Recruiting",
    icon: Briefcase,
    types: [
      { name: "Job Description Copy", icon: FileText },
      { name: "Candidate Nurture Email Se...", icon: MailOpen },
    ],
  },
  {
    name: "Popular",
    icon: Flame,
    types: [
      { name: "Blog Post", icon: Rss },
      { name: "Instagram Square Post", icon: Instagram },
      { name: "Facebook Text Post", icon: Facebook },
      { name: "Instagram Portrait Post", icon: Instagram },
      { name: "LinkedIn Visual Post", icon: Linkedin },
      { name: "Facebook Ad Copy", icon: Facebook },
      { name: "Instagram Reel Script", icon: Instagram },
      { name: "Multiple LinkedIn Posts", icon: Linkedin },
      { name: "TikTok Script", icon: Music },
    ],
  },
  {
    name: "Tools",
    icon: Settings,
    types: [
      { name: "Multiple Instagram Posts", icon: Instagram },
      { name: "Multiple X/Twitter Posts", icon: X },
      { name: "Brainstorm Ideas", icon: Lightbulb },
      { name: "Turn Audio files into Content", icon: Headphones },
      { name: "Multiple Blog Posts", icon: Rss },
      { name: "Turn Websites into Content", icon: Globe },
      { name: "Multiple LinkedIn Posts", icon: Linkedin },
      { name: "Turn Video Files into Content", icon: Video },
      { name: "Multiple Facebook Posts", icon: Facebook },
      { name: "Turn Docs into Content", icon: FileText },
      { name: "Multi Channel Campaign", icon: Share2 },
    ],
  },
  {
    name: "Social Media",
    icon: Share2,
    types: [
      { name: "Instagram Text Post", icon: Instagram },
      { name: "Facebook Text Post", icon: Facebook },
      { name: "WhatsApp Sticker", icon: MessageCircle },
      { name: "Instagram Portrait Post", icon: Instagram },
      { name: "LinkedIn Profile Picture", icon: Linkedin },
      { name: "Square Visual Post", icon: Square },
      { name: "Instagram Square Post", icon: Instagram },
      { name: "LinkedIn Text Post", icon: Linkedin },
      { name: "Portrait Visual Post", icon: ImageIcon },
      { name: "Instagram Horizontal Post", icon: Instagram },
      { name: "X/Twitter Visual Post", icon: X },
      { name: "Landscape Visual Post", icon: ImageIcon },
      { name: "Instagram Story", icon: Instagram },
      { name: "X/Twitter Text Post", icon: X },
      { name: "Pinterest Post", icon: Pin },
      { name: "Facebook Visual Post", icon: Facebook },
      { name: "X/Twitter Thread", icon: X },
      { name: "Facebook Cover", icon: Facebook },
    ],
  },
  {
    name: "Content",
    icon: FileStack,
    types: [
      { name: "Blog Post", icon: Rss },
      { name: "Content Outline", icon: ListOrdered },
      { name: "Case Study", icon: Briefcase },
      { name: "Blog Ideas", icon: Lightbulb },
      { name: "Content Brief", icon: FileText },
      { name: "Press Release", icon: Newspaper },
    ],
  },
]

export default function SocialPage() {
  const [showAddConnectionCard, setShowAddConnectionCard] = useState(false)
  const [showSearchConnectionsCard, setShowSearchConnectionsCard] = useState(false)
  const [showUnitsCard, setShowUnitsCard] = useState(false)
  const [showSkillsCard, setShowSkillsCard] = useState(false)
  const [showCalendarCard, setShowCalendarCard] = useState(false)
  const [showContentGeneratorCard, setShowContentGeneratorCard] = useState(false)
  const [showMessagingCard, setShowMessagingCard] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [newConnectionName, setNewConnectionName] = useState("")
  const [newConnectionEmail, setNewConnectionEmail] = useState("")

  const [unitsList, setUnitsList] = useState(
    "Love\nPartner\nChildren\nFamily & Friends\nColleagues & Business Social Intelligence\nGlobal Community & Citizenship\nSocial Media Calendar",
  )
  const [skillsList, setSkillsList] = useState(
    "Social Awareness & Empathy\nCommunication & Active Listening\nRelationship Building & Maintenance\nConflict Resolution and Collaboration\nCommunity Engagement & Belonging\nSocial Resilience & Influence",
  )

  const handleAddConnection = () => {
    console.log("Adding connection:", { name: newConnectionName, email: newConnectionEmail })
    // Here you would typically interact with your database to add the connection
    setNewConnectionName("")
    setNewConnectionEmail("")
    setShowAddConnectionCard(false)
  }

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
    // Here you would typically interact with your database to fetch search results
    // For now, we'll just log the query
  }

  const handleSaveUnits = () => {
    console.log("Saving Units:", unitsList)
    // Here you would save the unitsList to your database
    setShowUnitsCard(false)
  }

  const handleSaveSkills = () => {
    console.log("Saving Skills:", skillsList)
    // Here you would save the skillsList to your database
    setShowSkillsCard(false)
  }

  const handleContentOptionClick = (category: string, type: string) => {
    console.log(`Selected content: Category: ${category}, Type: ${type}`)
    // Implement logic for generating content based on selection
    setShowContentGeneratorCard(false) // Close card after selection
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              <h1 className="text-3xl font-light zen-heading text-cream-25">Social Connections</h1>
            </div>
            <p className="text-lg zen-body max-w-2xl mx-auto text-cream-25">
              Nurture meaningful relationships and build a supportive community around you.
            </p>
          </div>

          {/* Control Bar */}
          <div className="glassmorphism p-4 rounded-lg mb-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              className="zen-control-button"
              onClick={() => setShowAddConnectionCard(!showAddConnectionCard)}
              aria-label="Add Connection"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowSearchConnectionsCard(!showSearchConnectionsCard)}
              aria-label="Search Connections"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowUnitsCard(!showUnitsCard)}
              aria-label="Manage Units"
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowSkillsCard(!showSkillsCard)}
              aria-label="Manage Skills"
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowCalendarCard(!showCalendarCard)}
              aria-label="Toggle Calendar"
            >
              <CalendarDays className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowContentGeneratorCard(!showContentGeneratorCard)}
              aria-label="Content Generator"
            >
              <Sparkles className="h-5 w-5" />
            </Button>
            <Button
              className="zen-control-button"
              onClick={() => setShowMessagingCard(!showMessagingCard)}
              aria-label="Messaging"
            >
              <MessageSquareText className="h-5 w-5" />
            </Button>
          </div>

          {/* Conditional Add Connection Card */}
          {showAddConnectionCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-cream-25 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-sage-600" />
                  Add New Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 py-4">
                <p className="text-cream-25">Enter the details for your new social connection.</p>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-cream-25">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newConnectionName}
                    onChange={(e) => setNewConnectionName(e.target.value)}
                    className="col-span-3 glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-cream-25">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newConnectionEmail}
                    onChange={(e) => setNewConnectionEmail(e.target.value)}
                    className="col-span-3 glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" onClick={handleAddConnection} className="zen-button-primary">
                    Add Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional Search Connections Card */}
          {showSearchConnectionsCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-cream-25 flex items-center gap-2">
                  <Search className="w-5 h-5 text-logo-blue" />
                  Search Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 py-4">
                <p className="text-cream-25">Search for existing connections by name or email.</p>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="search" className="text-right text-cream-25">
                    Search
                  </Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="col-span-3 glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                    placeholder="Name or email"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" onClick={handleSearch} className="zen-button-primary">
                    Search
                  </Button>
                </div>
                {searchQuery && (
                  <div className="mt-4 p-2 border rounded-md glassmorphism-inner-card">
                    <p className="text-sm text-cream-25">
                      Search results for &quot;{searchQuery}&quot; would appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Conditional Units Card */}
          {showUnitsCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-cream-25 flex items-center gap-2">
                  <List className="w-5 h-5 text-soft-gold" />
                  Manage Social Units
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 py-4">
                <p className="text-cream-25">Edit the list of social units. Each line represents a unit.</p>
                <Textarea
                  value={unitsList}
                  onChange={(e) => setUnitsList(e.target.value)}
                  className="min-h-[200px] glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                  placeholder="Enter units, one per line"
                />
                <div className="flex justify-end">
                  <Button type="submit" onClick={handleSaveUnits} className="zen-button-primary">
                    Save Units
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional Skills Card */}
          {showSkillsCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-cream-25 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-soft-gold" />
                  Manage Social Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 py-4">
                <p className="text-cream-25">Edit the list of social skills. Each line represents a skill.</p>
                <Textarea
                  value={skillsList}
                  onChange={(e) => setSkillsList(e.target.value)}
                  className="min-h-[200px] glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                  placeholder="Enter skills, one per line"
                />
                <div className="flex justify-end">
                  <Button type="submit" onClick={handleSaveSkills} className="zen-button-primary">
                    Save Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional Content Generator Card */}
          {showContentGeneratorCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-cream-25 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-soft-gold" />
                  Content Planner
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[60vh]">
                <p className="text-cream-25 mb-4">Select a content platform and type to generate ideas.</p>
                <ScrollArea className="flex-1 p-4 -mx-4">
                  <div className="grid gap-6">
                    {contentCategories.map((category) => (
                      <div key={category.name}>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-cream-25">
                          {category.icon && <category.icon className="w-5 h-5" />}
                          {category.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {category.types.map((type) => {
                            const TypeIcon = type.icon
                            return (
                              <Button
                                key={type.name}
                                variant="outline"
                                className="glassmorphism-inner-card flex flex-col h-auto py-4 items-center justify-center text-center text-cream-25 hover:bg-cream-25/30 bg-transparent"
                                onClick={() => handleContentOptionClick(category.name, type.name)}
                              >
                                {TypeIcon && <TypeIcon className="w-6 h-6 mb-2 text-cream-25" />}
                                <span className="text-sm font-medium">{type.name}</span>
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Conditional Calendar Card */}
          {showCalendarCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <CalendarDays className="w-5 h-5 text-soft-gold" />
                  Social Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cream-25">
                  This card will display your social commitments and events.
                  <br />
                  (Content to be implemented)
                </p>
                <div className="mt-4 h-48 bg-ink-50/20 dark:bg-ink-900/20 rounded-md flex items-center justify-center text-sm text-cream-25">
                  Placeholder for Calendar Component
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditional Messaging Card */}
          {showMessagingCard && (
            <Card className="glassmorphism-inner-card sunlight-hover mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cream-25">
                  <MessageSquareText className="w-5 h-5 text-logo-blue" />
                  Telegram-Inspired Messaging
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-[400px]">
                <ScrollArea className="flex-1 p-2 mb-4 border rounded-md glassmorphism-inner-card">
                  <div className="space-y-3 text-cream-25">
                    <div className="flex justify-start">
                      <div className="bg-blue-500/30 p-2 rounded-lg max-w-[70%]">
                        <p className="text-sm">Hey there! How are you doing today?</p>
                        <span className="text-xs text-cream-25/70 block text-right">10:00 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-green-500/30 p-2 rounded-lg max-w-[70%]">
                        <p className="text-sm">I'm doing great, thanks for asking! Just working on some projects.</p>
                        <span className="text-xs text-cream-25/70 block text-right">10:01 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-blue-500/30 p-2 rounded-lg max-w-[70%]">
                        <p className="text-sm">That's awesome! What kind of projects?</p>
                        <span className="text-xs text-cream-25/70 block text-right">10:02 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-green-500/30 p-2 rounded-lg max-w-[70%]">
                        <p className="text-sm">Mostly some web development and a bit of design work.</p>
                        <span className="text-xs text-cream-25/70 block text-right">10:03 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-blue-500/30 p-2 rounded-lg max-w-[70%]">
                        <p className="text-sm">Sounds exciting! Keep up the great work!</p>
                        <span className="text-xs text-cream-25/70 block text-right">10:04 AM</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    className="flex-1 glassmorphism-inner-card placeholder-cream-25 text-cream-25"
                  />
                  <Button className="zen-button-primary">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Feature Cards (empty div as they were removed in previous turn) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* The cards previously here have been removed */}
          </div>
        </div>
      </main>
    </div>
  )
}
