# COW Investor Platform - Architecture & User Flow

**Date:** October 28, 2025
**Status:** MVP Architecture Definition

---

## Application Architecture

### Investor-Facing Applications

**1. COW-Products-Site** (`/Projects/COW-Products-Site/`)
- **Purpose:** Public website + Investor portal
- **Technology:** Next.js
- **Routes:**
  - `/` - Public homepage (products, about, etc.)
  - `/client/dashboard` - **INVESTOR DASHBOARD** (after login)
  - `/client/missions` - Investor missions/goals
  - `/client/collective` - Collective solutions
  - `/client/applications` - Investment applications
  - `/client/analytics` - Portfolio analytics
  - `/client/settings` - Account settings
  - **Authentication:** Supabase Auth
  - **Database:** Shared Supabase database

**2. Support Center** (`/Projects/cow/apps/support-center/`)
- **Purpose:** Investor-facing support ticket submission
- **Users:** Investors create and track support tickets
- **Functionality:**
  - Submit support tickets
  - View ticket status
  - Message back and forth with staff
  - Upload attachments

### Staff-Facing Applications

**3. Missions App** (`/Projects/cow/apps/missions-app/`)
- **Purpose:** Staff tool for order servicing and support
- **Users:** COW staff members
- **Functionality:**
  - Order fulfillment dashboard
  - Support ticket management
  - Customer relationship management
  - KYC review and approval
  - Portfolio servicing

**4. Admin Portal** (`/Projects/cow/apps/admin-portal/`)
- **Purpose:** Platform administration
- **Users:** Administrators
- **Functionality:**
  - User management
  - Product management (CRUD)
  - System configuration
  - Compliance reporting
  - Audit log viewing

---

## Complete User Journey

### Investor Flow

#### 1. Discovery & Registration
```
Public visitor → COW-Products-Site (/)
  ↓
Browse products (GOLD SWIM, SIRI Z31)
  ↓
Click "Invest Now" or "Sign Up"
  ↓
Create account (Supabase Auth)
  → Email: signup confirmation
  → Database: creates profile record
```

#### 2. Login & Dashboard Access
```
Returning investor → COW-Products-Site (/)
  ↓
Click "Login" → Auth Modal
  ↓
Enter credentials (Supabase Auth)
  ↓
Redirected to → /client/dashboard
  ↓
**INVESTOR DASHBOARD** displays:
  - Portfolio overview
  - Active investments
  - Mission progress
  - Recent activity
```

#### 3. KYC Verification (Required before purchasing)
```
Investor Dashboard → "Complete KYC" prompt
  ↓
/client/kyc-verification
  ↓
Fill out KYC form:
  - Personal information
  - Upload ID documents
  - Upload selfie
  - Accredited investor claim (if applicable)
  ↓
Submit → Creates kyc_applications record
  ↓
Email notification: "KYC Submitted"
  ↓
Staff reviews in Missions App
  ↓
Approval/Rejection → Email notification
  ↓
Profile updated: kyc_status = 'approved'
```

#### 4. Product Purchase
```
Investor Dashboard → Browse Products
  ↓
Select GOLD SWIM or SIRI Z31
  ↓
Add to cart → Creates cart_items record
  ↓
/client/cart → Review cart
  ↓
Proceed to checkout → /client/checkout
  ↓
Enter payment info (Stripe)
  ↓
Complete purchase:
  → Creates order record
  → Creates order_items records
  → Creates payment_transaction record
  → Email: Order confirmation
  ↓
Order sent to Missions App for fulfillment
```

#### 5. Order Servicing (Staff handles in Missions App)
```
Order created → Notification to staff
  ↓
Missions App → Order Queue
  ↓
Staff processes order:
  - Verify payment
  - Issue tokens (blockchain transaction)
  - Update order status: 'fulfilled'
  - Create asset records for investor
  ↓
Email to investor: "Investment complete"
  ↓
Investor Dashboard shows new assets
```

#### 6. Support Request
```
Investor needs help → Navigate to Support Center app
  ↓
Create support ticket:
  - Select category (KYC, payment, technical, general)
  - Describe issue
  - Upload attachments
  ↓
Submit → Creates support_ticket record
  ↓
Email: "Ticket created #TICKET-20251028-000001"
  ↓
Ticket appears in Missions App for staff
  ↓
Staff responds via Missions App
  ↓
Investor receives email notification
  ↓
Investor can reply via Support Center
  ↓
Ticket resolved → Status updated
```

---

## Database Flow

### User Authentication & Profiles
```sql
auth.users (Supabase Auth)
  ↓
profiles (our table)
  - id (references auth.users)
  - email, full_name, phone
  - wallet_address
  - kyc_status
  - investor_type
```

### KYC Flow
```sql
Investor submits KYC
  ↓
INSERT INTO kyc_applications
  - user_id
  - personal_info (name, DOB, address)
  - id_documents (URLs)
  - status = 'pending'
  ↓
Staff reviews in Missions App
  ↓
UPDATE kyc_applications
  SET status = 'approved', reviewed_by = staff_id
  ↓
UPDATE profiles
  SET kyc_status = 'approved'
```

### Purchase Flow
```sql
Investor adds to cart
  ↓
INSERT INTO cart_items
  - user_id, product_id, quantity, price_at_addition
  ↓
Checkout initiated
  ↓
INSERT INTO orders
  - user_id, total, payment_status = 'pending'
  ↓
INSERT INTO order_items
  - order_id, product_id, quantity, unit_price
  ↓
Stripe payment processed
  ↓
INSERT INTO payment_transactions
  - order_id, amount, provider = 'stripe', status = 'succeeded'
  ↓
UPDATE orders
  SET payment_status = 'captured', status = 'processing'
  ↓
Staff fulfills in Missions App
  ↓
Blockchain transaction (issue tokens)
  ↓
UPDATE order_items
  SET tokens_issued = true, token_transaction_hash = '0x...'
  ↓
INSERT INTO assets
  - user_id, product_id, quantity, cost_basis
  ↓
UPDATE orders
  SET status = 'completed', fulfillment_status = 'fulfilled'
```

### Support Flow
```sql
Investor creates ticket in Support Center
  ↓
INSERT INTO support_tickets
  - user_id, subject, description, status = 'open'
  - ticket_number = 'TICKET-20251028-000001' (auto-generated)
  ↓
Staff views in Missions App
  ↓
UPDATE support_tickets
  SET assigned_to = staff_id, status = 'in_progress'
  ↓
Staff responds
  ↓
INSERT INTO support_messages
  - ticket_id, sender_id = staff_id, message
  ↓
Investor replies via Support Center
  ↓
INSERT INTO support_messages
  - ticket_id, sender_id = user_id, message
  ↓
Resolved
  ↓
UPDATE support_tickets
  SET status = 'resolved', resolved_at = NOW()
```

---

## Application Roles & Permissions

### Role: Investor (Customer)
**Access:**
- ✅ COW-Products-Site `/client/*` routes
- ✅ Support Center (submit and view own tickets)
- ❌ Missions App (no access)
- ❌ Admin Portal (no access)

**Permissions:**
- View own profile, orders, assets, goals
- Submit KYC applications
- Purchase products
- Manage cart
- Create support tickets
- View own support tickets
- Message on own tickets

### Role: Staff (Servicing Team)
**Access:**
- ✅ Missions App (full access)
- ✅ COW-Products-Site `/staff/dashboard`
- ❌ Admin Portal (limited or no access)

**Permissions:**
- View all orders
- Process/fulfill orders
- View and respond to all support tickets
- Assign tickets to themselves
- Update order statuses
- Issue tokens (if granted)
- View customer profiles (read-only)

### Role: Admin (Platform Administrator)
**Access:**
- ✅ Admin Portal (full access)
- ✅ Missions App (full access)
- ✅ COW-Products-Site (full access)

**Permissions:**
- All staff permissions, plus:
- Manage users (create, edit, disable)
- Manage products (CRUD)
- Review and approve KYC applications
- View compliance reports
- View audit logs
- Manage system configuration
- Manage staff accounts

---

## Database Access Patterns

### Investor Dashboard Queries
```typescript
// Get investor's portfolio
const { data: assets } = await supabase
  .from('assets')
  .select('*, products(*)')
  .eq('user_id', userId)

// Get investor's orders
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, products(*))')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// Get investor's goals
const { data: goals } = await supabase
  .from('goals')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
```

### Missions App Queries (Staff)
```typescript
// Get pending orders
const { data: orders } = await supabase
  .from('orders')
  .select('*, order_items(*, products(*)), profiles(*)')
  .eq('status', 'processing')
  .eq('payment_status', 'captured')
  .order('created_at', { ascending: true })

// Get open support tickets
const { data: tickets } = await supabase
  .from('support_tickets')
  .select('*, profiles(*)')
  .in('status', ['open', 'in_progress'])
  .order('priority', { ascending: false })

// Get KYC applications pending review
const { data: kycApps } = await supabase
  .from('kyc_applications')
  .select('*, profiles(*)')
  .eq('status', 'pending')
  .order('submitted_at', { ascending: true })
```

### Admin Portal Queries
```typescript
// Get all users with KYC status
const { data: users } = await supabase
  .from('profiles')
  .select('*, kyc_applications(*)')
  .order('created_at', { ascending: false })

// Get revenue metrics
const { data: revenue } = await supabase
  .from('orders')
  .select('total, created_at')
  .eq('status', 'completed')

// Get audit logs
const { data: logs } = await supabase
  .from('audit_log')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(100)
```

---

## Email Notification Triggers

### Investor Notifications
| Event | Trigger | Email Type |
|-------|---------|-----------|
| Account Created | After signup | Welcome email + confirmation |
| KYC Submitted | KYC form submission | Confirmation + next steps |
| KYC Approved | Staff approves | Approval + can now invest |
| KYC Rejected | Staff rejects | Rejection + reason + resubmit |
| Order Created | After checkout | Order confirmation + receipt |
| Order Fulfilled | Tokens issued | Investment complete + portfolio link |
| Ticket Created | Support ticket submitted | Ticket confirmation + number |
| Ticket Response | Staff responds | New message notification |
| Ticket Resolved | Ticket closed | Resolution confirmation |

### Staff Notifications
| Event | Trigger | Email Type |
|-------|---------|-----------|
| New Order | Order created | New order to fulfill |
| New Support Ticket | Ticket created | New ticket alert |
| KYC Submitted | KYC form submitted | New KYC to review |
| Payment Failed | Stripe webhook | Payment issue alert |

---

## Security & RLS Policies

### Investor RLS Policies (Already Implemented)
```sql
-- Investors can only see their own data
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (auth.uid() = user_id);
```

### Staff RLS Policies (To Be Added)
```sql
-- Staff can view all orders and tickets
CREATE POLICY "Staff can view all orders" ON orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'staff'
        )
    );

CREATE POLICY "Staff can update orders" ON orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );
```

---

## Next Steps to Implement This Architecture

### Phase 1A: Update Database Schema
- [ ] Add `role` field to profiles table ('investor', 'staff', 'admin')
- [ ] Add staff-specific RLS policies
- [ ] Add admin-specific RLS policies

### Phase 1B: Update COW-Products-Site
- [ ] Ensure login redirects to `/client/dashboard`
- [ ] Update Supabase client to use typed database
- [ ] Connect investor dashboard to real database (remove mock data)
- [ ] Build KYC submission form
- [ ] Build checkout flow
- [ ] Integrate Stripe

### Phase 1C: Update Missions App
- [ ] Build order fulfillment queue
- [ ] Build support ticket dashboard
- [ ] Build KYC review interface
- [ ] Connect to shared Supabase database

### Phase 1D: Update Support Center
- [ ] Build ticket submission form
- [ ] Build ticket viewing/messaging interface
- [ ] Connect to shared Supabase database

### Phase 1E: Email Integration
- [ ] Set up SendGrid or Resend
- [ ] Create email templates
- [ ] Set up email triggers (webhooks or database triggers)

---

## Summary

**Investor Journey:**
1. Sign up/login via **COW-Products-Site**
2. Access dashboard at `/client/dashboard`
3. Complete KYC
4. Purchase products (GOLD SWIM, SIRI Z31)
5. Submit support tickets via **Support Center**

**Staff Journey:**
1. Access **Missions App**
2. Process orders (fulfill, issue tokens)
3. Handle support tickets
4. Review KYC applications

**Data Flow:**
1. All apps share one Supabase database
2. RLS policies ensure data isolation
3. Audit logging tracks all actions
4. Email notifications keep everyone informed

---

**This architecture is now clearly defined and ready for implementation!**

