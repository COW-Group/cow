import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function InvestorPortalCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join thousands of investors who have chosen COW for secure, high-yield returns. 
          Access exclusive gold-backed tokens and start building your wealth today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold group"
          >
            <Link to="/investor-portal" className="inline-flex items-center">
              Access Investor Portal
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
          >
            <Link to="/contact">Schedule Consultation</Link>
          </Button>
        </div>
        <p className="text-sm mt-6 text-blue-200">
          Minimum investment: $1,000 • No setup fees • 24/7 support available
        </p>
      </div>
    </section>
  );
}