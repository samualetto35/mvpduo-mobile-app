import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, DatabaseService } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    // Check for existing session immediately
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await AuthService.getCurrentUser();
        if (session?.user) {
          console.log('Found existing session on app start');
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.log('No existing session found on app start');
      }
    };

    checkInitialSession();

    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN') {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      } else if (event === 'TOKEN_REFRESHED') {
        // Handle token refresh to maintain session
        if (session?.user) {
          console.log('Token refreshed, maintaining session');
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('Initial session found');
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      }

      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      console.log('Getting user profile for:', userId);
      const profile = await DatabaseService.getUserProfile(userId);
      setUserProfile(profile);
      console.log('User profile loaded successfully');
    } catch (error) {
      console.log('Profile loading error (handling gracefully):', error.message);

      // Try to create profile if it doesn't exist
      if (error.message?.includes('No rows returned') || error.code === 'PGRST116') {
        try {
          console.log('Attempting to create user profile...');
          const userEmail = user?.email || user?.user_metadata?.email;
          if (userEmail) {
            const newProfile = await DatabaseService.createUserProfile(userId, userEmail);
            setUserProfile(newProfile);
            console.log('User profile created and loaded successfully');
          } else {
            console.log('No email available, setting default profile');
            setUserProfile({
              id: userId,
              email: user?.email || '',
              current_kidem: 1,
              current_level: 1,
              current_bolum: 1,
              streak_days: 0,
              total_questions_answered: 0,
              total_correct_answers: 0,
              total_points: 0,
            });
          }
        } catch (createError) {
          console.log('Profile creation failed, setting default profile:', createError.message);
          // Set a default profile to prevent crashes
          setUserProfile({
            id: userId,
            email: user?.email || '',
            current_kidem: 1,
            current_level: 1,
            current_bolum: 1,
            streak_days: 0,
            total_questions_answered: 0,
            total_correct_answers: 0,
            total_points: 0,
          });
        }
      } else {
        // For other errors, set a default profile to prevent crashes
        console.log('Setting default profile due to error:', error.message);
        setUserProfile({
          id: userId,
          email: user?.email || '',
          current_kidem: 1,
          current_level: 1,
          current_bolum: 1,
          streak_days: 0,
          total_questions_answered: 0,
          total_correct_answers: 0,
          total_points: 0,
        });
      }
    }
  };

  const signUp = async (email, password, username = null) => {
    try {
      const result = await AuthService.signUp(email, password, username);
      
      // Add delay to allow session to establish
      setTimeout(async () => {
        if (result.user) {
          await loadUserProfile(result.user.id);
        }
      }, 1000);
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password);
      
      // Add delay to allow session to establish
      setTimeout(async () => {
        if (result.user) {
          try {
            await loadUserProfile(result.user.id);
          } catch (profileError) {
            console.log('Profile loading failed, but user is signed in:', profileError.message);
            // Don't throw error, just log it - user can still use the app
          }
        }
      }, 1000);
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Refreshing session for user:', user.id);
      const { data: { session } } = await AuthService.refreshSession();
      
      if (session?.user) {
        console.log('Session refreshed successfully');
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        console.log('Session refresh failed, user may need to sign in again');
      }
    } catch (error) {
      console.log('Session refresh failed:', error.message);
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Refreshing user profile...');
      const profile = await DatabaseService.getUserProfile(user.id);
      setUserProfile(profile);
      console.log('User profile refreshed successfully');
    } catch (error) {
      console.log('Error refreshing profile:', error.message);
      
      // If profile doesn't exist, try to create it
      if (error.message?.includes('No rows returned')) {
        try {
          console.log('Profile not found during refresh, creating new profile...');
          const userEmail = user?.email || user?.user_metadata?.email;
          if (userEmail) {
            const newProfile = await DatabaseService.createUserProfile(user.id, userEmail);
            setUserProfile(newProfile);
            console.log('User profile created during refresh');
          } else {
            console.log('No email available during refresh, using default profile');
            setUserProfile({
              id: user.id,
              email: user?.email || '',
              current_kidem: 1,
              current_level: 1,
              current_bolum: 1,
              streak_days: 0,
              total_questions_answered: 0,
              total_correct_answers: 0,
              total_points: 0,
            });
          }
        } catch (createError) {
          console.log('Profile creation failed during refresh:', createError.message);
          // Keep existing profile if creation fails
        }
      }
    }
  };

  const updateUserProfile = async (updates) => {
    if (!userProfile?.id) {
      console.error('No user profile ID available for update');
      return;
    }

    try {
      const updatedProfile = await DatabaseService.updateUserProfile(userProfile.id, updates);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut,
      updateUserProfile,
      refreshUserProfile,
      refreshSession,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 