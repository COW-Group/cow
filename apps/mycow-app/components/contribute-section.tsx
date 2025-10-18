"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { missions } from "@/lib/data"
import { HandHeart, Filter, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { ZenCard } from "./zen-card"

export function ContributeSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredMissions = selectedCategory ? missions.filter((m) => m.category === selectedCategory) : missions

  const categories = Array.from(new Set(missions.map((m) => m.category)))

  return (
    <div className="space-y-6">
      {/* Ikigai Compass */}
      <ZenCard hover={false}>
        <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-6 flex items-center">
          <HandHeart className="w-5 h-5 mr-3 text-logo-blue" />
          Your Ikigai Compass
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-64 h-64 flex-shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Love circle */}
              <circle cx="100" cy="70" r="60" fill="rgba(236, 72, 153, 0.1)" />
              <text x="100" y="70" textAnchor="middle" className="text-xs font-medium fill-pink-700 dark:fill-pink-300">
                LOVE
              </text>

              {/* Good at circle */}
              <circle cx="70" cy="130" r="60" fill="rgba(59, 130, 246, 0.1)" />
              <text x="70" y="130" textAnchor="middle" className="text-xs font-medium fill-blue-700 dark:fill-blue-300">
                GOOD AT
              </text>

              {/* Paid for circle */}
              <circle cx="130" cy="130" r="60" fill="rgba(245, 158, 11, 0.1)" />
              <text
                x="130"
                y="130"
                textAnchor="middle"
                className="text-xs font-medium fill-amber-700 dark:fill-amber-300"
              >
                PAID FOR
              </text>

              {/* World needs circle */}
              <circle cx="100" cy="100" r="60" fill="rgba(16, 185, 129, 0.1)" />
              <text
                x="100"
                y="100"
                textAnchor="middle"
                className="text-xs font-medium fill-emerald-700 dark:fill-emerald-300"
              >
                WORLD NEEDS
              </text>

              {/* Center - Ikigai */}
              <circle cx="100" cy="100" r="20" fill="#0000FF" />
              <image href="/images/logo-clean.png" x="85" y="85" width="30" height="30" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100 mb-2">
              Your Purpose: Sustainable Tech Education
            </h3>
            <p className="text-ink-600 dark:text-cream-400 mb-4">
              Your Ikigai analysis shows you're most fulfilled when combining your passion for sustainability with your
              technical skills to educate others. This creates both social impact and financial rewards.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cream-100/50 dark:bg-ink-700/50 p-3 rounded-xl border border-cream-200/50 dark:border-ink-600/50">
                <div className="text-sm font-medium text-ink-500 dark:text-cream-400">Mission Match</div>
                <div className="text-xl font-light text-logo-blue">92%</div>
              </div>
              <div className="bg-cream-100/50 dark:bg-ink-700/50 p-3 rounded-xl border border-cream-200/50 dark:border-ink-600/50">
                <div className="text-sm font-medium text-ink-500 dark:text-cream-400">Impact Potential</div>
                <div className="text-xl font-light text-logo-blue">High</div>
              </div>
            </div>
          </div>
        </div>
      </ZenCard>

      {/* Mission Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className={
            selectedCategory === null
              ? "bg-logo-blue hover:bg-blue-700 text-white"
              : "border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-800"
          }
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-logo-blue hover:bg-blue-700 text-white"
                : "border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-ink-800"
            }
          >
            {category}
          </Button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" className="border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Mission Cards */}
      <div className="space-y-4">
        {filteredMissions.map((mission) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ZenCard>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{mission.title}</h3>
                    <Badge className="bg-logo-blue/10 text-logo-blue border-logo-blue/20">{mission.match}% match</Badge>
                    {mission.yourContribution > 0 && (
                      <Badge className="bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-300 border-none">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Contributed
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-ink-500 dark:text-cream-400 mb-1">{mission.organization}</p>
                  <p className="text-ink-600 dark:text-cream-300 mb-3">{mission.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mission.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-500 dark:text-cream-400">
                        ${mission.funding.toLocaleString()} raised
                      </span>
                      <span className="text-ink-500 dark:text-cream-400">${mission.target.toLocaleString()} goal</span>
                    </div>
                    <Progress
                      value={(mission.funding / mission.target) * 100}
                      className="h-2 bg-cream-200 dark:bg-ink-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between md:w-48 md:text-right">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300"
                    >
                      {mission.timeLeft} left
                    </Badge>
                    <div className="text-sm text-ink-500 dark:text-cream-400 mb-1">
                      {mission.contributors} contributors
                    </div>
                    {mission.yourContribution > 0 && (
                      <div className="text-sm text-sage-600 dark:text-sage-400 mb-4">
                        Your contribution: ${mission.yourContribution}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button className="w-full bg-logo-blue hover:bg-blue-700">
                      {mission.yourContribution > 0 ? "Add More" : "Contribute"}
                    </Button>
                    <div className="text-sm font-medium text-sage-600 dark:text-sage-400 mt-2">
                      Impact: {mission.impact}
                    </div>
                  </div>
                </div>
              </div>
            </ZenCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
