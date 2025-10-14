import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@cow/supabase-client';
import { useAppStore } from '../store/app.store';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useAppStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      // Update app store with user info
      if (authUser) {
        setCurrentUser({
          id: authUser.id,
          email: authUser.email || '',
          fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          avatar: authUser.user_metadata?.avatar_url,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: new Date(authUser.created_at),
          updatedAt: new Date(),
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              mentions: true,
              dueDates: true,
              statusUpdates: true,
            },
            sidebarCollapsed: false,
            favoriteItems: [],
            recentlyViewed: [],
          },
        });
      } else {
        // No authenticated user - set a default dev user
        setCurrentUser({
          id: 'dev-user-1',
          email: 'likhitha@cowgroup.com',
          fullName: 'Likhitha Palaypu',
          name: 'Likhitha Palaypu',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: new Date(),
          updatedAt: new Date(),
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              mentions: true,
              dueDates: true,
              statusUpdates: true,
            },
            sidebarCollapsed: false,
            favoriteItems: [],
            recentlyViewed: [],
          },
        });
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      // Update app store
      if (authUser) {
        setCurrentUser({
          id: authUser.id,
          email: authUser.email || '',
          fullName: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          avatar: authUser.user_metadata?.avatar_url,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          createdAt: new Date(authUser.created_at),
          updatedAt: new Date(),
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              mentions: true,
              dueDates: true,
              statusUpdates: true,
            },
            sidebarCollapsed: false,
            favoriteItems: [],
            recentlyViewed: [],
          },
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setCurrentUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signOut,
  };
}
