# COW Investor Platform - Clarified Architecture Summary

**Date:** October 28, 2025
**Status:** Confirmed Architecture

---

## ✅ CONFIRMED: User Flow Architecture

### INVESTOR JOURNEY

```
1. VISIT
   ↓
   COW-Products-Site (/) - Public Homepage
   - Marketing content
   - Product information
   - About COW

2. LOGIN
   ↓
   Click "Login" → Supabase Auth Modal
   - Email/password authentication
   - Creates session

3. REDIRECT TO DASHBOARD
   ↓
   /client/dashboard - INVESTOR DASHBOARD
   - Portfolio overview
   - Mission tracking
   - Recent activity

4. BROWSE & PURCHASE (Within Dashboard Area)
   ↓
   /client/products → Browse GOLD SWIM, SIRI Z31
   ↓
   Add to cart → /client/cart
   ↓
   Checkout → /client/checkout
   - Payment via Stripe
   - Creates order
   ↓
   Order confirmation
   - Email sent
   - Order appears in dashboard

5. ORDER SERVICING (Staff handles)
   ↓
   Order appears in Missions App for STAFF
   - Staff processes order
   - Tokens issued
   - Order marked complete
   ↓
   Investor sees updated assets in dashboard

6. SUPPORT (If needed)
   ↓
   Investor visits Support Center app
   - Creates support ticket
   - Ticket appears in Missions App for STAFF
   - Staff responds
   - Investor receives email notifications
```

---

## 🏗️ APPLICATION BREAKDOWN

### 1. **COW-Products-Site** (Investor Portal)

**URL Structure:**
- `/` → Public homepage (unauthenticated)
- `/about`, `/products` → Public pages
- `/client/dashboard` → **INVESTOR DASHBOARD** (authenticated)
- `/client/products` → Product browsing (authenticated)
- `/client/cart` → Shopping cart (authenticated)
- `/client/checkout` → Checkout flow (authenticated)
- `/client/portfolio` → Portfolio view (authenticated)
- `/client/missions` → Missions/goals (authenticated)
- `/client/settings` → Account settings (authenticated)

**Database Access:**
- Reads: `products`, `product_tiers`, `assets`, `goals`, `orders`, `campaigns`
- Writes: `cart_items`, `orders`, `order_items`, `kyc_applications`, `goals`
- User role: `investor`

---

### 2. **Support Center** (Investor Support)

**Purpose:** Investors submit and track support tickets

**Features:**
- Create support tickets
- View own tickets
- Reply to messages
- Upload attachments
- Track resolution status

**Database Access:**
- Reads: `support_tickets`, `support_messages` (own tickets only)
- Writes: `support_tickets`, `support_messages`
- User role: `investor`

---

### 3. **Missions App** (Staff Servicing Tool)

**Purpose:** Staff processes orders and handles support

**Features:**
- **Order Queue:** View all pending orders
- **Order Fulfillment:** Process payments, issue tokens
- **Support Dashboard:** View and respond to all support tickets
- **KYC Review:** Approve/reject KYC applications
- **Customer Management:** View investor profiles

**Database Access:**
- Reads: ALL tables (staff has broader access)
- Writes: `orders`, `order_items`, `payment_transactions`, `assets`, `support_tickets`, `support_messages`, `kyc_applications`
- User role: `staff`

---

### 4. **Admin Portal** (Platform Administration)

**Purpose:** Platform-wide management

**Features:**
- User management (CRUD)
- Product management (CRUD for GOLD SWIM, SIRI Z31)
- Compliance reporting
- Audit log viewing
- System configuration

**Database Access:**
- Reads: ALL tables
- Writes: ALL tables (full admin access)
- User role: `admin`

---

## 📊 DATABASE SCHEMA STATUS

### ✅ COMPLETED

**18 Tables Created:**
1. `profiles` - User accounts (now with `role` field)
2. `kyc_applications` - KYC/compliance
3. `products` - GOLD SWIM, SIRI Z31
4. `product_tiers` - Pricing tiers
5. `cart_items` - Shopping cart
6. `orders` - Purchase orders
7. `order_items` - Order line items
8. `subscriptions` - Recurring billing (SIRI Z31)
9. `payment_transactions` - Payment audit trail
10. `assets` - Portfolio holdings
11. `goals` - Financial goals/missions
12. `campaigns` - Collective campaigns
13. `campaign_participants` - Campaign tracking
14. `support_tickets` - Customer support
15. `support_messages` - Ticket conversations
16. `companies` - Institutional accounts
17. `teams` - Team management
18. `audit_log` - Compliance audit trail

**Security Implemented:**
- ✅ Row Level Security (RLS) policies for all tables
- ✅ Role-based access control (investor, staff, admin)
- ✅ Audit logging for compliance
- ✅ Automatic timestamps and triggers

**Seed Data:**
- ✅ GOLD SWIM product pre-configured
- ✅ SIRI Z31 product with 3 pricing tiers

---

## 🔐 ROLE-BASED ACCESS CONTROL

### Investor Role
**Can:**
- ✅ View own profile, orders, assets, goals
- ✅ Browse products (after login)
- ✅ Add to cart, checkout
- ✅ Submit KYC applications
- ✅ Create support tickets
- ✅ View own support tickets

**Cannot:**
- ❌ View other users' data
- ❌ Access Missions App
- ❌ Access Admin Portal
- ❌ Manage products

### Staff Role
**Can:**
- ✅ View ALL orders
- ✅ Process/fulfill orders
- ✅ View ALL support tickets
- ✅ Respond to support tickets
- ✅ Review KYC applications
- ✅ View customer profiles

**Cannot:**
- ❌ Manage products (read-only)
- ❌ Access admin functions
- ❌ Delete user data

### Admin Role
**Can:**
- ✅ All staff permissions
- ✅ Manage users (CRUD)
- ✅ Manage products (CRUD)
- ✅ View compliance reports
- ✅ View audit logs
- ✅ System configuration

---

## 🔄 COMPLETE DATA FLOW

### Purchase Flow (Order → Servicing)

```
INVESTOR (products-site)
  ↓
1. Browse products in /client/products
   SELECT * FROM products WHERE is_active = true

2. Add to cart
   INSERT INTO cart_items (user_id, product_id, quantity, price_at_addition)

3. Checkout
   a. INSERT INTO orders (user_id, total, status='pending')
   b. INSERT INTO order_items (order_id, product_id, quantity)
   c. Process Stripe payment
   d. INSERT INTO payment_transactions (order_id, amount, provider='stripe')
   e. UPDATE orders SET payment_status='captured', status='processing'

4. Email notification sent to investor

  ↓
STAFF (missions-app)
  ↓
5. Order appears in queue
   SELECT * FROM orders WHERE status='processing'

6. Staff fulfills order
   a. Blockchain transaction (issue tokens)
   b. UPDATE order_items SET tokens_issued=true, token_transaction_hash='0x...'
   c. INSERT INTO assets (user_id, product_id, quantity, cost_basis)
   d. UPDATE orders SET status='completed', fulfillment_status='fulfilled'

7. Email notification sent to investor

  ↓
INVESTOR (products-site)
  ↓
8. Dashboard updated
   SELECT * FROM assets WHERE user_id = current_user
   → Shows new investment
```

### Support Flow (Ticket → Resolution)

```
INVESTOR (support-center)
  ↓
1. Create support ticket
   INSERT INTO support_tickets (user_id, subject, description, status='open')
   → Ticket number auto-generated: TICKET-20251028-000001

2. Email confirmation sent

  ↓
STAFF (missions-app)
  ↓
3. Ticket appears in support dashboard
   SELECT * FROM support_tickets WHERE status IN ('open', 'in_progress')

4. Staff responds
   a. UPDATE support_tickets SET assigned_to=staff_id, status='in_progress'
   b. INSERT INTO support_messages (ticket_id, sender_id, message)

5. Email notification sent to investor

  ↓
INVESTOR (support-center)
  ↓
6. Investor views response
   SELECT * FROM support_messages WHERE ticket_id = ticket.id

7. Investor replies
   INSERT INTO support_messages (ticket_id, sender_id, message)

8. Email notification sent to staff

  ↓
STAFF (missions-app)
  ↓
9. Staff resolves
   UPDATE support_tickets SET status='resolved', resolved_at=NOW()

10. Email confirmation sent to investor
```

---

## 📁 FILES CREATED

### Database Files (in `/Projects/cow/database/`)

1. **cow-investor-platform-schema.sql** (1,100 lines)
   - Complete database schema
   - 18 tables with RLS policies
   - GOLD SWIM and SIRI Z31 seed data

2. **migration-add-roles.sql** (200 lines)
   - Adds `role` field to profiles
   - Adds staff and admin RLS policies
   - Helper functions for role checking

3. **types.ts** (600+ lines)
   - TypeScript type definitions
   - Type-safe database operations

4. **README.md**
   - Deployment guide
   - Usage examples
   - Troubleshooting

### Documentation Files (in `/Projects/cow/`)

5. **ARCHITECTURE_FLOW.md**
   - Complete architecture documentation
   - User journeys
   - Database access patterns

6. **CLARIFIED_ARCHITECTURE_SUMMARY.md** (this file)
   - Final confirmed architecture
   - Role-based access control
   - Complete data flows

7. **MVP_PROGRESS_REPORT.md**
   - Current status
   - Next steps roadmap
   - Quick start guide

---

## 🚀 READY TO DEPLOY

### Step 1: Deploy Database (15 minutes)

```bash
# Option A: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Open SQL Editor
3. Run cow-investor-platform-schema.sql
4. Run migration-add-roles.sql
5. Verify: SELECT * FROM products;
```

### Step 2: Update Applications (Week 1-2)

**COW-Products-Site:**
- [ ] Update Supabase client with typed Database
- [ ] Connect `/client/dashboard` to real data
- [ ] Build product browsing in `/client/products`
- [ ] Build cart in `/client/cart`
- [ ] Build checkout in `/client/checkout`
- [ ] Remove all mock data

**Missions App:**
- [ ] Build order queue
- [ ] Build order fulfillment workflow
- [ ] Build support ticket dashboard
- [ ] Build KYC review interface

**Support Center:**
- [ ] Build ticket submission form
- [ ] Build ticket viewing interface
- [ ] Build messaging interface

### Step 3: Integrations (Week 2-4)

- [ ] Stripe payment processing
- [ ] Email notifications (SendGrid/Resend)
- [ ] KYC provider (Jumio/Onfido)
- [ ] Blockchain token issuance

---

## ✅ SUMMARY

**Architecture Confirmed:**
- ✅ Investors log in through COW-Products-Site
- ✅ Dashboard access at `/client/dashboard`
- ✅ Product purchase within authenticated area
- ✅ Orders serviced through Missions App by staff
- ✅ Support tickets submitted via Support Center
- ✅ All apps share one Supabase database
- ✅ Role-based access control enforced

**Database Ready:**
- ✅ 18 tables created
- ✅ GOLD SWIM and SIRI Z31 pre-seeded
- ✅ RLS policies for security
- ✅ Role-based permissions
- ✅ Audit logging enabled

**Next Action:**
Deploy the database schema to Supabase and start connecting the applications!

---

**Questions or Ready to Proceed?**

