# COW Investor Platform - Database Setup Guide

## Overview

This directory contains the complete database schema for the COW Investor Platform MVP, including:
- **cow-investor-platform-schema.sql** - Complete SQL schema with all tables, indexes, and RLS policies
- **types.ts** - TypeScript type definitions for use in applications

## Database Tables

### Core Tables (18 total)

1. **profiles** - User profiles extending auth.users
2. **kyc_applications** - KYC verification and compliance
3. **products** - Investment products (GOLD SWIM, SIRI Z31)
4. **product_tiers** - Pricing tiers for subscription products
5. **cart_items** - Shopping cart
6. **orders** - Completed purchases
7. **order_items** - Line items for orders
8. **subscriptions** - Recurring subscriptions
9. **payment_transactions** - Payment history and audit trail
10. **assets** - User holdings and portfolio
11. **goals** - Financial goals/missions
12. **campaigns** - Collective investment campaigns
13. **campaign_participants** - Campaign participation tracking
14. **support_tickets** - Customer support tickets
15. **support_messages** - Support ticket messages
16. **companies** - Company/organization accounts
17. **teams** - Team member management
18. **audit_log** - System audit trail for compliance

## Deployment Instructions

### Option 1: Deploy via Supabase Dashboard (Recommended for initial setup)

1. **Access your Supabase project**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Run the migration**
   - Go to SQL Editor
   - Create a new query
   - Copy the entire contents of `cow-investor-platform-schema.sql`
   - Paste into the query editor
   - Click "Run" to execute

3. **Verify deployment**
   ```sql
   -- Check that all tables were created
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

4. **Verify seed data**
   ```sql
   -- Check GOLD SWIM and SIRI Z31 products
   SELECT slug, name, product_type FROM products;

   -- Check SIRI Z31 pricing tiers
   SELECT pt.name, pt.price, pt.billing_period
   FROM product_tiers pt
   JOIN products p ON p.id = pt.product_id
   WHERE p.slug = 'siri-z31';
   ```

### Option 2: Deploy via Supabase CLI

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
supabase db push

# Or manually run the migration
supabase db execute -f database/cow-investor-platform-schema.sql
```

### Option 3: Deploy to Local Development

```bash
# Start local Supabase
supabase start

# Apply schema
supabase db reset

# Or
psql postgresql://postgres:postgres@localhost:54322/postgres < cow-investor-platform-schema.sql
```

## Environment Setup

### 1. Update your `.env.local` files

Each app needs these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# KYC Provider (Jumio or Onfido)
KYC_PROVIDER=jumio
KYC_API_KEY=your-kyc-api-key
KYC_API_SECRET=your-kyc-api-secret

# Email (SendGrid or Resend)
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=noreply@cyclesofwealth.com
```

### 2. Update Supabase client with types

```typescript
// apps/public-site/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '@cow/database/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Type-safe database operations
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
// ... etc
```

## Using the Database in Your Apps

### Example: Fetch Products

```typescript
import { supabase } from '@/lib/supabase'

// Get all active products
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .order('is_featured', { ascending: false })

// Get GOLD SWIM product with tiers
const { data: goldSwim, error } = await supabase
  .from('products')
  .select(`
    *,
    product_tiers (*)
  `)
  .eq('slug', 'gold-swim')
  .single()
```

### Example: Create Cart Item

```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('cart_items')
  .insert({
    user_id: user.id,
    product_id: productId,
    tier_id: tierId,
    quantity: 1,
    price_at_addition: product.base_price
  })
  .select()
  .single()
```

### Example: Create Order

```typescript
import { supabase } from '@/lib/supabase'

// Create order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    subtotal: 1000.00,
    tax: 0,
    fees: 0,
    total: 1000.00,
    currency: 'USD',
    payment_method: 'card',
    payment_provider: 'stripe',
    payment_intent_id: paymentIntent.id,
    status: 'pending',
    payment_status: 'pending',
    fulfillment_status: 'pending'
  })
  .select()
  .single()

// Add order items
const { data: orderItems, error: itemsError } = await supabase
  .from('order_items')
  .insert(
    cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      tier_id: item.tier_id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.price_at_addition,
      subtotal: item.quantity * item.price_at_addition
    }))
  )
```

### Example: Submit KYC Application

```typescript
import { supabase } from '@/lib/supabase'

const { data: kycApp, error } = await supabase
  .from('kyc_applications')
  .insert({
    user_id: user.id,
    first_name: formData.firstName,
    last_name: formData.lastName,
    date_of_birth: formData.dob,
    nationality: formData.nationality,
    country_of_residence: formData.country,
    address_line1: formData.address,
    city: formData.city,
    state_province: formData.state,
    postal_code: formData.zip,
    id_document_type: formData.idType,
    id_document_number: formData.idNumber,
    id_document_front_url: frontImageUrl,
    id_document_back_url: backImageUrl,
    selfie_url: selfieUrl,
    status: 'pending',
    aml_check_status: 'pending',
    accredited_investor_claim: formData.isAccredited
  })
  .select()
  .single()
```

## Row Level Security (RLS)

The schema includes comprehensive RLS policies to ensure:

1. **Users can only access their own data**
   - Profiles, orders, assets, goals, etc.

2. **Products are publicly readable**
   - Active products visible to all users
   - Admin-only write access

3. **Support tickets are private**
   - Users see only their tickets
   - Admins see all tickets (needs admin role setup)

4. **KYC data is strictly controlled**
   - Users can view/submit their own KYC
   - Admin review requires elevated permissions

### Adding Admin Access

To add admin-only access, you'll need to:

1. Create an `admin_users` table or add `is_admin` flag to profiles
2. Create admin policies for protected tables
3. Example admin policy:

```sql
-- Allow admins to view all KYC applications
CREATE POLICY "Admins can view all KYC applications" ON kyc_applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = TRUE
        )
    );
```

## Data Migration

### Migrating from Mock Data

1. **Export existing user data** (if any)
2. **Map to new schema**
3. **Import using INSERT statements** or Supabase client

Example migration script:

```typescript
// migrate-mock-data.ts
import { supabase } from './lib/supabase'
import mockData from './mock-data.json'

async function migrateMockData() {
  // Migrate users to profiles
  for (const user of mockData.users) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.name,
      // ... map other fields
    })
  }

  // Migrate products
  for (const product of mockData.products) {
    await supabase.from('products').insert({
      slug: product.slug,
      name: product.name,
      // ... map other fields
    })
  }
}
```

## Monitoring & Maintenance

### Useful Queries

```sql
-- Count users by KYC status
SELECT kyc_status, COUNT(*)
FROM profiles
GROUP BY kyc_status;

-- Total orders by status
SELECT status, COUNT(*), SUM(total) as total_revenue
FROM orders
GROUP BY status;

-- Active subscriptions
SELECT COUNT(*) FROM subscriptions WHERE status = 'active';

-- Support ticket metrics
SELECT status, priority, COUNT(*)
FROM support_tickets
GROUP BY status, priority
ORDER BY priority DESC, status;
```

### Backup Recommendations

1. **Enable Supabase automatic backups** (daily)
2. **Periodic manual exports** of critical tables
3. **Test restore procedures** regularly

## Troubleshooting

### Common Issues

**Issue: RLS prevents admin access**
- Solution: Create admin role system or temporarily disable RLS for admin operations

**Issue: Unique constraint violations**
- Solution: Check for existing data before INSERT operations

**Issue: Foreign key constraints**
- Solution: Ensure referenced records exist before creating related records

**Issue: Schema changes in production**
- Solution: Use migrations, never drop tables in production

## Next Steps

After deploying the database:

1. ✅ Update all Supabase client imports to use typed client
2. ✅ Remove mock data from applications
3. ✅ Implement KYC verification service integration
4. ✅ Set up Stripe webhook handlers
5. ✅ Implement email notification system
6. ✅ Add admin dashboard functionality
7. ✅ Set up monitoring and alerts
8. ✅ Conduct security audit
9. ✅ Load test with realistic data

## Support

For questions or issues:
- Check Supabase docs: https://supabase.com/docs
- Review RLS policies: https://supabase.com/docs/guides/auth/row-level-security
- Database best practices: https://supabase.com/docs/guides/database

---

**Last Updated:** October 28, 2025
**Schema Version:** 1.0.0 (MVP)
