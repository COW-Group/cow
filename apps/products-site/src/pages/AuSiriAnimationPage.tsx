import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/cart-context";
import { useAuthContext } from "../lib/auth-context";
import { useWeb3 } from "../contexts/web3-context";
import { ProductMenu } from "../components/product-menu";
import { CartDropdown } from "../components/cart-dropdown";
import { AuthModal } from "../components/auth-modal";
import { ArrowLeft, Coins, TrendingUp, RefreshCcw, DollarSign, Shield } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Note: MorphSVG and DrawSVG are premium plugins, using alternative techniques

export default function AuSiriAnimationPage() {
  const { addToCart } = useCart();
  const { auth, signOut } = useAuthContext();
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Refs for animation targets
  const heroRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const mathSectionRef = useRef<HTMLDivElement>(null);
  const cyclesSectionRef = useRef<HTMLDivElement>(null);
  const growthSectionRef = useRef<HTMLDivElement>(null);
  const blockchainSectionRef = useRef<HTMLDivElement>(null);
  const moatSectionRef = useRef<HTMLDivElement>(null);
  const verticalsSectionRef = useRef<HTMLDivElement>(null);

  // Animation state
  const [currentSection, setCurrentSection] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAddToCart = (amount: number) => {
    addToCart({
      id: `ausiri-${Date.now()}`,
      name: `AuSIRI Token (${amount.toLocaleString()})`,
      description: "Pure gold-backed compounding token",
      price: amount,
      link: "/ausiri",
    });
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err: any) {
      alert(`Failed to connect wallet: ${err.message}`);
    }
  };

  const handleDisconnectWallet = () => {
    try {
      disconnectWallet();
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

  useEffect(() => {
    // Hero section animation with enhanced effects
    if (heroRef.current) {
      const tl = gsap.timeline();

      // Enhanced particles with gold-like behavior
      const createParticles = () => {
        const container = heroRef.current?.querySelector('.particles-container');
        if (!container) return;

        // Golden particles that float and shimmer
        for (let i = 0; i < 80; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 6 + 2;
          particle.className = 'particle absolute rounded-full';
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.background = `radial-gradient(circle, rgba(251, 191, 36, ${Math.random() * 0.8 + 0.2}) 0%, rgba(245, 158, 11, 0) 70%)`;
          particle.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(251, 191, 36, 0.5)';
          container.appendChild(particle);

          // Complex particle animation with rotation and scaling
          gsap.set(particle, { rotation: Math.random() * 360 });
          gsap.to(particle, {
            y: -window.innerHeight * 0.3,
            x: (Math.random() - 0.5) * 200,
            rotation: "+=" + (Math.random() * 360 + 180),
            scale: Math.random() * 0.5 + 0.5,
            opacity: 0,
            duration: Math.random() * 4 + 3,
            repeat: -1,
            delay: Math.random() * 3,
            ease: "power2.out"
          });

          // Shimmer effect
          gsap.to(particle, {
            opacity: Math.random() * 0.8 + 0.2,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      };

      // Title animation with text reveal effect
      gsap.set(".hero-title", {
        backgroundPosition: "-200% 0",
        backgroundImage: "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.8), transparent)",
        backgroundSize: "200% 100%"
      });

      tl.from(".hero-title", {
          duration: 1.5,
          y: 150,
          opacity: 0,
          scale: 0.8,
          ease: "back.out(1.7)"
        })
        .to(".hero-title", {
          backgroundPosition: "200% 0",
          duration: 1.5,
          ease: "power2.inOut"
        }, "-=1")
        .from(".hero-subtitle", {
          duration: 1.2,
          y: 80,
          opacity: 0,
          stagger: 0.1,
          ease: "power3.out"
        }, "-=0.8")
        .from(".hero-buttons", {
          duration: 1,
          y: 50,
          opacity: 0,
          scale: 0.9,
          ease: "back.out(1.7)"
        }, "-=0.6")
        .call(createParticles, [], "-=2");

      // Continuous title glow effect
      gsap.to(".hero-title", {
        textShadow: "0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.6)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Problem section animation
    if (problemSectionRef.current) {
      gsap.set(".traditional-model", { x: -100, opacity: 0 });
      gsap.set(".revolutionary-model", { x: 100, opacity: 0 });

      ScrollTrigger.create({
        trigger: problemSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        animation: gsap.timeline()
          .to(".traditional-model", { duration: 1, x: 0, opacity: 1, ease: "power2.out" })
          .to(".revolutionary-model", { duration: 1, x: 0, opacity: 1, ease: "power2.out" }, "-=0.5")
      });
    }

    // Math section with enhanced counter animations
    if (mathSectionRef.current) {
      ScrollTrigger.create({
        trigger: mathSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          // Enhanced compound events counter with sound-like effect
          let eventsCounter = { value: 0 };
          gsap.to(eventsCounter, {
            value: 312,
            duration: 3,
            ease: "power2.out",
            onUpdate: function() {
              const element = document.querySelector('.events-counter');
              if (element) {
                const currentValue = Math.round(eventsCounter.value);
                element.textContent = currentValue.toString();

                // Add pulsing effect at milestones
                if (currentValue % 50 === 0 && currentValue > 0) {
                  gsap.to(element, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                  });
                }
              }
            }
          });

          // Enhanced growth percentage with color transition
          let growthCounter = { value: 15 };
          gsap.to(growthCounter, {
            value: 33,
            duration: 3,
            delay: 0.8,
            ease: "power2.out",
            onUpdate: function() {
              const element = document.querySelector('.growth-counter');
              if (element) {
                const currentValue = Math.round(growthCounter.value);
                element.textContent = currentValue.toString();

                // Color transition from red to green
                const progress = (currentValue - 15) / 18;
                const red = Math.round(255 * (1 - progress));
                const green = Math.round(255 * progress);
                element.style.color = `rgb(${red}, ${green}, 100)`;
              }
            },
            onComplete: () => {
              // Final celebration effect
              const element = document.querySelector('.growth-counter');
              if (element) {
                gsap.to(element, {
                  scale: 1.3,
                  textShadow: "0 0 30px rgba(34, 197, 94, 0.8)",
                  duration: 0.5,
                  yoyo: true,
                  repeat: 3,
                  ease: "power2.inOut"
                });
              }
            }
          });

          // Animate the containers
          gsap.from('.math-container', {
            y: 100,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            stagger: 0.3,
            ease: "back.out(1.7)"
          });
        }
      });
    }

    // Cycles animation - step by step process
    if (cyclesSectionRef.current) {
      const steps = document.querySelectorAll('.cycle-step');

      ScrollTrigger.create({
        trigger: cyclesSectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          gsap.timeline()
            .from(steps, {
              duration: 0.8,
              y: 50,
              opacity: 0,
              stagger: 0.3,
              ease: "power2.out"
            })
            .to('.cycle-arrow', {
              duration: 1,
              rotation: 360,
              scale: 1.2,
              yoyo: true,
              repeat: -1,
              ease: "power2.inOut"
            }, "-=1");
        }
      });
    }

    // Animagraffs-inspired blockchain animation
    if (blockchainSectionRef.current) {
      ScrollTrigger.create({
        trigger: blockchainSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          // Stage 1: Single 0.1g gold coin entrance
          const singleCoin = document.querySelector('.single-coin');
          if (singleCoin) {
            gsap.timeline()
              .from(singleCoin, {
                scale: 0,
                rotation: 720,
                duration: 2,
                ease: "back.out(1.7)"
              })
              .to(singleCoin, {
                rotationY: 360,
                duration: 1.5,
                ease: "power2.inOut",
                repeat: 1
              })
              .to({}, { duration: 1 }) // Pause

              // Stage 2: Coin multiplication and block formation
              .to(singleCoin, {
                scale: 0.3,
                x: -150,
                y: -150,
                duration: 1,
                ease: "power2.out"
              })
              .call(() => {
                // Reveal multiple coins in grid formation
                const blockCoins = document.querySelectorAll('.block-coin');
                gsap.set(blockCoins, { scale: 0, rotation: Math.random() * 360 });
                gsap.to(blockCoins, {
                  scale: 0.3,
                  rotation: 0,
                  duration: 0.8,
                  stagger: {
                    grid: [4, 4],
                    from: "center",
                    amount: 1.5
                  },
                  ease: "back.out(1.7)"
                });
              })
              .to({}, { duration: 2 }) // Pause for block formation

              // Stage 3: Transform to blockchain visualization
              .call(() => {
                const blockCoins = document.querySelectorAll('.block-coin');
                const blockContainer = document.querySelector('.block-container');
                const blueprintContainer = document.querySelector('.blueprint-container');

                // Animate coins into block structure
                gsap.to(blockCoins, {
                  x: (i) => (i % 4) * 80 - 120,
                  y: (i) => Math.floor(i / 4) * 80 - 120,
                  scale: 0.25,
                  duration: 1.5,
                  ease: "power2.inOut",
                  onComplete: () => {
                    // Reveal blockchain blueprint
                    gsap.to(blockContainer, {
                      scale: 0.8,
                      x: -200,
                      duration: 1.5,
                      ease: "power2.out"
                    });
                    gsap.to(blueprintContainer, {
                      opacity: 1,
                      x: 0,
                      duration: 2,
                      ease: "power2.out",
                      delay: 0.5
                    });
                  }
                });
              });
          }
        }
      });
    }

    // Enhanced growth chart animation
    if (growthSectionRef.current) {
      ScrollTrigger.create({
        trigger: growthSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          // Animate growth bars with enhanced effects
          const bars = document.querySelectorAll('.growth-bar');
          bars.forEach((bar, i) => {
            // Set initial state
            gsap.set(bar, { scaleY: 0, transformOrigin: 'bottom' });

            // Animate with stagger and completion effects
            gsap.to(bar, {
              scaleY: 1,
              duration: 0.8,
              delay: i * 0.15,
              ease: "back.out(1.7)",
              onComplete: () => {
                // Add a shine effect when animation completes
                gsap.to(bar, {
                  background: 'linear-gradient(to top, #d97706, #fbbf24, #fff)',
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1
                });
              }
            });
          });

          // Add floating value labels
          const valueLabels = document.querySelectorAll('.growth-value');
          gsap.from(valueLabels, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.8,
            ease: "power2.out"
          });

          // Container entrance animation
          gsap.from('.growth-chart-container', {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "power3.out"
          });
        }
      });
    }

    // Competitive moat animation
    if (moatSectionRef.current) {
      ScrollTrigger.create({
        trigger: moatSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          gsap.timeline()
            .from('.moat-shield', {
              duration: 1,
              scale: 0,
              rotation: 180,
              ease: "back.out(1.7)"
            })
            .from('.moat-barrier', {
              duration: 0.8,
              x: -50,
              opacity: 0,
              stagger: 0.2,
              ease: "power2.out"
            }, "-=0.5");
        }
      });
    }

    // 35-Vertical network animation
    if (verticalsSectionRef.current) {
      ScrollTrigger.create({
        trigger: verticalsSectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          // Create network nodes animation
          const nodes = document.querySelectorAll('.network-node');
          const connections = document.querySelectorAll('.network-connection');

          gsap.timeline()
            .from(nodes, {
              duration: 1,
              scale: 0,
              stagger: 0.05,
              ease: "back.out(1.7)"
            })
            .from(connections, {
              duration: 1,
              drawSVG: "0%",
              stagger: 0.02,
              ease: "power2.out"
            }, "-=0.5");
        }
      });
    }

    // Clean up ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 border border-gray-800">
          <Link to="/" className="text-xl font-bold">COW</Link>
          <ProductMenu />
          <CartDropdown />
          <div className="flex items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent">
                    Dashboard
                  </Button>
                </Link>
                <button onClick={signOut} className="text-sm text-gray-400 hover:text-white">Sign Out</button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={() => setShowAuthModal(true)}
              >
                Sign In
              </Button>
            )}
            {isConnected ? (
              <>
                <Coins className="h-5 w-5 text-gray-400" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                  onClick={handleDisconnectWallet}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-600 text-white hover:bg-gray-800 bg-transparent"
                onClick={handleConnectWallet}
              >
                <Coins className="h-5 w-5" />
                <div className="h-2 w-2 rounded-full ml-2 bg-red-500" />
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900/50 to-black overflow-hidden">
        <div className="particles-container absolute inset-0 pointer-events-none"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="hero-title text-8xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
            AuSIRI
          </h1>
          <p className="hero-subtitle text-2xl md:text-3xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionary <span className="text-yellow-400 font-bold">312x</span> compounding frequency through
            <br />sales-cycle tokenization
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 text-lg px-8 py-4"
              onClick={() => handleAddToCart(1000)}
            >
              Experience the Revolution
            </Button>
<Link to="/ausiri-animation#problem">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black bg-transparent text-lg px-8 py-4"
              >
                Scroll to Explore
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" ref={problemSectionRef} className="py-32 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-white">The Problem with Traditional Investments</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              While everyone else compounds once per year, we've cracked the code for continuous compounding
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="traditional-model space-y-8">
              <div className="bg-red-900/30 border border-red-700 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-red-300 mb-6">Traditional Model</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Stock Market:</span>
                    <span className="text-red-400 font-bold">1x per year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bonds:</span>
                    <span className="text-red-400 font-bold">1x per year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Real Estate:</span>
                    <span className="text-red-400 font-bold">1x per year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Traditional RWAs:</span>
                    <span className="text-red-400 font-bold">1x per year</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-black/50 rounded-lg">
                  <p className="text-lg font-mono">$100,000 × (1 + 0.15)¹ = <span className="text-red-400">$115,000</span></p>
                  <p className="text-sm text-gray-400 mt-2">After 1 year • 15% growth</p>
                </div>
              </div>
            </div>

            <div className="revolutionary-model space-y-8">
              <div className="bg-gradient-to-br from-yellow-900/30 to-green-900/30 border border-yellow-500 rounded-2xl p-8">
                <h3 className="text-3xl font-bold text-yellow-300 mb-6">GOLD SWIM Model</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sales Cycles:</span>
                    <span className="text-yellow-400 font-bold">312x per year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Frequency:</span>
                    <span className="text-yellow-400 font-bold">Every 1.17 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Gold Backing:</span>
                    <span className="text-yellow-400 font-bold">100% Physical</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Compounding:</span>
                    <span className="text-yellow-400 font-bold">Automatic</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-black/50 rounded-lg">
                  <p className="text-lg font-mono">$100,000 × (1 + 0.0004)³¹² = <span className="text-green-400">$133,424</span></p>
                  <p className="text-sm text-gray-400 mt-2">After 1 year • 33% growth</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-2xl text-yellow-400 font-bold">
              Same profit margins → 312x more compounding frequency → 2.3x better returns
            </p>
          </div>
        </div>
      </section>

      {/* Math Section */}
      <section ref={mathSectionRef} className="py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-8">The Math That Changes Everything</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="math-container bg-gray-900 rounded-3xl p-12 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-500 relative overflow-hidden">
                {/* Background animation effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full animate-pulse" style={{animationDuration: '3s'}}></div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-yellow-400 mb-8">Compound Events Per Year</h3>
                  <div className="text-8xl font-bold text-yellow-300 mb-4 font-mono">
                    <span className="events-counter">0</span>
                  </div>
                  <p className="text-xl text-gray-400">vs traditional <span className="text-red-400 font-bold">1</span> event per year</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="math-container bg-gradient-to-br from-green-900/30 to-yellow-900/30 rounded-3xl p-12 border border-green-500/20 hover:border-green-500/50 transition-all duration-500 relative overflow-hidden">
                {/* Background animation effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent translate-x-full animate-pulse" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-green-400 mb-8">Annual Growth Rate</h3>
                  <div className="text-8xl font-bold text-green-300 mb-4 font-mono">
                    <span className="growth-counter">15</span><span className="text-6xl">%</span>
                  </div>
                  <p className="text-xl text-gray-400">same margins, <span className="text-green-400 font-bold">exponential</span> results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales Cycles Section */}
      <section ref={cyclesSectionRef} className="py-32 px-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-8">How GOLD SWIM Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Step-by-step breakdown of our revolutionary compounding mechanism
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="cycle-step bg-yellow-900/20 border border-yellow-700 rounded-3xl p-8 text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-6">1</div>
              <h3 className="text-2xl font-bold mb-4">Initial Investment</h3>
              <p className="text-gray-300 mb-6">
                $100,000 buys 100kg of gold inventory with $2/gram profit margin
              </p>
              <div className="cycle-arrow text-yellow-400 text-3xl">↻</div>
            </div>

            <div className="cycle-step bg-blue-900/20 border border-blue-700 rounded-3xl p-8 text-center">
              <div className="text-6xl font-bold text-blue-400 mb-6">2</div>
              <h3 className="text-2xl font-bold mb-4">Sales Cycle</h3>
              <p className="text-gray-300 mb-6">
                Every 1.17 days: Sell gold → Capture $2/gram margin → Reinvest profit
              </p>
              <div className="cycle-arrow text-blue-400 text-3xl">↻</div>
            </div>

            <div className="cycle-step bg-green-900/20 border border-green-700 rounded-3xl p-8 text-center">
              <div className="text-6xl font-bold text-green-400 mb-6">3</div>
              <h3 className="text-2xl font-bold mb-4">Compound Effect</h3>
              <p className="text-gray-300 mb-6">
                Larger inventory for next cycle → Exponential growth over 312 cycles/year
              </p>
              <div className="cycle-arrow text-green-400 text-3xl">↻</div>
            </div>
          </div>
        </div>
      </section>

      {/* Animagraffs-Style Blockchain Animation */}
      <section id="blockchain" ref={blockchainSectionRef} className="py-40 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
              The AuSiri Genesis
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto mb-8">
              Watch how a single <span className="text-yellow-400 font-bold">0.1g gold coin</span> evolves into the
              <span className="text-green-400 font-bold"> revolutionary AuSiri blockchain</span>
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              An Animagraffs-inspired technical breakdown of gold tokenization at the molecular level
            </p>
          </div>

          {/* Animation Container */}
          <div className="relative h-96 mb-16">
            {/* Stage 1: Single Gold Coin */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="single-coin relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-2xl shadow-yellow-400/50 flex items-center justify-center border-4 border-yellow-200 relative overflow-hidden">
                  {/* Coin surface texture */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-60"></div>
                  <div className="text-yellow-800 font-bold text-lg z-10">0.1g</div>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-full animate-pulse" style={{animationDuration: '3s'}}></div>
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-sm">
                  Pure Gold Coin
                </div>
              </div>
            </div>

            {/* Stage 2: Block Formation */}
            <div className="block-container absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({length: 16}, (_, i) => (
                  <div key={i} className="block-coin w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg opacity-0" style={{transform: 'scale(0)'}}></div>
                ))}
              </div>
            </div>

            {/* Stage 3: Blockchain Blueprint */}
            <div className="blueprint-container absolute right-0 top-0 h-full w-1/2 opacity-0" style={{transform: 'translateX(100px)'}}>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 h-full backdrop-blur-sm">
                <h3 className="text-blue-400 font-bold text-xl mb-4">AuSiri Blockchain Architecture</h3>

                {/* Technical Blueprint */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm">Gold Asset Layer</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className="text-gray-300 text-sm">Tokenization Protocol</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span className="text-gray-300 text-sm">Compound Engine</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    <span className="text-gray-300 text-sm">Distribution Layer</span>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mt-6 space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Block Time:</span>
                    <span className="text-green-400">1.17 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Cycles:</span>
                    <span className="text-green-400">312</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Backing:</span>
                    <span className="text-green-400">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compound Rate:</span>
                    <span className="text-green-400">0.04% per cycle</span>
                  </div>
                </div>

                {/* Network Visualization */}
                <div className="mt-6">
                  <svg className="w-full h-20" viewBox="0 0 200 80">
                    <defs>
                      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
                      </linearGradient>
                    </defs>
                    {/* Network nodes */}
                    <circle cx="40" cy="20" r="3" fill="#3b82f6" className="animate-pulse"/>
                    <circle cx="100" cy="15" r="3" fill="#8b5cf6" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                    <circle cx="160" cy="25" r="3" fill="#06b6d4" className="animate-pulse" style={{animationDelay: '1s'}}/>
                    <circle cx="70" cy="40" r="3" fill="#10b981" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
                    <circle cx="130" cy="45" r="3" fill="#f59e0b" className="animate-pulse" style={{animationDelay: '2s'}}/>
                    {/* Connecting lines */}
                    <line x1="40" y1="20" x2="70" y2="40" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6"/>
                    <line x1="70" y1="40" x2="100" y2="15" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6"/>
                    <line x1="100" y1="15" x2="130" y2="45" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6"/>
                    <line x1="130" y1="45" x2="160" y2="25" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Breakdown */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-gray-900/50 border border-yellow-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-yellow-400 text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-4">Molecular Precision</h3>
              <p className="text-gray-400">
                Each 0.1g gold coin represents exactly 3.01 × 10²¹ gold atoms,
                tokenized with atomic-level precision on the blockchain.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-blue-400 text-4xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-blue-300 mb-4">Block Architecture</h3>
              <p className="text-gray-400">
                16 gold coins form a single block, creating the foundational
                unit for our 312-cycle annual compounding mechanism.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-green-400 text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-green-300 mb-4">Exponential Scaling</h3>
              <p className="text-gray-400">
                From single coin to blockchain infrastructure capable of
                processing $2.1B+ in tokenized gold assets annually.
              </p>
            </div>
          </div>

          {/* Process Flow Visualization */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-white mb-12">Technical Process Flow</h3>
            <div className="flex justify-center items-center space-x-8 overflow-x-auto">
              <div className="flex flex-col items-center min-w-0">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mb-3">
                  Au
                </div>
                <div className="text-sm text-gray-400 text-center">Physical Gold</div>
              </div>

              <div className="text-gray-400 text-2xl">→</div>

              <div className="flex flex-col items-center min-w-0">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  🔬
                </div>
                <div className="text-sm text-gray-400 text-center">Molecular Analysis</div>
              </div>

              <div className="text-gray-400 text-2xl">→</div>

              <div className="flex flex-col items-center min-w-0">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  ⚡
                </div>
                <div className="text-sm text-gray-400 text-center">Tokenization</div>
              </div>

              <div className="text-gray-400 text-2xl">→</div>

              <div className="flex flex-col items-center min-w-0">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                  📈
                </div>
                <div className="text-sm text-gray-400 text-center">Compound Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background technical grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({length: 144}, (_, i) => (
              <div key={i} className="border border-blue-500/20"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Visualization */}
      <section ref={growthSectionRef} className="py-32 px-4 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-16">Exponential Growth Visualization</h2>
          <div className="growth-chart-container bg-gray-900/80 backdrop-blur-sm rounded-3xl p-12 border border-yellow-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-green-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-12 gap-3 h-80 items-end mb-6">
                {Array.from({length: 12}, (_, i) => {
                  const height = 40 + (i * i * 3);
                  const value = Math.round(100000 * Math.pow(1.0275, i + 1) / 1000) / 100; // Rough compound calculation
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <div className="growth-value text-xs text-yellow-300 font-bold mb-2 opacity-0">
                        ${value}k
                      </div>
                      <div
                        className="growth-bar bg-gradient-to-t from-yellow-700 via-yellow-500 to-yellow-300 rounded-t-lg shadow-lg relative overflow-hidden"
                        style={{height: `${height}px`, width: '100%'}}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent transform -skew-y-12 translate-y-full animate-pulse" style={{animationDuration: '2s', animationDelay: `${i * 0.1}s`}}></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">M{i + 1}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  Portfolio Growth Projection
                </div>
                <div className="text-lg text-gray-400">
                  12-month progression with <span className="text-yellow-400 font-bold">312</span> compound events per year
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Moat */}
      <section ref={moatSectionRef} className="py-32 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-16">Why This Is Impossible to Copy</h2>
          <div className="relative">
            <div className="moat-shield text-yellow-400 text-8xl mb-12">
              <Shield className="mx-auto" size={200} />
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="moat-barrier bg-red-900/30 border border-red-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-300 mb-4">Operational Complexity</h3>
                <p className="text-gray-300">312 gold transactions per year with consistent margins</p>
              </div>
              <div className="moat-barrier bg-orange-900/30 border border-orange-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-orange-300 mb-4">Capital Requirements</h3>
                <p className="text-gray-300">Significant working capital for high-frequency cycles</p>
              </div>
              <div className="moat-barrier bg-purple-900/30 border border-purple-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">Regulatory Positioning</h3>
                <p className="text-gray-300">Precious metals licenses + securities compliance</p>
              </div>
              <div className="moat-barrier bg-blue-900/30 border border-blue-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Technical Infrastructure</h3>
                <p className="text-gray-300">Smart contracts + real-time gold pricing integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 35-Vertical Strategy */}
      <section ref={verticalsSectionRef} className="py-32 px-4 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-8">The 35-Vertical Master Plan</h2>
          <p className="text-2xl text-gray-400 mb-16 max-w-4xl mx-auto">
            While competitors get 1 compound per year, we get <span className="text-yellow-400 font-bold">5,250 compound events</span> across 35 verticals
          </p>

          <div className="relative h-96 bg-gray-900/50 rounded-3xl overflow-hidden">
            {/* Enhanced Network Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Central hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg shadow-yellow-400/50 network-node"></div>
                {/* Surrounding nodes */}
                {Array.from({length: 35}, (_, i) => {
                  const angle = (i / 35) * 2 * Math.PI;
                  const radius = 120 + (i % 3) * 30;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={i}
                      className="network-node absolute w-3 h-3 bg-yellow-400 rounded-full opacity-80"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${i * 50}ms`
                      }}
                    />
                  );
                })}
              </div>
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Connection lines from center to nodes */}
              {Array.from({length: 35}, (_, i) => {
                const angle = (i / 35) * 2 * Math.PI;
                const radius = 120 + (i % 3) * 30;
                const x = Math.cos(angle) * radius + 192; // 192 = 50% of 384px container
                const y = Math.sin(angle) * radius + 192;
                return (
                  <line
                    key={i}
                    className="network-connection"
                    x1="192" y1="192"
                    x2={x} y2={y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="1"
                    filter="url(#glow)"
                    opacity="0.6"
                  />
                );
              })}
            </svg>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">High-Frequency Verticals</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Gold: 312 cycles/year</li>
                <li>• Coffee: 260 cycles/year</li>
                <li>• Aviation parts: 52 cycles/year</li>
              </ul>
            </div>
            <div className="bg-green-900/30 border border-green-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-300 mb-4">Network Effect</h3>
              <p className="text-gray-300">35 verticals × 150 avg cycles = <strong>5,250 compound events</strong></p>
            </div>
            <div className="bg-blue-900/30 border border-blue-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-300 mb-4">Competitive Advantage</h3>
              <p className="text-gray-300">Ungunable position across multiple asset classes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-4 bg-gradient-to-r from-yellow-900/50 to-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-8">Ready to Experience the Revolution?</h2>
          <p className="text-2xl text-yellow-200 mb-12 max-w-3xl mx-auto">
            Join the first-ever asset class with 312x compounding frequency.
            <br />Your dad's model awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 text-xl px-12 py-6"
              onClick={() => handleAddToCart(1000)}
            >
              Start with $1,000
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 text-black hover:from-green-600 hover:to-green-700 text-xl px-12 py-6"
              onClick={() => handleAddToCart(10000)}
            >
              Go Big: $10,000
            </Button>
          </div>

          <div className="mt-16 text-center">
            <div className="flex justify-center gap-8">
              <Link to="/ausiri" className="inline-flex items-center text-gray-400 hover:text-white text-lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Standard AuSiri Page
              </Link>
              <Button
                size="sm"
                variant="outline"
                className="border-yellow-600 text-yellow-300 hover:bg-yellow-900 bg-transparent"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ↑ Back to Top
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}