import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { testConnection, supabase, DatabaseService } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function DiagnosticScreen() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [testing, setTesting] = useState(false);
  const [details, setDetails] = useState('');

  const runDiagnostics = async () => {
    setTesting(true);
    setDetails('');
    
    try {
      // Test 1: Basic connection
      setDetails('Testing basic connection...\n');
      const isConnected = await testConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        setDetails(prev => prev + '✅ Basic connection successful\n');
      } else {
        setConnectionStatus('failed');
        setDetails(prev => prev + '❌ Basic connection failed\n');
        return;
      }

      // Test 2: Auth endpoint
      setDetails(prev => prev + 'Testing auth endpoint...\n');
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setDetails(prev => prev + `❌ Auth endpoint error: ${error.message}\n`);
        } else {
          setDetails(prev => prev + '✅ Auth endpoint working\n');
        }
      } catch (error) {
        setDetails(prev => prev + `❌ Auth endpoint failed: ${error.message}\n`);
      }

      // Test 3: Database query
      setDetails(prev => prev + 'Testing database query...\n');
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('count')
          .limit(1);
        
        if (error) {
          setDetails(prev => prev + `❌ Database query error: ${error.message}\n`);
        } else {
          setDetails(prev => prev + '✅ Database query successful\n');
        }
      } catch (error) {
        setDetails(prev => prev + `❌ Database query failed: ${error.message}\n`);
      }

      // Test 4: User profile
      if (user) {
        setDetails(prev => prev + 'Testing user profile...\n');
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (error) {
            setDetails(prev => prev + `❌ User profile error: ${error.message}\n`);
          } else {
            setDetails(prev => prev + '✅ User profile exists\n');
          }
        } catch (error) {
          setDetails(prev => prev + `❌ User profile failed: ${error.message}\n`);
        }
      }

    } catch (error) {
      setConnectionStatus('failed');
      setDetails(prev => prev + `❌ Diagnostic error: ${error.message}\n`);
    } finally {
      setTesting(false);
    }
  };

  const createUserProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    try {
      const userEmail = user.email || user.user_metadata?.email;
      if (!userEmail) {
        Alert.alert('Error', 'No email found for user');
        return;
      }

      Alert.alert(
        'Create Profile',
        `Create profile for user ${user.id} with email ${userEmail}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Create',
            onPress: async () => {
              try {
                const profile = await DatabaseService.createProfileForExistingUser(user.id, userEmail);
                Alert.alert('Success', 'User profile created successfully!');
                setDetails(prev => prev + `✅ Profile created for ${userEmail}\n`);
              } catch (error) {
                Alert.alert('Error', `Failed to create profile: ${error.message}`);
                setDetails(prev => prev + `❌ Profile creation failed: ${error.message}\n`);
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', `Error: ${error.message}`);
    }
  };

  const createProfileForExistingUser = async () => {
    if (!user) {
      Alert.alert('Error', 'No user logged in');
      return;
    }

    try {
      setDetails('Creating user profile...');
      
      const userEmail = user.email || user.user_metadata?.email;
      if (!userEmail) {
        setDetails('ERROR: No email available for user');
        return;
      }

      const profile = await DatabaseService.createUserProfile(user.id, userEmail);
      setDetails(`SUCCESS: User profile created with ID: ${profile.id}`);
      
      // Refresh the user profile in context
      if (refreshUserProfile) {
        await refreshUserProfile();
        setDetails('SUCCESS: User profile refreshed in app');
      }
    } catch (error) {
      setDetails(`ERROR: Failed to create profile: ${error.message}`);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return '#4CAF50';
      case 'failed': return '#f44336';
      default: return '#FF9800';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'checkmark-circle';
      case 'failed': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Connection Diagnostics</Text>
        <Text style={styles.subtitle}>Troubleshoot network issues</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={getStatusIcon()} 
            size={24} 
            color={getStatusColor()} 
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'failed' ? 'Connection Failed' : 'Unknown Status'}
          </Text>
        </View>
      </View>

      <View style={styles.userInfoCard}>
        <Text style={styles.userInfoTitle}>Current User:</Text>
        <Text style={styles.userInfoText}>
          ID: {user?.id || 'Not logged in'}{'\n'}
          Email: {user?.email || user?.user_metadata?.email || 'No email'}{'\n'}
          Profile: {userProfile ? '✅ Loaded' : '❌ Not loaded'}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.testButton, testing && styles.testButtonDisabled]}
          onPress={runDiagnostics}
          disabled={testing}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.testButtonText}>
            {testing ? 'Running Tests...' : 'Run Diagnostics'}
          </Text>
        </TouchableOpacity>

        {user && !userProfile && (
          <TouchableOpacity
            style={styles.createProfileButton}
            onPress={createUserProfile}
          >
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.createProfileText}>Create User Profile</Text>
          </TouchableOpacity>
        )}


      </View>

      {details && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Test Results:</Text>
          <Text style={styles.detailsText}>{details}</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Troubleshooting Tips:</Text>
        <Text style={styles.infoText}>
          • Check your internet connection{'\n'}
          • Verify Supabase project is active{'\n'}
          • Ensure API keys are correct{'\n'}
          • Try restarting the app{'\n'}
          • Check Supabase dashboard status{'\n'}
          • If user exists but no profile, use "Create User Profile"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#000080',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  createProfileButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createProfileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

}); 