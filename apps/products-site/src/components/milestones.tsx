import type React from "react"
import { CheckCircle, Circle, Clock, Target, TrendingUp, Shield, Plane } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  date: string
  status: "completed" | "in-progress" | "upcoming"
  icon: React.ReactNode
}

interface MilestonesProps {
  tokenType: "ausiri" | "auaero"
}

export function Milestones({ tokenType }: MilestonesProps) {
  const ausiriMilestones: Milestone[] = [
    {
      id: "1",
      title: "Gold Reserve Establishment",
      description: "Secured initial 1,000 oz gold reserves in certified vaults",
      date: "Q4 2024",
      status: "completed",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "2",
      title: "Token Launch & Initial Offering",
      description: "Launch AuSIRI token with $10M initial market cap",
      date: "Q1 2025",
      status: "completed",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "3",
      title: "Retail Cycle Optimization",
      description: "Implement AI-driven retail cycle algorithms for margin optimization",
      date: "Q2 2025",
      status: "in-progress",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "4",
      title: "15% APY Achievement",
      description: "Reach target 15% annual percentage yield through optimized trading",
      date: "Q3 2025",
      status: "upcoming",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "5",
      title: "Gold Reserve Expansion",
      description: "Expand gold reserves to 5,000 oz to support growing token supply",
      date: "Q4 2025",
      status: "upcoming",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "6",
      title: "25% APY Target",
      description: "Achieve aggressive 25% APY through advanced optimization strategies",
      date: "Q1 2026",
      status: "upcoming",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ]

  const auaeroMilestones: Milestone[] = [
    {
      id: "1",
      title: "Initial Plane Launch",
      description: "Launched 2 A380-850 seater all-economy super jumbo planes and 20 A320-321 XLR series",
      date: "Q1 2025",
      status: "completed",
      icon: <Plane className="w-5 h-5" />,
    },
    {
      id: "2",
      title: "Acquiring Air Routes and Landing Slots",
      description: "Secured 50 UDAN routes in India covering Tier 2 & 3 cities",
      date: "Q2 2025",
      status: "in-progress",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "3",
      title: "Partnering with Airline Operators",
      description: "Partnered with airline operators, completed aircraft tape testing, pilot & staff training, and launching operations in 5-6 months",
      date: "Q3 2025",
      status: "in-progress",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "4",
      title: "Registering AERO in Estonia and Cyprus",
      description: "Registered AERO in Estonia and Cyprus, passporting into Luxembourg and other EU nations",
      date: "Q4 2025",
      status: "upcoming",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "5",
      title: "Establishing COW Blockchain Exchange",
      description: "Set up COW Blockchain Exchange Platform, registered in UAE, Qatar, Europe, Hong Kong APAC, Singapore, and the US",
      date: "Q1 2026",
      status: "upcoming",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "6",
      title: "Listing on US Markets",
      description: "Listing on US markets via direct listing or SPAC acquisition, with SPAC efforts beginning Aug 2025",
      date: "Q3 2026",
      status: "upcoming",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "7",
      title: "Aircraft Maintenance and Cargo Operations",
      description: "Set up aircraft maintenance, cargo operations, and launched Aviation Academy/University in Visakhapatnam",
      date: "Q4 2026",
      status: "upcoming",
      icon: <Plane className="w-5 h-5" />,
    },
    {
      id: "8",
      title: "Fleet Expansion Target",
      description: "Acquire and operate 132 to 168 planes in 5 years, with an aggressive target of 207 planes",
      date: "Q4 2029",
      status: "upcoming",
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "9",
      title: "Top 10 Airline Service Provider",
      description: "Become a top 10 airline service provider in 5-10 years, covering all continents globally",
      date: "Q4 2034",
      status: "upcoming",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "10",
      title: "Global Currency Instrument",
      description: "Establish AuAERO as a global stablecoin for air travel and cargo, launch TRU Loyalty Program issuing AuAERO as reward currency",
      date: "Q4 2035",
      status: "upcoming",
      icon: <Shield className="w-5 h-5" />,
    },
  ]

  const milestones = tokenType === "ausiri" ? ausiriMilestones : auaeroMilestones
  const colorScheme = tokenType === "ausiri" ? "yellow" : "blue"

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className={`w-6 h-6 text-${colorScheme}-400`} />
      case "in-progress":
        return <Clock className={`w-6 h-6 text-${colorScheme}-400`} />
      default:
        return <Circle className="w-6 h-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return `border-${colorScheme}-400 bg-${colorScheme}-400/10`
      case "in-progress":
        return `border-${colorScheme}-400 bg-${colorScheme}-400/5`
      default:
        return "border-gray-600 bg-gray-800/30"
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Development Milestones</h2>
          <p className="text-gray-400 text-lg">
            Track our progress towards delivering exceptional performance and value
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-full border-2 ${getStatusColor(milestone.status)} flex items-center justify-center`}
                  >
                    {getStatusIcon(milestone.status)}
                  </div>
                </div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div
                    className={`bg-gray-900/50 rounded-2xl p-6 border ${milestone.status === "completed" ? `border-${colorScheme}-400/30` : milestone.status === "in-progress" ? `border-${colorScheme}-400/20` : "border-gray-800"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{milestone.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          milestone.status === "completed"
                            ? `bg-${colorScheme}-400/20 text-${colorScheme}-400`
                            : milestone.status === "in-progress"
                              ? `bg-${colorScheme}-400/10 text-${colorScheme}-400`
                              : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {milestone.date}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{milestone.description}</p>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full ${milestone.status === "completed" ? `bg-${colorScheme}-400/20` : milestone.status === "in-progress" ? `bg-${colorScheme}-400/10` : "bg-gray-700"} flex items-center justify-center mr-3`}
                      >
                        {milestone.icon}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          milestone.status === "completed"
                            ? `text-${colorScheme}-400`
                            : milestone.status === "in-progress"
                              ? `text-${colorScheme}-400`
                              : "text-gray-400"
                        }`}
                      >
                        {milestone.status === "completed"
                          ? "Completed"
                          : milestone.status === "in-progress"
                            ? "In Progress"
                            : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}