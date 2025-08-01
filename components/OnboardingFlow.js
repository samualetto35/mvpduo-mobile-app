import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import EmailVerificationScreen from './EmailVerificationScreen';
import ExamPreferencesScreen from './ExamPreferencesScreen';

export default function OnboardingFlow({ onComplete }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('loading');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Check email verification status
      const { data: verificationData, error: verificationError } = await supabase
        .from('email_verification')
        .select('verified_at')
        .eq('user_id', user.id)
        .single();

      if (verificationError && verificationError.code !== 'PGRST116') {
        throw verificationError;
      }

      const emailVerified = verificationData?.verified_at !== null;
      setIsEmailVerified(emailVerified);

      // Check exam preferences
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_exam_preferences')
        .select('tyt_enabled, ayt_say_enabled, ayt_ea_enabled, ayt_soz_enabled')
        .eq('user_id', user.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        throw preferencesError;
      }

      const hasPrefs = preferencesData && (
        preferencesData.tyt_enabled || 
        preferencesData.ayt_say_enabled || 
        preferencesData.ayt_ea_enabled || 
        preferencesData.ayt_soz_enabled
      );
      setHasPreferences(hasPrefs);

      // Determine current step
      if (!emailVerified) {
        setCurrentStep('email-verification');
      } else if (!hasPrefs) {
        setCurrentStep('exam-preferences');
      } else {
        setCurrentStep('complete');
        onComplete();
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to email verification if there's an error
      setCurrentStep('email-verification');
    }
  };

  const handleEmailVerificationComplete = () => {
    setIsEmailVerified(true);
    setCurrentStep('exam-preferences');
  };

  const handlePreferencesComplete = () => {
    setHasPreferences(true);
    setCurrentStep('complete');
    onComplete();
  };

  if (currentStep === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  if (currentStep === 'email-verification') {
    return (
      <EmailVerificationScreen onVerificationComplete={handleEmailVerificationComplete} />
    );
  }

  if (currentStep === 'exam-preferences') {
    return (
      <ExamPreferencesScreen onPreferencesComplete={handlePreferencesComplete} />
    );
  }

  // This should not be reached, but just in case
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 