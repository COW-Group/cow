"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const chartData = [
  { quarter: 1, investment: 3.375, realizableGain: 1.397, totalGold: 40.46, sourcingCost: 117.29 },
  { quarter: 2, investment: 4.542, realizableGain: 1.844, totalGold: 53.10, sourcingCost: 119.61 },
  { quarter: 3, investment: 6.084, realizableGain: 2.422, totalGold: 69.37, sourcingCost: 121.97 },
  { quarter: 4, investment: 8.112, realizableGain: 3.167, totalGold: 90.20, sourcingCost: 124.38 },
  { quarter: 5, investment: 10.766, realizableGain: 4.121, totalGold: 116.75, sourcingCost: 126.84 },
  { quarter: 6, investment: 14.224, realizableGain: 5.339, totalGold: 150.46, sourcingCost: 129.35 },
  { quarter: 7, investment: 18.709, realizableGain: 6.886, totalGold: 193.04, sourcingCost: 131.91 },
  { quarter: 8, investment: 24.499, realizableGain: 8.842, totalGold: 246.62, sourcingCost: 134.51 },
  { quarter: 9, investment: 31.944, realizableGain: 11.306, totalGold: 313.72, sourcingCost: 137.17 },
  { quarter: 10, investment: 41.475, realizableGain: 14.393, totalGold: 397.42, sourcingCost: 139.88 },
  { quarter: 11, investment: 53.623, realizableGain: 18.247, totalGold: 501.38, sourcingCost: 142.65 },
  { quarter: 12, investment: 69.044, realizableGain: 23.038, totalGold: 629.97, sourcingCost: 145.47 },
]

export default function QuarterlyGrowthChart() {
  return (
    <div className="space-y-6">
      {/* Investment & Realizable Gain Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Investment Balance & Realizable Gain Growth</CardTitle>
          <CardDescription>
            Quarterly progression showing compound growth (values in billions €)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'Billions €', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}B`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="investment"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorInvestment)"
                name="Investment Balance"
              />
              <Area
                type="monotone"
                dataKey="realizableGain"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorGain)"
                name="Realizable Gain"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gold Accumulation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Gold Accumulation Over Time</CardTitle>
          <CardDescription>
            Total gold holdings in millions of grams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'Million Grams', angle: -90, position: 'insideLeft' }}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}M grams`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalGold"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorGold)"
                name="Total Gold Holdings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sourcing Cost Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sourcing Cost per Gram Trend</CardTitle>
          <CardDescription>
            Cost increases at 1.977% per quarter (in €)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300" />
              <XAxis
                dataKey="quarter"
                label={{ value: 'Quarter', position: 'insideBottom', offset: -5 }}
                className="text-xs"
              />
              <YAxis
                label={{ value: 'Cost per Gram (€)', angle: -90, position: 'insideLeft' }}
                className="text-xs"
                domain={[115, 150]}
              />
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}/g`}
                labelFormatter={(label) => `Quarter ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sourcingCost"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                name="Sourcing Cost/Gram"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
