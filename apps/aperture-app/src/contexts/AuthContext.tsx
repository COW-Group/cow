/**
 * AuthContext - Manages authentication state and user sessions
 * Provides authentication functionality throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { supabasePermissionsService, UserWithRoles } from '../services/supabase-permissions.service';

interface AuthContextType {
  user: User | null;
  userProfile: UserWithRoles | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  // Permission helpers
  isEcosystemAdmin: boolean;
  isPlatformAdmin: boolean;
  isAccountAdmin: (organizationId: string) => boolean;
  hasRole: (role: string, contextType?: string, contextId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserWithRoles | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEcosystemAdmin, setIsEcosystemAdmin] = useState(false);
  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);

  // Load initial session
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        console.log('🔄 AuthContext: Loading session...');

        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession) {
          console.log('✅ AuthContext: Session found, loading profile...');
          setSession(currentSession);
          setUser(currentSession.user);

          try {
            // Load user profile with 10s timeout
            const profilePromise = supabasePermissionsService.getCurrentUserProfile();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile loading timeout')), 10000)
            );

            const profile = await Promise.race([profilePromise, timeoutPromise]) as any;

            if (!mounted) return;

            console.log('✅ AuthContext: Profile loaded', profile);
            setUserProfile(profile);

            // Check admin roles in parallel
            if (profile) {
              const [ecosystem, platform] = await Promise.all([
                supabasePermissionsService.isEcosystemAdmin(profile.id),
                supabasePermissionsService.isPlatformAdmin(profile.id)
              ]);

              if (!mounted) return;

              setIsEcosystemAdmin(ecosystem);
              setIsPlatformAdmin(platform);
            }
          } catch (profileError) {
            console.error('⚠️ AuthContext: Error loading profile (continuing anyway):', profileError);
            // Continue without profile - don't block login
            if (mounted) {
              setUserProfile(null);
            }
          }
        } else {
          console.log('ℹ️ AuthContext: No session found');
        }
      } catch (error) {
        console.error('❌ AuthContext: Error loading session:', error);
      } finally {
        if (mounted) {
          console.log('✅ AuthContext: Loading complete');
          setLoading(false);
        }
      }
    }

    loadSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log('🔔 Auth state changed:', event);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          console.log('✅ Auth change: User signed in, loading profile...');

          try {
            // Reload user profile with 10s timeout
            const profilePromise = supabasePermissionsService.getCurrentUserProfile();
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile loading timeout')), 10000)
            );

            const profile = await Promise.race([profilePromise, timeoutPromise]) as any;

            console.log('✅ Auth change: Profile loaded', profile);
            setUserProfile(profile);

            if (profile) {
              const [ecosystem, platform] = await Promise.all([
                supabasePermissionsService.isEcosystemAdmin(profile.id),
                supabasePermissionsService.isPlatformAdmin(profile.id)
              ]);
              setIsEcosystemAdmin(ecosystem);
              setIsPlatformAdmin(platform);
            }
          } catch (error) {
            console.error('⚠️ Auth change: Error loading profile (continuing anyway):', error);
            // Continue without profile - don't block login
            setUserProfile(null);
          }
        } else {
          console.log('ℹ️ Auth change: User signed out');
          setUserProfile(null);
          setIsEcosystemAdmin(false);
          setIsPlatformAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  // Sign up new user
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          full_name: fullName || null,
          is_active: true,
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
      setIsEcosystemAdmin(false);
      setIsPlatformAdmin(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return;

    const profile = await supabasePermissionsService.getCurrentUserProfile();
    setUserProfile(profile);

    if (profile) {
      const [ecosystem, platform] = await Promise.all([
        supabasePermissionsService.isEcosystemAdmin(profile.id),
        supabasePermissionsService.isPlatformAdmin(profile.id)
      ]);
      setIsEcosystemAdmin(ecosystem);
      setIsPlatformAdmin(platform);
    }
  };

  // Check if user is account admin of specific organization
  const isAccountAdmin = (organizationId: string): boolean => {
    if (!userProfile) return false;

    return userProfile.roles.some(
      (role) =>
        role.role === 'account_admin' &&
        role.context_type === 'organization' &&
        role.context_id === organizationId &&
        role.is_active
    );
  };

  // Generic role check
  const hasRole = (role: string, contextType?: string, contextId?: string): boolean => {
    if (!userProfile) return false;

    return userProfile.roles.some(
      (r) =>
        r.role === role &&
        r.is_active &&
        (!contextType || r.context_type === contextType) &&
        (!contextId || r.context_id === contextId)
    );
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
    isEcosystemAdmin,
    isPlatformAdmin,
    isAccountAdmin,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
