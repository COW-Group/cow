-- ============================================================================
-- SUPABASE STORAGE SETUP
-- ============================================================================
-- This script creates storage buckets and RLS policies for file uploads
-- Run this in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Create Storage Buckets
-- ============================================================================
-- Note: Storage buckets are created via the Supabase Dashboard or API
-- Go to: Storage > Create bucket

-- Bucket: avatars
-- - For user profile avatars
-- - Public: false (authenticated users only)
-- - File size limit: 2MB
-- - Allowed mime types: image/jpeg, image/png, image/webp

-- Bucket: organization-logos
-- - For organization logos
-- - Public: false (authenticated users only)
-- - File size limit: 5MB
-- - Allowed mime types: image/jpeg, image/png, image/svg+xml, image/webp

-- ============================================================================
-- STEP 2: Storage RLS Policies for AVATARS bucket
-- ============================================================================

-- Allow authenticated users to view all avatars
CREATE POLICY "avatars_view_all"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
CREATE POLICY "avatars_upload_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- STEP 3: Storage RLS Policies for ORGANIZATION-LOGOS bucket
-- ============================================================================

-- Allow authenticated users to view all organization logos
CREATE POLICY "org_logos_view_all"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'organization-logos');

-- Allow organization admins/owners to upload logos
CREATE POLICY "org_logos_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'organization-logos'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
    AND om.can_manage_settings = true
  )
);

-- Allow organization admins/owners to update logos
CREATE POLICY "org_logos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'organization-logos'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
    AND om.can_manage_settings = true
  )
);

-- Allow organization admins/owners to delete logos
CREATE POLICY "org_logos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'organization-logos'
  AND EXISTS (
    SELECT 1 FROM public.organization_members om
    WHERE om.user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
    AND om.can_manage_settings = true
  )
);

-- ============================================================================
-- STEP 4: Admin Override Policies
-- ============================================================================

-- Ecosystem and Platform admins can manage all storage
CREATE POLICY "storage_admin_all_access"
ON storage.objects FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role IN ('ecosystem_admin', 'platform_admin')
    AND ur.is_active = true
  )
);

-- ============================================================================
-- MANUAL STEPS (Must be done in Supabase Dashboard)
-- ============================================================================

-- 1. Go to Storage in Supabase Dashboard
-- 2. Create bucket 'avatars':
--    - Name: avatars
--    - Public: false
--    - File size limit: 2097152 (2MB)
--    - Allowed mime types: image/jpeg,image/png,image/webp
--
-- 3. Create bucket 'organization-logos':
--    - Name: organization-logos
--    - Public: false
--    - File size limit: 5242880 (5MB)
--    - Allowed mime types: image/jpeg,image/png,image/svg+xml,image/webp
--
-- 4. After creating buckets, run the SQL policies above

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if buckets exist
SELECT * FROM storage.buckets WHERE id IN ('avatars', 'organization-logos');

-- Check storage policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;

-- ============================================================================
-- FILE PATH STRUCTURE
-- ============================================================================

-- Avatars:
-- avatars/{user_id}/{filename}
-- Example: avatars/123e4567-e89b-12d3-a456-426614174000/avatar.jpg

-- Organization Logos:
-- organization-logos/{organization_id}/{filename}
-- Example: organization-logos/456e7890-e89b-12d3-a456-426614174000/logo.png

-- ============================================================================
