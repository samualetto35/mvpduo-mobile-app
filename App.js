import React from 'react';
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
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
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
