import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Scale, FileText, Shield, Briefcase, Building, TrendingUp, Globe, CheckCircle, Target, Zap } from 'lucide-react'

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
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: isDark
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-xl font-light tracking-tight"
            style={{
              color: '#00A5CF',
              letterSpacing: '0.02em',
              fontWeight: '300'
            }}
          >
            TULA
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/contracts"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#cbd5e1' : '#475569', letterSpacing: '0.01em' }}
          >
            Contracts
          </Link>
          <Link
            to="/compliance"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#cbd5e1' : '#475569', letterSpacing: '0.01em' }}
          >
            Compliance
          </Link>
          <Link
            to="/documents"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#cbd5e1' : '#475569', letterSpacing: '0.01em' }}
          >
            Documents
          </Link>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          <button
            onClick={toggleTheme}
            className="text-sm font-light transition-all duration-200 rounded-full px-4 py-2"
            style={{
              background: 'rgba(0, 0, 0, 0.03)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              color: '#374151',
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
        {/* Background Gradient */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(180deg, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)'
            : 'linear-gradient(180deg, #E8F4F8 0%, #F5F3F0 60%, #C9B8A8 100%)'
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-8" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
          <div className="mb-16">
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl mb-8 tracking-tight"
              style={{
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}
            >
              <span style={{
                background: 'linear-gradient(to right, #0066FF 0%, #00A5CF 50%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '300'
              }}>
                TULA
              </span>
            </h1>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-light max-w-4xl"
              style={{
                lineHeight: '1.4',
                fontWeight: '300',
                letterSpacing: '-0.01em',
                color: isDark ? '#cbd5e1' : '#475569'
              }}
            >
              AI-powered legal infrastructure for <span style={{ color: '#00A5CF', fontWeight: '400' }}>wealth structuring</span> and <span style={{ color: '#10b981', fontWeight: '400' }}>business execution</span> in the COW ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/contracts"
              className="px-6 py-3 transition-all duration-200 rounded-lg"
              style={{
                background: '#2563eb',
                fontSize: '0.95rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: '#ffffff',
                border: 'none'
              }}
            >
              Get started
            </Link>
            <a
              href="#capabilities"
              className="px-4 py-3 text-sm font-light transition-opacity duration-200 hover:opacity-70"
              style={{
                color: isDark ? '#94a3b8' : '#64748b',
                letterSpacing: '0.01em'
              }}
            >
              Explore capabilities →
            </a>
          </div>
        </div>
      </section>

      {/* What is TULA Section */}
      <section id="capabilities" className="py-40 px-8" style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff'
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-4 py-2 text-xs font-light tracking-widest uppercase"
              style={{
                color: isDark ? '#64748b' : '#94a3b8',
                letterSpacing: '0.15em'
              }}
            >
              What is TULA
            </div>
          </div>

          {/* Headline */}
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-light text-center mb-16 max-w-4xl mx-auto"
            style={{
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
          >
            Legal automation for the next generation of <span style={{ color: '#00A5CF' }}>digital wealth</span>
          </h2>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
            <CapabilityCard
              icon={<Scale className="h-6 w-6" />}
              title="AI Contract Review"
              description="Automated analysis and generation of legal contracts with AI-powered risk assessment and clause optimization."
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Shield className="h-6 w-6" />}
              title="Multi-Jurisdiction Compliance"
              description="Track and maintain compliance across US, EU, UAE, and Asian markets with automated regulatory monitoring."
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Building className="h-6 w-6" />}
              title="Entity Structuring"
              description="Design optimal corporate structures, trusts, and foundations for wealth preservation and tax efficiency."
              isDark={isDark}
            />
            <CapabilityCard
              icon={<FileText className="h-6 w-6" />}
              title="Document Automation"
              description="Generate investor agreements, PPMs, whitepapers, and compliance documentation with one click."
              isDark={isDark}
            />
            <CapabilityCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Tax Optimization"
              description="Analyze and recommend tax-efficient strategies for tokenized assets and cross-border operations."
              isDark={isDark}
            />
            <CapabilityCard
              icon={<Briefcase className="h-6 w-6" />}
              title="COW Integration"
              description="Seamless workflows for AuAERO, AuSIRI, MyGOLD, and all tokenized asset programs in the ecosystem."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-32 px-8" style={{
        backgroundColor: isDark ? '#1e293b' : '#f8fafc'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <MetricCard number="15+" label="Jurisdictions" sublabel="Supported compliance tracking" isDark={isDark} />
            <MetricCard number="50K+" label="Documents" sublabel="Generated & managed" isDark={isDark} />
            <MetricCard number="99.9%" label="Accuracy" sublabel="AI contract analysis" isDark={isDark} />
            <MetricCard number="$2.3B+" label="Assets" sublabel="Structured through TULA" isDark={isDark} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-8" style={{
        backgroundColor: isDark ? '#0a1628' : '#ffffff'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-light mb-8"
            style={{
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: isDark ? '#f8fafc' : '#0f172a'
            }}
          >
            Ready to automate your legal workflows?
          </h2>
          <Link
            to="/contracts"
            className="inline-block px-8 py-4 transition-all duration-200 rounded-lg"
            style={{
              background: '#2563eb',
              fontSize: '1rem',
              fontWeight: '400',
              letterSpacing: '0.01em',
              color: '#ffffff'
            }}
          >
            Start with TULA
          </Link>
        </div>
      </section>
    </>
  )
}

function CapabilityCard({ icon, title, description, isDark }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <div
      className="p-8 rounded-xl transition-all duration-300 hover:scale-105"
      style={{
        background: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
        boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="mb-4" style={{ color: '#00A5CF' }}>{icon}</div>
      <h3
        className="text-xl font-semibold mb-3"
        style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
      >
        {title}
      </h3>
      <p
        className="text-sm font-light leading-relaxed"
        style={{ color: isDark ? '#cbd5e1' : '#64748b' }}
      >
        {description}
      </p>
    </div>
  )
}

function MetricCard({ number, label, sublabel, isDark }: {
  number: string;
  label: string;
  sublabel: string;
  isDark: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className="text-4xl sm:text-5xl font-light mb-2"
        style={{
          color: '#00A5CF',
          fontWeight: '300',
          letterSpacing: '-0.02em'
        }}
      >
        {number}
      </div>
      <div
        className="text-sm font-medium mb-1"
        style={{ color: isDark ? '#f8fafc' : '#0f172a' }}
      >
        {label}
      </div>
      <div
        className="text-xs font-light"
        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
      >
        {sublabel}
      </div>
    </div>
  )
}

function ContractsPage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32">
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
          Smart Contracts
        </h1>
        {/* Contract management interface would go here */}
      </div>
    </>
  )
}

function CompliancePage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32">
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
          Compliance Dashboard
        </h1>
        {/* Compliance dashboard would go here */}
      </div>
    </>
  )
}

function DocumentsPage({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) {
  return (
    <>
      <FloatingNav toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto px-8 py-32">
        <h1 className="text-5xl font-light mb-12" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
          Document Vault
        </h1>
        {/* Document management would go here */}
      </div>
    </>
  )
}

export default App
