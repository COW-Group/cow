import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Globe } from "lucide-react";

export default function CompanyShowcase() {
  const features = [
    {
      icon: Shield,
      title: "Unmatched Security",
      description: "Bank-grade security with multi-layer encryption and cold storage protection for your digital assets."
    },
    {
      icon: TrendingUp,
      title: "Aggressive Growth",
      description: "Targeting 15-40% APY through strategic gold-backed investments and aerospace sector opportunities."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Worldwide accessibility with regulatory compliance across multiple jurisdictions for seamless investing."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose COW?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the future of wealth management with our innovative approach to gold-backed digital investments.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}