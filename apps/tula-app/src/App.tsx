import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Scale, FileText, Shield, Briefcase, Building, TrendingUp, Globe, CheckCircle, Target, Zap, Search, FileSearch, BookOpen, Network, Settings, FileCheck, Bot, GitBranch } from 'lucide-react'

function App() {
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  if (!isClient) {
    return null
  }

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<HomePage toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/contracts" element={<ContractsPage toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/compliance" element={<CompliancePage toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/documents" element={<DocumentsPage toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/structuring" element={<StructuringPage toggleTheme={toggleTheme} isDark={isDark} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

function FloatingNav({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="px-8 py-4 flex items-center gap-8 transition-all duration-300"
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(25px) saturate(180%)',
          borderRadius: '20px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(155, 139, 126, 0.2)',
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span
            style={{
              fontSize: '20px',
              fontWeight: '200',
              letterSpacing: '0.08em',
              color: isDark ? '#cbd5e1' : '#1f2937',
              fontFamily: 'serif'
            }}
          >
            TULA
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/contracts"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Contracts
          </Link>
          <Link
            to="/compliance"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Compliance
          </Link>
          <Link
            to="/documents"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Documents
          </Link>
          <Link
            to="/structuring"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Structuring
          </Link>

          <div className="w-px h-6" style={{ background: isDark ? '#374151' : '#d1d5db' }} />

          <button
            className="text-sm font-light transition-all duration-200 rounded-full px-4 py-2"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: '13px',
              fontWeight: '300'
            }}
          >
            Account
          </button>

          <button
            onClick={toggleTheme}
            className="text-sm font-light transition-all duration-200 rounded-full px-4 py-2"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              fontSize: '13px',
              fontWeight: '300'
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

function HomePage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(180deg, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)'
            : 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 60%, #e8e6e3 100%)'
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
          <div className="mb-12">
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl mb-8"
              style={{
                lineHeight: '1.15',
                letterSpacing: '-0.015em',
                fontWeight: '200',
                color: isDark ? '#f8fafc' : '#1f2937'
              }}
            >
              Legal Infrastructure for<br />
              <span style={{
                background: 'linear-gradient(to right, #b45309 0%, #00A5CF 50%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '300'
              }}>
                Performance-Based Assets
              </span>
            </h1>
            <p
              className="text-xl sm:text-2xl lg:text-3xl font-light max-w-4xl mb-8"
              style={{
                lineHeight: '1.5',
                fontWeight: '300',
                letterSpacing: '-0.01em',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}
            >
              AI-powered contracts and compliance for tokenized wealth in the COW ecosystem.{' '}
              <span style={{ color: isDark ? '#cbd5e1' : '#4b5563' }}>Natural language meets blockchain execution.</span>
            </p>
            <p
              className="text-base sm:text-lg font-light max-w-3xl"
              style={{
                lineHeight: '1.7',
                fontWeight: '300',
                color: isDark ? '#6b7280' : '#9ca3af'
              }}
            >
              TULA bridges traditional legal frameworks with distributed ledger technology, creating smart legal contracts that preserve human comprehension while enabling automated execution. Built for how lawyers actually work—and for multi-generational wealth structuring across jurisdictions.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              className="px-6 py-3 transition-all duration-200 rounded-lg"
              style={{
                background: '#2563eb',
                fontSize: '0.95rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Request Access
            </button>
            <a
              href="#capabilities"
              className="px-6 py-3 text-sm font-light transition-all duration-200 rounded-lg"
              style={{
                color: isDark ? '#9ca3af' : '#6b7280',
                letterSpacing: '0.01em',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
              }}
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-40 px-8" style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff'
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-12">
            <div
              style={{
                color: '#b45309',
                letterSpacing: '0.15em',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}
            >
              Capabilities
            </div>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-6 max-w-3xl mx-auto"
            style={{
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              color: isDark ? '#f8fafc' : '#1f2937',
              fontWeight: '300'
            }}
          >
            Legal work that actually works
          </h2>
          <p
            className="text-base font-light text-center max-w-2xl mx-auto mb-24"
            style={{
              color: isDark ? '#6b7280' : '#9ca3af',
              lineHeight: '1.7'
            }}
          >
            Automation that respects complexity. Built for how lawyers actually work—not how engineers think they work.
          </p>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CapabilityCard
              icon={<Scale className="h-6 w-6" />}
              title="Smart Legal Contracts"
              description="Natural language contracts that live on blockchain. Negotiate, execute, and verify directly on-chain while maintaining full legal intelligibility. Built on third-generation public blockchain with logical platform oversight."
              bullets={[
                'Contract-on-chain architecture',
                'Human-readable + machine-executable',
                'Automatic compliance verification',
                'Multi-party coordination'
              ]}
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Globe className="h-6 w-6" />}
              title="Cross-Border Structuring"
              description="Design holding structures for performance real-world asset tokens across Estonia, Lithuania, Luxembourg, and target NYSE/NASDAQ listings. Multi-jurisdictional work that accounts for actual regulatory practice, not just statute text."
              bullets={[
                'Entity formation automation',
                'Multi-jurisdictional compliance mapping',
                'Tax treaty optimization',
                'Succession planning integration'
              ]}
              isDark={isDark}
            />
            <CapabilityCard
              icon={<FileText className="h-6 w-6" />}
              title="Private Placement Infrastructure"
              description="Generate comprehensive PPMs, investor agreements, and offering documents for tokenized commodities and services. From agricultural technology to aviation tokenization and beyond. Documents that pass regulatory scrutiny, not just generate text."
              bullets={[
                'PPM generation for 35+ commodity types',
                'Investor suitability assessment',
                'MiFID II / accredited investor compliance',
                'Performance-based return documentation'
              ]}
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Target className="h-6 w-6" />}
              title="Dispute Resolution & Oracles"
              description="Built-in arbitration mechanisms and oracle services for performance measurement verification. Resolve disputes on-chain or escalate to traditional arbitration as needed. Real dispute resolution, not just smart contract logic."
              bullets={[
                'On-chain dispute resolution',
                'Sales cycle verification oracles',
                'Multi-tiered arbitration',
                'Audit trail preservation'
              ]}
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Shield className="h-6 w-6" />}
              title="Regulatory Intelligence"
              description="Monitor and adapt to evolving frameworks: MiCA, DLT Pilot Regime, Data Act, and securities regulations across jurisdictions. Compliance that understands legal nuance, not keyword matching."
              bullets={[
                'Real-time regulatory monitoring',
                'KYC/AML automation within logical platforms',
                'Reporting automation for EU authorities',
                'Overriding mandatory rules detection'
              ]}
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Briefcase className="h-6 w-6" />}
              title="COW Ecosystem Integration"
              description="Purpose-built for COW Group's tokenization platform, MyCOW wealth management, and mass customization marketplace. Unified legal infrastructure across all applications."
              bullets={[
                'MyCOW portfolio compliance',
                'Tokenization legal wrappers',
                'Mauna wellness service agreements',
                'Marketplace commercial terms'
              ]}
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Technical Foundation Section */}
      <section className="py-40 px-8" style={{
        backgroundColor: isDark ? '#1e293b' : '#f8fafc'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div
              style={{
                color: '#b45309',
                letterSpacing: '0.15em',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}
            >
              Technical Foundation
            </div>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 max-w-3xl mx-auto"
            style={{
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              color: isDark ? '#f8fafc' : '#1f2937',
              fontWeight: '300'
            }}
          >
            Built on Contracts-on-Chain Architecture
          </h2>

          <p
            className="text-lg font-light text-center max-w-4xl mx-auto mb-16"
            style={{
              color: isDark ? '#9ca3af' : '#6b7280',
              lineHeight: '1.8'
            }}
          >
            TULA implements the latest research in blockchain-based legal contracts, using third-generation public blockchains with logical platform superstructures. Technology that adapts to legal practice, not the other way around.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <TechCard
              title="Modular Blockchain Usage"
              description="Choose your compliance level - from minimal timestamping to full negotiation, execution, and dispute resolution on-chain."
              isDark={isDark}
            />
            <TechCard
              title="Translation Verification"
              description="Every smart contract clause maps 1:1 to natural language text, verifiable by parties, arbitrators, or judges through blockchain explorers. Readable by lawyers, not just developers."
              isDark={isDark}
            />
            <TechCard
              title="Distributed Finance Model"
              description="Operates across interconnected logical platforms rather than fully decentralized, maintaining regulatory oversight while maximizing blockchain security and efficiency."
              isDark={isDark}
            />
            <TechCard
              title="Third-Generation Infrastructure"
              description="Built on Algorand-class blockchains: minimal transaction costs, immediate finality, no fork possibility, quantum-resistant security."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Use Case Highlights */}
      <section className="py-40 px-8" style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div
              style={{
                color: '#b45309',
                letterSpacing: '0.15em',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}
            >
              Applications
            </div>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-6 max-w-3xl mx-auto"
            style={{
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              color: isDark ? '#f8fafc' : '#1f2937',
              fontWeight: '300'
            }}
          >
            From family offices to institutional tokenization
          </h2>
          <p
            className="text-base font-light text-center max-w-2xl mx-auto mb-20"
            style={{
              color: isDark ? '#6b7280' : '#9ca3af',
              lineHeight: '1.7'
            }}
          >
            Real structures for real wealth. Not demos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UseCaseCard
              title="Performance RWA Tokens"
              description="Legal frameworks for sales-cycle-based returns on tokenized commodities. Structures that satisfy securities regulators, not just token enthusiasts."
              isDark={isDark}
            />
            <UseCaseCard
              title="Multi-Generational Wealth"
              description="Structure trusts, foundations, and corporate entities that hold tokenized assets across generations. Estate planning that handles both centuries-old legal principles and blockchain realities."
              isDark={isDark}
            />
            <UseCaseCard
              title="Institutional Compliance"
              description="Private placement administration for professional investors under Cyprus AIF structures and EU passporting. Documentation that withstands regulatory examination, not just internal review."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: isDark ? '#0a1628' : '#1f2937',
        color: isDark ? '#9ca3af' : '#d1d5db',
        padding: '80px 32px 40px'
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Tagline */}
          <div className="text-center mb-16">
            <p
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                color: isDark ? '#6b7280' : '#9ca3af',
                marginBottom: '8px'
              }}
            >
              Tula: Sanskrit for "balance"
            </p>
            <p
              className="text-sm font-light max-w-2xl mx-auto"
              style={{
                lineHeight: '1.7',
                color: isDark ? '#9ca3af' : '#d1d5db'
              }}
            >
              Blending multi-generational banking heritage with 2018 tokenization vision. Legal infrastructure built by people who've actually structured deals, not just shipped code.
            </p>
          </div>

          {/* Footer Nav */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="text-sm font-medium mb-4" style={{ color: isDark ? '#f8fafc' : '#ffffff', letterSpacing: '0.05em' }}>Product</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><Link to="/contracts" className="hover:opacity-70 transition-opacity">Contracts</Link></li>
                <li><Link to="/compliance" className="hover:opacity-70 transition-opacity">Compliance</Link></li>
                <li><Link to="/structuring" className="hover:opacity-70 transition-opacity">Structuring</Link></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Oracle Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4" style={{ color: isDark ? '#f8fafc' : '#ffffff', letterSpacing: '0.05em' }}>Legal</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:opacity-70 transition-opacity">Privacy</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Terms</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Security</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Jurisdiction Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4" style={{ color: isDark ? '#f8fafc' : '#ffffff', letterSpacing: '0.05em' }}>Resources</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:opacity-70 transition-opacity">Documentation</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Research Papers</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Brand Guidelines</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-4" style={{ color: isDark ? '#f8fafc' : '#ffffff', letterSpacing: '0.05em' }}>Company</h4>
              <ul className="space-y-2 text-sm font-light">
                <li><a href="#" className="hover:opacity-70 transition-opacity">About COW Group</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Missions App</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Contact</a></li>
                <li><a href="#" className="hover:opacity-70 transition-opacity">Careers</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t" style={{ borderColor: isDark ? '#1e293b' : '#374151' }}>
            <p className="text-xs font-light" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
              © 2025 COW Group. Built by COW Group.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

function CapabilityCard({ icon, title, description, bullets, isDark }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  isDark: boolean;
}) {
  return (
    <div
      className="p-8 rounded-lg transition-all duration-300"
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
        border: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(155, 139, 126, 0.2)',
        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div className="mb-4" style={{ color: '#b45309' }}>{icon}</div>
      <h3
        className="text-xl mb-3"
        style={{ color: isDark ? '#f8fafc' : '#1f2937', fontWeight: '400', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed mb-4"
        style={{ color: isDark ? '#9ca3af' : '#6b7280', lineHeight: '1.7' }}
      >
        {description}
      </p>
      <ul className="space-y-2">
        {bullets.map((bullet, i) => (
          <li key={i} className="text-xs font-light flex items-start gap-2" style={{ color: isDark ? '#6b7280' : '#9ca3af' }}>
            <span style={{ color: '#b45309', marginTop: '2px' }}>•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TechCard({ title, description, isDark }: {
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <div className="p-6">
      <h3
        className="text-lg mb-3"
        style={{ color: isDark ? '#f8fafc' : '#1f2937', fontWeight: '400', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed"
        style={{ color: isDark ? '#9ca3af' : '#6b7280', lineHeight: '1.7' }}
      >
        {description}
      </p>
    </div>
  )
}

function UseCaseCard({ title, description, isDark }: {
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <div
      className="p-8 rounded-lg"
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(245, 243, 240, 0.5)',
        border: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(155, 139, 126, 0.15)'
      }}
    >
      <h3
        className="text-lg mb-3"
        style={{ color: isDark ? '#f8fafc' : '#1f2937', fontWeight: '400', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed"
        style={{ color: isDark ? '#9ca3af' : '#6b7280', lineHeight: '1.7' }}
      >
        {description}
      </p>
    </div>
  )
}

function ContractsPage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32" style={{ paddingTop: '140px' }}>
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#1f2937', letterSpacing: '-0.02em' }}>
          Smart Legal Contracts
        </h1>
        <p className="text-lg font-light mb-8" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Contract management interface coming soon.
        </p>
      </div>
    </>
  )
}

function CompliancePage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32" style={{ paddingTop: '140px' }}>
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#1f2937', letterSpacing: '-0.02em' }}>
          Compliance Dashboard
        </h1>
        <p className="text-lg font-light mb-8" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Compliance tracking interface coming soon.
        </p>
      </div>
    </>
  )
}

function DocumentsPage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32" style={{ paddingTop: '140px' }}>
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#1f2937', letterSpacing: '-0.02em' }}>
          Document Vault
        </h1>
        <p className="text-lg font-light mb-8" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Document management interface coming soon.
        </p>
      </div>
    </>
  )
}

function StructuringPage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32" style={{ paddingTop: '140px' }}>
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#1f2937', letterSpacing: '-0.02em' }}>
          Cross-Border Structuring
        </h1>
        <p className="text-lg font-light mb-8" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
          Entity structuring tools coming soon.
        </p>
      </div>
    </>
  )
}

export default App
