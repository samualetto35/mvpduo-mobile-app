import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import page components
import Anasayfa from './components/Anasayfa';
import Rozetler from './components/Rozetler';
import Lig from './components/Lig';
import Profil from './components/Profil';
import AuthScreen from './components/AuthScreen';
import LoadingScreen from './components/LoadingScreen';
import DiagnosticScreen from './components/DiagnosticScreen';
import QuestionScreen from './components/QuestionScreen';
import OnboardingFlow from './components/OnboardingFlow';

// Import AuthProvider
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AnasayfaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnasayfaMain" component={Anasayfa} />
      <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { isAuthenticated, loading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkOnboardingStatus();
    }
  }, [isAuthenticated, user]);

  const checkOnboardingStatus = async () => {
    try {
      // Import supabase here to avoid circular imports
      const { supabase } = await import('./lib/supabase');
      
      // Check if user has completed onboarding
      const { data: verificationData } = await supabase
        .from('email_verification')
        .select('verified_at')
        .eq('user_id', user.id)
        .single();

      const { data: preferencesData } = await supabase
        .from('user_exam_preferences')
        .select('tyt_enabled, ayt_say_enabled, ayt_ea_enabled, ayt_soz_enabled')
        .eq('user_id', user.id)
        .single();

      const emailVerified = verificationData?.verified_at !== null;
      const hasPreferences = preferencesData && (
        preferencesData.tyt_enabled || 
        preferencesData.ayt_say_enabled || 
        preferencesData.ayt_ea_enabled || 
        preferencesData.ayt_soz_enabled
      );

      if (!emailVerified || !hasPreferences) {
        setShowOnboarding(true);
      } else {
        setOnboardingComplete(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // If there's an error, show onboarding to be safe
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingComplete(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Anasayfa') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Rozetler') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'Lig') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Diagnostic') {
              iconName = focused ? 'bug' : 'bug-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000080', // Navy blue for selected
          tabBarInactiveTintColor: '#808080', // Grey for unselected
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 90,
            paddingTop: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
          },
          tabBarBackground: () => (
            <BlurView intensity={80} style={StyleSheet.absoluteFill} />
          ),
          headerShown: false,
        })}
        screenListeners={{
          tabPress: (e) => {
            console.log('Tab press event:', e.target);
            // Add haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
          focus: (e) => {
            console.log('Tab focus event:', e.target);
          },
        }}
      >
        <Tab.Screen name="Anasayfa" component={AnasayfaStack} />
        <Tab.Screen name="Rozetler" component={Rozetler} />
        <Tab.Screen name="Lig" component={Lig} />
        <Tab.Screen name="Profil" component={Profil} />
        <Tab.Screen name="Diagnostic" component={DiagnosticScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
