/**
 * Demo page for Comprehensive Onboarding Flow
 *
 * This page demonstrates the usage of the comprehensive onboarding system.
 * In production, this would be integrated into the main app routing.
 *
 * Usage:
 * - Navigate to /onboarding-demo to test the onboarding flow
 * - Complete steps 1-2 (Phase 1: Welcome)
 * - Observe state management and routing
 * - Test audio/TTS features
 * - Verify dark mode support
 */

import type React from 'react'
import { ComprehensiveOnboardingContainer } from '@/components/comprehensive-onboarding'

export const OnboardingDemo: React.FC = () => {
  return (
    <div className="min-h-screen">
      <ComprehensiveOnboardingContainer />
    </div>
  )
}

export default OnboardingDemo
