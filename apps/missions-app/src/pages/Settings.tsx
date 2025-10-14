import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Monitor,
  Sun,
  Moon,
  Save,
  Mail,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAppStore } from '../store';
import { supabase } from '@cow/supabase-client';

export function Settings() {
  const navigate = useNavigate();
  const { classes, themeName, toggleTheme } = useAppTheme();
  const { currentUser, setCurrentUser } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: true,
    sound: true,
    marketing: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'team',
    activityStatus: true,
    readReceipts: true
  });

  // Load user profile from Supabase on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Get current auth user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.warn('No authenticated user found');
          setLoading(false);
          return;
        }

        console.log('📥 Loading user profile from Supabase...', user.id);

        // Try to load user profile from profiles table
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - that's ok for new users
          console.error('Error loading profile:', error);
        }

        // Set profile data from Supabase or user metadata
        setProfile({
          fullName: userProfile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          timezone: userProfile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: userProfile?.language || 'English'
        });

        // Set notifications preferences
        if (userProfile?.preferences?.notifications) {
          setNotifications(userProfile.preferences.notifications);
        }

        // Set privacy preferences
        if (userProfile?.preferences?.privacy) {
          setPrivacy(userProfile.preferences.privacy);
        }

      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      // Get current auth user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to save settings');
        return;
      }

      console.log('💾 Saving user profile to Supabase...', user.id);

      // Update user metadata for name
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName
        }
      });

      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
      }

      // Upsert user profile to profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.fullName,
          email: profile.email,
          timezone: profile.timezone,
          language: profile.language,
          preferences: {
            notifications,
            privacy,
            theme: themeName
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error saving profile:', profileError);
        throw profileError;
      }

      console.log('✅ Settings saved successfully');

      // Update app store
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          fullName: profile.fullName,
          name: profile.fullName,
          email: profile.email,
          timezone: profile.timezone,
          preferences: {
            ...currentUser.preferences,
            notifications,
          }
        });
      }

      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      alert(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${classes.bg.primary}`}>
      {/* Header */}
      <div className="glass-header border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/app/dashboard')}
                className={`p-2 ${classes.hover.bg} rounded-full smooth-hover`}
                aria-label="Go back"
              >
                <ArrowLeft className={`h-5 w-5 ${classes.text.muted}`} />
              </button>
              <div>
                <h1 className={`text-3xl font-light ${classes.text.primary} tracking-tight`}>Settings</h1>
                <p className={`text-lg ${classes.text.secondary} mt-2 font-light`}>Manage your account preferences and privacy settings</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center space-x-2 ${classes.button.primary} px-6 py-3 rounded-xl smooth-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
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
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Profile Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <User className={`h-6 w-6 ${classes.text.primary}`} />
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight`}>Profile</h2>
            </div>

            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className={`w-full px-4 py-3 ${classes.bg.tertiary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className={`w-full px-4 py-3 ${classes.bg.tertiary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className={`w-full px-4 py-3 ${classes.bg.tertiary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                    Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className={`w-full px-4 py-3 ${classes.bg.tertiary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Palette className={`h-6 w-6 ${classes.text.primary}`} />
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight`}>Appearance</h2>
            </div>

            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-4`}>
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => themeName !== 'light' && toggleTheme()}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        themeName === 'light'
                          ? 'border-blue-500 bg-blue-50'
                          : `border-gray-300 ${classes.hover.card}`
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                      <div className={`text-sm font-medium ${classes.text.primary}`}>Light</div>
                    </button>

                    <button
                      onClick={() => themeName !== 'dark' && toggleTheme()}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        themeName === 'dark'
                          ? 'border-blue-500 bg-blue-50'
                          : `border-gray-300 ${classes.hover.card}`
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div className={`text-sm font-medium ${classes.text.primary}`}>Dark</div>
                    </button>

                    <button
                      className={`p-4 rounded-lg border-2 border-gray-300 ${classes.hover.card} transition-all`}
                    >
                      <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                      <div className={`text-sm font-medium ${classes.text.primary}`}>System</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Bell className={`h-6 w-6 ${classes.text.primary}`} />
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight`}>Notifications</h2>
            </div>

            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${classes.text.muted}`} />
                    <div>
                      <div className={`font-medium ${classes.text.primary}`}>Email Notifications</div>
                      <div className={`text-sm ${classes.text.muted}`}>Receive notifications via email</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className={`h-5 w-5 ${classes.text.muted}`} />
                    <div>
                      <div className={`font-medium ${classes.text.primary}`}>Push Notifications</div>
                      <div className={`text-sm ${classes.text.muted}`}>Receive push notifications on mobile</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor className={`h-5 w-5 ${classes.text.muted}`} />
                    <div>
                      <div className={`font-medium ${classes.text.primary}`}>Desktop Notifications</div>
                      <div className={`text-sm ${classes.text.muted}`}>Show notifications on desktop</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.desktop}
                      onChange={(e) => setNotifications({ ...notifications, desktop: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {notifications.sound ? (
                      <Volume2 className={`h-5 w-5 ${classes.text.muted}`} />
                    ) : (
                      <VolumeX className={`h-5 w-5 ${classes.text.muted}`} />
                    )}
                    <div>
                      <div className={`font-medium ${classes.text.primary}`}>Sound Notifications</div>
                      <div className={`text-sm ${classes.text.muted}`}>Play sound for notifications</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.sound}
                      onChange={(e) => setNotifications({ ...notifications, sound: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${classes.text.muted}`} />
                    <div>
                      <div className={`font-medium ${classes.text.primary}`}>Marketing Emails</div>
                      <div className={`text-sm ${classes.text.muted}`}>Receive product updates and tips</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.marketing}
                      onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className={`h-6 w-6 ${classes.text.primary}`} />
              <h2 className={`text-2xl font-light ${classes.text.primary} tracking-tight`}>Privacy & Security</h2>
            </div>

            <div className={`${classes.bg.secondary} rounded-2xl p-8 border ${classes.border.default}`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${classes.text.primary} mb-2`}>
                    Profile Visibility
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    className={`w-full px-4 py-3 ${classes.bg.tertiary} rounded-lg border ${classes.border.default} ${classes.text.primary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="public">Public</option>
                    <option value="team">Team Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${classes.text.primary}`}>Show Activity Status</div>
                    <div className={`text-sm ${classes.text.muted}`}>Let others see when you're online</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.activityStatus}
                      onChange={(e) => setPrivacy({ ...privacy, activityStatus: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${classes.text.primary}`}>Read Receipts</div>
                    <div className={`text-sm ${classes.text.muted}`}>Show when you've read messages</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.readReceipts}
                      onChange={(e) => setPrivacy({ ...privacy, readReceipts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}