import { Link } from 'react-router-dom';
import { ArrowLeft, Plane, ShieldCheck, Leaf, Globe, Lightbulb, Scale, BookOpen, AlertTriangle, CheckCircle, Wallet, Award, Code, Lock, MapPin } from 'lucide-react';
import { AssetBreakdownChart, GrowthProjectionsChart } from '../components/Charts';

export default function AuAeroWhitepaperPage() {
  // Tailwind CSS classes for consistent styling
  const pageBg = "min-h-screen bg-gray-900 text-gray-100 font-sans";
  const sectionCard = "bg-white p-6 sm:p-8 rounded-xl border border-gray-700 shadow-lg mb-16";
  const sectionHeading = "text-4xl font-mono text-gray-900 mb-6 border-b-2 pb-3 flex items-center space-x-3";
  const subHeading = "text-3xl font-semibold text-sky-600 mb-4 mt-8";
  const bodyText = "text-gray-800 leading-relaxed font-sans";
  const strongAccent = "text-sky-600 font-semibold";
  const listIcon = "text-sky-600 mr-2";

  // Key Takeaway Box Styling
  const keyTakeawayBox = "bg-sky-50 border-l-4 border-sky-400 p-4 mb-6 rounded-md";
  const keyTakeawayHeading = "text-xl font-semibold text-sky-700 mb-2 flex items-center space-x-2";
  const keyTakeawayText = "text-gray-800 leading-relaxed";

  return (
    <div className={pageBg}>
      {/* Global Font Imports */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Space+Mono:wght@400;700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-space-mono { font-family: 'Space Mono', monospace; }
        `}
      </style>

      {/* Header Section */}
      <header className="mb-12 text-center py-10">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/auaero" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AuAERO
          </Link>
          <h1 className="text-5xl lg:text-6xl font-extrabold font-mono text-white mb-4 tracking-wider">
            <span className="text-sky-400">AuAERO</span> Whitepaper
          </h1>
          <p className="text-xl text-gray-300 font-sans">Fractional Commercial Passenger Airline Seat Tokenization</p>
          <div className="mt-6 text-sm text-gray-400 font-sans">
            <p><strong>Parties Involved:</strong> My Plane Seat Inc. (Issuer), AuAero Token Holders (Investors/Users)</p>
            <p><strong>Date:</strong> August 1, 2025</p>
            <p><strong>Audience:</strong> Qualified Investors and Internal Stakeholders Only</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section I: Executive Summary */}
        <section id="executive-summary" className={sectionCard}>
          <h2 className={sectionHeading}>
            <BookOpen className="text-sky-500 text-3xl" />
            <span>I. Executive Summary</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO democratizes investment in commercial airline seats through a security token, backed by a diversified portfolio of <strong className="text-sky-700">60% aviation assets</strong>, <strong className="text-teal-700">20% physical gold</strong>, and <strong className="text-indigo-700">20% crude oil</strong>. It aims for aggressive growth, targeting <strong className="text-indigo-700">$58.66 billion in asset backing by Year 5</strong>, and will offer tangible utility for air travel.
            </p>
          </div>
          <p className={bodyText}>The global aviation industry, a colossal and indispensable sector valued in the trillions, is currently undergoing a profound transformation. This shift is catalyzed by the convergence of tangible, high-value assets with the revolutionary capabilities of blockchain technology. At the vanguard of this evolution stands My Plane Seat Inc., a <strong className={strongAccent}>California Domestic Stock Corporation formally established on July 8, 2023, and operating in Good Standing</strong>. Headquartered at 5 JAMES AVE, ATHERTON, CA 94027, with a mailing address at 995 MARSH ROAD, SUITE 102 UNIT 208, REDWOOD CITY, CA 94063, My Plane Seat Inc. introduces AuAERO – a groundbreaking security token meticulously engineered to democratize investment in <strong className={strongAccent}>commercial passenger airline aircraft seats</strong> and fundamentally redefine flexible, value-driven air travel for the global public.</p>
          
          {/* Infographic: Asset Backing Breakdown */}
          <AssetBreakdownChart />

          <p className={bodyText}>Our ambitious growth trajectory is already in motion, demonstrating tangible, early progress. The <strong className={strongAccent}>initial foundational fleet of 2 Airbus A380-850s (each configured for 850 all-economy seats) and 20 Airbus A320-321 XLR series aircraft (each with 240 seats) was successfully launched in Q1 2025</strong>, marking a significant operational milestone. This operational fleet, along with its corresponding gold and crude oil reserves, underpins a substantial <strong className="text-indigo-700">Year 0 asset backing of approximately $9.78 billion</strong>. Our strategic roadmap projects a dramatic expansion to a target of <strong className={strongAccent}>132 to 168 planes (totaling 39,000 seats)</strong> by Q4 2029, driving the projected total asset backing to an impressive <strong className="text-indigo-700">$58.66 billion by Year 5</strong>.</p>

          {/* Infographic: Growth Projections */}
          <GrowthProjectionsChart />
        </section>

        {/* Section II: Problem Statement */}
        <section id="problem-statement" className={sectionCard}>
          <h2 className={sectionHeading}>
            <AlertTriangle className="text-sky-500 text-3xl" />
            <span>II. Problem Statement</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              The commercial aviation and investment sectors face challenges including <strong className="text-sky-700">exorbitant capital requirements</strong>, <strong className="text-sky-700">illiquidity of assets</strong>, <strong className="text-sky-700">limited travel flexibility</strong>, and a <strong className="text-sky-700">lack of transparency</strong> in asset-backed investments, which AuAERO aims to resolve.
            </p>
          </div>

          <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-mono text-gray-900 mb-4 tracking-wide">Problems AuAERO Solves</h3>
            <ul className="list-none space-y-2 text-left w-full px-4">
              <li className="flex items-start">
                <span className={listIcon}>🚫</span>
                <p className={bodyText}><strong>Exorbitant Capital Requirements</strong> for aviation investment.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>📉</span>
                <p className={bodyText}><strong>Illiquidity of Commercial Aviation Assets</strong>.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>✈️</span>
                <p className={bodyText}><strong>Limited Flexibility</strong> in traditional commercial air travel.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>🕵️</span>
                <p className={bodyText}><strong>Lack of Transparency</strong> in traditional asset-backed investments.</p>
              </li>
            </ul>
          </div>

          <h3 className={subHeading}>Exorbitant Capital Requirements</h3>
          <p className={bodyText}>Investing directly in <strong className={strongAccent}>commercial aviation assets</strong> demands colossal capital outlays. A new Airbus A380-800 had a list price exceeding <strong className="text-indigo-700">$445 million</strong>, while used aircraft still range from <strong className="text-indigo-700">$20-60 million</strong>. These figures represent immense sums typically beyond the reach of individual investors and smaller institutional funds.</p>

          <h3 className={subHeading}>Illiquidity of Assets</h3>
          <p className={bodyText}>Commercial aircraft, despite their high value, are inherently illiquid assets. Transaction cycles can extend 6-18 months, involving extensive due diligence, technical inspections, and complex legal negotiations across multiple jurisdictions.</p>

          <h3 className={subHeading}>Limited Travel Flexibility</h3>
          <p className={bodyText}>Existing commercial flights offer limited customization, fixed schedules, and crowded cabins. There's clear market demand for solutions that bridge mass-market commercial experience with enhanced comfort and flexibility.</p>
        </section>

        {/* Section III: Solution */}
        <section id="solution" className={sectionCard}>
          <h2 className={sectionHeading}>
            <CheckCircle className="text-sky-500 text-3xl" />
            <span>III. The AuAERO Solution</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO offers <strong className="text-sky-700">tokenized fractional ownership</strong> of commercial airline seats at <strong className="text-indigo-700">$7.50 per unit</strong>, backed by <strong className="text-sky-700">60% aviation assets, 20% gold, and 20% crude oil</strong>. It provides enhanced liquidity, transparency, and future utility like preferred travel access.
            </p>
          </div>

          <h3 className={subHeading}>Tokenized Fractional Ownership</h3>
          <p className={bodyText}>AuAERO transforms traditionally illiquid commercial aviation assets into divisible, tradable digital units. Each commercial aircraft passenger seat is fractionalized into <strong className="text-indigo-700">134,400 AuAERO units</strong> at an initial price of <strong className="text-indigo-700">$7.50</strong>, democratizing access to high-value aviation investments.</p>

          <h3 className={subHeading}>Diversified Asset Backing</h3>
          <p className={bodyText}>AuAERO is backed by a strategically diversified portfolio:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong className={strongAccent}>Commercial Aviation Assets (60%):</strong> Direct backing from operational Airbus A380-850 and A320-321 XLR series aircraft</li>
            <li><strong className={strongAccent}>Gold Reserves (20%):</strong> Physical gold providing stability and inflation hedge</li>
            <li><strong className={strongAccent}>Crude Oil Holdings (20%):</strong> Strategic exposure to global energy markets</li>
          </ul>

          <h3 className={subHeading}>Enhanced Liquidity & Transparency</h3>
          <p className={bodyText}>AuAERO tokens will be listed on global exchanges, providing unprecedented liquidity. All transactions are recorded on immutable blockchain ledger, with real-time asset valuations through secure oracle solutions.</p>

          <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-mono text-gray-900 mb-4 tracking-wide">Key Utility & Benefits</h3>
            <ul className="list-none space-y-2 text-left w-full px-4">
              <li className="flex items-start">
                <span className={listIcon}><Plane /></span>
                <p className={bodyText}>Preferred Access & Discounted <strong className={strongAccent}>Commercial Airline Seat Bookings</strong>.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>🗳️</span>
                <p className={bodyText}>Future Governance Participation (Decentralized Model).</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>💎</span>
                <p className={bodyText}>Staking Rewards & TRU Loyalty Program (Q4 2035).</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Section IV: Tokenomics */}
        <section id="tokenomics" className={sectionCard}>
          <h2 className={sectionHeading}>
            <Wallet className="text-sky-500 text-3xl" />
            <span>IV. Tokenomics and Economic Model</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO's supply is dynamic, tied to fleet expansion, with an initial price of <strong className="text-indigo-700">$7.50</strong> per token. Revenue from <strong className="text-sky-700">commercial aviation operations</strong> drives value accrual, supported by a liquidity strategy including exchange listings and market making.
            </p>
          </div>

          <h3 className={subHeading}>Token Structure</h3>
          <p className={bodyText}>Each commercial aircraft seat is divided into <strong className="text-indigo-700">134,400 AuAERO units</strong> at $7.50 each. The total supply grows dynamically with fleet expansion:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong>Year 0:</strong> 873,600,000 tokens (6,500 seats)</li>
            <li><strong>Year 1:</strong> 1,747,200,000 tokens (13,000 seats)</li>
            <li><strong>Year 5:</strong> 5,241,600,000 tokens (39,000 seats)</li>
          </ul>

          <h3 className={subHeading}>Value Accrual Mechanisms</h3>
          <p className={bodyText}>AuAERO value grows through:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong className={strongAccent}>Asset Appreciation:</strong> Growth in underlying aviation assets, gold, and crude oil values</li>
            <li><strong className={strongAccent}>Operational Profits:</strong> Revenue from fractional seat usage, ancillary services, and cargo operations</li>
            <li><strong className={strongAccent}>Fleet Reinvestment:</strong> Continuous expansion increasing total backing value</li>
            <li><strong className={strongAccent}>Utility Demand:</strong> Token usage for preferred travel access driving organic demand</li>
          </ul>

          <h3 className={subHeading}>Revenue Projections</h3>
          <p className={bodyText}>Financial model shows implied DCF payback period of approximately 4 years, with EBITDA margins competitive with leading commercial aviation operators, improving with economies of scale.</p>
        </section>

        {/* Section V: Technology & Security */}
        <section id="technology" className={sectionCard}>
          <h2 className={sectionHeading}>
            <Code className="text-sky-500 text-3xl" />
            <span>V. Technology Stack and Security</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO's robust tech stack prioritizes EVM-compatible blockchain, ERC-1400/ERC-3643 smart contracts, and secure oracle integration. <strong className="text-sky-700">Multi-layered security measures</strong> include independent audits, cold storage, multi-sig wallets, and stringent data privacy.
            </p>
          </div>

          <h3 className={subHeading}>Blockchain Platform</h3>
          <p className={bodyText}>AuAERO utilizes EVM-compatible blockchain for mature ecosystem support, high throughput, and regulatory friendliness. The platform supports security token standards like ERC-1400/ERC-3643 with embedded compliance features.</p>

          <h3 className={subHeading}>Smart Contract Architecture</h3>
          <p className={bodyText}>Core functionality includes:</p>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong className={strongAccent}>Security Token Contract:</strong> ERC-1400/ERC-3643 compliant with transfer restrictions and compliance controls</li>
            <li><strong className={strongAccent}>Minting/Burning Logic:</strong> Controlled token creation only upon verified asset acquisition</li>
            <li><strong className={strongAccent}>Asset Registry:</strong> On-chain records of underlying aviation assets, gold reserves, and oil holdings</li>
            <li><strong className={strongAccent}>Oracle Integration:</strong> Real-time valuation feeds from Chainlink and other secure oracles</li>
          </ul>

          <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-mono text-gray-900 mb-4 tracking-wide">Security & Compliance</h3>
            <ul className="list-none space-y-2 text-left w-full px-4">
              <li className="flex items-start">
                <span className={listIcon}><Scale /></span>
                <p className={bodyText}>Strict adherence to SEC regulations (<strong className={strongAccent}>Reg D, Reg A+, SPAC IPO</strong>).</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}><Globe /></span>
                <p className={bodyText}>International Registrations (Estonia, Cyprus for EU passporting).</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}><Lock /></span>
                <p className={bodyText}>Multi-layered security: Smart contract audits, cold storage, multi-sig wallets.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}><ShieldCheck /></span>
                <p className={bodyText}>Stringent Data Privacy (GDPR, CCPA) and AML/KYC.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Section VI: Roadmap */}
        <section id="roadmap" className={sectionCard}>
          <h2 className={sectionHeading}>
            <MapPin className="text-sky-500 text-3xl" />
            <span>VI. Roadmap and Milestones</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO's roadmap progresses from foundational development and partnerships through public market entry, aggressive fleet expansion, and ultimately global currency status for air travel.
            </p>
          </div>

          <h3 className={subHeading}>Foundational Phase (Q3 2025 - Q2 2026)</h3>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong>Q3 2025:</strong> Reg D 504 funding, airline partnerships, corporate setup</li>
            <li><strong>Q4 2025:</strong> Smart contract development & audit, EU registration</li>
            <li><strong>Q1 2026:</strong> COW Exchange platform launch, Reg A+ preparation</li>
          </ul>

          <h3 className={subHeading}>Growth Phase (Q3 2026 - Q2 2028)</h3>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong>Q3 2026:</strong> SEC qualification, US market listing, cargo operations</li>
            <li><strong>Q4 2026-Q2 2028:</strong> Aggressive fleet expansion to 132-168 aircraft</li>
          </ul>

          <h3 className={subHeading}>Leadership Phase (Q3 2028 - Q4 2035)</h3>
          <ul className="list-disc list-inside ml-4 mb-4 text-gray-800 leading-relaxed">
            <li><strong>Q3 2028-Q4 2029:</strong> SPAC IPO completion, target fleet achievement</li>
            <li><strong>Q4 2034:</strong> Top 10 global airline service provider status</li>
            <li><strong>Q4 2035:</strong> Global currency for air travel, TRU loyalty program launch</li>
          </ul>
        </section>

        {/* Section VII: Legal & Regulatory */}
        <section id="legal" className={sectionCard}>
          <h2 className={sectionHeading}>
            <Scale className="text-sky-500 text-3xl" />
            <span>VII. Legal and Regulatory Framework</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO operates as a compliant security token under strict SEC regulations, with comprehensive international compliance strategy and robust corporate governance.
            </p>
          </div>

          <h3 className={subHeading}>Security Token Classification</h3>
          <p className={bodyText}>AuAERO meets Howey Test criteria as a security token, requiring full compliance with securities laws. All offerings utilize specific SEC exemptions (Reg D Rule 504, Reg A+ Tier 2, SPAC IPO) with ongoing reporting obligations.</p>

          <h3 className={subHeading}>Funding Strategy</h3>
          <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-mono text-gray-900 mb-4 tracking-wide">Funding Journey</h3>
            <div className="flex flex-col items-start space-y-4 w-full px-4">
              <div className="flex items-center">
                <span className={listIcon}>1.</span>
                <p className={bodyText}><strong>Reg D Rule 504:</strong> Up to <strong className="text-indigo-700">$10M</strong> (Seed Capital).</p>
              </div>
              <div className="flex items-center">
                <span className={listIcon}>2.</span>
                <p className={bodyText}><strong>Reg A+ (Tier 2):</strong> Up to <strong className="text-indigo-700">$75M annually</strong> (Growth Capital).</p>
              </div>
              <div className="flex items-center">
                <span className={listIcon}>3.</span>
                <p className={bodyText}><strong>Strategic Debt Financing & Aircraft Leasing</strong> (Fleet Expansion).</p>
              </div>
              <div className="flex items-center">
                <span className={listIcon}>4.</span>
                <p className={bodyText}><strong>SPAC IPO:</strong> Access to billions (Public Market Liquidity).</p>
              </div>
            </div>
          </div>

          <h3 className={subHeading}>International Strategy</h3>
          <p className={bodyText}>Strategic registrations in Estonia and Cyprus enable EU passporting, while COW Exchange platform will be registered across UAE, Qatar, Hong Kong, Singapore, and US for global compliance.</p>
        </section>

        {/* Section VIII: Sustainability */}
        <section id="sustainability" className={sectionCard}>
          <h2 className={sectionHeading}>
            <Leaf className="text-sky-500 text-3xl" />
            <span>VIII. Sustainability Commitment</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              My Plane Seat Inc. commits to environmental responsibility through <strong className="text-sky-700">Sustainable Aviation Fuel (SAF) adoption</strong>, <strong className="text-sky-700">carbon offsetting programs</strong>, and transparent sustainability reporting, targeting carbon neutrality by 2050.
            </p>
          </div>

          <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center">
            <h3 className="text-2xl font-mono text-gray-900 mb-4 tracking-wide">Sustainability Initiatives</h3>
            <ul className="list-none space-y-2 text-left w-full px-4">
              <li className="flex items-start">
                <span className={listIcon}>🌱</span>
                <p className={bodyText}>Active <strong className={strongAccent}>Sustainable Aviation Fuel (SAF)</strong> Adoption.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>🌳</span>
                <p className={bodyText}>Investment in <strong className={strongAccent}>Certified Carbon Offsetting Programs</strong> (Gold Standard/VCS).</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>📊</span>
                <p className={bodyText}>Transparent Environmental Reporting.</p>
              </li>
              <li className="flex items-start">
                <span className={listIcon}>🌍</span>
                <p className={bodyText}>Target: Carbon Neutrality by 2050.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Section IX: Conclusion */}
        <section id="conclusion" className={sectionCard}>
          <h2 className={sectionHeading}>
            <Award className="text-sky-500 text-3xl" />
            <span>IX. Conclusion and Future Outlook</span>
          </h2>
          <div className={keyTakeawayBox}>
            <h3 className={keyTakeawayHeading}>
              <Lightbulb className="text-sky-600 text-2xl" />
              <span>Key Takeaway</span>
            </h3>
            <p className={keyTakeawayText}>
              AuAERO represents a transformative convergence of traditional aviation assets with blockchain technology, offering democratized investment access, enhanced liquidity, and real-world utility in air travel, positioned for significant growth and global adoption.
            </p>
          </div>

          <p className={bodyText}>The launch of AuAERO by My Plane Seat Inc. signifies a pivotal moment in the convergence of traditional finance, tangible real-world assets, and cutting-edge blockchain technology. With its robust diversified backing, aggressive growth trajectory to <strong className="text-indigo-700">$58.66 billion in asset backing by Year 5</strong>, and clear path to utility as a global currency for air travel, AuAERO offers a unique and compelling investment opportunity.</p>

          <p className={bodyText}>Beyond investment returns, AuAERO represents an invitation to participate in the future of commercial airline travel and asset tokenization. Through its commitment to transparency, regulatory compliance, and sustainable practices, My Plane Seat Inc. is positioned to redefine how we think about aviation investment and air travel accessibility.</p>

          <p className={bodyText}>We invite qualified investors and stakeholders to join this transformative journey toward a more accessible, transparent, and efficient aviation ecosystem.</p>
        </section>

      </main>

      {/* Footer with navigation */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/auaero" className="inline-flex items-center text-sky-400 hover:text-sky-300 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AuAERO Overview
          </Link>
          <p className="text-gray-400 text-sm">
            This whitepaper is for informational purposes only and does not constitute investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}