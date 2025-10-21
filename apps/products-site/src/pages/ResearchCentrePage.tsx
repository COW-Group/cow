import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ResearchHeroBackground } from "../components/research-hero-background"
import { ResearchNavigation } from "../components/research-navigation"
import { ArrowRight, Search, Filter, ChevronDown } from "lucide-react"
import { allResearch, featuredResearch, researchCategories, researchTags, researchPillars, assetVerticals, getResearchCountByPillar, getResearchCountByVertical, type ResearchArticle } from "../data/research"

export default function ResearchCentrePage() {
  const [isClient, setIsClient] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  // Filter research based on selected filters and search
  const filteredResearch = allResearch.filter(article => {
    if (selectedCategory && article.category !== selectedCategory) return false
    if (selectedTag && !article.tags.includes(selectedTag)) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    }
    return true
  })

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
        <ResearchHeroBackground />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              <h1
                className="text-5xl sm:text-7xl lg:text-8xl font-thin text-gray-800 dark:text-gray-100 mb-6 leading-[0.9] tracking-tight"
              >
                Pioneering the Science of{' '}
                <span style={{
                  background: 'linear-gradient(to right, #0066FF 0%, #0ea5e9 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '300'
                }}>
                  Self-Optimizing Assets
                </span>
              </h1>
              {/* Deep Cyan logo divider */}
              <div style={{
                width: '120px',
                height: '2px',
                background: 'linear-gradient(to right, transparent 0%, #0066FF 50%, transparent 100%)',
                margin: '0 auto 2rem auto'
              }} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Systematic research into performance engineering across tokenized real-world assets—discovering how{' '}
              <span style={{ color: '#0066FF', fontWeight: '400' }}>algorithmic optimization</span> transforms passive holdings into{' '}
              <span className="text-emerald-600 font-normal">active wealth builders</span>
            </motion.p>
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

      {/* Research Pillar Tabs */}
      <section className="py-8 px-8" style={{ background: 'var(--mode-tabs-bg)' }}>
        <style>{`
          :root {
            --mode-tabs-bg: rgba(155, 139, 126, 0.08);
          }
          .dark {
            --mode-tabs-bg: rgba(0, 102, 255, 0.05);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedPillar(null)}
              className="px-6 py-3 rounded-full text-sm font-light transition-all hover:shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              style={{
                background: selectedPillar === null ? 'linear-gradient(to right, #0066FF, #0080FF)' : undefined,
                color: selectedPillar === null ? 'white' : undefined,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              All Research
            </button>
            {researchPillars.map(pillar => (
              <button
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className="px-6 py-3 rounded-full text-sm font-light transition-all hover:shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                style={{
                  background: selectedPillar === pillar ? 'linear-gradient(to right, #0066FF, #0080FF)' : undefined,
                  color: selectedPillar === pillar ? 'white' : undefined,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Horizon Divider - Sumi-e inspired */}
      <div
        className="w-full"
        style={{
          height: '2px',
          background: 'var(--mode-horizon-divider)'
        }}
      >
        <style>{`
          :root {
            --mode-horizon-divider: linear-gradient(to right, transparent 0%, rgba(155, 139, 126, 0.3) 50%, transparent 100%);
          }
          .dark {
            --mode-horizon-divider: linear-gradient(to right, transparent 0%, rgba(0, 102, 255, 0.3) 50%, transparent 100%);
          }
        `}</style>
      </div>

      {/* Featured Papers - Anthropic Style (Simple) */}
      <section className="py-24 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-lg font-light mb-12 text-gray-600 dark:text-gray-400"
            style={{
              letterSpacing: '0.02em',
              fontFamily: 'Inter, sans-serif',
              textTransform: 'uppercase'
            }}
          >
            Featured Papers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredResearch
              .filter(article => !selectedPillar || article.pillar === selectedPillar)
              .map(article => {
                // Map pillar to color from COW palette
                const getPillarColor = (pillar: string) => {
                  const colorMap: Record<string, string> = {
                    'Wealth Diagnostics & Market Analysis': 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)', // Deep Cerulean - analytical foundation
                    'Wealth Dynamics and Perspectives': 'linear-gradient(135deg, #8B956D 0%, #6B7553 100%)', // Sage Green - multi-dimensional balance
                    'Asset Performance Engineering': 'linear-gradient(135deg, #C9724B 0%, #B86239 100%)', // Terra Cotta - transformation & engineering
                    'Financial Architecture & Program Design': 'linear-gradient(135deg, #C9B8A8 0%, #B5A594 100%)', // Soft Clay - structure & design
                    'Implementation Research': 'linear-gradient(135deg, #9B8B7E 0%, #8A7B6E 100%)' // Warm Stone - grounded practical results
                  }

                  return colorMap[pillar] || 'linear-gradient(135deg, #007BA7 0%, #005F7F 100%)'
                }

                return (
                  <Link
                    key={article.id}
                    to={`/research/${article.slug}`}
                    className="group relative rounded-2xl transition-all duration-300 hover:shadow-2xl overflow-hidden"
                    style={{
                      background: getPillarColor(article.pillar),
                      minHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Space for future illustration - centered top */}
                    <div className="flex-1 flex items-center justify-center p-8">
                      {/* Placeholder for illustration icon */}
                      <div
                        className="w-32 h-32 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {/* Icon will go here */}
                      </div>
                    </div>

                    {/* Content at bottom */}
                    <div className="p-8">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                          className="text-xs font-light px-3 py-1 rounded-full"
                          style={{
                            background: 'rgba(255, 255, 255, 0.25)',
                            color: 'white',
                            letterSpacing: '0.02em',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          Featured paper
                        </span>
                        {article.verticals && article.verticals.map(vertical => {
                          // Get color for vertical dot
                          const getVerticalDotColor = (vert: string) => {
                            const colorMap: Record<string, string> = {
                              'Gold': '#D4AF37',
                              'Water Resources': '#007BA7',
                              'Solar Energy': '#C9724B',
                              'Carbon Markets': '#8B956D',
                              'Electric Vehicles': '#60A5FA',
                              'Rice Agriculture': '#6B8E23',
                              'Residential Property': '#C9B8A8',
                              'Aquaculture': '#5E9EA0'
                            }
                            return colorMap[vert] || '#007BA7'
                          }

                          return (
                            <span
                              key={vertical}
                              className="text-xs font-light px-3 py-1 rounded-full flex items-center gap-2"
                              style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                letterSpacing: '0.02em',
                                backdropFilter: 'blur(10px)'
                              }}
                            >
                              <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{
                                  background: getVerticalDotColor(vertical)
                                }}
                              />
                              {vertical}
                            </span>
                          )
                        })}
                      </div>
                      <h3
                        className="text-2xl font-light transition-all"
                        style={{
                          letterSpacing: '-0.02em',
                          lineHeight: '1.3',
                          color: 'white',
                          fontFamily: 'Inter, sans-serif',
                          textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      {/* 5 Research Pillars Section */}
      <section className="py-20 px-8" style={{ background: 'var(--mode-pillars-bg)' }}>
        <style>{`
          :root {
            --mode-pillars-bg: rgba(249, 250, 251, 0.4);
          }
          .dark {
            --mode-pillars-bg: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2
              className="text-4xl font-light mb-4 text-gray-900 dark:text-gray-100"
              style={{
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Research Focus Areas
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300"
              style={{
                letterSpacing: '0.01em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Five interconnected disciplines exploring how tokenized assets create and preserve wealth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Wealth Diagnostics & Market Analysis',
                description: 'Mapping uncharted territory in tokenized asset markets—systematic assessment frameworks for evaluating portfolio health, identifying risk exposures, and discovering investment opportunities across income segments and asset classes.',
                count: getResearchCountByPillar()['Wealth Diagnostics & Market Analysis'] || 0
              },
              {
                name: 'Wealth Dynamics and Perspectives',
                description: 'Exploring wealth from every angle—cross-disciplinary analysis incorporating financial, legal, behavioral, and long-duration perspectives on how wealth compounds and endures across market cycles.',
                count: getResearchCountByPillar()['Multi-Dimensional Wealth Studies'] || 0
              },
              {
                name: 'Asset Performance Engineering',
                description: 'Discovering what makes assets perform—development and optimization of tokenized asset structures, examining performance characteristics, liquidity dynamics, and how fractional ownership transforms accessibility.',
                count: getResearchCountByPillar()['Asset Engineering & Innovation'] || 0
              },
              {
                name: 'Financial Architecture & Program Design',
                description: 'Pioneering new wealth-building frameworks—structured solution design including accumulation programs, portfolio construction methodologies, and multi-asset allocation strategies that work across life stages.',
                count: getResearchCountByPillar()['Financial Architecture & Program Design'] || 0
              },
              {
                name: 'Implementation Research',
                description: 'Learning from real-world deployment—documenting actual outcomes, participant behavior patterns, and effectiveness metrics from pilot programs across diverse markets and asset classes.',
                count: getResearchCountByPillar()['Applied Wealth Solutions'] || 0
              }
            ].map(pillar => (
              <div
                key={pillar.name}
                className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-xl font-light text-gray-900 dark:text-gray-100"
                    style={{
                      letterSpacing: '-0.01em',
                      lineHeight: '1.3',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {pillar.name}
                  </h3>
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full bg-[#0066FF]/10 dark:bg-[#38bdf8]/20 text-[#0066FF] dark:text-[#38bdf8]"
                    style={{
                      letterSpacing: '0.02em'
                    }}
                  >
                    {pillar.count}
                  </span>
                </div>
                <p
                  className="text-sm font-light text-gray-600 dark:text-gray-300"
                  style={{
                    lineHeight: '1.6',
                    letterSpacing: '0.01em',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Asset Verticals Section */}
      <section className="py-20 px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2
              className="text-4xl font-light mb-4 text-gray-900 dark:text-gray-100"
              style={{
                letterSpacing: '-0.02em'
              }}
            >
              Asset Verticals
            </h2>
            <p
              className="text-lg font-light text-gray-600 dark:text-gray-300"
              style={{ letterSpacing: '0.01em' }}
            >
              Charting new frontiers across eight strategic asset classes—from precious metals to sustainable infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Gold',
                description: 'Pioneering performance measurement in precious metal tokenization—our flagship vertical exploring how fractional bullion ownership transforms wealth accessibility',
                count: getResearchCountByVertical()['Gold'] || 0,
                featured: true
              },
              {
                name: 'Solar Energy',
                description: 'Charting new territory in renewable infrastructure ownership—distributed generation assets meeting retail investor demand',
                count: getResearchCountByVertical()['Solar Energy'] || 0
              },
              {
                name: 'Water Resources',
                description: 'Exploring scarcity as an asset class—water rights, desalination capacity, and essential resource securitization in emerging markets',
                count: getResearchCountByVertical()['Water Resources'] || 0
              },
              {
                name: 'Carbon Markets',
                description: 'Navigating climate transition finance—carbon credit tokenization and how climate-conscious capital flows reshape asset performance',
                count: getResearchCountByVertical()['Carbon Markets'] || 0
              },
              {
                name: 'Electric Vehicles',
                description: 'Discovering value in transportation transformation—EV infrastructure, battery technology, and how mobility revolution creates investment opportunity',
                count: getResearchCountByVertical()['Electric Vehicles'] || 0
              },
              {
                name: 'Rice Agriculture',
                description: 'Mapping staple commodity performance—agricultural production facilities and food security-driven asset fundamentals',
                count: getResearchCountByVertical()['Rice Agriculture'] || 0
              },
              {
                name: 'Residential Property',
                description: 'Pioneering fractional home ownership research—real estate tokenization and how property accessibility reshapes wealth building',
                count: getResearchCountByVertical()['Residential Property'] || 0
              },
              {
                name: 'Aquaculture',
                description: 'Exploring sustainable protein production—aquaculture operations and how food system transformation creates long-duration value',
                count: getResearchCountByVertical()['Aquaculture'] || 0
              }
            ].map(vertical => (
              <div
                key={vertical.name}
                className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50"
                style={{
                  borderColor: vertical.featured ? '#f59e0b' : undefined,
                  borderWidth: vertical.featured ? '2px' : undefined
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-lg font-medium text-gray-900 dark:text-gray-100"
                    style={{
                      letterSpacing: '-0.01em',
                      color: vertical.featured ? '#f59e0b' : undefined,
                      lineHeight: '1.3'
                    }}
                  >
                    {vertical.name}
                    {vertical.featured && <span className="ml-2 text-xs">★</span>}
                  </h3>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      background: vertical.featured ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0, 102, 255, 0.1)',
                      color: vertical.featured ? '#f59e0b' : '#0066FF',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {vertical.count}
                  </span>
                </div>
                <p
                  className="text-sm font-light text-gray-600 dark:text-gray-300"
                  style={{
                    lineHeight: '1.6',
                    letterSpacing: '0.01em'
                  }}
                >
                  {vertical.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Research Section with Filters */}
      <section className="py-24 px-8" style={{ background: 'var(--mode-browse-bg)' }}>
        <style>{`
          :root {
            --mode-browse-bg: transparent;
          }
          .dark {
            --mode-browse-bg: linear-gradient(to bottom, rgba(0, 102, 255, 0.03) 0%, transparent 100%);
          }
        `}</style>
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-4xl font-light text-gray-900 dark:text-gray-100"
                style={{
                  letterSpacing: '-0.02em'
                }}
              >
                Browse All Papers
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
                style={{
                  background: showFilters ? 'rgba(59, 130, 246, 0.1)' : 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '300'
                }}
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search research articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border transition-colors bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                style={{
                  fontSize: '15px',
                  fontWeight: '300',
                  letterSpacing: '0.01em'
                }}
              />
            </div>

            {/* Filter Tags */}
            {showFilters && (
              <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(249, 250, 251, 0.6)' }}>
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-4 py-2 rounded-full text-sm transition-all"
                      style={{
                        background: selectedCategory === null ? '#3b82f6' : 'white',
                        color: selectedCategory === null ? 'white' : '#374151',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        fontWeight: '300'
                      }}
                    >
                      All
                    </button>
                    {researchCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: selectedCategory === category ? '#3b82f6' : 'white',
                          color: selectedCategory === category ? 'white' : '#374151',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          fontWeight: '300'
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3 text-gray-700">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="px-4 py-2 rounded-full text-sm transition-all"
                      style={{
                        background: selectedTag === null ? '#3b82f6' : 'white',
                        color: selectedTag === null ? 'white' : '#374151',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        fontWeight: '300'
                      }}
                    >
                      All
                    </button>
                    {researchTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="px-4 py-2 rounded-full text-sm transition-all"
                        style={{
                          background: selectedTag === tag ? '#3b82f6' : 'white',
                          color: selectedTag === tag ? 'white' : '#374151',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          fontWeight: '300'
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Research Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResearch.map(article => (
              <Link
                key={article.id}
                to={`/research/${article.slug}`}
                className="group"
              >
                <Card
                  className="h-full transition-all duration-300 hover:shadow-xl border-0"
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {article.paperNumber && (
                        <span
                          className="text-xs font-medium px-3 py-1 rounded-full"
                          style={{
                            background: 'rgba(0, 123, 167, 0.1)',
                            color: '#007ba7',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {article.paperNumber}
                        </span>
                      )}
                      {article.verticals && article.verticals.map(vertical => (
                        <span
                          key={vertical}
                          className="text-xs font-light px-3 py-1 rounded-full"
                          style={{
                            background: vertical === 'Gold' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(96, 165, 250, 0.1)',
                            color: vertical === 'Gold' ? '#f59e0b' : '#3b82f6',
                            letterSpacing: '0.02em'
                          }}
                        >
                          {vertical}
                        </span>
                      ))}
                    </div>
                    <CardTitle
                      className="text-lg font-light group-hover:text-blue-600 transition-colors mb-3"
                      style={{
                        letterSpacing: '-0.01em',
                        lineHeight: '1.3'
                      }}
                    >
                      {article.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="line-clamp-1">{article.authors.join(', ')}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-gray-600 font-light mb-4 line-clamp-3"
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-xs font-light px-2 py-1 rounded"
                        style={{
                          background: 'rgba(59, 130, 246, 0.08)',
                          color: '#3b82f6'
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {article.pageCount && <span>{article.pageCount}p</span>}
                        {article.citations && <span>{article.citations} cites</span>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredResearch.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg font-light mb-2">
                No papers match your search
              </p>
              <p className="text-gray-400 text-sm font-light">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Join Research Community Section */}
      <section
        className="py-16 px-8"
        style={{
          background: 'var(--mode-join-bg)'
        }}
      >
        <style>{`
          :root {
            --mode-join-bg: linear-gradient(to bottom, rgba(201, 184, 168, 0.15), rgba(155, 139, 126, 0.25));
          }
          .dark {
            --mode-join-bg: linear-gradient(to bottom, rgba(0, 102, 255, 0.08), rgba(16, 185, 129, 0.08));
          }
        `}</style>
        <div className="max-w-7xl mx-auto text-center">
          <h3
            className="text-2xl font-light mb-4 text-gray-900 dark:text-gray-100"
            style={{
              letterSpacing: '-0.02em'
            }}
          >
            Join the Research Community
          </h3>
          <p
            className="text-base font-light mb-8 text-gray-600 dark:text-gray-300"
            style={{
              letterSpacing: '0.01em',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}
          >
            Stay updated on new publications, methodologies, and findings from our research teams
          </p>
          <Button
            size="lg"
            className="text-white"
            style={{
              background: 'linear-gradient(to right, #0066FF, #0080FF)',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0052CC, #0066FF)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0066FF, #0080FF)'}
          >
            Subscribe to Updates
          </Button>
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
            --mode-footer-bg: rgba(0, 102, 255, 0.05);
            --mode-footer-border: rgba(0, 102, 255, 0.2);
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
  )
}
