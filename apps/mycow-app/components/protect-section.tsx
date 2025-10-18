"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { protectionServices } from "@/lib/data"
import { Shield, CheckCircle, AlertTriangle, ArrowUpRight } from "lucide-react"
import { ZenCard } from "./zen-card"

export function ProtectSection() {
  return (
    <div className="space-y-6">
      {/* Protection Overview */}
      <ZenCard>
        <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-3 text-logo-blue" />
          Financial Protection Suite
        </h2>

        <div className="grid gap-4">
          {protectionServices.map((service) => (
            <ZenCard
              key={service.name}
              className="bg-cream-100/50 dark:bg-ink-700/50 border-cream-200/50 dark:border-ink-600/50"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{service.name}</h3>
                    <Badge
                      className={`${
                        service.status === "Active"
                          ? "bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      } border-none`}
                    >
                      {service.status === "Active" ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {service.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-ink-500 dark:text-cream-400">Coverage</div>
                      <div className="text-ink-700 dark:text-cream-300 font-medium">
                        {service.coverage || `${service.score} Score`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-ink-500 dark:text-cream-400">Type</div>
                      <div className="text-ink-700 dark:text-cream-300 font-medium">{service.type}</div>
                    </div>
                  </div>
                </div>

                <div className="md:text-right mt-4 md:mt-0">
                  {service.premium && (
                    <div className="text-lg font-light text-ink-800 dark:text-cream-100 mb-2">
                      ${service.premium}/year
                    </div>
                  )}
                  {service.change && <Badge className="bg-sage-600 mb-4">+{service.change} points</Badge>}

                  <div className="flex space-x-2 mt-4">
                    <Button className="bg-logo-blue hover:bg-blue-700">Manage</Button>
                    <Button
                      variant="outline"
                      className="border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ZenCard>
          ))}
        </div>
      </ZenCard>
    </div>
  )
}
