export interface ResearchArticle {
  id: string
  title: string
  slug: string
  category: string // RED Pillar
  tags: string[]
  excerpt: string
  date: string
  readTime: string
  featured: boolean
  imageUrl?: string
  authors: string[]
  content?: string
  // Academic metadata
  paperNumber?: string
  pageCount?: number
  citations?: number
  externalUrl?: string // Link to peer-reviewed article if published externally
  doi?: string
  keywords?: string[]
  // RED Framework metadata
  pillar: string // One of the 5 RED pillars
  verticals?: string[] // Asset verticals this research covers
}

// 5 RED Research Pillars
export const researchPillars = [
  'Wealth Diagnostics & Market Analysis',
  'Wealth Dynamics and Perspectives',
  'Asset Performance Engineering',
  'Financial Architecture & Program Design',
  'Implementation Research'
] as const

// Asset Verticals - Gold featured most prominently
export const assetVerticals = [
  'Gold',
  'Solar Energy',
  'Water Resources',
  'Carbon Markets',
  'Electric Vehicles',
  'Rice Agriculture',
  'Residential Property',
  'Aquaculture'
] as const

// Legacy - keep for backward compatibility, maps to pillars
export const researchCategories = researchPillars

export const researchTags = [
  'algorithmic-optimization',
  'risk-management',
  'asset-longevity',
  'supply-chain',
  'market-efficiency',
  'portfolio-construction',
  'regulatory-frameworks',
  'tokenization',
  'liquidity-dynamics',
  'stakeholder-analysis',
  'climate-transition',
  'wealth-persistence',
  'startup-wealth',
  'business-growth-wealth',
  'enterprise-wealth',
  'founder-economics',
  'employee-wealth-programs'
] as const

export const featuredResearch: ResearchArticle[] = [
  {
    id: '1',
    title: 'Tokenized Gold Performance: A Multi-Jurisdictional Analysis of Bullion-Backed Digital Assets',
    slug: 'tokenized-gold-performance-analysis',
    category: 'Asset Performance Engineering',
    pillar: 'Asset Performance Engineering',
    verticals: ['Gold'],
    tags: ['algorithmic-optimization', 'tokenization', 'asset-longevity'],
    excerpt: 'We analyze performance characteristics of tokenized gold investments across 15 jurisdictions, examining 3.2 million transactions representing $8.4B in cumulative volume. Algorithmic rebalancing strategies demonstrate 3.8-6.2% annual alpha over passive physical bullion holdings, with superior liquidity and fractional ownership benefits.',
    date: '2024-12-15',
    readTime: '54 pages',
    featured: true,
    authors: ['M. Santos', 'K. Patel', 'COW Research Institute'],
    paperNumber: 'WP-2024-01',
    pageCount: 54,
    citations: 187,
    externalUrl: 'https://doi.org/10.1016/j.example.2024.001',
    keywords: ['gold', 'tokenization', 'commodity markets', 'performance analysis', 'precious metals']
  },
  {
    id: '16',
    title: 'Portfolio Diagnostics for Startup Founders: Risk Assessment in Concentrated Equity Positions',
    slug: 'startup-founder-portfolio-diagnostics',
    category: 'Wealth Diagnostics & Market Analysis',
    pillar: 'Wealth Diagnostics & Market Analysis',
    tags: ['startup-wealth', 'founder-economics', 'risk-management', 'portfolio-construction'],
    excerpt: 'We analyze wealth concentration risk among 1,847 startup founders across tech, biotech, and cleantech sectors. Median equity concentration of 87% in single illiquid asset creates systematic vulnerability. Tokenized diversification strategies enabling fractional liquidity without triggering tax events demonstrate 34% risk reduction while preserving 89% of upside participation.',
    date: '2024-08-15',
    readTime: '46 pages',
    featured: true,
    authors: ['J. Chen', 'A. Patel', 'COW Research Institute'],
    paperNumber: 'WP-2024-16',
    pageCount: 46,
    citations: 78,
    keywords: ['startup founders', 'equity concentration', 'risk management', 'wealth diagnostics', 'tokenization']
  },
  {
    id: '3',
    title: 'Behavioral Factors in Precious Metal Investment: Evidence from Gold Token Adoption',
    slug: 'behavioral-gold-investment-analysis',
    category: 'Wealth Dynamics and Perspectives',
    pillar: 'Wealth Dynamics and Perspectives',
    verticals: ['Gold'],
    tags: ['stakeholder-analysis', 'tokenization', 'market-efficiency'],
    excerpt: 'Cross-country analysis of 45,000 investor adoption patterns in tokenized gold products reveals significant behavioral biases affecting investment decisions. Loss aversion and status quo bias account for 67% of variance in gold allocation decisions, with educational interventions demonstrating 34% improvement in optimal allocation strategies.',
    date: '2024-11-28',
    readTime: '48 pages',
    featured: true,
    authors: ['L. Morrison', 'T. Nguyen', 'COW Research Institute'],
    paperNumber: 'WP-2024-02',
    pageCount: 48,
    citations: 156,
    externalUrl: 'https://doi.org/10.1016/j.example.2024.002',
    keywords: ['behavioral finance', 'gold', 'investor psychology', 'adoption patterns']
  }
]

export const allResearch: ResearchArticle[] = [
  ...featuredResearch,
  // More Wealth Diagnostics Research
  {
    id: '2',
    title: 'Systematic Risk Assessment in Household Wealth Portfolios: A Diagnostic Framework',
    slug: 'household-wealth-risk-assessment',
    category: 'Wealth Diagnostics & Market Analysis',
    pillar: 'Wealth Diagnostics & Market Analysis',
    tags: ['risk-management', 'portfolio-construction', 'wealth-persistence'],
    excerpt: 'We introduce a comprehensive diagnostic framework for evaluating wealth portfolio health across income quintiles. Analysis of 12,400 households reveals systematic underexposure to asset-backed securities and overconcentration in single-asset classes, with median portfolio resilience scores of 4.2/10 across mid-income segments.',
    date: '2024-12-08',
    readTime: '41 pages',
    featured: false,
    authors: ['R. Chen', 'A. Dubois', 'COW Research Institute'],
    paperNumber: 'WP-2024-03',
    pageCount: 41,
    citations: 124,
    keywords: ['wealth diagnostics', 'risk assessment', 'portfolio health', 'household finance']
  },
  // More Gold Research
  {
    id: '4',
    title: 'Gold Accumulation Programs: Structured Wealth Building Through Fractional Bullion Ownership',
    slug: 'gold-accumulation-program-design',
    category: 'Financial Architecture & Program Design',
    pillar: 'Financial Architecture & Program Design',
    verticals: ['Gold'],
    tags: ['portfolio-construction', 'tokenization', 'wealth-persistence'],
    excerpt: 'We present a framework for structured gold accumulation programs enabling systematic wealth building through fractional ownership. Analysis of 8,600 participants over 36 months shows median portfolio growth of 127% with 89% retention rates, significantly outperforming traditional savings vehicles.',
    date: '2024-11-20',
    readTime: '39 pages',
    featured: false,
    authors: ['S. Kimura', 'J. O\'Brien', 'COW Research Institute'],
    paperNumber: 'WP-2024-04',
    pageCount: 39,
    citations: 92
  },
  // Applied Wealth Solutions
  {
    id: '5',
    title: 'Implementation Outcomes in Structured Gold Savings Programs: A 12-Month Pilot Study',
    slug: 'gold-savings-implementation-outcomes',
    category: 'Implementation Research',
    pillar: 'Implementation Research',
    verticals: ['Gold'],
    tags: ['wealth-persistence', 'portfolio-construction', 'tokenization'],
    excerpt: 'We evaluate real-world outcomes from 2,400 participants in structured gold accumulation pilots across three countries. Median wealth increase of 89% over 12 months, with 94% program completion rates and 78% participants continuing beyond initial commitment period.',
    date: '2024-11-12',
    readTime: '36 pages',
    featured: false,
    authors: ['A. Kowalski', 'M. Zhang', 'COW Research Institute'],
    paperNumber: 'WP-2024-05',
    pageCount: 36,
    citations: 103
  },
  // Solar Energy Research
  {
    id: '6',
    title: 'Solar Energy Asset Tokenization: Performance Characteristics in Distributed Generation',
    slug: 'solar-asset-tokenization',
    category: 'Asset Performance Engineering',
    pillar: 'Asset Performance Engineering',
    verticals: ['Solar Energy'],
    tags: ['tokenization', 'asset-longevity', 'market-efficiency'],
    excerpt: 'Analysis of 340 tokenized solar installations across 12 jurisdictions reveals consistent yield characteristics of 4.8-7.3% annually. Token structures enabling fractional ownership in solar farms demonstrate strong retail investor appeal with 156% oversubscription in initial offerings.',
    date: '2024-11-05',
    readTime: '42 pages',
    featured: false,
    authors: ['E. Ramirez', 'N. Singh', 'COW Research Institute'],
    paperNumber: 'WP-2024-06',
    pageCount: 42,
    citations: 87,
    externalUrl: 'https://doi.org/10.1016/j.example.2024.006'
  },
  // Multi-Dimensional Studies - Legal Perspective
  {
    id: '7',
    title: 'Regulatory Frameworks for Commodity-Backed Tokens: A Comparative Legal Analysis',
    slug: 'commodity-token-regulatory-frameworks',
    category: 'Wealth Dynamics and Perspectives',
    pillar: 'Wealth Dynamics and Perspectives',
    verticals: ['Gold', 'Water Resources'],
    tags: ['regulatory-frameworks', 'tokenization', 'supply-chain'],
    excerpt: 'Comparative analysis of legal frameworks governing commodity tokenization across 23 jurisdictions. Cyprus, Estonia, and Singapore emerge as optimal domiciles for gold-backed tokens, while water rights present unique regulatory challenges requiring jurisdiction-specific structuring approaches.',
    date: '2024-10-28',
    readTime: '61 pages',
    featured: false,
    authors: ['P. Okafor', 'L. Schmidt', 'COW Research Institute'],
    paperNumber: 'WP-2024-07',
    pageCount: 61,
    citations: 142
  },
  // Water Resources Research
  {
    id: '8',
    title: 'Water Resource Asset Valuation: Frameworks for Scarcity-Driven Securities',
    slug: 'water-resource-asset-valuation',
    category: 'Wealth Diagnostics & Market Analysis',
    pillar: 'Wealth Diagnostics & Market Analysis',
    verticals: ['Water Resources'],
    tags: ['asset-longevity', 'market-efficiency', 'risk-management'],
    excerpt: 'We develop valuation frameworks for water rights and desalination capacity tokens, analyzing 47 water resource projects across regions of high scarcity. Projected demand growth of 12-18% annually creates compelling investment thesis, with token structures enabling liquid trading of historically illiquid assets.',
    date: '2024-10-20',
    readTime: '44 pages',
    featured: false,
    authors: ['H. Yamamoto', 'C. Williams', 'COW Research Institute'],
    paperNumber: 'WP-2024-08',
    pageCount: 44,
    citations: 98
  },
  // Carbon Markets
  {
    id: '9',
    title: 'Carbon Credit Tokenization: Market Mechanisms and Price Discovery',
    slug: 'carbon-credit-tokenization',
    category: 'Asset Performance Engineering',
    pillar: 'Asset Performance Engineering',
    verticals: ['Carbon Markets'],
    tags: ['tokenization', 'market-efficiency', 'asset-longevity'],
    excerpt: 'Examination of tokenized carbon credit markets reveals improved price discovery and reduced transaction costs relative to traditional voluntary markets. Blockchain-based verification and fractional ownership drive 34% increase in retail participation, with implications for climate transition financing.',
    date: '2024-10-12',
    readTime: '38 pages',
    featured: false,
    authors: ['T. Anderson', 'Y. Park', 'COW Research Institute'],
    paperNumber: 'WP-2024-09',
    pageCount: 38,
    citations: 134
  },
  // EV + Gold Cross-Vertical
  {
    id: '10',
    title: 'Multi-Asset Portfolio Construction: Gold and Electric Vehicle Asset Correlation Analysis',
    slug: 'gold-ev-portfolio-correlation',
    category: 'Financial Architecture & Program Design',
    pillar: 'Financial Architecture & Program Design',
    verticals: ['Gold', 'Electric Vehicles'],
    tags: ['portfolio-construction', 'risk-management', 'asset-longevity'],
    excerpt: 'We document negative correlation (-0.34) between gold and electric vehicle asset classes, providing natural hedging opportunities in multi-asset portfolios. Optimal allocation strategies combining 60-70% gold with 30-40% EV-linked assets demonstrate superior risk-adjusted returns and lower volatility during market stress periods.',
    date: '2024-10-05',
    readTime: '35 pages',
    featured: false,
    authors: ['F. Dubois', 'R. Martinez', 'COW Research Institute'],
    paperNumber: 'WP-2024-10',
    pageCount: 35,
    citations: 91
  },
  // Rice Agriculture
  {
    id: '11',
    title: 'Agricultural Commodity Tokens: Risk-Return Profiles in Rice Production Assets',
    slug: 'rice-agricultural-tokenization',
    category: 'Wealth Dynamics and Perspectives',
    pillar: 'Wealth Dynamics and Perspectives',
    verticals: ['Rice Agriculture'],
    tags: ['supply-chain', 'tokenization', 'asset-longevity'],
    excerpt: 'Analysis of tokenized rice production facilities across Southeast Asia reveals stable yield characteristics with low correlation to traditional financial assets. Long-duration contracts and global staple demand provide defensive portfolio characteristics, appealing to income-focused investors seeking inflation protection.',
    date: '2024-09-28',
    readTime: '40 pages',
    featured: false,
    authors: ['K. Mueller', 'B. Thompson', 'COW Research Institute'],
    paperNumber: 'WP-2024-11',
    pageCount: 40,
    citations: 79
  },
  // Residential Property + Applied Solutions
  {
    id: '12',
    title: 'Fractional Home Ownership Programs: Implementation Framework and Early Results',
    slug: 'fractional-home-ownership-programs',
    category: 'Implementation Research',
    pillar: 'Implementation Research',
    verticals: ['Residential Property'],
    tags: ['tokenization', 'wealth-persistence', 'portfolio-construction'],
    excerpt: 'We present implementation results from fractional residential property ownership pilots in 8 metropolitan areas. Tokenization enables $500 minimum investments in residential real estate, with 3,200 participants achieving home equity exposure previously unavailable at their wealth levels. Early indicators show 12-month appreciation averaging 8.7%.',
    date: '2024-09-18',
    readTime: '47 pages',
    featured: false,
    authors: ['D. Cohen', 'I. Petrov', 'COW Research Institute'],
    paperNumber: 'WP-2024-12',
    pageCount: 47,
    citations: 116
  },
  // Aquaculture
  {
    id: '13',
    title: 'Aquaculture Investment Vehicles: Protein Production Asset Performance Analysis',
    slug: 'aquaculture-investment-analysis',
    category: 'Wealth Diagnostics & Market Analysis',
    pillar: 'Wealth Diagnostics & Market Analysis',
    verticals: ['Aquaculture'],
    tags: ['asset-longevity', 'supply-chain', 'market-efficiency'],
    excerpt: 'We examine performance characteristics of tokenized aquaculture operations across 67 facilities in Norway, Chile, and Southeast Asia. Stable protein demand and constrained supply dynamics generate consistent yields of 9-13% annually, with lower volatility than traditional agriculture while addressing global food security challenges.',
    date: '2024-09-10',
    readTime: '43 pages',
    featured: false,
    authors: ['V. Larsen', 'K. Tanaka', 'COW Research Institute'],
    paperNumber: 'WP-2024-13',
    pageCount: 43,
    citations: 68
  },
  // Cross-Vertical Diagnostic Study
  {
    id: '14',
    title: 'Cross-Vertical Asset Allocation: Opportunity Mapping for Emerging Retail Investors',
    slug: 'cross-vertical-allocation-opportunities',
    category: 'Wealth Diagnostics & Market Analysis',
    pillar: 'Wealth Diagnostics & Market Analysis',
    verticals: ['Gold', 'Solar Energy', 'Water Resources', 'Carbon Markets'],
    tags: ['portfolio-construction', 'risk-management', 'tokenization'],
    excerpt: 'Comprehensive opportunity analysis across eight asset verticals reveals optimal entry points for retail investors. Gold remains foundational (40-50% allocation), with emerging opportunities in solar (15-20%), water (10-15%), and carbon markets (5-10%) providing diversification and growth potential.',
    date: '2024-08-30',
    readTime: '52 pages',
    featured: false,
    authors: ['M. Santos', 'E. Ramirez', 'COW Research Institute'],
    paperNumber: 'WP-2024-14',
    pageCount: 52,
    citations: 145
  },
  // Full-Cycle Economics - Gold
  {
    id: '15',
    title: 'End-to-End Value Analysis in Gold Supply Chains: Extraction to Token Holder',
    slug: 'gold-supply-chain-value-analysis',
    category: 'Wealth Dynamics and Perspectives',
    pillar: 'Wealth Dynamics and Perspectives',
    verticals: ['Gold'],
    tags: ['supply-chain', 'asset-longevity', 'tokenization'],
    excerpt: 'Complete value chain analysis of gold tokenization from extraction through investor holdings. Transparent sourcing and provenance verification add 4.2-6.8% price premiums, while tokenization reduces intermediary costs by 38%. Responsible mining practices correlate with superior long-term token performance.',
    date: '2024-08-22',
    readTime: '58 pages',
    featured: false,
    authors: ['L. Morrison', 'P. Okafor', 'COW Research Institute'],
    paperNumber: 'WP-2024-15',
    pageCount: 58,
    citations: 167,
    externalUrl: 'https://doi.org/10.1016/j.example.2024.015'
  },
  // Business Wealth Research - Growth Stage
  {
    id: '17',
    title: 'Employee Wealth Programs for Growth-Stage Companies: Tokenized Ownership Design and Outcomes',
    slug: 'growth-stage-employee-wealth-programs',
    category: 'Financial Architecture & Program Design',
    pillar: 'Financial Architecture & Program Design',
    tags: ['business-growth-wealth', 'employee-wealth-programs', 'tokenization', 'portfolio-construction'],
    excerpt: 'We present structured employee wealth program frameworks for growth-stage companies (Series B-D), analyzing 43 implementations across 12 industries. Tokenized equity alternatives enabling fractional liquidity pre-IPO demonstrate 67% higher employee retention and 2.3x wealth accumulation versus traditional ESOP structures, with reduced dilution impact on founding shareholders.',
    date: '2024-08-08',
    readTime: '51 pages',
    featured: false,
    authors: ['R. Martinez', 'S. Kimura', 'COW Research Institute'],
    paperNumber: 'WP-2024-17',
    pageCount: 51,
    citations: 92,
    keywords: ['employee ownership', 'growth companies', 'wealth programs', 'tokenization', 'equity compensation']
  },
  // Business Wealth Research - Established Companies
  {
    id: '18',
    title: 'Corporate Wealth Program Implementation: Multi-Year Outcomes from Fortune 1000 Pilots',
    slug: 'corporate-wealth-program-implementation',
    category: 'Implementation Research',
    pillar: 'Implementation Research',
    tags: ['enterprise-wealth', 'employee-wealth-programs', 'wealth-persistence', 'tokenization'],
    excerpt: 'Implementation study of tokenized wealth programs at 17 established enterprises (revenue $500M-$50B) over 24-36 months. Median employee wealth increase of 142% through fractional ownership in company-matched real asset portfolios. Program demonstrates 91% participation rates among eligible employees and 88% retention improvement versus companies without structured wealth initiatives.',
    date: '2024-07-28',
    readTime: '55 pages',
    featured: false,
    authors: ['D. Cohen', 'M. Zhang', 'COW Research Institute'],
    paperNumber: 'WP-2024-18',
    pageCount: 55,
    citations: 134,
    keywords: ['corporate programs', 'employee wealth', 'implementation research', 'established companies', 'retention']
  }
]

export function getResearchBySlug(slug: string): ResearchArticle | undefined {
  return allResearch.find(article => article.slug === slug)
}

export function getResearchByCategory(category: string): ResearchArticle[] {
  return allResearch.filter(article => article.category === category)
}

export function getResearchByPillar(pillar: string): ResearchArticle[] {
  return allResearch.filter(article => article.pillar === pillar)
}

export function getResearchByVertical(vertical: string): ResearchArticle[] {
  return allResearch.filter(article => article.verticals?.includes(vertical))
}

export function getResearchByTag(tag: string): ResearchArticle[] {
  return allResearch.filter(article => article.tags.includes(tag))
}

export function getFeaturedResearch(): ResearchArticle[] {
  return allResearch.filter(article => article.featured)
}

// Get research count by vertical for showcasing
export function getResearchCountByVertical(): Record<string, number> {
  const counts: Record<string, number> = {}
  assetVerticals.forEach(vertical => {
    counts[vertical] = getResearchByVertical(vertical).length
  })
  return counts
}

// Get research count by pillar
export function getResearchCountByPillar(): Record<string, number> {
  const counts: Record<string, number> = {}
  researchPillars.forEach(pillar => {
    counts[pillar] = getResearchByPillar(pillar).length
  })
  return counts
}
