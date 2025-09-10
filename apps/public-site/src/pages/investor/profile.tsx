"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '../../lib/auth-context'
import InvestorLayout from '../../components/layout/InvestorLayout'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Alert } from '../../components/ui/alert'
import type { UserProfile, KYCData, AccreditationData } from '../../lib/types'

export default function InvestorProfile() {
  const { auth, loading: authLoading, updateProfile } = useAuthContext()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [kycData, setKycData] = useState<KYCData | null>(null)
  const [accreditationData, setAccreditationData] = useState<AccreditationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (auth.user && !authLoading) {
      loadProfileData()
    }
  }, [auth.user, authLoading])

  useEffect(() => {
    if (auth.profile) {
      setProfile(auth.profile)
      setProfileForm({
        name: auth.profile.name || '',
        email: auth.profile.email || '',
        avatar_url: auth.profile.avatar_url || ''
      })
    }
  }, [auth.profile])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const { databaseService } = await import('../../lib/database-service')

      const [kycResult, accreditationResult] = await Promise.all([
        databaseService.fetchUserKYC(auth.user!.id),
        databaseService.fetchUserAccreditation(auth.user!.id)
      ])

      setKycData(kycResult)
      setAccreditationData(accreditationResult)
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.user) return

    try {
      setSaving(true)
      setMessage(null)

      await updateProfile({
        name: profileForm.name,
        avatar_url: profileForm.avatar_url
      })

      setEditingProfile(false)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleKYCSubmission = async () => {
    try {
      setSaving(true)
      setMessage(null)
      
      const { databaseService } = await import('../../lib/database-service')
      await databaseService.updateKYCStatus(auth.user!.id, 'pending', 'KYC documents submitted for review')
      
      await loadProfileData()
      setMessage({ type: 'success', text: 'KYC submission started. You will receive further instructions via email.' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to start KYC process' })
    } finally {
      setSaving(false)
    }
  }

  const handleAccreditationSubmission = async () => {
    try {
      setSaving(true)
      setMessage(null)
      
      const { databaseService } = await import('../../lib/database-service')
      await databaseService.updateAccreditationStatus(auth.user!.id, 'pending')
      
      await loadProfileData()
      setMessage({ type: 'success', text: 'Accreditation verification started. You will receive further instructions via email.' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to start accreditation process' })
    } finally {
      setSaving(false)
    }
  }

  const getKYCStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getAccreditationStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/4"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Access Required</h2>
          <p className="text-gray-600 text-center mb-6">Please sign in to access your profile.</p>
          <Button className="w-full">
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <InvestorLayout 
      currentPath="/investor/profile"
      title="Profile & Verification"
      description="Manage your profile and compliance verification status"
    >
      <div className="max-w-4xl mx-auto p-6">

        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <p className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </p>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              {!editingProfile && (
                <Button variant="outline" onClick={() => setEditingProfile(true)}>
                  Edit Profile
                </Button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL (Optional)</label>
                  <Input
                    type="url"
                    value={profileForm.avatar_url}
                    onChange={(e) => setProfileForm({...profileForm, avatar_url: e.target.value})}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingProfile(false)
                      setProfileForm({
                        name: profile?.name || '',
                        email: profile?.email || '',
                        avatar_url: profile?.avatar_url || ''
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{profile?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                      {profile?.role || 'Investor'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
                {profile?.avatar_url && (
                  <div className="flex justify-center">
                    <img
                      src={profile.avatar_url}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* KYC Verification */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">KYC Verification</h3>
              {kycData ? getKYCStatusBadge(kycData.status) : (
                <span className="text-sm text-gray-500">Not started</span>
              )}
            </div>

            {kycData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-gray-900">{kycData.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">{new Date(kycData.submittedAt).toLocaleDateString()}</p>
                  </div>
                  {kycData.reviewedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reviewed</label>
                      <p className="text-gray-900">{new Date(kycData.reviewedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {kycData.expiresAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expires</label>
                      <p className="text-gray-900">{new Date(kycData.expiresAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                {kycData.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-gray-600 text-sm">{kycData.notes}</p>
                  </div>
                )}
                {kycData.status === 'rejected' && (
                  <Button onClick={handleKYCSubmission} disabled={saving}>
                    {saving ? 'Processing...' : 'Resubmit KYC'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Complete KYC verification to access all investment features</p>
                <p className="text-sm text-gray-500 mb-6">
                  Know Your Customer (KYC) verification is required for compliance with financial regulations
                </p>
                <Button onClick={handleKYCSubmission} disabled={saving}>
                  {saving ? 'Starting...' : 'Start KYC Verification'}
                </Button>
              </div>
            )}
          </Card>

          {/* Accreditation Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Accreditation Status</h3>
              {accreditationData ? getAccreditationStatusBadge(accreditationData.status) : (
                <span className="text-sm text-gray-500">Not started</span>
              )}
            </div>

            {accreditationData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-gray-900">{accreditationData.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-gray-900 capitalize">{accreditationData.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Submitted</label>
                    <p className="text-gray-900">{new Date(accreditationData.submittedAt).toLocaleDateString()}</p>
                  </div>
                  {accreditationData.verifiedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Verified</label>
                      <p className="text-gray-900">{new Date(accreditationData.verifiedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {accreditationData.expiresAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expires</label>
                      <p className="text-gray-900">{new Date(accreditationData.expiresAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
                {accreditationData.status === 'rejected' && (
                  <Button onClick={handleAccreditationSubmission} disabled={saving}>
                    {saving ? 'Processing...' : 'Resubmit Accreditation'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Get accredited investor status to access exclusive opportunities</p>
                <p className="text-sm text-gray-500 mb-6">
                  Accredited investors can access higher-risk, higher-reward investment opportunities with higher investment minimums
                </p>
                <Button onClick={handleAccreditationSubmission} disabled={saving}>
                  {saving ? 'Starting...' : 'Start Accreditation Process'}
                </Button>
              </div>
            )}
          </Card>

          {/* Account Security */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-600">Last updated: Unknown</p>
                </div>
                <Button variant="outline">
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </InvestorLayout>
  )
}