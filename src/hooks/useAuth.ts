import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isAdmin } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Helper function to check admin status with timeout
    const checkAdminWithTimeout = async (userId: string, timeout = 5000): Promise<boolean> => {
      try {
        const adminCheck = isAdmin(userId);
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(false), timeout);
        });
        
        const result = await Promise.race([adminCheck, timeoutPromise]);
        return result as boolean;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Update session and user immediately
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status and wait for it before setting loading to false
        if (session?.user) {
          try {
            const adminStatus = await checkAdminWithTimeout(session.user.id);
            if (mounted) {
              setIsAdminUser(adminStatus);
            }
          } catch (error) {
            console.error('Error checking admin status in onAuthStateChange:', error);
            if (mounted) {
              setIsAdminUser(false);
            }
          }
        } else {
          if (mounted) {
            setIsAdminUser(false);
          }
        }
        
        // Set loading to false after admin check completes (or fails)
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const adminStatus = await checkAdminWithTimeout(session.user.id);
          if (mounted) {
            setIsAdminUser(adminStatus);
          }
        } catch (error) {
          console.error('Error checking admin status in getSession:', error);
          if (mounted) {
            setIsAdminUser(false);
          }
        }
      } else {
        if (mounted) {
          setIsAdminUser(false);
        }
      }
      
      // Always set loading to false, even if admin check fails
      if (mounted) {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      if (mounted) {
        setSession(null);
        setUser(null);
        setIsAdminUser(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    isAdminUser,
    isAuthenticated: !!session
  };
};