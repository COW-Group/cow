import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Settings,
  Users,
  CreditCard,
  Shield,
  Trash2,
  Upload,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { supabasePermissionsService } from '../../services/supabase-permissions.service';
import { Database } from '../../lib/supabase';

type Organization = Database['public']['Tables']['organizations']['Row'];

export function OrganizationSettings() {
  const navigate = useNavigate();
  const { classes } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'billing' | 'security'>('general');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar_url: '',
    settings: {
      allowPublicBoards: false,
      requireTwoFactor: false,
      allowGuestAccess: true,
    },
  });

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      const currentUser = await supabasePermissionsService.getCurrentUserProfile();

      if (!currentUser.organization_id) {
        console.warn('User has no organization');
        return;
      }

      const org = await supabasePermissionsService.getOrganization(currentUser.organization_id);
      setOrganization(org);

      setFormData({
        name: org.name,
        description: org.description || '',
        avatar_url: org.avatar_url || '',
        settings: org.settings || {
          allowPublicBoards: false,
          requireTwoFactor: false,
          allowGuestAccess: true,
        },
      });
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!organization) return;

    try {
      setSaving(true);
      await supabasePermissionsService.updateOrganization(organization.id, {
        name: formData.name,
        description: formData.description,
        avatar_url: formData.avatar_url,
        settings: formData.settings,
      });

      alert('Organization settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving organization:', error);
      alert(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading organization...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Organization</h3>
          <p className="text-gray-500 mt-2">You don't belong to an organization yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {organization.avatar_url ? (
                <img
                  src={organization.avatar_url}
                  alt={organization.name}
                  className="h-12 w-12 rounded-lg"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {organization.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{organization.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Organization Settings</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex space-x-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* Organization Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Information</h2>

              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Organization Logo
                  </label>
                  <div className="flex items-center space-x-6">
                    {formData.avatar_url ? (
                      <img
                        src={formData.avatar_url}
                        alt="Organization logo"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                        <span>Upload Logo</span>
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: Square image, at least 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Inc."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your organization..."
                  />
                </div>

                {/* Plan Info */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Plan
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        You are currently on the <span className="font-semibold capitalize">{organization.plan}</span> plan
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Allow Public Boards</div>
                    <div className="text-sm text-gray-500">Members can make boards visible to anyone</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowPublicBoards}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowPublicBoards: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Allow Guest Access</div>
                    <div className="text-sm text-gray-500">External users can be invited to boards</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.allowGuestAccess}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: { ...formData.settings, allowGuestAccess: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">Danger Zone</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-red-900">Delete Organization</div>
                        <div className="text-sm text-red-700">Permanently delete this organization and all its data</div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Members Management</h3>
              <p className="text-gray-500 mt-2">Member management UI will be added here</p>
              <button
                onClick={() => navigate('/app/organization/members')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Members Page
              </button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Current Plan</div>
                  <div className="text-2xl font-semibold text-gray-900 capitalize mt-1">{organization.plan}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Organization Type</div>
                  <div className="text-2xl font-semibold text-gray-900 capitalize mt-1">{organization.type}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Billing features coming soon...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Require Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">All members must enable 2FA to access the organization</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.requireTwoFactor}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, requireTwoFactor: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Session Management</h3>
                <p className="text-sm text-gray-500">Security features coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
