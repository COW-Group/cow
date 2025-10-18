"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { vehicles } from "@/lib/data"
import { Car, Plus, ArrowUpRight } from "lucide-react"
import { ZenCard } from "./zen-card"

export function VehiclesSection() {
  const totalBalance = vehicles.reduce((sum, vehicle) => sum + vehicle.balance, 0)
  const totalContributions = vehicles.reduce((sum, vehicle) => sum + vehicle.contribution, 0)

  return (
    <div className="space-y-6">
      {/* Vehicles Overview */}
      <ZenCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light text-ink-800 dark:text-cream-100 flex items-center">
            <Car className="w-5 h-5 mr-3 text-logo-blue" />
            Wealth Vehicles
          </h2>
          <div className="text-right">
            <div className="text-2xl font-light text-logo-blue">${totalBalance.toLocaleString()}</div>
            <div className="text-sm text-ink-500 dark:text-cream-400">
              ${totalContributions.toLocaleString()} annual contributions
            </div>
          </div>
        </div>

        <Tabs defaultValue="retirement" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-cream-100 dark:bg-ink-800 rounded-xl p-1">
            <TabsTrigger
              value="retirement"
              className="data-[state=active]:bg-cream-50 dark:data-[state=active]:bg-ink-700 data-[state=active]:text-logo-blue rounded-lg"
            >
              Retirement
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="data-[state=active]:bg-cream-50 dark:data-[state=active]:bg-ink-700 data-[state=active]:text-logo-blue rounded-lg"
            >
              Health
            </TabsTrigger>
            <TabsTrigger
              value="education"
              className="data-[state=active]:bg-cream-50 dark:data-[state=active]:bg-ink-700 data-[state=active]:text-logo-blue rounded-lg"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="investment"
              className="data-[state=active]:bg-cream-50 dark:data-[state=active]:bg-ink-700 data-[state=active]:text-logo-blue rounded-lg"
            >
              Investment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="retirement" className="space-y-4 mt-6">
            {vehicles
              .filter((v) => v.type === "Retirement")
              .map((vehicle) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} />
              ))}
          </TabsContent>

          <TabsContent value="health" className="space-y-4 mt-6">
            {vehicles
              .filter((v) => v.type === "Health")
              .map((vehicle) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} />
              ))}
          </TabsContent>

          <TabsContent value="education" className="space-y-4 mt-6">
            {vehicles
              .filter((v) => v.type === "Education")
              .map((vehicle) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} />
              ))}
          </TabsContent>

          <TabsContent value="investment" className="space-y-4 mt-6">
            {vehicles
              .filter((v) => v.type === "Investment")
              .map((vehicle) => (
                <VehicleCard key={vehicle.name} vehicle={vehicle} />
              ))}
          </TabsContent>
        </Tabs>
      </ZenCard>
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: any }) {
  return (
    <ZenCard className="bg-cream-100/50 dark:bg-ink-700/50 border-cream-200/50 dark:border-ink-600/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-ink-800 dark:text-cream-100">{vehicle.name}</h3>
          <Badge className="mt-1 bg-logo-blue/10 text-logo-blue border-logo-blue/20">{vehicle.taxStatus}</Badge>
        </div>
        <div className="text-right">
          <div className="text-xl font-light text-ink-800 dark:text-cream-100">${vehicle.balance.toLocaleString()}</div>
          <div className="text-sm text-sage-600 dark:text-sage-400">+{vehicle.growth}% growth</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-ink-500 dark:text-cream-400">Annual Contribution</div>
          <div className="text-lg font-medium text-ink-800 dark:text-cream-100">
            ${vehicle.contribution.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm text-ink-500 dark:text-cream-400">Type</div>
          <div className="text-lg font-medium text-ink-800 dark:text-cream-100">{vehicle.type}</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button className="bg-logo-blue hover:bg-blue-700 flex-1">
          <Plus className="w-4 h-4 mr-1" />
          Contribute
        </Button>
        <Button variant="outline" className="border-ink-300 dark:border-ink-600 text-ink-700 dark:text-cream-300">
          <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>
    </ZenCard>
  )
}
