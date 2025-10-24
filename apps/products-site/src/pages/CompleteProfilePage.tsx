import React from 'react'
import { ComprehensiveOnboardingContainer } from '@/components/comprehensive-onboarding'

/**
 * Complete Profile Page
 *
 * This page hosts the comprehensive 14-step onboarding flow.
 * Users are directed here from the dashboard after completing
 * the simple 3-step goal-based onboarding.
 *
 * The comprehensive flow includes:
 * - Phase 1: Welcome (Steps 1-2)
 * - Phase 2: Wealth Journey (Steps 3-10)
 * - Phase 3: Investor Classification (Steps 11-13)
 * - Phase 4: Account Setup (Step 14)
 *
 * Access this page via:
 * - Dashboard "Complete Your Profile" CTA
 * - Navigation menu "Profile" > "Complete Profile"
 */
export default function CompleteProfilePage() {
  return <ComprehensiveOnboardingContainer />
}
