# Brother's App Integration with Products-Site

**Date**: 2025-10-16
**Purpose**: Integrate brother's performance tracking app with COW products-site for gold asset performance and projections

---

## Overview

### Products-Site (COW)
- **Location**: `/Users/likhitha/Projects/cow/apps/products-site`
- **Port**: http://localhost:3001
- **Purpose**: Performance Real-World Asset Tokens site (gold: AuSIRI, AuAERO)
- **Authentication**: Mock auth with localStorage (auth-context.tsx)
- **Data**: User holdings, portfolio performance, analytics

### Brother's App
- **Location**: His own GitHub repository
- **Infrastructure**: His own v0 + Supabase
- **Purpose**: Track gold performance and generate projections
- **Integration Need**: Pull gold data from products-site when users log in

---

## Data Available in Products-Site

### User Holdings (from DashboardPage.tsx)
```typescript
interface Holding {
  id: string
  tokenType: "founder" | "asset"
  tokenName: string          // "AuSIRI", "AuAERO"
  amount: number             // Initial investment
  currentValue: number       // Current value
  performance: number        // Performance percentage
  createdAt: string         // Acquisition date
}
```

### Performance Metrics (from Dashboard)
- **Portfolio Totals**:
  - Total Value
  - Total Invested
  - Total Returns (dollar amount)
  - Total Performance (percentage)

- **Time-Based Returns**:
  - 7-Day Return: +2.4%
  - 30-Day Return: +8.7%
  - 90-Day Return: +18.2%
  - All-Time Return

- **Risk Metrics**:
  - Portfolio Volatility
  - Diversification Score
  - Performance Stability

---

## Integration Architecture

### Option 1: REST API Integration (Recommended)

**Flow**:
```
Brother's App → API Request → Products-Site API → Return JSON Data
```

**Pros**:
- Clean separation of concerns
- Easy to version and maintain
- Standard authentication (JWT tokens)
- Can rate limit and monitor

**Cons**:
- Requires API setup in products-site
- Need to handle authentication across apps

### Option 2: Shared Database (Supabase)

**Flow**:
```
Both Apps → Shared Supabase Database → Same user_holdings table
```

**Pros**:
- Real-time data sync via Supabase Realtime
- No API layer needed
- Direct database access with RLS

**Cons**:
- Tight coupling between apps
- Requires same Supabase project or connection
- Both apps need same authentication

### Option 3: Webhook/Event-Driven

**Flow**:
```
Products-Site → Event (user login, data update) → Webhook → Brother's App
```

**Pros**:
- Real-time updates
- Loosely coupled
- Brother's app can cache data

**Cons**:
- More complex setup
- Need webhook infrastructure
- Requires secure endpoint on brother's app

---

## Recommended Approach: REST API + Shared Auth

### Phase 1: Authentication Integration

**Step 1: Unified Supabase Auth** (if both apps use Supabase)

```typescript
// products-site and brother's app use SAME Supabase project

// products-site: /lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,  // Share with brother
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // Share with brother
)

// Brother's app: /lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,  // Same URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // Same key
)
```

**Benefits**:
- Same user session works across both apps
- User logs in once, authenticated in both
- Supabase handles all auth complexity

**Step 2: Cross-Origin Auth Token Sharing**

If brother's app is on different domain:
```typescript
// products-site: When user logs in
const handleLogin = async () => {
  const { session } = await supabase.auth.signInWithPassword({...})

  // Send session token to brother's app
  const iframe = document.getElementById('brother-app-iframe')
  iframe.postMessage({
    type: 'AUTH_TOKEN',
    token: session.access_token,
    user: session.user
  }, 'https://brother-app-domain.com')
}

// Brother's app: Listen for auth token
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://products-site-domain.com') return

  if (event.data.type === 'AUTH_TOKEN') {
    // Use token to authenticate with Supabase
    supabase.auth.setSession({
      access_token: event.data.token,
      refresh_token: event.data.refresh_token
    })
  }
})
```

### Phase 2: Create Products-Site API

**Create API routes in products-site:**

```typescript
// apps/products-site/src/api/holdings.ts

import { supabase } from '@/lib/supabase'

export interface HoldingsResponse {
  holdings: Holding[]
  totals: {
    totalValue: number
    totalInvested: number
    totalReturns: number
    totalPerformance: number
  }
  analytics: {
    sevenDayReturn: number
    thirtyDayReturn: number
    ninetyDayReturn: number
    allTimeReturn: number
  }
  riskMetrics: {
    volatility: 'low' | 'medium' | 'high'
    diversificationScore: number
    performanceStability: 'low' | 'medium' | 'high'
  }
}

// GET /api/user/holdings
export async function getUserHoldings(userId: string): Promise<HoldingsResponse> {
  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  // Fetch holdings from Supabase (or mock data for now)
  const holdings = await fetchUserHoldings(userId)

  // Calculate totals
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.amount, 0)
  const totalReturns = totalValue - totalInvested
  const totalPerformance = (totalReturns / totalInvested) * 100

  // Return complete data
  return {
    holdings,
    totals: { totalValue, totalInvested, totalReturns, totalPerformance },
    analytics: {
      sevenDayReturn: 2.4,
      thirtyDayReturn: 8.7,
      ninetyDayReturn: 18.2,
      allTimeReturn: totalPerformance
    },
    riskMetrics: {
      volatility: 'low',
      diversificationScore: 72,
      performanceStability: 'high'
    }
  }
}

// GET /api/user/projections
export async function getPerformanceProjections(
  userId: string,
  timeframe: '1month' | '3month' | '6month' | '1year'
): Promise<ProjectionsResponse> {
  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== userId) throw new Error('Unauthorized')

  // Get historical performance
  const holdings = await fetchUserHoldings(userId)

  // Calculate projections based on historical data
  // This would use your brother's projection algorithms
  const projections = calculateProjections(holdings, timeframe)

  return projections
}
```

**Setup Express or Next.js API routes:**

```typescript
// apps/products-site/src/pages/api/user/holdings.ts (if using Next.js)

import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserHoldings } from '@/api/holdings'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user ID from query or auth token
    const userId = req.query.userId as string

    // Verify auth token from header
    const authToken = req.headers.authorization?.replace('Bearer ', '')
    if (!authToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Fetch holdings
    const data = await getUserHoldings(userId)

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
```

### Phase 3: Brother's App Integration

**In brother's app:**

```typescript
// Brother's app: /services/cow-api.ts

interface CowApiClient {
  getHoldings: (userId: string) => Promise<HoldingsResponse>
  getProjections: (userId: string, timeframe: string) => Promise<ProjectionsResponse>
}

class CowApiService implements CowApiClient {
  private baseUrl = 'http://localhost:3001/api' // or production URL
  private authToken: string | null = null

  setAuthToken(token: string) {
    this.authToken = token
  }

  async getHoldings(userId: string): Promise<HoldingsResponse> {
    const response = await fetch(`${this.baseUrl}/user/holdings?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch holdings: ${response.statusText}`)
    }

    return response.json()
  }

  async getProjections(
    userId: string,
    timeframe: '1month' | '3month' | '6month' | '1year'
  ): Promise<ProjectionsResponse> {
    const response = await fetch(
      `${this.baseUrl}/user/projections?userId=${userId}&timeframe=${timeframe}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch projections: ${response.statusText}`)
    }

    return response.json()
  }
}

export const cowApi = new CowApiService()
```

**Usage in brother's app:**

```typescript
// Brother's app: /pages/PerformanceTracker.tsx

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { cowApi } from '@/services/cow-api'

export default function PerformanceTracker() {
  const { user, session } = useAuth()
  const [holdings, setHoldings] = useState(null)
  const [projections, setProjections] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !session) return

      try {
        // Set auth token from Supabase session
        cowApi.setAuthToken(session.access_token)

        // Fetch holdings from products-site
        const holdingsData = await cowApi.getHoldings(user.id)
        setHoldings(holdingsData)

        // Fetch projections
        const projectionsData = await cowApi.getProjections(user.id, '6month')
        setProjections(projectionsData)

      } catch (error) {
        console.error('Failed to fetch COW data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, session])

  if (loading) return <div>Loading performance data...</div>

  return (
    <div>
      <h1>Gold Performance Tracker</h1>

      {/* Display holdings from products-site */}
      <section>
        <h2>Your Holdings</h2>
        {holdings?.holdings.map(holding => (
          <div key={holding.id}>
            <h3>{holding.tokenName}</h3>
            <p>Current Value: ${holding.currentValue}</p>
            <p>Performance: {holding.performance}%</p>
          </div>
        ))}
      </section>

      {/* Display projections calculated by brother's app */}
      <section>
        <h2>6-Month Projections</h2>
        {projections && (
          <div>
            <p>Projected Value: ${projections.projectedValue}</p>
            <p>Expected Return: {projections.expectedReturn}%</p>
          </div>
        )}
      </section>
    </div>
  )
}
```

### Phase 4: CORS Configuration

**In products-site:**

```typescript
// apps/products-site/src/middleware.ts (if Next.js)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get origin from request
  const origin = request.headers.get('origin')

  // Allow brother's app origin
  const allowedOrigins = [
    'http://localhost:5173',  // Brother's dev server
    'https://brother-app.vercel.app',  // Brother's production
  ]

  // Create response with CORS headers
  const response = NextResponse.next()

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## Implementation Checklist

### Phase 1: Shared Authentication Setup
- [ ] Decide if both apps will use same Supabase project
- [ ] Share Supabase credentials with brother securely (1Password)
- [ ] Test auth works in both apps with same credentials
- [ ] Implement cross-origin token sharing if needed

### Phase 2: Products-Site API Development
- [ ] Create `/api/user/holdings` endpoint
- [ ] Create `/api/user/projections` endpoint
- [ ] Add authentication middleware
- [ ] Test API endpoints with Postman/curl

### Phase 3: Brother's App Integration
- [ ] Create `cow-api` service in brother's app
- [ ] Implement holdings fetch
- [ ] Implement projections fetch
- [ ] Test integration locally

### Phase 4: Security & CORS
- [ ] Configure CORS in products-site
- [ ] Add rate limiting (optional)
- [ ] Add API key/token validation
- [ ] Test cross-origin requests

### Phase 5: Testing & Deployment
- [ ] Test full flow: login → fetch data → display
- [ ] Test error handling (network errors, auth failures)
- [ ] Deploy products-site API
- [ ] Deploy brother's app
- [ ] Test in production

---

## Environment Variables

### To Share with Brother

**Products-Site (Supabase):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Products-Site API (for brother's app to call):**
```bash
NEXT_PUBLIC_COW_API_URL=http://localhost:3001/api  # Dev
NEXT_PUBLIC_COW_API_URL=https://products-site.vercel.app/api  # Production
```

**Share via**:
- 1Password shared vault
- Bitwarden organization
- Doppler secrets manager
- **NOT** via email/Slack/text

---

## Alternative: Embed Brother's App in Products-Site

If integration is complex, consider embedding brother's app as iframe:

```typescript
// products-site: /pages/PerformanceTracker.tsx

export default function PerformanceTrackerPage() {
  const { session } = useAuth()

  return (
    <div className="min-h-screen">
      <h1>Performance Tracker</h1>

      {/* Embed brother's app */}
      <iframe
        src={`https://brother-app.vercel.app?token=${session.access_token}`}
        width="100%"
        height="800px"
        style={{ border: 'none' }}
      />
    </div>
  )
}
```

**Pros**:
- Simple integration
- Brother maintains full control
- No API needed

**Cons**:
- iframe limitations (styling, interactions)
- Possible CORS issues
- Less seamless UX

---

## Next Steps

**Immediate Actions:**

1. **Clarify Architecture**: Decide between:
   - REST API integration (recommended)
   - Shared database
   - Iframe embed

2. **Share Credentials**: If using same Supabase, share:
   - Supabase URL
   - Supabase anon key
   - Via 1Password or similar

3. **Start with API Endpoints**: Create simple endpoint in products-site:
   - `/api/user/holdings` that returns mock data
   - Brother can test calling it

4. **Brother Builds Integration**: Brother creates `cow-api` service
   - Tests calling products-site API
   - Displays data in his app

---

## Questions to Clarify

1. Does brother's app already have authentication set up?
2. Is brother using Supabase or different auth?
3. What URL/domain will brother's app be hosted on?
4. What specific projections does brother want to calculate?
5. How real-time does data need to be? (polling vs webhooks vs realtime)

Let me know and I'll help implement! 🚀
