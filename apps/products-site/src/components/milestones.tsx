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

  // COW Brand Colors
  const brandColors = tokenType === "ausiri"
    ? {
        primary: "#b45309", // Gold
        primaryLight: "#d97706",
        primaryDark: "#92400e",
        accent: "#f59e0b"
      }
    : {
        primary: "#2563eb", // Aviation Blue
        primaryLight: "#3b82f6",
        primaryDark: "#1d4ed8",
        accent: "#60a5fa"
      }

  const getStatusIcon = (status: string) => {
    const iconColor = status === "completed" || status === "in-progress"
      ? brandColors.primary
      : undefined;

    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6" style={{ color: iconColor }} />
      case "in-progress":
        return <Clock className="w-6 h-6" style={{ color: iconColor }} />
      default:
        return <Circle className="w-6 h-6 text-gray-400 dark:text-gray-600" />
    }
  }

  return (
    <section className="py-32 px-8" style={{ background: 'var(--mode-milestones-bg)' }}>
      <style>{`
        :root {
          --mode-milestones-bg: rgba(249, 250, 251, 0.4);
          --milestone-card-bg: rgba(255, 255, 255, 0.8);
          --milestone-border: rgba(0, 0, 0, 0.08);
        }
        .dark {
          --mode-milestones-bg: linear-gradient(135deg, ${tokenType === "ausiri" ? "rgba(180, 83, 9, 0.05)" : "rgba(37, 99, 235, 0.05)"} 0%, transparent 100%);
          --milestone-card-bg: rgba(31, 41, 55, 0.5);
          --milestone-border: rgba(75, 85, 99, 0.3);
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <h2
            className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            Development Roadmap
          </h2>
          <h3
            className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Charting the Journey Forward
          </h3>
          <p
            className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            style={{ letterSpacing: '0.01em' }}
          >
            Systematic milestones tracking our progress—from initial deployment through long-term optimization and scale
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{
              background: `linear-gradient(to bottom, ${brandColors.primary}, ${brandColors.primaryLight}, transparent)`
            }}
          />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative flex items-start">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                    style={{
                      background: milestone.status === "completed"
                        ? `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.primaryLight})`
                        : milestone.status === "in-progress"
                        ? `linear-gradient(135deg, ${brandColors.primaryLight}40, ${brandColors.primary}20)`
                        : 'var(--milestone-card-bg)',
                      borderColor: milestone.status === "completed" || milestone.status === "in-progress"
                        ? brandColors.primary
                        : 'var(--milestone-border)',
                      boxShadow: milestone.status === "completed"
                        ? `0 4px 16px ${brandColors.primary}40`
                        : milestone.status === "in-progress"
                        ? `0 4px 16px ${brandColors.primary}20`
                        : 'none'
                    }}
                  >
                    <div style={{ color: milestone.status === "completed" ? '#ffffff' : brandColors.primary }}>
                      {getStatusIcon(milestone.status)}
                    </div>
                  </div>
                </div>

                {/* Content Card */}
                <div className="ml-8 flex-1">
                  <div
                    className="rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: 'var(--milestone-card-bg)',
                      borderColor: milestone.status === "completed" || milestone.status === "in-progress"
                        ? `${brandColors.primary}40`
                        : 'var(--milestone-border)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                      <h3
                        className="text-xl sm:text-2xl font-light text-gray-900 dark:text-gray-100 flex-1"
                        style={{
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {milestone.title}
                      </h3>
                      <span
                        className="px-4 py-1.5 rounded-full text-sm font-light flex-shrink-0"
                        style={{
                          background: milestone.status === "completed" || milestone.status === "in-progress"
                            ? `${brandColors.primary}20`
                            : 'rgba(156, 163, 175, 0.2)',
                          color: milestone.status === "completed" || milestone.status === "in-progress"
                            ? brandColors.primary
                            : undefined,
                          letterSpacing: '0.01em'
                        }}
                      >
                        {milestone.date}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className="text-base font-light text-gray-600 dark:text-gray-300 mb-6"
                      style={{
                        lineHeight: '1.7',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {milestone.description}
                    </p>

                    {/* Footer with icon and status */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: milestone.status === "completed" || milestone.status === "in-progress"
                            ? `${brandColors.primary}15`
                            : 'rgba(156, 163, 175, 0.15)'
                        }}
                      >
                        <div style={{ color: brandColors.primary }}>
                          {milestone.icon}
                        </div>
                      </div>
                      <span
                        className="text-sm font-light"
                        style={{
                          color: milestone.status === "completed" || milestone.status === "in-progress"
                            ? brandColors.primary
                            : undefined,
                          letterSpacing: '0.01em'
                        }}
                      >
                        {milestone.status === "completed"
                          ? "Milestone Achieved"
                          : milestone.status === "in-progress"
                            ? "Currently In Progress"
                            : "Planned Milestone"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA/Note */}
        <div className="mt-20 text-center">
          <p
            className="text-base font-light text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.01em',
              lineHeight: '1.7'
            }}
          >
            Timelines represent current projections and may adjust as we continue pioneering new approaches to tokenized asset optimization
          </p>
        </div>
      </div>
    </section>
  )
}
