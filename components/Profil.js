import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function Profil() {
  const { userProfile, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const getRank = (kidem) => {
    switch (kidem) {
      case 1: return 'Çaylak';
      case 2: return 'Acemi';
      case 3: return 'Uzman';
      case 4: return 'Usta';
      default: return 'Çaylak';
    }
  };

  // Show loading state if userProfile is not loaded yet
  if (loading || !userProfile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {userProfile?.username || userProfile?.email || 'User'}
          </Text>
          <Text style={styles.userEmail}>{userProfile?.email}</Text>
          <Text style={styles.userRank}>
            {getRank(userProfile?.current_kidem || 1)}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile?.current_level || 1}</Text>
          <Text style={styles.statLabel}>Current Level</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile?.current_bolum || 1}</Text>
          <Text style={styles.statLabel}>Current Bölüm</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userProfile?.streak_days || 0}</Text>
          <Text style={styles.statLabel}>Streak Days</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Progress</Text>
        
        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Total Questions Answered</Text>
          <Text style={styles.progressValue}>{userProfile?.total_questions_answered || 0}</Text>
        </View>

        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Correct Answers</Text>
          <Text style={styles.progressValue}>{userProfile?.total_correct_answers || 0}</Text>
        </View>

        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Total Points</Text>
          <Text style={styles.progressValue}>{userProfile?.total_points || 0}</Text>
        </View>

        <View style={styles.progressItem}>
          <Text style={styles.progressLabel}>Success Rate</Text>
          <Text style={styles.progressValue}>
            {userProfile?.total_questions_answered > 0 
              ? `${Math.round((userProfile.total_correct_answers / userProfile.total_questions_answered) * 100)}%`
              : '0%'
            }
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userRank: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressLabel: {
    fontSize: 16,
    color: '#333',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
  },
  signOutButton: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 