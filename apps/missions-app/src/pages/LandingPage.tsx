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

      {/* Hero Section - COW Sumi-e Sky + Earth */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <COWHeroBackground />

        {/* Content with Motion */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-8" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-8"
          >
            <div
              className="px-6 py-2 rounded-full text-sm font-light tracking-wide"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-secondary)'
              }}
            >
              INTELLIGENT WORKSPACE
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight" style={{ color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Adjust Your View<br />
              See What Matters
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-16"
            style={{ maxWidth: '800px' }}
          >
            <p className="text-lg sm:text-xl font-light leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Different work needs different views. Aperture adjusts your workspace to match your context—CRM when managing relationships, compliance when tracking governance, project boards when coordinating delivery. Same work. Different apertures. All revealing what you need to see now.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {/* Explore Aperture - Primary CTA */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: '#2563eb',
                border: '1px solid #0ea5e9',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                letterSpacing: '0.01em',
                color: '#ffffff',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.3), 0 1px 4px rgba(37, 99, 235, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4), 0 2px 8px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3), 0 1px 4px rgba(37, 99, 235, 0.2)';
              }}
              onClick={() => setShowSignUpModal(true)}
            >
              <span className="relative flex items-center gap-2">
                Explore Aperture
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* See How It Works - Secondary CTA */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid #00A5CF',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00A5CF';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={handleDemoLogin}
            >
              <span className="relative flex items-center gap-2">
                See How It Works
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              </span>
            </button>

            {/* Research Paper - Text Link */}
            <a
              href="#research"
              className="text-sm font-light transition-all duration-200"
              style={{
                color: '#00A5CF',
                letterSpacing: '0.01em',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Research Paper
            </a>
          </motion.div>

          {/* Earth Horizon Divider */}
          <div
            className="mt-20"
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent 0%, #9B8B7E 50%, transparent 100%)',
              margin: '80px auto 0 auto'
            }}
          />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <span className="text-sm font-light mb-2">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
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
              One Workspace, Every View
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
              Aperture adjusts focus automatically. When you're in investor relations, you see CRM. When you're coordinating delivery, you see project boards. When you're tracking governance, you see compliance frameworks. The intelligence recognizes your context and adjusts the aperture.
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
              Think of it like a camera: wide aperture shows strategic context, narrow aperture shows tactical details. Both views are accurate. Both are necessary. Aperture lets you shift between them without losing sight of the whole picture.
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
                Adaptive Views
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
                CRM, Projects, Compliance, Content, Sales
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
                Context Recognition
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
                AI understands what you're working on
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
                Seamless Switching
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
                Move between views without losing context
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
                Unified Data
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
                Same information, different lenses
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

      {/* COW Ecosystem Impact */}
      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.04em',
                lineHeight: '0.9',
                color: 'var(--text-primary)'
              }}
            >
              Transforming mission execution
              <br />
              <span
                style={{
                  fontWeight: '200',
                  color: 'var(--text-secondary)'
                }}
              >
                across the Cycles of Wealth
                <br />
                ecosystem architecture.
              </span>
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-4 gap-16">
            {[
              { number: '347%', label: 'Faster mission\ncompletion rates' },
              { number: '12+', label: 'Portfolio companies\nintegrated seamlessly' },
              { number: '$2.3B+', label: 'In coordinated\nasset management' },
              { number: '99.9%', label: 'Enterprise-grade\nreliability metrics' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  style={{
                    fontSize: '3rem',
                    fontWeight: '100',
                    letterSpacing: '-0.02em',
                    lineHeight: '1',
                    color: 'var(--text-primary)'
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                    whiteSpace: 'pre-line',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Stories - Ultra Minimal */}
      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="mb-12"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0',
                color: 'var(--text-primary)'
              }}
            >
              Trusted by Leading Organizations
            </h2>
            <p
              className="max-w-2xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                fontWeight: '200',
                letterSpacing: '0.005em',
                lineHeight: '1.4',
                color: 'var(--text-secondary)'
              }}
            >
              Cycles of Wealth ecosystem leaders share their mission execution results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="mb-8">
                  <div
                    className="text-6xl mb-6"
                    style={{
                      filter: 'grayscale(0.3) opacity(0.8)'
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                </div>
                <blockquote
                  className="mb-8"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '300',
                    letterSpacing: '0.005em',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    color: 'var(--text-primary)'
                  }}
                >
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div
                    className="mb-1"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      letterSpacing: '0.01em',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '300',
                      letterSpacing: '0.005em',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise CTA - Institutional Grade */}
      <section className="relative py-40 px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--cyan-deep) 0%, var(--button-blue) 100%)' }}>
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            Begin Your Journey
          </h2>
          <p
            className="text-white/90 mb-12 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              fontWeight: '300',
              letterSpacing: '0.005em',
              lineHeight: '1.5',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Join the Cycles of Wealth ecosystem in revolutionizing enterprise mission management
            and tokenized program coordination.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Primary Enterprise CTA */}
            <button
              className="group relative px-10 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '500',
                letterSpacing: '0.01em',
                color: '#1f2937',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)';
              }}
              onClick={() => setShowSignUpModal(true)}
            >
              <span className="relative flex items-center gap-3">
                Begin Enterprise Mission Management
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              className="group relative px-10 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => setShowLoginModal(true)}
            >
              <span className="relative flex items-center gap-3">
                Schedule Strategic Consultation
                <TrendingUp className="w-5 h-5 transition-transform group-hover:scale-110" />
              </span>
            </button>
          </div>
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