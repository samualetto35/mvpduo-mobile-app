import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://yoypumkmyokxkymxwqhg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveXB1bWtteW9reGt5bXh3cWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNDE3MzMsImV4cCI6MjA2OTYxNzczM30.Ar4JFJsMGfC-zYfbiRxSPVKwHPWk-EUAuBe6LYA8i1Y';

// Create Supabase client with better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key length:', supabaseAnonKey.length);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Connection test failed:', error.message);
      return false;
    }
    
    console.log('Connection test successful');
    return true;
  } catch (error) {
    console.log('Connection test error:', error.message);
    return false;
  }
};

// Helper functions for database operations
export const DatabaseService = {
  // User Profile Operations
  async createUserProfile(userId, email) {
    try {
      console.log('Creating user profile for:', userId, 'with email:', email);
      
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        console.log('User profile already exists, returning existing profile');
        return existingProfile;
      }

      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: email,
          current_kidem: 1,
          current_level: 1,
          current_bolum: 1,
          streak_days: 0,
          total_questions_answered: 0,
          total_correct_answers: 0,
          total_points: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      console.log('User profile created successfully');
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Function to manually create profile for existing users
  async createProfileForExistingUser(userId, email) {
    try {
      console.log('Creating profile for existing user:', userId);
      return await this.createUserProfile(userId, email);
    } catch (error) {
      console.error('Error creating profile for existing user:', error);
      throw error;
    }
  },

  async getUserProfile(userId) {
    try {
      console.log('Getting user profile for:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId);

      if (error) {
        console.error('Error getting user profile:', error);
        throw error;
      }

      // Handle multiple profiles or no profiles
      if (!data || data.length === 0) {
        console.log('No user profile found, will create one');
        throw new Error('No rows returned');
      }

      // If multiple profiles exist, use the first one
      const profile = data.length > 1 ? data[0] : data[0];
      console.log('User profile loaded successfully');
      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProgress(userId, progressData) {
    try {
      console.log('Updating user progress for:', userId);
      
      // First check if progress record exists
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      const progressPayload = {
        user_id: userId,
        kidem: progressData.current_kidem,
        level: progressData.current_level,
        bolum: progressData.current_bolum,
        updated_at: new Date().toISOString(),
      };

      // If no existing progress, add created_at
      if (!existingProgress) {
        progressPayload.created_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressPayload)
        .select()
        .single();

      if (error) {
        console.error('Error updating user progress:', error);
        throw error;
      }

      console.log('User progress updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  },

  async getUserProgress(userId) {
    try {
      console.log('Getting user progress for:', userId);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error getting user progress:', error);
        throw error;
      }

      console.log('User progress loaded successfully');
      return data;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  },

  async getQuestions(examType = null, division = null, kidem = null, level = null, bolum = null) {
    try {
      console.log('Getting questions with filters:', { examType, division, kidem, level, bolum });
      
      let query = supabase
        .from('questions')
        .select('*')
        .eq('status', 'approved');

      if (examType) query = query.eq('exam_type', examType);
      if (division) query = query.eq('division', division);
      if (kidem) query = query.eq('kidem', kidem);
      if (level) query = query.eq('level', level);
      if (bolum) query = query.eq('bolum', bolum);

      const { data, error } = await query;

      if (error) {
        console.error('Error getting questions:', error);
        throw error;
      }

      console.log(`Found ${data.length} questions`);
      return data;
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  },

  async recordQuestionAttempt(userId, questionId, isCorrect, timeSpent = null, userProfile = null) {
    try {
      console.log('Recording question attempt for user:', userId, 'question:', questionId);

      // Ensure we have the required user profile data
      const kidem = userProfile?.current_kidem || 1;
      const level = userProfile?.current_level || 1;
      const bolum = userProfile?.current_bolum || 1;

      const { data, error } = await supabase
        .from('user_question_attempts')
        .insert({
          user_id: userId,
          question_id: questionId,
          is_correct: isCorrect,
          time_spent: timeSpent,
          attempted_at: new Date().toISOString(),
          kidem: kidem,
          level: level,
          bolum: bolum,
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording question attempt:', error);
        console.log('Question attempt recording failed, but continuing...');
        return null; // Don't throw error, just log it for now
      }

      console.log('Question attempt recorded successfully');
      return data;
    } catch (error) {
      console.error('Error recording question attempt:', error);
      console.log('Question attempt recording failed, but continuing...');
      return null; // Don't throw error, just log it for now
    }
  },

  async createUserSession(userId, sessionData) {
    try {
      console.log('Creating user session for:', userId);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          ...sessionData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user session:', error);
        throw error;
      }

      console.log('User session created successfully');
      return data;
    } catch (error) {
      console.error('Error creating user session:', error);
      throw error;
    }
  },

  async updateUserSession(sessionId, updates) {
    try {
      console.log('Updating user session:', sessionId);
      
      const { data, error } = await supabase
        .from('user_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user session:', error);
        throw error;
      }

      console.log('User session updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating user session:', error);
      throw error;
    }
  },

  async updateUserStatistics(userId, statistics) {
    try {
      console.log('Updating user statistics for:', userId);
      
      // For now, skip statistics update since the table schema is unclear
      console.log('Skipping user statistics update - table schema needs verification');
      return null;
    } catch (error) {
      console.error('Error updating user statistics:', error);
      throw error;
    }
  },

  async createUserAchievement(userId, achievementData) {
    try {
      console.log('Creating user achievement for:', userId);
      
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_type: achievementData.achievement_type,
          achievement_name: achievementData.achievement_name,
          points_earned: achievementData.points_earned,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user achievement:', error);
        throw error;
      }

      console.log('User achievement created successfully');
      return data;
    } catch (error) {
      console.error('Error creating user achievement:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      console.log('Updating user profile for:', userId);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      console.log('User profile updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Authentication helpers
export const AuthService = {
  async signUp(email, password, username = null) {
    try {
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        console.error('Sign up error from Supabase:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created, creating profile...');
        await DatabaseService.createUserProfile(data.user.id, email, username);
      }

      console.log('Sign up successful:', data.user?.id);
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signIn(email, password) {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error from Supabase:', error);
        throw error;
      }

      console.log('Sign in successful:', data.user?.id);
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      console.log('Attempting sign out');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error from Supabase:', error);
        throw error;
      }

      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      console.log('Getting current user');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get current user error from Supabase:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('Current user found:', data.session.user.id);
        return { data: { session: data.session } };
      } else {
        console.log('No existing session found');
        return { data: { session: null } };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      console.log('Refreshing session');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      if (data.session) {
        console.log('Session refreshed successfully');
        return { data: { session: data.session } };
      } else {
        console.log('No session to refresh');
        return { data: { session: null } };
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  },

  onAuthStateChange(callback) {
    console.log('Setting up auth state change listener');
    return supabase.auth.onAuthStateChange(callback);
  },
}; 