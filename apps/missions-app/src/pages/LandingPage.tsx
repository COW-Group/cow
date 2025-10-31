import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, BarChart3, Shield, Building, Rocket, TrendingUp, Globe, CheckCircle, Star, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { supabase } from '@cow/supabase-client';
import { COWHeroBackground } from '../components/background/COWBackground';
import { ThemeToggle } from '../components/theme/ThemeToggle';
import cowLogo from '../assets/cow-logo.png';

export function LandingPage() {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', company: '' });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Mission execution capabilities for COW companies
  const capabilities = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Strategic Mission Execution',
      description: 'Orchestrate complex multi-company initiatives across tokenized verticals with precision planning and real-time coordination.'
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: 'Vertical Integration',
      description: 'Seamlessly coordinate between real estate, commodities, technology, and financial services divisions.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Tokenized Program Management',
      description: 'Specialized workflows for managing tokenized asset programs, compliance tracking, and investor relations.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Cross-Company Collaboration',
      description: 'Enable seamless collaboration between portfolio companies, subsidiaries, and strategic partners.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Enterprise Analytics',
      description: 'Comprehensive insights across all COW entities with performance tracking and predictive analytics.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Institutional-Grade Security',
      description: 'Bank-level security protocols designed for handling sensitive financial and tokenization data.'
    }
  ];

  // Success metrics for COW ecosystem
  const successMetrics = [
    { number: "12+", label: "Portfolio Companies", sublabel: "Unified mission execution" },
    { number: "$2.3B+", label: "Assets Under Management", sublabel: "Coordinated through Missions" },
    { number: "50+", label: "Active Programs", sublabel: "Tokenized asset initiatives" },
    { number: "99.9%", label: "Mission Success Rate", sublabel: "Enterprise-grade reliability" }
  ];

  // COW ecosystem testimonials
  const testimonials = [
    {
      name: 'Marcus Thompson',
      role: 'Chief Operating Officer, COW Real Estate',
      content: 'Missions streamlined our tokenization rollout across 15 properties. Mission execution time reduced by 60%.',
      avatar: '🏢'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Strategy, COW Commodities',
      content: 'The cross-vertical coordination capabilities are game-changing. We can now orchestrate complex multi-company initiatives seamlessly.',
      avatar: '⚡'
    },
    {
      name: 'David Rodriguez',
      role: 'Portfolio Manager, COW Financial Services',
      content: 'Enterprise-grade mission management that actually understands our tokenized asset workflows. Exceptional platform.',
      avatar: '💼'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email.trim() || !loginData.password.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Modal Login: Attempting sign in...', loginData.email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        console.error('❌ Modal Login: Error', error);
        throw error;
      }

      if (data.session) {
        console.log('✅ Modal Login: Success! Redirecting...');
        setShowLoginModal(false);

        // Small delay to let auth state settle before navigating
        setTimeout(() => {
          navigate('/app/my-office');
        }, 100);
      }
    } catch (err: any) {
      console.error('❌ Modal Login: Failed', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
    // Note: Don't set isLoading to false on success - let the navigation happen
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.email.trim() || !signUpData.password.trim() || !signUpData.name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Modal Signup: Attempting sign up...', signUpData.email);

      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.name,
            company: signUpData.company,
          }
        }
      });

      if (error) {
        console.error('❌ Modal Signup: Error', error);
        throw error;
      }

      if (data.user) {
        console.log('✅ Modal Signup: Success!', data.user.id);

        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          setError('This email is already registered. Please sign in instead.');
        } else if (data.session) {
          // User is auto-confirmed, redirect to app
          setShowSignUpModal(false);
          navigate('/app/my-office');
        } else {
          // Email confirmation required
          setError(null);
          alert('Success! Please check your email for a confirmation link.');
          setShowSignUpModal(false);
        }
      }
    } catch (err: any) {
      console.error('❌ Modal Signup: Failed', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // For demo, just navigate without auth
    navigate('/app/my-office');
  };

  return (
    <div className="min-h-screen text-gray-900">
      {/* Navigation - Liquid Glass Style */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div
          className="px-8 py-4 flex items-center gap-8 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(25px) saturate(180%)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={cowLogo}
              alt="COW Communications"
              className="h-8 w-auto"
            />
            <span
              className="text-xl font-light tracking-tight"
              style={{
                color: '#00A5CF',
                letterSpacing: '0.02em',
                fontWeight: '300'
              }}
            >
              Aperture
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px',
                color: '#374151'
              }}
              onClick={() => setShowLoginModal(true)}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-700 dark:text-gray-300 transition-all duration-300"
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.01em',
                padding: '8px 16px',
                color: '#374151'
              }}
              onClick={handleDemoLogin}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Refined & Sophisticated */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <COWHeroBackground />

        {/* Content with Motion */}
        <div className="relative z-10 max-w-6xl mx-auto px-8" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-16"
          >
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl font-light mb-8 tracking-tight"
              style={{
                color: 'var(--text-primary)',
                lineHeight: '1.1',
                fontWeight: '200',
                letterSpacing: '-0.02em'
              }}
            >
              Aperture
            </h1>
            <p
              className="text-2xl sm:text-3xl lg:text-4xl font-light max-w-4xl"
              style={{
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                fontWeight: '300',
                letterSpacing: '-0.01em'
              }}
            >
              Intelligent workspace that adjusts to your context. Same work. Different views.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              className="px-6 py-3 transition-all duration-200"
              style={{
                background: '#2563eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: '#ffffff',
                border: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onClick={() => setShowSignUpModal(true)}
            >
              Get started
            </button>

            <button
              className="px-6 py-3 transition-all duration-200"
              style={{
                background: 'transparent',
                border: '1px solid var(--text-tertiary)',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--text-tertiary)';
              }}
              onClick={handleDemoLogin}
            >
              View demo
            </button>

            <a
              href="#research"
              className="px-4 py-3 text-sm font-light transition-opacity duration-200"
              style={{
                color: 'var(--text-secondary)',
                letterSpacing: '0.01em',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Read the research →
            </a>
          </motion.div>
        </div>
      </section>

      {/* What is Aperture Section */}
      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-4 py-2 text-xs font-light tracking-widest uppercase"
              style={{
                color: 'var(--text-tertiary)',
                letterSpacing: '0.15em'
              }}
            >
              What is Aperture
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-20">
            <h2
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0',
                color: 'var(--text-primary)'
              }}
            >
              One Workspace, Infinite Views
            </h2>
          </div>

          {/* Body Copy */}
          <div className="max-w-4xl mx-auto mb-20 space-y-8">
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.8',
                color: 'var(--text-secondary)'
              }}
            >
              Your work shifts between contexts constantly. Managing investor relationships. Coordinating product launches. Tracking compliance requirements. Each needs a different view of the same information.
            </p>
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.8',
                color: 'var(--text-secondary)'
              }}
            >
              Aperture gives you complete control. Build the exact view your work needs—customize columns, layouts, automation, and workflows. The AI learns your patterns and suggests adjustments as your context shifts.
            </p>
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.8',
                color: 'var(--text-secondary)'
              }}
            >
              Not preset modes. Not rigid templates. Your workspace, shaped by you, enhanced by intelligence.
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Fully Customizable
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Build any workspace structure—tables, boards, timelines, calendars. Add fields, create automations, design workflows exactly how you work.
              </p>
            </div>

            <div className="text-center">
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Context-Aware AI
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Intelligence that learns from your patterns. Suggests relevant views, surfaces important information, adapts to how you actually use the workspace.
              </p>
            </div>

            <div className="text-center">
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Seamless Transitions
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Move between views without losing context. Same data, different perspectives. Switch from high-level strategy to granular execution instantly.
              </p>
            </div>

            <div className="text-center">
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Complete Integration
              </h3>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Connects across your entire workflow—wealth tracking, community engagement, tokenization. One workspace, unified visibility.
              </p>
            </div>
          </div>

          {/* Earth Horizon Divider */}
          <div
            className="mt-32"
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent 0%, #9B8B7E 50%, transparent 100%)',
              margin: '80px auto 0 auto'
            }}
          />
        </div>
      </section>

      {/* How Aperture Works Section */}
      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-4 py-2 text-xs font-light tracking-widest uppercase"
              style={{
                color: 'var(--text-tertiary)',
                letterSpacing: '0.15em'
              }}
            >
              How Aperture Works
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-16">
            <h2
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0',
                color: 'var(--text-primary)'
              }}
            >
              Three Settings, Infinite Context
            </h2>
          </div>

          {/* Body Copy */}
          <div className="max-w-4xl mx-auto mb-20 text-center">
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.8',
                color: 'var(--text-secondary)'
              }}
            >
              Like a camera lens adjusting depth of field, Aperture shifts between three fundamental perspectives. Wide aperture reveals strategic context. Medium aperture shows tactical coordination. Narrow aperture exposes granular details. The intelligence determines which view serves your current work.
            </p>
          </div>

          {/* Three Aperture Settings Grid */}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Wide Aperture - f/1.4 */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="mb-6">
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '100',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                  }}
                >
                  f/1.4
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                    color: 'var(--text-primary)',
                    marginTop: '8px'
                  }}
                >
                  Wide Aperture
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    color: '#00A5CF',
                    marginTop: '4px'
                  }}
                >
                  Strategic Context
                </div>
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)'
                }}
              >
                See the entire landscape. Strategic relationships, portfolio health, organizational structure. Background blurs—what matters is the big picture, patterns across time, connections between entities.
              </p>
            </div>

            {/* Medium Aperture - f/8 */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="mb-6">
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '100',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                  }}
                >
                  f/8
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                    color: 'var(--text-primary)',
                    marginTop: '8px'
                  }}
                >
                  Medium Aperture
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    color: '#00A5CF',
                    marginTop: '4px'
                  }}
                >
                  Tactical Coordination
                </div>
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)'
                }}
              >
                Balance context and detail. Project timelines, team coordination, workflow dependencies. Everything in reasonable focus—you see how pieces connect without drowning in minutiae.
              </p>
            </div>

            {/* Narrow Aperture - f/16 */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="mb-6">
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '100',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)'
                  }}
                >
                  f/16
                </div>
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                    color: 'var(--text-primary)',
                    marginTop: '8px'
                  }}
                >
                  Narrow Aperture
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                    color: '#00A5CF',
                    marginTop: '4px'
                  }}
                >
                  Detail Execution
                </div>
              </div>
              <p
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.7',
                  color: 'var(--text-secondary)'
                }}
              >
                Maximum depth of field. Compliance requirements, contract terms, technical specifications. Everything sharp, everything visible. When precision matters more than context.
              </p>
            </div>
          </div>

          {/* Earth Horizon Divider */}
          <div
            className="mt-32"
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent 0%, #9B8B7E 50%, transparent 100%)',
              margin: '80px auto 0 auto'
            }}
          />
        </div>
      </section>

      {/* Available Views Section */}
      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Label */}
          <div className="text-center mb-12">
            <div
              className="inline-block px-4 py-2 text-xs font-light tracking-widest uppercase"
              style={{
                color: 'var(--text-tertiary)',
                letterSpacing: '0.15em'
              }}
            >
              Available Views
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-16">
            <h2
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0',
                color: 'var(--text-primary)'
              }}
            >
              Eight Lenses, One Workspace
            </h2>
          </div>

          {/* Body Copy */}
          <div className="max-w-4xl mx-auto mb-20 text-center">
            <p
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.8',
                color: 'var(--text-secondary)'
              }}
            >
              Each view reveals different aspects of the same underlying work. Switch between perspectives as your context shifts throughout the day.
            </p>
          </div>

          {/* 8 Views Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Customer Relations */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Customer Relations
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                CRM view for managing relationships, tracking interactions, monitoring account health
              </p>
            </div>

            {/* Project Coordination */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Project Coordination
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Kanban boards, timelines, dependencies, resource allocation across deliverables
              </p>
            </div>

            {/* Compliance Tracking */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Compliance Tracking
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Regulatory requirements, audit trails, governance frameworks, documentation status
              </p>
            </div>

            {/* Content Production */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Content Production
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Editorial calendars, content workflows, publishing pipelines, asset management
              </p>
            </div>

            {/* Sales Pipeline */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Sales Pipeline
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Deal stages, forecasting, opportunity tracking, conversion metrics
              </p>
            </div>

            {/* Team Collaboration */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Team Collaboration
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Team structure, workload distribution, communication channels, capacity planning
              </p>
            </div>

            {/* Token Governance */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Token Governance
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Tokenized assets, stakeholder voting, distribution mechanisms, smart contract status
              </p>
            </div>

            {/* Analytics */}
            <div
              className="p-6 rounded-lg"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em',
                  color: 'var(--text-primary)'
                }}
              >
                Analytics
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '300',
                  letterSpacing: '0.005em',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)'
                }}
              >
                Performance metrics, trend analysis, predictive insights, strategic intelligence
              </p>
            </div>
          </div>

          {/* Earth Horizon Divider */}
          <div
            className="mt-32"
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent 0%, #9B8B7E 50%, transparent 100%)',
              margin: '80px auto 0 auto'
            }}
          />
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="relative py-40 px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--cyan-deep) 0%, var(--button-blue) 100%)' }}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Section Label */}
          <div className="mb-12">
            <div
              className="inline-block px-4 py-2 text-xs font-light tracking-widest uppercase"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.15em'
              }}
            >
              Early Access
            </div>
          </div>

          <h2
            className="text-white mb-8"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '200',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            Request Access
          </h2>
          <p
            className="text-white/90 mb-16 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              fontWeight: '300',
              letterSpacing: '0.005em',
              lineHeight: '1.6',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Aperture is in active development. Choose your access level based on your current needs and organizational readiness.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Research Access */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="text-white mb-4"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Research Access
              </h3>
              <p
                className="text-white/80 mb-6"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}
              >
                Review technical documentation, architecture decisions, and research findings. For teams evaluating workspace intelligence systems.
              </p>
              <button
                className="w-full px-6 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '400'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onClick={() => setShowSignUpModal(true)}
              >
                Request Research Access
              </button>
            </div>

            {/* Beta Access */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                transform: 'scale(1.05)'
              }}
            >
              <div
                className="mb-4"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  color: '#00A5CF',
                  textTransform: 'uppercase'
                }}
              >
                Recommended
              </div>
              <h3
                className="text-white mb-4"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Beta Access
              </h3>
              <p
                className="text-white/80 mb-6"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}
              >
                Use Aperture for real work with your team. Shape development through feedback. Limited availability for organizations ready to test adaptive workspace intelligence.
              </p>
              <button
                className="w-full px-6 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 1)',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => setShowSignUpModal(true)}
              >
                Request Beta Access
              </button>
            </div>

            {/* Implementation Partnership */}
            <div
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3
                className="text-white mb-4"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  letterSpacing: '0.01em'
                }}
              >
                Implementation Partnership
              </h3>
              <p
                className="text-white/80 mb-6"
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '300',
                  lineHeight: '1.6'
                }}
              >
                Custom deployment, dedicated support, and collaborative feature development. For organizations with specific workspace intelligence requirements.
              </p>
              <button
                className="w-full px-6 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '400'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onClick={() => setShowLoginModal(true)}
              >
                Discuss Partnership
              </button>
            </div>
          </div>

          <p
            className="text-white/70"
            style={{
              fontSize: '0.875rem',
              fontWeight: '300'
            }}
          >
            All access requests reviewed within 48 hours
          </p>
        </div>
      </section>

      {/* Footer - Minimalist */}
      <footer className="py-20" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <img
                src={cowLogo}
                alt="COW Communications"
                className="h-6 w-auto"
              />
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '300',
                  letterSpacing: '0.02em',
                  color: 'var(--text-secondary)'
                }}
              >
                Missions
              </div>
            </div>
            <p
              className="mb-8 max-w-md mx-auto"
              style={{
                fontSize: '0.95rem',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.6',
                color: 'var(--text-secondary)'
              }}
            >
              Enterprise mission management platform for the Cycles of Wealth ecosystem.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <a
                href="#"
                className="transition-colors"
                style={{
                  letterSpacing: '0.005em',
                  color: 'var(--text-muted)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="transition-colors"
                style={{
                  letterSpacing: '0.005em',
                  color: 'var(--text-muted)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="transition-colors"
                style={{
                  letterSpacing: '0.005em',
                  color: 'var(--text-muted)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                Enterprise Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="Welcome back"
        >
          {error && (
            <div
              className="mx-6 mt-4 p-3 rounded-lg text-sm font-light"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="#"
                className="text-sm font-light transition-colors"
                style={{ color: 'var(--cyan-bright)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Forgot password?
              </a>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLoginModal(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{
                    background: 'var(--button-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--button-hover)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--button-blue)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </div>
          </form>

          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <button
              onClick={handleDemoLogin}
              className="w-full px-6 py-3 rounded-lg font-light transition-all duration-200"
              style={{
                backgroundColor: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                color: 'var(--cyan-bright)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.08)';
              }}
            >
              Continue as Demo User
            </button>
            <p className="mt-4 text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
              New to Missions?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignUpModal(true);
                }}
                className="font-medium transition-colors"
                style={{ color: 'var(--cyan-bright)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Create an account
              </button>
            </p>
          </div>
        </Modal>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <Modal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          title="Begin your journey"
        >
          {error && (
            <div
              className="mx-6 mt-4 p-3 rounded-lg text-sm font-light"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Work Email
              </label>
              <input
                type="email"
                id="signup-email"
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="your@company.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Company <span style={{ color: 'var(--text-muted)', fontWeight: '300' }}>(optional)</span>
              </label>
              <input
                type="text"
                id="company"
                value={signUpData.company}
                onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Your company"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg font-light transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-bright)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                className="mt-1"
                style={{ accentColor: 'var(--cyan-bright)' }}
                required
              />
              <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
                I agree to the{' '}
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: 'var(--cyan-bright)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Terms of Service
                </a>
                {' '}and{' '}
                <a
                  href="#"
                  className="transition-colors"
                  style={{ color: 'var(--cyan-bright)' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowSignUpModal(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
                style={{
                  background: 'var(--button-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = 'var(--button-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--button-blue)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: '1px solid var(--border-color)' }}
          >
            <p className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowSignUpModal(false);
                  setShowLoginModal(true);
                }}
                className="font-medium transition-colors"
                style={{ color: 'var(--cyan-bright)' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Sign in
              </button>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}