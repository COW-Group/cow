import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Plane, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function InvestmentOpportunities() {
  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Discover Our Revolutionary Tokens</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the future of wealth creation with COW’s gold-backed and aviation-optimized tokens.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold">AuSIRI</span>
                <Coins className="h-8 w-8 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                AuSIRI: Gold-backed Systematic Investment Return Initiative. Delivers predictable 15-25% APY.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Starting at $1,000</span>
                <span className="text-sm bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Preorder Now</span>
              </div>
              <Link to="/ausiri" className="mt-4 inline-flex items-center text-yellow-400 group-hover:translate-x-2 transition-transform">
                <span>Explore AuSIRI</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl font-bold">AuAERO</span>
                <Plane className="h-8 w-8 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                AuAERO: Gold-Aerospace Enhanced Return Optimization. Targets 25-40% APY.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">Starting at $5,000</span>
                <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Preorder Now</span>
              </div>
              <Link to="/auaero" className="mt-4 inline-flex items-center text-blue-400 group-hover:translate-x-2 transition-transform">
                <span>Explore AuAERO</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}