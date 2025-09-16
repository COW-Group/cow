"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Compass,
  HandHeart,
  TrendingUp,
  Car,
  Shield,
  User,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Target,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog" // For Add Vehicle form
import { Input } from "@/components/ui/input" // For form inputs
import { Label } from "@/components/ui/label" // For form labels
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // For vehicle type select
import { databaseService } from "@/lib/database-service" // Import the instance
import { useAuth } from "@/hooks/use-auth" // To get user ID
import type { Vehicle } from "@/lib/types" // Import Vehicle type

// Navigation items (unchanged)
const navItems = [
  { id: "compass", icon: Compass, label: "Flow Compass" },
  { id: "contribute", icon: HandHeart, label: "Contribute" },
  { id: "assets", icon: TrendingUp, label: "Assets" },
  { id: "vehicles", icon: Car, label: "Vehicles" },
  { id: "protect", icon: Shield, label: "Protect" },
  { id: "profile", icon: User, label: "Profile" },
]

// Water-inspired color palette (unchanged)
const colors = {
  primary: "from-cyan-400 via-blue-500 to-indigo-600",
  secondary: "from-teal-300 via-cyan-400 to-blue-500",
  accent: "from-purple-400 via-pink-400 to-red-400",
  income: "from-emerald-400 to-teal-500",
  expenses: "from-orange-400 to-red-500",
  assets: "from-blue-400 to-indigo-500",
  liabilities: "from-purple-400 to-pink-500",
  goals: "from-yellow-400 to-orange-500",
  sparkle: "from-white via-cyan-200 to-blue-300",
}

// Age-based financial data (unchanged, but will be augmented by fetched vehicles)
const financialData = {
  25: {
    inflows: [
      { name: "Salary", amount: 65000, type: "income", color: "emerald", goalLinked: null },
      { name: "Side Hustle", amount: 8000, type: "income", color: "teal", goalLinked: "Emergency Fund" },
      { name: "Investment Returns", amount: 2000, type: "assets", color: "blue", goalLinked: "Retirement" },
    ],
    outflows: [
      { name: "Rent", amount: 18000, type: "expenses", color: "orange", goalLinked: null },
      { name: "Groceries", amount: 6000, type: "expenses", color: "red", goalLinked: null },
      { name: "Transportation", amount: 4800, type: "expenses", color: "pink", goalLinked: null },
      { name: "Entertainment", amount: 3600, type: "expenses", color: "rose", goalLinked: null },
      { name: "Emergency Fund", amount: 15000, type: "goals", color: "yellow", goalLinked: "Emergency Fund" },
      { name: "401k", amount: 6500, type: "goals", color: "amber", goalLinked: "Retirement" },
      { name: "House Savings", amount: 5000, type: "goals", color: "orange", goalLinked: "House Down Payment" },
    ],
  },
  35: {
    inflows: [
      { name: "Salary", amount: 95000, type: "income", color: "emerald", goalLinked: null },
      { name: "Rental Income", amount: 12000, type: "assets", color: "blue", goalLinked: "House Down Payment" },
      { name: "Investment Returns", amount: 8000, type: "assets", color: "indigo", goalLinked: "Retirement" },
      { name: "Bonus", amount: 15000, type: "income", color: "teal", goalLinked: "Vacation Fund" },
    ],
    outflows: [
      { name: "Mortgage", amount: 24000, type: "liabilities", color: "purple", goalLinked: null },
      { name: "Groceries", amount: 9000, type: "expenses", color: "red", goalLinked: null },
      { name: "Childcare", amount: 15000, type: "expenses", color: "orange", goalLinked: null },
      { name: "Insurance", amount: 6000, type: "expenses", color: "pink", goalLinked: null },
      { name: "Vacation Fund", amount: 8000, type: "goals", color: "yellow", goalLinked: "Vacation Fund" },
      { name: "College Fund", amount: 12000, type: "goals", color: "amber", goalLinked: "Kids College" },
      { name: "Retirement", amount: 18000, type: "goals", color: "orange", goalLinked: "Retirement" },
    ],
  },
  45: {
    inflows: [
      { name: "Salary", amount: 125000, type: "income", color: "emerald", goalLinked: null },
      { name: "Rental Income", amount: 18000, type: "assets", color: "blue", goalLinked: null },
      { name: "Investment Returns", amount: 25000, type: "assets", color: "indigo", goalLinked: "Retirement" },
      { name: "Business Income", amount: 35000, type: "income", color: "teal", goalLinked: null },
    ],
    outflows: [
      { name: "Mortgage", amount: 24000, type: "liabilities", color: "purple", goalLinked: null },
      { name: "Groceries", amount: 12000, type: "expenses", color: "red", goalLinked: null },
      { name: "Healthcare", amount: 8000, type: "expenses", color: "orange", goalLinked: null },
      { name: "Education", amount: 20000, type: "expenses", color: "pink", goalLinked: "Kids College" },
      { name: "Travel", amount: 15000, type: "goals", color: "yellow", goalLinked: "Vacation Fund" },
      { name: "Retirement", amount: 35000, type: "goals", color: "amber", goalLinked: "Retirement" },
      { name: "Investment", amount: 25000, type: "goals", color: "orange", goalLinked: null },
    ],
  },
  65: {
    inflows: [
      { name: "Social Security", amount: 28000, type: "income", color: "emerald", goalLinked: null },
      { name: "401k Withdrawal", amount: 45000, type: "assets", color: "blue", goalLinked: "Retirement" },
      { name: "Investment Returns", amount: 35000, type: "assets", color: "indigo", goalLinked: null },
      { name: "Pension", amount: 24000, type: "income", color: "teal", goalLinked: null },
    ],
    outflows: [
      { name: "Healthcare", amount: 15000, type: "expenses", color: "red", goalLinked: null },
      { name: "Living Expenses", amount: 35000, type: "expenses", color: "orange", goalLinked: null },
      { name: "Travel", amount: 12000, type: "goals", color: "yellow", goalLinked: "Vacation Fund" },
      { name: "Gifts/Charity", amount: 8000, type: "goals", color: "amber", goalLinked: null },
      { name: "Long-term Care", amount: 6000, type: "expenses", color: "pink", goalLinked: null },
    ],
  },
}

// Goals data (unchanged)
const goals = [
  { name: "Emergency Fund", target: 50000, current: 32000, color: "cyan", priority: "high", timeline: "2 years" },
  { name: "House Down Payment", target: 80000, current: 45000, color: "blue", priority: "high", timeline: "3 years" },
  { name: "Vacation Fund", target: 15000, current: 8000, color: "teal", priority: "medium", timeline: "1 year" },
  { name: "Retirement", target: 1000000, current: 125000, color: "indigo", priority: "high", timeline: "30 years" },
  { name: "Kids College", target: 200000, current: 35000, color: "purple", priority: "medium", timeline: "15 years" },
]

// Token data for Assets section (unchanged)
const tokens = [
  { symbol: "AUGOLD", name: "Gold", amount: 0.5, value: 6000, change: 5, allocation: 15, trend: "up" },
  { symbol: "AUSQFT", name: "Real Estate", amount: 2.3, value: 12000, change: -2, allocation: 30, trend: "down" },
  { symbol: "AUAERO", name: "Plane Seats", amount: 1.0, value: 3500, change: 8, allocation: 10, trend: "up" },
  { symbol: "AUSURA", name: "Whiskey", amount: 0.8, value: 2800, change: 3, allocation: 8, trend: "up" },
  { symbol: "AUTECH", name: "Technology", amount: 1.5, value: 8500, change: 12, allocation: 22, trend: "up" },
  { symbol: "AUBOND", name: "Bonds", amount: 3.2, value: 5200, change: 1, allocation: 15, trend: "stable" },
]

// Vehicles data
// const vehicles = [
//   {
//     name: "Traditional IRA",
//     type: "Retirement",
//     balance: 45000,
//     contribution: 6000,
//     taxStatus: "Deferred",
//     growth: 7.2,
//   },
//   { name: "Roth IRA", type: "Retirement", balance: 28000, contribution: 6000, taxStatus: "Tax-Free", growth: 8.1 },
//   { name: "401(k)", type: "Retirement", balance: 85000, contribution: 19500, taxStatus: "Deferred", growth: 6.8 },
//   { name: "HSA", type: "Health", balance: 12000, contribution: 3650, taxStatus: "Triple Tax-Free", growth: 5.5 },
//   {
//     name: "529 Plan",
//     type: "Education",
//     balance: 35000,
//     contribution: 5000,
//     taxStatus: "Tax-Free Growth",
//     growth: 6.2,
//   },
//   {
//     name: "Taxable Brokerage",
//     type: "Investment",
//     balance: 65000,
//     contribution: 12000,
//     taxStatus: "Taxable",
//     growth: 9.1,
//   },
// ]

// Protection services data (unchanged)
const protectionServices = [
  { name: "Credit Monitoring", status: "Active", score: 785, change: 15, coverage: "Identity Theft Protection" },
  { name: "Life Insurance", status: "Active", coverage: "$500,000", premium: 1200, type: "Term Life" },
  { name: "Disability Insurance", status: "Active", coverage: "60% Income", premium: 800, type: "Long-term" },
  { name: "Umbrella Policy", status: "Active", coverage: "$2M Liability", premium: 400, type: "Personal" },
  { name: "Legal Shield", status: "Pending", coverage: "Legal Consultation", premium: 300, type: "Family Plan" },
]

// Missions data for Contribute section (unchanged)
const missions = [
  {
    id: 1,
    title: "Ocean Plastic Cleanup Initiative",
    organization: "Blue Ocean Foundation",
    category: "Environmental",
    description:
      "Develop innovative solutions to remove plastic waste from ocean ecosystems using AI-powered collection systems",
    funding: 75000,
    target: 100000,
    contributors: 234,
    timeLeft: "15 days",
    match: 95,
    tags: ["Sustainability", "Innovation", "Ocean", "AI"],
    impact: "Remove 50 tons of plastic waste",
    yourContribution: 250,
  },
  {
    id: 2,
    title: "AI-Powered Learning Platform",
    organization: "EduTech Collective",
    category: "Education",
    description:
      "Create personalized learning experiences using artificial intelligence to adapt to each student's learning style",
    funding: 45000,
    target: 80000,
    contributors: 156,
    timeLeft: "8 days",
    match: 88,
    tags: ["AI", "Education", "Technology", "Personalization"],
    impact: "Reach 10,000 students globally",
    yourContribution: 0,
  },
  {
    id: 3,
    title: "Solar Energy for Rural Communities",
    organization: "Bright Future Energy",
    category: "Energy",
    description:
      "Bring clean, affordable solar power to underserved rural areas through community-owned solar installations",
    funding: 120000,
    target: 150000,
    contributors: 445,
    timeLeft: "22 days",
    match: 92,
    tags: ["Solar", "Rural", "Clean Energy", "Community"],
    impact: "Power 500 homes sustainably",
    yourContribution: 500,
  },
]

// Sankey Flow Component with Goal Linking (unchanged)
function SankeyFlow({ data, age, goals }: { data: any; age: number; goals: any[] }) {
  const totalInflow = data.inflows.reduce((sum: number, item: any) => sum + item.amount, 0)
  const totalOutflow = data.outflows.reduce((sum: number, item: any) => sum + item.amount, 0)

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-cyan-50/20 via-blue-50/20 to-indigo-50/20 rounded-2xl backdrop-blur-sm border border-cyan-200/30 overflow-hidden">
      {/* Enhanced sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-white via-cyan-200 to-blue-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="flex h-full">
        {/* Inflows */}
        <div className="w-1/3 p-6 space-y-3">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Income Flows</h3>
          {data.inflows.map((item: any, index: number) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-3 rounded-lg bg-gradient-to-r ${
                item.type === "income" ? colors.income : colors.assets
              } text-white shadow-lg ${item.goalLinked ? "ring-2 ring-yellow-400/50" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="font-bold">${item.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs opacity-80 capitalize">{item.type}</div>
                {item.goalLinked && (
                  <Badge className="text-xs bg-yellow-400/20 text-yellow-200 border-yellow-400/30">
                    <Target className="w-3 h-3 mr-1" />
                    {item.goalLinked}
                  </Badge>
                )}
              </div>

              {/* Enhanced flow line with goal indication */}
              <motion.div
                className={`absolute right-0 top-1/2 w-20 h-0.5 bg-gradient-to-r ${
                  item.goalLinked ? "from-yellow-400/80 to-transparent" : "from-white/60 to-transparent"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Center Flow Visualization */}
        <div className="w-1/3 flex flex-col items-center justify-center relative">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-2xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 30px rgba(6, 182, 212, 0.6)",
                "0 0 50px rgba(59, 130, 246, 0.8)",
                "0 0 30px rgba(6, 182, 212, 0.6)",
              ],
            }}
            transition={{
              rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              boxShadow: { duration: 3, repeat: Number.POSITIVE_INFINITY },
            }}
          >
            🐄
          </motion.div>
          <div className="text-center mt-4">
            <div className="text-white font-bold text-lg">Age {age}</div>
            <div className="text-cyan-200 text-sm">Net: ${(totalInflow - totalOutflow).toLocaleString()}</div>
            <div className="text-cyan-300 text-xs mt-1">
              {Math.round(((totalInflow - totalOutflow) / totalInflow) * 100)}% savings rate
            </div>
          </div>

          {/* Enhanced flowing particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full"
              animate={{
                x: [0, 120, 0, -120, 0],
                y: [0, -60, 0, 60, 0],
                opacity: [0, 1, 0.5, 1, 0],
                scale: [0.5, 1, 0.8, 1, 0.5],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Outflows */}
        <div className="w-1/3 p-6 space-y-3">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Expense Flows</h3>
          {data.outflows.map((item: any, index: number) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-3 rounded-lg bg-gradient-to-r ${
                item.type === "expenses"
                  ? colors.expenses
                  : item.type === "liabilities"
                    ? colors.liabilities
                    : colors.goals
              } text-white shadow-lg ${item.goalLinked ? "ring-2 ring-yellow-400/50" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="font-bold">${item.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs opacity-80 capitalize">{item.type}</div>
                {item.goalLinked && (
                  <Badge className="text-xs bg-yellow-400/20 text-yellow-200 border-yellow-400/30">
                    <Target className="w-3 h-3 mr-1" />
                    {item.goalLinked}
                  </Badge>
                )}
              </div>

              {/* Enhanced flow line with goal indication */}
              <motion.div
                className={`absolute left-0 top-1/2 w-20 h-0.5 bg-gradient-to-l ${
                  item.goalLinked ? "from-yellow-400/80 to-transparent" : "from-white/60 to-transparent"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced Goals Tracker with Timeline (unchanged)
function GoalsTracker() {
  return (
    <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20 backdrop-blur-sm border-purple-200/30">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-yellow-400" />
          Financial Goals Dashboard
        </h3>
        <div className="grid gap-4">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">{goal.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge className={`bg-${goal.color}-500 text-white`}>{goal.priority}</Badge>
                  <Badge variant="outline" className="text-cyan-300 border-cyan-300">
                    {goal.timeline}
                  </Badge>
                  <span className="text-white text-sm">
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                </div>
              </div>
              <Progress value={(goal.current / goal.target) * 100} className="h-3 mb-2" />
              <div className="flex justify-between text-xs">
                <span className="text-cyan-200">{Math.round((goal.current / goal.target) * 100)}% complete</span>
                <span className="text-cyan-200">${(goal.target - goal.current).toLocaleString()} remaining</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Assets Section Component (unchanged)
function AssetsSection() {
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-br from-blue-900/20 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm border-blue-200/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
              Token Portfolio
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-cyan-300">Total Portfolio Value</div>
            </div>
          </div>

          {/* Portfolio Allocation Chart */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Asset Allocation</h3>
              {tokens.map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.assets}`} />
                    <span className="text-white font-medium">{token.symbol}</span>
                  </div>
                  <span className="text-cyan-300">{token.allocation}%</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Performance Trends</h3>
              {tokens.map((token, index) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                >
                  <span className="text-white">{token.name}</span>
                  <div className="flex items-center space-x-2">
                    {token.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : token.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : (
                      <div className="w-4 h-4 bg-yellow-400 rounded-full" />
                    )}
                    <Badge variant={token.change > 0 ? "default" : "destructive"}>
                      {token.change > 0 ? "+" : ""}
                      {token.change}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Details */}
      <div className="grid gap-4">
        {tokens.map((token, index) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/50 via-blue-800/30 to-indigo-800/50 backdrop-blur-sm border-blue-200/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{token.symbol}</h3>
                      <Badge className={`bg-gradient-to-r ${colors.assets} text-white border-0`}>
                        {token.allocation}% allocation
                      </Badge>
                    </div>
                    <p className="text-cyan-300 mb-3">{token.name}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-cyan-200">Holdings</div>
                        <div className="text-lg font-semibold text-white">{token.amount} tokens</div>
                      </div>
                      <div>
                        <div className="text-sm text-cyan-200">Value</div>
                        <div className="text-lg font-semibold text-white">${token.value.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={token.change > 0 ? "default" : "destructive"} className="mb-2">
                      {token.change > 0 ? "+" : ""}
                      {token.change}%
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                        Buy
                      </Button>
                      <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-300">
                        Sell
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Vehicles Section Component
function VehiclesSection() {
  const { user } = useAuth()
  const userId = user?.id
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    type: "Retirement", // Default type
    balance: 0,
    contribution: 0,
    taxStatus: "",
    growth: 0,
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      if (userId) {
        try {
          const fetchedVehicles = await databaseService.fetchVehicles(userId)
          setVehicles(fetchedVehicles)
        } catch (error) {
          console.error("Failed to fetch vehicles:", error)
        }
      }
    }
    fetchVehicles()
  }, [userId])

  const handleAddVehicle = async () => {
    if (!userId) {
      console.error("User not authenticated.")
      return
    }
    try {
      const createdVehicle = await databaseService.createVehicle(userId, {
        name: newVehicle.name,
        type: newVehicle.type,
        balance: Number(newVehicle.balance),
        contribution: Number(newVehicle.contribution),
        taxStatus: newVehicle.taxStatus || null,
        growth: Number(newVehicle.growth) || null,
      })
      setVehicles((prev) => [...prev, createdVehicle])
      setNewVehicle({ name: "", type: "Retirement", balance: 0, contribution: 0, taxStatus: "", growth: 0 })
      setShowAddVehicleDialog(false)
    } catch (error) {
      console.error("Failed to add vehicle:", error)
    }
  }

  const totalBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.balance, 0)
  const totalContributions = vehicles.reduce((sum, vehicle) => sum + vehicle.contribution, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Vehicles Overview */}
      <Card className="bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-cyan-900/20 backdrop-blur-sm border-emerald-200/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Car className="w-6 h-6 mr-2 text-emerald-400" />
              Wealth Vehicles
            </h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${totalBalance.toLocaleString()}</div>
              <div className="text-sm text-cyan-300">Total Balance</div>
              <div className="text-sm text-emerald-300">
                ${totalContributions.toLocaleString()} annual contributions
              </div>
            </div>
          </div>

          <Tabs defaultValue="retirement" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/10">
              {" "}
              {/* Increased grid columns */}
              <TabsTrigger value="retirement" className="text-white data-[state=active]:bg-emerald-500">
                Retirement
              </TabsTrigger>
              <TabsTrigger value="health" className="text-white data-[state=active]:bg-teal-500">
                Health
              </TabsTrigger>
              <TabsTrigger value="education" className="text-white data-[state=active]:bg-cyan-500">
                Education
              </TabsTrigger>
              <TabsTrigger value="investment" className="text-white data-[state=active]:bg-blue-500">
                Investment
              </TabsTrigger>
              <TabsTrigger value="business" className="text-white data-[state=active]:bg-purple-500">
                {" "}
                {/* New Business Tab */}
                Business
              </TabsTrigger>
            </TabsList>

            <TabsContent value="retirement" className="space-y-4 mt-6">
              {vehicles
                .filter((v) => v.type === "Retirement")
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </TabsContent>

            <TabsContent value="health" className="space-y-4 mt-6">
              {vehicles
                .filter((v) => v.type === "Health")
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-6">
              {vehicles
                .filter((v) => v.type === "Education")
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </TabsContent>

            <TabsContent value="investment" className="space-y-4 mt-6">
              {vehicles
                .filter((v) => v.type === "Investment")
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </TabsContent>

            <TabsContent value="business" className="space-y-4 mt-6">
              {" "}
              {/* New Business Tab Content */}
              {vehicles
                .filter((v) => v.type === "Business")
                .map((vehicle, index) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
                ))}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setShowAddVehicleDialog(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Vehicle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddVehicleDialog} onOpenChange={setShowAddVehicleDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-slate-800/50 via-blue-800/30 to-indigo-800/50 backdrop-blur-md border-blue-200/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-cream-25">Add New Wealth Vehicle</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-cream-200">
                Name
              </Label>
              <Input
                id="name"
                value={newVehicle.name}
                onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-cream-200">
                Type
              </Label>
              <Select value={newVehicle.type} onValueChange={(value) => setNewVehicle({ ...newVehicle, type: value })}>
                <SelectTrigger className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent className="bg-ink-800/80 backdrop-blur-md text-cream-25 border-cream-200/20">
                  <SelectItem value="Retirement">Retirement</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                  <SelectItem value="Business">Business</SelectItem> {/* New Business option */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right text-cream-200">
                Balance
              </Label>
              <Input
                id="balance"
                type="number"
                value={newVehicle.balance}
                onChange={(e) => setNewVehicle({ ...newVehicle, balance: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contribution" className="text-right text-cream-200">
                Contribution
              </Label>
              <Input
                id="contribution"
                type="number"
                value={newVehicle.contribution}
                onChange={(e) => setNewVehicle({ ...newVehicle, contribution: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxStatus" className="text-right text-cream-200">
                Tax Status
              </Label>
              <Input
                id="taxStatus"
                value={newVehicle.taxStatus}
                onChange={(e) => setNewVehicle({ ...newVehicle, taxStatus: e.target.value })}
                className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="growth" className="text-right text-cream-200">
                Growth (%)
              </Label>
              <Input
                id="growth"
                type="number"
                value={newVehicle.growth}
                onChange={(e) => setNewVehicle({ ...newVehicle, growth: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3 glassmorphism-inner-card border-cream-200/20 text-cream-25 placeholder:text-cream-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddVehicleDialog(false)}
              className="text-cream-200 hover:text-cream-25 border-cream-200/20"
            >
              Cancel
            </Button>
            <Button onClick={handleAddVehicle} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// Vehicle Card Component (unchanged)
function VehicleCard({ vehicle, index }: { vehicle: Vehicle; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{vehicle.name}</h3>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">{vehicle.taxStatus}</Badge>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">${vehicle.balance.toLocaleString()}</div>
          <div className="text-sm text-cyan-300">{vehicle.growth}% growth</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-cyan-200">Annual Contribution</div>
          <div className="text-lg font-semibold text-white">${vehicle.contribution.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-cyan-200">Projected Growth</div>
          <div className="text-lg font-semibold text-emerald-400">+{vehicle.growth}%</div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 flex-1">
          Contribute
        </Button>
        <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-300">
          Details
        </Button>
      </div>
    </motion.div>
  )
}

// Protection Section Component (unchanged)
function ProtectionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Protection Overview */}
      <Card className="bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 backdrop-blur-sm border-red-200/30">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-400" />
            Financial Protection Suite
          </h2>

          <div className="grid gap-4">
            {protectionServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <Badge
                        className={`${
                          service.status === "Active"
                            ? "bg-green-500/20 text-green-300 border-green-400/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                        }`}
                      >
                        {service.status === "Active" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {service.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-cyan-200">Coverage</div>
                        <div className="text-white font-semibold">{service.coverage || `${service.score} Score`}</div>
                      </div>
                      <div>
                        <div className="text-sm text-cyan-200">Type</div>
                        <div className="text-white font-semibold">{service.type}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    {service.premium && <div className="text-lg font-bold text-white">${service.premium}/year</div>}
                    {service.change && <Badge className="bg-green-500 text-white">+{service.change} points</Badge>}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    Manage
                  </Button>
                  <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-300">
                    Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced Contribute Section (unchanged)
function ContributeSection() {
  const [contributeTab, setContributeTab] = useState("missions")

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Ikigai Compass */}
      <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-rose-900/20 backdrop-blur-sm border-purple-200/30">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <HandHeart className="w-6 h-6 mr-2 text-pink-400" />
            Your Ikigai Compass
          </h2>
          <div className="relative w-64 h-64 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-pink-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <div className="absolute inset-4 grid grid-cols-2 gap-2">
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-tl-full flex items-center justify-center text-white font-bold text-xs p-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">What You</div>
                  <div className="text-xs font-bold">LOVE</div>
                  <div className="text-xs mt-1">Sustainability</div>
                </div>
              </motion.div>
              <motion.div
                className="bg-gradient-to-bl from-green-500 to-emerald-600 rounded-tr-full flex items-center justify-center text-white font-bold text-xs p-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">What World</div>
                  <div className="text-xs font-bold">NEEDS</div>
                  <div className="text-xs mt-1">Clean Energy</div>
                </div>
              </motion.div>
              <motion.div
                className="bg-gradient-to-tr from-blue-500 to-cyan-600 rounded-bl-full flex items-center justify-center text-white font-bold text-xs p-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">What You're</div>
                  <div className="text-xs font-bold">GOOD AT</div>
                  <div className="text-xs mt-1">Technology</div>
                </div>
              </motion.div>
              <motion.div
                className="bg-gradient-to-tl from-orange-500 to-yellow-600 rounded-br-full flex items-center justify-center text-white font-bold text-xs p-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center">
                  <div className="text-xs mb-1">What You Can</div>
                  <div className="text-xs font-bold">BE PAID FOR</div>
                  <div className="text-xs mt-1">Consulting</div>
                </div>
              </motion.div>
            </div>
            <motion.div
              className="absolute inset-1/2 w-12 h-12 -ml-6 -mt-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl border-4 border-white"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              🐄
            </motion.div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">Your Purpose: Sustainable Tech Education</h3>
            <p className="text-sm text-cyan-300">Teaching technology for environmental solutions</p>
          </div>
        </CardContent>
      </Card>

      {/* Mission Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Aligned Missions</h3>
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/50 via-blue-800/30 to-indigo-800/50 backdrop-blur-sm border-blue-200/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{mission.title}</h3>
                      <Badge variant="secondary" className="bg-blue-500 text-white">
                        {mission.match}% match
                      </Badge>
                      {mission.yourContribution > 0 && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Contributed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-cyan-300 mb-2">{mission.organization}</p>
                    <p className="text-sm text-white mb-3">{mission.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {mission.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-cyan-300 text-cyan-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-300">${mission.funding.toLocaleString()} raised</span>
                    <span className="text-cyan-300">${mission.target.toLocaleString()} goal</span>
                  </div>
                  <Progress value={(mission.funding / mission.target) * 100} className="h-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm">
                      <span className="text-cyan-300">{mission.contributors} contributors</span>
                      <span className="text-cyan-300">{mission.timeLeft} left</span>
                      {mission.yourContribution > 0 && (
                        <span className="text-green-400">Your contribution: ${mission.yourContribution}</span>
                      )}
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      {mission.yourContribution > 0 ? "Add More" : "Contribute"}
                    </Button>
                  </div>

                  <div className="text-sm font-medium text-emerald-400">Impact: {mission.impact}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Profile Section Component (unchanged)
function ProfileSection() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm border-indigo-200/30">
        <CardContent className="p-6 text-center">
          <motion.div
            className="relative w-24 h-24 mx-auto mb-4"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl">
              🐄
            </div>
            <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-600"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="#3B82F6"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.65) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
          <h2 className="text-xl font-bold text-white">Level 3: Financial Navigator</h2>
          <p className="text-sm text-cyan-300 mb-4">You're mastering the flow of wealth—excellent progress!</p>
          <p className="text-sm text-cyan-300 mb-4">65% to Financial Architect</p>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
            Continue Journey
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-800/50 via-blue-800/30 to-indigo-800/50 backdrop-blur-sm border-blue-200/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Wallet Balances</h3>
          <div className="space-y-3">
            {tokens.slice(0, 4).map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center"
              >
                <span className="text-white">{token.symbol}:</span>
                <span className="font-semibold text-white">
                  {token.amount} tokens, ${token.value.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function MyCOWApp() {
  const [activeTab, setActiveTab] = useState("compass")
  const [isDark, setIsDark] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [mooMessage, setMooMessage] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [currentAge, setCurrentAge] = useState([35])

  // Get current financial data based on age
  const getCurrentData = () => {
    const age = currentAge[0]
    const ages = Object.keys(financialData)
      .map(Number)
      .sort((a, b) => a - b)
    const closestAge = ages.reduce((prev, curr) => (Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev))
    return financialData[closestAge as keyof typeof financialData]
  }

  // Show welcome notification on load
  useEffect(() => {
    setTimeout(() => {
      setShowNotification(true)
      setMooMessage("Welcome to your financial flow! Let's make waves! 🌊")
      setTimeout(() => setShowNotification(false), 4000)
    }, 1000)
  }, [])

  // Handle tab changes with Moo messages
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setShowMenu(false)
    const messages = {
      compass: "Riding the flow of prosperity! 🌊",
      contribute: "Making ripples of positive change! 💫",
      assets: "Your wealth is flowing beautifully! ✨",
      vehicles: "Structuring streams of success! 🚀",
      protect: "Safe harbors ahead! ⚓",
      profile: "Growing like the tides! 🌙",
    }
    setMooMessage(messages[tabId as keyof typeof messages])
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Removed Animated Water Background */}

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 pt-12">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center relative shadow-2xl"
            animate={{
              rotate: [0, 360],
              boxShadow: [
                "0 0 20px rgba(6, 182, 212, 0.5)",
                "0 0 40px rgba(59, 130, 246, 0.7)",
                "0 0 20px rgba(6, 182, 212, 0.5)",
              ],
            }}
            transition={{
              rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
          >
            <div className="relative text-white text-xl font-bold">🐄</div>
          </motion.div>
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            My<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">COW</span>
          </h1>
        </motion.div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-cyan-300 hover:bg-cyan-300/10"
          >
            <motion.div animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.3 }}>
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
          </Button>

          <Button variant="ghost" size="icon" className="text-cyan-300 hover:bg-cyan-300/10 relative">
            <Bell className="h-5 w-5" />
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </Button>

          {/* Collapsible Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="text-cyan-300 hover:bg-cyan-300/10"
          >
            <motion.div animate={{ rotate: showMenu ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </header>

      {/* Collapsible Navigation Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-br from-cyan-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl border border-cyan-300/30 shadow-2xl"
          >
            <div className="p-6 space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : "text-cyan-300 hover:bg-cyan-300/10 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Banner */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 z-40"
          >
            <motion.div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-2xl flex items-center space-x-3 backdrop-blur-sm"
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 10px 30px rgba(6, 182, 212, 0.3)",
                  "0 15px 40px rgba(59, 130, 246, 0.4)",
                  "0 10px 30px rgba(6, 182, 212, 0.3)",
                ],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <div className="text-xl">🐄</div>
              <p className="flex-1 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                {mooMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="px-4 pb-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "compass" && (
            <motion.div
              key="compass"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Age Selector */}
              <Card className="bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-cyan-200/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Financial Flow Timeline</h2>
                    <div className="text-cyan-300 font-bold text-lg">Age: {currentAge[0]}</div>
                  </div>
                  <Slider
                    value={currentAge}
                    onValueChange={setCurrentAge}
                    max={80}
                    min={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-cyan-300 mt-2">
                    <span>20</span>
                    <span>30</span>
                    <span>40</span>
                    <span>50</span>
                    <span>60</span>
                    <span>70</span>
                    <span>80</span>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Sankey Diagram */}
              <SankeyFlow data={getCurrentData()} age={currentAge[0]} goals={goals} />

              {/* Goals Tracker */}
              <GoalsTracker />
            </motion.div>
          )}

          {activeTab === "assets" && <AssetsSection />}
          {activeTab === "vehicles" && <VehiclesSection />}
          {activeTab === "protect" && <ProtectionSection />}
          {activeTab === "contribute" && <ContributeSection />}
          {activeTab === "profile" && <ProfileSection />}
        </AnimatePresence>
      </main>
    </div>
  )
}
