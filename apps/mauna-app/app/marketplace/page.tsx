"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Package, Star, TrendingUp } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingCart className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              <h1 className="text-3xl font-light zen-heading">Marketplace</h1>
            </div>
            <p className="text-lg text-muted-foreground zen-body max-w-2xl mx-auto">
              Discover tools, resources, and opportunities to enhance your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Browse available products and services.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Featured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Discover featured items and recommendations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">See what's trending in the marketplace.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
