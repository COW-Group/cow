import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, BarChart3, Shield, Building, Rocket, TrendingUp, Globe, CheckCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { supabase } from '@cow/supabase-client';

// Hero Background Component (similar to products-site)
function MissionsHeroBackground() {
  const elementRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      try {
        if (typeof window === "undefined") return;

        // Load Three.js if not already loaded
        if (!(window as any).THREE) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
            script.onload = () => {
              console.log("Three.js loaded successfully.");
              resolve();
            };
            script.onerror = () => reject(new Error("Failed to load Three.js"));
            document.head.appendChild(script);
          });
        }

        // Load Vanta.js
        if (!(window as any).VANTA) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js";
            script.onload = () => {
              console.log("Vanta.js loaded successfully.");
              resolve();
            };
            script.onerror = () => reject(new Error("Failed to load Vanta.js"));
            document.head.appendChild(script);
          });
        }

        // Mission-focused color scheme - corporate blues and golds
        const getMissionSettings = () => ({
          backgroundColor: 0x1e40af,  // Deep blue
          skyColor: 0x3b82f6,         // Bright blue
          cloudShadowColor: 0x1e293b, // Dark slate
          sunColor: 0xfbbf24,         // Amber/gold
          speed: 0.4,
          sunlightColor: 0xfef3c7     // Light amber
        });

        if (mounted && elementRef.current && (window as any).VANTA?.CLOUDS) {
          const settings = getMissionSettings();
          vantaRef.current = (window as any).VANTA.CLOUDS({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            ...settings
          });
          console.log("Vanta.js CLOUDS effect initialized with mission settings:", settings);
        }
      } catch (error) {
        console.warn("Vanta.js failed to load, using fallback:", error);
        if (mounted) {
          setFallback(true);
        }
      }
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaRef.current?.destroy) {
        try {
          vantaRef.current.destroy();
          console.log("Vanta effect destroyed.");
        } catch (error) {
          console.warn("Error destroying Vanta effect:", error);
        }
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${fallback ? "missions-fallback" : ""}`}
      style={
        fallback
          ? {
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #1e40af 100%)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 15s ease infinite",
            }
          : undefined
      }
    />
  );
}

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
        navigate('/app/my-office');
      }
    } catch (err: any) {
      console.error('❌ Modal Login: Failed', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <div
            className="text-xl font-light tracking-tight flex items-center gap-2"
            style={{
              color: '#1f2937',
              letterSpacing: '0.02em',
              fontWeight: '300'
            }}
          >
            <Rocket className="h-5 w-5" />
            Missions
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-700 transition-all duration-300"
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
              className="rounded-full text-gray-700 transition-all duration-300"
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

      {/* Hero Section - Apple Engineering Precision */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <MissionsHeroBackground />

        {/* Content Architecture */}
        <div className="relative z-10 text-center max-w-7xl mx-auto px-8">
          {/* Apple Typography Engineering */}
          <h1
            className="mb-12 text-white"
            style={{
              fontSize: 'clamp(4.5rem, 9vw, 9.5rem)',
              fontWeight: '200',
              letterSpacing: '-0.025em',
              lineHeight: '0.82',
              marginBottom: '3rem',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Mission Execution
          </h1>

          {/* Simplified Product Description */}
          <div className="max-w-4xl mx-auto mb-16">
            <p
              className="text-white"
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: '300',
                letterSpacing: '0.01em',
                lineHeight: '1.4',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)'
              }}
            >
              Enterprise mission management platform designed for Cycles of Wealth companies, verticals, and tokenized programs.
            </p>

            {/* Category Creator Data Points */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
              {successMetrics.map((metric, index) => (
                <React.Fragment key={metric.label}>
                  <div className="text-center">
                    <div className="text-2xl font-light" style={{ letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                      {metric.number}
                    </div>
                    <div className="text-sm text-white/70" style={{ letterSpacing: '0.01em' }}>
                      {metric.label}
                    </div>
                  </div>
                  {index < successMetrics.length - 1 && (
                    <div className="w-px h-8 bg-white/20"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Institutional CTA Framework */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16 max-w-4xl mx-auto">
            {/* Access Mission Platform */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                letterSpacing: '0.01em',
                color: '#1f2937',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)';
              }}
              onClick={() => setShowSignUpModal(true)}
            >
              <span className="relative flex items-center gap-2">
                Access Mission Platform
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* Schedule Enterprise Demo */}
            <button
              className="group relative px-8 py-4 font-medium transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '400',
                letterSpacing: '0.01em',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={handleDemoLogin}
            >
              <span className="relative flex items-center gap-2">
                Schedule Enterprise Demo
                <Globe className="w-4 h-4 transition-transform group-hover:rotate-12" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Mission Execution Architecture - Apple Minimalism */}
      <section className="py-40 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-32">
            <h2
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0'
              }}
            >
              Enterprise Mission Architecture
            </h2>
            <p
              className="text-gray-500 max-w-3xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                fontWeight: '200',
                letterSpacing: '0.005em',
                lineHeight: '1.4'
              }}
            >
              Institutional-grade mission management designed specifically for Cycles of Wealth
              ecosystem coordination and tokenized program execution.
            </p>
          </div>

          {/* Ultra Clean Grid */}
          <div className="grid md:grid-cols-3 gap-16 mb-32 max-w-6xl mx-auto">
            {capabilities.map((capability, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 flex justify-center">
                  <div
                    className="p-4 rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.12)'
                    }}
                  >
                    <div className="text-blue-600">
                      {capability.icon}
                    </div>
                  </div>
                </div>
                <h3
                  className="text-gray-900 mb-4"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em'
                  }}
                >
                  {capability.title}
                </h3>
                <p
                  className="text-gray-500 leading-relaxed"
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: '300',
                    letterSpacing: '0.005em',
                    lineHeight: '1.6'
                  }}
                >
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COW Ecosystem Impact - Statistical Excellence */}
      <section className="py-40 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.04em',
                lineHeight: '0.9'
              }}
            >
              Transforming mission execution
              <br />
              <span
                style={{
                  fontWeight: '200',
                  color: '#374151'
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
                  className="text-gray-900 mb-3"
                  style={{
                    fontSize: '3rem',
                    fontWeight: '100',
                    letterSpacing: '-0.02em',
                    lineHeight: '1'
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-gray-500"
                  style={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    letterSpacing: '0.01em',
                    whiteSpace: 'pre-line'
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
      <section className="py-40 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2
              className="text-gray-900 mb-12"
              style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                fontWeight: '100',
                letterSpacing: '-0.025em',
                lineHeight: '1.0'
              }}
            >
              Trusted by Leading Organizations
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                fontWeight: '200',
                letterSpacing: '0.005em',
                lineHeight: '1.4'
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
                  className="text-gray-700 mb-8"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '300',
                    letterSpacing: '0.005em',
                    lineHeight: '1.6',
                    fontStyle: 'italic'
                  }}
                >
                  "{testimonial.content}"
                </blockquote>
                <div>
                  <div
                    className="text-gray-900 mb-1"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    className="text-gray-500"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '300',
                      letterSpacing: '0.005em'
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
      <section className="relative py-40 px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }}>
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
            Ready to Transform Your Mission Execution?
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
      <footer className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Rocket className="h-6 w-6 text-gray-400" />
              <div
                className="text-gray-400"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '300',
                  letterSpacing: '0.02em'
                }}
              >
                Missions
              </div>
            </div>
            <p
              className="text-gray-500 mb-8 max-w-md mx-auto"
              style={{
                fontSize: '0.95rem',
                fontWeight: '300',
                letterSpacing: '0.005em',
                lineHeight: '1.6'
              }}
            >
              Enterprise mission management platform for the Cycles of Wealth ecosystem.
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors" style={{ letterSpacing: '0.005em' }}>
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors" style={{ letterSpacing: '0.005em' }}>
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors" style={{ letterSpacing: '0.005em' }}>
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
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
                <div className="flex gap-2">
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                Continue as Demo User
              </Button>
              <p className="mt-3 text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowSignUpModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <Modal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          title="Create your account"
        >
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={signUpData.company}
                  onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 mr-2" required />
                <p className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowSignUpModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}