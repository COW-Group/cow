import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Scale, FileText, Shield, Briefcase, Building, TrendingUp, Globe, CheckCircle, Target, Zap, Search, FileSearch, BookOpen, Network, Settings, FileCheck, Bot, GitBranch, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
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
          <a
            href="#features"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            Pricing
          </a>
          <a
            href="#about"
            className="text-sm font-light transition-opacity duration-200 hover:opacity-70"
            style={{ color: isDark ? '#9ca3af' : '#6b7280', letterSpacing: '0.02em', fontWeight: '300' }}
          >
            About
          </a>

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
            Sign In
          </button>

          <button
            onClick={toggleTheme}
            className="text-sm font-light transition-all duration-200 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{
              color: isDark ? '#9ca3af' : '#6b7280'
            }}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.div>
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
        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
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
              Legal AI Platform for the<br />
              <span style={{
                background: 'linear-gradient(to right, #0066FF 0%, #0ea5e9 50%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '300'
              }}>
                Digital Economy
              </span>
            </h1>
            <p
              className="text-xl sm:text-2xl font-light max-w-4xl mx-auto mb-4"
              style={{
                lineHeight: '1.5',
                fontWeight: '300',
                letterSpacing: '-0.01em',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}
            >
              Draft contracts in minutes. Navigate compliance across jurisdictions. Structure entities with AI guidance.
            </p>
            <p
              className="text-base sm:text-lg font-light max-w-3xl mx-auto mb-12"
              style={{
                lineHeight: '1.7',
                fontWeight: '300',
                color: isDark ? '#6b7280' : '#9ca3af'
              }}
            >
              Built by practitioners who've actually done this work—from high street contracts to multi-billion tokenizations across three continents.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <button
              className="px-8 py-4 transition-all duration-200 rounded-lg"
              style={{
                background: '#2563eb',
                fontSize: '1rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Try Free for 14 Days
            </button>
            <button
              className="px-8 py-4 transition-all duration-200 rounded-lg"
              style={{
                color: isDark ? '#9ca3af' : '#6b7280',
                fontSize: '1rem',
                fontWeight: '300',
                letterSpacing: '0.01em',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
              }}
            >
              Book a 20-Minute Demo
            </button>
            <button
              className="px-8 py-4 transition-all duration-200 rounded-lg"
              style={{
                color: isDark ? '#cbd5e1' : '#1f2937',
                fontSize: '1rem',
                fontWeight: '300',
                letterSpacing: '0.01em',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
              }}
            >
              Student Access (£247/mo)
            </button>
          </div>
          <p
            className="text-xs font-light mt-4"
            style={{
              color: isDark ? '#6b7280' : '#9ca3af',
              textAlign: 'center'
            }}
          >
            No credit card required for trial
          </p>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 px-8" style={{
        backgroundColor: isDark ? '#1e293b' : '#f8fafc'
      }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-light text-center mb-12"
            style={{
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              color: isDark ? '#f8fafc' : '#1f2937',
              fontWeight: '300'
            }}
          >
            Most Legal AI Doesn't Work for Real Practice
          </h2>
          <div
            className="space-y-6 text-lg font-light"
            style={{
              color: isDark ? '#9ca3af' : '#6b7280',
              lineHeight: '1.8'
            }}
          >
            <p>
              You've seen the demos: Tools that can't handle your firm's templates. "AI" that's just GPT wrapper with no legal knowledge. Platforms built by engineers who've never billed an hour.
            </p>
            <p>
              Features that sound good but break on actual client work. Security that means "we'll train on your client data."
            </p>
            <p style={{ color: isDark ? '#cbd5e1' : '#4b5563', fontWeight: '400' }}>
              We built TULA because we got tired of tools that don't understand how legal work actually happens.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-40 px-8" style={{
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
              How It Works
            </div>
          </div>

          {/* Headline */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-16 max-w-4xl mx-auto"
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
            className="text-lg font-light text-center max-w-3xl mx-auto mb-24"
            style={{
              color: isDark ? '#9ca3af' : '#6b7280',
              lineHeight: '1.8'
            }}
          >
            Built for how lawyers actually work. Not how engineers think they work.
          </p>

          {/* Feature Grid - Workflow Based */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              audience=""
              title="Draft Contracts That Actually Work"
              description="Upload your firm's templates. TULA learns your style, precedents, and clauses. Generate first drafts in minutes with your formatting, your language, your precedents. Version control and redlining built in."
              isDark={isDark}
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              audience=""
              title="Research That Understands Your Matter"
              description="Search across UK, EU, and US case law with context. Find precedents that matter for your specific issue. AI-generated summaries with full citations. Integrated with your matter files."
              isDark={isDark}
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              audience=""
              title="Manage Matters, Not Chaos"
              description="Track deadlines, communications, and documents in one place. Client portals that actually get used. Time tracking that doesn't feel like punishment. Matter templates that evolve with your practice."
              isDark={isDark}
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              audience=""
              title="Navigate Multi-Jurisdiction Complexity"
              description="Compare regulatory requirements across UK, EU, US, and offshore jurisdictions. Generate compliance calendars automatically. Track filing deadlines. Get alerts for regulatory changes that affect your clients."
              isDark={isDark}
            />
            <FeatureCard
              icon={<Building className="h-6 w-6" />}
              audience=""
              title="Structure Entities with AI Guidance"
              description="Answer questions about the business. TULA recommends entity structures across jurisdictions. Generate formation documents. Automate governance templates. Board packs that don't take weekends."
              isDark={isDark}
            />
            <FeatureCard
              icon={<Network className="h-6 w-6" />}
              audience="ADVANCED"
              title="Deploy Smart Legal Contracts"
              description="Convert legal agreements to blockchain-executable contracts. Generate token sale documentation with built-in compliance. DAO governance frameworks. MiCA-compliant stablecoin structures."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-8" style={{
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
              From Real Practitioners
            </div>
          </div>

          <h2
            className="text-3xl sm:text-4xl font-light text-center mb-20 max-w-3xl mx-auto"
            style={{
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
              color: isDark ? '#f8fafc' : '#1f2937',
              fontWeight: '300'
            }}
          >
            Built by lawyers who understand the work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              quote="Finally, a legal AI that understands our templates and doesn't break on edge cases. We've cut contract drafting time by 60%."
              role="Associate, Commercial Property Firm"
              isDark={isDark}
            />
            <TestimonialCard
              quote="The multi-jurisdiction compliance tracking is a game-changer. It's like having a regulatory team in 15 countries without the headcount."
              role="General Counsel, International Scale-up"
              isDark={isDark}
            />
            <TestimonialCard
              quote="As an NQ, TULA's been like having a senior associate checking my work. The research tool actually understands context, not just keywords."
              role="Newly Qualified Solicitor"
              isDark={isDark}
            />
            <TestimonialCard
              quote="We've deployed tokenization structures across UK, Switzerland, and Singapore. TULA's smart contract templates understand both the legal and technical requirements."
              role="Partner, Blockchain Legal Specialist"
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* About / Origin Section */}
      <section id="about" className="py-40 px-8" style={{
        backgroundColor: isDark ? '#0f172a' : '#ffffff'
      }}>
        <div className="max-w-5xl mx-auto">
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
              Built by Practitioners, For Practitioners
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl sm:text-4xl font-light text-center mb-12"
              style={{
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
                color: isDark ? '#f8fafc' : '#1f2937',
                fontWeight: '300'
              }}
            >
              Born from Necessity
            </h2>

            <div className="space-y-6 text-lg font-light" style={{
              color: isDark ? '#9ca3af' : '#6b7280',
              lineHeight: '1.8'
            }}>
              <p>
                TULA emerged from a practice spanning three generations of banking, international law, and digital asset innovation. We saw the gap: traditional legal education and tools weren't preparing lawyers for clients operating in digital economies.
              </p>
              <p>
                Students needed better exam preparation. Practitioners needed efficient matter management. Specialists needed frameworks for tokenization and cross-border structuring.
              </p>
              <p>
                Rather than wait for legal tech to catch up to our practice, we built the infrastructure ourselves.
              </p>
              <p style={{ color: isDark ? '#cbd5e1' : '#4b5563', fontWeight: '400' }}>
                Not a tech company building legal tools. A legal practice building its own infrastructure—and sharing it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-40 px-8" style={{
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
              Pricing
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
            Simple, transparent pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Essentials"
              price="£247"
              period="/month"
              subtitle="For students and early-career practitioners"
              features={['Bar exam prep & legal writing', 'AI contract drafting', 'Legal research (UK/EU/US)', 'Matter templates', 'Up to 50 matters/month']}
              popular={false}
              isDark={isDark}
            />
            <PricingCard
              tier="Professional"
              price="£697"
              period="/month"
              subtitle="For established practices and in-house teams"
              features={['Everything in Essentials', 'Unlimited matters', 'Multi-jurisdiction compliance', 'Entity structuring tools', 'Client portals', 'Priority support']}
              popular={true}
              isDark={isDark}
            />
            <PricingCard
              tier="Specialist"
              price="£1,997"
              period="/month"
              subtitle="For complex cross-border and digital asset work"
              features={['Everything in Professional', 'Smart legal contracts', 'Blockchain deployment', 'Token sale documentation', 'DAO governance frameworks', 'Dedicated account team']}
              popular={false}
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
              From bar exam prep to billion-dollar tokenization. Three generations of banking heritage meets legal AI innovation. Built by practitioners who bridge traditional law and digital assets.
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

function FeatureCard({ icon, audience, title, description, isDark }: {
  icon: React.ReactNode;
  audience: string;
  title: string;
  description: string;
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
      <div
        className="text-xs font-medium mb-2"
        style={{
          color: '#b45309',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}
      >
        {audience}
      </div>
      <h3
        className="text-xl mb-3"
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

function PricingCard({ tier, price, period, subtitle, features, popular, isDark }: {
  tier: string;
  price: string;
  period: string;
  subtitle?: string;
  features: string[];
  popular: boolean;
  isDark: boolean;
}) {
  return (
    <div
      className="p-8 rounded-lg transition-all duration-300"
      style={{
        background: popular
          ? (isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)')
          : (isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff'),
        border: popular
          ? '2px solid #2563eb'
          : (isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(155, 139, 126, 0.2)'),
        boxShadow: popular
          ? '0 4px 20px rgba(37, 99, 235, 0.2)'
          : (isDark ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.05)')
      }}
    >
      {popular && (
        <div
          className="text-xs font-medium mb-4 text-center py-1 px-3 rounded-full inline-block"
          style={{
            background: '#2563eb',
            color: '#ffffff',
            letterSpacing: '0.05em'
          }}
        >
          POPULAR
        </div>
      )}
      <h3
        className="text-xl mb-2"
        style={{ color: isDark ? '#f8fafc' : '#1f2937', fontWeight: '400' }}
      >
        {tier}
      </h3>
      {subtitle && (
        <p
          className="text-xs font-light mb-4"
          style={{ color: isDark ? '#6b7280' : '#9ca3af', lineHeight: '1.5' }}
        >
          {subtitle}
        </p>
      )}
      <div className="mb-6">
        <span
          className="text-4xl font-light"
          style={{ color: isDark ? '#f8fafc' : '#1f2937' }}
        >
          {price}
        </span>
        <span
          className="text-sm font-light"
          style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
        >
          {period}
        </span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li
            key={i}
            className="text-sm font-light flex items-start gap-2"
            style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className="w-full py-3 rounded-lg transition-all duration-200"
        style={{
          background: popular ? '#2563eb' : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
          color: popular ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280'),
          border: popular ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'),
          fontWeight: '400',
          fontSize: '0.95rem'
        }}
      >
        {popular ? 'Start Free Trial' : 'Learn More'}
      </button>
    </div>
  )
}

function TestimonialCard({ quote, role, isDark }: {
  quote: string;
  role: string;
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
      <p
        className="text-base font-light mb-6 italic"
        style={{
          color: isDark ? '#cbd5e1' : '#4b5563',
          lineHeight: '1.8'
        }}
      >
        "{quote}"
      </p>
      <div
        className="text-sm font-light"
        style={{
          color: isDark ? '#6b7280' : '#9ca3af'
        }}
      >
        {role}
      </div>
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
