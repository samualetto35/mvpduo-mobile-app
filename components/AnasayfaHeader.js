import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function AnasayfaHeader() {
  const { userProfile, loading } = useAuth();

  // Calculate daily average questions
  const dailyAverage = userProfile?.total_questions_answered > 0 
    ? (userProfile.total_questions_answered / Math.max(userProfile.streak_days, 1)).toFixed(2)
    : '0.00';

  // Get user rank based on kıdem
  const getRank = (kidem) => {
    switch (kidem) {
      case 1: return 'Çaylak';
      case 2: return 'Acemi';
      case 3: return 'Uzman';
      case 4: return 'Usta';
      default: return 'Çaylak';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.text}>
            {loading ? 'Loading...' : getRank(userProfile?.current_kidem || 1)}
          </Text>
        </View>
        
        <View style={styles.centerSection}>
          <View style={styles.streakBox}>
            <Text style={styles.text}>
              Streak {loading ? '...' : (userProfile?.streak_days || 0)} Gün
            </Text>
            <Text style={styles.emoji}>🔥</Text>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.text}>
            {loading ? '...' : dailyAverage} Ders/Gün
          </Text>
        </View>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  emoji: {
    fontSize: 14,
    marginLeft: 4,
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
  },
  dividerContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
  },
}); 