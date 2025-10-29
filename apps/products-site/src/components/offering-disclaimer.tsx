import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function OfferingDisclaimer() {
  return (
    <Card className="border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
              Important Legal Disclosure
            </h3>
            <div className="text-xs text-amber-800 dark:text-amber-200 space-y-2 leading-relaxed">
              <p>
                <strong>This is not an offer to sell or a solicitation of an offer to buy securities.</strong> Offers will be made only by means of the official Regulation D and Regulation S Offering Documents (Private Placement Memorandum and Subscription Agreement) available through authorized channels, which may be updated or amended from time-to-time. Please contact us to receive the most recent Offering Documents.
              </p>
              <p>
                <strong>Regulation D Offering (U.S. Investors):</strong> The Regulation D offering under Rule 506(c) is available only to accredited investors as defined under Rule 501 of Regulation D. Verification of accredited investor status is required.
              </p>
              <p>
                <strong>Regulation S Offering (International Investors):</strong> The Regulation S offering is available only to non-U.S. persons in offshore transactions as defined under Regulation S of the Securities Act of 1933.
              </p>
              <p>
                The acquisition of any securities or assets identified in this communication is subject to various conditions, contingencies, and regulatory requirements, and may not be consummated. Past performance is not indicative of future results.
              </p>
              <p>
                <strong>Risk Warning:</strong> Investing involves significant risk and may result in partial or total loss of capital. Any historical returns, expected returns, projections, or probability scenarios presented may not reflect actual future performance and should not be relied upon as guarantees.
              </p>
              <p>
                Prospective investors should carefully consider investment objectives, risks, charges, expenses, and suitability before making any investment decision. You should consult with qualified tax, legal, and financial advisers before making any investment decision.
              </p>
              <p className="font-medium">
                Securities offered by <strong>My Gold Grams Inc</strong>, a wholly-owned subsidiary of <strong>COW Group of Companies</strong>.
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-300 mt-3">
                For additional information and complete disclosures, please visit our investor relations page or contact investor.relations@mycow.io
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
