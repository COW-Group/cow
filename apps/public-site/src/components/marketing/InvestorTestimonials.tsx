import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function InvestorTestimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Portfolio Manager",
      rating: 5,
      quote: "COW's gold-backed tokens have consistently delivered returns that exceed traditional investment vehicles. The transparency and security give me complete confidence."
    },
    {
      name: "Michael Rodriguez",
      role: "Private Investor",
      rating: 5,
      quote: "The AuSIRI token has been a game-changer for my portfolio. 22% APY with gold backing provides the perfect balance of growth and stability."
    },
    {
      name: "David Thompson",
      role: "Investment Advisor",
      rating: 5,
      quote: "I've recommended COW to all my high-net-worth clients. The aerospace sector exposure through AuAERO offers unique opportunities not found elsewhere."
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">What Our Investors Say</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied investors who have chosen COW for their wealth growth journey.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-gray-300 italic">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}