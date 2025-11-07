import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authAPI } from '../lib/database';
import { PlaceholderService } from '../lib/placeholders';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'agent';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check for existing session
    checkUser();

    // Failsafe timeout - if authentication doesn't resolve in 10 seconds, stop loading
    const timeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('Authentication timeout - stopping loading state');
        setIsLoading(false);
      }
    }, 10000);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'no user');
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, loading profile...');
        try {
          await loadUserProfile(session.user.id);
        } catch (error) {
          console.error('Error in auth state change loadUserProfile:', error);
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('Token refreshed');
        // Optionally reload user profile if needed
      } else if (event === 'INITIAL_SESSION') {
        // Make sure we're not stuck loading on initial session
        if (!session?.user) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking for existing user session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        console.log('Found existing session for:', session.user.email);
        await loadUserProfile(session.user.id);
      } else {
        console.log('No existing session found');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      let profile = await authAPI.getUserProfile(userId);
      const currentUser = await authAPI.getCurrentUser();
      
      // If profile doesn't exist (Google OAuth first-time users), try with a single retry
      if (!profile && currentUser) {
        console.log('Profile not found, waiting for trigger to create it...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        try {
          profile = await authAPI.getUserProfile(userId);
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
      if (profile && currentUser) {
        const userData: User = {
          id: profile.id,
          email: currentUser.email || '',
          name: profile.name,
          role: profile.role,
          avatar: PlaceholderService.getAvatarPlaceholder(profile.name, 40)
        };
        
        setUser(userData);
        console.log('User profile loaded successfully:', userData);
        setIsLoading(false);
      } else {
        console.error('Failed to load user profile - creating basic user data');
        // Create a basic user object with available data
        const basicUser: User = {
          id: userId,
          email: currentUser?.email || '',
          name: currentUser?.email?.split('@')[0] || 'User',
          role: 'user',
          avatar: PlaceholderService.getAvatarPlaceholder(currentUser?.email || 'U', 40)
        };
        setUser(basicUser);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const user = await authAPI.signIn(email, password);
      
      if (user) {
        await loadUserProfile(user.id);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const user = await authAPI.signUp(email, password, name);
      
      if (user) {
        // Note: User will need to verify email before they can sign in
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('Starting Google OAuth...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        setIsLoading(false);
        throw error;
      }
      
      // Don't set loading to false here - the redirect will happen
    } catch (error) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}