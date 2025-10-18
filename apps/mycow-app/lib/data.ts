// Age-based financial data
export const financialData = {
  25: {
    inflows: [
      { name: "Salary", amount: 65000, type: "income", color: "#10b981", goalLinked: null }, // emerald-500
      { name: "Side Hustle", amount: 8000, type: "income", color: "#0d9488", goalLinked: "Emergency Fund" }, // teal-600
      { name: "Investment Returns", amount: 2000, type: "assets", color: "#3b82f6", goalLinked: "Retirement" }, // blue-500
    ],
    outflows: [
      { name: "Rent", amount: 18000, type: "expenses", color: "#f97316", goalLinked: null }, // orange-500
      { name: "Groceries", amount: 6000, type: "expenses", color: "#ef4444", goalLinked: null }, // red-500
      { name: "Transportation", amount: 4800, type: "expenses", color: "#ec4899", goalLinked: null }, // pink-500
      { name: "Entertainment", amount: 3600, type: "expenses", color: "#f43f5e", goalLinked: null }, // rose-500
      { name: "Emergency Fund", amount: 15000, type: "goals", color: "#eab308", goalLinked: "Emergency Fund" }, // amber-500
      { name: "401k", amount: 6500, type: "goals", color: "#d97706", goalLinked: "Retirement" }, // yellow-600
      { name: "House Savings", amount: 5000, type: "goals", color: "#ea580c", goalLinked: "House Down Payment" }, // orange-600
    ],
    flowLinks: [
      // Example links for age 25, demonstrating splits
      { source: "Salary", target: "Rent", value: 18000 },
      { source: "Salary", target: "Groceries", value: 6000 },
      { source: "Salary", target: "Transportation", value: 4800 },
      { source: "Salary", target: "Entertainment", value: 3600 },
      { source: "Salary", target: "Emergency Fund", value: 15000, goalLinked: "Emergency Fund" },
      { source: "Salary", target: "401k", value: 6500, goalLinked: "Retirement" },
      { source: "Salary", target: "House Savings", value: 5000, goalLinked: "House Down Payment" },
      { source: "Side Hustle", target: "Emergency Fund", value: 8000, goalLinked: "Emergency Fund" },
      { source: "Investment Returns", target: "Retirement", value: 2000, goalLinked: "Retirement" },
    ],
  },
  35: {
    inflows: [
      { name: "Salary", amount: 95000, type: "income", color: "#059669", goalLinked: null }, // emerald-600
      { name: "Rental Income", amount: 12000, type: "assets", color: "#2563eb", goalLinked: "House Down Payment" }, // blue-600
      { name: "Investment Returns", amount: 8000, type: "assets", color: "#6366f1", goalLinked: "Retirement" }, // indigo-500
      { name: "Bonus", amount: 15000, type: "income", color: "#14b8a6", goalLinked: "Vacation Fund" }, // teal-500
    ],
    outflows: [
      { name: "Mortgage", amount: 24000, type: "liabilities", color: "#8b5cf6", goalLinked: null }, // purple-500
      { name: "Groceries", amount: 9000, type: "expenses", color: "#dc2626", goalLinked: null }, // red-600
      { name: "Childcare", amount: 15000, type: "expenses", color: "#f97316", goalLinked: null }, // orange-500
      { name: "Insurance", amount: 6000, type: "expenses", color: "#db2777", goalLinked: null }, // pink-600
      { name: "Vacation Fund", amount: 8000, type: "goals", color: "#eab308", goalLinked: "Vacation Fund" }, // amber-500
      { name: "College Fund", amount: 12000, type: "goals", color: "#b45309", goalLinked: "Kids College" }, // yellow-700
      { name: "Retirement", amount: 18000, type: "goals", color: "#c2410c", goalLinked: "Retirement" }, // orange-700
    ],
    flowLinks: [
      // Example links for age 35
      { source: "Salary", target: "Mortgage", value: 24000 },
      { source: "Salary", target: "Groceries", value: 9000 },
      { source: "Salary", target: "Childcare", value: 15000 },
      { source: "Salary", target: "Insurance", value: 6000 },
      { source: "Salary", target: "Vacation Fund", value: 8000, goalLinked: "Vacation Fund" },
      { source: "Salary", target: "College Fund", value: 12000, goalLinked: "Kids College" },
      { source: "Salary", target: "Retirement", value: 18000, goalLinked: "Retirement" },
      { source: "Rental Income", target: "Mortgage", value: 12000 },
      { source: "Investment Returns", target: "Retirement", value: 8000, goalLinked: "Retirement" },
      { source: "Bonus", target: "Vacation Fund", value: 15000, goalLinked: "Vacation Fund" },
    ],
  },
  45: {
    inflows: [
      { name: "Salary", amount: 125000, type: "income", color: "#047857", goalLinked: null }, // emerald-700
      { name: "Rental Income", amount: 18000, type: "assets", color: "#1d4ed8", goalLinked: null }, // blue-700
      { name: "Investment Returns", amount: 25000, type: "assets", color: "#4f46e5", goalLinked: "Retirement" }, // indigo-600
      { name: "Business Income", amount: 35000, type: "income", color: "#0f766e", goalLinked: null }, // teal-700
    ],
    outflows: [
      { name: "Mortgage", amount: 24000, type: "liabilities", color: "#7c3aed", goalLinked: null }, // purple-600
      { name: "Groceries", amount: 12000, type: "expenses", color: "#b91c1c", goalLinked: null }, // red-700
      { name: "Healthcare", amount: 8000, type: "expenses", color: "#ea580c", goalLinked: null }, // orange-600
      { name: "Education", amount: 20000, type: "expenses", color: "#be185d", goalLinked: "Kids College" }, // pink-700
      { name: "Travel", amount: 15000, type: "goals", color: "#f59e0b", goalLinked: "Vacation Fund" }, // amber-600
      { name: "Retirement", amount: 35000, type: "goals", color: "#92400e", goalLinked: "Retirement" }, // yellow-800
      { name: "Investment", amount: 25000, type: "goals", color: "#c2410c", goalLinked: null }, // orange-700
    ],
    flowLinks: [
      // Example links for age 45
      { source: "Salary", target: "Mortgage", value: 24000 },
      { source: "Salary", target: "Groceries", value: 12000 },
      { source: "Salary", target: "Healthcare", value: 8000 },
      { source: "Salary", target: "Education", value: 20000, goalLinked: "Kids College" },
      { source: "Salary", target: "Travel", value: 15000, goalLinked: "Vacation Fund" },
      { source: "Salary", target: "Retirement", value: 35000, goalLinked: "Retirement" },
      { source: "Salary", target: "Investment", value: 25000 },
      { source: "Rental Income", target: "Investment", value: 18000 },
      { source: "Investment Returns", target: "Retirement", value: 25000, goalLinked: "Retirement" },
      { source: "Business Income", target: "Investment", value: 35000 },
    ],
  },
  65: {
    inflows: [
      { name: "Social Security", amount: 28000, type: "income", color: "#065f46", goalLinked: null }, // emerald-800
      { name: "401k Withdrawal", amount: 45000, type: "assets", color: "#1e40af", goalLinked: "Retirement" }, // blue-800
      { name: "Investment Returns", amount: 35000, type: "assets", color: "#4338ca", goalLinked: null }, // indigo-700
      { name: "Pension", amount: 24000, type: "income", color: "#0e7490", goalLinked: null }, // teal-800
    ],
    outflows: [
      { name: "Healthcare", amount: 15000, type: "expenses", color: "#991b1b", goalLinked: null }, // red-800
      { name: "Living Expenses", amount: 35000, type: "expenses", color: "#c2410c", goalLinked: null }, // orange-700
      { name: "Travel", amount: 12000, type: "goals", color: "#d97706", goalLinked: "Vacation Fund" }, // amber-700
      { name: "Gifts/Charity", amount: 8000, type: "goals", color: "#78350f", goalLinked: null }, // yellow-900
      { name: "Long-term Care", amount: 6000, type: "expenses", color: "#9d174d", goalLinked: null }, // pink-800
    ],
    flowLinks: [
      // Example links for age 65
      { source: "Social Security", target: "Healthcare", value: 15000 },
      { source: "Social Security", target: "Living Expenses", value: 13000 },
      { source: "401k Withdrawal", target: "Living Expenses", value: 22000 },
      { source: "401k Withdrawal", target: "Travel", value: 12000, goalLinked: "Vacation Fund" },
      { source: "401k Withdrawal", target: "Gifts/Charity", value: 8000 },
      { source: "Investment Returns", target: "Living Expenses", value: 10000 },
      { source: "Investment Returns", target: "Long-term Care", value: 6000 },
      { source: "Pension", target: "Living Expenses", value: 0 }, // Example of zero allocation
      { source: "Pension", target: "Healthcare", value: 0 }, // Example of zero allocation
      { source: "Pension", target: "Travel", value: 0 }, // Example of zero allocation
      { source: "Pension", target: "Gifts/Charity", value: 0 }, // Example of zero allocation
      { source: "Pension", target: "Long-term Care", value: 0 }, // Example of zero allocation
    ],
  },
}

// Goals data
export const goals = [
  { name: "Emergency Fund", target: 50000, current: 32000, color: "cyan", priority: "high", timeline: "2 years" },
  { name: "House Down Payment", target: 80000, current: 45000, color: "blue", priority: "high", timeline: "3 years" },
  { name: "Vacation Fund", target: 15000, current: 8000, color: "teal", priority: "medium", timeline: "1 year" },
  { name: "Retirement", target: 1000000, current: 125000, color: "indigo", priority: "high", timeline: "30 years" },
  { name: "Kids College", target: 200000, current: 35000, color: "purple", priority: "medium", timeline: "15 years" },
]

// Token data for Assets section
export const tokens = [
  { symbol: "AUGOLD", name: "Gold", amount: 0.5, value: 6000, change: 5, allocation: 15, trend: "up" },
  { symbol: "AUSQFT", name: "Real Estate", amount: 2.3, value: 12000, change: -2, allocation: 30, trend: "down" },
  { symbol: "AUAERO", name: "Plane Seats", amount: 1.0, value: 3500, change: 8, allocation: 10, trend: "up" },
  { symbol: "AUSURA", name: "Whiskey", amount: 0.8, value: 2800, change: 3, allocation: 8, trend: "up" },
  { symbol: "AUTECH", name: "Technology", amount: 1.5, value: 8500, change: 12, allocation: 22, trend: "up" },
  { symbol: "AUBOND", name: "Bonds", amount: 3.2, value: 5200, change: 1, allocation: 15, trend: "stable" },
]

// Vehicles data
export const vehicles = [
  {
    name: "Traditional IRA",
    type: "Retirement",
    balance: 45000,
    contribution: 6000,
    taxStatus: "Deferred",
    growth: 7.2,
  },
  { name: "Roth IRA", type: "Retirement", balance: 28000, contribution: 6000, taxStatus: "Tax-Free", growth: 8.1 },
  { name: "401(k)", type: "Retirement", balance: 85000, contribution: 19500, taxStatus: "Deferred", growth: 6.8 },
  { name: "HSA", type: "Health", balance: 12000, contribution: 3650, taxStatus: "Triple Tax-Free", growth: 5.5 },
  {
    name: "529 Plan",
    type: "Education",
    balance: 35000,
    contribution: 5000,
    taxStatus: "Tax-Free Growth",
    growth: 6.2,
  },
  {
    name: "Taxable Brokerage",
    type: "Investment",
    balance: 65000,
    contribution: 12000,
    taxStatus: "Taxable",
    growth: 9.1,
  },
]

// Protection services data
export const protectionServices = [
  { name: "Credit Monitoring", status: "Active", score: 785, change: 15, coverage: "Identity Theft Protection" },
  { name: "Life Insurance", status: "Active", coverage: "$500,000", premium: 1200, type: "Term Life" },
  { name: "Disability Insurance", status: "Active", coverage: "60% Income", premium: 800, type: "Long-term" },
  { name: "Umbrella Policy", status: "Active", coverage: "$2M Liability", premium: 400, type: "Personal" },
  { name: "Legal Shield", status: "Pending", coverage: "Legal Consultation", premium: 300, type: "Family Plan" },
]

// Missions data for Contribute section
export const missions = [
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

// Navigation items
export const navItems = [
  { id: "compass", icon: "Compass", label: "Flow Compass" },
  { id: "contribute", icon: "HandHeart", label: "Contribute" },
  { id: "assets", icon: "TrendingUp", label: "Assets" },
  { id: "vehicles", icon: "Car", label: "Vehicles" },
  { id: "protect", icon: "Shield", label: "Protect" },
  { id: "profile", icon: "User", label: "Profile" },
]
