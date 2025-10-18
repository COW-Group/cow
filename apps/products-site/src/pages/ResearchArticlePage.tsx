import { Link, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { ArrowLeft, Download, FileText, Calendar, Tag, Quote } from "lucide-react"
import { ResearchNavigation } from "../components/research-navigation"
import { getResearchBySlug, allResearch, type ResearchArticle } from "../data/research"

export default function ResearchArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)
  const [article, setArticle] = useState<ResearchArticle | null>(null)

  useEffect(() => {
    setIsClient(true)
    if (slug) {
      const foundArticle = getResearchBySlug(slug)
      if (foundArticle) {
        setArticle(foundArticle)
      }
    }
  }, [slug])

  if (!isClient) {
    return null
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light mb-4">Article not found</h1>
          <Link to="/research">
            <Button variant="outline">Back to Research</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Get related articles from same category
  const relatedArticles = allResearch
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Research Navigation */}
      <ResearchNavigation />

      {/* Article Header */}
      <section className="pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/research"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-light">Back to Research</span>
          </Link>

          {/* Paper Number, Verticals, and Pillar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {article.paperNumber && (
              <span
                className="text-sm font-medium px-4 py-2 rounded-full"
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
                className="text-sm font-light px-4 py-2 rounded-full"
                style={{
                  background: vertical === 'Gold' ? 'rgba(255, 193, 7, 0.15)' : 'rgba(96, 165, 250, 0.1)',
                  color: vertical === 'Gold' ? '#f59e0b' : '#3b82f6',
                  letterSpacing: '0.02em',
                  fontWeight: vertical === 'Gold' ? '500' : '300'
                }}
              >
                {vertical}
              </span>
            ))}
            <span
              className="text-sm font-light px-4 py-2 rounded-full"
              style={{
                background: 'rgba(59, 130, 246, 0.08)',
                color: '#3b82f6',
                letterSpacing: '0.02em'
              }}
            >
              {article.pillar || article.category}
            </span>
          </div>

          {/* Title */}
          <h1
            className="mb-6"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '300',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              color: '#111827'
            }}
          >
            {article.title}
          </h1>

          {/* Authors */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 font-light">
              {article.authors.join(', ')}
            </p>
          </div>

          {/* Meta Information and Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-light">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            {article.pageCount && (
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-light">{article.pageCount} pages</span>
              </div>
            )}
            {article.citations && (
              <div className="flex items-center gap-2 text-gray-600">
                <Quote className="w-4 h-4" />
                <span className="text-sm font-light">{article.citations} citations</span>
              </div>
            )}
            <div className="ml-auto flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-lg"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  fontSize: '13px',
                  fontWeight: '300'
                }}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-lg"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  fontSize: '13px',
                  fontWeight: '300'
                }}
              >
                <Quote className="w-4 h-4" />
                Cite
              </Button>
            </div>
          </div>

          {/* Keywords */}
          {article.keywords && article.keywords.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(0, 0, 0, 0.04)',
                      color: '#6b7280',
                      fontWeight: '300'
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Abstract */}
          <div
            className="mb-12 p-8 rounded-2xl"
            style={{
              background: 'rgba(59, 130, 246, 0.04)',
              border: '1px solid rgba(59, 130, 246, 0.08)'
            }}
          >
            <h2 className="text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">Abstract</h2>
            <p
              className="text-base font-light text-gray-800"
              style={{
                lineHeight: '1.8',
                letterSpacing: '0.01em'
              }}
            >
              {article.excerpt}
            </p>
          </div>

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none"
            style={{
              fontSize: '17px',
              lineHeight: '1.8',
              color: '#374151',
              fontWeight: '300'
            }}
          >
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="space-y-8">
                <h2 className="text-2xl font-light mt-8 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  1. Introduction
                </h2>
                <p>
                  This paper examines the methodology and findings related to {article.title.toLowerCase()}.
                  We present empirical analysis based on proprietary transaction data and market observations
                  across multiple jurisdictions.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  2. Literature Review
                </h2>
                <p>
                  Recent work in tokenized asset markets has documented significant inefficiencies in price discovery
                  mechanisms and liquidity provision. This research builds on established portfolio theory while
                  incorporating novel approaches to risk-adjusted return optimization in digital asset markets.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  3. Data and Methodology
                </h2>
                <p>
                  We employ a mixed-methods approach combining quantitative analysis of transaction data with
                  qualitative assessment of market structure characteristics. Our dataset spans multiple years
                  and jurisdictions, providing robust statistical power for hypothesis testing.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  4. Empirical Results
                </h2>
                <p>
                  Our analysis reveals systematic patterns in performance differentials across asset categories.
                  Statistical significance holds across multiple specifications and robustness checks, suggesting
                  genuine market phenomena rather than spurious correlation.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  5. Discussion and Implications
                </h2>
                <p>
                  These findings have important implications for portfolio construction strategies and risk management
                  frameworks in tokenized asset markets. The documented inefficiencies suggest opportunities for
                  systematic alpha generation through informed position-taking.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4" style={{ letterSpacing: '-0.02em', color: '#111827' }}>
                  6. Conclusion
                </h2>
                <p>
                  We document significant performance differentials attributable to structural market characteristics
                  rather than traditional risk factors. Future research should examine the persistence of these
                  patterns and their implications for market efficiency theory.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Research */}
      {relatedArticles.length > 0 && (
        <section className="py-24 px-8" style={{ background: 'rgba(249, 250, 251, 0.4)' }}>
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl font-light mb-12"
              style={{
                letterSpacing: '-0.02em',
                color: '#111827'
              }}
            >
              You Might Also Like
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(related => (
                <Link
                  key={related.id}
                  to={`/research/${related.slug}`}
                  className="group"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div
                    className="h-full p-6 transition-all duration-300 hover:shadow-xl rounded-2xl"
                    style={{
                      background: 'white',
                      border: '1px solid rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <span
                      className="text-xs font-light px-3 py-1 rounded-full inline-block mb-4"
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {related.category}
                    </span>
                    <h3
                      className="text-xl font-light mb-3 group-hover:text-blue-600 transition-colors"
                      style={{
                        letterSpacing: '-0.01em',
                        lineHeight: '1.3'
                      }}
                    >
                      {related.title}
                    </h3>
                    <p
                      className="text-gray-600 font-light text-sm"
                      style={{
                        lineHeight: '1.6',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {related.excerpt.substring(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer with Earth-Tone Grounding - The Horizon Principle */}
      <footer
        className="py-12 px-8"
        style={{
          background: '#9B8B7E', // Warm Stone - earth grounding
          borderTop: 'none'
        }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-sm font-light"
            style={{
              letterSpacing: '0.01em',
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            &copy; 2025 COW Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
