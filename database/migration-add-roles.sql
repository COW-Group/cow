-- Migration: Add role-based access control
-- Date: October 28, 2025
-- Purpose: Add roles to support investor, staff, and admin access patterns

-- Add role column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'investor' CHECK (role IN ('investor', 'staff', 'admin'));

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update existing users to have 'investor' role
UPDATE profiles SET role = 'investor' WHERE role IS NULL;

-- Add staff-specific RLS policies for orders
CREATE POLICY IF NOT EXISTS "Staff can view all orders" ON orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Staff can update orders" ON orders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

-- Add staff-specific RLS policies for support tickets
CREATE POLICY IF NOT EXISTS "Staff can view all support tickets" ON support_tickets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Staff can update support tickets" ON support_tickets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Staff can insert support messages" ON support_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

-- Add staff-specific RLS policies for KYC applications
CREATE POLICY IF NOT EXISTS "Staff can view all KYC applications" ON kyc_applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY IF NOT EXISTS "Staff can update KYC applications" ON kyc_applications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('staff', 'admin')
        )
    );

-- Add admin-specific RLS policies for profiles
CREATE POLICY IF NOT EXISTS "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'admin'
        )
    );

-- Add admin-specific RLS policies for products (CRUD)
CREATE POLICY IF NOT EXISTS "Admins can insert products" ON products
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can update products" ON products
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY IF NOT EXISTS "Admins can delete products" ON products
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add admin-specific RLS policies for audit log
CREATE POLICY IF NOT EXISTS "Admins can view all audit logs" ON audit_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Grant permissions for staff and admin roles
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON support_tickets TO authenticated;
GRANT ALL ON support_messages TO authenticated;
GRANT ALL ON kyc_applications TO authenticated;
GRANT ALL ON products TO authenticated;

-- Create helper function to check if user is staff
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role IN ('staff', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment to document roles
COMMENT ON COLUMN profiles.role IS 'User role: investor (default), staff (can view/manage orders and support), admin (full platform access)';

-- Migration complete
-- Next steps:
-- 1. Update TypeScript types to include 'role' field
-- 2. Update applications to check user role
-- 3. Assign staff and admin roles to appropriate users
