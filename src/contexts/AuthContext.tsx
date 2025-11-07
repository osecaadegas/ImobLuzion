import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authAPI } from '../lib/database';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email || 'no user');
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, loading profile...');
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('Token refreshed');
        // Optionally reload user profile if needed
      }
    });

    return () => {
      mounted = false;
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
      
      // If profile doesn't exist (Google OAuth first-time users), wait a moment and try again
      if (!profile && currentUser) {
        console.log('Profile not found, waiting for trigger to create it...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        profile = await authAPI.getUserProfile(userId);
        
        // If still no profile, try one more time
        if (!profile) {
          console.log('Profile still not found, trying once more...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait another 2 seconds
          profile = await authAPI.getUserProfile(userId);
        }
      }
      
      if (profile && currentUser) {
        const userData = {
          id: profile.id,
          email: currentUser.email || '',
          name: profile.name,
          role: profile.role,
          avatar: `https://via.placeholder.com/40x40/3b82f6/white?text=${profile.name.charAt(0).toUpperCase()}`
        };
        
        setUser(userData);
        console.log('User profile loaded successfully:', userData);
        setIsLoading(false);
      } else {
        console.error('Failed to load user profile after multiple attempts');
        // Set loading to false even if we can't load the profile
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