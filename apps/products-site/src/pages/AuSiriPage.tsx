import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useCart } from "../contexts/cart-context";
import { ResearchNavigation } from "../components/research-navigation";
import { ArrowRight, TrendingUp, Shield, Zap, ChevronDown, Coins, RefreshCcw } from "lucide-react";

export default function AuSiriPage() {
  const { addToCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleAddToCart = (amount: number) => {
    addToCart({
      id: `ausiri-${Date.now()}`,
      name: `AuSIRI Token (${amount.toLocaleString()})`,
      description: "Gold-backed self-optimizing investment with retail cycle intelligence",
      price: amount,
      link: "/ausiri",
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: 'var(--mode-bg)' }}>
      <style>{`
        :root {
          --mode-bg: #F5F3F0; /* Rice Paper - warm, inviting */
        }
        .dark {
          --mode-bg: #0a1628; /* Navy Deep - family's favorite! */
        }
      `}</style>

      {/* Research Navigation */}
      <ResearchNavigation />

      {/* Hero Section with Sumi-e Sky + Earth Background */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Background gradient layer - Light mode: clean white for text contrast */}
        <div className="absolute inset-0" style={{
          background: '#ffffff'
        }} />
        <div className="absolute inset-0 dark:block hidden" style={{
          background: 'linear-gradient(to bottom, #0a1628 0%, #0f1d2e 50%, #0a1628 100%)'
        }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              {/* Gold vertical badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="text-xs font-medium px-4 py-2 rounded-full inline-block"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
                    letterSpacing: '0.02em'
                  }}
                >
                  FLAGSHIP GOLD VERTICAL
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight">
                Pioneering
                <br />
                <span style={{
                  background: 'linear-gradient(to right, #b45309 0%, #d97706 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '300'
                }}>
                  Self-Optimizing Gold
                </span>
              </h1>
              {/* Deep Cyan logo divider */}
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, transparent 0%, #b45309 50%, transparent 100%)',
                margin: '0 auto 2rem auto'
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Systematic research into{' '}
              <span style={{ color: '#b45309', fontWeight: '400' }}>retail cycle optimization</span>—discovering how{' '}
              <span className="text-emerald-600 font-normal">gold-backed tokenization</span> creates predictable wealth through margin compounding
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  size="lg"
                  className="text-white shadow-2xl border-0 px-8 py-6 text-lg font-light"
                  style={{
                    background: 'linear-gradient(to right, #b45309, #d97706)',
                    boxShadow: '0 25px 50px -12px rgba(180, 83, 9, 0.25)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
                  onClick={() => handleAddToCart(1000)}
                >
                  Join Waitlist
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </motion.div>
              <Link to="/ausiri-animation">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg font-light border-gray-200 dark:border-gray-700 hover:border-[#b45309] dark:hover:border-[#d97706] hover:text-[#b45309] dark:hover:text-[#d97706] transition-all duration-300"
                  >
                    Experience Animation
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-gray-400 dark:text-gray-500"
          >
            <span className="text-sm font-light mb-2">Explore</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Subtle Horizon Divider - Gold accent */}
      <div
        className="w-full"
        style={{
          height: '2px',
          background: 'linear-gradient(to right, transparent 0%, rgba(180, 83, 9, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* What is AuSIRI Section */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400"
                style={{
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                What is AuSIRI
              </h2>
              <h3
                className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
                style={{
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}
              >
                Gold-Backed Systematic Investment Return Initiative
              </h3>
              <p
                className="text-lg font-light text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Pioneering tokenized gold ownership with{' '}
                <span style={{ color: '#b45309', fontWeight: '400' }}>retail cycle optimization</span>—our flagship vertical exploring how fractional bullion transforms wealth accessibility through systematic margin compounding.
              </p>
              <p
                className="text-base font-light text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                style={{ letterSpacing: '0.01em' }}
              >
                Each AuSIRI token represents verifiable gold reserves held in audited vaults, while our proprietary algorithms analyze retail market cycles to optimize acquisition and compounding timing—creating predictable wealth generation from precious metal holdings.
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-light text-[#b45309] dark:text-[#f59e0b] mb-1">100%</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Gold Backed</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-emerald-600 dark:text-emerald-500 mb-1">15-25%</div>
                  <div className="text-sm font-light text-gray-600 dark:text-gray-400">Expected APY</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div
                className="w-full h-96 rounded-2xl flex items-center justify-center border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)',
                  borderColor: 'rgba(180, 83, 9, 0.2)'
                }}
              >
                <Coins className="h-32 w-32 text-[#b45309] dark:text-[#f59e0b]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-8" style={{ background: 'var(--mode-how-bg)' }}>
        <style>{`
          :root {
            --mode-how-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-how-bg: linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, transparent 100%);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2
              className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
              style={{
                letterSpacing: '-0.02em'
              }}
            >
              Charting New Territory in Gold Performance
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              style={{ letterSpacing: '0.01em' }}
            >
              Three systematic flows create compounding cycles—from gold acquisition through retail optimization to predictable returns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                }}
              >
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
                    fontWeight: '600'
                  }}
                >
                  1
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Verified Gold Reserves
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Token proceeds acquire physical gold held in audited vaults—creating verifiable 100% backing with transparent reserve reporting
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                }}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
                    fontWeight: '600'
                  }}
                >
                  2
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Retail Cycle Intelligence
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Proprietary algorithms analyze retail market cycles, optimizing acquisition timing and margin capture through systematic buying and selling strategies
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  boxShadow: '0 8px 16px rgba(180, 83, 9, 0.2)'
                }}
              >
                <RefreshCcw className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span
                  className="inline-block w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'rgba(180, 83, 9, 0.1)',
                    color: '#b45309',
                    fontWeight: '600'
                  }}
                >
                  3
                </span>
                <h3
                  className="mb-3 text-gray-900 dark:text-gray-100"
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  Systematic Compounding
                </h3>
              </div>
              <p
                className="text-gray-600 dark:text-gray-300"
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: '300',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                Generated margins acquire additional gold reserves, compounding directly into token value—creating predictable wealth growth from optimization cycles
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-32 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2
              className="text-lg font-light mb-4 text-gray-600 dark:text-gray-400"
              style={{
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              Flagship Vertical Features
            </h2>
            <h3
              className="text-4xl font-light text-gray-900 dark:text-gray-100"
              style={{ letterSpacing: '-0.02em' }}
            >
              Discovering Performance in Precious Metals
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Gold Backing",
                description: "Every token fully backed by physical gold in audited vaults—verifiable reserves with transparent reporting creating intrinsic value and stability"
              },
              {
                icon: RefreshCcw,
                title: "Margin Compounding",
                description: "Systematic optimization generates margins that acquire additional gold—compounding directly into token value through continuous wealth creation cycles"
              },
              {
                icon: TrendingUp,
                title: "Retail Cycle Optimization",
                description: "Proprietary algorithms analyze market cycles—optimizing acquisition timing for maximum margin capture and predictable wealth generation"
              },
              {
                icon: Zap,
                title: "Predictable Returns",
                description: "Systematic approach minimizes volatility—creating consistent 15-25% expected APY through disciplined retail cycle strategies"
              },
              {
                icon: Shield,
                title: "Transparent Auditing",
                description: "Regular third-party audits verify gold reserves—maintaining 100% backing ratio with published proof-of-reserves documentation"
              },
              {
                icon: Coins,
                title: "Fractional Ownership",
                description: "Tokenization enables accessible gold investment—minimum $1,000 threshold democratizing precious metal wealth building"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: 'rgba(180, 83, 9, 0.1)'
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-[#b45309] dark:text-[#f59e0b]" />
                    </div>
                    <CardTitle
                      className="text-xl font-light text-gray-900 dark:text-gray-100"
                      style={{
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm font-light text-gray-600 dark:text-gray-300"
                      style={{
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-32 px-8"
        style={{
          background: 'var(--mode-cta-bg)'
        }}
      >
        <style>{`
          :root {
            --mode-cta-bg: linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(180, 83, 9, 0.1));
          }
          .dark {
            --mode-cta-bg: linear-gradient(to bottom, rgba(180, 83, 9, 0.08), rgba(217, 119, 6, 0.08));
          }
        `}</style>
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-light mb-6 text-gray-900 dark:text-gray-100"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Join the AuSIRI Waitlist
          </h2>
          <p
            className="text-lg font-light mb-12 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            style={{
              letterSpacing: '0.01em',
              lineHeight: '1.7'
            }}
          >
            Be among the first to experience systematic gold optimization—pioneering tokenized precious metals with retail cycle intelligence
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="text-white px-10 py-7 text-lg font-medium"
              style={{
                background: 'linear-gradient(to right, #b45309, #d97706)',
                boxShadow: '0 8px 24px rgba(180, 83, 9, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #92400e, #b45309)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #d97706)'}
              onClick={() => handleAddToCart(1000)}
            >
              Join Waitlist ($1,000)
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-7 text-lg font-light border-[#b45309] dark:border-[#d97706] text-[#b45309] dark:text-[#d97706] hover:bg-[#b45309]/10 dark:hover:bg-[#d97706]/10"
              onClick={() => handleAddToCart(5000)}
            >
              Premium Entry ($5,000)
            </Button>
          </div>

          <p
            className="text-sm font-light mt-8 text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.01em'
            }}
          >
            Minimum investment: $1,000 • Expected launch: Q2 2025
          </p>
        </div>
      </section>

      {/* Footer - Sumi-e Grounding */}
      <footer
        className="py-12 px-8"
        style={{
          background: 'var(--mode-footer-bg)',
          borderTop: '2px solid var(--mode-footer-border)'
        }}
      >
        <style>{`
          :root {
            --mode-footer-bg: linear-gradient(to bottom, rgba(155, 139, 126, 0.15) 0%, rgba(155, 139, 126, 0.25) 100%);
            --mode-footer-border: rgba(155, 139, 126, 0.35);
          }
          .dark {
            --mode-footer-bg: rgba(180, 83, 9, 0.05);
            --mode-footer-border: rgba(180, 83, 9, 0.2);
          }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-sm font-light text-gray-700 dark:text-gray-300"
            style={{
              letterSpacing: '0.01em'
            }}
          >
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
