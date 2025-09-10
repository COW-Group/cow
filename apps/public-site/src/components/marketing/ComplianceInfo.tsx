import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ComplianceInfo() {
  return (
    <section className="py-20 px-4 bg-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">Regulatory Compliance & Transparency</h2>
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            COW operates under strict regulatory guidelines and maintains full compliance with international 
            financial regulations. Our commitment to transparency ensures that all investment activities 
            are conducted with the highest standards of accountability.
          </p>
          <p>
            We are registered with relevant financial authorities and undergo regular audits to ensure 
            the security and legitimacy of our gold-backed token ecosystem. All transactions are recorded 
            on immutable blockchain ledgers for complete transparency.
          </p>
          <p className="text-base text-gray-600">
            Licensed by financial regulatory bodies • Audited by independent third parties • 
            Full KYC/AML compliance • Secure custody solutions
          </p>
        </div>
        <div className="mt-10">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link to="/compliance">Learn More About Our Compliance</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}