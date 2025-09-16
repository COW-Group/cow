"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" // Import Progress component

import {
  DollarSign,
  TrendingUp,
  PiggyBank,
  Target,
  Waves,
  Compass,
  Briefcase,
  Car,
  Shield,
  HeartHandshake,
  BookOpen,
  CircleUser,
  CalendarCheck,
  Scale,
  UserCog,
  Wallet,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  ExternalLink,
  Globe,
  CreditCard,
  Star,
  Filter,
  CheckCircle,
  Banknote,
  ReceiptText,
  CalendarClock,
  BarChart,
} from "lucide-react"

export default function WealthPage() {
  const [income, setIncome] = useState("")
  const [expenses, setExpenses] = useState("")
  const [savings, setSavings] = useState("")
  const [investments, setInvestments] = useState("")
  const [upcomingExpenseSource, setUpcomingExpenseSource] = useState("")
  const [upcomingExpenseCommunication, setUpcomingExpenseCommunication] = useState("")
  const [upcomingExpenseTasks, setUpcomingExpenseTasks] = useState("")

  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const calculateNetWorth = () => {
    const totalAssets = (Number.parseFloat(savings) || 0) + (Number.parseFloat(investments) || 0)
    const monthlyIncome = Number.parseFloat(income) || 0
    const monthlyExpenses = Number.parseFloat(expenses) || 0
    const monthlySavings = monthlyIncome - monthlyExpenses

    return {
      totalAssets,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
    }
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setWalletAddress("0xAbc123DeF456GhI789JkL012MnP345QrS678TuV90")
    setWalletConnected(true)
    setIsConnecting(false)
  }

  const { totalAssets, monthlyIncome, monthlyExpenses, monthlySavings } = calculateNetWorth()

  // Placeholder data for Assets tab
  const assetAllocation = [
    { name: "AUGOLD", percentage: 15, color: "bg-yellow-500" },
    { name: "AUSQFT", percentage: 30, color: "bg-green-500" },
    { name: "AUAERO", percentage: 8, color: "bg-purple-500" },
    { name: "AUTECH", percentage: 22, color: "bg-blue-500" },
    { name: "AUBOND", percentage: 15, color: "bg-indigo-500" },
    { name: "AUSURA", percentage: 10, color: "bg-pink-500" },
  ]

  const assetPerformance = [
    { name: "Gold", change: "+5%", icon: <ArrowUpRight className="h-4 w-4 text-green-500" /> },
    { name: "Real Estate", change: "-2%", icon: <ArrowDownRight className="h-4 w-4 text-red-500" /> },
    { name: "Plane Seats", change: "+8%", icon: <ArrowUpRight className="h-4 w-4 text-green-500" /> },
    { name: "Whiskey", change: "+3%", icon: <ArrowUpRight className="h-4 w-4 text-green-500" /> },
    { name: "Technology", change: "+12%", icon: <ArrowUpRight className="h-4 w-4 text-green-500" /> },
    { name: "Bonds", change: "+1%", icon: <ArrowUpRight className="h-4 w-4 text-green-500" /> },
  ]

  const individualAssets = [
    {
      initials: "AU",
      name: "Gold",
      holdings: "0.5 tokens",
      value: "$6,000",
      change: "+5%",
      changeColor: "bg-green-500/20 text-green-600",
    },
    {
      initials: "AU",
      name: "Real Estate",
      holdings: "2.3 tokens",
      value: "$12,000",
      change: "-2%",
      changeColor: "bg-red-500/20 text-red-600",
    },
    {
      initials: "AU",
      name: "Plane Seats",
      holdings: "1 token",
      value: "$3,500",
      change: "+8%",
      changeColor: "bg-green-500/20 text-green-600",
    },
    {
      initials: "AU",
      name: "Whiskey",
      holdings: "0.8 tokens",
      value: "$2,800",
      change: "+3%",
      changeColor: "bg-green-500/20 text-green-600",
    },
    {
      initials: "AU",
      name: "Technology",
      holdings: "1.5 tokens",
      value: "$8,500",
      change: "+12%",
      changeColor: "bg-green-500/20 text-green-600",
    },
    {
      initials: "AU",
      name: "Bonds",
      holdings: "3.2 tokens",
      value: "$5,200",
      change: "+1%",
      changeColor: "bg-green-500/20 text-green-600",
    },
  ]

  // Placeholder data for Profile tab
  const achievements = [
    { name: "Diversification Master", progress: "5+ asset classes", earned: true },
    { name: "Goal Setter", progress: "3 goals in progress", earned: true },
    { name: "Mission Contributor", progress: "2/5 missions", earned: false },
  ]

  const walletBalances = [
    { initials: "AU", name: "Gold", holdings: "0.5 tokens", value: "$6,000" },
    { initials: "AU", name: "Real Estate", holdings: "2.3 tokens", value: "$12,000" },
    { initials: "AU", name: "Plane Seats", holdings: "1 token", value: "$3,500" },
    { initials: "AU", name: "Whiskey", holdings: "0.8 tokens", value: "$2,800" },
  ]

  // Placeholder data for Vehicles tab
  const retirementVehicles = [
    {
      name: "Traditional IRA",
      status: "Deferred",
      value: "$45,000",
      growth: "+7.2% growth",
      contribution: "$6,000",
      type: "Retirement",
    },
    {
      name: "Roth IRA",
      status: "Tax-Free",
      value: "$28,000",
      growth: "+8.1% growth",
      contribution: "$6,000",
      type: "Retirement",
    },
    {
      name: "401(k)",
      status: "Deferred",
      value: "$85,000",
      growth: "+6.8% growth",
      contribution: "$19,500",
      type: "Retirement",
    },
  ]

  const contributionProjects = [
    {
      id: 1,
      title: "Ocean Plastic Cleanup Initiative",
      organization: "Blue Ocean Foundation",
      description:
        "Develop innovative solutions to remove plastic waste from ocean ecosystems using AI-powered collection systems",
      match: 95,
      contributed: true,
      tags: ["Sustainability", "Innovation", "Ocean", "AI"],
      raised: 75000,
      goal: 100000,
      daysLeft: 15,
      contributors: 234,
      yourContribution: 250,
      impact: "Remove 50 tons of plastic waste",
      buttonText: "Add More",
    },
    {
      id: 2,
      title: "AI-Powered Learning Platform",
      organization: "EduTech Collective",
      description:
        "Create personalized learning experiences using artificial intelligence to adapt to each student's learning style",
      match: 88,
      contributed: false,
      tags: ["AI", "Education", "Technology", "Personalization"],
      raised: 45000,
      goal: 80000,
      daysLeft: 8,
      contributors: 156,
      yourContribution: 0,
      impact: "Reach 10,000 students globally",
      buttonText: "Contribute",
    },
    {
      id: 3,
      title: "Solar Energy for Rural Communities",
      organization: "Bright Future Energy",
      description:
        "Bring clean, affordable solar power to underserved rural areas through community-owned solar installations",
      match: 92,
      contributed: true,
      tags: ["Solar", "Rural", "Clean Energy", "Community"],
      raised: 120000,
      goal: 150000,
      daysLeft: 22,
      contributors: 445,
      yourContribution: 500,
      impact: "Power 500 homes sustainably",
      buttonText: "Add More",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 flex flex-col items-center">
            {/* MyCOW branding with logo - Larger and no space */}
            <div className="flex items-center justify-center gap-2 text-2xl font-semibold mb-2">
              <Image
                src="/images/cow-logo/cow-icon.png"
                alt="COW Logo"
                width={40}
                height={40}
                className="dark:invert" // Invert for dark mode if needed
              />
              <span className="text-cream-25 font-montserrat">MyCOW</span>
            </div>

            {/* Main Title with Glassmorphic Background - Smaller font */}
            <div className="glassmorphism rounded-lg p-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-light zen-heading text-center text-cream-25 font-montserrat">
                What can you attend to today for financial peace and prosperity?
              </h1>
            </div>

            {/* Caption with Glassmorphic Background and Caveat Font - Slightly larger */}
            <div className="glassmorphism rounded-lg p-4 max-w-2xl mx-auto text-center">
              <p className="text-xl text-cream-25 font-caveat">Let's Create Your Cycles of Wealth</p>
            </div>
          </div>

          <Tabs defaultValue="flow" className="w-full">
            <TabsList className="glassmorphism grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-8 p-1">
              <TabsTrigger
                value="flow"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Waves className="w-4 h-4" />
                Flow
              </TabsTrigger>
              <TabsTrigger
                value="goals"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger
                value="compass"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Compass className="w-4 h-4" />
                Compass
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Briefcase className="w-4 h-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="vehicles"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Car className="w-4 h-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger
                value="protect"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Protect
              </TabsTrigger>
              <TabsTrigger
                value="contribute"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <HeartHandshake className="w-4 h-4" />
                Contribute
              </TabsTrigger>
              <TabsTrigger
                value="learn"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Learn
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
              >
                <CircleUser className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flow" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Monthly Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cream-25 font-inter">${monthlyIncome.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Monthly Expenses</CardTitle>
                    <DollarSign className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cream-25 font-inter">
                      ${monthlyExpenses.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Monthly Savings</CardTitle>
                    <PiggyBank className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cream-25 font-inter">
                      ${monthlySavings.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* New Card for Upcoming Expenses */}
              <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-montserrat text-cream-25">Upcoming Expenses</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upcoming-expense-source" className="text-cream-25 font-inter">
                      Corresponding Cash/Inflow Source
                    </Label>
                    <Input
                      id="upcoming-expense-source"
                      placeholder="e.g., Savings Account, Next Paycheck"
                      value={upcomingExpenseSource}
                      onChange={(e) => setUpcomingExpenseSource(e.target.value)}
                      className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upcoming-expense-communication" className="text-cream-25 font-inter">
                      Communication
                    </Label>
                    <Textarea
                      id="upcoming-expense-communication"
                      placeholder="e.g., Contact utility company, Send reminder email"
                      value={upcomingExpenseCommunication}
                      onChange={(e) => setUpcomingExpenseCommunication(e.target.value)}
                      className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upcoming-expense-tasks" className="text-cream-25 font-inter">
                      Related Tasks
                    </Label>
                    <Textarea
                      id="upcoming-expense-tasks"
                      placeholder="e.g., Pay bill by 15th, Review subscription"
                      value={upcomingExpenseTasks}
                      onChange={(e) => setUpcomingExpenseTasks(e.target.value)}
                      className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="font-montserrat text-cream-25">Financial Input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="income" className="text-cream-25 font-inter">
                        Monthly Income
                      </Label>
                      <Input
                        id="income"
                        type="number"
                        placeholder="Enter monthly income"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenses" className="text-cream-25 font-inter">
                        Monthly Expenses
                      </Label>
                      <Input
                        id="expenses"
                        type="number"
                        placeholder="Enter monthly expenses"
                        value={expenses}
                        onChange={(e) => setExpenses(e.target.value)}
                        className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="savings" className="text-cream-25 font-inter">
                        Current Savings
                      </Label>
                      <Input
                        id="savings"
                        type="number"
                        placeholder="Enter current savings"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}
                        className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investments" className="text-cream-25 font-inter">
                        Current Investments
                      </Label>
                      <Input
                        id="investments"
                        type="number"
                        placeholder="Enter current investments"
                        value={investments}
                        onChange={(e) => setInvestments(e.target.value)}
                        className="bg-white/5 text-cream-25 placeholder:text-cream-25/70 border-white/20 font-inter"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="font-montserrat text-cream-25">Financial Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cream-25/70 font-inter">Goal setting and tracking coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compass" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accounts Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Accounts</CardTitle>
                    <Banknote className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">
                      Manage your linked bank accounts and financial institutions.
                    </p>
                  </CardContent>
                </Card>
                {/* Budgets Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Budgets</CardTitle>
                    <ReceiptText className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">Create and track your spending budgets.</p>
                  </CardContent>
                </Card>
                {/* Scheduled Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Scheduled</CardTitle>
                    <CalendarClock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">View and manage upcoming transactions and bills.</p>
                  </CardContent>
                </Card>
                {/* Reports Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Reports</CardTitle>
                    <BarChart className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">Generate financial reports and insights.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              {/* Token Portfolio Overview */}
              <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-montserrat text-cream-25">Token Portfolio</CardTitle>
                  <LineChart className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-baseline mb-4">
                    <div className="text-3xl font-bold text-cream-25 font-inter">$38,000</div>
                    <div className="text-sm text-cream-25/70 font-inter">Total Portfolio Value</div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-sm font-montserrat text-cream-25 mb-2">Asset Allocation</h3>
                    <div className="flex h-4 rounded-full overflow-hidden">
                      {assetAllocation.map((asset) => (
                        <div
                          key={asset.name}
                          className={asset.color}
                          style={{ width: `${asset.percentage}%` }}
                          title={`${asset.name}: ${asset.percentage}%`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 text-xs text-cream-25 font-inter">
                      {assetAllocation.map((asset) => (
                        <div key={asset.name} className="flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full ${asset.color}`} />
                          <span>
                            {asset.name}: {asset.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-montserrat text-cream-25 mb-2">Performance</h3>
                    <div className="space-y-2">
                      {assetPerformance.map((item) => (
                        <div key={item.name} className="flex justify-between items-center">
                          <span className="text-sm text-cream-25 font-inter">{item.name}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-cream-25 font-inter">{item.change}</span>
                            {item.icon}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Asset Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {individualAssets.map((asset) => (
                  <Card key={asset.name} className="glassmorphism">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-cream-25 font-inter">
                          {asset.initials}
                        </div>
                        <CardTitle className="text-sm font-montserrat text-cream-25">{asset.name}</CardTitle>
                      </div>
                      <Badge className={asset.changeColor}>{asset.change}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <div className="text-xs text-cream-25/70 font-inter">Holdings</div>
                          <div className="text-lg font-bold text-cream-25 font-inter">{asset.holdings}</div>
                        </div>
                        <div>
                          <div className="text-xs text-cream-25/70 text-right font-inter">Value</div>
                          <div className="text-lg font-bold text-cream-25 font-inter">{asset.value}</div>
                        </div>
                      </div>
                      <Button className="w-full zen-button-primary">Trade</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-6">
              {/* Wealth Vehicles Header */}
              <div className="flex justify-between items-baseline mb-6">
                <div className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-cream-25 font-montserrat">Wealth Vehicles</h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 font-inter">$270,000</div>
                  <div className="text-sm text-cream-25/70 font-inter">$52,150 annual contributions</div>
                </div>
              </div>

              {/* Nested Tabs for Vehicle Categories */}
              <Tabs defaultValue="retirement" className="w-full">
                <TabsList className="glassmorphism grid w-full grid-cols-3 md:grid-cols-5 mb-6 p-1">
                  <TabsTrigger
                    value="retirement"
                    className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                  >
                    Retirement
                  </TabsTrigger>
                  <TabsTrigger
                    value="health"
                    className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                  >
                    Health
                  </TabsTrigger>
                  <TabsTrigger
                    value="education"
                    className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="immigration"
                    className="flex items-center gap-2 text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                  >
                    <Globe className="h-4 w-4" />
                    Immigration
                  </TabsTrigger>
                  <TabsTrigger
                    value="investment"
                    className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                  >
                    Investment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="retirement" className="space-y-6">
                  {retirementVehicles.map((vehicle) => (
                    <Card key={vehicle.name} className="glassmorphism">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-montserrat text-cream-25">{vehicle.name}</CardTitle>
                          <Badge variant="secondary">{vehicle.status}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-cream-25 font-inter">{vehicle.value}</div>
                          <div className="text-sm text-cream-25/70 font-inter">{vehicle.growth}</div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-cream-25/70 font-inter">Annual Contribution</div>
                            <div className="text-lg font-bold text-cream-25 font-inter">{vehicle.contribution}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-cream-25/70 font-inter">Type</div>
                            <div className="text-lg font-bold text-cream-25 font-inter">{vehicle.type}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1 zen-button-primary">
                            <Plus className="h-4 w-4 mr-2" /> Contribute
                          </Button>
                          <Button variant="outline" size="icon" className="zen-button-secondary">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="health" className="space-y-6">
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="font-montserrat text-cream-25">Health Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cream-25/70 font-inter">Health-related wealth vehicles coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="education" className="space-y-6">
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="font-montserrat text-cream-25">Education Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cream-25/70 font-inter">Education-related wealth vehicles coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="immigration" className="space-y-6">
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="font-montserrat text-cream-25">Immigration Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cream-25/70 font-inter">Immigration-related wealth vehicles coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="investment" className="space-y-6">
                  <Card className="glassmorphism">
                    <CardHeader>
                      <CardTitle className="font-montserrat text-cream-25">Investment Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cream-25/70 font-inter">Investment-related wealth vehicles coming soon...</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="protect" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Legal</CardTitle>
                    <Scale className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">Legal documentation and resources coming soon...</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Admin</CardTitle>
                    <UserCog className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">Administrative tasks and settings coming soon...</p>
                  </CardContent>
                </Card>
                {/* New Credit Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Credit</CardTitle>
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">Credit monitoring and management tools coming soon...</p>
                  </CardContent>
                </Card>
                {/* New Reputation Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Reputation</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">
                      Reputation management and digital footprint tools coming soon...
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contribute" className="space-y-6">
              {/* Ikigai Compass Section */}
              <Card className="glassmorphism p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Compass Icon" width={24} height={24} />
                  <h2 className="text-lg font-semibold text-cream-25 font-montserrat">Your Ikigai Compass</h2>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative h-40 w-40 flex-shrink-0">
                    <Image
                      src="/placeholder.svg?height=160&width=160"
                      alt="Ikigai Diagram"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2 text-cream-25 font-montserrat">
                      Your Purpose: Sustainable Tech Education
                    </h3>
                    <p className="text-cream-25/70 mb-4 font-inter">
                      Your Ikigai analysis shows you're most fulfilled when combining your passion for sustainability
                      with your technical skills to educate others. This creates both social impact and financial
                      rewards.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/5 dark:bg-black/5 p-3 rounded-md">
                        <div className="text-sm text-cream-25/70 font-inter">Mission Match</div>
                        <div className="text-lg font-bold text-blue-600 font-inter">92%</div>
                      </div>
                      <div className="bg-white/5 dark:bg-black/5 p-3 rounded-md">
                        <div className="text-sm text-cream-25/70 font-inter">Impact Potential</div>
                        <div className="text-lg font-bold text-green-600 font-inter">High</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Filter Tabs and More Filters Button */}
              <div className="flex flex-wrap gap-2 justify-between items-center mb-6">
                <Tabs defaultValue="all">
                  <TabsList className="glassmorphism flex flex-wrap h-auto p-1">
                    <TabsTrigger
                      value="all"
                      className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="environmental"
                      className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                    >
                      Environmental
                    </TabsTrigger>
                    <TabsTrigger
                      value="education"
                      className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                    >
                      Education
                    </TabsTrigger>
                    <TabsTrigger
                      value="energy"
                      className="text-cream-25 font-inter data-[state=active]:bg-white/10 data-[state=active]:text-cream-25 data-[state=active]:shadow-sm"
                    >
                      Energy
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" className="flex items-center gap-1 zen-button-secondary">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>

              {/* Contribution Project Cards */}
              <div className="space-y-6">
                {contributionProjects.map((project) => (
                  <Card key={project.id} className="glassmorphism">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-montserrat text-cream-25">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-inter"
                          >
                            {project.match}% match
                          </Badge>
                          {project.contributed && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-inter"
                            >
                              $ Contributed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-cream-25/70 font-inter">{project.organization}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-cream-25/70 font-inter">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs font-inter">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-medium mb-1 text-cream-25 font-inter">
                          <span>${project.raised.toLocaleString()} raised</span>
                          <span>${project.goal.toLocaleString()} goal</span>
                        </div>
                        <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                          <div className="text-sm text-cream-25/70 font-inter">{project.daysLeft} days left</div>
                          <div className="text-sm text-cream-25/70 font-inter">{project.contributors} contributors</div>
                          {project.yourContribution > 0 && (
                            <div className="text-sm text-cream-25/70 font-inter">
                              Your contribution: ${project.yourContribution.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end text-right gap-2">
                          <Button className="w-full md:w-auto zen-button-primary">{project.buttonText}</Button>
                          <div className="text-sm text-cream-25/70 font-inter">Impact: {project.impact}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="font-montserrat text-cream-25">Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-cream-25/70 font-inter">Learning resources coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header Card */}
              <Card className="glassmorphism">
                <CardHeader className="flex flex-col items-center text-center space-y-2 pb-4">
                  <div className="relative h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    {/* Placeholder for the circular icon */}
                    <Image
                      src="/placeholder.svg?height=80&width=80"
                      alt="Profile Icon"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <CardTitle className="text-xl font-semibold text-cream-25 font-montserrat">
                    Level 3: Financial Navigator
                  </CardTitle>
                  <p className="text-sm text-cream-25/70 font-inter">
                    You're mastering the flow of wealth—excellent progress!
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="zen-button-secondary">
                      Continue Journey
                    </Button>
                    <Button variant="outline" size="icon" className="zen-button-secondary">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Button>
                    <Button variant="outline" size="icon" className="zen-button-secondary">
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign Out</span>
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Achievements Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Achievements</CardTitle>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.name} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-cream-25 font-inter">{achievement.name}</div>
                          <div className="text-sm text-cream-25/70 font-inter">{achievement.progress}</div>
                        </div>
                        {achievement.earned && (
                          <Badge variant="secondary" className="font-inter">
                            Earned
                          </Badge>
                        )}
                        {!achievement.earned && achievement.progress.includes("/") && (
                          <Badge variant="outline" className="font-inter">
                            {achievement.progress}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Wallet Balances Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">Wallet Balances</CardTitle>
                    <Wallet className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {walletBalances.map((balance) => (
                      <div key={balance.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-cream-25 font-inter">
                            {balance.initials}
                          </div>
                          <div>
                            <div className="font-medium text-cream-25 font-inter">{balance.name}</div>
                            <div className="text-sm text-cream-25/70 font-inter">{balance.holdings}</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-cream-25 font-inter">{balance.value}</div>
                      </div>
                    ))}
                    <Button variant="link" className="w-full justify-center text-sm text-cream-25 font-inter">
                      View All Tokens <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    {/* Wallet Connection integrated here */}
                    <div className="pt-4 border-t border-white/20 mt-4">
                      <h4 className="text-sm font-montserrat text-cream-25 mb-2">Connect Blockchain Wallet</h4>
                      {walletConnected ? (
                        <div className="text-sm text-green-600 flex items-center gap-2 font-inter">
                          <span className="font-semibold">Connected:</span>
                          <span className="truncate">{walletAddress}</span>
                        </div>
                      ) : (
                        <Button
                          onClick={handleConnectWallet}
                          disabled={isConnecting}
                          className="w-full zen-button-primary"
                        >
                          {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* New KYC Status Card */}
                <Card className="glassmorphism">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-montserrat text-cream-25">KYC Status</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-cream-25/70 font-inter">
                      Your Know Your Customer (KYC) verification is complete.
                    </p>
                    <Button variant="link" className="w-full justify-center text-sm mt-2 text-cream-25 font-inter">
                      View Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
